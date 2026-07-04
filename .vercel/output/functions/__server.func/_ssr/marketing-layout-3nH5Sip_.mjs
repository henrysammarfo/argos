import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as SiteNav, t as SiteFooter } from "./site-footer-BxRg8whC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketing-layout-3nH5Sip_.js
var import_jsx_runtime = require_jsx_runtime();
function MarketingLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, { transparent: false }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { MarketingLayout as t };
