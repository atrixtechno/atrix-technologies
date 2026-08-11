import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  DEFAULT_PASSWORD,
  PENDING_COOKIE,
  clearCookieOptions,
  createSessionToken,
  getCredentials,
  hashPassword,
  setCredentials,
  sessionCookieOptions,
  verifySessionToken,
  SESSION_TTL_SECONDS,
} from "@/lib/admin-server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      newPassword?: string;
      confirmPassword?: string;
    };
    const newPassword = body.newPassword ?? "";
    const confirmPassword = body.confirmPassword ?? newPassword;

    const jar = await cookies();
    const pending = verifySessionToken(jar.get(PENDING_COOKIE)?.value, "pending");
    const session = verifySessionToken(jar.get(AUTH_COOKIE)?.value, "session");

    if (!pending && !session) {
      return NextResponse.json(
        { error: "Sesión no válida. Vuelve a iniciar sesión." },
        { status: 401 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 8 caracteres." },
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

    const creds = await getCredentials();
    const nextHash = hashPassword(newPassword);
    if (passwordsEqual(nextHash, creds.passwordHash)) {
      return NextResponse.json(
        { error: "Elige una contraseña distinta a la actual." },
        { status: 400 },
      );
    }

    await setCredentials(nextHash, true);

    const token = createSessionToken("session", SESSION_TTL_SECONDS);
    const res = NextResponse.json({
      ok: true,
      expiresIn: SESSION_TTL_SECONDS,
    });
    res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions(SESSION_TTL_SECONDS));
    res.cookies.set(PENDING_COOKIE, "", clearCookieOptions());
    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function passwordsEqual(a: string, b: string): boolean {
  return a === b;
}
