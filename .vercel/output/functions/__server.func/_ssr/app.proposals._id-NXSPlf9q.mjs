import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as FileText, R as CircleCheck, T as History, g as MessageSquare, i as TriangleAlert, q as ArrowLeft, t as X } from "../_libs/lucide-react.mjs";
import { b as useOverrideScore, n as getAuditTrail, o as useApproveScore, x as useProposal } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading, t as ApiError } from "./api-state-BXh1YwMO.mjs";
import { o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
import { t as mapApiProposal } from "./types-Cdlwv4AC.mjs";
import { t as Route } from "./app.proposals._id-YW5wZZ_h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.proposals._id-NXSPlf9q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useAuditTrail(proposalId) {
	return useQuery({
		queryKey: ["audit-trail", proposalId],
		queryFn: () => getAuditTrail(proposalId),
		enabled: !!proposalId,
		staleTime: 15e3
	});
}
var AGENT_LABEL = {
	technical: "Technical",
	impact: "Impact",
	team: "Team",
	milestone: "Milestone"
};
function ProposalPage() {
	const { id: proposalId } = Route.useParams();
	const { data: apiProposal, isLoading, isError, refetch } = useProposal(proposalId);
	const approveScore = useApproveScore();
	const overrideScore = useOverrideScore();
	const { data: auditTrail } = useAuditTrail(proposalId);
	const [overrideDim, setOverrideDim] = (0, import_react.useState)("");
	const [overrideVal, setOverrideVal] = (0, import_react.useState)(8);
	const [overrideReason, setOverrideReason] = (0, import_react.useState)("");
	const [actionMsg, setActionMsg] = (0, import_react.useState)("");
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading proposal…" });
	if (isError || !apiProposal) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
		message: "Proposal not found or API unreachable.",
		onRetry: () => void refetch()
	});
	const proposal = mapApiProposal(apiProposal);
	const handleApprove = async () => {
		try {
			await approveScore.mutateAsync({
				proposalId,
				dimension: "technical.innovation",
				evaluator: "reviewer"
			});
			setActionMsg("Score approved and logged to audit trail.");
		} catch (e) {
			setActionMsg(e instanceof Error ? e.message : "Approve failed");
		}
	};
	const handleOverride = async () => {
		if (!overrideDim || !overrideReason) {
			setActionMsg("Provide dimension and reason for override.");
			return;
		}
		try {
			setActionMsg(`Override saved. New total: ${(await overrideScore.mutateAsync({
				proposalId,
				dimension: overrideDim,
				new_score: overrideVal,
				reason: overrideReason,
				evaluator: "reviewer"
			})).new_total_score}`);
		} catch (e) {
			setActionMsg(e instanceof Error ? e.message : "Override failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-background px-4 py-3 sm:px-6 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/evaluations/$id",
				params: { id: proposal.evaluationId },
				className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to round"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: proposal.organization || "Proposal",
			title: proposal.title,
			description: proposal.summary,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => void handleApprove(),
						disabled: approveScore.isPending,
						className: "inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--approve)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Approve"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--flag)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), " Flag"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Reject"]
					})
				]
			})
		}),
		actionMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6 md:px-8",
			children: actionMsg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-4 sm:grid-cols-2 sm:p-6 md:p-8 xl:grid-cols-4",
			children: proposal.scores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: AGENT_LABEL[s.agent]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-semibold tracking-tight text-foreground",
							children: s.score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								"conf ",
								(s.confidence * 100).toFixed(0),
								"%"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary",
							style: { width: `${s.score * 10}%` }
						})
					})
				]
			}, s.agent))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 px-4 pb-8 sm:px-6 md:grid-cols-3 md:gap-6 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 md:col-span-2",
				children: [
					proposal.scores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] font-semibold tracking-wider text-primary uppercase",
								children: [AGENT_LABEL[s.agent], " agent"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-base font-semibold text-foreground",
								children: [
									"Score ",
									s.score,
									" · ",
									(s.confidence * 100).toFixed(0),
									"% confidence"
								]
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-muted-foreground",
							children: s.reasoning || "No reasoning returned."
						})]
					}, s.agent)),
					apiProposal.red_flags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-[color:var(--flag)]/30 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[color:var(--flag)] uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Red flags"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 list-disc space-y-1 pl-5 text-sm text-foreground",
							children: apiProposal.red_flags.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: f }, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
							children: "Override score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: overrideDim,
									onChange: (e) => setOverrideDim(e.target.value),
									placeholder: "Dimension e.g. impact.scale",
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 10,
									value: overrideVal,
									onChange: (e) => setOverrideVal(Number(e.target.value)),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: overrideReason,
									onChange: (e) => setOverrideReason(e.target.value),
									placeholder: "Reason for override (required for audit trail)",
									rows: 2,
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void handleOverride(),
									disabled: overrideScore.isPending,
									className: "rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
									children: "Save override"
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
							children: "Meta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Overall",
									v: proposal.overallScore.toString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Rank",
									v: apiProposal.rank?.toString() ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Status",
									v: proposal.status,
									capitalize: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Budget",
									v: apiProposal.budget_requested ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Timeline",
									v: apiProposal.timeline ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Evaluated",
									v: apiProposal.evaluated_at ? new Date(apiProposal.evaluated_at).toLocaleString() : "—"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), " Source"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 max-h-48 overflow-y-auto rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground",
							children: [apiProposal.raw_text?.slice(0, 2e3) ?? "No source text.", (apiProposal.raw_text?.length ?? 0) > 2e3 && "…"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5" }), " Team"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: apiProposal.team_summary ?? "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5" }), " Audit trail"]
						}), !auditTrail || auditTrail.approvals.length === 0 && auditTrail.overrides.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "No human actions yet. Approvals and overrides appear here for Conduct compliance."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 max-h-64 space-y-3 overflow-y-auto text-sm",
							children: [auditTrail.approvals.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-muted/30 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium capitalize text-foreground",
										children: a.action
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											a.dimension ?? "—",
											" · ",
											a.evaluator,
											a.timestamp ? ` · ${new Date(a.timestamp).toLocaleString()}` : ""
										]
									}),
									a.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-foreground",
										children: a.reason
									})
								]
							}, `a-${i}`)), auditTrail.overrides.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-[color:var(--flag)]/30 bg-[color:var(--flag)]/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-medium text-foreground",
										children: ["Override · ", o.dimension]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											o.original_score ?? "—",
											" → ",
											o.new_score,
											" · ",
											o.evaluator,
											o.timestamp ? ` · ${new Date(o.timestamp).toLocaleString()}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-foreground",
										children: o.reason
									})
								]
							}, `o-${i}`))]
						})]
					})
				]
			})]
		})
	] });
}
function Row({ k, v, capitalize }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `text-foreground ${capitalize ? "capitalize" : ""}`,
			children: v
		})]
	});
}
//#endregion
export { ProposalPage as component };
