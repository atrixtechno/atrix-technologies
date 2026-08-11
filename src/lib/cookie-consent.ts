export const COOKIE_CONSENT_KEY = "atrix_cookie_consent";
export const COOKIE_CONSENT_COOKIE = "atrix_cookie_consent";

export type CookieConsentValue = "accepted" | "rejected";

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (ls === "accepted" || ls === "rejected") return ls;
  } catch {
    /* ignore */
  }
  try {
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_CONSENT_COOKIE}=`));
    const raw = match?.split("=")[1];
    if (raw === "accepted" || raw === "rejected") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeCookieConsent(value: CookieConsentValue): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_CONSENT_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent() === "accepted";
}
