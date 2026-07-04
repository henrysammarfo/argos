//#region node_modules/.nitro/vite/services/ssr/assets/auth-3Iv38AWg.js
var TOKEN_STORAGE = "argos_access_token";
var USER_STORAGE = "argos_user";
function getStoredToken() {
	if (typeof window === "undefined") return "";
	return sessionStorage.getItem(TOKEN_STORAGE) ?? "";
}
function getStoredUser() {
	if (typeof window === "undefined") return null;
	const raw = sessionStorage.getItem(USER_STORAGE);
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function setAuthSession(token, user) {
	sessionStorage.setItem(TOKEN_STORAGE, token);
	sessionStorage.setItem(USER_STORAGE, JSON.stringify(user));
}
function clearAuthSession() {
	sessionStorage.removeItem(TOKEN_STORAGE);
	sessionStorage.removeItem(USER_STORAGE);
}
function isAuthenticated() {
	return Boolean(getStoredToken());
}
function getAuthHeader() {
	const token = getStoredToken();
	return token ? `Bearer ${token}` : "";
}
var BASE_URL = "http://localhost:8000/api";
async function parseError(res) {
	const err = await res.json().catch(() => ({ detail: res.statusText }));
	return typeof err.detail === "string" ? err.detail : "Request failed";
}
async function registerAccount(data) {
	const res = await fetch(`${BASE_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	if (!res.ok) throw new Error(await parseError(res));
	const body = await res.json();
	setAuthSession(body.access_token, body.user);
	return {
		user: body.user,
		verification_code: body.verification_code
	};
}
async function loginWithPassword(email, password) {
	const res = await fetch(`${BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email,
			password
		})
	});
	if (!res.ok) throw new Error(await parseError(res));
	const body = await res.json();
	setAuthSession(body.access_token, body.user);
	return body.user;
}
async function fetchMe() {
	const res = await fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: getAuthHeader() } });
	if (!res.ok) throw new Error(await parseError(res));
	const user = await res.json();
	const token = getStoredToken();
	if (token) setAuthSession(token, user);
	return user;
}
async function validateSession() {
	if (!getStoredToken()) return false;
	try {
		await fetchMe();
		return true;
	} catch {
		clearAuthSession();
		return false;
	}
}
async function verifyEmail(code) {
	const res = await fetch(`${BASE_URL}/auth/verify-email`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: getAuthHeader()
		},
		body: JSON.stringify({ code })
	});
	if (!res.ok) throw new Error(await parseError(res));
	await res.json();
	return fetchMe();
}
async function resendVerification() {
	const res = await fetch(`${BASE_URL}/auth/resend-verification`, {
		method: "POST",
		headers: { Authorization: getAuthHeader() }
	});
	if (!res.ok) throw new Error(await parseError(res));
	return res.json();
}
function logout() {
	clearAuthSession();
}
//#endregion
export { getStoredUser as a, logout as c, validateSession as d, verifyEmail as f, getStoredToken as i, registerAccount as l, fetchMe as n, isAuthenticated as o, getAuthHeader as r, loginWithPassword as s, clearAuthSession as t, resendVerification as u };
