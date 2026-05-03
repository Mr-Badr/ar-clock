import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import manifest from '../src/data/holidays/generated/manifest.json';
import { parseEventPackage } from '../src/lib/events/package-schema.js';
import { buildBaseKeywords, buildKeywordTemplateSet } from './lib/event-scaffold';
import { buildNormalizedRichContent } from './lib/content-normalizers';

const ROOT = process.cwd();
const LIVE_STATUSES = new Set(['published', 'monitored']);

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    write: args.includes('--write'),
  };
}

function main() {
  const { write } = parseArgs();
  const nowIso = new Date().toISOString();
  const liveEntries = (manifest.events || []).filter((entry: any) => (
    LIVE_STATUSES.has(entry.publishStatus)
  ));
  let changed = 0;

  for (const entry of liveEntries) {
    const path = join(ROOT, entry.packageFile);
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    const pkg = parseEventPackage(entry.slug, raw);
    const normalizedRichContent = buildNormalizedRichContent(pkg, nowIso);
    const next = {
      ...pkg,
      keywordTemplateSet:
        pkg.countryScope === 'all'
          ? buildKeywordTemplateSet(pkg.core.name)
          : (pkg.keywordTemplateSet || buildKeywordTemplateSet(pkg.core.name)),
      richContent: {
        ...pkg.richContent,
        ...normalizedRichContent,
        keywords: buildBaseKeywords(pkg.core),
        relatedSlugs: Array.isArray(pkg.richContent?.relatedSlugs) ? pkg.richContent.relatedSlugs : [],
      },
    };

    const before = `${JSON.stringify(pkg, null, 2)}\n`;
    const after = `${JSON.stringify(next, null, 2)}\n`;
    if (before === after) continue;
    changed += 1;
    if (write) writeFileSync(path, after, 'utf8');
  }

  console.log(`[events:clean-live] ${write ? 'Updated' : 'Would update'} ${changed} live package(s).`);
}

main();
