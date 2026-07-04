import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as useEscrows } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading } from "./api-state-BXh1YwMO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-escrow-preview-BEHWLbqy.js
var import_jsx_runtime = require_jsx_runtime();
function LiveMilestonePreview() {
	const { data, isLoading } = useEscrows();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading live escrow…" });
	const escrow = data?.escrows?.[0];
	if (!escrow) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground",
		children: "No active escrows. Create one from the console after an evaluation round."
	});
	const rows = escrow.milestones.map((m) => ({
		name: m.name,
		pct: m.percent,
		state: m.status
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [escrow.id.slice(0, 12), "…"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-primary",
				children: [escrow.total_kas.toLocaleString(), " KAS"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-4",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-2 flex-shrink-0 rounded-full ${r.state === "released" ? "bg-[oklch(0.75_0.15_150)]" : r.state === "verifying" ? "bg-primary" : "bg-muted-foreground/30"}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [r.pct, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full ${r.state === "released" ? "bg-[oklch(0.75_0.15_150)]" : r.state === "verifying" ? "bg-primary" : "bg-muted-foreground/20"}`,
								style: { width: r.state === "locked" ? "0%" : "100%" }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `w-20 text-right text-[10px] tracking-wider uppercase ${r.state === "released" ? "text-[oklch(0.75_0.15_150)]" : r.state === "verifying" ? "text-primary" : "text-muted-foreground"}`,
						children: r.state
					})
				]
			}, r.name))
		})]
	});
}
//#endregion
export { LiveMilestonePreview as t };
