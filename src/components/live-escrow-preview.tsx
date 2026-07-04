import { useEscrows } from "@/lib/api-hooks";
import { ApiLoading } from "@/components/api-state";

export function LiveMilestonePreview() {
  const { data, isLoading } = useEscrows();

  if (isLoading) return <ApiLoading label="Loading live escrow…" />;

  const escrow = data?.escrows?.[0];
  if (!escrow) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No active escrows. Create one from the console after an evaluation round.
      </div>
    );
  }

  const rows = escrow.milestones.map((m) => ({
    name: m.name,
    pct: m.percent,
    state: m.status as "released" | "verifying" | "locked",
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{escrow.id.slice(0, 12)}…</span>
        <span className="text-primary">{escrow.total_kas.toLocaleString()} KAS</span>
      </div>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-4">
            <div
              className={`h-2 w-2 flex-shrink-0 rounded-full ${
                r.state === "released"
                  ? "bg-[oklch(0.75_0.15_150)]"
                  : r.state === "verifying"
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{r.name}</span>
                <span className="text-muted-foreground">{r.pct}%</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${
                    r.state === "released"
                      ? "bg-[oklch(0.75_0.15_150)]"
                      : r.state === "verifying"
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                  }`}
                  style={{ width: r.state === "locked" ? "0%" : "100%" }}
                />
              </div>
            </div>
            <span
              className={`w-20 text-right text-[10px] tracking-wider uppercase ${
                r.state === "released"
                  ? "text-[oklch(0.75_0.15_150)]"
                  : r.state === "verifying"
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {r.state}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
