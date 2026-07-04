import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, EmptyState } from "@/components/dashboard-shell";
import { ApiError, ApiLoading } from "@/components/api-state";
import { useEscrows, useApproveMilestone } from "@/lib/api-hooks";
import { CheckCircle2, LoaderCircle, Lock, ExternalLink, Coins } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/escrow")({
  head: () => ({
    meta: [{ title: "Escrow — ARGOS Console" }],
  }),
  component: EscrowPage,
});

interface ApiEscrow {
  id: string;
  evaluation_id: string;
  grantee_proposal_id: string;
  total_kas: number;
  escrow_address: string;
  status: string;
  milestones: Array<{
    name: string;
    date?: string;
    percent: number;
    kas_amount?: number;
    status: string;
    release_tx?: string | null;
  }>;
}

function EscrowPage() {
  const { data: apiData, isLoading, isError, refetch } = useEscrows();
  const approveMilestone = useApproveMilestone();
  const [actionMsg, setActionMsg] = useState("");

  if (isLoading) return <ApiLoading label="Loading Kaspa escrows…" />;
  if (isError) {
    return <ApiError message="Cannot load escrows from API." onRetry={() => void refetch()} />;
  }

  const apiEscrows: ApiEscrow[] = apiData?.escrows ?? [];

  const total = apiEscrows.reduce((a, b) => a + b.total_kas, 0);
  const released = apiEscrows.reduce((a, e) => {
    const done = e.milestones
      .filter((m) => m.status === "released")
      .reduce((s, m) => s + (m.kas_amount ?? 0), 0);
    return a + done;
  }, 0);

  const handleSignRelease = async (escrowId: string, milestoneIndex: number) => {
    setActionMsg("");
    try {
      const { submitMilestone, approveMilestone: approve } = await import("@/lib/api");
      const sub = await submitMilestone({
        escrow_id: escrowId,
        milestone_index: milestoneIndex,
        report_text: "Milestone deliverables completed per grant agreement.",
        promised_deliverables: ["Phase deliverables as defined in grant contract"],
      });
      const result = await approve(sub.submission_id, "Committee approved release");
      setActionMsg(`Released ${result.kas_released} KAS — TX: ${result.release_tx_hash}`);
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Release failed");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Escrow"
        title="Kaspa contracts"
        description="Live milestone escrow — funds release only after AI verification + human approval."
      />

      {actionMsg && (
        <div className="border-b border-border bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6 md:px-8">
          {actionMsg}
        </div>
      )}

      <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6 md:p-8">
        <TreasuryStat label="Under management" value={`${total.toLocaleString()} KAS`} />
        <TreasuryStat label="Released" value={`${released.toLocaleString()} KAS`} tone="approve" />
        <TreasuryStat
          label="Locked"
          value={`${(total - released).toLocaleString()} KAS`}
          tone="primary"
        />
      </div>

      <div className="space-y-4 px-4 pb-8 sm:px-6 md:space-y-6 md:px-8">
        {apiEscrows.length === 0 ? (
          <Card>
            <EmptyState
              icon={Coins}
              title="No escrows yet"
              description="Create an escrow after selecting a grant winner from an evaluation round."
            />
          </Card>
        ) : (
          apiEscrows.map((c) => (
            <ApiEscrowCard
              key={c.id}
              escrow={c}
              onSignRelease={(idx) => void handleSignRelease(c.id, idx)}
              releasing={approveMilestone.isPending}
            />
          ))
        )}
      </div>
    </>
  );
}

function ApiEscrowCard({
  escrow,
  onSignRelease,
  releasing,
}: {
  escrow: ApiEscrow;
  onSignRelease: (idx: number) => void;
  releasing: boolean;
}) {
  const released = escrow.milestones
    .filter((m) => m.status === "released")
    .reduce((s, m) => s + (m.kas_amount ?? 0), 0);
  const pct = Math.round((released / escrow.total_kas) * 100) || 0;
  const explorerBase = escrow.escrow_address.startsWith("kaspatest:")
    ? "https://explorer-tn10.kaspa.org/addresses"
    : "https://explorer.kaspa.org/addresses";

  return (
    <Card>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border p-5 md:flex md:flex-wrap md:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {escrow.id.slice(0, 8)}… · {escrow.status}
          </div>
          <div className="mt-1 truncate text-base font-semibold text-foreground md:text-lg">
            Proposal {escrow.grantee_proposal_id.slice(0, 8)}…
          </div>
          <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-[color:var(--approve)]" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{pct}% released</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {escrow.total_kas.toLocaleString()} KAS
          </div>
          <a
            href={`${explorerBase}/${escrow.escrow_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            {escrow.escrow_address.slice(0, 20)}… <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {escrow.milestones.map((m, idx) => (
          <MilestoneRow
            key={idx}
            name={m.name}
            dueDate={m.date ?? "—"}
            kas={(m.kas_amount ?? (m.percent / 100) * escrow.total_kas).toLocaleString()}
            percent={m.percent}
            status={m.status}
            releaseTx={m.release_tx}
            onRelease={m.status === "locked" ? () => onSignRelease(idx) : undefined}
            releasing={releasing}
          />
        ))}
      </ul>
    </Card>
  );
}

function MilestoneRow({
  name,
  dueDate,
  kas,
  percent,
  status,
  releaseTx,
  onRelease,
  releasing,
}: {
  name: string;
  dueDate: string;
  kas: string;
  percent: number;
  status: string;
  releaseTx?: string | null;
  onRelease?: () => void;
  releasing?: boolean;
}) {
  const isReleased = status === "released";
  const isVerifying = status === "verifying";

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto_auto]">
      <div
        className={`grid h-9 w-9 place-items-center rounded-full border-2 ${
          isReleased
            ? "border-[color:var(--approve)] bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
            : isVerifying
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground"
        }`}
      >
        {isReleased ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : isVerifying ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-3.5 w-3.5" />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">Due {dueDate}</div>
        {releaseTx && (
          <a
            href={`https://explorer.kaspa.org/txs/${releaseTx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
          >
            TX {releaseTx.slice(0, 12)}… <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>
      <div className="text-right">
        <div className="font-mono text-sm text-foreground">{kas} KAS</div>
        <div className="text-xs text-muted-foreground">{percent}%</div>
      </div>
      <div className="col-span-3 md:col-span-1">
        {onRelease ? (
          <button
            onClick={onRelease}
            disabled={releasing}
            className="w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 md:w-auto"
          >
            Approve release
          </button>
        ) : (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${
              isReleased
                ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {status}
          </span>
        )}
      </div>
    </li>
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
