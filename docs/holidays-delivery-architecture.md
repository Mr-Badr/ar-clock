# Holidays Delivery Architecture

This document describes the current transition architecture for `/holidays` and
the planned path toward CDN/VPS/Postgres delivery.

## Goals

- keep live holiday pages stable
- preserve current URLs and indexing behavior
- reduce confusion about where event data really lives
- make the future storage migration happen behind one runtime boundary

## Current source of truth

Each canonical event is authored only in:

- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

Everything else should be treated as generated output.
The old helper workspace and legacy package mirrors have been retired so the
repo has one clear authoring path.

## Current generated outputs

`npm run events:build` produces:

- `src/data/holidays/generated/manifest.json`
- `src/data/holidays/generated/events-by-slug.json`
- `src/data/holidays/generated/content-by-slug.json`
- `src/data/holidays/generated/event-meta-by-slug.json`
- `src/data/holidays/generated/runtime-records-by-slug.json`
- alias indexes and published lists

`runtime-records-by-slug.json` is the new normalized runtime bundle. Each
canonical slug now has one compiled record that groups:

- `core`
- `content`
- `meta`
- `source`

This is the main handoff point between authoring and runtime.

## Delivery export

The first external-delivery publish step is now available with:

```bash
npm run holidays:delivery:export
```

By default it writes a portable static delivery package to:

```text
out/holidays-delivery/
├── manifest.json
├── indexes/
│   ├── canonical-slugs.json
│   ├── published-canonical-slugs.json
│   ├── route-slugs.json
│   ├── route-resolution-by-slug.json
│   ├── alias-to-canonical.json
│   ├── alias-meta-by-slug.json
│   ├── canonical-to-aliases.json
│   └── event-meta-by-slug.json
├── bundles/
│   ├── all-events-list.json
│   ├── published-events-list.json
│   ├── runtime-records-by-slug.json
│   └── published-runtime-records-by-slug.json
└── records/
    ├── ramadan.json
    ├── eid-al-fitr.json
    └── ...
```

This export is not live runtime yet. It is the future handoff package for:

- CDN-hosted JSON
- VPS-served static holiday data
- a publisher that syncs normalized event data to PostgreSQL or object storage

`out/holidays-delivery/` is generated output. It should be rebuilt when needed,
not treated as a committed source folder.

## Runtime boundary

All holiday runtime reads should converge on:

- `src/lib/holidays/repository.js`

This repository is now responsible for:

- canonical event lookup
- alias resolution
- country overlay application
- published-vs-all filtering
- source metadata access

Compatibility layers still exist:

- `src/lib/events/index.js`
- `src/lib/event-content/index.js`

But they now delegate to the repository instead of acting as separate runtime
sources.

## Safe migration path

### Phase 1: now

- keep authoring in event folders
- keep runtime local and generated
- keep public pages unchanged
- move runtime reads behind the repository

### Phase 2: next month

Add a publisher/sync step that pushes the same normalized runtime record model to:

- a CDN bucket
- a VPS-served JSON directory
- or a PostgreSQL table + cache layer

At that point, the repository becomes the only runtime place that changes.

### Phase 3: final external delivery

Possible production shape:

- Postgres stores canonical event packages and editorial status
- build/publish step emits normalized public JSON artifacts
- CDN/VPS serves the public artifacts
- Next.js runtime fetches from the delivery layer or reads a local cache

The key rule is unchanged:

- page components should consume normalized repository output
- page components should not know whether data came from local JSON, CDN, or Postgres

## Non-goals for this refactor

- no URL changes
- no sitemap strategy changes
- no live SEO regressions
- no removal of compatibility files until the new boundary is proven stable
