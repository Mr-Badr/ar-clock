# Opportunity Backlog — miqatona.com

Updated: 2026-07-03

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

## Already Live (58 Calculators + 90+ Events)

**Calculators:** age · annual-leave · bmi · building (hub) · car-loan · car-insurance-saudi · car-insurance-uae · car-insurance-kuwait · car-insurance-qatar · health-insurance-uae · health-insurance-saudi · health-insurance-qatar · health-insurance-kuwait · dubai-company-setup-cost · mortgage-saudi · mortgage-uae · mortgage-qatar · mortgage-kuwait · mortgage-bahrain · personal-loan (SA+UAE) · personal-loan-kuwait · personal-loan-qatar · personal-loan-bahrain · personal-loan-oman · personal-loan-egypt · egypt-car-customs · egypt-electricity-bill · egypt-water-bill · calories · electricity-bill (SA+UAE) · end-of-service (SA+UAE+KW+QA+BH+EG+JO) · egypt-income-tax · egypt-social-insurance · morocco-net-salary · gpa + gpa-to-percent · gosi-retirement · inheritance · iqama · monthly-installment · net-salary · ovulation · percentage · personal-finance · pregnancy + pregnancy-weeks · salary · saudi-pay-dates (hub) · sleep (6 sub-tools) · vat · zakat (gold+jewelry) · investment (Islamic) · fasting (intermittent) · uae-corporate-tax · bill-splitter · work-hours

**Events (90+):** salary-day + pension-day for SA/UAE/KW/QA/EG/OM/JO/BH · social-security (SA+QA) · takaful-karama-egypt · citizen-account-saudi · pension-day-algeria · 50+ national days · school-start + bac-results 12 countries · Islamic events (12)

---

## Build Queue — Wave 2 (High-RPM, All New Research)

Ranked by (RPM × winnable traffic). All items verified against Already Live — no duplicates.

| RPM tier | Categories | Est. RPM | Priority |
|---|---|---|---|
| 🟢 HIGH | insurance, mortgage/real-estate, business setup, banking | $6–20+ Gulf | **First** |
| 🟡 MEDIUM | salary/tax/automotive | $2–5 | After |
| 🔴 LOW | utility bills, health/fitness, general info | $0.3–1.5 | Volume only |

---

### ~~W2-4. حاسبة تأمين السيارة الكويت~~ ✅ SHIPPED
`/calculators/car-insurance-kuwait` — premium UI, KWD pricing, 5 driver age bands, 5 areas, no-claim discounts. CI passes.

---

### ~~W2-5. حاسبة تأمين السيارة قطر~~ ✅ SHIPPED
`/calculators/car-insurance-qatar` — QAR pricing, 5 municipalities, 6 driver age bands, no-claim discounts. CI passes.

---

### ~~W2-6. حاسبة قسط القرض الشخصي الكويت~~ ✅ SHIPPED
`/calculators/personal-loan-kuwait` — CBK rules (DBR 40% كويتي / 30% وافد), installment + affordability modes, KWD 15K expat cap, SvgDonut + DbrMeter UI. CI passes.

---

### ~~W2-7. حاسبة القرض الشخصي قطر~~ ✅ SHIPPED
`/calculators/personal-loan-qatar` — QCB rules: DBR 50% للجميع, 2M QAR / 10yr Qataris, 400K / 4yr expats. SvgDonut + DbrMeter + GCC comparison. CI passes.

---

### ~~W2-9. حاسبة التأمين الصحي قطر~~ ✅ SHIPPED
`/calculators/health-insurance-qatar` — 4 tiers (Basic 800-1,500 / Standard / Premium / Global 7K-18K QAR), age bands ×1.0–×3.8, pre-existing +35%, TierBars comparison. First Arabic Qatar health insurance estimator. CI passes.

---

### ~~W2-8. حاسبة التأمين الصحي الإمارات (premium upgrade)~~ ✅ SHIPPED
`UaeHealthInsuranceCalculator` upgraded: period toggle, CoverageBars visual, insight cards (per-member/age factor/emirate loading), age factor in dropdown labels, section dividers. Matches Saudi premium version. CI passes.

---

## Build Queue — Wave 3 (Gulf Mortgage + Bahrain)

### ~~W3-1. حاسبة التمويل العقاري قطر~~ ✅ SHIPPED
`/calculators/mortgage-qatar` — QCB July 2023 LTV matrix (3 borrower types × 3 property types × price thresholds), DBR 75% Qatari / 50% resident, trad + Islamic (Murabaha), installment + affordability modes, rate sensitivity strip. First Arabic tool implementing new QCB 2023 rules. CI passes.

---

### ~~W3-2. حاسبة التمويل السكني الكويت~~ ✅ SHIPPED
`/calculators/mortgage-kuwait` — CBK housing loan rules: DBR 40%, KD 70K cap, 15yr max commercial banks, KCB zero-interest comparison for nationals showing monthly saving vs commercial bank. Two-track system (KCB + commercial bank). CI passes.

---

### ~~W3-3. حاسبة القرض الشخصي البحرين~~ ✅ SHIPPED
`/calculators/personal-loan-bahrain` — CBB rules: DBR 50% for all, 100K BHD nationals / 60K expats, 84mo/60mo, DBR bar visual, high-earner note (BHD 3K+), GCC comparison table (5 countries). First Arabic Bahrain personal loan calculator. CI passes.

---

## Build Queue — Wave 4 (Complete Gulf Coverage + Egypt Loan)

Closes the remaining gaps in the Gulf finance grid. All 4 tools shipped in one session.

### ~~W4-1. حاسبة التأمين الصحي الكويت~~ ✅ SHIPPED
`/calculators/health-insurance-kuwait` — Al-Ahleia/GIG Kuwait market pricing, 4 tiers (50–2,000 KD/year), 6 age bands ×1.0–×3.8, pre-existing +30%, family discount for dependants. Closes Gulf health insurance grid gap (KW was missing). CI passes.

---

### ~~W4-2. حاسبة التمويل العقاري البحرين~~ ✅ SHIPPED
`/calculators/mortgage-bahrain` — CBB rules: LTV 70% nationals/60% expats (residential), 60%/50% investment, DBR 50%, 25yr/20yr max terms, conventional + Islamic Murabaha, installment + affordability modes. Closes Gulf mortgage grid gap (BH was missing). CI passes.

---

### ~~W4-3. حاسبة القرض الشخصي عمان~~ ✅ SHIPPED
`/calculators/personal-loan-oman` — CBO rules: DBR 50%, 120mo nationals / 60mo expats, OMR 30K expat cap, installment + affordability modes. First Arabic Oman personal loan calculator with CBO compliance. CI passes.

---

### ~~W4-4. حاسبة القرض الشخصي مصر~~ ✅ SHIPPED
`/calculators/personal-loan-egypt` — CBE rules: DBR 35% private / 40% government, 60mo/84mo max terms, EGP currency, high interest rates (18–35% post-2024 hikes), min salary warnings. 105M population, first CBE-compliant Arabic loan calculator. CI passes.

---

## Parked — Needs GSC Data Before Building

| Item | Why parked |
|---|---|
| محسن الإجازات (Leave Bridge) | Clever but no confirmed Arabic search query volume |
| مقيم الصحة المالية | Vague intent — validate GSC impressions for "وضعي المالي" queries first |
| مخطط ختم القرآن (Ramadan Planner) | Seasonal — sits idle 10 months. Skip until Ramadan is 8 weeks away |
| ~~تأمين السيارة قطر~~ | Moved to W2-5 now that Kuwait is shipped |
| رهن عقاري السعودية للأجانب | Niche variant of mortgage-saudi — add a mode to existing page if GSC shows demand |

---

## Confirmed Research Skips

| Slug | Why not |
|---|---|
| Iraq salary day | No fixed date — ministry-by-ministry |
| Morocco pension | 3 fragmented systems (CNSS/CMR/RCAR), no single page wins |
| Libya anything | Volatile, no reliable data |
| Renaissance Day Oman | Cancelled by royal decree 2020 |
| Coptic Christmas/Easter | Wrong audience for Gulf/Islamic brand |
| Any medical diagnosis | Never |
| Oman EOS | Transitioning to savings fund (July 2026) — law is changing |
| سعر الذهب / الفضة اليوم | Live price feed + Google widget + isagha/masrawy dominate |
| تحويل الدولار للجنيه | Live feed + Google widget + banks/Wise/XE own it |
| أسعار البنزين / السولار مصر | Semi-live feed, news sites re-post, no durable moat |
| الاستعلام عن المخالفات (Absher) | Requires government login — impossible to replicate |

---

## Search Volume Gate — Rule for All Future Items

Before any item enters the Build Queue:
1. Name the top 3 Arabic phrases people search **today** (not "they might search").
2. Check: is it daily/monthly use, or once-a-year? Once-a-year goes to seasonal queue only.
3. Pick the population: Egypt (105M) > Morocco (36M) > Gulf (30M expats) > Jordan (10M) > Niche.
4. Google the phrases — if a strong Arabic result already ranks top 3, define the exact differentiator before building.
