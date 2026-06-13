# Miqatona Routes And Sitemap Inventory

Canonical production domain: `https://miqatona.com`

Primary robots URL:
- `https://miqatona.com/robots.txt`

Primary sitemap submission URL:
- `https://miqatona.com/sitemap-index.xml`

## Public Pages

### Core pages
- `/` — homepage
- `/fahras`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/disclaimer`
- `/editorial-policy`

### Utility pages (public but intentionally not indexable)
- `/search`
- `/offline`

### Blog
- `/blog`
- `/blog/[slug]`

### Calculators
- `/calculators`
- `/calculators/age/*`
- `/calculators/building/*`
- `/calculators/personal-finance/*`
- `/calculators/sleep/*`
- individual finance and percentage calculator routes

### Time now
- `/time-now`
- `/time-now/[country]`
- `/time-now/[country]/[city]`

### Prayer times
- `/mwaqit-al-salat`
- `/mwaqit-al-salat/[country]`
- `/mwaqit-al-salat/[country]/[city]`

### Holidays
- `/holidays`
- `/holidays/[slug]`

### Time difference
- `/time-difference`
- `/time-difference/[from]/[to]`

### Date
- `/date`
- `/date/today`
- `/date/today/hijri`
- `/date/today/gregorian`
- `/date/converter`
- `/date/gregorian-to-hijri`
- `/date/hijri-to-gregorian`
- `/date/country` — country date directory
- `/date/country/[countrySlug]` — priority countries are indexable; other valid countries use `noindex, follow`
- `/date/calendar` — Gregorian calendar directory
- `/date/calendar/[year]`
- `/date/calendar/hijri` — Hijri calendar directory
- `/date/calendar/hijri/[year]`
- `/date/[year]/[month]/[day]`
- `/date/hijri/[year]/[month]/[day]`

## Sitemap Routes

### Root sitemap layer
- `/robots.txt`
- `/sitemap-index.xml`
- `/sitemap.xml`

### Feature sitemaps
- `/calculators/sitemap.xml`
- `/blog/sitemap.xml`
- `/holidays/sitemap.xml`
- `/time-difference/sitemap.xml`
- `/time-now/sitemap.xml`
- `/mwaqit-al-salat/sitemap.xml`
- `/date/sitemap.xml` — feature-local diagnostic index
- `/date/gregorian/sitemap.xml` — rolling Gregorian daily pages within ±370 days
- `/date/hijri/sitemap.xml` — rolling Hijri daily pages within ±370 days

### Date child sitemap routes
- `/date/sitemaps/static`
- `/date/sitemaps/countries`
- `/date/sitemaps/calendars`
- `/date/gregorian/sitemap/[year]` — legacy-compatible diagnostic route filtered to the rolling window
- `/date/hijri/sitemap/[year]` — legacy-compatible diagnostic route filtered to the rolling window

## Sitemap Coverage Map

### Covered by `/sitemap.xml`
- `/`
- `/fahras`
- `/time-now`
- `/mwaqit-al-salat`
- `/holidays`
- `/time-difference`
- `/calculators`
- `/calculators/sleep`
- `/calculators/personal-finance`
- `/calculators/finance`
- `/about`
- `/editorial-policy`
- `/terms`
- `/disclaimer`
- `/privacy`
- `/contact`

### Covered by `/blog/sitemap.xml`
- `/blog`
- canonical `/blog/[slug]` article pages

### Covered by `/calculators/sitemap.xml`
- `/calculators`
- `/calculators/sleep`
- `/calculators/sleep/bedtime`
- `/calculators/sleep/wake-time`
- `/calculators/sleep/sleep-duration`
- `/calculators/sleep/nap-calculator`
- `/calculators/sleep/sleep-debt`
- `/calculators/sleep/sleep-needs-by-age`
- `/calculators/personal-finance`
- `/calculators/personal-finance/emergency-fund`
- `/calculators/personal-finance/debt-payoff`
- `/calculators/personal-finance/savings-goal`
- `/calculators/personal-finance/net-worth`
- `/calculators/finance`
- `/calculators/age`
- `/calculators/age/*`
- `/calculators/building`
- `/calculators/building/cement`
- `/calculators/building/rebar`
- `/calculators/building/tiles`
- `/calculators/building/[country]`
- `/calculators/end-of-service-benefits`
- `/calculators/monthly-installment`
- `/calculators/vat`
- `/calculators/percentage`

### Legacy article redirects
- `/guide`, `/guides`, `/guide/*`, and `/guides/*` permanently redirect to the
  equivalent canonical `/blog` route.
- `/map` permanently redirects to `/fahras`.
- Legacy article URLs are not submitted in any sitemap.

### Covered by `/holidays/sitemap.xml`
- canonical `/holidays/[slug]` pages with `published` or `monitored` status
- holiday alias slugs are intentionally excluded so they cannot compete with canonicals

### Covered by `/time-difference/sitemap.xml`
- `/time-difference`
- popular `/time-difference/[from]/[to]` pairs from the data source

### Covered by `/time-now/sitemap.xml`
- `/time-now/[country]`
- all valid `/time-now/[country]/[city]` pages

### Covered by `/mwaqit-al-salat/sitemap.xml`
- `/mwaqit-al-salat/[country]`
- all valid `/mwaqit-al-salat/[country]/[city]` pages

### Covered by `/date/sitemaps/static`
- `/date`
- `/date/today`
- `/date/today/hijri`
- `/date/today/gregorian`
- `/date/converter`
- `/date/hijri-to-gregorian`
- `/date/gregorian-to-hijri`

### Covered by `/date/sitemaps/countries`
- priority `/date/country/[countrySlug]` pages only

### Covered by `/date/sitemaps/calendars`
- `/date/calendar/[year]` for the current Gregorian year ±2
- `/date/calendar/hijri/[year]` for the current Hijri year ±2

### Covered by rolling daily-date sitemaps
- `/date/[year]/[month]/[day]` within 370 days before or after today
- `/date/hijri/[year]/[month]/[day]` within the same Gregorian relevance window

## Intentionally Not In Sitemaps

- `/search` and all query variants — internal search results use `noindex, follow`
- `/offline` — utility/offline fallback page uses `noindex, nofollow`
- invalid dynamic placeholders and unknown country/city/date paths — return `404`
- `/fahras?q=...` and `/fahras?tab=...` — variants use `X-Robots-Tag: noindex, follow`; only `/fahras` is indexable
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
- `https://miqatona.com/holidays/sitemap.xml`
- `https://miqatona.com/time-difference/sitemap.xml`
- `https://miqatona.com/time-now/sitemap.xml`
- `https://miqatona.com/mwaqit-al-salat/sitemap.xml`
- `https://miqatona.com/date/sitemaps/static`
- `https://miqatona.com/date/sitemaps/countries`
- `https://miqatona.com/date/sitemaps/calendars`
- `https://miqatona.com/date/sitemap.xml` — optional feature-local diagnostic index
