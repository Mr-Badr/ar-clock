import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';
import { buildSchoolStartRichContent } from './lib/content-normalizers';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

function parseArgs() {
  const args = process.argv.slice(2);
  const groupArg = args.find((arg) => arg.startsWith('--group=')) || '';
  return {
    write: args.includes('--write'),
    group: groupArg.split('=')[1] || 'school-start',
  };
}

function listPackageSlugs() {
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function main() {
  const { write, group } = parseArgs();
  const nowIso = new Date().toISOString();
  const targets = listPackageSlugs().filter((slug) => slug.startsWith(`${group}-`));
  let changed = 0;

  for (const slug of targets) {
    const path = join(EVENTS_SOURCE_DIR, slug, 'package.json');
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    const pkg = parseEventPackage(slug, raw);
    const normalized = buildSchoolStartRichContent(pkg, nowIso);
    const next = {
      ...pkg,
      richContent: {
        ...pkg.richContent,
        ...normalized,
      },
    };

    const before = `${JSON.stringify(pkg, null, 2)}\n`;
    const after = `${JSON.stringify(next, null, 2)}\n`;
    if (before === after) continue;
    changed += 1;
    if (write) writeFileSync(path, after, 'utf8');
  }

  console.log(`[events:normalize-copy] ${write ? 'Updated' : 'Would update'} ${changed} "${group}" package(s).`);
}

main();
