import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import {
  evaluations as mockEvaluations,
  proposalsFor,
  type Proposal,
  type ProposalStatus,
} from "@/lib/mock-data";
import {
  useEvaluation,
  useEvaluationResults,
  useEvaluationStatus,
  useRunEvaluation,
} from "@/lib/api-hooks";
import { useState } from "react";
import { Filter, ArrowUpDown, Download, Play, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/evaluations/$id")({
  loader: ({ params }) => {
    const ev = mockEvaluations.find((e) => e.id === params.id);
    if (!ev) {
      return { evaluationId: params.id, mockEvaluation: null };
    }
    return { evaluationId: params.id, mockEvaluation: ev };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.mockEvaluation
          ? `${loaderData.mockEvaluation.title} — ARGOS`
          : "Round — ARGOS",
      },
    ],
  }),
  component: RoundPage,
});

function RoundPage() {
  const { evaluationId, mockEvaluation } = Route.useLoaderData();
  const { data: apiEval } = useEvaluation(evaluationId);
  const { data: status, refetch: refetchStatus } = useEvaluationStatus(evaluationId, true);
  const { data: results } = useEvaluationResults(evaluationId);
  const runEval = useRunEvaluation();
  const [filter, setFilter] = useState<"all" | ProposalStatus>("all");
  const [running, setRunning] = useState(false);

  const evaluation = apiEval
    ? {
        id: apiEval.id,
        title: apiEval.title,
        description: apiEval.description ?? "",
        rubric: apiEval.rubric,
        grantAmountKas: apiEval.grant_amount_kas ?? 0,
      }
    : mockEvaluation;

  if (!evaluation) throw notFound();

  const mockProposals = proposalsFor(evaluationId);
  const apiProposals: Proposal[] =
    results?.proposals.map((p) => ({
      id: p.id,
      evaluationId,
      title: p.title,
      organization: "",
      amountKas: 0,
      status: (p.red_flags.length > 0 ? "flagged" : "approved") as ProposalStatus,
      overallScore: p.total_score,
      scores: [
        {
          agent: "technical" as const,
          score: avgDim(p.technical_scores),
          confidence: 0.85,
          reasoning: "",
        },
        {
          agent: "impact" as const,
          score: avgDim(p.impact_scores),
          confidence: 0.85,
          reasoning: "",
        },
        {
          agent: "team" as const,
          score: avgDim(p.team_scores),
          confidence: 0.85,
          reasoning: "",
        },
      ],
      summary: "",
      submittedAt: new Date().toISOString(),
    })) ?? [];

  const proposals = apiProposals.length ? apiProposals : mockProposals;
  const filtered = proposals.filter((p) => filter === "all" || p.status === filter);

  const handleRun = async () => {
    setRunning(true);
    try {
      await runEval.mutateAsync(evaluationId);
      void refetchStatus();
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Round"
        title={evaluation.title}
        description={evaluation.description}
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => void handleRun()}
              disabled={running || runEval.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run evaluation
            </button>
            <button className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted sm:inline-flex">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        }
      />

      {status && (
        <div className="border-b border-border bg-background px-4 py-3 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${status.progress_pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {status.complete}/{status.total} complete
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 border-b border-border bg-background px-4 py-4 sm:grid-cols-4 sm:px-6 md:px-8">
        <RubricPill label="Technical" value={`${evaluation.rubric.technical}%`} />
        <RubricPill label="Impact" value={`${evaluation.rubric.impact}%`} />
        <RubricPill label="Team" value={`${evaluation.rubric.team}%`} />
        <RubricPill label="Pool" value={`${(evaluation.grantAmountKas / 1000).toFixed(0)}K KAS`} />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-3 sm:px-6 md:px-8">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {(["all", "flagged", "pending", "approved"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              filter === k
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {k} · {proposals.filter((p) => k === "all" || p.status === k).length}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  <th className="px-5 py-3">Proposal</th>
                  <th className="px-5 py-3">Tech</th>
                  <th className="px-5 py-3">Impact</th>
                  <th className="px-5 py-3">Team</th>
                  <th className="px-5 py-3">
                    <span className="inline-flex items-center gap-1">
                      Overall <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <ProposalRow key={p.id} p={p} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

function avgDim(scores: Record<string, unknown>): number {
  const dims = Object.values(scores).filter(
    (v): v is { score: number } => typeof v === "object" && v !== null && "score" in v,
  );
  if (!dims.length) return 0;
  return Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);
}

function RubricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ProposalRow({ p }: { p: Proposal }) {
  const tech = p.scores.find((s) => s.agent === "technical")?.score ?? 0;
  const impact = p.scores.find((s) => s.agent === "impact")?.score ?? 0;
  const team = p.scores.find((s) => s.agent === "team")?.score ?? 0;

  return (
    <tr className="hover:bg-muted/40">
      <td className="px-5 py-4">
        <Link to="/app/proposals/$id" params={{ id: p.id }} className="block max-w-md">
          <div className="truncate text-sm font-semibold text-foreground">{p.title}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {p.organization} · {(p.amountKas / 1000).toFixed(0)}K KAS
          </div>
        </Link>
      </td>
      <ScoreCell v={tech} />
      <ScoreCell v={impact} />
      <ScoreCell v={team} />
      <td className="px-5 py-4">
        <span className="font-mono text-sm font-semibold text-foreground">{p.overallScore}</span>
      </td>
      <td className="px-5 py-4">
        <StatusPill status={p.status} />
      </td>
    </tr>
  );
}

function ScoreCell({ v }: { v: number }) {
  return (
    <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${v * 10}%` }} />
        </div>
        <span className="font-mono text-xs text-foreground">{v}</span>
      </div>
    </td>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    approved: "bg-[color:var(--approve)]/10 text-[color:var(--approve)]",
    flagged: "bg-[color:var(--flag)]/10 text-[color:var(--flag)]",
    rejected: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${
        map[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}
