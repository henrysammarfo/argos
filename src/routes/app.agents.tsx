import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { ApiError, ApiLoading } from "@/components/api-state";
import { useAgents } from "@/lib/api-hooks";
import { ArgosMark } from "@/components/argos-logo";
import { Radio, Copy } from "lucide-react";

export const Route = createFileRoute("/app/agents")({
  head: () => ({
    meta: [{ title: "Agents — ARGOS Console" }],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const { data, isLoading, isError, refetch } = useAgents();

  if (isLoading) return <ApiLoading label="Loading agent status…" />;
  if (isError || !data) {
    return <ApiError message="Cannot load agents from API." onRetry={() => void refetch()} />;
  }

  const agents = data.agents;
  const online = data.online_count;
  const offline = agents.length - online;

  return (
    <>
      <PageHeader
        eyebrow="Agents"
        title="Agent status"
        description="Live status of every ARGOS uAgent — polled every 5 seconds."
      />

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 md:p-8 xl:grid-cols-4">
        <MiniStat label="Online" value={online.toString()} tone="approve" />
        <MiniStat label="Offline" value={offline.toString()} tone="flag" />
        <MiniStat label="Proposals complete" value={data.proposals_complete.toString()} />
        <MiniStat label="Proposals pending" value={data.proposals_pending.toString()} />
      </div>

      <div className="grid gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6 md:px-8 xl:grid-cols-3">
        {agents.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10">
                <ArgosMark size={22} className="text-primary" />
              </div>
              <StatusChip status={a.status} />
            </div>

            <div className="mt-5">
              <div className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                {a.role}
              </div>
              <div className="mt-1 text-lg font-semibold text-foreground">{a.name}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
              <div>
                <div className="text-muted-foreground">Handled</div>
                <div className="mt-0.5 font-mono text-foreground">{a.proposals_handled}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="mt-0.5 font-mono capitalize text-foreground">{a.status}</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground">Address</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <code className="truncate rounded bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                    {a.address || "Not registered — run agent and set env var"}
                  </code>
                  {a.address && (
                    <button
                      aria-label="Copy address"
                      onClick={() => void navigator.clipboard.writeText(a.address)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "approve" | "flag";
}) {
  const color =
    tone === "approve"
      ? "text-[color:var(--approve)]"
      : tone === "flag"
        ? "text-[color:var(--flag)]"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${color}`}>{value}</div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    online: "bg-[color:var(--approve)]/10 text-[color:var(--approve)]",
    degraded: "bg-[color:var(--flag)]/10 text-[color:var(--flag)]",
    offline: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${map[status] ?? ""}`}
    >
      <Radio className="h-3 w-3" />
      {status}
    </span>
  );
}
