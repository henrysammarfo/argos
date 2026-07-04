import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Check } from "../_libs/lucide-react.mjs";
import { t as MarketingLayout } from "./marketing-layout-3nH5Sip_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing--ChDmjrL.js
var import_jsx_runtime = require_jsx_runtime();
var tiers = [
	{
		name: "Pilot",
		price: "£2,400",
		unit: "per round",
		tag: "Best for a single review round",
		features: [
			"Up to 60 proposals per round",
			"3 evaluator agents",
			"Kaspa escrow — 1 contract",
			"Email support"
		],
		cta: "Start a pilot",
		highlight: false
	},
	{
		name: "Program",
		price: "£1,800",
		unit: "per month",
		tag: "For running funders",
		features: [
			"Unlimited proposals",
			"All 6 agents on Agentverse",
			"Unlimited Kaspa escrow contracts",
			"Custom rubric weights",
			"Slack support"
		],
		cta: "Open a program",
		highlight: true
	},
	{
		name: "Enterprise",
		price: "Custom",
		unit: "annual",
		tag: "Multi-program, multi-region",
		features: [
			"SSO + audit exports",
			"Dedicated Agentverse deployment",
			"Multi-signature escrow governance",
			"On-site training + demo day",
			"SLA + dedicated support"
		],
		cta: "Talk to us",
		highlight: false
	}
];
function PricingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-24 md:px-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-medium tracking-tight text-foreground md:text-5xl",
					children: "Priced by the round, not per seat."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "No per-reviewer fees. No compute surprises. Escrow gas is billed at cost."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid gap-6 md:grid-cols-3",
				children: tiers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `liquid-glass rounded-2xl p-8 ${t.highlight ? "ring-2 ring-primary" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10",
						children: [
							t.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 inline-flex items-center rounded-full bg-primary/20 px-2.5 py-1 text-[10px] tracking-wider text-primary uppercase",
								children: "Most chosen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: t.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xl font-medium text-foreground",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-baseline gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-4xl font-medium tracking-tight text-foreground",
									children: t.price
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: t.unit
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-8 space-y-3",
								children: t.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 text-sm text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-primary" }), f]
								}, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: `mt-10 block rounded-full px-6 py-3 text-center text-sm font-semibold ${t.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border bg-background text-foreground hover:bg-muted"}`,
								children: t.cta
							})
						]
					})
				}, t.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground",
				children: "Non-profits and public-sector funders — ask us about GCC Category 1 pricing."
			})
		]
	}) });
}
//#endregion
export { PricingPage as component };
