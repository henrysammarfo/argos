# ARGOS Theme — Design System

## Brand

- **Name:** ARGOS — the many-eyed watcher
- **Mark:** Hexagonal aperture + central pupil (stroke-only SVG)
- **Wordmark:** Helvetica Now Text, medium tracking-tight

## Color Palette (dark-first)

All colors in oklch. Defined in `src/styles.css`.

| Token          | Value                  | Usage               |
| -------------- | ---------------------- | ------------------- |
| `--background` | `oklch(0.14 0.01 260)` | Page background     |
| `--foreground` | `oklch(0.98 0.005 90)` | Primary text        |
| `--primary`    | `oklch(0.78 0.16 70)`  | Signal amber accent |
| `--accent`     | `oklch(0.55 0.03 240)` | Cool steel          |
| `--muted`      | `oklch(0.22 0.01 260)` | Subtle backgrounds  |
| `--border`     | `oklch(1 0 0 / 8%)`    | Card borders        |
| `--approve`    | `oklch(0.75 0.15 150)` | Approve actions     |
| `--flag`       | `oklch(0.78 0.16 70)`  | Flag/warning        |
| `--reject`     | `oklch(0.65 0.2 25)`   | Reject actions      |

## Console Theme

Dashboard uses **Stripe light** (default) and **Stripe dark** themes:

- `.theme-stripe-light` — white cards, purple `#635BFF`-style primary
- `.theme-stripe-dark` — dark blue-gray cards, brighter purple accent
- Toggle via sun/moon button in console topbar (persisted in localStorage)

Marketing site keeps cinematic dark amber `:root` tokens.

## Typography

- **Font:** Helvetica Now Text (CDN in `__root.tsx`)
- **Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

## Components

- **Marketing:** `VideoHero`, `SiteNav`, `SiteFooter`, `MarketingLayout`
- **Console:** `DashboardShell`, `PageHeader`, `Card`
- **Icons:** Lucide React only — no emoji

## Rules

1. Use semantic tokens — no hardcoded `text-white` / `bg-black`
2. Score bars: 1–10 horizontal progress using `--primary`
3. Human overrides: edit icon + reason on hover
4. Kaspa milestones: timeline with lock/unlock state
5. Tables for ranked results (scannable, not cards)

## Bible Deviation

Build guide specified electric blue `#3B82F6`. Production uses **signal amber** per `.lovable/plan.md` — stronger brand identity.
