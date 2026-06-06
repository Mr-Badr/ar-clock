# Miqatona DESIGN.md v4.1 Implementation Checklist

Last updated: 2026-05-22

This checklist is the execution tracker for bringing the whole app into alignment with `DESIGN.md` v4.1. It covers product UI, Arabic content quality, SEO, Google Search Console cleanup, AdSense readiness, Google Ads landing page quality, performance, accessibility, and production resilience.

Important: the goal is not that every URL Google discovers becomes indexed. Google explicitly treats some non-indexed URLs as valid when they are duplicates, canonical alternates, intentionally noindexed, redirects, or removed pages. The goal for Miqatona is zero unmanaged Search Console problems:

- every important canonical page is indexable, crawlable, useful, and submitted correctly
- every non-indexable URL has an intentional reason documented in this checklist and enforced in code
- every route family avoids infinite thin URL generation
- every page remains useful and trustworthy without ads

Do not mark an item complete because it is planned. Mark it complete only after checking the live rendered page, code path, metadata, content, responsive behavior, and Search Console intent.

## Source References

- Google Search Console Page indexing report: https://support.google.com/webmasters/answer/7440203
- Google helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google link best practices: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google title link guidance: https://developers.google.com/search/docs/appearance/title-link
- Google snippet guidance: https://developers.google.com/search/docs/appearance/snippet
- Google Ads landing page guidance: https://support.google.com/google-ads/answer/6238826
- Google AdSense site readiness: https://support.google.com/adsense/answer/7299563
- Google AdSense Program policies: https://support.google.com/adsense/answer/48182
- Google AdSense ad placement policies: https://support.google.com/adsense/answer/1346295
- Google Publisher Policies: https://support.google.com/publisherpolicies/answer/10502938
- WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## Completion Standard For Every File

Each file-level checkbox below inherits this baseline unless a more specific note is added.

- [ ] Render check: no blank pages, no hydration errors, all dynamic params awaited
- [ ] SEO check: one H1, unique title, description, canonical, indexability policy, Open Graph, JSON-LD where useful
- [ ] Content check: no thin pages, no AI-pattern filler, useful tables, lists, examples, sources, method notes, or next steps where appropriate
- [ ] Arabic content-writing check: apply `.codex/skills/arabic-content-writing/SKILL.md`; first screen answers the reader, copy uses direct address, explanations teach with examples or decision rules, and no paragraph exists only for SEO length
- [ ] Responsive check: mobile 375px, tablet, desktop, large desktop with reserved ad rails where used
- [ ] Performance check: stable LCP, no CLS from ads, header, images, fonts, skeletons, or late data, no unnecessary client JavaScript
- [ ] Accessibility check: keyboard navigation, visible focus, contrast, semantic HTML, accessible names, ARIA only where needed
- [ ] Ads check: content first, labels visible, reserved slots, no accidental clicks, no overlap with navigation, controls, or result modules
- [ ] Arabic check: direct Modern Standard Arabic, no keyword-list titles, no translated-English phrasing, no letter spacing, no justified Arabic
- [ ] UI check: follows v4 spacing, radius, surfaces, button hierarchy, section ordering, data presentation, and no top-border-only section stacks
- [ ] Error resilience check: loading, empty, error, offline, and not-found states are visible, useful, and Arabic
- [ ] Internal links check: curated by intent, descriptive anchor text, smooth Next.js `Link`, no box-dump directories
- [ ] Indexation check: sitemap, canonical, robots, `noindex`, redirects, and 404 behavior match the route policy

## Rollout Governance

- [ ] Create a route inventory export before redesign work begins.
- [ ] Create a Search Console export for every current indexing reason.
- [ ] Group Search Console URLs by route family: `/date`, `/time-now`, `/mwaqit-al-salat`, `/time-difference`, `/calculators`, `/holidays`, `/blog`, static info pages, API and generated files.
- [ ] Decide for each route family which URLs are canonical indexable pages, which are canonical alternates, which are noindex utilities, which redirect, and which return 404.
- [ ] Keep sitemap files aligned with that decision. Never submit a `noindex`, redirect-only, 404, API, search-result, or empty page in an XML sitemap.
- [ ] Ship redesigns in batches by route family, not random isolated files.
- [ ] After each batch, run the validation commands listed at the end of this file.
- [ ] After each production deploy, inspect key URLs with Google Search Console URL Inspection.
- [ ] Request validation only after all examples in the same Search Console issue class are fixed.
- [ ] Track issues for at least 90 days after Search Console clears them because old issue classes can reappear.

## Google Search Console Issue Matrix

Use this section to convert Search Console noise into engineering action.

- [ ] Export `Why pages are not indexed` from Search Console.
- [ ] Export `Indexed pages` and compare with sitemap canonical URLs.
- [ ] Create a sheet with columns: URL, route family, Search Console reason, intended status, current HTTP status, canonical, robots meta, sitemap included, action, owner, validation date.
- [ ] For every reason with source `Website`, fix the root cause before requesting validation.
- [ ] For every reason with source `Google`, inspect examples and document whether the site needs content, link, sitemap, or canonical improvements.

### Errors And Required Actions

- [ ] Server error 5xx: route must build, data fetches must fail visibly, health checks must pass, logs must include route and data source.
- [ ] Redirect error: no redirect loops, chains, invalid encoded dates, malformed country/city slugs, or mixed trailing slash behavior.
- [ ] Submitted URL blocked by robots.txt: remove from sitemap or unblock if it is meant to rank.
- [ ] Submitted URL marked `noindex`: remove from sitemap or remove `noindex` if it is meant to rank.
- [ ] Submitted URL seems Soft 404: return real 404 for invalid resources or add enough unique content if the page is valid.
- [ ] Submitted URL returns 401, 403, or other 4xx: fix access policy, remove from sitemap, or return a branded 404.
- [ ] Not found 404: valid for removed or impossible pages; create 301 only when there is a close replacement.
- [ ] Blocked due to access forbidden 403: public indexable pages must not require auth or block Googlebot incorrectly.
- [ ] Duplicate without user-selected canonical: add explicit canonical and reduce duplicate internal links.
- [ ] Duplicate, Google chose different canonical: inspect whether the declared canonical is weak, duplicated, or missing content.
- [ ] Alternate page with proper canonical tag: acceptable only when the canonical URL is intentional and indexed.
- [ ] Page with redirect: acceptable only when sitemap excludes it and internal links point to the final URL.
- [ ] Excluded by `noindex`: acceptable only for search pages, invalid utility pages, thin filters, error pages, and documented non-ranking variants.
- [ ] Crawled, currently not indexed: improve content usefulness, uniqueness, internal links, page quality, and canonical clarity before resubmitting.
- [ ] Discovered, currently not indexed: reduce low-value URL generation, strengthen internal links to important pages, and keep sitemap focused.
- [ ] Indexed, though blocked by robots.txt: remove robots block if indexable or add `noindex` before blocking if it should disappear.
- [ ] Page indexed without content: fix rendering, streaming, metadata, and data fallback. A page with no useful visible content must not index.
- [ ] Sitemap submitted URL not selected as canonical: fix canonical conflict, duplicate title/content, or sitemap inclusion.

### Route-Family Indexation Policy

- [ ] `/date`: index only useful canonical hubs, today pages, converters, country/year calendar pages, and high-value date pages that contain unique value.
- [ ] `/date/[year]/[month]/[day]`: do not let every possible daily Gregorian URL become a thin indexable page. Define date range, content threshold, canonical behavior, and sitemap inclusion in `src/lib/seo/date-indexing.ts`.
- [ ] `/date/hijri/[year]/[month]/[day]`: same policy as Gregorian daily pages, with Hijri validation and canonical uniqueness.
- [ ] `/date/calendar/[year]` and `/date/calendar/hijri/[year]`: index only valid years with a complete calendar, useful explanation, and stable canonical.
- [ ] Invalid date routes: return branded `not-found`, no sitemap inclusion, no soft 404 shell.
- [ ] `/time-now`: index the hub and valid country/city pages only when they include unique local context, timezone, freshness, useful nearby links, and stable metadata.
- [ ] `/time-now/[country]`: country hub pages must not be empty city directories. They need country-level time context and curated city paths.
- [ ] `/time-now/[country]/[city]`: invalid country or city slugs must return 404, not a generic page.
- [ ] Same-timezone city pages: avoid duplicate content by adding unique location value, canonicalizing where appropriate, or limiting sitemap inclusion.
- [ ] `/mwaqit-al-salat`: index the hub and valid country/city prayer pages with method, timezone, source, monthly context, and useful local links.
- [ ] `/mwaqit-al-salat/[country]`: country pages need more than a list of cities. Add method explanation, popular cities, and local prayer context.
- [ ] `/mwaqit-al-salat/[country]/[city]`: city pages must include today answer, full schedule, method, date, timezone, and monthly path.
- [ ] Invalid prayer country/city URLs: return 404 and never generate sitemap entries.
- [ ] `/time-difference/[from]/[to]`: index popular or useful pairs only. Canonicalize or noindex low-value, duplicate, reversed, malformed, or same-city pairs.
- [ ] `/calculators`: index hubs and individual tools only when the page includes the tool, method, examples, assumptions, FAQ, and related tools.
- [ ] Calculator variants: do not create indexable pages where only labels change and the calculation/content is duplicated.
- [ ] `/blog` and `/blog/[slug]`: index only human-edited posts with author, date, updated date, sources where relevant, original examples, and useful internal links.
- [ ] `/holidays`: index event pages only when package, research, and QA files produce unique country/calendar/context value.
- [ ] `/search`: normally noindex search-result pages unless a curated static search landing page is created with unique content.
- [ ] `/api/*`: never index; API routes must not appear in sitemap.
- [ ] `/ads.txt`, `/robots.txt`, XML sitemap routes: crawlable technical files, not content pages.
- [ ] `/offline`: noindex if it is only a PWA utility page.
- [ ] `/privacy`, `/terms`, `/contact`, `/about`, `/editorial-policy`, `/disclaimer`: indexable trust pages if they are complete, useful, and linked in footer.

## AdSense And Google Ads Readiness

- [ ] Site has substantial unique Arabic publisher content beyond generated utility outputs.
- [ ] About page explains what Miqatona is, who it serves, and why it can be trusted.
- [ ] Contact page has a real working contact method.
- [ ] Privacy page describes analytics, cookies, advertising cookies, personalized ads choices, and data handling.
- [ ] Terms and disclaimer pages are complete and reachable from footer.
- [ ] Editorial policy explains content review, update dates, sources, generated calculations, and corrections.
- [ ] Navigation is aligned, readable, functional, and consistent on mobile and desktop.
- [ ] No page says or implies it is under construction.
- [ ] No thin page receives ads.
- [ ] No error, loading, empty search, 404, or noindex utility page receives ads.
- [ ] Ad labels use only `إعلان` or `روابط إعلانية`.
- [ ] Ads never mimic result cards, app buttons, navigation, filters, calculators, or related links.
- [ ] Ads never sit directly beside play, download, pagination, calculator submit, city selector, date selector, or navigation controls.
- [ ] Ads never use arrows, glow, animation, or visual treatment that draws unnatural attention.
- [ ] The first viewport of a tool page stays ad-free until the user receives the answer or primary tool.
- [ ] Every ad slot has reserved dimensions to avoid CLS.
- [ ] Ad rails on large desktop never squeeze editorial or tool content below readable width.
- [ ] Mobile ad spacing keeps at least 32px from interactive controls.
- [ ] `src/app/ads.txt/route.ts` is correct after AdSense approval.
- [ ] If Google Ads campaigns are used, each campaign points to a dedicated landing page, not a generic homepage.
- [ ] Paid landing page H1, first answer, CTA, and ad promise match exactly.

## DESIGN.md v4 Page And Section Checklist

- [ ] First viewport starts with the user task, not SEO paragraphs or link directories.
- [ ] Each page follows the v4 section order: answer/tool, controls, next paths, supporting content, trust/method, related pathways, FAQ, archive.
- [ ] No section uses top-only border as the main separator.
- [ ] No nested cards.
- [ ] No page uses repeated equal card grids as the main layout language.
- [ ] Internal link blocks are curated by user intent with 2 to 5 best next paths.
- [ ] Full directories appear only after primary value and supporting content.
- [ ] Buttons use consistent variants: primary, secondary, quiet, destructive, filter chip, icon button, and identity-accent where justified.
- [ ] Modern hover/press effects use transform, opacity, color, border, or shadow only. No layout-shifting hover.
- [ ] Radius follows v4 tokens: controls 14px, cards 18px, panels 22px, dialogs 28px, pills only for chips.
- [ ] Whitespace uses v4 density modes and no page is compact from top to bottom.
- [ ] Arabic prose max width is controlled and comfortable.
- [ ] Data modules include value, label, context, method/source, timestamp, and next action.
- [ ] Blog and guides include search, filters, applied chips, result count, useful article cards, and human excerpts.
- [ ] Filters are easy to remove and have a recovery path for zero results.
- [ ] Empty states are designed in Arabic and point to a next action.
- [ ] Error states are specific, recoverable, and do not expose technical details.

## Root And Configuration Files

- [ ] `AGENTS.md`: keep project rules current and aligned with DESIGN.md v4.1.
- [ ] `DESIGN.md`: source of truth for UI, Arabic content, SEO, ads, and editorial UX.
- [ ] `DESIGN_IMPLEMENTATION_CHECKLIST.md`: keep this tracker current as batches are completed.
- [ ] `README.md`: onboarding should mention design/SEO validation workflow.
- [ ] `BRAND_ASSETS_GUIDE.md`: align brand assets with v4 palette, radius, typography, and Arabic identity.
- [ ] `package.json`: scripts include build, SEO audit, unit tests, route health, and content validation.
- [ ] `package-lock.json`: dependency changes reviewed for bundle size and App Router compatibility.
- [ ] `next.config.js`: image, headers, redirects, and experimental flags reviewed for SEO and stability.
- [ ] `next-env.d.ts`: generated Next.js types remain valid after upgrades.
- [ ] `tsconfig.json`: strict typing and path aliases support architecture rules.
- [ ] `tsconfig.tsbuildinfo`: generated build cache is not used as product documentation.
- [ ] `eslint.config.mjs` and `.eslintrc.json`: lint rules do not permit unsafe App Router or accessibility regressions.
- [ ] `postcss.config.js`: CSS pipeline supports tokens without component-level raw hex drift.
- [ ] `components.json`: shadcn/ui setup maps to local primitive strategy.
- [ ] `prisma.config.ts` and `supabase-schema.sql`: generated data routes do not fail when DB is unavailable.
- [ ] `.env.local`: local-only secrets file, never copied into docs or committed.
- [ ] `.env.local.example`: required public/private environment variables documented without secrets.
- [ ] `.gitignore`: excludes secrets, generated caches, local build artifacts, and temporary exports.
- [ ] `.dockerignore`, `Dockerfile`: production build includes needed assets and excludes local secrets.
- [ ] `skills-lock.json`: local skill expectations remain reproducible.
- [ ] `test-filter.js`, `test-norm.js`, `test-schemas.js`, `test-visible.js`: either document their purpose or move into scripts/tests if still used.

## `src/app` Route Checklist

### App Shell, Static Trust Pages, And Technical Routes

- [ ] `src/app/layout.tsx`
- [ ] `src/app/page.jsx`
- [ ] `src/app/error.tsx`
- [ ] `src/app/global-error.tsx`
- [ ] `src/app/not-found.jsx`
- [ ] `src/app/globals.css`
- [ ] `src/app/waqt-ui.css`
- [ ] `src/app/favicon.ico`
- [ ] `src/app/manifest.js`
- [ ] `src/app/robots.js`
- [ ] `src/app/sitemap.js`
- [ ] `src/app/sitemap-index.xml/route.ts`
- [ ] `src/app/ads.txt/route.ts`
- [ ] `src/app/about/page.jsx`
- [ ] `src/app/contact/page.jsx`
- [ ] `src/app/privacy/page.jsx`
- [ ] `src/app/terms/page.jsx`
- [ ] `src/app/disclaimer/page.jsx`
- [ ] `src/app/editorial-policy/page.jsx`
- [ ] `src/app/fahras/page.jsx`
- [ ] `src/app/offline/page.tsx`
- [ ] `src/app/offline/ReloadButton.tsx`

### API And Server Actions

- [ ] `src/app/actions/location.js`
- [ ] `src/app/api/cities-by-country/route.js`
- [ ] `src/app/api/discovery-search/route.js`
- [ ] `src/app/api/health/route.js`
- [ ] `src/app/api/ip-city/route.js`
- [ ] `src/app/api/observability/client/route.js`
- [ ] `src/app/api/og/date/route.tsx`
- [ ] `src/app/api/pdf-calendar/route.js`
- [ ] `src/app/api/revalidate/route.js`
- [ ] `src/app/api/search-city/route.js`
- [ ] `src/app/api/test-prayer/route.js`
- [ ] `src/app/api/weather/route.js`

### Blog And Guides

- [ ] `src/app/blog/layout.jsx`
- [ ] `src/app/blog/page.jsx`
- [ ] `src/app/blog/loading.jsx`
- [ ] `src/app/blog/error.jsx`
- [ ] `src/app/blog/sitemap.js`
- [ ] `src/app/blog/[slug]/page.jsx`
- [ ] `src/app/blog/[slug]/loading.jsx`
- [ ] `src/app/blog/[slug]/error.jsx`
- [ ] `src/app/guides/layout.jsx`

### Calculators

- [ ] `src/app/calculators/layout.jsx`
- [ ] `src/app/calculators/page.jsx`
- [ ] `src/app/calculators/loading.jsx`
- [ ] `src/app/calculators/error.jsx`
- [ ] `src/app/calculators/calculators.css`
- [ ] `src/app/calculators/sitemap.js`
- [ ] `src/app/calculators/finance/page.jsx`
- [ ] `src/app/calculators/monthly-installment/page.jsx`
- [ ] `src/app/calculators/percentage/page.jsx`
- [ ] `src/app/calculators/vat/page.jsx`
- [ ] `src/app/calculators/end-of-service-benefits/page.jsx`
- [ ] `src/app/calculators/personal-finance/page.jsx`
- [ ] `src/app/calculators/personal-finance/[tool]/page.jsx`
- [ ] `src/app/calculators/personal-finance/[tool]/loading.jsx`
- [ ] `src/app/calculators/personal-finance/[tool]/error.jsx`
- [ ] `src/app/calculators/sleep/page.jsx`
- [ ] `src/app/calculators/sleep/[tool]/page.jsx`
- [ ] `src/app/calculators/sleep/[tool]/loading.jsx`
- [ ] `src/app/calculators/sleep/[tool]/error.jsx`
- [ ] `src/app/calculators/building/page.jsx`
- [ ] `src/app/calculators/building/cement/page.jsx`
- [ ] `src/app/calculators/building/rebar/page.jsx`
- [ ] `src/app/calculators/building/tiles/page.jsx`
- [ ] `src/app/calculators/building/[country]/page.jsx`
- [ ] `src/app/calculators/building/[country]/loading.jsx`
- [ ] `src/app/calculators/building/[country]/error.jsx`
- [ ] `src/app/calculators/age/page.jsx`
- [ ] `src/app/calculators/age/page-helpers.js`
- [ ] `src/app/calculators/age/mini-page-seo.jsx`
- [ ] `src/app/calculators/age/tool-sections.jsx`
- [ ] `src/app/calculators/age/calculator/page.jsx`
- [ ] `src/app/calculators/age/birth-day/page.jsx`
- [ ] `src/app/calculators/age/countdown/page.jsx`
- [ ] `src/app/calculators/age/difference/page.jsx`
- [ ] `src/app/calculators/age/hijri/page.jsx`
- [ ] `src/app/calculators/age/milestones/page.jsx`
- [ ] `src/app/calculators/age/planets/page.jsx`
- [ ] `src/app/calculators/age/retirement/page.jsx`

### Date, Calendar, And Conversion

- [ ] `src/app/date/layout.tsx`
- [x] `src/app/date/page.tsx`
- [ ] `src/app/date/loading.tsx`
- [x] `src/app/date/error.tsx`
- [x] `src/app/date/not-found.tsx`
- [x] `src/app/date/today/page.tsx`
- [ ] `src/app/date/today/gregorian/page.tsx`
- [ ] `src/app/date/today/hijri/page.tsx`
- [ ] `src/app/date/today/TodayClientHydration.tsx`
- [x] `src/app/date/converter/page.tsx`
- [x] `src/app/date/converter/ConverterForm.tsx`
- [x] `src/app/date/converter/actions.ts`
- [x] `src/app/date/gregorian-to-hijri/page.tsx`
- [x] `src/app/date/hijri-to-gregorian/page.tsx`
- [x] `src/app/date/[year]/[month]/[day]/page.tsx`
- [ ] `src/app/date/[year]/[month]/[day]/loading.tsx`
- [x] `src/app/date/[year]/[month]/[day]/error.tsx`
- [x] `src/app/date/hijri/[year]/[month]/[day]/page.tsx`
- [ ] `src/app/date/hijri/[year]/[month]/[day]/loading.tsx`
- [x] `src/app/date/hijri/[year]/[month]/[day]/error.tsx`
- [x] `src/app/date/calendar/page.tsx`
- [ ] `src/app/date/calendar/loading.tsx`
- [ ] `src/app/date/calendar/error.tsx`
- [x] `src/app/date/calendar/[year]/page.tsx`
- [ ] `src/app/date/calendar/[year]/loading.tsx`
- [x] `src/app/date/calendar/[year]/error.tsx`
- [x] `src/app/date/calendar/hijri/page.tsx`
- [ ] `src/app/date/calendar/hijri/loading.tsx`
- [ ] `src/app/date/calendar/hijri/error.tsx`
- [x] `src/app/date/calendar/hijri/[year]/page.tsx`
- [ ] `src/app/date/calendar/hijri/[year]/loading.tsx`
- [x] `src/app/date/calendar/hijri/[year]/error.tsx`
- [x] `src/app/date/country/page.tsx`
- [ ] `src/app/date/country/loading.tsx`
- [x] `src/app/date/country/error.tsx`
- [x] `src/app/date/country/DateCountryRedirectClient.tsx`
- [x] `src/app/date/country/[countrySlug]/page.tsx`
- [ ] `src/app/date/country/[countrySlug]/loading.tsx`
- [x] `src/app/date/country/[countrySlug]/error.tsx`
- [ ] `src/app/date/sitemap.xml/route.ts`
- [ ] `src/app/date/gregorian/sitemap.xml/route.ts`
- [ ] `src/app/date/hijri/sitemap.xml/route.ts`
- [ ] `src/app/date/sitemaps/static/route.ts`
- [ ] `src/app/date/sitemaps/countries/route.ts`
- [ ] `src/app/date/sitemaps/calendars/route.ts`

### Holidays

- [ ] `src/app/holidays/page.jsx`
- [ ] `src/app/holidays/loading.jsx`
- [ ] `src/app/holidays/error.jsx`
- [ ] `src/app/holidays/sitemap.js`
- [ ] `src/app/holidays/actions.js`
- [ ] `src/app/holidays/constants.js`
- [ ] `src/app/holidays/data.js`
- [ ] `src/app/holidays/holidays-client-model.js`
- [ ] `src/app/holidays/holidays-filter-utils.js`
- [ ] `src/app/holidays/search-utils.js`
- [ ] `src/app/holidays/HolidaysClient.jsx`
- [ ] `src/app/holidays/HolidaysClientInteractive.jsx`
- [ ] `src/app/holidays/HolidaysClientShell.jsx`
- [ ] `src/app/holidays/HolidaysEventsGrid.jsx`
- [ ] `src/app/holidays/HolidaysFiltersPanel.jsx`
- [ ] `src/app/holidays/HolidaysResultsSummary.jsx`
- [ ] `src/app/holidays/[slug]/page.jsx`
- [ ] `src/app/holidays/[slug]/loading.jsx`
- [ ] `src/app/holidays/[slug]/error.jsx`
- [ ] `src/app/holidays/[slug]/not-found.jsx`
- [ ] `src/app/holidays/[slug]/opengraph-image.jsx`
- [ ] `src/app/holidays/[slug]/CountryDatesSection.jsx`
- [ ] `src/app/holidays/[slug]/CountryTable.jsx`
- [ ] `src/app/holidays/[slug]/HistoricalTable.jsx`
- [ ] `src/app/holidays/[slug]/HolidayDetailsSections.jsx`
- [ ] `src/app/holidays/[slug]/HolidayInternalLinks.jsx`
- [ ] `src/app/holidays/[slug]/RelatedEvents.jsx`

### Prayer Times

- [ ] `src/app/mwaqit-al-salat/page.jsx`
- [ ] `src/app/mwaqit-al-salat/loading.jsx`
- [ ] `src/app/mwaqit-al-salat/error.jsx`
- [ ] `src/app/mwaqit-al-salat/sitemap.js`
- [ ] `src/app/mwaqit-al-salat/[country]/page.jsx`
- [ ] `src/app/mwaqit-al-salat/[country]/loading.jsx`
- [ ] `src/app/mwaqit-al-salat/[country]/error.jsx`
- [ ] `src/app/mwaqit-al-salat/[country]/[city]/page.jsx`
- [ ] `src/app/mwaqit-al-salat/[country]/[city]/loading.jsx`
- [ ] `src/app/mwaqit-al-salat/[country]/[city]/error.jsx`
- [ ] `src/app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx`

### Search

- [ ] `src/app/search/page.jsx`
- [ ] `src/app/search/loading.jsx`
- [ ] `src/app/search/page.module.css`

### Time Difference

- [ ] `src/app/time-difference/page.jsx`
- [ ] `src/app/time-difference/loading.jsx`
- [ ] `src/app/time-difference/error.jsx`
- [ ] `src/app/time-difference/sitemap.js`
- [ ] `src/app/time-difference/[from]/[to]/page.jsx`
- [ ] `src/app/time-difference/[from]/[to]/loading.jsx`
- [ ] `src/app/time-difference/[from]/[to]/error.jsx`
- [ ] `src/app/time-difference/[from]/[to]/time-difference.css`
- [ ] `src/app/time-difference/[from]/[to]/time-snapshot.jsx`
- [ ] `src/app/time-difference/[from]/[to]/TimeConversionTable.client.jsx`

### Time Now

- [ ] `src/app/time-now/page.jsx`
- [ ] `src/app/time-now/loading.jsx`
- [ ] `src/app/time-now/error.jsx`
- [ ] `src/app/time-now/sitemap.js`
- [ ] `src/app/time-now/time-now.module.css`
- [ ] `src/app/time-now/TimeNowClient.jsx`
- [ ] `src/app/time-now/[country]/page.jsx`
- [ ] `src/app/time-now/[country]/loading.jsx`
- [ ] `src/app/time-now/[country]/error.jsx`
- [ ] `src/app/time-now/[country]/opengraph-image.jsx`
- [ ] `src/app/time-now/[country]/[city]/page.jsx`
- [ ] `src/app/time-now/[country]/[city]/loading.jsx`
- [ ] `src/app/time-now/[country]/[city]/error.jsx`
- [ ] `src/app/time-now/[country]/[city]/opengraph-image.jsx`

### App Styles

- [ ] `src/app/styles/base.css`
- [ ] `src/app/styles/components.css`
- [ ] `src/app/styles/utilities.css`
- [ ] `src/app/styles/ads.css`
- [ ] `src/app/styles/editorial-redesign.css`

## `src/components` Checklist

### Root Components

- [ ] `src/components/ErrorBoundary.client.jsx`
- [ ] `src/components/PrayerHero.client.jsx`
- [ ] `src/components/SearchCity.client.jsx`
- [ ] `src/components/SearchCity.css`
- [ ] `src/components/SearchCityWrapper.client.jsx`
- [ ] `src/components/ServiceWorkerRegistration.tsx`

### Ads Components

- [ ] `src/components/ads/AdSenseProvider.jsx`
- [ ] `src/components/ads/AdLayoutWrapper.tsx`
- [ ] `src/components/ads/AdTopBanner.tsx`
- [ ] `src/components/ads/AdInArticle.tsx`
- [ ] `src/components/ads/AdInFeed.tsx`
- [ ] `src/components/ads/AdSidebarSticky.tsx`
- [ ] `src/components/ads/AdStickyAnchor.tsx`
- [ ] `src/components/ads/CalculatorAdLayout.tsx`
### Analytics And Consent

- [ ] `src/components/analytics/AnalyticsProvider.jsx`
- [ ] `src/components/consent/ConsentBanner.jsx`

### Blog Components

- [ ] `src/components/blog/BlogHubPage.jsx`
- [ ] `src/components/blog/BlogHubClient.jsx`
- [ ] `src/components/blog/BlogHubClient.module.css`
- [ ] `src/components/blog/BlogArticlePage.jsx`
- [ ] `src/components/blog/BlogArticleView.jsx`
- [ ] `src/components/blog/BlogArticleView.module.css`
- [ ] `src/components/blog/BlogArticleLoading.jsx`

### Calculator Components

- [ ] `src/components/calculators/CalculatorRouteLoading.jsx`
- [ ] `src/components/calculators/common.jsx`
- [ ] `src/components/calculators/controls.client.jsx`
- [ ] `src/components/calculators/CurrencyField.client.jsx`
- [ ] `src/components/calculators/ResultActions.client.jsx`
- [ ] `src/components/calculators/MonthlyInstallmentCalculator.client.jsx`
- [ ] `src/components/calculators/PercentageCalculator.client.jsx`
- [ ] `src/components/calculators/VatCalculator.client.jsx`
- [ ] `src/components/calculators/VatRatesTable.client.jsx`
- [ ] `src/components/calculators/EndOfServiceCalculator.client.jsx`
- [ ] `src/components/calculators/age/shared.client.jsx`
- [ ] `src/components/calculators/age/AgeCalculator.client.jsx`
- [ ] `src/components/calculators/age/AgeCountdownCalculator.client.jsx`
- [ ] `src/components/calculators/age/AgeDifferenceCalculator.client.jsx`
- [ ] `src/components/calculators/age/AgeHijriCalculator.client.jsx`
- [ ] `src/components/calculators/age/AgeMilestonesCalculator.client.jsx`
- [ ] `src/components/calculators/age/AgePlanetsCalculator.client.jsx`
- [ ] `src/components/calculators/age/BirthdayDetailsCalculator.client.jsx`
- [ ] `src/components/calculators/age/RetirementAgeCalculator.client.jsx`
- [ ] `src/components/calculators/building/BuildingCostCalculator.client.jsx`
- [ ] `src/components/calculators/building/CementCalculator.client.jsx`
- [ ] `src/components/calculators/building/RebarCalculator.client.jsx`
- [ ] `src/components/calculators/building/TilesCalculator.client.jsx`
- [ ] `src/components/calculators/personal-finance/DebtPayoffCalculator.client.jsx`
- [ ] `src/components/calculators/personal-finance/EmergencyFundCalculator.client.jsx`
- [ ] `src/components/calculators/personal-finance/NetWorthCalculator.client.jsx`
- [ ] `src/components/calculators/personal-finance/SavingsGoalCalculator.client.jsx`
- [ ] `src/components/calculators/sleep/BedtimeCalculator.client.jsx`
- [ ] `src/components/calculators/sleep/NapCalculator.client.jsx`
- [ ] `src/components/calculators/sleep/SleepDebtCalculator.client.jsx`
- [ ] `src/components/calculators/sleep/SleepDurationCalculator.client.jsx`
- [ ] `src/components/calculators/sleep/SleepNeedsByAgeCalculator.client.jsx`
- [ ] `src/components/calculators/sleep/WakeTimeCalculator.client.jsx`

### Clock, Hero, And Helper Components

- [ ] `src/components/clocks/CountdownTicker.jsx`
- [ ] `src/components/clocks/DatePill.jsx`
- [ ] `src/components/clocks/DatePill.module.css`
- [ ] `src/components/clocks/LiveClock.jsx`
- [ ] `src/components/clocks/fullscreen-clock.jsx`
- [ ] `src/components/clocks/fullscreenShared.js`
- [ ] `src/components/helpers/CurrentTime.jsx`
- [ ] `src/components/hero/CopyBlock.jsx`
- [ ] `src/components/hero/HeroClockClient.jsx`
- [ ] `src/components/hero/HeroEmbeddedClock.jsx`
- [ ] `src/components/hero/HeroEmbeddedClock.module.css`
- [ ] `src/components/hero/TimeCinematicHero.jsx`
- [ ] `src/components/hero/TimeCinematicHero.module.css`
- [ ] `src/components/HulyButton/HulyButton.tsx`
- [ ] `src/components/HulyButton/HulyButton.module.css`

### Date Components

- [ ] `src/components/date/DateBreadcrumb.tsx`
- [ ] `src/components/date/DateEditorialSections.tsx`
- [ ] `src/components/date/DateNavigation.tsx`
- [ ] `src/components/date/DateRouteLoading.tsx`
- [ ] `src/components/date/DateShareActions.tsx`
- [ ] `src/components/date/DateStatCard.tsx`
- [ ] `src/components/date/EventDayLink.tsx`
- [ ] `src/components/date/HijriYearlyCalendar.tsx`
- [ ] `src/components/date/MethodComparisonTable.tsx`
- [ ] `src/components/date/YearlyCalendar.tsx`

### Events And Holidays Components

- [ ] `src/components/events/EventCard.jsx`
- [ ] `src/components/holidays/index.jsx`
- [ ] `src/components/holidays/EventVibeCard.jsx`
- [ ] `src/components/holidays/event-vibe-card.css`
- [ ] `src/components/holidays/GlobalSchemas.jsx`
- [ ] `src/components/holidays/HolidayPageLoading.jsx`
- [ ] `src/components/holidays/SectionCountryDates.jsx`
- [ ] `src/components/holidays/SectionFAQ.jsx`
- [ ] `src/components/holidays/SectionHijriCalendar.jsx`
- [ ] `src/components/holidays/SectionHijriMonths.jsx`
- [ ] `src/components/holidays/SectionIslamicOccasions.jsx`
- [ ] `src/components/holidays/SectionOccasionTypes.jsx`
- [ ] `src/components/holidays/SectionQuickFacts.jsx`
- [ ] `src/components/holidays/SectionSEOArticle.jsx`
- [ ] `src/components/holidays/useEventVibe.js`
- [ ] `src/components/holidays/data/faqItems.js`
- [ ] `src/components/holidays/data/hijriMonths.js`
- [ ] `src/components/holidays/data/islamicOccasions.js`
- [ ] `src/components/holidays/mockups/HijriCalendarMockup.jsx`
- [ ] `src/components/holidays/mockups/OccasionTypesMockup.jsx`

### Home Components

- [ ] `src/components/home/index.jsx`
- [ ] `src/components/home/SectionStartHere.jsx`
- [ ] `src/components/home/SectionStats.jsx`
- [ ] `src/components/home/SectionPrayerTimes.jsx`
- [ ] `src/components/home/SectionTimeDifference.jsx`
- [ ] `src/components/home/SectionCalculators.jsx`
- [ ] `src/components/home/SectionHolidays.jsx`
- [ ] `src/components/home/SectionFAQ.jsx`
- [ ] `src/components/home/SectionSEOArticle.jsx`
- [ ] `src/components/home/SectionCitiesGrid.jsx`
- [ ] `src/components/home/data/cities.js`
- [ ] `src/components/home/data/faqItems.js`
- [ ] `src/components/home/data/stats.js`
- [ ] `src/components/home/data/whyFeatures.js`
- [ ] `src/components/home/mockups/HolidaysLiveCard.client.jsx`
- [ ] `src/components/home/mockups/PrayerTimesLiveCard.client.jsx`
- [ ] `src/components/home/mockups/TimeDifferenceLiveCard.client.jsx`

### Layout Components

- [ ] `src/components/layout/header.jsx`
- [ ] `src/components/layout/header.css`
- [ ] `src/components/layout/footer.css`
- [ ] `src/components/layout/Footer.jsx`
- [ ] `src/components/layout/FooterGlobe.client.tsx`
- [ ] `src/components/layout/HeaderRouteWarmup.jsx`
- [ ] `src/components/layout/HeaderScrollEffect.tsx`
- [ ] `src/components/layout/MobileMenu.tsx`
- [ ] `src/components/layout/NavLinks.tsx`
- [ ] `src/components/layout/ThemeToggle.tsx`
- [ ] `src/components/layout/useIntentPrefetch.js`

### Prayer Components

- [ ] `src/components/mwaqit/PrayerRouteLoading.jsx`
- [ ] `src/components/mwaqit/CalendarSeoBlock.jsx`
- [ ] `src/components/mwaqit/CityPrayerCardsGrid.client.jsx`
- [ ] `src/components/mwaqit/FAQAccordions.client.jsx`
- [ ] `src/components/mwaqit/MadhabSelector.client.jsx`
- [ ] `src/components/mwaqit/MonthlyPrayerCalendar.client.jsx`
- [ ] `src/components/mwaqit/PrintThemeChooserModal.jsx`
- [ ] `src/components/mwaqit/PrintThemeChooserModal.data.jsx`
- [ ] `src/components/mwaqit/PrintThemeChooserModal.module.css`

### SEO, Shared, And Site Components

- [ ] `src/components/seo/GeoInternalLinks.jsx`
- [ ] `src/components/seo/JsonLd.tsx`
- [ ] `src/components/seo/SiteWideSchemas.jsx`
- [ ] `src/components/shared/CtaLink.jsx`
- [ ] `src/components/shared/DeferredSectionNotice.jsx`
- [ ] `src/components/shared/PageStatusState.jsx`
- [ ] `src/components/shared/RouteLoading.module.css`
- [ ] `src/components/shared/RouteSegmentError.jsx`
- [ ] `src/components/shared/RouteUnavailableState.jsx`
- [ ] `src/components/shared/SectionSkeleton.jsx`
- [ ] `src/components/shared/primitives.jsx`
- [ ] `src/components/site/DiscoveryWorkspace.jsx`
- [ ] `src/components/site/DiscoveryWorkspaceClient.jsx`
- [ ] `src/components/site/DiscoveryWorkspace.module.css`
- [ ] `src/components/site/GlobalDiscoverySearch.client.jsx`
- [ ] `src/components/site/IntentPathways.tsx`
- [ ] `src/components/site/IntentPathways.module.css`
- [ ] `src/components/site/SiteInfoPage.tsx`
- [ ] `src/components/site/SiteInfoPage.module.css`
- [ ] `src/components/site/SiteTrustPanel.tsx`
- [ ] `src/components/site/SiteTrustPanel.module.css`
- [ ] `src/components/site/SiteVisitTracker.client.jsx`

### Time Difference Components

- [ ] `src/components/TimeDifference/ContextSummary.client.jsx`
- [ ] `src/components/TimeDifference/ContextSummaryView.jsx`
- [ ] `src/components/TimeDifference/LiveClock.client.jsx`
- [ ] `src/components/TimeDifference/SmartBadge.jsx`
- [ ] `src/components/TimeDifference/TimeConverter.client.jsx`
- [ ] `src/components/TimeDifference/TimeDiffCalculatorV2.client.jsx`
- [ ] `src/components/TimeDifference/Timeline24h.client.jsx`
- [ ] `src/components/TimeDifference/contextSummary.js`
- [ ] `src/components/time-diff/index.jsx`
- [ ] `src/components/time-diff/GlobalSchemas.jsx`
- [ ] `src/components/time-diff/TimeDifferenceRouteLoading.jsx`
- [ ] `src/components/time-diff/ArabTimezonesLiveClient.jsx`
- [ ] `src/components/time-diff/SectionArabTimezones.jsx`
- [ ] `src/components/time-diff/SectionDST.jsx`
- [ ] `src/components/time-diff/SectionFAQ.jsx`
- [ ] `src/components/time-diff/SectionHowItWorks.jsx`
- [ ] `src/components/time-diff/SectionPopularPairs.jsx`
- [ ] `src/components/time-diff/SectionSEOArticle.jsx`
- [ ] `src/components/time-diff/SectionTimezoneSpectrum.jsx`
- [ ] `src/components/time-diff/SectionUseCases.jsx`
- [ ] `src/components/time-diff/data/arabTimezones.js`
- [ ] `src/components/time-diff/data/faqItems.js`
- [ ] `src/components/time-diff/data/popularPairs.js`
- [ ] `src/components/time-diff/data/spectrumCities.js`
- [ ] `src/components/time-diff/data/useCases.js`
- [ ] `src/components/time-diff/mockups/ArabTimezonesLiveClient.jsx`
- [ ] `src/components/time-diff/mockups/DSTMockup.jsx`
- [ ] `src/components/time-diff/mockups/HowItWorksMockup.jsx`
- [ ] `src/components/time-diff/mockups/PopularPairsLiveClient.jsx`

### Time Now Components

- [ ] `src/components/time-now/CountryCitiesGrid.jsx`
- [ ] `src/components/time-now/GeoRedirect.client.jsx`
- [ ] `src/components/time-now/RelatedSearches.jsx`
- [ ] `src/components/time-now/SameTimezoneCountries.jsx`
- [ ] `src/components/time-now/TimeNowFAQ.jsx`
- [ ] `src/components/time-now/TimeNowHero.jsx`
- [ ] `src/components/time-now/TimeNowRouteLoading.jsx`
- [ ] `src/components/time-now/TimezoneInfoCard.jsx`

### UI Primitives

- [ ] `src/components/ui/accordion.tsx`
- [ ] `src/components/ui/alert-dialog.tsx`
- [ ] `src/components/ui/alert.tsx`
- [ ] `src/components/ui/animated-theme-toggler.tsx`
- [ ] `src/components/ui/aspect-ratio.tsx`
- [ ] `src/components/ui/aurora-text.tsx`
- [ ] `src/components/ui/avatar.tsx`
- [ ] `src/components/ui/badge.tsx`
- [ ] `src/components/ui/button.tsx`
- [ ] `src/components/ui/card.tsx`
- [ ] `src/components/ui/checkbox.tsx`
- [ ] `src/components/ui/command.tsx`
- [ ] `src/components/ui/context-menu.tsx`
- [ ] `src/components/ui/dialog.tsx`
- [ ] `src/components/ui/dotted-map.tsx`
- [ ] `src/components/ui/dropdown-menu.tsx`
- [ ] `src/components/ui/globe.tsx`
- [ ] `src/components/ui/hover-card.tsx`
- [ ] `src/components/ui/input.tsx`
- [ ] `src/components/ui/label.tsx`
- [ ] `src/components/ui/menubar.tsx`
- [ ] `src/components/ui/navigation-menu.tsx`
- [ ] `src/components/ui/popover.tsx`
- [ ] `src/components/ui/progress.tsx`
- [ ] `src/components/ui/radio-group.tsx`
- [ ] `src/components/ui/scroll-area.tsx`
- [ ] `src/components/ui/select.tsx`
- [ ] `src/components/ui/separator.tsx`
- [ ] `src/components/ui/share-button.jsx`
- [ ] `src/components/ui/sheet.tsx`
- [ ] `src/components/ui/shimmer-button.tsx`
- [ ] `src/components/ui/shine-border.tsx`
- [ ] `src/components/ui/skeleton.tsx`
- [ ] `src/components/ui/slider.tsx`
- [ ] `src/components/ui/switch.tsx`
- [ ] `src/components/ui/table.tsx`
- [ ] `src/components/ui/tabs.tsx`
- [ ] `src/components/ui/toggle-group.tsx`
- [ ] `src/components/ui/toggle.tsx`
- [ ] `src/components/ui/tooltip.tsx`

## `src/lib`, Assets, And Generated Code Checklist

### Ads, API, Runtime, And Site Utilities

- [ ] `src/lib/ads/manual-config.js`
- [ ] `src/lib/ads/route-policy.js`
- [ ] `src/lib/api/route-utils.js`
- [ ] `src/lib/audience-copy.js`
- [ ] `src/lib/calendar-config.js`
- [ ] `src/lib/client/marketing.js`
- [ ] `src/lib/client/public-runtime.js`
- [ ] `src/lib/constants.js`
- [ ] `src/lib/country-utils.js`
- [ ] `src/lib/env.server.js`
- [ ] `src/lib/feature-flags.js`
- [ ] `src/lib/logger.js`
- [ ] `src/lib/observability.js`
- [ ] `src/lib/runtime-config.js`
- [ ] `src/lib/server/fallback-cache.js`
- [ ] `src/lib/share.client.js`
- [ ] `src/lib/site-config.js`
- [ ] `src/lib/site/discovery.js`
- [ ] `src/lib/site/discovery-events.js`
- [ ] `src/lib/site/discovery-history.js`
- [ ] `src/lib/site/discovery-navigation.js`
- [ ] `src/lib/site/intent-pathways.ts`
- [ ] `src/lib/storage.js`
- [ ] `src/lib/template-resolver.js`
- [ ] `src/lib/user-location.client.js`
- [ ] `src/lib/utils.ts`

### Blog, Guides, And Editorial Models

- [ ] `src/lib/blog/observability.js`
- [ ] `src/lib/blog/read-time.js`
- [ ] `src/lib/blog/sitemap.js`
- [ ] `src/lib/guides/data.js`
- [ ] `src/lib/guides/page-model.js`

### Calculators And Sleep

- [ ] `src/lib/calculators/data.js`
- [ ] `src/lib/calculators/engine.js`
- [ ] `src/lib/calculators/currency-options.js`
- [ ] `src/lib/calculators/finance-page-content.js`
- [ ] `src/lib/calculators/finance-search-coverage.js`
- [ ] `src/lib/calculators/personal-finance-data.js`
- [ ] `src/lib/calculators/age.js`
- [ ] `src/lib/calculators/age-data.js`
- [ ] `src/lib/calculators/building/constants.js`
- [ ] `src/lib/calculators/building/country-data.js`
- [ ] `src/lib/calculators/building/seo-keywords.js`
- [ ] `src/lib/sleep/calculator.js`
- [ ] `src/lib/sleep/constants.js`
- [ ] `src/lib/sleep/content.js`

### Date, Hijri, Prayer, Time, And Geo

- [ ] `src/lib/date-adapter.ts`
- [ ] `src/lib/date-utils.ts`
- [ ] `src/lib/hijri-resolver.js`
- [ ] `src/lib/hijri-utils.js`
- [ ] `src/lib/islamic-holidays.ts`
- [ ] `src/lib/islamic-year-format.js`
- [ ] `src/lib/ip-lookup.js`
- [ ] `src/lib/location-picker.client.js`
- [ ] `src/lib/locationService.js`
- [ ] `src/lib/og-fonts.js`
- [ ] `src/lib/prayer-methods.js`
- [ ] `src/lib/prayerEngine.js`
- [ ] `src/lib/route-param-validation.ts`
- [ ] `src/lib/time-diff.js`
- [ ] `src/lib/time-difference-links.js`
- [ ] `src/lib/time-difference-route.js`
- [ ] `src/lib/time-difference-slugs.js`
- [ ] `src/lib/time-engine.js`
- [ ] `src/lib/time-now-content.js`
- [ ] `src/lib/geo-og-labels.js`

### Holidays And Events

- [ ] `src/lib/event-cache.js`
- [ ] `src/lib/event-utils.js`
- [ ] `src/lib/events/README.md`
- [ ] `src/lib/events/alias-rules.js`
- [ ] `src/lib/events/country-dictionary.js`
- [ ] `src/lib/events/generated-aliases.js`
- [ ] `src/lib/events/index.js`
- [ ] `src/lib/events/package-schema.js`
- [ ] `src/lib/event-content/README.md`
- [ ] `src/lib/event-content/index.js`
- [ ] `src/lib/event-content/schema.js`
- [ ] `src/lib/holidays-engine.js`
- [ ] `src/lib/holidays/country-dates.js`
- [ ] `src/lib/holidays/display.js`
- [ ] `src/lib/holidays/distribution.js`
- [ ] `src/lib/holidays/faq-normalizer.js`
- [ ] `src/lib/holidays/metadata.js`
- [ ] `src/lib/holidays/observability.js`
- [ ] `src/lib/holidays/og-data.js`
- [ ] `src/lib/holidays/page-data.js`
- [ ] `src/lib/holidays/page-model.js`
- [ ] `src/lib/holidays/repository.js`
- [ ] `src/lib/holidays/runtime-data.js`
- [ ] `src/lib/holidays/schema-validator.js`
- [ ] `src/lib/holidays/search-intent.js`
- [ ] `src/lib/holidays/taxonomy.js`
- [ ] `src/lib/holidays/types.ts`

### SEO And Sitemaps

- [ ] `src/lib/sitemap.js`
- [ ] `src/lib/seo/calculator-route-manifest.js`
- [ ] `src/lib/seo/country-indexing.ts`
- [ ] `src/lib/seo/date-indexing.ts`
- [ ] `src/lib/seo/discovery-links.js`
- [ ] `src/lib/seo/metadata.js`
- [ ] `src/lib/seo/page-search-coverage.js`
- [ ] `src/lib/seo/popular-links.js`
- [ ] `src/lib/seo/section-search-intent.js`
- [ ] `src/lib/seo/site-architecture.js`
- [ ] `src/lib/seo/time-difference-indexing.js`
- [ ] `src/lib/seo/tool-schema.js`
- [ ] `src/lib/route-health/critical-routes.js`

### Database And Generated Prisma

- [ ] `src/lib/db/constants.ts`
- [ ] `src/lib/db/prisma.ts`
- [ ] `src/lib/db/types.ts`
- [ ] `src/lib/db/live-geo-source.ts`
- [ ] `src/lib/db/queries/cities.ts`
- [ ] `src/lib/db/queries/countries.ts`
- [ ] `src/lib/db/queries/holidays.ts`
- [ ] `src/lib/db/fallback/cities-index.json`
- [ ] `src/lib/db/fallback/countries.json`
- [ ] `src/generated/prisma/browser.ts`
- [ ] `src/generated/prisma/client.ts`
- [ ] `src/generated/prisma/commonInputTypes.ts`
- [ ] `src/generated/prisma/enums.ts`
- [ ] `src/generated/prisma/models.ts`
- [ ] `src/generated/prisma/internal/class.ts`
- [ ] `src/generated/prisma/internal/prismaNamespace.ts`
- [ ] `src/generated/prisma/internal/prismaNamespaceBrowser.ts`
- [ ] `src/generated/prisma/models/City.ts`
- [ ] `src/generated/prisma/models/Country.ts`

### Assets And Empty Folders

- [ ] `src/assets/fonts/NotoSans-Regular.ttf`
- [ ] `src/assets/fonts/NotoSans-Bold.ttf`
- [ ] `src/assets/fonts/NotoSansArabic-Regular.ttf`
- [ ] `src/assets/fonts/NotoSansArabic-Bold.ttf`
- [ ] `src/hooks`: confirm whether empty folder is intentional or remove it.
- [ ] `src/components/guides`: confirm whether empty folder is intentional or remove it.

## `src/data` Checklist

- [ ] `src/data/site/info-pages.jsx`
- [ ] `src/data/holidays/README.md`
- [ ] `src/data/holidays/events/README.md`
- [ ] `src/data/holidays/taxonomy/categories.json`
- [ ] `src/data/holidays/taxonomy/countries.json`
- [ ] `src/data/holidays/generated/alias-meta.json`
- [ ] `src/data/holidays/generated/aliases.json`
- [ ] `src/data/holidays/generated/all-events-list.json`
- [ ] `src/data/holidays/generated/canonical-to-aliases.json`
- [ ] `src/data/holidays/generated/content-by-slug.json`
- [ ] `src/data/holidays/generated/event-meta-by-slug.json`
- [ ] `src/data/holidays/generated/events-by-slug.json`
- [ ] `src/data/holidays/generated/manifest.json`
- [ ] `src/data/holidays/generated/published-events-by-slug.json`
- [ ] `src/data/holidays/generated/published-events-list.json`
- [ ] `src/data/holidays/generated/runtime-records-by-slug.json`

### Holiday Event Packages

For every event package below, verify `package.json`, `research.json`, and `qa.json`: unique Arabic title and metadata, current dates, country/calendar context, sources, QA status, no copied generic text, useful FAQ, internal links, and AdSense-safe publisher value.

- [ ] `src/data/holidays/events/arabic-language-day/package.json`, `src/data/holidays/events/arabic-language-day/research.json`, `src/data/holidays/events/arabic-language-day/qa.json`
- [ ] `src/data/holidays/events/armed-forces-day-egypt/package.json`, `src/data/holidays/events/armed-forces-day-egypt/research.json`, `src/data/holidays/events/armed-forces-day-egypt/qa.json`
- [ ] `src/data/holidays/events/ashura/package.json`, `src/data/holidays/events/ashura/research.json`, `src/data/holidays/events/ashura/qa.json`
- [ ] `src/data/holidays/events/autumn-season/package.json`, `src/data/holidays/events/autumn-season/research.json`, `src/data/holidays/events/autumn-season/qa.json`
- [ ] `src/data/holidays/events/bac-exams-algeria/package.json`, `src/data/holidays/events/bac-exams-algeria/research.json`, `src/data/holidays/events/bac-exams-algeria/qa.json`
- [ ] `src/data/holidays/events/bac-results-algeria/package.json`, `src/data/holidays/events/bac-results-algeria/research.json`, `src/data/holidays/events/bac-results-algeria/qa.json`
- [ ] `src/data/holidays/events/bac-results-morocco/package.json`, `src/data/holidays/events/bac-results-morocco/research.json`, `src/data/holidays/events/bac-results-morocco/qa.json`
- [ ] `src/data/holidays/events/bac-results-tunisia/package.json`, `src/data/holidays/events/bac-results-tunisia/research.json`, `src/data/holidays/events/bac-results-tunisia/qa.json`
- [ ] `src/data/holidays/events/back-to-school/package.json`, `src/data/holidays/events/back-to-school/research.json`, `src/data/holidays/events/back-to-school/qa.json`
- [ ] `src/data/holidays/events/bahrain-national-day/package.json`, `src/data/holidays/events/bahrain-national-day/research.json`, `src/data/holidays/events/bahrain-national-day/qa.json`
- [ ] `src/data/holidays/events/black-friday-usa/package.json`, `src/data/holidays/events/black-friday-usa/research.json`, `src/data/holidays/events/black-friday-usa/qa.json`
- [ ] `src/data/holidays/events/christmas-usa/package.json`, `src/data/holidays/events/christmas-usa/research.json`, `src/data/holidays/events/christmas-usa/qa.json`
- [ ] `src/data/holidays/events/citizen-account-saudi/package.json`, `src/data/holidays/events/citizen-account-saudi/research.json`, `src/data/holidays/events/citizen-account-saudi/qa.json`
- [ ] `src/data/holidays/events/cyber-monday-usa/package.json`, `src/data/holidays/events/cyber-monday-usa/research.json`, `src/data/holidays/events/cyber-monday-usa/qa.json`
- [ ] `src/data/holidays/events/day-of-arafa/package.json`, `src/data/holidays/events/day-of-arafa/research.json`, `src/data/holidays/events/day-of-arafa/qa.json`
- [ ] `src/data/holidays/events/earth-day/package.json`, `src/data/holidays/events/earth-day/research.json`, `src/data/holidays/events/earth-day/qa.json`
- [ ] `src/data/holidays/events/eid-al-adha/package.json`, `src/data/holidays/events/eid-al-adha/research.json`, `src/data/holidays/events/eid-al-adha/qa.json`
- [ ] `src/data/holidays/events/eid-al-fitr/package.json`, `src/data/holidays/events/eid-al-fitr/research.json`, `src/data/holidays/events/eid-al-fitr/qa.json`
- [ ] `src/data/holidays/events/first-dhul-hijjah/package.json`, `src/data/holidays/events/first-dhul-hijjah/research.json`, `src/data/holidays/events/first-dhul-hijjah/qa.json`
- [ ] `src/data/holidays/events/green-march-morocco/package.json`, `src/data/holidays/events/green-march-morocco/research.json`, `src/data/holidays/events/green-march-morocco/qa.json`
- [ ] `src/data/holidays/events/hafez-saudi/package.json`, `src/data/holidays/events/hafez-saudi/research.json`, `src/data/holidays/events/hafez-saudi/qa.json`
- [ ] `src/data/holidays/events/hajj-season/package.json`, `src/data/holidays/events/hajj-season/research.json`, `src/data/holidays/events/hajj-season/qa.json`
- [ ] `src/data/holidays/events/halloween-usa/package.json`, `src/data/holidays/events/halloween-usa/research.json`, `src/data/holidays/events/halloween-usa/qa.json`
- [ ] `src/data/holidays/events/housing-support-saudi/package.json`, `src/data/holidays/events/housing-support-saudi/research.json`, `src/data/holidays/events/housing-support-saudi/qa.json`
- [ ] `src/data/holidays/events/independence-day-algeria/package.json`, `src/data/holidays/events/independence-day-algeria/research.json`, `src/data/holidays/events/independence-day-algeria/qa.json`
- [ ] `src/data/holidays/events/independence-day-morocco/package.json`, `src/data/holidays/events/independence-day-morocco/research.json`, `src/data/holidays/events/independence-day-morocco/qa.json`
- [ ] `src/data/holidays/events/independence-day-tunisia/package.json`, `src/data/holidays/events/independence-day-tunisia/research.json`, `src/data/holidays/events/independence-day-tunisia/qa.json`
- [ ] `src/data/holidays/events/international-womens-day/package.json`, `src/data/holidays/events/international-womens-day/research.json`, `src/data/holidays/events/international-womens-day/qa.json`
- [ ] `src/data/holidays/events/islamic-new-year/package.json`, `src/data/holidays/events/islamic-new-year/research.json`, `src/data/holidays/events/islamic-new-year/qa.json`
- [ ] `src/data/holidays/events/isra-miraj/package.json`, `src/data/holidays/events/isra-miraj/research.json`, `src/data/holidays/events/isra-miraj/qa.json`
- [ ] `src/data/holidays/events/jordan-independence-day/package.json`, `src/data/holidays/events/jordan-independence-day/research.json`, `src/data/holidays/events/jordan-independence-day/qa.json`
- [ ] `src/data/holidays/events/kuwait-national-day/package.json`, `src/data/holidays/events/kuwait-national-day/research.json`, `src/data/holidays/events/kuwait-national-day/qa.json`
- [ ] `src/data/holidays/events/labor-day/package.json`, `src/data/holidays/events/labor-day/research.json`, `src/data/holidays/events/labor-day/qa.json`
- [ ] `src/data/holidays/events/laylat-al-qadr/package.json`, `src/data/holidays/events/laylat-al-qadr/research.json`, `src/data/holidays/events/laylat-al-qadr/qa.json`
- [ ] `src/data/holidays/events/liberation-day-kuwait/package.json`, `src/data/holidays/events/liberation-day-kuwait/research.json`, `src/data/holidays/events/liberation-day-kuwait/qa.json`
- [ ] `src/data/holidays/events/martyrs-day-uae/package.json`, `src/data/holidays/events/martyrs-day-uae/research.json`, `src/data/holidays/events/martyrs-day-uae/qa.json`
- [ ] `src/data/holidays/events/mawlid/package.json`, `src/data/holidays/events/mawlid/research.json`, `src/data/holidays/events/mawlid/qa.json`
- [ ] `src/data/holidays/events/mothers-day/package.json`, `src/data/holidays/events/mothers-day/research.json`, `src/data/holidays/events/mothers-day/qa.json`
- [ ] `src/data/holidays/events/national-exams-morocco/package.json`, `src/data/holidays/events/national-exams-morocco/research.json`, `src/data/holidays/events/national-exams-morocco/qa.json`
- [ ] `src/data/holidays/events/new-year/package.json`, `src/data/holidays/events/new-year/research.json`, `src/data/holidays/events/new-year/qa.json`
- [ ] `src/data/holidays/events/new-years-eve-new-york/package.json`, `src/data/holidays/events/new-years-eve-new-york/research.json`, `src/data/holidays/events/new-years-eve-new-york/qa.json`
- [ ] `src/data/holidays/events/nisf-shaban/package.json`, `src/data/holidays/events/nisf-shaban/research.json`, `src/data/holidays/events/nisf-shaban/qa.json`
- [ ] `src/data/holidays/events/pension-day-egypt/package.json`, `src/data/holidays/events/pension-day-egypt/research.json`, `src/data/holidays/events/pension-day-egypt/qa.json`
- [ ] `src/data/holidays/events/pension-day-saudi/package.json`, `src/data/holidays/events/pension-day-saudi/research.json`, `src/data/holidays/events/pension-day-saudi/qa.json`
- [ ] `src/data/holidays/events/qatar-national-day/package.json`, `src/data/holidays/events/qatar-national-day/research.json`, `src/data/holidays/events/qatar-national-day/qa.json`
- [ ] `src/data/holidays/events/ramadan/package.json`, `src/data/holidays/events/ramadan/research.json`, `src/data/holidays/events/ramadan/qa.json`
- [ ] `src/data/holidays/events/revolution-day-algeria/package.json`, `src/data/holidays/events/revolution-day-algeria/research.json`, `src/data/holidays/events/revolution-day-algeria/qa.json`
- [ ] `src/data/holidays/events/revolution-day-egypt/package.json`, `src/data/holidays/events/revolution-day-egypt/research.json`, `src/data/holidays/events/revolution-day-egypt/qa.json`
- [ ] `src/data/holidays/events/salary-day-egypt/package.json`, `src/data/holidays/events/salary-day-egypt/research.json`, `src/data/holidays/events/salary-day-egypt/qa.json`
- [ ] `src/data/holidays/events/salary-day-saudi/package.json`, `src/data/holidays/events/salary-day-saudi/research.json`, `src/data/holidays/events/salary-day-saudi/qa.json`
- [ ] `src/data/holidays/events/sand-payment-saudi/package.json`, `src/data/holidays/events/sand-payment-saudi/research.json`, `src/data/holidays/events/sand-payment-saudi/qa.json`
- [ ] `src/data/holidays/events/saudi-flag-day/package.json`, `src/data/holidays/events/saudi-flag-day/research.json`, `src/data/holidays/events/saudi-flag-day/qa.json`
- [ ] `src/data/holidays/events/saudi-founding-day/package.json`, `src/data/holidays/events/saudi-founding-day/research.json`, `src/data/holidays/events/saudi-founding-day/qa.json`
- [ ] `src/data/holidays/events/saudi-national-day/package.json`, `src/data/holidays/events/saudi-national-day/research.json`, `src/data/holidays/events/saudi-national-day/qa.json`
- [ ] `src/data/holidays/events/school-start-algeria/package.json`, `src/data/holidays/events/school-start-algeria/research.json`, `src/data/holidays/events/school-start-algeria/qa.json`
- [ ] `src/data/holidays/events/school-start-egypt/package.json`, `src/data/holidays/events/school-start-egypt/research.json`, `src/data/holidays/events/school-start-egypt/qa.json`
- [ ] `src/data/holidays/events/school-start-kuwait/package.json`, `src/data/holidays/events/school-start-kuwait/research.json`, `src/data/holidays/events/school-start-kuwait/qa.json`
- [ ] `src/data/holidays/events/school-start-morocco/package.json`, `src/data/holidays/events/school-start-morocco/research.json`, `src/data/holidays/events/school-start-morocco/qa.json`
- [ ] `src/data/holidays/events/school-start-qatar/package.json`, `src/data/holidays/events/school-start-qatar/research.json`, `src/data/holidays/events/school-start-qatar/qa.json`
- [ ] `src/data/holidays/events/school-start-saudi/package.json`, `src/data/holidays/events/school-start-saudi/research.json`, `src/data/holidays/events/school-start-saudi/qa.json`
- [ ] `src/data/holidays/events/school-start-tunisia/package.json`, `src/data/holidays/events/school-start-tunisia/research.json`, `src/data/holidays/events/school-start-tunisia/qa.json`
- [ ] `src/data/holidays/events/school-start-uae/package.json`, `src/data/holidays/events/school-start-uae/research.json`, `src/data/holidays/events/school-start-uae/qa.json`
- [ ] `src/data/holidays/events/sham-nessim/package.json`, `src/data/holidays/events/sham-nessim/research.json`, `src/data/holidays/events/sham-nessim/qa.json`
- [ ] `src/data/holidays/events/social-security-saudi/package.json`, `src/data/holidays/events/social-security-saudi/research.json`, `src/data/holidays/events/social-security-saudi/qa.json`
- [ ] `src/data/holidays/events/spring-season/package.json`, `src/data/holidays/events/spring-season/research.json`, `src/data/holidays/events/spring-season/qa.json`
- [ ] `src/data/holidays/events/spring-vacation/package.json`, `src/data/holidays/events/spring-vacation/research.json`, `src/data/holidays/events/spring-vacation/qa.json`
- [ ] `src/data/holidays/events/summer-season/package.json`, `src/data/holidays/events/summer-season/research.json`, `src/data/holidays/events/summer-season/qa.json`
- [ ] `src/data/holidays/events/summer-vacation/package.json`, `src/data/holidays/events/summer-vacation/research.json`, `src/data/holidays/events/summer-vacation/qa.json`
- [ ] `src/data/holidays/events/takaful-karama-egypt/package.json`, `src/data/holidays/events/takaful-karama-egypt/research.json`, `src/data/holidays/events/takaful-karama-egypt/qa.json`
- [ ] `src/data/holidays/events/thanaweya-exams/package.json`, `src/data/holidays/events/thanaweya-exams/research.json`, `src/data/holidays/events/thanaweya-exams/qa.json`
- [ ] `src/data/holidays/events/thanaweya-results/package.json`, `src/data/holidays/events/thanaweya-results/research.json`, `src/data/holidays/events/thanaweya-results/qa.json`
- [ ] `src/data/holidays/events/thanksgiving-usa/package.json`, `src/data/holidays/events/thanksgiving-usa/research.json`, `src/data/holidays/events/thanksgiving-usa/qa.json`
- [ ] `src/data/holidays/events/throne-day-morocco/package.json`, `src/data/holidays/events/throne-day-morocco/research.json`, `src/data/holidays/events/throne-day-morocco/qa.json`
- [ ] `src/data/holidays/events/uae-national-day/package.json`, `src/data/holidays/events/uae-national-day/research.json`, `src/data/holidays/events/uae-national-day/qa.json`
- [ ] `src/data/holidays/events/valentines-day/package.json`, `src/data/holidays/events/valentines-day/research.json`, `src/data/holidays/events/valentines-day/qa.json`
- [ ] `src/data/holidays/events/winter-season/package.json`, `src/data/holidays/events/winter-season/research.json`, `src/data/holidays/events/winter-season/qa.json`
- [ ] `src/data/holidays/events/world-fathers-day/package.json`, `src/data/holidays/events/world-fathers-day/research.json`, `src/data/holidays/events/world-fathers-day/qa.json`
- [ ] `src/data/holidays/events/world-health-day/package.json`, `src/data/holidays/events/world-health-day/research.json`, `src/data/holidays/events/world-health-day/qa.json`
- [ ] `src/data/holidays/events/world-teachers-day/package.json`, `src/data/holidays/events/world-teachers-day/research.json`, `src/data/holidays/events/world-teachers-day/qa.json`

## `public` Checklist

- [ ] `public/og-default.png`: matches v4 identity and social preview quality.
- [ ] `public/icons/icon-192.png`
- [ ] `public/icons/icon-192.svg`
- [ ] `public/icons/icon-512.png`
- [ ] `public/icons/icon-512-maskable.png`
- [ ] `public/icons/icon-512.svg`
- [ ] `public/sw.js`: offline behavior does not cache stale SEO pages incorrectly.
- [ ] `public/next.svg` and `public/vercel.svg`: remove if unused in production UI.
- [ ] `public/yandex_6bd870b6a596e908.html`: confirm verification file is still required.
- [ ] `public/geo/countries.json`
- [ ] `public/geo/city-search-index.json`
- [ ] `public/geo/manifest.json`
- [ ] `public/geo/cities/*.json`: validate every country file through the geo generation pipeline, not manual edits. Each file must have stable slugs, Arabic display labels where used, no malformed city rows, and no sitemap generation for invalid city URLs.

### Public Geo City Files

- [ ] `public/geo/cities/afghanistan.json`
- [ ] `public/geo/cities/aland-islands.json`
- [ ] `public/geo/cities/albania.json`
- [ ] `public/geo/cities/algeria.json`
- [ ] `public/geo/cities/american-samoa.json`
- [ ] `public/geo/cities/andorra.json`
- [ ] `public/geo/cities/angola.json`
- [ ] `public/geo/cities/antigua-and-barbuda.json`
- [ ] `public/geo/cities/argentina.json`
- [ ] `public/geo/cities/armenia.json`
- [ ] `public/geo/cities/aruba.json`
- [ ] `public/geo/cities/australia.json`
- [ ] `public/geo/cities/austria.json`
- [ ] `public/geo/cities/azerbaijan.json`
- [ ] `public/geo/cities/bahamas.json`
- [ ] `public/geo/cities/bahrain.json`
- [ ] `public/geo/cities/bangladesh.json`
- [ ] `public/geo/cities/barbados.json`
- [ ] `public/geo/cities/belarus.json`
- [ ] `public/geo/cities/belgium.json`
- [ ] `public/geo/cities/belize.json`
- [ ] `public/geo/cities/benin.json`
- [ ] `public/geo/cities/bhutan.json`
- [ ] `public/geo/cities/bolivia.json`
- [ ] `public/geo/cities/bonaire.json`
- [ ] `public/geo/cities/bosnia-and-herzegovina.json`
- [ ] `public/geo/cities/botswana.json`
- [ ] `public/geo/cities/brazil.json`
- [ ] `public/geo/cities/british-virgin-islands.json`
- [ ] `public/geo/cities/brunei.json`
- [ ] `public/geo/cities/bulgaria.json`
- [ ] `public/geo/cities/burkina-faso.json`
- [ ] `public/geo/cities/burundi.json`
- [ ] `public/geo/cities/cabo-verde.json`
- [ ] `public/geo/cities/cambodia.json`
- [ ] `public/geo/cities/cameroon.json`
- [ ] `public/geo/cities/canada.json`
- [ ] `public/geo/cities/cayman-islands.json`
- [ ] `public/geo/cities/central-african-republic.json`
- [ ] `public/geo/cities/chad.json`
- [ ] `public/geo/cities/chile.json`
- [ ] `public/geo/cities/china.json`
- [ ] `public/geo/cities/colombia.json`
- [ ] `public/geo/cities/comoros.json`
- [ ] `public/geo/cities/cook-islands.json`
- [ ] `public/geo/cities/costa-rica.json`
- [ ] `public/geo/cities/croatia.json`
- [ ] `public/geo/cities/cuba.json`
- [ ] `public/geo/cities/curacao.json`
- [ ] `public/geo/cities/cyprus.json`
- [ ] `public/geo/cities/czechia.json`
- [ ] `public/geo/cities/democratic-republic-of-the-congo.json`
- [ ] `public/geo/cities/denmark.json`
- [ ] `public/geo/cities/djibouti.json`
- [ ] `public/geo/cities/dominica.json`
- [ ] `public/geo/cities/dominican-republic.json`
- [ ] `public/geo/cities/ecuador.json`
- [ ] `public/geo/cities/egypt.json`
- [ ] `public/geo/cities/el-salvador.json`
- [ ] `public/geo/cities/eritrea.json`
- [ ] `public/geo/cities/estonia.json`
- [ ] `public/geo/cities/eswatini.json`
- [ ] `public/geo/cities/ethiopia.json`
- [ ] `public/geo/cities/faroe-islands.json`
- [ ] `public/geo/cities/fiji.json`
- [ ] `public/geo/cities/finland.json`
- [ ] `public/geo/cities/france.json`
- [ ] `public/geo/cities/french-guiana.json`
- [ ] `public/geo/cities/french-polynesia.json`
- [ ] `public/geo/cities/gabon.json`
- [ ] `public/geo/cities/gambia.json`
- [ ] `public/geo/cities/georgia.json`
- [ ] `public/geo/cities/germany.json`
- [ ] `public/geo/cities/ghana.json`
- [ ] `public/geo/cities/gibraltar.json`
- [ ] `public/geo/cities/greece.json`
- [ ] `public/geo/cities/greenland.json`
- [ ] `public/geo/cities/grenada.json`
- [ ] `public/geo/cities/guadeloupe.json`
- [ ] `public/geo/cities/guatemala.json`
- [ ] `public/geo/cities/guernsey.json`
- [ ] `public/geo/cities/guinea-bissau.json`
- [ ] `public/geo/cities/guinea.json`
- [ ] `public/geo/cities/guyana.json`
- [ ] `public/geo/cities/haiti.json`
- [ ] `public/geo/cities/honduras.json`
- [ ] `public/geo/cities/hong-kong.json`
- [ ] `public/geo/cities/hungary.json`
- [ ] `public/geo/cities/iceland.json`
- [ ] `public/geo/cities/india.json`
- [ ] `public/geo/cities/indonesia.json`
- [ ] `public/geo/cities/iran.json`
- [ ] `public/geo/cities/iraq.json`
- [ ] `public/geo/cities/ireland.json`
- [ ] `public/geo/cities/isle-of-man.json`
- [ ] `public/geo/cities/israel.json`
- [ ] `public/geo/cities/italy.json`
- [ ] `public/geo/cities/ivory-coast.json`
- [ ] `public/geo/cities/jamaica.json`
- [ ] `public/geo/cities/japan.json`
- [ ] `public/geo/cities/jersey.json`
- [ ] `public/geo/cities/jordan.json`
- [ ] `public/geo/cities/kazakhstan.json`
- [ ] `public/geo/cities/kenya.json`
- [ ] `public/geo/cities/kiribati.json`
- [ ] `public/geo/cities/kosovo.json`
- [ ] `public/geo/cities/kuwait.json`
- [ ] `public/geo/cities/kyrgyzstan.json`
- [ ] `public/geo/cities/laos.json`
- [ ] `public/geo/cities/latvia.json`
- [ ] `public/geo/cities/lebanon.json`
- [ ] `public/geo/cities/lesotho.json`
- [ ] `public/geo/cities/liberia.json`
- [ ] `public/geo/cities/libya.json`
- [ ] `public/geo/cities/liechtenstein.json`
- [ ] `public/geo/cities/lithuania.json`
- [ ] `public/geo/cities/luxembourg.json`
- [ ] `public/geo/cities/macao.json`
- [ ] `public/geo/cities/madagascar.json`
- [ ] `public/geo/cities/malawi.json`
- [ ] `public/geo/cities/malaysia.json`
- [ ] `public/geo/cities/maldives.json`
- [ ] `public/geo/cities/mali.json`
- [ ] `public/geo/cities/malta.json`
- [ ] `public/geo/cities/marshall-islands.json`
- [ ] `public/geo/cities/martinique.json`
- [ ] `public/geo/cities/mauritania.json`
- [ ] `public/geo/cities/mauritius.json`
- [ ] `public/geo/cities/mayotte.json`
- [ ] `public/geo/cities/mexico.json`
- [ ] `public/geo/cities/micronesia.json`
- [ ] `public/geo/cities/moldova.json`
- [ ] `public/geo/cities/monaco.json`
- [ ] `public/geo/cities/mongolia.json`
- [ ] `public/geo/cities/montenegro.json`
- [ ] `public/geo/cities/morocco.json`
- [ ] `public/geo/cities/mozambique.json`
- [ ] `public/geo/cities/myanmar.json`
- [ ] `public/geo/cities/namibia.json`
- [ ] `public/geo/cities/nepal.json`
- [ ] `public/geo/cities/new-caledonia.json`
- [ ] `public/geo/cities/new-zealand.json`
- [ ] `public/geo/cities/nicaragua.json`
- [ ] `public/geo/cities/niger.json`
- [ ] `public/geo/cities/nigeria.json`
- [ ] `public/geo/cities/north-korea.json`
- [ ] `public/geo/cities/north-macedonia.json`
- [ ] `public/geo/cities/northern-mariana-islands.json`
- [ ] `public/geo/cities/norway.json`
- [ ] `public/geo/cities/oman.json`
- [ ] `public/geo/cities/pakistan.json`
- [ ] `public/geo/cities/palestinian-territory.json`
- [ ] `public/geo/cities/panama.json`
- [ ] `public/geo/cities/papua-new-guinea.json`
- [ ] `public/geo/cities/paraguay.json`
- [ ] `public/geo/cities/peru.json`
- [ ] `public/geo/cities/philippines.json`
- [ ] `public/geo/cities/poland.json`
- [ ] `public/geo/cities/portugal.json`
- [ ] `public/geo/cities/puerto-rico.json`
- [ ] `public/geo/cities/qatar.json`
- [ ] `public/geo/cities/republic-of-the-congo.json`
- [ ] `public/geo/cities/reunion.json`
- [ ] `public/geo/cities/romania.json`
- [ ] `public/geo/cities/russia.json`
- [ ] `public/geo/cities/rwanda.json`
- [ ] `public/geo/cities/saint-barthelemy.json`
- [ ] `public/geo/cities/saint-kitts-and-nevis.json`
- [ ] `public/geo/cities/saint-lucia.json`
- [ ] `public/geo/cities/saint-martin.json`
- [ ] `public/geo/cities/saint-pierre-and-miquelon.json`
- [ ] `public/geo/cities/saint-vincent-and-the-grenadines.json`
- [ ] `public/geo/cities/samoa.json`
- [ ] `public/geo/cities/sao-tome-and-principe.json`
- [ ] `public/geo/cities/saudi-arabia.json`
- [ ] `public/geo/cities/senegal.json`
- [ ] `public/geo/cities/serbia.json`
- [ ] `public/geo/cities/seychelles.json`
- [ ] `public/geo/cities/sierra-leone.json`
- [ ] `public/geo/cities/singapore.json`
- [ ] `public/geo/cities/slovakia.json`
- [ ] `public/geo/cities/slovenia.json`
- [ ] `public/geo/cities/solomon-islands.json`
- [ ] `public/geo/cities/somalia.json`
- [ ] `public/geo/cities/south-africa.json`
- [ ] `public/geo/cities/south-korea.json`
- [ ] `public/geo/cities/south-sudan.json`
- [ ] `public/geo/cities/spain.json`
- [ ] `public/geo/cities/sri-lanka.json`
- [ ] `public/geo/cities/sudan.json`
- [ ] `public/geo/cities/suriname.json`
- [ ] `public/geo/cities/sweden.json`
- [ ] `public/geo/cities/switzerland.json`
- [ ] `public/geo/cities/syria.json`
- [ ] `public/geo/cities/taiwan.json`
- [ ] `public/geo/cities/tajikistan.json`
- [ ] `public/geo/cities/tanzania.json`
- [ ] `public/geo/cities/thailand.json`
- [ ] `public/geo/cities/the-netherlands.json`
- [ ] `public/geo/cities/timor-leste.json`
- [ ] `public/geo/cities/togo.json`
- [ ] `public/geo/cities/tonga.json`
- [ ] `public/geo/cities/trinidad-and-tobago.json`
- [ ] `public/geo/cities/tunisia.json`
- [ ] `public/geo/cities/turkey.json`
- [ ] `public/geo/cities/turkmenistan.json`
- [ ] `public/geo/cities/tuvalu.json`
- [ ] `public/geo/cities/u.s.-virgin-islands.json`
- [ ] `public/geo/cities/uganda.json`
- [ ] `public/geo/cities/ukraine.json`
- [ ] `public/geo/cities/united-arab-emirates.json`
- [ ] `public/geo/cities/united-kingdom.json`
- [ ] `public/geo/cities/united-states.json`
- [ ] `public/geo/cities/uruguay.json`
- [ ] `public/geo/cities/uzbekistan.json`
- [ ] `public/geo/cities/vanuatu.json`
- [ ] `public/geo/cities/venezuela.json`
- [ ] `public/geo/cities/vietnam.json`
- [ ] `public/geo/cities/yemen.json`
- [ ] `public/geo/cities/zambia.json`
- [ ] `public/geo/cities/zimbabwe.json`

## Scripts, Tests, And Docs Checklist

### Scripts

- [ ] `scripts/README.md`
- [ ] `scripts/audit-rendered-seo.ts`
- [ ] `scripts/seo-audit.ts`
- [ ] `scripts/route-health-check.ts`
- [ ] `scripts/validate-seo-architecture.ts`
- [ ] `scripts/validate-holiday-content.ts`
- [ ] `scripts/generateSitemap.js`
- [ ] `scripts/generate-geo-snapshot.ts`
- [ ] `scripts/export-fallback.ts`
- [ ] `scripts/export-holidays-delivery.ts`
- [ ] `scripts/extract-geo-import.sh`
- [ ] `scripts/sync-location.js`
- [ ] `scripts/patchSeedCities.js`
- [ ] `scripts/standardizeSeedCities.js`
- [ ] `scripts/events-new.ts`
- [ ] `scripts/events-ensure-files.ts`
- [ ] `scripts/events-autofill.ts`
- [ ] `scripts/events-normalize-copy.ts`
- [ ] `scripts/events-sync-research.ts`
- [ ] `scripts/events-sync.ts`
- [ ] `scripts/events-fix-related.ts`
- [ ] `scripts/events-apply-batch.ts`
- [ ] `scripts/events-clean-live.ts`
- [ ] `scripts/events-go-live.ts`
- [ ] `scripts/events-publish.ts`
- [ ] `scripts/generate-events-index.ts`
- [ ] `scripts/lib/content-normalizers.ts`
- [ ] `scripts/lib/event-authoring.ts`
- [ ] `scripts/lib/event-scaffold.ts`
- [ ] `scripts/lib/holidays-delivery-export.ts`
- [ ] `scripts/holiday-batches/README.md`
- [ ] `scripts/holiday-batches/seed-top-holiday-events.ts`
- [ ] `scripts/holiday-batches/publish-recurring-high-intent-events.ts`
- [ ] `scripts/holiday-batches/publish-arabic-drafted-seo-wave-2.ts`
- [ ] `scripts/holiday-batches/publish-arabic-national-seo-wave.ts`
- [ ] `scripts/holiday-batches/publish-arabic-remaining-drafts-wave.ts`
- [ ] `scripts/holiday-batches/publish-saudi-history-events.ts`

### Tests

- [ ] `tests/build-pipeline.test.ts`
- [ ] `tests/env-health.test.ts`
- [ ] `tests/seo-sitemap.test.ts`
- [ ] `tests/time-difference-indexing.test.ts`
- [ ] `tests/time-difference-popular-pairs.test.ts`
- [ ] `tests/time-now-content.test.ts`
- [ ] `tests/calculators-engine.test.ts`
- [ ] `tests/event-content-schema.test.ts`
- [ ] `tests/event-package.test.ts`
- [ ] `tests/event-scaffold.test.ts`
- [ ] `tests/events-index.test.ts`
- [ ] `tests/geo-og-labels.test.ts`
- [ ] `tests/guide-page-model.test.ts`
- [ ] `tests/holiday-display.test.ts`
- [ ] `tests/holiday-observability.test.ts`
- [ ] `tests/holidays-delivery-export.test.ts`
- [ ] `tests/holidays-search.test.ts`
- [ ] `tests/islamic-year-format.test.ts`
- [ ] `tests/og-image-routes.test.ts`
- [ ] `tests/template-resolver.test.ts`

### Docs

- [ ] `docs/codebase-map.md`
- [ ] `docs/routes-and-sitemaps-inventory.md`
- [ ] `docs/seo-edit-map.md`
- [ ] `docs/google-search-console-sitemaps.txt`
- [ ] `docs/post-launch-seo-backlog.md`
- [ ] `docs/production-seo-and-migration-runbook.md`
- [ ] `docs/platform-stabilization-2026-q2.md`
- [ ] `docs/next-updates-content-and-pages-roadmap.md`
- [ ] `docs/arabic-serp-copy-playbook.md`
- [ ] `docs/events-authoring-guide.md`
- [ ] `docs/add-new-event.md`
- [ ] `docs/new-event-developer-playbook.md`
- [ ] `docs/holidays-delivery-architecture.md`
- [ ] `docs/deployment-architecture.md`
- [ ] `docs/deployment/flow.md`
- [ ] `docs/deployment/releases.md`
- [ ] `docs/architecture/system-overview.md`
- [ ] `docs/architecture/docker-strategy.md`
- [ ] `docs/ci-cd/overview.md`
- [ ] `docs/ci-cd/production-blue-green-runbook.md`
- [ ] `docs/context/agent-tool.md`
- [ ] `docs/context/audit-2026-05-12.md`
- [ ] `docs/context/miqatona-app-vps-context.md`
- [ ] `docs/hetzner-staging-bootstrap.md`

## Required Validation Commands

Run these after each completed batch. Record failures under the relevant file or route family.

- [ ] `npm run build`
- [ ] `npm run seo:audit`
- [ ] `npm run test:unit`
- [ ] `node --import tsx scripts/route-health-check.ts`
- [ ] `node --import tsx scripts/audit-rendered-seo.ts`
- [ ] `node --import tsx scripts/validate-seo-architecture.ts`
- [ ] `node --import tsx scripts/validate-holiday-content.ts`

## Manual Browser QA Matrix

- [ ] Homepage at mobile 375px, tablet 768px, desktop 1280px, large desktop 1536px.
- [ ] Blog index and one blog article.
- [ ] Date hub, today page, converter, Gregorian daily page, Hijri daily page, calendar year page, invalid date page.
- [ ] Time now hub, country page, city page, invalid city page.
- [ ] Prayer hub, country page, city page, invalid city page.
- [ ] Time difference hub, popular pair, invalid pair, same-city pair.
- [ ] Calculator hub, finance tool, personal finance tool, sleep tool, building country tool, age tool.
- [ ] Holidays index, filtered results, one event page, invalid event page.
- [ ] Search page with results, empty state, keyboard navigation.
- [ ] Trust pages: about, contact, privacy, terms, disclaimer, editorial policy.
- [ ] Offline page and service worker behavior.

## Batch Sign-Off Template

Copy this under the relevant section when a route family is complete.

```md
### Batch Sign-Off: [route family]

- Owner:
- Date:
- Files changed:
- Routes manually checked:
- Search Console issue classes addressed:
- Sitemap changes:
- Indexation policy:
- AdSense risk:
- Validation commands run:
- Known follow-up:
```
