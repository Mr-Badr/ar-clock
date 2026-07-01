# Opportunity Backlog — miqatona.com

Updated: 2026-07-01

---

## The Only Test That Matters

Before anything gets built, it must pass all four:

1. **AI chatbots can't replace it** — real-time data, live countdowns, city-aware results, persistent calculations. ChatGPT gives a formula; we give your answer.
2. **Global apps won't bother** — too Hijri-specific, too Gulf-law-precise, too Arabic-first for Google or a US startup to care.
3. **Mobile-native, not mobile-adapted** — designed for a 6" Arabic RTL screen from the first sketch. No desktop form shrunk to fit.
4. **Teaches while it answers** — user leaves knowing their situation, not just a number. One insight per tool, always.

**Never build:** anything Google answers with its own widget · government portal brand queries · Saudi mortgage (bank-owned SERP) · medical diagnoses · anything that's just "same as competitor but Arabic"

---

## Already Live

**Events (monthly payday):** salary-day + pension-day for Saudi, UAE, Kuwait, Qatar, Egypt, Oman, Jordan, Bahrain · social-security-saudi · takaful-karama-egypt · citizen-account-saudi · pension-day-algeria (CNR, 2026-07-01)

**Events (Islamic):** ramadan, eid-al-fitr, eid-al-adha, hajj, mawlid, nisf-shaban, ashura, isra-miraj, laylat-al-qadr, day-of-arafa, first-dhul-hijjah, islamic-new-year

**Events (national + school):** 50+ national days across Saudi/UAE/Gulf/Levant/Maghreb · school-start + bac-results for 11 countries

**Calculators:** age · annual-leave · bmi · building (materials hub) · car-loan (dual-mode تقليدي/مرابحة + amortization) · electricity-bill (Saudi+UAE) · end-of-service (Saudi+UAE) · gpa + gpa-to-percent · inheritance · iqama · monthly-installment · net-salary · ovulation · percentage · personal-finance · pregnancy + pregnancy-weeks · salary · saudi-pay-dates (hub) · sleep (6 sub-tools) · vat · zakat (gold+jewelry) · investment (Islamic) · fasting (intermittent) · **gosi-retirement** (2026-07-01) · **eos-kuwait** (2026-07-01) · **eos-qatar** (2026-07-01) · **eos-bahrain** (2026-07-01)

---

## Build Queue

### ~~P1 — حاسبة التقاعد المبكر GOSI~~ ✅ Live 2026-07-01
**Route:** `/calculators/gosi-retirement`
**Why we win:** gosi.gov.sa requires login and is desktop-only clunky. No Arabic consumer tool answers "متى يحق لي التقاعد المبكر؟" + "كم سيكون معاشي؟". We show: (a) exact countdown to early retirement eligibility, (b) pension now (early) vs at 60 (standard), (c) handles July 2024 reform (old formula ÷40 vs new 2.25%).
**Mobile UX:** 3-step wizard — birth year scroller → subscription years slider → salary input → output is a "retirement card": date you qualify, monthly pension, side-by-side early vs standard comparison.
**Formula (existing subscribers):** `pension = avg_salary × years / 40`. Early eligibility: 25 years contribution. New formula (post-July 2024): `avg_salary × years × 2.25%`.
**RPM:** Finance High (Saudi, 12M+ GOSI members)

---

### P2 — مُحسِّن الإجازات (Leave Bridge Optimizer)
**Route:** `/calculators/leave-bridge`
**Why we win:** Every competitor lists holidays. Nobody personalizes: "I have 14 days remaining — show me the best 3 bridge opportunities in the next 6 months." We have 123 events × 16 countries already. This IS our unfair advantage weaponized.
**Mobile UX:** pick your country + remaining days → swipeable cards, one per "bridge window": "خذ 4 أيام إجازة حول العيد الوطني → تحصل على 10 أيام متواصلة". Calendar highlighting, share button.
**Unique hook:** Only tool that connects YOUR leave balance to OUR holiday database.
**RPM:** Medium (Gulf workers, recurring use every quarter)

---

### ~~P3 — حاسبة مكافأة نهاية الخدمة — الكويت + قطر~~ ✅ Live 2026-07-01
**Route:** `/calculators/eos-kuwait`
**Why we win:** We have Saudi + UAE EOS live. Kuwait Law 6/2010 is a distinct formula (15 days/yr ≤5 yrs, 30 days/yr ≥5 yrs, for indemnity). 3M+ expats. Programmatic expansion of a proven pattern.
**Effort:** Small — same component architecture as Saudi/UAE EOS.
**RPM:** Finance Medium-High (Kuwait, expat audience)

---

### P4 — مُخطط الليالي الرمضانية
**Route:** `/calculators/ramadan-planner`
**Why we win:** We have prayer times engine + Hijri calendar. No competitor combines: iftar countdown for your city + "إذا قرأت X صفحات الليلة تنهي القرآن في يوم Y" + يوم الختمة suggestion. Ramadan = highest traffic month.
**Mobile UX:** city selector → reading pace → outputs: your personal finish date on a Hijri calendar card, daily page target, with iftar time for your city.
**Unique:** Islamic purity schedule (طهارة) option for women — hijri tracking, hayd/tuhr pattern.
**RPM:** Mixed (recurring daily Ramadan use; Islamic finance ads)

---

### P5 — مُقيِّم الصحة المالية الخليجية
**Route:** `/calculators/financial-health`
**Why we win:** Gulf workers want to know "هل وضعي المالي جيد؟" — not a generic US calculator. We benchmark against Gulf-specific ratios: rent ≤30% salary, savings ≥20%, debt installments ≤35%. Output is a score/100 + 3 specific actions, not a table.
**Mobile UX:** 5 quick sliders (salary, rent, installments, savings, dependents) → score card + ranked actions. Connects to: net-salary, EOS, zakat, personal-finance calculators.
**RPM:** Finance High (cross-links to all finance tools = high session depth)

---

### P6 — تحسين صفحات الإسلاميات الموجودة (T4)
**Not a new build — targeted improvements to existing pages:**
- ramadan: live countdown above fold on mobile + "متوقع فلكياً" label + moon-sighting caveat
- eid-al-fitr / eid-al-adha: estimated date with Islamic moon-sighting note above fold
- hajj-season: "إجازة الحج للموظفين السعوديين" section
- /date: verify Hijri date is SSR-rendered above fold + connect to pregnancy/age/ovulation
**Effort:** Small. Impact: +500–1,000/day from existing traffic.

---

## Confirmed Research Skips

| Slug | Why not |
|---|---|
| Iraq salary day | No fixed date — ministry-by-ministry |
| Morocco pension | 3 fragmented systems (CNSS/CMR/RCAR), no single page wins |
| Libya anything | Volatile/unstable, no reliable data |
| Renaissance Day Oman | Cancelled as official holiday by royal decree 2020 |
| Saudi mortgage | Bank-owned SERP; Google widget |
| Coptic Christmas/Easter Egypt | Low RPM, wrong audience for Gulf/Islamic brand |
| Any medical diagnosis | Never |
