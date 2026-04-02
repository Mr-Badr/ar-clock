# Holidays Data Architecture

## Source Of Truth
- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

Each event owns its complete authoring state inside one folder.

## Taxonomy
- `src/data/holidays/taxonomy/countries.json`
- `src/data/holidays/taxonomy/categories.json`

These files define shared country and category metadata used across runtime, SEO, and authoring.

## Generated Runtime Data
`npm run events:build` compiles the authored folders into `src/data/holidays/generated/`.

Key files:
- `manifest.json`: event inventory and file map
- `all-events-list.json`: canonical compiled events
- `published-events-list.json`: published-only compiled events
- `events-by-slug.json`: canonical lookup map
- `content-by-slug.json`: compiled rich content lookup map
- `aliases.json`: alias-to-canonical slug map

## Editing Workflow
1. Scaffold with `npm run events:new -- --slug <slug> --name "<name>" ...`
2. Edit only the event folder JSON files
3. Run `npm run events:build`
4. Run `npm run validate:holidays` or `npm run validate:holidays:slug -- --slug <slug>`

Do not hand-edit files inside `src/data/holidays/generated/`.

## Event Shapes

### Global event
Use:
- `countryScope: "none"`
- no `core._countryCode`

Example:
- `new-year`

### Multi-country canonical event
Use:
- `countryScope: "all"`
- no `core._countryCode`

This means:
- one canonical package is authored once
- country route aliases are generated automatically
- country pages can appear in `/holidays`, sitemap, and country filters

Examples:
- `ramadan`
- `eid-al-fitr`
- `earth-day`

### Single-country event
Use:
- `countryScope: "none"`
- set `core._countryCode`

Example:
- `school-start-egypt`

## Example: Non-Islamic Event For All Countries

Command:

```bash
npm run events:new -- --slug earth-day --name "يوم الأرض" --type fixed --category support --countryScope all --build true
```

Minimal authoring idea inside `src/data/holidays/events/earth-day/package.json`:

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
  }
}
```

After `npm run events:build`:
- canonical page works at `/holidays/earth-day`
- country pages work at `/holidays/earth-day-in-egypt`, `/holidays/earth-day-in-morocco`, and other supported countries
- country pages become country-aware in page titles, headings, breadcrumbs, and fallback descriptions
- if the canonical event is published, those country pages can also enter the holiday sitemap automatically

Use `countryOverrides` only when one country needs custom wording, quick facts, authority notes, or stronger local SEO targeting.
