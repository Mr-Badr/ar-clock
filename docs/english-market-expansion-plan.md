# English-Market Expansion Plan

Status: research + architecture plan, approved 2026-08-17. No English code has shipped
yet — this document is the reference a future implementation session should execute
against. Do not skip straight to code from a casual re-read; the ordering below (audit
→ rules → intelligence layer → opportunity process → architecture → rollout →
content → QA → indexing → measurement → safeguards → risks) is deliberate.

## 1. Executive summary

We are not translating miqatona.com into English. We are building **English as its own
SEO market** on top of the same product. The Arabic site stays exactly as it is today —
same URLs, same rankings, untouched. English lives at `/en/...` on the same domain,
reusing the existing data layer (geo, holidays repository, calculators) rather than a
generic i18n-framework migration.

Content does not get produced by translating everything Arabic has. Every English page
is backed by a written justification (an "SEO Opportunity Record") built from real
demand/SERP/competition evidence, not from the fact that an Arabic equivalent exists or
that a keyword variant can be typed. We ship a small (~15-30 page) pilot across several
sections at once — some time-now/date pages for demand-verified cities, a handful of
our best interactive tools, a few globally-relevant holidays — measure real Google
Search Console performance, and expand only the patterns that actually gain traction.
Content is transcreated (written natively for English search intent) rather than
translated-and-proofread. The technical architecture is sized for eventual full
coverage; the content is not committed to 100% coverage on day one.

## 2. Current-state architecture audit

This section is the ground truth a future session should trust instead of re-deriving
it. All counts below are measured, not estimated (via `find`/`grep`/`wc -l` against the
actual repo, 2026-08-17).

### 2.1 Routing, proxy, and root layout

- **`src/proxy.ts`** is Next.js 16's renamed middleware convention (`proxy(request)`
  replacing the old `middleware(request)` export — there is no separate
  `middleware.ts`/`.js` anywhere in the repo). It structurally validates exactly three
  route families: `time-now`, `time-difference`, `date` (segment-count checks +
  cross-references against in-memory `Set`s built from geo JSON). Every other family
  (`tools`, `holidays`, `imsakiya`, `search`, etc.) is untouched by proxy.ts — their
  404 behavior comes from plain Next.js file routing.
- **On block**, `proxy.ts` returns a hand-built, **hardcoded Arabic-only 404 HTML
  string** (`lang="ar" dir="rtl"`, Arabic copy, `noindex,nofollow`) that bypasses
  `src/app/not-found.jsx` entirely. This has zero locale awareness — an `/en/...` path
  today falls through this logic untouched (since `segments[0]` would be `'en'`, not
  `'time-now'`/etc.) and 404s via plain Next.js routing with no `src/app/en/` tree to
  match. Once `/en/*` exists, this needs its own branch with an English 404.
- **`next.config.js`**: `output: 'standalone'` (server-rendered behind nginx, not
  static export). `cacheComponents: true` and `reactCompiler: true` — Next 16 Cache
  Components is live. One custom `cacheLife` profile (`geodata`). **No `i18n` config
  block at all.** Static redirect arrays exist for legacy path cleanup (same mechanism
  could host future `/en` redirects, none needed today).
- **Root layout** (`src/app/layout.tsx`) hardcodes:
  ```jsx
  <html lang="ar" dir="rtl" suppressHydrationWarning className={`dark ${notoSansArabic.variable}`}>
  ```
  as static JSX, not derived from any param. Loads only `Noto_Sans_Arabic` (Arabic
  font subset) — **no Latin font is loaded anywhere in the app today.** Root
  `metadata.openGraph.locale = 'ar_SA'` with `alternateLocale: ['ar_EG', 'ar_MA',
  'ar_AE', 'ar_IQ', 'ar_JO']` — all Arabic **dialects**, not a second language.
- **No `[locale]`/`[lang]` segment exists anywhere in `src/app/`.** Full top-level
  listing (23 segments): `about, actions, ads.txt, api, author, contact, countdown,
  date, disclaimer, editorial-policy, embed, guides, holidays, imsakiya, map, offline,
  privacy, search, sitemap-index.xml, styles, terms, time-difference, time-now,
  tools`.
- **i18n scaffolding search — genuinely zero.** No i18n library installed (`next-intl`
  etc. absent from `package.json`). `SITE_DEFAULT_LOCALE`/`SITE_SUPPORTED_LOCALES`
  exist in `src/lib/site-config.js` (`'ar-SA'` and `['ar-SA','ar-EG','ar-MA','ar-AE']`)
  but are **dead exports, never imported anywhere else in `src`.** Every existing
  `alternates.languages` usage (`src/app/holidays/page.jsx`,
  `src/lib/holidays/metadata.js`) points every language key at the **same single
  Arabic URL** — self-referential dialect hreflang, not real cross-language
  alternates. A JSDoc comment in `src/app/time-now/[country]/page.jsx:16` claims
  hreflang support the code doesn't actually implement.

### 2.2 Content authoring & data pipeline

| Surface | Measured count |
|---|---|
| Holiday event slugs (`src/data/holidays/events/*`) | **393** |
| Total `page.*` files under `src/app` | **210** |
| `page.*` files under `src/app/tools` | **168** (152 calculator routes + 16 category hubs) |
| Tool pages with a centralized content object | **38 of 168** |
| Tool pages with 100% inline-JSX copy | **130 of 168 (~77%)** |

- **Holidays**: strict 3-file authoring surface per slug
  (`src/data/holidays/events/<slug>/{package,research,qa}.json`), compiled by
  `npm run events:build` into `src/data/holidays/generated/*`, read only through
  `src/lib/holidays/repository.js` (hard architectural boundary — never bypass it).
  `richContent` is 100% Arabic across every field. Every event hardcodes a literal
  `seoMeta.inLanguage: "ar"` — **write-only today, nothing reads/branches on it** —
  the natural hook for an English variant, on specifically-selected events, not all
  393 at once. The repository's `countryOverrides`/`applyCountryOverlay` mechanism is
  structurally close to what a locale overlay would need. Even the holiday page's
  "shell" chrome (breadcrumbs, "كم باقي على", day-of-week labels, accuracy badges) is
  Arabic hardcoded directly in `src/app/holidays/[slug]/page.jsx` JSX, not just in
  `richContent`. `generateStaticParams` prebuilds all 393 slugs at build time.
- **Tools/calculators**: `src/lib/calculators/data.js` (152 routes) and
  `finance-page-content.js` (34 centralized content keys) are the only real
  content-as-data surfaces. **130 of 168 tool pages have zero centralized content —
  copy is hardcoded as inline JS constants and JSX literals directly in each
  `page.jsx`** (tables, guide text, TOC labels, headings). Even the 38 "centralized"
  pages mix in page-local inline Arabic (e.g. the BMI page's classification table).
  This is the single biggest cost driver for English coverage — it's a refactor
  problem before it's a translation problem.
- **time-now / time-difference / date**: hybrid — some copy from domain helpers
  (`src/lib/time-now-content.js`), but the bulk of visible prose is **inline JSX
  template literals interpolating city/country names into Arabic sentence templates**
  directly inside the route files. Same pattern as tools.
- **Geo data is already fully bilingual — zero new pipeline work needed.** Confirmed
  at the snapshot layer (`public/geo/countries.json`: every record has both `name_ar`
  and `name_en`), the Prisma schema (`Country.nameAr`/`nameEn`, `City` likewise), and
  the query layer (`src/lib/db/queries/cities.ts` normalizes both with fallback
  chains). Country/city names for English pages are a free lookup — only the
  surrounding prose/template sentences need writing.

### 2.3 SEO/sitemap/validator tooling

- **`npm run seo:validate`** (`scripts/validate-seo-architecture.ts`, gates `npm run
  build`) is **architecturally path-based with zero locale concept**: every route must
  map to a registered family in `src/lib/seo/site-architecture.js` or the build fails
  ("Page route has no sitemap/indexability decision"). An `/en/...` tree needs
  parallel family registration or the build breaks. It never inspects
  `alternates.languages` today.
- **`npm run seo:audit:rendered`** (`scripts/audit-rendered-seo.ts`, post-build HTML
  audit via cheerio) is otherwise language-agnostic (title/description/canonical/h1/
  JSON-LD/word-count/trust-links checks all apply correctly to English HTML) **except**
  its route-family regexes are bare and non-prefixed (e.g. `TIME_NOW_ROUTE_PATTERN =
  /^\/time-now(?:\/|$)/`) — an `/en/time-now/...` mirror would silently skip
  family-specific checks (like the "no FAQPage schema under time-now" rule) unless the
  regexes are updated to be locale-prefix-aware.
- **Sitemaps**: fully native Next.js `MetadataRoute.Sitemap`/route-handler XML across
  ~10 sitemap files (root + holidays + time-now + time-difference + imsakiya + date
  static/countries/calendars/gregorian/hijri), assembled via `sitemap-index.xml`.
  **Zero `alternates`/hreflang usage anywhere** — every entry is bare `{url,
  changeFrequency, priority}`. `MAX_SITEMAP_INDEX_ENTRIES = 50000` per sub-sitemap is
  already enforced with plenty of headroom for English mirrors. Root sitemap alone is
  roughly 240-250 URLs (`ROOT_SITEMAP_ROUTES` + all 168 calculator routes).
- **`robots.txt`** (`src/app/robots.js`) — single host, single sitemap-index
  directive, nothing locale-specific; blocks `GPTBot`/`ChatGPT-User`/
  `AhrefsBot`/`SemrushBot` outright. No changes needed to accommodate `/en` — same
  sitemap index can carry English sub-sitemaps.
- **`buildCanonicalMetadata()`** (`src/lib/seo/metadata.js`) — used at **365 call
  sites** — already accepts `locale` and `alternates` params per call. This is the
  single best lever for English metadata/hreflang: one existing, already-parameterized
  function, no signature change needed.
- **`SiteWideSchemas.jsx`** renders `Organization` + `WebSite` + `ItemList` JSON-LD on
  every page via the root layout. `WebSite.inLanguage: 'ar'` is hardcoded;
  `Organization.areaServed` is a fixed 18-country Arab-only list; only the customer
  support `contactPoint.availableLanguage` mentions `'en'` (support language, not a
  content-language signal). Needs a locale-conditional variant, or a documented
  decision to keep one schema entity across languages.
- **No existing docs anticipate this** — `docs/architecture/system-overview.md` and
  `docs/codebase-map.md` are silent on i18n; this was fully greenfield.
  `docs/routes-and-sitemaps-inventory.md` and `docs/seo-edit-map.md` are already stale
  (still reference retired `/calculators` and `/blog`) — worth a separate cleanup
  pass, out of scope here.

## 3. Hard rules for the English content track

Non-negotiable, cited verbatim in every future English-content session:

1. Never create an English page solely because an Arabic page exists.
2. Never create a page solely because a keyword variation exists — cluster keywords by
   search intent first; one intent cluster → one page.
3. Research English search demand before any page is produced at scale, combining the
   Free SEO Intelligence Layer sources (§4) — not keyword judgment alone.
4. Analyze the actual English SERP for realistic winnability, not raw search volume.
5. Write English content for English readers; structure may differ from the Arabic
   version when English search intent differs.
6. Preserve underlying facts/functionality from Arabic where genuinely equivalent;
   don't force equivalence where intent diverges.
7. No SEO filler, no padded word count. Tool pages lead with the tool.
8. Prioritize the site's actual competitive advantage — interactive tools — over
   generic informational articles competitors already own.
9. Never mass-generate indexable location/city pages without a demand/value
   justification per page.
10. Use hreflang only between genuinely equivalent localized pages, via one
    implementation method (HTML metadata) — never a forced pairing, never duplicated
    across sitemap and HTML.
11. Write English metadata (title/meta description) from English keyword research and
    SERP conventions, independently — not translated from the Arabic title.
12. Build an intentional English internal-link graph and breadcrumb hierarchy.
13. Run every page through the editorial + technical QA gates before publish (§9).
14. Tier human-review effort by page value (§9).
15. Measure in Google Search Console after launch; use real data (and, only once it
    justifies the spend, DataForSEO) to decide what to expand next.
16. Quality and search intent take priority over speed and raw page count.
17. Every important page gets a written **SEO Opportunity Record** before it's built
    (§5) — creates accountability for "why does this page exist."
18. Every candidate page resolves to exactly one of **CREATE + INDEX**, **CREATE +
    NOINDEX**, or **DON'T CREATE** — being generatable is never sufficient reason to
    index something.
19. Before creating any English URL, check it against the existing English route
    inventory for overlapping intent (cannibalization check, §5) — one distinct
    intent per primary indexable page.
20. Don't treat "the English market" as one homogeneous audience — segment by real
    country data (§10) once it exists, rather than guessing which countries matter.

## 4. Free SEO Intelligence Layer

Opportunity decisions combine multiple real data sources — never keyword volume
alone, never a single tool's output treated as ground truth.

### 4.1 The seven data sources

1. **Google Search Console** — primary first-party source once English pages are
   live: queries, pages, clicks, impressions, CTR, average position, country, device,
   filterable to `/en/*`. Used to find pages already gaining impressions worth
   improving, low-CTR opportunities, positions 4-20 worth pushing, newly-appearing
   English queries, and country breakdown — check here for improve-existing
   opportunities *before* creating new pages.
2. **Search Console URL Inspection** — indexing diagnostic for important English
   URLs: indexed/not indexed, Google-selected vs. user-declared canonical, crawl/
   indexing state. Not the same as Google's Indexing API (which is for job
   postings/livestreams) — normal pages go through sitemap discovery + this
   inspection tool.
3. **Bing Webmaster Tools** — free secondary source: keyword ideas, search volume/
   trend, related & question keywords, newly discovered keywords, top-ranking URLs
   per query, backlink data, site SEO diagnostics. Complementary to Search Console,
   not a replacement.
4. **Google Trends** — seasonality, rising interest, geographic interest, relative
   comparison between candidate topics — important here given Ramadan/Hijri/holiday
   content is inherently seasonal. A directional signal, never an absolute volume
   number.
5. **PageSpeed Insights / Lighthouse** — technical validation (Core Web Vitals,
   mobile experience, accessibility, SEO technical checks) for important English
   pages before/after publish.
6. **Google Rich Results Test** — structured-data validation; only ship schema that
   accurately represents visible page content and fits the page type.
7. **IndexNow** — notify participating search engines (Bing and others; **not**
   Google) on publish/update/removal of English URLs. Not a Google-indexing
   guarantee — Google discovery still runs through links + sitemap + Search Console.

### 4.2 What can realistically be connected today — honest breakdown

Being precise about this now avoids the plan promising automation that doesn't
exist. As of this research (2026-08-17), the session's toolset has WebSearch, WebFetch,
and Bash/scripts — no live Google/Bing API access, no SEO-specific MCP server
configured.

| Source | Cost | Works today, zero setup | Needs one-time owner setup | Automatable at all? |
|---|---|---|---|---|
| Search Console (performance data) | Free | Partial — repo already has `npm run growth:ctr -- --input=/path/to/gsc.csv`, a CSV-import triage script. Owner exports CSV from the Search Console UI manually, Claude analyzes it. | Full live API access needs a Google Cloud project + OAuth/service-account credentials granted on the verified property — enables scheduled pulls instead of manual export. | Yes, once credentials exist |
| Search Console URL Inspection | Free | No | Same Google API credentials as above (`urlInspection.index.inspect`) | Yes, once credentials exist |
| Bing Webmaster Tools | Free | No | Owner signs up (free), verifies site, generates an API key | Yes, once key exists — build a script analogous to `growth:ctr` |
| Google Trends | Free | No official public API | N/A | **Not automatable.** Manual checks by the owner, or Claude reasoning qualitatively from WebSearch/news signals as an explicitly-labeled approximate proxy |
| PageSpeed Insights | Free | **Yes** — public JSON API (`googleapis.com/pagespeedonline/v5/runPagespeed`), fetchable via WebFetch today, no key required for light use | Optional: free API key for higher volume | Yes, today |
| Google Rich Results Test | Free | No public API for automated calls | N/A | **Not automatable.** Substitute: a local static JSON-LD validator (valid JSON + required schema.org fields) for automated QA; the real tool as an occasional manual spot-check |
| IndexNow | Free | **Yes** — self-service: generate our own key, host at `public/<key>.txt`, POST on publish. No third-party account needed. | None | Yes, today |
| Own-codebase cannibalization check | Free | **Yes** — grep/inventory existing `/en` routes, `calculators/data.js`, holiday slugs, sitemap output via Bash. No external dependency. | None | Yes, today |
| WebSearch/WebFetch competitor & SERP-shape research | Free | **Yes** — the house method already used for Arabic content decisions, applied to English queries. Reads live search results, not a stored rank-tracking history — good for SERP-shape/intent classification, not precise day-over-day position tracking. | None | Yes, today |
| DataForSEO | Paid | No | Requires paid account + API key | Has an official MCP server — low-friction to add later once pilot data justifies the spend |

**Minimum viable integration set for the first pilot** (zero new credentials needed):
PageSpeed Insights via WebFetch, IndexNow (self-service key), the own-codebase
cannibalization check, WebSearch-based SERP/competitor research, and the existing
`growth:ctr`-style GSC CSV workflow (one manual export after the pilot goes live).
Everything else is a deliberate Tier 2/3 addition — see §4.4.

### 4.3 Budget-conscious research policy

Prefer free/first-party data. Batch research. Don't re-request the same data. Don't
run expensive SERP research on every possible keyword — validate a small set of
high-potential clusters before expanding research scope. When DataForSEO is
eventually introduced, require an explicit note of: what question free data couldn't
answer, what request is needed, and what decision the result will influence.

### 4.4 Tool hierarchy

- **Tier 1 — usable now, zero new credentials**: PageSpeed Insights (WebFetch),
  IndexNow (self-service key), own-codebase cannibalization check, WebSearch-based
  SERP/competitor research, existing GSC-CSV `growth:ctr` workflow.
- **Tier 2 — automate later, needs one-time owner setup**: full Search Console API
  (OAuth/service-account credentials) for live performance + URL Inspection, Bing
  Webmaster Tools (free signup + API key).
- **Tier 3 — paid, deferred until pilot data justifies it**: DataForSEO (official MCP
  server available, low-friction to add when funded). No Semrush/Ahrefs.
- **Manual-only, no automation path exists**: Google Trends, Google Rich Results Test
  (local JSON-LD validator substitutes for the automated part).

## 5. The per-page opportunity process

### 5.1 SEO Opportunity Record (required before creating any important page)

```
Target topic:            e.g. "current time in London"
Candidate keywords:       [clustered list]
Search intent:            live/current-time | tool | informational | comparison | ...
Demand evidence:          WebSearch signal + (Trends if checked manually) + (Bing KW research if available)
Target countries:         if relevant (from GSC data once available, not assumed)
Existing page(s):         none / URL(s) — result of the cannibalization check
Arabic equivalent exists: yes/no — if yes, URL
SERP analysis:            top-10 shape, dominant intent, SERP features observed
Realistic difficulty:     low / medium / high, with reasoning
Our advantage:            e.g. interactive live clock + timezone data
Content uniqueness:       what this page offers that existing results don't
Proposed URL:             /en/...
Proposed title/H1:        direction, not final copy
Decision:                 CREATE + INDEX | CREATE + NOINDEX | DON'T CREATE
Reason:                   short justification, so a future session can answer
                          "why does this page exist" without re-deriving it
```

### 5.2 SERP intent classification

For each keyword cluster, classify the dominant intent from the actual top-10 shape
(via WebSearch), and record SERP features observed (featured snippet, People Also
Ask, AI Overview, image/video results, calculators, local pack). The page format
follows the SERP's evidence, not the Arabic page's shape — a converter-dominated SERP
means the page leads with the tool; an informational-article-dominated SERP means a
different structure entirely.

### 5.3 Keyword cannibalization check

Before creating any English URL: inventory the existing English routes (once they
exist) plus in-flight Opportunity Records, and check for overlapping intent (e.g.
`/en/time-now/london` vs. a hypothetical `/en/current-time/london`). Default rule:
**one distinct search intent → one primary indexable page.** 100% free, runs entirely
against the repo's own route/content data.

### 5.4 Programmatic SEO safety layer

Every candidate page — especially in the high-volume families (city/country time-now
pages, holidays, tool variants) — resolves to exactly one of:
- **CREATE + INDEX** — demand justified, distinct intent, unique content/utility, no
  cannibalization, correct canonical, sitemap inclusion.
- **CREATE + NOINDEX** — useful for users/internal linking but not worth ranking
  ambition yet.
- **DON'T CREATE** — no justification found.

Being technically generatable (geo data supports 1,000 city pages) is never
sufficient justification on its own.

## 6. Recommended URL & routing architecture

- **`/en` subdirectory** on the existing `miqatona.com` domain — chosen over a
  subdomain (Google treats subdomains more like separate sites, inconsistent
  authority sharing) or a separate ccTLD-style domain (starts from zero authority,
  doubles hosting/ops surface, not justified for a single-brand two-language site).
  Subdirectories consolidate domain authority and are cheapest to run.
- Arabic stays **exactly as-is, unprefixed, at root** — no `[locale]` wrapper forced
  onto existing routes (too high blast-radius on a revenue site). Add a **new
  parallel `src/app/en/` tree** mirroring the top-level Arabic segments
  (`en/time-now`, `en/holidays`, `en/tools`, `en/date`, `en/imsakiya`,
  `en/time-difference`), reusing the same lib/data/repository layer rather than
  migrating Arabic into a generic `app/[lang]/ar/...` shape.
- **`proxy.ts`** gets a narrow `/en/*` branch: reuse the existing structural
  validation logic for time-now/time-difference/date, but return a correctly
  localized English 404 instead of the hardcoded Arabic HTML string.
- **`src/app/en/layout.tsx`** (nested under root) sets `lang="en" dir="ltr"` and
  loads a Latin font (none exists in the app today) — the root layout stays Arabic
  for everything outside `/en`.
- Per Next.js's own documented pattern (fetched from nextjs.org, 2026-06-10),
  `generateStaticParams` handles static rendering per locale, and `next/root-params`'s
  `lang()` getter passes locale deep into Server Components without prop-drilling and
  without forcing dynamic rendering via `headers()` reads — important since this repo
  has `cacheComponents: true` (Next 16 Cache Components) live, and a `headers()`-based
  locale read would conflict with that.
- **`buildCanonicalMetadata()`** is the hook for English metadata: pass `locale:
  'en_US'` (or appropriate) and `alternates` with the real `/en` URL — no signature
  change needed, 365 existing call sites already support this shape.

## 7. Rollout plan (pilot → measure → expand loop)

- **Phase 0 — Architecture** (build once, sized for 100% eventual coverage): `/en`
  routing in `proxy.ts`, locale-aware layout for the `/en` tree, hreflang wiring via
  `buildCanonicalMetadata()` (HTML method only, §11), sitemap/`site-architecture.js`
  registration for `/en/*` families, `SiteWideSchemas.jsx` English variant,
  `seo:validate`/`audit-rendered-seo.ts` locale-prefix-aware updates, IndexNow key +
  submission hook, a local JSON-LD structural validator script.
- **Phase 1 — Small opportunity-scored pilot** (~15-30 pages): every page backed by
  an SEO Opportunity Record, spanning multiple sections at once rather than
  exhausting one section first:
  - A handful of time-now/time-difference/date pages for demand-verified major
    cities (technical/data cost is near-zero here — geo names are already bilingual —
    but still gated by the demand/SERP check, never built blindly).
  - 5-10 of the highest-potential **tools** (interactive, differentiated — e.g. a
    Hijri-date converter), pulled forward rather than waiting for all 168 tool pages
    to be refactor-ready; only these specific pages get the inline-JSX-to-data
    refactor first.
  - A small number of genuinely globally-relevant/high-English-demand holidays,
    selected by real search-interest signal — not all 393, not by slug order.
- **Phase 2 — Ship & index**: publish the pilot, verify indexing (URL Inspection —
  manual via Search Console UI until the API is connected — and sitemap submission).
- **Phase 3 — Measure**: Search Console performance (CSV export → an extended
  `growth:ctr`-style report, or live API once connected) after enough data
  accumulates.
- **Phase 4 — Analyze & expand**: double down on what's gaining real traction;
  deprioritize patterns with no meaningful English signal. Introduce DataForSEO only
  once real performance data justifies the spend.
- **Repeat** Phases 2-4 continuously — this is a loop, not a one-time rollout.

### 7.1 SEO decision loop

```
DISCOVER → RESEARCH → CLUSTER → CLASSIFY INTENT → ANALYZE SERP → SCORE OPPORTUNITY
   → CREATE / IMPROVE / MERGE / IGNORE → EDITORIAL QA → TECHNICAL SEO QA → PUBLISH
   → SITEMAP → INDEXING MONITORING → MEASURE (GSC) → LEARN → EXPAND WINNING PATTERNS
   → REPEAT
```
Optimize for indexed pages / impressions / clicks / rankings / qualified traffic —
never for raw page count published. Twenty-five pages with eight receiving meaningful
impressions and two ranking top-10 is a far better outcome than five hundred
translated pages with zero meaningful traffic.

## 8. Content strategy per section

- **time-now / time-difference / date / imsakiya**: reuse `name_en` geo fields
  directly; author English sentence templates in `src/lib/*-content.js` domain
  helpers as siblings to the Arabic ones (content-as-code/data, not a generic
  dictionary/i18n-library approach). Still demand-gated per city/pair, not
  auto-generated for every combination geo data supports.
- **Holidays (393 events)**: select by real English relevance (global recognition,
  diaspora interest, genuine search demand) — not all 393, not in slug order. Extend
  each selected event's `package.json` with an English content field (e.g.
  `richContentEn` or a sibling `content.en.json`); extend `events:build`/
  `repository.js` additively; extend `validate-holiday-content.ts`'s Arabic-literal
  regexes (`PLACEHOLDER_RE`, `DISCLAIMER_RE`, `SOURCE_TEXT_RE`, the country-leak
  dictionary) with English equivalents rather than leaving them silently inert; wire
  the existing unused `seoMeta.inLanguage` field to something real.
- **Tools (168 pages)**: refactor the pilot's 5-10 pages from inline JSX into the
  centralized `finance-page-content.js` pattern as a prerequisite (a worthwhile
  code-quality win independent of i18n), then write native English content for those
  specific pages. Expand the refactor scope only as pilot results validate the
  approach — not a wholesale 168-page migration up front.

## 9. Editorial quality gate & review tiering

### 9.1 Pre-publish checklist (every English page)

- **Language**: reads as natively written English, no Arabic sentence structure
  leaking through, natural headings/terminology, correct prepositions.
- **Intent**: first section directly answers the search intent; tool pages put the
  tool immediately usable, not behind a wall of text.
- **SEO**: unique title/H1/meta description from English keyword research (not
  translated), correct canonical, correct hreflang (only if a genuine equivalent
  exists), internal links, structured data matching visible content, breadcrumbs
  where warranted.
- **Quality**: accurate against the Arabic source where equivalent, no filler
  paragraphs added purely to pad length, no Arabic-only `inLanguage`/JSON-LD
  inherited by mistake, no Arabic text leakage.

Banned filler patterns (explicit, carried over from the project's existing
anti-AI-voice content rules, now applied to English): "In today's fast-paced
world...", "Whether you're looking for...", "If you're wondering...", "In this
comprehensive guide..." and equivalents.

### 9.2 Human review tiering

- **Tier A** (highest realistic value): full deep human editorial review.
- **Tier B**: strong AI draft + lighter human review pass.
- **Tier C**: template/structural validation + spot-check sampling.

### 9.3 Content uniqueness requirement

For every English page: what does it offer that existing top-ranking results don't —
real interactive utility, unique data, a clearer/faster answer, better UX? A
grammatically correct translated page with nothing distinctive is not approved on
translation quality alone.

## 10. English market segmentation & backlink monitoring

Don't guess at "the English market" as one homogeneous audience. Once Search Console
country data exists for `/en/*`, use it (alongside Trends/Bing country filters) to
see where demand actually comes from — candidates include the US, UK, Canada,
Australia, India, UAE, Saudi Arabia, South Africa. Country-specific pages are only
justified by a distinct country-specific search intent, never created preemptively by
assumption.

Backlink/authority monitoring (referring domains, pages gaining links — via Bing
Webmaster's free backlink report once connected) is tracked as a diagnostic signal,
not a prerequisite for the pilot. Competitor backlink research is a DataForSEO-tier
task, deferred until funded.

## 11. SEO & indexing plan

- **hreflang — single method, corrected**: implement via HTML metadata only
  (`buildCanonicalMetadata()`'s existing `alternates.languages` param) — not also
  duplicated into sitemap `alternates` entries. Google treats HTML/HTTP-header/
  sitemap hreflang as equivalent with no benefit from combining them, and running two
  hand-maintained hreflang sources risks drift. Pair `ar`/`en` only where genuinely
  equivalent. English-only pages just need a correct self-canonical —
  `x-default` is not boilerplate for every page; it's reserved for real
  language-ambiguous entry points (e.g. the homepage).
- **Sitemaps**: register `/en/*` families in `site-architecture.js`, add parallel
  English sub-sitemaps to `sitemap-index.xml`. Entries stay plain `{url,
  changeFrequency, priority}` — no `alternates` field, per the hreflang correction
  above.
- **`seo:validate`**: register every new `/en/*` route family or the build fails
  ("no sitemap/indexability decision").
- **`robots.txt`**: no changes required — single sitemap-index directive already
  covers future English sub-sitemaps; verify it doesn't accidentally disallow `/en`.
- **`SiteWideSchemas.jsx`**: add a locale-conditional `inLanguage`/`areaServed`
  variant for `/en` pages, or document a deliberate decision to keep one schema
  entity across languages.
- **`audit-rendered-seo.ts`**: update bare route-family regexes (e.g.
  `TIME_NOW_ROUTE_PATTERN`) to be locale-prefix-aware so `/en/...` mirrors get the
  same family-specific checks as Arabic.
- **IndexNow**: generate a self-service key, host at `public/<key>.txt`, submit on
  publish/update/removal of English URLs — free, works today, not a Google-indexing
  guarantee.

## 12. Measurement report (recurring, once the pilot is live)

Extend the existing `growth:ctr` script rather than building a new tool:
- **Indexing**: English URLs published vs. indexed vs. unexpected canonicalization
  vs. crawl errors.
- **Performance**: clicks/impressions/CTR/average position by page.
- **Growth**: new English queries appearing, pages moving into top 20/top 10, pages
  losing visibility.
- **Countries**: English traffic by country (feeds §10).
- **Opportunities**: pages to improve/expand, new topic clusters discovered from real
  queries, pages that should not be expanded.

## 13. Technical SEO safeguards (verification checklist)

- `/en` has `lang="en"` and `dir="ltr"`; Arabic remains unchanged.
- English self-canonical is correct; `ar`↔`en` hreflang exists only for genuine
  equivalents, via HTML metadata only.
- Sitemaps contain only intended canonical/indexable URLs; `robots.txt` does not
  accidentally block `/en`.
- English pages are server-rendered and indexable; English content exists in the
  rendered HTML (not client-only).
- Metadata is English and unique; titles/H1s are not mechanically translated.
- Structured data matches visible content; no English page inherits Arabic-only
  `inLanguage` or JSON-LD.
- Breadcrumbs reflect the actual English hierarchy; internal links use the English
  route tree.
- No accidental Arabic text leaks into English pages.
- 404/blocked responses (`proxy.ts`) are correctly localized for `/en/*`.
- All locale-specific validators (`validate-seo-architecture.ts`,
  `audit-rendered-seo.ts`, `validate-holiday-content.ts`) cover `/en/*` explicitly.

## 14. Risks & gotchas checklist

Concrete leak points found during this research — nothing here should get lost in a
future implementation session:

- `proxy.ts`'s hardcoded Arabic 404 HTML string bypasses `not-found.jsx` and has zero
  locale awareness — needs an explicit `/en/*` branch.
- Root layout's hardcoded `lang="ar" dir="rtl"` and single Arabic font — the `/en`
  tree needs its own layout with a Latin font.
- `SiteWideSchemas.jsx`'s Arabic-only `inLanguage`/`areaServed` renders on every page
  via root layout — needs a locale-conditional variant.
- `validate-holiday-content.ts`'s Arabic-literal regexes (placeholder/disclaimer/
  source-citation/country-leak) will silently go inert (not error) against English
  content unless mirrored — a real quality-gate gap, not a build blocker, easy to
  miss.
- `audit-rendered-seo.ts`'s non-prefixed route-family regexes will silently skip
  family-specific checks for `/en/...` mirrors unless updated.
- `seo:validate` will hard-fail the build the moment an `/en/*` route exists without
  a registered family — this one *is* a build blocker, by design.
- The core content-strategy risk this entire plan exists to prevent: mass-producing
  low-value English pages just to claim "translation coverage." The hard rules in §3,
  the Opportunity Record in §5, and the pilot-then-measure loop in §7 are the guard
  rails against that outcome — don't let a future session's schedule pressure erode
  them back into "just translate everything, it's faster."

---

*Sources for the external research cited in this document: Next.js official
internationalization guide (nextjs.org/docs/app/guides/internationalization, fetched
2026-06-10 revision), Linguise and DigitalApplied 2026 international-SEO/hreflang
guides, Google's documented 2026 stance on scaled/unedited machine-translated content,
and this session's direct exploration of the miqatona.com codebase (routing/proxy,
content pipeline, SEO tooling) plus three rounds of owner review that reframed the
content strategy from translation to opportunity-driven SEO expansion.*
