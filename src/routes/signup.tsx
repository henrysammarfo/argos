import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArgosMark } from "@/components/argos-logo";
import { useAuth, hasAuthSession } from "@/lib/auth-context";
import { Loader2, Building2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && hasAuthSession()) {
      throw redirect({ to: "/app" });
    }
  },
  head: () => ({
    meta: [{ title: "Create account — ARGOS" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { register, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const code = await register({
        email: email.trim(),
        password,
        organization_name: orgName.trim(),
        full_name: fullName.trim() || undefined,
      });
      if (code) setVerificationCode(code);
      await navigate({ to: "/app/settings", search: { tab: "account" } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
              Create your workspace
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Each organization gets an isolated tenant — your rounds, proposals, and escrow
              stay private.
            </p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          <form className="relative z-10 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                <Building2 className="h-3 w-3" /> Organization / program name
              </label>
              <input
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Horizon Europe Cluster 5"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Your name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Smith"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="judge@foundation.org"
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="mt-2 w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {verificationCode && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-foreground">
                Verification code (save this):{" "}
                <span className="font-mono font-semibold">{verificationCode}</span> — verify in
                Settings → Account.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {(submitting || authLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
