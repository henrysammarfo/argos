import { createFileRoute } from "@tanstack/react-router";
import { Lock, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { VideoHero } from "@/components/video-hero";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/escrow")({
  head: () => ({
    meta: [
      { title: "Kaspa escrow — ARGOS" },
      {
        name: "description",
        content:
          "Conditional milestone escrow on Kaspa BlockDAG. Funds release when deliverables verify, not before.",
      },
      { property: "og:title", content: "Kaspa escrow — ARGOS" },
      {
        property: "og:description",
        content:
          "Milestone-based fund release, covenant-locked on Kaspa, verified by an AI + human loop.",
      },
    ],
  }),
  component: EscrowPage,
});

function EscrowPage() {
  return (
    <div className="min-h-screen bg-background">
      <VideoHero fullscreen={false}>
        <div className="flex flex-1 items-start justify-center px-6 pt-16 sm:pt-20 md:pt-24 md:pb-24">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
              Kaspa escrow
            </div>
            <h1 className="mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Money moves when
              <br />
              deliverables do.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Every approved grant creates a conditional escrow on the Kaspa BlockDAG. Nothing
              releases until a milestone verifies.
            </p>
          </div>
        </div>
      </VideoHero>

      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Feat
            icon={Lock}
            title="Covenant-locked"
            body="Funds are held in a Kaspa covenant script. The wallet cannot move them without a valid milestone-release condition."
          />
          <Feat
            icon={LoaderCircle}
            title="Agent-verified"
            body="The Milestone agent checks public artifacts — dataset releases, benchmark results, code commits — before signaling ready-to-release."
          />
          <Feat
            icon={ShieldCheck}
            title="Human-signed"
            body="A program admin co-signs the release transaction. Both the AI verification and the human signature live in the audit trail."
          />
        </div>

        {/* Milestone flow diagram */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="text-xs tracking-wider text-muted-foreground uppercase">
            Sample contract · esc-001 · 180,000 KAS
          </div>
          <div className="mt-8 space-y-8">
            {[
              {
                name: "Kickoff + technical spec",
                pct: 20,
                state: "released" as const,
                date: "Feb 14, 2026",
              },
              {
                name: "Reference implementation",
                pct: 40,
                state: "released" as const,
                date: "Apr 28, 2026",
              },
              {
                name: "Field trial + benchmarks",
                pct: 25,
                state: "verifying" as const,
                date: "Aug 15, 2026",
              },
              {
                name: "Public release + docs",
                pct: 15,
                state: "locked" as const,
                date: "Nov 30, 2026",
              },
            ].map((m, i, arr) => (
              <div key={m.name} className="relative flex gap-6">
                {i < arr.length - 1 && (
                  <div className="absolute top-10 bottom-[-2rem] left-[15px] w-px bg-border" />
                )}
                <div
                  className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    m.state === "released"
                      ? "border-[oklch(0.75_0.15_150)] bg-[oklch(0.75_0.15_150)]/20 text-[oklch(0.75_0.15_150)]"
                      : m.state === "verifying"
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {m.state === "released" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : m.state === "verifying" ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="text-base font-medium text-foreground">{m.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {m.pct}% · {((m.pct / 100) * 180000).toLocaleString()} KAS
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Due {m.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Feat({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="mt-6 text-lg font-medium text-foreground">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
