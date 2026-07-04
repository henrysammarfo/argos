import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card, EmptyState } from "@/components/dashboard-shell";
import { evaluations as mockEvaluations } from "@/lib/mock-data";
import { useEvaluations } from "@/lib/api-hooks";
import { Plus, FileStack, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/evaluations/")({
  head: () => ({
    meta: [{ title: "Evaluations — ARGOS Console" }],
  }),
  component: EvaluationsPage,
});

function EvaluationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "review" | "complete">("all");
  const { data: apiData } = useEvaluations();

  const evaluations =
    apiData?.evaluations?.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description ?? "",
      status: (e.status as "active" | "review" | "complete") ?? "active",
      proposalCount: 0,
      flaggedCount: 0,
      grantAmountKas: e.grant_amount_kas ?? 0,
      createdAt: e.created_at,
      rubric: e.rubric,
    })) ?? mockEvaluations;

  const filtered = evaluations.filter((e) => {
    const matchesQ = q === "" || e.title.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = status === "all" || e.status === status;
    return matchesQ && matchesStatus;
  });

  return (
    <>
      <PageHeader
        eyebrow="Evaluations"
        title="Rounds"
        description="Every open, in-review, and archived grant round."
        actions={
          <Link
            to="/app/setup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New round
          </Link>
        }
      />

      <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:px-6 md:px-8">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search rounds…"
            className="w-full rounded-lg border border-border bg-card py-2 pr-3 pl-9 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
          {(["all", "active", "review", "complete"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setStatus(k)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                status === k
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <Card>
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileStack}
              title="No rounds match"
              description="Try clearing the search or switching status."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    <th className="px-5 py-3">Round</th>
                    <th className="px-5 py-3">Proposals</th>
                    <th className="px-5 py-3">Flagged</th>
                    <th className="px-5 py-3">Grant pool</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/40">
                      <td className="px-5 py-4">
                        <Link
                          to="/app/evaluations/$id"
                          params={{ id: e.id }}
                          className="block max-w-md"
                        >
                          <div className="font-semibold text-foreground">{e.title}</div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">
                            {e.description}
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-foreground">{e.proposalCount}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            e.flaggedCount > 0
                              ? "bg-[color:var(--flag)]/10 text-[color:var(--flag)]"
                              : "text-muted-foreground"
                          }`}
                        >
                          {e.flaggedCount}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-foreground">
                        {(e.grantAmountKas / 1000).toFixed(0)}K KAS
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={e.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-primary/10 text-primary",
    review: "bg-[color:var(--flag)]/10 text-[color:var(--flag)]",
    complete: "bg-[color:var(--approve)]/10 text-[color:var(--approve)]",
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
