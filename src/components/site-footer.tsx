import { Link } from "@tanstack/react-router";
import { ArgosMark } from "./argos-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <ArgosMark size={28} className="text-primary" />
              <span className="text-lg font-medium tracking-tight text-foreground">ARGOS</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The many-eyed watcher for public capital. Evaluate every proposal. Miss nothing.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Overview", to: "/product" },
              { label: "Agents", to: "/agents" },
              { label: "Escrow", to: "/escrow" },
              { label: "Pricing", to: "/pricing" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", to: "/about" },
              { label: "Merch", to: "/merch" },
              { label: "Log in", to: "/login" },
              { label: "Console", to: "/app" },
            ]}
          />
          <FooterCol
            title="Stack"
            links={[
              { label: "Fetch.ai uAgents", to: "/agents" },
              { label: "Anthropic Claude", to: "/product" },
              { label: "Kaspa escrow", to: "/escrow" },
              { label: "GCC Category 1", to: "/about" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© 2026 ARGOS. Built for Demo Day at Imperial College London.</div>
          <div>Henry Sam Marfo · github.com/henrysammarfo</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <div className="mb-4 text-xs font-semibold tracking-wider text-foreground uppercase">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
