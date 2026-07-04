import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as getStoredUser, c as logout, d as validateSession, f as verifyEmail, i as getStoredToken, l as registerAccount, n as fetchMe, o as isAuthenticated, s as loginWithPassword, u as resendVerification } from "./auth-3Iv38AWg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-7Y8pc-KD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(getStoredUser());
	const [isAuthenticated$1, setIsAuthenticated] = (0, import_react.useState)(isAuthenticated());
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const ok = await validateSession();
			if (cancelled) return;
			setIsAuthenticated(ok);
			setUser(getStoredUser());
			setIsLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	const login = (0, import_react.useCallback)(async (email, password) => {
		setUser(await loginWithPassword(email, password));
		setIsAuthenticated(true);
	}, []);
	const register = (0, import_react.useCallback)(async (data) => {
		const result = await registerAccount(data);
		setUser(result.user);
		setIsAuthenticated(true);
		return result.verification_code;
	}, []);
	const verifyEmailCode = (0, import_react.useCallback)(async (code) => {
		setUser(await verifyEmail(code));
	}, []);
	const resendVerificationCode = (0, import_react.useCallback)(async () => {
		return (await resendVerification()).verification_code;
	}, []);
	const refreshUser = (0, import_react.useCallback)(async () => {
		setUser(await fetchMe());
	}, []);
	const logout$1 = (0, import_react.useCallback)(() => {
		logout();
		setUser(null);
		setIsAuthenticated(false);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		isAuthenticated: isAuthenticated$1,
		user,
		email: user?.email ?? "",
		emailVerified: user?.email_verified ?? false,
		organizationName: user?.organization_name ?? "",
		isLoading,
		login,
		register,
		verifyEmailCode,
		resendVerificationCode,
		refreshUser,
		logout: logout$1
	}), [
		isAuthenticated$1,
		user,
		isLoading,
		login,
		register,
		verifyEmailCode,
		resendVerificationCode,
		refreshUser,
		logout$1
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
function hasAuthSession() {
	return isAuthenticated() || Boolean(getStoredToken());
}
//#endregion
export { hasAuthSession as n, useAuth as r, AuthProvider as t };
