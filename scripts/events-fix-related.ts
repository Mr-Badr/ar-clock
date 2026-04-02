import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';
import {
  buildRelatedSlugsForPackage,
  ensureReciprocalLink,
} from './lib/content-normalizers';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    write: args.includes('--write'),
  };
}

function listPackageSlugs() {
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function loadPackage(slug: string) {
  const path = join(EVENTS_SOURCE_DIR, slug, 'package.json');
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  return {
    path,
    pkg: parseEventPackage(slug, raw),
  };
}

function main() {
  const { write } = parseArgs();
  const entries = listPackageSlugs().map((slug) => loadPackage(slug));
  const slugSet = new Set(entries.map((entry) => entry.pkg.core.slug));
  const relatedEntries = entries.map((entry) => ({
    slug: entry.pkg.core.slug,
    category: entry.pkg.core.category,
    queueOrder: entry.pkg.queueOrder,
  }));

  const packagesBySlug = new Map(entries.map((entry) => [entry.pkg.core.slug, entry.pkg]));

  for (const entry of entries) {
    const existingRelated = Array.isArray(entry.pkg.richContent?.relatedSlugs)
      ? entry.pkg.richContent.relatedSlugs.filter((slug: string) => slugSet.has(slug))
      : [];

    entry.pkg.richContent = entry.pkg.richContent || {};
    entry.pkg.richContent.relatedSlugs = buildRelatedSlugsForPackage(
      entry.pkg,
      relatedEntries,
      existingRelated,
    );
  }

  for (const entry of entries) {
    const sourceSlug = entry.pkg.core.slug;
    const relatedSlugs = Array.isArray(entry.pkg.richContent?.relatedSlugs)
      ? entry.pkg.richContent.relatedSlugs.filter((slug: string) => slugSet.has(slug))
      : [];
    for (const relatedSlug of relatedSlugs) {
      const relatedPkg = packagesBySlug.get(relatedSlug);
      if (!relatedPkg) continue;
      relatedPkg.richContent = relatedPkg.richContent || {};
      const current = Array.isArray(relatedPkg.richContent.relatedSlugs)
        ? relatedPkg.richContent.relatedSlugs.filter((slug: string) => slugSet.has(slug))
        : [];
      relatedPkg.richContent.relatedSlugs = ensureReciprocalLink(sourceSlug, current);
    }
  }

  let changed = 0;
  for (const entry of entries) {
    const next = `${JSON.stringify(entry.pkg, null, 2)}\n`;
    const prev = `${readFileSync(entry.path, 'utf8').trimEnd()}\n`;
    if (prev === next) continue;
    changed += 1;
    if (write) writeFileSync(entry.path, next, 'utf8');
  }

  console.log(`[events:fix-related] ${write ? 'Updated' : 'Would update'} ${changed} package(s).`);
}

main();
