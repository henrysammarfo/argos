import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { useCreateEvaluation } from "@/lib/api-hooks";
import { useState } from "react";

export const Route = createFileRoute("/app/setup")({
  head: () => ({
    meta: [{ title: "New Evaluation — ARGOS Console" }],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const createEval = useCreateEvaluation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technical, setTechnical] = useState(30);
  const [impact, setImpact] = useState(40);
  const [team, setTeam] = useState(30);
  const [grantAmount, setGrantAmount] = useState(50000);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await createEval.mutateAsync({
        title,
        description,
        rubric: { technical, impact, team },
        grant_amount_kas: grantAmount,
        milestones: [
          { name: "Phase 1 Complete", date: "2027-03-01", percent: 30 },
          { name: "Phase 2 Complete", date: "2027-09-01", percent: 40 },
          { name: "Final Delivery", date: "2028-03-01", percent: 30 },
        ],
      });
      void navigate({ to: "/app/evaluations/$id", params: { id: result.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create evaluation");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Setup"
        title="New evaluation round"
        description="Configure rubric weights, grant pool, and milestone schedule."
      />

      <div className="p-4 sm:p-6 md:p-8">
        <Card className="max-w-2xl p-6">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Round title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Q3 2026 Climate Grant Round"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Rubric weights (must sum to 100)
              </label>
              <div className="mt-3 space-y-4">
                <RubricSlider label="Technical" value={technical} onChange={setTechnical} />
                <RubricSlider label="Impact" value={impact} onChange={setImpact} />
                <RubricSlider label="Team" value={team} onChange={setTeam} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Total: {technical + impact + team}%
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Grant amount (KAS)</label>
              <input
                type="number"
                value={grantAmount}
                onChange={(e) => setGrantAmount(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createEval.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {createEval.isPending ? "Creating…" : "Create round"}
              </button>
              <Link
                to="/app/evaluations"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

function RubricSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-primary"
      />
    </div>
  );
}
