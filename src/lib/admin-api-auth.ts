import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/analytics";
import { ADMIN_SESSION_HEADER } from "@/lib/admin-session";

/**
 * Admin gate for API routes.
 * Accepts cookie `atrix_admin_session` or header `x-atrix-admin-session`
 * with value starting with `ok:` (set on login in the browser).
 */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie?.startsWith("ok:")) return true;

  const header = request.headers.get(ADMIN_SESSION_HEADER);
  if (header?.startsWith("ok:")) return true;

  return false;
}

export { ADMIN_SESSION_HEADER } from "@/lib/admin-session";
