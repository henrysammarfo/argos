import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { evaluations } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/evaluations/")({
  head: () => ({
    meta: [{ title: "Evaluations — ARGOS Console" }],
  }),
  component: EvaluationsPage,
});

function EvaluationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Evaluations"
        title="Rounds"
        description="Every open, in-review, and archived grant round."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New round
          </button>
        }
      />

      <div className="p-6 md:p-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Round</th>
                <th className="px-6 py-3 font-medium">Proposals</th>
                <th className="px-6 py-3 font-medium">Flagged</th>
                <th className="px-6 py-3 font-medium">Grant pool</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {evaluations.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <Link
                      to="/app/evaluations/$id"
                      params={{ id: e.id }}
                      className="block"
                    >
                      <div className="font-medium text-foreground">{e.title}</div>
                      <div className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                        {e.description}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-foreground">{e.proposalCount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        e.flaggedCount > 0
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {e.flaggedCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {(e.grantAmountKas / 1000).toFixed(0)}K KAS
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-primary/15 text-primary",
    review: "bg-[oklch(0.78_0.16_70)]/15 text-primary",
    complete: "bg-[oklch(0.75_0.15_150)]/15 text-[oklch(0.75_0.15_150)]",
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
