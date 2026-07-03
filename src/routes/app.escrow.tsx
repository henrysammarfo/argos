import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { escrows } from "@/lib/mock-data";
import { CheckCircle2, LoaderCircle, Lock } from "lucide-react";

export const Route = createFileRoute("/app/escrow")({
  head: () => ({
    meta: [{ title: "Escrow — ARGOS Console" }],
  }),
  component: EscrowPage,
});

function EscrowPage() {
  const total = escrows.reduce((a, b) => a + b.totalKas, 0);
  const released = escrows.reduce((a, b) => a + b.releasedKas, 0);

  return (
    <>
      <PageHeader
        eyebrow="Escrow"
        title="Kaspa contracts"
        description="Every active milestone escrow under ARGOS management."
        actions={
          <div className="text-right text-xs text-muted-foreground">
            <div>
              Locked: <span className="text-foreground">{(total - released).toLocaleString()} KAS</span>
            </div>
            <div className="mt-0.5">
              Released: <span className="text-foreground">{released.toLocaleString()} KAS</span>
            </div>
          </div>
        }
      />

      <div className="space-y-6 p-6 md:p-8">
        {escrows.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
              <div>
                <div className="text-xs tracking-wider text-muted-foreground uppercase">
                  {c.id} · {c.organization}
                </div>
                <div className="mt-1 text-lg font-medium text-foreground">{c.proposalTitle}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium tracking-tight text-foreground">
                  {c.totalKas.toLocaleString()} KAS
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.releasedKas.toLocaleString()} released ·{" "}
                  {(c.totalKas - c.releasedKas).toLocaleString()} locked
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {c.milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-4 p-6">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      m.status === "released"
                        ? "border-[oklch(0.75_0.15_150)] bg-[oklch(0.75_0.15_150)]/20 text-[oklch(0.75_0.15_150)]"
                        : m.status === "verifying"
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {m.status === "released" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : m.status === "verifying" ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{m.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Due {m.dueDate}
                      {m.verifiedAt && ` · verified ${m.verifiedAt}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-foreground">
                      {Math.round((m.percent / 100) * c.totalKas).toLocaleString()} KAS
                    </div>
                    <div className="text-xs text-muted-foreground">{m.percent}%</div>
                  </div>
                  {m.status === "verifying" && (
                    <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                      Sign release
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
