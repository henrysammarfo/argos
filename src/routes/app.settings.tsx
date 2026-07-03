import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "Settings — ARGOS Console" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="Settings" title="Program settings" />

      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-medium text-foreground">Default rubric weights</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Must sum to 100. Applied to new rounds.
          </p>
          <div className="mt-6 space-y-4">
            {[
              { label: "Technical", v: 35 },
              { label: "Impact", v: 40 },
              { label: "Team", v: 25 },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{r.label}</span>
                  <span className="font-mono text-foreground">{r.v}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={r.v}
                  className="mt-2 w-full accent-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-medium text-foreground">Organization</div>
          <div className="mt-6 space-y-4">
            <Field label="Program name" defaultValue="Horizon Europe Cluster 5" />
            <Field label="Escrow wallet" defaultValue="kaspa:qz7...9k3f" mono />
            <Field label="Program admin" defaultValue="admin@horizon.eu" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:col-span-2">
          <div className="text-sm font-medium text-foreground">API keys</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Configured via Lovable Cloud when the backend is wired.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Anthropic" defaultValue="sk-ant-••••••••" mono />
            <Field label="Agentverse" defaultValue="av_••••••••" mono />
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  defaultValue,
  mono,
}: {
  label: string;
  defaultValue: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="text-xs tracking-wider text-muted-foreground uppercase">{label}</label>
      <input
        defaultValue={defaultValue}
        className={`mt-2 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}
