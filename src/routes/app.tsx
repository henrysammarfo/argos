import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { ConsoleThemeProvider } from "@/lib/console-theme";
import { hasAuthSession, useAuth } from "@/lib/auth-context";
import { ApiLoading } from "@/components/api-state";
import { useEffect } from "react";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined" && !hasAuthSession()) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Console — ARGOS" },
      { name: "description", content: "The ARGOS evaluation console." },
      { property: "og:title", content: "Console — ARGOS" },
      { property: "og:description", content: "The ARGOS evaluation console." },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({
        to: "/login",
        search: { redirect: window.location.pathname },
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <ApiLoading label="Checking session…" />;
  if (!isAuthenticated) return <ApiLoading label="Redirecting to login…" />;

  return (
    <ConsoleThemeProvider>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </ConsoleThemeProvider>
  );
}
