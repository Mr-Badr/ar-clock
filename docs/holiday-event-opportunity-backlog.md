# Build Backlog — miqatona.com (forward-only)

Rewritten clean: 2026-07-08, restructured 2026-07-13 (compressed all shipped Waves 6-10 into a short
summary per the doc's own policy — full detail lives in git history + `.claude/session-notes.md` +
memory, not here). **This doc contains ONLY things not yet built.** When an item ships, DELETE it from
here.

Targets: **$100–300 in the Aug 8 → Sep 8 AdSense window · 3,000 visitors/day at the August peak**
(baseline today ≈ 120/day, ≈ 0.6 MAD/day).

---

## Standing rules (gate every item below — apply to every event, past, present, and future)

1. **Write TO the reader, never ABOUT them — non-negotiable, re-confirmed 2026-07-13.** Every
   user-facing field (`answerSummary`, `aboutEvent`, `faq`, `history`, `significance`, `details`)
   must speak directly to the person searching, second person ("أنت"/"لك"), like a knowledgeable
   friend — never describe them in the third person as "المستخدم"/"الباحث"/"الزائر". The content must
   read as **rich, enjoyable, human**, not a bureaucratic answer-sheet: real numbers, the fact
   competitors got wrong, a genuine differentiator — and it must make the reader understand the
   information as smoothly and clearly as possible. Full rule + validator mechanics in
   `.claude/rules/event-creation-lessons.md` §-1.
2. **Research-first, always — no exceptions.** Never scaffold an event before: (a) scraping/reading
   the top 3-5 Arabic + top 3-5 English competitors for that exact query, (b) confirming the page will
   be **objectively better** — richer facts, a real differentiator, better structure — not just
   "another page on the topic", (c) verifying every date/number against a primary or clearly
   independent source (not a single aggregator). If a candidate below doesn't clear this bar at build
   time, don't build it — flag it back to this doc instead.
3. **AI-resistant pages only**: every new page must contain a live computed element a chatbot can't
   substitute — countdown to a verified date, a computed fact, an updating tracker — wrapped in rich
   content. Static "what is X" answer pages are banned.
4. **Volume gate**: only build events people **genuinely search for**. Real, nameable search intent —
   not a manufactured or thin topic. If a candidate's real-world search volume can't be reasonably
   argued for, it doesn't belong in the queue, no matter how "complete" it makes a category feel.
5. **Never build**: government-portal-resolved intents · live price feeds · per-claim payment dates
   (no shared calendar day) · astrology · Sudan-targeted pages. Syria/Yemen/Libya/Palestine ARE in
   scope (live `/holidays` countries) — treat as traffic/authority plays, not revenue plays; never let
   one displace a high-RPM item in the queue.
6. After every `events:sync`: `git status` — the `events:fix-related` step rewrites `relatedSlugs` on
   unrelated events and can re-inject year-numbered slugs. Never link TO a year-slugged one-time event.
7. **RPM alone never excludes a candidate — it only deprioritizes it.** Low RPM is a queue-position
   signal, not a build-blocker: a low-RPM item with confirmed volume and a verifiable date is fine to
   build, it just sits behind every high-RPM/high-volume item. The ONLY reasons to fully exclude a
   candidate: (a) no verifiable shared date, (b) an engine capability gap, (c) a pending external
   announcement, (d) missing search-volume proof. Check the "Blocked" table below before researching
   any candidate already listed there.
8. **No exam/school/bac-results events in new country quotas** — the existing `bac-results-*`/
   `thanaweya-*`/`school-start-*` pages stay and keep their annual freshness task, but new
   country-quota candidates must be genuine civic/cultural/religious observances instead.
9. **No Christian-theological-content events (owner instruction, 2026-07-14).** Do not build events that
   affirm or explain Christian theological claims (Resurrection, Epiphany, Feast of the Cross, etc.) —
   the owner is Muslim and does not want the site publishing content on a religion's core claims he
   holds to be doctrinally incorrect. This is a standing content-policy line, not a per-event volume call.
   `coptic-easter-egypt` and its sibling Egypt Coptic-calendar candidates were dropped for this reason —
   see the Rejected section below. Full detail + the still-open question about earlier-built Christian
   civic-holiday pages: memory `project-rejected-event-candidates`.
10. **Islamic-content sourcing standard (owner instruction, 2026-07-14).** Every fact/date for an
    Islamic-calendar or Islamic-history event must be verified against mainstream **Sunni** sources —
    islamweb.net, islamqa.info, awkafonline.gov.eg, dorar.net, mawdoo3.com, islamstory.com,
    ar.wikipedia.org (neutral) are acceptable; never cite Shia-specific sources (ar.wikishia.net etc.)
    for sourcing facts. Applies to every Islamic event, not only contested/sectarian topics — this is the
    same reasoning behind the Ghadir Khumm skip decision, generalized to a sourcing rule for all Islamic
    content, existing and future.
11. **Content quality bar, restated (owner instruction, 2026-07-14).** Every page must be genuinely
    enjoyable and easy to learn from — smooth, human, reader-centered Arabic (not stiff or robotic),
    teaching the reader like a knowledgeable friend (see rule 1 and the `arabic-content-writing` skill),
    while still beating competitors on SEO fundamentals (keyword integration, structured FAQ, real
    differentiators). "Correct and fact-checked" and "enjoyable to read" are not in tension — do both on
    every page, not one at the expense of the other.

---

## Blocked — do not re-research until resolved (check this FIRST, before any new candidate research)

All 7 rows below were re-verified fresh via WebSearch/WebFetch on 2026-07-14 — every blocker still
holds, none unblockable right now. Don't re-check again until the "unblock condition" column changes.

| Slug | Blocker | Unblock condition |
|---|---|---|
| `kontantstotte-norway` | Re-verified 2026-07-14: every source (nav.no's own site, babyverden.no, other trackers) still only says "rundt den 20." (around the 20th) with "nøyaktige datoer kan variere" (exact dates may vary) — no single confirmed fixed day found | Pull the actual 2026/2027 payment-date list directly from nav.no/utbetalingsdatoer (nav.no blocked WebFetch this session — may need manual browser check) |
| `national-day-norway` | Blocked on `kontantstotte-norway` (Norway hub-unlock plan needs it as the 3rd event) | Same as above |
| `salary-day-morocco` | Re-verified 2026-07-14: fresh search still only surfaces one-off Eid-linked early-payment news (e.g. May 20, 2026 tied to Eid al-Adha), never a recurring monthly TGR day | A primary source (TGR/Ministry of Finance) stating a genuine recurring shared day |
| `f1-bahrain-gp` | Sports-SERP risk; needs a real keyword-volume check | GSC data confirming date-intent queries beat race-coverage-intent — **needs the user's Search Console access, not researchable via web search** |
| `tax-refund-usa` | No confirmed Arabic search volume yet | 3 GSC-confirmed Arabic keyword phrases with real volume — **needs the user's Search Console access, not researchable via web search** |
| `dv-lottery` status tracker | Re-verified 2026-07-14: still suspended (correction — suspended **2025-12-18**, not Mar 2026 as previously noted here), no reopening date announced; DV-2026 selectees lose eligibility if not issued by 2026-09-30 | Check travel.state.gov for a reopened window |
| `vat-filing-deadline-saudi` (ZATCA VAT إقرار) | Engine gap, found 2026-07-17: real deadline is "last calendar day of the month following the tax period," but `holidays-engine.js`'s `type: 'monthly'` only supports a fixed numeric day, not "last day of month" (28-31 varies) | Add a `lastDayOfMonth`-style rule to `holidays-engine.js` (same class of fix `nth: -1` solved for floating weekday events) — an engineering task, not a content task |
| `salary-day-algeria` | A 2026 full-year payment calendar mostly fits "day 27, shift to Thursday if Fri/Sat," but May 2026 pays 3 days early (24th) and June 2026 pays 1 day late (28th) — likely an unconfirmed Eid al-Adha adjustment, single tweet-thread source only | An official multi-year source confirming the Eid-adjustment pattern, or engine support for per-month overrides |
| `pension-day-tunisia` | CNSS/CNRPS weekday-based pay pattern confirmed for one month only (July 2026: CNSS Thu 23rd, CNRPS Fri 24th) — not enough to confirm a repeatable formula | 2+ more months of confirmed CNSS/CNRPS pay dates to pin the exact weekday rule |
| `battle-of-mutah` | Month + year solid (Jumada al-Awwal, 8 AH) but no source gives a specific day-of-month | A primary-source-adjacent reference (e.g. Ibn Hisham's Sira) pinning the exact day |
| `election-day-usa` | Recurs biennially, not annually — the engine's `repeatFrequency` computation assumes `P1Y` | Engine support for a `P2Y`-style repeat frequency before building as a countdown |
| `back-to-school-tax-free-usa` | Real high-RPM gap, but ~17 different state dates — doesn't fit a single-event countdown format | Build as a hub/table page (same pattern as the Saudi pay-dates hub), not a `holidays` event |

**Not a blocker, just low priority (buildable any time, RPM-only reason):** none currently — the Egypt
trio that used to sit here shipped 2026-07-12.

**Flagged — needs explicit owner sign-off before building (found 2026-07-19, Algeria diaspora pass):**
Algeria's **National Memory Day** (May 8, 1945 Sétif/Guelma massacre) and **National Immigration Day**
(Oct 17, 1961 Paris massacre) are real, officially observed, and genuinely high dual-relevance (Algeria +
large France-diaspora audience) — but both center French state violence against Algerians, same risk
class as the already-rejected Lebanon Hariri/Resistance Day topics. Do not build unilaterally; needs the
owner's explicit go-ahead on framing before any research/scaffolding starts.

**Kurdistan Flag Day** (Dec 17, Iraq/Kurdistan region, found 2026-07-19) — KRG-parliament-decreed since
2009, rooted in a real historical date (1946 Mahabad Republic), genuinely low competition (regional news
portals only, no countdown format). Not built: it's Kurdistan-region-only (a new sub-national-page
pattern for this site) and touches Kurdish national symbolism in a country with a fragile Baghdad–Erbil
relationship — same judgment-call class already reserved for owner sign-off (Ghadir Khumm,
`king-salman-bayah-saudi`). Do not build without explicit go-ahead.

**Ghadir Khumm / Eid al-Ghadir** (18 Dhul Hijjah, 10 AH, found 2026-07-14) — the date itself is
essentially undisputed even in Sunni hadith collections, but the occasion's meaning is the entire
Sunni-Shia fault line (Sunni: praise of Ali's virtue; Shia: explicit succession/Imamate designation).
Arabic Wikipedia's own article opens by calling it "a holiday celebrated by Shia"; search volume
concentrates almost entirely in Shia-majority/mixed populations (Iraq, Bahrain, Lebanon), not this
site's stated core Sunni-majority markets. Recommendation is to skip for brand positioning, but this is
an editorial-stance call, not a pure fact question — flagged rather than decided unilaterally. Do not
build without explicit owner sign-off. (This is also the basis for standing rule 10's Islamic-sourcing
policy — see Standing rules above.)

---

## THE BUILD LIST (priority order)

**Priority rule: high-RPM countries FIRST — Gulf, Europe (diaspora), US — before any volume play.**
Low-RPM items (Maghreb, Egypt, Syria/Yemen/Libya/Palestine traffic-plays) are NEVER excluded for RPM
alone — they build whenever the high-RPM queue is empty, ranked by search volume among themselves.

---

**Checked and dropped (don't re-research):**
- Belgium National Day (real Arabic incumbent, belg24.com) and Groeipakket/kinderbijslag (regionalized
  since FAMIFED's 2020 abolition, no single government source of record — multi-fund patchwork).
- Australia Day (SBS Arabic — government-funded — already runs deep Arabic coverage; also carries live
  "Invasion Day" political controversy, unnecessary reputational risk vs. the site's other neutral
  national-day pages).
- Austria/Switzerland — Turkish populations too small (~120-125K), no fixed-date benefit program found.
- Dubai Shopping Festival-style additions for Abu Dhabi ("Summer Season")/Sharjah ("Summer Surprises") —
  both read as diffuse entertainment-calendar umbrellas, not a crisp single discount event like DSF.
  Qatar/Bahrain: no comparable branded shopping season exists at all.
- Egypt Police Day — already fully covered inside `january-25-egypt`'s existing `richContent` (explicit
  "عيد الشرطة وثورة 25 يناير" framing + FAQ).
- Morocco/Tunisia/Kuwait/Jordan national Teacher's Day and Environment Day — all resolve to the same
  UN/UNESCO dates already built (`world-teachers-day`, `world-environment-day`); Morocco/Jordan police
  founding-days are real but institutional-PR-only sourcing, zero general-public search-behavior evidence.

---

## Completed waves (compressed summary — full detail in git history + `.claude/session-notes.md` + memory)

- **Tier 1-3 + Wave 6/7/8** (2026-07-08 → 2026-07-11): diaspora France/Sweden/USA/Canada benefit
  pages, global + Islamic events (`world-cancer-day`, `arab-orphan-day`, `tarwiyah-day`,
  `last-ten-nights-ramadan`, `six-days-shawwal`, `international-coffee-day`), all 19 countries' 3-event
  national-day quota (57 events), 3 blog-equivalent pages (`hijri-months`, prayer-calc guide,
  `gulf-pay-dates` hub). All shipped, `ci:check` green throughout.
- **Wave 9** (2026-07-11/12): 23 country holiday-calendar hubs at `/holidays/country/<slug>` (SA · KW ·
  AE · QA · BH · OM · DE · SE · FR · CA · US · TR · MA · DZ · TN · JO · EG · IQ · LY · SY · YE · PS ·
  LB), 6 new engine rule types added to `country-hub.js` (`floating`, `easter`, `orthodox-easter`,
  `weekday-in-range`, plus the existing `fixed`/`hijri`).
  Lebanon added as a brand-new country + 3 events.
- **Wave 10** (2026-07-12): 31+ events — Wave 10D Arab fixed-dates, 10F Islamic hijri events, 10G
  international days, `geminids-meteor-shower`, `csn-payment-sweden`, `tax-day-usa`, and the Egypt trio
  (`coptic-christmas-egypt`, `june-30-revolution-egypt`, `evacuation-day-egypt`).
- **Wave 11** (2026-07-13 → 2026-07-14): 37 events shipped, 0 blocked — 3 Gulf independence days, 27
  country-specific holidays across USA/Canada/France/Germany/Sweden/Lebanon/Jordan/Oman/Palestine/
  Yemen/Morocco/Bahrain, 3 Islamic historical events (`battle-of-uhud`, `conquest-of-andalusia`,
  `fall-of-granada`), 5 UN/international observance days, plus `bahraini-womens-day`, `easter-syria`,
  `midsummer-sweden`, `all-saints-sweden` (all 4 initially blocked, cleared same wave). Added
  `weekday-in-range` and `orthodox-easter` as individual-event engine types (previously summary-only in
  `country-hub.js`), corrected a stale Syria holiday list, ran full ci:check green throughout.
- **Wave 12** (2026-07-14 → 2026-07-15): 16 events — `battle-of-khandaq`, `wafat-khadija`,
  `victoria-day-canada`, `washington-birthday-usa`, 4 UN international days (`autism-day`, `family-day`,
  `charity-day`, `disability-day`), `winter-at-tantora-alula`, `labor-day-canada`/`family-day-canada`/
  `christmas-canada`, `all-saints-day-france`, the France/Germany Easter-cycle set
  (`easter-monday-*`/`whit-monday-*`/`ascension-day-france`, owner-approved via AskUserQuestion, framed
  strictly civic/legal), `epiphany-sweden`, `asir-summer-season`/`diriyah-season`, plus
  `volunteer-day`/`food-day`/`literacy-day`/`wildlife-day`. Egypt's Coptic-calendar track was proposed and
  then owner-rejected as a standing content-policy line (see Rejected section). Also fixed 32+12 events
  whose `country-hub-data.js` row still pointed `eventSlug: null` despite being live. `ci:check` green
  throughout.
- **Wave 13** (2026-07-17, research-only pass): no new events — surfaced `saudi-cup` and `khaleeji-27`
  as ready-to-build (both shipped in later waves) and `kinderbijslag-netherlands` (still unbuilt, low
  priority — new-country lift not yet picked up).
- **Wave 14** (2026-07-17/18): 10-country national-event coverage audit found UAE/Qatar/Kuwait fully
  saturated; shipped 9 events for the other 7 — `constitution-day-lebanon` (2026 centennial angle),
  `national-charter-day-bahrain`, `flag-day-jordan`, `royal-accession-day-jordan`,
  `suez-canal-nationalization-egypt`, `armed-forces-day-morocco`, `martyrs-day-lebanon`,
  `muscat-festival-oman`, and `king-salman-bayah-saudi` (owner-approved via AskUserQuestion, framed
  strictly factual/neutral toward a living monarch). `ci:check` green.
- **Wave 15** (2026-07-18): UK added as a new country (`country-hub-data.js`, full 8 bank holidays) +
  5 events — `boxing-day-uk`, `guy-fawkes-night-uk`, `christmas-uk`, `good-friday-uk`, `easter-monday-uk`.
  All civic/legal/cultural framing only, no theological-content affirmation.
- **Wave 16** (2026-07-18/19): 3 France/US events (`fete-du-travail-france`, `cinco-de-mayo-usa`,
  `fete-de-la-musique-france`) + 3 more UK bank holidays (`early-may-bank-holiday-uk`,
  `spring-bank-holiday-uk`, `summer-bank-holiday-uk`) + 2 Saudi calculators (`domestic-worker-cost`,
  `iddah`). MENA salary/pension research found real gaps in Algeria/Morocco/Tunisia but held them on
  data-correctness grounds (see Blocked table). `universal-credit-uk`/`child-benefit-uk` confirmed not
  buildable (see Rejected). Also removed 14 stale `docs/*.md` files.
- **Wave 17** (2026-07-19): `king-abdulaziz-camel-festival-saudi` (300M+ SAR prize pool, verified fixed
  Dec 1 date) and `dubai-shopping-festival` (resolved a Blocked-table item sitting since Wave 12/13 via
  non-visitdubai.com official sourcing).
- **Wave 18** (2026-07-19): broad growth push — 1 Islamic tool + 11 holiday events across Saudi/GCC/
  UK/Canada/Algeria (diaspora angle). Flagged Algeria's Memory Day/Immigration Day for owner sign-off
  (see Flagged section) rather than building unilaterally.
- **Wave 19** (2026-07-19): remaining MENA/Gulf gap sweep — confirmed Iraq/Libya/Yemen fully saturated
  and Gulf calculators fully mined out by khaleejcalculators.com (documented in the calculator backlog
  section below); shipped 4 events — `christmas-syria`, `orthodox-easter-syria`,
  `orthodox-christmas-palestine`, `tree-day-tunisia`.
- **Wave 20** (2026-07-21): 16 of 17 researched candidates shipped — `teachers-day-egypt`,
  `kinderbijslag-netherlands` (new country, first to use the new `quarterly` engine type: Jan 2/Apr 1/
  Jul 1/Oct 1), `national-day-spain`, `abu-simbel-sun-alignment-october`, `national-press-day-algeria`,
  `cairo-international-film-festival`, `qurain-cultural-festival-kuwait`, `teachers-day-saudi`,
  `education-day-uae`, `doctors-day-egypt`, `abu-simbel-sun-alignment-february`, `kings-day-netherlands`,
  `babylon-international-festival-iraq`, `armed-forces-day-uae`, `jerash-festival-jordan`,
  `carthage-international-festival-tunisia`. `journalists-day-egypt` deliberately held back (owner
  chose "leave it out" for the political-sensitivity flag) — do not build without explicit owner
  go-ahead. `quarterly` engine type added to `holidays-engine.js` for this wave (same class of addition
  as `nth: -1`/`floating`/`easter` in earlier waves).
- **Recurring engine additions across these waves** (all in `holidays-engine.js` / `country-hub.js`):
  `retirement` field (auto-unpublish), `nth: -1` (last weekday of month), `floating`, `easter`,
  `orthodox-easter` (Meeus algorithm), `weekday-in-range`.
- **Recurring bugs fixed at the source**: the `events:fix-related` year-numbered-slug regression
  (`scripts/lib/event-scaffold.ts` / `content-normalizers.ts`), the direct-address-voice register
  (same scaffold files), the `Date.now()`/`cacheComponents` Server Component crash (fix pattern:
  `'use cache'` + `cacheTag` + `cacheLife('hours')`, applied to 5 pages so far).

---

## Rejected — with evidence, don't re-litigate

- **Arabic timer/alarm/stopwatch suite** — v-clock.com/clockly.online own this SERP natively; re-confirmed
  2026-07-11 against clockzone.net too. Skip.
- **GPA / النسبة الموزونة / Zakat calculators** — established Saudi/Kuwaiti authority tools own these
  SERPs (moasher.online, ehsan.sa, official university calculators). Crowded, unbeatable.
- **Saudi university admission results, Germany Rente day, USA SNAP, UK child benefit** — all fail the
  "no per-claim/no-shared-calendar-day" rule outright.
- **`flag-day-qatar`, `accession-day-qatar`** — verified NOT recurring annual observances (one was a
  protocol law misattributed as a holiday, the other a genuine one-time transition-day closure that
  never recurred). Do not rebuild without a primary source.
- **`salary-day-iraq`, `salary-day-morocco`** — no shared calendar day, news/ministry-driven timing only.
- **World Down Syndrome Day (Mar 21)** — collides with the site's live `mothers-day` (also Mar 21, one
  of the biggest evergreen pages) — splits internal relevance for near-zero added volume.
- **International Day for the Elimination of Racial Discrimination (Mar 21)** — same Mar 21 collision
  with `mothers-day`, found during the 2026-07-13 research pass. Skip for the same reason.
- **يوم القدس العالمي** — politically-affiliated observance (Iran-instituted); fails the neutral-brand
  test. Never build.
- **Novelty "days" (chocolate/pizza/emoji/left-handers…)** — real listicle volume but zero countdown
  intent + brand dilution; blanket skip.
- **World Cup 2026 hub/tracker, Australia Family Tax Benefit** — SERP owned by major sports media /
  fails the no-per-claim-date rule, respectively.
- **Egypt Coptic-calendar content** (`coptic-easter-egypt` + siblings `eid-al-ghitas-egypt`,
  `nayrouz-egypt`, `eid-al-salib-egypt`) — standing content-policy rejection (owner instruction,
  2026-07-14, see Standing rule 9): the site does not publish/affirm Christian theological content
  (e.g. the Resurrection). `coptic-easter-egypt` was fully authored and fact-checked before being
  deleted unpublished. Do not re-propose Coptic or other Christian-theological-content events.
- **Lebanon's Hariri assassination anniversary and "Resistance and Liberation Day"** — both real,
  dated, well-covered occasions, but centered on politically loaded framing that fails the neutral-brand
  test. Do not build without a fundamentally different, explicitly owner-approved framing.
- **`universal-credit-uk` / `child-benefit-uk`** — confirmed not buildable (re-verified directly against
  gov.uk, 2026-07-19): both pay on a personal, rolling date tied to each claimant's own claim history,
  not a shared calendar day — the exact case Standing Rule 5 bans. Would need a new explainer-only page
  format the events system doesn't have; if ever revisited, treat as a new content type, not a `holidays`
  event.
- **`taif-rose-festival`** — thin competition, but the organizers themselves postponed the 2026 edition
  twice (weather-driven crop decline, contradicting their own "bumper harvest" announcement), plus a
  prior COVID-era postponement. Fails the reliable-annual-date gate regardless of competition thinness.
  Don't rebuild without a source confirming 2-3 consecutive on-schedule years.
- **`salary-day-palestine`/`salary-day-libya`/`salary-day-yemen`/`salary-day-syria`/`salary-day-iraq`** —
  all confirmed not viable: irregular/partial payment, staggered per-bank rollout, dual-authority splits,
  post-transition flux, or a 20th-30th ministry-dependent range — none has a single shared recurring day.

---

## The honest math

$100/mo ≈ 33 MAD/day · $300/mo ≈ 100 MAD/day.

- **RPM shift**: France/Sweden/USA pages at Western RPM (est. 15-40 MAD/1000) pull the daily average up
  as they index. Wave 11's Canada/France/Germany/Sweden/USA candidates all ride this same high-RPM tier.
- After Wave 10 + Wave 11 build out: every existing high-RPM surface stays evergreen (Sweden ×4 now
  with CSN, USA ×2 with tax-day, France ×2/yr) plus whatever of Wave 11's 29 country events +
  8 Islamic/international events get built.

## Monitoring calendar (forward only)

- **Jul 20**: Algeria BAC results day — flip `bac-results-algeria` to results-live mode.
- **Late Jul**: Egypt Thanaweya results — same flip for the relevant page.
- **Aug 1-23**: Mawlid (Aug 25) position watch — pool historically inflates 5-10×. Saudi school
  calendar freshness pass. `bac-results-jordan` readiness (~early-mid Aug).
- **~Aug 20**: GSC hub-impressions check ("العطل الرسمية في X" variants) — if indexing, add Gulf
  `{{nextYear}}` sub-pages.
- **AdSense dashboard toggles — USER action, 10 minutes, STILL PENDING**: side rails ON · anchor incl.
  wider screens · vignette both platforms · in-page ≈ medium. Multiplies every other item; stays at
  the top of every checklist until done.
- **~Dec 1**: pre-Ramadan ramp begins (Ramadan 1449 ≈ Feb 2027) — all hijri pages auto-roll, verify
  titles.

---

# CALCULATORS & COMPETITIVE FEATURES BACKLOG (added 2026-07-17)

Goal, in the owner's own words: **beat khaleejcalculators.com and other named competitors, become #1 in
Arabic content** — not by copying their catalog, but by (a) closing genuine content gaps proven by real
search demand, and (b) matching/exceeding the growth mechanics they use, not just their tool count.

## Standing rules for this section (gate every item below)

1. **Never build Qibla-direction tools** (owner instruction, 2026-07-17) — do not re-propose regardless
   of any future competitive gap found. The existing `QiblaCompass.client.jsx` component and its removal
   from city prayer pages is a closed matter; leave it as-is.
2. **Never build a new Zakat-themed calculator** (owner instruction, 2026-07-17 — "do not do zakat"). This
   includes Zakat al-Fitr, Zakat on crypto, or any other Zakat variant. The existing general
   `/calculators/zakat` (money/gold/silver/investments) stays live and untouched — this rule is about NOT
   adding to that space, not removing what exists.
3. **Research-first, same bar as holiday events**: verify real Arabic competition via WebSearch/WebFetch
   before building anything, name real competitors explicitly, don't guess demand. A candidate that
   duplicates or heavily overlaps an already-live tool (see the full inventory cross-check note below) is
   rejected regardless of how good the idea sounds in isolation.
4. **3+ real Arabic keyword phrases with plausible volume required** before a candidate enters "ready to
   build" status — same gate as `feedback-search-volume-gate`.
5. When an item ships, delete it from this section (same forward-only policy as the rest of this doc).

## Competitive intelligence: khaleejcalculators.com (deep-dive 2026-07-17)

Confirmed via direct page fetches, not just search snippets — this is a serious, actively-expanding
operation, not a thin template site:

- **~180+ individual calculator URLs** across 6 categories: financial/salary (net salary, benchmarking,
  EOS per-GCC-country, GOSI, VAT, corporate/excise tax), employment (probation, leave, overtime, notice
  period), real estate/loans (mortgage variants incl. Islamic mortgage, rent-vs-buy), Islamic (7 Zakat
  variants incl. crypto, Hajj/Umrah cost, Zakat al-Fitr, fidya/kaffarah, udhiyah, inheritance), health
  (BMI, calorie, ideal weight, water, macro, body fat, pregnancy), utility (age, Hijri date, date-diff,
  unit/currency converter, IBAN, tafqit, timer/stopwatch/pomodoro, prayer alarm), plus 38 national-holiday
  countdowns and gamified quizzes/challenges (52-week savings, 50/30/20, no-spend, wealth-score quiz).
- Quality is genuinely good on the pages checked: cited official sources (GOSI/ZATCA/Qiwa/hrsd.gov.sa,
  AAOIFI standards for Islamic finance), "last updated" dates, 6-10 supporting content sections per page
  (nisab tables, error lists, per-country agency links), 180-200+ blog articles, 21 guides.
- **Their real differentiator is NOT the calculators — it's a free iframe embed-widget system**, live on
  every calculator page ("أضف هذه الحاسبة إلى موقعك مجاناً"): `<iframe src="https://khaleejcalculators.com
  /embed/[category]/[tool]" ...>`, free, no signup, no visit cap. The catch: usage terms require keeping
  their logo + link visible or "usage permission is voided" — every embed is a **permanent backlink +
  branded touchpoint** driving traffic back to them. This is a compounding SEO-authority acquisition
  machine, not a revenue play (no ads found inside the embedded widget itself).
- Design specifics (not vague "clean" — concrete): white background, muted gray dividers, one Islamic-
  green accent color, 14px rounded cards with soft shadows (`0 4px 16px rgba(0,0,0,0.06)`), the actual
  tool sits directly under the H1 with **zero marketing copy before it**, results render inline (no
  separate results screen/page), content density is staged (sparse near the tool, denser in supporting
  sections below). Ads are genuinely light-touch: confirmed via raw HTML (not the fetch summarizer, which
  missed it) — Google AdSense is present but limited to a single ~90px manual banner, no auto-ads/vignette
  stacking — this restraint is a real, copyable factor in why the page reads as "clean."

## NEW FEATURE: embed/widget system for our own calculators — SHIPPED (2026-07-17), v1

**Built**: `/embed/calculators/[slug]` (`src/app/embed/calculators/[slug]/page.jsx`), same pattern as
`/embed/prayer-times/[country]/[city]` — noindex, chrome-free via the existing `embed-mode` CSS class,
`params` read inside a Suspense-wrapped child (not the page top level) per the site's PPR lesson,
registered in `INTENTIONALLY_NON_INDEXABLE_PAGE_ROUTES`. Mandatory attribution baked directly into the
widget's own rendered content (a visible "{اسم الحاسبة} من ميقاتنا" link back to the real page) —
matching khaleejcalculators.com's own mandatory-backlink mechanic, not just a ToS term that could be
silently stripped.

**v1 scope — 5 highest-traffic, most shareable calculators** (reusing their existing client components
directly, no duplicated calculation logic): `age`, `bmi`, `percentage`, `end-of-service-benefits`,
`monthly-installment`. Each real calculator page now has an "أضف هذه الحاسبة لموقعك مجاناً" block with a
copyable iframe snippet (`EmbedCodeSnippet`, moved from `components/mwaqit/` to `components/shared/` and
generalized with `title`/`hint`/`width`/`height` props so both the prayer widget and calculator widgets
share one implementation).

**Verified**: lint clean, `tsc --noEmit` clean, `test:unit` 116/116, `seo:validate` passes (`ok`,
`explicitlyNonIndexablePageRoutes: 4`).

**Next step, not yet done**: expand past these 5 once this proves out — same phased approach as the
prayer widget, add one calculator at a time to the `EMBEDDABLE_CALCULATORS` map in the embed page plus its
own `EmbedCodeSnippet` block on the real page.

**Update (2026-07-17, same day) — 3 real bugs found and fixed via actual browser verification, not just
code review:**
1. `EmbedCodeSnippet`'s default `title`/`hint` were still hardcoded to prayer-times text — fixed to
   generic defaults now that the component is shared across 3 widget types.
2. **The calculator embed widgets were completely unstyled and broken** — `/embed/calculators/[slug]`
   lives outside `src/app/calculators/layout.jsx`'s route tree, so `calculators.css` (13,600+ lines,
   ~340 rules scoped to `main:not(.calc-hub-page)`) never loaded. Fixed by importing it directly in the
   embed page AND wrapping the widget in a real `<main>` (was a bare `<div>` — those 340 scoped rules
   never match without a real `<main>` ancestor). Confirmed via real Puppeteer screenshots at 320/375/
   768/1280px, not just code inspection — this is the kind of bug that only shows up in an actual
   browser render.
3. **`EmbedCodeSnippet`'s code block was rendering at a negative x-offset**, straddling both edges of the
   page (confirmed via `getBoundingClientRect()`: x was -105px) — its `<pre>` has un-wrapped long
   single-line content whose intrinsic width (1300+px) propagated up through ancestor flex/grid
   containers lacking `min-width: 0`/`max-width: 100%`. Fixed on `.embed-snippet-block` and
   `.embed-snippet-block__code` in `globals.css`.
4. **Hit a real Turbopack dev-cache staleness bug mid-session**: a CSS fix wasn't reaching the compiled
   bundle even after multiple edits and reloads — confirmed via `document.styleSheets` inspection that
   the served CSS chunk was missing the new properties entirely. Fixed by killing the dev server,
   clearing `.next/cache/turbopack`, and restarting. **Lesson: if a CSS/JS edit doesn't seem to take
   effect after a normal wait, check the actual served stylesheet content before assuming the fix is
   wrong** — it may just be a stale Turbopack cache, a recurring issue in this project (see
   `.claude/session-notes.md`'s 2026-07-15 note on overlapping dev servers).
5. Also fixed 13 real ad-placement gaps found via a systematic scan (not spot-checking): the entire
   `age/*` sub-cluster (7 pages, via the shared `AgeToolSections` component) plus the age hub, the
   `sleep/[tool]` and `personal-finance/[tool]` shared dynamic routes (covering 6 + 4 tool pages), and
   the `building`/`finance`/`personal-finance`/`sleep` hub pages were all missing their end-of-page
   `AdMultiplex` slot. All fixed; verified via a throwaway Node script that scans every calculator
   `page.jsx` for `CalculatorHero`/`CalculatorFaqSection`/`RelatedCalculators`/direct ad imports.
6. Added a 3rd widget type: `/embed/countdown/[slug]` — Islamic-calendar countdown widgets for
   `ramadan`/`eid-al-fitr`/`eid-al-adha` (owner's "counters" widget ask, interpreted as embeddable
   holiday countdowns — flag if this wasn't the intent). Reuses the real
   `getNextEventDate`/`resolveAllHijriEvents`/`getTimeRemaining` engine functions already powering the
   real holiday pages — no duplicated date math. New lean client ticker
   (`src/components/holidays/CountdownEmbed.client.jsx`) deliberately does NOT reuse the full
   `CountdownTicker` component (that one carries fullscreen/wake-lock/WhatsApp-share features that make
   no sense inside a small third-party iframe). `EmbedCodeSnippet` block added to the 3 real holiday
   pages via a new `CountdownEmbedCallout` in `HolidayDetailsSections.jsx`.

All verified with real Puppeteer browser checks (not just code review) at 320/375/768/1280px across every
widget type + the snippet blocks on real pages — zero horizontal overflow, zero console errors. Lint
clean, `tsc --noEmit` clean, `test:unit` 116/116, `seo:validate` ok (5 explicitly-non-indexable routes).

## New calculator candidates — ranked build order (research completed 2026-07-17)

Shipped 2026-07-18: `weighted-grade`, `margin-markup`, `working-days` (all 3 verified live via Puppeteer,
zero console errors). Full detail in git history + memory `project-saudi-focus-push-2026-07-18`.

Shipped 2026-07-19/20 (owner brief: "the most valuable ones ... focus on arab countries that have high
rpm"): `date-add-subtract` (native dual Hijri+Gregorian date add/subtract, reuses `date-adapter.ts`'s
umalqura engine), `aqiqah` (2 sheep for a boy / 1 for a girl per binbaz.org.sa, 3 real Saudi livestock
price tiers sourced from anaam.app — not invented numbers), `wasiyya` (1/3-of-net-estate bequest limit
calculator, hadith of Sa'd ibn Abi Waqqas, reuses `/calculators/inheritance`'s net-estate framing). All 3
verified live via Puppeteer at 375/1280px, `ci:check` green.

### Still open — ranked

| # | Candidate | Real gap evidence | Priority | Keywords |
|---|---|---|---|---|
| 1 | حاسبة الانحراف المعياري والإحصاء الأساسي (standard deviation / basic stats: mean, median, mode, variance from a data set) | Arabic results dominated by thin machine-translated calculator mills (symbolab.com, rapidtables.org, calculator-online.net) — no worked examples for Arab curricula, no real pedagogy | MEDIUM (academic, lower commercial intent) | "حساب الانحراف المعياري خطوة بخطوة", "حاسبة التباين والوسيط والمنوال لمجموعة بيانات", "الفرق بين الانحراف المعياري والتباين" |
| 2 | حاسبة 1RM / القوة القصوى (one-rep-max calculator for gym-goers) | No webteb/altibbi presence at all; existing Arabic coverage thin/fragmented (arabianbodybuilding.com's tool isn't true 1RM, fitnous.com is low-authority) — no dominant incumbent | MEDIUM-LOW | "حاسبة 1RM", "حاسبة القوة القصوى", "احسب اقصى وزن يمكنني رفعه" |
| 3 | حاسبة الماكروز (macro calculator — protein/carb/fat breakdown, extension of the already-live calorie/TDEE tool) | khaleejcalculators.com already has a macro guide/calculator, so this is not virgin territory — build as a cheap feature-extension of the existing calorie calculator's output, not a standalone launch | LOW | "حاسبة الماكروز", "حساب البروتين والكارب والدهون", "حاسبة احتياج البروتين اليومي" |
| 4 | حاسبة معدل سرعة الجري (running pace / marathon time calculator) | Genuine gap — Arabic results are thin translated tools (calculator.io, alahasibah.com) or generic news, no real Arabic running-community content | LOW (smaller volume than the rest) | "حساب معدل سرعة الجري كم دقيقة للكيلومتر", "حاسبة الوقت المتوقع لسباق الماراثون من سرعتك الحالية" |

Shipped 2026-07-20: `weaning-schedule` (baby feeding-schedule calculator, was #2 above), plus two items
from the same-day Saudi/Gulf finance sweep not originally on this list: `nafaqah` (Saudi alimony/child-
maintenance estimator — see `docs/high-value-tools-tracker.md` for the "official tool is login-gated"
finding that reversed an initial rejection) and the `best-islamic-credit-cards-saudi` guide (see the
credit-card-pilot memory). Full detail in git history + memory
`project-credit-card-content-pilot-2026-07-20`.

**Unexplored angle (flagged 2026-07-20, not yet researched):** non-Gulf high-RPM Arab-country calculator
gaps (Egypt income-tax/social-insurance, Jordan GOSI-equivalent, Morocco/Algeria/Tunisia CNSS/IR
calculators) — a dedicated research agent was dispatched for this but failed on a session API limit
before returning results. khaleejcalculators.com's ~180+ tool catalog is Gulf-labor-law-branded and may
not cover these countries' distinct legal/administrative calculator needs. Worth a fresh research pass
before the next calculator wave, per the owner's "focus on arab countries that have high rpm" framing
which this session interpreted as not Gulf-only.

## Saudi-focused push (2026-07-18) — owner brief: Saudi is the #1 revenue country, weight new
## events/tools/calculators toward it specifically, target daily-search queries with currently poor results

Dedicated research pass (2 parallel agents: calculator/tool gaps, daily-search content gaps) cross-checked
against the full existing Saudi inventory (`ls src/app/calculators/`, `ls src/data/holidays/events/ | grep
saudi`) before proposing anything, to avoid duplicating what's already live.

Shipped this pass: `sick-leave` calculator (Article 117 tiered sick-pay), `al-wasm-saudi` +
`al-marbaaniya-saudi` (seasonal events), `khaleeji-27` (found drafted-but-never-synced, published as-is).
Full detail in git history + memory `project-saudi-focus-push-2026-07-18`.

### Remaining Saudi calculator candidates — real gaps, not yet built (ranked)

`domestic-worker-cost` and `iddah` (rows 1 and 4 of the original 4-item list) **shipped 2026-07-19**
(itemized Musaned government fees; Hijri-accurate iddah waiting-period calculator). `حاسبة ساعات العمل
والأجر الإضافي في رمضان` was drafted then explicitly rejected by the owner (seasonal/once-a-year,
doesn't fit the daily-visitor goal) — do not rebuild unless the owner asks again specifically.

| # | Candidate | Real gap evidence | Saudi legal/data source | Priority |
|---|---|---|---|---|
| 1 | حاسبة النسبة الموزونة للقبول الجامعي (weighted university-admission-percentage calculator, all Saudi universities in one tool) | Honest caveat — **already semi-saturated**: dedicated tools exist (mzksa.com "موزونتي", KSU's own official calculator). Differentiator would have to be genuinely comprehensive per-university weight coverage + year-round maintenance, not a quick win. | Per-university weighting formulas vary (e.g. KSU sciences: 30% high-school GPA + 30% Qudurat + 40% Tahsili) | MEDIUM (crowded) |

**Checked and ruled out this pass** (real Saudi ideas that don't clear the bar, don't re-research without
new information): customs duty on online purchases (ZATCA runs its own official calculator, unbeatable),
real-estate transaction tax RETT 5% (saturated — naqdilive.com, sauragency.com, kshouf.com all have
calculators, and the math is trivial ×5%), white-land tax رسوم الأراضي البيضاء (real and newly billed
Jan 2026, but niche B2B — only owners of >5,000m² plots in declared zones, not a daily consumer search),
Nitaqat/Saudization-band calculator (official Qiwa calculator already exists at qiwa.sa, and the real band
determination needs internal HRSD tables that shade into portal-dependency), Waqf calculator (distinction
from the banned Zakat topic is real and safe, but no standard formula exists — demand is for rules, not
calculation), Saudi-specific GPA/Noor-5.0 scale (overlaps the live `gpa`/`gpa-to-percent` tools; the
genuinely distinct angle is #3 above, the admission percentage, not the school GPA scale itself).

### Remaining Saudi content candidates — checked, all already covered

The daily-search-content research agent checked several more angles and found the site already serves
them well — noted here so nobody re-researches: Ramadan imsakia (already live at
`/imsakiya/[country]/[city]`), today's official Hijri date via Umm al-Qura (already live at `/date/today`,
already uses the correct calculation engine — the only remaining opportunity is a trust-signal citation
enhancement, not a new page), دعم ريف/تمكين support programs (already `reef-support-saudi`, confirmed
same payment window), 11.11 "يوم العزاب" Singles Day (real volume but pure coupon/deal-intent that this
site structurally can't serve — no live price/affiliate-deal feeds — low priority, at most a thin
companion to the already-live `white-friday`).

- **Mahr/dowry calculator** — no real calculator-shaped demand (only fatwa/opinion content), and
  numerically benchmarking dowry amounts risks reading as endorsing dowry inflation, which Islamic
  teaching explicitly discourages (Prophet's wives' mahr capped near 500 dirhams per binbaz.org.sa) —
  culturally loaded, skip entirely, not just deprioritized.
- **Daily water intake calculator** — altibbi.com already has a genuine interactive tool matching the
  exact query intent.
- **Vaccination schedule tracker** — altibbi.com ("حاسبة مواعيد تطعيم الأطفال") and Medipol Global both
  already run dedicated interactive calculators; also carries real medical/liability sourcing complexity.
- **Child growth percentile calculator** — webteb.com fully owns this end-to-end (0-24 months AND 2-20
  years, both WHO-based, both interactive) via its baby subdomain. No age-range gap left.
- **Gold price + Zakat-nisab checker** — moot now (Zakat is banned per standing rule #2 above), but also
  already saturated: gold.sa, saudi-gold.com, metalhubprice.com, zahabprice.com, gold-era.sa all already
  auto-pull live gold prices and compute Zakat-nisab automatically.
- **Fuel cost / trip calculator** — khaleejcalculators.com/vehicle already runs a full suite (per-100km
  consumption, trip cost, octane comparison, EV-vs-gasoline) with actively-maintained Aramco pricing.
- **Rent-vs-buy calculator** — owned by real-estate portals with a structural advantage (live listings,
  lead-gen incentive): propertyfinder.ae has a full Arabic version, plus opensooq.com and others.
- **Gulf mortgage/DBR affordability, Hajj/Umrah cost, credit-card cashback comparison, standalone
  remittance-fee comparison** — all previously confirmed saturated (see the affiliate/tools tracker doc),
  re-confirmed via khaleejcalculators.com's own catalog above.
- **Body fat percentage calculator** — real dedicated Arabic tools already exist (do-calculate.com,
  egyfitness.com use genuine Navy-method math) and it heavily overlaps this site's live BMI/calorie tools
  — cannibalization risk outweighs the thin remaining gap.
- **Ideal body weight / lean body mass calculator** — mohap.gov.ae (UAE Ministry of Health) runs an
  official government calculator, a very hard authority to outrank; also overlaps live BMI/calorie tools.
- **Currency converter** — unwinnable regardless of content quality: Google's own instant-answer widget
  fires directly on "تحويل الدولار الى ريال"-style queries before any organic result is seen, and the
  surviving click pool goes to xe.com/wise.com/investing.com/SAMA. Needs a licensed live FX feed just to
  compete, and there's negligible click volume left even then.
- **Tip calculator** — already built: `/calculators/bill-splitter` already includes tip-amount + split
  functionality. A separate tip calculator would cannibalize, not fill a gap.

## Parked (real gap, but a real blocker — don't build yet)

- **Gulf/MENA cost-of-living city comparison** — genuine gap confirmed (existing Arabic coverage is just
  articles repackaging Numbeo numbers, no interactive tool), but requires ongoing per-city cost-basket data
  maintenance (rent/groceries/transport/utilities across a dozen+ cities) — heavier upkeep burden than any
  other calculator on this site. Park until a cheap, low-maintenance data-refresh method exists (e.g. an
  annual-refresh dataset rather than "live"), or until GSC confirms real demand first.
- **`school-grant-algeria`** (منحة التمدرس, ~5,000 DZD annual back-to-school grant, verified active for
  2026-2027 via APS/Decree 26-168) — genuine gap, distinct from both `school-start-algeria` and
  `bac-results-algeria`. Not a data-correctness issue — the owner explicitly deprioritized MENA/Algeria
  work (2026-07-19) in favor of Saudi-specific items. Good candidate whenever MENA work resumes.
