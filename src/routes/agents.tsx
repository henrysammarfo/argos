import { createFileRoute } from "@tanstack/react-router";
import { agents } from "@/lib/mock-data";
import { VideoHero } from "@/components/video-hero";
import { SiteFooter } from "@/components/site-footer";
import { ArgosMark } from "@/components/argos-logo";
import { Radio } from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "The agents — ARGOS" },
      {
        name: "description",
        content:
          "Five Fetch.ai uAgents power ARGOS: Orchestrator, Intake, Technical, Impact, Team, Milestone. All registered on Agentverse.",
      },
      { property: "og:title", content: "The agents — ARGOS" },
      {
        property: "og:description",
        content: "Meet the six-agent evaluation team running on Fetch.ai + Anthropic Claude.",
      },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <VideoHero fullscreen={false}>
        <div className="flex flex-1 items-start justify-center px-6 pt-16 sm:pt-20 md:pt-24 md:pb-24">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
              The agents
            </div>
            <h1 className="mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Six specialists. One rubric.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Every ARGOS agent is a Fetch.ai uAgent registered on Agentverse, discoverable via
              ASI:One, powered by Anthropic Claude for reasoning.
            </p>
          </div>
        </div>
      </VideoHero>

      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="grid gap-5 md:grid-cols-2">
          {agents.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <ArgosMark size={22} className="text-primary" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] tracking-wider uppercase">
                  <Radio
                    className={`h-3 w-3 ${
                      a.status === "online"
                        ? "text-[oklch(0.75_0.15_150)]"
                        : a.status === "degraded"
                          ? "text-primary"
                          : "text-destructive"
                    }`}
                  />
                  <span className="text-muted-foreground">on Agentverse</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-xs tracking-wider text-primary uppercase">{a.role}</div>
                <div className="mt-1 text-2xl font-medium text-foreground">{a.name}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6 text-xs">
                <div>
                  <div className="text-muted-foreground">Address</div>
                  <div className="mt-1 font-mono text-foreground">{a.address}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Handled</div>
                  <div className="mt-1 font-mono text-foreground">{a.proposalsHandled}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg latency</div>
                  <div className="mt-1 font-mono text-foreground">{a.avgLatencyMs}ms</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
