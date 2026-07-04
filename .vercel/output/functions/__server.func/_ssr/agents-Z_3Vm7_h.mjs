import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { f as Radio } from "../_libs/lucide-react.mjs";
import { t as SiteFooter } from "./site-footer-BxRg8whC.mjs";
import { i as useAgents } from "./api-hooks-DvdUOF82.mjs";
import { t as VideoHero } from "./video-hero-r4e446MC.mjs";
import { n as ApiLoading, t as ApiError } from "./api-state-BXh1YwMO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-Z_3Vm7_h.js
var import_jsx_runtime = require_jsx_runtime();
function AgentsPage() {
	const { data, isLoading, isError, refetch } = useAgents();
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
								children: "The agents · live from API"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl",
								children: "Six specialists. One rubric."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg",
								children: "Every ARGOS agent is a Fetch.ai uAgent on Agentverse, powered by OpenAI gpt-4o for reasoning."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-6 py-24 md:px-12",
				children: [
					isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading live agent status…" }),
					isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
						message: "Start the backend to see live agent addresses.",
						onRetry: () => void refetch()
					}),
					data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: data.agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
											size: 22,
											className: "text-primary"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] tracking-wider uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: `h-3 w-3 ${a.status === "online" ? "text-[oklch(0.75_0.15_150)]" : "text-destructive"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: a.status
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs tracking-wider text-primary uppercase",
											children: a.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-2xl font-medium text-foreground",
											children: a.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm leading-relaxed text-muted-foreground",
											children: a.description
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 break-all font-mono text-foreground",
											children: a.address || "Not registered yet"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground",
										children: "Handled"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 font-mono text-foreground",
										children: a.proposals_handled
									})] })]
								})
							]
						}, a.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AgentsPage as component };
