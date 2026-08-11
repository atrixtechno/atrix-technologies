/** Client-side admin gate for the marketing site (not enterprise auth). */

import { ADMIN_SESSION_COOKIE } from "@/lib/analytics";

export const ADMIN_USERNAME = "admin";
export const ADMIN_EMAIL = "admin@atrix.com";
export const DEFAULT_PASSWORD = "12345678";

export const AUTH_KEYS = {
  passwordHash: "atrix_admin_password_hash",
  passwordChanged: "atrix_admin_password_changed",
  session: "atrix_admin_session",
} as const;

function syncAdminSessionCookie(value: string | null): void {
  if (typeof document === "undefined") return;
  if (value) {
    const maxAge = 60 * 60 * 24 * 14;
    document.cookie = `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Accepts `admin` or legacy `admin@atrix.com` (domain stripped). */
export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/@.*$/, "");
}

export function isValidAdminUser(value: string): boolean {
  return normalizeUsername(value) === ADMIN_USERNAME;
}

export function getStoredPasswordHash(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_KEYS.passwordHash);
}

export function isPasswordChanged(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEYS.passwordChanged) === "true";
}

export function hasAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(AUTH_KEYS.session));
}

export async function getEffectivePasswordHash(): Promise<string> {
  const stored = getStoredPasswordHash();
  if (stored) return stored;
  return sha256(DEFAULT_PASSWORD);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const [inputHash, expected] = await Promise.all([
    sha256(password),
    getEffectivePasswordHash(),
  ]);
  return inputHash === expected;
}

export function setAdminSession(): void {
  const token = `ok:${Date.now().toString(36)}`;
  window.localStorage.setItem(AUTH_KEYS.session, token);
  syncAdminSessionCookie(token);
}

export function clearAdminSession(): void {
  window.localStorage.removeItem(AUTH_KEYS.session);
  syncAdminSessionCookie(null);
}

/** Keep cookie in sync when an older localStorage session exists. */
export function ensureAdminSessionCookie(): void {
  const raw = window.localStorage.getItem(AUTH_KEYS.session);
  if (raw?.startsWith("ok:")) syncAdminSessionCookie(raw);
  else syncAdminSessionCookie(null);
}

export async function changeAdminPassword(newPassword: string): Promise<void> {
  const hash = await sha256(newPassword);
  window.localStorage.setItem(AUTH_KEYS.passwordHash, hash);
  window.localStorage.setItem(AUTH_KEYS.passwordChanged, "true");
  setAdminSession();
}

export function mustChangePassword(): boolean {
  return !isPasswordChanged();
}
