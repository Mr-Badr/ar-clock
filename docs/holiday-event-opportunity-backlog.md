# Revenue Playbook & Opportunity Backlog — miqatona.com

Updated: 2026-07-07 (Wave 7 diaspora research + Wave 8 volume plays + religious recurring + creative
feature audit — owner requested more aggressive pipeline toward $100–300 next month) · Built from the
granular AdSense reports (unit/country/platform/format) + GSC + GA4 + live SERP research

---

# PART 0 — THE 30-DAY SPRINT (2026-07-06 → 2026-08-06): what actually gets executed

Everything below Part 0 is the standing playbook. This part is the ordered to-do list for the next
30 days, built from tonight's research pass. Rule: nothing new enters this list until it's empty.

**Honest math up front:** $300/month = 10 MAD/day = `pv/day × RPM ÷ 1000`. Today: ~80 pv/day × 2.4
RPM = 0.2 MAD/day. The sprint attacks both factors at once.

**Everything in this sprint is FORWARD search demand** — what people will type in the next weeks
and months, ranked by recurrence (things searched every month/day beat one-offs):

| Demand type | What fires | When it fires |
|---|---|---|
| 🔁 Every month, forever | 34+ live payday/benefit pages, Week-1 sprint builds complete | Spikes ~20th → 1st of EVERY month — the closest thing to daily-searched money queries |
| 🔁 Daily, all year | "كم باقي على رمضان" — Ramadan 1449 ≈ Feb 2027; our `ramadan` page is `type: hijri` so it ALREADY counts down to 1449. Same for eid-al-fitr/adha, mawlid, islamic-new-year (all auto-rolled) | Every day from now to Feb 2027 — 7-month runway |
| 📈 Building for weeks | Mawlid (Aug 25) — pool historically inflates 5–10× pre-date · Saudi school calendar 1448 (starts Aug 23) · school-start cluster (12 countries, Sept) · Saudi National Day (Sep 23) | Ramp starts late July, peaks Aug–Sep |
| ⚡ One-shot spikes (still ahead of us) | Algeria BAC results **Jul 20** (not passed — Kuwait/Morocco/Tunisia are the ones already done) · Egypt Thanaweya results ~Jul 28–Aug 2 · Jordan Tawjihi ~early Aug | This month, on pages that already exist — readiness cost ≈ 1 hour each |

## Week 1 (Jul 6–13) — deploy, toggles, wave-readiness, 2 cheap builds

| # | Action | Owner | Deadline | Why |
|---|---|---|---|---|
| 1 | **AdSense dashboard toggles (Part 2b).** Anchor incl. wider screens · Vignette both platforms · **Side rails ON** (the desktop fix) · in-page ≈ medium. Screenshot the toggles after. | **USER — 10 minutes** | Jul 7 | Biggest single RPM lever left; 86% of revenue is Auto ads and the top formats are OFF |

**Week-1 result checkpoint (Jul 13):** deploy done · toggle screenshot still pending (the one remaining
user action, item #1) · Algeria + Egypt results pages refreshed and reindex-requested (both done
2026-07-06) · 4 new events live with `ci:check` green · AdSense daily revenue vs 0.2 MAD baseline
(expect first movement from toggles within 3–5 days of the user completing item #1).

## Week 2 (Jul 13–20) — REPURPOSED 2026-07-07: Wave 7 diaspora builds (owner-approved queue jump)

Original Week-2 items all shipped early on 2026-07-06. Owner directed (2026-07-07) that the diaspora
high-RPM engine enters the sprint immediately — indexing lead time is the binding constraint for
"money next month", so these build NOW:

| # | Action | Deadline |
|---|---|---|
| W2-1 | **`caf-payment-france`** (W7-1) — full research-first build, caf.fr primary source | Jul 12 |
| W2-2 | **`kindergeld-germany`** (W7-2) — Endziffer lookup table + countdown, arbeitsagentur.de source | Jul 15 |
| W2-3 | **`buergergeld-germany`** (W7-3) | Jul 20 |
| W2-4 | **`winter-time-france`** (W7-4) — the time-now.me competitor threat makes this urgent for brand defense too | Jul 25 |
| W2-5 | GSC: request indexing for all four the day each ships; add hreflang/interlinks to /time-now/france + /time-now/germany + Paris/Berlin prayer pages | rolling |

## Weeks 3–4 (Jul 20–Aug 6) — wave harvest + Mawlid + measurement

| # | Action | When |
|---|---|---|
| 8 | **Jul 20, morning**: Algeria results day — check the page is #index'd and serving; same-day tweak of answerSummary to "النتائج ظهرت — رابط الاستعلام المباشر" mode if needed. | Jul 20 |
| 9 | **AdSense exports (Part 2d)** after 7–10 days on toggles + deployed code — verify anchor/side-rail revenue shift, desktop off 0.08 MAD. | Jul 17–20 |
| 10 | **Egypt results day** (watch news ~Jul 28+): same same-day treatment as Algeria. | late Jul |
| 11 | **Mawlid position check** (pool historically inflates 5–10× in the 2–3 pre-weeks; page already optimized). School-start cluster (12 pages) freshness pass before Aug 23. `bac-results-jordan` (Tawjihi results ~early-mid Aug) readiness. | Aug 1–6 |
| 12 | **Sprint retro vs the equation**: pv/day and RPM vs Jul 6 baseline; decide next sprint from data, not vibes. | Aug 6 |

## Wave 6 — countdown gap-fill (what English countdown sites run that Arabic SERPs don't serve)

Researched 2026-07-06 by mapping the English "how many days until X" staples (Christmas, Halloween,
Black Friday, Super Bowl, World Cup, seasons, paydays, school…) against our 133 events. We already
cover the holiday/season/payday staples. The REAL gaps are sports, entertainment seasons, shopping
events, and clock changes — all forward demand, several in high-RPM countries. Build order by
(RPM × volume × indexing lead time); each still goes through full research-first at build:

| # | Event | Date (verified 2026-07-06) | Build by | Why it wins |
|---|---|---|---|---|
| W6-1 | **`riyadh-season`** (موسم الرياض) — countdown to opening, `type: estimated` October | Opens ~Oct 2026 (2025 edition opened Oct 10; official date lands ~Sep) | Jul 25 | "متى يبدأ موسم الرياض 2026" SERP = thin blogs/forums, NO countdown page. Saudi RPM 9. Searches ramp Jul→Oct. Runs to Mar 2027 = 6-month tail |
| W6-2 | **`asian-cup-2027`** (كأس آسيا 2027 السعودية) | **Jan 7 – Feb 5, 2027**, Riyadh/Jeddah/Alkhobar — official AFC announcement | Aug 1 | Saudi hosts. 6-month countdown runway, huge Dec–Jan spike. News sites (kooora/goal) serve match news, nobody serves "كم باقي على كأس آسيا" countdown intent |
| W6-3 | **`dst-abolition-morocco`** (إلغاء الساعة الإضافية بالمغرب) | Announced ~late Jun 2026: Morocco returns permanently to GMT **after summer 2026** — exact changeover date TBD at build (verify via official سلطة حكومية source, not press) | Jul 31 | Morocco = 24% of our traffic; announcement is 2 weeks old and search interest is LIVE now. A time-utilities site is the most credible answer on the SERP. Cross-links to /time-now/morocco |
| W6-4 | **`winter-time-egypt`** (التوقيت الشتوي في مصر) — `type: floating`, last Friday of October (≈Oct 30, 2026) | Twice-a-year national clock change; spring counterpart (`summer-time-egypt`, last Thu/Fri of April) built later | Sep 1 | Every phone in Egypt asks this twice a year; news articles expire, a permanent countdown page doesn't. Brand-perfect for miqatona |
| W6-5 | **`white-friday`** (الجمعة البيضاء) — Gulf/MENA's Black Friday, `type: floating` Nov (≈Nov 27, 2026) | Nov shopping season | Sep 15 | `black-friday-usa` covers ONLY the US event ("الجمعة السوداء في أمريكا") — zero White Friday coverage. November shopping queries carry the year's highest CPCs, Gulf-wide audience |
| W6-6 | **`world-cup-2030`** (كأس العالم 2030 — المغرب/إسبانيا/البرتغال) | Jun–Jul 2030, Morocco co-hosts | Aug (any slow week) | Evergreen 4-year countdown, searched daily at low volume forever, near-zero competition today; Morocco audience = our base. Build once, earns quietly for years |

**Consciously SKIPPED from the English staple list** (wrong audience or dead ends): Super Bowl ·
Easter (western) · July 4 · Thanksgiving variants beyond what exists · Olympics LA 2028 (park until
2027) · tax day · "days until Friday/weekend" (engine has no weekly type; revisit only if trivial) ·
FIFA Arab Cup (next edition 2029, not 2026 — verified) · خليجي 27 Gulf Cup (date unconfirmed — park
until officially scheduled) · دوري روشن season start (candidate, needs volume check vs kooora
dominance) · عيد الميلاد المجيد مصر Jan 7 (cheap add, Egypt RPM — build in a slow December week).

## Wave 7 STATUS UPDATE (2026-07-07, same day): W7-1, W7-2, W7-4 SHIPPED

`caf-payment-france`, `kindergeld-germany`, and `winter-time-france` are live (published,
`ci:check` green, full research-first rigor: 9-11 competitors each, 8+ coverageMatrix rows, 8
keywordGaps, 6 unansweredQuestions, 5-6 differentiationIdeas, 3-4 factSources). Cross-linked to
each other via intentCards and from `/time-now/france` + `/time-now/germany` (both country and
city-level pages). Two engineering fixes shipped alongside:
1. **New `retirement` field** on any event package (`{ afterDate, reason }`) — auto-excludes an
   event from the published index once the date passes, for genuinely one-time content. See
   `.claude/rules/content-pipeline.md` and `docs/add-new-event.md`.
2. **Date engine bug fixed**: `nth: -1` now means "last occurrence of this weekday in the month"
   (`holidays-engine.js` + `package-schema.js`). The old engine had NO way to express "last Sunday
   of March/October" — `nth: 5` silently returned wrong results (skipped to next year) in years
   with only 4 occurrences of that weekday. Verified against timeanddate.com: 29 Mar 2026, 25 Oct
   2026, 26 Oct 2025 all match. This unblocks any future floating "last X of month" event
   (`summer-time-france`, `summer-time-germany`, other DST/last-weekday patterns).

W7-3 (`buergergeld-germany`), W7-5 (`winter-time-germany`), W7-6 (`school-holidays-france`), W7-7
(`dst-usa`) remain queued below at their original priority.

## Wave 7 — DIASPORA HIGH-RPM engine (researched 2026-07-07, owner-approved direction)

**The thesis (owner's, confirmed by SERP research):** Arabic speakers *living in* France, Germany,
USA, etc. search in Arabic but monetize at Western RPMs (France/Germany CPMs are 5–15× Gulf-adjacent,
30–100× Egypt/Algeria). Nobody serves them date/countdown pages — the SERPs are refugee-info PDFs,
static blog tables, and expired news. This is the same recurring-payday playbook that already works,
pointed at richer ad markets. **Build order (by RPM × recurrence × SERP thinness):**

| # | Event | Date rule (verify at build via primary source) | Build by | SERP evidence (2026-07-07) |
|---|---|---|---|---|
| W7-1 | **`caf-payment-france`** (موعد صرف الكاف CAF) | ~5th of each month, one month in arrears (verify caf.fr) | **Jul 12** | Arabic SERP has NO date page at all — collisions with the football CAF + refugies.info procedure guides. "متى ينزل الكاف" intent completely unserved. Monthly recurring, France RPM |
| W7-2 | **`kindergeld-germany`** (موعد صرف الكيندرغيلد) | By Endziffer (last digit of Kindergeld-Nr), 0=start of month → 9=end; 259€/child 2026 (verify arbeitsagentur.de) | **Jul 15** | Same by-digit mechanic as our proven `unemployment-grant-algeria` (CCP digit). Arabic competition = static blog tables (elkhatib.net, favaim) — beatable with a live Endziffer→date lookup + countdown. ~1M+ Arabic speakers in DE, Germany RPM |
| W7-3 | **`buergergeld-germany`** (موعد صرف الجوب سنتر / بورغرغيلد) | Paid in advance at month start (verify exact rule at build) | Jul 20 | Rides the same audience + internal links as W7-2; "متى ينزل راتب الجوب سنتر" phrasing is how the audience actually talks |
| W7-4 | **`winter-time-france`** (تغيير الساعة في فرنسا) | Last Sunday of October (Oct 25, 2026) / summer counterpart last Sunday of March | Jul 25 | SERP = expired Oct-2025 news (youm7, wam) + time.is. A permanent countdown page from a time-utilities site is the natural #1. **A competitor (time-now.me) already ranks here — direct threat/validation** |
| W7-5 | **`winter-time-germany`** (تغيير الساعة في ألمانيا) | Same EU dates as France | Aug 1 | Same as W7-4 for the Germany diaspora; trivial marginal cost after W7-4 |
| W7-6 | **`school-holidays-france`** (العطل المدرسية في فرنسا) | Zones A/B/C calendar, official éducation.gouv.fr | Aug 10 | Arabic SERP = one generic travel blog + france-en-arabe. The zone-A/B/C complexity is our differentiator (interactive zone picker). Recurring every school year; pairs with existing school-start cluster |
| W7-7 | **`dst-usa`** (تغيير الساعة في أمريكا) | Nov 1, 2026 (fall back) / Mar 14, 2027 | Sep 1 | Arab-American audience, USA RPM; same template as W7-4/5. Lower priority — smaller Arabic-searching population than FR/DE |

**Wave 7 rules:** every page must state amounts/rules from the official source only (caf.fr,
arbeitsagentur.de, service-public.fr, éducation nationale) — same primary-source discipline as Gulf
benefits. Cross-link W7 pages to each other + `/time-now/france|germany` + prayer pages for those
cities (diaspora users are the same people who need prayer times in Paris/Berlin — internal-link
loop with existing high-RPM-geo prayer pages).

## Wave 8 — VOLUME plays: huge-population, low-RPM countries (owner-approved, gated)

Owner's call: pages that can win top-3 in month 1 in Egypt/Iraq/Algeria/Morocco class countries are
worth building for pure pageview mass even at sub-1 RPM — volume × anything > zero. Each still needs
its gate:

| # | Item | Volume evidence | Gate before building |
|---|---|---|---|
| W8-1 | **`salary-day-egypt` as a STATUS TRACKER** (موعد صرف مرتبات الموظفين) — not a fixed-day countdown; MoF announces quarterly tables (e.g. Jul 2026 = 20–26 Jul), page tracks current month + next month from mof.gov.eg | Every Egyptian news portal writes this article EVERY month (youm7/masrawy/almasryalyoum/ahram all ranked on it today) — that's proof of colossal recurring volume; our angle = the permanent page vs their expiring articles (`social-welfare-iraq` tracker format) | Egypt RPM ≥ ~1 MAD confirmed from the July results-wave AdSense data (**decision ~Jul 30**, same gate as tansik) |
| W8-2 | **`pension-day-egypt`** (موعد صرف معاشات مصر) — simpler than W8-1: pensions credited from day 1 (verify NOSI) | Same portal-army evidence; pension audience skews return-visitor | Same Jul 30 Egypt-RPM gate; if W8-1 builds, this is a half-day add-on |
| W8-3 | **`dv-lottery`** (قرعة أمريكا / اللوتري) as a STATUS TRACKER | Gigantic Oct–Nov Arabic volume (EG/DZ/MA/SD/YE); SERP = Facebook posts + news + embassy pages, no tracker page. ⚠️ Program suspended as of Mar 2026 + new $1 fee — a tracker page ("هل فتحت القرعة؟ الوضع الحالي") is MORE valuable in uncertainty, but facts must come from travel.state.gov only | Verify program status ~Sep 1; skip if still fully suspended with no announced window. Audience is IN low-RPM countries (not diaspora) — treat as volume play, not RPM play |
| W8-4 | Morocco/Algeria: already covered (direct-social-support, unemployment-grant, DST-Morocco W6-3) — no new W8 builds; keep cross-linking them to Gulf/diaspora pages | — | — |

## Wave 9 — Recurring religious demand WITHOUT waiting a year (researched 2026-07-07)

Owner's point: religious events shouldn't only pay off next Ramadan. The catalog already auto-rolls
yearly hijri events; what's missing is **monthly and weekly** Islamic recurrence:

| # | Item | Recurrence | Why it wins | Gate |
|---|---|---|---|---|
| W9-1 | **`white-days`** (أيام البيض — صيام 13/14/15 هجري) | **Every month** | "متى أيام البيض لشهر X" searched every single hijri month; SERP = dated news + generic fatwa pages, no countdown. We have the hijri engine + أم القرى authority | Engine check: needs monthly-hijri recurrence (like `type: monthly` but hijri) — if >1 day of eng work, build as a single evergreen page under /date with auto-computed next window instead of an event |
| W9-2 | **Hijri month-start events: `rajab-start`, `shaban-start`** (متى يبدأ شهر رجب/شعبان) | Yearly each, but they chain — Rajab≈Dec 2026, Shaban≈Jan 2027, feeding straight into the Ramadan-1449 funnel | People search month starts 2–3 weeks ahead; competition = calendar-widget sites; we countdown + explain الرؤية vs أم القرى | Cheap builds (existing `type: hijri`); volume gate: 3 named phrases each |
| W9-3 | **`mid-shaban`** (ليلة النصف من شعبان) ≈ Feb 2, 2027 | Yearly | High seasonal volume, thin Arabic countdown SERP | Build with W9-2 in the same session |
| W9-4 | **`laylat-al-qadr`** (ليلة القدر) ≈ Mar 2027 | Yearly | Peak-Ramadan monster query; needs to exist and index MONTHS before Ramadan | Build by Dec 2026 — do not wait for Ramadan proximity |
| — | صيام الاثنين والخميس (weekly) | Weekly | Engine has no weekly type (known limitation) | Revisit only if weekly type ever gets built for "days until Friday" |

## Creative NEW surface (owner asked: not calculators, not events) — audit results 2026-07-07

Researched candidates against "searched daily + low competition + $50–100/month realistic":

| Candidate | Verdict | Evidence |
|---|---|---|
| **Arabic online timer/alarm/stopwatch suite** (مؤقت، منبه، ساعة إيقاف + preset pages "مؤقت 10 دقائق") | 🟡 **Best strategic fit, NOT a free win** — park until Wave 7 ships | v-clock.com already has full Arabic incl. preset pages; online-timer.app/ar, fclock.online/ar, clockly.online/ar also localized. BUT all are thin machine-localizations; the long-tail preset pages + Arabic-first UX + our clock infra could win long-tail first. Bonus: timer tabs stay open for minutes-hours = anchor/side-rail impressions accumulate |
| أذكار الصباح/المساء مع عداد + سبحة إلكترونية | 🟡 Parked | Competition realer than expected: masba7a.com, wmadaat.com, alazkar.today, msbaha.com, islambook — dedicated sites with exactly this feature. Not month-1 top-3. Revisit as a retention feature (not SEO play) on prayer pages later |
| حظك اليوم / أبراج | 🚫 Never | Massive volume but astrology directly damages trust with the Islamic core audience — brand-incompatible |
| صور تهنئة (greeting images) | 🚫 Skip | Image-SEO traffic monetizes terribly; content-farm signal to Google |
| Kızılay card Turkey (كرت الهلال الأحمر) | 🚫 Rejected | No fixed payment date (every-2-months, varies), program winding down, refugee audience ≈ lowest RPM tier — three strikes |

**Decision:** the "creative thing" budget goes to Wave 7 first (it IS the creative move — nobody in
Arabic serves diaspora benefit dates). Timer suite is next in line once W7-1..4 are live and indexed.

## The $100–300 next-month math (honest version, 2026-07-07)

$100/mo ≈ 33 MAD/day · $300/mo ≈ 100 MAD/day. Today ≈ 0.6 MAD/day. Path to the low end of the range:
1. **Mawlid window (mid-Aug→Aug 25)** — the single biggest known spike; pool historically 5–10×.
2. **AdSense toggles (Part 2b — still the user's 10-minute action, still pending)** — without side
   rails + anchor-wide + vignette, everything else underperforms.
3. **Wave 7 diaspora pages** indexed by early August — even 100–300 pv/day at France/Germany RPM
   (realistically 15–40 MAD/1000) out-earns thousands of Egypt pageviews.
4. **Results-wave one-shots** (Algeria Jul 20, Egypt Thanaweya ~Jul 28, Jordan Tawjihi ~Aug).
Realistic corridor for August: **$40–120**, with $100+ requiring the Mawlid spike to land on the
improved titles AND W7 pages to index fast. $300 in August would need luck; $300/month steady is a
Sep–Oct outcome if W7 compounds. Anyone promising more from a 130-visitor base is lying.

## What was researched and REJECTED for this sprint (don't re-litigate)

- **Kuwait Thanaweya results wave** — already happened (results approved Jul 1, 2026); `bac-results-kuwait` had `day: 10` estimated, slightly late. Note for 2027: Kuwait announces ~Jul 1 and it's our highest-RPM country (17.76) — next year prep the page in June.
- **`tansik-egypt` (تنسيق الجامعات)** — gigantic August volume but Egypt RPM 0.59 and it's a new build competing with entrenched portals (natega sites, ministry). Candidate for late July ONLY if the results-wave pages show real Egypt traffic actually monetizes above ~1 MAD RPM. Parked in 🟡.
- **Iraq employee salaries (`salary-day-iraq`)** — still no fixed date (per-ministry MoF funding), still parked as a countdown; the retiree tracker (#5) covers the strongest single query cluster in that family and can cross-link a رواتب الموظفين section without a dedicated page.
- **New manual ad units** — no. Data says manual display is the losing layer (Part 2c unchanged).

---

# PART 1 — Why we earn $0.22/day (the exact problem, in numbers)

The 0.22 MAD/day baseline had five multiplying causes. Two are already fixed in code (manual ad slot
conflict, unviewable impressions — see `.claude/rules/ads-system.md` and `project-revenue-diagnosis`
memory for what changed). Three remain:

| # | Problem | Evidence | Fix status |
|---|---|---|---|
| 1 | **Too little traffic, period** | ~80 ad-tracked pageviews/day. Even at a great RPM this is pocket change. | Part 4 (traffic plan to 5K/day) |
| 2 | **The traffic we do get is the cheapest kind** | 24% of pageviews from Morocco (RPM 1.45), 13% Egypt (0.59), 10% Algeria (0.34), 3% Syria (0.13). Only 16% from SA+KW which pay 9.00–17.76. July RPM (2.44) is HALF of June's (4.81) because cheap traffic grew faster than Gulf traffic. | Part 3 (country strategy) + Part 5 (Gulf event pipeline) |
| 3 | **Desktop earns nothing** | Desktop: 0.08 MAD total. Not a code bug — desktop viewability is fine (0.61), there are simply no high-value formats enabled there. | 🔴 YOUR dashboard action (side rails, Part 2) |

**The equation for $300/month** (= 10 MAD/day): `pageviews/day × RPM/1000`.
- At today's mix (RPM ~2.4): needs ~4,200 pv/day.
- At a Gulf-shifted mix (RPM ~6–8, realistic once SA+KW ≥35% of traffic + Auto formats everywhere): needs **~1,300–1,700 pv/day**.
- That's the whole strategy: **push RPM toward 6–8 while pushing traffic toward 2–5K/day.** Both are
  attacked concretely below.

---

# PART 2 — ADS: what's fixed in code, what YOU must do, what units to create

## 2a. Fixed in code — done, deployed

Slot conflict removed, lazy-load margins tightened, 3 per-section units wired, above-the-fold placement
fixed on calculators/time-difference. Full detail: `.claude/rules/ads-system.md` +
`project-revenue-diagnosis` memory. Nothing left to do here — move to 2b.

## 2b. YOUR AdSense dashboard checklist (10 minutes, biggest single lever left)

AdSense → Ads → By site → miqatona.com → edit:

| Toggle | Set to | Why (from your own reports) |
|---|---|---|
| Auto ads master | **ON** | 86% of current revenue is Auto ads |
| **Anchor** | ON — **including "wider screens"** | #1 earner: RPM 5.56, viewability 0.85 |
| **Vignette** | ON — mobile AND desktop | Highest RPM on the site: 10.11 |
| **Side rails** | **ON** | This IS the desktop fix — desktop currently earns 0.08 MAD with good viewability but no formats |
| In-page (auto) | ON, ad load slider ≈ **medium** | RPM only 1.11, viewability 0.29 — more density dilutes, doesn't earn |
| Collapse empty ad units | ON if available | Stops layout gaps for unfilled slots |

Then: **Policy center** → confirm zero limits. **ads.txt** → "Authorized".

## 2c. New ad units — what's left, what NOT to create

**Nothing else is required right now.** The data is unambiguous: your manual display layer is the
worst performer (RPM 1.31) and the Multiplex is dead (RPM 0.05, 1 impression). More manual units = more
of the losing layer. The winning formats (anchor/vignette/side-rails) are Auto-ads formats — dashboard
toggles, not units.

**Create in ~3–4 weeks (optional, only after the Auto anchor gets a clean measurement window):**
one dedicated bottom-anchor test unit —
- AdSense → Ads → Ad units → **Display**, name `Sticky_Anchor_Dedicated_01`, orientation horizontal.
- Send me the slot ID (a number like `1234567890`) and I'll wire it into
  `MANUAL_AD_SLOT_REGISTRY.stickyAnchor` in `src/lib/ads/manual-config.js` — the component
  (`AdStickyAnchor`) is already mounted site-wide and will pick it up automatically. We then A/B the
  manual anchor vs Auto anchor by revenue for 2 weeks and keep the winner.
- **Never** paste an existing display slot ID there — that's the exact bug just removed.

**Delete/keep:** keep all existing units (deleting units with history can only lose data). The dead
Multiplex slots stay in the layout end-of-page where they cost nothing.

## 2d. What to export and send me after 7–10 days on the deployed code

1. **Requested format × Placement method** (like report 6) — did revenue shift into Auto anchor as predicted?
2. **Ad unit** report — did manual-unit Active View rise from ~0.3 toward ≥0.5?
3. **Country** report — is the SA+KW revenue share growing?
4. **Platform** report — did desktop move off 0.08 MAD after side rails?
5. GSC Pages + Queries (as usual) + one-time screenshot of the Auto-ads toggles.

---

# PART 3 — Country strategy (proven by your own money, not guesses)

| Tier | Countries | Page RPM (MAD) | Strategy |
|---|---|---|---|
| 💰 Build here first | **Kuwait 17.76 · Saudi 9.00** | 1 SA pageview ≈ 6 MA ≈ 15 EG ≈ 26 DZ | Every new event/calculator targets these two first. SA alone = 36% of revenue from 14% of pageviews. |
| 💎 NEW (2026-07-07): Arabic-speaking DIASPORA in the West | **France · Germany** (then USA · Sweden · NL · BE · UK) | No first-party data yet — Western display RPMs typically exceed even Kuwait's; first real numbers expected ~Aug 10 from Wave 7 | Arabic-language queries about French/German benefit dates + clock changes + school calendars (Wave 7). Same recurring-payday playbook, richer ad market, near-zero Arabic competition. This tier is the owner's key 2026-07-07 strategic addition. |
| 💵 Second ring | UAE · Qatar · Bahrain · Oman | high-RPM markets, small current samples | Complete the calculator grid; add recurring-payment events as verified. |
| 📊 Volume base | Morocco 1.45 · Tunisia 2.71 · Jordan | Morocco = biggest traffic source (24% of pv) | Keep ranking, don't over-invest in new pages; every Morocco page must cross-link to Gulf calculators. |
| ⚠️ Only-if-free | Egypt 0.59 · Algeria 0.34 · Iraq · Libya | Sub-1 RPM | No new dedicated pages unless nearly zero effort. Existing pages stay. |
| 🚫 De-prioritize | Syria 0.13 · Yemen · Sudan | Ads barely serve there | Never build for these audiences specifically. |

GSC confirms the pool exists where the money is: **Saudi = 22,520 impressions/week at position 8.65**
— the single largest RPM-weighted ranking opportunity on the site.

---

# PART 4 — Traffic: the honest road to 5,000 visitors/day

Today: ~120 organic clicks/day. 5K/day is a ~40× traffic multiple — it does NOT come from one thing.
It comes from four stacked engines, in this order of leverage:

**Engine 1 — Rank the impressions we already have (biggest, fastest).**
210,570 impressions/week (30K/day) sit at average position 8.3 with 0.39% CTR. Moving the top-20
impression pages from page-1-bottom (pos 7–9) to pos 3–4 historically lifts CTR from ~0.4% to 2.5–6%.
Half the pool at 2.5% CTR = **~2,600 clicks/day** — from pages that already exist.
→ Actions: the title/CTR pass already shipped for the Islamic cluster; next is the **Saudi-filtered
query pass** (top 5 Saudi pages by impressions), then internal-link reinforcement (done for
calculators/holidays, keep auditing).

**Engine 2 — The August–September seasonal wave (this is "next month"!).**
- **Mawlid (25 Aug)**: 34K impr/week TODAY at pos 8.86 → historically this pool grows 5–10× in the
  2–3 weeks before the date (150–300K impr/wk). At pos 3–5 with the new titles: **1,000–4,000
  clicks/day during the peak window.** This is the single biggest next-month traffic event and it's
  already optimized — it needs position monitoring in early August, nothing else.
- **School-start cluster (Sept, 12 countries)** + **رأس السنة الهجرية** + **عاشوراء (already pos 3–5
  on several queries)** stack on top of the same window.

**Engine 3 — Recurring Gulf payday/benefit engine (compounds monthly, forever).**
Every monthly-payment page re-fires 12×/year and builds return visitors (GA4 shows return users
growing). 6 Gulf monthly-payment pages are now live (Saudi + Kuwait pay-dates hubs, Part 5 Reference).
10–15 mature recurring pages at 100–400 visits/day each = **1,500–4,000/day** steady state — keep adding
verified Gulf monthly programs from Part 5.

**Engine 4 — High-RPM calculators (small traffic, outsized money).**
Building calculators already rank (building/jordan = #2 page). Completing the Oman column and pushing
EOS pages from pos 5–7 to top-3 is worth little traffic but a lot of RPM — these pages convert Engine
1–3 visitors into Gulf-finance sessions via the cross-links shipped earlier.

**Reality check:** 5K/day sustained is a ~2–4 month compounding outcome (indexing lag is real);
next month's realistic peak is 1.5–4K/day **during the mawlid window** + 300–800/day baseline growth.
That plus the RPM work is what puts $300/month in reach — first during the August spike, then steady.

---

# PART 5 — The event & content pipeline (full list, revenue-ranked)

Shipped events are removed from this list once live and verified (`ci:check` green) — the record lives
in `project-revenue-diagnosis` memory and git history, not here. This section only tracks what's left.

## 🟢 VERIFIED — ready to build next (gate passed today via live research)

Queued in PART 0 (the 30-day sprint) with deadlines — summary here for the record:

1. **Wave 6 countdown gap-fill (6 events, PART 0 Wave 6 table)** — from mapping English countdown-site
   staples against our catalog: `riyadh-season` (Oct, thin SERP, Saudi RPM) · `asian-cup-2027`
   (Jan 7–Feb 5, 2027, official) · `dst-abolition-morocco` (permanent GMT return after summer 2026 —
   live news wave in our biggest traffic country) · `winter-time-egypt` (last Fri of Oct) ·
   `white-friday` (Gulf shopping, peak-CPC November) · `world-cup-2030` (Morocco co-host, 4-year
   evergreen). Dates and reasoning in the Wave 6 table; each still gets full research-first at build.

**Saudi GSC query pass — done 2026-07-05 (real export, last 3 months, Saudi-filtered):**
379 clicks / 145,429 impressions / 0.26% CTR / avg position 9.09 — confirms the "too little traffic,
cheap CTR" diagnosis with real numbers, not guesses. Findings:
- Near-top-10 pages worth pushing (not new builds — these already exist and rank): `hajj-season`
  (pos 7.05, 889 impr), `autumn-season` (pos 7.36, 1193 impr), `ashura` (pos 10.55, 1453 impr).
- `social-security-saudi` (pos 8.01, 179 impr, 0 clicks) looked like a CTR bug at first glance but
  isn't — the title is already specific and direct; 0 clicks on 179 impressions over 3 months is just
  low-volume statistical noise (expected value <1 click). Not actionable yet.
- **Real red flag, audited and partly fixed 2026-07-05**: Saudi prayer-time city pages for major
  cities (Dammam, Tabuk, Hail, Buraydah, Khamis Mushait, Najran, Al-Kharj) all rank position 50–100+.
  Code audit found 4 concrete causes; 3 structural ones are fixed, 1 (content depth) is a bigger
  follow-on:
  1. **Fixed**: prayer city pages had zero sibling-city internal links (unlike `/time-now/`, which
     links 8 other same-country cities from every leaf page). Added a `CityPrayerCardsGrid` section
     linking to sibling Saudi (or any country's) cities on every prayer city page.
  2. **Fixed**: `generateStaticParams` for both prayer and time-now city pages prerendered only the
     global population top-24 — Riyadh was the only Saudi city in that list, so Jeddah/Makkah/
     Madinah/Dammam/etc. never got build-time SSG. Added `getPriorityCountriesCityParams()` (new
     function in `cities.ts`) that guarantees every `PRIORITY_COUNTRY_SLUGS` country gets its own
     top cities prerendered regardless of global ranking; merged into both templates'
     `generateStaticParams`. `getBridgeCityParams` (the dead code that was supposed to solve this)
     is still unused — left alone, not worth the risk of touching it too.
  3. **Fixed**: prayer city pages were hardcoded to sitemap priority 0.7 — the lowest of any content
     family on the site, lower than holidays and calculators. Bumped to 0.8 to match the country
     page. Also added missing priority/changeFrequency to the time-now sitemap (had none at all).
  4. **Not fixed — real, bigger lift**: since all 13 Saudi cities share one calculation method (أم
     القرى) and one timezone, ~100% of the prose/FAQ text on every Saudi prayer city page is
     identical except the city name token — a genuine near-duplicate-content pattern across the
     Saudi city set. Needs real per-city research content (local context, not just numbers) to fix
     properly — flagged as a future content project, not attempted this pass.

## 🟡 CANDIDATES — need data before they enter the queue

- **`tansik-egypt` (تنسيق الجامعات المرحلة الأولى/الثانية)** — enormous August volume, Egypt RPM 0.59.
  GATE: build only if the July results-wave shows Egypt traffic monetizing ≥ ~1 MAD RPM on our pages.
  Decision date: ~Jul 30, from real AdSense country data.
- **Exam-results 2027 prep calendar** — Kuwait (≈Jul 1, RPM 17.76 — missed the 2026 wave, page was
  dated Jul 10), Algeria (≈Jul 20), Egypt (≈late Jul). A June-2027 freshness pass on all
  `bac-results-*`/`thanaweya-results` pages is a standing annual task now; add to Part 6.

The earlier 4-candidate research pass (2026-07-06) is fully resolved: 2 shipped, 2 rejected on
direct-source verification (see below).

**Shipped 2026-07-06:** `social-assistance-bahrain` (الضمان الاجتماعي, MoSD `social.gov.bh`, day 15, 77/132/+28 BHD) — was #1 in this list, fully sourced, built to full research-first rigor (10 competitors, 9 coverageMatrix rows, 8 keywordGaps, 6 unansweredQuestions, 5 differentiationIdeas, 4 factSources), 7/5 keyword integration, `ci:check` green. Differentiator: explicitly disambiguates it from Bahrain's separate علاوة الغلاء cost-of-living allowance (same ministry, same day-15, different law/amounts) — a real public-confusion point no competitor page addressed. No viral myth found for this program (unlike Kuwait's), so none was invented.

**Shipped 2026-07-06:** `job-security-oman` (الأمان الوظيفي, SPF, نهاية كل شهر, 60% of wage/min 115 OMR/no ceiling) — was #3. Direct-source verification of the Executive Regulation of the Social Protection Law found Article 92 anchors ALL beneficiaries to the same "end of month" disbursement (structurally like payroll), unlike Bahrain's rejected claim-cycle case below. Engineering wrinkle: the event engine has no "last day of month" primitive and `day: 31` is confirmed broken (silently skips short months) — used `day: 28` as the closest safe anchor and stated the real end-of-month rule honestly in the content itself (answerSummary + a dedicated FAQ) rather than implying false day-level precision. Also disclosed, rather than guessed, a live ambiguity: a Jan-2026 Royal Order extended the benefit duration toward 12 months, but officials said implementation details are still pending — the page cites the confirmed July-2024 baseline (6mo + tapered 1yr extension) and flags the update honestly instead of publishing a possibly-wrong final duration number. 11/5 keyword integration, `ci:check` green.

**Checked and rejected 2026-07-06:** UAE ILOE unemployment insurance (MOHRE-regulated but disbursed "within 2 weeks of individual claim" — a claim-triggered timeline, not a universal calendar date; same fragmented-timing failure mode as the parked general UAE social-support cluster).

**Checked and rejected 2026-07-06: `unemployment-insurance-bahrain`** (بدل التعطل / SIO) — direct-source verification (Decree-Law 78/2006 + amending Law 4/2019 full text, pulled from `lloc.gov.bh`) found Article 11 only says compensation is paid "شهرياً" with NO universal calendar day; the real fixed point is Article 15's eligibility start (day 8 after each individual's own job-loss date), making this a claim-cycle benefit, not a shared-date one. Every beneficiary's "month" starts on a different day. Building it as a `type: monthly, day: X` countdown page would mean fabricating a date — the exact SANED slug-trap mistake the site's rules exist to prevent. The amount figures (60% of salary, 200 min/1,000 max BHD, 9-month cap) are correctly sourced but now confirmed to trace to Law 4/2019's 2019 update, not the 2006 base text — worth remembering if this ever gets revisited as a non-countdown content format (e.g. a blog eligibility-explainer) outside the holidays event pipeline.

**Checked and rejected 2026-07-06: `pension-day-qatar`.** Direct-source verification (daman.gov.qa's FAQ and pensioner service page, GRSIA's site, almeezan.qa's full text of Law 24/2002 and Law 1/2022, Qatari news) found no article or circular governing the *ongoing* monthly pension disbursement day — only the already-known "first entitlement" rule for newly-awarded pensions. The day-1 used by sibling `salary-day-qatar`/`social-security-qatar` could not be extended by analogy: those are sourced to a Ministry of Finance payroll circular, while Qatar's pensions are administered by a separate authority (GRSIA/Daman) with no evidence it rides the same schedule. **Near-miss worth recording**: one search result appeared to be the exact confirming circular ("توحيد موعد صرف معاشات التقاعد... بداية كل شهر") but on direct fetch turned out to describe **Saudi Arabia's GOSI** (a 2024 announcement), not Qatar — a genuine cross-country mix-up in search snippets that would have put a wrong country's fact on the page if not caught by fetching the source directly instead of trusting the headline. General lesson: always open the actual source before citing it, especially for GCC-wide pension/benefit news where country names are easy to conflate.

## 🔵 Arabic content gaps the data exposes (beyond events)

1. **"كم باقي" countdown intent is a whole category we own the template for** — competitors serve it
   with dated news articles; every verified monthly program in a Gulf country is a gap until we fill it.
2. **Building/construction cluster has proven PMF** (building/jordan #2 page; rebar/cement blog posts
   rank) — the gap: deep per-Gulf-country content (سعر متر البناء في السعودية/الكويت guides feeding
   the calculators). High-RPM audience, low competition, we already rank for the generic queries.
3. **Saudi student ecosystem**: مكافأة الجامعة (above) + التقويم الأكاديمي countdowns — young, mobile,
   high-volume, monthly-recurring.
4. **Gulf finance comparison content**: our GCC comparison tables inside calculators rank-support the
   tools; standalone "أفضل/مقارنة" pages are a later phase (advertiser-heavy queries).
5. **What NOT to chase** (confirmed dead ends): live prices (gold/currency/fuel), government-login
   services, Syria/Yemen/Sudan-specific content, once-a-year seasonal tools.

---

# PART 6 — Monitoring calendar (dated — don't redo early, don't skip)

- **2026-07-13**: Week-1 sprint checkpoint (Part 0) — deploy done, toggles screenshot, results pages
  refreshed, 2 new events live, AdSense daily vs 0.2 MAD baseline.
- **2026-07-20 morning**: Algeria BAC results day — page serving + same-day answerSummary switch.
- **~2026-07-28+**: Egypt Thanaweya results day — same treatment. Then decide `tansik-egypt` from
  real Egypt RPM data (~Jul 30).
- **Every June (annual)**: freshness pass on all exam-results pages BEFORE the waves (Kuwait ≈Jul 1 —
  highest-RPM country, missed in 2026; Algeria ≈Jul 20; Egypt ≈late Jul; Jordan Tawjihi ≈early Aug).
- **~Sep 2026**: Riyadh Season official opening date announced — update `riyadh-season` from
  estimated to fixed same-day. Morocco DST changeover date officialized — update `dst-abolition-morocco`.
- **Late Nov 2026**: White Friday week — verify `white-friday` serving; Asian Cup countdown spike
  begins (Dec–Jan).
- **On deploy + 3 days**: AdSense daily check — Auto anchor share should rise; manual display
  impressions may drop (fine — that inventory moves to Auto).
- **+7–10 days**: send the 5 exports listed in Part 2d → I verify each fix moved its number.
- **~2026-07-26**: GSC check — Wave 5 events + Reef + Kuwait labor indexing; `saned-saudi` dropping
  out; `sand-payment-saudi` gaining. Zero impressions on Wave 5 by then = indexing bug, investigate.
- **~2026-07-30**: Egypt-RPM gate decision (tansik + W8-1 salary tracker + W8-2 pension) from real
  July results-wave AdSense country data.
- **~2026-08-10**: Wave 7 indexing check (CAF/Kindergeld/Bürgergeld/winter-time-france) — France +
  Germany impressions appearing in GSC country filter = thesis confirmed; then greenlight W7-5..7.
- **~2026-09-01**: DV-lottery program status check (travel.state.gov) → W8-3 build/skip decision.
  Also: registration window historically opens early Oct — page must be live by mid-Sep if building.
- **~2026-12-01**: Build `laylat-al-qadr` + `rajab-start`/`shaban-start`/`mid-shaban` (W9) before the
  pre-Ramadan search ramp; Ramadan 1449 ≈ Feb 2027.
- **Early August**: Mawlid cluster position check (pool should be inflating). This is the money window.
- **~2026-07-20 (2 weeks after the 2026-07-06 internal-link reinforcement)**: fresh GSC export to check
  whether `hajj-season` (was pos 7.05) and `autumn-season` (was pos 7.36) moved from the new reciprocal
  links added from `summer-vacation`/`back-to-school`/`school-start-algeria`/`ramadan`. Also check
  whether `saudi-school-calendar` (shipped 2026-07-06) has started indexing ahead of the Aug 23 school
  start, and whether the `ramadan`/`eid-al-fitr` title changes to lead with "كم باقي على" moved CTR.
- **Monthly**: `validate:holidays:strict` clean run + category-map audit after any new event.

---

# PART 7 — Standing rules (unchanged, they work)

**Volume gate for every new item**: 3 named Arabic phrases searched today · daily/monthly recurrence ·
**RPM-weighted country first** (KW/SA > UAE/QA/BH/OM > TN/MA > EG/JO > DZ/SY) · beatable SERP with a
nameable differentiator · regulatory numbers from primary sources only — never publish a guessed
amount (Reef/Kuwait-labor deliberately omit per-person amounts; Kuwait-students publishes 200/350 KWD
because it's public law).

**Never build**: seasonal-only tools · Google-widget queries · government-portal-dominated queries ·
unresolved legal ambiguity (Oman EOS parked: 2026-vs-2027 conflict) · live price feeds.

**Engineering lessons that keep paying**:
- Event `<title>` = `richContent.seoMeta.titleTag` (never `seoTitle`/`h1`).
- Grep event names/keywords **in Arabic** before scaffolding (the ساند/`sand-payment-saudi` slug trap).
- Audit category-keyed maps (`CATEGORY_CALCULATORS`) against actual category values.
- Manual ad slots must never share a slot ID across placements.
- Ad impressions are counted at render: tight lazy-load margins = honest viewability = better pricing.

---

# Reference

**Gulf finance grid**: car-insurance SA/UAE/KW/QA/BH (OM parked, see below) · health-insurance
SA/UAE/QA/KW/BH/OM — **complete, all 6** (BH: SEHATI mandatory baseline + supplemental tiers; OM:
Ministerial Decision 76/2019 mandatory baseline + supplemental tiers) · mortgage SA/UAE/QA/KW/BH
(OM parked, see below) · personal-loan all 6 · EOS SA/UAE/KW/QA/BH/EG/JO (OM parked).

**Saudi pay-dates hub** (`/calculators/saudi-pay-dates`): salary 27 · citizen-account 10 · pension 1 ·
hafez 5 · social-security 1 · housing 24 · SANED ~1 (`sand-payment-saudi`) · Reef 1–10
(`reef-support-saudi`) · university stipend 27 (`university-stipend-saudi`).

**Kuwait recurring**: salary-day · pension-day 1 · labor-support 25 · student allowance 1–15
(`student-allowance-kuwait`) · social assistance 25 (`social-assistance-kuwait`, MOSA — distinct
program from labor-support despite the shared day-25 payment date) · housing allowance 1
(`housing-allowance-kuwait`, PAHW, 150 KWD — shares day 1 with pension-day-kuwait but a distinct
program). Child allowance (علاوة الأولاد) confirmed NOT buildable as a standalone event — it's bundled
into the regular salary with no separate payment date (Council of Ministers decision 390/2001).

**UAE recurring**: salary-day 25 · pension-day · Nafis salary support 27–end of month (`nafis-uae`,
ETCC + MOHRE — a single well-defined federal program, unlike the fragmented general social-welfare
system that's parked below; tiered support 2,500–7,000 AED by salary band + education level, plus a
fresh April/May 2026 update on the 15-month grace period for sub-6,000 AED salaries).

**Parked/skipped (reasons)**: Morocco unemployment insurance (format misfit) · Tunisia unemployment
grant (no distinct volume) · Oman EOS (date conflict) · Iraq salary day (no fixed date) · Morocco
pension (3 fragmented systems) · UAE social support (checked 2026-07-05: fragmented across 4 separate
authorities — federal MOCE + Abu Dhabi SSA + Dubai CDA + Sharjah — each with its own rules, and the
federal program publishes no fixed payment day; same failure mode as Morocco pension) · Qatar social
security (already shipped as `social-security-qatar`, day 1, MSDF — candidate was stale/duplicate) ·
`car-insurance-oman` (checked 2026-07-05: unlike Bahrain's fixed CBB ceiling table, Oman's FSA runs a
live multi-insurer price-comparison portal, not one official rate — building a calculator would either
fabricate a false "official" number or amount to a live price feed, both against standing rules) ·
`mortgage-oman` (checked 2026-07-05: DBR caps confirmed via Omanet — 50% personal/60% housing, Nov
2025 — but the LTV cap (~80-90%) traces only to secondary aggregators; the one specific circular
citation found for it, BM1153/2017, actually covers fraud risk management, not LTV — a clear
misattribution. `cbo.gov.om` itself was unreachable via fetch tooling. Needs someone with direct
CBO or Lexis Middle East access to confirm the real LTV circular before this gets built) · Libya
(volatile) · gold/currency/fuel (feeds+widgets) · Absher-type (login-gated) · Leave Bridge /
financial-health scorer / Ramadan planner (no volume or seasonal).
