// Mock data for ARGOS demo — realistic grant evaluation payloads.
// Swap for real API calls in src/lib/api.ts when backend is wired.

export type EvaluationStatus = "active" | "review" | "complete";

export interface Evaluation {
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

export interface AgentScore {
  agent: "technical" | "impact" | "team" | "milestone";
  score: number;
  confidence: number;
  reasoning: string;
}

export type ProposalStatus = "pending" | "approved" | "flagged" | "rejected";

export interface Proposal {
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

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  address: string;
  status: "online" | "degraded" | "offline";
  proposalsHandled: number;
  avgLatencyMs: number;
}

export interface EscrowContract {
  id: string;
  proposalId: string;
  proposalTitle: string;
  organization: string;
  totalKas: number;
  releasedKas: number;
  milestones: Milestone[];
  status: "active" | "complete" | "disputed";
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  percent: number;
  status: "locked" | "verifying" | "released" | "disputed";
  verifiedAt?: string;
}

export const evaluations: Evaluation[] = [
  {
    id: "eval-2026-q3-climate",
    title: "Q3 2026 Climate Innovation Round",
    description:
      "Horizon Europe cluster 5 — grants for early-stage climate adaptation research consortia.",
    status: "review",
    proposalCount: 47,
    flaggedCount: 8,
    grantAmountKas: 2_400_000,
    createdAt: "2026-06-14T09:00:00Z",
    rubric: { technical: 35, impact: 40, team: 25 },
  },
  {
    id: "eval-2026-q2-public-ai",
    title: "Public-Interest AI Fellowships 2026",
    description: "GCC Category 1 — agents that improve how public capital is evaluated.",
    status: "active",
    proposalCount: 62,
    flaggedCount: 11,
    grantAmountKas: 1_800_000,
    createdAt: "2026-06-28T09:00:00Z",
    rubric: { technical: 30, impact: 45, team: 25 },
  },
  {
    id: "eval-2026-q1-open-source",
    title: "Open Source Infrastructure — Winter 2026",
    description: "Sovereign Tech Fund partner round for critical dependency maintenance.",
    status: "complete",
    proposalCount: 34,
    flaggedCount: 3,
    grantAmountKas: 950_000,
    createdAt: "2026-01-11T09:00:00Z",
    rubric: { technical: 40, impact: 30, team: 30 },
  },
];

const orgs = [
  "Helios Climate Lab",
  "OpenPolicy Collective",
  "Meridian AI Research",
  "Nordwind Institute",
  "Civic Futures Berlin",
  "Halcyon Robotics",
  "Threshold Labs",
  "Kepler Bioinformatics",
  "Bright Line Foundry",
  "Delta Signal Cooperative",
];

const titles = [
  "Coastal aquifer resilience mapping with distributed sensors",
  "Open evaluation infrastructure for public science funding",
  "Federated ML for early wildfire signal detection",
  "Rural grid stabilization via community storage",
  "Long-context language models for regulatory compliance",
  "Cryogenic memory scaling for edge inference",
  "Bioremediation of PFAS in agricultural runoff",
  "Verifiable data provenance for civic AI systems",
  "Open reference designs for perovskite tandem cells",
  "Post-quantum key rotation for legacy embedded devices",
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeProposal(i: number, evaluationId: string): Proposal {
  const r = seeded(i * 17 + 3);
  const technical = Math.round(60 + r() * 38);
  const impact = Math.round(55 + r() * 40);
  const team = Math.round(60 + r() * 36);
  const milestone = Math.round(65 + r() * 30);
  const overall = Math.round((technical + impact + team + milestone) / 4);
  const statusRoll = r();
  const status: ProposalStatus =
    statusRoll < 0.55
      ? "pending"
      : statusRoll < 0.75
        ? "approved"
        : statusRoll < 0.9
          ? "flagged"
          : "rejected";

  return {
    id: `prop-${evaluationId}-${i.toString().padStart(3, "0")}`,
    evaluationId,
    title: titles[i % titles.length],
    organization: orgs[i % orgs.length],
    amountKas: Math.round(20_000 + r() * 180_000),
    status,
    overallScore: overall,
    submittedAt: new Date(2026, 5, 1 + (i % 25)).toISOString(),
    summary:
      "Consortium proposal outlining a 24-month workplan across three technical work packages, with defined deliverables and a public data release cadence.",
    scores: [
      {
        agent: "technical",
        score: technical,
        confidence: 0.82 + r() * 0.15,
        reasoning:
          "Approach is well-grounded in prior art. Methodology section cites relevant benchmarks, but the ablation plan omits comparison against the 2025 baseline (Chen et al.). Compute budget is realistic.",
      },
      {
        agent: "impact",
        score: impact,
        confidence: 0.78 + r() * 0.18,
        reasoning:
          "Clear public-interest framing. Downstream users identified with named partner organizations. Impact metrics rely on self-report; recommend an independent measurement partner.",
      },
      {
        agent: "team",
        score: team,
        confidence: 0.85 + r() * 0.12,
        reasoning:
          "PI has three prior grants delivered on time. Two junior researchers named but not yet hired — introduces staffing risk in Q2 2027.",
      },
      {
        agent: "milestone",
        score: milestone,
        confidence: 0.88 + r() * 0.1,
        reasoning:
          "Milestones are verifiable via public artifacts (dataset release, benchmark result). Payment schedule is back-weighted, which reduces program risk.",
      },
    ],
  };
}

const proposalCache = new Map<string, Proposal[]>();

export function proposalsFor(evaluationId: string): Proposal[] {
  if (proposalCache.has(evaluationId)) return proposalCache.get(evaluationId)!;
  const ev = evaluations.find((e) => e.id === evaluationId);
  const n = ev?.proposalCount ?? 24;
  const list = Array.from({ length: Math.min(n, 24) }, (_, i) => makeProposal(i, evaluationId));
  proposalCache.set(evaluationId, list);
  return list;
}

export function proposalById(id: string): Proposal | undefined {
  for (const ev of evaluations) {
    const found = proposalsFor(ev.id).find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

export const agents: AgentInfo[] = [
  {
    id: "orchestrator",
    name: "Orchestrator",
    role: "Coordinator",
    description:
      "Routes each proposal to the four evaluator agents in parallel, aggregates scores, flags disagreement for human review.",
    address: "agent1qorch...9k3f",
    status: "online",
    proposalsHandled: 143,
    avgLatencyMs: 480,
  },
  {
    id: "intake",
    name: "Intake Agent",
    role: "Ingestion",
    description:
      "Parses PDF and URL submissions, extracts structured fields, normalizes budgets and timelines.",
    address: "agent1qintk...7w2a",
    status: "online",
    proposalsHandled: 143,
    avgLatencyMs: 2100,
  },
  {
    id: "technical",
    name: "Technical Agent",
    role: "Evaluator",
    description:
      "Scores technical merit against the rubric. Cites prior art, checks methodology, verifies compute budgets.",
    address: "agent1qtech...4b8c",
    status: "online",
    proposalsHandled: 141,
    avgLatencyMs: 3400,
  },
  {
    id: "impact",
    name: "Impact Agent",
    role: "Evaluator",
    description:
      "Weighs public-interest impact, downstream users, and measurable outcomes. Flags vague success criteria.",
    address: "agent1qimpt...2d5e",
    status: "online",
    proposalsHandled: 140,
    avgLatencyMs: 3100,
  },
  {
    id: "team",
    name: "Team Agent",
    role: "Evaluator",
    description:
      "Checks PI track record, staffing plan, and delivery history against public records and prior awards.",
    address: "agent1qteam...6f1d",
    status: "degraded",
    proposalsHandled: 138,
    avgLatencyMs: 4600,
  },
  {
    id: "milestone",
    name: "Milestone Agent",
    role: "Verifier",
    description:
      "Verifies milestone completion post-award and signs release transactions on the Kaspa escrow.",
    address: "agent1qmlst...8h3g",
    status: "online",
    proposalsHandled: 62,
    avgLatencyMs: 2700,
  },
];

export const escrows: EscrowContract[] = [
  {
    id: "esc-001",
    proposalId: "prop-eval-2026-q1-open-source-002",
    proposalTitle: "Post-quantum key rotation for legacy embedded devices",
    organization: "Threshold Labs",
    totalKas: 180_000,
    releasedKas: 108_000,
    status: "active",
    milestones: [
      {
        id: "m1",
        name: "Kickoff + technical spec",
        dueDate: "2026-02-15",
        percent: 20,
        status: "released",
        verifiedAt: "2026-02-14",
      },
      {
        id: "m2",
        name: "Reference implementation",
        dueDate: "2026-04-30",
        percent: 40,
        status: "released",
        verifiedAt: "2026-04-28",
      },
      {
        id: "m3",
        name: "Field trial + benchmarks",
        dueDate: "2026-08-15",
        percent: 25,
        status: "verifying",
      },
      {
        id: "m4",
        name: "Public release + docs",
        dueDate: "2026-11-30",
        percent: 15,
        status: "locked",
      },
    ],
  },
  {
    id: "esc-002",
    proposalId: "prop-eval-2026-q1-open-source-005",
    proposalTitle: "Verifiable data provenance for civic AI systems",
    organization: "Civic Futures Berlin",
    totalKas: 240_000,
    releasedKas: 60_000,
    status: "active",
    milestones: [
      {
        id: "m1",
        name: "Requirements workshop",
        dueDate: "2026-03-10",
        percent: 25,
        status: "released",
        verifiedAt: "2026-03-09",
      },
      {
        id: "m2",
        name: "Prototype provenance graph",
        dueDate: "2026-06-30",
        percent: 35,
        status: "verifying",
      },
      {
        id: "m3",
        name: "Pilot with 2 city partners",
        dueDate: "2026-10-15",
        percent: 25,
        status: "locked",
      },
      {
        id: "m4",
        name: "Handover + audit report",
        dueDate: "2027-01-20",
        percent: 15,
        status: "locked",
      },
    ],
  },
];
