import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArgosMark } from "@/components/argos-logo";
import { useAuth, hasAuthSession } from "@/lib/auth-context";
import { Loader2, KeyRound } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  beforeLoad: () => {
    if (typeof window !== "undefined" && hasAuthSession()) {
      throw redirect({ to: "/app" });
    }
  },
  head: () => ({
    meta: [
      { title: "Log in — ARGOS" },
      { name: "description", content: "Log in to the ARGOS evaluation console." },
      { property: "og:title", content: "Log in — ARGOS" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(adminKey.trim(), email.trim() || undefined);
      await navigate({ to: redirectTo ?? "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

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
              Sign in with your program admin credentials
            </p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          <form className="relative z-10 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium tracking-wider text-muted-foreground uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@funder.org"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="admin-key"
                className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase"
              >
                <KeyRound className="h-3 w-3" /> Admin API key
              </label>
              <input
                id="admin-key"
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Your ARGOS admin key"
                autoComplete="current-password"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Same key as <code className="rounded bg-muted px-1">ADMIN_API_KEY</code> on the
                backend. Validated live against the API.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || authLoading || !adminKey.trim()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {(submitting || authLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
              Log in
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
