import { useDashboardStats } from "@/lib/api-hooks";

export function LiveStatsStrip() {
  const { data } = useDashboardStats();

  if (!data) {
    return (
      <>
        <Stat kpi="—" label="active rounds" />
        <Stat kpi="—" label="proposals evaluated" />
        <Stat kpi="—" label="flagged for review" />
        <Stat kpi="—" label="KAS under escrow" />
      </>
    );
  }

  return (
    <>
      <Stat kpi={data.active_rounds.toString()} label="active rounds" />
      <Stat kpi={data.complete_proposals.toString()} label="proposals evaluated" />
      <Stat kpi={data.flagged_proposals.toString()} label="flagged for review" />
      <Stat kpi={`${(data.escrow_managed_kas / 1000).toFixed(0)}K`} label="KAS under escrow" />
    </>
  );
}

function Stat({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">{kpi}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
