import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing-layout";
import { Github, Mail, Landmark } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ARGOS" },
      {
        name: "description",
        content:
          "ARGOS is built for public capital: faster evaluation, more accountable payouts, fully auditable decisions.",
      },
      { property: "og:title", content: "About — ARGOS" },
      {
        property: "og:description",
        content: "Our mission, alignment with GCC Category 1, and the builder behind ARGOS.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-12">
        <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-6xl">
          Public capital deserves a faster committee.
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
          ARGOS started with a single frustration: it takes six weeks for six reviewers to walk
          fifty proposals through the same rubric, and by proposal forty the scoring drifts. We
          think the answer isn't more reviewers — it's a committee that never gets tired, always
          shows its work, and only bothers a human when a real judgment call needs one.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card
            icon={Landmark}
            title="GCC Category 1"
            body="Agents that improve how public capital is evaluated and allocated — exact match. ARGOS is submitted to Category 1 for the 2026 program."
          />
          <Card
            icon={Github}
            title="Open build"
            body="The full ARGOS stack — agents, API, escrow — is public on GitHub. Fork it, run your own funder, contribute back."
          />
          <Card
            icon={Mail}
            title="Reach us"
            body="argos@lovable.dev — for pilots, GCC coordination, or hackathon partnerships."
          />
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8">
          <div className="text-xs tracking-wider text-muted-foreground uppercase">Builder</div>
          <div className="mt-2 text-2xl font-medium text-foreground">Henry Sam Marfo</div>
          <p className="mt-3 text-sm text-muted-foreground">
            github.com/henrysammarfo · Building ARGOS for Demo Day at Imperial College London, July
            4 2026. Hackathon stack: Conduct Track (£8K), Fetch.ai Challenge (£500), Kaspa ($1K
            USDC), GCC Category 1.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}

function Card({
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
