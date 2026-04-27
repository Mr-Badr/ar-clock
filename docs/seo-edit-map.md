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

### Economy

- `src/lib/economy/seo-content.js`
  Main shared edit surface for the principal economy route titles, descriptions, keywords, `searchProfile` query clusters, hub FAQ copy, and schema-facing route copy.
- `src/lib/economy/discovery-content.js`
  Crawlable supporting copy used across economy discovery surfaces.
- `src/lib/economy/page-helpers.js`
  Shared builder that converts the economy `searchProfile` into metadata keywords and schema terms.
- `src/app/economie/*.page.jsx`
  Route composition and any route-only text that is not yet centralized.

### Calculators hubs

- `src/app/calculators/page.jsx`
- `src/app/calculators/finance/page.jsx`
- `src/app/calculators/personal-finance/page.jsx`
- `src/app/calculators/sleep/page.jsx`
- `src/app/calculators/age/page.jsx`
- `src/lib/calculators/data.js`
  Shared calculator catalog data and some visible intent text.

### High-value calculator detail pages

- `src/lib/calculators/finance-page-content.js`
  Shared hero copy, FAQs, quick-answer blocks, `searchProfile` query clusters, section-nav labels, and HowTo schema copy for the principal finance calculator pages.
- `src/lib/calculators/finance-search-coverage.js`
  Shared wrapper that converts finance page research and on-page questions into metadata/schema/search-intent coverage.
- `src/lib/calculators/data.js`
  Titles, route descriptions, keywords, and calculator catalog metadata.
- `src/app/calculators/monthly-installment/page.jsx`
- `src/app/calculators/vat/page.jsx`
- `src/app/calculators/percentage/page.jsx`
- `src/app/calculators/end-of-service-benefits/page.jsx`
  Route composition and page-only prose that remains outside the shared finance copy layer.
- `src/app/calculators/age/page-helpers.js`
  Shared age-tool metadata builder.
- `src/app/calculators/age/*/page.jsx`
  Route-specific age metadata.
- `src/app/calculators/personal-finance/[tool]/page.jsx`
- `src/app/calculators/sleep/[tool]/page.jsx`

## High-priority utility pages

- `src/app/time-now/page.jsx`
- `src/app/time-now/[country]/page.jsx`
- `src/app/time-now/[country]/[city]/page.jsx`
- `src/app/time-difference/page.jsx`
- `src/app/time-difference/[from]/[to]/page.jsx`
- `src/app/mwaqit-al-salat/page.jsx`
- `src/app/mwaqit-al-salat/[country]/page.jsx`
- `src/app/mwaqit-al-salat/[country]/[city]/page.jsx`
- `src/app/date/page.tsx`
- `src/app/date/today/page.tsx`
- `src/app/date/converter/page.tsx`
- `src/app/date/country/[countrySlug]/page.tsx`

## Content clusters

- `src/lib/holidays/metadata.js`
  Holiday route metadata builder.
- `src/app/holidays/page.jsx`
- `src/app/holidays/[slug]/page.jsx`
- `src/app/guides/[slug]/page.jsx`

## Discovery and internal search

- `src/app/fahras/page.jsx`
  Main discovery/site-map page metadata and page behavior.
- `src/app/search/page.jsx`
  Internal search route metadata and search-specific behavior.
- `src/lib/site/discovery.js`
  Main discovery/search map: route definitions, query associations, ranking, and popular internal searches.

## Company and trust pages

- `src/data/site/info-pages.jsx`
  Shared metadata and on-page content for `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, and `/editorial-policy`.

## Suggested editing order

1. Economy pages
2. Calculator hubs
3. Highest-value calculator detail pages
4. Time now / time difference / prayer
5. Holidays and guides
6. Discovery page and internal search terms

## Rule for editing

- Edit the shared domain file first when several pages should move together.
- Keep route metadata in the route file only when the page has truly unique intent.
- Keep shared metadata helpers generic.
- If you discover repeated keyword patterns for a domain, move them into that domain helper instead of repeating them in every page.
- Prefer editing `searchProfile` in the shared domain file instead of manually stuffing route-level keyword arrays.
