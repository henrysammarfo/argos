/**
 * Unified data layer — tries live API, falls back to mock data.
 */

import * as api from "./api";
import {
  evaluations as mockEvaluations,
  proposalsFor,
  proposalById,
  agents as mockAgents,
  escrows as mockEscrows,
  type Evaluation,
  type Proposal,
} from "./mock-data";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

async function tryApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (USE_MOCK) return fallback;
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function fetchEvaluations(): Promise<Evaluation[]> {
  const data = await tryApi(() => api.listEvaluations(), { evaluations: [] });
  if (!data.evaluations.length) return mockEvaluations;
  return data.evaluations.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description ?? "",
    status: (e.status as Evaluation["status"]) ?? "active",
    proposalCount: 0,
    flaggedCount: 0,
    grantAmountKas: e.grant_amount_kas ?? 0,
    createdAt: e.created_at,
    rubric: e.rubric,
  }));
}

export async function fetchEvaluation(id: string): Promise<Evaluation | undefined> {
  const mock = mockEvaluations.find((e) => e.id === id);
  const data = await tryApi(() => api.getEvaluation(id), null as unknown as api.EvaluationRecord);
  if (!data) return mock;
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    status: (data.status as Evaluation["status"]) ?? "active",
    proposalCount: 0,
    flaggedCount: 0,
    grantAmountKas: data.grant_amount_kas ?? 0,
    createdAt: data.created_at,
    rubric: data.rubric,
  };
}

export async function fetchProposalsForEvaluation(evaluationId: string): Promise<Proposal[]> {
  const mock = proposalsFor(evaluationId);
  const data = await tryApi(() => api.getEvaluationResults(evaluationId), { proposals: [] });
  if (!data.proposals.length) return mock;

  return data.proposals.map((p) => ({
    id: p.id,
    evaluationId,
    title: p.title,
    organization: "",
    amountKas: 0,
    status: p.red_flags.length > 0 ? "flagged" : "approved",
    overallScore: p.total_score,
    scores: [
      {
        agent: "technical" as const,
        score: avgScore(p.technical_scores),
        confidence: 0.85,
        reasoning: firstReasoning(p.technical_scores),
      },
      {
        agent: "impact" as const,
        score: avgScore(p.impact_scores),
        confidence: 0.85,
        reasoning: firstReasoning(p.impact_scores),
      },
      {
        agent: "team" as const,
        score: avgScore(p.team_scores),
        confidence: 0.85,
        reasoning: firstReasoning(p.team_scores),
      },
    ],
    summary: firstReasoning(p.technical_scores),
    submittedAt: new Date().toISOString(),
  }));
}

function avgScore(scores: Record<string, unknown>): number {
  const dims = Object.values(scores).filter(
    (v): v is { score: number } => typeof v === "object" && v !== null && "score" in v,
  );
  if (!dims.length) return 0;
  return Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);
}

function firstReasoning(scores: Record<string, unknown>): string {
  for (const v of Object.values(scores)) {
    if (typeof v === "object" && v !== null && "reasoning" in v) {
      return (v as { reasoning: string }).reasoning;
    }
  }
  return "";
}

export { mockAgents, mockEscrows, proposalById, mockEvaluations };
