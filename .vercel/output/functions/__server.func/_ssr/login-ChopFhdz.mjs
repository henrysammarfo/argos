import { A as redirect, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as hasAuthSession } from "./auth-context-7Y8pc-KD.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-ChopFhdz.js
var $$splitComponentImporter = () => import("./login-Lsf2AJmj.mjs");
var loginSearchSchema = objectType({ redirect: stringType().optional() });
var Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	beforeLoad: () => {
		if (typeof window !== "undefined" && hasAuthSession()) throw redirect({ to: "/app" });
	},
	head: () => ({ meta: [{ title: "Log in — ARGOS" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
