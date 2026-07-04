import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileStack,
  Users,
  Coins,
  Settings,
  Bell,
  Search,
  Cpu,
} from "lucide-react";
import { ArgosMark } from "./argos-logo";

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/evaluations", label: "Evaluations", icon: FileStack, exact: false },
  { to: "/app/agents", label: "Agents", icon: Cpu, exact: false },
  { to: "/app/escrow", label: "Escrow", icon: Coins, exact: false },
  { to: "/app/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="theme-stripe flex min-h-dvh bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <ArgosMark size={26} className="text-primary" />
            <span className="text-lg font-medium tracking-tight text-sidebar-foreground">
              ARGOS
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-sidebar-accent p-4">
            <div className="text-xs text-muted-foreground">Demo mode</div>
            <div className="mt-1 text-sm text-sidebar-foreground">Frontend-only preview</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Backend at api.argos.dev (mocked)
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background/60 px-4 backdrop-blur sm:px-6 md:px-8">
          <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
            <ArgosMark size={22} className="text-primary" />
            <span className="text-base font-medium tracking-tight text-foreground">ARGOS</span>
          </Link>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search proposals, agents, contracts…"
              className="w-full rounded-full border border-border bg-muted/40 py-2 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
              KA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-background/50 px-6 py-8 md:flex-row md:items-end md:justify-between md:px-8">
      <div>
        {eyebrow && (
          <div className="text-xs tracking-wider text-primary uppercase">{eyebrow}</div>
        )}
        <h1 className="mt-1 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
