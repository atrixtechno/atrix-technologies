import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  PENDING_COOKIE,
  clearCookieOptions,
  clearLoginAttempts,
  clientIp,
  createSessionToken,
  getCredentials,
  getLockoutState,
  isValidAdminUser,
  lockoutMessage,
  passwordsMatch,
  recordFailedLogin,
  sessionCookieOptions,
  PENDING_TTL_SECONDS,
  SESSION_TTL_SECONDS,
} from "@/lib/admin-server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      usuario?: string;
      password?: string;
    };
    const usuario = body.usuario ?? "";
    const password = body.password ?? "";
    const ip = clientIp(request);

    const lock = await getLockoutState(ip, usuario || "admin");
    if (lock.locked) {
      return NextResponse.json(
        { error: lockoutMessage(lock.minutesLeft), locked: true },
        { status: 429 },
      );
    }

    if (!isValidAdminUser(usuario) || !password) {
      const next = await recordFailedLogin(ip, usuario || "admin");
      if (next.locked) {
        return NextResponse.json(
          { error: lockoutMessage(next.minutesLeft), locked: true },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos." },
        { status: 401 },
      );
    }

    const creds = await getCredentials();
    if (!passwordsMatch(password, creds.passwordHash)) {
      const next = await recordFailedLogin(ip, usuario);
      if (next.locked) {
        return NextResponse.json(
          { error: lockoutMessage(next.minutesLeft), locked: true },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos." },
        { status: 401 },
      );
    }

    await clearLoginAttempts(ip, usuario);

    if (!creds.passwordChanged) {
      const pending = createSessionToken("pending", PENDING_TTL_SECONDS);
      const res = NextResponse.json({
        ok: true,
        mustChangePassword: true,
      });
      res.cookies.set(PENDING_COOKIE, pending, sessionCookieOptions(PENDING_TTL_SECONDS));
      res.cookies.set(AUTH_COOKIE, "", clearCookieOptions());
      return res;
    }

    const token = createSessionToken("session", SESSION_TTL_SECONDS);
    const res = NextResponse.json({
      ok: true,
      mustChangePassword: false,
      expiresIn: SESSION_TTL_SECONDS,
    });
    res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions(SESSION_TTL_SECONDS));
    res.cookies.set(PENDING_COOKIE, "", clearCookieOptions());
    return res;
  } catch {
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 },
    );
  }
}
