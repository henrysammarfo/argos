/**
 * ARGOS typed API client — all requests hit the live FastAPI backend.
 */

import { clearAuthSession, getAuthHeader } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const auth = getAuthHeader();
  if (auth) headers["Authorization"] = auth;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
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
  return res.json() as Promise<T>;
}

export async function checkHealth(): Promise<{ status: string }> {
  return request("/health");
}

// --- Dashboard ---

export interface DashboardStats {
  active_rounds: number;
  total_proposals: number;
  pending_proposals: number;
  complete_proposals: number;
  flagged_proposals: number;
  grant_pool_kas: number;
  escrow_managed_kas: number;
  escrow_released_kas: number;
  evaluations_weekly: number[];
  rounds: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    proposal_count: number;
    flagged_count: number;
    approved_count: number;
    grant_amount_kas: number;
    created_at: string;
    rubric: { technical: number; impact: number; team: number };
  }>;
}

export interface ActivityEvent {
  type: string;
  text: string;
  time: string;
  tone: "approve" | "flag" | "neutral";
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return request("/dashboard/stats");
}

export async function getDashboardActivity(): Promise<{ activity: ActivityEvent[] }> {
  return request("/dashboard/activity");
}

// --- Evaluations ---

export interface EvaluationCreate {
  title: string;
  description?: string;
  rubric?: { technical: number; impact: number; team: number };
  grant_amount_kas?: number;
  milestones?: Array<{ name: string; date: string; percent: number }>;
}

export interface EvaluationRecord {
  id: string;
  title: string;
  description?: string;
  rubric: { technical: number; impact: number; team: number };
  grant_amount_kas?: number;
  milestones?: Array<{ name: string; date: string; percent: number }>;
  status: string;
  created_at: string;
  proposal_count?: number;
  flagged_count?: number;
}

export async function listEvaluations(): Promise<{ evaluations: EvaluationRecord[] }> {
  return request("/evaluations");
}

export async function createEvaluation(
  data: EvaluationCreate,
): Promise<{ id: string; status: string }> {
  return request("/evaluations", { method: "POST", body: JSON.stringify(data) });
}

export async function getEvaluation(id: string): Promise<EvaluationRecord> {
  return request(`/evaluations/${id}`);
}

export async function runEvaluation(
  id: string,
): Promise<{ status: string; proposal_count: number }> {
  return request(`/evaluations/${id}/run`, { method: "POST" });
}

export interface EvaluationStatus {
  total: number;
  complete: number;
  evaluating: number;
  pending: number;
  errors: number;
  progress_pct: number;
  done: boolean;
}

export async function getEvaluationStatus(id: string): Promise<EvaluationStatus> {
  return request(`/evaluations/${id}/status`);
}

export interface ScoreDimension {
  score: number;
  reasoning: string;
  human_override?: boolean;
  override_reason?: string;
}

export interface ProposalResult {
  id: string;
  rank: number;
  title: string;
  total_score: number;
  technical_scores: Record<string, ScoreDimension | string[]>;
  impact_scores: Record<string, ScoreDimension | string[]>;
  team_scores: Record<string, ScoreDimension | string[]>;
  red_flags: string[];
  overrides: Array<Record<string, unknown>>;
  status: string;
}

export async function getEvaluationResults(id: string): Promise<{ proposals: ProposalResult[] }> {
  return request(`/evaluations/${id}/results`);
}

// --- Proposals ---

export interface ProposalCreate {
  evaluation_id: string;
  title: string;
  source_type: "text" | "url" | "pdf";
  source: string;
}

export async function createProposal(
  data: ProposalCreate,
): Promise<{ id: string; status: string }> {
  return request("/proposals", { method: "POST", body: JSON.stringify(data) });
}

export async function createProposalsBatch(data: {
  evaluation_id: string;
  proposals: ProposalCreate[];
}): Promise<{ proposal_ids: string[] }> {
  return request("/proposals/batch", { method: "POST", body: JSON.stringify(data) });
}

export interface ProposalDetail {
  id: string;
  evaluation_id: string;
  title: string;
  source_type: string;
  raw_text?: string;
  team_summary?: string;
  objectives?: string;
  methodology?: string;
  budget_requested?: string;
  timeline?: string;
  technical_scores: Record<string, ScoreDimension>;
  impact_scores: Record<string, ScoreDimension>;
  team_scores: Record<string, ScoreDimension>;
  red_flags: string[];
  overrides: Array<Record<string, unknown>>;
  total_score: number;
  rank: number;
  status: string;
  evaluated_at?: string;
}

export async function getProposal(id: string): Promise<ProposalDetail> {
  return request(`/proposals/${id}`);
}

// --- Approvals ---

export async function approveScore(
  proposalId: string,
  dimension: string,
  evaluator = "reviewer",
): Promise<{ status: string; dimension: string }> {
  return request(
    `/approvals/approve/${proposalId}?dimension=${encodeURIComponent(dimension)}&evaluator=${encodeURIComponent(evaluator)}`,
    { method: "POST" },
  );
}

export async function overrideScore(
  proposalId: string,
  data: { dimension: string; new_score: number; reason: string; evaluator?: string },
): Promise<{ status: string; new_total_score: number }> {
  return request(`/approvals/override/${proposalId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAuditTrail(proposalId: string) {
  return request(`/approvals/audit/${proposalId}`);
}

// --- Escrow ---

export async function createEscrow(data: {
  evaluation_id: string;
  winner_proposal_id: string;
  grantee_kas_address: string;
}) {
  return request("/escrow/create", { method: "POST", body: JSON.stringify(data) });
}

export async function getEscrowStatus(escrowId: string) {
  return request(`/escrow/${escrowId}/status`);
}

export async function listEscrows(evaluationId?: string) {
  const q = evaluationId ? `?evaluation_id=${evaluationId}` : "";
  return request(`/escrow${q}`);
}

// --- Milestones ---

export async function submitMilestone(data: {
  escrow_id: string;
  milestone_index: number;
  report_text: string;
  promised_deliverables: string[];
  report_url?: string;
}) {
  return request("/milestones/submit", { method: "POST", body: JSON.stringify(data) });
}

export async function approveMilestone(submissionId: string, note = "") {
  return request(`/milestones/${submissionId}/approve?note=${encodeURIComponent(note)}`, {
    method: "POST",
  });
}

// --- Agents ---

export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  description: string;
  address: string;
  status: "online" | "offline" | "degraded";
  proposals_handled: number;
}

export async function getAgents() {
  return request<{
    agents: AgentRecord[];
    online_count: number;
    proposals_complete: number;
    proposals_pending: number;
  }>("/agents");
}
