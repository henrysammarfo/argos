import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Coins, H as Bot, I as Clock, R as CircleCheck, W as ArrowUpRight, f as Radio, i as TriangleAlert, k as FileStack, p as Plus } from "../_libs/lucide-react.mjs";
import { d as useDashboardStats, i as useAgents, r as getPaymentLedger, u as useDashboardActivity } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading, r as formatRelativeTime, t as ApiError } from "./api-state-BXh1YwMO.mjs";
import { n as CardHeader, o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.index-DPNtYLoj.js
var import_jsx_runtime = require_jsx_runtime();
function usePaymentLedger(limit = 50) {
	return useQuery({
		queryKey: ["payment-ledger", limit],
		queryFn: () => getPaymentLedger(limit),
		staleTime: 3e4
	});
}
function OverviewPage() {
	const { data: stats, isLoading, isError, refetch } = useDashboardStats();
	const { data: activityData } = useDashboardActivity();
	const { data: agentsData } = useAgents();
	const { data: ledgerData } = usePaymentLedger(8);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading live dashboard…" });
	if (isError || !stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
		message: "Cannot reach ARGOS API. Start the backend: cd backend && uvicorn api.main:app --port 8000",
		onRetry: () => void refetch()
	});
	const rounds = stats.rounds;
	const active = stats.active_rounds;
	const agents = agentsData?.agents ?? [];
	const gcc = stats.gcc_public_capital;
	const payments = stats.agent_payments;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Overview",
			title: "ARGOS Console",
			description: `${active} active round${active === 1 ? "" : "s"} · ${stats.total_proposals} proposals · ${stats.flagged_proposals} flagged`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/evaluations",
				className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New round"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Active rounds",
					value: active.toString(),
					icon: FileStack
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Proposals in flight",
					value: stats.total_proposals.toString(),
					icon: FileStack
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Flagged for review",
					value: stats.flagged_proposals.toString(),
					icon: TriangleAlert,
					tone: "flag"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Escrow under management",
					value: `${stats.escrow_managed_kas.toLocaleString()} KAS`,
					icon: Coins
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 px-4 pb-4 sm:px-6 md:grid-cols-3 md:gap-6 md:px-8 md:pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { title: "Proposals evaluated · last 12 weeks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { data: stats.evaluations_weekly }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-foreground",
								children: stats.complete_proposals
							}), "Evaluated"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-foreground",
								children: stats.pending_proposals
							}), "Pending"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-foreground",
								children: stats.grant_pool_kas.toLocaleString()
							}), "Grant pool KAS"] })
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				title: "Agent health",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/agents",
					className: "text-xs font-medium text-primary hover:underline",
					children: "View all"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: `h-3.5 w-3.5 flex-shrink-0 ${a.status === "online" ? "text-[color:var(--approve)]" : "text-destructive"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm text-foreground",
								children: a.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									a.proposals_handled,
									" handled · ",
									a.role
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${a.status === "online" ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]" : "bg-destructive/10 text-destructive"}`,
							children: a.status
						})
					]
				}, a.id))
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 px-4 pb-4 sm:px-6 md:grid-cols-2 md:gap-6 md:px-8 md:pb-6",
			children: [gcc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { title: "Public capital allocation (GCC)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 p-5 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GccStat, {
						label: "Grant pool",
						value: `${gcc.grant_pool_kas.toLocaleString()} KAS`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GccStat, {
						label: "Escrow locked",
						value: `${gcc.escrow_locked_kas.toLocaleString()} KAS`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GccStat, {
						label: "Released",
						value: `${gcc.escrow_released_kas.toLocaleString()} KAS`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GccStat, {
						label: "Evaluated",
						value: gcc.proposals_evaluated.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GccStat, {
						label: "Approval rate",
						value: `${gcc.approval_rate_pct}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GccStat, {
						label: "Under management",
						value: `${gcc.escrow_managed_kas.toLocaleString()} KAS`
					})
				]
			})] }), payments && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					title: "Agent payments (Fetch.ai)",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3 w-3" }), " FET ledger"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl font-semibold text-foreground",
							children: payments.total_fet
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted-foreground",
							children: [
								"FET total · ",
								payments.total_agent_calls,
								" calls"
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: payments.by_agent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "p-5 text-sm text-muted-foreground",
						children: "No agent calls recorded yet."
					}) : payments.by_agent.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between px-5 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: a.agent
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								a.calls,
								" × ",
								a.fet_total.toFixed(2),
								" FET"
							]
						})]
					}, a.agent))
				}),
				(ledgerData?.payments.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-5 py-3 text-xs text-muted-foreground",
					children: [
						"Latest: ",
						ledgerData.payments[0].agent_name,
						" · ",
						ledgerData.payments[0].action,
						" ·",
						" ",
						ledgerData.payments[0].fet_amount,
						" FET"
					]
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 px-4 pb-4 sm:px-6 md:gap-6 md:px-8 md:pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				title: "Active rounds",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app/evaluations",
					className: "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
					children: ["All rounds ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
				})
			}), rounds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: [
					"No rounds yet.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/setup",
						className: "text-primary hover:underline",
						children: "Create one"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: rounds.map((e) => {
					const approvedRatio = e.proposal_count > 0 ? e.approved_count / e.proposal_count : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/evaluations/$id",
						params: { id: e.id },
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 hover:bg-muted/40 md:grid-cols-[minmax(0,2fr)_140px_120px_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-semibold text-foreground",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 truncate text-xs text-muted-foreground",
									children: [
										e.proposal_count,
										" proposals · ",
										e.flagged_count,
										" flagged ·",
										" ",
										(e.grant_amount_kas / 1e3).toFixed(0),
										"K KAS"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-[color:var(--approve)]",
										style: { width: `${Math.round(approvedRatio * 100)}%` }
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [Math.round(approvedRatio * 100), "% approved"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden text-xs text-muted-foreground md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mr-1 inline h-3 w-3" }), new Date(e.created_at).toLocaleDateString()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: e.status })
						]
					}, e.id);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { title: "Recent activity" }), (activityData?.activity.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-sm text-muted-foreground",
				children: "No activity yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: activityData.activity.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRow, {
					icon: ev.tone === "flag" ? TriangleAlert : CircleCheck,
					tone: ev.tone === "flag" ? "flag" : "approve",
					text: ev.text,
					time: formatRelativeTime(ev.time)
				}, i))
			})] })]
		})
	] });
}
function Kpi({ label, value, icon: Icon, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-8 w-8 place-items-center rounded-lg ${tone === "flag" ? "bg-[color:var(--flag)]/10 text-[color:var(--flag)]" : "bg-primary/10 text-primary"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 text-3xl font-semibold tracking-tight text-foreground",
			children: value
		})]
	});
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
function ActivityRow({ icon: Icon, tone, text, time }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start gap-3 px-5 py-3.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `mt-0.5 h-4 w-4 flex-shrink-0 ${tone === "approve" ? "text-[color:var(--approve)]" : "text-[color:var(--flag)]"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 text-sm text-foreground",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-shrink-0 text-xs text-muted-foreground",
				children: time
			})
		]
	});
}
function GccStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-sm font-semibold text-foreground",
		children: value
	})] });
}
function Sparkline({ data }) {
	const w = 640;
	const h = 140;
	const max = Math.max(...data, 1);
	const min = Math.min(...data, 0);
	const range = max - min || 1;
	const step = w / Math.max(data.length - 1, 1);
	const points = data.map((v, i) => {
		return [i * step, h - (v - min) / range * (h - 20) - 8];
	});
	const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
	const area = `${line} L${w},${h} L0,${h} Z`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "h-32 w-full",
		preserveAspectRatio: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "spark",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "var(--primary)",
					stopOpacity: "0.35"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "var(--primary)",
					stopOpacity: "0"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: area,
				fill: "url(#spark)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: line,
				fill: "none",
				stroke: "var(--primary)",
				strokeWidth: "2.5",
				strokeLinecap: "round"
			}),
			points.map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x,
				cy: y,
				r: "2.5",
				fill: "var(--primary)"
			}, i))
		]
	});
}
//#endregion
export { OverviewPage as component };
