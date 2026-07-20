# High-Value Tools & Affiliate Opportunity Tracker (forward-only)

## Saudi/Gulf finance sweep, 2026-07-20 — first pass over-rejected Nafaqah; corrected and shipped same day

Owner asked to check for more Saudi/Gulf finance content beyond the credit-card pilot. One research
agent, given the full list of everything already rejected in this doc + `docs/holiday-event-opportunity-
backlog.md` so it wouldn't re-check old ground, tested 2 specific hypotheses plus its own fresh sweep:

- **Nafaqah (نفقة, Islamic spousal/child maintenance) calculator — CORRECTED 2026-07-20, BUILT.** The
  first-pass agent rejected this as "saturated" because "the Ministry of Justice already runs an official
  electronic calculator." Owner pushed back: does the official tool actually compete for the informational
  query, and are the private competitors genuinely strong? A direct SERP + accessibility check found the
  first-pass verdict was too shallow: the MOJ calculator is **embedded inside the authenticated Najiz
  lawsuit-filing flow** (login required, only reachable mid-lawsuit, not indexed for the informational
  query at all — confirmed via WebSearch, no najiz.sa/moj.gov.sa URL appears in the organic SERP for
  "حاسبة النفقة السعودية"). The real organic competitors are law-firm marketing pages (manielaw-sa.com,
  hasbati.com, hd-lawfirm.com.sa, familylawyerjeddah.com) — one has a real interactive calculator (moderate
  depth, lead-gen oriented with a licensed-attorney byline), the rest are pure articles. Built
  `/calculators/nafaqah` same day: real legal sourcing (Personal Status Law Article 55 on when spousal
  maintenance lapses, official published percentage ranges 10-25%/child with a 300 SAR floor and 50%-of-
  income cap), explicit "استرشادي فقط، ليس بديلاً عن حكم المحكمة" disclaimer matching how even the law-firm
  competitors frame their own tools. **Lesson: "an official government tool exists" is not itself a
  disqualifier — check whether that tool is actually PUBLIC and INDEXED for the informational query, or
  gated inside an authenticated transactional flow (like Najiz), before rejecting on that basis alone.**
  This is now the standing first-filter refinement: government-tool-exists checks need an accessibility
  check, not just an existence check.
- **Sakani/Gulf housing-support-subsidy calculator — REJECTED, saturated.** sakani.sa's own official
  portal has both an eligibility checker and a subsidy-amount calculator. khaleejcalculators.com (the
  recurring incumbent, see below) already built a full 8-page housing-support hub with its own embedded
  calculator. No differentiator survives an official tool + a well-resourced private clone both already
  existing.
- **Marriage/Social Development Bank wedding-loan calculator — REJECTED, saturated.** ehsabi.com has a
  live calculator for the interest-free 72,000 SAR marriage loan (قرض الزواج).
- **Wedding budget planner (non-dowry cost planning) — REJECTED, saturated.** More crowded than the
  already-rejected dowry-benchmarking idea: at least 4 dedicated live calculators found (hijri-
  calendars.com ×2, ahsebli.com, ehsabi.com, plus the single-purpose zawajcal.com).
- **Business/company setup cost calculator — REJECTED, saturated.** Monsha'at (the official Saudi SME
  authority) runs its own official government-fees calculator
  (profile.monshaat.gov.sa/user/budget-calculator/governmental-fees) covering CR/publication/municipal
  license fees by city and activity.
- **Freelance work document (وثيقة العمل الحر) cost angle — no gap, nothing to calculate.** The document
  itself is free to issue/renew/cancel as of 2026; khaleejcalculators.com already covers the eligibility
  angle in article form.
- **Debt restructuring / إعادة هيكلة الديون — skip, low confidence.** No calculator-shaped competitor
  found, but also no evidence of calculator-shaped search intent — resolves through bank
  negotiation/SAMA rules, not a formula a user plugs numbers into.
- **Gulf relocation / job-offer cost-of-living comparison (e.g. Riyadh vs. Dubai) — the one live lead, but
  it's the SAME idea already sitting in the Parked section below, not a new discovery.** Real recurring
  search intent, and every competitor found (wazneeni.com, propertyfinder.sa/ae, madaproperties.sa,
  rahhal.wego.com) is a static article, not an interactive tool — genuinely thin on the *format*. But this
  is exactly the already-parked "Gulf/MENA cost-of-living city comparison" candidate, and the reason it's
  parked (heavy ongoing per-city cost-basket data-maintenance burden — rent/groceries/transport/utilities
  across a dozen+ cities, worse upkeep than any other calculator on the site) is unchanged. Don't build
  without first resolving that maintenance question, same as before.

**Bottom line for this pass, revised after the Nafaqah correction: most of the tier is tapped out, but
don't stop at "official tool exists."** Sakani, the marriage loan, wedding budget, and business-setup
ideas all failed for real — the official/private tools there are genuinely public, indexed, and already
strong. Nafaqah looked identical on the surface but wasn't — the "official tool" was login-gated and
never actually competed in the SERP. **Standing rule going forward: before rejecting a candidate because
"an official government tool exists," verify the tool is publicly reachable and actually ranks for the
informational query (not just that it exists somewhere on a .gov.sa domain) — an authenticated,
transaction-embedded tool doesn't count as competition.** Re-checked Sakani specifically with this lens
(2026-07-20): sakani.sa/calculator's own snippet describes users entering income/family-size directly, no
login mentioned, AND a private competitor (ehsibha.sa) already ranks #1 above the official tool — so
Sakani's official tool really is public and already-beaten-in-ranking by private sites, meaning the space
is genuinely contested (multiple real competitors), not a login-gated non-issue like Nafaqah. Marriage-loan
and business-setup were not re-checked with this specific accessibility lens this pass — their rejections
still stand on the "already a live, working competitor exists" evidence, but haven't been double-checked
for a Nafaqah-style false negative. Don't re-run a broad "any more Saudi/Gulf finance ideas?" sweep again
without either (a) a specific new hypothesis not covered by this list, or (b) GSC data suggesting real
demand for something already parked.

---

## New vertical, 2026-07-20: credit-card / personal-finance editorial content — pilot shipped

Owner asked for a US-style credit-card comparison vertical (best travel card, cashback vs travel,
business cards, 0% APR, student/secured cards, international travel cards — modeled on
NerdWallet/Bankrate). Full plan in this session's approved plan file; condensed here for the tracker.

**The 2026-07-17 rejection of "Gulf credit-card comparison" (below, in the Track B table) was shallow —
a snippet-level check, not deep-scraped like mortgage/Hajj got.** Three research agents did a real
second pass this session. Verdict, materially updated but not overturned:

- **Real, still-thin content gaps confirmed**: named head-to-head card comparisons (only one competitor,
  saudi-tips.com, does this format at all), 0%-APR/installment comparison (only individual bank pages
  exist), neutral international-travel-card guides (the one "competitor" found, rezbook.co, embarrassingly
  recommends US-only cards — Chase Sapphire, Amex Gold — to Arabic readers).
- **Dead ends, confirmed not just assumed**: student cards and secured/credit-building cards are US
  import concepts with no native Gulf search behavior — Gulf banks don't issue either as a distinct
  product category. Groceries/fuel cashback comparison is already covered by real Arabic finance bloggers
  (nawyinvesting.com, goldenafkar.com) that the shallow check missed. Travel-vs-cashback decision content
  also already has a strong competitor (myqarar.com, moazashraf.com) — beatable but not a quick win.
- **Monetization hits the exact same wall as Tameeni/Najm insurance below**: no Gulf bank has a confirmed
  self-serve affiliate/CPA program for independent publishers (Mashreq is the only one with any
  publisher-facing infrastructure and it's paused; Admitad's "UAE credit cards" turned out to be Indian
  bank cards, not Gulf ones). yallacompare/souqalmal both show signs of running on regulatory licensing
  or VC-negotiated deals, not something a blog can self-serve join. **AdSense itself classifies credit
  cards/loans as "restricted financial products"** — display RPM here is structurally capped below the
  raw CPC data, the opposite of what "high RPM" usually means for a new vertical.
- **The one genuinely open angle**: Sharia-compliant ("Islamic") card comparison, done with real fatwa
  sourcing. Existing Arabic Islamic-card content (khaleejcalculators.com's Qatar guide, Giraffy's Saudi
  guide) makes generic "Sharia board approved" claims with no named scholarly sourcing — exactly the kind
  of thin sourcing this site has repeatedly out-executed competitors on elsewhere. It also sidesteps the
  riba/interest tension entirely instead of requiring a content-policy call about promoting conventional
  interest products, given this site's established conservative Islamic-content posture (see standing
  rules in `docs/holiday-event-opportunity-backlog.md`).

**Shipped 2026-07-20 (pilot, no affiliate dependency)**: `/blog/best-islamic-credit-cards-saudi` —
head-to-head comparison of 4 real Saudi Islamic credit cards (Al Rajhi Signature, Alinma Signature, Al
Ahli/SNB Cashback Premium, Bank Albilad Infinite), every fee/profit-rate/rewards figure sourced from the
bank's own live page (no figure invented), fatwa-sourced FAQ (islamweb.net, binbaz.org.sa) explaining the
Murabaha/Tawarruq mechanism and the conditional Sunni ruling on card use. New file
`src/lib/guides/finance-guides.js`, wired into `src/lib/guides/data.js` exactly like
`PREGNANCY_GUIDES`/`HAJJ_GUIDES`. **Different from those two**: no `draft: true` gating — this ships live
under ordinary AdSense immediately, since it has no affiliate link to wait for (if a bank
partnership/sponsorship ever materializes later, a CTA can be added via the existing
`getAffiliateLink()` empty-gated pattern as a follow-up, not a blocker).

**Real bug hit and fixed during verification, unrelated to the content itself**: a completely unrelated,
pre-existing guide (`how-many-cement-bags-do-i-need`) also 404'd on first load — proved this was the
project's recurring stale-Turbopack-cache issue (documented in multiple prior memory entries), not
something the new guide caused. Fixed with the standard `.next` wipe + clean restart; both the new and
pre-existing guide routes returned 200 afterward.

**Not built, explicitly deprioritized**: the fuller 3-guide backlog (0%-APR/installment with the Islamic
fiqh framing, international-travel-card guide, business-card guide) — held pending real GSC traffic
signal on this pilot, same evidence-gated discipline as the rest of this tracker. "AI coding tools" as a
content idea was checked (WebSearch) and dropped outright — saturated by both Arabic SEO farms and
machine-translated English content, and zero brand/audience fit with this site's Islamic/MENA identity.

**Owner action (parallel, not blocking)**: re-check whether Mashreq's DCMnetwork/affi.io campaign
reactivates, or contact Mashreq's partnerships team directly — the only bank found with any
publisher-facing affiliate infrastructure at all. If the pilot gets real traffic, that's real leverage for
a direct outreach email to a bank's marketing team, cited with actual numbers instead of a cold pitch.

---

## New vertical, 2026-07-17: content-commerce guides (not the "عروض" hub as originally framed)

Owner asked for a new "عروض" (offers) hub with categories (flights, study-abroad, etc.), but explicitly
said to look for better ideas if that framing doesn't hold up, and separately described a second concept:
full editorial buying-guide content (not raw affiliate links) for life moments like pregnancy — "provide
the best things to buy... best websites... global alternatives like Amazon."

**Research verdict on the original "عروض" framing — both angles rejected:**
- **Flight deals / best time to book flights**: extremely crowded — Skyscanner, Trip.com, Almosafer,
  flightarabia.com, tripyana.com, almatar.com, and even Bayut's own blog already publish this exact
  content. Big-budget travel OTAs own this SERP. **Rejected.**
- **Study-abroad / scholarship (ابتعاث) guides**: moderately crowded (masarat-abroad.com,
  ep-studyabroad.com, studyinegypt.ae, official ministry pages) and this site has zero existing
  traffic/content in the space to ride. **Deprioritized** — not rejected outright, but not worth building
  before higher-confidence ideas.

**What replaced it — content-commerce buying guides, Wirecutter-style, tied to existing traffic:**
Researched the Wirecutter/BuzzFeed model directly: editorial and commercial teams are kept separate,
only 1-2 best picks per category (not exhaustive lists), transparent disclosure. Applied the same
"real gap + existing traffic + confirmed affiliate + low maintenance" bar as the affiliate tracker above.

Checked two candidates against named Arabic competitors:
- **Pregnancy/newborn buying guide**: existing Arabic content (Mumzworld's own blog, omooma.com, several
  baby-store blogs like dehkah.com/b-trendstore.com/bamobaby.com) is either a general parenting platform
  or store-blog SEO filler pushing their own catalog — **no neutral, trustworthy, Wirecutter-style buying
  guide exists**. This site already has real traffic on pregnancy/pregnancy-weeks/ovulation calculators to
  ride. **Confirmed as a real format gap — BUILT** (see below).
- **Hajj/Umrah gear/packing guide**: same pattern — daralamirat.com.sa (store blog), al-ain.com/youm7.com
  (news listicles), islamonline.net (religious/informational, not shopping-focused). No neutral buying
  guide format here either. Ties to the site's own highest-value audience cluster (Hajj-season planners,
  per the 2026-07-16 sponsorship one-pager). **BUILT** (2026-07-17), hidden pending links — see below.

### Shipped: `newborn-essentials-guide` (2026-07-17), hidden pending links

`/blog/newborn-essentials-guide` — a full buying guide organized by 6 priority categories (car seat, safe
sleep, stroller, feeding, diaper bag, basic care), each with genuine "why it matters" + "what to actually
look for" editorial advice (cites AAP car-seat and safe-sleep guidelines) that's valuable to read even
with zero active affiliate links, plus gated "shop from X" buttons per store. Built as a new guide-content
vertical: `src/lib/guides/pregnancy-guides.js` (new file, wired into `src/lib/guides/data.js`'s
`RAW_ALL_GUIDES`), a new `productPicks` field + `GuideProductPicks` render component in
`src/components/blog/BlogArticleView.jsx` (mirrors the existing `GuideSources` pattern), and 2 new keys
(`mumzworld`, `amazon_ae`) in `src/lib/affiliate-config.js`.

**Draft mechanism for blog guides (different from the calculator `draft:true` pattern)**: since guides all
share one dynamic route (`/blog/[slug]`), hiding one doesn't need per-route sitemap registration like the
calculator/embed cases did — `ALL_GUIDES` itself now filters `!guide.draft` in `data.js`, so a draft guide
is fully absent from the hub, sitemap, related-guides, AND direct navigation (404s) all at once, with one
line. To preview locally: temporarily flip `draft: true` → `false` in the guide's own file, test, then
revert — same pattern already used for the remittance-callout and the two new affiliate-config test runs
this session.

**Real bug found and fixed while verifying**: hit the exact PPR "current time" violation
(`new Date()` used before any uncached-data access) that's now recurred a few times this project —
traced it all the way to `src/lib/logger.js:58` (`timestamp: new Date().toISOString()`), which only
fires when `logger.warn()` is called, which only happens when a guide's `contentHealth.degraded` is
true (`src/lib/guides/page-model.js`'s issue tracker). Root cause was MY content, not the logger: a
`comparison` table declared 2 columns but each row only had 1 value —
`normalizeComparisonRow` requires `row.values.length === columns.length` exactly, silently drops any row
that doesn't match, which flipped `contentHealth.degraded` to true and triggered the dormant logger bug
for the first time on this route. Fixed by matching column count to actual row-value count (this guide's
"why" column is single-value, so 1 column, not 2). **Lesson: `page-model.js`'s comparison/faq/section/
sourceLink normalizers silently DROP malformed entries rather than throwing — always spot-check
`contentHealth.degraded` (or just watch for console errors while previewing) on any new guide, since a
silently-dropped row is easy to miss versus a hard error.** The underlying logger.js bug (bare `new
Date()` with no prior cache boundary) is still latent in the codebase — it just isn't triggered by
correctly-shaped content. Not fixed at the source this pass (would need touching shared logging
infrastructure used everywhere); worth a dedicated look if it resurfaces.

**Still blocked on**: real Mumzworld and Amazon.ae/sa affiliate links — see
`docs/affiliate-links-to-fill.md`. Amazon Associates confirmed real and self-serve (affiliate-program.
amazon.sa / amazon.ae, 1-10% commission by category, requires a local bank account for KSA/UAE payouts).
Mumzworld likely reachable via the already-confirmed ArabClicks network (mentioned as an ArabClicks
merchant in earlier research) — needs the owner to check the actual ArabClicks offer list for it.

### Shipped: `hajj-umrah-packing-guide` (2026-07-17), hidden pending links

`/blog/hajj-umrah-packing-guide` — same Wirecutter-style format as the pregnancy guide, 6 categories
(ihram clothing, ihram-compliant footwear, crossbody pouch, power bank, water bottle + sunscreen, first-aid
kit), each with real "why it matters" reasoning tied to either Ihram fiqh rules (cites islamweb.net) or the
genuine physical demands of Hajj/Umrah (long walking distances, heat exposure) — cites haj.gov.sa and
islamweb.net per the site's Islamic-sourcing standard (mainstream Sunni sources only). New file:
`src/lib/guides/hajj-guides.js`, wired into `src/lib/guides/data.js`'s `RAW_ALL_GUIDES`. Amazon-only store
options (no Mumzworld fit for this vertical) — France tag buttons work today, `.sa`/`.ae` buttons appear
automatically once those tags are filled in. Same `draft: true` hide mechanism as the pregnancy guide.
Lint + `tsc --noEmit` clean.

**Still blocked on**: Amazon.sa/.ae Associate tags (same blocker as the pregnancy guide) — see
`docs/affiliate-links-to-fill.md`.

---

Created 2026-07-17. Rules for this doc, per owner instruction:

1. **Nothing built under this tracker goes live to end users until the owner has signed up to the
   relevant affiliate program and handed back the real affiliate link.** Any page built ahead of that
   stays in draft/unpublished state.
2. Every candidate needs a real, evidence-based content gap — not "this seems high-value." Checked
   against named incumbent competitors before being marked buildable.
3. A candidate with no realistic organic-traffic path is not worth building even with a real gap and a
   real affiliate program — an affiliate link nobody sees converts nothing. Traffic potential is a
   first-class column, not an afterthought.
4. Affiliate programs are one option, not the goal — direct sponsorship (see the sponsorship one-pager,
   2026-07-16) and continued organic-ads growth are equally live tracks.
5. When an item ships, move it to "Shipped" with the outcome; don't delete history from this doc.

---

## Infrastructure: how "built but hidden" actually works (added 2026-07-17)

Any new calculator/tool built under this tracker uses a `draft: true` field on its `CALCULATOR_ROUTES`
entry in `src/lib/calculators/data.js`. This is now wired to be excluded from every discovery surface:

- **Sitemap**: simply never add the route to `src/lib/seo/calculator-route-manifest.js` — the sitemap
  only reads from that file, so omission is enough.
- **`RelatedCalculators`** (`src/components/calculators/common.jsx`): `clusterRoutes`, `complementRoutes`,
  `fallbackRoutes` all filter out `item.draft`.
- **`/calculators` hub page**: the visible grid is driven by `CALCULATOR_HUBS.routeSlugs`, not by
  iterating all routes — a draft tool is already invisible there as long as its slug isn't added to any
  hub's `routeSlugs`. Its keywords and `ItemList` JSON-LD schema are additionally filtered by `!item.draft`
  as a second layer.
- **`/fahras` and `/search` discovery** (`src/lib/site/discovery.js`): `BASE_CALCULATOR_TOOL_ITEMS` filters
  `!route.draft`.
- **The page itself**: set `metadata.robots = { index: false, follow: false }` (same pattern as the
  `/embed/*` widget), and register it in `INTENTIONALLY_NON_INDEXABLE_PAGE_ROUTES` in
  `scripts/validate-seo-architecture.ts` (a `Map<route, exact file path>`) or `seo:validate` blocks the
  build with "Page route has no sitemap/indexability decision."
- **Nav/footer**: these are hand-curated arrays already, not auto-generated from `CALCULATOR_ROUTES` — just
  don't add the draft tool to them.

To publish: remove `draft: true`, add the route to the right hub's `routeSlugs`, add it to
`calculator-route-manifest.js`, flip `robots.index` to `true`. Only do this once the relevant link(s) in
`docs/affiliate-links-to-fill.md` are filled in.

---

## Recurring incumbents found this pass (check against these before proposing anything new)

Three Arabic calculator sites keep appearing across completely different verticals (mortgage, Hajj/Umrah
cost) — they look like the main established players in "Arabic financial/religious calculator" content
generally, not just one niche:

- **khaleejcalculators.com** — Gulf mortgage comparison (24 banks), Hajj cost from UAE, broad Gulf finance
  calculator catalog.
- **ehsabi.com** — mortgage affordability (Saudi), Umrah cost calculator, general calculator directory.
- **hijri-calendars.com** — Hajj/Umrah financial planning guide, mortgage affordability calculator.

Any new candidate touching Gulf mortgage/real-estate or Hajj/Umrah cost needs a genuine differentiation
angle against these three specifically, not just "no gap found" — a shallow web search alone won't
surface them if not searched by name.

**Deep-scrape update, 2026-07-17 — these three are NOT thin, and khaleejcalculators.com is bigger than
first assessed.** Fetched the actual pages, not just search snippets:

- **ehsabi.com's mortgage-affordability and Umrah-cost calculators are both genuinely well-built**: 5-6
  real inputs (including a season multiplier on the Umrah tool), worked examples across multiple income/
  traveler profiles, honest "calculator limitations" sections, a client-side-privacy note. Beating either
  head-on would NOT be a low-medium-competition win — these are mature, invested tools, not templates.
- **khaleejcalculators.com covers 40+ calculators** (mortgage across 24 banks/6 countries, EOS all 6 GCC
  countries, GOSI, VAT, Zakat, cost-of-living, gamified financial-literacy quizzes/challenges) **and has
  already started publishing remittance-sending guides** (`/blog/how-to-send-money-from-kuwait-2026`) —
  found while checking a completely different candidate idea (see below). This site is an aggressive,
  actively-expanding operation across nearly every Gulf-finance vertical, not a narrow competitor.
- **hijri-calendars.com is broader still** — Hajj/Umrah/Qurbani/Islamic-inheritance/Fidya-Kaffarah
  calculators, PLUS an entire government-services-guide category (Absher/ZATCA/GOSI/Qiwa/Sakani/Najiz),
  PLUS health/education/lifestyle calculators (wedding budget, moving cost, habit tracker).

**Two more candidates checked and rejected this pass, for the same reason:**
- **Gulf credit-card cashback/rewards comparison** — crowded: yallacompare.com (dedicated UAE comparison
  site), bonokey.com, top5ksa.com, ar4r.com, sarkosa.com, moazashraf.com, and SAMA's own official
  comparison tool all already exist. Not low-medium competition. **Rejected.**
- **Remittance-fee comparison (Gulf → home country)** — khaleejcalculators.com already publishes guides
  here (see above); real bank/exchange-house fee data is fragmented across dozens of PDFs and bank pages,
  not cleanly comparable without a lot of manual upkeep. **Rejected as a standalone comparison tool** — but
  see the Track A extension idea below, which reframes the same vertical as an add-on to pages we already
  own instead of a new page competing from zero.

**Honest conclusion**: generic "Gulf financial calculator" as a category is largely saturated by capable,
actively-expanding incumbents. Don't keep proposing more of these — the pattern above (khaleejcalculators
showing up in mortgage AND Hajj AND remittances) means almost any obvious Gulf-finance idea needs to be
checked against these three names specifically before being called a gap.

---

## Track A — Monetize pages that ALREADY exist and ALREADY have real traffic (fastest, lowest-risk)

These calculator pages are live today, already indexed, already receiving real (if currently small)
organic clicks per the owner's own 28-day GSC export (2026-07-16). Adding an affiliate link to an
existing page with proven traffic is a fundamentally safer bet than building something new and hoping
for traffic — no new content risk, no new SEO ramp-up needed.

| Page(s) | Vertical | Real 28d traffic (GSC) | Affiliate fit found | Status |
|---|---|---|---|---|
| `/calculators/car-insurance-{saudi,kuwait,uae,bahrain,qatar}` | Car insurance comparison | car-insurance-saudi: 4 clicks/113 impr; car-insurance-kuwait: 4/66; car-insurance-bahrain: 2/56; car-insurance-uae/qatar: low but present | Tameeni/Najm-style aggregators reportedly pay CPA SAR 50–200/qualified lead (per public commentary) — **no confirmed public self-serve affiliate signup found for Tameeni or Najm directly**; would need direct outreach, not a network signup | **Researching** — need owner to check if Tameeni/Najm (or a similar KSA/Gulf insurance aggregator) has a real partner program before counting on this |
| `/calculators/health-insurance-{uae,saudi,oman,kuwait,bahrain}` | Health insurance comparison | health-insurance-uae: 7/179; others lower but present | Same as above — insurance-lead CPA model, needs direct-contact verification | **Researching** |
| `/calculators/personal-loan-{bahrain,kuwait,oman}` | Personal loan comparison | personal-loan-bahrain: 11/249; personal-loan-kuwait: 6/228; personal-loan-oman: 3/306 | ArabClicks (5–20% commission, single-tier) lists general finance/retail advertisers — need to check their offer list specifically for MENA lending brands | **Researching** |
| `/calculators/mortgage-{kuwait,uae,qatar,bahrain}` | Mortgage/home finance | mortgage-kuwait: 2/138; mortgage-uae: 2/47; mortgage-qatar: 1/55; mortgage-bahrain: 1/37 | Same lending-affiliate question as personal loans; also the space where khaleejcalculators.com is the strongest incumbent — differentiation, not just monetization, may be needed here eventually | **Researching** |
| `/calculators/eos-{egypt,jordan,bahrain,kuwait,qatar}`, `uae-end-of-service`, `end-of-service-benefits`, `gosi-retirement` | End-of-service lump-sum / retirement | eos-egypt: 22/700; eos-jordan: 17/372; eos-bahrain: 10/251; eos-kuwait: 6/147; eos-qatar: 2/113 | Investment/savings apps (where do people put a lump-sum EOS payout?) — not yet researched by name, this is the least-explored fit in Track A | **Not yet researched** |

**Owner action needed before ANY of Track A goes further:** confirm real affiliate/partner programs exist
for at least one of {Tameeni, Najm, a named Gulf lending platform} by contacting them directly — public
search did not turn up a self-serve signup page for the insurance aggregators specifically, unlike
ArabClicks/Admitad which are self-serve today.

---

## Track A extension — the one new-build idea worth considering (2026-07-17, awaiting owner go-ahead)

**"After your salary lands, here's the cheapest way to send money home"** — a small addition to the
already-live, already-ranking `salary-day-*` event cluster (40+ pages, Gulf countries), not a new
standalone page competing from zero. The insight: this site already owns the "متى ينزل راتبك" search
intent for Gulf expats — the single highest-traffic content family it has built across 12 waves. The very
next thing a lot of those readers do after payday is send money home. No competitor combines a live
payday countdown with a "send money now" prompt — khaleejcalculators.com's remittance content is a static
blog post, not tied to any payday-countdown mechanic, because they don't have one.

- **Why this sidesteps the "everything is taken" problem**: it doesn't need to rank a new page from zero
  — it rides traffic the site already has. The bar isn't "beat khaleejcalculators.com on a fresh SERP,"
  it's "add one relevant, honest section to a page that already gets clicks."
- **Maintenance**: near-zero once built — a short evergreen note + affiliate link, not a live fee-comparison
  table that goes stale (the "reject remittance-comparison-tool" decision above was specifically about
  avoiding that maintenance burden).
- **Status: BUILT, live in code, hidden until a link exists (2026-07-17).** Owner confirmed to proceed.
  Shipped as a small callout section on the 8 `salary-day-*` holiday event pages (bahrain, egypt, jordan,
  kuwait, oman, qatar, saudi, uae) — `RemittanceCallout` in
  `src/app/holidays/[slug]/HolidayDetailsSections.jsx`, gated on `slug.startsWith('salary-day-')` AND a
  non-empty link from `src/lib/affiliate-config.js` (`getAffiliateLink('remittance')`). With the link
  empty (its current, committed state), the section renders nothing — verified via curl on both a
  salary-day page (hidden) and confirmed it also stays hidden on unrelated pages regardless of link state.
  Verified rendering correctly with a temporary test link via Puppeteer screenshot, then reverted to
  empty before this was left in this state. `ci:check` green throughout.
- **Still blocked on**: a real, confirmed remittance affiliate/partner link (see
  `docs/affiliate-links-to-fill.md`) — none confirmed yet, Wise/Remitly/a named Gulf exchange house all
  need direct verification by the owner. **To activate: paste the real link into the `remittance` key in
  `src/lib/affiliate-config.js` — nothing else needs to change.**

---

## Track B — Genuinely new tools (need a real gap AND a real traffic path before building anything)

| Candidate | Gap check result | Verdict |
|---|---|---|
| Hajj/Umrah package price comparison tool | **Not a gap** — ehsabi.com, hijri-calendars.com, and khaleejcalculators.com all already run Hajj/Umrah cost calculators/comparisons in Arabic | **Rejected as-is.** Only a live-countdown + cost-calculator combination (something none of the 3 incumbents do, since they're calculator-only sites without this site's countdown/traffic engine) would be a real differentiator — not researched further this pass, flagged for a future session if pursued |
| Gulf mortgage/DBR affordability calculator | **Not a gap** — same 3 incumbents plus own.sa, investing.com Arabic, ehsabi.com all cover this already | **Rejected.** The site already has `mortgage-{kuwait,uae,qatar,bahrain}` calculators live (see Track A) — the honest move is deepening/monetizing those, not building a 4th competitor to an already-crowded space |
| Real estate affordability (Bayut/Property Finder style) | Bayut itself has no confirmed public affiliate program (only third-party lead-gen sites claim referral deals, e.g. insidedubaiestate.com's "$1,000+ per referral" — unverified, not an official Bayut program) | **Parked** — no confirmed legitimate affiliate program to build toward; don't invent a "gap" tool with no real payout path behind it |
| Travel/flight/hotel booking (Almosafer, Wego) | Both have real, confirmed, working affiliate programs (Wego: 3% of booking + 30-day cookie; Almosafer: commission per completed booking via DCMnetwork) — but this site has **zero existing travel-booking content or traffic** to build from | **Parked, not rejected** — the affiliate program is real, but there's no existing gap-check done yet and no existing traffic base like Track A has; would be a from-scratch bet, lowest priority until Track A is exhausted |
| Gulf credit-card cashback/rewards comparison | **Not a gap** — yallacompare.com (dedicated UAE comparison site), bonokey.com, top5ksa.com, ar4r.com, sarkosa.com, moazashraf.com, plus SAMA's own official government comparison tool all already exist | **Rejected** — crowded with both commercial and official-government competitors |
| Standalone remittance-fee comparison tool | khaleejcalculators.com already publishes remittance-sending guides; real fee data is fragmented across many bank/exchange-house PDFs, would need frequent manual upkeep to stay accurate | **Rejected as a standalone tool** — reframed as a Track A extension instead (see below), riding existing salary-day-* traffic rather than competing fresh |

---

## What's confirmed usable right now (self-serve, no outreach needed)

- **ArabClicks** — self-serve signup today, GCC-wide (UAE/Saudi/Kuwait/Bahrain/Oman), 5–20% commission,
  single-tier, $100 minimum payout, merchants include Noon, Namshi, 6thStreet, GroupOn, Mumzworld, Faces,
  Sivvi, Sprii. Broad retail/fashion, not finance-specific — best fit is generic, not tied to a specific
  gap yet.
- **Admitad (Noon UAE/Saudi/Egypt)** — 10% + up to 50 AED/SAR for new customers, 5% for repeat
  (cashback-style), works via offline promo codes specifically (not standard tracked links) — a real but
  structurally different integration than a normal affiliate link.
- **Wego affiliate program** — self-serve, 3% of hotel booking value, 30-day cookie, real and confirmed —
  relevant only if Track B's travel angle is ever pursued.

**Recommended next owner action:** sign up to ArabClicks first (broadest, most flexible, zero
gatekeeping) since it doesn't require picking a single vertical winner yet, then decide whether to chase
the insurance/lending CPA angle (needs direct contact, higher payout ceiling) in parallel.

---

## Status legend

`Not yet researched` → `Researching` → `Gap confirmed` → `Awaiting affiliate signup` → `Awaiting link
from owner` → `Building (draft, unpublished)` → `Ready to publish` → `Shipped`.

Nothing in this doc has reached "Building" yet — that's deliberate; per the owner's process, integration
work only starts once a real affiliate link exists.
