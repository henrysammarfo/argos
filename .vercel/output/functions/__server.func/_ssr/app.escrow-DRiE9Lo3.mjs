import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as Coins, R as CircleCheck, b as Lock, j as ExternalLink, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as useApproveMilestone, f as useEscrows } from "./api-hooks-DvdUOF82.mjs";
import { n as ApiLoading, t as ApiError } from "./api-state-BXh1YwMO.mjs";
import { a as EmptyState, o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.escrow-DRiE9Lo3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Kaspa testnet/mainnet explorer helpers (aligned with backend kaspa_network). */
function kaspaExplorerAddressUrl(address, network = "kaspatest") {
	return `${network === "kaspatest" || network === "testnet-10" ? "https://explorer-tn10.kaspa.org/addresses" : "https://explorer.kaspa.org/addresses"}/${address}`;
}
function kaspaExplorerTxUrl(txid, network = "kaspatest") {
	return `${network === "kaspatest" || network === "testnet-10" ? "https://explorer-tn10.kaspa.org/txs" : "https://explorer.kaspa.org/txs"}/${txid}`;
}
function EscrowPage() {
	const { data: apiData, isLoading, isError, refetch } = useEscrows();
	const approveMilestone = useApproveMilestone();
	const [actionMsg, setActionMsg] = (0, import_react.useState)("");
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiLoading, { label: "Loading Kaspa escrows…" });
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiError, {
		message: "Cannot load escrows from API.",
		onRetry: () => void refetch()
	});
	const apiEscrows = apiData?.escrows ?? [];
	const total = apiEscrows.reduce((a, b) => a + b.total_kas, 0);
	const released = apiEscrows.reduce((a, e) => {
		return a + e.milestones.filter((m) => m.status === "released").reduce((s, m) => s + (m.kas_amount ?? 0), 0);
	}, 0);
	const handleSignRelease = async (escrowId, milestoneIndex) => {
		setActionMsg("");
		try {
			const { submitMilestone, approveMilestone: approve } = await import("./api-hooks-DvdUOF82.mjs").then((n) => n.t).then((n) => n.b);
			const result = await approve((await submitMilestone({
				escrow_id: escrowId,
				milestone_index: milestoneIndex,
				report_text: "Milestone deliverables completed per grant agreement.",
				promised_deliverables: ["Phase deliverables as defined in grant contract"]
			})).submission_id, "Committee approved release");
			setActionMsg(`Released ${result.kas_released} KAS — TX: ${result.release_tx_hash}`);
		} catch (e) {
			setActionMsg(e instanceof Error ? e.message : "Release failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Escrow",
			title: "Kaspa contracts",
			description: "Live milestone escrow — funds release only after AI verification + human approval."
		}),
		actionMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6 md:px-8",
			children: actionMsg
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 sm:grid-cols-3 sm:p-6 md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreasuryStat, {
					label: "Under management",
					value: `${total.toLocaleString()} KAS`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreasuryStat, {
					label: "Released",
					value: `${released.toLocaleString()} KAS`,
					tone: "approve"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreasuryStat, {
					label: "Locked",
					value: `${(total - released).toLocaleString()} KAS`,
					tone: "primary"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4 px-4 pb-8 sm:px-6 md:space-y-6 md:px-8",
			children: apiEscrows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Coins,
				title: "No escrows yet",
				description: "Create an escrow after selecting a grant winner from an evaluation round."
			}) }) : apiEscrows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiEscrowCard, {
				escrow: c,
				onSignRelease: (idx) => void handleSignRelease(c.id, idx),
				releasing: approveMilestone.isPending
			}, c.id))
		})
	] });
}
function ApiEscrowCard({ escrow, onSignRelease, releasing }) {
	const released = escrow.milestones.filter((m) => m.status === "released").reduce((s, m) => s + (m.kas_amount ?? 0), 0);
	const pct = Math.round(released / escrow.total_kas * 100) || 0;
	const explorerUrl = kaspaExplorerAddressUrl(escrow.escrow_address);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border p-5 md:flex md:flex-wrap md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
					children: [
						escrow.id.slice(0, 8),
						"… · ",
						escrow.status
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 truncate text-base font-semibold text-foreground md:text-lg",
					children: [
						"Proposal ",
						escrow.grantee_proposal_id.slice(0, 8),
						"…"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-[color:var(--approve)]",
						style: { width: `${pct}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [pct, "% released"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-right",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xl font-semibold tracking-tight text-foreground md:text-2xl",
				children: [escrow.total_kas.toLocaleString(), " KAS"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: explorerUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline",
				children: [
					escrow.escrow_address.slice(0, 20),
					"… ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })
				]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border",
		children: escrow.milestones.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MilestoneRow, {
			name: m.name,
			dueDate: m.date ?? "—",
			kas: (m.kas_amount ?? m.percent / 100 * escrow.total_kas).toLocaleString(),
			percent: m.percent,
			status: m.status,
			releaseTx: m.release_tx,
			onRelease: m.status === "locked" ? () => onSignRelease(idx) : void 0,
			releasing
		}, idx))
	})] });
}
function MilestoneRow({ name, dueDate, kas, percent, status, releaseTx, onRelease, releasing }) {
	const isReleased = status === "released";
	const isVerifying = status === "verifying";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-9 w-9 place-items-center rounded-full border-2 ${isReleased ? "border-[color:var(--approve)] bg-[color:var(--approve)]/10 text-[color:var(--approve)]" : isVerifying ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`,
				children: isReleased ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : isVerifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm font-semibold text-foreground",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: ["Due ", dueDate]
					}),
					releaseTx && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: kaspaExplorerTxUrl(releaseTx),
						target: "_blank",
						rel: "noopener noreferrer",
						className: "mt-1 inline-flex items-center gap-1 text-[10px] text-primary hover:underline",
						children: [
							"TX ",
							releaseTx.slice(0, 12),
							"… ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-sm text-foreground",
					children: [kas, " KAS"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [percent, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-3 md:col-span-1",
				children: onRelease ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onRelease,
					disabled: releasing,
					className: "w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 md:w-auto",
					children: "Approve release"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `inline-flex rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${isReleased ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]" : "bg-muted text-muted-foreground"}`,
					children: status
				})
			})
		]
	});
}
function TreasuryStat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-2 text-2xl font-semibold tracking-tight ${tone === "approve" ? "text-[color:var(--approve)]" : tone === "primary" ? "text-primary" : "text-foreground"}`,
			children: value
		})]
	});
}
//#endregion
export { EscrowPage as component };
