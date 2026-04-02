# Events Authoring Guide (Single-Source)

For the full onboarding guide, SEO writing rules, keyword strategy, and sitemap behavior, see:
- `docs/new-event-developer-playbook.md`

## Add a New Event
1. Create the package:
   - `npm run events:new -- --slug mawlid-test --name "مناسبة تجريبية" --type fixed --category holidays`
   - Optional shortcuts:
     - `--status drafted` to keep the event hidden from `/holidays`
     - `--build true` to auto-run `events:build`
     - `--countryScope all` to auto-generate aliases/SEO variants for all supported countries
     - `--countryCode ae` for a single-country event
2. Fill the event folder:
   - `src/data/holidays/events/mawlid-test/package.json`
   - `src/data/holidays/events/mawlid-test/research.json`
   - `src/data/holidays/events/mawlid-test/qa.json`
3. Build runtime indexes:
   - `npm run events:build`
4. Validate:
   - `npm run validate:holidays:slug -- --slug mawlid-test`
5. Publish when ready:
   - `npm run events:publish -- --slug mawlid-test --status published`
   - `events:publish` now enforces strict validation and rebuilds indexes automatically.

After build, the event appears automatically in `/holidays` and opens at `/holidays/[slug]`.

## Event Types By Scope
- Global event:
  - no `--countryCode`
  - use `--countryScope none`
  - example: `new-year`
- Multi-country canonical event:
  - no `--countryCode`
  - use `--countryScope all`
  - example: `ramadan`
- Single-country event:
  - use `--countryCode <code>`
  - example: `uae-national-day`

## Event Folder Model
Each event lives in one folder and contains:
- `package.json`: source of truth for `core`, `richContent`, aliases, country overrides, and publish metadata
- `research.json`: competitor research, keyword gaps, differentiation ideas, and editorial notes
- `qa.json`: readiness checks for content, fact-checking, schema, and SEO

## Package Model
Each `package.json` contains:
- `core` (`EventCore`)
- `richContent` (`EventRichContent`)
- optional `aliasSlugs`
- optional `countryOverrides`
- optional `keywordTemplateSet`
- `publishStatus`, `tier`, `canonicalPath`

## Country SEO Strategy
- Keep `richContent` country-neutral by default.
- Put country-specific details only in `countryOverrides`.
- Use `keywordTemplateSet.country` for generated country keyword clusters.
- Legacy country slugs are aliases and map to one canonical page.
- Set `countryScope: "all"` for events that apply to all countries (e.g. Ramadan, Eid).

## Generated Outputs
`npm run events:build` compiles authored event folders into:
- `src/data/holidays/generated/*.json` for fast runtime lookup
- `src/lib/events/items/*.json` and `src/lib/event-content/items/*.json` as compatibility shards
- `src/lib/events/manifest.json` as a compatibility mirror

The authored source is always `src/data/holidays/events/<slug>/`.

## Rule Of Thumb
- Add or edit content in one place only: `src/data/holidays/events/<slug>/`
- Do not add new authored data under `src/lib/events/` or `src/lib/event-content/`
