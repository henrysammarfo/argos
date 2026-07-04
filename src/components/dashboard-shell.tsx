import { useState, type ReactNode } from "react";
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
  Menu,
  X,
  ChevronDown,
  LifeBuoy,
  Sun,
  Moon,
} from "lucide-react";
import { ArgosMark } from "./argos-logo";
import { useConsoleTheme, themeClassName } from "@/lib/console-theme";
import { useHealthCheck } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/evaluations", label: "Evaluations", icon: FileStack, exact: false },
  { to: "/app/setup", label: "New Round", icon: FileStack, exact: true },
  { to: "/app/agents", label: "Agents", icon: Cpu, exact: false },
  { to: "/app/escrow", label: "Escrow", icon: Coins, exact: false },
  { to: "/app/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useConsoleTheme();
  const { data: health } = useHealthCheck();
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const apiOnline = health?.status === "ok";

  const initials = email ? email.split("@")[0].slice(0, 2).toUpperCase() : "AD";

  const handleLogout = () => {
    logout();
    void navigate({ to: "/login" });
  };

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className={`${themeClassName(theme)} flex min-h-dvh bg-background text-foreground`}>
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarInner isActive={isActive} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-xl">
            <SidebarInner isActive={isActive} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6 md:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
            <ArgosMark size={22} className="text-primary" />
            <span className="text-base font-semibold tracking-tight text-foreground">ARGOS</span>
          </Link>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search proposals, agents, contracts…"
              className="w-full rounded-lg border border-border bg-background py-2 pr-4 pl-9 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <span
              className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase sm:inline-flex ${
                apiOnline
                  ? "bg-[color:var(--approve)]/10 text-[color:var(--approve)]"
                  : "bg-[color:var(--flag)]/10 text-[color:var(--flag)]"
              }`}
            >
              API {apiOnline ? "online" : "offline"}
            </span>
            <button
              aria-label={theme === "stripe-light" ? "Switch to dark mode" : "Switch to light mode"}
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {theme === "stripe-light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
            <button
              aria-label="Help"
              className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              <LifeBuoy className="h-4 w-4" />
            </button>
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-border bg-background py-1 pr-3 pl-1 text-sm text-foreground shadow-sm hover:bg-muted"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {initials}
              </span>
              <span className="hidden max-w-[120px] truncate sm:inline">{email.split("@")[0]}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({
  isActive,
  onNavigate,
}: {
  isActive: (to: string, exact: boolean) => boolean;
  onNavigate: () => void;
}) {
  const { theme } = useConsoleTheme();
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <Link to="/" onClick={onNavigate} className="inline-flex items-center gap-2.5">
          <ArgosMark size={26} className="text-primary" />
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            ARGOS
          </span>
        </Link>
        <button
          aria-label="Close menu"
          onClick={onNavigate}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        <SidebarSection label="Workspace" />
        {NAV.slice(0, 3).map((item) => (
          <NavLink
            key={item.to}
            item={item}
            active={isActive(item.to, item.exact)}
            onNavigate={onNavigate}
          />
        ))}
        <SidebarSection label="Treasury" />
        {NAV.slice(3, 4).map((item) => (
          <NavLink
            key={item.to}
            item={item}
            active={isActive(item.to, item.exact)}
            onNavigate={onNavigate}
          />
        ))}
        <SidebarSection label="Admin" />
        {NAV.slice(4).map((item) => (
          <NavLink
            key={item.to}
            item={item}
            active={isActive(item.to, item.exact)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Users className="h-3.5 w-3.5" /> ARGOS Console
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Stripe {theme === "stripe-light" ? "light" : "dark"} · connected to live API
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarSection({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
      {label}
    </div>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      }`}
    >
      <item.icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
      {item.label}
    </Link>
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
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border bg-background px-4 py-6 sm:px-6 md:flex md:flex-wrap md:items-end md:justify-between md:gap-6 md:px-8 md:py-8">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
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

// Reusable primitives so app pages stay visually consistent.

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-base font-semibold text-foreground">{title}</div>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-t border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 w-full max-w-[140px] rounded-full bg-muted" />
        </td>
      ))}
    </tr>
  );
}
