import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_USERNAME, AUTH_COOKIE, verifySessionToken } from "@/lib/admin-server-auth";

/**
 * Admin de la sesión actual (cookie httpOnly firmada `atrix_admin_session`), o null.
 * Para páginas, rutas y acciones del servidor del panel.
 */
export async function currentAdmin(): Promise<{ username: string } | null> {
  const jar = await cookies();
  const session = await verifySessionToken(jar.get(AUTH_COOKIE)?.value, "session");
  return session ? { username: ADMIN_USERNAME } : null;
}

/**
 * Úsala al inicio de CADA acción del servidor y página de admin: las acciones del servidor se
 * pueden llamar con un POST directo, no solo desde el panel. Sin sesión válida manda al login.
 */
export async function requireAdmin(): Promise<{ username: string }> {
  const admin = await currentAdmin();
  if (!admin) redirect("/login");
  return admin;
}
