export type EvaluationStatus = "active" | "review" | "complete";

export type ProposalStatus =
  | "pending"
  | "evaluating"
  | "complete"
  | "error"
  | "flagged"
  | "approved"
  | "rejected";

export interface AgentScore {
  agent: "technical" | "impact" | "team" | "milestone";
  score: number;
  confidence: number;
  reasoning: string;
}

export interface ProposalView {
  id: string;
  evaluationId: string;
  title: string;
  organization: string;
  amountKas: number;
  status: ProposalStatus;
  overallScore: number;
  scores: AgentScore[];
  summary: string;
  submittedAt: string;
}

export interface EvaluationView {
  id: string;
  title: string;
  description: string;
  status: EvaluationStatus;
  proposalCount: number;
  flaggedCount: number;
  grantAmountKas: number;
  createdAt: string;
  rubric: { technical: number; impact: number; team: number };
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  address: string;
  status: "online" | "degraded" | "offline";
  proposalsHandled: number;
  avgLatencyMs?: number;
}

export function avgDim(scores: Record<string, unknown>): number {
  const dims = Object.values(scores).filter(
    (v): v is { score: number } => typeof v === "object" && v !== null && "score" in v,
  );
  if (!dims.length) return 0;
  return Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);
}

export function firstReason(scores: Record<string, { reasoning?: string }>): string {
  for (const v of Object.values(scores)) {
    if (v?.reasoning) return v.reasoning;
  }
  return "";
}

export function mapApiProposal(p: import("./api").ProposalDetail): ProposalView {
  const flagged = p.red_flags.length > 0;
  let status: ProposalStatus = p.status as ProposalStatus;
  if (p.status === "complete") status = flagged ? "flagged" : "approved";

  return {
    id: p.id,
    evaluationId: p.evaluation_id,
    title: p.title,
    organization: p.team_summary?.slice(0, 80) ?? "",
    amountKas: 0,
    status,
    overallScore: p.total_score ?? 0,
    scores: [
      {
        agent: "technical",
        score: avgDim(p.technical_scores),
        confidence: 0.85,
        reasoning: firstReason(p.technical_scores),
      },
      {
        agent: "impact",
        score: avgDim(p.impact_scores),
        confidence: 0.85,
        reasoning: firstReason(p.impact_scores),
      },
      {
        agent: "team",
        score: avgDim(p.team_scores),
        confidence: 0.85,
        reasoning: firstReason(p.team_scores),
      },
    ],
    summary: p.objectives ?? p.team_summary ?? "",
    submittedAt: p.evaluated_at ?? new Date().toISOString(),
  };
}

export function mapResultProposal(
  p: import("./api").ProposalResult,
  evaluationId: string,
): ProposalView {
  const flagged = p.red_flags.length > 0;
  return {
    id: p.id,
    evaluationId,
    title: p.title,
    organization: "",
    amountKas: 0,
    status: flagged ? "flagged" : "approved",
    overallScore: p.total_score,
    scores: [
      { agent: "technical", score: avgDim(p.technical_scores), confidence: 0.85, reasoning: "" },
      { agent: "impact", score: avgDim(p.impact_scores), confidence: 0.85, reasoning: "" },
      { agent: "team", score: avgDim(p.team_scores), confidence: 0.85, reasoning: "" },
    ],
    summary: "",
    submittedAt: new Date().toISOString(),
  };
}
