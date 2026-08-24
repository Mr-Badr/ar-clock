# SEO Edit Map

This file is the short map of the highest-value places to edit titles, descriptions, and keywords after your keyword research.

## Global SEO foundation

- `src/lib/seo/metadata.js`
  Shared metadata builder used by many routes.
- `src/lib/seo/page-search-coverage.js`
  Shared helper that turns page-level keyword research into metadata keywords, schema topics, and visible intent clusters without scattering logic across route files.
- `src/lib/site-config.js`
  Site-wide title/brand/default keywords.
- `src/components/seo/SiteWideSchemas.jsx`
  Site-level structured data and search action.
- `src/components/seo/JsonLd.tsx`
  Shared JSON-LD renderer used by multiple sections so schema output stays consistent.

## Highest-priority money/traffic pages

**`/calculators/*` no longer exists — the whole tree below moved to `/tools/*` in the 2026-08-09
v2 pivot.** Old bookmarks/backlinks land via the ~140-entry redirect list in `next.config.js`, not
via any live `src/app/calculators` route. See `docs/routes-and-sitemaps-inventory.md`.

### Tools hubs (`/tools/<category>`)

- `src/app/tools/page.jsx` — root `/tools` index
- `src/app/tools/<category>/page.jsx` — one per category (gulf-finance, personal-finance, sleep,
  health, education, construction, electrical, plumbing, hvac, islamic, ecommerce, car-maintenance,
  carpenter, cleaning, landscaping, pest-control, pools, elevators, welding, scaffolding,
  garage-doors, aluminum-glass, cctv, attendance) — follow the dot-list hub pattern in
  `.claude/rules/tools-hub-pattern.md`, don't hand-roll a different layout
- `src/lib/calculators/data.js`
  Shared calculator catalog data and some visible intent text (folder name predates the `/tools`
  rename — see `docs/codebase-map.md` Cleanup notes).
- `src/lib/seo/calculator-route-manifest.js`
  Canonical route/priority list for every `/tools/*` page — this is what actually reaches
  `/tools/sitemap.xml` and the root sitemap; edit here (not by guessing) when adding/removing a tool.

### High-value tool detail pages

- `src/lib/calculators/finance-page-content.js`
  Shared hero copy, FAQs, quick-answer blocks, `searchProfile` query clusters, section-nav labels, and HowTo schema copy for the principal `/tools/gulf-finance/*` detail pages.
- `src/lib/calculators/finance-search-coverage.js`
  Shared wrapper that converts finance page research and on-page questions into metadata/schema/search-intent coverage.
- `src/lib/calculators/data.js`
  Titles, route descriptions, keywords, and calculator catalog metadata.
- `src/app/tools/gulf-finance/monthly-installment/page.jsx`
- `src/app/tools/gulf-finance/vat/page.jsx`
- `src/app/tools/gulf-finance/end-of-service-benefits/page.jsx`
  Route composition and page-only prose that remains outside the shared finance copy layer.
- `src/app/tools/health/age-page-helpers.js`
  Shared age-tool metadata builder.
- `src/app/tools/health/age-*/page.jsx`
  Route-specific age metadata.
- `src/app/tools/personal-finance/[tool]/page.jsx`
- `src/app/tools/sleep/[tool]/page.jsx`

(There is no `/tools/gulf-finance/percentage` — that calculator was retired in the 2026-08-03
gulf-finance competitor-research cleanup; the old `/calculators/percentage` URL now redirects to
`/tools/gulf-finance`.)

## High-priority utility pages

- `src/app/time-now/page.jsx`
- `src/app/time-now/[country]/page.jsx`
- `src/app/time-now/[country]/[city]/page.jsx`
- `src/app/time-difference/page.jsx`
- `src/app/time-difference/[from]/[to]/page.jsx`
- `src/app/date/page.tsx`
- `src/app/date/today/page.tsx`
- `src/app/date/converter/page.tsx`
- `src/app/date/country/[countrySlug]/page.tsx`

## Content clusters

- `src/lib/holidays/metadata.js`
  Holiday route metadata builder.
- `src/app/holidays/page.jsx`
- `src/app/holidays/[slug]/page.jsx`
- `src/app/holidays/country/[country]/page.jsx`
  Per-country holiday hub metadata/FAQ (29 countries, `COUNTRY_HUBS` in
  `src/lib/holidays/country-hub-data.js`) — now sitemapped via `src/app/holidays/sitemap.js` as of
  2026-08-23.

(`src/app/guides` was deleted 2026-08-23 — it had no `page.jsx`, the route was already dead.)

## Discovery and internal search

- `src/app/search/page.jsx`
  Internal search route metadata and search-specific behavior — the only in-app discovery surface
  now that `/fahras` is retired (see `docs/codebase-map.md` Cleanup notes).
- `src/lib/site/discovery.js`
  Main discovery/search map: route definitions, query associations, ranking, and popular internal searches.

## Company and trust pages

- `src/data/site/info-pages.jsx`
  Shared metadata and on-page content for `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, and `/editorial-policy`.

## Suggested editing order

1. Calculator hubs
2. Highest-value calculator detail pages
3. Time now / time difference / prayer
4. Holidays and guides
5. Discovery page and internal search terms

## Rule for editing

- Edit the shared domain file first when several pages should move together.
- Keep route metadata in the route file only when the page has truly unique intent.
- Keep shared metadata helpers generic.
- If you discover repeated keyword patterns for a domain, move them into that domain helper instead of repeating them in every page.
- Prefer editing `searchProfile` in the shared domain file instead of manually stuffing route-level keyword arrays.
