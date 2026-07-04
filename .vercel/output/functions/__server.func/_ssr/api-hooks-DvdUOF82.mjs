import { n as __exportAll$1 } from "../_runtime.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as getAuthHeader, t as clearAuthSession } from "./auth-3Iv38AWg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-hooks-DvdUOF82.js
var api_hooks_DvdUOF82_exports = /* @__PURE__ */ __exportAll$1({
	S: () => getPaymentLedger,
	_: () => useOverrideScore,
	a: () => useCreateEvaluation,
	b: () => api_exports,
	c: () => useDashboardStats,
	d: () => useEvaluationResults,
	f: () => useEvaluationStatus,
	g: () => useHealthKaspa,
	h: () => useHealthDb,
	i: () => useCreateEscrow,
	l: () => useEscrows,
	m: () => useHealthCheck,
	n: () => useApproveMilestone,
	o: () => useCreateProposalsBatch,
	p: () => useEvaluations,
	r: () => useApproveScore,
	s: () => useDashboardActivity,
	t: () => useAgents,
	u: () => useEvaluation,
	v: () => useProposal,
	x: () => getAuditTrail,
	y: () => useRunEvaluation
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
/**
* ARGOS typed API client — all requests hit the live FastAPI backend.
*/
var api_exports = /* @__PURE__ */ __exportAll({
	approveMilestone: () => approveMilestone,
	approveScore: () => approveScore,
	checkHealth: () => checkHealth,
	createEscrow: () => createEscrow,
	createEvaluation: () => createEvaluation,
	createProposalsBatch: () => createProposalsBatch,
	getAgents: () => getAgents,
	getAuditTrail: () => getAuditTrail,
	getDashboardActivity: () => getDashboardActivity,
	getDashboardStats: () => getDashboardStats,
	getEvaluation: () => getEvaluation,
	getEvaluationResults: () => getEvaluationResults,
	getEvaluationStatus: () => getEvaluationStatus,
	getPaymentLedger: () => getPaymentLedger,
	getProposal: () => getProposal,
	listEscrows: () => listEscrows,
	listEvaluations: () => listEvaluations,
	overrideScore: () => overrideScore,
	runEvaluation: () => runEvaluation,
	submitMilestone: () => submitMilestone
});
var BASE_URL = "http://localhost:8000/api";
async function request(path, options = {}) {
	const headers = {
		"Content-Type": "application/json",
		...options.headers
	};
	const auth = getAuthHeader();
	if (auth) headers["Authorization"] = auth;
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers
	});
	if (res.status === 401 && typeof window !== "undefined") {
		clearAuthSession();
		const redirect = encodeURIComponent(window.location.pathname);
		window.location.href = `/login?redirect=${redirect}`;
		throw new Error("Session expired — please log in again");
	}
	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: res.statusText }));
		throw new Error(typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail));
	}
	return res.json();
}
async function checkHealth() {
	return request("/health");
}
async function getDashboardStats() {
	return request("/dashboard/stats");
}
async function getDashboardActivity() {
	return request("/dashboard/activity");
}
async function listEvaluations() {
	return request("/evaluations");
}
async function createEvaluation(data) {
	return request("/evaluations", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function getEvaluation(id) {
	return request(`/evaluations/${id}`);
}
async function runEvaluation(id) {
	return request(`/evaluations/${id}/run`, { method: "POST" });
}
async function getEvaluationStatus(id) {
	return request(`/evaluations/${id}/status`);
}
async function getEvaluationResults(id) {
	return request(`/evaluations/${id}/results`);
}
async function createProposalsBatch(data) {
	return request("/proposals/batch", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function getProposal(id) {
	return request(`/proposals/${id}`);
}
async function approveScore(proposalId, dimension, evaluator = "reviewer") {
	return request(`/approvals/approve/${proposalId}?dimension=${encodeURIComponent(dimension)}&evaluator=${encodeURIComponent(evaluator)}`, { method: "POST" });
}
async function overrideScore(proposalId, data) {
	return request(`/approvals/override/${proposalId}`, {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function getAuditTrail(proposalId) {
	return request(`/approvals/audit/${proposalId}`);
}
async function createEscrow(data) {
	return request("/escrow/create", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function listEscrows(evaluationId) {
	return request(`/escrow${evaluationId ? `?evaluation_id=${evaluationId}` : ""}`);
}
async function submitMilestone(data) {
	return request("/milestones/submit", {
		method: "POST",
		body: JSON.stringify(data)
	});
}
async function approveMilestone(submissionId, note = "") {
	return request(`/milestones/${submissionId}/approve?note=${encodeURIComponent(note)}`, { method: "POST" });
}
async function getAgents() {
	return request("/agents");
}
async function getPaymentLedger(limit = 50) {
	return request(`/payments/ledger?limit=${limit}`);
}
/** Default polling when data is idle — keeps API load low at scale. */
var IDLE_REFETCH_MS = 3e4;
var EVAL_STATUS_POLL_MS = 3e3;
var queryDefaults = {
	retry: 2,
	refetchIntervalInBackground: false,
	refetchOnWindowFocus: true
};
function useDashboardStats() {
	return useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: getDashboardStats,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useDashboardActivity() {
	return useQuery({
		queryKey: ["dashboard-activity"],
		queryFn: getDashboardActivity,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useEvaluations() {
	return useQuery({
		queryKey: ["evaluations"],
		queryFn: listEvaluations,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useEvaluation(id) {
	return useQuery({
		queryKey: ["evaluation", id],
		queryFn: () => getEvaluation(id),
		enabled: !!id,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useEvaluationStatus(id, poll = false) {
	return useQuery({
		queryKey: ["evaluation-status", id],
		queryFn: () => getEvaluationStatus(id),
		enabled: !!id,
		refetchInterval: poll ? EVAL_STATUS_POLL_MS : IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useEvaluationResults(id) {
	return useQuery({
		queryKey: ["evaluation-results", id],
		queryFn: () => getEvaluationResults(id),
		enabled: !!id,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useCreateEvaluation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createEvaluation,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["evaluations"] });
			qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
		}
	});
}
function useRunEvaluation() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: runEvaluation,
		onSuccess: (_d, id) => {
			qc.invalidateQueries({ queryKey: ["evaluation-status", id] });
			qc.invalidateQueries({ queryKey: ["evaluation-results", id] });
			qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
		}
	});
}
function useProposal(id) {
	return useQuery({
		queryKey: ["proposal", id],
		queryFn: () => getProposal(id),
		enabled: !!id,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useApproveScore() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ proposalId, dimension, evaluator }) => approveScore(proposalId, dimension, evaluator),
		onSuccess: (_d, { proposalId }) => {
			qc.invalidateQueries({ queryKey: ["proposal", proposalId] });
			qc.invalidateQueries({ queryKey: ["audit-trail", proposalId] });
			qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
		}
	});
}
function useOverrideScore() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ proposalId, ...data }) => overrideScore(proposalId, data),
		onSuccess: (_d, { proposalId }) => {
			qc.invalidateQueries({ queryKey: ["proposal", proposalId] });
			qc.invalidateQueries({ queryKey: ["audit-trail", proposalId] });
			qc.invalidateQueries({ queryKey: ["evaluation-results"] });
			qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
		}
	});
}
function useAgents() {
	return useQuery({
		queryKey: ["agents"],
		queryFn: getAgents,
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useEscrows(evaluationId) {
	return useQuery({
		queryKey: ["escrows", evaluationId],
		queryFn: () => listEscrows(evaluationId),
		refetchInterval: IDLE_REFETCH_MS,
		...queryDefaults
	});
}
function useCreateEscrow() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createEscrow,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["escrows"] });
			qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
		}
	});
}
function useCreateProposalsBatch() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: createProposalsBatch,
		onSuccess: (_d, vars) => {
			qc.invalidateQueries({ queryKey: ["evaluation-results", vars.evaluation_id] });
			qc.invalidateQueries({ queryKey: ["evaluation-status", vars.evaluation_id] });
			qc.invalidateQueries({ queryKey: ["evaluations"] });
			qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
		}
	});
}
function useApproveMilestone() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, note }) => approveMilestone(id, note),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["escrows"] });
			qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
			qc.invalidateQueries({ queryKey: ["dashboard-activity"] });
		}
	});
}
function useHealthDb() {
	return useQuery({
		queryKey: ["health-db"],
		queryFn: async () => {
			const res = await fetch(`http://localhost:8000/api/health/db`);
			if (!res.ok) throw new Error("Database unreachable");
			return res.json();
		},
		refetchInterval: 6e4,
		...queryDefaults
	});
}
function useHealthKaspa() {
	return useQuery({
		queryKey: ["health-kaspa"],
		queryFn: async () => {
			const res = await fetch(`http://localhost:8000/api/health/kaspa`);
			if (!res.ok) throw new Error("Kaspa node unreachable");
			return res.json();
		},
		refetchInterval: 6e4,
		...queryDefaults
	});
}
function useHealthCheck() {
	return useQuery({
		queryKey: ["health"],
		queryFn: checkHealth,
		refetchInterval: 6e4,
		...queryDefaults
	});
}
//#endregion
export { useRunEvaluation as S, useHealthCheck as _, useApproveMilestone as a, useOverrideScore as b, useCreateEvaluation as c, useDashboardStats as d, useEscrows as f, useEvaluations as g, useEvaluationStatus as h, useAgents as i, useCreateProposalsBatch as l, useEvaluationResults as m, getAuditTrail as n, useApproveScore as o, useEvaluation as p, getPaymentLedger as r, useCreateEscrow as s, api_hooks_DvdUOF82_exports as t, useDashboardActivity as u, useHealthDb as v, useProposal as x, useHealthKaspa as y };
