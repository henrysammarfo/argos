import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSearch, Cpu, Users, Coins, ArrowRight } from "lucide-react";
import { VideoHero } from "@/components/video-hero";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — ARGOS" },
      {
        name: "description",
        content:
          "The ARGOS product tour: intake, multi-agent evaluation, human-in-the-loop review, and Kaspa milestone escrow.",
      },
      { property: "og:title", content: "Product — ARGOS" },
      {
        property: "og:description",
        content: "Four stages, one auditable pipeline for grant and procurement evaluation.",
      },
    ],
  }),
  component: ProductPage,
});

const sections = [
  {
    icon: FileSearch,
    kicker: "01 · Intake",
    title: "Every proposal, in the same shape.",
    body: "PDF, URL, or plain text goes in. Structured extractions — objectives, workplan, budget, milestones, team, prior work — come out. Nothing hand-typed. Nothing lost between reviewers.",
    bullets: [
      "PyMuPDF + Claude for high-fidelity extraction",
      "URL fetch + HTML → markdown pipeline",
      "Normalized budget lines and timelines",
    ],
  },
  {
    icon: Cpu,
    kicker: "02 · Evaluate",
    title: "Three evaluators, in parallel, with reasoning.",
    body: "Technical, Impact, and Team agents each score against your rubric weights. Every number carries a cited rationale. Disagreement between agents triggers a human review flag automatically.",
    bullets: [
      "Rubric weights configurable per round",
      "Claude reasoning attached to every score",
      "Confidence bands drive the review queue",
    ],
  },
  {
    icon: Users,
    kicker: "03 · Approve",
    title: "Humans see the edge cases only.",
    body: "Reviewers land on a queue of flagged proposals — not fifty PDFs. Approve, override with a note, or send back for re-scoring. Every action lives in the audit log.",
    bullets: [
      "Flag reasons: low confidence, agent disagreement, budget outlier",
      "Overrides recorded with reviewer identity and rationale",
      "Immutable decision trail",
    ],
  },
  {
    icon: Coins,
    kicker: "04 · Pay on delivery",
    title: "Milestone escrow, not lump-sum wire.",
    body: "Approved grants create a Kaspa conditional escrow. Funds release milestone by milestone, verified by the Milestone agent and signed on-chain. No dead capital sitting in a checking account.",
    bullets: [
      "Covenant logic on Kaspa BlockDAG",
      "Milestone agent verifies public artifacts",
      "Program admin co-signs release",
    ],
  },
];

function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <VideoHero fullscreen={false}>
        <div className="flex flex-1 items-start justify-center px-6 pt-16 sm:pt-20 md:pt-24 md:pb-24">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
              Product
            </div>
            <h1 className="mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Four stages. One auditable pipeline.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              From upload to release — how ARGOS moves a round of grant applications through review
              without dropping the paper trail.
            </p>
          </div>
        </div>
      </VideoHero>

      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="space-y-24">
          {sections.map((s, i) => (
            <div
              key={s.kicker}
              className={`grid gap-10 md:grid-cols-2 md:items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-6 font-mono text-xs tracking-wider text-primary uppercase">
                  {s.kicker}
                </div>
                <h2 className="mt-3 text-2xl font-medium tracking-tight text-foreground md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{s.body}</p>
                <ul className="mt-6 space-y-2 text-sm text-foreground">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/10 via-muted/40 to-transparent p-6">
                  <div className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    Stage output
                  </div>
                  <StagePreview index={i} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded-2xl border border-border bg-card p-10 text-center">
          <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            Ready to move a round?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            The console ships with 47 real climate-round proposals for you to walk through.
          </p>
          <Link
            to="/app"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Open the console <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function StagePreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="mt-6 space-y-2 font-mono text-xs text-foreground/80">
        <div>title: "Coastal aquifer resilience..."</div>
        <div>budget_kas: 180000</div>
        <div>milestones: 4</div>
        <div>team_size: 6</div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="mt-6 space-y-3">
        {[
          { label: "Technical", v: 84 },
          { label: "Impact", v: 91 },
          { label: "Team", v: 76 },
        ].map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="text-foreground">{r.v}</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${r.v}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="mt-6 space-y-2 text-xs">
        <div className="rounded-lg border border-[oklch(0.78_0.16_70)]/40 bg-[oklch(0.78_0.16_70)]/10 p-3">
          <div className="text-[oklch(0.78_0.16_70)]">Flagged — low confidence on team score</div>
        </div>
        <div className="rounded-lg border border-border p-3 text-muted-foreground">
          Approved by Dr. K. Adeyemi · 2 days ago
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-2 font-mono text-xs">
      <div className="text-[oklch(0.75_0.15_150)]">✓ M1 · released · 36,000 KAS</div>
      <div className="text-[oklch(0.75_0.15_150)]">✓ M2 · released · 72,000 KAS</div>
      <div className="text-primary">◐ M3 · verifying · 45,000 KAS</div>
      <div className="text-muted-foreground">◯ M4 · locked · 27,000 KAS</div>
    </div>
  );
}
