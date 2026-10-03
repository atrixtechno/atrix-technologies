import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase";
import { ADMIN_SESSION_COOKIE } from "@/lib/analytics";

export const ADMIN_USERNAME = "admin";
/** Contraseña inicial heredada: nunca se acepta como contraseña nueva. */
export const DEFAULT_PASSWORD = "12345678";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours
export const PENDING_TTL_SECONDS = 15 * 60; // 15 minutes for forced password change
/** Intentos fallidos por IP + usuario antes de bloquear. */
export const MAX_LOGIN_FAILS = 5;
/** Intentos fallidos del usuario sumando todas las IPs antes de bloquear. */
export const MAX_GLOBAL_LOGIN_FAILS = 20;
export const GLOBAL_ATTEMPT_IP = "*";
export const LOCKOUT_MINUTES = 15;
export const MAX_PASSWORD_LENGTH = 256;

export const AUTH_COOKIE = ADMIN_SESSION_COOKIE;
export const PENDING_COOKIE = "atrix_admin_pending";

const DEFAULT_PASSWORD_HASH =
  "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

type SessionKind = "session" | "pending";

type TokenPayload = {
  kind: SessionKind;
  u: string;
  iat: number;
  exp: number;
  jti: string;
  /** Huella de la contraseña vigente: cambiarla invalida las sesiones previas. */
  pv: string;
};

export class AdminAuthConfigError extends Error {}

function resolveSessionSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) return explicit;
  const project = process.env.PROJECT_SECRETS_KEY?.trim();
  if (project) return `atrix-admin-session:${project}`;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (service) return `atrix-admin-session:${service}`;
  if (IS_PRODUCTION) {
    // Fail closed: sin secreto, cualquiera podría firmar una sesión válida.
    throw new AdminAuthConfigError(
      "Falta ADMIN_SESSION_SECRET (o PROJECT_SECRETS_KEY / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return "atrix-dev-admin-session-secret";
}

// ---------------------------------------------------------------------------
// Password hashing — scrypt con sal aleatoria. Formato:
//   scrypt$<N>$<r>$<p>$<salt b64url>$<hash b64url>
// Los hashes SHA-256 heredados (64 hex) se aceptan y se migran al iniciar sesión.
// ---------------------------------------------------------------------------

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const LEGACY_SHA256 = /^[0-9a-f]{64}$/i;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, b64url(salt), b64url(hash)].join(
    "$",
  );
}

export function passwordsMatch(input: string, storedHash: string): boolean {
  if (!input || !storedHash || input.length > MAX_PASSWORD_LENGTH) return false;
  try {
    if (storedHash.startsWith("scrypt$")) {
      const [, n, r, p, saltRaw, hashRaw] = storedHash.split("$");
      const expected = fromB64url(hashRaw ?? "");
      if (expected.length === 0) return false;
      const actual = scryptSync(input, fromB64url(saltRaw ?? ""), expected.length, {
        N: Number(n),
        r: Number(r),
        p: Number(p),
      });
      return timingSafeEqual(actual, expected);
    }
    if (LEGACY_SHA256.test(storedHash)) {
      const actual = createHash("sha256").update(input, "utf8").digest();
      return timingSafeEqual(actual, Buffer.from(storedHash, "hex"));
    }
  } catch {
    /* hash malformado */
  }
  return false;
}

/** true si el hash guardado usa el formato heredado y debe migrarse a scrypt. */
export function needsRehash(storedHash: string): boolean {
  return !storedHash.startsWith("scrypt$");
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/@.*$/, "");
}

export function isValidAdminUser(value: string): boolean {
  return normalizeUsername(value) === ADMIN_USERNAME;
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(value: string): Buffer {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

function passwordFingerprint(passwordHash: string): string {
  return b64url(
    createHmac("sha256", resolveSessionSecret())
      .update(`pv:${passwordHash}`)
      .digest()
      .subarray(0, 12),
  );
}

function signPayload(payload: TokenPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", resolveSessionSecret()).update(body).digest();
  return `v2.${body}.${b64url(sig)}`;
}

export function createSessionToken(
  kind: SessionKind,
  ttlSeconds: number,
  passwordHash: string,
): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    kind,
    u: ADMIN_USERNAME,
    iat: now,
    exp: now + ttlSeconds,
    jti: randomBytes(8).toString("hex"),
    pv: passwordFingerprint(passwordHash),
  });
}

/** Valida firma, tipo y expiración (sin consultar la contraseña vigente). */
function verifyTokenSignature(
  token: string | undefined | null,
  expectedKind: SessionKind,
): TokenPayload | null {
  if (!token || !token.startsWith("v2.")) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [, body, sig] = parts;
  if (!body || !sig) return null;

  try {
    const expectedSig = createHmac("sha256", resolveSessionSecret())
      .update(body)
      .digest();
    const provided = fromB64url(sig);
    if (
      provided.length !== expectedSig.length ||
      !timingSafeEqual(provided, expectedSig)
    ) {
      return null;
    }

    const payload = JSON.parse(fromB64url(body).toString("utf8")) as TokenPayload;
    if (payload.kind !== expectedKind) return null;
    if (payload.u !== ADMIN_USERNAME) return null;
    if (typeof payload.pv !== "string") return null;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Verifica una sesión admin completa: firma, expiración y que la contraseña
 * no haya cambiado desde que se emitió (cambiarla cierra todas las sesiones).
 */
export async function verifySessionToken(
  token: string | undefined | null,
  expectedKind: SessionKind = "session",
): Promise<TokenPayload | null> {
  const payload = verifyTokenSignature(token, expectedKind);
  if (!payload) return null;
  try {
    const creds = await getCredentials();
    const current = Buffer.from(passwordFingerprint(creds.passwordHash));
    const provided = Buffer.from(payload.pv);
    if (current.length !== provided.length || !timingSafeEqual(current, provided)) {
      return null;
    }
  } catch {
    return null;
  }
  return payload;
}

export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function clearCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export function clientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "unknown";
}

export type CredentialState = {
  passwordHash: string;
  passwordChanged: boolean;
  source: "supabase" | "env" | "default";
};

/** In-memory fallback when Supabase is unavailable (per instance). */
const memoryCreds: { passwordHash: string; passwordChanged: boolean } = {
  passwordHash:
    process.env.ADMIN_PASSWORD_HASH?.trim() || DEFAULT_PASSWORD_HASH,
  passwordChanged: process.env.ADMIN_PASSWORD_CHANGED === "true",
};

const memoryAttempts = new Map<
  string,
  { failCount: number; lockedUntil: number | null }
>();

function attemptKey(ip: string, username: string): string {
  return `${ip}|${normalizeUsername(username)}`;
}

const SETTINGS_CRED_KEY = "admin_credentials";
const SETTINGS_ATTEMPTS_KEY = "admin_login_attempts";

function tableMissing(message: string | undefined): boolean {
  return /relation .* does not exist|Could not find the table|PGRST205/i.test(
    message || "",
  );
}

export async function getCredentials(): Promise<CredentialState> {
  if (isSupabaseAdminConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("admin_credentials")
        .select("password_hash, password_changed")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data?.password_hash) {
        return {
          passwordHash: data.password_hash as string,
          passwordChanged: Boolean(data.password_changed),
          source: "supabase",
        };
      }

      // Fallback: site_settings JSON until migration is applied.
      if (error && tableMissing(error.message)) {
        const { data: row } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", SETTINGS_CRED_KEY)
          .maybeSingle();
        const value = row?.value as
          | { password_hash?: string; password_changed?: boolean }
          | null;
        if (value?.password_hash) {
          return {
            passwordHash: value.password_hash,
            passwordChanged: Boolean(value.password_changed),
            source: "supabase",
          };
        }
      }
    } catch {
      /* fall through */
    }
  }

  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (envHash) {
    return {
      passwordHash: envHash,
      passwordChanged: process.env.ADMIN_PASSWORD_CHANGED === "true",
      source: "env",
    };
  }

  return {
    passwordHash: memoryCreds.passwordHash,
    passwordChanged: memoryCreds.passwordChanged,
    source: "default",
  };
}

export async function setCredentials(
  passwordHash: string,
  passwordChanged: boolean,
): Promise<void> {
  memoryCreds.passwordHash = passwordHash;
  memoryCreds.passwordChanged = passwordChanged;

  if (!isSupabaseAdminConfigured()) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("admin_credentials").upsert(
    {
      id: 1,
      password_hash: passwordHash,
      password_changed: passwordChanged,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (!error) return;

  if (!tableMissing(error.message)) {
    throw new Error(error.message);
  }

  const { error: settingsError } = await supabase.from("site_settings").upsert(
    {
      key: SETTINGS_CRED_KEY,
      value: {
        password_hash: passwordHash,
        password_changed: passwordChanged,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (settingsError) {
    throw new Error(settingsError.message);
  }
}
export type LockoutState = {
  locked: boolean;
  failCount: number;
  lockedUntil: Date | null;
  minutesLeft: number;
};

type AttemptsMap = Record<
  string,
  { fail_count: number; locked_until: string | null }
>;

async function readAttemptsMap(): Promise<{
  map: AttemptsMap;
  via: "table" | "settings" | "memory";
}> {
  if (!isSupabaseAdminConfigured()) {
    return { map: {}, via: "memory" };
  }
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admin_login_attempts")
      .select("ip, username, fail_count, locked_until");
    if (!error && data) {
      const map: AttemptsMap = {};
      for (const row of data) {
        map[attemptKey(row.ip as string, row.username as string)] = {
          fail_count: Number(row.fail_count) || 0,
          locked_until: (row.locked_until as string) || null,
        };
      }
      return { map, via: "table" };
    }
    if (error && tableMissing(error.message)) {
      const { data: row } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", SETTINGS_ATTEMPTS_KEY)
        .maybeSingle();
      const value = (row?.value as AttemptsMap | null) || {};
      return { map: value, via: "settings" };
    }
  } catch {
    /* fall through */
  }
  return { map: {}, via: "memory" };
}

async function writeAttemptsMap(
  via: "table" | "settings" | "memory",
  ip: string,
  username: string,
  failCount: number,
  lockedUntil: Date | null,
  map?: AttemptsMap,
): Promise<void> {
  const user = normalizeUsername(username);
  if (!isSupabaseAdminConfigured()) return;
  const supabase = getSupabaseAdmin();

  if (via === "table") {
    await supabase.from("admin_login_attempts").upsert(
      {
        ip,
        username: user,
        fail_count: failCount,
        locked_until: lockedUntil?.toISOString() ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "ip,username" },
    );
    return;
  }

  if (via === "settings" && map) {
    await supabase.from("site_settings").upsert(
      {
        key: SETTINGS_ATTEMPTS_KEY,
        value: map,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
  }
}

export async function getLockoutState(
  ip: string,
  username: string,
): Promise<LockoutState> {
  const now = Date.now();
  const key = attemptKey(ip, username);
  const { map } = await readAttemptsMap();
  const remote = map[key];
  const entry = remote
    ? {
        failCount: remote.fail_count,
        lockedUntil: remote.locked_until
          ? new Date(remote.locked_until).getTime()
          : null,
      }
    : memoryAttempts.get(key);

  if (!entry) {
    return { locked: false, failCount: 0, lockedUntil: null, minutesLeft: 0 };
  }
  const locked = Boolean(entry.lockedUntil && entry.lockedUntil > now);
  const minutesLeft = locked
    ? Math.max(1, Math.ceil((entry.lockedUntil! - now) / 60_000))
    : 0;
  return {
    locked,
    failCount: entry.failCount,
    lockedUntil: entry.lockedUntil ? new Date(entry.lockedUntil) : null,
    minutesLeft,
  };
}

export async function recordFailedLogin(
  ip: string,
  username: string,
  maxFails = MAX_LOGIN_FAILS,
): Promise<LockoutState> {
  const key = attemptKey(ip, username);
  const prev = await getLockoutState(ip, username);
  let failCount = prev.failCount + 1;
  let lockedUntil: Date | null = null;

  // If previous lock expired, restart the counter.
  if (prev.lockedUntil && prev.lockedUntil.getTime() <= Date.now()) {
    failCount = 1;
  }

  if (failCount >= maxFails) {
    lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60_000);
  }

  memoryAttempts.set(key, {
    failCount,
    lockedUntil: lockedUntil?.getTime() ?? null,
  });

  const { map, via } = await readAttemptsMap();
  if (via === "settings") {
    map[key] = {
      fail_count: failCount,
      locked_until: lockedUntil?.toISOString() ?? null,
    };
  }
  try {
    await writeAttemptsMap(via, ip, username, failCount, lockedUntil, map);
  } catch {
    /* memory already updated */
  }

  const minutesLeft = lockedUntil
    ? Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60_000))
    : 0;

  return {
    locked: Boolean(lockedUntil),
    failCount,
    lockedUntil,
    minutesLeft,
  };
}

export async function clearLoginAttempts(
  ip: string,
  username: string,
): Promise<void> {
  const key = attemptKey(ip, username);
  memoryAttempts.delete(key);

  if (!isSupabaseAdminConfigured()) return;
  try {
    const { map, via } = await readAttemptsMap();
    if (via === "table") {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("admin_login_attempts")
        .delete()
        .eq("ip", ip)
        .eq("username", normalizeUsername(username));
      return;
    }
    if (via === "settings") {
      delete map[key];
      await writeAttemptsMap(via, ip, username, 0, null, map);
    }
  } catch {
    /* ignore */
  }
}
export function lockoutMessage(minutesLeft: number): string {
  const mins = Math.max(1, minutesLeft || LOCKOUT_MINUTES);
  return `Demasiados intentos. Espera ${mins} minutos.`;
}
