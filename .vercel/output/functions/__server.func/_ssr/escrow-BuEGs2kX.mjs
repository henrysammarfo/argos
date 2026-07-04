import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Lock, s as ShieldCheck, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as SiteFooter } from "./site-footer-BxRg8whC.mjs";
import { t as VideoHero } from "./video-hero-r4e446MC.mjs";
import { t as LiveMilestonePreview } from "./live-escrow-preview-BEHWLbqy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/escrow-BuEGs2kX.js
var import_jsx_runtime = require_jsx_runtime();
function EscrowPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoHero, {
				fullscreen: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-start justify-center px-6 pt-16 sm:pt-20 md:pt-24 md:pb-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-3xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80",
								children: "Kaspa escrow"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl",
								children: [
									"Money moves when",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"deliverables do."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg",
								children: "Every approved grant creates a conditional escrow on the Kaspa BlockDAG. Nothing releases until a milestone verifies."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-6 py-24 md:px-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feat, {
							icon: Lock,
							title: "Covenant-locked",
							body: "Funds are held in a Kaspa covenant script. The wallet cannot move them without a valid milestone-release condition."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feat, {
							icon: LoaderCircle,
							title: "Agent-verified",
							body: "The Milestone agent checks public artifacts — dataset releases, benchmark results, code commits — before signaling ready-to-release."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feat, {
							icon: ShieldCheck,
							title: "Human-signed",
							body: "A program admin co-signs the release transaction. Both the AI verification and the human signature live in the audit trail."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 text-xs tracking-wider text-muted-foreground uppercase",
						children: "Live escrow from API"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMilestonePreview, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Feat({ icon: Icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-lg font-medium text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: body
			})
		]
	});
}
//#endregion
export { EscrowPage as component };
