# Miqatona — Master Growth Roadmap (Traffic · CTR · Revenue · UX)

> **Goal:** Take miqatona.com from ~3.5K clicks/month to **1M+ visitors/month** and materially grow AdSense revenue, by fixing the real, data-proven problems across every page type, component, and logic layer — not one-off edits.
>
> **Source of truth:** This file. Every task references a real row from the Search Console / AdSense exports (June 2026). Update the status boxes as work ships.
>
> Status: `[ ]` not started · `[~]` in progress · `[x]` done & validated · `[!]` blocked
>
> **Workflow:** Pick a track → implement → run the listed verification command → tick the box → commit per track.

---

## 0. The data, in one screen (June 2026, last 3 months)

| Metric | Value | What it means |
|---|---|---|
| Clicks | 3,050 | Growing fast: ~10/day (Apr) → 117/day (Jun 20) |
| Impressions | 924,564 | Exploded 500/day → 37K/day; Jun 15 spike = 113K |
| Sitewide CTR | **0.33%** | #1 problem — below curve for avg position 9 |
| Avg position | 9.1 | Ranking bottom-of-page-1 / page-2 on head terms |
| Mobile share | 88% clicks, **97% revenue** | Desktop CTR (0.25%) worse than mobile (0.34%) |
| AdSense | ~0.23 MAD/day; Anchor auto-ad = 78% of revenue | Manual display RPM 1.58 vs Anchor 6.97 |
| Indexing | "Crawled – not indexed" swung 291 → 33 | Thin programmatic pages at risk |

**Core diagnosis:** We have a *visibility asset* (925K impressions) trapped behind four leaks:
1. **Snippets** — 0.33% CTR sitewide (titles/descriptions don't sell the click).
2. **Rank depth** — our highest-volume category (prayer times) ranks page 3–8 on the money cities.
3. **Indexing** — hundreds of thin pages diluting crawl budget and deindexing.
4. **Engagement** — ~1 page/session; no "what's next" loop; low ad impressions/visitor.

We do **not** have a content-depth problem. Fixing the four leaks above is the entire game.

**Path math to 1M visitors/month (~33K clicks/day):**
- CTR 0.33% → 1.2% ≈ **3.6×**
- Impressions 37K/day → 250K/day ≈ **6.7×** (prayer-times rank rescue + programmatic + US/diaspora)
- Combined ≈ 24× current → ~30K clicks/day. Achievable in 3–5 months **if** prayer + time-now categories crack page 1 and indexing is fixed first.

---

## 1. Top 20 actions, ranked by impact ÷ difficulty

| # | Action | Evidence (real row) | Impact | Effort | Track |
|---|---|---|---|---|---|
| 1 | Rewrite titles on top-10 impression pages | islamic-new-year-in-tunisia: 109K impr @ 0.24% | 🔥🔥🔥 | S | C-CTR |
| 2 | Rescue Arab-capital prayer pages (pos 30–80) | tunis 38, dubai 82, doha 30, casablanca 64 | 🔥🔥🔥 | M | B-Prayer |
| 3 | Fix "راس السنة الهجرية 2026" snippet (Gregorian-first) | 52,457 impr, pos 10.29, **0.15%** | 🔥🔥🔥 | S | C-CTR |
| 4 | Adhan query cluster (اذان المغرب/الفجر/مواقيت) | اذان المغرب 6,290 impr @ 0.02% | 🔥🔥🔥 | M | B-Prayer |
| 5 | Fix "crawled–not indexed" (thin date/* pages) | Chart22: 291→33 volatile | 🔥🔥 | M | F-Index |
| 6 | ashura-in-morocco snippet (already pos 6.4!) | 36,571 impr, pos 6.4, 0.32% | 🔥🔥 | S | C-CTR |
| 7 | Expand building-calculator programmatic | jordan 5.45%, qatar 7.77%, egypt 7.04% CTR | 🔥🔥 | M | E-Prog |
| 8 | US time-now CTR (revenue double-win) | atlanta 24K impr @ 0.16%, US RPM 20–35 MAD | 🔥🔥 | S | C-CTR |
| 9 | mawlid/ashura hub rescue | mawlid hub 21,391 impr, pos 10.66, **0.08%** | 🔥🔥 | S | C-CTR |
| 10 | Internal linking → pages/session 1→3 | GA: single-page sessions dominate | 🔥🔥 | M | D-Links |
| 11 | bac/exam-results cluster expansion | bac-results-tunisia 249 clicks @ 0.5% | 🔥 | M | E-Prog |
| 12 | time-difference snippet + programmatic | 22,947 impr @ 0.33%, pos 8.12 | 🔥 | M | E-Prog |
| 13 | Anchor/Vignette auto-ad coverage site-wide | Anchor RPM 6.97 vs manual 1.58 | 🔥 | S | G-Rev |
| 14 | ashura-in-algeria snippet | 18,626 impr, pos 7.12, 0.26% | 🔥 | S | C-CTR |
| 15 | hajj-season hub → cluster (already 1.01% CTR) | 15,614 impr, pos 7.15 | 🔥 | M | E-Prog |
| 16 | Father's Day cluster (proven 1.83% @ pos 2.5) | fathers-day-tunisia pos 2.54 | 🔢 | M | E-Prog |
| 17 | Turkey prayer pages (pos 10, 0.02%) | sanliurfa 28,649 impr | 🔢 | M | B-Prayer |
| 18 | WebSite+SearchAction + Article schema | sitelinks searchbox missing | 🔢 | S | H-Schema |
| 19 | Damascus/Syria diaspora time-now | 16,606 impr @ 0.14% | 🔢 | S | C-CTR |
| 20 | Merge/noindex thin date/* pages | hundreds of /date/YYYY/MM/DD @ 0 clicks | 🔢 | M | F-Index |

---

## TRACK A — Foundation & measurement (do first, blocks nothing)

- [x] **A1. Add Web Vitals → GA4.** `WebVitalsReporter.client.jsx` wired into `ClientRuntimeMounts` — LCP/INP/CLS → GA4/GTM tagged by route family.
- [!] **A2. GSC CTR triage cadence.** `npm run growth:ctr -- --input=<gsc-export.csv>` already exists — run weekly. **Blocked:** owner must export Search Console Performance CSV.
- [ ] **A3. Baseline snapshot:** record clicks/day, CTR, avg position, AdSense RPM today so every track can show lift.

**Verify:** RUM events visible in GA4 Realtime; `reports/ctr-*.md` generated.

---

## TRACK B — Prayer times: the biggest buried category 🔥🔥🔥

**Problem (real data):** highest-volume Islamic category, ranking page 3–8 on money cities while demand is enormous and unmet.

| Page | Pos | Impr |
|---|---|---|
| mwaqit-al-salat/united-arab-emirates/dubai | **82.9** | 1,005 |
| .../qatar (hub) | 70.65 | 682 |
| .../kuwait (hub) | 66.17 | 153 |
| .../morocco/casablanca | 63.73 | 335 |
| .../tunisia/tunis | 38.45 | 696 |
| .../jordan/amman | 30.3 | 1,877 |
| .../turkey/sanliurfa | 10.4 | **28,649** (proof page-1 = huge volume) |

Query-side unmet demand: اذان المغرب (6,290 @ 0.02%), صلاة الفجر (3,874 @ 0%), مواقيت الصلاة (2,146 @ 0%), اذان الفجر (4,063). Turkey cities rank pos ~10; Arab capitals rank pos 30–80 — a **content-thinness + internal-link-authority** gap (near-duplicates → deindex risk).

- [x] **B1. Differentiate every city page.** Added server-rendered first-answer block at top of `PrayerTimesContent`: ≥40 words answering "متى أذان المغرب اليوم في {city}؟" with actual Fajr/Dhuhr/Maghrib/Isha times. 7 city-specific FAQs + `PrayerTimeline` + monthly calendar already present.
- [x] **B2. Internal link mesh.** `GeoCityDirectory` updated with `featuredCount` prop — top 12 cities (capital + majors) always-visible outside `<details>` for full crawlability. Both prayer `/[country]` pages and time-now `/[country]` pages pass `featuredCount={12}`. Secondary cities remain collapsible for UX.
- [x] **B3. Cross-link prayer ↔ time-now ↔ time-difference** for the same city. Prayer city `utilityLinks` now includes time-now sibling + time-difference hub link. Time-now city page already links back to prayer. Complete.
- [x] **B4. Titles:** `generateMetadata` in prayer city page calls `calculatePrayerTimes` → embeds actual Fajr+Maghrib in title and meta description.

**Impact:** plausibly **+3,000–5,000 clicks/day** if capitals reach page 1 on million-impression terms.
**Verify:** `npm run seo:audit:rendered` passes; city page word counts up; spot-check 5 capitals render unique copy.

---

## TRACK C — CTR rescue: titles & descriptions 🔥🔥🔥

**Problem:** pages already rank; ~6,000 clicks/month lost to weak snippets. **What already wins in our data:** explicit date + "كم باقي/متى" + visible Gregorian year. Proof: عيد الآباء تونس (pos 2.54 → 1.83%), building/qatar (7.77%), العد التنازلي للباك تونس (pos 2.73 → **26.83%**).

**The 10 pages to rewrite first:**

| Page | Impr | Pos | CTR now | Target |
|---|---|---|---|---|
| holidays/islamic-new-year-in-tunisia | 109,163 | 9.6 | 0.24% | 1.5% |
| time-now (hub) | 37,031 | 9.0 | 0.13% | 0.8% |
| holidays/ashura-in-morocco | 36,571 | 6.4 | 0.32% | 2.5% |
| mwaqit-al-salat/turkey/sanliurfa | 28,649 | 10.4 | 0.02% | 1.0% |
| time-now/united-states/atlanta | 24,213 | 8.2 | 0.16% | 1.2% |
| holidays/mawlid (hub) | 21,391 | 10.7 | 0.08% | 1.0% |
| holidays/ashura (hub) | 19,239 | 9.5 | 0.14% | 1.0% |
| holidays/ashura-in-algeria | 18,626 | 7.1 | 0.26% | 2.0% |
| time-now/syria/damascus | 16,606 | 6.8 | 0.14% | 1.5% |
| time-difference (hub) | 22,947 | 8.1 | 0.33% | 1.0% |

- [x] **C1. Holiday title formula** — 8 Islamic events updated: `{eventName} {{year}} - {{hijriYear}} هـ | {{formattedDate}}` (islamic-new-year, ashura, mawlid, eid-al-adha, eid-al-fitr, hajj-season, day-of-arafa, first-dhul-hijjah).
- [x] **C2. Force Gregorian year into Hijri-event titles.** All 8 Islamic events now include `{{year}} - {{hijriYear}} هـ` pattern. Validated by `islamic_year_pair_missing` check.
- [x] **C3. Hub metadata** — time-now "100+ مدينة توقيت حي", time-difference "مباشر مع DST وUTC", prayer hub "أي مدينة" all rewritten.
- [x] **C4. Descriptions:** 21 events updated — date-first: `{EventName} {{year}}: {{formattedDate}}`. Islamic cluster + national events fixed. Proof: BAC Tunisia 26.83% CTR.

<!-- original: / live promise, not prose; add `daysRemaining`/`formattedDate` tokens to meta description + OG.
- [x] **C5. US/EU/Gulf time-now first** — city time-now title formula updated: `الوقت الآن في {city}، {country} — ساعة حية وتاريخ اليوم`.

> ⚠️ **Do not** touch pages already winning CTR (building/* calculators, fathers-day). They convert — leave their titles. Never remove existing metadata; only extend.

**Verify:** `npm run seo:validate` + `seo:audit:rendered` — 0 length warnings; re-pull GSC in 2 weeks, confirm CTR lift on the 10 pages.

---

## TRACK D — Internal linking → pages/session 1 → 3 🔥🔥

**Problem:** GA shows single-page sessions dominate; few ad impressions per visitor. Components exist — under-deployed.

- [x] **D1. Reciprocal holiday clusters.** Python script fixed 56 event `package.json` files with reciprocal `relatedSlugs`. `events:build` ran clean.
- [x] **D2. "المناسبة القادمة" next-event card** — `NextEventCard` server component added to `HolidayDetailsSections.jsx`. Finds nearest upcoming published event by days remaining in a single batch resolve.
- [x] **D3. Prayer ↔ time-now ↔ time-difference** city cross-links (shared with B3). ✅
- [x] **D4. Blog ↔ calculator** bidirectional links via `src/lib/guides/tool-guides.js` — already fully implemented: calculator pages pull `TOOL_GUIDE_GROUPS` → `CalculatorResourceLinks`; blog pages use `relatedCalculatorSlugs` → `getCalculatorRouteBySlug`. Both directions wired for all current guides.
- [x] **D5. RelatedCalculators redesign** — 1 featured row + compact ranked rows with reason chips. Complete.

**Verify:** GA4 pages/session trending up; every holiday/prayer page has ≥3 contextual internal links.

---

## TRACK E — Programmatic expansion (match proven winners) 🔥🔥

Only scale page types the data already proves convert. Each new page ships with ≥1 unique data block + 3 internal links (or it deindexes — Track F).

- [x] **E1. Building calculators.** All 12 original countries + Lebanon (USD) + Libya (LYD) = 14 countries total. New `/calculators/building/paint` page (walls → liters + 1L/5L cans, 6 paint types). Paint registered in `CALCULATOR_ROUTES` + building hub.
- [x] **E2. Exam-results cluster.** bac-results-tunisia = 249 clicks @ 0.5%; national-exams-morocco 2.45%. Added `bac-results-algeria` (month 7, ONEC, دورة الاستدراك) and `bac-results-morocco` (month 7, massar.men.gov.ma). Both published with 8 FAQ each, country-specific copy, full keyword integration. 94 events total (+2). Remaining: brevet results, Jordan Tawjihi, Lebanon.
- [ ] **E3. Father's Day / national-day clusters.** fathers-day-tunisia pos 2.54 @ 1.83% proves the format. Libya/Iraq/Palestine national days added ✅ — interlink + extend to remaining countries with real demand.
- [ ] **E4. time-difference programmatic** for high-demand city pairs (Riyadh↔Cairo already 4,673 impr). Add live dual clock (`DualLiveClock.client.jsx`) — competitors lack it.

**Verify:** `npm run validate:holidays` / `seo:validate` green; new pages indexed within 2 weeks (GSC coverage).

---

## TRACK F — Indexing health (do BEFORE more programmatic) 🔥🔥

**Problem:** "Crawled – currently not indexed" swung 291 → 33 (Chart22.csv). Hundreds of thin `/date/YYYY/MM/DD` pages (0 clicks, 100–200 impr) dilute crawl budget.

- [ ] **F1. Enrich or noindex date pages.** Add unique value (what happened, Hijri equiv, events) or `noindex` empty ones — keep only converter + calendar hubs indexed.
- [ ] **F2. Programmatic quality gate.** Every generated page must ship ≥1 unique data block + ≥3 internal links. Add a check to `npm run seo:validate` so thin pages can't ship.
- [x] **F3. Sitemap hygiene.** Holiday sitemap reverted to canonical-only (alias slugs removed). All sitemaps deterministic. CI tests 87–89 pass.

**Verify:** GSC "crawled–not indexed" trends down; `seo:validate` fails on a deliberately thin test page.

---

## TRACK G — Revenue (separate from traffic) 🔥

**Reality:** ~90% of traffic is low-CPM (Tunisia/Morocco/Algeria/Egypt/Syria ≈ 2 MAD RPM). Two levers:

- [ ] **G1. Pages/session** (the only RPM lever that works on Maghreb traffic) — shared with Track D.
- [ ] **G2. Win high-CPM geo we already rank for.** US time-now (atlanta 24K impr, US RPM 20–35 MAD), France (24 MAD RPM, 4,691 impr). Prioritize US/EU/Gulf city CTR (C5) over Maghreb — revenue multiplier, not just traffic.
- [x] **G3. Expand Anchor/Vignette auto-ad coverage.** `AdStickyAnchor` route coverage extended to `/blog/*` and `/mwaqit-al-salat/*` in `route-policy.js`.
- [x] **G4. Activate built-but-unplaced sidebar units** — `BlogArticlePage` wrapped in `AdLayoutWrapper sidebarMode="dual"`. Holiday detail already had dual sidebar. Both categories now active.
- [x] **G5. Second in-article ad on long pages** — already implemented: prayer city, holiday detail, and blog pages all have AdInArticle ×2 with proper spacing. No back-to-back violations.

**Verify:** `npm run ads:readiness -- --base=http://localhost:3000` → 0 errors, H1-before-ad, content-first; RPM/page trending up over 4–6 weeks.

---

## TRACK H — Schema & technical SEO 🔢

Holiday pages already emit rich schema (Event/FAQ/Breadcrumb/Article in `src/lib/holidays-engine.js`). Fill the gaps only:

- [x] **H1. WebSite + SearchAction** — already in `SiteWideSchemas.jsx` (urlTemplate: `/search?q={search_term_string}`).
- [x] **H2. Article/NewsArticle** schema — already in `BlogArticleView.jsx` (headline, datePublished, dateModified, author, publisher).
- [x] **H3. Place/geo schema** — standalone `City` JSON-LD (`@type: City`, `geo: GeoCoordinates`, `containedInPlace: Country`) added to both `/time-now/[country]/[city]` and `/mwaqit-al-salat/[country]/[city]`. Linked via `@id` ref from `WebPage.about`. Switched from raw `<script>` to shared `JsonLd` component.

**Verify:** Rich Results Test passes for one URL of each type; `seo:audit:rendered` green.

---

## TRACK I — Calculator UX overhaul (retention surface) 🔢

Daily-use calculators are the strongest return surface; redesign the shared layer once → ~15 pages improve. Use the **impeccable** skill (load DESIGN.md).

- [ ] **I1. Density tokens** (`--section-gap-desktop/mobile`) — DESIGN.md "comfortable" spacing in `src/app/calculators/calculators.css` + `common.jsx`.
- [x] **I2. RelatedCalculators** ranked-list redesign (shared with D5) — 1 featured row + compact ranked rows with reason chips.
- [ ] **I3. Editorial card balance** (cap 3 text layers, DESIGN.md §9.3); interleave open editorial + framed panels (kill card-wall monotony).
- [ ] **I4. RTL polish** — explicit logical-property positioning for index badges/arrows.
- [x] **I5. Visual charts** — `EndOfServiceChart.client.jsx` (Recharts donut + breakdown bars) ✅; `VatSplitBar` inline in VatCalculator ✅.

**Verify:** dev server at 375px + 1440px on end-of-service-benefits, vat, age — comfortable spacing, one H1, ad slots intact; `seo:audit:rendered` still passes.

---

## 2. Sequencing — milestones

| Milestone | Tracks | Theme |
|---|---|---|
| **M0 (week 0)** | A1–A3, F1–F2 | Measurement on, stop the indexing bleed |
| **M1 (weeks 1–2)** | C1–C5, B4 | CTR rewrites on top-10 pages + prayer titles (fastest ROI) |
| **M2 (weeks 2–4)** | B1–B3, D1–D4 | Prayer rank rescue + internal link mesh |
| **M3 (weeks 4–6)** | E1–E4, G3–G5 | Programmatic expansion + ad density |
| **M4 (weeks 6–8)** | H1–H3, I1–I5 | Schema gaps + calculator UX overhaul |
| **M5 (ongoing)** | A2, G1–G2 | Weekly CTR triage, monitor RUM + RPM, iterate |

Each milestone = one reviewable PR per track. Tracks B/C/E/F/G ship independently of the UX work (I).

---

## 3. Top 10 money pages (impressions × CPM potential)

1. `/time-now/united-states/*` (atlanta 24K, kansas-city 12.9K, boston, philadelphia) — US CPM 20–35 MAD
2. `/time-difference` + Riyadh↔Cairo pairs — 22.9K impr
3. `/holidays/eid-al-adha-in-usa` — US geo
4. `/calculators/building/*` — Gulf traffic, 4–8% CTR
5. `/time-now/france/*`, `/time-now/germany/*` — EU CPM
6. `/mwaqit-al-salat/{gulf capitals}` — once rank-rescued (Track B)
7. `/holidays/islamic-new-year-in-tunisia` — 109K impr volume
8. `/holidays/bac-results-*` — seasonal surge
9. `/time-now/united-arab-emirates/*` — Gulf CPM
10. `/calculators/end-of-service-benefits` — high-intent Gulf

## 4. Top 10 traffic pages (today)

1. holidays/islamic-new-year-in-tunisia — 257 clicks
2. holidays/bac-results-tunisia — 249
3. holidays/hajj-season — 158
4. holidays/ashura-in-morocco — 117
5. calculators/building/jordan — 81
6. holidays/national-exams-morocco — 79
7. calculators/building/oman — 78
8. time-difference — 75
9. holidays/mawlid-in-morocco — 72
10. holidays/world-fathers-day-in-tunisia — 58

---

## 5. Guardrails (hard rules — never violate)

- Never remove existing SEO metadata or ad slots — only extend/improve.
- Keep ads content-first, H1-before-ad, AdSense max-2 in-article, no back-to-back.
- Sidebar/Auto-Ads changes are desktop/route-scoped (no mobile CLS).
- All copy Arabic-first; SEO content server-rendered (Server Components).
- No `force-dynamic` / `new Date()` in sitemaps; always `await params`/`await searchParams`.
- Don't duplicate the already-strong holiday schema — only fill hub/blog/geo gaps.
- Every new programmatic page ships with unique data + ≥3 internal links (Track F gate).

---

## 6. Global verification (run before each PR merges)

```bash
npm run ci:check          # lint + typecheck + test:unit + seo:validate + validate:holidays
npm run build             # includes seo:audit:rendered
npm run ads:readiness -- --base=http://localhost:3000
npm run health:routes     # add --base=https://miqatona.com for live
```

**Outcome metrics (track over 4–6 weeks in GSC + AdSense):** CTR up from 0.33%; clicks up on rewritten pages; impressions up via prayer + programmatic; AdSense RPM/page up; CLS stable/down (RUM); "crawled–not indexed" trending down.
