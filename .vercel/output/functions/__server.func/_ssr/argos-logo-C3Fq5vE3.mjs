import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/argos-logo-C3Fq5vE3.js
var import_jsx_runtime = require_jsx_runtime();
/**
* ARGOS mark — a hexagonal aperture with a central pupil.
* Stroke-only so it prints clean on merch (embroidery, screen-print, vinyl).
*/
function ArgosMark({ size = 28, className = "" }) {
	const s = size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: s,
		height: s,
		viewBox: "0 0 32 32",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 2.5L27.5 9v14L16 29.5 4.5 23V9L16 2.5z",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinejoin: "round",
				opacity: "0.9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 8.5L21 12l-2.2 3.8H13.2L11 12l5-3.5z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 8.5v3.8",
					opacity: "0.6"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "1.8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "5",
				stroke: "currentColor",
				strokeWidth: "1.2",
				opacity: "0.5"
			})
		]
	});
}
//#endregion
export { ArgosMark as t };
