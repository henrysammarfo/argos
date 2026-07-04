import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as SiteNav } from "./site-footer-BxRg8whC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/video-hero-r4e446MC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_poster_default = "/assets/hero-poster-D2xPF7NH.jpg";
var VIDEO_SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4";
var HERO_DESCRIPTION = "Ambient footage: agent nodes pulse across a dark network graph while grant proposals flow through review lanes.";
function VideoHero({ children, fullscreen = true }) {
	const videoRef = (0, import_react.useRef)(null);
	const [prefersReducedMotion, setPrefersReducedMotion] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setPrefersReducedMotion(mq.matches);
		update();
		mq.addEventListener?.("change", update);
		return () => mq.removeEventListener?.("change", update);
	}, []);
	const handlePause = () => {
		const v = videoRef.current;
		if (v && !v.paused) v.pause();
	};
	const handlePlay = () => {
		const v = videoRef.current;
		if (v && v.paused && !prefersReducedMotion) v.play().catch(() => {});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "ARGOS product hero",
		className: `relative w-full overflow-hidden ${fullscreen ? "h-dvh" : "min-h-[80vh]"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				id: "hero-video-desc",
				children: HERO_DESCRIPTION
			}),
			prefersReducedMotion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero_poster_default,
				alt: "",
				"aria-hidden": "true",
				className: "absolute inset-0 h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				className: "absolute inset-0 h-full w-full object-cover",
				src: VIDEO_SRC,
				poster: hero_poster_default,
				autoPlay: true,
				muted: true,
				loop: true,
				playsInline: true,
				preload: "metadata",
				"aria-describedby": "hero-video-desc",
				"aria-label": "Decorative ambient background video",
				onMouseEnter: handlePause,
				onMouseLeave: handlePlay,
				onFocus: handlePause,
				onBlur: handlePlay,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("track", {
					kind: "descriptions",
					srcLang: "en",
					label: "Description",
					default: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-black/10",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex h-full min-h-inherit flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}), children]
			})
		]
	});
}
//#endregion
export { VideoHero as t };
