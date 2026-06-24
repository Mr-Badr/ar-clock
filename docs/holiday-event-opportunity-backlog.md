# Growth Opportunity Backlog — Revenue-Weighted

Research date: 2026-06-24 (supersedes the 2026-06-15 awareness-day list)

Pair this with [`docs/growth-roadmap.md`](./growth-roadmap.md) (the master traffic/CTR/revenue plan) and [`docs/holiday-event-premium-content-playbook.md`](./holiday-event-premium-content-playbook.md) (how to write a page that beats competitors). To hand an event to another AI for file generation, give it [`docs/add-new-event.md`](./add-new-event.md) plus the event name — that file is the canonical handoff contract.

---

## 0. Why this backlog was rewritten

The previous version of this file was a list of **20 global awareness days** (world water day, world peace day, international coffee day…). They share three fatal weaknesses for our goal:

- **One-day spikes, not recurring demand** — traffic exists for ~48 hours per year, then dies.
- **Low advertiser intent / low RPM** — "awareness" content attracts cheap remnant ads, not health/finance/education buyers.
- **Crowded by NGOs/UN/news** — UNESCO, WHO, and major news outlets own these SERPs; we win the long tail at best.

We are at ~70–100 visits/day and want **10,000+/day** on the path to **1M/month**. You do not get there by stacking awareness days. The math that matters is:

> **Revenue ≈ Visitors × RPM.** And **Visitors ≈ Demand × (1 − Competitor strength) × our Fit.**

The master roadmap already proved the "shocking conclusion": our RPM is **~2 MAD in the Maghreb, 10–20 MAD in the Gulf, 20–35 MAD in the US.** So a Gulf payday page or a pregnancy tool used by Saudi/UAE mothers is worth **5–15× a Maghreb awareness day** at equal traffic.

This rewrite reorganizes everything around **recurring, high-RPM, low-Arabic-content demand that matches our two unfair advantages:**

1. **The Hijri↔Gregorian engine** — almost no competitor does dates *well* in both calendars. Pregnancy, ovulation, age, and Islamic-event tools all hinge on this.
2. **The countdown / "كم باقي / متى ينزل" engine** — we already render live countdowns with correct date logic. Whole competitor sites exist for *one* countdown (saudisalary.com = Saudi payday only). We can own the category.

---

## 1. The opportunity tiers (do them in this order)

| Tier | Theme | Why it's the priority | RPM | Recurrence |
|---|---|---|---|---|
| **T1** | High-RPM evergreen **tools** we don't have yet | Searched every day, all year, by Gulf + global Arabic users; we have zero coverage | High | Daily |
| **T2** | **Gulf payday / support countdown** cluster | Highest-RPM audience on earth for us; pure countdown = our engine; competitors are thin single-purpose sites | Very high | Monthly, forever |
| **T3** | **Islamic & date daily-search** surfaces | Enormous year-round volume; ties to prayer pages we already rank for | Mixed (Gulf-weighted) | Daily/seasonal |
| **T4** | **Programmatic expansion** of proven winners | Multiply a working template across universities/cities/countries | Inherits parent | Evergreen |
| **T5** | Curated **stable event pages** | Still worth doing, but as fill-in — not the growth engine | Low–Med | Annual |

Each tier below is independent of the CTR/indexing fixes in the master roadmap, so they can ship in parallel.

### 1.1 The Winnability Gate — build only what can rank #1 (top 4 worst case)

**Hard rule, applied BEFORE any build.** If we cannot realistically reach the **top 3** organic results (top 4 in the worst case) within ~3 months, we do **not** build it. We are not here to be page-2 filler behind governments and 10-year-old authority sites. We aim to be **#1**, with a product that is objectively better than the current winner and fills every gap it leaves.

Run this 5-question check on every candidate. A "no" on **Q1 or Q2 is an automatic reject.**

1. **Who owns the current top 3?** If it's a government portal, **Google's own widget/answer box**, or an entrenched authority domain (UN, WHO, UNESCO, major news, a bank) whose page is *not* thin — reject. We only enter if the incumbents are beatable (thin, stale, bad UX, or merely aggregators).
2. **Can our page be objectively the BEST result?** We must beat #1 on coverage, accuracy, freshness (dynamic `{{year}}`), and mobile UX — and fill the gaps they miss (no Hijri option, no countdown, missing questions, no calculator). If we can only *match*, not *beat* — reject.
3. **Does it ride one of our unfair advantages?** (Hijri↔Gregorian engine, live countdown engine, premium calculator UX.) If not, our odds of #1 drop sharply.
4. **Is the intent an answer/tool, not a brand/portal?** "متى ينزل الراتب" (answer → winnable). "بوابة الجامعة" / official portal login (brand → not winnable).
5. **Is the Arabic SERP thin or fragmented?** Fragmented GitHub one-pagers and thin single-purpose sites = beatable. One dominant, well-maintained authority = usually not.

> "Better than competitors" is the **entry ticket, not a bonus.** Every shipped page must demonstrably beat the current #1.

**Winnability read on the tiers below:**
- **T1 tools** — *Pregnancy/ovulation*: incumbent bar is altibbi + dedicated single-tool sites; **winnable** because none combine Hijri+Gregorian + week-by-week + premium mobile UX. *GPA*: beat the **aggregators/GitHub one-pagers** (beseyat, hasbati) — do **not** try to outrank a university's own portal for its brand query; win the generic + per-system terms.
- **T2 Gulf payday** — incumbents are thin single-purpose countdown sites (saudisalary.com); gov portals don't even target "متى ينزل" countdown intent. **Highly winnable.**
- **T3 Islamic** — Ramadan/Eid countdown SERPs are thin calendar pages (aladhan, saudicalculator); **winnable** with countdown + estimated-date + caveat + our prayer data.
- **T5 awareness days** — mostly **fail the gate** (see §6).

### 1.2 Never build — unwinnable SERPs

Do not start these. We cannot realistically reach top 4 and the effort is wasted:

- **Anything Google answers itself** — currency conversion, unit conversion, raw "what time is it". Google's own box sits above position 1. *(This is the real reason the currency converter is infra-gated/low-priority — possibly drop it.)*
- **Awareness days owned by UN/WHO/UNESCO + global news** — world water/food/peace/AIDS/press-freedom/literacy/migrants/older-persons/disabilities days. The institutional source plus the yearly news cycle owns the top 3.
- **Official government services with a branded portal** — "بوابة [جهة]", login-gated gov calculators, official exam-result portals. The gov site *is* the destination. We may still build the **countdown/explainer** beside it ("متى تظهر النتائج", "كم باقي على الصرف") — just never chase the portal's brand query itself.
- **Established single-authority medical diagnoses** — we ship non-diagnostic tools/explainers only; we do not fight WebMD/Mayo/altibbi for diagnostic head terms.

---

## 2. Tier 1 — High-RPM evergreen tools (BIGGEST BET)

These are **net-new tools**, not event pages. The repo currently has: age, sleep, BMI, zakat, VAT, percentage, salary, annual-leave, end-of-service, monthly-installment, building, personal-finance. It has **no** pregnancy, ovulation, GPA, currency, or grade tools — and those are some of the highest-volume evergreen Arabic searches that exist.

| Priority | Tool | Suggested route | Why it wins for us | Demand | Gap | RPM | Difficulty |
|---:|---|---|---|---:|---:|---:|---|
| **1** | حاسبة الحمل وموعد الولادة (بالهجري والميلادي) | `/calculators/pregnancy` | Entire dedicated Arabic sites exist for *only* this (hasibatalhaml.com, hisabulhamal.com, hijridates.com). Core differentiator is **Hijri+Gregorian due date** — our exact strength. Health/parenting RPM is high. | 5 | 4 | 5 | Medium |
| **2** | حاسبة التبويض وأيام الإباضة | `/calculators/ovulation` | Sister-intent to pregnancy; same audience, same engine, internal-links into pregnancy. Often the *entry* query before "حمل". | 5 | 4 | 5 | Easy-Med |
| **3** | حاسبة المعدل التراكمي GPA (من 5 و 4 و 100) | `/calculators/gpa` | Massive student demand; SERP is fragmented GitHub pages and per-university tools. Multi-system (5/4/100) + planner = premium. Feeds T4 per-university pages. | 5 | 4 | 3 | Medium |
| **4** | تحويل المعدل إلى نسبة مئوية | `/calculators/gpa-to-percent` | High-intent sibling of GPA; admissions/scholarship use. Cheap to build once GPA exists. | 4 | 4 | 3 | Easy |
| **5** | حاسبة أسابيع الحمل (الحمل بالأسابيع) | `/calculators/pregnancy-weeks` | "أنا في أي أسبوع" is a *repeat-visit* query — same user returns weekly. Boosts pages/session and ad impressions/visitor. | 4 | 4 | 5 | Easy-Med |
| **6** | محول العملات / أسعار الصرف | `/calculators/currency` | Very high volume + RPM, BUT needs **live exchange-rate data** (conflicts with our deterministic/no-live-data rule in hot paths). Gate behind a cached daily-snapshot service. Treat as **infra-gated phase 2**. | 5 | 3 | 4 | Hard (infra) |
| **7** | حاسبة الراتب الصافي بعد التأمينات (GOSI) | `/calculators/net-salary` | Extends the salary calculator we just enriched; "كم صافي راتبي" is high Gulf intent. Mostly reuses existing GOSI table. | 4 | 4 | 4 | Easy |

**Why Tier 1 is first:** pregnancy + ovulation + GPA are *daily, year-round, global-Arabic* demand with weak/fragmented incumbents, and three of them ride the Hijri engine no competitor matches. A single pregnancy tool can plausibly out-traffic the entire current 99-event holiday library.

**Build note:** all of these are calculators — follow the calculator page pattern in `.claude/rules/page-structures.md`, register in `src/lib/calculators/data.js`, add server-rendered FAQ/HowTo/schema, and **never hardcode the year** (use `{{year}}`). Health tools require a clear non-diagnostic / "راجع طبيبك" caveat for Ads safety.

---

## 3. Tier 2 — Gulf payday & support countdown cluster (HIGHEST RPM)

This is the single highest **revenue-per-visit** cluster available to us. The search behavior is "**متى ينزل / كم باقي على** [راتب/دعم]" — a pure countdown, which is exactly what our engine renders. Competitors are thin, single-country sites (saudisalary.com is *only* Saudi payday; beseyat has a basic عداد). We already have the Saudi pieces but they're buried as "holidays" and not extended across the Gulf.

### 3a. Audit & maximize what already exists
We already ship these as events — verify each has a **live countdown above the fold**, the exact صرف rule (e.g. "اليوم 1 من كل شهر؛ إذا صادف جمعة فيُصرف الخميس"), and "هل تأخر الصرف؟" troubleshooting copy:

- `salary-day-saudi`, `pension-day-saudi`, `social-security-saudi`, `citizen-account-saudi`, `sand-payment-saudi`, `hafez-saudi`, `housing-support-saudi`
- `salary-day-egypt`, `pension-day-egypt`, `takaful-karama-egypt`

### 3b. New high-RPM additions (extend the cluster across the Gulf)

| Priority | Opportunity | Suggested slug | Recurring date pattern | Why it wins | RPM | Difficulty |
|---:|---|---|---|---|---:|---|
| **1** | مواعيد الرواتب والدعم في السعودية (هَب) | `/calculators/saudi-pay-dates` *(or hub page)* | Aggregates all Saudi صرف dates | A single "متى ينزل كل شيء" hub captures the head term and internally links to every sub-countdown. Mirrors saudisalary.com but broader. | 5 | Easy-Med |
| **2** | موعد صرف رواتب القطاع الحكومي — الإمارات | `salary-day-uae` | Monthly, WPS-driven | UAE = top RPM; "متى ينزل الراتب" is searched monthly with thin Arabic answers. | 5 | Medium |
| **3** | موعد صرف رواتب — الكويت | `salary-day-kuwait` | Monthly | Kuwaiti gov payroll calendar; high RPM, low competition. | 5 | Medium |
| **4** | موعد صرف رواتب — قطر | `salary-day-qatar` | Monthly | Qatar gov + WPS; same pattern. | 5 | Medium |
| **5** | معاش الضمان الاجتماعي — الإمارات (المعاشات) | `pension-day-uae` | Monthly | GPSSA pension dates; aging-population query growth. | 5 | Medium |
| **6** | موعد صرف الدعم النقدي / المعاشات — مصر (تكافل وكرامة موسّع) | already have `takaful-karama-egypt` | Monthly | Huge volume (lower RPM); strengthen countdown + eligibility copy. | 2 | Easy |

**Caveat handling:** these dates *can be shifted by government decision*. Keep the rule fixed, show a live countdown, and add a visible "قد يُصرف مبكراً في المناسبات الرسمية" note. This is allowed under the stable-date rule (event date fixed; payout caveat explained).

---

## 4. Tier 3 — Islamic & date daily-search surfaces

Year-round, enormous-volume, Gulf-weighted RPM, and adjacent to prayer pages we already rank for. The master roadmap already targets the adhan/prayer SERP rescue — these complement it.

| Priority | Opportunity | Suggested route | Why it wins | Demand | Gap | Difficulty |
|---:|---|---|---|---:|---:|---|
| **1** | كم باقي على رمضان {{nextYear}} — عداد + التاريخ المتوقع | `/holidays/ramadan` countdown + a dedicated `كم-باقي-على-رمضان` surface | "كم باقي على رمضان" is searched *all year* and explodes seasonally. aladhan/saudicalculator rank with thin pages. Show countdown + **clearly-labeled estimated date** + moon-sighting caveat. | 5 | 3 | Easy-Med |
| **2** | التاريخ الهجري اليوم | strengthen `/date` head surface | One of the highest-volume daily Arabic date queries. Ensure a crisp server-rendered "اليوم: {hijri} هـ — {greg}" answer + converter above the fold. | 5 | 3 | Easy |
| **3** | إمساكية رمضان {{nextYear}} (لكل مدينة) | `/imsakiya/[city]` (programmatic, reuses prayer data) | Seasonal monster; per-city suhoor/iftar table from our existing Adhan data. Feeds T4. | 5 | 3 | Medium |
| **4** | كم باقي على عيد الفطر / عيد الأضحى — عداد | existing eid events | Confirm live countdown + estimated-date + "يُحدد برؤية الهلال" caveat; high seasonal volume. | 4 | 3 | Easy |
| **5** | محول التاريخ الهجري الميلادي (تحويل أي تاريخ) | strengthen `/date` converter | Evergreen utility; pairs with pregnancy/age tools via internal links. | 4 | 3 | Easy |

**Note on the moon-sighting rule:** the old backlog *excluded* Ramadan/Eid countdowns because dates depend on sighting. That was too strict — every major competitor publishes a countdown to the **astronomically estimated** date with a visible caveat. We should do the same: countdown is allowed, the page must label the date as "متوقع فلكياً" and explain sighting may shift it ±1 day.

---

## 5. Tier 4 — Programmatic expansion of proven patterns

Once a Tier-1/2/3 template ranks, multiply it. This is how impressions scale 6–7× (per the roadmap math) without writing each page by hand.

| Pattern | Template source | Programmatic axis | Notes |
|---|---|---|---|
| GPA per university | `/calculators/gpa` | Saudi/Gulf universities (KSU, KAU, جامعة الملك سعود, القصيم, الإمام, SEU, الشارقة…) | Each uses a specific 5- or 4-point scale; landing page pre-selects the scale. High-intent, brandable queries. |
| Imsakiya per city | prayer data + `/imsakiya` | Same city set we already prerender for prayer | Reuses Adhan engine; near-zero marginal content cost. |
| Pregnancy due-date per "آخر دورة" month | `/calculators/pregnancy` | Optional SEO landing variants | Lower priority; the tool itself captures most intent. |
| Time-now / prayer for US-diaspora cities | existing time-now/prayer | High-RPM US cities (already flagged: Atlanta 24K impr @ 0.16%) | Roadmap action #8; double-win on RPM. |
| building-calculator per country | existing building cluster | Jordan/Qatar/Egypt (proven 5–8% CTR rows) | Roadmap action #7; already validated demand. |

Guardrail: programmatic pages must stay above the "thin content" line (the roadmap's leak #3 — "crawled, not indexed"). Each variant needs genuinely localized data, not a templated stub.

---

## 6. Tier 5 — Curated stable event pages (fill-in only, must pass the gate)

The original awareness-day list mostly **fails the Winnability Gate (§1.1)**: UN/WHO/UNESCO + global news own the top 3 every year, and we'd only ever be page-2 filler. Under the new rule we do **not** build those just to have a page. Only candidates whose SERP is *commercial/shareable* rather than *authority-locked* qualify — and even then only as fill-in when T1–T4 are blocked.

**Passes the gate (commercial/shareable intent, not authority-locked) — build as fill-in:**

| Event | Slug | Fixed date | Why it can reach top 3 |
|---|---|---|---|
| اليوم العالمي للقهوة | `international-coffee-day` | 1 October | Shareable, commercial-adjacent; SERP is blogs/listicles, not a single authority. Beatable with a richer Arabic page + countdown. |
| يوم السياحة العالمي | `world-tourism-day` | 27 September | Travel/country intent; fragmented SERP. Win with practical Arabic destination angle + our date/countdown hook. |

**Fails the gate — do NOT build (authority-locked top 3):** world refugee day (UNHCR + news), world heart day / world diabetes day / world AIDS day / world no-tobacco day (WHO), world water day / world food day (UN/FAO), human rights day / day of peace / youth / older persons / persons with disabilities / migrants (UN), world book day / literacy / press-freedom (UNESCO), world cancer day. These can only ever win a thin long tail beneath the institutional source — not worth the build effort given our #1-or-skip rule.

*(Already-live awareness pages such as `world-diabetes-day` stay published, but do not invest further in this category — redirect effort to T1–T4.)*

---

## 7. Where the next 10k/day actually comes from (target mix)

Rough, directional targets — not guarantees. The point is *revenue-weighted allocation of effort*, not chasing raw Maghreb volume.

| Source | Daily-visit target (12 mo) | Why this number is plausible |
|---|---|---|
| Pregnancy + ovulation + week tools (T1) | 2,500–4,000 | Dedicated single-tool Arabic sites already sustain this; we add the Hijri edge. |
| GPA + grade tools + per-university (T1/T4) | 1,500–2,500 | Student demand is huge and the SERP is fragmented. |
| Gulf payday/support countdowns (T2) | 1,500–3,000 | Highest RPM; monthly recurring; thin incumbents. |
| Ramadan/Eid countdown + imsakiya + Hijri-today (T3) | 2,000–4,000 (seasonally spiky) | Massive seasonal peaks + steady "كم باقي" baseline. |
| Existing prayer/time/holiday rank+CTR rescue (roadmap) | 2,000–4,000 | Already-owned 925K impressions, unlocked by CTR/rank fixes. |

Even the conservative ends of these ranges sum past 10k/day, and the mix is deliberately tilted toward **Gulf + global-health + student** RPM rather than 2-MAD Maghreb awareness traffic.

---

## 8. Stable-Date Rule (still applies to all event pages)

An event can be built as a fixed page only if it has one of:

- fixed Gregorian date (e.g. `20 November`)
- official annual observance on the same Gregorian date every year
- country-specific fixed public holiday with a reliable official source

Do **not** build a fixed page if the date depends on: moon sighting *(except as a clearly-labeled estimated countdown — see §4 note)*, school calendars that change yearly, DST decisions, campaign themes rewritten yearly, or one-off/bridge holidays.

If a fixed-date event's *paid day off* can be moved by government decision, the page is still allowed: keep the **event date fixed** and clearly separate "تاريخ المناسبة" from "تاريخ الإجازة الرسمية / موعد الصرف".

---

## 9. Content angle that beats competitors (all tiers)

Every page leads with the fast answer, then resolves the confusion competitors leave open:

```text
أعطيك الجواب السريع أولاً: التاريخ/النتيجة، اليوم، العد التنازلي، وهل هي إجازة/صرف أم لا.
ثم أحسم ما يربك معظم النتائج: هل التاريخ ثابت؟ هل يتغير الموعد؟ ما الفرق بين هذا وما يشبهه؟
وماذا تفعل بهذه المعلومة الآن — في العمل أو الدراسة أو السفر أو الميزانية أو الحمل؟
```

For tools specifically: the **answer must be visible above the fold on mobile (375px)** with visual aids (tables, milestones, progress), per `feedback-content-standards`. Use `{{year}}`/`{{nextYear}}` — never hardcode dates.

---

## 10. Validation before shipping each item

**Step 0 — pass the Winnability Gate (§1.1) first.** Pull the live top-5 Arabic SERP for the head query. Identify the current #1 and what makes it win. If we cannot beat it on coverage + accuracy + freshness + mobile UX, **stop here and pick another candidate.** Write one line in the PR: "Current #1 = X; we beat it by Y." No page ships without that line.

**For a calculator/tool (Tier 1):**
```text
Research top 5 Arabic + top 5 English competitors; scrape structure, gaps, missing questions, user intent.
Write ORIGINAL content (no paraphrase). Verify every formula/fact against an official/medical/academic source.
Register the route in src/lib/calculators/data.js; build server-rendered FAQ + HowTo + schema; add a non-diagnostic caveat for health tools.
Run: npm run ci:check  → then  npm run build (seo:validate + seo:audit:rendered must pass).
```

**For an event page (Tier 2/3/5):**
```text
Follow docs/holiday-event-premium-content-playbook.md and docs/add-new-event.md.
Create only package.json, research.json, qa.json. Keep dateRule fixed; explain any payout/vacation caveat in visible content.
Run: events:build → validate:holidays:strict → seo:validate → test:unit → build.
```

---

## 11. Sources used for this rewrite (2026-06-24 research)

**Tier 1 — tools demand:**
- Pregnancy (Hijri+Gregorian) dedicated Arabic sites: [hasibatalhaml.com](https://hasibatalhaml.com/), [hisabulhamal.com](https://hisabulhamal.com/), [pregnancy-calculate.com](https://pregnancy-calculate.com/), [hijridates.com pregnancy tool](https://hijridates.com/pregnancy-calculator.html), [altibbi pregnancy calculator](https://altibbi.com/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D8%A7%D9%84%D8%AD%D9%85%D9%84-%D9%88%D9%85%D9%88%D8%B9%D8%AF-%D8%A7%D9%84%D9%88%D9%84%D8%A7%D8%AF%D8%A9) — confirm strong dedicated-tool demand and the Hijri/Gregorian differentiator.
- GPA / المعدل التراكمي fragmentation: [beseyat GPA](https://beseyat.com/gpa-calculator.php), [hasbati GPA (5/4/100)](https://hasbati.com/gpa-calculator/), [techdonia GPA](https://techdonia.net/gpa-calculator/), plus per-university tools (QU, KSU, SEU) — confirm multi-system + per-university programmatic angle.
- Multi-tool competitor model: [onlinecalculator.ae (500+ tools)](https://onlinecalculator.ae/).

**Tier 2 — Gulf payday countdown demand:**
- Single-purpose countdown competitors: [saudisalary.com](https://saudisalary.com/), [saudisalary citizen-account countdown](https://saudisalary.com/citizen), [beseyat salary dates](https://beseyat.com/salaries/dates.php), [saudiwadi salary dates 2026](https://saudiwadi.com/) — confirm "متى ينزل" countdown intent and صرف-rule content (ضمان = 1st, حساب المواطن = 10th).

**Tier 3 — Islamic countdown demand:**
- Ramadan 2027 countdown competitors: [aladhan Ramadan 2027](https://aladhan.com/ramadan-calendar/2027), [saudicalculator Ramadan countdown](https://www.saudicalculator.com/en/countdown/ramadan), [prayertime.live Ramadan 2027](https://prayertime.live/ramadan-2027) — confirm year-round "كم باقي" + imsakiya demand and the estimated-date+caveat pattern.

**Retained from prior research (event dates):** UN/UNESCO/WHO observance pages for the Tier-5 fixed dates (world refugee day 20 Jun, world heart day 29 Sep, international coffee day 1 Oct, world tourism day 27 Sep, etc.).
