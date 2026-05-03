# Runtime Events Layer

This directory is runtime-only.

## Do Edit
- `src/data/holidays/events/<slug>/package.json`
- `src/data/holidays/events/<slug>/research.json`
- `src/data/holidays/events/<slug>/qa.json`

## Do Not Edit
- `src/lib/events/generated-aliases.js`
- `src/data/holidays/generated/*.json`

These files are generated or compatibility layers.

## Build Flow
1. Author event data in `src/data/holidays/events/<slug>/`
2. Start the app with `npm run dev` or build with `npm run build`
3. The generated indexes are rebuilt automatically from the event folders
4. Runtime reads through `src/lib/holidays/repository.js`

## Authoring Rule
- Adding a new event should never require editing `src/lib/events/index.js`
- Adding a new event should never require editing `src/lib/event-content/index.js`
- If you created the folder and package files correctly, the next `dev` or `build` run will include it automatically
