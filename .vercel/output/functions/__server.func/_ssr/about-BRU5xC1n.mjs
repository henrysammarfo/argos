import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as Github, v as Mail, w as Landmark } from "../_libs/lucide-react.mjs";
import { t as MarketingLayout } from "./marketing-layout-3nH5Sip_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BRU5xC1n.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-6 py-24 md:px-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-medium tracking-tight text-foreground md:text-6xl",
				children: "Public capital deserves a faster committee."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-lg leading-relaxed text-muted-foreground",
				children: "ARGOS started with a single frustration: it takes six weeks for six reviewers to walk fifty proposals through the same rubric, and by proposal forty the scoring drifts. We think the answer isn't more reviewers — it's a committee that never gets tired, always shows its work, and only bothers a human when a real judgment call needs one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 grid gap-6 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: Landmark,
						title: "GCC Category 1",
						body: "Agents that improve how public capital is evaluated and allocated — exact match. ARGOS is submitted to Category 1 for the 2026 program."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: Github,
						title: "Open build",
						body: "The full ARGOS stack — agents, API, escrow — is public on GitHub. Fork it, run your own funder, contribute back."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						icon: Mail,
						title: "Reach us",
						body: "argos@lovable.dev — for pilots, GCC coordination, or hackathon partnerships."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 rounded-2xl border border-border bg-card p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs tracking-wider text-muted-foreground uppercase",
						children: "Builder"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-medium text-foreground",
						children: "Henry Sam Marfo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "github.com/henrysammarfo · Building ARGOS for Demo Day at Imperial College London, July 4 2026. Hackathon stack: Conduct Track (£8K), Fetch.ai Challenge (£500), Kaspa ($1K USDC), GCC Category 1."
					})
				]
			})
		]
	}) });
}
function Card({ icon: Icon, title, body }) {
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
export { AboutPage as component };
