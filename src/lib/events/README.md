# Runtime Events Layer

This directory is runtime-only.

## Do Edit
- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

## Do Not Edit
- `src/lib/events/generated-index.js`
- `src/lib/events/generated-aliases.js`
- `src/lib/events/manifest.json`
- `src/lib/events/items/*.json`

These files are generated or compatibility layers.

## Build Flow
1. Author event data in `src/data/holidays/events/<slug>/`
2. Run `npm run events:build`
3. Runtime reads compiled JSON indexes only
