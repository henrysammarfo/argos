import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ArgosMark } from "./argos-logo-C3Fq5vE3.mjs";
import { V as Building2, x as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as useAuth } from "./auth-context-7Y8pc-KD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-BYRAW9iD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const { register, isLoading: authLoading } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [orgName, setOrgName] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [verificationCode, setVerificationCode] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSubmitting(true);
		try {
			const code = await register({
				email: email.trim(),
				password,
				organization_name: orgName.trim(),
				full_name: fullName.trim() || void 0
			});
			if (code) setVerificationCode(code);
			await navigate({
				to: "/app/settings",
				search: { tab: "account" }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Signup failed");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-col items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArgosMark, {
						size: 40,
						className: "text-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-center text-2xl font-medium tracking-tight text-foreground",
						children: "Create your workspace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-sm text-muted-foreground",
						children: "Each organization gets an isolated tenant — your rounds, proposals, and escrow stay private."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "liquid-glass rounded-2xl p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "relative z-10 space-y-4",
						onSubmit: (e) => void handleSubmit(e),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), " Organization / program name"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: orgName,
								onChange: (e) => setOrgName(e.target.value),
								placeholder: "Horizon Europe Cluster 5",
								className: "mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium tracking-wider text-muted-foreground uppercase",
								children: "Your name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "Dr. Jane Smith",
								className: "mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium tracking-wider text-muted-foreground uppercase",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "judge@foundation.org",
								autoComplete: "email",
								className: "mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium tracking-wider text-muted-foreground uppercase",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								minLength: 8,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Min. 8 characters",
								autoComplete: "new-password",
								className: "mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
							})] }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
								children: error
							}),
							verificationCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-foreground",
								children: [
									"Verification code (save this):",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: verificationCode
									}),
									" — verify in Settings → Account."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: submitting || authLoading,
								className: "mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
								children: [(submitting || authLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Create account"]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 text-center text-sm text-muted-foreground",
					children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-primary hover:underline",
							children: "Log in"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { SignupPage as component };
