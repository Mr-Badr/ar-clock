import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';

import { buildEmptyQaRecord, buildEmptyResearchRecord } from './lib/event-authoring';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');
const MANIFEST_PATH = join(ROOT, 'src/data/holidays/generated/manifest.json');

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function writeIfMissing(path: string, content: string) {
  if (existsSync(path)) return;
  writeFileSync(path, content, 'utf8');
}

function loadCanonicalEvents() {
  try {
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    return (manifest.events || []).map((row: any) => ({
      slug: row.slug,
      category: row.category,
      tier: row.tier,
      publishStatus: row.publishStatus,
      packageFile: row.packageFile,
    }));
  } catch {
    return [];
  }
}

function hydrateEventNames(events: any[]) {
  return events.map((event) => {
    try {
      const packagePath = join(ROOT, event.packageFile || `src/data/holidays/events/${event.slug}/package.json`);
      const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
      return {
        ...event,
        name: pkg?.core?.name || event.slug,
      };
    } catch {
      return {
        ...event,
        name: event.slug,
      };
    }
  });
}

function main() {
  ensureDir(EVENTS_SOURCE_DIR);
  const canonicalEvents = hydrateEventNames(loadCanonicalEvents());

  for (const event of canonicalEvents) {
    const eventDir = join(EVENTS_SOURCE_DIR, event.slug);
    ensureDir(eventDir);
    writeIfMissing(
      join(eventDir, 'research.json'),
      `${JSON.stringify(buildEmptyResearchRecord({ slug: event.slug, locale: 'ar' }), null, 2)}\n`,
    );
    writeIfMissing(
      join(eventDir, 'qa.json'),
      `${JSON.stringify(
        buildEmptyQaRecord({
          slug: event.slug,
          tier: event.tier || 'tier3',
          publishStatus: event.publishStatus || 'drafted',
        }),
        null,
        2,
      )}\n`,
    );
  }

  const folders = readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  writeIfMissing(
    join(EVENTS_SOURCE_DIR, 'README.md'),
    '# Holidays Events\n\nEach event has its own folder with `package.json`, `research.json`, and `qa.json`.\n',
  );

  console.log(
    `[generate-content-ops-scaffold] Ensured research/qa JSON files for ${canonicalEvents.length} canonical events across ${folders.length} event folders.`,
  );
}

main();
