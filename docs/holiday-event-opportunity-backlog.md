# Opportunity Backlog — miqatona.com

Updated: 2026-07-01

---

## Revenue Target: $1,000/month within 3 months

**The math:** At $1–2 RPM (Gulf/Egypt Arabic AdSense), need 500K–1M pageviews/month (17K–33K/day).
Currently at ~100/day. Path: get 10–15 pages each ranking top 3 for queries sending 1K–3K visits/day.

**The only formula that works:**
- **Daily-use or monthly-use** searches (people come back → return traffic compounds)
- **Low competition Arabic gaps** — no strong Arabic competitor, we ship first
- **Large population** — Egypt (105M), Morocco (36M), Gulf expats (30M+) before niche markets
- **High RPM categories** — Gulf finance tools ($2–4 RPM) beat general info ($0.5 RPM)
- **AI-citeable** — structured factual content gets cited by ChatGPT/Gemini → free referral traffic

**Never build:**
- Seasonal-only tools (Ramadan, summer) that sit idle 10 months/year
- Queries Google answers with its own widget
- Anything a government portal already dominates
- Anything with no named Arabic keyword phrase you can verify has search volume

---

## The Only Test That Matters

1. **Real Arabic search volume** — name 3 keyword phrases users type today. If you can't, it's not ready.
2. **Daily or monthly use** — does someone search this every day or every month? If it's once/year, skip.
3. **Large population behind it** — Egypt/Gulf/Morocco first. Niche countries last.
4. **Weak Arabic competition** — check Google for these phrases. If a strong Arabic tool already ranks top 3, need a clear differentiator.
5. **High or medium RPM** — Gulf finance > Egypt general > North Africa general.

---

## Already Live

**Calculators (38):** age · annual-leave · bmi · building (hub) · car-loan · electricity-bill (SA+UAE) · end-of-service (SA+UAE+KW+QA+BH) · gpa + gpa-to-percent · gosi-retirement · inheritance · iqama · monthly-installment · net-salary · ovulation · percentage · personal-finance · pregnancy + pregnancy-weeks · salary · saudi-pay-dates (hub) · sleep (6 sub-tools) · vat · zakat (gold+jewelry) · investment (Islamic) · fasting (intermittent)

**Events (90+):** salary-day + pension-day for SA/UAE/KW/QA/EG/OM/JO/BH · social-security (SA+QA) · takaful-karama-egypt · citizen-account-saudi · pension-day-algeria · 50+ national days · school-start + bac-results 12 countries · Islamic events (12)

---

## Build Queue — Ordered by Revenue Impact

### P1 — حاسبة نهاية الخدمة مصر (Egypt EOS)
**Route:** `/calculators/eos-egypt`
**Search queries (daily):** "حاسبة نهاية الخدمة مصر", "مكافأة نهاية الخدمة مصر", "احسب مكافأة نهاية الخدمة في مصر", "كيف تحسب نهاية الخدمة في مصر", "قانون العمل المصري 12 لسنة 2003 نهاية الخدمة"
**Why we win:** 105M people, millions of formal employees. Existing Arabic tools are generic and don't explain the Egyptian law clearly. We ship the same premium pattern (Kuwait/Qatar/Bahrain) directly.
**Formula (Law No. 12 of 2003, Art. 120):** 1 month per year for the first 10 years, 1.5 months per year after 10 years. Resignation: <1yr=0%, 1-5yr=33%, 5-10yr=66%, 10+=100%. Daily rate = salary ÷ 30.
**RPM:** Medium (Egypt market), but HUGE volume compensates.
**Effort:** Small — copy KW/QA/BH pattern, change formula.
**Result timeline:** Can rank top 5 in 4–6 weeks given weak competition.

---

### P2 — إضافة اتجاه القبلة لصفحات الصلاة (Qibla on all prayer pages)
**Route:** add to existing `/mwaqit-al-salat/[country]/[city]` pages — 100+ city pages
**Search queries (daily, year-round):** "اتجاه القبلة [مدينة]", "اتجاه القبلة الرياض", "اتجاه القبلة دبي", "كيف أعرف اتجاه القبلة", "اتجاه الكعبة من [مدينة]"
**Why we win:** We already have lat/lon for 1,400 cities in our geo database. One calculation formula (bearing to Mecca 21.3891°N, 39.8579°E) added to every prayer city page = 100+ pages each capturing "[مدينة] + قبلة" queries. No new page needed — extends existing pages that already rank.
**Format:** A simple compass bearing card below the prayer times: "اتجاه القبلة من [المدينة]: 247°" + cardinal direction in Arabic + a visual compass SVG.
**RPM:** Medium (religious context). Volume: enormous (every Muslim checks this).
**Effort:** Very small — add calculation to prayer page server component.
**Result timeline:** Immediate (existing pages get re-indexed within 1-2 weeks).

---

### P3 — تحسين صفحات الصلاة: جدول شهري + 6 أسئلة (Prayer Page Depth)
**Route:** existing `/mwaqit-al-salat/[country]/[city]`
**Search queries:** "أوقات الصلاة [مدينة] يوليو 2026", "جدول أوقات الصلاة [مدينة] 2026", "أوقات الصلاة الأسبوع القادم [مدينة]"
**Why we win:** Monthly search tables = users bookmark us and return every month. 6 FAQs per city (Fajr dawn time, timezone, summer changes, prayer method) = content depth that ranks for long-tail queries.
**Format:** Server-rendered monthly table (current month) — 30 rows × 6 prayer columns — visible on mobile at 375px without horizontal scroll.
**Effort:** Medium (server component, static generation per city/month). High leverage since applied to 100+ city pages.
**Result timeline:** 4–8 weeks as Googlebot re-crawls updated pages.

---

### P4 — حاسبة ضريبة الدخل مصر (Egypt Income Tax 2025)
**Route:** `/calculators/egypt-income-tax`
**Search queries (daily):** "حاسبة ضريبة الدخل مصر 2025", "شرائح ضريبة الدخل مصر 2025", "كيف أحسب ضريبة الدخل في مصر", "الضريبة على الراتب في مصر", "حاسبة صافي الراتب مصر بعد الضريبة"
**Why we win:** Egypt updated income tax brackets in 2023. Almost every Arabic calculator online uses outdated brackets — we ship accurate 2025 brackets from the Egyptian Tax Authority. First accurate Arabic tool wins the SERP.
**Formula (2023 reform):** 0–15K: exempt → 15–30K: 2.5% → 30–45K: 10% → 45–60K: 15% → 60–200K: 20% → 200–400K: 22.5% → 400K+: 25%. Monthly = annual ÷ 12 per bracket. Add social insurance: 11% of basic (employee) + 18.75% employer.
**Mobile UX:** Input gross salary → output: net salary card + visual bracket breakdown (colored bars per bracket).
**Effort:** Small — same pattern as net-salary calculator.
**RPM:** Medium-Low (Egypt) but 105M people = high absolute volume.
**Result timeline:** 3–6 weeks to top 5 given thin competition.

---

### P5 — حاسبة نهاية الخدمة الأردن (Jordan EOS)
**Route:** `/calculators/eos-jordan`
**Search queries (daily):** "حاسبة نهاية الخدمة الأردن", "مكافأة نهاية الخدمة الأردن", "قانون العمل الأردني نهاية الخدمة", "كم نهاية الخدمة بعد 5 سنوات الأردن", "نهاية الخدمة الأردن عند الاستقالة"
**Why we win:** We already have salary-day-jordan, pension-day-jordan, school-start-jordan. EOS calculator completes the Jordan profile. 1M+ formal workers + Gulf returnees. No strong Arabic calculator exists.
**Formula (Labour Law No. 8 of 1996, Art. 32):** 1 month per year for every year of service. No distinction before/after 5 years (simpler than Gulf). Resignation: <1yr=0%, 1-3yr=33%, 3+=100%. Daily rate = salary ÷ 30.
**Effort:** Small — same EOS pattern.
**Result timeline:** 4–8 weeks.

---

### P6 — حاسبة التأمينات الاجتماعية مصر (Egypt Social Insurance)
**Route:** `/calculators/egypt-social-insurance`
**Search queries:** "حاسبة التأمينات الاجتماعية مصر", "التأمينات الاجتماعية كم تطرح من الراتب مصر", "اشتراك التأمينات الاجتماعية مصر 2025", "نسبة التأمينات مصر 2025"
**Why we win:** Directly related to Egypt income tax (P4) — bundle both as a two-page Egypt financial cluster. Users who land on income tax click through to social insurance. Thin Arabic competition.
**Formula:** Employee: 11% of basic salary. Employer: 18.75%. Maximum insured salary = 10,400 EGP/month (2025).
**Effort:** Very small — simple percentage calculation.

---

### P7 — تحسين صفحات الأحداث الإسلامية الموجودة (Islamic Event Content Depth)
**Not a new build — quick wins on existing pages that already have traffic:**
- **عاشوراء (Ashura):** arrives ~July 2026 — add fasting virtue section + countdown above fold
- **رأس السنة الهجرية (Islamic New Year):** Muharram 1 ~July 2026 — above-fold countdown + Hijri year context
- **عيد الأضحى / رمضان:** estimated date with moon-sighting caveat visible without scroll
- **موسم الحج:** "إجازة الحج للموظفين السعوديين" section — Saudi workers search this actively
**Effort:** Very small. Impact: existing traffic converts better, bounce rate drops.

---

### P8 — حاسبة الراتب الصافي المغرب (Morocco Net Salary)
**Route:** `/calculators/morocco-net-salary`
**Search queries:** "حاسبة الراتب الصافي المغرب", "حاسبة صافي الراتب المغرب", "كم يقتطع CNSS من الراتب المغرب", "IR الضريبة على الدخل المغرب"
**Why we win:** 36M Moroccans, 5M+ formal-sector workers. CNSS (اشتراكات) + IR (ضريبة الدخل) — two deductions most workers don't understand. No strong Arabic calculator for Morocco.
**Formula:** CNSS: 4.48% (short-term), 6.29% (long-term AMO), 0.52% (professional training) = ~11.29% total employee. IR: progressive brackets (0–30K MAD: 0% → 30–50K: 10% → 50–60K: 20% → 60–80K: 30% → 80–180K: 34% → 180K+: 38%). Apply monthly ÷ 12.
**Effort:** Small.
**RPM:** Low-Medium (Morocco) but 36M population and thin competition = fast ranking.

---

## Parked — Needs GSC Data Before Building

| Item | Why parked |
|---|---|
| محسن الإجازات (Leave Bridge) | Clever but no confirmed Arabic search query volume |
| مقيم الصحة المالية | Vague intent — validate GSC impressions for "وضعي المالي" queries first |
| مخطط ختم القرآن (Ramadan Planner) | Seasonal — sits idle 10 months. Skip until Ramadan is 8 weeks away |

---

## Confirmed Research Skips

| Slug | Why not |
|---|---|
| Iraq salary day | No fixed date — ministry-by-ministry |
| Morocco pension | 3 fragmented systems (CNSS/CMR/RCAR), no single page wins |
| Libya anything | Volatile, no reliable data |
| Renaissance Day Oman | Cancelled by royal decree 2020 |
| Saudi mortgage | Bank-owned SERP; Google widget |
| Coptic Christmas/Easter | Wrong audience for Gulf/Islamic brand |
| Any medical diagnosis | Never |
| Oman EOS | Transitioning to savings fund (July 2026) — law is changing |

---

## Search Volume Gate — Rule for All Future Items

Before any item enters the Build Queue:
1. Name the top 3 Arabic phrases people search **today** (not "they might search").
2. Check: is it daily/monthly use, or once-a-year? Once-a-year goes to seasonal queue only.
3. Pick the population: Egypt (105M) > Morocco (36M) > Gulf (30M expats) > Jordan (10M) > Niche.
4. Google the phrases — if a strong Arabic result already ranks top 3, define the exact differentiator before building.
