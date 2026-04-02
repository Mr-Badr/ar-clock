# Holidays SEO Architecture Plan

## Objective

Build a clean, scalable, JSON-first architecture for `/holidays/[slug]` in a Next.js 16 app so the team can:

- publish deeply optimized Arabic SEO event pages
- support 1000+ canonical events plus country variants
- keep authoring simple and predictable
- avoid duplicate sources of truth
- preserve SSR, structured data, and content quality
- make adding a new event mostly a JSON operation

This plan is based on the current implementation in:

- `src/app/holidays/[slug]/page.jsx`
- `src/app/holidays/[slug]/HolidayDetailsSections.jsx`
- `src/lib/holidays/page-data.js`
- `src/lib/holidays/metadata.js`
- `src/lib/holidays-engine.js`
- `src/lib/events/index.js`
- `src/lib/events/packages/items/*.json`
- `src/lib/event-content/index.js`
- `src/lib/event-content/countries/*.js`
- `scripts/generate-events-index.ts`
- `src/lib/events/manifest.json`

Current scale observed in the codebase:

- 50 canonical events
- 96 aliases
- all events currently marked `published`
- package-based generation already exists and is the strongest foundation to build on

## Executive Summary

The project already has the right idea: a package-based event source, generated indexes, aliases, manifest tracking, SSR metadata, and event/content separation. The main problem is that the architecture is only partially consolidated. There is still a mix of:

- canonical package JSON
- generated JSON
- legacy JS content maps
- country-specific JS overlays
- page components coupled directly to raw content shape
- multiple optional content models living at the same time

For 1000+ events, this will become expensive to maintain.

The best long-term architecture is:

1. one authored JSON package per canonical event
2. one shared JSON taxonomy layer for countries, categories, authorities, and section presets
3. generated JSON indexes and manifests only, never hand-edited
4. one server-side `page model builder` that converts raw JSON into a stable render model
5. block-based content sections with strict schemas and validators
6. country overlays stored in JSON, not JS
7. metadata, schema.org, UI, sitemap, related links, and internal SEO derived from the same render model

## What Is Good Today

### 1. The package authoring direction is correct

`src/lib/events/packages/items/*.json` is already the closest thing to a true source of truth.

Each package can contain:

- `core`
- `richContent`
- `countryOverrides`
- `tier`
- `publishStatus`
- `queueOrder`
- alias configuration

This is the right starting point.

### 2. Generation already exists

`scripts/generate-events-index.ts` already does important work:

- reads package JSON
- validates package schema
- generates canonical event JSON
- generates content JSON
- generates aliases
- generates manifest
- tracks tier and publish status

This is exactly the kind of build step a large content system needs.

### 3. The holiday page is server-rendered

`src/lib/holidays/page-data.js` builds SSR page data and schema.

That is good for:

- crawlability
- snippet eligibility
- consistent metadata
- low client-side SEO risk

### 4. Aliases and country expansion are already modeled

The alias system is promising and useful for long-tail Arabic SEO, especially country-specific variations.

## Main Problems To Fix

### 1. There are still multiple runtime sources of truth

Today the runtime can still pull from:

- generated package output
- legacy event JS files
- legacy content JS files
- country content JS overlays
- generated content maps

This increases ambiguity and makes future debugging harder.

### 2. Country content is still partly JS-driven

`src/lib/event-content/countries/*.js` and shared country content maps are a scaling bottleneck.

For a 1000+ event system, country SEO variants must be data, not code.

### 3. The content model is too flexible in a risky way

`richContent` currently mixes many parallel patterns:

- `about`
- `aboutEvent`
- `faq`
- `faqItems`
- `details`
- `history`
- `significance`
- `traditions`
- `timeline`
- `howTo`
- `intentCards`
- `engagementContent`
- `seoMeta`
- `schemaData`

This helps migration, but it hurts consistency. At scale, every event needs the same predictable authoring contract.

### 4. The page component knows too much about raw data shape

`HolidayDetailsSections.jsx` contains branching like:

- render `aboutEvent` else fallback to `about`
- map category to H2 in the component
- render quick facts based on both object and array variants
- use mixed FAQ formats

That means the UI is compensating for schema drift. The UI should render a normalized page model, not clean up authoring inconsistencies.

### 5. Hardcoded years still exist in authored content

At least several high-priority package files still contain hardcoded year strings. That is dangerous for SEO freshness and trust.

### 6. Generated runtime data is JS, not JSON-first

The user goal is JSON-first authoring. Right now generated indexes are emitted as JS modules. That works technically, but the data layer would be cleaner if generated artifacts were JSON and loaded through a thin server utility.

### 7. “Published” is not meaningful enough yet

All 50 events are currently marked `published`. For a serious editorial SEO pipeline, publish state should reflect actual quality gates.

## Target Architecture

## Principle

Everything authored by humans should live in JSON.
Everything generated should be derived from JSON.
All rendering should consume a normalized server-side page model.

## Recommended Folder Structure

```text
src/data/holidays/
  taxonomy/
    categories.json
    countries.json
    authorities.json
    section-presets.json
    templates.json
  events/
    ramadan/
      package.json
      research.json
      qa.json
    eid-al-fitr/
      package.json
      research.json
      qa.json
    ...
  generated/
    manifest.json
    events-by-slug.json
    content-by-slug.json
    aliases.json
    alias-meta.json
    canonical-to-aliases.json
    internal-link-graph.json
    sitemap-priority.json
```

Notes:

- `package.json` is the only authored event source.
- `research.json` stores competitor research, keyword gaps, and fact-check notes.
- `qa.json` stores editorial status, verification dates, and checklist results.
- `generated/` is fully build-produced and never edited manually.

## Canonical Event Package Schema

Each canonical event should have one authoring file:

```json
{
  "schemaVersion": 2,
  "identity": {
    "id": "ramadan",
    "slug": "ramadan",
    "name": "رمضان",
    "alternateNames": ["شهر رمضان", "رمضان المبارك"],
    "category": "islamic"
  },
  "schedule": {
    "type": "hijri",
    "hijriMonth": 9,
    "hijriDay": 1,
    "authorityKey": "hijri-official",
    "dateVariability": "moon-sighting"
  },
  "seo": {
    "primaryKeyword": "متى رمضان {{year}}",
    "secondaryKeywords": [],
    "longTailKeywords": [],
    "titleTemplate": "رمضان {{year}} | العد التنازلي - ميقات",
    "metaDescriptionTemplate": "...",
    "ogTitleTemplate": "...",
    "ogDescriptionTemplate": "..."
  },
  "content": {
    "answerSummary": "...",
    "quickFacts": [],
    "sections": [
      { "id": "about", "type": "rich-text", "blocks": [] },
      { "id": "recurring-years", "type": "recurring-years", "config": {} },
      { "id": "engagement", "type": "engagement-cards", "items": [] },
      { "id": "faq", "type": "faq", "items": [] }
    ]
  },
  "countries": {
    "mode": "auto",
    "overlays": {
      "sa": {
        "seo": {},
        "quickFacts": [],
        "faqAdditions": []
      }
    }
  },
  "relations": {
    "relatedSlugs": [],
    "cluster": "ramadan-season",
    "parentTopic": null
  },
  "sources": [
    {
      "label": "...",
      "url": "...",
      "sourceType": "official",
      "lastVerified": "2026-03-31"
    }
  ],
  "ops": {
    "tier": "tier1",
    "publishStatus": "fact_checked",
    "queueOrder": 1,
    "datePublished": "2025-01-01",
    "dateModified": "2026-03-31"
  }
}
```

## Why This Schema Is Better

- it separates identity from schedule from content from SEO from editorial state
- it gives content authors a predictable place for every field
- it makes country variation explicit
- it keeps fact-checking attached to the event
- it scales cleanly to automation and validation

## Normalize Around Section Blocks

Instead of keeping several legacy parallel shapes, standardize on section blocks.

Supported block types should be explicit, for example:

- `answer-summary`
- `quick-facts`
- `action-cards`
- `rich-text`
- `recurring-years`
- `engagement-cards`
- `faq`
- `related-events`
- `sources`

Then the page renderer becomes a block renderer, not a schema negotiator.

## Rendering Architecture

## Add a dedicated page model layer

Introduce one server-only adapter:

- `src/lib/holidays/build-holiday-page-model.ts`

Its job:

1. load canonical package JSON
2. resolve alias and country overlay
3. compute upcoming date and countdown state
4. resolve tokens like `{{year}}`, `{{formattedDate}}`, `{{daysRemaining}}`
5. normalize all content sections into one stable shape
6. derive metadata
7. derive schema.org payloads
8. derive internal links and related events

The page component should only render something like:

```ts
HolidayPageModel = {
  identity,
  date,
  hero,
  sections,
  seo,
  schema,
  sharing,
  monetization,
  relations
}
```

This removes data-cleaning logic from React components.

## Recommended UI Rule

`src/app/holidays/[slug]/page.jsx` and `HolidayDetailsSections.jsx` should never need to know:

- whether FAQ came from `faq` or `faqItems`
- whether quick facts were authored as object or array
- whether country SEO came from overlay or generated variant

That should be solved before rendering.

## Country Architecture

## Make country logic 100% JSON-driven

Move all country-specific content rules into JSON taxonomy plus event overlays.

Recommended JSON sources:

- `taxonomy/countries.json`
- event-local `countries.overlays`

`countries.json` should store:

- code
- Arabic name
- official Arabic name
- authority label
- alias slug token
- date variance label
- local terms

This replaces `src/lib/event-content/countries/*.js` and keeps country knowledge in structured data.

## Alias Strategy

Keep the current alias strategy, but make it fully declarative.

Generated alias files should be built only from:

- package `countries.mode`
- package `countries.overlays`
- `taxonomy/countries.json`

That is scalable and predictable.

## SEO Content Architecture

## Split SEO responsibilities clearly

### 1. Core event data

Owns:

- slug
- name
- category
- schedule
- authority

### 2. Content data

Owns:

- answer block
- about blocks
- recurring-years paragraph
- action cards
- engagement cards
- FAQ
- related slugs

### 3. SEO derivation layer

Owns:

- title tag
- meta description
- og values
- keyword sets
- schema.org content
- canonical URL
- sitemap priority
- internal links

### 4. Research and QA data

Owns:

- competitor snapshots
- keyword gaps
- factual review notes
- publication readiness

This prevents business logic and editorial logic from becoming mixed.

## Research and Editorial Workflow

For a site targeting top Arabic rankings, each event should have a durable editorial file set.

### `research.json`

Store structured research, not prose only:

```json
{
  "queries": [],
  "competitors": [],
  "commonTopics": [],
  "contentGaps": [],
  "faqGaps": [],
  "keywordMap": {
    "primary": "",
    "secondary": [],
    "longTail": []
  },
  "lastResearched": "2026-03-31"
}
```

### `qa.json`

Store publication quality state:

```json
{
  "wordCount": 0,
  "factChecked": false,
  "schemaValid": false,
  "hasHardcodedYear": false,
  "contentReady": false,
  "checkedAt": "2026-03-31",
  "notes": []
}
```

This gives the team a real publishing system, not just content blobs.

## Validation Layer

The current use of Zod is good. It should become stricter.

## Add four validation levels

### 1. Schema validation

Check:

- required keys
- valid enums
- valid section types
- no unknown critical keys

### 2. SEO validation

Check:

- title length
- meta description length
- H1 presence
- primary keyword placement
- canonical consistency
- OG completeness

### 3. Content quality validation

Check:

- answer summary exists
- required sections exist by category
- FAQ count meets minimum
- direct-answer format is present
- no placeholder strings
- no hardcoded years unless explicitly allowed

### 4. Editorial verification validation

Check:

- sources exist
- sources are official when required
- `lastVerified` is recent enough
- publish status cannot move to `published` unless quality checks pass

## Build Outputs

Recommended generated outputs:

- `generated/manifest.json`
- `generated/events-by-slug.json`
- `generated/content-by-slug.json`
- `generated/aliases.json`
- `generated/internal-link-graph.json`
- `generated/search-index.json`
- `generated/sitemap-priority.json`

Prefer generated JSON over generated JS modules. Then create tiny server loaders that import JSON.

Benefits:

- fully data-centric system
- easier external tooling
- easier QA diffing
- easier to inspect in CI

## Next.js 16 Application Layer

## Recommended runtime boundaries

### Keep server-side

- package loading
- alias resolution
- country overlay resolution
- date calculation
- metadata generation
- schema.org generation
- FAQ preparation
- related-events selection
- sitemap building

### Keep client-side only for interaction

- live countdown ticking after hydration
- share button UX
- optional copy feedback
- optional tabs/accordion interaction

## Caching

Continue using Next.js 16 cache primitives, but centralize them inside the page model builder.

Recommended cache tags:

- `holiday:{slug}`
- `holiday-category:{category}`
- `holiday-country:{countryCode}`
- `holiday-manifest`
- `holiday-taxonomy`

## Internal Linking Strategy

At 1000+ events, internal linking cannot remain mostly manual.

Generate it from data.

Each event should declare:

- same-cluster relations
- same-category relations
- country relations
- seasonal relations
- parent-child topic relations

Then build:

- related cards
- “next in category” links
- long-tail hub links
- country landing links
- sitemap priority and freshness weighting

## Recommended Authoring Experience

The future “add event” flow should be:

1. run `npm run events:new -- --slug <slug> ...`
2. scaffold `src/data/holidays/events/<slug>/package.json`
3. scaffold `research.json` and `qa.json`
4. fill content only in JSON
5. run `npm run events:build`
6. run `npm run validate:holidays:slug -- <slug>`
7. publish only when QA passes

No one should need to manually touch:

- page components
- event indexes
- alias indexes
- manifest files
- sitemap code

for a normal event addition.

## Migration Plan

## Phase 1: Consolidate the source of truth

Goal: make package JSON the only authored runtime source.

Actions:

- declare `src/lib/events/packages/items/*.json` as the only editable event source
- stop authoring in `src/lib/events/items/*`
- stop authoring in `src/lib/event-content/items/*`
- mark all JS content maps as legacy
- migrate `src/lib/event-content/countries/*.js` into JSON taxonomy plus package overlays

## Phase 2: Introduce the page model builder

Goal: normalize data before render.

Actions:

- add `buildHolidayPageModel()`
- move all schema normalization there
- make React components render only normalized data
- remove fallback branches for old field shapes from UI components

## Phase 3: Freeze the authoring schema

Goal: one predictable content contract.

Actions:

- deprecate `about` vs `aboutEvent` duality
- deprecate `faqItems` vs `faq` duality
- deprecate object/array dual quick-facts shapes
- define required section blocks per category
- enforce through schema validation

## Phase 4: Move generated data to JSON

Goal: complete the JSON-first architecture.

Actions:

- generate JSON indexes instead of JS module blobs
- add server loaders for generated JSON
- keep manifest and aliases JSON-only

## Phase 5: Add editorial QA gates

Goal: make `published` meaningful.

Actions:

- introduce `briefed`, `researched`, `drafted`, `fact_checked`, `qa_passed`, `published`
- block publish if hardcoded years exist
- block publish if required sources missing
- block publish if section minimums fail

## Phase 6: Scale for 1000+ events

Goal: support large-scale content operations.

Actions:

- cluster events by topic and country
- generate internal-link graph automatically
- add topic hub pages later if needed
- support partial builds and slug-targeted validation
- add stale-content reports based on `lastVerified` and `dateModified`

## Concrete Improvements To Make Soon

## High Priority

1. Stop treating legacy JS content files as part of the long-term architecture.
2. Move country SEO/content overlays from JS to JSON.
3. Add a normalized page model builder.
4. Replace mixed content shapes with one section-based schema.
5. Eliminate hardcoded year strings from package content.
6. Make generated outputs JSON-first.

## Medium Priority

1. Add `research.json` and `qa.json` beside each event package.
2. Improve publish-state workflow.
3. Auto-generate more internal links from taxonomy.
4. Add stronger validator rules for category-specific required sections.

## Lower Priority But Valuable

1. Move inline presentation logic from page components into reusable section components.
2. Add slug-level preview tooling for editors.
3. Add freshness dashboards from manifest and QA metadata.

## Recommended Final Direction

If the team wants the cleanest architecture for the next 2 to 3 years, the best decision is:

- keep one canonical JSON package per event
- store country and taxonomy knowledge in shared JSON
- generate all machine indexes from those JSON files
- use one server-side page model builder as the contract between data and UI
- standardize the event content into typed section blocks
- add research and QA JSON per event so SEO quality is operational, not informal

That architecture will let the team add new events quickly, maintain content quality, and scale to a very large Arabic SEO surface without turning the codebase into a patchwork of exceptions.

## Suggested Implementation Order

1. Consolidate to package JSON only.
2. Migrate country JS overlays to JSON.
3. Add `buildHolidayPageModel()`.
4. Freeze the schema around section blocks.
5. Generate JSON indexes instead of JS content blobs.
6. Add research and QA JSON files.
7. Tighten validation and publishing gates.

## Success Criteria

The architecture is successful when a new event can be added by:

1. creating one event folder
2. filling `package.json`
3. filling `research.json`
4. running generation and validation
5. seeing the event page, metadata, schema, sitemap, aliases, and related links work without touching React code

