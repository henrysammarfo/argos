import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { t as MarketingLayout } from "./marketing-layout-3nH5Sip_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/merch-DlQFLXk8.js
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		img: "/assets/merch-hoodie-DBKLS7nF.jpg",
		name: "Aperture Hoodie",
		desc: "Heavyweight black cotton, amber embroidery."
	},
	{
		img: "/assets/merch-hoodie-DBKLS7nF.jpg",
		name: "Mark Tee",
		desc: "Cream heavy tee, chest hit print."
	},
	{
		img: "/assets/merch-hoodie-DBKLS7nF.jpg",
		name: "ARGOS Tote",
		desc: "Natural canvas, black screen-print."
	},
	{
		img: "/assets/merch-stickers-D6oG0Fw_.jpg",
		name: "Sticker Pack",
		desc: "Six vinyl die-cuts. Laptop-grade adhesive."
	}
];
function MerchPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-24 md:px-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
							size: 32,
							className: "text-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-wider text-muted-foreground uppercase",
							children: "Demo-day capsule"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-6 text-4xl font-medium tracking-tight text-foreground md:text-6xl",
						children: [
							"The many-eyed watcher,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"on your chest."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-muted-foreground",
						children: "The ARGOS mark is a hexagonal aperture around a central pupil — one shape, stroke only, that prints clean on cotton, embroiders on fleece, and cuts to vinyl. Preview below."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid gap-6 sm:grid-cols-2",
				children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "group overflow-hidden rounded-2xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-square overflow-hidden bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: it.img,
							alt: it.name,
							loading: "lazy",
							width: 1024,
							height: 1024,
							className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "flex items-center justify-between p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-medium text-foreground",
							children: it.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm text-muted-foreground",
							children: it.desc
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground",
							children: "Preview"
						})]
					})]
				}, it.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 text-center text-sm text-muted-foreground",
				children: "Store opens after Demo Day · July 4, 2026 · Imperial College London"
			})
		]
	}) });
}
//#endregion
export { MerchPage as component };
