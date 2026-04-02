# Event Packages

The old `src/lib/events/packages/items` directory is now legacy.

The canonical source of truth lives in:

- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

Build command:

- `npm run events:build`

New event scaffold:

- `npm run events:new -- --slug <slug> --name "<name>" --type <type> --category <category>`

Generated compatibility artifacts still exist for the runtime and migration path, but they must not be edited manually:

- `src/data/holidays/generated/*`
- `src/lib/events/generated-index.js`
- `src/lib/event-content/generated-index.js`
- `src/lib/events/generated-aliases.js`
- `src/lib/events/items/*`
- `src/lib/event-content/items/*`
