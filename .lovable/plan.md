
# ARGOS — Brand, Marketing Site & Dashboard

Build the full ARGOS frontend (Lovable side of the hackathon stack) using the flowpath template you supplied as the visual language: cinematic dark video hero, liquid-glass nav & buttons, Helvetica Now Text, Lucide icons. Backend integration (FastAPI/Fetch.ai/Kaspa) is out of scope for this build — all pages render with realistic mock data so the demo is self-contained.

## 1. Brand system

**Name / mark:** ARGOS — the many-eyed watcher. The logo is an inline SVG "iris + aperture" mark: a geometric hexagonal aperture around a central pupil, drawn in stroke-only so it prints clean on hoodies, tote bags, embroidery, and stickers. Two lockups:
- Horizontal: mark + `ARGOS` wordmark in medium tracking-tight
- Standalone mark for favicon / merch chest hit / social avatar

**Wordmark font:** Helvetica Now Text (loaded via the CDN URL from the template), fallback Apple system stack. Set globally in `styles.css`.

**Palette (dark-first, matches the video-hero aesthetic):**
- `--background` near-black `oklch(0.14 0.01 260)`
- `--foreground` warm white `oklch(0.98 0.005 90)`
- `--primary` signal amber `oklch(0.78 0.16 70)` (the "watcher eye" accent — reads well on merch)
- `--accent` cool steel `oklch(0.55 0.03 240)`
- `--muted` `oklch(0.22 0.01 260)`, `--border` `oklch(1 0 0 / 8%)`
- Semantic status: approve `oklch(0.75 0.15 150)`, flag `oklch(0.78 0.16 70)`, reject `oklch(0.65 0.2 25)`

All colors added to `src/styles.css` as semantic tokens — no hardcoded `text-white`/`bg-black` in components.

**Reusable primitives:**
- `LiquidGlass` utility class (from the template spec) + `.animate-dropdown`, `.duration-400` keyframes
- `<ArgosLogo />` component (SVG mark + wordmark, `size` + `markOnly` props)
- `<SiteNav />` — flowpath-style top nav with hover dropdowns and mobile slide-in
- `<SiteFooter />` — minimal, split columns, mark + tagline
- `<VideoHero />` — reusable fullscreen video-background hero used on marketing pages
- `<DashboardShell />` — sidebar + topbar layout for the app

**Icons:** Lucide React throughout (Eye, Aperture, ScanEye, ShieldCheck, Workflow, Coins, Gauge, FileSearch, CheckCircle2, AlertTriangle, ArrowUpRight, etc.). No emoji.

## 2. Routes

Marketing (public, video-hero language):
- `/` — Home. Flowpath-spec hero rebuilt for ARGOS: heading "Evaluate every proposal. Miss nothing." Subhead about 6 weeks → 8 hours. CTAs "Open the console" / "Watch the demo". Below hero: How it works (3 steps), Agent lineup (5 Fetch.ai agents as cards), Kaspa escrow explainer, Numbers strip (25×, 6wk→8h, 300h→12h), CTA band, footer.
- `/product` — Deeper product tour. Sections: Intake, Multi-agent scoring, Human-in-the-loop review, Milestone escrow. Uses the same video hero, tighter copy.
- `/agents` — The five agents (Orchestrator, Intake, Technical, Impact, Team, Milestone) as detailed cards with responsibilities, inputs, outputs, and an "on Agentverse" badge.
- `/escrow` — Kaspa conditional escrow explainer with a milestone timeline diagram.
- `/pricing` — Three tiers (Pilot / Program / Enterprise) styled with liquid-glass cards.
- `/about` — Mission, GCC alignment, builder credit, contact.
- `/merch` — Preview page showing the logo on hoodie/tee/tote/sticker mockups (generated art) so the mark's merch use is proven visually.
- `/login` — Simple glass card form (UI only, no auth wired).

Application (dashboard shell, same brand):
- `/app` — Overview: active rounds, KPIs, recent activity, agent health.
- `/app/evaluations` — List of evaluation rounds with status chips.
- `/app/evaluations/$id` — Single round: proposal table with per-agent scores, filters, "flagged for review" bucket.
- `/app/proposals/$id` — Single proposal detail: source, extracted text preview, per-agent breakdown with reasoning, approve/override/flag actions.
- `/app/agents` — Live agent status board (mocked).
- `/app/escrow` — Escrow contracts list, milestones, release actions.
- `/app/settings` — Rubric weights, org, API keys placeholder.

TanStack file-based routing under `src/routes/`. `_app.tsx` layout route renders `DashboardShell` + `<Outlet />`; marketing routes share `SiteNav` + `SiteFooter` via a small `MarketingLayout` component (not a layout route, to keep the home route matching the flowpath spec exactly).

Each route defines its own `head()` with unique title + description + og:title/og:description. `og:image` only on leaf routes that have a real cover (home, product, agents, escrow) — generated hero stills.

## 3. Hero + video

The `/` hero matches your spec exactly: fullscreen `h-screen w-full overflow-hidden`, autoplay muted looping `<video>` with `object-cover`, `bg-black/10` overlay, top (not fixed) nav with liquid-glass dropdowns, top-aligned hero content with the two CTAs. Video source uses the CloudFront URL you provided. Copy is ARGOS, not flowpath.

Product / Agents / Escrow pages reuse `<VideoHero>` with the same video and different headlines, shorter height (`min-h-[80vh]`).

## 4. Dashboard

`DashboardShell`: left sidebar (mark + nav items with Lucide icons + active state), topbar (round switcher, search, notifications, avatar). Content area uses shadcn `Card`, `Table`, `Badge`, `Tabs`, `Progress`, `Dialog` styled against the dark tokens. All data mocked in `src/lib/mock-data.ts` so pages are demo-ready.

Signature dashboard views:
- Evaluation detail: sortable proposal table, per-agent score columns with mini bar, click row → drawer with reasoning
- Proposal detail: 4-column agent breakdown (Technical / Impact / Team / Milestone) with rationale text and Approve / Override / Flag buttons
- Escrow: milestone timeline component with locked/released chips

## 5. Assets to generate

- Argos hero still (fallback poster for the video) — dark cinematic, amber accent
- 4 merch mockups for `/merch` — black hoodie, cream tee, tote, sticker sheet, all with the aperture mark
- OG cover image for home + product

Generated via `imagegen` at `standard` quality, saved to `src/assets/`.

## 6. Technical notes

- Tailwind v4: tokens in `@theme inline` in `src/styles.css`; Helvetica Now Text loaded via `<link>` in `__root.tsx` `head.links` (never `@import` a URL in styles.css); `.liquid-glass` and `@keyframes dropdown-in` added as top-level CSS (not inside `@layer utilities`).
- Navigation uses `<Link to=...>` from `@tanstack/react-router` everywhere, with `activeProps` on nav items.
- No `-webkit-backdrop-filter` hand-written — only standard `backdrop-filter` (Lightning CSS prefixes it).
- Every route has `head()` metadata; `__root.tsx` gets ARGOS defaults ("ARGOS — AI Grant & Procurement Evaluation") but no og:image.
- All new UI uses semantic tokens; shadcn primitives extended, not restyled inline.
- No backend calls — a `src/lib/api.ts` stub exposes typed functions returning mock data, so wiring to the FastAPI backend later is a one-file swap.

## What I will NOT do in this pass

- No FastAPI / Fetch.ai / Kaspa integration, no Lovable Cloud, no auth — pure frontend with mocks. Say the word and I'll wire Cloud + real endpoints next.
- No animations beyond the spec'd dropdown + mobile menu transitions and subtle fade-ins.
- No real merch print files — `/merch` is a visual preview of the logo in context, not a store.
