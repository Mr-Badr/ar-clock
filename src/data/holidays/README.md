# Holidays Data Architecture

## Source Of Truth
- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

See also:
- `docs/add-new-event.md` for the single authoritative event-authoring workflow

Each event owns its complete authoring state inside one folder.

Important:
- These three files are the only authoring files you should edit for an event.
- `src/lib/events/*` and `src/lib/event-content/*` are runtime compatibility layers.
- `src/lib/holidays/repository.js` is the central runtime read boundary.
- `src/data/holidays/generated/*` is compiled output.

## Taxonomy
- `src/data/holidays/taxonomy/countries.json`
- `src/data/holidays/taxonomy/categories.json`

These files define shared country and category metadata used across runtime, SEO, and authoring.

## Generated Runtime Data
`npm run events:build` compiles the authored folders into `src/data/holidays/generated/`.
This step now runs automatically inside `npm run dev` and `npm run build`.

Key files:
- `manifest.json`: event inventory and file map
- `all-events-list.json`: canonical compiled events
- `published-events-list.json`: live compiled events
- `events-by-slug.json`: canonical lookup map
- `content-by-slug.json`: compiled rich content lookup map
- `runtime-records-by-slug.json`: normalized runtime bundle combining core + content + meta + source info
- `aliases.json`: alias-to-canonical slug map

## Editing Workflow
1. Create or scaffold exactly one folder: `src/data/holidays/events/<slug>/`
2. Keep all authoring inside only:
   - `package.json`
   - `research.json`
   - `qa.json`
3. When the event is ready, run one command:

```bash
npm run events:sync -- --slug <slug>
```

This command:
- builds generated indexes
- validates the event package
- marks the event live when validation passes

After a successful sync, the event appears automatically on `/holidays`, in matching filters, and in shared country filters when `countryScope: "all"`.

Do not hand-edit files inside `src/data/holidays/generated/`.
Do not add manual imports in `src/lib/events/index.js` or `src/lib/event-content/index.js`.

## External Delivery Prep

To export the normalized holiday runtime package into a portable static layout
for future CDN/VPS/Postgres delivery, run:

```bash
npm run holidays:delivery:export
```

Default output:

```text
out/holidays-delivery/
```

This export is intentionally separate from the live runtime for now. It is the
safe bridge step before switching the repository to an external storage backend.
The `out/holidays-delivery/` directory is generated output and should not be
treated as source or committed workflow input.

## Recommended Authoring Flow

### One event

Use this when adding a single new event:

```bash
npm run events:new -- --slug your-slug --name "اسم المناسبة" --type fixed --category national
```

After editing the three files, run:

```bash
npm run events:sync -- --slug <slug>
```

### Many events or bulk updates

Use a reusable batch file instead of creating a one-off script in the root `scripts/` folder:

```bash
npm run events:apply-batch -- --file scripts/holiday-batches/your-batch.ts --build --validate
```

Batch files should describe the event updates, while the reusable command handles writing the event folders, rebuilding generated output, and optional validation.

### What not to edit

Do not hand-edit:

- `src/data/holidays/generated/*`
- `out/holidays-delivery/*`

Those files are generated output, not authoring input.

## Delivery Architecture

Current runtime flow:
1. Author event JSON in `src/data/holidays/events/<slug>/`
2. Run `npm run events:sync -- --slug <slug>` or `npm run events:build`
3. Generated artifacts are written into `src/data/holidays/generated/`
4. Runtime reads through `src/lib/holidays/repository.js`

This is important because the repository layer is the future swap point for:
- CDN/VPS-hosted JSON bundles
- PostgreSQL-backed event delivery

That means future storage migration should happen by changing the repository and
delivery pipeline, not by rewriting page components or scattering new fetch
logic across `/holidays`.

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
npm run events:new -- --slug earth-day --name "يوم الأرض" --type fixed --category social --countryScope all --build true
```

Minimal authoring idea inside `src/data/holidays/events/earth-day/package.json`:

```json
{
  "core": {
    "id": "earth-day",
    "slug": "earth-day",
    "name": "يوم الأرض",
    "type": "fixed",
    "category": "social",
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
- if the canonical event is live, those country pages can also enter the holiday sitemap automatically

Use `countryOverrides` only when one country needs custom wording, quick facts, authority notes, or stronger local SEO targeting.
