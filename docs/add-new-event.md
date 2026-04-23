# Add New Event

This is the single authoritative guide for adding a new `/holidays/[slug]` event.

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

Do not hand-edit:
- `src/data/holidays/generated/*`
- `src/lib/events/generated-index.js`
- `src/lib/events/generated-aliases.js`
- `src/lib/events/manifest.json`
- `src/lib/events/items/*`
- `src/lib/events/packages/items/*`
- `src/lib/event-content/items/*`
- `src/lib/events/index.js`
- `src/lib/event-content/index.js`

If the event folder is correct, `npm run dev`, `npm run build`, or `npm run events:build` will pick it up automatically.

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

## Fast Workflow

### 1. Scaffold the folder

```bash
npm run events:new -- --slug your-slug --name "اسم المناسبة" --type fixed --category holidays
```

Example:

```bash
npm run events:new -- --slug eid-al-rajul --name "عيد الرجل" --type fixed --category support
```

This creates:

```text
src/data/holidays/events/eid-al-rajul/package.json
src/data/holidays/events/eid-al-rajul/research.json
src/data/holidays/events/eid-al-rajul/qa.json
```

Scaffold defaults:
- `publishStatus: "drafted"`
- `tier: "tier3"`
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

### 4. Validate the event

```bash
npm run validate:holidays:slug -- --slug your-slug
```

### 5. Publish when the content is ready

Recommended:

```bash
npm run events:publish -- --slug your-slug --status published
```

This is safer than flipping `publishStatus` manually because it rebuilds and validates.

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
  "tier": "tier3",
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

`tier`
- Priority bucket:
  - `tier1`
  - `tier2`
  - `tier3`
- Higher tiers get stronger internal priority and sitemap priority.

`publishStatus`
- Controls public readiness state.
- Allowed values:
  - `briefed`
  - `drafted`
  - `validated`
  - `fact_checked`
  - `editor_approved`
  - `published`
  - `monitored`

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

## `core` Keys

Example:

```json
{
  "id": "world-health-day",
  "slug": "world-health-day",
  "name": "يوم الصحة العالمي",
  "type": "fixed",
  "category": "support",
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
  - `business`
  - `support`

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
- Longer intent-driven phrases.

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

### Multi-country canonical event

Use:
- no `core._countryCode`
- `countryScope: "all"`

Good when:
- one canonical page should also serve country-specific search demand
- the build should generate country route aliases automatically
- the event should be available in country filters and the holiday sitemap

### Single-country event

Use:
- `core._countryCode`
- `countryScope: "none"`

Good when:
- the event belongs to one country only

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

## `qa.json` Structure

Recommended shape:

```json
{
  "slug": "your-slug",
  "tier": "tier3",
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

`tier`
- Workflow copy of the content tier.

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

`updatedAt`
- ISO timestamp of the latest review.

## Recommended Content Rules

For strong indexing and ranking potential:
- write an `answerSummary` that answers the main query immediately
- include at least 6 strong FAQ entries for high-priority events
- use real `relatedSlugs`
- include trustworthy `factSources` in `research.json`
- keep `titleTag`, `metaDescription`, `h1`, and `schemaData` aligned
- author one clean `faq` array and let the compiler generate FAQ mirrors automatically
- avoid placeholder text like `TODO`, `TBD`, or `قريباً`
- avoid unexplained hardcoded current years in body copy
- keep country-neutral base content when the event expands across countries

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
- `secondaryKeywords`: 3 to 6 close variations
- `longTailKeywords`: 6 to 12 real intent phrases

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

The AI should write content that is:
- direct
- Arabic-first
- helpful
- non-robotic
- non-repetitive

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
    "category": "support",
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
      "الفئة": "الدعم الاجتماعي"
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
        "كم باقي على عيد الرجل {{year}}",
        "موعد عيد الرجل {{year}}"
      ],
      "longTailKeywords": [
        "متى عيد الرجل {{year}}",
        "كم باقي على عيد الرجل",
        "ما هو عيد الرجل",
        "كيف أحتفل بعيد الرجل"
      ],
      "datePublished": "2026-04-17T00:00:00.000Z",
      "dateModified": "2026-04-17T00:00:00.000Z",
      "inLanguage": "ar",
      "eventCategory": "support"
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
  "tier": "tier3",
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
    "موعد عيد الرجل {{year}}"
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
    }
  ],
  "keywordGaps": [
    "شرح المعنى الاجتماعي للمناسبة",
    "أسئلة التهنئة والاحتفاء",
    "صفحة عربية منظمة تجمع الموعد والشرح"
  ],
  "unansweredQuestions": [
    "ما هو عيد الرجل؟",
    "كيف أحتفل بعيد الرجل؟"
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
  "tier": "tier3",
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
4. Fill `core` with the right `type`, `category`, and date keys.
5. Fill `richContent` with real Arabic content, not placeholders.
6. If the event category is `islamic`, use `{{year}} - {{hijriYear}} هـ` in every title/description field.
7. Keep `canonicalPath` exactly `/holidays/<slug>`.
8. Author a single clean `faq` array only.
9. Add real `relatedSlugs` only if those events already exist.
10. Leave generated files alone.
11. Run:

```bash
npm run events:build
npm run validate:holidays:slug -- --slug <slug>
```

12. Only publish with:

```bash
npm run events:publish -- --slug <slug> --status published
```

## AI Output Contract

When you give this file to another AI, require it to return the result in this exact format:

1. A short slug decision note.
2. A folder tree.
3. The full contents of:
   - `src/data/holidays/events/<slug>/package.json`
   - `src/data/holidays/events/<slug>/research.json`
   - `src/data/holidays/events/<slug>/qa.json`
4. Any assumptions or factual uncertainty.
5. Whether the event should stay `drafted` or can safely move toward `published`.

The AI should return full file contents, not partial diffs.

Recommended response shape:

```text
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
```

## Ready-To-Send Prompt For Another AI

You can copy this prompt and replace the event name:

```text
Use docs/add-new-event.md as a strict contract.

Add a new holiday event called "يوم الطيبة العالمي".

Requirements:
- choose a safe canonical English slug
- create exactly:
  - src/data/holidays/events/<slug>/package.json
  - src/data/holidays/events/<slug>/research.json
  - src/data/holidays/events/<slug>/qa.json
- fill every important key with real Arabic content
- make the SEO strong for Arabic Google Search
- if the event category is islamic, every title/description field must include `{{year}} - {{hijriYear}} هـ`
- keep the page query-first, not generic
- if the event is not fully verifiable, keep it drafted and explain why
- do not edit generated files
- return the full file contents in import-ready JSON blocks
```

## Publish And Indexing Checklist

After importing the AI-produced files into this repo:

1. Run:

```bash
npm run events:build
npm run validate:holidays:slug -- --slug <slug>
```

2. Confirm:
- `package.json` is valid
- `publishStatus` is appropriate
- no placeholder text exists
- the SEO fields align
- FAQ is authored only in `richContent.faq`

3. If the event is real and ready:

```bash
npm run events:publish -- --slug <slug> --status published
```

4. Deploy the site.
5. Confirm the canonical event page appears in the live holidays sitemap.
6. Inspect the live URL in Google Search Console if the event matters strategically.

If all of the above is true, the event is technically positioned to be indexed and compete for traffic.

## Files The AI Must Never Edit Manually

- `src/data/holidays/generated/*`
- `src/lib/events/generated-index.js`
- `src/lib/events/generated-aliases.js`
- `src/lib/events/manifest.json`
- `src/lib/events/items/*`
- `src/lib/events/packages/items/*`
- `src/lib/event-content/items/*`
- `src/lib/events/index.js`
- `src/lib/event-content/index.js`

## Summary

If you remember only one thing, remember this:

- author in `src/data/holidays/events/<slug>/`
- never author inside runtime/generated folders
- build and validate
- publish only when the event is real and ready
