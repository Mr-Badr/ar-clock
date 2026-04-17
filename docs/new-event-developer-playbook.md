# New Event Developer Playbook

This guide explains how to add a new event to the `/holidays/[slug]` system using the current JSON-first architecture.

For the exact file contract and the AI-ready "create these files and keys" workflow, use:
- [`docs/add-new-event.md`](./add-new-event.md)

Treat `docs/add-new-event.md` as the canonical authoring contract.
Treat this playbook as the broader strategy and context document.

Use this document when you want to:
- create a new event
- understand where event data lives
- write SEO fields correctly
- choose the right keyword strategy
- make the event appear on `/holidays`
- make the event appear in the holiday sitemap

## Architecture In One Minute

There is only one authoring source:
- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

Everything else is runtime or generated output:
- `src/data/holidays/generated/*.json`
- `src/lib/events/generated-index.js`
- `src/lib/event-content/generated-index.js`
- `src/lib/events/items/*.json`
- `src/lib/event-content/items/*.json`

Do not add authored event data under:
- `src/lib/events/`
- `src/lib/event-content/`

## Event Types

### 1. Global Event
Use this when the event is universal and not tied to one country.

Examples:
- `new-year`
- `summer-season`

Rules:
- no `countryCode`
- use `countryScope: "none"`

### 2. Multi-Country Canonical Event
Use this when one canonical event should work for many countries, with optional country SEO variants.

Examples:
- `ramadan`
- `eid-al-fitr`
- `eid-al-adha`

Rules:
- no `countryCode`
- use `countryScope: "all"`
- keep base content country-neutral
- put country-specific details only inside `countryOverrides`
- the system will auto-generate country route pages, sitemap entries, and country-filter results

### 3. Single-Country Event
Use this when the event belongs to one country only.

Examples:
- `uae-national-day`
- `school-start-egypt`

Rules:
- set `core._countryCode`
- use `countryScope: "none"`

## Add A New Event

### Step 1. Scaffold the event

Example global event:

```bash
npm run events:new -- --slug world-poetry-day --name "اليوم العالمي للشعر" --type fixed --category support --build true
```

Example multi-country Islamic event:

```bash
npm run events:new -- --slug eid-al-fitr --name "عيد الفطر" --type hijri --category islamic --countryScope all --build true
```

Example single-country event:

```bash
npm run events:new -- --slug uae-flag-day --name "يوم العلم الإماراتي" --type fixed --category national --countryCode ae --build true
```

Useful flags:
- `--status drafted`: keep the event hidden from `/holidays`
- `--status published`: show the event on `/holidays`
- `--build true`: automatically run `npm run events:build`
- `--countryScope all`: generate country alias support
- `--countryCode ae`: mark the event as country-specific

## Example: Non-Islamic Event For All Countries

Use this pattern when the event is not Islamic, but you still want one canonical page plus country landing pages.

Good examples:
- `new-year`
- `earth-day`
- `world-environment-day`
- broad business, support, or seasonal events with country-specific search demand

Scaffold example:

```bash
npm run events:new -- --slug earth-day --name "يوم الأرض" --type fixed --category support --countryScope all --build true
```

Authoring example inside `src/data/holidays/events/earth-day/package.json`:

```json
{
  "core": {
    "id": "earth-day",
    "slug": "earth-day",
    "name": "يوم الأرض",
    "type": "fixed",
    "category": "support",
    "month": 4,
    "day": 22
  },
  "countryScope": "all",
  "keywordTemplateSet": {
    "base": [
      "متى يوم الأرض {{year}}",
      "كم باقي على يوم الأرض {{year}}"
    ],
    "country": [
      "متى يوم الأرض في {{countryName}} {{year}}",
      "فعاليات يوم الأرض في {{countryName}} {{year}}"
    ]
  },
  "richContent": {
    "seoMeta": {
      "primaryKeyword": "متى يوم الأرض {{year}}",
      "secondaryKeywords": [
        "موعد يوم الأرض {{year}}",
        "كم باقي على يوم الأرض {{year}}"
      ],
      "longTailKeywords": [
        "متى يوم الأرض في {{countryName}} {{year}}",
        "ما هو يوم الأرض",
        "لماذا يحتفل بيوم الأرض"
      ]
    }
  }
}
```

What happens automatically after `npm run events:build`:
- canonical page works at `/holidays/earth-day`
- country pages work at:
  - `/holidays/earth-day-in-egypt`
  - `/holidays/earth-day-in-morocco`
  - `/holidays/earth-day-in-saudi`
- these country pages appear in the holiday sitemap if the canonical event is published
- when the user filters `/holidays` by country, the matching country page appears in results
- page titles, headers, breadcrumbs, and fallback descriptions automatically include the country name even if you did not write a custom country override yet

When to add `countryOverrides`:
- if one country has a different authority, date note, wording, or quick facts
- if you want a custom H1, meta description, or FAQ emphasis for a specific market
- if a country has stronger local search language than the generic fallback

When you do not need `countryOverrides`:
- when the event date is the same everywhere
- when the base content is already neutral and reusable
- when automatic country-aware titles and descriptions are good enough for the first version

### Step 2. Edit the event folder

Open:
- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

### Step 3. Build generated indexes

```bash
npm run events:build
```

### Step 4. Validate the event

```bash
npm run validate:holidays:slug -- --slug <slug>
```

### Step 5. Publish when ready

```bash
npm run events:publish -- --slug <slug> --status published
```

## What Each File Does

### `package.json`
This is the real source of truth.

It contains:
- `core`: date logic and identity
- `richContent`: page content and SEO fields
- `countryOverrides`: country-specific overlays
- `aliasSlugs`: additional legacy or alternate query slugs
- `keywordTemplateSet`: keyword generation templates
- `tier`: content/SEO priority
- `publishStatus`: visibility and release state

### `research.json`
Use this for:
- Arabic search queries
- competitor URLs
- keyword gaps
- unanswered user questions
- differentiation ideas

### `qa.json`
Use this to track:
- fact-checking status
- content readiness
- schema readiness
- SEO readiness
- editorial notes

Important:
- `qa.json` is not where we author keywords
- `qa.json` only records whether SEO work is ready, reviewed, and validated
- the actual keywords live in `package.json`
- `qa.json` does not control routing, page generation, or sitemap inclusion by itself

### `publishStatus` vs `qa.json checks`

This difference is important:

- `publishStatus` in `package.json` controls whether the event is treated as published, drafted, or otherwise visible in the generated holiday system
- `checks` in `qa.json` are editorial tracking flags only

That means:
- an event can still be `published` even if all `checks` are `false`
- an event can be hidden from `/holidays` and the holiday sitemap if its `publishStatus` is not publishable
- changing `checks.contentReady` from `false` to `true` does not publish the page by itself

Use this mental model:
- `package.json` = source of truth for runtime behavior
- `qa.json` = source of truth for team review progress

Recommended workflow:
1. write or improve the real content in `package.json`
2. run `npm run events:build`
3. run `npm run validate:holidays:slug -- --slug <slug>`
4. when the page is genuinely reviewed, update the `qa.json` checks
5. only set `publishStatus` to `published` when the event is strong enough to appear publicly

## Core Fields

### `core`
Minimum required fields:

```json
{
  "id": "world-poetry-day",
  "slug": "world-poetry-day",
  "name": "اليوم العالمي للشعر",
  "type": "fixed",
  "category": "support",
  "month": 3,
  "day": 21
}
```

Date field rules:
- `fixed`: use `month` + `day`
- `hijri`: use `hijriMonth` + `hijriDay`
- `estimated`: use `date: "{{year}}-MM-DD"`
- `monthly`: use `day`

## Rich Content Fields

`richContent` should be the full page content model.

Important sections:
- `answerSummary`
- `quickFacts`
- `intentCards`
- `aboutEvent`
- `recurringYears`
- `engagementContent`
- `faq`
- `seoMeta`
- `schemaData`
- `relatedSlugs`

If the event is `tier1`, all of these should be present and strong.

## Tier Priority

The `tier` field is a content and SEO priority marker.

It does not directly publish or hide the page, but it tells us how complete the event should be before we consider it high quality.

### `tier1`
Use for the most important pages in the project.

Examples:
- Ramadan
- Eid al-Fitr
- Eid al-Adha
- the strongest country school-start pages

Expectations:
- full rich content model
- strong `answerSummary`
- strong `aboutEvent`
- complete FAQ
- strong `seoMeta`
- strong `schemaData`
- polished related links
- fact-checking and editorial review should happen first here before lower tiers

### `tier2`
Use for medium-priority pages that still matter for traffic, but are not the first ranking battleground.

Examples:
- important national days
- mid-priority school pages
- seasonal pages with steady demand

Expectations:
- good SEO metadata
- useful FAQ
- quick facts
- related links
- enough content to be publishable, but not necessarily as deep as `tier1`

### `tier3`
Use for lower-priority or long-tail pages.

Examples:
- experimental topics
- low-demand pages
- pages we want in the system architecture before investing heavily in content

Expectations:
- basic but valid content
- minimum usable quick facts
- minimum usable FAQ
- can stay drafted until we improve them later

Simple rule:
- `tier1` = must be excellent
- `tier2` = should be solid
- `tier3` = can start lean, then improve later

## Keyword Strategy

There are two keyword layers:

### 1. `richContent.seoMeta`
This is the page-level SEO target.

Key fields:
- `primaryKeyword`
- `secondaryKeywords`
- `longTailKeywords`

Use them for:
- title tag
- meta description
- H1
- answer summary
- FAQ
- about section

### 2. `keywordTemplateSet`
This is the generator-side keyword template source.

Example:

```json
{
  "keywordTemplateSet": {
    "base": [
      "متى اليوم العالمي للشعر {{year}}",
      "كم باقي على اليوم العالمي للشعر {{year}}"
    ],
    "country": [
      "متى اليوم العالمي للشعر في {{countryName}} {{year}}",
      "اليوم العالمي للشعر {{countryName}} {{year}}"
    ]
  }
}
```

Use `base` for:
- global keywords
- canonical page SEO

Use `country` for:
- multi-country canonical events
- country-specific search demand
- any event type, not just Islamic, when one canonical package should expand into country pages

## Where Keywords Actually Live

This is the most important rule for new developers:

- write keywords in `src/data/holidays/events/<slug>/package.json`
- do not write keywords in `qa.json`
- use `qa.json` only to confirm whether the keyword work has been reviewed

### `qa.json` does not store keywords

Example `qa.json` fields:

```json
{
  "checks": {
    "contentReady": false,
    "factChecked": false,
    "schemaValid": false,
    "seoValidated": false,
    "hasHardcodedYear": false
  }
}
```

What these mean:
- `contentReady`: the page content is complete enough to publish
- `factChecked`: dates and factual claims were checked
- `schemaValid`: structured data is valid and complete
- `seoValidated`: title, meta description, H1, keyword placement, and internal linking were reviewed
- `hasHardcodedYear`: should stay `false` after cleanup; avoid writing fixed future years in reusable content

So the workflow is:
1. write the keyword targets in `package.json`
2. build and validate the event
3. set or update the readiness notes in `qa.json`

## Keyword Meanings

### `primaryKeyword`
This is the main search intent the page is trying to win.

Examples:
- `متى رمضان {{year}}`
- `كم باقي على اليوم الوطني السعودي {{year}}`
- `متى تبدأ الدراسة في مصر {{year}}`

Rules:
- one main keyword only
- should appear naturally in `titleTag`, `h1`, `answerSummary`, and the first part of `aboutEvent`
- should match the strongest real user intent for this event

### `secondaryKeywords`
These are close supporting queries that reinforce the same page.

Examples:
- `موعد رمضان {{year}}`
- `بداية رمضان {{year}}`
- `رمضان {{year}}`
- `رمضان العد التنازلي`

Rules:
- keep them tightly related to the same page intent
- avoid mixing unrelated intents like greetings, duas, travel, and official leave all in one weak list
- 4 to 6 good secondary keywords are better than 20 noisy ones

### `longTailKeywords`
These are lower-volume but highly useful intent expansions.

Examples:
- `كيف أستعد لرمضان`
- `هل رمضان إجازة رسمية`
- `متى رمضان {{nextYear}}`
- `لماذا يتغير موعد رمضان كل عام`

Rules:
- these should map directly to FAQ, About, and recurring years sections
- every long-tail keyword should have a visible answer on the page
- if a keyword has no real content block answering it, remove it

### `keywordTemplateSet.base`
This is the reusable template layer for canonical authoring and generation.

Use it for:
- the canonical event page
- generated SEO scaffolds
- base keyword patterns that work for any year

Good examples:

```json
{
  "base": [
    "متى رمضان {{year}}",
    "كم باقي على رمضان {{year}}",
    "موعد رمضان {{year}}"
  ]
}
```

### `keywordTemplateSet.country`
Use this only when the canonical event can serve country-specific demand.

Good for:
- Islamic events that may be searched as `في مصر` or `في السعودية`
- broad events with country landing aliases
- non-Islamic events like `new-year` or `earth-day` when users search with country names

Avoid it for:
- truly global events with no country angle
- single-country events that already have one dedicated canonical page

## How To Choose Keywords Professionally

When you add a new event, choose keywords in this order:

1. Start with the core intent:
   - `متى [event] {{year}}`
   - `كم باقي على [event] {{year}}`
2. Add date or announcement variants:
   - `موعد [event] {{year}}`
   - `[event] {{year}}`
3. Add preparation or meaning queries:
   - `ما هو [event]`
   - `كيف أستعد لـ[event]`
   - `ما أهمية [event]`
4. Add next-year and comparison queries only if the content really answers them
5. For `countryScope: "all"` events, add country templates only if the base content stays country-neutral
6. If the event should rank both generally and locally, keep one canonical package and let the system generate country routes automatically

## Keyword Placement Rules

For a strong event page:
- `titleTag`: include the primary keyword or its closest exact form
- `metaDescription`: include the primary keyword plus one supporting phrase
- `h1`: align tightly with the title tag
- `answerSummary`: answer the primary query immediately
- `aboutEvent`: reinforce meaning, importance, and context
- `faq`: capture long-tail questions
- `relatedSlugs`: connect the page to adjacent search journeys

## QA And Validation Relationship

Use the files like this:

- `package.json`: author keywords and content
- `research.json`: store research queries, competitor gaps, and topic opportunities
- `qa.json`: record whether SEO review happened and what still needs fixing

That means:
- if keywords are wrong, fix `package.json`
- if the page still needs review, update `qa.json`
- if you discovered a better opportunity from research, write it in `research.json`
- alias-support content expansion

Do not add country keyword templates for single-country events unless there is a real use case.

## How To Choose Keywords

### Primary keyword
Choose the clearest main query with event name + year.

Examples:
- `متى رمضان {{year}}`
- `متى اليوم الوطني الإماراتي {{year}}`
- `متى رأس السنة الميلادية {{year}}`

### Secondary keywords
Choose close-intent variants.

Examples:
- `كم باقي على رمضان {{year}}`
- `موعد رمضان {{year}}`
- `رمضان {{year}}`

### Long-tail keywords
Choose question-based and intent-based phrases.

Examples:
- `كيف أستعد لرمضان`
- `ما هو رمضان`
- `متى رمضان {{nextYear}}`
- `هل رمضان إجازة رسمية`

## Country Content Rules

### For multi-country canonical events
Write the base content once.

Base content must not mention a specific country unless that detail is truly universal.

Put country-specific differences in:
- `countryOverrides.<countryCode>`

Good use cases for overrides:
- different title wording
- different official authority
- different local date disclaimer
- local search-intent quick facts

Automatic behavior for `countryScope: "all"`:
- country route aliases are generated automatically at build time
- the event can be opened as both a canonical page and country page
- page headings and metadata become country-aware automatically
- `/holidays` country filters use the country route instead of the generic canonical slug

### For single-country events
Write directly in the base package because the event itself is country-specific.

## SEO Rules

### Title tag
- keep it clear
- include event name + year
- include a modifier
- include brand

Good pattern:
- `رمضان {{year}} | العد التنازلي - ميقات`

### Meta description
- describe the event date and value
- mention countdown and content depth
- avoid stuffing

Good pattern:
- `تعرف على موعد رمضان {{year}} مع عد تنازلي دقيق ومحتوى عربي شامل وسريع التحديث.`

### Canonical path
Always:

```json
"/holidays/<slug>"
```

Never add the year into the path.

### datePublished and dateModified
- both must be valid ISO strings
- update `dateModified` whenever content materially changes

## Sitemap Rules

An event appears in the holiday sitemap only when its canonical package is published.

Current holiday sitemap source:
- `src/app/holidays/sitemap.js`
- driven by `src/data/holidays/generated/manifest.json`

Rules:
- draft events never get sitemap entries
- canonical published events do get sitemap entries
- country aliases for published `countryScope: "all"` events also get sitemap entries
- aliases for drafted canonicals do not get sitemap entries
- `lastModified` comes from `seoMeta.dateModified` or manifest fallback

## What Happens After `events:build`

The build step generates:
- event lookup JSON
- content lookup JSON
- alias maps
- manifest metadata
- compatibility shards

This is what allows:
- the card to appear on `/holidays`
- the slug page to resolve at `/holidays/<slug>`
- the event to enter the holiday sitemap
- `countryScope: "all"` events to expand into country pages automatically

## Developer Checklist

Before publishing a new event:
- fill `core`
- fill all `richContent` sections
- set `seoMeta.primaryKeyword`
- set `seoMeta.canonicalPath`
- set `seoMeta.datePublished`
- set `seoMeta.dateModified`
- set `schemaData`
- add 4-6 `relatedSlugs`
- run `npm run events:build`
- run `npm run validate:holidays:slug -- --slug <slug>`
- confirm the card appears on `/holidays`
- if `countryScope: "all"`, confirm at least one country page opens correctly and appears in the country filter
- confirm the page opens at `/holidays/<slug>`

## Things You Should Never Do

- never add authored content in `src/lib/events/`
- never add authored content in `src/lib/event-content/`
- never create country-specific copies of a global event unless the event itself is country-specific
- never hand-maintain alias sitemap entries; let `events:build` generate them from `countryScope: "all"`
- never hardcode years inside long-lived content
- never add placeholder text to published events

## Recommended Workflow For New Developers

1. Run `events:new`
2. Fill `package.json`
3. Add research notes in `research.json`
4. Update QA status in `qa.json`
5. Build indexes
6. Validate slug
7. Check `/holidays`
8. Open `/holidays/<slug>`
9. Publish only after validation passes

## Quick Reference

Author here:
- `src/data/holidays/events/<slug>/`

Build:
- `npm run events:build`

Validate one event:
- `npm run validate:holidays:slug -- --slug <slug>`

Publish:
- `npm run events:publish -- --slug <slug> --status published`

Autofill missing baseline sections for existing events:
- `npm run events:autofill`
