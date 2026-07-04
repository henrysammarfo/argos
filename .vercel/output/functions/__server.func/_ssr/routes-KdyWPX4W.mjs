import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { F as Coins, K as ArrowRight, R as CircleCheck, W as ArrowUpRight, n as Workflow, o as Sparkles, s as ShieldCheck, u as ScanEye } from "../_libs/lucide-react.mjs";
import { t as SiteFooter } from "./site-footer-BxRg8whC.mjs";
import { d as useDashboardStats } from "./api-hooks-DvdUOF82.mjs";
import { t as VideoHero } from "./video-hero-r4e446MC.mjs";
import { t as LiveMilestonePreview } from "./live-escrow-preview-BEHWLbqy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-KdyWPX4W.js
var import_jsx_runtime = require_jsx_runtime();
function LiveStatsStrip() {
	const { data } = useDashboardStats();
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: "—",
			label: "active rounds"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: "—",
			label: "proposals evaluated"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: "—",
			label: "flagged for review"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: "—",
			label: "KAS under escrow"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: data.active_rounds.toString(),
			label: "active rounds"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: data.complete_proposals.toString(),
			label: "proposals evaluated"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: data.flagged_proposals.toString(),
			label: "flagged for review"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			kpi: `${(data.escrow_managed_kas / 1e3).toFixed(0)}K`,
			label: "KAS under escrow"
		})
	] });
}
function Stat({ kpi, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-3xl font-medium tracking-tight text-foreground md:text-4xl",
		children: kpi
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-sm text-muted-foreground",
		children: label
	})] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoHero, {
				fullscreen: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-start justify-center px-6 pt-16 sm:pt-20 md:pt-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-3xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
								children: [
									"Evaluate every",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"proposal. Miss",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"nothing."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:mt-8 sm:text-base md:text-lg",
								children: "ARGOS runs a team of AI agents across your grant round in parallel — every score explained, every edge case flagged for humans, every milestone paid on Kaspa escrow."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-white/90 sm:px-6 sm:py-3",
									children: "Open the console"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/product",
									className: "liquid-glass rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:px-6 sm:py-3",
									children: "See it live"
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4 md:px-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStatsStrip, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-6 py-24 md:px-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), "How ARGOS works"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-3xl font-medium tracking-tight text-foreground md:text-5xl",
							children: "A committee that never gets tired."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base text-muted-foreground",
							children: "Upload the round. Watch fifty proposals move through the same rubric, in parallel, with reasoning attached to every score."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 grid gap-6 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
							icon: ScanEye,
							step: "01",
							title: "Ingest",
							body: "PDF, URL, or plain text — the Intake agent extracts every claim, budget line, and milestone into a normalized shape."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
							icon: Workflow,
							step: "02",
							title: "Evaluate in parallel",
							body: "Technical, Impact, and Team agents score against your rubric simultaneously. Every score comes with cited reasoning."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
							icon: ShieldCheck,
							step: "03",
							title: "Human-approved",
							body: "Reviewers see only the edge cases where agents disagree or confidence is low. Approve, override, or flag in one click."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-card/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-24 md:px-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-start justify-between gap-6 md:flex-row md:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-medium tracking-tight text-foreground md:text-4xl",
								children: "Five agents. One rubric. Every proposal."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-muted-foreground",
								children: "Registered on Agentverse, discoverable via ASI:One, powered by OpenAI gpt-4o for reasoning."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/agents",
							className: "inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline",
							children: ["See the full lineup ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							{
								name: "Orchestrator",
								role: "Coordinator"
							},
							{
								name: "Intake Agent",
								role: "Ingestion"
							},
							{
								name: "Technical Agent",
								role: "Evaluator"
							},
							{
								name: "Impact Agent",
								role: "Evaluator"
							},
							{
								name: "Team Agent",
								role: "Evaluator"
							},
							{
								name: "Milestone Agent",
								role: "Verifier"
							}
						].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
									size: 22,
									className: "text-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] tracking-wider text-muted-foreground uppercase",
									children: "on Agentverse"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs tracking-wider text-muted-foreground uppercase",
									children: a.role
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-lg font-medium text-foreground",
									children: a.name
								})]
							})]
						}, a.name))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 py-24 md:px-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 md:grid-cols-2 md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3.5 w-3.5 text-primary" }), "Milestone escrow"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-3xl font-medium tracking-tight text-foreground md:text-4xl",
							children: "Money moves when deliverables do."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted-foreground",
							children: "Each approved grant creates a Kaspa conditional escrow. Funds release milestone by milestone — verified by the Milestone agent, signed by human approval, settled on-chain."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-8 space-y-3",
							children: [
								"Covenant logic locks funds against defined deliverables",
								"Milestone verifier signs release transactions",
								"Full audit trail on the Kaspa BlockDAG"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-primary" }), t]
							}, t))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/escrow",
							className: "mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline",
							children: ["How the escrow works ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMilestonePreview, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl px-6 py-24 text-center md:px-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-medium tracking-tight text-foreground md:text-5xl",
							children: "Ready to move a six-week backlog in an afternoon?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-4 max-w-xl text-muted-foreground",
							children: "Open the console — every page polls the live FastAPI backend in real time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
								children: "Open the console"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pricing",
								className: "rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted",
								children: "See pricing"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function StepCard({ icon: Icon, step, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-xs text-muted-foreground",
					children: step
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 text-xl font-medium text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted-foreground",
				children: body
			})
		]
	});
}
//#endregion
export { Home as component };
