import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileSearch, F as Coins, K as ArrowRight, N as Cpu, r as Users } from "../_libs/lucide-react.mjs";
import { t as SiteFooter } from "./site-footer-BxRg8whC.mjs";
import { t as VideoHero } from "./video-hero-r4e446MC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-CrtBTB-L.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		icon: FileSearch,
		kicker: "01 · Intake",
		title: "Every proposal, in the same shape.",
		body: "PDF, URL, or plain text goes in. Structured extractions — objectives, workplan, budget, milestones, team, prior work — come out. Nothing hand-typed. Nothing lost between reviewers.",
		bullets: [
			"PyMuPDF + OpenAI GPT-4o for high-fidelity extraction",
			"URL fetch + HTML → markdown pipeline",
			"Normalized budget lines and timelines"
		]
	},
	{
		icon: Cpu,
		kicker: "02 · Evaluate",
		title: "Three evaluators, in parallel, with reasoning.",
		body: "Technical, Impact, and Team agents each score against your rubric weights. Every number carries a cited rationale. Disagreement between agents triggers a human review flag automatically.",
		bullets: [
			"Rubric weights configurable per round",
			"OpenAI reasoning attached to every score",
			"Confidence bands drive the review queue"
		]
	},
	{
		icon: Users,
		kicker: "03 · Approve",
		title: "Humans see the edge cases only.",
		body: "Reviewers land on a queue of flagged proposals — not fifty PDFs. Approve, override with a note, or send back for re-scoring. Every action lives in the audit log.",
		bullets: [
			"Flag reasons: low confidence, agent disagreement, budget outlier",
			"Overrides recorded with reviewer identity and rationale",
			"Immutable decision trail"
		]
	},
	{
		icon: Coins,
		kicker: "04 · Pay on delivery",
		title: "Milestone escrow, not lump-sum wire.",
		body: "Approved grants create a Kaspa conditional escrow. Funds release milestone by milestone, verified by the Milestone agent and signed on-chain. No dead capital sitting in a checking account.",
		bullets: [
			"Covenant logic on Kaspa BlockDAG",
			"Milestone agent verifies public artifacts",
			"Program admin co-signs release"
		]
	}
];
function ProductPage() {
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
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl",
								children: "Four stages. One auditable pipeline."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg",
								children: "From upload to release — how ARGOS moves a round of grant applications through review without dropping the paper trail."
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-6 py-24 md:px-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-24",
					children: sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `grid gap-10 md:grid-cols-2 md:items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5 text-primary" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 font-mono text-xs tracking-wider text-primary uppercase",
								children: s.kicker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-2xl font-medium tracking-tight text-foreground md:text-4xl",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-muted-foreground",
								children: s.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 space-y-2 text-sm text-foreground",
								children: s.bullets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1 w-1 rounded-full bg-primary" }), b]
								}, b))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-border bg-card p-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/10 via-muted/40 to-transparent p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] tracking-widest text-muted-foreground uppercase",
									children: "Stage output"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StagePreview, { index: i })]
							})
						})]
					}, s.kicker))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-24 rounded-2xl border border-border bg-card p-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-medium tracking-tight text-foreground md:text-3xl",
							children: "Ready to move a round?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-md text-muted-foreground",
							children: "The console ships with 47 real climate-round proposals for you to walk through."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							className: "mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
							children: ["Open the console ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function StagePreview({ index }) {
	if (index === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-2 font-mono text-xs text-foreground/80",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "title: \"Coastal aquifer resilience...\"" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "budget_kas: 180000" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "milestones: 4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "team_size: 6" })
		]
	});
	if (index === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 space-y-3",
		children: [
			{
				label: "Technical",
				v: 84
			},
			{
				label: "Impact",
				v: 91
			},
			{
				label: "Team",
				v: 76
			}
		].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: r.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground",
				children: r.v
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 h-1 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-primary",
				style: { width: `${r.v}%` }
			})
		})] }, r.label))
	});
	if (index === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-2 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-[oklch(0.78_0.16_70)]/40 bg-[oklch(0.78_0.16_70)]/10 p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[oklch(0.78_0.16_70)]",
				children: "Flagged — low confidence on team score"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border p-3 text-muted-foreground",
			children: "Approved by Dr. K. Adeyemi · 2 days ago"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-2 font-mono text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[oklch(0.75_0.15_150)]",
				children: "✓ M1 · released · 36,000 KAS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[oklch(0.75_0.15_150)]",
				children: "✓ M2 · released · 72,000 KAS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-primary",
				children: "◐ M3 · verifying · 45,000 KAS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: "◯ M4 · locked · 27,000 KAS"
			})
		]
	});
}
//#endregion
export { ProductPage as component };
