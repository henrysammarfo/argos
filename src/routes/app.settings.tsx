import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { useState } from "react";
import { Save } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "Settings — ARGOS Console" }],
  }),
  component: SettingsPage,
});

const TABS = ["Rubric", "Organization", "API keys", "Notifications"] as const;
type Tab = (typeof TABS)[number];

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Rubric");

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Program settings"
        description="Defaults applied to every new grant round."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
            <Save className="h-4 w-4" /> Save changes
          </button>
        }
      />

      <div className="border-b border-border bg-background px-4 sm:px-6 md:px-8">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-8">
        {tab === "Rubric" && <RubricPanel />}
        {tab === "Organization" && <OrgPanel />}
        {tab === "API keys" && <ApiPanel />}
        {tab === "Notifications" && <NotifPanel />}
      </div>
    </>
  );
}

function RubricPanel() {
  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">Default rubric weights</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Must sum to 100. Applied to new rounds.
      </p>
      <div className="mt-6 space-y-5 max-w-md">
        {[
          { label: "Technical", v: 35 },
          { label: "Impact", v: 40 },
          { label: "Team", v: 25 },
        ].map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{r.label}</span>
              <span className="font-mono text-foreground">{r.v}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={r.v}
              className="mt-2 w-full accent-primary"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

function OrgPanel() {
  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">Organization</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Program name" defaultValue="Horizon Europe Cluster 5" />
        <Field label="Escrow wallet" defaultValue="kaspa:qz7...9k3f" mono />
        <Field label="Program admin" defaultValue="admin@horizon.eu" />
        <Field label="Timezone" defaultValue="Europe/Brussels" />
      </div>
    </Card>
  );
}

function ApiPanel() {
  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">API keys</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Configured via Lovable Cloud when the backend is wired.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Anthropic" defaultValue="sk-ant-••••••••" mono />
        <Field label="Agentverse" defaultValue="av_••••••••" mono />
      </div>
    </Card>
  );
}

function NotifPanel() {
  const opts = [
    { k: "Round starts", d: "When a new grant round is created." },
    { k: "Flagged for review", d: "When agents can't reach consensus on a proposal." },
    { k: "Milestone verified", d: "When Milestone Agent signs a release transaction." },
  ];
  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">Notifications</div>
      <ul className="mt-6 divide-y divide-border">
        {opts.map((o) => (
          <li key={o.k} className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{o.k}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{o.d}</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </label>
          </li>
        ))}
      </ul>
    </Card>
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
      <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </label>
      <input
        defaultValue={defaultValue}
        className={`mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}
