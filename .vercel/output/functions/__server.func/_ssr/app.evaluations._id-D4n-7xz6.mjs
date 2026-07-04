import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Funnel, F as Coins, G as ArrowUpDown, M as Download, m as Play, p as Plus, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { S as useRunEvaluation, h as useEvaluationStatus, l as useCreateProposalsBatch, m as useEvaluationResults, p as useEvaluation, s as useCreateEscrow } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading, t as ApiError } from "./api-state-BXh1YwMO.mjs";
import { o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
import { t as Route } from "./app.evaluations._id-KRLRLMy9.mjs";
import { n as mapResultProposal } from "./types-Cdlwv4AC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.evaluations._id-D4n-7xz6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoundPage() {
	const { id: evaluationId } = Route.useParams();
	const { data: apiEval, isLoading, isError, refetch } = useEvaluation(evaluationId);
	const { data: status, refetch: refetchStatus } = useEvaluationStatus(evaluationId, true);
	const { data: results } = useEvaluationResults(evaluationId);
	const runEval = useRunEvaluation();
	const uploadBatch = useCreateProposalsBatch();
	const createEscrow = useCreateEscrow();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [uploadTitle, setUploadTitle] = (0, import_react.useState)("");
	const [uploadText, setUploadText] = (0, import_react.useState)("");
	const [granteeAddress, setGranteeAddress] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)("");
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading evaluation round…" });
	if (isError || !apiEval) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
		message: "Evaluation not found or API unreachable.",
		onRetry: () => void refetch()
	});
	const evaluation = {
		id: apiEval.id,
		title: apiEval.title,
		description: apiEval.description ?? "",
		rubric: apiEval.rubric,
		grantAmountKas: apiEval.grant_amount_kas ?? 0
	};
	const proposals = results?.proposals.map((p) => mapResultProposal(p, evaluationId)) ?? [];
	const filtered = proposals.filter((p) => filter === "all" || p.status === filter);
	const handleRun = async () => {
		setRunning(true);
		setMsg("");
		try {
			await runEval.mutateAsync(evaluationId);
			refetchStatus();
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Run failed");
		} finally {
			setRunning(false);
		}
	};
	const handleUpload = async () => {
		if (!uploadTitle.trim() || !uploadText.trim()) {
			setMsg("Title and proposal text required.");
			return;
		}
		setMsg("");
		try {
			await uploadBatch.mutateAsync({
				evaluation_id: evaluationId,
				proposals: [{
					evaluation_id: evaluationId,
					title: uploadTitle,
					source_type: "text",
					source: uploadText
				}]
			});
			setUploadTitle("");
			setUploadText("");
			setMsg("Proposal uploaded.");
			refetchStatus();
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Upload failed");
		}
	};
	const handleCreateEscrow = async () => {
		const winner = proposals[0];
		if (!winner) {
			setMsg("Run evaluation first to select a winner.");
			return;
		}
		if (!granteeAddress.trim()) {
			setMsg("Grantee Kaspa address required.");
			return;
		}
		try {
			const result = await createEscrow.mutateAsync({
				evaluation_id: evaluationId,
				winner_proposal_id: winner.id,
				grantee_kas_address: granteeAddress
			});
			setMsg(`Escrow created: deposit ${result.total_kas} KAS to ${result.escrow_address}`);
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Escrow creation failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Round",
			title: evaluation.title,
			description: evaluation.description,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void handleRun(),
					disabled: running || runEval.isPending,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50",
					children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), "Run evaluation"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export CSV"]
				})]
			})
		}),
		msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6 md:px-8",
			children: msg
		}),
		status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-background px-4 py-3 sm:px-6 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 flex-1 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary transition-all duration-500",
						style: { width: `${status.progress_pct}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-medium text-muted-foreground",
					children: [
						status.complete,
						"/",
						status.total,
						" complete",
						status.errors > 0 && ` · ${status.errors} error(s)`
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 border-b border-border bg-background px-4 py-4 sm:grid-cols-4 sm:px-6 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricPill, {
					label: "Technical",
					value: `${evaluation.rubric.technical}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricPill, {
					label: "Impact",
					value: `${evaluation.rubric.impact}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricPill, {
					label: "Team",
					value: `${evaluation.rubric.team}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricPill, {
					label: "Pool",
					value: `${(evaluation.grantAmountKas / 1e3).toFixed(0)}K KAS`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-background px-4 py-4 sm:px-6 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-foreground",
						children: "Upload proposal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: uploadTitle,
							onChange: (e) => setUploadTitle(e.target.value),
							placeholder: "Proposal title",
							className: "rounded-lg border border-border bg-background px-3 py-2 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void handleUpload(),
							disabled: uploadBatch.isPending,
							className: "inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add proposal"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: uploadText,
						onChange: (e) => setUploadText(e.target.value),
						placeholder: "Paste proposal text (team, objectives, budget, methodology)…",
						rows: 4,
						className: "mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[200px] flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Grantee Kaspa address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: granteeAddress,
								onChange: (e) => setGranteeAddress(e.target.value),
								placeholder: "kaspatest:qr… or kaspa:qr…",
								className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void handleCreateEscrow(),
							disabled: createEscrow.isPending,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }), " Create Kaspa escrow for #1"]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-3 sm:px-6 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }), [
				"all",
				"flagged",
				"pending",
				"approved"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFilter(k),
				className: `rounded-full px-3 py-1 text-xs font-medium capitalize ${filter === k ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
				children: [
					k,
					" · ",
					proposals.filter((p) => k === "all" || p.status === k).length
				]
			}, k))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 sm:p-6 md:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: "No proposals yet. Upload proposals above, then run evaluation."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border bg-muted/40 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Proposal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Tech"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Impact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: ["Overall ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProposalRow, { p }, p.id))
					})]
				})
			}) })
		})
	] });
}
function RubricPill({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card px-3 py-2 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold tracking-wider text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-sm font-semibold text-foreground",
			children: value
		})]
	});
}
function ProposalRow({ p }) {
	const tech = p.scores.find((s) => s.agent === "technical")?.score ?? 0;
	const impact = p.scores.find((s) => s.agent === "impact")?.score ?? 0;
	const team = p.scores.find((s) => s.agent === "team")?.score ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "hover:bg-muted/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/proposals/$id",
					params: { id: p.id },
					className: "block max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm font-semibold text-foreground",
						children: p.title
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, { v: tech }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, { v: impact }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCell, { v: team }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm font-semibold text-foreground",
					children: p.overallScore
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: p.status })
			})
		]
	});
}
function ScoreCell({ v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: "px-5 py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 w-16 overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-primary",
					style: { width: `${v * 10}%` }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-foreground",
				children: v
			})]
		})
	});
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${{
			pending: "bg-muted text-muted-foreground",
			approved: "bg-[color:var(--approve)]/10 text-[color:var(--approve)]",
			flagged: "bg-[color:var(--flag)]/10 text-[color:var(--flag)]",
			rejected: "bg-destructive/10 text-destructive"
		}[status] ?? "bg-muted text-muted-foreground"}`,
		children: status
	});
}
//#endregion
export { RoundPage as component };
