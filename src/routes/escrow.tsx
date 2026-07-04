import { createFileRoute } from "@tanstack/react-router";
import { Lock, ShieldCheck, LoaderCircle } from "lucide-react";
import { VideoHero } from "@/components/video-hero";
import { SiteFooter } from "@/components/site-footer";
import { LiveMilestonePreview } from "@/components/live-escrow-preview";

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

        <div className="mt-16">
          <div className="mb-4 text-xs tracking-wider text-muted-foreground uppercase">
            Live escrow from API
          </div>
          <LiveMilestonePreview />
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
