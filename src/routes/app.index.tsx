import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { evaluations, agents } from "@/lib/mock-data";
import {
  FileStack,
  AlertTriangle,
  CheckCircle2,
  Coins,
  ArrowUpRight,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — ARGOS Console" },
      { name: "description", content: "ARGOS console overview: rounds, KPIs, agent health." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const active = evaluations.filter((e) => e.status !== "complete");
  const totalProposals = evaluations.reduce((a, b) => a + b.proposalCount, 0);
  const totalFlagged = evaluations.reduce((a, b) => a + b.flaggedCount, 0);
  const totalKas = evaluations.reduce((a, b) => a + b.grantAmountKas, 0);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Good morning, Kwame."
        description="Two rounds active. Eight proposals flagged for your review."
      />

      <div className="grid gap-4 p-6 md:grid-cols-4 md:p-8">
        <Kpi label="Active rounds" value={active.length.toString()} icon={FileStack} />
        <Kpi label="Proposals in flight" value={totalProposals.toString()} icon={FileStack} />
        <Kpi label="Flagged for review" value={totalFlagged.toString()} icon={AlertTriangle} tone="flag" />
        <Kpi
          label="Escrow under management"
          value={`${(totalKas / 1_000_000).toFixed(1)}M KAS`}
          icon={Coins}
        />
      </div>

      <div className="grid gap-6 px-6 pb-8 md:grid-cols-3 md:px-8">
        {/* Active rounds */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="text-sm font-medium text-foreground">Active rounds</div>
            <Link
              to="/app/evaluations"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              All rounds <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {evaluations.map((e) => (
              <Link
                key={e.id}
                to="/app/evaluations/$id"
                params={{ id: e.id }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{e.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {e.proposalCount} proposals · {e.flaggedCount} flagged ·{" "}
                    {(e.grantAmountKas / 1000).toFixed(0)}K KAS
                  </div>
                </div>
                <StatusPill status={e.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Agent health */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4 text-sm font-medium text-foreground">
            Agent health
          </div>
          <div className="divide-y divide-border">
            {agents.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3">
                <Radio
                  className={`h-3.5 w-3.5 flex-shrink-0 ${
                    a.status === "online"
                      ? "text-[oklch(0.75_0.15_150)]"
                      : a.status === "degraded"
                        ? "text-primary"
                        : "text-destructive"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.avgLatencyMs}ms · {a.proposalsHandled} handled
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-12 md:px-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-medium text-foreground">Recent activity</div>
          <ul className="mt-4 space-y-3 text-sm">
            <ActivityRow
              icon={CheckCircle2}
              tone="approve"
              text="Milestone M2 released on esc-001 — 72,000 KAS to Threshold Labs"
              time="2h ago"
            />
            <ActivityRow
              icon={AlertTriangle}
              tone="flag"
              text="Impact agent flagged Prop #23 — vague success criteria"
              time="4h ago"
            />
            <ActivityRow
              icon={CheckCircle2}
              tone="approve"
              text="Round Q1 Open Source marked complete — 34 proposals resolved"
              time="yesterday"
            />
          </ul>
        </div>
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "flag";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Icon className={`h-4 w-4 ${tone === "flag" ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="mt-4 text-3xl font-medium tracking-tight text-foreground">{value}</div>
    </div>
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

function ActivityRow({
  icon: Icon,
  tone,
  text,
  time,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "approve" | "flag";
  text: string;
  time: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon
        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
          tone === "approve" ? "text-[oklch(0.75_0.15_150)]" : "text-primary"
        }`}
      />
      <div className="flex-1 text-foreground">{text}</div>
      <div className="flex-shrink-0 text-xs text-muted-foreground">{time}</div>
    </li>
  );
}
