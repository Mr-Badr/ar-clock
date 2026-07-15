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
   see the Wave 12 Track B note. Full detail + the still-open question about earlier-built Christian
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
| `dubai-shopping-festival` | Re-verified 2026-07-14: still 3 conflicting unofficial date ranges across travel-affiliate sites (mid-Dec to late-Jan variants), visitdubai.com's own DSF page still doesn't list exact 2026-2027 dates | Official visitdubai.com announcement of exact dates |
| `f1-bahrain-gp` | Sports-SERP risk; needs a real keyword-volume check | GSC data confirming date-intent queries beat race-coverage-intent — **needs the user's Search Console access, not researchable via web search** |
| `tax-refund-usa` | No confirmed Arabic search volume yet | 3 GSC-confirmed Arabic keyword phrases with real volume — **needs the user's Search Console access, not researchable via web search** |
| `dv-lottery` status tracker | Re-verified 2026-07-14: still suspended (correction — suspended **2025-12-18**, not Mar 2026 as previously noted here), no reopening date announced; DV-2026 selectees lose eligibility if not issued by 2026-09-30 | Check travel.state.gov for a reopened window |

**Not a blocker, just low priority (buildable any time, RPM-only reason):** none currently — the Egypt
trio that used to sit here shipped 2026-07-12.

---

## THE BUILD LIST (priority order)

**Priority rule: high-RPM countries FIRST — Gulf, Europe (diaspora), US — before any volume play.**
Low-RPM items (Maghreb, Egypt, Syria/Yemen/Libya/Palestine traffic-plays) are NEVER excluded for RPM
alone — they build whenever the high-RPM queue is empty, ranked by search volume among themselves.

---

## Wave 12 — new candidates (research pass 2026-07-14, owner brief: fixed date + real daily-search
## volume + low-medium competition, Saudi/Egypt/other-countries/international/Islamic, aim to rank #1
## within a month of publishing)

### Wave 12 first tranche — SHIPPED 2026-07-14 (9 events live, ci:check green)

`victoria-day-canada`, `washington-birthday-usa`, `battle-of-khandaq`, `wafat-khadija`, `autism-day`,
`family-day`, `charity-day`, `disability-day`, `winter-at-tantora-alula` — all built through the full
research → author → validate → sync pipeline same day. Egypt's Coptic-calendar track was fully dropped
per owner instruction (see Track B below and the standing rule 9 above) and replaced in the build queue
with the two Islamic-history events (`battle-of-khandaq`, `wafat-khadija`). `taif-rose-festival`
(originally Saudi's top pick) was rejected after independent verification found real scheduling
instability (see Track E) and replaced with `winter-at-tantora-alula`. Final `npm run ci:check` green;
every new event carries only non-blocking `related_not_reciprocal` warnings, no errors. Remaining
Track A/C/Saudi items below are still open for a future pass — see the "Ranked build order" list.

Two independent discovery tracks fed this wave: (1) a systematic scan of `country-hub-data.js` for
`eventSlug: null` rows with NO matching live event (found while fixing 32 *orphaned* links — see below —
these rows already carry a verified date/rule, zero fresh fact-research needed); (2) five parallel
research agents dispatched for Saudi, Egypt, international UN days, and Islamic-calendar history.

### Zero — bug found and fixed first: 32 already-built events were never linked from their country hub

Before researching anything new, a systematic re-check of every country's `eventSlug` in
`country-hub-data.js` found that **32 events built across Wave 9-11 were live and published, but their
country-hub-page row still pointed `eventSlug: null`** — meaning `/holidays/country/<x>` never linked to
them. Root cause: the events were authored directly into `src/data/holidays/events/` without going back
to update the hub-summary data file. Fixed same-session (2026-07-14): `coptic-christmas-egypt`,
`june-30-revolution-egypt`, `evacuation-day-egypt` (Egypt), `tasua-day` (Bahrain), `renaissance-day-oman`
(Oman), `good-friday-germany`/`ascension-day-germany`/`unity-day-germany`/`christmas-germany` (Germany),
`national-day-sweden`/`midsummer-sweden`/`all-saints-sweden`/`christmas-eve-sweden` (Sweden),
`victory-day-france`/`bastille-day-france`/`assumption-day-france`/`armistice-day-france` (France),
`sovereignty-childrens-day-turkey`/`youth-sports-day-turkey`/`democracy-day-turkey`/`victory-day-turkey`
(Turkey), `mlk-day-usa`/`memorial-day-usa`/`juneteenth-usa`/`columbus-day-usa`/`veterans-day-usa` (USA),
`truth-reconciliation-day-canada`/`thanksgiving-canada`/`remembrance-day-canada`/`boxing-day-canada`
(Canada), `christmas-jordan` (Jordan), `christmas-palestine` (Palestine),
`armenian-christmas-lebanon`/`saint-maroun-day-lebanon`/`assumption-day-lebanon` (Lebanon). Verified each
mapping against the live event's `core` fields (month/day/offset) before wiring — no mismatches. `ci:check`
green after the fix. **Lesson for future waves: after building an event whose country already has a
`country-hub-data.js` entry, always check whether that entry's `eventSlug` needs updating from `null`.**

### Track A — pre-verified gaps still sitting in `country-hub-data.js` (some genuinely buildable, zero
### fact-research needed; others intentionally left `null` because no confirmed date/name exists)

These rows are real, dated, and sourced in `country-hub-data.js` already but have no individual event
page. Competitor scrape + content authoring is all that's needed — the base facts are done:

| Slug (proposed) | Country | Rule | Priority | Note |
|---|---|---|---|---|
| `victoria-day-canada` | Canada | `weekday-in-range` Mon within May 18-24 | **HIGH** | Verified 2026-07-14: 2026 = May 18 (timeanddate.com, canada.ca). Arabic competitor (arabz.ca) exists but has no countdown, no year-specific date, thin on the NS/NL exception — beatable. Real Quebec-specific angle: renamed "Journée nationale des patriotes" there since 2003. |
| `washington-birthday-usa` (public-facing name: "يوم الرؤساء") | USA | `floating` 3rd Mon of Feb | **HIGH** | Federal name is still officially "Washington's Birthday," not "Presidents Day" — same differentiator pattern already proven on `columbus-day-usa`. Multiple Arabic news outlets (skynewsarabia, al-ain, arabi21) cover it yearly but none have a countdown/FAQ page. Some states observe Lincoln's Feb 12 birthday as an alternate/additional day — real content angle. |
| `labor-day-canada` | Canada | `floating` 1st Mon of Sept | MEDIUM | Federal, all-Canada (unlike Family Day). Simple, safe, good RPM. |
| `family-day-canada` | Canada | `floating` 3rd Mon of Feb | MEDIUM | **Only some provinces observe it** (confirmed confusion in Arabic search results — some sources conflate it with the unrelated August "Civic Holiday"); this ambiguity is itself the differentiator (clean province-by-province table nobody else has). |
| `christmas-canada` | Canada | fixed Dec 25 | MEDIUM | Distinct from already-built `boxing-day-canada`; pairs naturally in a "Canada Christmas week" cluster. |
| `all-saints-day-france` | France | fixed Nov 1 | LOW-MED | Distinct from `all-saints-sweden` (different rule type: France = fixed Nov 1, not weekday-in-range) — no cross-cannibalization. |
| `easter-monday-france`, `easter-monday-germany` | France, Germany | `easter` offset 1 | LOW | Thinner individual search intent than named holidays; safe filler, zero research needed. |
| `ascension-day-france` | France | `easter` offset 39 | LOW | Same rule already proven on `ascension-day-germany`; content just needs a France-specific angle (school holidays "pont de l'Ascension" bridge-day custom is a real differentiator). |
| `whit-monday-france`, `whit-monday-germany` | France, Germany | `easter` offset 50 | LOW | Lower priority; safe filler. |
| `epiphany-sweden` | Sweden | fixed Jan 6 | LOW | Same date as `armenian-christmas-lebanon` and `coptic-christmas-egypt` (different traditions, different countries) — no collision, just coincidental date overlap to be aware of when cross-linking. |
| Sweden's Good Friday/Easter Sun/Easter Mon/Ascension/Whit Sunday, France's Whit Monday (partial dupe of Germany's) | Sweden, France | various `easter` offsets | LOW | Lowest priority in this track — thin standalone search intent for a Swedish-specific Easter-adjacent day beyond what `christmas-eve-sweden`/`midsummer-sweden`/`all-saints-sweden` already cover. Build only if the higher-priority queue empties out. |

**Intentionally left blocked/unbuilt** (do not build without new information): Lebanon's
`ذكرى اغتيال الرئيس رفيق الحريري` (Hariri assassination anniversary — politically sensitive, fails
neutral-brand test), Lebanon's `عيد المقاومة والتحرير` (Resistance and Liberation Day — politically
loaded framing, needs careful neutral-brand assessment before ever considering), Lebanon's Western
Good Friday/Easter Sunday and Orthodox Good Friday/Easter Sunday as individual pages (mirrors the site's
existing choice not to split these for Lebanon — only the country-hub summary carries them), Syria's
regular Christmas and Orthodox Good Friday/Easter (same reasoning as `easter-syria`'s Option A design —
one event per country covers the Western date, denominational nuance lives in content, not extra pages).

### Track B — Egypt: REJECTED by owner decision 2026-07-14, do not re-research

A research agent proposed a Coptic-calendar cluster (`coptic-easter-egypt`, `eid-al-ghitas-egypt`,
`nayrouz-egypt`, `eid-al-salib-egypt`) beyond the already-live `coptic-christmas-egypt`. `coptic-easter-egypt`
was fully authored, fact-checked (55-day Great Lent / Sabt El Noor detail independently re-verified against
6+ sources), and about to be built when the **owner explicitly rejected the entire track**: he does not want
the site publishing/affirming Christian theological content (specifically the Resurrection) that he
personally holds to be religiously incorrect. `coptic-easter-egypt` was deleted immediately (never synced
live); `eid-al-ghitas-egypt`, `nayrouz-egypt`, `eid-al-salib-egypt` were never built. **Do not propose
Coptic or other Christian-theological-content events for Egypt again** — this is a standing content-policy
line, not a per-event volume/competition judgment. See `.claude/session-notes.md` and memory
`project-rejected-event-candidates` for the full note and the still-open question of whether this same line
should extend to already-live Christian-observance pages elsewhere on the site (Jordan/Palestine/Lebanon/
Germany/Sweden/Syria) — that broader question was explicitly not decided and needs the owner's answer
before any of those pages are touched.

### Track C — international UN observance days (research agent, 2026-07-14)

All of these are on the UN's official `un.org/en/observances/list-days-weeks` registry with a fixed
annual Gregorian date (confirmed one-by-one, not assumed). Ranked by the research agent:

| Slug | Arabic name | Date | Priority | Differentiator |
|---|---|---|---|---|
| `autism-day` | يوم التوحد العالمي | April 2 | **HIGH** | "Light It Up Blue" global campaign, Gulf health-ministry yearly posts (Qatar MOPH, Saudi SPA); no Arabic countdown site found. Parent-facing practical content (early signs, Gulf assessment services) beats the ceremonial competitor pages. |
| `family-day` | اليوم الدولي للأسرة | May 15 | **HIGH** | Strongest single competitor found (alkhaleej.ae) but beatable. Egypt's Ministry of Awqaf already ran a piece framed "بين الرعاية الأممية والقيم الإسلامية" (UN care vs. Islamic values) — a ready-made, government-validated differentiator angle to lead with. |
| `charity-day` | اليوم الدولي للعمل الخيري | Sept 5 | HIGH | Marks Mother Teresa's death anniversary (UN designation 2012). Fragmented small-NGO competitor set. Natural Islamic-giving/sadaqah framing fits this audience and isn't done by any current competitor. |
| `disability-day` | اليوم الدولي للأشخاص ذوي الإعاقة | Dec 3 | MEDIUM-HIGH | Recurring SPA (twice-confirmed) + Egyptian state info service + ALECSO coverage. No dedicated Arabic countdown/FAQ page. Rights/accessibility/inclusion-program angle beats ceremonial ministry press releases. |
| `volunteer-day` | اليوم الدولي للمتطوعين | Dec 5 | MEDIUM | One low-authority competitor (fekrah.net) already runs a basic date+countdown article — still beatable but not greenfield. Ties directly to Saudi Vision 2030 volunteering targets + UAE Volunteers platform — country-specific info no competitor combines with the countdown. |
| `food-day` | يوم الأغذية العالمي | Oct 16 | MEDIUM | FAO anniversary (1979/1981). Recurring competitor pattern: Twinkl (UK ed-resource site) runs thin templated Arabic pages across several UN days — noted as a weak-but-present pattern to expect elsewhere too, not a real threat. Food-security/Ramadan-adjacent giving angle fits. |
| `literacy-day` | اليوم الدولي لمحو الأمية | Sept 8 | LOWER | UNESCO 1966. Weaker standalone search intent than the top 6, but strong internal-linking synergy with the site's 10+ `school-start-*` pages already live. |
| `wildlife-day` | اليوم العالمي للأحياء البرية | March 3 | LOWER | Real but thinner — environment/conservation topics get less Gulf-government social push than family/charity/disability. Build only if pushing past 6. |

**Checked and explicitly rejected** (don't re-research): International Day for Tolerance (Nov 16) —
direct date collision with the already-live `uae-tolerance-day`. International Day of the Girl Child
(Oct 11) — thematically redundant with `world-childrens-day`, weak standalone angle. World Population Day
(July 11) — UN's own framing centers reproductive-health-rights messaging, poor cultural fit. International
Day for the Eradication of Poverty (Oct 17) — thematically redundant with `charity-day` above. International
Day of Yoga (June 21) — real UN day, huge volume, but fails brand-fit test for this audience (religious-practice
associations are a recurring conservative-MENA objection point) and skews toward South Asian expat search
demographics, not the site's core. World AIDS Day (Dec 1) — legitimate UN day but routinely trips AdSense
sensitive-content restrictions + carries cultural stigma in MENA. World Press Freedom Day (May 3) —
politically sensitive by nature, fails house policy. World Habitat Day, World Statistics Day, Africa Day,
International Men's Day, World Kindness Day, World Rivers Day, World Sleep Day, World Fisheries Day — not
on the UN's official international-days registry at all (confirmed via un.org), or (Habitat/Statistics) not
fixed-dated/not annual.

### Track D — Islamic-calendar history (research agent, 2026-07-14)

| Slug | Arabic name | Hijri date | Priority | Note |
|---|---|---|---|---|
| `battle-of-khandaq` | غزوة الخندق (الأحزاب) | Shawwal, 5 AH (majority view; exact day within the month not uniformly pinned — same level of imprecision the site already accepts for `battle-of-uhud`'s `hijriDay`) | **HIGH — build first** | Quranic (Surah al-Ahzab), core school-curriculum battle, arguably higher name recognition than Uhud. Same competitor gap already exploited for `badr-day`/`battle-of-uhud`/`fath-makkah`: encyclopedic narrative pages (mawdoo3, marefa, wikipedia, islamweb, awkafonline), zero countdown-format pages. Zero sectarian risk — universally accepted pan-Islamic history. |
| `wafat-khadija` (or `aam-al-huzn`) | وفاة السيدة خديجة / عام الحزن | 10 Ramadan, 3 years before the Hijra (~619 CE) | HIGH | Cleanest date consensus of any candidate checked (5 independent sources agree on "10 Ramadan"). Zero sectarian risk — Khadija is revered identically across all Islamic traditions. Strong internal-link synergy with the already-live `ramadan`/`laylat-al-qadr`/`last-ten-nights-ramadan` cluster. Current competitors only mention it as a listicle item inside "events that happened in Ramadan" roundups (al-ain.com, barlamane.com) — no dedicated page exists. |
| `battle-of-mutah` | غزوة مؤتة | Jumada al-Awwal, 8 AH (month+year solid; **no source found gives a specific day-of-month** — needs one more verification pass against a primary-source-adjacent reference like Ibn Hisham's Sira before scaffolding, per the Golden Rule) | MEDIUM — defer one verification round | Real name-recognition via the three martyred commanders (Zayd ibn Haritha, Ja'far al-Tayyar, Abdullah ibn Rawaha) — strong pull in children's Islamic education. Don't scaffold until the exact day is pinned. |

**Flagged for an explicit decision, not silently built or dropped — Ghadir Khumm / Eid al-Ghadir** (18
Dhul Hijjah, 10 AH): the date itself is essentially undisputed even in Sunni hadith collections, but the
occasion's meaning is the entire Sunni-Shia fault line (Sunni: praise of Ali's virtue; Shia: explicit
succession/Imamate designation). Wikipedia's own Arabic article opens by calling it "a holiday celebrated
by Shia"; search volume concentrates almost entirely in Shia-majority/mixed populations (Iraq, Bahrain,
Lebanon) — not this site's stated core markets (UAE/Saudi/Qatar/Kuwait/Egypt/Morocco, all Sunni-majority).
**Recommendation: skip for this site's brand positioning** — flagging rather than deciding unilaterally,
since the traffic opportunity in Iraq/Bahrain is real and this is ultimately an editorial-stance call, not
a pure fact question.

**Checked and explicitly rejected** (don't re-research): Prophet's death (12 Rabi al-Awwal, 11 AH) — same
Hijri calendar day as the already-live `mawlid`; a second countdown firing the same day is a product
collision, not differentiation — add as a "did you know" note inside `mawlid` instead, don't build
standalone. Hajjat al-Wada / Farewell Pilgrimage — no clean non-colliding date exists (climax dates
overlap `day-of-arafa`/`eid-al-adha`/`tashreeq-days`); deepen those pages instead. Hijra as a narrative
event distinct from `islamic-new-year` — no evidence of independent "mark this specific day" search
behavior separate from the New Year event itself; already fully served. "الجمعة البيضاء" (White Friday) —
could not verify as a real distinct occasion (likely conflated with "الأيام البيض" fasting days, already
adjacent to the live `nisf-shaban`). Battle of Khaybar — date fragmentation is worse than Khandaq (month-
*and* year-level disagreement among primary sources, not just day-level) — deferred, not a hard no, needs
a dedicated Sira/Tabari deep-dive before it clears the accuracy bar.

### Track E — Saudi Arabia (research agent retried successfully 2026-07-14 after an API error on the
### first attempt)

Saudi's official government holidays are fully built. The research agent found the gap is **regional
seasonal tourism festivals** — none of AlUla, Diriyah, Taif, or Asir seasons exist yet, despite the engine
already having a proven content pattern for exactly this event type (`type: "estimated"` with a
`{{year}}-MM-DD` anchor, same as the already-live `riyadh-season`/`jeddah-season`).

| Slug | Arabic name | Date window | Priority | Why |
|---|---|---|---|---|
| `winter-at-tantora-alula` | شتاء طنطورة (العلا) | ~3-4 weeks, mid-Dec–early/mid-Jan (2025-26: Dec 18–Jan 10) | **HIGH — built 2026-07-14** | Official RCU/tourism-board pages are portal-style, not date-answer optimized; secondary competitors are thin/low-authority. 5 consecutive annual editions confirmed (Al Arabiya: "الموسم الخامس"), consistent multi-outlet coverage, no postponement history found. |
| `asir-summer-season` | موسم صيف عسير | ~10 weeks, late June–early Sept (2026: Jun 25–Sept 1) | MEDIUM | Moderate competition — `discoveraseer.com` is a real dedicated-authority incumbent, comparable difficulty to the already-live `riyadh-season`/`jeddah-season` (a tier the site already competes in successfully, not a free win). Distinct value prop vs. `jeddah-season` (cool mountain retreat vs. coastal entertainment) — no cannibalization. |
| `diriyah-season` | موسم الدرعية | ~5 months, Nov 1–late March (2025-26: Nov 1–Mar 23) | MEDIUM-LOW | Highest competition of the four — TimeOut Riyadh, Platinumlist, plus multiple strong official domains (a heavily-funded PIF flagship, PR-aggressive). Build only if accepting a longer climb to page-1. |

**`taif-rose-festival` — REJECTED, fails the reliable-date bar (found 2026-07-14, contradicts the
original research agent's "build first" pick).** The research agent's initial "thinnest competition"
read was correct but missed a live reliability problem: independent WebSearch verification (okaz.com.sa,
ts-post.net, multiple syndicated Saudi outlets) found the festival's own organizers ("الملتقى العالمي
للورد والنباتات العطرية") **postponed the 2026 edition twice in a row**, citing weather-driven crop
declines directly contradicting their own earlier "bumper harvest, 550 million roses" announcement —
plus a separate historical COVID-era postponement (sabq.org, 2020). A festival whose own organizers
can't currently hold to an announced date twice in the same season fails the "reliably computable
annual date" gate outright, regardless of how thin the competition is. **Lesson: always re-verify a
research agent's "no competitor" read against current news for the event's own reliability — thin
competition and an unstable date are two independent questions, and this site's rules require passing
both.** Do not rebuild without a source confirming at least 2-3 consecutive on-schedule years.

**Checked and explicitly rejected** (don't re-research): King Abdulaziz/Custodian-of-the-Two-Holy-Mosques
Camel Festival — two similarly-named festivals found with conflicting historical start dates, fails the
reliable-date bar. Janadriyah National Heritage & Culture Festival — irregular modern cadence (postponed
2015, paused during COVID, unclear present-day scheduling). Abha Jacaranda season — near-zero competition
but bloom window is only ~5 days and appears Instagram/fan-driven rather than institutionally anchored.
**Parked as a lower-priority backup, not rejected**: Riyadh International Book Fair (real, fixed annual
month, official backing, but lower estimated volume than the four above).

### Ranked build order for this wave

1. `battle-of-khandaq` (Islamic, zero sectarian risk, strong volume) — **built 2026-07-14**
2. `victoria-day-canada` (Canada, high RPM, verified facts) — **built 2026-07-14**
3. `washington-birthday-usa` (USA, high RPM, verified facts) — **built 2026-07-14**
4. `wafat-khadija` (Islamic, cleanest date consensus, Ramadan-cluster synergy) — **built 2026-07-14**
5. `autism-day`, `family-day`, `charity-day`, `disability-day` (international) — **all built 2026-07-14**
6. `winter-at-tantora-alula` (Saudi) — **built 2026-07-14**
7. `labor-day-canada`, `family-day-canada`, `christmas-canada` (Track A, medium priority) — **all built 2026-07-14**
8. `all-saints-day-france` — **built 2026-07-14**
9. `easter-monday-france`, `easter-monday-germany`, `ascension-day-france` (Easter-cycle; owner explicitly
   confirmed 2026-07-14 via AskUserQuestion to proceed, framed strictly around legal/civil/historical status,
   never affirming the Resurrection — same approach already used on good-friday-germany/ascension-day-germany)
   — **all built and live 2026-07-15**
10. `whit-monday-france`, `whit-monday-germany` (Easter-cycle, same owner approval) — **both built and live
    2026-07-15**
11. `epiphany-sweden` (fixed Jan 6, not Easter-linked) — **built and live 2026-07-15**
12. `asir-summer-season`, `diriyah-season` (Saudi, higher-competition tier) — **both built and live 2026-07-15**
    (diriyah-season winnability re-verified independently before building — confirmed a stable multi-year
    program since 2019 with no cancellation pattern, and clarified a genuinely useful disambiguation:
    Diriyah Season is a heritage-focused component WITHIN the larger Riyadh Season, not a rival season)
13. `volunteer-day`, `food-day`, `literacy-day`, `wildlife-day` (Track C international days) — **all built
    and live 2026-07-15**

**WAVE 12 FULLY COMPLETE as of 2026-07-15 — all 16 backlog items shipped, `npm run ci:check` green,
zero blocking failures.** Also fixed 12 more orphaned `eventSlug: null` rows in `country-hub-data.js`
discovered while wiring this batch (Germany, France, Sweden, USA, Canada) — same recurring bug pattern
documented in the Wave 12 "Zero" section above; re-run the debug Python scanner from memory
(`project-wave12-planning`) at the start of any future wave.

Egypt's Track B is fully closed (owner-rejected, see above) — no Egypt items in this queue beyond what's
already live. `battle-of-mutah` waits on one more source-verification pass. Ghadir Khumm waits on an
explicit owner decision. No further Wave 12 items remain — next wave needs fresh research per the
`event-creation-lessons.md` Golden Rule before scaffolding anything new.

---

## Wave 11 — new candidates (research pass 2026-07-13, owner brief: 3 events/country + 3 Islamic + 5 international, fixed/correct dates only, NO exam/school, must beat competitors on richness + direct human address)

Every row below was checked against the full live-event inventory (verify with
`ls src/data/holidays/events/` before building — this list is current as of 2026-07-13) and against
each country's already-verified holiday list in `src/lib/holidays/country-hub-data.js` (fast, reliable
gap-finding: that file's `holidays[]`/`observances[]` arrays already carry a legal source per row; any
entry with `eventSlug: null` is a pre-verified candidate with zero fresh research needed for the base
facts — competitor scrape + differentiator work still required before building).

**Honest finding, stated up front**: not every country has 3 real remaining candidates. Saudi Arabia,
Algeria, UAE, Tunisia, Kuwait, Qatar, Iraq, and Turkey already have their entire confirmed official
holiday/observance list built out (checked against `country-hub-data.js` + fresh WebSearch per
country) — forcing 3 more per country there would mean inventing thin, low-volume, or duplicate pages,
which violates the volume gate. They are marked **saturated** below and excluded from the build list;
don't re-research them without a genuinely new lead.

### Wave 11 status as of 2026-07-14 — FULLY SHIPPED, ALL CANDIDATES CLEARED (37 events, 0 blocked)

**All 37 events are live, including the 4 that were previously blocked.** Same-day follow-up
(2026-07-14) cleared every remaining item on the Wave 11 list:
- `bahraini-womens-day` (Dec 1, established 2008) — researched from scratch (was accidentally
  skipped from the original dispatch); differentiator is correcting a real conflation found in the
  one competitor attempting this topic (mhtwyat.com), which confuses the Supreme Council for Women's
  2001 founding with the 2008 adoption of Dec 1 as the actual day.
- `easter-syria` — the original block (Syria's post-decree list allegedly had no Easter entry) was
  **stale, not correct**: fresh WebSearch/WebFetch verification found Presidential Decree No. 188/2025
  (issued 2025-10-05) restored Western + Orthodox Easter and Christmas as paid holidays, confirmed by
  a 2026-03-30 presidency bulletin giving the exact 2026 dates. `country-hub-data.js`'s Syria section
  was corrected in the same pass (it was missing Christmas and both Easters entirely).
- `midsummer-sweden` and `all-saints-sweden` — the real engine gap (`weekday-in-range` existed only
  in `country-hub.js`'s summary renderer, not at the individual-event schema/engine level) was closed:
  ported into `src/lib/events/package-schema.js` (type enum + `startMonth/startDay/endMonth/endDay`
  fields) and `src/lib/holidays-engine.js` (`nextWeekdayInRange`, wired into `getNextEventDate`,
  `buildEventSeriesSchema`, `buildHistoricalDates`). Also ported `orthodox-easter` the same way
  (needed for `easter-syria`'s Orthodox-calendar explanation) — this type existed only in
  `country-hub.js` too. Both ports also updated `scripts/lib/event-scaffold.ts` and
  `scripts/events-new.ts` so future `events:new` scaffolds support these types natively.

**All 33 events from the 2026-07-13 pass are live.** `recapture-of-riyadh` (Saudi, Jan 15), `independence-day-kuwait` (Jun 19),
and `independence-day-qatar` (Sep 3 — differentiator: Sep 3 was Qatar's own National Day 1971-2007 before
Law 11/2007 moved it to Dec 18) shipped first. The remaining 30 — `independence-day-bahrain` ·
`juneteenth-usa` · `mlk-day-usa` · `columbus-day-usa` · `remembrance-day-canada` · `boxing-day-canada` ·
`truth-reconciliation-day-canada` · `victory-day-france` · `armistice-day-france` ·
`assumption-day-france` · `christmas-germany` · `good-friday-germany` · `ascension-day-germany` ·
`christmas-eve-sweden` · `saint-maroun-day-lebanon` · `armenian-christmas-lebanon` ·
`assumption-day-lebanon` · `christmas-jordan` · `renaissance-day-oman` · `christmas-palestine` ·
`battle-of-uhud` · `conquest-of-andalusia` · `fall-of-granada` · `human-rights-day` ·
`international-peace-day` · `world-refugee-day` · `world-book-day` · `world-tourism-day` ·
`october-14-revolution-yemen` · `unity-day-morocco` — went through the full pipeline
(`events:build` → `validate:holidays:strict` → `events:sync -- --slug <slug>` per event → final
`ci:check`) on 2026-07-13. All passed strict validation clean (0 keyword-integration failures,
0 hardcoded-year hits, 0 direct-answer-missing, all research.json minimums met) and `ci:check`
(lint + typecheck + test:unit + seo:validate + validate:holidays + validate:geo) is green.

`events:fix-related` ran once per sync as usual; diffed each time against the known cross-event
pollution bug (see `.claude/rules/content-pipeline.md`) — every touched unrelated event (e.g.
`bastille-day-france`, `independence-day-lebanon`, `oman-accession-day`, `canada-day`) had a stale/
irrelevant `relatedSlugs` entry (mostly `armed-forces-day-oman` used as filler) replaced by a newer,
topically-closer Wave 11 event. Reviewed as a net content-quality improvement, not reverted.

**Sources used across this batch** (per-event provenance lives in each event's own `research.json`):
Canada — Canada Labour Code, statutoryholidays.com, CBC News, Canada.ca. France — service-public.gouv.fr,
Legifrance (L3133-1/L3133-4). Germany — Library of Congress law blog, iamExpat.de, The Local. Sweden —
Public Holidays Act 1989:253, KI researcher blog, Mental Floss. USA — 5 U.S. Code § 6103, Pew Research,
Wikipedia. Lebanon/Jordan/Oman/Palestine — `country-hub-data.js` internal verified facts (Wave 9),
jobs.ps, publicholidays.me. Islamic trio — islamweb.net, mawdoo3.com, marefa.org, ar.wikipedia.org.
International 5 — un.org, unhcr.org, UNESCO, UN Tourism. Yemen/Morocco — Al-Madaniya Magazine, IWM,
maroc.ma official, Morocco World News.

**Blocked — none.** All 4 previously-blocked candidates shipped 2026-07-14 (see above). No open Wave 11
candidates remain.

### Completed sub-waves (11A/11B/11C originally split by type — all merged into the status list above once shipped/authored)

11A was the country-specific batch (Jordan/Oman/Palestine/Bahrain/Syria/Yemen/Morocco/Canada×3/France×3/
Germany×3/Sweden×3/Lebanon×3/USA×3), 11B the 3 Islamic hijri events, 11C the 5 international days — see
the status list above for what shipped vs. what's blocked. Full per-candidate verified-facts tables from
the original research pass are preserved in git history (this doc's own 2026-07-13 revision) if deeper
per-slug sourcing detail is ever needed again; not repeated here per the doc's "forward-only" policy now
that all candidates have moved to shipped/authored/blocked status.

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
