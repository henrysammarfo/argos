import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ScanEye,
  Workflow,
  ShieldCheck,
  Coins,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { VideoHero } from "@/components/video-hero";
import { SiteFooter } from "@/components/site-footer";
import { ArgosMark } from "@/components/argos-logo";
import { LiveStatsStrip } from "@/components/live-stats-strip";
import { LiveMilestonePreview } from "@/components/live-escrow-preview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARGOS — Evaluate every proposal. Miss nothing." },
      {
        name: "description",
        content:
          "50 grant proposals from 6 weeks of committee review to 8 hours. Multi-agent AI scoring, human-approved, milestone payments locked in Kaspa escrow.",
      },
      { property: "og:title", content: "ARGOS — Evaluate every proposal. Miss nothing." },
      {
        property: "og:description",
        content:
          "Multi-agent AI evaluation for grants and procurement. Fetch.ai + OpenAI + Kaspa. 25× faster, fully auditable.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero — matches flowpath spec exactly, retextured for ARGOS */}
      <VideoHero fullscreen>
        <div className="flex flex-1 items-start justify-center px-6 pt-16 sm:pt-20 md:pt-24">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Evaluate every
              <br />
              proposal. Miss
              <br />
              nothing.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:mt-8 sm:text-base md:text-lg">
              ARGOS runs a team of AI agents across your grant round in parallel — every score
              explained, every edge case flagged for humans, every milestone paid on Kaspa escrow.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
              <Link
                to="/login"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-white/90 sm:px-6 sm:py-3"
              >
                Open the console
              </Link>
              <Link
                to="/product"
                className="liquid-glass rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:px-6 sm:py-3"
              >
                See it live
              </Link>
            </div>
          </div>
        </div>
      </VideoHero>

      {/* Numbers strip */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4 md:px-12">
          <LiveStatsStrip />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            How ARGOS works
          </div>
          <h2 className="mt-6 text-3xl font-medium tracking-tight text-foreground md:text-5xl">
            A committee that never gets tired.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Upload the round. Watch fifty proposals move through the same rubric, in parallel, with
            reasoning attached to every score.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <StepCard
            icon={ScanEye}
            step="01"
            title="Ingest"
            body="PDF, URL, or plain text — the Intake agent extracts every claim, budget line, and milestone into a normalized shape."
          />
          <StepCard
            icon={Workflow}
            step="02"
            title="Evaluate in parallel"
            body="Technical, Impact, and Team agents score against your rubric simultaneously. Every score comes with cited reasoning."
          />
          <StepCard
            icon={ShieldCheck}
            step="03"
            title="Human-approved"
            body="Reviewers see only the edge cases where agents disagree or confidence is low. Approve, override, or flag in one click."
          />
        </div>
      </section>

      {/* Agents grid */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                Five agents. One rubric. Every proposal.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Registered on Agentverse, discoverable via ASI:One, powered by OpenAI gpt-4o for
                reasoning.
              </p>
            </div>
            <Link
              to="/agents"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              See the full lineup <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Orchestrator", role: "Coordinator" },
              { name: "Intake Agent", role: "Ingestion" },
              { name: "Technical Agent", role: "Evaluator" },
              { name: "Impact Agent", role: "Evaluator" },
              { name: "Team Agent", role: "Evaluator" },
              { name: "Milestone Agent", role: "Verifier" },
            ].map((a) => (
              <div
                key={a.name}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <ArgosMark size={22} className="text-primary" />
                  <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                    on Agentverse
                  </span>
                </div>
                <div className="mt-8">
                  <div className="text-xs tracking-wider text-muted-foreground uppercase">
                    {a.role}
                  </div>
                  <div className="mt-1 text-lg font-medium text-foreground">{a.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kaspa escrow band */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5 text-primary" />
              Milestone escrow
            </div>
            <h2 className="mt-6 text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Money moves when deliverables do.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each approved grant creates a Kaspa conditional escrow. Funds release milestone by
              milestone — verified by the Milestone agent, signed by human approval, settled
              on-chain.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Covenant logic locks funds against defined deliverables",
                "Milestone verifier signs release transactions",
                "Full audit trail on the Kaspa BlockDAG",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              to="/escrow"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              How the escrow works <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <LiveMilestonePreview />
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:px-12">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-5xl">
            Ready to move a six-week backlog in an afternoon?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Open the console — every page polls the live FastAPI backend in real time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open the console
            </Link>
            <Link
              to="/pricing"
              className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function StepCard({
  icon: Icon,
  step,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="font-mono text-xs text-muted-foreground">{step}</div>
      </div>
      <div className="mt-8 text-xl font-medium text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
