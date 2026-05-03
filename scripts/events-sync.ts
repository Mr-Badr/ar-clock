import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';
import { buildEmptyQaRecord, buildEmptyResearchRecord } from './lib/event-authoring';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      out[key] = 'true';
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

function runStep(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: ROOT,
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`[events:sync] Command failed: ${command} ${args.join(' ')}`);
  }
}

function runNodeTsxScript(scriptPath: string, args: string[] = [], options?: { envFile?: string }) {
  const nodeArgs = [] as string[];
  if (options?.envFile) {
    nodeArgs.push(`--env-file=${options.envFile}`);
  }
  nodeArgs.push('--import', 'tsx', scriptPath, ...args);
  runStep('node', nodeArgs);
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function isPlaceholderSlug(slug: string) {
  return slug === 'your-slug' || slug === '<slug>' || slug.includes('<') || slug.includes('>');
}

function main() {
  const args = parseArgs();
  const slug = String(args.slug || '').trim();
  if (!slug) {
    throw new Error('[events:sync] Missing required argument --slug');
  }
  if (isPlaceholderSlug(slug)) {
    throw new Error(
      '[events:sync] Replace the example placeholder with the real event slug, for example: --slug world-fathers-day',
    );
  }

  const eventDir = join(EVENTS_SOURCE_DIR, slug);
  const packagePath = join(eventDir, 'package.json');
  const researchPath = join(eventDir, 'research.json');
  const qaPath = join(eventDir, 'qa.json');

  if (!existsSync(packagePath)) {
    throw new Error(
      `[events:sync] Package not found for slug "${slug}". Expected: ${packagePath}. Create the event folder first or run npm run events:new -- --slug ${slug} --name "اسم المناسبة" --type fixed --category holidays`,
    );
  }

  const pkgRaw = JSON.parse(readFileSync(packagePath, 'utf8'));
  const pkg = parseEventPackage(slug, pkgRaw);
  const nowIso = new Date().toISOString();

  if (!existsSync(researchPath)) {
    writeJson(researchPath, buildEmptyResearchRecord({ slug, locale: 'ar', capturedAt: nowIso }));
  }

  let qa = existsSync(qaPath) ? JSON.parse(readFileSync(qaPath, 'utf8')) : null;
  if (!qa) {
    qa = buildEmptyQaRecord({
      slug,
      publishStatus: 'drafted',
      updatedAt: nowIso,
    });
    writeJson(qaPath, qa);
  }

  runNodeTsxScript('scripts/events-sync-research.ts', ['--write', '--slug', slug]);
  runNodeTsxScript('scripts/events-fix-related.ts', ['--write']);
  runNodeTsxScript('scripts/generate-events-index.ts');
  runNodeTsxScript('scripts/validate-holiday-content.ts', ['--strict', '--slug', slug], {
    envFile: '.env.local',
  });

  const nextPackage = {
    ...pkgRaw,
    publishStatus: 'published',
  };
  const nextQa = {
    ...qa,
    publishStatus: 'published',
    checks: {
      ...(qa?.checks || {}),
      contentReady: true,
      schemaValid: true,
      seoValidated: true,
    },
    updatedAt: nowIso,
  };

  writeJson(packagePath, nextPackage);
  writeJson(qaPath, nextQa);

  runNodeTsxScript('scripts/events-sync-research.ts', ['--write', '--slug', slug]);
  runNodeTsxScript('scripts/events-fix-related.ts', ['--write']);
  runNodeTsxScript('scripts/generate-events-index.ts');

  console.log(
    `[events:sync] ${slug} is now live. If the content is valid, it will appear automatically on /holidays, in matching filters, and in shared country filters when countryScope is all.`,
  );
}

main();
