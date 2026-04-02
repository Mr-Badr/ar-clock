import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { CANONICAL_ALIAS_RULES, ALIAS_SLUG_SET } from '../src/lib/events/alias-rules.js';
import { inferSourceAuthority, parseEventPackage } from '../src/lib/events/package-schema.js';

const ROOT = process.cwd();
const EVENTS_ITEMS_DIR = join(ROOT, 'src/lib/events/items');
const CONTENT_ITEMS_DIR = join(ROOT, 'src/lib/event-content/items');
const PACKAGES_ITEMS_DIR = join(ROOT, 'src/lib/events/packages/items');
const MANIFEST_PATH = join(ROOT, 'src/lib/events/manifest.json');

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function writeJson(path: string, value: unknown) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function safeRead(path: string): any {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function loadJsonBySlug(dir: string) {
  if (!existsSync(dir)) return {};
  const files = readdirSync(dir).filter((file) => file.endsWith('.json'));
  const out: Record<string, any> = {};
  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    out[slug] = safeRead(join(dir, file)) || {};
  }
  return out;
}

function buildDefaultKeywordTemplates(name: string) {
  return {
    base: [
      `متى ${name} {{year}}`,
      `كم باقي على ${name} {{year}}`,
      `موعد ${name} {{year}}`,
      `${name} {{hijriYear}}`,
    ],
    country: [
      `متى ${name} في {{countryName}} {{year}}`,
      `${name} {{countryName}} {{year}}`,
      `كم باقي على ${name} في {{countryName}}`,
    ],
  };
}

function extractCountryOverlay(aliasContent: any, aliasSlug: string) {
  if (!aliasContent || typeof aliasContent !== 'object') return null;
  const overlay: Record<string, any> = { aliasSlugs: [aliasSlug] };
  const keys = [
    'seoTitle',
    'description',
    'keywords',
    'quickFacts',
    'countryDates',
    'sources',
    'seoMeta',
  ];
  for (const key of keys) {
    if (aliasContent[key] !== undefined) overlay[key] = aliasContent[key];
  }
  if (Object.keys(overlay).length === 1) return null;
  return overlay;
}

function main() {
  ensureDir(PACKAGES_ITEMS_DIR);
  const manifest = safeRead(MANIFEST_PATH);
  const manifestBySlug = new Map<string, any>(
    (manifest?.events || []).map((entry: any) => [entry.slug, entry]),
  );

  const coreBySlug = loadJsonBySlug(EVENTS_ITEMS_DIR);
  const contentBySlug = loadJsonBySlug(CONTENT_ITEMS_DIR);

  const canonicalSlugs = Object.keys(coreBySlug)
    .filter((slug) => !ALIAS_SLUG_SET.has(slug))
    .sort((a, b) => {
      const qa = manifestBySlug.get(a)?.queueOrder || Number.MAX_SAFE_INTEGER;
      const qb = manifestBySlug.get(b)?.queueOrder || Number.MAX_SAFE_INTEGER;
      if (qa !== qb) return qa - qb;
      return a.localeCompare(b);
    });

  for (const slug of canonicalSlugs) {
    const core = coreBySlug[slug];
    if (!core || !core.slug) continue;

    const richContent = contentBySlug[slug] || {};
    const manifestRow = manifestBySlug.get(slug);
    const aliases = (CANONICAL_ALIAS_RULES as Record<string, Array<{ slug: string; countryCode: string }>>)[slug] || [];
    const countryOverrides: Record<string, any> = {};

    for (const alias of aliases) {
      const aliasContent = contentBySlug[alias.slug];
      const overlay = extractCountryOverlay(aliasContent, alias.slug);
      if (!overlay) continue;
      countryOverrides[alias.countryCode] = overlay;
    }

    const eventPackage = parseEventPackage(slug, {
      schemaVersion: 1,
      core,
      richContent,
      countryOverrides,
      aliasSlugs: aliases.map((entry) => entry.slug),
      keywordTemplateSet: buildDefaultKeywordTemplates(core.name),
      tier: manifestRow?.tier || 'tier3',
      publishStatus: 'published',
      canonicalPath: `/holidays/${slug}`,
      canonicalSource: manifestRow?.canonicalSource || 'internal',
      sourceAuthority: manifestRow?.sourceAuthority || inferSourceAuthority(core),
      queueOrder: manifestRow?.queueOrder,
    });

    writeJson(join(PACKAGES_ITEMS_DIR, `${slug}.json`), eventPackage);
  }

  console.log(
    `[migrate-events-to-packages] Migrated ${canonicalSlugs.length} canonical events into packages.`,
  );
}

main();
