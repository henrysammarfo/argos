import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader } from "@/components/dashboard-shell";
import { evaluations, agents, proposalsFor } from "@/lib/mock-data";
import {
  FileStack,
  AlertTriangle,
  CheckCircle2,
  Coins,
  ArrowUpRight,
  Radio,
  TrendingUp,
  Clock,
  Plus,
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

  // Fake weekly evaluations series for the sparkline
  const series = [12, 18, 15, 24, 22, 28, 34, 31, 38, 42, 47, 52];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Good morning, Kwame."
        description="Two rounds active. Eight proposals flagged for your review."
        actions={
          <>
            <button className="hidden rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted sm:inline-flex">
              Export
            </button>
            <Link
              to="/app/evaluations"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> New round
            </Link>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8 xl:grid-cols-4">
        <Kpi label="Active rounds" value={active.length.toString()} delta="+1 this week" icon={FileStack} />
        <Kpi label="Proposals in flight" value={totalProposals.toString()} delta="+14 vs last week" icon={FileStack} />
        <Kpi
          label="Flagged for review"
          value={totalFlagged.toString()}
          delta="Awaits committee"
          icon={AlertTriangle}
          tone="flag"
        />
        <Kpi
          label="Escrow under management"
          value={`${(totalKas / 1_000_000).toFixed(1)}M KAS`}
          delta="≈ $2.9M USD"
          icon={Coins}
        />
      </div>

      {/* Row: chart + agent health */}
      <div className="grid gap-4 px-4 pb-4 sm:px-6 md:grid-cols-3 md:gap-6 md:px-8 md:pb-6">
        <Card className="md:col-span-2">
          <CardHeader
            title="Proposals evaluated · last 12 weeks"
            action={
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--approve)]">
                <TrendingUp className="h-3.5 w-3.5" /> +38%
              </span>
            }
          />
          <div className="p-5">
            <Sparkline data={series} />
            <div className="mt-3 grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              <div>
                <div className="text-foreground">4.2 h</div>
                Median review time
              </div>
              <div>
                <div className="text-foreground">92%</div>
                Auto-approval rate
              </div>
              <div>
                <div className="text-foreground">1.8%</div>
                Human override rate
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Agent health"
            action={
              <Link
                to="/app/agents"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-border">
            {agents.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                <Radio
                  className={`h-3.5 w-3.5 flex-shrink-0 ${
                    a.status === "online"
                      ? "text-[color:var(--approve)]"
                      : a.status === "degraded"
                        ? "text-[color:var(--flag)]"
                        : "text-destructive"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.avgLatencyMs}ms · {a.proposalsHandled} handled
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${
                    a.status === "online"
                      ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
                      : a.status === "degraded"
                        ? "bg-[color:var(--flag)]/10 text-[color:var(--flag)]"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Active rounds */}
      <div className="grid gap-4 px-4 pb-4 sm:px-6 md:gap-6 md:px-8 md:pb-6">
        <Card>
          <CardHeader
            title="Active rounds"
            action={
              <Link
                to="/app/evaluations"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                All rounds <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border">
            {evaluations.map((e) => {
              const props = proposalsFor(e.id);
              const approvedRatio = props.filter((p) => p.status === "approved").length / Math.max(props.length, 1);
              return (
                <Link
                  key={e.id}
                  to="/app/evaluations/$id"
                  params={{ id: e.id }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 hover:bg-muted/40 md:grid-cols-[minmax(0,2fr)_140px_120px_auto]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{e.title}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {e.proposalCount} proposals · {e.flaggedCount} flagged ·{" "}
                      {(e.grantAmountKas / 1000).toFixed(0)}K KAS
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-[color:var(--approve)]"
                        style={{ width: `${Math.round(approvedRatio * 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {Math.round(approvedRatio * 100)}% approved
                    </div>
                  </div>
                  <div className="hidden text-xs text-muted-foreground md:block">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {new Date(e.createdAt).toLocaleDateString()}
                  </div>
                  <StatusPill status={e.status} />
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent activity" />
          <ul className="divide-y divide-border">
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
        </Card>
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "flag";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg ${
            tone === "flag"
              ? "bg-[color:var(--flag)]/10 text-[color:var(--flag)]"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      {delta && <div className="mt-1 text-xs text-muted-foreground">{delta}</div>}
    </div>
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
    <li className="flex items-start gap-3 px-5 py-3.5">
      <Icon
        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
          tone === "approve" ? "text-[color:var(--approve)]" : "text-[color:var(--flag)]"
        }`}
      />
      <div className="flex-1 text-sm text-foreground">{text}</div>
      <div className="flex-shrink-0 text-xs text-muted-foreground">{time}</div>
    </li>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 640;
  const h = 140;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 20) - 8;
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="var(--primary)" />
      ))}
    </svg>
  );
}
