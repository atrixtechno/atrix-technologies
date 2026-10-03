/** Fetch admin APIs with the httpOnly session cookie. */
export function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
}
