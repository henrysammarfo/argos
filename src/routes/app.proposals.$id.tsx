import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { proposalById, type AgentScore, type Proposal } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, X, ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/app/proposals/$id")({
  loader: ({ params }) => {
    const p = proposalById(params.id);
    if (!p) throw notFound();
    return { proposal: p };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.proposal.title} — ARGOS` : "Proposal — ARGOS" }],
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
  const { proposal } = Route.useLoaderData() as { proposal: Proposal };

  return (
    <>
      <div className="border-b border-border bg-background/50 px-6 py-4 md:px-8">
        <Link
          to="/app/evaluations/$id"
          params={{ id: proposal.evaluationId }}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to round
        </Link>
      </div>

      <PageHeader
        eyebrow={proposal.organization}
        title={proposal.title}
        description={proposal.summary}
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.75_0.15_150)] px-4 py-2 text-sm font-semibold text-background hover:opacity-90">
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <AlertTriangle className="h-4 w-4" /> Flag
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">
              <X className="h-4 w-4" /> Reject
            </button>
          </div>
        }
      />

      {/* Score summary */}
      <div className="grid gap-4 p-6 md:grid-cols-4 md:p-8">
        {proposal.scores.map((s: AgentScore) => (
          <div key={s.agent} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs tracking-wider text-muted-foreground uppercase">
              {AGENT_LABEL[s.agent]}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-medium tracking-tight text-foreground">
                {s.score}
              </span>
              <span className="text-xs text-muted-foreground">
                conf {(s.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${s.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Reasoning */}
      <div className="grid gap-6 px-6 pb-8 md:grid-cols-3 md:px-8">
        <div className="md:col-span-2 space-y-4">
          {proposal.scores.map((s: AgentScore) => (
            <div key={s.agent} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs tracking-wider text-primary uppercase">
                    {AGENT_LABEL[s.agent]} agent
                  </div>
                  <div className="mt-1 text-lg font-medium text-foreground">
                    Score {s.score} · {(s.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.reasoning}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs tracking-wider text-muted-foreground uppercase">Meta</div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="text-foreground">{proposal.amountKas.toLocaleString()} KAS</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Overall</dt>
                <dd className="text-foreground">{proposal.overallScore}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="text-foreground capitalize">{proposal.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Submitted</dt>
                <dd className="text-foreground">
                  {new Date(proposal.submittedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
              <FileText className="h-3.5 w-3.5" />
              Source
            </div>
            <div className="mt-3 rounded-lg bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
              {proposal.id}.pdf · 42 pages
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
