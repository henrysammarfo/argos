import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { agents } from "@/lib/mock-data";
import { ArgosMark } from "@/components/argos-logo";
import { Radio } from "lucide-react";

export const Route = createFileRoute("/app/agents")({
  head: () => ({
    meta: [{ title: "Agents — ARGOS Console" }],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Agents"
        title="Agent status"
        description="Live status of every ARGOS uAgent on Agentverse."
      />

      <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
        {agents.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <ArgosMark size={22} className="text-primary" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] tracking-wider uppercase">
                <Radio
                  className={`h-3 w-3 ${
                    a.status === "online"
                      ? "text-[oklch(0.75_0.15_150)]"
                      : a.status === "degraded"
                        ? "text-primary"
                        : "text-destructive"
                  }`}
                />
                <span className="text-muted-foreground">{a.status}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs tracking-wider text-primary uppercase">{a.role}</div>
              <div className="mt-1 text-lg font-medium text-foreground">{a.name}</div>
              <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs">
              <Stat label="Address" value={a.address} mono />
              <Stat label="Handled" value={a.proposalsHandled.toString()} mono />
              <Stat label="Latency" value={`${a.avgLatencyMs}ms`} mono />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className={`mt-1 truncate text-foreground ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
