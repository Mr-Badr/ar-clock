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