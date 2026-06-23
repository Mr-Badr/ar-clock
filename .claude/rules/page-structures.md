---
paths:
  - src/app/mwaqit-al-salat/**
  - src/app/time-now/**
  - src/app/time-difference/**
  - src/app/calculators/**
  - src/app/holidays/**
  - src/app/date/**
  - src/app/blog/**
  - src/components/calculators/**
  - src/components/blog/**
---

# Page Structures — Component Patterns

## Calculator pages
All calculator tools use exported components from `src/components/calculators/common.jsx`.
Standard page order:
1. `<CalculatorHero badge title description highlights>` — H1, trust items, AdTopBanner inside
2. `<CalculatorSection id eyebrow title>` — the actual interactive tool form (client component inside)
3. Additional `<CalculatorSection>` blocks — explanation, methodology, examples
4. `<CalculatorSection>` → `<CalculatorFaqSection items>` — FAQ accordion + AdInArticle before it
5. `<CalculatorSection>` → `<RelatedCalculators currentSlug>` — related tools + AdMultiplex at end

Other common primitives: `CalculatorDecisionTable`, `CalculatorInfoGrid`, `CalculatorPolicyNotice`,
`CalculatorEditorialArticle`, `CalculatorResourceLinks`, `CalculatorHubGrid`.

Calculator pages that DON'T use RelatedCalculators (e.g. age) still get AdInArticle via CalculatorFaqSection.

## Prayer pages
Structure for `/mwaqit-al-salat/[country]/page.jsx`:
- Uses `AdLayoutWrapper` as outer container
- AdTopBanner → prayer table → AdInArticle → city directory → GeoInternalLinks → SiteTrustPanel
- AdMultiplex added before SiteTrustPanel (2026-06-22)

Structure for `/mwaqit-al-salat/[country]/[city]/page.jsx`:
- AdTopBanner → prayer table → monthly calendar → AdInArticle × 2 → source links → AdMultiplex → SiteTrustPanel
- Uses `routeStyles` from `@/app/mwaqit-al-salat/PrayerRoutePage.module.css` for section spacing

## Holiday detail pages
Split across two files:
- `src/app/holidays/[slug]/page.jsx` — server component: metadata, AdTopBanner, AdInArticle ×1
- `src/app/holidays/[slug]/HolidayDetailsSections.jsx` — the rest: AdInArticle ×1, AdMultiplex at end
Holiday data resolved from `src/lib/holidays/repository.js` → DO NOT read holiday JSON files directly.

## Blog pages
- `src/components/blog/BlogArticleView.jsx` — AdTopBanner + AdInArticle + AdMultiplex
- `src/components/blog/BlogHubPage.jsx` — AdTopBanner at top
- `src/components/blog/BlogHubClient.jsx` — AdMultiplex
Blog content authored in `src/data/blog/` as JS data files (not JSON).

## Time Now pages
- `/time-now/[country]/page.jsx`: AdTopBanner → country info → AdInArticle → city list → AdMultiplex
- `/time-now/[country]/[city]/page.jsx`: same pattern
Uses `src/lib/time-now-content.js` for copy, `src/components/time-now/TimezoneInfoCard.jsx` for UI.

## Time Difference pages
- `/time-difference/[from]/[to]/page.jsx`: AdTopBanner → comparison tool → AdInArticle → editorial → AdMultiplex
`[from]` and `[to]` are `{country}-{city}` slugs (e.g. `saudi-arabia-riyadh`).

## Date section
- `/date/layout.tsx` adds `AdMultiplex` at the bottom of ALL date pages via layout
- Individual date pages add their own AdTopBanner and AdInArticle
- Hijri and Gregorian daily pages use rolling ±370 day window for indexing

## Shared layout components
- `AdLayoutWrapper` — wrapper used in prayer and time-now pages for sidebar ad positioning
- `SiteTrustPanel` — source/methodology block, always last before `</main>` on long pages
- `GeoInternalLinks` — cross-links to related time/prayer/date pages
- `GeoCityDirectory` — city listing for country pages
- `src/components/seo/JsonLd.tsx` — shared JSON-LD renderer — use this everywhere, no one-off schema helpers

## Geo data access pattern
Pages DO NOT read from DB directly. Access chain:
1. `src/lib/db/queries/countries.ts` / `cities.ts` → reads static snapshot first
2. Falls back to live PostgreSQL only if `ENABLE_LIVE_GEO_DB=true`
3. Variable names: `countrySlug` (from params), `citySlug` (from params)
4. Country params: `const { country: countrySlug } = await params` — always await params first
