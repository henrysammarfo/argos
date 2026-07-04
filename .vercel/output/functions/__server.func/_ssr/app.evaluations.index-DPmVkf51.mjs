import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as FileStack, l as Search, p as Plus } from "../_libs/lucide-react.mjs";
import { g as useEvaluations } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading, t as ApiError } from "./api-state-BXh1YwMO.mjs";
import { a as EmptyState, o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.evaluations.index-DPmVkf51.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EvaluationsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const { data: apiData, isLoading, isError, refetch } = useEvaluations();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading evaluation rounds…" });
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
		message: "Cannot load evaluations from API.",
		onRetry: () => void refetch()
	});
	const evaluations = apiData?.evaluations.map((e) => ({
		id: e.id,
		title: e.title,
		description: e.description ?? "",
		status: e.status ?? "active",
		proposalCount: e.proposal_count ?? 0,
		flaggedCount: e.flagged_count ?? 0,
		grantAmountKas: e.grant_amount_kas ?? 0,
		createdAt: e.created_at,
		rubric: e.rubric
	})) ?? [];
	const filtered = evaluations.filter((e) => {
		const matchesQ = q === "" || e.title.toLowerCase().includes(q.toLowerCase());
		const matchesStatus = status === "all" || e.status === status;
		return matchesQ && matchesStatus;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Evaluations",
			title: "Rounds",
			description: "Every open, in-review, and archived grant round — live from API.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/setup",
				className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New round"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 border-b border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:px-6 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search rounds…",
					className: "w-full rounded-lg border border-border bg-card py-2 pr-3 pl-9 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 rounded-lg border border-border bg-card p-1 shadow-sm",
				children: [
					"all",
					"active",
					"review",
					"complete"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setStatus(k),
					className: `rounded-md px-3 py-1.5 text-xs font-medium capitalize ${status === k ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: k
				}, k))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 sm:p-6 md:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: FileStack,
				title: evaluations.length === 0 ? "No rounds yet" : "No rounds match",
				description: evaluations.length === 0 ? "Create your first evaluation round to get started." : "Try clearing the search or switching status."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border bg-muted/40 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Round"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Proposals"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Flagged"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Grant pool"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Created"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/app/evaluations/$id",
										params: { id: e.id },
										className: "block max-w-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: e.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 truncate text-xs text-muted-foreground",
											children: e.description
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-foreground",
									children: e.proposalCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${e.flaggedCount > 0 ? "bg-[color:var(--flag)]/10 text-[color:var(--flag)]" : "text-muted-foreground"}`,
										children: e.flaggedCount
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-4 font-mono text-xs text-foreground",
									children: [(e.grantAmountKas / 1e3).toFixed(0), "K KAS"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-xs text-muted-foreground",
									children: new Date(e.createdAt).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: e.status })
								})
							]
						}, e.id))
					})]
				})
			}) })
		})
	] });
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${{
			active: "bg-primary/10 text-primary",
			review: "bg-[color:var(--flag)]/10 text-[color:var(--flag)]",
			complete: "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
		}[status] ?? "bg-muted text-muted-foreground"}`,
		children: status
	});
}
//#endregion
export { EvaluationsPage as component };
