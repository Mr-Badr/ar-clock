import { resolve } from 'node:path';

import { writeHolidaysDeliveryExport } from './lib/holidays-delivery-export';

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);
    const next = args[index + 1];

    if (!next || next.startsWith('--')) {
      out[key] = 'true';
      continue;
    }

    out[key] = next;
    index += 1;
  }

  return out;
}

function main() {
  const args = parseArgs();
  const outDir = resolve(process.cwd(), args.out || 'out/holidays-delivery');
  const payload = writeHolidaysDeliveryExport(outDir);

  console.log(
    `[export-holidays-delivery] Exported ${payload.manifest.counts.canonicalEvents} canonical records `
    + `(${payload.manifest.counts.aliases} aliases, ${payload.manifest.counts.routableSlugs} routable slugs) `
    + `to ${outDir}`,
  );
}

main();
