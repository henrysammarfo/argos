/**
 * Client-side auth — admin API key stored in sessionStorage after login.
 */

const ADMIN_KEY_STORAGE = "argos_admin_key";
const EMAIL_STORAGE = "argos_admin_email";

export function getStoredAdminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
}

export function getStoredEmail(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(EMAIL_STORAGE) ?? "";
}

export function setAuthSession(adminKey: string, email: string): void {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
  sessionStorage.setItem(EMAIL_STORAGE, email);
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  sessionStorage.removeItem(EMAIL_STORAGE);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredAdminKey());
}

export function getAdminKeyForRequest(): string {
  return getStoredAdminKey();
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export async function loginWithAdminKey(
  adminKey: string,
  email?: string,
): Promise<{ email: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ admin_key: adminKey, email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === "string" ? err.detail : "Login failed");
  }
  const data = (await res.json()) as { email: string };
  setAuthSession(adminKey, data.email ?? email ?? "admin@argos.local");
  return { email: data.email };
}

export async function validateSession(): Promise<boolean> {
  const key = getAdminKeyForRequest();
  if (!key) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/session`, {
      headers: { "X-Admin-Key": key },
    });
    if (!res.ok) {
      clearAuthSession();
      return false;
    }
    const data = (await res.json()) as { requires_key?: boolean };
    if (data.requires_key === false && !getStoredAdminKey()) {
      setAuthSession(key, "admin@argos.local");
    }
    return true;
  } catch {
    return false;
  }
}

export function logout(): void {
  clearAuthSession();
}
