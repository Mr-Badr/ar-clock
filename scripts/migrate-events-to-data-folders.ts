import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OLD_PACKAGES_DIR = join(ROOT, 'src/lib/events/packages/items');
const OLD_RESEARCH_DIR = join(ROOT, 'content-ops/research');
const OLD_MANIFEST_PATH = join(ROOT, 'src/lib/events/manifest.json');
const TARGET_EVENTS_DIR = join(ROOT, 'src/data/holidays/events');

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function loadManifest() {
  if (!existsSync(OLD_MANIFEST_PATH)) return { events: [] };
  try {
    return JSON.parse(readFileSync(OLD_MANIFEST_PATH, 'utf8'));
  } catch {
    return { events: [] };
  }
}

function main() {
  if (!existsSync(OLD_PACKAGES_DIR)) {
    throw new Error(`[migrate-events-to-data-folders] Missing legacy packages directory: ${OLD_PACKAGES_DIR}`);
  }

  const manifest = loadManifest();
  const manifestBySlug = new Map((manifest.events || []).map((row: any) => [row.slug, row]));
  const files = readdirSync(OLD_PACKAGES_DIR).filter((file) => file.endsWith('.json')).sort();
  mkdirSync(TARGET_EVENTS_DIR, { recursive: true });

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    const legacyPackagePath = join(OLD_PACKAGES_DIR, file);
    const eventDir = join(TARGET_EVENTS_DIR, slug);
    const packagePath = join(eventDir, 'package.json');
    const researchPath = join(eventDir, 'research.json');
    const qaPath = join(eventDir, 'qa.json');

    mkdirSync(eventDir, { recursive: true });
    writeJson(packagePath, JSON.parse(readFileSync(legacyPackagePath, 'utf8')));

    const legacyResearchPath = join(OLD_RESEARCH_DIR, `${slug}.json`);
    if (!existsSync(researchPath)) {
      if (existsSync(legacyResearchPath)) {
        writeJson(researchPath, JSON.parse(readFileSync(legacyResearchPath, 'utf8')));
      } else {
        writeJson(researchPath, {
          slug,
          locale: 'ar',
          capturedAt: new Date().toISOString(),
          primaryQueries: [],
          competitors: [],
          coverageMatrix: [],
          keywordGaps: [],
          unansweredQuestions: [],
          differentiationIdeas: [],
        });
      }
    }

    if (!existsSync(qaPath)) {
      const manifestRow = (manifestBySlug.get(slug) || {}) as Record<string, any>;
      const pkg = JSON.parse(readFileSync(legacyPackagePath, 'utf8'));
      writeJson(qaPath, {
        slug,
        tier: pkg.tier || manifestRow.tier || 'tier3',
        publishStatus: pkg.publishStatus || manifestRow.publishStatus || 'drafted',
        checks: {
          contentReady: false,
          factChecked: false,
          schemaValid: false,
          seoValidated: false,
          hasHardcodedYear: false,
        },
        notes: [],
        updatedAt: new Date().toISOString(),
      });
    }
  }

  console.log(`[migrate-events-to-data-folders] Migrated ${files.length} event packages into ${TARGET_EVENTS_DIR}`);
}

main();
