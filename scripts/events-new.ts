import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';
import {
  buildKeywordTemplateSet,
  buildRichContentScaffold,
  type EventCategory,
  type EventType,
} from './lib/event-scaffold';
import { buildEmptyQaRecord, buildEmptyResearchRecord } from './lib/event-authoring';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) continue;
    out[key] = next;
    i += 1;
  }
  return out;
}

function required(value: string | undefined, label: string) {
  if (value && value.trim()) return value.trim();
  throw new Error(`[events:new] Missing required argument --${label}`);
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function main() {
  const args = parseArgs();
  const slug = normalizeSlug(required(args.slug, 'slug'));
  const name = required(args.name, 'name');
  const type = (args.type || 'fixed') as EventType;
  const category = (args.category || 'holidays') as EventCategory;
  const countryCode = args.countryCode?.trim().toLowerCase() || undefined;
  const countryScope = (
    args.countryScope ||
    (countryCode ? 'none' : type === 'hijri' && category === 'islamic' ? 'all' : 'none')
  ) as 'none' | 'all' | 'custom';
  const publishStatus = (args.status || (args.publish === 'true' ? 'published' : 'drafted')) as
    | 'briefed'
    | 'drafted'
    | 'validated'
    | 'fact_checked'
    | 'editor_approved'
    | 'published'
    | 'monitored';

  const eventDir = join(EVENTS_SOURCE_DIR, slug);
  const packagePath = join(eventDir, 'package.json');
  const researchPath = join(eventDir, 'research.json');
  const qaPath = join(eventDir, 'qa.json');

  if (existsSync(packagePath)) {
    throw new Error(`[events:new] Event package already exists: ${packagePath}`);
  }

  mkdirSync(eventDir, { recursive: true });

  const eventPackage = parseEventPackage(slug, {
    schemaVersion: 1,
    core: {
      id: slug,
      slug,
      name,
      type,
      category,
      ...(countryCode ? { _countryCode: countryCode } : {}),
      ...(type === 'fixed' ? { month: 1, day: 1 } : {}),
      ...(type === 'hijri' ? { hijriMonth: 1, hijriDay: 1 } : {}),
      ...(type === 'estimated' ? { date: '{{year}}-01-01' } : {}),
      ...(type === 'monthly' ? { day: 1 } : {}),
    },
    richContent: buildRichContentScaffold(
      {
        slug,
        name,
        type,
        category,
        ...(countryCode ? { _countryCode: countryCode } : {}),
      },
      new Date().toISOString(),
    ),
    countryOverrides: {},
    aliasSlugs: [],
    countryScope,
    keywordTemplateSet: buildKeywordTemplateSet(name),
    tier: 'tier3',
    publishStatus,
    canonicalPath: `/holidays/${slug}`,
    canonicalSource: 'internal',
  });

  const createdAt = new Date().toISOString();
  const research = buildEmptyResearchRecord({
    slug,
    locale: 'ar',
    capturedAt: createdAt,
  });

  const qa = buildEmptyQaRecord({
    slug,
    tier: 'tier3',
    publishStatus,
    updatedAt: createdAt,
  });

  writeJson(packagePath, eventPackage);
  writeJson(researchPath, research);
  writeJson(qaPath, qa);

  if (args.build === 'true') {
    const result = spawnSync('npm', ['run', 'events:build'], {
      stdio: 'inherit',
      cwd: ROOT,
      env: process.env,
    });
    if (result.status !== 0) {
      throw new Error('[events:new] Failed while running npm run events:build');
    }
  }

  console.log(`[events:new] Created event folder: ${eventDir}`);
  console.log('[events:new] Next steps: update package.json, research.json, qa.json, then run npm run validate:holidays:slug -- --slug <slug>.');
  console.log('[events:new] You do not need to edit src/lib/events/index.js or src/lib/event-content/index.js. Dev/build regenerate the event indexes automatically.');
  console.log('[events:new] New events now default to publishStatus="drafted". Pass --publish true or --status published only after the content is ready.');
}

main();
