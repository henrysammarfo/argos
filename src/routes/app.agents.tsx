import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { agents as mockAgents } from "@/lib/mock-data";
import { useAgentAddresses } from "@/lib/api-hooks";
import { ArgosMark } from "@/components/argos-logo";
import { Radio, Copy } from "lucide-react";

export const Route = createFileRoute("/app/agents")({
  head: () => ({
    meta: [{ title: "Agents — ARGOS Console" }],
  }),
  component: AgentsPage,
});

const AGENT_KEYS = [
  { id: "orchestrator", role: "Orchestrator", name: "argos-orchestrator" },
  { id: "intake", role: "Intake", name: "argos-intake" },
  { id: "technical", role: "Technical", name: "argos-technical" },
  { id: "impact", role: "Impact", name: "argos-impact" },
  { id: "team", role: "Team", name: "argos-team" },
  { id: "milestone", role: "Milestone", name: "argos-milestone" },
] as const;

function AgentsPage() {
  const { data: addresses } = useAgentAddresses();

  const agents = AGENT_KEYS.map((key, i) => {
    const mock = mockAgents[i] ?? mockAgents[0];
    const addr = addresses?.[key.id as keyof typeof addresses] ?? mock.address;
    return {
      ...mock,
      id: key.id,
      role: key.role,
      name: key.name,
      address: addr || "Not registered — run agent and set env var",
      status: addr ? ("online" as const) : ("offline" as const),
    };
  });
  const online = agents.filter((a) => a.status === "online").length;
  const degraded = agents.filter((a) => a.status === "degraded").length;
  const totalHandled = agents.reduce((a, b) => a + b.proposalsHandled, 0);
  const avgLatency = Math.round(
    agents.reduce((a, b) => a + b.avgLatencyMs, 0) / Math.max(agents.length, 1),
  );

  return (
    <>
      <PageHeader
        eyebrow="Agents"
        title="Agent status"
        description="Live status of every ARGOS uAgent on Agentverse."
      />

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 md:p-8 xl:grid-cols-4">
        <MiniStat label="Online" value={online.toString()} tone="approve" />
        <MiniStat label="Degraded" value={degraded.toString()} tone="flag" />
        <MiniStat label="Proposals handled" value={totalHandled.toString()} />
        <MiniStat label="Avg latency" value={`${avgLatency}ms`} />
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
                <div className="mt-0.5 font-mono text-foreground">{a.proposalsHandled}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Latency</div>
                <div className="mt-0.5 font-mono text-foreground">{a.avgLatencyMs}ms</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground">Address</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <code className="truncate rounded bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                    {a.address}
                  </code>
                  <button
                    aria-label="Copy address"
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
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
