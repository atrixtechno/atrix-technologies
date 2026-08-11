import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/analytics";
import { ADMIN_SESSION_HEADER } from "@/lib/admin-session";
import { verifySessionToken } from "@/lib/admin-server-auth";

/**
 * Admin gate for API routes.
 * Accepts signed httpOnly cookie `atrix_admin_session` (preferred)
 * or header `x-atrix-admin-session` with the same signed token value.
 * Tokens expire after 8 hours (see ADMIN_SESSION_SECRET).
 */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (verifySessionToken(cookie, "session")) return true;

  const header = request.headers.get(ADMIN_SESSION_HEADER);
  if (verifySessionToken(header, "session")) return true;

  return false;
}

export { ADMIN_SESSION_HEADER } from "@/lib/admin-session";
