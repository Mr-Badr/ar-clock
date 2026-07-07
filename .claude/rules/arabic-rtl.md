---
paths:
  - src/components/**
  - src/app/styles/**
  - src/app/**/page.*
  - src/app/**/layout.*
---

# Arabic RTL Layout Rules

## Language and direction
- All user-facing copy is Arabic — no Latin placeholders in UI text
- Root layout sets `dir="rtl"` and `lang="ar"` — never override per component without explicit reason
- `components.json` has `"rtl": false` (shadcn flag) but the app is actually RTL — rely on CSS `dir` attribute, not shadcn's RTL mode

## Design system
- shadcn/ui `new-york` style, slate base color, CSS variables
- Icons: Phosphor (`@phosphor-icons/react`) — primary icon set
- Motion: `motion` library (Framer Motion v12) for animations
- `impeccable` skill handles all visual/layout redesign work — invoke it for UI tasks

## Anti-AI-template visual patterns (owner feedback, 2026-07-08) — never use these
Two patterns look "generated" on sight, no matter how they're colored — never reach for either:
- **Gradient backgrounds** on cards/panels/result boxes. Always flat surfaces (`var(--bg-surface-*)`).
- **Decorative colored border stripes** (`border-top`/`border-bottom`/`border-inline-start`/
  `border-inline-end: 3px solid var(--color)`) added to a card "for visual identity." A colored line
  slapped on a box is exactly as templated-looking as a gradient — it's not a real design decision.

**What to do instead** — carry color with actual visual weight, not a line:
- **Icon chip**: small circular badge (`border-radius: var(--radius-full)`, ~2–2.25rem), tinted
  background (`var(--{color}-subtle)`), matching icon color (`var(--{color}-text)`) — the icon
  communicates the category, the chip communicates the color.
- **Tinted surface** (`color-mix(in srgb, var(--{color}-subtle) 40–55%, var(--surface))`) on a single
  hero/featured element — not applied uniformly across a whole grid of identical cards.
- **Semantic badge/pill** inline in copy when color signals a real state, not decoration.
- For variety across a grid (e.g. 4 stat tiles), rotate the icon-chip color per tile
  (`:nth-child(4n+1..4)`), never rotate a border-stripe color.

Full before/after examples: `.claude/rules/calculator-ui-standards.md` §1b (reference implementation:
`.date-stat-item`/`.date-use-item` in `src/app/styles/components.css`, `/date/today/hijri`).

## RTL-specific patterns
- Use `start`/`end` (logical properties) instead of `left`/`right` in CSS where possible
- Flexbox: `flex-row-reverse` is NOT needed when `dir="rtl"` is set on parent — let browser handle it
- Text alignment: `text-start` (= right in RTL) is the default for Arabic body text
- Numbers in Arabic context: use Arabic-Indic numerals (`١٢٣`) only when explicitly required; Latin digits (`123`) are acceptable in tool outputs and dates
- Icons with directional meaning (arrows, chevrons): flip with `rtl:rotate-180` or use dedicated RTL variants

## Component rules (from `docs/codebase-map.md`)
- Edit shared behavior in `src/lib/...` first
- Edit visual behavior in `src/components/...`
- Use `src/components/seo/JsonLd.tsx` for ALL JSON-LD — never create one-off schema script helpers
- Ad slots are client-rendered and consent-gated — never replace initial SSR content with ad slots

## Layout constraints for Google Ads compliance
- Primary answer/tool/content must appear BEFORE any ad slot in DOM order
- No interstitials, consent prompts, or nav overlays covering H1 or first answer
- Sidebar and sticky ads are outside the primary content flow