import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  GLOBAL_ATTEMPT_IP,
  MAX_GLOBAL_LOGIN_FAILS,
  MAX_PASSWORD_LENGTH,
  PENDING_COOKIE,
  clearCookieOptions,
  clearLoginAttempts,
  clientIp,
  createSessionToken,
  getCredentials,
  getLockoutState,
  hashPassword,
  isValidAdminUser,
  lockoutMessage,
  needsRehash,
  passwordsMatch,
  recordFailedLogin,
  sessionCookieOptions,
  setCredentials,
  PENDING_TTL_SECONDS,
  SESSION_TTL_SECONDS,
} from "@/lib/admin-server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INVALID = "Usuario o contraseña incorrectos.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      usuario?: unknown;
      password?: unknown;
    };
    const usuario = typeof body.usuario === "string" ? body.usuario.slice(0, 120) : "";
    const password =
      typeof body.password === "string" ? body.password.slice(0, MAX_PASSWORD_LENGTH + 1) : "";
    const ip = clientIp(request);
    const user = usuario || "admin";

    // Bloqueo por IP y bloqueo global del usuario (ataques distribuidos).
    const [lock, globalLock] = await Promise.all([
      getLockoutState(ip, user),
      getLockoutState(GLOBAL_ATTEMPT_IP, user),
    ]);
    if (lock.locked || globalLock.locked) {
      return NextResponse.json(
        {
          error: lockoutMessage(Math.max(lock.minutesLeft, globalLock.minutesLeft)),
          locked: true,
        },
        { status: 429 },
      );
    }

    const creds = await getCredentials();

    // Sin almacén de credenciales en producción no se permite la contraseña por defecto.
    if (creds.source === "default" && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Acceso admin no disponible. Revisa la configuración del servidor." },
        { status: 503 },
      );
    }

    const ok = isValidAdminUser(usuario) && passwordsMatch(password, creds.passwordHash);
    if (!ok) {
      const [next, nextGlobal] = await Promise.all([
        recordFailedLogin(ip, user),
        recordFailedLogin(GLOBAL_ATTEMPT_IP, user, MAX_GLOBAL_LOGIN_FAILS),
      ]);
      if (next.locked || nextGlobal.locked) {
        return NextResponse.json(
          {
            error: lockoutMessage(Math.max(next.minutesLeft, nextGlobal.minutesLeft)),
            locked: true,
          },
          { status: 429 },
        );
      }
      return NextResponse.json({ error: INVALID }, { status: 401 });
    }

    await clearLoginAttempts(ip, usuario);

    // Migra hashes SHA-256 heredados a scrypt de forma transparente.
    let passwordHash = creds.passwordHash;
    if (needsRehash(passwordHash)) {
      const upgraded = hashPassword(password);
      try {
        await setCredentials(upgraded, creds.passwordChanged);
        passwordHash = upgraded;
      } catch {
        /* se reintenta en el próximo login */
      }
    }

    if (!creds.passwordChanged) {
      const pending = createSessionToken("pending", PENDING_TTL_SECONDS, passwordHash);
      const res = NextResponse.json({ ok: true, mustChangePassword: true });
      res.cookies.set(PENDING_COOKIE, pending, sessionCookieOptions(PENDING_TTL_SECONDS));
      res.cookies.set(AUTH_COOKIE, "", clearCookieOptions());
      return res;
    }

    const token = createSessionToken("session", SESSION_TTL_SECONDS, passwordHash);
    const res = NextResponse.json({
      ok: true,
      mustChangePassword: false,
      expiresIn: SESSION_TTL_SECONDS,
    });
    res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions(SESSION_TTL_SECONDS));
    res.cookies.set(PENDING_COOKIE, "", clearCookieOptions());
    return res;
  } catch (err) {
    console.error("admin login", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
