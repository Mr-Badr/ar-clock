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

---

## Blocked — do not re-research until resolved (check this FIRST, before any new candidate research)

| Slug | Blocker | Unblock condition |
|---|---|---|
| `kontantstotte-norway` | nav.no does not publish one confirmed fixed day-of-month for this specific benefit | Pull the actual 2026/2027 payment-date list directly from nav.no/utbetalingsdatoer |
| `national-day-norway` | Blocked on `kontantstotte-norway` (Norway hub-unlock plan needs it as the 3rd event) | Same as above |
| `salary-day-morocco` | Every source found is a one-off Eid-linked early-payment news announcement, never a recurring monthly TGR day | A primary source (TGR/Ministry of Finance) stating a genuine recurring shared day |
| `dubai-shopping-festival` | Exact dates announced 3-4 months ahead; sources currently conflict | Official visitdubai.com announcement of exact dates |
| `f1-bahrain-gp` | Sports-SERP risk; needs a real keyword-volume check | GSC data confirming date-intent queries beat race-coverage-intent |
| `tax-refund-usa` | No confirmed Arabic search volume yet | 3 GSC-confirmed Arabic keyword phrases with real volume |
| `dv-lottery` status tracker | Program suspended Mar 2026 | Check travel.state.gov for a reopened window |

**Not a blocker, just low priority (buildable any time, RPM-only reason):** none currently — the Egypt
trio that used to sit here shipped 2026-07-12.

---

## THE BUILD LIST (priority order)

**Priority rule: high-RPM countries FIRST — Gulf, Europe (diaspora), US — before any volume play.**
Low-RPM items (Maghreb, Egypt, Syria/Yemen/Libya/Palestine traffic-plays) are NEVER excluded for RPM
alone — they build whenever the high-RPM queue is empty, ranked by search volume among themselves.

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

### 11A — Country-specific candidates (16 countries with real gaps, Gulf/Saudi first per owner priority 2026-07-13)

**Follow-up research pass 2026-07-13 (owner: "add more events from Saudi and MENA/Arab countries that
will give us more visitors and money"), found by switching lenses**: instead of only checking each
country's *current official paid-holiday list* (which is how the first Wave 11 pass wrongly marked
Saudi/Kuwait/Qatar "saturated"), also check for genuinely distinct **historical-milestone** dates —
the same non-holiday, historical-register pattern already proven to work for the live `badr-day`/
`fath-makkah`. Result: Gulf countries have a whole category of massively-searched **"independence from
Britain"** dates that are genuinely separate from their already-covered National/Founding Day (which
usually commemorates a ruler's ascension or a much-earlier founding, not the actual independence
moment) — a real, common point of public confusion, and un-tapped by any Arabic countdown page found.

| Country | Slug (proposed) | Event | Date rule | Verified facts + source | Differentiator angle |
|---|---|---|---|---|---|
| 🇸🇦 السعودية | `recapture-of-riyadh` | استرداد الرياض | `fixed` 01-15 (5 Shawwal 1319 AH / Jan 15, 1902) | Confirmed via ar.wikipedia.org ("معركة الرياض 1902") + saudipedia.com: young Abdulaziz Al Saud stormed Masmak Fort before dawn, killed Ibn Rashid's governor Ajlan bin Mohammed, and reclaimed Riyadh — the founding military/political act of the Third Saudi State (modern Kingdom), genuinely distinct from the already-live `saudi-founding-day` (1727, First Saudi State) and `saudi-national-day` (1932 unification/renaming) | One of the most culturally significant, most-referenced historical moments in Saudi popular media (the Masmak Fort story) with ZERO countdown-style page found anywhere — huge, high-RPM, evergreen opportunity |
| 🇰🇼 الكويت | `independence-day-kuwait` | عيد استقلال الكويت | `fixed` 06-19 | Confirmed via aljarida.com + alraimedia.com: Sheikh Abdullah Al-Salem signed the document ending the 1899 British protection treaty on Jun 19, 1961 — genuinely distinct from the already-live `kuwait-national-day` (Feb 25, his 1950 ascension) and `liberation-day-kuwait` (Feb 26, 1991 Gulf War liberation) | A real third Kuwaiti national date, referenced in dedicated annual news coverage ("60 عاماً على استقلال الكويت") every June, with no live page anywhere on the site |
| 🇶🇦 قطر | `independence-day-qatar` | عيد استقلال قطر | `fixed` 09-03 | Confirmed via aljazeera.net + marefa.org: Sheikh Ahmad bin Ali Al Thani declared independence Sep 3, 1971, ending the 1916 Anglo-Qatari treaty — genuinely distinct from the already-live `qatar-national-day` (Dec 18, 1878 founding by Sheikh Jassim) | Qatar's actual independence-from-Britain date has ZERO coverage on the site today; real annual media coverage every September |
| 🇧🇭 البحرين | `independence-day-bahrain` | عيد استقلال البحرين | `fixed` 08-15 | Confirmed via ar.wikipedia.org + mia.gov.bh: Sheikh Isa bin Salman declared independence Aug 15, 1971, ending the British treaty relationship — genuinely distinct from the already-live `bahrain-national-day` (Dec 16, his 1961 ascension) | Same pattern as Kuwait/Qatar — a real, separate, uncovered independence milestone; completes the Gulf-independence set alongside the new Kuwait/Qatar candidates |
| 🇯🇴 الأردن | `christmas-jordan` | عيد الميلاد المجيد في الأردن | `fixed` 12-25 | Paid public holiday for **all** Jordanians regardless of religion (already noted in this doc's own Wave 8 Jordan build notes) — confirm via Jordan News Agency (Petra) at build time | Corrects the common assumption it's a Christian-only holiday; distinguishes Jordan's practice from countries where Dec 25 isn't recognized at all |
| 🇴🇲 عُمان | `renaissance-day-oman` | يوم النهضة العماني | `fixed` 07-23 | Marks Sultan Qaboos's accession in 1970 and the start of the modern "Renaissance" era — genuinely distinct from the already-live `oman-accession-day` (Jan 11, Sultan Haitham's 2020 accession). `country-hub-data.js` currently lists it as an observance, not a paid holiday — verify current paid-status at build time via omandaily.om | Two accession-related Omani days that are NOT the same event, a real and common confusion point |
| 🇵🇸 فلسطين | `christmas-palestine` | عيد الميلاد المجيد في فلسطين | `fixed` 12-25 | Recognized under Palestinian Labour Law No. 7/2000, which grants both Islamic and Christian holidays — verify current status directly, standing sensitive-topic neutral register applies | Real, distinctly Palestinian angle (Bethlehem is the traditional birthplace) rather than a generic Christmas page |
| 🇧🇭 البحرين | `bahraini-womens-day` | يوم المرأة البحرينية | `fixed` 12-01 | National observance day, distinct from the already-live BH events (none currently cover this) — verify via bahrain.bh/Supreme Council for Women at build time | Completes Bahrain's national-observance set; every other Gulf country's women's day is already live (Emirati, Omani, Tunisian) — Bahrain was the gap |
| 🇸🇾 سوريا | `easter-syria` | عيد الفصح في سوريا (الغربي والشرقي) | `easter` (Western; Eastern Orthodox needs the engine addition below) | Confirmed official PAID holiday in Syria for both Western and Eastern-calendar Easter per 2026 presidential holiday decree (verify current government's list at build time — Syria's list has genuinely changed recently, standing neutral-register rule applies) | No Arabic competitor page explains why Syria (like Lebanon) recognizes BOTH Easter dates as paid holidays — real differentiator. **Engine note**: `holidays-engine.js` already supports `type: 'easter'` (Western, via `easterOffset`) but NOT `orthodox-easter` — that rule type only exists in `country-hub.js` so far. Porting it to the main engine is a small, already-solved addition (same Meeus algorithm) needed before this event can compute the Eastern date live |
| 🇾🇪 اليمن | `october-14-revolution-yemen` | ثورة 14 أكتوبر اليمنية | `fixed` 10-14 | The South Yemen anti-colonial uprising (1963) against British rule, distinct from `september-26-revolution-yemen` (North Yemen, anti-Imamate, 1962) and `independence-day-yemen` (Nov 30, actual British withdrawal, 1967) — verify via Yemeni state sources, standing neutral-register rule applies | A genuinely separate, often-confused third revolutionary date in Yemen's history — completes the set (Sep 26 / Oct 14 / Nov 30 / May 22 unity, all distinct) |
| 🇲🇦 المغرب | `unity-day-morocco` | عيد الوحدة المغربية | `fixed` 10-31 | **Brand-new holiday** — royal decree declared this a national holiday very recently (verify the exact announcement and legal basis directly at build time; do not cite the announcement year literally in content per the hardcoded-year rule, phrase as "بلاغ ديواني حديث") | Genuine first-mover opportunity — this is new enough that almost no Arabic competitor content will have caught up yet |
| 🇨🇦 كندا | `remembrance-day-canada` | يوم الذكرى الكندي (ريمِمبرنس داي) | `fixed` 11-11 | Federal commemoration day (poppy symbol, 2 minutes of silence at 11:00) — verify paid-holiday-by-province status at build time (differs from `veterans-day-usa`, same Nov 11 root but different national framing) | Explicit US/Canada Nov 11 naming confusion (Remembrance Day vs Veterans Day) is real and searched |
| 🇨🇦 كندا | `boxing-day-canada` | يوم الصناديق في كندا | `fixed` 12-26 | Statutory holiday, major shopping event (Canadian equivalent of the already-live `black-friday-usa`/`cyber-monday-usa` pattern) — verify province-level paid status at build time | Zero existing Arabic content found for this specifically-Canadian shopping/holiday angle |
| 🇨🇦 كندا | `truth-reconciliation-day-canada` | اليوم الوطني للحقيقة والمصالحة الكندي | `fixed` 09-30 | Federal holiday since 2021 (Indigenous residential-schools history) — verify federal-vs-provincial paid status at build time, neutral historical register | Recent, real, growing search interest; near-zero Arabic coverage found |
| 🇫🇷 فرنسا | `victory-day-france` | ذكرى النصر 1945 في فرنسا | `fixed` 05-08 | Official French public holiday (Art. L3133-1), marks WWII European victory — verify via service-public.gouv.fr at build time | Completes the French national-holiday set alongside the live `bastille-day-france` |
| 🇫🇷 فرنسا | `armistice-day-france` | ذكرى الهدنة 1918 في فرنسا | `fixed` 11-11 | Official French public holiday, WWI armistice — verify at build time | Real "why does France have TWO war-memorial holidays" angle (May 8 vs Nov 11), distinguishes both clearly |
| 🇫🇷 فرنسا | `assumption-day-france` | عيد صعود مريم العذراء في فرنسا | `fixed` 08-15 | Official French public holiday (Catholic tradition, legally recognized nationally) — verify at build time | Genuine gap: no Arabic content explains why a Catholic feast is a French national holiday for everyone |
| 🇩🇪 ألمانيا | `christmas-germany` | عيد الميلاد في ألمانيا | `fixed` 12-25 | Public holiday in all 16 states — verify at build time | Real differentiator to research: Germany's strict "quiet day" (Weihnachtsruhe) laws |
| 🇩🇪 ألمانيا | `good-friday-germany` | الجمعة العظيمة في ألمانيا | `easter` (offset -2) | Public holiday in all 16 states with unusually strict enforcement — Germany legally bans dancing/loud public entertainment on this day in most states ("Tanzverbot") | This quirky legal-enforcement fact is a genuinely rare, highly shareable differentiator — verify current Tanzverbot details per state at build time |
| 🇩🇪 ألمانيا | `ascension-day-germany` | عيد الصعود في ألمانيا | `easter` (offset +39) | Public holiday; also informally "Vatertag" (Father's Day) in Germany with a distinct secular tradition (group outings, no gift-giving custom like the Western Father's Day) — verify at build time | Real, quirky "this is ALSO Father's Day but nothing like the American one" angle |
| 🇸🇪 السويد | `midsummer-sweden` | عيد منتصف الصيف السويدي (ميدسومر) | `weekday-in-range` (Saturday within Jun 20–26, same rule already built for the SE country hub) | Sweden's most important holiday after Christmas by most cultural accounts — verify current details at build time | Zero Arabic content found explaining this genuinely huge Swedish cultural event with any depth |
| 🇸🇪 السويد | `christmas-eve-sweden` | ليلة عيد الميلاد في السويد (يولافتون) | `fixed` 12-24 | In Sweden, Christmas EVE (not Dec 25) is the main celebration day — a real, distinct Swedish practice vs. most of Europe | Genuine differentiator most Arabic content misses entirely — verify at build time |
| 🇸🇪 السويد | `all-saints-sweden` | عيد جميع القديسين في السويد | `weekday-in-range` (Saturday within Oct 31–Nov 6) | Public holiday with a distinct Swedish practice: visiting graves and lighting candles — verify at build time | Real, visual, unique cultural content angle (candlelit cemeteries) |
| 🇱🇧 لبنان | `saint-maroun-day-lebanon` | عيد مار مارون في لبنان | `fixed` 02-09 | Official national holiday for ALL Lebanese honoring the patron saint of the Maronite community (already in `country-hub-data.js`'s Lebanon list, `eventSlug: null`) | Was the "alternate" candidate noted in this doc's original Lebanon plan, never built — genuine remaining gap |
| 🇱🇧 لبنان | `armenian-christmas-lebanon` | عيد الظهور الإلهي (الميلاد الأرمني) في لبنان | `fixed` 01-06 | Official national holiday since 2003, tied to the Armenian Church calendar (in `country-hub-data.js`, `eventSlug: null`) | Lebanon is a rare Arab country with an official Armenian-calendar national holiday — strong "only Arab country that..." angle, same pattern as the live `annunciation-day-lebanon` |
| 🇱🇧 لبنان | `assumption-day-lebanon` | عيد انتقال العذراء في لبنان | `fixed` 08-15 | Official national holiday (in `country-hub-data.js`, `eventSlug: null`) | Completes Lebanon's Christian-holiday coverage alongside `annunciation-day-lebanon` |
| 🇺🇸 أمريكا | `juneteenth-usa` | يوم جونتينث في أمريكا | `fixed` 06-19 | Newest US federal holiday (established 2021), marks the end of slavery's enforcement in Texas in 1865 — verify current details at build time | Real, fast-growing search term; genuinely new in federal-holiday terms, thin Arabic coverage |
| 🇺🇸 أمريكا | `mlk-day-usa` | يوم مارتن لوثر كينغ في أمريكا | `floating` (3rd Monday of January) | Federal holiday since 1986 — verify at build time | Well-known figure in Arabic media already (civil rights icon), real recurring search interest every January |
| 🇺🇸 أمريكا | `columbus-day-usa` | يوم كولومبوس في أمريكا | `floating` (2nd Monday of October) | Federal holiday, increasingly co-observed/renamed "Indigenous Peoples' Day" in many states — verify current naming/status split at build time, present both names neutrally | Real "why does this day have two different names depending on the state" angle — genuine content gap |

**Saturated — no forced candidates (checked 2026-07-13, don't re-research without a genuinely new
lead). Note: Saudi/Kuwait/Qatar were WRONGLY marked saturated in the first Wave 11 pass — the
historical-milestone lens above found real candidates for all three. Genuinely saturated once both
lenses (official holiday list AND historical-milestone check) were applied:**
🇩🇿 الجزائر (9 official holidays all built; independence itself is `independence-day-algeria`, Jul 5,
1962 — the earlier Evian Accords ceasefire, Mar 18-19, 1962, is a real but much weaker/more niche
diplomatic-history angle, optional low-confidence bonus only) · 🇦🇪 الإمارات (13 events live; confirmed
via fresh research that UAE's Dec 2 National Day IS its independence day — Britain's protection ended
Dec 1, 1971 and the Union/independence were declared together Dec 2, no separate date exists) ·
🇹🇳 تونس (11 holidays, all built) · 🇮🇶 العراق (Independence Day Oct 3 already covers the 1932
League-of-Nations milestone; Army Day + Victory Day also live) · 🇴🇲 عُمان (confirmed via fresh research
that Oman's Nov 18 National Day already IS its independence-equivalent milestone — Oman was never a
British protectorate the way Kuwait/Qatar/Bahrain were, so no separate "independence day" exists;
`renaissance-day-oman` above remains the one real Oman gap) · 🇹🇷 تركيا (all 4 national-day candidates
from the original Wave-9 hub research are already live: sovereignty/children's day, youth/sports day,
democracy day, victory day).

### 11B — Islamic events (hijri type, countryScope: all — 3 new candidates)

Same pattern as the live `badr-day`/`fath-makkah` pair: historical register only, no fiqh ruling
content, `islamic_year_pair_missing` fix applied from the start.

| Slug (proposed) | Event | Hijri date | Verified facts + source | Differentiator angle |
|---|---|---|---|---|
| `battle-of-uhud` | غزوة أحد | 10/7 (7 Shawwal) | Confirmed via islamweb.net + mawdoo3.com: fought Saturday 7 Shawwal 3 AH, one year after Badr, named for the mountain near Medina | Real, heavily-searched historical battle with zero countdown page anywhere; pairs naturally with the live `badr-day` |
| `conquest-of-andalusia` | فتح الأندلس | 9/28 (28 Ramadan) | Confirmed via islamweb.net: Tariq ibn Ziyad's decisive battle at Wadi Lakka against the Visigothic king, 28 Ramadan 92 AH (711 CE); crossing began 5 Rajab 92 AH | Massive, evergreen Arabic search topic ("متى فتح الأندلس") with zero countdown-style page found |
| `fall-of-granada` | سقوط غرناطة (الأندلس) | 3/2 (2 Rabi' al-Awwal) — surrender treaty signed 21 Muharram 897 AH | Confirmed via marefa.org + ar.wikipedia.org: Abu Abdullah's surrender to Ferdinand and Isabella, 2 Rabi' al-Awwal 897 AH (Jan 2, 1492 CE), ending 8 centuries of Muslim rule in Iberia | Pairs with `conquest-of-andalusia` as the historical bookend (conquest → fall), mirroring the `badr-day`/`fath-makkah` pairing pattern; one of the most-searched topics in Arabic history content |

### 11C — International days (countryScope: all, fixed Gregorian — 5 new candidates)

Same countdown+FAQ pattern as the live `world-cancer-day`/`world-happiness-day`.

| Slug (proposed) | Event | Date | Verified facts + source | Differentiator angle |
|---|---|---|---|---|
| `human-rights-day` | اليوم العالمي لحقوق الإنسان | 12-10 | Confirmed via un.org: marks the UN General Assembly's adoption of the Universal Declaration of Human Rights, Paris, Dec 10, 1948 (Resolution 217A); formal annual observance since 1950 (Resolution 423(V)) | Globally recognized, huge baseline search volume every December; zero live page on the site |
| `international-peace-day` | اليوم الدولي للسلام | 09-21 | Confirmed via un.org: established 1981 (UNGA Resolution 36/67), fixed to Sep 21 permanently by Resolution 55/282 in 2001 | Well-known UN flagship day, real recurring search volume, thin Arabic countdown coverage |
| `world-refugee-day` | اليوم العالمي للاجئين | 06-20 | Confirmed via unhcr.org + un.org: designated Dec 2000, first observed 2001 (previously "Africa Refugee Day" before UN globalized it) | Directly relevant to the site's core MENA audience given the scale of Syrian/Palestinian/Yemeni/Sudanese displacement — genuine, sensitive-but-real content opportunity (neutral, humanitarian register, no political commentary) |
| `world-book-day` | اليوم العالمي للكتاب وحقوق المؤلف | 04-23 | Confirmed via UNESCO + youm7.com: UNESCO designated 1995; date chosen because it's the death date of Cervantes, Shakespeare, and Inca Garcilaso de la Vega (originally proposed 1922 by Spanish writer Vicente Clavel Andrés to honor Cervantes, first held Oct 7, moved to Apr 23) | Rich, genuinely story-driven differentiator (three literary giants sharing one death date) that no Arabic competitor page tells in full |
| `world-tourism-day` | اليوم العالمي للسياحة | 09-27 | Confirmed via UNWTO/dostor.org: UN World Tourism Organization observes it since 1980; date marks the adoption of UNWTO's founding statute on Sep 27, 1970 | Real Gulf-RPM hook available (Saudi Vision 2030 / UAE tourism-economy angle), same pattern that worked for `world-happiness-day`'s UAE Ministry of Happiness angle |

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
