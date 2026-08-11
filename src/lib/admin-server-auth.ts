import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase";
import { ADMIN_SESSION_COOKIE } from "@/lib/analytics";

export const ADMIN_USERNAME = "admin";
export const DEFAULT_PASSWORD = "12345678";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours
export const PENDING_TTL_SECONDS = 15 * 60; // 15 minutes for forced password change
export const MAX_LOGIN_FAILS = 5;
export const LOCKOUT_MINUTES = 15;

export const AUTH_COOKIE = ADMIN_SESSION_COOKIE;
export const PENDING_COOKIE = "atrix_admin_pending";

const DEFAULT_PASSWORD_HASH =
  "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f";

type SessionKind = "session" | "pending";

type TokenPayload = {
  kind: SessionKind;
  u: string;
  iat: number;
  exp: number;
  jti: string;
};

function resolveSessionSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) return explicit;
  const project = process.env.PROJECT_SECRETS_KEY?.trim();
  if (project) return `atrix-admin-session:${project}`;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (service) return `atrix-admin-session:${service}`;
  // Dev-only fallback so local builds work; production must set a secret.
  return "atrix-dev-admin-session-secret";
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password, "utf8").digest("hex");
}

export function passwordsMatch(input: string, expectedHash: string): boolean {
  const inputHash = hashPassword(input);
  try {
    const a = Buffer.from(inputHash, "utf8");
    const b = Buffer.from(expectedHash, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
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

function signPayload(payload: TokenPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", resolveSessionSecret())
    .update(body)
    .digest();
  return `v1.${body}.${b64url(sig)}`;
}

export function createSessionToken(
  kind: SessionKind = "session",
  ttlSeconds = SESSION_TTL_SECONDS,
): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    kind,
    u: ADMIN_USERNAME,
    iat: now,
    exp: now + ttlSeconds,
    jti: randomBytes(8).toString("hex"),
  });
}

export function verifySessionToken(
  token: string | undefined | null,
  expectedKind: SessionKind = "session",
): TokenPayload | null {
  if (!token || !token.startsWith("v1.")) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [, body, sig] = parts;
  if (!body || !sig) return null;

  const expectedSig = createHmac("sha256", resolveSessionSecret())
    .update(body)
    .digest();
  let provided: Buffer;
  try {
    provided = fromB64url(sig);
  } catch {
    return null;
  }
  if (
    provided.length !== expectedSig.length ||
    !timingSafeEqual(provided, expectedSig)
  ) {
    return null;
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8")) as TokenPayload;
  } catch {
    return null;
  }

  if (payload.kind !== expectedKind) return null;
  if (payload.u !== ADMIN_USERNAME) return null;
  if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
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
): Promise<LockoutState> {
  const key = attemptKey(ip, username);
  const prev = await getLockoutState(ip, username);
  let failCount = prev.failCount + 1;
  let lockedUntil: Date | null = null;

  // If previous lock expired, restart the counter.
  if (prev.lockedUntil && prev.lockedUntil.getTime() <= Date.now()) {
    failCount = 1;
  }

  if (failCount >= MAX_LOGIN_FAILS) {
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
