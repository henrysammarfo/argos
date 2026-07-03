import { createFileRoute, Link } from "@tanstack/react-router";
import { ArgosMark } from "@/components/argos-logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — ARGOS" },
      { name: "description", content: "Log in to the ARGOS evaluation console." },
      { property: "og:title", content: "Log in — ARGOS" },
      { property: "og:description", content: "Log in to the ARGOS evaluation console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <ArgosMark size={40} className="text-primary" />
          <div>
            <h1 className="text-center text-2xl font-medium tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Log in to your ARGOS console
            </p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          <form
            className="relative z-10 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@funder.org"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <Link
              to="/app"
              className="mt-2 block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Log in
            </Link>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/pricing" className="text-primary hover:underline">
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
