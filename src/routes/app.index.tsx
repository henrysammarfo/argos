import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader } from "@/components/dashboard-shell";
import { ApiError, ApiLoading, formatRelativeTime } from "@/components/api-state";
import { useDashboardStats, useDashboardActivity, useAgents } from "@/lib/api-hooks";
import {
  FileStack,
  AlertTriangle,
  CheckCircle2,
  Coins,
  ArrowUpRight,
  Radio,
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
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();
  const { data: activityData } = useDashboardActivity();
  const { data: agentsData } = useAgents();

  if (isLoading) return <ApiLoading label="Loading live dashboard…" />;
  if (isError || !stats) {
    return (
      <ApiError
        message="Cannot reach ARGOS API. Start the backend: cd backend && uvicorn api.main:app --port 8000"
        onRetry={() => void refetch()}
      />
    );
  }

  const rounds = stats.rounds;
  const active = stats.active_rounds;
  const agents = agentsData?.agents ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="ARGOS Console"
        description={`${active} active round${active === 1 ? "" : "s"} · ${stats.total_proposals} proposals · ${stats.flagged_proposals} flagged`}
        actions={
          <Link
            to="/app/evaluations"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New round
          </Link>
        }
      />

      <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8 xl:grid-cols-4">
        <Kpi label="Active rounds" value={active.toString()} icon={FileStack} />
        <Kpi
          label="Proposals in flight"
          value={stats.total_proposals.toString()}
          icon={FileStack}
        />
        <Kpi
          label="Flagged for review"
          value={stats.flagged_proposals.toString()}
          icon={AlertTriangle}
          tone="flag"
        />
        <Kpi
          label="Escrow under management"
          value={`${stats.escrow_managed_kas.toLocaleString()} KAS`}
          icon={Coins}
        />
      </div>

      <div className="grid gap-4 px-4 pb-4 sm:px-6 md:grid-cols-3 md:gap-6 md:px-8 md:pb-6">
        <Card className="md:col-span-2">
          <CardHeader title="Proposals evaluated · last 12 weeks" />
          <div className="p-5">
            <Sparkline data={stats.evaluations_weekly} />
            <div className="mt-3 grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              <div>
                <div className="text-foreground">{stats.complete_proposals}</div>
                Evaluated
              </div>
              <div>
                <div className="text-foreground">{stats.pending_proposals}</div>
                Pending
              </div>
              <div>
                <div className="text-foreground">{stats.grant_pool_kas.toLocaleString()}</div>
                Grant pool KAS
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Agent health"
            action={
              <Link to="/app/agents" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-border">
            {agents.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                <Radio
                  className={`h-3.5 w-3.5 flex-shrink-0 ${
                    a.status === "online" ? "text-[color:var(--approve)]" : "text-destructive"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.proposals_handled} handled · {a.role}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${
                    a.status === "online"
                      ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
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
          {rounds.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No rounds yet.{" "}
              <Link to="/app/setup" className="text-primary hover:underline">
                Create one
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rounds.map((e) => {
                const approvedRatio =
                  e.proposal_count > 0 ? e.approved_count / e.proposal_count : 0;
                return (
                  <Link
                    key={e.id}
                    to="/app/evaluations/$id"
                    params={{ id: e.id }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 hover:bg-muted/40 md:grid-cols-[minmax(0,2fr)_140px_120px_auto]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {e.title}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {e.proposal_count} proposals · {e.flagged_count} flagged ·{" "}
                        {(e.grant_amount_kas / 1000).toFixed(0)}K KAS
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
                      {new Date(e.created_at).toLocaleDateString()}
                    </div>
                    <StatusPill status={e.status} />
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent activity" />
          {(activityData?.activity.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No activity yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {activityData!.activity.map((ev, i) => (
                <ActivityRow
                  key={i}
                  icon={ev.tone === "flag" ? AlertTriangle : CheckCircle2}
                  tone={ev.tone === "flag" ? "flag" : "approve"}
                  text={ev.text}
                  time={formatRelativeTime(ev.time)}
                />
              ))}
            </ul>
          )}
        </Card>
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
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = w / Math.max(data.length - 1, 1);
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
