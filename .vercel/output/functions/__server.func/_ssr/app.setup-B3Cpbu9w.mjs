import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as useCreateEvaluation } from "./api-hooks-DvdUOF82.mjs";
import { o as PageHeader, t as Card } from "./dashboard-shell-BBbx_6OB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.setup-B3Cpbu9w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SetupPage() {
	const navigate = useNavigate();
	const createEval = useCreateEvaluation();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [technical, setTechnical] = (0, import_react.useState)(30);
	const [impact, setImpact] = (0, import_react.useState)(40);
	const [team, setTeam] = (0, import_react.useState)(30);
	const [grantAmount, setGrantAmount] = (0, import_react.useState)(5e4);
	const [error, setError] = (0, import_react.useState)("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			navigate({
				to: "/app/evaluations/$id",
				params: { id: (await createEval.mutateAsync({
					title,
					description,
					rubric: {
						technical,
						impact,
						team
					},
					grant_amount_kas: grantAmount,
					milestones: [
						{
							name: "Phase 1 Complete",
							date: "2027-03-01",
							percent: 30
						},
						{
							name: "Phase 2 Complete",
							date: "2027-09-01",
							percent: 40
						},
						{
							name: "Final Delivery",
							date: "2028-03-01",
							percent: 30
						}
					]
				})).id }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create evaluation");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Setup",
		title: "New evaluation round",
		description: "Configure rubric weights, grant pool, and milestone schedule."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 sm:p-6 md:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "max-w-2xl p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void handleSubmit(e),
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: "Round title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Q3 2026 Climate Grant Round",
						className: "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						rows: 3,
						className: "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium text-foreground",
							children: "Rubric weights (must sum to 100)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricSlider, {
									label: "Technical",
									value: technical,
									onChange: setTechnical
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricSlider, {
									label: "Impact",
									value: impact,
									onChange: setImpact
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubricSlider, {
									label: "Team",
									value: team,
									onChange: setTeam
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								"Total: ",
								technical + impact + team,
								"%"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: "Grant amount (KAS)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: grantAmount,
						onChange: (e) => setGrantAmount(Number(e.target.value)),
						className: "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: createEval.isPending,
							className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							children: createEval.isPending ? "Creating…" : "Create round"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/evaluations",
							className: "rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted",
							children: "Cancel"
						})]
					})
				]
			})
		})
	})] });
}
function RubricSlider({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [value, "%"] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "range",
		min: 0,
		max: 100,
		value,
		onChange: (e) => onChange(Number(e.target.value)),
		className: "mt-1 w-full accent-primary"
	})] });
}
//#endregion
export { SetupPage as component };
