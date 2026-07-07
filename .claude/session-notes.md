# Session notes — ar-clock / miqatona.com
Last updated: 2026-07-07 (night)

## Execution pass 3 (2026-07-07 night): backlog queue cleared + site-wide direct-address audit
Finished the remaining Wave 6/7 queue: `riyadh-season`, `asian-cup-2027`, `white-friday`,
`world-cup-2030` (already-drafted content, validated + synced live this pass), plus two NEW events
built fresh this pass — `school-holidays-france` (W7-6, French zone A/B/C 2026-2027 dates verified via
live web search against Légifrance/service-public.gouv.fr/education.gouv.fr) and `dst-usa` (W7-7, Nov 1
2026 fall-back / Mar 14 2027 spring-forward verified via web search, Arizona/Hawaii DST-exception angle
as the differentiator). Both strict-validated and `ci:check` green throughout.

**Owner directive mid-session**: every event must speak directly to the reader ("أنت") — never describe
them in the third person as "المستخدم"/"الباحث"/"الزائر". Ran a site-wide heuristic scan: found 72 of 151
live events in the banned register. Fixed via 5 parallel background-agent passes (salary-day-*,
pension-day-*, bac-results-*, national-day/independence cluster, support/social-benefit cluster — ~60
events) plus manual fixes for ~29 more stragglers caught on two follow-up broader-marker scans (US
holidays, seasons, misc national days). Root cause fixed too: `scripts/lib/event-scaffold.ts` +
`scripts/lib/content-normalizers.ts` (the `events:new` default templates) were rewritten to generate
direct-address copy by default, and `docs/add-new-event.md` got a permanent "write TO the reader" rule
section — future events should not need this retrofit. Full detail in the backlog doc's STANDING RULE
section at the top.

**Background-agent gotcha**: two of the five dispatched agents hit the session's API rate limit mid-run
and failed; resumed them via `SendMessage` to their `agentId` after the limit reset (~8 hours later per
the error message) rather than re-dispatching fresh agents — they picked up full context and finished
cleanly. If an agent notification says "hit your session limit," just resume it later; don't restart.

**events:fix-related bug got worse, not better**: this pass confirmed the bug also re-adds
YEAR-NUMBERED slugs (`world-cup-2030`, `asian-cup-2027`) into other events' `relatedSlugs` repeatedly
across every sync — and since the year lives in the slug string itself, this trips `hasHardcodedYear`
on whichever event links to them. Cleaned up by hand every time (`asian-cup-2027`, `pension-day-algeria`,
`riyadh-season`, `white-friday`, `world-cup-2030`) — see `.claude/rules/event-creation-lessons.md` §-1
for the permanent rule: never link TO a year-slugged one-time event from another event's `relatedSlugs`.

`ci:check` green (116/116) after all of the above. Next up: Wave 9 `rajab-start`/`shaban-start` (mid-shaban
and laylat-al-qadr already exist as `nisf-shaban`/`laylat-al-qadr`), Wave 8 still gated on Egypt-RPM
decision (~Jul 30).

## Execution pass 2 (2026-07-07 evening): 3 more events shipped, all committed/pushed by owner
Continuing directly from Wave 7 below, same session: `winter-time-germany` (W7-5), `buergergeld-germany`
(W7-3, caught the 6-day-old Bürgergeld→Grundsicherungsgeld rename — likely first Arabic coverage
anywhere), `dst-abolition-morocco` (Wave 6, confirmed exact decree date Sept 20 2026 — first real use
of the new `retirement` field), `winter-time-egypt` (Wave 6, confirmed Oct 30 2026 under Law 24/2023).
All verified via Puppeteer screenshots showing correct countdown dates matching official sources
exactly. Cross-linked from `/time-now/morocco` and `/time-now/egypt` (new conditional links, verified
in rendered HTML) in addition to the existing France/Germany links.
**Recurring gotcha, now fully documented**: every `events:sync` call's `events:fix-related` step
rewrites `relatedSlugs` on unrelated existing events (hit `ramadan`, `autumn-season`,
`summer-vacation`, `cost-of-living-allowance-bahrain` — same 4 files — on every single sync this
session). Reverted each time via `git checkout --`; added a standing rule to always `git status`
after `events:sync`. `ci:check` green (116/116) after every build in this pass.
Remaining Wave 6/7 queue: `school-holidays-france` (W7-6), `dst-usa` (W7-7), `riyadh-season`,
`asian-cup-2027`, `white-friday`, `world-cup-2030` (Wave 6) — see backlog doc for details.

## Ads/UX overhaul (2026-07-07) — uncommitted at session end unless committed later
1. **RTL ad centering fixed** (`src/app/styles/ads.css`): fixed-width creatives were hugging the
   visual right edge on desktop. Now `margin-inline:auto` + `text-align:center` on `.ad-slot > .adsbygoogle`
   and its child div.
2. **Banner clipping fixed**: AdTopBanner + AdEventsFeedHorizontal switched `data-ad-format`
   `auto → horizontal` (slots clamp height to 90–100px with overflow:hidden; auto served tall
   rectangles that rendered clipped). Watch AdSense fill rate for ~2 weeks after deploy.
3. **27" monitor rails**: ≥1800px rails widen 240→300px (enables 300×600, best desktop RPM size).
4. **Date converter UX**: `/date/converter` + both direction pages now use `heroCompact`
   (small H1, one-line lead, no eyebrow) and the tool renders BEFORE the top banner —
   tool is in the first mobile viewport. Verified via Puppeteer screenshots at 390/1366/2560px.
5. **time-now density**: country + city templates got a 2nd AdInArticle after the FAQ section
   (slot `mid-time-{country|city}-...-2`), matching the prayer-page ×2 pattern.

## Wave 7 shipped (2026-07-07, same session as strategy expansion below)
`caf-payment-france`, `kindergeld-germany`, `winter-time-france` — all live, `ci:check` green
(116/116 tests, lint/typecheck/seo:validate/geo clean). Full research-first: 9-11 competitors each,
verified facts from official sources (caf.fr/service-public.gouv.fr, arbeitsagentur.de,
service-public.gouv.fr + timeanddate.com). Cross-linked via intentCards + from time-now
France/Germany country and city pages (verified in rendered HTML). Screenshots confirmed countdown
computes the correct date on all three (CAF → Aug 5 2026, Kindergeld → Jul 15 2026, DST → Oct 25
2026).
Two engineering additions this session:
- `retirement` field on event packages for genuinely one-time events (auto-excludes from published
  index past `afterDate`, no manual unpublish/delete needed) — schema in package-schema.js, logic
  in generate-events-index.ts, documented in content-pipeline.md + add-new-event.md.
- Fixed a real date-engine bug: floating events with `nth: 5` silently computed wrong dates (skip
  to next year) in years where a month only has 4 occurrences of that weekday. Added `nth: -1`
  ("last occurrence") support to holidays-engine.js + package-schema.js, verified against
  timeanddate.com. This was a blocking correctness issue for winter-time-france and any future
  "last Sunday/Friday of month" event.

## Strategy expansion (2026-07-07, owner session)
Owner approved the DIASPORA tier: Arabic-language pages for Arabs living in France/Germany/USA
(Western RPM, near-zero Arabic competition). Backlog doc got Waves 7–9 + creative-feature audit +
$100–300 honest math. Sprint Week 2 repurposed: build `caf-payment-france` (Jul 12),
`kindergeld-germany` (Jul 15), `buergergeld-germany` (Jul 20), `winter-time-france` (Jul 25).
Egypt volume plays gated on ~Jul 30 RPM decision. Competitor alert: **time-now.me** ranks on
Arabic DST-France queries — direct competitor in our core niche.

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
