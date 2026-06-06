# Google Ads, Search Console, and Growth Checklist

This checklist tracks the work needed to reduce Google Ads rejection risk, clean Search Console issues, improve organic CTR, and raise page quality across Miqatona.

Use this file for execution status only. Keep competitor research in temporary working notes or user-facing source content, not in this checklist.

## Status Labels

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done and validated
- `[!]` Blocked by production data, Search Console export, Google Ads account data, or hosting config

## Official Google Policy Basis

- [Google Ads Destination requirements](https://support.google.com/adspolicy/answer/6368661): destination must work, be crawlable, accessible, easy to navigate, and contain sufficient original content.
- [Google Ads Destination not working](https://support.google.com/adspolicy/answer/16428019): ad URLs must return working content for common browsers, devices, and Google AdsBot instead of 4xx/5xx, unavailable, or broken states.
- [Google Ads Destination experience](https://support.google.com/adspolicy/answer/16427615): landing pages must be safe, useful, and easy to navigate without frustrating or abusive experiences.
- [Google Ads Quality Score](https://support.google.com/google-ads/answer/6167118): expected CTR, ad relevance, and landing page experience are the three diagnostic components to improve.
- [Google Ads landing page performance](https://support.google.com/google-ads/answer/7543502): landing pages should be tested regularly, especially for mobile experience and speed.

## P0: Google Ads Acceptance and Destination Health

- [!] Verify production canonical host configuration.
  - Check: production `NEXT_PUBLIC_BASE_URL` or `NEXT_PUBLIC_SITE_URL` resolves to `https://miqatona.com`.
  - Code guard: `getSiteUrl()` canonicalizes `https://www.miqatona.com` to `https://miqatona.com`, and production falls back to `https://miqatona.com`.
  - Validation: `tests/google-ads-config.test.ts` covers canonical host normalization; `npm run seo:validate` passed.
  - Blocked by: live production fetch/deploy confirmation that HTML, sitemap entries, Open Graph URLs, and canonical tags all emit `https://miqatona.com`.
  - Done when: production HTML, sitemap entries, Open Graph URLs, and canonical tags never emit localhost, staging, IP, or non-canonical hosts.

- [!] Verify production `ads.txt`.
  - Check: `https://miqatona.com/ads.txt`, `https://www.miqatona.com/ads.txt`, and HTTP redirects.
  - Code guard: `ads.txt` publishes `google.com, pub-..., DIRECT, f08c47fec0942fa0` when `ADSENSE_CLIENT_ID=ca-pub-...` is configured.
  - Validation: `tests/google-ads-config.test.ts` covers the generated Google seller line.
  - Blocked by: the real production `ADSENSE_CLIENT_ID` value and AdSense recrawl status.
  - Done when: root `ads.txt` contains the active Google publisher line and AdSense no longer reports it missing after recrawl.

- [!] Run destination health before Ads resubmission.
  - Local check while production is old: `npm run health:routes -- --base=http://localhost:3000 --route-timeout-ms=60000 --route-concurrency=1 --request-timeout-ms=360000`.
  - Production check after deploy: `npm run health:routes:live`.
  - Current local dev validation: direct `/api/health?full=1&routes=1&routeTimeoutMs=60000&routeConcurrency=1` returned HTTP `200`; route checks were `15/15` with `0` failures. Valid public routes returned `200`; invalid placeholder routes returned clean `404`.
  - Current local health caveat: overall readiness was `degraded` because local dev memory was high and `open-meteo` failed under restricted/dev network conditions; this was not a route or landing-page failure.
  - Known local behavior: first cold dev health run can time out during compilation; rerun after warmup before treating it as a real failure.
  - Blocked by: live production access from the deployed host.
  - Done when: all critical routes return 200, invalid placeholder routes return clean 404, and no route renders app-error or unavailable states.

- [!] Run Google Ads readiness simulation before Ads resubmission.
  - Local check while production is old: `npm run ads:readiness -- --base=http://localhost:3000 --timeout-ms=90000`.
  - Production check after deploy: `npm run ads:readiness:live`.
  - Source: `scripts/google-ads-readiness-audit.ts`, `package.json`.
  - Scope: AdsBot-style fetches for priority landing pages, 200 HTML status, canonical match, no `noindex`/`nofollow`, one H1, useful task surface, trust links, message match, and ad markup after primary content. The sampled map now includes city-level and country-level current-time routes.
  - Current local dev validation: `17` sampled landing pages returned `0` errors and `0` warnings against `http://localhost:3000`.
  - Blocked by: live production execution and reviewing any warnings with rendered mobile screenshots.
  - Done when: all sampled Ads landing pages return zero errors and only justified warnings.

- [x] Confirm Google AdsBot can crawl the site.
  - Check: `robots.txt`, no geo-blocking, no firewall/user-agent block, no login wall, no interstitial blocking content.
  - Source: `src/app/robots.js`, `tests/google-ads-config.test.ts`.
  - Local validation: robots now explicitly allows `AdsBot-Google` and `AdsBot-Google-Mobile` to crawl public pages while still blocking APIs, search result pages, and offline shell pages. `tests/google-ads-config.test.ts` passed.
  - Done when: AdsBot-style fetches return the same useful content as normal mobile browsers.

- [~] Confirm landing pages are not ad-first.
  - Check: every ad destination shows the promised tool/content before ads, popups, consent prompts, or unrelated navigation.
  - Local finding: ad slots are client-rendered, consent/permission-gated, and no ad slot replaces the initial server-rendered answer/tool content. Sidebar and sticky companion ads are outside the primary content flow.
  - Design-system source pass: blog articles, blog hub, calculator explanatory sections, global related links, and the discovery workspace now avoid repeated full-width/equal-weight card walls; search/tool panels remain framed only where they support the primary task.
  - Remaining check: inspect the deployed mobile viewport with production AdSense enabled and confirm consent/ad UI never covers the H1, first answer, calculator form, prayer table, or event countdown.
  - Done when: the page remains useful with all ad slots removed.

- [x] Create dedicated Google Ads landing-page map.
  - Check: each ad group maps to a specific page, not the homepage or `/fahras`.
  - Recommended campaign map:
    - Prayer times: `/mwaqit-al-salat`, `/mwaqit-al-salat/saudi-arabia/riyadh`, `/mwaqit-al-salat/egypt/cairo`.
    - Current time: `/time-now`, top country pages, and top city pages only where the page has unique local copy.
    - Date tools: `/date/today`, `/date/converter`, `/date/gregorian-to-hijri`, `/date/hijri-to-gregorian`, `/date/calendar/2026`.
    - Holidays and events: `/holidays`, `/holidays/ramadan`, `/holidays/eid-al-fitr`, `/holidays/eid-al-adha`, national-day and salary/support-payment pages.
    - Calculators: `/calculators/age`, `/calculators/monthly-installment`, `/calculators/vat`, `/calculators/percentage`, `/calculators/end-of-service-benefits`, `/calculators/personal-finance/emergency-fund`.
  - Avoid as ad destinations: homepage, `/fahras`, `/search`, `/map`, placeholder dynamic URLs, diagnostic sitemap URLs, and broad hubs when a matching detail route exists.
  - Done when: ad keyword, ad headline, page title, H1, first answer, and CTA all match the same intent.

## P0: Search Console Error Cleanup

- [x] Fix holiday prerender current-time build blocker.
  - Source: `src/lib/template-resolver.js`, `src/lib/holidays/runtime-data.js`.
  - Validation: `npm run build` completed and rendered SEO audit passed after removing the prerender-time date fallback.
  - Done when: `npm run build` completes and rendered SEO audit runs.

- [x] Remove duplicate-H1 risk on `/fahras`.
  - Source: `src/app/fahras/page.jsx`, `src/components/site/DiscoveryWorkspaceClient.jsx`.
  - Validation: rendered SEO audit reports `Invalid H1 counts: 0`; `/fahras` has one server-rendered H1.
  - Done when: rendered `/fahras` has exactly one `<h1>` in initial HTML and `npm run seo:audit:rendered` does not flag it.

- [x] Remove empty indexable `/map` legacy HTML page.
  - Source: `src/app/map/route.ts`.
  - Validation: `/map` now appears as a dynamic route and rendered SEO audit no longer reports `/map` as missing canonical, H1, structured data, trust links, or content.
  - Done when: `/map` redirects permanently to `/fahras` without generating an indexable static HTML page.

- [x] Simplify date sitemap submission.
  - Source: `src/lib/seo/site-architecture.js`, `src/app/date/sitemap.xml/route.ts`, `docs/routes-and-sitemaps-inventory.md`.
  - Validation: root sitemap index no longer includes `/date/sitemap.xml`; it lists the concrete date leaf sitemaps directly. `tests/seo-sitemap.test.ts` and `npm run seo:validate` passed.
  - Done when: root sitemap index lists only intended submitted sitemaps; diagnostic nested sitemap indexes are not submitted as normal URL sitemaps unless intentionally documented.

- [!] Confirm placeholder dynamic URLs are blocked in production.
  - Check examples: `/time-now/china/%5Bcity%5D`, `/mwaqit-al-salat/china/%5Bcity%5D`, `/time-difference/saudi-arabia-riyadh/%5Bto%5D`, `/date/2026/%5Bmonth%5D/%5Bday%5D`.
  - Local validation: all sampled URLs returned `404 Not Found` with `x-robots-tag: noindex, nofollow`.
  - Blocked by: live production confirmation after deploy.
  - Done when: each returns 404 with `noindex,nofollow` and does not appear in any sitemap or internal link.

- [x] Add redirects or clean 404/410 handling for removed legacy guide routes.
  - Check: `/guides`, `/guides/*`, `/guide`, `/guide/*`.
  - Source: `next.config.js`, `tests/next-redirects.test.ts`, `tests/seo-sitemap.test.ts`.
  - Validation: legacy guide paths permanently redirect to canonical `/blog` routes, and root/blog sitemaps exclude `/guide` and `/guides` aliases.
  - Done when: old indexed guide paths either 301 to canonical `/blog/*` pages or return intentional noindex 404/410.

- [!] Review Search Console excluded-page buckets.
  - Required export: top examples for `Crawled - currently not indexed`, `Discovered - currently not indexed`, `Duplicate without user-selected canonical`, `Soft 404`, `Not found`, `Server error`.
  - Local status: technical route protections for known placeholder, legacy guide, sitemap, `/map`, and duplicate-H1 issues are already covered above. Source review confirmed valid prayer/time geo routes are indexable by policy, while invalid placeholder dynamic routes stay noindex.
  - Blocked by: Search Console export with the current production examples for each excluded-page bucket.
  - Done when: each bucket has an owner action: fix, redirect, noindex, 404/410, or leave as intentional.

## P0: CTR and SERP Promise Fixes

- [x] Fix holiday detail H1/title composition.
  - Source: `src/lib/holidays/page-model.js`, `src/app/holidays/[slug]/page.jsx`, event `package.json` SEO fields.
  - Validation: rendered H1 samples now read `كم باقي على رمضان`, `كم باقي على عيد الفطر المبارك`, and `كم باقي على نتيجة الثانوية العامة (مصر)`; `npm run build` and rendered SEO audit passed.
  - Done when: visible H1 combines a clean event name with one natural user question, without duplicated prefixes or stitched Arabic.

- [!] Build a Search Console CTR triage list.
  - Required export: pages and queries with impressions, clicks, CTR, average position.
  - Source: `scripts/search-console-ctr-triage.ts`, `package.json`.
  - Check: export Search Console query/page CSV, then run `npm run growth:ctr -- --input=/path/to/export.csv`.
  - Local status: triage tooling now groups high-impression low-CTR rows by route family and labels rewrite, cluster, or position-work priorities.
  - Blocked by: Search Console performance export for the current property and date range.
  - Done when: top 50 high-impression low-CTR queries are grouped by route family and assigned rewrite targets.

- [!] Rewrite titles and descriptions for top high-impression pages.
  - Priority: pages with average position 3-15 and CTR below expected.
  - Local guard: rendered title and description length warnings are already clean; remaining rewrite priority depends on real CTR underperformance rather than guessing. Current aggregate example of 200k impressions and 1k visits means roughly 0.5% CTR, which is a snippet/query-match problem unless average position is very low.
  - Blocked by: Search Console query/page export identifying the affected pages.
  - Done when: title, H1, first sentence, and meta description answer the same query in natural Arabic.

- [x] Remove keyword-list style titles.
  - Check: homepage, `/fahras`, calculators hubs, holiday hub, prayer hub.
  - Source: `src/app/page.jsx`, `src/app/fahras/page.jsx`, `src/app/calculators/page.jsx`, `src/app/holidays/page.jsx`.
  - Validation: `npm run seo:validate` passed after rewriting the main hub titles into clearer user promises.
  - Done when: each title reads like a useful promise, not a list of product sections.

- [x] Clean rendered title and description length warnings.
  - Source: `src/lib/holidays/metadata.js`, `src/app/mwaqit-al-salat/[country]/page.jsx`, `src/lib/sleep/content.js`.
  - Validation: `npm run build` passed and rendered SEO audit now reports `0` titles outside `20-80` characters and `0` descriptions outside `90-175` characters.
  - Done when: rendered audit no longer reports snippet-length warnings for public indexable pages.

- [~] Add query-specific first-answer blocks.
  - Priority: holiday, prayer, date, and calculator pages.
  - Local validation: date day pages, yearly calendar pages, country time pages, monthly installment, and personal-finance tools now render direct first-answer or decision blocks before deeper explanation. Holiday and prayer templates already start with event/time answers, but final validation should be based on rendered route samples after build.
  - Done when: the first 100 words directly answer the main query and mention the page limitation or source where needed.

## P0: Thin and Shallow Content

- [x] Raise `/fahras` rendered content depth above the audit threshold.
  - Validation: rendered SEO audit reports `/fahras` at `518` words, zero public pages under 500 words, and zero invalid H1 counts.
  - Done when: built rendered audit reports `/fahras` above 500 words and no invalid H1 count.

- [x] Upgrade prayer city pages under 700 words.
  - Priority sample: Kabul, Dhaka, Santiago, Beijing, Bogota, Cairo, Jakarta, Tehran, Baghdad.
  - Add: calculation method, timezone, next prayer explanation, monthly table guidance, Ramadan relevance, local caveats, nearby cities, source note.
  - Source: `src/app/mwaqit-al-salat/[country]/[city]/page.jsx`.
  - Validation: `npm run build` and rendered SEO audit passed. Sampled city pages now render `918-922` words, one H1, and descriptions of `123-128` characters.
  - Done when: sampled prayer city pages exceed 900 useful words without boilerplate duplication.

- [x] Upgrade country time pages with local explanatory depth.
  - Add: timezone, DST rules, capital/city links, business-use examples, related difference/prayer/date paths.
  - Source: `src/app/time-now/[country]/page.jsx`, `src/lib/time-now-content.js`, `src/components/time-now/TimezoneInfoCard.jsx`.
  - Local validation: country pages render a direct H1/lead answer, capital reference, IANA timezone, UTC offset, DST explanation, same-offset countries, city links, prayer/date/time-difference links, source links, FAQ schema, and a fallback support state if secondary data fails.
  - Done when: top country pages have unique country-specific copy and internal links.

- [x] Upgrade date day and calendar pages.
  - Add: direct answer, Hijri/Gregorian caveat, country relevance, navigation to converter/calendar/country pages, source method.
  - Source: `src/app/date/[year]/[month]/[day]/page.tsx`, `src/app/date/calendar/[year]/page.tsx`, `src/components/date/DateEditorialSections.tsx`.
  - Local validation: date day pages render the conversion answer in the hero, method comparison, previous/next navigation, converter/calendar links, source links, FAQ schema, and a local-official caveat. Yearly calendar pages render a direct year summary, Hijri range, event links, source/method links, FAQ schema, and converter/calendar navigation.
  - Done when: GSC no longer treats date pages as thin/duplicate at scale.

## P1: Content Expansion That Helps Ads and Organic Growth

- [!] Add high-intent event pages only where search demand and source quality are strong.
  - Good targets: salaries, pensions, support payments, school calendars, exam/result dates, national days, and Ramadan/Eid country planning.
  - Avoid: generic international days with no Arabic search intent or no unique value.
  - Current coverage: generated holiday manifest contains `76` published events, `345` aliases, and `19` supported countries, so the next growth lever is quality and demand-fit, not raw event count.
  - Current rule: do not add events just to increase URL count. Add or promote events only when the page can answer a real Arabic query better than the current SERP and cite a reliable source.
  - Blocked by: Search Console, keyword demand, and reliable official-source review before adding new programmatic event coverage.

- [!] Add country-specific event variants only when user intent differs by country.
  - Blocked by: demand and SERP evidence proving country-specific intent differs enough to avoid duplicate pages.
  - Done when: shared-date events stay canonical and country variants add real local value rather than duplicate text.

- [~] Add topic clusters around calculators.
  - Priority: loans, VAT, end-of-service, emergency fund, debt payoff, sleep calculators, building material calculators.
  - Local validation: finance, personal-finance, sleep, and building guide collections exist and expose author/reviewer/source metadata through the blog template. Monthly installment and personal-finance tool pages link to related guides and calculators. Remaining work is to audit every calculator route, not just priority samples.
  - Done when: each commercial/planning calculator has one tool page, one explanatory article, FAQ, examples, and internal links.

- [x] Add Arabic-first source and methodology blocks.
  - Priority: prayer, Hijri dates, holidays, finance calculators.
  - Local validation: date pages cite Um Al-Qura/CLDR/ISO/Gregorian references, country time pages cite IANA/UTC/DST references, finance and personal-finance calculators link to educational/regulatory sources, and sensitive pages include visible limitation language before decision sections.
  - Done when: users can see how the result was calculated and when to verify externally.

## P1: Internal Linking and Topical Authority

- [~] Align shared navigation/card UI with design system v4.
  - Source pass: `src/components/blog/BlogArticleView.module.css`, `src/components/blog/BlogHubClient.module.css`, `src/app/calculators/calculators.css`, `src/app/styles/components.css`, and `src/components/site/DiscoveryWorkspace.module.css`.
  - Local status: blog article sections now read as editorial flow; blog hub article lists, calculator explanation/resource lists, date related links, and `/fahras` discovery results now use row-based navigation instead of card walls.
  - Remaining check: rendered desktop/mobile inspection after the next allowed build or deploy, especially `/blog`, one blog detail page, `/calculators`, one calculator detail page, `/date/today`, and `/fahras`.
  - Done when: high-traffic pages show the primary answer/tool first, avoid nested/equal card grids, and use framed surfaces only for actual tools, forms, search, or selected highlights.

- [~] Build stronger clusters between prayer, Ramadan, Hijri date, and holidays.
  - Local status: country time pages already link to prayer and date paths; date/calendar pages link to Hijri calendars and event days. Remaining work is a route-sample audit for prayer city/country pages and holiday detail pages to confirm reciprocal Ramadan/Eid/Hijri links.
  - Done when: relevant prayer pages link naturally to Ramadan/Eid/date pages and vice versa.

- [~] Build stronger clusters between calculators and blog guides.
  - Local status: blog guide collections and tool-guide mappings exist for finance, personal finance, sleep, and building paths. Personal-finance tools and monthly installment link to related guides; remaining work is a full calculator-route audit.
  - Done when: every calculator links to a guide explaining interpretation, and every guide links to the relevant calculator.

- [x] Review footer and header link density.
  - Source: `src/components/layout/Footer.jsx`.
  - Local validation: footer groups trust links, main product paths, and calculator paths into clear sections, with contact/privacy/editorial links accessible from all pages using the shared layout.
  - Done when: navigation helps discovery without making every page feel like a directory or ad doorway.

## P1: Trust, E-E-A-T, and Policy Signals

- [~] Add author/reviewer signals to articles and sensitive tool pages.
  - Priority: finance, prayer/date methodology, health-adjacent sleep content.
  - Local validation: blog articles render author, reviewer, publication date, update date, source count, author bio, editorial-policy link, and contact link through `src/components/blog/BlogArticleView.jsx`; schemas include author/editor/date/citation in `src/components/blog/BlogArticlePage.jsx`. Sensitive tool pages render source/method/disclaimer sections, but do not all show a dedicated author/reviewer card yet.
  - Done when: pages clearly show who created/reviewed the content and how it is updated.

- [!] Strengthen privacy page for active production behavior.
  - Check: analytics, AdSense, consent banner, geolocation, local storage, service worker.
  - Local validation: `src/data/site/info-pages.jsx` covers accountless use, optional geolocation, manual city entry, `localStorage`/`sessionStorage`, third-party services, Analytics/GTM/AdSense, consent behavior, no sale of personal data, and contact path.
  - Blocked by: confirming the exact deployed analytics, AdSense, consent banner, geolocation, local storage, and service worker behavior in production.
  - Done when: policy matches the exact deployed behavior.

- [x] Confirm contact path is functional.
  - Source: `src/data/site/info-pages.jsx`, `src/components/layout/Footer.jsx`, `src/components/site/SiteInfoPage.tsx`, `src/lib/site-config.js`.
  - Local validation: contact page, footer, and shared trust panel expose `mailto:contact@miqatona.com`; all shared-layout landing pages have footer access to contact/privacy/about/editorial pages.
  - Done when: mailto or form path works and appears from all landing pages.

- [x] Ensure disclaimers are visible near risky outputs.
  - Priority: finance calculators and prayer/date estimates.
  - Local validation: finance and personal-finance pages include result checks, lender/source caveats, and source sections; date pages warn about local Hijri/official differences near conversion results; country time pages warn against relying on saved UTC differences for future appointments.
  - Done when: user sees the limitation before relying on the result.

## P1: Performance and Crawl Efficiency

- [!] Review first-hit production latency for top landing pages.
  - Check: homepage, `/fahras`, `/holidays`, `/date/calendar/2026`, `/mwaqit-al-salat/saudi-arabia/riyadh`.
  - Blocked by: live production route timing from the deployed host, preferably using AdsBot/mobile-like requests after cache warm and cold checks.
  - Done when: production responses are stable and fast enough for AdsBot and Googlebot.

- [~] Reduce oversized HTML where possible.
  - Current rendered audit: median 288 KB, p90 369 KB, p99 779 KB.
  - Local status: large pages appear tied to useful server-rendered SEO content in date/prayer/holiday surfaces. Any reduction should preserve first-answer, source, FAQ, and schema-visible content.
  - Done when: very large pages are justified by useful SSR content or split without hiding SEO-critical content.

- [!] Review ad script and analytics loading.
  - Local status: checklist notes ad slots are client-rendered and consent/permission gated; privacy page documents Analytics/GTM/AdSense and consent behavior.
  - Blocked by: deployed production inspection with the real consent, analytics, and AdSense configuration enabled.
  - Done when: third-party scripts do not block LCP, INP, or initial content visibility.

## Validation Commands

- `npm run seo:validate`
- `npm run ads:readiness -- --base=http://localhost:3000 --timeout-ms=90000`
- `npm run ads:readiness:live`
- `npm run growth:ctr -- --input=/path/to/search-console-query-page-export.csv`
- `NODE_OPTIONS='--conditions=react-server' node --import tsx --test tests/google-ads-config.test.ts`
- `NODE_OPTIONS='--conditions=react-server' node --import tsx --test tests/next-redirects.test.ts`
- `npm run seo:audit:rendered`
- `npm run health:routes -- --base=http://localhost:3000 --route-timeout-ms=60000 --route-concurrency=1 --request-timeout-ms=360000`
- `npm run health:routes:live`
- `npm run lint`
- `npm run typecheck`
- `npm run validate:holidays:strict`

## Current Audit Baseline

- Rendered SEO audit checked `308` indexable public HTML files.
- Technical basics passed in the built sample: titles, descriptions, canonicals, structured data, trust links, and H1 count.
- Rendered title and description length warnings are now `0`.
- `0` rendered public pages were under 500 words.
- `1` rendered public page was below 700 words: `/fahras` at `518` words.
- Sampled prayer city pages now render above 900 words after adding local verification, Ramadan, travel, timezone, and mosque-table guidance.
- `72` placeholder shell HTML files exist in build output; proxy should block invalid placeholder URLs with 404 and noindex.
- Sitemap architecture now reports `13` sitemap endpoints after removing the diagnostic `/date/sitemap.xml` index from the submitted root sitemap index.
- Sitemap inventory found `5,582` local sitemap URLs and no placeholder URL leaks before the sitemap-index simplification; rerun full inventory after the next production build.
- Warmed local route health passed `15/15`; first dev run timed out on `8/15`, so production health must be checked separately.
- Current local Ads-readiness simulation passed `17/17` sampled landing pages with `0` errors and `0` warnings.
- Current direct local health payload returned route status `ok`, `15/15` route checks, and `0` failed route checks; overall readiness remained `degraded` only because local memory was high and the external Open-Meteo check failed in the dev network.
- Local development `.env.local` intentionally uses `NEXT_PUBLIC_SITE_URL=http://localhost:3000`; production must use `NEXT_PUBLIC_SITE_URL=https://miqatona.com` and preferably `NEXT_PUBLIC_BASE_URL=https://miqatona.com`.
