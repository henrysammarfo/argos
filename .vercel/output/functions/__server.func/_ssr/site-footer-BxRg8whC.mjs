import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { _ as Menu, t as X, z as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-footer-BxRg8whC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		label: "Product",
		items: [
			{
				label: "Overview",
				to: "/product"
			},
			{
				label: "The agents",
				to: "/agents"
			},
			{
				label: "Kaspa escrow",
				to: "/escrow"
			}
		]
	},
	{
		label: "Solutions",
		items: [
			{
				label: "Public funders",
				to: "/product"
			},
			{
				label: "Foundations",
				to: "/product"
			},
			{
				label: "Enterprise procurement",
				to: "/product"
			}
		]
	},
	{
		label: "About",
		items: [
			{
				label: "Our mission",
				to: "/about"
			},
			{
				label: "Merch",
				to: "/merch"
			},
			{
				label: "Contact",
				to: "/about"
			}
		]
	},
	{
		label: "Pricing",
		to: "/pricing"
	}
];
function SiteNav({ transparent = true }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const [mobile, setMobile] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: `relative z-30 w-full ${transparent ? "" : "border-b border-border bg-background"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-12 lg:px-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
						size: 28,
						className: "text-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-medium tracking-tight text-foreground sm:text-xl",
						children: "ARGOS"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-1 md:flex",
					children: NAV.map((item) => item.items ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						onMouseEnter: () => setOpen(item.label),
						onMouseLeave: () => setOpen(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground",
							children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform duration-200 ${open === item.label ? "rotate-180" : ""}` })]
						}), open === item.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "liquid-glass animate-dropdown !absolute top-full left-0 min-w-[180px] rounded-xl px-2 py-3 shadow-xl",
							children: item.items.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: sub.to,
								className: "block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground",
								children: sub.label
							}, sub.label))
						})]
					}, item.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground",
						children: item.label
					}, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-3 md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-sm font-medium text-foreground/90 transition-colors hover:text-foreground",
						children: "Log in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "liquid-glass rounded-full px-5 py-2 text-sm font-medium text-foreground",
						children: "Create account"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "relative h-9 w-9 md:hidden",
					onClick: () => setMobile((m) => !m),
					"aria-label": "Toggle menu",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: `absolute inset-0 m-auto h-5 w-5 text-foreground transition-all duration-300 ${mobile ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: `absolute inset-0 m-auto h-5 w-5 text-foreground transition-all duration-300 ${mobile ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}` })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `absolute inset-x-4 top-full z-40 md:hidden ${mobile ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`,
			style: {
				transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
				transitionDuration: "400ms",
				transitionProperty: "opacity, transform"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-[oklch(0.18_0.012_260)]/95 p-6 backdrop-blur-xl",
				children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4",
					children: item.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "block text-base font-medium text-foreground",
						onClick: () => setMobile(false),
						children: item.label
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-base font-medium text-foreground",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-3 flex flex-col gap-2",
						children: item.items.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: sub.to,
							className: "text-sm text-foreground/70 hover:text-foreground",
							onClick: () => setMobile(false),
							children: sub.label
						}, sub.label))
					})] })
				}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3 border-t border-border pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-sm font-medium text-foreground/90",
						onClick: () => setMobile(false),
						children: "Log in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "liquid-glass rounded-full px-5 py-2 text-center text-sm font-medium text-foreground",
						onClick: () => setMobile(false),
						children: "Create account"
					})]
				})]
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 py-14 md:px-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
							size: 28,
							className: "text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-medium tracking-tight text-foreground",
							children: "ARGOS"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xs text-sm text-muted-foreground",
						children: "The many-eyed watcher for public capital. Evaluate every proposal. Miss nothing."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Product",
						links: [
							{
								label: "Overview",
								to: "/product"
							},
							{
								label: "Agents",
								to: "/agents"
							},
							{
								label: "Escrow",
								to: "/escrow"
							},
							{
								label: "Pricing",
								to: "/pricing"
							}
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Company",
						links: [
							{
								label: "About",
								to: "/about"
							},
							{
								label: "Merch",
								to: "/merch"
							},
							{
								label: "Log in",
								to: "/login"
							},
							{
								label: "Console",
								to: "/app"
							}
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Stack",
						links: [
							{
								label: "Fetch.ai uAgents",
								to: "/agents"
							},
							{
								label: "OpenAI GPT-4o",
								to: "/product"
							},
							{
								label: "Kaspa escrow",
								to: "/escrow"
							},
							{
								label: "GCC Category 1",
								to: "/about"
							}
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "© 2026 ARGOS. Built for Demo Day at Imperial College London." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Henry Sam Marfo · github.com/henrysammarfo" })]
			})]
		})
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 text-xs font-semibold tracking-wider text-foreground uppercase",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2.5",
		children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: l.to,
			className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
			children: l.label
		}) }, l.label))
	})] });
}
//#endregion
export { SiteNav as n, SiteFooter as t };
