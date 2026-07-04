import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ARGOS" },
      {
        name: "description",
        content: "Pilot, Program, and Enterprise plans for grant funders using ARGOS.",
      },
      { property: "og:title", content: "Pricing — ARGOS" },
      {
        property: "og:description",
        content: "Simple pricing that scales with your grant volume.",
      },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Pilot",
    price: "£2,400",
    unit: "per round",
    tag: "Best for a single review round",
    features: [
      "Up to 60 proposals per round",
      "3 evaluator agents",
      "Kaspa escrow — 1 contract",
      "Email support",
    ],
    cta: "Start a pilot",
    highlight: false,
  },
  {
    name: "Program",
    price: "£1,800",
    unit: "per month",
    tag: "For running funders",
    features: [
      "Unlimited proposals",
      "All 6 agents on Agentverse",
      "Unlimited Kaspa escrow contracts",
      "Custom rubric weights",
      "Slack support",
    ],
    cta: "Open a program",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "annual",
    tag: "Multi-program, multi-region",
    features: [
      "SSO + audit exports",
      "Dedicated Agentverse deployment",
      "Multi-signature escrow governance",
      "On-site training + demo day",
      "SLA + dedicated support",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Priced by the round, not per seat.
          </h1>
          <p className="mt-4 text-muted-foreground">
            No per-reviewer fees. No compute surprises. Escrow gas is billed at cost.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`liquid-glass rounded-2xl p-8 ${t.highlight ? "ring-2 ring-primary" : ""}`}
            >
              <div className="relative z-10">
                {t.highlight && (
                  <div className="mb-4 inline-flex items-center rounded-full bg-primary/20 px-2.5 py-1 text-[10px] tracking-wider text-primary uppercase">
                    Most chosen
                  </div>
                )}
                <div className="text-sm text-muted-foreground">{t.tag}</div>
                <div className="mt-2 text-xl font-medium text-foreground">{t.name}</div>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-medium tracking-tight text-foreground">
                    {t.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{t.unit}</span>
                </div>

                <ul className="mt-8 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`mt-10 block rounded-full px-6 py-3 text-center text-sm font-semibold ${
                    t.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Non-profits and public-sector funders — ask us about GCC Category 1 pricing.
        </div>
      </div>
    </MarketingLayout>
  );
}
