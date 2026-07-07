# Add New Event

This is the single authoritative guide for adding a new `/holidays/[slug]` event.

If you give only one file to another AI, give it this file.

## AI Handoff Answer

Yes: this is the docs file to give another AI when you only know the event name.

Give the AI:

```text
docs/add-new-event.md
EVENT_NAME: <Arabic or English event name>
TARGET_COUNTRY_OR_REGION: <country, region, global, or unknown>
DATE_OR_RULE_IF_KNOWN: <fixed date, Hijri date, floating rule, or unknown>
PUBLISH_INTENT: draft until validated
```

The AI must use this file as a strict contract and should create or edit only:

```text
src/data/holidays/events/<slug>/package.json
src/data/holidays/events/<slug>/research.json
src/data/holidays/events/<slug>/qa.json
```

The AI must not edit generated files, runtime files, sitemap files, repository files, or compatibility layers by hand.

The AI must optimize for:
- correct event facts and date rules
- Arabic human-facing quality
- SEO metadata and search intent
- structured data that matches visible content
- indexability through the normal event build pipeline
- Google Ads destination quality when the page may receive paid traffic
- clear uncertainty when a date, status, or source is not fully verified

Indexing cannot be guaranteed by any file or AI response. The correct goal is indexing readiness: valid data, strong content, clean metadata, sitemap eligibility after publish, and no `noindex` contradiction.

Use this file when:
- a developer adds an event manually
- an AI agent is asked to add a new event
- you want to know which files to create
- you want to know which keys are required
- you want the event to become live, buildable, and indexable without editing runtime code

## Architecture Rule

There is only one authoring source of truth:

```text
src/data/holidays/events/<slug>/
  package.json
  research.json
  qa.json
```

Everything else is generated, runtime-only, or compatibility output.

Current architecture flow:

```text
src/data/holidays/events/<slug>/
  -> npm run events:build
  -> src/data/holidays/generated/runtime-records-by-slug.json
  -> src/lib/holidays/repository.js
  -> page/runtime consumers
```

Compatibility layers still exist, but they are not authoring targets:
- `src/lib/events/index.js`
- `src/lib/event-content/index.js`

Future delivery/export may mirror the same normalized data into:
- `out/holidays-delivery/*`

That means a new event should be authored once, in one folder only, and everything else should be regenerated from it.

## Zero-Ambiguity Rule For AI

If you hand this guide to another AI, the AI should generate only these three files:

```text
src/data/holidays/events/<slug>/package.json
src/data/holidays/events/<slug>/research.json
src/data/holidays/events/<slug>/qa.json
```

The AI should not invent extra source folders, should not edit runtime code, and should not return generated artifacts.

Do not hand-edit:
- `src/data/holidays/generated/*`
- `src/lib/holidays/repository.js`
- `src/lib/events/generated-aliases.js`
- `src/lib/events/index.js`
- `src/lib/event-content/index.js`
- `out/holidays-delivery/*`

If the event folder is correct, `npm run dev`, `npm run build`, or `npm run events:build` will pick it up automatically.

This separation is intentional so the same authored event can later be delivered from local files, VPS storage, CDN JSON, or Postgres without changing the event package itself.

## What Makes An Event Go Live

For a new event to be publicly usable and indexable, all of this should be true:

1. The folder exists under `src/data/holidays/events/<slug>/`.
2. `package.json` is valid against the event package schema.
3. Generated indexes are rebuilt with `npm run events:build` or any normal app build.
4. The event is published with `publishStatus: "published"` or `publishStatus: "monitored"`.
5. The page has enough real content to pass validation and be worth indexing.

Important:
- Draft events can exist in the source tree without being ready for public rollout.
- The holiday sitemap includes canonical and alias pages only for events whose `publishStatus` is `published` or `monitored`.
- `qa.json` does not publish a page by itself. Runtime behavior is driven by `package.json`.
- The live app currently reads generated holiday data through `src/lib/holidays/repository.js`, so new events must flow through the normal package -> build -> generated bundle path.

## What This Guide Can And Cannot Guarantee

This guide can make a new event:
- routable
- buildable
- canonical
- sitemap-eligible
- structured-data-ready
- indexable in the technical SEO sense after deployment
- much more likely to rank and earn clicks if the content quality is strong

This guide cannot honestly guarantee:
- first place in Google
- automatic indexing for every event
- automatic ranking
- automatic clicks or impressions

Google decides indexing, ranking, and title rewriting.

The purpose of this guide is to give an AI enough rules to produce an event package that is:
- technically correct
- editorially stronger
- safer to publish
- better aligned with Arabic search behavior

Important:
- The AI should optimize for indexing readiness, strong Arabic SEO, and topical completeness.
- The AI should not promise guaranteed or instant indexing.
- The AI should do deep research before writing and should explain uncertainty honestly when facts are weak or disputed.

## Fast Workflow

### 1. Scaffold the folder

Replace `<slug>` with the real canonical slug, for example `world-fathers-day`.

```bash
npm run events:new -- --slug <slug> --name "اسم المناسبة" --type fixed --category holidays
```

Example:

```bash
npm run events:new -- --slug world-fathers-day --name "يوم الأب العالمي" --type floating --category social
```

This creates:

```text
src/data/holidays/events/eid-al-rajul/package.json
src/data/holidays/events/eid-al-rajul/research.json
src/data/holidays/events/eid-al-rajul/qa.json
```

Scaffold defaults:
- the event starts hidden until you sync it live
- `countryScope: "none"` unless the scaffold is clearly a shared Islamic event
- base and country keyword templates are scaffolded automatically
- empty research and QA tracking records

### 2. Fill the three authoring files

Edit only:
- `package.json`
- `research.json`
- `qa.json`

### 3. Build generated indexes

```bash
npm run events:build
```

This also runs automatically inside:
- `npm run dev`
- `npm run build`

### 4. Sync the event

```bash
npm run events:sync -- --slug <slug>
```

This command rebuilds generated indexes, validates the event, and makes it live automatically when the package is valid.

If the event syncs successfully, it will automatically appear in:
- the main `/holidays` listing
- matching holiday filters
- supported country filters when `countryScope: "all"`

If you only want to check the content without making it live, use:

```bash
npm run validate:holidays:slug -- --slug <slug>
```

## Folder Contract

Each event folder must contain exactly these three authored files:

```text
src/data/holidays/events/<slug>/
  package.json
  research.json
  qa.json
```

### `package.json`

Purpose:
- event identity
- date logic
- page content
- SEO metadata
- aliases and country behavior
- publish state

This file controls runtime behavior.

### `research.json`

Purpose:
- search intent research
- competitor notes
- fact sources
- keyword gaps
- editorial differentiation

This file helps content quality and SEO, but it does not control routing.

### `qa.json`

Purpose:
- editorial readiness tracking
- fact-check tracking
- schema tracking
- SEO validation tracking

This file is for workflow status, not routing logic.

Important:
- `qa.json` is internal workflow content, not public page copy.
- Even so, its Arabic should stay simple and human, not developer-heavy.
- Do not write raw implementation terms in `qa.json` notes unless there is no simple Arabic alternative.
- Avoid terms like `FAQ`, `og image`, `countryOverrides`, `canonicalPath`, `schema`, or similar code-facing wording inside natural Arabic notes.
- Prefer simple Arabic such as:
  - `الأسئلة الشائعة` instead of `FAQ`
  - `صورة المشاركة` instead of `og image`
  - `صياغة خاصة بكل دولة` instead of `countryOverrides`
  - `الرابط الأساسي للصفحة` instead of `canonicalPath`

## `package.json` Structure

This is the full model you should think in:

```json
{
  "schemaVersion": 1,
  "core": {},
  "richContent": {},
  "countryOverrides": {},
  "aliasSlugs": [],
  "countryScope": "none",
  "countryAliasTemplate": "{{slug}}-in-{{countrySlug}}",
  "keywordTemplateSet": {
    "base": [],
    "country": []
  },
  "publishStatus": "drafted",
  "canonicalPath": "/holidays/your-slug",
  "canonicalSource": "internal",
  "sourceAuthority": "fixed-calendar"
}
```

### Top-level keys

`schemaVersion`
- Current schema version.
- Keep this as `1`.

`core`
- Required.
- Defines the event identity and date rules.

`richContent`
- Required in practice.
- Holds the public page content and SEO content.

`countryOverrides`
- Optional map keyed by country code like `sa`, `eg`, `ma`.
- Use only when one country needs custom SEO or factual wording.

`aliasSlugs`
- Optional extra slugs that should resolve to the same canonical event.

`countryScope`
- Required in practice.
- Allowed values:
  - `none`
  - `all`
  - `custom`

`countryAliasTemplate`
- Template for auto-generated country aliases when `countryScope` expands by country.
- Default is `{{slug}}-in-{{countrySlug}}`.

`keywordTemplateSet`
- Optional but strongly recommended.
- Lets the build generate reusable keyword variants.
- For shared events, `keywordTemplateSet.country` is strongly recommended so country pages get better Arabic SEO automatically.

`publishStatus`
- Internal live-visibility field.
- For normal authoring, think in two simple states only:
  - hidden before sync
  - live after a successful sync

`canonicalPath`
- Must be `/holidays/<slug>`.

`canonicalSource`
- Usually `internal`.

`sourceAuthority`
- Optional label for the date source style.
- Typical values are inferred from type, such as:
  - `hijri-authority`
  - `official-announcement`
  - `rule-based-calendar`
  - `fixed-calendar`

`queueOrder`
- Optional manual ordering hint.

`notes`
- Optional internal notes.

`retirement`
- Optional. Use ONLY for an event that will genuinely never recur (a one-off news item, a status
  page tied to a program that may be discontinued or suspended, a one-time results/announcement page
  with no future occurrence). Shape: `{ "afterDate": "ISO date string", "reason": "short Arabic note" }`.
  Once `afterDate` is in the past, the build automatically drops the event from the published index —
  the page 404s and disappears from the sitemap with no manual unpublish step and no file deletion.
- Do NOT add this to annually-recurring events (exam results, salary/pension paydays, Islamic dates,
  seasonal countdowns) — those stay published forever and auto-roll via `{{year}}`/`{{nextYear}}`.

## `core` Keys

Example:

```json
{
  "id": "world-health-day",
  "slug": "world-health-day",
  "name": "يوم الصحة العالمي",
  "type": "fixed",
  "category": "social",
  "month": 4,
  "day": 7
}
```

### Core identity keys

`id`
- Internal event id.
- Keep it the same as the canonical slug.

`slug`
- Canonical route slug.
- Must be lowercase and URL-safe.

`name`
- Public Arabic event name.

`type`
- Determines which date fields are required.
- Allowed values:
  - `fixed`
  - `hijri`
  - `estimated`
  - `monthly`
  - `floating`
  - `easter`

`category`
- Allowed values:
  - `islamic`
  - `national`
  - `school`
  - `holidays`
  - `astronomy`
  - `social`
  - `business`
  - `support`

Category guidance:
- `social`: social, cultural, awareness, and international observance pages such as يوم الأب العالمي، اليوم الدولي للمرأة، يوم الأرض، يوم الصحة العالمي
- `support`: benefit/payment/support-program dates such as حساب المواطن، الضمان الاجتماعي، التقاعد، برامج الإعانة
- `holidays`: official public holidays and broad vacation-style occasions
- `school`: academic calendar dates and education-cycle milestones
- `business`: market, salary-cycle, or work-operation dates when the main intent is operational or financial

`_countryCode`
- Optional.
- Use for a single-country event like a country-specific national day or salary date.

### Date keys by `type`

For `fixed`:
- `month`
- `day`

Example:

```json
{
  "type": "fixed",
  "month": 4,
  "day": 7
}
```

For `hijri`:
- `hijriMonth`
- `hijriDay`

Example:

```json
{
  "type": "hijri",
  "hijriMonth": 9,
  "hijriDay": 1
}
```

For `estimated`:
- `date`

Use a dynamic pattern when the year changes:

```json
{
  "type": "estimated",
  "date": "{{year}}-07-15"
}
```

For `monthly`:
- `day`

Example:

```json
{
  "type": "monthly",
  "day": 27
}
```

For `floating`:
- `month`
- `weekday`
- `nth`
- optional `offsetDays`

Meaning:
- `weekday` uses `0` to `6`
- `nth` means first, second, third, fourth, or fifth matching weekday

Example:

```json
{
  "type": "floating",
  "month": 11,
  "weekday": 4,
  "nth": 4,
  "offsetDays": 0
}
```

For `easter`
- the schema supports this type
- keep the supporting event content and SEO explicit
- if you use it, make sure the date behavior is already supported by the downstream runtime before rollout

## `richContent` Keys

This is the content the user actually sees and the search engine actually evaluates.

The safest structure is:

```json
{
  "seoTitle": "",
  "description": "",
  "keywords": [],
  "answerSummary": "",
  "quickFacts": {},
  "aboutEvent": {},
  "faq": [],
  "intentCards": [],
  "engagementContent": [],
  "seoMeta": {},
  "recurringYears": {},
  "schemaData": {},
  "relatedSlugs": []
}
```

### Core `richContent` fields

`seoTitle`
- Human-readable page title idea.
- For Islamic events, always include both years in this exact dynamic pattern:
  - `{{year}} - {{hijriYear}} هـ`

`description`
- Short summary of the event and why it matters.
- For Islamic events, the description must also include the same dynamic year pair:
  - `{{year}} - {{hijriYear}} هـ`

`keywords`
- Direct keyword targets for the event page.

`answerSummary`
- Short, snippet-friendly answer that directly answers "when is it" or "what is it".

`quickFacts`
- Either an object or an array.
- Usually easiest as a simple object.
- Good for date, day of week, category, authority, and countdown facts.

`aboutEvent`
- Object of section headings to paragraph text.
- Good default headings:
  - `ما هو <event>?`
  - `التاريخ والأصل`
  - `الأهمية والمكانة`
  - `كيف يُحيا هذا اليوم`

`faq`
- Array of `{ "question": "...", "answer": "..." }`.
- This is the clearest authoring format.
- This is now the only FAQ format you need to author by hand.
- The build/runtime pipeline generates the legacy FAQ mirrors automatically.

`intentCards`
- Optional cards for user action paths.

`engagementContent`
- Optional short content units like facts, tips, checklist items, or quotes.

`seoMeta`
- Main technical SEO metadata block.

`recurringYears`
- Text used for recurring-year explanation tables.

`schemaData`
- Structured-data helper values used by JSON-LD generation.
- For Islamic events, `schemaData.eventName`, `schemaData.eventDescription`, and `schemaData.articleHeadline` should all include `{{year}} - {{hijriYear}} هـ`.

`relatedSlugs`
- Related canonical event slugs that already exist in the repo.

### `seoMeta` keys

Typical shape:

```json
{
  "titleTag": "يوم الصحة العالمي {{year}} | كم باقي؟ - ميقات",
  "metaDescription": "موعد يوم الصحة العالمي {{year}} في 7 أبريل...",
  "h1": "يوم الصحة العالمي {{year}} | كم باقي؟",
  "canonicalPath": "/holidays/world-health-day",
  "ogTitle": "يوم الصحة العالمي {{year}} | كم باقي؟",
  "ogDescription": "موعد يوم الصحة العالمي {{year}} في 7 أبريل...",
  "ogImageAlt": "يوم الصحة العالمي {{year}} — {{formattedDate}}",
  "primaryKeyword": "متى يوم الصحة العالمي {{year}}",
  "secondaryKeywords": [],
  "longTailKeywords": [],
  "datePublished": "2026-04-06T00:00:00.000Z",
  "dateModified": "2026-04-06T00:00:00.000Z",
  "inLanguage": "ar",
  "eventCategory": "support"
}
```

Purpose of each key:

`titleTag`
- Browser title and SERP title baseline.

`metaDescription`
- Search snippet baseline.

`h1`
- Main heading.

`canonicalPath`
- Must match `/holidays/<slug>`.

`ogTitle`, `ogDescription`, `ogImageAlt`
- Social sharing metadata.

`primaryKeyword`
- Main SEO phrase.

`secondaryKeywords`
- Supporting search phrases.

`longTailKeywords`
- Longer and more specific intent-driven phrases.

`datePublished`, `dateModified`
- ISO timestamps for freshness and article metadata.

`inLanguage`
- Usually `ar`.

`eventCategory`
- Same taxonomy family as the event category.

### `schemaData` keys

Typical shape:

```json
{
  "eventName": "يوم الصحة العالمي {{year}}",
  "eventAlternateName": "",
  "startDate": "{{year}}-04-07",
  "endDate": "{{year}}-04-07",
  "eventDescription": "موعد يوم الصحة العالمي {{year}} في 7 أبريل...",
  "breadcrumbs": [
    { "name": "الرئيسية", "path": "/" },
    { "name": "المناسبات", "path": "/holidays" },
    { "name": "يوم الصحة العالمي", "path": "/holidays/world-health-day" }
  ],
  "articleHeadline": "يوم الصحة العالمي {{year}} — العد التنازلي والمعلومات الكاملة"
}
```

Purpose:

`eventName`
- Structured event/article name.

`eventAlternateName`
- Optional alternate naming.

`startDate`, `endDate`
- Structured date output for the event.

`eventDescription`
- Structured-data summary.

`breadcrumbs`
- Structured breadcrumb trail.

`articleHeadline`
- Structured article headline.

`faqSchemaItems`
- Generated automatically from `faq` during compile/runtime compatibility.
- You do not need to author this field manually for new events.

### Allowed dynamic tokens

Use only supported tokens in dynamic text:
- `{{year}}`
- `{{hijriYear}}`
- `{{nextYear}}`
- `{{daysRemaining}}`
- `{{eventName}}`
- `{{formattedDate}}`
- `{{hijriDate}}`

Avoid hardcoding fresh years like `2026` in public copy unless the value is intentionally static metadata.

### Islamic event year-pair rule

If `core.category` is `islamic`, titles and descriptions must always use both the Gregorian year and Hijri year together in this exact dynamic form:

```text
{{year}} - {{hijriYear}} هـ
```

Apply this rule to:
- `richContent.seoTitle`
- `richContent.description`
- `richContent.seoMeta.titleTag`
- `richContent.seoMeta.metaDescription`
- `richContent.seoMeta.h1`
- `richContent.seoMeta.ogTitle`
- `richContent.seoMeta.ogDescription`
- `richContent.schemaData.eventName`
- `richContent.schemaData.eventDescription`
- `richContent.schemaData.articleHeadline`

Good examples:
- `رمضان {{year}} - {{hijriYear}} هـ — عد تنازلي دقيق`
- `تعرف على موعد رمضان {{year}} - {{hijriYear}} هـ مع عداد تنازلي دقيق...`

Do not:
- write only `{{year}}` for Islamic event titles/descriptions
- hardcode `2026` or `1447` in reusable copy
- use a slash or a different separator when the paired year label is intended

## Country Behavior

### Global canonical event

Use:
- no `core._countryCode`
- `countryScope: "none"`

Good when:
- the event is one global page
- no country aliases are needed

### Shared multi-country event

Use:
- no `core._countryCode`
- `countryScope: "all"`

Good when:
- one canonical page should also serve country-specific search demand
- the build should generate country route aliases automatically
- the event should be available in country filters and the holiday sitemap
- the canonical page should stay `/holidays/<slug>`
- country pages like `/holidays/<slug>-in-egypt` should be auto-generated from the same event

Important:
- Shared events are authored once.
- The canonical page stays country-neutral.
- Country-specific SEO is generated from `keywordTemplateSet.country` and `countryOverrides`.
- Ramadan, Eid, and similar shared Islamic events should follow this model.

### Single-country event

Use:
- `core._countryCode`
- `countryScope: "none"`

Good when:
- the event belongs to one country only

### Supported countries for shared expansion

Shared events with `countryScope: "all"` currently expand across these supported countries:

- السعودية (`sa`)
- مصر (`eg`)
- المغرب (`ma`)
- الجزائر (`dz`)
- الإمارات (`ae`)
- تونس (`tn`)
- الكويت (`kw`)
- قطر (`qa`)
- العراق (`iq`)
- سوريا (`sy`)
- اليمن (`ye`)
- الأردن (`jo`)
- ليبيا (`ly`)
- عمان (`om`)
- فلسطين (`ps`)
- كندا (`ca`)
- فرنسا (`fr`)
- تركيا (`tr`)
- أمريكا (`us`)

If you add a new supported country later in the taxonomy, every shared event automatically inherits that new country route and its generated country SEO.

### `countryOverrides`

Use `countryOverrides` only when a specific country needs custom text.

Example:

```json
{
  "countryOverrides": {
    "sa": {
      "seoTitle": "عيد الرجل في السعودية {{year}}",
      "description": "شرح محلي خاص بالسعودية...",
      "keywords": [
        "عيد الرجل في السعودية {{year}}"
      ],
      "aliasSlugs": [
        "eid-al-rajul-in-saudi"
      ],
      "seoMeta": {
        "h1": "عيد الرجل في السعودية {{year}}"
      }
    }
  }
}
```

Do not put country-specific wording into the base content unless the whole event is single-country.

## `research.json` Structure

This is the recommended shape:

```json
{
  "slug": "your-slug",
  "locale": "ar",
  "capturedAt": "2026-04-17T00:00:00.000Z",
  "primaryQueries": [],
  "competitors": [],
  "coverageMatrix": [],
  "keywordGaps": [],
  "unansweredQuestions": [],
  "differentiationIdeas": [],
  "factSources": [],
  "notes": ""
}
```

### Research keys

`slug`
- Must match the event slug.

`locale`
- Usually `ar`.

`capturedAt`
- ISO timestamp for the research snapshot.

`primaryQueries`
- Main search queries you want this page to rank for.

`competitors`
- Existing ranking pages or official sources.

Recommended competitor item:

```json
{
  "site": "who.int",
  "type": "official",
  "url": "https://example.com",
  "focus": ["التاريخ الرسمي", "الموضوع"],
  "gaps": ["لا يستهدف نية الباحث العربي"]
}
```

`coverageMatrix`
- Keyword-to-purpose mapping.

Example:

```json
{
  "keyword": "متى يوم الصحة العالمي {{year}}",
  "whyItMatters": "نية مباشرة لمعرفة التاريخ الحالي بسرعة."
}
```

`keywordGaps`
- Important missing angles in competitor content.

`unansweredQuestions`
- Real user questions the page should answer.

`differentiationIdeas`
- Why this page can be better than competitors.

`factSources`
- Official or trustworthy URLs used to verify facts.

Example:

```json
{
  "label": "WHO: World Health Day",
  "url": "https://www.who.int/campaigns/world-health-day"
}
```

`notes`
- Freeform editorial note about SERP patterns, source confidence, or SEO angle.

## Mandatory Competitive Research Standard

Every real event must be researched before the AI writes public copy.

The AI must not generate the event from the name alone. It must first gather:

- the official source for the date or date rule
- the top 5 Arabic pages for the main Arabic query
- the top 5 English pages for the closest English query
- Google-style question patterns, autocomplete-style phrasing, and country-specific wording when relevant
- at least one source that explains the event's origin, purpose, or official status

Use competitor pages to understand the SERP, not to copy it.

Allowed:
- extracting headings, covered topics, missing angles, and repeated user questions
- identifying weak Arabic explanations, thin pages, outdated dates, or missing caveats
- learning which questions users are trying to answer
- recording URLs and gap notes in `research.json`

Not allowed:
- copying competitor paragraphs
- lightly paraphrasing a competitor structure section by section
- translating English content and publishing it as original Arabic
- using unverifiable facts because many competitors repeat them
- writing a generic article that could fit any event by changing the event name

### Competitor capture requirement

For each of the 10 competitor/reference pages, add a `research.json.competitors` entry with:

```json
{
  "site": "example.com",
  "type": "official|arabic-competitor|english-competitor|reference",
  "url": "https://example.com/page",
  "focus": ["what the page answers well"],
  "gaps": ["what our page must answer better"]
}
```

If the AI cannot access 10 useful pages, it must say so in `research.json.notes`, keep the event drafted unless the official source and page quality are still strong, and explain the research limitation in the final response.

### Superiority plan requirement

Before writing `package.json`, the AI must decide how our page will beat the current results.

The plan must appear in `research.json.differentiationIdeas` and should cover:

- the direct answer that appears in the first 100 Arabic words
- the exact date, countdown, and whether it is a public holiday or only an observance
- the official date source and any uncertainty or annual theme caveat
- what competitors failed to explain clearly
- the difference between this event and similar events
- practical value for the reader: school project, family planning, work calendar, content ideas, awareness participation, or travel context
- country-specific wording when the event is shared across Arabic countries
- the safe caveat needed for health, legal, political, financial, or humanitarian topics

The public Arabic copy must make the user feel:

```text
وجدت التاريخ بسرعة، وفهمت معنى المناسبة، وعرفت هل هي إجازة أم لا، وأخذت فكرة عملية لما يمكنني فعله بهذا اليوم.
```

### Official-source hierarchy

Use official sources before competitors:

1. UN, UNESCO, WHO, UNICEF, UNHCR, FAO, ILO, WMO, official government, or official event organizer pages.
2. Major institutional pages such as universities, public agencies, or international federations.
3. Calendar/reference pages such as timeanddate or Office Holidays only to support date/status, not as the main authority when an official page exists.
4. News or blog pages only for search intent, examples, or regional phrasing.

For health-awareness events, the page must:

- avoid diagnosis, treatment instructions, or personalized medical advice
- recommend qualified professional care for personal health decisions
- use WHO or a named health authority as a fact source when available
- avoid fear-based or stigmatizing wording

For legal, humanitarian, migration, press, or rights-related events, the page must:

- stay factual and neutral
- avoid partisan claims
- separate date facts from interpretation
- cite official or institutional sources for sensitive claims

### Research must shape public content

The AI must not leave research hidden in `research.json` only.

The best findings must become visible in:

- `answerSummary`
- `quickFacts`
- `aboutEvent`
- `faq`
- `seoMeta.titleTag`
- `seoMeta.metaDescription`
- `keywordTemplateSet.base`
- `keywordTemplateSet.country` when the event is shared

If a competitor gap is not addressed in public content, do not list it as a real gap.

## `qa.json` Structure

Recommended shape:

```json
{
  "slug": "your-slug",
  "publishStatus": "drafted",
  "checks": {
    "contentReady": false,
    "factChecked": false,
    "schemaValid": false,
    "seoValidated": false,
    "hasHardcodedYear": false
  },
  "notes": [],
  "updatedAt": "2026-04-17T00:00:00.000Z"
}
```

### QA keys

`slug`
- Must match the event slug.

`publishStatus`
- Workflow copy of the package publish status.

`checks.contentReady`
- Set to `true` when the page content is truly ready for users.

`checks.factChecked`
- Set to `true` after factual review.

`checks.schemaValid`
- Set to `true` after structured-data review.

`checks.seoValidated`
- Set to `true` after SEO review.

`checks.hasHardcodedYear`
- Should usually stay `false`.

`notes`
- Short QA or source notes.
- Write them for a normal Arabic editor or site owner, not for a programmer.
- Keep them practical, brief, and free from code jargon.

`updatedAt`
- ISO timestamp of the latest review.

## Recommended Content Rules

For strong indexing and ranking potential:
- write an `answerSummary` that answers the main query immediately
- include at least 6 strong FAQ entries for live events
- use real `relatedSlugs` only when there are truly relevant existing events to connect
- include trustworthy `factSources` in `research.json`
- if the event is shared, add useful `keywordTemplateSet.country` templates so country routes inherit stronger SEO queries automatically
- keep `titleTag`, `metaDescription`, `h1`, and `schemaData` aligned
- author one clean `faq` array and let the compiler generate FAQ mirrors automatically
- avoid placeholder text like `TODO`, `TBD`, or `قريباً`
- avoid unexplained hardcoded current years in body copy
- keep country-neutral base content when the event expands across countries
- if the event is shared across countries, do not mention specific country names in the base canonical copy unless that mention is essential and neutral
- if `relatedSlugs` is used, keep it between 4 and 6 real related canonical slugs; otherwise leave it empty and the page will fall back to automatic related suggestions
- make the page feel richer than a thin countdown page by covering:
  - the direct answer
  - the meaning of the event
  - why people search for it
  - the practical value for the reader
  - differences between countries when relevant
  - what to do before the date or on the date
- write every section as if it will compete with the strongest Arabic result, not as filler around a countdown
- aim for this minimum editorial shape for a real live event:
  - `answerSummary`: 2 to 4 natural sentences with a direct answer and one useful nuance
  - `aboutEvent`: 4 real sections, each adding a different angle instead of repetition
  - `faq`: at least 6 strong questions with answers that teach something, not just repeat the title
  - `seoMeta.secondaryKeywords`: usually 6 to 12 phrases
  - `seoMeta.longTailKeywords`: usually 10 to 20 phrases
  - `research.json.primaryQueries`: at least 10 real Arabic queries
  - `research.json.competitors`: at least 10 researched pages when web access is available, ideally 5 Arabic and 5 English/reference pages
  - `research.json.keywordGaps`: at least 8 meaningful missed angles
  - `research.json.unansweredQuestions`: at least 6 real user questions
  - `research.json.factSources`: at least 3 trustworthy sources for a real event
  - `research.json.coverageMatrix`: at least 8 rows showing why those queries matter

## SEO Rules For AI-Written Events

When another AI writes an event, it should not produce flat or generic SEO copy.

### Title rules

Avoid weak titles like:
- `يوم الطيبة العالمي {{year}}`
- `معلومات عن يوم الطيبة العالمي`
- `الصفحة الرسمية ليوم الطيبة العالمي`

Prefer strong Arabic intent-led titles such as:
- `متى يوم الطيبة العالمي {{year}}؟ | كم باقي على المناسبة`
- `كم باقي على يوم الطيبة العالمي {{year}}؟ | العد التنازلي والموعد`
- `ما هو يوم الطيبة العالمي؟ | الموعد والمعنى والأسئلة الشائعة`

Title requirements:
- must match the main search intent
- should usually start with the main query
- should avoid robotic wording
- should avoid stuffing many keywords into one line
- should feel useful and clickable to an Arabic user

### Meta description rules

The `metaDescription` should:
- answer the main question fast
- mention the date or countdown angle when available
- mention one or two extra reasons to click
- stay specific instead of generic

Weak:
- `تعرف على معلومات عن يوم الطيبة العالمي.`

Better:
- `إذا كنت تبحث عن موعد يوم الطيبة العالمي {{year}} فهذه الصفحة تعرض التاريخ الصحيح والعد التنازلي وفكرة المناسبة وأهم الأسئلة الشائعة عنها.`

### Keyword rules

The AI should not generate random keyword spam.

Use this hierarchy:
- `primaryKeyword`: one strongest main query
- `secondaryKeywords`: 6 to 12 close variations
- `longTailKeywords`: 10 to 20 real intent phrases

The keyword mix should be broad and varied:
- short phrases such as `عيد الأب {{year}}`
- medium phrases such as `موعد عيد الأب {{year}}`
- longer phrases such as `متى عيد الأب في الدول العربية {{year}}`
- question-style phrases such as `ما هو يوم الأب العالمي`
- action/help phrases when relevant such as `كيف أحتفل بعيد الأب`
- country phrases when the event is shared

Do not just dump those phrases into JSON arrays.
Spread them naturally through:
- `titleTag`
- `h1`
- `metaDescription`
- `answerSummary`
- `aboutEvent` headings and paragraphs
- FAQ questions and answers
- `keywordTemplateSet.base`
- `keywordTemplateSet.country` when the event is shared

Natural integration rule:
- the strongest phrase should appear naturally in the title and direct answer
- supporting variations should appear across the summary and FAQ
- longer phrases should be answered through real section headings or real user questions
- the page should still read like strong Arabic editorial writing, not like a keyword list

Good Arabic query patterns:
- `متى <event> {{year}}`
- `كم باقي على <event> {{year}}`
- `موعد <event> {{year}}`
- `ما هو <event>`
- `كيف يحتفل الناس بـ <event>`
- `تاريخ <event> {{year}}`

### Content rules

The page should answer the intent fast:
- first answer in `answerSummary`
- then quick facts
- then short explanation
- then FAQ

The page should also feel like a real Arabic editorial page:
- the opening should solve the search intent immediately
- the body should add context, not repeat the same sentence in different forms
- each FAQ answer should teach the reader something useful, not just restate the title
- the content should give the reader enough value that they do not need to go back to search results right away

The AI should write content that is:
- direct
- Arabic-first
- helpful
- non-robotic
- non-repetitive
- understandable to a normal Arabic user without technical background
- free from implementation words, config labels, and code terminology

The AI must not write public-facing content like this:
- `هذه الصفحة تحتوي على FAQ`
- `تم ضبط og image`
- `يوجد countryOverrides لبعض الدول`
- `تمت تهيئة schema`
- `فهذه الصفحة تعرض الجواب مباشرة في HTML`
- `البيانات هنا محفوظة في JSON`
- `تم اختيار هذا slug`

Instead it should write natural Arabic that sounds like a real editor or writer speaking to a normal reader.

### Hard rule: write TO the reader, never ABOUT them (added 2026-07-07)

Every user-facing field (`answerSummary`, `aboutEvent`, `about.paragraphs`, `history`, `significance`,
`details`, FAQ answers) must speak directly to the reader in second person ("أنت"/"لك"/your-thing), like
a knowledgeable friend explaining something practical. It must NEVER describe the reader in the third
person as a detached "المستخدم" ("the user") or "الزائر" ("the visitor") or "الباحث" ("the researcher") —
that register reads as AI-generated and kills trust and dwell time. A site-wide audit on 2026-07-07 found
72 of 151 live events written in this banned register, traced back to this exact scaffold template.

```
// ❌ third-person / meta-SEO voice (banned):
"نية المستخدم هنا عملية جداً: متى ينزل الراتب هذا الشهر"
"هذه الصفحة تساعد الزائر على متابعة موعد إعلان النتائج"
"يحتاج الزائر إلى معرفة الموعد بدقة"
"ما يفعله المستخدم عادة هو متابعة العداد"

// ✅ direct address (required):
"إذا كان سؤالك المباشر: متى ينزل راتبك هذا الشهر"
"تابع موعد إعلان نتيجتك، وتعرف على طريقة الاستعلام الرسمية"
"تحتاج لمعرفة الموعد بدقة وما يرتبط به من استعدادات"
"تابع العداد أعلى الصفحة قبل الموعد بأيام"
```

This applies to every event scaffolded from `events:new` onward — the default templates in
`scripts/lib/event-scaffold.ts` and `scripts/lib/content-normalizers.ts` were rewritten the same day to
generate direct-address copy by default, so a fresh scaffold should already pass this rule. Still,
always re-read the generated draft before publishing: templates give a safe starting shape, not a
finished voice, and country/event-specific facts still need a human pass.

## Real Event vs Unverified Event

If the requested event is fictional, unclear, or not supported by trustworthy sources, the AI must not pretend it is fully publish-ready.

Rules:
- if the date or legitimacy of the event is unclear, keep `publishStatus: "drafted"`
- keep `qa.checks.factChecked` as `false`
- add source uncertainty in `research.json`
- do not invent official sources
- do not write fake certainty in `metaDescription`, `answerSummary`, or FAQ

Example:
- if someone asks for `يوم الطيبة العالمي` and there is no trustworthy source confirming the event, the AI should still create the three files if asked, but it should mark the event as draft and explain the factual uncertainty in `research.json` and `qa.json`

This protects the site from weak or misleading pages, which helps long-term SEO much more than publishing speculative content.

## Example Event: `عيد الرجل`

This is a demo example only to show the contract.

### Folder

```text
src/data/holidays/events/eid-al-rajul/
  package.json
  research.json
  qa.json
```

### Example `package.json`

```json
{
  "schemaVersion": 1,
  "core": {
    "id": "eid-al-rajul",
    "slug": "eid-al-rajul",
    "name": "عيد الرجل",
    "type": "fixed",
    "category": "social",
    "month": 11,
    "day": 19
  },
  "richContent": {
    "seoTitle": "متى عيد الرجل {{year}} — عد تنازلي ومعلومات كاملة",
    "description": "تعرف على موعد عيد الرجل {{year}} مع عد تنازلي مباشر وشرح مختصر لفكرة المناسبة وكيفية الاحتفاء بها ورسائلها الاجتماعية.",
    "keywords": [
      "متى عيد الرجل {{year}}",
      "كم باقي على عيد الرجل {{year}}",
      "موعد عيد الرجل {{year}}"
    ],
    "answerSummary": "عيد الرجل {{year}} يوافق {{formattedDate}}. توضح هذه الصفحة الموعد، والعد التنازلي، وفكرة المناسبة، وأبرز الأسئلة الشائعة حولها.",
    "quickFacts": {
      "الموعد": "{{formattedDate}}",
      "يوم الأسبوع": "يُحتسب تلقائياً",
      "كم يوم باقي": "{{daysRemaining}} يوم",
      "الفئة": "مناسبة اجتماعية"
    },
    "aboutEvent": {
      "ما هو عيد الرجل؟": "عيد الرجل مناسبة اجتماعية رمزية يزداد البحث عنها عند اقتراب موعدها لمعرفة التاريخ وأفكار المشاركة والرسائل المناسبة.",
      "التاريخ والأصل": "يرتبط هذا المثال التوضيحي بتاريخ ثابت داخل السنة الميلادية، ولذلك يبقى من السهل التخطيط له مسبقاً.",
      "الأهمية والمكانة": "تكمن قيمة الصفحة في الإجابة المباشرة عن الموعد، ثم توسيع المحتوى ليغطي الفكرة والرسائل والأسئلة العملية.",
      "كيف يُحيا هذا اليوم": "يمكن إحياء المناسبة عبر رسائل تقدير، أو مشاركة اجتماعية لطيفة، أو نشاط بسيط يناسب طبيعة الجمهور المستهدف."
    },
    "faq": [
      {
        "question": "متى عيد الرجل {{year}}؟",
        "answer": "عيد الرجل {{year}} يوافق {{formattedDate}}."
      },
      {
        "question": "كم باقي على عيد الرجل؟",
        "answer": "يتبقى على عيد الرجل {{daysRemaining}} يوماً."
      },
      {
        "question": "ما هو عيد الرجل؟",
        "answer": "هو مثال توضيحي هنا على مناسبة اجتماعية تحتاج إلى صفحة منظمة تجيب عن الموعد والمعنى وطريقة الاحتفاء."
      },
      {
        "question": "كيف أحتفل بعيد الرجل؟",
        "answer": "يمكن الاحتفال برسالة لطيفة أو لفتة تقدير أو مشاركة اجتماعية مناسبة لطبيعة المناسبة."
      },
      {
        "question": "متى عيد الرجل {{nextYear}}؟",
        "answer": "إذا بقيت المناسبة ثابتة فسيكون الموعد في اليوم نفسه من السنة القادمة."
      },
      {
        "question": "لماذا يبحث الناس عن عيد الرجل؟",
        "answer": "لأنهم يريدون معرفة الموعد الصحيح وأفكار التهنئة والمشاركة قبل حلول المناسبة."
      }
    ],
    "seoMeta": {
      "titleTag": "عيد الرجل {{year}} | كم باقي؟ - ميقات",
      "metaDescription": "تعرف على موعد عيد الرجل {{year}} مع عد تنازلي مباشر ومعلومات مختصرة ومنظمة.",
      "h1": "عيد الرجل {{year}} | كم باقي؟",
      "canonicalPath": "/holidays/eid-al-rajul",
      "ogTitle": "عيد الرجل {{year}} | كم باقي؟",
      "ogDescription": "تعرف على موعد عيد الرجل {{year}} مع عد تنازلي مباشر ومعلومات مختصرة ومنظمة.",
      "ogImageAlt": "عيد الرجل {{year}} — {{formattedDate}}",
      "primaryKeyword": "متى عيد الرجل {{year}}",
      "secondaryKeywords": [
        "عيد الرجل {{year}}",
        "تاريخ عيد الرجل {{year}}",
        "كم باقي على عيد الرجل {{year}}",
        "موعد عيد الرجل {{year}}",
        "متى يوم الرجل {{year}}",
        "يوم الرجل العالمي {{year}}"
      ],
      "longTailKeywords": [
        "متى عيد الرجل {{year}}",
        "كم باقي على عيد الرجل",
        "ما هو عيد الرجل",
        "كيف أحتفل بعيد الرجل",
        "متى يوم الرجل العالمي {{year}}",
        "تاريخ عيد الرجل {{year}}",
        "ماذا يعني عيد الرجل",
        "كيف أهنئ في عيد الرجل",
        "أفكار للاحتفال بعيد الرجل"
      ],
      "datePublished": "2026-04-17T00:00:00.000Z",
      "dateModified": "2026-04-17T00:00:00.000Z",
      "inLanguage": "ar",
      "eventCategory": "social"
    },
    "recurringYears": {
      "contextParagraph": "موعد عيد الرجل ثابت في التاريخ نفسه كل عام ضمن هذا المثال التوضيحي، لذلك يساعد جدول السنوات على معرفة توافقه مع يوم الأسبوع والتخطيط المبكر له.",
      "sourceNote": "يُراجع المصدر الرسمي أو الجهة المنظمة لتأكيد الموعد النهائي.",
      "columns": ["السنة", "التاريخ", "ملاحظة"],
      "highlightCurrentYear": true
    },
    "schemaData": {
      "eventName": "عيد الرجل {{year}}",
      "eventAlternateName": "",
      "startDate": "{{year}}-11-19",
      "endDate": "{{year}}-11-19",
      "eventDescription": "تعرف على موعد عيد الرجل {{year}} مع عد تنازلي مباشر ومعلومات مختصرة ومنظمة.",
      "breadcrumbs": [
        { "name": "الرئيسية", "path": "/" },
        { "name": "المناسبات", "path": "/holidays" },
        { "name": "عيد الرجل", "path": "/holidays/eid-al-rajul" }
      ],
      "articleHeadline": "عيد الرجل {{year}} — العد التنازلي والمعلومات الكاملة"
    },
    "relatedSlugs": [
      "world-health-day",
      "international-womens-day"
    ]
  },
  "countryOverrides": {},
  "aliasSlugs": [],
  "countryScope": "none",
  "keywordTemplateSet": {
    "base": [
      "متى عيد الرجل {{year}}",
      "كم باقي على عيد الرجل {{year}}",
      "موعد عيد الرجل {{year}}"
    ],
    "country": []
  },
  "publishStatus": "drafted",
  "canonicalPath": "/holidays/eid-al-rajul",
  "canonicalSource": "internal",
  "sourceAuthority": "fixed-calendar"
}
```

### Example `research.json`

```json
{
  "slug": "eid-al-rajul",
  "locale": "ar",
  "capturedAt": "2026-04-17T00:00:00.000Z",
  "primaryQueries": [
    "متى عيد الرجل {{year}}",
    "كم باقي على عيد الرجل {{year}}",
    "موعد عيد الرجل {{year}}",
    "عيد الرجل {{year}}",
    "تاريخ عيد الرجل {{year}}",
    "ما هو عيد الرجل",
    "كيف أحتفل بعيد الرجل",
    "متى يوم الرجل العالمي {{year}}",
    "رسائل عيد الرجل",
    "أفكار هدايا عيد الرجل"
  ],
  "competitors": [],
  "coverageMatrix": [
    {
      "keyword": "متى عيد الرجل {{year}}",
      "whyItMatters": "أوضح صيغة مباشرة للباحث الذي يريد التاريخ الحالي."
    },
    {
      "keyword": "كم باقي على عيد الرجل {{year}}",
      "whyItMatters": "تتناسب مع نية العد التنازلي في صفحات /holidays."
    },
    {
      "keyword": "ما هو عيد الرجل",
      "whyItMatters": "نية تعريفية لمن يريد فهم المناسبة قبل الاهتمام بموعدها."
    },
    {
      "keyword": "كيف أحتفل بعيد الرجل",
      "whyItMatters": "نية عملية من الباحث الذي يريد أفكاراً أو تهنئة مناسبة."
    },
    {
      "keyword": "رسائل عيد الرجل",
      "whyItMatters": "نية محتوى تطبيقي شائعة قبل الموعد مباشرة."
    },
    {
      "keyword": "أفكار هدايا عيد الرجل",
      "whyItMatters": "نية مساعدة عملية يمكن خدمتها من خلال فقرة إرشادية أو سؤال شائع."
    },
    {
      "keyword": "متى يوم الرجل العالمي {{year}}",
      "whyItMatters": "تعبير بديل قد يستخدمه الباحث بدلاً من اسم المناسبة الأساسي."
    }
  ],
  "keywordGaps": [
    "شرح المعنى الاجتماعي للمناسبة",
    "أسئلة التهنئة والاحتفاء",
    "صفحة عربية منظمة تجمع الموعد والشرح",
    "أفكار بسيطة للاحتفال",
    "رسائل تهنئة مختصرة",
    "الفرق بين الاسم الشائع والاسم الرسمي",
    "أسئلة السنوات القادمة",
    "شرح مناسب للقراء العرب بعيداً عن اللغة التقنية"
  ],
  "unansweredQuestions": [
    "ما هو عيد الرجل؟",
    "كيف أحتفل بعيد الرجل؟",
    "ما أفضل رسالة تهنئة في عيد الرجل؟",
    "هل للمناسبة تاريخ ثابت كل عام؟",
    "لماذا يبحث الناس عن عيد الرجل؟",
    "متى يأتي عيد الرجل في السنة القادمة؟"
  ],
  "differentiationIdeas": [
    "جواب مباشر عن الموعد",
    "FAQ عملي",
    "محتوى عربي منظم بدلاً من نص قصير جداً"
  ],
  "factSources": [],
  "notes": "مثال توضيحي على ملف بحث يمكن توسيعه لاحقاً بمصادر فعلية إذا كانت المناسبة حقيقية."
}
```

### Example `qa.json`

```json
{
  "slug": "eid-al-rajul",
  "publishStatus": "drafted",
  "checks": {
    "contentReady": false,
    "factChecked": false,
    "schemaValid": false,
    "seoValidated": false,
    "hasHardcodedYear": false
  },
  "notes": [],
  "updatedAt": "2026-04-17T00:00:00.000Z"
}
```

## AI Checklist

If you give this file to an AI and ask it to add an event, the AI should:

1. Choose a canonical slug in lowercase English slug format.
2. Create `src/data/holidays/events/<slug>/`.
3. Create `package.json`, `research.json`, and `qa.json`.
4. Do deep research before writing:
   - search intent
   - Arabic phrasing people actually use
   - country relevance
   - factual reliability
   - official date source
   - top 5 Arabic competitor pages
   - top 5 English competitor or reference pages
   - competitor headings, strengths, weaknesses, and unanswered questions
   - likely questions users ask before and after the event
5. Fill `core` with the right `type`, `category`, and date keys.
6. Fill `richContent` with real Arabic content, not placeholders.
7. Make the page useful enough to deserve indexing, not just technically valid.
8. Build a serious keyword strategy across:
   - primary query
   - secondary queries
   - short, medium, and longer phrase families
   - question-style queries
   - comparison/definition queries when relevant
   - country queries when the event is shared
   - extended search phrases that match real Arabic intent
9. Spread those phrases naturally through the public copy instead of leaving them trapped inside keyword arrays.
10. Put the research findings into `research.json`, not only into the page copy.
11. Turn the best research findings into public content, not only internal notes.
12. Write a clear superiority plan in `research.json.differentiationIdeas`.
13. Do not copy, lightly paraphrase, or translate competitor content as page copy.
14. Write for Arabic search quality first, not keyword stuffing.
15. Keep user-facing Arabic natural and clear for ordinary readers, not developers.
16. Do not use raw technical labels inside public text or QA notes.
17. If a technical field exists in JSON, that does not mean the written Arabic should mention its English or code name.
18. Write as an Arabic editor, not as a prompt engineer, developer, or SEO checklist writer.
19. Never describe the page itself with words like HTML, JSON, slug, schema, FAQ, canonical, Open Graph, or similar implementation terms.
20. Make the content feel richer than common competitor pages by adding direct value, not repeated filler.
21. If the event category is `islamic`, use `{{year}} - {{hijriYear}} هـ` in every title/description field.
22. Keep `canonicalPath` exactly `/holidays/<slug>`.
23. Author a single clean `faq` array only.
24. Add real `relatedSlugs` only if those events already exist.
25. If `relatedSlugs` is present, keep it at 4 to 6 slugs. If no strong related set exists yet, leave it empty.
26. If the event is shared across countries, use `countryScope: "all"` and keep the canonical page country-neutral.
27. If the event is shared across countries, do not mention a specific country by name in the base canonical copy unless the mention is truly necessary.
28. If the event is shared across countries, add meaningful `keywordTemplateSet.country` templates for Arabic country queries.
29. If the event belongs to one country only, set `core._countryCode` and do not write base copy as if it applies everywhere.
30. Leave generated, runtime, export, and editorial-helper files alone.
31. Do not create or edit anything under `src/data/holidays/generated/` or `out/holidays-delivery/`.
32. Return only the three source files plus notes and commands.
33. Run:

```bash
npm run events:build
npm run validate:holidays:slug -- --slug <slug>
```

34. If the content is ready, suggest this one-command path first:

```bash
npm run events:sync -- --slug <slug>
```

35. Publishing should still be a human decision after review.
36. Be explicit if the event is strong enough to go live immediately or should stay hidden for more editing.
37. Do not ask the user to touch generated files or runtime wiring.

## AI Research Standard

When another AI uses this guide, it should behave like a careful Arabic SEO researcher before it behaves like a writer.

Minimum expectations:
- identify the main Arabic way people search for the event
- identify supporting query patterns and natural synonyms
- identify whether the event is global, country-specific, or shared across many countries
- identify the most likely user questions, uncertainty points, and date-related concerns
- identify whether country variants deserve generated country SEO
- identify factual risk, especially for unofficial, seasonal, or disputed events

The AI should not just invent rich content from the event name.
It should infer carefully from research and mark uncertainty clearly when confidence is not high.

Research minimum for a real event:
- at least 10 `primaryQueries`
- at least 10 real `competitors` or reference pages when web access is available
- among those, aim for 5 Arabic pages and 5 English official/reference/competitor pages
- at least 8 `coverageMatrix` rows
- at least 8 `keywordGaps`
- at least 6 `unansweredQuestions`
- at least 3 `factSources`
- at least 5 `differentiationIdeas` that describe how our page will beat current results

## AI Output Contract

When you give this file to another AI, require it to return the result in this exact format:

1. A short slug decision note.
2. A classification note with:
   - `type`
   - `category`
   - `shared` or `country-specific`
   - `countryScope`
   - target country code if single-country
   - recommended `publishStatus`
   - keyword strategy note
   - research confidence note
3. A competitor research summary with:
   - official source used for the date
   - Arabic pages reviewed
   - English/reference pages reviewed
   - top gaps our page fills
4. A folder tree.
5. The full contents of:
   - `src/data/holidays/events/<slug>/package.json`
   - `src/data/holidays/events/<slug>/research.json`
   - `src/data/holidays/events/<slug>/qa.json`
6. Any assumptions or factual uncertainty.
7. Exact commands to run after pasting the files:
   - `npm run events:sync -- --slug <slug>`
   - if the user wants a check without going live: `npm run validate:holidays:slug -- --slug <slug>`
8. Whether the event should stay hidden for more editing or can safely go live now.
9. A short note confirming whether the event should automatically appear across shared country views or only its own country.

The AI should return full file contents, not partial diffs.
The AI should not return generated files, runtime-layer edits, or `out/holidays-delivery` artifacts.

Recommended response shape:

```text
Slug decision:
<why this slug is the canonical choice>

Classification:
type=<...>
category=<...>
distribution=<shared|country-specific|standalone>
countryScope=<...>
countryCode=<... or none>
publishStatus=<...>
keywords=<base-only|base+country>
researchConfidence=<high|medium|low>

Competitor research:
officialSource=<...>
arabicPagesReviewed=<count and URLs>
englishPagesReviewed=<count and URLs>
topGaps=<short list>

src/data/holidays/events/<slug>/
  package.json
  research.json
  qa.json

package.json
```json
{ ... }
```

research.json
```json
{ ... }
```

qa.json
```json
{ ... }
```

Run after paste:
```bash
npm run events:sync -- --slug <slug>
```
```

## Ready-To-Send Prompt For Another AI

You can copy this prompt and replace the event name:

```text
Use docs/add-new-event.md as a strict contract.

Add a new holiday event called "يوم الطيبة العالمي".

Requirements:
- do deep Arabic search research before writing
- scrape/read the top 5 Arabic pages for the main Arabic query
- scrape/read the top 5 English official, reference, or competitor pages for the closest English query
- record each competitor/reference URL with its strengths and gaps in research.json
- write a superiority plan in research.json.differentiationIdeas before writing public content
- use competitors to find gaps and user intent, never to copy or lightly paraphrase text
- author only the source-of-truth event package
- choose a safe canonical English slug
- create exactly:
  - src/data/holidays/events/<slug>/package.json
  - src/data/holidays/events/<slug>/research.json
  - src/data/holidays/events/<slug>/qa.json
- fill every important key with real Arabic content
- make the SEO strong for Arabic Google Search
- make the content feel like a rich Arabic editorial page, not a thin countdown page
- make the first 100 Arabic words answer the main query directly
- clearly answer: the date, countdown, whether it is a public holiday or an observance, and what the reader can do with the date
- make `answerSummary` feel complete and useful, not like a one-line filler answer
- make `aboutEvent` contain 4 clearly different sections with real depth
- make FAQ answers begin with the answer, then add context that gives the reader extra value
- cover multiple keyword intents:
  - primary query
  - secondary queries
  - short and medium phrase variations
  - question-style queries
  - country queries if shared
  - longer and more specific search phrases with real Arabic wording
- put the actual research logic into research.json, including query patterns, competitors, keyword gaps, unanswered questions, and factual sources
- include at least:
  - 10 primaryQueries
  - 10 competitors/reference pages when web access is available, ideally 5 Arabic and 5 English
  - 8 coverageMatrix rows
  - 8 keyword gaps
  - 6 unanswered questions
  - 5 differentiation ideas that explain why our page is better
  - 3 trustworthy fact sources for a real event
- make sure the main and supporting phrases appear naturally inside the public content itself, not only inside keyword arrays
- spread the strongest phrases across the title, summary, section headings, and FAQ in a way that still reads like natural Arabic
- if the event category is islamic, every title/description field must include `{{year}} - {{hijriYear}} هـ`
- keep the page query-first, not generic
- if the event is shared across countries, author it once with `countryScope: "all"`
- if the event is shared across countries, keep the base canonical copy country-neutral and do not list specific country names in the main descriptive text unless truly required
- if the event is shared across countries, keep `/holidays/<slug>` as the canonical page and let country routes be generated automatically
- if the event is shared across countries, include strong `keywordTemplateSet.country` templates for country SEO
- if you cannot find 4 to 6 truly relevant related events, leave `relatedSlugs` empty rather than forcing weak links
- write `qa.json` notes in simple Arabic for a normal editor, not in programmer language
- never use raw wording like `FAQ`, `og image`, `countryOverrides`, `schema`, or similar implementation terms in natural Arabic notes or public copy
- never use wording like HTML, JSON, slug, canonical, Open Graph, or any developer explanation inside public-facing Arabic
- never write sentences that describe the page itself instead of helping the reader
- make every major section add new value instead of rephrasing the same idea
- prefer concrete Arabic phrasing that a normal reader would naturally search for, say, or understand immediately
- for health events, avoid diagnosis, treatment instructions, or personal medical advice and include a professional-care caveat
- for legal, humanitarian, migration, press, rights, or political-adjacent events, stay factual, neutral, and source-led
- if the event belongs to one country only, set `core._countryCode` and keep it country-specific
- if the event is not fully verifiable, keep it drafted and explain why
- do not create or edit:
  - src/data/holidays/generated/*
  - src/lib/holidays/repository.js
  - src/lib/events/*
  - src/lib/event-content/*
  - out/holidays-delivery/*
- do not claim guaranteed or instant indexing
- optimize for indexing readiness and strong ranking potential instead
- return the result in this exact order:
  1. slug decision note
  2. classification note with type/category/distribution/countryScope/countryCode/publishStatus/keyword strategy/research confidence
  3. folder tree
  4. full file contents for package.json, research.json, qa.json
  5. assumptions or factual uncertainty
  6. exact commands to run after paste:
     - npm run events:sync -- --slug <slug>
     - if the user wants a check without going live: npm run validate:holidays:slug -- --slug <slug>
  7. whether it should stay hidden or can go live now
  8. whether it should automatically appear across shared country views or only its own country
- return full file contents in import-ready JSON blocks, not diffs
```

## Publish And Indexing Checklist

After importing the AI-produced files into this repo:

1. Run:

```bash
npm run events:sync -- --slug <slug>
```

2. Confirm:
- `package.json` is valid
- the event should truly be live now, not still hidden for more editing
- no placeholder text exists
- the SEO fields align
- FAQ is authored only in `richContent.faq`

3. This command:
- rebuilds generated holiday indexes
- runs strict validation for the slug
- makes the event live automatically when validation passes

4. Deploy the site.
5. Confirm the canonical event page appears in the live holidays sitemap.
6. Confirm the event appears on `/holidays` filters:
- all published events appear in the main holidays listing automatically after build
- shared events with `countryScope: "all"` also appear automatically in supported country filters
- country-specific events appear only in their own country views
7. Inspect the live URL in Google Search Console if the event matters strategically.

If all of the above is true, the event is technically positioned to be indexed and compete for traffic.

## Files The AI Must Never Edit Manually

- `src/data/holidays/generated/*`
- `src/lib/holidays/repository.js`
- `src/lib/events/generated-aliases.js`
- `src/lib/events/index.js`
- `src/lib/event-content/index.js`
- `out/holidays-delivery/*`

## Summary

If you remember only one thing, remember this:

- author in `src/data/holidays/events/<slug>/`
- never author inside runtime/generated folders
- sync the event only when the content is real, rich, and ready for users
