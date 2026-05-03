# Runtime Event Content Layer

This directory is runtime-only.

Rich content authoring lives in:
- `src/data/holidays/events/<slug>/package.json`

Runtime content lookup is compiled into:
- `src/data/holidays/generated/content-by-slug.json`
- `src/data/holidays/generated/runtime-records-by-slug.json`

Runtime callers should read through:
- `src/lib/holidays/repository.js`

Do not hand-edit generated holiday content files directly. Author rich content
in `src/data/holidays/events/<slug>/package.json` and rebuild instead.
