# Holiday Event Premium Content Playbook

Use this playbook when the user gives an event name and asks for a holiday page that can compete seriously in Google Search, pass Google Ads destination quality checks, and feel useful to a real Arabic reader.

This is the research and editorial layer before the technical authoring step in [`docs/add-new-event.md`](./add-new-event.md).

## Promise

For every new holiday/event page, produce a page that does four things at once:

- answers the user's date/countdown question in the first screen
- explains the meaning, status, and practical consequences better than competitors
- gives Google clean metadata, schema, internal links, and sitemap-ready indexability
- gives Google Ads a working, crawlable, original destination with enough value beyond ads

Do not publish an event just because the JSON validates. A valid thin page is still a weak page.

## Input Contract

When the user writes the event name, treat this as the minimum input:

```text
EVENT_NAME:
TARGET_COUNTRY_OR_REGION:
EVENT_TYPE: fixed | hijri | floating | estimated | monthly | unknown
PRIMARY_LANGUAGE: ar
SECONDARY_RESEARCH_LANGUAGE: en
PUBLISH_INTENT: draft | publish after validation
ADS_TRAFFIC_EXPECTED: yes | no | unknown
```

If the country, date rule, or official status is unclear, research first. Do not guess.

## Output Contract

After research and writing, produce only the normal authored event files unless the user asks for something else:

```text
src/data/holidays/events/<slug>/package.json
src/data/holidays/events/<slug>/research.json
src/data/holidays/events/<slug>/qa.json
```

Do not edit generated files. Do not create competitor dumps. Do not store full scraped articles in the repo.

## Source Of Truth

Use these existing guides together:

- Technical event authoring: [`docs/add-new-event.md`](./add-new-event.md)
- Research scraping method: [`docs/content-research-scraping-method.md`](./content-research-scraping-method.md)
- Holiday delivery architecture: [`docs/holidays-delivery-architecture.md`](./holidays-delivery-architecture.md)
- Ads and SEO growth checks: [`docs/google-ads-seo-growth-checklist.md`](./google-ads-seo-growth-checklist.md)

This file defines the quality bar and workflow for premium event creation.

## Phase 1 - Decide If The Event Deserves A Page

Before writing, classify the opportunity.

| Question | Publish if yes | Stop or draft if no |
|---|---|---|
| Is the event real and verifiable? | official, historical, religious, cultural, school, support, or commercial calendar source exists | no reliable source or only social posts |
| Does search intent exist? | people search for date, countdown, holiday status, meaning, greetings, planning, school/work impact | no clear user need |
| Can we add unique value? | date tool + explanation + official source + practical guidance | only a generic paragraph is possible |
| Can the page remain current? | fixed rule, yearly update rule, or official announcement monitoring is clear | date changes unpredictably with no update path |
| Is it Ads-safe? | original value, no misleading claim, no forbidden content | copied, doorway-like, or made only for ad clicks |

If the event is a duplicate of an existing canonical page, add an alias or improve the existing page. Do not create a competing URL.

## Phase 2 - SERP Research

Research must happen before writing. Use a SERP API when possible. Do not scrape Google result pages directly.

Collect:

- top 5 Arabic results for the Arabic primary query
- top 5 English results for the English comparison query
- at least 2 official or high-authority fact sources
- Google autocomplete and People Also Ask style questions when available
- current Search Console queries if the page or a close alias already exists

Recommended query pattern:

```text
Arabic:
- متى <اسم المناسبة> {{year}}
- كم باقي على <اسم المناسبة>
- هل <اسم المناسبة> إجازة
- تاريخ <اسم المناسبة>
- سبب <اسم المناسبة>

English:
- when is <event name> {{year}}
- <event name> holiday date
- is <event name> a public holiday
- <event name> history meaning
- <event name> official holiday
```

For country-specific events, add the country name in both Arabic and English. For Islamic events, add the Hijri year and common Arabic variants.

## Phase 3 - Competitor Brief

Store concise competitor notes in `research.json`, not full copied content.

For each usable competitor, capture:

```json
{
  "site": "",
  "language": "ar",
  "url": "",
  "title": "",
  "wordCount": 0,
  "extractionConfidence": "high",
  "strengths": [],
  "weaknesses": []
}
```

Reject or replace a competitor when:

- it returns non-200 status
- extraction is blocked, noisy, or below 250 useful words
- the page is unrelated to the exact event
- it is a thin doorway page
- it is a social post, PDF-only source, login wall, or auto-translated page
- it copies another source without adding value

For replacements, record the site and reason in `replacedCompetitors`.

## Phase 4 - Official Fact Verification

Competitors are maps, not authorities. Verify facts with primary sources when the fact affects date, holiday status, law, school, money, religion, health, or public planning.

Use official sources first:

- government portals and ministries
- central banks or public authorities for closure/payment dates
- education ministries for school calendars
- Islamic authorities or recognized moon-sighting authorities for Hijri events
- UN/WHO/UNESCO or official international bodies for world days
- reputable encyclopedic or institutional sources only as secondary context

Every important factual claim should answer:

```text
What exactly is the fact?
Who says it?
What is the source URL?
Is it current for {{year}}?
Does it apply to the target country?
What uncertainty should we explain to users?
```

If the date is estimated, write it honestly as estimated. Never present uncertain dates as final.

## Phase 5 - Superiority Plan

Before writing `package.json`, write the superiority plan in `research.json`.

Minimum standard:

- 8 primary queries
- 6 competitors or documented replacements
- 6 keyword gaps
- 6 unanswered questions
- 4 differentiation ideas
- 2 official fact sources

The page must beat competitors on at least three concrete dimensions:

| Dimension | Strong event page example |
|---|---|
| Speed | first paragraph gives date, countdown intent, and public-holiday status |
| Clarity | explains confusing dates, aliases, or country differences |
| Trust | links facts to official sources, not anonymous claims |
| Practical value | tells the user what to do for work, school, travel, greetings, or planning |
| Structure | quick facts, FAQ, year table, related events, and internal links |
| Freshness | `dateModified` reflects a real review or update |
| CTR | title and description answer a specific search intent, not a generic topic |

If competitors are already strong, the page must add a unique product advantage: countdown, date conversion, country notes, official-source explanation, timeline, decision table, or related planning tools.

## Phase 6 - Page Product Blueprint

Think of the holiday page as a product, not an article.

Required first-screen experience:

- H1 with event name and year
- direct answer summary
- event date and day name
- countdown
- country/status signal when relevant
- no popups or blocking overlays

Required content modules:

- `answerSummary`: one strong paragraph that answers the main query in the first 100 words
- `quickFacts`: compact facts for scanning
- `aboutEvent`: 4 to 6 sections that teach, clarify, and help planning
- `faq`: 6 to 10 questions from real search intent
- `engagementContent`: useful facts, tips, caveats, or decision prompts
- `recurringYears`: yearly table context when the event repeats
- `schemaData`: visible-content-matching values for structured data
- `relatedSlugs`: 3 to 6 real related events already in the repo

Strong section pattern:

```text
1. What is the event?
2. When is it this year?
3. Is it an official holiday or practical day off?
4. Why does the date matter or change?
5. How do people observe it?
6. What should the user do next?
```

For national days, include the difference between independence date, national day, liberation day, and public holiday if users confuse them.

For Islamic events, include Hijri/Gregorian pairing, moon-sighting caveat, regional announcement caveat, and related worship/planning context without issuing religious rulings unless sourced.

For school/support/payment events, include official-status caveats and direct the user to verify the final announcement when decisions affect money, work, or school.

## Phase 7 - Arabic Writing Standard

Write in warm Modern Standard Arabic. The reader should feel guided, not lectured.

Required:

- address the reader directly with "أنت" style where natural
- answer before explaining
- one idea per paragraph
- no paragraph longer than 3 sentences
- no generic opening like "في هذا المقال"
- no filler phrases like "تجدر الإشارة" or "في عالمنا اليوم"
- no unsourced statistics or official-status claims
- no translated English sentence structure
- no copy or light paraphrase from competitors

Good opening pattern:

```text
إذا كان سؤالك هو: متى <اسم المناسبة> {{year}}؟ فالجواب أنها توافق <التاريخ>. لكن التاريخ وحده لا يكفي دائماً؛ لأن كثيراً من الباحثين يريدون أيضاً معرفة هل هي إجازة، ولماذا اختير هذا اليوم، وما الذي يتغير من بلد لآخر.
```

Avoid opening with:

```text
تعد مناسبة <اسم المناسبة> من أهم المناسبات التي يحتفل بها الناس حول العالم...
```

That sentence could fit any event, so it adds no value.

## Phase 8 - SEO And CTR Rules

Write metadata before final content, then revise it after content is complete.

### Title Tag

Rules:

- Arabic only for Arabic page
- unique across the site
- 50 to 65 characters when possible
- primary keyword in the first half
- include year when it helps intent
- brand at the end when space allows
- no keyword stuffing
- no fake urgency

Good patterns:

```text
اليوم الوطني الكويتي {{year}} | 25 فبراير والإجازة - ميقاتنا
متى يوم عرفة {{year}} - {{hijriYear}} هـ؟ العد التنازلي
يوم الصحة العالمي {{year}} | التاريخ والموضوع الرسمي
```

### Meta Description

Rules:

- 120 to 155 characters when possible
- written as a click promise
- includes the date/status/benefit
- does not repeat the title
- gives a reason to choose our result

Good pattern:

```text
اعرف موعد <اسم المناسبة> {{year}}، وكم بقي عليها، وهل هي إجازة، مع شرح سريع للمعنى والفرق بينها وبين المناسبات القريبة.
```

### H1

Rules:

- one H1 only
- close to title, not identical
- readable above the fold on mobile
- no overloaded punctuation

### Keywords

Include:

- primary query
- countdown query
- date query
- public holiday query where relevant
- alternate Arabic names
- next-year query
- confusion queries
- country-specific queries

Do not force every keyword into body text. Use them where they answer real questions.

## Phase 9 - Structured Data

Structured data must match visible page content. Do not mark up facts that the user cannot see.

For holiday/event pages, use the repo's `schemaData` fields and validate the generated JSON-LD after build.

Minimum schema-facing values:

```json
{
  "eventName": "",
  "eventAlternateName": "",
  "startDate": "",
  "endDate": "",
  "eventDescription": "",
  "breadcrumbs": [],
  "articleHeadline": ""
}
```

Date rules:

- if the event is all-day and time is unknown, use date only: `{{year}}-MM-DD`
- if it spans days, include both `startDate` and `endDate`
- do not invent midnight timestamps
- do not add a venue unless the event has a real specific venue
- for country-wide holidays, avoid pretending there is one physical location

Google's Event structured data docs require required properties for rich result eligibility and recommend testing with Rich Results Test before release.

## Phase 10 - Google Ads Readiness

A page that may receive Ads traffic must pass these before deployment:

- final URL returns 200 for Googlebot and AdsBot
- page is crawlable and not blocked by robots or noindex
- content is original and useful beyond showing ads
- page is easy to navigate
- no direct download, email-only destination, or broken redirect
- no intrusive interstitial on page load
- privacy/contact/about links are reachable from layout/footer
- ad keyword, ad headline, H1, first paragraph, and visible content all match the same intent
- page has enough visible content to stand alone without ads
- mobile layout is readable and stable

Never send Ads traffic to a draft, thin, unstable, or generic holiday page.

## Phase 11 - Technical Authoring Workflow

Follow the existing event guide after research is complete.

```bash
npm run events:new -- --slug <slug> --name "<Arabic event name>" --type <type> --category <category>
```

Then edit only:

```text
src/data/holidays/events/<slug>/package.json
src/data/holidays/events/<slug>/research.json
src/data/holidays/events/<slug>/qa.json
```

Authoring rules:

- `canonicalPath` must be `/holidays/<slug>`
- `publishStatus` should remain non-public until validation passes
- aliases should point to the canonical event, not create duplicate pages
- `relatedSlugs` must reference existing event slugs
- `countryOverrides` only when a country really needs different facts or search intent
- generated files are rebuilt, never hand-edited

## Phase 12 - Indexability Gate

Before publishing, check:

- the URL is included in `/holidays/sitemap.xml` only if it should be indexed
- the page does not emit `noindex`
- canonical points to itself
- aliases canonicalize correctly
- page returns 200
- OG image route returns a real PNG body
- schema matches visible content
- title and meta description are unique
- the page has internal links from `/holidays`, related pages, or topical clusters

Never submit a URL in Search Console if it intentionally has `noindex` or is an alias/404.

## Phase 13 - Validation Commands

Run the narrow checks first, then the full checks.

```bash
npm run events:build
npm run validate:holidays:slug -- --slug <slug>
npm run validate:holidays:strict
npm run seo:validate
npm run test:unit
npm run build
```

For live verification after deploy:

```bash
curl -I -sS https://miqatona.com/holidays/<slug>
curl -I -sS https://miqatona.com/holidays/<slug>/opengraph-image
curl -sS -o /tmp/<slug>-og.png https://miqatona.com/holidays/<slug>/opengraph-image
file /tmp/<slug>-og.png
wc -c /tmp/<slug>-og.png
npm run health:routes:live
npm run ads:readiness:live
```

If a Google Search Console export exists, triage after deployment:

```bash
npm run coverage:triage -- --input=/path/to/gsc-export.csv --base=https://miqatona.com --out=/tmp/gsc-coverage-report.json
```

## Phase 14 - QA File Standard

Use `qa.json` as workflow truth, not as a place for hidden content.

It should confirm:

- research completed
- official facts verified
- Arabic quality reviewed
- SEO fields completed
- schema checked
- related links checked
- validation commands run
- publish decision made

Do not write raw developer jargon in Arabic notes unless needed. Prefer human terms:

| Avoid | Prefer |
|---|---|
| FAQ | الأسئلة الشائعة |
| OG image | صورة المشاركة |
| schema | البيانات المنظمة |
| canonical | الرابط الأساسي |
| countryOverrides | صياغة خاصة بكل دولة |

## Phase 15 - Maintenance

Every published event needs a review cycle.

Review immediately when:

- the date is announced officially
- a government changes holiday rules
- the school calendar changes
- the Hijri date is confirmed by moon sighting
- Search Console shows impressions with low CTR
- Search Console reports noindex, 404, canonical, redirect, or 5xx issues
- Google Ads reports destination, crawlability, or insufficient content issues

When updating, change `dateModified` only if the visible content or facts actually changed.

## Ready-To-Use Prompt

Use this prompt when asking Codex to create one new event:

```text
Create a premium Miqatona holiday event for:

EVENT_NAME:
TARGET_COUNTRY_OR_REGION:
DATE_OR_RULE_IF_KNOWN:
CATEGORY:
PUBLISH_INTENT:

Follow docs/holiday-event-premium-content-playbook.md first.
Use top 5 Arabic and top 5 English SERP competitors, plus official sources.
Store concise research only in research.json.
Create or edit only the event package files under src/data/holidays/events/<slug>/.
Make the page stronger than competitors in date clarity, official-source trust, practical guidance, Arabic quality, metadata CTR, schema, internal links, and Ads readiness.
Run the relevant validation commands and report exactly what passed or failed.
```

## Final Acceptance Checklist

The event is not done until every item below is true:

- [ ] event is real, non-duplicate, and worth indexing
- [ ] 5 Arabic and 5 English results were reviewed or replaced with reasons
- [ ] official facts are separated from competitor observations
- [ ] `research.json` contains concise gaps, questions, sources, and differentiation ideas
- [ ] first 100 words answer date/countdown/status intent directly
- [ ] Arabic is original, warm, and not generic
- [ ] metadata is unique and written for CTR
- [ ] schema values match visible content
- [ ] related internal links point to existing useful pages
- [ ] page is not `noindex` if published and sitemap-listed
- [ ] Ads destination checks are clean for crawlability, originality, navigation, and mobile experience
- [ ] validations pass before deploy
- [ ] after deploy, live route and OG image body are tested

## External Policy References

- Google Search Central: [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- Google Search Central: [Influencing title links in Google Search](https://developers.google.com/search/docs/appearance/title-link)
- Google Search Central: [How to write meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- Google Search Central: [Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event)
- Google Ads Help: [Destination requirements](https://support.google.com/adspolicy/answer/6368661)
