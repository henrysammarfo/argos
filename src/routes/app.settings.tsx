import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { useState } from "react";
import { Save, ExternalLink, CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { useHealthCheck, useHealthDb, useHealthKaspa } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth-context";
import { z } from "zod";

const settingsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/app/settings")({
  validateSearch: settingsSearchSchema,
  head: () => ({
    meta: [{ title: "Settings — ARGOS Console" }],
  }),
  component: SettingsPage,
});

const TABS = ["Account", "Rubric", "Organization", "API keys", "Notifications"] as const;
type Tab = (typeof TABS)[number];

function resolveTab(tabParam?: string): Tab {
  if (!tabParam) return "Account";
  const match = TABS.find((t) => t.toLowerCase() === tabParam.toLowerCase());
  return match ?? "Account";
}

function SettingsPage() {
  const { tab: tabParam } = Route.useSearch();
  const [tab, setTab] = useState<Tab>(() => resolveTab(tabParam));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      "argos-settings",
      JSON.stringify({
        rubric: {
          technical: Number((document.getElementById("rubric-tech") as HTMLInputElement)?.value),
          impact: Number((document.getElementById("rubric-impact") as HTMLInputElement)?.value),
          team: Number((document.getElementById("rubric-team") as HTMLInputElement)?.value),
        },
        org: {
          name: (document.getElementById("org-name") as HTMLInputElement)?.value,
          admin: (document.getElementById("org-admin") as HTMLInputElement)?.value,
          escrow: (document.getElementById("org-escrow") as HTMLInputElement)?.value,
        },
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Program settings"
        description="Defaults, API connectivity, and notification preferences."
        actions={
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Save className="h-4 w-4" /> {saved ? "Saved" : "Save changes"}
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
        {tab === "Account" && <AccountPanel />}
        {tab === "Rubric" && <RubricPanel />}
        {tab === "Organization" && <OrgPanel />}
        {tab === "API keys" && <ApiPanel />}
        {tab === "Notifications" && <NotifPanel />}
      </div>
    </>
  );
}

function AccountPanel() {
  const { user, email, emailVerified, organizationName, verifyEmailCode, resendVerificationCode, refreshUser } =
    useAuth();
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setMsg("");
    try {
      await verifyEmailCode(code.trim());
      await refreshUser();
      setMsg("Email verified successfully.");
      setCode("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMsg("");
    try {
      const newCode = await resendVerificationCode();
      if (newCode) setDemoCode(newCode);
      setMsg("New verification code generated.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not resend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">Account & email</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Your login email and verification status for this isolated workspace.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Email
          </dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            {email || user?.email}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Organization (tenant)
          </dt>
          <dd className="mt-1 text-sm text-foreground">{organizationName}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Email verified
          </dt>
          <dd className="mt-1">
            {emailVerified ? (
              <span className="inline-flex items-center gap-1 text-sm text-[color:var(--approve)]">
                <CheckCircle2 className="h-4 w-4" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-[color:var(--flag)]">
                <XCircle className="h-4 w-4" /> Pending verification
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Role
          </dt>
          <dd className="mt-1 text-sm capitalize text-foreground">{user?.role ?? "admin"}</dd>
        </div>
      </dl>

      {!emailVerified && (
        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
          <div className="text-sm font-semibold text-foreground">Verify your email</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter the 6-digit code from signup (demo mode — no SMTP). This confirms the address
            above is yours.
          </p>
          {demoCode && (
            <p className="mt-2 font-mono text-sm text-primary">
              Demo code: <strong>{demoCode}</strong>
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-32 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm tracking-widest"
            />
            <button
              onClick={() => void handleVerify()}
              disabled={loading || code.length < 6}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify email
            </button>
            <button
              onClick={() => void handleResend()}
              disabled={loading}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Resend code
            </button>
          </div>
        </div>
      )}

      {msg && <p className="mt-4 text-sm text-primary">{msg}</p>}
    </Card>
  );
}

function RubricPanel() {
  const stored =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("argos-settings") ?? "{}") : {};
  const rubric = stored.rubric ?? { technical: 35, impact: 40, team: 25 };

  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">Default rubric weights</div>
      <p className="mt-1 text-xs text-muted-foreground">Must sum to 100. Applied to new rounds.</p>
      <div className="mt-6 max-w-md space-y-5">
        {[
          { label: "Technical", id: "rubric-tech", v: rubric.technical },
          { label: "Impact", id: "rubric-impact", v: rubric.impact },
          { label: "Team", id: "rubric-team", v: rubric.team },
        ].map((r) => (
          <div key={r.id}>
            <div className="flex justify-between text-sm">
              <label htmlFor={r.id} className="font-medium text-foreground">
                {r.label}
              </label>
              <span className="font-mono text-foreground">{r.v}%</span>
            </div>
            <input
              id={r.id}
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
  const { organizationName } = useAuth();
  const stored =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("argos-settings") ?? "{}") : {};
  const org = stored.org ?? {};

  return (
    <Card className="p-5 md:col-span-2">
      <div className="text-sm font-semibold text-foreground">Organization</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          id="org-name"
          label="Program name"
          defaultValue={organizationName || org.name || "Your program"}
        />
        <Field
          id="org-escrow"
          label="Escrow wallet"
          defaultValue={org.escrow ?? "kaspa:qz7...9k3f"}
          mono
        />
        <Field
          id="org-admin"
          label="Program admin email"
          defaultValue={org.admin ?? ""}
        />
        <Field label="Timezone" defaultValue="Europe/London" />
      </div>
    </Card>
  );
}

function ApiPanel() {
  const { data: health } = useHealthCheck();
  const { data: dbHealth } = useHealthDb();
  const { data: kaspaHealth } = useHealthKaspa();

  const services = [
    { name: "ARGOS API", ok: health?.status === "ok", detail: health?.service ?? "—" },
    { name: "PostgreSQL", ok: dbHealth?.status === "ok", detail: dbHealth?.database ?? "—" },
    { name: "Kaspa REST", ok: kaspaHealth?.status === "ok", detail: kaspaHealth?.kaspa ?? "—" },
  ];

  const keys = [
    {
      name: "OpenAI",
      env: "OPENAI_API_KEY",
      url: "https://platform.openai.com/api-keys",
      desc: "Live proposal scoring via gpt-4o",
    },
    {
      name: "JWT session",
      env: "JWT_SECRET",
      url: null,
      desc: "Email/password signup — multi-tenant org isolation",
    },
    {
      name: "ASI:One",
      env: "ASI_ONE_API_KEY",
      url: "https://asi1.ai",
      desc: "Fetch.ai ASI:One discovery demo",
    },
    {
      name: "Agentverse",
      env: "AGENTVERSE_API_KEY (optional)",
      url: "https://agentverse.ai",
      desc: "Register 6 uAgents for Fetch bounty",
    },
    {
      name: "Kaspa",
      env: "KASPA_SEED_PHRASE",
      url: "https://kaspium.io",
      desc: "Milestone escrow releases",
    },
  ];

  return (
    <>
      <Card className="p-5 md:col-span-2">
        <div className="text-sm font-semibold text-foreground">Service health</div>
        <ul className="mt-4 divide-y divide-border">
          {services.map((s) => (
            <li key={s.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                {s.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--approve)]" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-medium text-foreground">{s.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{s.detail}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5 md:col-span-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">Required API keys</div>
          <Link
            to="/app/settings"
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => window.open("/docs/API_KEYS.md", "_blank")}
          >
            Full setup guide
          </Link>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Keys are set in backend <code className="rounded bg-muted px-1">.env</code> — never commit
          them. See{" "}
          <a
            href="https://github.com/henrysammarfo/argos/blob/main/docs/API_KEYS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            docs/API_KEYS.md
          </a>{" "}
          for step-by-step instructions.
        </p>
        <ul className="mt-6 divide-y divide-border">
          {keys.map((k) => (
            <li key={k.name} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">{k.name}</div>
                  <div className="mt-0.5 font-mono text-xs text-muted-foreground">{k.env}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{k.desc}</div>
                </div>
                {k.url && (
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Get key <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5 md:col-span-2">
        <div className="text-sm font-semibold text-foreground">Frontend env</div>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
          {`VITE_API_BASE_URL=http://localhost:8000/api

# Sign up at /signup — JWT stored in sessionStorage after login.`}
        </pre>
      </Card>
    </>
  );
}

function NotifPanel() {
  const opts = [
    { k: "Round starts", d: "When a new grant round is created.", default: true },
    { k: "Flagged for review", d: "When agents flag a proposal for human review.", default: true },
    {
      k: "Milestone verified",
      d: "When Milestone Agent verifies a progress report.",
      default: true,
    },
    { k: "Escrow release", d: "When KAS is released after committee approval.", default: true },
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
              <input type="checkbox" defaultChecked={o.default} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
              <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Field({
  id,
  label,
  defaultValue,
  mono,
}: {
  id?: string;
  label: string;
  defaultValue: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        defaultValue={defaultValue}
        className={`mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}
