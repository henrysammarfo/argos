/**
 * JWT auth — register, login, email verification.
 */

export interface AuthUser {
  id: string;
  email: string;
  email_verified: boolean;
  organization_id: string;
  organization_name: string;
  role: string;
  full_name?: string | null;
}

const TOKEN_STORAGE = "argos_access_token";
const USER_STORAGE = "argos_user";

export function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(TOKEN_STORAGE) ?? "";
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(USER_STORAGE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AuthUser): void {
  sessionStorage.setItem(TOKEN_STORAGE, token);
  sessionStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(TOKEN_STORAGE);
  sessionStorage.removeItem(USER_STORAGE);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export function getAuthHeader(): string {
  const token = getStoredToken();
  return token ? `Bearer ${token}` : "";
}

import { getApiBaseUrl } from "./api-config";

const BASE_URL = getApiBaseUrl();

interface AuthResponse {
  access_token: string;
  user: AuthUser;
  verification_code?: string;
}

async function parseError(res: Response): Promise<string> {
  const err = await res.json().catch(() => ({ detail: res.statusText }));
  return typeof err.detail === "string" ? err.detail : "Request failed";
}

export async function registerAccount(data: {
  email: string;
  password: string;
  organization_name: string;
  full_name?: string;
}): Promise<{ user: AuthUser; verification_code?: string }> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const body = (await res.json()) as AuthResponse;
  setAuthSession(body.access_token, body.user);
  return { user: body.user, verification_code: body.verification_code };
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const body = (await res.json()) as AuthResponse;
  setAuthSession(body.access_token, body.user);
  return body.user;
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: getAuthHeader() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  const user = (await res.json()) as AuthUser;
  const token = getStoredToken();
  if (token) setAuthSession(token, user);
  return user;
}

export async function validateSession(): Promise<boolean> {
  if (!getStoredToken()) return false;
  try {
    await fetchMe();
    return true;
  } catch {
    clearAuthSession();
    return false;
  }
}

export async function verifyEmail(code: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  await res.json();
  return fetchMe();
}

export async function resendVerification(): Promise<{ verification_code?: string }> {
  const res = await fetch(`${BASE_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { Authorization: getAuthHeader() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{ verification_code?: string }>;
}

export function logout(): void {
  clearAuthSession();
}

/** @deprecated use getStoredUser()?.email */
export function getStoredEmail(): string {
  return getStoredUser()?.email ?? "";
}

/** @deprecated */
export function getAdminKeyForRequest(): string {
  return "";
}
