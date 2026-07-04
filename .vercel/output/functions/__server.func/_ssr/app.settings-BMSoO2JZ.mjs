import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as CircleX, R as CircleCheck, d as Save, j as ExternalLink, v as Mail, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as useHealthCheck, v as useHealthDb, y as useHealthKaspa } from "./api-hooks-DvdUOF82.mjs";
import { r as useAuth } from "./auth-context-7Y8pc-KD.mjs";
import { o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
import { t as Route } from "./app.settings-CBRXJ5CA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.settings-BMSoO2JZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"Account",
	"Rubric",
	"Organization",
	"API keys",
	"Notifications"
];
function SettingsPage() {
	const { tab: tabParam } = Route.useSearch();
	const [tab, setTab] = (0, import_react.useState)(tabParam || "Account");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const handleSave = () => {
		localStorage.setItem("argos-settings", JSON.stringify({
			rubric: {
				technical: Number(document.getElementById("rubric-tech")?.value),
				impact: Number(document.getElementById("rubric-impact")?.value),
				team: Number(document.getElementById("rubric-team")?.value)
			},
			org: {
				name: document.getElementById("org-name")?.value,
				admin: document.getElementById("org-admin")?.value,
				escrow: document.getElementById("org-escrow")?.value
			}
		}));
		setSaved(true);
		setTimeout(() => setSaved(false), 3e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Settings",
			title: "Program settings",
			description: "Defaults, API connectivity, and notification preferences.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleSave,
				className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
					" ",
					saved ? "Saved" : "Save changes"
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-background px-4 sm:px-6 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: t
				}, t))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8",
			children: [
				tab === "Account" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountPanel, {}),
				tab === "Rubric" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricPanel, {}),
				tab === "Organization" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgPanel, {}),
				tab === "API keys" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiPanel, {}),
				tab === "Notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifPanel, {})
			]
		})
	] });
}
function AccountPanel() {
	const { user, email, emailVerified, organizationName, verifyEmailCode, resendVerificationCode, refreshUser } = useAuth();
	const [code, setCode] = (0, import_react.useState)("");
	const [demoCode, setDemoCode] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleVerify = async () => {
		setLoading(true);
		setMsg("");
		try {
			await verifyEmailCode(code.trim());
			await refreshUser();
			setMsg("Email verified successfully.");
			setCode("");
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Verification failed");
		} finally {
			setLoading(false);
		}
	};
	const handleResend = async () => {
		setLoading(true);
		setMsg("");
		try {
			const newCode = await resendVerificationCode();
			if (newCode) setDemoCode(newCode);
			setMsg("New verification code generated.");
		} catch (e) {
			setMsg(e instanceof Error ? e.message : "Could not resend");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 md:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-foreground",
				children: "Account & email"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Your login email and verification status for this isolated workspace."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-1 flex items-center gap-2 text-sm font-medium text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary" }), email || user?.email]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: "Organization (tenant)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm text-foreground",
						children: organizationName
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: "Email verified"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1",
						children: emailVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-sm text-[color:var(--approve)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Verified"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-sm text-[color:var(--flag)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }), " Pending verification"]
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
						children: "Role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 text-sm capitalize text-foreground",
						children: user?.role ?? "admin"
					})] })
				]
			}),
			!emailVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-border bg-muted/30 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-foreground",
						children: "Verify your email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Enter the 6-digit code from signup (demo mode — no SMTP). This confirms the address above is yours."
					}),
					demoCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-sm text-primary",
						children: ["Demo code: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: demoCode })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: code,
								onChange: (e) => setCode(e.target.value),
								placeholder: "000000",
								maxLength: 6,
								className: "w-32 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm tracking-widest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void handleVerify(),
								disabled: loading || code.length < 6,
								className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Verify email"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void handleResend(),
								disabled: loading,
								className: "rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted",
								children: "Resend code"
							})
						]
					})
				]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-primary",
				children: msg
			})
		]
	});
}
function RubricPanel() {
	const rubric = (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("argos-settings") ?? "{}") : {}).rubric ?? {
		technical: 35,
		impact: 40,
		team: 25
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 md:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-foreground",
				children: "Default rubric weights"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Must sum to 100. Applied to new rounds."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 max-w-md space-y-5",
				children: [
					{
						label: "Technical",
						id: "rubric-tech",
						v: rubric.technical
					},
					{
						label: "Impact",
						id: "rubric-impact",
						v: rubric.impact
					},
					{
						label: "Team",
						id: "rubric-team",
						v: rubric.team
					}
				].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: r.id,
						className: "font-medium text-foreground",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-foreground",
						children: [r.v, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: r.id,
					type: "range",
					min: 0,
					max: 100,
					defaultValue: r.v,
					className: "mt-2 w-full accent-primary"
				})] }, r.id))
			})
		]
	});
}
function OrgPanel() {
	const { organizationName } = useAuth();
	const org = (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("argos-settings") ?? "{}") : {}).org ?? {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 md:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold text-foreground",
			children: "Organization"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 md:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "org-name",
					label: "Program name",
					defaultValue: organizationName || org.name || "Your program"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "org-escrow",
					label: "Escrow wallet",
					defaultValue: org.escrow ?? "kaspa:qz7...9k3f",
					mono: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "org-admin",
					label: "Program admin email",
					defaultValue: org.admin ?? ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Timezone",
					defaultValue: "Europe/London"
				})
			]
		})]
	});
}
function ApiPanel() {
	const { data: health } = useHealthCheck();
	const { data: dbHealth } = useHealthDb();
	const { data: kaspaHealth } = useHealthKaspa();
	const services = [
		{
			name: "ARGOS API",
			ok: health?.status === "ok",
			detail: health?.service ?? "—"
		},
		{
			name: "PostgreSQL",
			ok: dbHealth?.status === "ok",
			detail: dbHealth?.database ?? "—"
		},
		{
			name: "Kaspa REST",
			ok: kaspaHealth?.status === "ok",
			detail: kaspaHealth?.kaspa ?? "—"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 md:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-foreground",
				children: "Service health"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border",
				children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [s.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-[color:var(--approve)]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-foreground",
							children: s.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: s.detail
					})]
				}, s.name))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 md:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-foreground",
						children: "Required API keys"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/settings",
						className: "text-xs font-medium text-primary hover:underline",
						onClick: () => window.open("/docs/API_KEYS.md", "_blank"),
						children: "Full setup guide"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Keys are set in backend ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1",
							children: ".env"
						}),
						" — never commit them. See",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://github.com/henrysammarfo/argos/blob/main/docs/API_KEYS.md",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-primary hover:underline",
							children: "docs/API_KEYS.md"
						}),
						" ",
						"for step-by-step instructions."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 divide-y divide-border",
					children: [
						{
							name: "OpenAI",
							env: "OPENAI_API_KEY",
							url: "https://platform.openai.com/api-keys",
							desc: "Live proposal scoring via gpt-4o"
						},
						{
							name: "JWT session",
							env: "JWT_SECRET",
							url: null,
							desc: "Email/password signup — multi-tenant org isolation"
						},
						{
							name: "ASI:One",
							env: "ASI_ONE_API_KEY",
							url: "https://asi1.ai",
							desc: "Fetch.ai ASI:One discovery demo"
						},
						{
							name: "Agentverse",
							env: "AGENTVERSE_API_KEY (optional)",
							url: "https://agentverse.ai",
							desc: "Register 6 uAgents for Fetch bounty"
						},
						{
							name: "Kaspa",
							env: "KASPA_SEED_PHRASE",
							url: "https://kaspium.io",
							desc: "Milestone escrow releases"
						}
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-foreground",
									children: k.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-mono text-xs text-muted-foreground",
									children: k.env
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: k.desc
								})
							] }), k.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: k.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline",
								children: ["Get key ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
							})]
						})
					}, k.name))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 md:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-foreground",
				children: "Frontend env"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground",
				children: `VITE_API_BASE_URL=http://localhost:8000/api

# Sign up at /signup — JWT stored in sessionStorage after login.`
			})]
		})
	] });
}
function NotifPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5 md:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold text-foreground",
			children: "Notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 divide-y divide-border",
			children: [
				{
					k: "Round starts",
					d: "When a new grant round is created.",
					default: true
				},
				{
					k: "Flagged for review",
					d: "When agents flag a proposal for human review.",
					default: true
				},
				{
					k: "Milestone verified",
					d: "When Milestone Agent verifies a progress report.",
					default: true
				},
				{
					k: "Escrow release",
					d: "When KAS is released after committee approval.",
					default: true
				}
			].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start justify-between gap-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium text-foreground",
						children: o.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: o.d
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative inline-flex cursor-pointer items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							defaultChecked: o.default,
							className: "peer sr-only"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" })
					]
				})]
			}, o.k))
		})]
	});
}
function Field({ id, label, defaultValue, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		defaultValue,
		className: `mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 ${mono ? "font-mono" : ""}`
	})] });
}
//#endregion
export { SettingsPage as component };
