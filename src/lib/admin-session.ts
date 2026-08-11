/** Header the admin UI sends alongside the cookie (same token as localStorage). */
export const ADMIN_SESSION_HEADER = "x-atrix-admin-session";

/** Client helper: session token from localStorage for fetch headers. */
export function getClientAdminSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("atrix_admin_session");
  return raw?.startsWith("ok:") ? raw : null;
}

export function adminFetchHeaders(
  extra?: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (extra) {
    const init = new Headers(extra);
    init.forEach((value, key) => {
      headers[key] = value;
    });
  }
  const token = getClientAdminSessionToken();
  if (token) headers[ADMIN_SESSION_HEADER] = token;
  return headers;
}
