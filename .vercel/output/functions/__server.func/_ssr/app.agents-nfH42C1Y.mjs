import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { P as Copy, f as Radio } from "../_libs/lucide-react.mjs";
import { i as useAgents } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading, t as ApiError } from "./api-state-BXh1YwMO.mjs";
import { o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.agents-nfH42C1Y.js
var import_jsx_runtime = require_jsx_runtime();
function AgentsPage() {
	const { data, isLoading, isError, refetch } = useAgents();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading agent status…" });
	if (isError || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
		message: "Cannot load agents from API.",
		onRetry: () => void refetch()
	});
	const agents = data.agents;
	const online = data.online_count;
	const offline = agents.length - online;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Agents",
			title: "Agent status",
			description: "Live status of every ARGOS uAgent — polled every 5 seconds."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 sm:grid-cols-2 sm:p-6 md:p-8 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Online",
					value: online.toString(),
					tone: "approve"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Offline",
					value: offline.toString(),
					tone: "flag"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Proposals complete",
					value: data.proposals_complete.toString()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Proposals pending",
					value: data.proposals_pending.toString()
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6 md:px-8 xl:grid-cols-3",
			children: agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
								size: 22,
								className: "text-primary"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: a.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold tracking-wider text-primary uppercase",
								children: a.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-semibold text-foreground",
								children: a.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: a.description
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground",
								children: "Handled"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 font-mono text-foreground",
								children: a.proposals_handled
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 font-mono capitalize text-foreground",
								children: a.status
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "truncate rounded bg-muted px-2 py-1 font-mono text-[11px] text-foreground",
										children: a.address || "Not registered — run agent and set env var"
									}), a.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Copy address",
										onClick: () => void navigator.clipboard.writeText(a.address),
										className: "rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
									})]
								})]
							})
						]
					})
				]
			}, a.id))
		})
	] });
}
function MiniStat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-2 text-2xl font-semibold tracking-tight ${tone === "approve" ? "text-[color:var(--approve)]" : tone === "flag" ? "text-[color:var(--flag)]" : "text-foreground"}`,
			children: value
		})]
	});
}
function StatusChip({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${{
			online: "bg-[color:var(--approve)]/10 text-[color:var(--approve)]",
			degraded: "bg-[color:var(--flag)]/10 text-[color:var(--flag)]",
			offline: "bg-destructive/10 text-destructive"
		}[status] ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3 w-3" }), status]
	});
}
//#endregion
export { AgentsPage as component };
