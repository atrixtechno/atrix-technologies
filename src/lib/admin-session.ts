/** Header the admin UI may send alongside the cookie (optional). */
export const ADMIN_SESSION_HEADER = "x-atrix-admin-session";

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
  return headers;
}

/** Fetch admin APIs with the httpOnly session cookie. */
export function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: "include",
    headers: adminFetchHeaders(init?.headers),
  });
}
