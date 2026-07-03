import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { ArgosMark } from "./argos-logo";

type NavItem = {
  label: string;
  to?: string;
  items?: { label: string; to: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Product",
    items: [
      { label: "Overview", to: "/product" },
      { label: "The agents", to: "/agents" },
      { label: "Kaspa escrow", to: "/escrow" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Public funders", to: "/product" },
      { label: "Foundations", to: "/product" },
      { label: "Enterprise procurement", to: "/product" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "Our mission", to: "/about" },
      { label: "Merch", to: "/merch" },
      { label: "Contact", to: "/about" },
    ],
  },
  { label: "Pricing", to: "/pricing" },
];

export function SiteNav({ transparent = true }: { transparent?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  return (
    <nav
      className={`relative z-30 w-full ${transparent ? "" : "border-b border-border bg-background"}`}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-12 lg:px-16">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5">
          <ArgosMark size={28} className="text-primary" />
          <span className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
            ARGOS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) =>
            item.items ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpen(item.label)}
                onMouseLeave={() => setOpen(null)}
              >
                <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground">
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      open === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === item.label && (
                  <div className="liquid-glass animate-dropdown !absolute top-full left-0 min-w-[180px] rounded-xl px-2 py-3 shadow-xl">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to="/app"
            className="liquid-glass rounded-full px-5 py-2 text-sm font-medium text-foreground"
          >
            Open console
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="relative h-9 w-9 md:hidden"
          onClick={() => setMobile((m) => !m)}
          aria-label="Toggle menu"
        >
          <Menu
            className={`absolute inset-0 m-auto h-5 w-5 text-foreground transition-all duration-300 ${
              mobile ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            className={`absolute inset-0 m-auto h-5 w-5 text-foreground transition-all duration-300 ${
              mobile ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute inset-x-4 top-full z-40 md:hidden ${
          mobile
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDuration: "400ms",
          transitionProperty: "opacity, transform",
        }}
      >
        <div className="rounded-2xl bg-[oklch(0.18_0.012_260)]/95 p-6 backdrop-blur-xl">
          {NAV.map((item) => (
            <div key={item.label} className="mb-4">
              {item.to ? (
                <Link
                  to={item.to}
                  className="block text-base font-medium text-foreground"
                  onClick={() => setMobile(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <div className="mb-2 text-base font-medium text-foreground">{item.label}</div>
                  <div className="ml-3 flex flex-col gap-2">
                    {item.items!.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className="text-sm text-foreground/70 hover:text-foreground"
                        onClick={() => setMobile(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
            <Link
              to="/login"
              className="text-sm font-medium text-foreground/90"
              onClick={() => setMobile(false)}
            >
              Log in
            </Link>
            <Link
              to="/app"
              className="liquid-glass rounded-full px-5 py-2 text-center text-sm font-medium text-foreground"
              onClick={() => setMobile(false)}
            >
              Open console
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
