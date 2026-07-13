# Session notes — ar-clock / miqatona.com
Last updated: 2026-07-13 (research-only checkpoint — owner asked for a fresh 3-events-per-country +
3-Islamic + 5-international research pass, NOT building yet; backlog doc rewritten with the findings;
then a follow-up correction pass added 4 more high-value Gulf/Saudi candidates)

## Checkpoint: Gulf/Saudi historical-milestone correction (2026-07-13, same day as Wave 11)
Owner pushed back: "add more events from Saudi and MENA/other Arab countries that will give us more
visitors and money." Re-examined Saudi/Kuwait/Qatar, which the first Wave 11 pass had wrongly marked
"saturated" — that pass only checked each country's *current official paid-holiday list*
(`country-hub-data.js`), which missed a whole category of massively-searched **historical-milestone**
dates that aren't "holidays" in the official-list sense but are hugely searched (same non-holiday,
historical-register pattern already proven by the live `badr-day`/`fath-makkah`). Found by switching
lenses:
- **`recapture-of-riyadh`** (Saudi, Jan 15, 1902 / 5 Shawwal 1319 AH) — Abdulaziz Al Saud's storming of
  Masmak Fort, the founding act of the modern (Third) Saudi State — genuinely distinct from the live
  `saudi-founding-day` (1727, First State) and `saudi-national-day` (1932 unification). One of the most
  culturally iconic moments in Saudi history with zero countdown page anywhere.
- **`independence-day-kuwait`** (Jun 19, 1961), **`independence-day-qatar`** (Sep 3, 1971),
  **`independence-day-bahrain`** (Aug 15, 1971) — all three are real, well-documented
  independence-from-Britain dates, each genuinely SEPARATE from that country's already-live National
  Day (which commemorates a ruler's ascension, not independence itself — Kuwait Feb 25/1950, Qatar Dec
  18/1878 founding, Bahrain Dec 16/1961). This is a real, common point of public confusion in all three
  countries and a completely untapped content angle.
- **Explicitly checked and confirmed NOT applicable**: UAE (Dec 2 National Day already IS the
  independence day — Britain's protection ended Dec 1, 1971, union+independence declared together
  Dec 2) and Oman (Oman was never a British protectorate the way Kuwait/Qatar/Bahrain were; Nov 18
  National Day already is the independence-equivalent). Algeria's independence itself is already live
  (`independence-day-algeria`, Jul 5, 1962) — the earlier Evian Accords ceasefire (Mar 18-19, 1962) is
  a real but much weaker/more niche diplomatic-history angle, noted as optional low-confidence only.

Backlog doc's Wave 11 section updated: these 4 candidates added at the top of 11A (highest RPM/priority
per owner instruction), and the "saturated" list corrected to explain exactly why Saudi/Kuwait/Qatar
were removed from it and why UAE/Oman/Algeria genuinely stay on it. Still research-only — nothing
built yet.

## Checkpoint: Wave 11 research pass (2026-07-13) — candidates identified, NOT built yet
Owner asked to research (not build) the next batch: 3 new events per country, 3 new Islamic events,
5 new international days — fixed/correct dates only, no exam/school, competitor-research-first +
direct-address-voice rule reinforced as mandatory for every future event. Method: cross-referenced
`src/lib/holidays/country-hub-data.js`'s per-country `holidays[]`/`observances[]` arrays (each row
already carries a legal source from the Wave 9 hub research) against `eventSlug: null` to find
pre-verified gaps fast, then fresh WebSearch for anything not covered there.

**Result — 24 country candidates across 13 countries** (Jordan, Oman, Palestine, Bahrain, Syria,
Yemen, Morocco ×1 each; Canada, France, Germany, Sweden, Lebanon, USA ×3 each) **+ 3 Islamic
candidates** (`battle-of-uhud` 7 Shawwal, `conquest-of-andalusia` 28 Ramadan, `fall-of-granada` 2
Rabi' al-Awwal — the latter two form a badr-day/fath-makkah-style historical pair) **+ 5 international
candidates** (Human Rights Day Dec 10, International Peace Day Sep 21, World Refugee Day Jun 20, World
Book Day Apr 23, World Tourism Day Sep 27). Full detail with sources in the backlog doc's new
"Wave 11" section.

**Important honest finding**: 8 countries (Saudi, Algeria, UAE, Tunisia, Kuwait, Qatar, Iraq, Turkey)
are genuinely saturated — their entire confirmed official holiday list is already built out, and
forcing 3 more per country there would mean inventing thin/duplicate/no-real-volume pages, which
violates the standing volume gate. Documented explicitly in the doc rather than silently skipped, so
a future session doesn't waste time re-researching them without a genuinely new lead.

**Two small technical notes for whoever builds `easter-syria`**: the main event engine
(`holidays-engine.js`) already supports `type: 'easter'` (Western, via `easterOffset`) but does NOT
yet support `orthodox-easter` — that rule type only exists in `country-hub.js` so far. Porting it
(same Meeus algorithm, already written) is a small prerequisite for a live-computed Eastern Easter
date. Also fixed a real small data bug found while cross-referencing events: `tax-day-usa` was missing
`_countryCode: "us"` in its `core` object since it was built — added and re-synced, `ci:check` green.

The backlog doc itself was substantially restructured: compressed the verbose Wave 6-10 build
narratives into a short summary (per the doc's own "delete shipped things" policy) to make room, and
added Standing Rule 8 (no exam/school in country quotas) plus reinforced rule 1/2 with the owner's
exact wording about human-facing, reader-centered, competitor-beating content. **Nothing in Wave 11
has been built yet** — next step is picking country/Islamic/international candidates in RPM order and
running the full research-first → scaffold → strict-validate → sync pipeline per item, same as every
prior wave.

## Checkpoint: Egypt trio shipped (2026-07-12, after tax-day-usa checkpoint) — plan now fully clear
With the RPM-is-not-a-blocker policy in place and the high-RPM queue empty, built the Egypt trio that
had been sitting "gated" for low RPM alone: `june-30-revolution-egypt`, `coptic-christmas-egypt`,
`evacuation-day-egypt` (built in that order — ranked by likely search volume). All facts re-verified
fresh via WebSearch (not reused from the old backlog note) per the owner's explicit instruction to
double-check information, dates, sources, and links: `coptic-christmas-egypt` confirmed a paid holiday
for ALL Egyptians via sis.gov.eg + labour.gov.eg (common wrong assumption it's Christians-only,
corrected in-content), with the real differentiator being that private-sector paid-holiday status
needs a separate annual Ministry of Labour announcement unlike the automatic government-sector listing.
`june-30-revolution-egypt` confirmed the Cabinet's recurring pattern of moving the paid holiday to the
following Thursday for a 3-day weekend (verified across several actual news announcements, but no
specific year was named in the published content — current-year and prior-year citations are banned by
the hardcoded-year rule, so the pattern is described generically as "in several recent years").
`evacuation-day-egypt` confirmed NOT a paid holiday (stated honestly) via ar.wikipedia.org +
almasryalyoum.com, with a real nuance: the actual British withdrawal from the last site (Port Said)
happened Jun 13, 1956 — 5 days before the official Jun 18 anniversary date. All 3 cross-linked into the
Egypt national-days cluster and (for evacuation-day-egypt) the 3-country "Jalaa" cluster with Syria and
Tunisia. 7/5+ keyword integration on all three, strict-validated, synced live, zero unintended
`events:fix-related` regressions (only 2 topical relatedSlugs swaps in the Egypt cluster, left as-is).
`ci:check` green (0 failures) after shipping; all 3 pages spot-checked live (200 OK) on the running dev
server. This closes out literally everything buildable in the current backlog — see the doc's own
"Blocked" table for what's left, all of it externally gated, nothing else to research right now.

## Checkpoint: backlog policy correction + `tax-day-usa` shipped (2026-07-12, after Wave 10 checkpoint)
Owner corrected the blocking policy: **low RPM must never fully exclude a candidate, only deprioritize
it** — only unverifiable dates, engine gaps, pending announcements, or missing search-volume proof
justify full exclusion. Backlog doc restructured accordingly: added standing rule 7 + a new "Blocked —
do not re-research until resolved" table right after Standing Rules (one row per dead-end slug + its
exact unblock condition), and reclassified the Egypt trio from "gated" to "fact-verified, low priority,
buildable any time." Also deleted `جمعة الوداع` from the plan per owner instruction (it's an engineering
task — add a computed submodule to `last-ten-nights-ramadan` someday — not a backlog content item).
`feedback-search-volume-gate` memory updated with the same correction so it persists across sessions.

With that filter applied, `tax-day-usa` was the only remaining unblocked, high-RPM candidate — built
same session: fixed April 15 deadline, weekend/DC-Emancipation-Day shift rule (2011→Apr 18, 2012→Apr 17,
both verified live via WebFetch against irs.gov ×2 + accountingtoday.com, not just search snippets),
Form-4868 filing-only extension to Oct 15 vs. the automatic no-paperwork 2-month extension to Jun 15 for
Americans abroad (the differentiator — no Arabic competitor covers the filing-vs-payment distinction or
the abroad angle). 7/5 keyword integration, `ci:check` green (116/116, 0 failures) after shipping. This
closes Wave 10 completely — nothing genuinely unstarted remains, only the items in the Blocked table.

## Checkpoint: WAVE 10 FULLY COMPLETE (2026-07-12) — 30+ events shipped in one continuous session
Finished every buildable item left in the backlog after the Wave 9 hub checkpoint below. In order:
1. **Wave 10D**: `nowruz-iraq` (federal-vs-Kurdistan-Region duration nuance, Kawa/Zahhak legend),
   `evacuation-day-tunisia` (Bizerte crisis 1961 → evacuation agreement 1963, distinguished from
   independence 1956 — a 7-year gap).
2. **Wave 10F Islamic events** (hijri type, all cross-linked, `tarwiyah-day` used as the exact
   template): `tasua-day` (9 Muharram, Ibn Abbas hadith on the Prophet's ﷺ intent to fast the 9th —
   kept to the Sunni fiqh angle only, no Karbala content, matching the live `ashura` page's register),
   `tashreeq-days` (11 Dhul-Hijjah anchor, content explains the 3-day span, fasting-prohibition +
   jamarat-timing table), `badr-day` (17 Ramadan 2AH, 313 vs ~950-1000, "يوم الفرقان"), `fath-makkah`
   (20 Ramadan 8AH, ~10,000-strong army, "اذهبوا فأنتم الطلقاء" — built as the pair with badr-day).
3. **Wave 10G international days** (`world-cancer-day` template, all fixed Gregorian, `countryScope:
   all`): `international-youth-day`, `world-water-day`, `world-happiness-day` (UAE Ministry of
   Happiness 2016 angle — deliberately did NOT cite a specific ranking number since it changes every
   report cycle), `world-no-tobacco-day`, `blood-donor-day` (Karl Landsteiner birthday angle),
   `nurses-day` (Florence Nightingale birthday angle), `april-fools` (multiple origin theories cited
   honestly, no single one asserted as fact; the شرعي-ruling question handled with strict neutrality
   per the backlog's own explicit instruction — cites that scholars differ, takes no house position).
4. **`geminids-meteor-shower`** — same "honest numbers" pattern as the live `perseids-meteor-shower`
   (theoretical 120/hr vs realistic observed 40-60/hr), differentiator: source is asteroid 3200
   Phaethon, not a comet.
5. **`csn-payment-sweden`** — researched and CONFIRMED via csn.se: day 25, moves EARLIER (never later)
   if it falls on a weekend/red day — completes the Sweden benefit cluster (barnbidrag 20th, pension
   18/19th, bostadsbidrag 27th, csn 25th), all four cross-linked.
6. **Researched and correctly did NOT build**: `kontantstotte-norway` (nav.no has no single confirmed
   fixed day for this specific benefit — don't fabricate one; `national-day-norway` stays blocked on
   this) and `salary-day-morocco` (every source found was a one-off Eid-linked early-payment
   announcement, not a genuine recurring TGR day — same failure mode as the already-rejected
   `salary-day-iraq`). Also correctly left alone: `dubai-shopping-festival` (exact dates not yet
   officially announced), `f1-bahrain-gp` (needs real GSC volume data this session didn't have),
   `tax-day-usa` (needs its own dedicated research pass), جمعة الوداع computed module (engine gap,
   not a content task — needs an engineering session on `last-ten-nights-ramadan`).

**Also fixed mid-session** (user-reported real production bug): `Date.now()` called directly in 4
bespoke calculator Server Components (`boernepenge-denmark`, `cgeb-canada`, `gulf-pay-dates`,
`soldes-france`) without prior uncached-data access — violates Next.js 16 `cacheComponents`. Fixed by
wrapping the date-dependent computation in an async `buildPageModel()` function marked `'use cache'`
with `cacheTag()` + `cacheLife('hours')`, called from an async page component. Same pattern already
established in `country-hub.js` — apply it to any future bespoke calculator page that reads
`Date.now()`/`new Date()` directly in a Server Component.

**`npm run ci:check` ran clean at the very end of this session: exit 0, 0 test failures** — only the
same pre-existing non-blocking `related_not_reciprocal` warnings (hundreds of them, harmless,
documented since Wave 7) plus one pre-existing `missing_date_confidence_disclaimer` on
`school-start-egypt` (not from this session) and one pre-existing `research_competitors_below_minimum`
on `republic-day-tunisia` (not from this session).

`docs/holiday-event-opportunity-backlog.md` updated to mark every shipped item, with the genuinely
still-open/gated items listed explicitly with their exact blocker (see the doc's "Wave 10 — build
order: DONE 2026-07-12" section) — read that section first before resuming backlog work, don't
re-research anything already marked SHIPPED or REJECTED above.

## Checkpoint: Wave 9 FULLY COMPLETE — 23 country hubs, 4 new events, full ci:check green
Fixed the standing `bh` taxonomy bug first (added to `taxonomy/countries.json`). Added 4 new rule
types to `country-hub.js` (reusable by every future hub, sufficient for any country going forward):
`floating` (nth-weekday), `easter` (Western Gauss algorithm + offset), `orthodox-easter` (Julian
algorithm + 13-day offset, for Lebanon's dual Easter observance), `weekday-in-range` (e.g. Sweden's
"Saturday within Jun 20–26"). Shipped ALL remaining Wave 9 hubs in one session: Qatar, Bahrain, Oman,
Germany, Sweden, France, Canada, USA, Turkey, Morocco, Algeria, Tunisia, Jordan, Egypt, Iraq, Libya,
Syria, Yemen, Palestine, Lebanon (20 new, +3 from last session = 23 total live). Lebanon is an
entirely NEW country added to `taxonomy/countries.json` (code `lb`) with 3 new events built same
session (`independence-day-lebanon`, `army-day-lebanon`, `annunciation-day-lebanon` — the world's only
joint Christian-Muslim national holiday). `friendship-day` event also shipped (Jul 30). Every hub's
differentiator + verified facts are logged in the backlog doc's Wave 9 section (§9.5, items 2-5) —
don't re-research, read those notes first before touching any of these countries again.
**Full `npm run ci:check` ran clean at the end of this batch: exit 0, 0 test failures**, only
pre-existing non-blocking `related_not_reciprocal` warnings plus 2 pre-existing unrelated warnings
(school-start-egypt, research_competitors_below_minimum on 2 old events — not from this session).
All hubs Puppeteer-verified at mobile+desktop widths. Dev server left running in background
(`nohup npm run dev`) — check for a stale process before starting another one (Turbopack cache
corruption from overlapping dev servers is a known recurring bug).

**Reusable research shortcut discovered this session**: when building a country's hub AND that
country's Wave 10 diaspora-day candidates in the same session, the hub's own research pass usually
already covers the facts needed for the individual event pages (e.g. Turkey hub research covered all
4 Wave-10C Turkey candidates; Germany/Sweden/France/USA/Canada hub research covered their respective
Wave-10C candidates too) — check the hub research notes before dispatching a fresh research agent.

Next in this same session: Wave 10 events using the above shortcut (Turkey x4, Germany, Sweden,
France, USA x2, Canada — cheap since already researched), then Wave 10D/F/G remaining items.

## Session 2026-07-11/12: clockzone competitor research → Wave 9/10 plans → country hubs + 3 events shipped
**Research**: full clockzone.net/ar scrape (owner-named competitor). Verdict: programmatic multi-locale
machine, 404s all of KW/QA/OM/JO/IQ/SY/YE/PS/LB, zero Islamic events, no Hijri anywhere, broken
template Arabic («السعودية عطلات»), doesn't rank top-10 for the head queries. REAL incumbent =
alejazat.com (native Arabic, 22 countries, 2024–2036 year pages — but static, no countdowns, no
Hijri). Full intel table + Wave 9 (country holiday-calendar hubs) + Wave 10 (35 new fixed/monthly
event candidates incl. Islamic/international countryScope:all) written into the backlog doc.

**Shipped this session (all ci:check green, 116/116)**:
1. **Country holiday-calendar hub TOOL** — `/holidays/country/{saudi-arabia,kuwait,uae}` + ICS
   download routes. New libs: `src/lib/holidays/country-hub-data.js` (verified official lists) +
   `country-hub.js` (computed model via 'use cache'). Premium mobile-first page verified via
   Puppeteer at 390/1366px. Event pages link up via HolidayInternalLinks. Traps documented in the
   backlog Wave 9 section: no `revalidate` with cacheComponents ('use cache'+cacheLife instead),
   Date.now() only inside cached scope, roughHijri drift (Mawlid Aug 30 vs correct Aug 25 — only
   trust resolver isoString, else convertHijriDayForCalendar), toISOString() local-midnight day-shift,
   hub URLs go in site-architecture.js NOT holidays sitemap (seo-sitemap tests enforce).
2. **khareef-salalah** (Oman season, live now → immediate Gulf-RPM traffic), **pension-day-france**
   (monthly day-9, zero Arabic competition), **perseids-meteor-shower** (Aug 12–13 peak, 4-week
   indexing runway) — all strict-validated + synced; 222 events live now.

**Next up (Wave 9/10 queues in backlog)**: BH taxonomy fix (bh missing from countries.json despite 7
live BH events!) → QA/BH/OM/DE/SE hubs → friendship-day (Jul 30) → victory-day-turkey (Aug 30) →
Lebanon country add. AdSense dashboard toggles still pending (user action).

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
