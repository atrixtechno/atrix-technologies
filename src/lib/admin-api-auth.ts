import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/analytics";
import { verifySessionToken } from "@/lib/admin-server-auth";

/**
 * Admin gate for API routes.
 * Solo acepta la cookie httpOnly firmada `atrix_admin_session`: expira a las 8 h
 * y deja de ser válida en cuanto cambia la contraseña.
 */
export async function isAdminRequest(request: Request): Promise<boolean> {
  void request;
  const jar = await cookies();
  return Boolean(await verifySessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value, "session"));
}
