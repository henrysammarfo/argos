import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { proposalById, type AgentScore, type Proposal } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, X, ArrowLeft, FileText, MessageSquare } from "lucide-react";

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
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--approve)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90">
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

      {/* Score summary */}
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
              <div className="h-full bg-primary" style={{ width: `${s.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Reasoning + sidebar */}
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
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <MessageSquare className="h-3.5 w-3.5" /> Reviewer note
            </div>
            <textarea
              placeholder="Add a note for the committee…"
              rows={3}
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <div className="mt-3 flex justify-end">
              <button className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                Save note
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
            <button className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-muted">
              Open in reader
            </button>
          </Card>
        </aside>
      </div>
    </>
  );
}

function Row({ k, v, capitalize }: { k: string; v: string; capitalize?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={`text-foreground ${capitalize ? "capitalize" : ""}`}>{v}</dd>
    </div>
  );
}
