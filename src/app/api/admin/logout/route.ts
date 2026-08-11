import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  PENDING_COOKIE,
  clearCookieOptions,
} from "@/lib/admin-server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", clearCookieOptions());
  res.cookies.set(PENDING_COOKIE, "", clearCookieOptions());
  return res;
}
