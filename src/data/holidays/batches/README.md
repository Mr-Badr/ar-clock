# Holiday Batches

Store reusable holiday authoring batches here.

Use this folder when you want to:

- add several new events at once
- upgrade a group of drafted events
- rerun a known content operation without creating a new root-level script

Run a batch with:

```bash
npm run events:apply-batch -- --file src/data/holidays/batches/your-batch.ts --build --validate
```

Expected shape:

```ts
import { defineEventBatch } from '../../../../scripts/lib/event-authoring';

export default defineEventBatch([
  {
    slug: 'example-event',
    apply(current) {
      return {
        package: {
          ...current.pkg,
          publishStatus: 'drafted',
        },
      };
    },
  },
]);
```

The batch file describes the content changes.
The reusable command handles writing files, rebuilding generated output, and validation.
