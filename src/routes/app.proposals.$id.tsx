import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { proposalById, type AgentScore } from "@/lib/mock-data";
import { useProposal, useApproveScore, useOverrideScore } from "@/lib/api-hooks";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, X, ArrowLeft, FileText, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/proposals/$id")({
  loader: ({ params }) => {
    const p = proposalById(params.id);
    return { proposalId: params.id, mockProposal: p ?? null };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.mockProposal
          ? `${loaderData.mockProposal.title} — ARGOS`
          : "Proposal — ARGOS",
      },
    ],
  }),
  component: ProposalPage,
});

const AGENT_LABEL: Record<AgentScore["agent"], string> = {
  technical: "Technical",
  impact: "Impact",
  team: "Team",
  milestone: "Milestone",
};

function ProposalPage() {
  const { proposalId, mockProposal } = Route.useLoaderData();
  const { data: apiProposal } = useProposal(proposalId);
  const approveScore = useApproveScore();
  const overrideScore = useOverrideScore();
  const [overrideDim, setOverrideDim] = useState("");
  const [overrideVal, setOverrideVal] = useState(8);
  const [overrideReason, setOverrideReason] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const proposal = apiProposal ? mapApiProposal(apiProposal) : mockProposal;

  if (!proposal) throw notFound();

  const handleApprove = async () => {
    try {
      await approveScore.mutateAsync({
        proposalId,
        dimension: "technical.innovation",
        evaluator: "reviewer",
      });
      setActionMsg("Score approved and logged to audit trail.");
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Approve failed");
    }
  };

  const handleOverride = async () => {
    if (!overrideDim || !overrideReason) {
      setActionMsg("Provide dimension and reason for override.");
      return;
    }
    try {
      const result = await overrideScore.mutateAsync({
        proposalId,
        dimension: overrideDim,
        new_score: overrideVal,
        reason: overrideReason,
        evaluator: "reviewer",
      });
      setActionMsg(`Override saved. New total: ${result.new_total_score}`);
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Override failed");
    }
  };

  return (
    <>
      <div className="border-b border-border bg-background px-4 py-3 sm:px-6 md:px-8">
        <Link
          to="/app/evaluations/$id"
          params={{ id: proposal.evaluationId }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to round
        </Link>
      </div>

      <PageHeader
        eyebrow={proposal.organization}
        title={proposal.title}
        description={proposal.summary}
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void handleApprove()}
              disabled={approveScore.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--approve)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--flag)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
              <AlertTriangle className="h-4 w-4" /> Flag
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted">
              <X className="h-4 w-4" /> Reject
            </button>
          </div>
        }
      />

      {actionMsg && (
        <div className="border-b border-border bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6 md:px-8">
          {actionMsg}
        </div>
      )}

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 md:p-8 xl:grid-cols-4">
        {proposal.scores.map((s) => (
          <div key={s.agent} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {AGENT_LABEL[s.agent]}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {s.score}
              </span>
              <span className="text-xs text-muted-foreground">
                conf {(s.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${s.score * 10}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 px-4 pb-8 sm:px-6 md:grid-cols-3 md:gap-6 md:px-8">
        <div className="space-y-4 md:col-span-2">
          {proposal.scores.map((s) => (
            <Card key={s.agent} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                    {AGENT_LABEL[s.agent]} agent
                  </div>
                  <div className="mt-1 text-base font-semibold text-foreground">
                    Score {s.score} · {(s.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                    s.confidence < 0.85
                      ? "bg-[color:var(--flag)]/10 text-[color:var(--flag)]"
                      : "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
                  }`}
                >
                  {s.confidence < 0.85 ? "needs review" : "high confidence"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.reasoning}</p>
            </Card>
          ))}

          <Card className="p-5">
            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Override score
            </div>
            <div className="mt-3 space-y-3">
              <input
                value={overrideDim}
                onChange={(e) => setOverrideDim(e.target.value)}
                placeholder="Dimension e.g. impact.scale"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={1}
                max={10}
                value={overrideVal}
                onChange={(e) => setOverrideVal(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for override (required for audit trail)"
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={() => void handleOverride()}
                disabled={overrideScore.isPending}
                className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Save override
              </button>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Meta
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Amount" v={`${proposal.amountKas.toLocaleString()} KAS`} />
              <Row k="Overall" v={proposal.overallScore.toString()} />
              <Row k="Status" v={proposal.status} capitalize />
              <Row k="Submitted" v={new Date(proposal.submittedAt).toLocaleDateString()} />
            </dl>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <FileText className="h-3.5 w-3.5" /> Source
            </div>
            <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
              {proposal.id}.pdf · 42 pages
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}

function mapApiProposal(p: import("@/lib/api").ProposalDetail) {
  return {
    id: p.id,
    evaluationId: p.evaluation_id,
    title: p.title,
    organization: p.team_summary?.slice(0, 40) ?? "",
    amountKas: 0,
    status: (p.red_flags.length > 0 ? "flagged" : "approved") as "flagged" | "approved",
    overallScore: p.total_score,
    scores: [
      {
        agent: "technical" as const,
        score: avgDim(p.technical_scores),
        confidence: 0.85,
        reasoning: firstReason(p.technical_scores),
      },
      {
        agent: "impact" as const,
        score: avgDim(p.impact_scores),
        confidence: 0.85,
        reasoning: firstReason(p.impact_scores),
      },
      {
        agent: "team" as const,
        score: avgDim(p.team_scores),
        confidence: 0.85,
        reasoning: firstReason(p.team_scores),
      },
    ],
    summary: p.objectives ?? "",
    submittedAt: p.evaluated_at ?? new Date().toISOString(),
  };
}

function avgDim(scores: Record<string, { score: number }>): number {
  const vals = Object.values(scores).filter((v) => v?.score != null);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, d) => a + d.score, 0) / vals.length);
}

function firstReason(scores: Record<string, { reasoning?: string }>): string {
  for (const v of Object.values(scores)) {
    if (v?.reasoning) return v.reasoning;
  }
  return "";
}

function Row({ k, v, capitalize }: { k: string; v: string; capitalize?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`text-foreground ${capitalize ? "capitalize" : ""}`}>{v}</dd>
    </div>
  );
}
