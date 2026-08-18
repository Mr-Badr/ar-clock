# SEO Research Sources — Design Document

Status: research only, 2026-08-17. **Nothing in this document is implemented.** No
website content changed, no English pages created, no new integrations connected — this
is the design layer that a future session executes against, one source at a time, once
reviewed and approved. Companion to `docs/english-market-expansion-plan.md` (the
content-strategy plan) and `scripts/seo-intelligence/search-console/` (the one source
that IS already connected).

## Why this document exists

The owner's stated decision pipeline for any existing-or-new page idea is:

```
existing/new idea
  → keyword research
  → search demand
  → trend/seasonality
  → SERP competition
  → search intent
  → existing competitors
  → Miqatona's ability to create a better/useful page
  → opportunity score
  → create or don't create
```

Search Console (already connected) can only answer *after* a page exists — it tells you
what Google already thinks of a page you built. Every stage *before* "create or don't
create" needs an external research source. This document maps each candidate source to
official access method, real cost/quota/authentication requirements, and exactly which
pipeline stage(s) it can honestly answer — so the next session can connect sources in a
deliberate order instead of guessing.

**Hard rule carried through this whole document**: official APIs / officially supported
access methods only. No scraping Google, Bing, or Trends; no unofficial libraries
(e.g. `pytrends`) wrapping an undocumented endpoint; no inventing a search-volume number
when a source can't actually provide one.

---

## Source 1 — Google Search Console

| | |
|---|---|
| **Purpose** | First-party ground truth: what Miqatona actually gets from Google Search today (§4-6 of the pipeline, retroactively — also feeds "existing competitors"/"can we do better" by showing our own current baseline). |
| **Official access** | Search Console API (`webmasters` v3 — `searchanalytics.query`, `sites.list`) via the official `googleapis` Node client. |
| **Authentication** | OAuth 2.0, Desktop app client, `webmasters.readonly` scope. |
| **Cost** | Free. |
| **Quotas** | `searchanalytics.query`: 25,000 rows per request (worked around with bounded pagination, see `lib/query-page-data.ts`); generous daily request quota, never hit in practice for this project's scale. |
| **Useful data** | Clicks, impressions, CTR, position by query/page/country/device; genuinely ours, not an estimate. |
| **Limitations** | Only reflects queries that already show Miqatona somewhere — structurally can't tell you about demand for topics we don't rank for at all yet. No true search-volume figure (impressions ≠ volume). Per-combination anonymization drops some low-volume rows (see `lib/limitations.ts`). |
| **Status** | **Done.** `npm run gsc:report` / `npm run gsc:opportunities`. Per the owner's instruction this session: *complete enough for now, do not extend further.* |

---

## Source 2 — Google Trends

Two genuinely different official access paths exist today, with very different
maturity. Treat them as two sub-sources, not one.

### 2a. Google Trends API (alpha)

| | |
|---|---|
| **Purpose** | Trend direction, seasonality, geographic interest, related topics/queries for a specific term we choose — exactly the pipeline's "trend/seasonality" stage, on-demand, for an arbitrary candidate keyword. |
| **Official access** | `developers.google.com/search/apis/trends` — Google's own REST API, announced July 2025, currently **alpha**. |
| **Authentication** | Application/approval process (a form on the docs page) — not self-serve. Google states it prioritizes applicants with "a concrete use case, ability to start soon, and willingness to give feedback." |
| **Cost** | Free (alpha; no published future pricing yet). |
| **Quotas** | Undocumented publicly — "restricted quotas" is all Google states at this stage. |
| **Useful data** | Rolling 5-year window, daily/weekly/monthly/yearly aggregation, country + sub-region comparison, **consistently-scaled** values across requests (a real upgrade over the public Trends UI, whose 0-100 scale resets per comparison set). |
| **Limitations** | **No guaranteed timeline or approval.** A real developer's own account of applying and getting no response at all is publicly documented (Google Search Central community thread). This is not a source we can plan around having by a specific date. |
| **Recommended use** | **Apply now, expect nothing.** The application costs nothing but doesn't block any other work — submit it immediately so the clock starts, but do not sequence any actual plan around receiving access. If/when it arrives, it becomes the direct on-demand answer to "trend/seasonality" for one specific candidate keyword — exactly the shape the pipeline needs. |

### 2b. Google Trends public dataset on BigQuery

| | |
|---|---|
| **Purpose** | Discovering *what's already trending/rising* per country, generally — a different question than "what's the trend for keyword X," but genuinely useful for the pipeline's "trend/seasonality" and "new idea discovery" stages. |
| **Official access** | Google Cloud's public BigQuery datasets — `international_top_terms` and `international_top_rising_terms` (announced officially on the Google Cloud blog, live since March 2022, MENA-relevant countries included in the ~50-country international coverage). Queried with standard SQL via BigQuery. |
| **Authentication** | A Google Cloud project + BigQuery access (can be the free-tier "BigQuery sandbox," no billing account strictly required for light use). |
| **Cost** | Free up to BigQuery's free tier — 1 TB/month query processing, 10 GB/month storage — comfortably enough for this project's needs. |
| **Quotas** | Governed by the free-tier limits above; a project-level Google Cloud quota, not a Trends-specific one. |
| **Useful data** | Top 25 and Top 25 Rising search queries per country/sub-region, daily granularity, 5-year rolling historical backfill per term once it first appears. |
| **Limitations** | **This is a "what's trending" feed, not a keyword lookup tool.** You cannot ask "what's Casablanca's interest trend for `عيد العرش`" directly — you can only see what already appears in the top/rising lists, and only Top-25-sized lists at that. Good for spotting genuinely new/seasonal topics; useless for validating a specific candidate keyword we already have in mind. |
| **Recommended use** | Connect this one **now, no approval needed** — it's fully available today, free, and official. Use it for periodic sweeps ("what's newly rising in Morocco/Saudi/Egypt this week") to *surface* new-idea candidates, feeding the pipeline's leftmost "existing/new idea" stage — not for validating ideas we already have. |

---

## Source 3 — Google Keyword Planner (via the Google Ads API)

| | |
|---|---|
| **Purpose** | The pipeline's core "keyword research / search demand" stage — genuine keyword ideas, related-keyword discovery, and approximate monthly search volume for a candidate term or URL. |
| **Official access** | **Only** through the Google Ads API's Keyword Planning services (`KeywordPlanIdeaService.GenerateKeywordIdeas`, `GenerateKeywordHistoricalMetrics`) — there is no separate/standalone "Keyword Planner API"; it's a service inside the Google Ads API. |
| **Authentication** | Google Cloud project + OAuth2 client (same shape of credential as our existing Search Console setup) **plus** a Google Ads **developer token**, obtained from a Google Ads account, **plus** a Google Ads account itself (free to create — no requirement to ever spend on an actual ad campaign). |
| **Cost** | The API itself is free to call — Google does not charge per keyword-idea request. Creating the required Google Ads account is free. |
| **Developer token access levels** (this is the real gate, not money): | |
| — Test access | Default for a brand-new token; only works against **test** Ads accounts, cannot pull real keyword-planning data. |
| — Explorer access | Often granted automatically; works on production accounts (2,880 operations/day) but **explicitly excludes planning tools** — not enough for Keyword Planner. |
| — **Basic access** | Requires an application (Google reviews it; optional "brand verification" step measurably speeds up the queue). Raises the ceiling to 15,000 operations/day and **does unlock Keyword Planning services**, per Google's own docs: "requests to Keyword Planning services for both standard and basic access are rate limited [more tightly than other services], but they are allowed." **This is the tier we need — not Standard.** |
| — Standard access | Unlimited daily operations, subject to a stricter "Required Minimum Functionality" review — overkill for a research-only, non-production-ad-serving use case like ours. |
| **Quotas** | Basic access: 15,000 operations/day overall, with Keyword Planning services specifically rate-limited tighter than that ceiling (exact per-minute number not published in the docs fetched). Google explicitly recommends caching results, since historical metrics only refresh monthly server-side anyway. |
| **Useful data** | Keyword ideas from a seed keyword, seed URL, or both; `avg_monthly_searches` (a real, if coarse, volume figure — averaged over the trailing 12 months); competition level (LOW/MEDIUM/HIGH) and bid-range signals (an Ads-auction artifact, not literal ranking difficulty, but a genuine competitiveness proxy); monthly search-volume history per keyword. |
| **Limitations** | **The often-cited "exact volume requires active ad spend" restriction is a UI behavior of the Keyword Planner web tool**, not a documented API restriction — multiple independent practitioner write-ups report the API returning real `avg_monthly_searches` values regardless of account spend, which is exactly why so many third-party "free keyword research" tools are quietly built on this API. **This is not an officially guaranteed behavior** (Google's own docs don't state it either way) — treat it as "worth verifying empirically the moment Basic access is granted," not as a promise to build a plan around. Data refreshes monthly, not real-time. Values are Google's own internal estimate, not a competitor-verified figure. |
| **Recommended use** | **Apply for Basic access immediately** — it's free, it's the single richest official keyword-demand source available to us, and the approval queue is the actual bottleneck (days to weeks), not money. Complete the optional brand-verification step in the Google Cloud project to move up the queue, mirroring exactly how we already have a Cloud project + OAuth client set up for Search Console. |

---

## Source 4 — Bing Webmaster Tools

| | |
|---|---|
| **Purpose** | A second real search engine's first-party data (query/keyword stats, related/question keywords, newly-discovered keywords, backlinks) — a genuine secondary signal, not a Google echo. Also directly useful once English content exists, since Bing/Copilot search share is meaningfully higher among English/US audiences than in most Arabic markets. |
| **Official access** | Bing Webmaster API — official Microsoft product, documented at `learn.microsoft.com/en-us/bingwebmaster/`. Methods of direct interest: `GetKeywordStats` (historical keyword impressions by country/language), `GetQueryStats`/`GetQueryPageStats`/`GetQueryPageDetailStats` (our own site's query performance, a Bing-side equivalent of Search Console's `searchanalytics.query`). |
| **⚠ Time-sensitive migration note** | **Microsoft is retiring the legacy SOAP/POX API format on August 31, 2026 — roughly two weeks from today.** Most third-party tutorials (including the ones this session's earlier web research surfaced) show the old `/webmaster/api.svc/pox/...` request shape. **Any implementation must target the REST (JSON/HTTP) API instead** — Microsoft's own migration guidance states the account, API key, quotas, and every method carry over unchanged; only the request/response format changes. Confirm the exact REST path/shape against current `learn.microsoft.com/en-us/bingwebmaster/` docs at implementation time, not against older cached tutorials. |
| **Authentication** | A single API key, generated from the Bing Webmaster Tools portal (Settings → API Access) once a site is verified there. No OAuth flow — simpler than both Google integrations. |
| **Cost** | Free. |
| **Quotas** | Dynamic and account/site-history-based per Microsoft's own docs (a newly-verified property behaves differently than a year-old one); check current limits at runtime via the API's own quota-inspection endpoint rather than hardcoding a number. |
| **Useful data** | Historical keyword impression stats by country/language; our own site's Bing query/page performance; related/question/newly-discovered keyword suggestions (per the Webmaster Tools UI's own "Keyword Research" feature, which the API surfaces); backlink data. |
| **Limitations** | Materially smaller absolute search volume than Google in most markets — a secondary signal, not a primary one. Keyword-stat granularity/history depth is less documented than Google's equivalents. The SOAP/POX-vs-REST migration above is a real, dated risk if not handled at build time. |
| **Recommended use** | Requires our own miqatona.com property to be verified in Bing Webmaster Tools first (separate from the Search Console verification we already have — check whether this already exists before assuming a fresh signup is needed). Once verified: generate the API key and connect against the REST endpoints. Lowest-friction of all four sources — no approval queue, no OAuth dance — but gated on the small "is our site already verified there" unknown and the REST migration. |

---

## Source 5 — DataForSEO (future, paid — do not implement)

| | |
|---|---|
| **Purpose** | The one thing none of the four sources above can do: real SERP-level competitive intelligence (who actually ranks, what their content looks like, SERP features present) and independent keyword-volume/difficulty cross-validation from a source outside Google/Bing's own ecosystem. |
| **Official access** | DataForSEO's own REST APIs (SERP API, Keywords Data API, etc.) — a commercial, officially-documented product (not a scraper we'd be building ourselves; DataForSEO does the underlying collection and sells structured access to it). Has an official MCP server (noted in `docs/english-market-expansion-plan.md`), which would make eventual connection low-friction whenever it's actually funded. |
| **Authentication** | API key/login+password pair from a DataForSEO account. |
| **Cost** | Pay-as-you-go, no subscription (as of DataForSEO's July 2026 pricing update). SERP API: **Standard queue ≈ $0.0006/query** (~5 min turnaround), Priority ≈ $0.0012/query, Live/real-time ≈ $0.002/query. Free $1 signup credit; **$50 minimum deposit** to move past trial usage. |
| **Quotas** | Governed purely by account balance — no separate rate-limit ceiling beyond what the account has funded. |
| **Useful data** | Actual SERP composition (organic results, features, People Also Ask, etc.) for a query; keyword volume/difficulty/CPC estimates independent of Google's own reporting; competitor domain-level SERP presence. |
| **Limitations** | Costs real money per call — the only source in this document that does. Estimates (volume/difficulty) are DataForSEO's own modeled numbers, not Google/Bing ground truth either — still an estimate, just from a third vendor. |
| **Status** | **Explicitly deferred.** Per the owner's standing instruction and this session's brief: connect only once the four free/officially-sanctioned sources above have surfaced a *specific* opportunity that genuinely needs SERP-level validation they structurally cannot provide — never as a blanket keyword-list scan, and never simply because it "has more data" than the free sources. |

---

## How the five sources map to the owner's decision pipeline

| Pipeline stage | Best source(s) today | Availability |
|---|---|---|
| Existing/new idea discovery | Google Trends BigQuery dataset (rising terms sweep); GSC opportunities (queries already getting impressions with no dedicated page) | **Available now** |
| Keyword research / related keywords | Google Ads API Keyword Planner; Bing Webmaster keyword research | Ads API: pending Basic-access approval. Bing: available once verified + REST-migrated |
| Search demand (volume) | Google Ads API `avg_monthly_searches`; Bing `GetKeywordStats` impressions | Same as above |
| Trend/seasonality | Google Trends API alpha (specific keyword, if/when approved); Trends BigQuery dataset (general "what's rising") | BigQuery: **available now** (general only). Alpha API: unpredictable |
| SERP competition | DataForSEO SERP API only, of the sources here | **Deferred (paid)** |
| Search intent | Manual/analytical — inferred from SERP shape (needs DataForSEO or manual browser check), no source here automates this | Manual for now |
| Existing competitors | DataForSEO (structured) or manual WebSearch/WebFetch review (the house method already used for Arabic content decisions, per project memory) | WebSearch method: **available now**, informal |
| Miqatona's ability to build better | Judgment call — informed by GSC's existing performance data + the product's own tool/content inventory | **Available now** |
| Opportunity score | Combine whichever of the above are available at decision time — never a single source alone (same principle already applied in `lib/opportunity-scoring.ts`) | N/A — a synthesis step, not a data source |

The honest read: **today**, only GSC, the Trends BigQuery dataset, and manual/WebSearch
competitor review are actually connectable with zero waiting. Real keyword-demand data
(the pipeline's most load-bearing stage) is gated on the Google Ads API Basic-access
approval queue — which is exactly why that application should go in first, immediately,
even though nothing else in the plan waits on it.

---

## Recommended connection order (limited budget, maximum intelligence per dollar)

Rated by real cost, real waiting time, and how directly each answers a pipeline stage —
**not** by how much raw data each source has.

1. **Submit the Google Ads API Basic-access application today.** Free, and the approval
   queue (days-to-weeks) is a fixed cost we can't buy our way out of — starting it now
   is strictly better than starting it later, and it costs nothing to have it pending
   while everything else happens. Complete the optional brand-verification step in the
   same Google Cloud project our Search Console OAuth client already lives in, since
   that measurably speeds up the queue.
2. **Connect Bing Webmaster Tools next.** Zero approval wait, zero cost, a genuinely
   different (if smaller) keyword-demand signal, and closes a real gap while the Ads API
   application is pending. Must be built against the current REST API, not the
   soon-retired SOAP/POX shape most tutorials still show.
3. **Connect the Google Trends BigQuery public dataset third.** Also zero-wait,
   zero-cost, official — but the narrowest and most different-shaped of the three (a
   "what's rising" feed, not a lookup tool), so it's least urgent even though it's just
   as free as #2.
4. **(Passive, no priority) Submit the Google Trends API alpha application** whenever
   convenient — free, but per Google's own community thread, applications can go
   unanswered indefinitely. File it and move on; don't sequence anything around it.
5. **Only after 1-3 are live and have run for a real window**, revisit whether
   DataForSEO is justified — specifically, only when a concrete opportunity surfaces
   that the free sources can't validate (typically: "we think this is winnable but we
   genuinely can't tell who else is ranking or why"). Fund it with the smallest useful
   batch on the Standard (cheapest, ~5-min) queue for that specific question, not a
   blanket keyword-list sweep — DataForSEO's own pay-as-you-go pricing rewards narrow,
   deliberate use exactly the way this whole document argues for.

This order deliberately does not front-load DataForSEO despite it being the most
capable single source — the objective stated for this task is maximum useful SEO
intelligence *per dollar*, and steps 1-4 are $0 and cover most of the pipeline's early
stages already. Paid access only earns its cost once free sources have done the cheap
filtering first.
