import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as hasAuthSession, t as AuthProvider } from "./auth-context-7Y8pc-KD.mjs";
import { t as Route$15 } from "./app.evaluations._id-KRLRLMy9.mjs";
import { t as Route$16 } from "./app.proposals._id-YW5wZZ_h.mjs";
import { t as Route$17 } from "./app.settings-CBRXJ5CA.mjs";
import { t as Route$18 } from "./login-ChopFhdz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bk6j8vtR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-nvY9NSpd.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ARGOS — AI Grant & Procurement Evaluation" },
			{
				name: "description",
				content: "ARGOS evaluates grant proposals in parallel with a team of AI agents. 6 weeks of committee review, done in 8 hours — every step auditable, every milestone paid on Kaspa escrow."
			},
			{
				name: "author",
				content: "ARGOS"
			},
			{
				property: "og:title",
				content: "ARGOS — AI Grant & Procurement Evaluation"
			},
			{
				property: "og:description",
				content: "50 proposals in parallel in 4 minutes. Humans review the 8 that matter. Milestone payments locked in Kaspa escrow until deliverables verify."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@ARGOS"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "stylesheet",
				href: "https://db.onlinewebfonts.com/c/08e020de1811ec4489f82d1247a42c09?family=Helvetica+Now+Text"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "dark",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$13 = () => import("./signup-BYRAW9iD.mjs");
var Route$13 = createFileRoute("/signup")({
	beforeLoad: () => {
		if (typeof window !== "undefined" && hasAuthSession()) throw redirect({ to: "/app" });
	},
	head: () => ({ meta: [{ title: "Create account — ARGOS" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./product-CrtBTB-L.mjs");
var Route$12 = createFileRoute("/product")({
	head: () => ({ meta: [
		{ title: "Product — ARGOS" },
		{
			name: "description",
			content: "The ARGOS product tour: intake, multi-agent evaluation, human-in-the-loop review, and Kaspa milestone escrow."
		},
		{
			property: "og:title",
			content: "Product — ARGOS"
		},
		{
			property: "og:description",
			content: "Four stages, one auditable pipeline for grant and procurement evaluation."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./pricing--ChDmjrL.mjs");
var Route$11 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: "Pricing — ARGOS" },
		{
			name: "description",
			content: "Pilot, Program, and Enterprise plans for grant funders using ARGOS."
		},
		{
			property: "og:title",
			content: "Pricing — ARGOS"
		},
		{
			property: "og:description",
			content: "Simple pricing that scales with your grant volume."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./merch-DlQFLXk8.mjs");
var Route$10 = createFileRoute("/merch")({
	head: () => ({ meta: [
		{ title: "Merch — ARGOS" },
		{
			name: "description",
			content: "The ARGOS aperture mark in the wild — hoodies, tees, totes, and stickers for the team, the demo day, and everyone who shipped."
		},
		{
			property: "og:title",
			content: "Merch — ARGOS"
		},
		{
			property: "og:description",
			content: "Wear the many-eyed watcher. Demo-day capsule."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./escrow-BuEGs2kX.mjs");
var Route$9 = createFileRoute("/escrow")({
	head: () => ({ meta: [
		{ title: "Kaspa escrow — ARGOS" },
		{
			name: "description",
			content: "Conditional milestone escrow on Kaspa BlockDAG. Funds release when deliverables verify, not before."
		},
		{
			property: "og:title",
			content: "Kaspa escrow — ARGOS"
		},
		{
			property: "og:description",
			content: "Milestone-based fund release, covenant-locked on Kaspa, verified by an AI + human loop."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./app-CQtMh14R.mjs");
var Route$8 = createFileRoute("/app")({
	beforeLoad: ({ location }) => {
		if (typeof window !== "undefined" && !hasAuthSession()) throw redirect({
			to: "/login",
			search: { redirect: location.pathname }
		});
	},
	head: () => ({ meta: [
		{ title: "Console — ARGOS" },
		{
			name: "description",
			content: "The ARGOS evaluation console."
		},
		{
			property: "og:title",
			content: "Console — ARGOS"
		},
		{
			property: "og:description",
			content: "The ARGOS evaluation console."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./agents-Z_3Vm7_h.mjs");
var Route$7 = createFileRoute("/agents")({
	head: () => ({ meta: [{ title: "The agents — ARGOS" }, {
		name: "description",
		content: "Six Fetch.ai uAgents power ARGOS: Orchestrator, Intake, Technical, Impact, Team, Milestone."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./about-BRU5xC1n.mjs");
var Route$6 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About — ARGOS" },
		{
			name: "description",
			content: "ARGOS is built for public capital: faster evaluation, more accountable payouts, fully auditable decisions."
		},
		{
			property: "og:title",
			content: "About — ARGOS"
		},
		{
			property: "og:description",
			content: "Our mission, alignment with GCC Category 1, and the builder behind ARGOS."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./routes-KdyWPX4W.mjs");
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ARGOS — Evaluate every proposal. Miss nothing." },
		{
			name: "description",
			content: "50 grant proposals from 6 weeks of committee review to 8 hours. Multi-agent AI scoring, human-approved, milestone payments locked in Kaspa escrow."
		},
		{
			property: "og:title",
			content: "ARGOS — Evaluate every proposal. Miss nothing."
		},
		{
			property: "og:description",
			content: "Multi-agent AI evaluation for grants and procurement. Fetch.ai + OpenAI + Kaspa. 25× faster, fully auditable."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./app.index-DPNtYLoj.mjs");
var Route$4 = createFileRoute("/app/")({
	head: () => ({ meta: [{ title: "Overview — ARGOS Console" }, {
		name: "description",
		content: "ARGOS console overview: rounds, KPIs, agent health."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./app.setup-B3Cpbu9w.mjs");
var Route$3 = createFileRoute("/app/setup")({
	head: () => ({ meta: [{ title: "New Evaluation — ARGOS Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./app.escrow-DRiE9Lo3.mjs");
var Route$2 = createFileRoute("/app/escrow")({
	head: () => ({ meta: [{ title: "Escrow — ARGOS Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./app.agents-nfH42C1Y.mjs");
var Route$1 = createFileRoute("/app/agents")({
	head: () => ({ meta: [{ title: "Agents — ARGOS Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./app.evaluations.index-DPmVkf51.mjs");
var Route = createFileRoute("/app/evaluations/")({
	head: () => ({ meta: [{ title: "Evaluations — ARGOS Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SignupRoute = Route$13.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$14
});
var ProductRoute = Route$12.update({
	id: "/product",
	path: "/product",
	getParentRoute: () => Route$14
});
var PricingRoute = Route$11.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$14
});
var MerchRoute = Route$10.update({
	id: "/merch",
	path: "/merch",
	getParentRoute: () => Route$14
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$14
});
var EscrowRoute = Route$9.update({
	id: "/escrow",
	path: "/escrow",
	getParentRoute: () => Route$14
});
var AppRoute = Route$8.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$14
});
var AgentsRoute = Route$7.update({
	id: "/agents",
	path: "/agents",
	getParentRoute: () => Route$14
});
var AboutRoute = Route$6.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$14
});
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AppIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppSetupRoute = Route$3.update({
	id: "/setup",
	path: "/setup",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$17.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppEscrowRoute = Route$2.update({
	id: "/escrow",
	path: "/escrow",
	getParentRoute: () => AppRoute
});
var AppAgentsRoute = Route$1.update({
	id: "/agents",
	path: "/agents",
	getParentRoute: () => AppRoute
});
var AppEvaluationsIndexRoute = Route.update({
	id: "/evaluations/",
	path: "/evaluations/",
	getParentRoute: () => AppRoute
});
var AppProposalsIdRoute = Route$16.update({
	id: "/proposals/$id",
	path: "/proposals/$id",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppAgentsRoute,
	AppEscrowRoute,
	AppSettingsRoute,
	AppSetupRoute,
	AppIndexRoute,
	AppEvaluationsIdRoute: Route$15.update({
		id: "/evaluations/$id",
		path: "/evaluations/$id",
		getParentRoute: () => AppRoute
	}),
	AppProposalsIdRoute,
	AppEvaluationsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AgentsRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	EscrowRoute,
	LoginRoute,
	MerchRoute,
	PricingRoute,
	ProductRoute,
	SignupRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
