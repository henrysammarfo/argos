import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/app")({
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
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
