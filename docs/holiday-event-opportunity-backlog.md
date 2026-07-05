# Revenue Playbook & Opportunity Backlog — miqatona.com

Updated: 2026-07-05 · Built from the granular AdSense reports (unit/country/platform/format) + GSC + GA4

---

# PART 1 — Why we earn $0.22/day (the exact problem, in numbers)

Yesterday's 0.22 MAD is not one problem — it's five multiplying problems. Fix them independently and
the multiplication works for us instead of against us:

| # | Problem | Evidence | Fix status |
|---|---|---|---|
| 1 | **Too little traffic, period** | ~80 ad-tracked pageviews/day. Even at a great RPM this is pocket change. | Part 4 (traffic plan to 5K/day) |
| 2 | **The traffic we do get is the cheapest kind** | 24% of pageviews from Morocco (RPM 1.45), 13% Egypt (0.59), 10% Algeria (0.34), 3% Syria (0.13). Only 16% from SA+KW which pay 9.00–17.76. July RPM (2.44) is HALF of June's (4.81) because cheap traffic grew faster than Gulf traffic. | Part 3 (country strategy) + Part 5 (Gulf event pipeline) |
| 3 | **Our best ad format was being sabotaged by our own code** | Auto anchor+vignette = 60% of revenue at RPM 5.56–10.11, but the manual sticky anchor reused the topBanner slot ID (forbidden) and competed with the Auto anchor. | ✅ fixed 2026-07-05, activates on deploy |
| 4 | **Manual ads fire impressions nobody sees** | Manual display viewability 0.28; Date banner 0.00 (46 impressions, zero seen). Unviewable impressions poison the unit's auction price. Cause: ads pre-loaded 200–500px before viewport on bounce-heavy pages. | ✅ fixed 2026-07-05 (margins 50–100px) |
| 5 | **Desktop earns nothing** | Desktop: 0.08 MAD total. Not a code bug — desktop viewability is fine (0.61), there are simply no high-value formats enabled there. | 🔴 YOUR dashboard action (side rails, Part 2) |

**The equation for $300/month** (= 10 MAD/day): `pageviews/day × RPM/1000`.
- At today's mix (RPM ~2.4): needs ~4,200 pv/day.
- At a Gulf-shifted mix (RPM ~6–8, realistic once SA+KW ≥35% of traffic + Auto formats everywhere): needs **~1,300–1,700 pv/day**.
- That's the whole strategy: **push RPM toward 6–8 while pushing traffic toward 2–5K/day.** Both are
  attacked concretely below.

---

# PART 2 — ADS: what's fixed in code, what YOU must do, what units to create

## 2a. Fixed in code (activates on next deploy — deploy soon)

1. **Sticky-anchor slot conflict removed** (`src/lib/ads/manual-config.js`): the manual bottom anchor
   was double-serving the topBanner slot ID and blocking Google's Auto anchor — the site's #1 format
   (RPM 5.56, viewability 0.85). Auto anchor now owns the bottom position exclusively.
2. **Lazy-load margins tightened** (TopBanner 200→50px, InArticle 300→50px, Multiplex 500→100px):
   impressions now fire only when users actually reach the slot → measured viewability rises → Google
   bids more for the same inventory. This is how the manual layer's RPM 1.31 recovers.

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

## 2c. New ad units — what to create and what NOT to create

**Create now: NOTHING is required.** The data is unambiguous: your manual display layer is the worst
performer (RPM 1.31) and the Multiplex is dead (RPM 0.05, 1 impression). More manual units = more of
the losing layer. The winning formats (anchor/vignette/side-rails) are Auto-ads formats — dashboard
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
growing). Shipped today: Reef (SA) + Labor support (KW). Pipeline in Part 5 adds students (SA day 27 —
the same day as salary-day-saudi = hub synergy), Kuwait students, and more. 10–15 mature recurring
pages at 100–400 visits/day each = **1,500–4,000/day** steady state.

**Engine 4 — High-RPM calculators (small traffic, outsized money).**
Building calculators already rank (building/jordan = #2 page). Completing the Oman column and pushing
EOS pages from pos 5–7 to top-3 is worth little traffic but a lot of RPM — these pages convert Engine
1–3 visitors into Gulf-finance sessions via the cross-links shipped earlier.

**Reality check:** 5K/day sustained is a ~2–4 month compounding outcome (indexing lag is real);
next month's realistic peak is 1.5–4K/day **during the mawlid window** + 300–800/day baseline growth.
That plus the RPM work is what puts $300/month in reach — first during the August spike, then steady.

---

# PART 5 — The event & content pipeline (full list, revenue-ranked)

## ✅ Shipped 2026-07-05 (live after deploy)

| Item | Country/RPM | Anchor |
|---|---|---|
| `reef-support-saudi` — دعم ريف | SA 9.00 | Monthly window days 1–10 (official MEWA rule), in saudi-pay-dates hub |
| `national-labor-support-kuwait` — دعم العمالة الوطنية | KW 17.76 | Day 25 monthly (PAM), weekend→Thursday rule |
| SANED de-duplication | SA | Kept ranking page (`sand-payment-saudi`, pos 6), retired invisible duplicate |

## 🟢 VERIFIED — ready to build next (gate passed today via live research)

| # | Item | Why it wins | Verified facts |
|---|---|---|---|
| 1 | **`university-stipend-saudi` — مكافأة الجامعة** | Massive monthly student search ("متى تنزل مكافأة الجامعة/كم باقي على المكافأة"); 7+ competitor pages prove volume; day 27 = same day as salary-day-saudi → hub + cross-link synergy; young mobile Saudi audience = our exact profile | Deposited **day 27 monthly** (varies slightly by university); amount varies by major/level — do NOT publish one number; sources: uqu.edu.sa, dar.ksu.edu.sa, pnu.edu.sa. Competition is countdown-shaped (beseyat, hijridates, yawminow) — differentiator: hub integration + per-university nuance + استعلام guidance |
| 2 | **`student-allowance-kuwait` — المكافأة الاجتماعية للطلبة** | Kuwait = top RPM (17.76); real amounts are public law (200 KWD/month, 350 for married-to-Kuwaiti); paid days 1–15; zero countdown competitors (SERP = gov portals + law texts) | Sources: mohe.edu.kw (Dayrah e-services), puc.edu.kw (صرف قواعد), law 10/1995 + amendments. Registration windows each semester |
| 3 | **Saudi GSC query pass** | 22.5K impr/wk pool at pos 8.65 in the 9.00-RPM country | Needs your next GSC export filtered to Saudi queries |

## 🟡 CANDIDATES — need the 3-phrase volume gate + primary source before building

| Item | Country | What must be confirmed |
|---|---|---|
| برنامج الدعم الاجتماعي الإمارات (low-income support) | UAE | Monthly pay date from an official source; 3 named phrases |
| علاوة الأولاد / بدل الإيجار الكويت (standalone pages?) | KW | Whether these have distinct search volume beyond دعم العمالة (they're components of it — risk of self-cannibalization like SANED) |
| مساعدات الشؤون الاجتماعية الكويت | KW | Fixed monthly date + official source |
| الضمان الاجتماعي قطر / علاوات قطر | QA | Program names + dates + volume |
| `car-insurance-oman` calculator | OM | FSA rate table vs no-ceiling (then clone the Bahrain template) |
| `mortgage-oman` calculator | OM | Current CBO LTV/DBR circular |
| `health-insurance-bahrain` / `-oman` | BH/OM | Mandatory-coverage status from regulator (changing laws — accuracy risk) |

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

- **On deploy + 3 days**: AdSense daily check — Auto anchor share should rise; manual display
  impressions may drop (fine — that inventory moves to Auto).
- **+7–10 days**: send the 5 exports listed in Part 2d → I verify each fix moved its number.
- **~2026-07-26**: GSC check — Wave 5 events + Reef + Kuwait labor indexing; `saned-saudi` dropping
  out; `sand-payment-saudi` gaining. Zero impressions on Wave 5 by then = indexing bug, investigate.
- **Early August**: Mawlid cluster position check (pool should be inflating). This is the money window.
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

**Gulf finance grid**: car-insurance SA/UAE/KW/QA/BH (OM next) · health-insurance SA/UAE/QA/KW (BH/OM
queued) · mortgage SA/UAE/QA/KW/BH (OM queued) · personal-loan all 6 · EOS SA/UAE/KW/QA/BH/EG/JO (OM parked).

**Saudi pay-dates hub** (`/calculators/saudi-pay-dates`): salary 27 · citizen-account 10 · pension 1 ·
hafez 5 · social-security 1 · housing 24 · SANED ~1 (`sand-payment-saudi`) · Reef 1–10
(`reef-support-saudi`) · **next: university stipend 27**.

**Kuwait recurring**: salary-day · pension-day · labor-support 25 · **next: student allowance 1–15**.

**Parked/skipped (reasons)**: Morocco unemployment insurance (format misfit) · Tunisia unemployment
grant (no distinct volume) · Oman EOS (date conflict) · Iraq salary day (no fixed date) · Morocco
pension (3 fragmented systems) · Libya (volatile) · gold/currency/fuel (feeds+widgets) · Absher-type
(login-gated) · Leave Bridge / financial-health scorer / Ramadan planner (no volume or seasonal).
