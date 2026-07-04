import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { escrows } from "@/lib/mock-data";
import { CheckCircle2, LoaderCircle, Lock, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/app/escrow")({
  head: () => ({
    meta: [{ title: "Escrow — ARGOS Console" }],
  }),
  component: EscrowPage,
});

function EscrowPage() {
  const total = escrows.reduce((a, b) => a + b.totalKas, 0);
  const released = escrows.reduce((a, b) => a + b.releasedKas, 0);
  const locked = total - released;

  return (
    <>
      <PageHeader
        eyebrow="Escrow"
        title="Kaspa contracts"
        description="Every active milestone escrow under ARGOS management."
      />

      <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6 md:p-8">
        <TreasuryStat label="Under management" value={`${total.toLocaleString()} KAS`} />
        <TreasuryStat label="Released" value={`${released.toLocaleString()} KAS`} tone="approve" />
        <TreasuryStat label="Locked" value={`${locked.toLocaleString()} KAS`} tone="primary" />
      </div>

      <div className="space-y-4 px-4 pb-8 sm:px-6 md:space-y-6 md:px-8">
        {escrows.map((c) => {
          const pctReleased = Math.round((c.releasedKas / c.totalKas) * 100);
          return (
            <Card key={c.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border p-5 md:flex md:flex-wrap md:justify-between">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {c.id} · {c.organization}
                  </div>
                  <div className="mt-1 truncate text-base font-semibold text-foreground md:text-lg">
                    {c.proposalTitle}
                  </div>
                  <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-[color:var(--approve)]"
                      style={{ width: `${pctReleased}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {pctReleased}% released
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {c.totalKas.toLocaleString()} KAS
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {c.releasedKas.toLocaleString()} released
                  </div>
                  <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                    View on-chain <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <ul className="divide-y divide-border">
                {c.milestones.map((m) => (
                  <li key={m.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto_auto]">
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full border-2 ${
                        m.status === "released"
                          ? "border-[color:var(--approve)] bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
                          : m.status === "verifying"
                            ? "border-primary bg-primary/10 text-primary"
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
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {m.name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Due {m.dueDate}
                        {m.verifiedAt && ` · verified ${m.verifiedAt}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-foreground">
                        {Math.round((m.percent / 100) * c.totalKas).toLocaleString()} KAS
                      </div>
                      <div className="text-xs text-muted-foreground">{m.percent}%</div>
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      {m.status === "verifying" ? (
                        <button className="w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 md:w-auto">
                          Sign release
                        </button>
                      ) : (
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${
                            m.status === "released"
                              ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.status}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function TreasuryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "approve" | "primary";
}) {
  const color =
    tone === "approve"
      ? "text-[color:var(--approve)]"
      : tone === "primary"
        ? "text-primary"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
