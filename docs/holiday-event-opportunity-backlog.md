# Growth Opportunity Backlog — Revenue-Weighted

Research date: 2026-06-24 (v2 — replaces previous version, all completed items removed)

Pair this with [`docs/growth-roadmap.md`](./growth-roadmap.md) (master traffic/CTR/revenue plan) and [`docs/holiday-event-premium-content-playbook.md`](./holiday-event-premium-content-playbook.md) (how to write a page that beats competitors). To hand an event to another AI for file generation, give it [`docs/add-new-event.md`](./add-new-event.md) plus the event name — that file is the canonical handoff contract.

---

## What is already live (don't rebuild)

**Calculators:** age, annual-leave, bmi, building (+ cement/rebar/tiles/paint), electricity-bill (Saudi+UAE), end-of-service (Saudi), gpa, gpa-to-percent, inheritance, iqama, monthly-installment, net-salary, ovulation, percentage, personal-finance (emergency-fund/debt-payoff/savings-goal/net-worth), pregnancy, pregnancy-weeks, salary, saudi-pay-dates (hub), sleep (+ 6 sub-tools), vat, zakat (includes gold/jewelry)

**Monthly payday events:** salary-day-saudi, pension-day-saudi, social-security-saudi, citizen-account-saudi, sand-payment-saudi, hafez-saudi, housing-support-saudi, salary-day-uae, pension-day-uae, salary-day-kuwait, salary-day-qatar, salary-day-egypt, pension-day-egypt, takaful-karama-egypt

**Islamic events:** ramadan, eid-al-fitr, eid-al-adha, hajj-season, laylat-al-qadr, day-of-arafa, first-dhul-hijjah, mawlid, nisf-shaban, ashura, isra-miraj, islamic-new-year

**National days:** saudi-national-day, saudi-founding-day, saudi-flag-day, uae-national-day, uae-tolerance-day, kuwait-national-day, bahrain-national-day, qatar-national-day, oman-national-day, iraq-national-day, jordan-independence-day + others

**School/academic:** back-to-school, summer-vacation, spring-vacation + school-start for (saudi, uae, egypt, kuwait, qatar, algeria, morocco, tunisia), bac-results for (algeria, jordan, morocco, tunisia), national-exams-morocco, thanaweya-exams, thanaweya-results

---

## Winnability Gate — hard rule before every build

Run this 5-question check. A "no" on Q1 or Q2 is an automatic reject.

1. Who owns the current top 3? If it's a government portal, Google's own widget, or an entrenched authority domain (UN, WHO, bank, university portal) with non-thin content — **reject**.
2. Can our page be objectively the BEST result? We must beat #1 on coverage, accuracy, freshness, and mobile UX, and fill gaps they miss. If we can only match, not beat — **reject**.
3. Does it ride one of our unfair advantages? (Hijri↔Gregorian engine, live countdown engine, premium Arabic calculator UX, multi-country Gulf framing.)
4. Is the intent an answer/tool, not a brand/portal?
5. Is the Arabic SERP thin or fragmented?

**Never build:** Saudi mortgage (government/bank owned SERP — own.sa, sakani.sa, all major banks); anything Google answers with its own widget (currency conversion, raw unit conversion); official government portal brand queries; medical diagnoses.

---

## Tier 1 — New High-RPM Evergreen Tools (BUILD FIRST)

Research validated June 2026. These are the highest-confidence new builds with the best traffic/revenue ratio.

| Priority | Tool | Route | Why It Wins | Arabic SERP Gap | RPM |
|:---:|---|---|---|---|---|
| **1** | حاسبة العائد الاستثماري الإسلامي | `/calculators/investment` | Finance category = highest AdSense CPM. Islamic murabaha/sukuk vs conventional interest comparison is an **Arabic-only differentiator** no English tool offers. Existing Arabic tools (yaaqen.com, daftra.com) are B2B/accounting-first, not consumer SEO. | B2B tools, no consumer-first Arabic calculator | Very High |
| **2** | حاسبة الصيام المتقطع | `/calculators/fasting` | 50M+ English app users (BodyFast, Zero, Fastic) prove massive demand. Arabic tools: only nshamah.com has a real tool, all others are thin blog embeds. Ramadan cultural fit = unique Arabic hook ("ما الفرق بين صيام رمضان وصيام 16:8"). Daily recurring use — people check their eating window every day. | Thin — only 1 decent Arabic tool (nshamah.com, small site) | Med-High |
| **3** | حاسبة السعرات الحرارية والماكرو | `/calculators/nutrition` | Bundle: calorie deficit (TDEE) + macros (protein/carbs/fat) + body fat % in one hub. kaloria.ai is the only real Arabic competitor but has poor SEO. Arabic fitness community is 20M+ strong on social media. Gulf angle: halal foods, Ramadan fasting macros, desert climate TDEE boost. | kaloria.ai is only real competitor; everything else is thin | Medium |
| **4** | حاسبة قرض السيارة | `/calculators/car-loan` | Dedicated car loan page vs. our general `/calculators/monthly-installment`. Arabic SERP: all existing tools are tied to specific brands (syarah.com, masarif.ae, adib.com). No neutral, Gulf-wide Arabic calculator covering Saudi/UAE/Kuwait simultaneously. Evergreen daily demand ("كم قسطي على سيارة 80 ألف"). | Fragmented — all tied to dealerships/specific banks | High |
| **5** | حاسبة التقاعد المبكر GOSI | `/calculators/gosi-retirement` | Saudi GOSI has a calculator on their site but UX is terrible. Workers constantly search "متى يحق لي التقاعد المبكر". Rules: age 60 + 20 years service, OR age 55 + 25 years. Arabic SERP: GOSI website ranks #1 but no interactive, UX-friendly Arabic calculator exists. Links to net-salary + end-of-service tools we already have. | Very thin — GOSI site ranks but is not a good tool | High |
| **6** | حاسبة نهاية الخدمة الإمارات | `/calculators/uae-end-of-service` | We have Saudi EOS. UAE has completely different rules: 21 days/year (first 5 years), 30 days/year after; DIFC rules differ; 2024 law changes (unlimited → limited contract). 4M+ UAE expats calculate this. Arabic tools: zenhr.com (B2B), dda.gov.ae (government, poor UX) — no consumer-first Arabic tool. | B2B/government tools only; no consumer-first Arabic calculator | High (UAE RPM) |
| **7** | حاسبة الدورة الشهرية + الطهارة | `/calculators/menstrual-cycle` | We have ovulation calculator — period calculator is the natural companion. SERP is somewhat crowded (nana-me.com, altibbi.com, webteb.com) BUT none output Hijri dates AND none include Islamic purity guidance (hayd/tuhr windows for prayer tracking). Our existing Hijri engine = genuine differentiator. | Crowded for basic calculator; Islamic + Hijri angle = uncontested | Med-High |
| **8** | حاسبة الوقت الإضافي (السعودية والإمارات) | `/calculators/overtime` | Saudi Article 107: 150% multiplier for OT; UAE Federal Labour Law: 25-50% premium. Workers need this constantly. Arabic tools: edarahr.com, daftra.com exist but are B2B/HR software. A worker-facing (not employer-facing) tool with plain Arabic explanation is the gap. Add 2026 Saudi labor law amendments as a content hook. | B2B tools dominate; no worker-centric Arabic calculator | Medium |

---

## Tier 2 — Monthly Recurring Events (Remaining Gaps)

Most high-RPM Gulf payment events are already live. Remaining gaps are lower-RPM Maghreb and smaller Gulf states, but still have real monthly recurring demand.

| Priority | Event | Slug | Country | Day | Notes |
|:---:|---|---|---|---|---|
| **1** | راتب القطاع الخاص البحريني | `salary-day-bahrain` | 🇧🇭 | Day 28 | Bahrain private sector salaries; WPS (Wages Protection System) compliance. Gulf RPM. |
| **2** | معاش التقاعد الكويتي | `pension-day-kuwait` | 🇰🇼 | Day 1 | Kuwait Social Insurance Institution (SII) pension payments. High Gulf RPM. |
| **3** | معاش CNSS المغربي | `pension-day-morocco` | 🇲🇦 | Day 5–10 | Morocco National Social Security Fund. Large Arabic audience, lower RPM than Gulf. |
| **4** | معاش CNAS الجزائري | `pension-day-algeria` | 🇩🇿 | Day 1–5 | Algeria National Social Insurance Fund. Large Arabic audience. |
| **5** | إعانات ضمان اجتماعي قطر | `social-security-qatar` | 🇶🇦 | Day 1 | Qatar Ministry of Social Development support payments for nationals. |

**Build approach:** Follow the existing salary-day-* pattern (monthly event type, `"countryScope": "none"`, no aliasSlugs).

---

## Tier 3 — Islamic & Date Daily-Search Surfaces (Carry-over TODOs)

These were in the previous backlog as TODO. Still not done. High year-round demand.

| Priority | Opportunity | Target | Notes | Status |
|:---:|---|---|---|---|
| **1** | كم باقي على رمضان {{nextYear}} | `/holidays/ramadan` | Event page exists but **verify live countdown appears above fold on mobile**. "كم باقي على رمضان" is searched year-round. aladhan/saudicalculator rank with thin pages. Must show: countdown + estimated date labeled "متوقع فلكياً" + moon-sighting caveat. | TODO — verify UX |
| **2** | التاريخ الهجري اليوم | `/date` head surface | One of the highest-volume daily Arabic date queries. Server-render "اليوم: {hijri} هـ — {greg}" above the fold with a converter. No calculator needed — just clean SSR output. | TODO — strengthen |
| **3** | كم باقي على الحج + إجازة الحج | `/holidays/hajj-season` | hajj-season event exists. **Verify countdown is live and prominent.** Hajj 2027 ≈ May 28 – June 2 (estimated). Year-round search, massive peak 4 months before. Add: "إجازة الحج للموظفين السعوديين" — how many days, when to apply. | TODO — verify + extend |
| **4** | كم باقي على عيد الفطر / عيد الأضحى | eid-al-fitr, eid-al-adha event pages | Events exist. **Verify estimated date + "يُحدد برؤية الهلال" caveat is visible.** Eid searches spike weeks before and peak the week of — countdown must be above fold on mobile. | TODO — verify UX |
| **5** | محول التاريخ الهجري الميلادي (أي تاريخ) | `/date` converter | Evergreen utility; pairs with pregnancy/age tools. Ensure the converter page is SSR-optimized and links to pregnancy/age/ovulation tools. | TODO — strengthen |

---

## Tier 4 — Programmatic Expansion of Proven Winners

Once a template ranks, multiply it. These require localized data — not template stubs.

| Pattern | Template | Expansion Axis | Specific Targets | Notes |
|---|---|---|---|---|
| End of service per country | `/calculators/end-of-service-benefits` (Saudi) | Gulf countries | Kuwait (Law 6/2010: 15 days/year for 3+ years), Qatar (Labor Law 14/2004: 3 weeks/year), Bahrain (3 week per year) | Each country has distinct formula. Build as separate calculator pages. |
| Electricity bill per country | `/calculators/electricity-bill` (Saudi+UAE) | Gulf | Kuwait (very cheap: 0 fils for households), Qatar (KAHRAMAA tiers), Jordan (NEPCO tiers) | Jordan electricity = high search volume from large Arabic population |
| Building cost per country | `/calculators/building` | Regional | Jordan (JOD/m²), Egypt (EGP/m²), Qatar (QAR/m²) | Already validated demand in roadmap (5–8% CTR rows). Needs localized material cost data. |
| Net salary per country | `/calculators/net-salary` (Saudi GOSI) | Gulf | UAE (no income tax, but DEWS for some sectors), Kuwait (no GOSI for expats), Bahrain (SIO contributions) | Shows "الراتب الصافي" after all deductions per country law. |
| GPA per university | `/calculators/gpa` | Saudi/Gulf universities | KSU, KFUPM, KAU, KAUST, UAEU, Sharjah University, AUB, QU | Pre-select scale; landing page ranks for "حاسبة معدل [اسم الجامعة]". |
| National day countdown per country | Event framework | MENA | Morocco (November 18 — Independence Day; separate from Green March Nov 6), Sudan (January 1), Libya (December 24), Yemen (May 22 unification day) | Use existing event template; add "كم باقي" countdown. |

**Guardrail:** programmatic pages must have genuinely localized data (real material costs, real legal formulas, real contribution rates). No content stubs.

---

## Tier 5 — Fixed-Date Annual Events (fill-in only, must pass Winnability Gate)

Only build events where: (a) SERP is fragmented/thin and beatable, (b) countdown demand exists **year-round** (not just 1–2 weeks before), (c) we can rank top 3.

| Priority | Event | Slug | Fixed Date | Why Winnable | Year-round demand? |
|:---:|---|---|---|---|---|
| **1** | تكريم المعلمين / يوم المعلم | `world-teachers-day` | Oct 5 | World Teachers Day — but more importantly, **Saudi/Gulf Teacher Appreciation Day is a real national moment**. Arabic SERP: fragmented. | Limited but Gulf school context = medium demand |
| **2** | اليوم العالمي للقهوة | `international-coffee-day` | Oct 1 | Commercial/shareable intent; SERP is blogs/listicles. Arabic coffee culture = rich angle. | Seasonal only |
| **3** | يوم السياحة العالمي | `world-tourism-day` | Sep 27 | Travel intent, fragmented SERP. Win with practical Arabic destination angle + countdown. | Seasonal only |

**Note:** T5 events should only be built as fill-in when T1–T4 are cleared. The 2-week/year traffic profile makes T5 a very low ROI investment vs. daily-use tools.

---

## Revenue-Weighted Priority Order (next 12 months)

Execute in this order. Row 1 first.

| # | Build | Expected daily visitors (12 mo) | RPM category | Effort |
|:---:|---|---|---|---|
| 1 | Islamic investment return calculator | 500–1,500 | Finance = very high | Medium |
| 2 | Intermittent fasting calculator | 800–2,000 | Health = medium-high | Medium |
| 3 | Calorie + macro fitness hub (bundle) | 1,000–3,000 | Health = medium | Large (3 tools) |
| 4 | Car loan calculator (Gulf-neutral) | 600–1,500 | Finance = high | Medium |
| 5 | GOSI retirement eligibility calculator | 300–800 | Finance = high | Small-Med |
| 6 | UAE end of service calculator | 400–1,000 | Finance/legal = high | Small |
| 7 | Menstrual cycle + Hijri purity | 500–1,500 | Health = medium | Medium |
| 8 | Overtime pay calculator (Saudi+UAE) | 300–800 | Labor = medium | Small |
| 9–12 | T3 verify/strengthen (Ramadan, Eid, Hajj, Hijri) | +500–1,000 existing | Mixed | Small |
| 13+ | T4 programmatic (EOS per country, electricity, building) | +300–600 each | Inherits parent | Medium each |

Conservative sum (from new T1 tools alone): **3,600–10,800 new daily visitors** at Gulf-weighted RPM. This is the next leg of the 10k/day target.

---

## Research notes (June 2026 live SERP validation)

Key findings from Arabic SERP scraping done June 2026:

- **Islamic investment/compound interest**: yaaqen.com, daftra.com, almurakib.com — all B2B. No consumer-first Arabic calculator. SKIP: Saudi mortgage (government/bank SERP wall: own.sa, sakani.sa, all major banks dominate irreversibly).
- **Intermittent fasting**: nshamah.com is the only decent Arabic interactive tool; all others are blog embeds or app-store links. Massive gap.
- **Calorie deficit**: kaloria.ai is the only real Arabic tool but AI-first / poor SEO. saudi-fit.com, arabianbodybuilding.com are niche. Strong gap for an SEO-first hub.
- **Car loan**: syarah.com, masarif.ae, adib.com — all brand-tied. No neutral Arabic Gulf calculator. Gap confirmed.
- **UAE EOS**: zenhr.com (B2B), dda.gov.ae (government, poor UX) — no consumer-first Arabic calculator for 2024 labor law rules.
- **Period calculator**: nana-me.com, altibbi.com, webteb.com already have calculators. Hijri + Islamic purity angle is uncontested.
- **Overtime**: edarahr.com, daftra.com (both B2B/HR). Worker-facing framing gap.
- **Hajj countdown**: calculatorvip.com, saudicalculator.com, hijri-date.com have thin pages — rich content (prep guide, إجازة الحج, prayer tools) would easily win.
- **GOSI retirement**: GOSI website ranks #1 but is not a good interactive tool. Zero consumer-facing Arabic calculators.
