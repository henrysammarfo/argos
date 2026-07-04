import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { C as LayoutDashboard, F as Coins, N as Cpu, S as LifeBuoy, U as Bell, _ as Menu, a as Sun, c as Settings, h as Moon, k as FileStack, l as Search, r as Users, t as X, y as LogOut, z as ChevronDown } from "../_libs/lucide-react.mjs";
import { _ as useHealthCheck } from "./api-hooks-DvdUOF82.mjs";
import { r as useAuth } from "./auth-context-7Y8pc-KD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-shell-BBbx_6OB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "argos-console-theme";
var ThemeContext = (0, import_react.createContext)(null);
function readStoredTheme() {
	if (typeof window === "undefined") return "stripe-light";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "stripe-dark" || stored === "stripe-light") return stored;
	return "stripe-light";
}
function ConsoleThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("stripe-light");
	(0, import_react.useEffect)(() => {
		setThemeState(readStoredTheme());
	}, []);
	const setTheme = (next) => {
		setThemeState(next);
		localStorage.setItem(STORAGE_KEY, next);
	};
	const toggleTheme = () => {
		setTheme(theme === "stripe-light" ? "stripe-dark" : "stripe-light");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			setTheme,
			toggleTheme
		},
		children
	});
}
function useConsoleTheme() {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) throw new Error("useConsoleTheme must be used within ConsoleThemeProvider");
	return ctx;
}
function themeClassName(theme) {
	return theme === "stripe-dark" ? "theme-stripe-dark" : "theme-stripe-light";
}
var NAV = [
	{
		to: "/app",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/app/evaluations",
		label: "Evaluations",
		icon: FileStack,
		exact: false
	},
	{
		to: "/app/setup",
		label: "New Round",
		icon: FileStack,
		exact: true
	},
	{
		to: "/app/agents",
		label: "Agents",
		icon: Cpu,
		exact: false
	},
	{
		to: "/app/escrow",
		label: "Escrow",
		icon: Coins,
		exact: false
	},
	{
		to: "/app/settings",
		label: "Settings",
		icon: Settings,
		exact: false
	}
];
function DashboardShell({ children }) {
	const pathname = useRouterState({ select: (r) => r.location.pathname });
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const { theme, toggleTheme } = useConsoleTheme();
	const { data: health } = useHealthCheck();
	const { email, logout, organizationName } = useAuth();
	const navigate = useNavigate();
	const apiOnline = health?.status === "ok";
	const initials = email ? email.split("@")[0].slice(0, 2).toUpperCase() : "AD";
	const handleLogout = () => {
		logout();
		navigate({ to: "/login" });
	};
	const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${themeClassName(theme)} flex min-h-dvh bg-background text-foreground`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {
					isActive,
					onNavigate: () => setMobileOpen(false)
				})
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				role: "dialog",
				"aria-modal": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Close menu",
					onClick: () => setMobileOpen(false),
					className: "absolute inset-0 bg-black/40"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {
						isActive,
						onNavigate: () => setMobileOpen(false)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6 md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Open menu",
							onClick: () => setMobileOpen(true),
							className: "rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-2 lg:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
								size: 22,
								className: "text-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-semibold tracking-tight text-foreground",
								children: "ARGOS"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative hidden max-w-md flex-1 md:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								placeholder: "Search proposals, agents, contracts…",
								className: "w-full rounded-lg border border-border bg-background py-2 pr-4 pl-9 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `hidden rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase sm:inline-flex ${apiOnline ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]" : "bg-[color:var(--flag)]/10 text-[color:var(--flag)]"}`,
									children: ["API ", apiOnline ? "online" : "offline"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": theme === "stripe-light" ? "Switch to dark mode" : "Switch to light mode",
									onClick: toggleTheme,
									className: "rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
									children: theme === "stripe-light" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Help",
									className: "hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									"aria-label": "Notifications",
									className: "relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleLogout,
									"aria-label": "Log out",
									className: "rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "ml-1 inline-flex items-center gap-2 rounded-full border border-border bg-background py-1 pr-3 pl-1 text-sm text-foreground shadow-sm hover:bg-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary",
											children: initials
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden max-w-[120px] truncate sm:inline",
											children: email.split("@")[0]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "hidden h-3.5 w-3.5 text-muted-foreground sm:inline" })
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 overflow-y-auto",
					children
				})]
			})
		]
	});
}
function SidebarInner({ isActive, onNavigate }) {
	const { theme } = useConsoleTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-16 items-center justify-between border-b border-sidebar-border px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				onClick: onNavigate,
				className: "inline-flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
					size: 26,
					className: "text-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg font-semibold tracking-tight text-sidebar-foreground",
					children: "ARGOS"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Close menu",
				onClick: onNavigate,
				className: "rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "flex-1 space-y-0.5 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarSection, { label: "Workspace" }),
				NAV.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					item,
					active: isActive(item.to, item.exact),
					onNavigate
				}, item.to)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarSection, { label: "Treasury" }),
				NAV.slice(3, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					item,
					active: isActive(item.to, item.exact),
					onNavigate
				}, item.to)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarSection, { label: "Admin" }),
				NAV.slice(4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					item,
					active: isActive(item.to, item.exact),
					onNavigate
				}, item.to))
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-sidebar-border p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-sidebar-border bg-sidebar-accent p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-medium text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), " ARGOS Console"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [organizationName || "Your workspace", " · live API"]
				})]
			})
		})
	] });
}
function SidebarSection({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-3 pt-4 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase",
		children: label
	});
}
function NavLink({ item, active, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.to,
		onClick: onNavigate,
		className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: `h-4 w-4 ${active ? "text-primary" : ""}` }), item.label]
	});
}
function PageHeader({ eyebrow, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border bg-background px-4 py-6 sm:px-6 md:flex md:flex-wrap md:items-end md:justify-between md:gap-6 md:px-8 md:py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold tracking-wider text-primary uppercase",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl",
					children: title
				}),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: description
				})
			]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-shrink-0 items-center gap-2",
			children: actions
		})]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-xl border border-border bg-card shadow-sm ${className}`,
		children
	});
}
function CardHeader({ title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold text-foreground",
			children: title
		}), action]
	});
}
function EmptyState({ icon: Icon, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-base font-semibold text-foreground",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-sm text-sm text-muted-foreground",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: action
			})
		]
	});
}
//#endregion
export { EmptyState as a, DashboardShell as i, CardHeader as n, PageHeader as o, ConsoleThemeProvider as r, Card as t };
