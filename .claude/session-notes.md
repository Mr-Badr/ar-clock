# Session notes — ar-clock / miqatona.com
Last updated: 2026-07-05

## Revenue target
$1,000/month in 3 months. Currently: ~100 visitors/day, ~$0.05/day.
Strategy: rank top 3 on 10–15 high-volume daily-use Arabic queries simultaneously.
Priority order: Egypt tools (105M people, thin competition) > Prayer page depth (existing traffic) > Levant > Morocco.

## What was done

### Shipped (2026-07-05) — Wave 5: monthly social-benefit events, all 6 + 1 optimization
Full research-then-build pass per event (parallel research agents + manual authoring), all live:
- `unemployment-grant-algeria` — منحة البطالة, 26/27/28 by CCP digit, 18,000 DA
- `direct-social-support-morocco` — corrected 400→250 DH/child figure; no fixed pay day (window 20-30)
- `national-aid-jordan` — 5 alphabetical letter groups (rotates monthly, not a fixed weekday)
- `saned-saudi` — GOSI unemployment insurance, added to `/calculators/saudi-pay-dates` hub table
- `social-welfare-iraq` — built as a status-tracker page (no fixed date exists), not a countdown
- `aman-social-tunisia` — debunked viral "350 DT" figure (separate tiny elderly program); real grant is 280 DT
- Optimized existing `takaful-karama-egypt` — added شروط/مبلغ/استعلام FAQs + 2 sources
Details + per-event research notes in memory `project-wave5-social-benefit-events`.

### Shipped (commit 9e99be0 → bca07bd, deployed 2026-07-01)
- **EOS franchise complete:** eos-kuwait · eos-qatar · eos-bahrain — mobile-first, country badges, entitlement bars
- **New calculators:** car-loan · gosi-retirement
- **UI/UX redesign (EOS):** no gradients, fixed Arabic letter-spacing, CSS variables, country identity badges + live dots
- **Bug fix:** CalculatorHero highlights — `{ label, desc }` objects now render correctly
- **Keywords:** Kuwait/Qatar/Bahrain EOS updated with action verbs, year tokens, specific scenarios
- **Holiday events:** 15+ new events (BAC BH/KW/UAE; pension BH/KW/OM/Algeria/Jordan; salary BH/JO/OM; school-start BH/JO/OM; social-security-qatar; uae-founding-day + more)
- **Rules:** `.claude/rules/calculator-ui-standards.md` added
- **Backlog:** rewritten with $1k revenue focus, search volume gate, Egypt/Jordan/Morocco priority

## Key decisions / corrections
- Gradients on calc cards → FORBIDDEN. Flat `var(--bg-surface-1)` + `border-top: 3px solid var(--green)`.
- `letter-spacing` on Arabic text → always 0.
- Hardcoded hex colors → always `var(--green-text)`, `var(--green-border)` etc.
- Seasonal-only tools (Ramadan planner) → parked until 8 weeks before the season.
- `related_not_reciprocal` is a WARNING (non-blocking) — does not block events:sync.
- `islamic_year_pair_missing` is a LIVE ERROR — Hijri event titles need `{{year}} - {{hijriYear}} هـ`.
- Prayer times from calculatePrayerTimes() are already ISO strings — never call .toISOString().
- Holiday sitemap must ONLY include canonical slugs (alias slugs would compete).
- Search volume gate: nothing enters Build Queue without 3 named Arabic keyword phrases with real volume.

## Current build queue (priority order)

| # | Item | Route | Effort | Why now |
|---|---|---|---|---|
| P1 | حاسبة نهاية الخدمة مصر | `/calculators/eos-egypt` | Small | 105M people, Law 12/2003, thin competition |
| P2 | اتجاه القبلة على صفحات الصلاة | add to existing prayer city pages | Very small | Daily search × 100+ cities = massive surface |
| P3 | جدول شهري + أسئلة — صفحات الصلاة | existing prayer pages | Medium | Convert existing traffic → monthly return visits |
| P4 | حاسبة ضريبة الدخل مصر | `/calculators/egypt-income-tax` | Small | 2025 brackets, competitors use outdated 2023 data |
| P5 | حاسبة نهاية الخدمة الأردن | `/calculators/eos-jordan` | Small | Completes Jordan profile, Law 8/1996 |
| P6 | حاسبة التأمينات الاجتماعية مصر | `/calculators/egypt-social-insurance` | Very small | Bundle with P4, same audience |
| P7 | تحسين صفحات إسلاميات موجودة | existing event pages | Very small | Ashura + Hijri New Year arriving July 2026 |
| P8 | حاسبة الراتب الصافي المغرب | `/calculators/morocco-net-salary` | Small | 36M people, CNSS+IR, no Arabic tool |

## Ad coverage (current state)

| Route | Top | InArticle | InFeed | Multiplex |
|---|---|---|---|---|
| /calculators/* | ✅ Hero | ✅ FAQ | — | ✅ Related |
| /holidays/[slug] | ✅ | ✅ ×2 | — | ✅ |
| /blog/[slug] | ✅ | ✅ ×2 | — | ✅ |
| /mwaqit-al-salat/* | ✅ | ✅ ×2 | — | ✅ |
| /time-now/* | ✅ | ✅ | — | ✅ |
| /date/* | ✅ | ✅ | — | ✅ |

## Blocked on (user actions required)
- Google Search Console: manually request indexing for eos-kuwait, eos-qatar, eos-bahrain
- GSC CSV export: needed to validate P5/P6 Leave Bridge and Financial Health volume
