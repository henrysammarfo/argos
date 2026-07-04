import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.settings-CBRXJ5CA.js
var $$splitComponentImporter = () => import("./app.settings-BMSoO2JZ.mjs");
var settingsSearchSchema = objectType({ tab: stringType().optional() });
var Route = createFileRoute("/app/settings")({
	validateSearch: settingsSearchSchema,
	head: () => ({ meta: [{ title: "Settings — ARGOS Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
