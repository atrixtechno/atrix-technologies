import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  DEFAULT_PASSWORD,
  MAX_PASSWORD_LENGTH,
  PENDING_COOKIE,
  clearCookieOptions,
  createSessionToken,
  getCredentials,
  hashPassword,
  passwordsMatch,
  setCredentials,
  sessionCookieOptions,
  verifySessionToken,
  SESSION_TTL_SECONDS,
} from "@/lib/admin-server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_PASSWORD_LENGTH = 10;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      newPassword?: unknown;
      confirmPassword?: unknown;
      currentPassword?: unknown;
    };
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";

    const jar = await cookies();
    const pending = await verifySessionToken(jar.get(PENDING_COOKIE)?.value, "pending");
    const session = pending
      ? null
      : await verifySessionToken(jar.get(AUTH_COOKIE)?.value, "session");

    if (!pending && !session) {
      return NextResponse.json(
        { error: "Sesión no válida. Vuelve a iniciar sesión." },
        { status: 401 },
      );
    }

    const creds = await getCredentials();

    // Con sesión normal (no el cambio forzado tras el login) se exige la contraseña actual.
    if (session && !passwordsMatch(currentPassword, creds.passwordHash)) {
      return NextResponse.json(
        { error: "La contraseña actual no es correcta." },
        { status: 403 },
      );
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        },
        { status: 400 },
      );
    }
    if (newPassword.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: "La contraseña es demasiado larga." },
        { status: 400 },
      );
    }
    if (newPassword === DEFAULT_PASSWORD) {
      return NextResponse.json(
        { error: "Elige una contraseña distinta a la inicial." },
        { status: 400 },
      );
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden." },
        { status: 400 },
      );
    }
    if (passwordsMatch(newPassword, creds.passwordHash)) {
      return NextResponse.json(
        { error: "Elige una contraseña distinta a la actual." },
        { status: 400 },
      );
    }

    const nextHash = hashPassword(newPassword);
    await setCredentials(nextHash, true);

    // El hash nuevo cambia la huella `pv`: todas las sesiones anteriores quedan inválidas.
    const token = createSessionToken("session", SESSION_TTL_SECONDS, nextHash);
    const res = NextResponse.json({
      ok: true,
      expiresIn: SESSION_TTL_SECONDS,
    });
    res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions(SESSION_TTL_SECONDS));
    res.cookies.set(PENDING_COOKIE, "", clearCookieOptions());
    return res;
  } catch (err) {
    console.error("admin change-password", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
