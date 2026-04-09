# Add New Event

This guide is the simplest safe workflow for adding a new holiday event to `/holidays/[slug]`.

The goal is:

- add one new event folder
- edit only the event JSON files
- let the generated indexes rebuild automatically
- avoid touching runtime code

## Source Of Truth

Every event lives in its own folder:

```text
src/data/holidays/events/<slug>/
  package.json
  research.json
  qa.json
```

These are the only files you should author directly for a new event.

Do not hand-edit:

- `src/data/holidays/generated/*`
- `src/lib/events/index.js`
- `src/lib/event-content/index.js`
- `src/lib/events/items/*`
- `src/lib/event-content/items/*`

## Quick Start

### 1. Scaffold the event

Run:

```bash
npm run events:new -- --slug your-slug --name "اسم المناسبة" --type fixed --category holidays
```

Example:

```bash
npm run events:new -- --slug school-start-jordan --name "أول يوم دراسي في الأردن" --type estimated --category school
```

This creates:

```text
src/data/holidays/events/your-slug/package.json
src/data/holidays/events/your-slug/research.json
src/data/holidays/events/your-slug/qa.json
```

New events default to:

- `publishStatus: "drafted"`
- `tier: "tier3"`

That is intentional so new content starts in a safe draft state.

### 2. Edit the three event files

Update:

- `package.json`
  - event identity
  - schedule/date fields
  - rich content
  - SEO metadata
  - related slugs
- `research.json`
  - sources
  - keyword research
  - competitor notes
  - fact-check notes
- `qa.json`
  - editorial progress
  - validation state
  - publish readiness

### 3. Start dev or build

Run either:

```bash
npm run dev
```

or:

```bash
npm run build
```

The event indexes regenerate automatically because:

- `predev` runs `npm run events:build`
- `prebuild` runs `npm run events:build`

You do not need to add imports anywhere.

### 4. Validate the event

Run:

```bash
npm run validate:holidays:slug -- --slug your-slug
```

For a broader check, you can also run:

```bash
npm run validate:holidays
```

## Required Command Examples

### Fixed-date event

```bash
npm run events:new -- --slug national-day-qatar --name "اليوم الوطني القطري" --type fixed --category national
```

Then set the fixed date in `package.json`, for example:

- `month`
- `day`

### Hijri event

```bash
npm run events:new -- --slug islamic-new-year --name "رأس السنة الهجرية" --type hijri --category islamic
```

Then set in `package.json`:

- `hijriMonth`
- `hijriDay`

### Estimated event

Use this when the date is announced later or shifts based on an authority:

```bash
npm run events:new -- --slug school-results-egypt --name "نتيجة الثانوية العامة في مصر" --type estimated --category school
```

Then set in `package.json`:

- `date`

Example pattern:

```json
"date": "{{year}}-07-15"
```

### Monthly event

Use this when the event repeats every month on a known day:

```bash
npm run events:new -- --slug housing-support-saudi --name "نزول الدعم السكني" --type monthly --category support
```

Then set in `package.json`:

- `day`

## Common Arguments

### Required

- `--slug`
- `--name`

### Optional

- `--type`
  - `fixed`
  - `hijri`
  - `estimated`
  - `monthly`
- `--category`
  - use the project taxonomy value that matches the event
- `--countryCode`
  - for country-specific events
- `--countryScope`
  - `none`
  - `all`
  - `custom`
- `--status`
  - defaults to `drafted`
- `--publish true`
  - only use when the content is fully ready
- `--build true`
  - runs `npm run events:build` immediately after scaffolding

## Country Scope

### Global event

Use:

- `countryScope: "none"`
- no `core._countryCode`

Example:

- one worldwide canonical page

### Multi-country canonical event

Use:

- `countryScope: "all"`
- no `core._countryCode`

This is useful when:

- one event should generate country-aware variants automatically
- country pages can appear in filters, routing, and sitemap logic

### Single-country event

Use:

- `countryScope: "none"`
- set `core._countryCode`

This is useful when the event belongs to one country only.

## Authoring Checklist

Before you publish a new event, make sure:

- the slug is clean and lowercase
- the event name is correct in Arabic
- the schedule fields are filled correctly
- `canonicalPath` matches `/holidays/<slug>`
- `publishStatus` is still `drafted` until content is ready
- `research.json` includes real sources
- `qa.json` reflects actual status
- related slugs point to real events
- SEO title, description, and FAQ are not placeholders

## Publish Workflow

Recommended flow:

1. create the event as `drafted`
2. complete `package.json`
3. fill `research.json`
4. complete `qa.json`
5. run build
6. run validation
7. only then move toward `published`

If you want to publish later with a dedicated script, use the repo's publish flow rather than hand-editing generated files.

## Troubleshooting

### “Why is my event not showing up?”

Check:

- the folder exists under `src/data/holidays/events/<slug>/`
- JSON is valid
- you ran `npm run dev` or `npm run build`
- validation does not report blocking errors

### “Do I need to edit `src/lib/events/index.js`?”

No.

That manual overlay workflow has been removed. New events are picked up through the generated indexes.

### “Do I need to edit `src/lib/event-content/index.js`?”

No.

Content is discovered through the generated output after rebuild.

### “Should I edit `src/data/holidays/generated/*`?”

No.

Those files are build output only.

## Recommended Minimal Workflow

For most teammates, this is enough:

```bash
npm run events:new -- --slug your-slug --name "اسم المناسبة" --type fixed --category holidays
npm run validate:holidays:slug -- --slug your-slug
npm run dev
```

Then edit only:

- `src/data/holidays/events/your-slug/package.json`
- `src/data/holidays/events/your-slug/research.json`
- `src/data/holidays/events/your-slug/qa.json`

## Related Docs

- `src/data/holidays/README.md`
- `docs/holidays-architecture-plan.md`
