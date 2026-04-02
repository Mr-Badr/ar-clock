# Runtime Event Content Layer

This directory is runtime-only.

Rich content authoring lives in:
- `src/data/holidays/events/<slug>/package.json`

Runtime content lookup is compiled into:
- `src/data/holidays/generated/content-by-slug.json`

The files in `src/lib/event-content/items/` are compatibility shards and should not be hand-edited.
