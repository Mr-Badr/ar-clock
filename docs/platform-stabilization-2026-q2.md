# Miqatona Bridge Execution Plan

## Summary
- Goal for the next 90 days: keep `miqatona.com` stable on Vercel + Supabase free, cut Vercel ISR/origin/CPU usage, reduce Supabase egress before May 15, 2026, and recover indexing for country/city/prayer/holiday pages.
- Chosen defaults: ads remain off, SEO focuses on country/city/prayer/holiday pages, and Cloudflare stays DNS-only.

## Phase 1: Stop The Bleeding
- Status:
  - Completed in code for homepage, `time-now`, `mwaqit-al-salat`, `date/country`, search preload removal, PDF gating, hero video, and service worker simplification.
- Remove request-time personalization from hot public pages:
  - `src/app/page.jsx`
  - `src/components/home/SectionPrayerTimes.jsx`
  - `src/app/time-now/[country]/page.jsx`
  - `src/app/time-now/[country]/[city]/page.jsx`
  - `src/app/mwaqit-al-salat/[country]/page.jsx`
  - `src/app/mwaqit-al-salat/[country]/[city]/page.jsx`
- Rule for those routes: no `headers()`, no IP lookup, no per-request geo resolution in server-rendered HTML. Personalized hints move to client-only islands using browser timezone and optional user action.
- Stop the search preload storm:
  - Remove the `mainCountriesSlugs.forEach(loadCountryCities)` mount effect in `src/components/SearchCity.client.jsx`
  - Keep country city loading only after explicit country selection
  - Keep global search only after the user types
- Freeze heavy optional runtime features for the bridge:
  - Keep `NEXT_PUBLIC_ENABLE_ADS=false`
  - Gate `src/app/api/pdf-calendar/route.js` behind an env flag defaulting to off
  - Change `src/components/hero/HeroVideoPanel.jsx` from `preload="auto"` to metadata/poster-first loading
  - Simplify `public/sw.js` so it stops caching dynamic search/location APIs
- Acceptance for Phase 1:
  - Initial page load no longer triggers dozens of country/API/DB fetches
  - Home, time-now, and prayer pages render without `headers()` in their hot path
  - `/api/pdf-calendar` is disabled unless explicitly enabled

## Phase 2: Move Public Geo Traffic Off Supabase
- Status:
  - Completed in code for public geo reads and search flows.
  - Public geo routes, sitemaps, and server helpers now prefer the static snapshot by default; live geo DB fallback is opt-in via `ENABLE_LIVE_GEO_DB=true`.
  - Remaining manual step: remove `SUPABASE_SERVICE_ROLE_KEY` from the Vercel runtime project after verifying snapshot-only production traffic.
- Introduce a static geo snapshot pipeline and make it the default public data source.
- Add snapshot outputs:
  - `public/geo/manifest.json`
  - `public/geo/countries.json`
  - `public/geo/cities/<countrySlug>.json`
  - `public/geo/city-search-index.json`
- Refactor public data reads:
  - `src/lib/db/queries/countries.ts` becomes local-first for public reads
  - `src/lib/db/queries/cities.ts` becomes local-first for public reads
  - `src/app/api/cities-by-country/route.js` serves snapshot data first
  - `src/app/api/search-city/route.js` serves snapshot search first
  - `src/lib/location-picker.client.js` loads static assets instead of runtime Supabase-backed routes whenever possible
- Keep Supabase only for:
  - snapshot generation
  - admin/content workflows
  - optional fallback during the transition
- Replace current build coupling:
  - `package.json` `build` becomes plain `next build`
  - `scripts/export-fallback.ts` becomes a manual snapshot/export command, not part of every deploy
  - `events:build` stays manual/content-driven, not part of every deploy
- Acceptance for Phase 2:
  - Normal deploys do not require the service-role key
  - Public route traffic no longer depends on live Supabase country/city queries
  - Supabase usage drops sharply after deploy

## Phase 3: Shrink And Stabilize The SEO Surface
- Status:
  - Completed in code for canonical host assumptions, sitemap stabilization, and daily date `noindex,follow`.
  - Remaining manual step: submit the new sitemap index in Search Console and validate existing 4xx/redirect issue groups after deployment.
- Keep indexed + in sitemap:
  - homepage and core hubs
  - holidays hub and event pages
  - all country pages for `time-now`, `mwaqit-al-salat`, and `date/country`
  - all capital city pages
  - top-ranked extra city pages only
  - date hub/today/converter/calendar pages
- Remove from sitemaps and mark `noindex,follow` for the bridge:
  - `/date/[year]/[month]/[day]`
  - `/date/hijri/[year]/[month]/[day]`
- Replace dynamic sitemap generation with deterministic snapshot/build output:
  - `src/app/time-now/sitemap.js`
  - `src/app/mwaqit-al-salat/sitemap.js`
  - `src/app/sitemap-index.xml/route.ts`
  - `src/app/date/sitemap.xml/route.ts`
  - `src/app/date/gregorian/sitemap.xml/route.ts`
  - `src/app/date/hijri/sitemap.xml/route.ts`
  - `src/app/date/sitemaps/*`
- Rules for sitemaps:
  - no `force-dynamic`
  - no request-time `new Date().toISOString()` churn
  - only canonical 200 URLs
  - `lastmod` from snapshot/build timestamp or real content update time
- Keep one canonical production host:
  - `https://miqatona.com`
  - `www` stays 301-only
  - old Vercel domains never appear in canonicals or sitemaps
- Acceptance for Phase 3:
  - sitemap surface is much smaller and fully canonical
  - daily date pages are crawlable but not index-targeted
  - GSC validation can start on current 4xx/redirect issues after deploy

## Phase 4: Build-Time Reduction
- Status:
  - Completed in code for country/city seed prerendering, consolidated geo sitemaps, stable date seeds, and holiday seed prerendering.
- Reduce prebuilt route volume:
  - switch country hubs to seed-only prerendering using `getPriorityCountrySlugs(24)`
  - switch city pages to seed-only prerendering using `getPriorityCityParams(24)`
  - let the remaining country/city pages render on demand and then cache
  - remove daily date prebuilds for the bridge
- Collapse metadata sitemap fan-out:
  - replace per-country `time-now` sitemap metadata routes with a single `src/app/time-now/sitemap.js`
  - replace per-country `mwaqit-al-salat` sitemap metadata routes with a single `src/app/mwaqit-al-salat/sitemap.js`
  - keep `src/app/sitemap-index.xml/route.ts` pointing only at the consolidated sitemap URLs
- Replace cache-unstable server helpers:
  - `src/lib/date-utils.ts` should stop causing frequent HTML churn for SEO pages
  - live clock behavior moves to client islands, while cached HTML stays stable
- Verify the new build target:
  - no Supabase export during ordinary build
  - no content regeneration during ordinary build
  - route count materially lower than the historical ~8.4k page generation seen in saved logs
  - current bridge checkpoint: static generation reduced from `2719` pages to `362`
- Acceptance for Phase 4:
  - deployment build is significantly faster
  - Vercel ISR writes and active CPU stop trending toward pause thresholds

## Platform Settings
- Status:
  - Manual actions required outside the repo. The codebase is now aligned with these settings, but the dashboard/DNS changes must still be applied in Vercel, Supabase, Cloudflare, and Search Console.
- Vercel:
  - keep ads off in all environments
  - detach old paused project/account from the production domain
  - keep only one active project serving `miqatona.com`
  - monitor `ISR Writes`, `Fast Origin Transfer`, `Fluid Active CPU`, and `Function Invocations` weekly
- Supabase:
  - move public geo traffic off the DB before May 15, 2026
  - keep `ENABLE_LIVE_GEO_DB` unset unless you intentionally need a temporary live-DB bridge
  - after snapshot mode is stable, remove `SUPABASE_SERVICE_ROLE_KEY` from Vercel runtime envs
  - rotate the service-role key if there is any concern about prior exposure
- Cloudflare:
  - use DNS-only records for the active Vercel project
  - apex record should match the value Vercel shows for the project, commonly `A 76.76.21.21`
  - `www` record should match Vercel, commonly `CNAME cname.vercel-dns.com`
  - SSL/TLS mode: `Full (strict)`
  - `Always Use HTTPS`: on
  - `Automatic HTTPS Rewrites`: on
  - `Brotli`: on
  - remove orphaned old Vercel DNS records
  - do not enable Cloudflare HTML cache rules, APO, or reverse-proxy caching during this bridge
- Google Search Console:
  - submit only `https://miqatona.com/sitemap-index.xml`
  - request indexing manually for homepage, top country pages, capital city pages, top prayer city pages, and main holiday pages after cleanup
  - export current 4xx/redirect issue URLs and map each to 301 or 410 explicitly

## Test Plan
- Build test: `next build` succeeds without snapshot export or event regeneration.
- Runtime test: home, `time-now`, prayer, and holidays pages work with snapshot data and no live Supabase dependency.
- Search test: no background fan-out requests on mount; country search loads one country dataset only.
- SEO test: sitemap contains only bridge-priority URLs; daily date pages return `noindex,follow`.
- Platform test: Vercel usage stops rising abnormally and Supabase egress drops before the fair-use deadline.

## Assumptions
- Ads stay disabled until after the VPS migration.
- Country/city/prayer/holiday visibility matters more than daily date long-tail indexing for the next 90 days.
