# Miqatona Routes And Sitemap Inventory

Rewritten 2026-08-23 — the previous version described the pre-2026-08-09 architecture
(`/calculators`, `/blog`, `/fahras`) which was fully retired that wave. This version was checked
against the live site and the current codebase, not carried forward by assumption.

Canonical production domain: `https://miqatona.com`

Primary robots URL:
- `https://miqatona.com/robots.txt`

Primary sitemap submission URL:
- `https://miqatona.com/sitemap-index.xml`

## Public Pages

### Core pages
- `/` — homepage
- `/about`
- `/author/[id]` — author bio pages (e.g. `/author/badr`)
- `/contact`
- `/privacy`
- `/terms`
- `/disclaimer`
- `/editorial-policy`
- `/countdown` — standalone countdown tool (deliberately `noindex` via `x-robots-tag` in
  `src/proxy.ts`, not via page metadata — see the comment in `src/app/countdown/page.jsx`)

### Utility pages (public but intentionally not indexable)
- `/search` — internal search, `noindex, follow`
- `/offline` — offline fallback, `noindex, nofollow`

### Retired (hard 404, no live route) — see `next.config.js` for the redirect exceptions below
- `/calculators*` — replaced by `/tools/*` (2026-08-09). ~140 specific old URLs (the ones
  confirmed via GSC to still carry real search impressions) 301-redirect to their closest living
  `/tools/*` equivalent; everything else 404s by design.
- `/blog*`, `/guide*`, `/guides*` — retired. A handful of specific legacy article URLs redirect to
  their closest living `/tools/*` page (see `LEGACY_BLOG_CANONICAL_REDIRECTS` in `next.config.js`);
  `src/app/guides` (the dead, page-less route directory) was deleted 2026-08-23.
- `/fahras*` — retired discovery/site-map page. `/search` is now the only in-app discovery surface.
- `/mwaqit-al-salat*` — prayer times, fully deleted (~155 files), no redirect.
- `/map` — the real handler is now the `{ source: '/map', destination: '/' }` entry in
  `LEGACY_INDEXING_REDIRECTS`. `src/app/map/route.ts` (an identical, but unreachable — Next.js
  config-level redirects are matched before any app route — 308-to-`/` handler) was dead code and
  was deleted 2026-08-23.

### Tools
- `/tools` — hub index
- `/tools/<category>` — 24 categories: gulf-finance, personal-finance, sleep, health, education,
  construction, electrical, plumbing, hvac, islamic, ecommerce, car-maintenance, carpenter,
  cleaning, landscaping, pest-control, pools, elevators, welding, scaffolding, garage-doors,
  aluminum-glass, cctv, attendance
- `/tools/<category>/<tool>` — individual calculator/guide pages (169 as of 2026-08-23, tracked in
  `src/lib/seo/calculator-route-manifest.js`)

### Time now
- `/time-now`
- `/time-now/[country]`
- `/time-now/[country]/[city]`

### Ramadan imsakiya
- `/imsakiya`
- `/imsakiya/[country]`
- `/imsakiya/[country]/[city]`

### Holidays
- `/holidays`
- `/holidays/[slug]` — canonical event pages (alias slugs resolve but are excluded from the sitemap)
- `/holidays/country` — country-hub directory
- `/holidays/country/[country]` — per-country official-holidays hub (29 countries; `.ics` calendar
  export at `/holidays/country/[country]/calendar.ics`)

### Time difference
- `/time-difference`
- `/time-difference/converter`
- `/time-difference/[from]/[to]`

### Date
- `/date`
- `/date/today`
- `/date/today/hijri`
- `/date/today/gregorian`
- `/date/converter`
- `/date/gregorian-to-hijri`
- `/date/hijri-to-gregorian`
- `/date/hijri-months`
- `/date/country` — country date directory
- `/date/country/[countrySlug]` — all real countries are indexable (was priority-only with
  `noindex, follow` for the rest; broadened 2026-08-24 — see `GEO_ROUTE_INDEXING_POLICIES.dateCountry`)
- `/date/calendar` — Gregorian calendar directory
- `/date/calendar/[year]`
- `/date/calendar/hijri` — Hijri calendar directory
- `/date/calendar/hijri/[year]`
- `/date/[year]/[month]/[day]`
- `/date/hijri/[year]/[month]/[day]`

## Sitemap Routes

### Root sitemap layer
- `/robots.txt`
- `/sitemap-index.xml` — lists all 11 sitemaps below (source: `SITEMAP_INDEX_PATHS` in
  `src/lib/seo/site-architecture.js`)
- `/sitemap.xml` — curated root architecture pages, including `/tools/*` promoted as first-class
  entries (deliberate duplication with `/tools/sitemap.xml` — harmless, see comment in
  `src/lib/seo/site-architecture.js`)

### Feature sitemaps
- `/tools/sitemap.xml` — every `/tools/*` route, derived from `ALL_CALCULATOR_SEO_ROUTES`
  (verified 2026-08-23: 169/169 in sync with the actual `page.jsx` files on disk, no drift either
  direction)
- `/holidays/sitemap.xml` — canonical event pages + all 29 `/holidays/country/[country]` hubs
  (country hubs added 2026-08-23 — they existed live and were internally linked from `/holidays`
  but had never been sitemapped)
- `/time-difference/sitemap.xml` — grew ~155 → ~8,200 URLs 2026-08-24: hub-pair generation now
  pulls real per-country cities DB-first (`getTopCitiesByCountry`) instead of one hub city per
  country — see `src/lib/seo/time-difference-priority-pairs.js`
- `/time-now/sitemap.xml` — already ALL-scoped (every real country + city, `GEO_ROUTE_INDEXING_
  POLICIES.timeNow`); unchanged 2026-08-24, used as the reference pattern for the other fixes below
- `/imsakiya/sitemap.xml` — broadened 2026-08-24 from a ~20-country/60-city curated slice to all
  real countries/cities (`getAllCountrySlugs`/`getAllCityParams`)
- `/date/sitemaps/static`
- `/date/sitemaps/countries` — broadened 2026-08-24 from priority-only (~38 countries) to all real
  countries (`GEO_ROUTE_INDEXING_POLICIES.dateCountry` scope PRIORITY → ALL)
- `/date/sitemaps/calendars`
- `/date/gregorian/sitemap.xml` — rolling Gregorian daily pages within ±370 days
- `/date/hijri/sitemap.xml` — rolling Hijri daily pages within ±370 days

### Date child/diagnostic sitemap routes (not in `SITEMAP_INDEX_PATHS`, exist for legacy compatibility)
- `/date/sitemap.xml` — feature-local diagnostic index
- `/date/gregorian/sitemap/[year]`
- `/date/hijri/sitemap/[year]`

## Legacy Redirects (`next.config.js`)

Two arrays, both mapped to `permanent: true` (308) redirects:

- `LEGACY_BLOG_CANONICAL_REDIRECTS` — old `/blog/*`, `/guide/*`, `/guides/*` article URLs still
  carrying search visibility, repointed to their closest living `/tools/*` page.
- `LEGACY_INDEXING_REDIRECTS` — ~140 entries. The first block (found 2026-08-11 via a live
  `site:miqatona.com` check) covers old `/calculators/*` URLs Google was still ranking plus a few
  typo/legacy geo slugs (`/time-now/netherlands` → `/time-now/the-netherlands`, Arabic-slug
  variants, retired sub-city pages). The large bulk block (added 2026-08-18) covers all
  `/calculators/*` URLs confirmed via a real GSC export to still generate impressions/clicks
  (126K impressions / 1,850 clicks per 28 days across 117 URLs at the time) — exact tool matches
  point to their direct `/tools/*` equivalent, retired tools with no direct replacement (e.g.
  `percentage`, `vat`, generic insurance/mortgage/loan variants) point to the closest relevant hub.

**Verified 2026-08-23**: all 140 redirect sources are unique (no conflicting duplicate mappings),
and all 65 unique destinations return live `200` pages — no broken redirect chains, no soft-404s
in this list.

There is also a general, unrelated redirect block for `www` → apex host, and two stray
`/&`/`/%26` cleanup redirects.

## Intentionally Not In Sitemaps

- `/search` and all query variants — internal search results use `noindex, follow`
- `/offline` — utility/offline fallback page uses `noindex, nofollow`
- `/countdown` — real, indexable-quality content but deliberately `noindex` via response header
  (see `src/app/countdown/page.jsx` comment) rather than page metadata, to avoid a prerender issue
- invalid dynamic placeholders and unknown country/city/date paths — return `404`
- holiday alias routes — excluded in favor of their canonical holiday pages
- daily Gregorian and Hijri date pages outside the rolling ±370-day window
- Gregorian and Hijri calendar years outside the current-year ±2 window
- legacy per-year daily sitemaps are not listed in the root sitemap index
- API routes under `/api/*`
- metadata/image/helper routes such as Open Graph image handlers

These exclusions are intentional. Submitting every reachable route would create
duplicate, thin, utility, or low-relevance URLs and can make Search Console
coverage noisier rather than improving discovery.

## Google Search Console Submission List

Recommended steady-state submission:
- `https://miqatona.com/sitemap-index.xml`

Optional temporary diagnostic submissions:
- `https://miqatona.com/sitemap.xml`
- `https://miqatona.com/tools/sitemap.xml`
- `https://miqatona.com/holidays/sitemap.xml`
- `https://miqatona.com/time-difference/sitemap.xml`
- `https://miqatona.com/time-now/sitemap.xml`
- `https://miqatona.com/imsakiya/sitemap.xml`
- `https://miqatona.com/date/sitemaps/static`
- `https://miqatona.com/date/sitemaps/countries`
- `https://miqatona.com/date/sitemaps/calendars`
- `https://miqatona.com/date/sitemap.xml` — optional feature-local diagnostic index

## AI crawler policy (updated 2026-08-23)

`robots.txt` (`src/app/robots.js`) no longer blocks any AI crawler — the previous explicit
`GPTBot`/`ChatGPT-User` disallow blocks were removed on owner directive so every AI bot (named or
not yet invented) falls through to the `userAgent: '*'` allow rule. `AhrefsBot`/`SemrushBot` remain
blocked — that's an unrelated, separate call (competitive SEO tooling, not AI visibility).
