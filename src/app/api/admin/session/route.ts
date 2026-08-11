import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  PENDING_COOKIE,
  SESSION_TTL_SECONDS,
  verifySessionToken,
} from "@/lib/admin-server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(AUTH_COOKIE)?.value, "session");
  if (session) {
    return NextResponse.json({
      ok: true,
      authenticated: true,
      mustChangePassword: false,
      iat: session.iat,
      exp: session.exp,
      expiresIn: Math.max(0, session.exp - Math.floor(Date.now() / 1000)),
      maxAge: SESSION_TTL_SECONDS,
    });
  }

  const pending = verifySessionToken(jar.get(PENDING_COOKIE)?.value, "pending");
  if (pending) {
    return NextResponse.json({
      ok: true,
      authenticated: false,
      mustChangePassword: true,
      exp: pending.exp,
    });
  }

  return NextResponse.json(
    { ok: false, authenticated: false, error: "Sesión expirada" },
    { status: 401 },
  );
}
