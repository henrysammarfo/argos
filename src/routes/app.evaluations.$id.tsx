import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { evaluations, proposalsFor, type Proposal, type ProposalStatus } from "@/lib/mock-data";
import { useState } from "react";
import { Filter, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/app/evaluations/$id")({
  loader: ({ params }) => {
    const ev = evaluations.find((e) => e.id === params.id);
    if (!ev) throw notFound();
    return { evaluation: ev, proposals: proposalsFor(ev.id) };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.evaluation.title} — ARGOS` : "Round — ARGOS",
      },
    ],
  }),
  component: RoundPage,
});

function RoundPage() {
  const { evaluation, proposals } = Route.useLoaderData() as {
    evaluation: (typeof evaluations)[number];
    proposals: Proposal[];
  };
  const [filter, setFilter] = useState<"all" | ProposalStatus>("all");

  const filtered = proposals.filter((p: Proposal) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const counts = {
    all: proposals.length,
    flagged: proposals.filter((p: Proposal) => p.status === "flagged").length,
    pending: proposals.filter((p: Proposal) => p.status === "pending").length,
    approved: proposals.filter((p: Proposal) => p.status === "approved").length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Round"
        title={evaluation.title}
        description={evaluation.description}
        actions={
          <div className="text-right text-xs text-muted-foreground">
            <div>
              Rubric — Technical {evaluation.rubric.technical}% · Impact{" "}
              {evaluation.rubric.impact}% · Team {evaluation.rubric.team}%
            </div>
            <div className="mt-1 text-foreground">
              Pool: {(evaluation.grantAmountKas / 1000).toFixed(0)}K KAS
            </div>
          </div>
        }
      />

      <div className="flex items-center gap-2 border-b border-border bg-background/50 px-6 py-3 md:px-8">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {(["all", "flagged", "pending", "approved"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1 text-xs capitalize ${
              filter === k
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {k} · {counts[k]}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Proposal</th>
                <th className="px-6 py-3 font-medium">Tech</th>
                <th className="px-6 py-3 font-medium">Impact</th>
                <th className="px-6 py-3 font-medium">Team</th>
                <th className="px-6 py-3 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Overall <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p: Proposal) => (
                <ProposalRow key={p.id} p={p} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProposalRow({ p }: { p: Proposal }) {
  const tech = p.scores.find((s) => s.agent === "technical")!.score;
  const impact = p.scores.find((s) => s.agent === "impact")!.score;
  const team = p.scores.find((s) => s.agent === "team")!.score;

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-6 py-4">
        <Link to="/app/proposals/$id" params={{ id: p.id }} className="block max-w-md">
          <div className="truncate text-sm font-medium text-foreground">{p.title}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {p.organization} · {(p.amountKas / 1000).toFixed(0)}K KAS
          </div>
        </Link>
      </td>
      <ScoreCell v={tech} />
      <ScoreCell v={impact} />
      <ScoreCell v={team} />
      <td className="px-6 py-4">
        <span className="font-mono text-sm font-medium text-foreground">{p.overallScore}</span>
      </td>
      <td className="px-6 py-4">
        <StatusPill status={p.status} />
      </td>
    </tr>
  );
}

function ScoreCell({ v }: { v: number }) {
  return (
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${v}%` }} />
        </div>
        <span className="font-mono text-xs text-foreground">{v}</span>
      </div>
    </td>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    approved: "bg-[oklch(0.75_0.15_150)]/15 text-[oklch(0.75_0.15_150)]",
    flagged: "bg-primary/15 text-primary",
    rejected: "bg-destructive/15 text-destructive",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] tracking-wider uppercase ${
        map[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}
