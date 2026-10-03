/** Client-side admin UI helpers (non-secret flags only). Session auth is the httpOnly cookie. */

export const ADMIN_USERNAME = "admin";

const AUTH_KEYS = {
  /** Non-secret UI flag so the shell can render without waiting on every paint. */
  uiSession: "atrix_admin_ui",
  passwordChanged: "atrix_admin_password_changed",
} as const;

/** Accepts `admin` or legacy `admin@atrix.com` (domain stripped). */
export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/@.*$/, "");
}

export function isValidAdminUser(value: string): boolean {
  return normalizeUsername(value) === ADMIN_USERNAME;
}

export function hasAdminUiSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEYS.uiSession) === "1";
}

export function markAdminUiSession(passwordChanged = true): void {
  window.localStorage.setItem(AUTH_KEYS.uiSession, "1");
  if (passwordChanged) {
    window.localStorage.setItem(AUTH_KEYS.passwordChanged, "true");
  }
}

export function clearAdminUiSession(): void {
  window.localStorage.removeItem(AUTH_KEYS.uiSession);
  window.localStorage.removeItem(AUTH_KEYS.passwordChanged);
  // Legacy client tokens / hashes — remove if present.
  window.localStorage.removeItem("atrix_admin_session");
  window.localStorage.removeItem("atrix_admin_password_hash");
}
