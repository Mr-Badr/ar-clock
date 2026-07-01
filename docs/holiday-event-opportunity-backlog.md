# Opportunity Backlog — miqatona.com

Updated: 2026-07-01

---

## The Only Test That Matters

Before anything gets built, it must pass all five:

1. **Real Arabic search volume** — someone in the Arab world is typing this exact query today. If you can't name 3 real keyword phrases with genuine volume, it doesn't go on the list.
2. **AI chatbots can't replace it** — real-time data, live countdowns, city-aware results, persistent calculations. ChatGPT gives a formula; we give your answer.
3. **Global apps won't bother** — too Hijri-specific, too Gulf-law-precise, too Arabic-first for Google or a US startup to care.
4. **Mobile-native, not mobile-adapted** — designed for a 6" Arabic RTL screen from the first sketch. No desktop form shrunk to fit.
5. **Teaches while it answers** — user leaves knowing their situation, not just a number.

**Never build:** anything Google answers with its own widget · government portal brand queries · Saudi mortgage (bank-owned SERP) · medical diagnoses · anything that's just "same as competitor but Arabic" · anything that sounds clever but has no search query behind it

---

## Already Live

**Calculators:** age · annual-leave · bmi · building (materials hub) · car-loan · electricity-bill (SA+UAE) · end-of-service (SA+UAE+KW+QA+BH) · gpa + gpa-to-percent · gosi-retirement · inheritance · iqama · monthly-installment · net-salary · ovulation · percentage · personal-finance · pregnancy + pregnancy-weeks · salary · saudi-pay-dates (hub) · sleep (6 sub-tools) · vat · zakat (gold+jewelry) · investment (Islamic) · fasting (intermittent)

**Events (monthly payday):** salary-day + pension-day for SA, UAE, KW, QA, EG, OM, JO, BH · social-security-saudi · takaful-karama-egypt · citizen-account-saudi · social-security-qatar · pension-day-algeria

**Events (Islamic):** ramadan, eid-al-fitr, eid-al-adha, hajj, mawlid, nisf-shaban, ashura, isra-miraj, laylat-al-qadr, day-of-arafa, first-dhul-hijjah, islamic-new-year

**Events (national + school):** 50+ national days across Gulf/Levant/Maghreb · school-start + bac-results for 12 countries

---

## Build Queue

### P1 — مُخطط ختم القرآن في رمضان (Quran Completion Planner)
**Route:** `/calculators/ramadan-planner`
**Search evidence:** "خطة ختم القرآن في رمضان", "كم صفحة يومياً لختم القرآن في رمضان", "جدول ختم القرآن رمضان", "متى أنهي القرآن في رمضان" — these are top-searched Ramadan queries with millions of monthly searches during Ramadan season.
**Why we win:** We have the prayer times engine (iftar for your city) + Hijri calendar. Competitors give static PDF tables. We give: your reading pace → your exact finish date → daily page count → today's iftar time for your city. Personalised vs static.
**Mobile UX:** Step 1: pick city (for iftar times) → Step 2: slide your daily reading capacity (pages or juz) → Output: animated card showing finish date + daily target + days remaining. No login. Instant.
**Unique angle:** Women's Islamic purity option (hayd/tuhr tracking → adjusted page plan). No competitor touches this.
**RPM:** Medium (recurring daily Ramadan use — huge seasonal spike)
**Effort:** Medium — prayer engine + Hijri calendar already built.

---

### P2 — تحسين صفحات أوقات الصلاة (Prayer Page Depth)
**Route:** existing `/mwaqit-al-salat/[country]/[city]`
**Search evidence:** Prayer time pages are already our highest-traffic pages. "أوقات الصلاة [مدينة]" = millions of daily searches. This is not a new build — it's converting existing traffic to depth.
**What's missing:**
- Monthly prayer times table (scrollable, current month highlighted)
- "الصلاة القادمة خلال X دقيقة" visible above fold on mobile without scroll
- Qibla direction card (we already have the city lat/lon)
- 6 FAQ items per page (currently thin content)
**Why now:** We have traffic but low session depth → high bounce. Each improvement converts existing visitors, not hypothetical ones.
**Effort:** Medium — data exists, need UI work.
**RPM:** Medium (high volume, religious context = limited ad RPM but huge traffic base)

---

### P3 — حاسبة ضريبة الدخل المصرية (Egypt Income Tax)
**Route:** `/calculators/egypt-income-tax`
**Search evidence:** "حاسبة ضريبة الدخل مصر 2025", "كيف تحسب ضريبة الدخل في مصر", "شرائح ضريبة الدخل مصر 2025", "حاسبة صافي الراتب مصر" — Egypt = 105M people, salary/tax searches are massive.
**Why we win:** Egypt's income tax law changed in 2023 (new brackets). Most existing tools use old brackets. We verify from ETA (مصلحة الضرائب) directly and show: gross → net with bracket breakdown, plus social insurance deduction.
**Mobile UX:** Input salary → output: net salary card with color-coded tax brackets showing exactly which bracket each pound falls into. Simple, visual, Arabic.
**Unique angle:** Side-by-side before/after the 2023 reform — shows users who got a raise and who got a cut.
**RPM:** Medium (Egypt volume is massive but lower RPM than Gulf)
**Effort:** Small — same pattern as net-salary calculator.

---

### P4 — تحسين صفحات الإسلاميات الموجودة (Islamic Event Depth)
**Not a new build — targeted content improvements to existing pages with proven traffic:**
- **ramadan:** live countdown above fold on mobile + "متوقع فلكياً" label + moon-sighting caveat
- **eid-al-fitr / eid-al-adha:** estimated date with Islamic moon-sighting disclaimer above fold
- **hajj-season:** "إجازة الحج للموظفين السعوديين" section (Saudi workers search this heavily)
- **/date:** verify Hijri date is SSR-rendered above fold + internal links to pregnancy/age/ovulation
**Effort:** Small. Impact: +500–1,000/day from traffic already landing on these pages.

---

### P5 — مُقيِّم الصحة المالية الخليجية (Gulf Financial Health Score)
**Route:** `/calculators/financial-health`
**Search evidence:** "كيف أعرف وضعي المالي", "نسبة الادخار المثالية في الخليج", "هل راتبي كافي للادخار والاستثمار" — moderate volume but high intent.
**Why we win:** Gulf workers want a score, not a spreadsheet. We benchmark against Gulf-specific ratios: rent ≤30% salary, savings ≥20%, debt installments ≤35%. Output is a score/100 + 3 specific Arabic-language actions.
**Mobile UX:** 5 quick sliders (salary, rent, installments, savings, dependents) → score card + ranked actions. Cross-links to net-salary, EOS, zakat.
**Note:** Validate search volume from GSC before building. If "وضعي المالي" queries don't show up in impressions data after 60 days, skip.
**RPM:** Finance High
**Effort:** Small.

---

### P6 — مُحسِّن الإجازات (Leave Bridge Optimizer)
**Route:** `/calculators/leave-bridge`
**Search evidence:** UNVALIDATED — no confirmed high-volume queries yet. Concept: "أفضل توقيت للإجازة حول العيد" or "كيف أستغل إجازتي مع العطل". Check GSC impressions before building.
**Why we win (if search exists):** We have 123 events × 16 countries. Only tool that personalizes: "You have 14 days — here are the 3 best bridge windows in the next 6 months."
**Mobile UX:** pick country + remaining days → swipeable bridge cards.
**Action required:** Before building, verify Arabic search volume exists for bridge optimizer queries. If impressions < 500/month across related terms → skip permanently.
**RPM:** Medium

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
| Leave Bridge Optimizer | Build ONLY if GSC confirms >500/mo impressions on bridge queries |
| Gulf Financial Health | Build ONLY after 60 days of GSC data confirms intent queries landing |

---

## Search Volume Gate — Rule for All Future Items

Before any item enters the Build Queue, answer these three questions:

1. **Name the top 3 Arabic keyword phrases with volume.** If you can't name them without guessing, the item is not ready.
2. **Who is searching and why today?** (not "they might search for this") — name a real user persona and their real situation.
3. **Does a Google search for these phrases show thin/weak Arabic results?** If the SERP already has a strong Arabic tool, we need a clear differentiator.

Items that fail this gate go to a Parking Lot, not the Build Queue.
