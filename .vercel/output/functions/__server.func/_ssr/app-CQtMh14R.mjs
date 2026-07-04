import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ApiLoading } from "./api-state-BXh1YwMO.mjs";
import { r as useAuth } from "./auth-context-7Y8pc-KD.mjs";
import { i as DashboardShell, r as ConsoleThemeProvider } from "./dashboard-shell-BBbx_6OB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-CQtMh14R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppLayout() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!isLoading && !isAuthenticated) navigate({
			to: "/login",
			search: { redirect: window.location.pathname }
		});
	}, [
		isAuthenticated,
		isLoading,
		navigate
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Checking session…" });
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Redirecting to login…" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsoleThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) });
}
//#endregion
export { AppLayout as component };
