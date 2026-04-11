# Scripts

This folder should contain reusable project tooling.

Use root-level scripts for:

- build and validation commands
- reusable content pipelines
- migration or maintenance tools that may be run again

Avoid adding one-off content seeding scripts here for every batch of events.

For holiday-event content work:

- author source data in `src/data/holidays/events/<slug>/`
- place reusable batch definitions in `scripts/holiday-batches/`
- run them with `npm run events:apply-batch -- --file <batch-file> --build --validate`

This keeps `scripts/` focused on tooling, while event-specific content instructions stay close to the holiday data itself.
