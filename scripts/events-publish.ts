import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');
const STATUS_ORDER = [
  'briefed',
  'drafted',
  'validated',
  'fact_checked',
  'editor_approved',
  'published',
  'monitored',
] as const;
type PublishStatus = (typeof STATUS_ORDER)[number];
const STRICT_GATE_STATUSES = new Set<PublishStatus>(['editor_approved', 'published', 'monitored']);

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
    throw new Error(`[events:publish] Command failed: ${command} ${args.join(' ')}`);
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

function isPlaceholderSlug(slug: string) {
  return slug === 'your-slug' || slug === '<slug>' || slug.includes('<') || slug.includes('>');
}

function assertValidTransition(current: PublishStatus, next: PublishStatus, force: boolean) {
  if (force || current === next) return;
  const currentIndex = STATUS_ORDER.indexOf(current);
  const nextIndex = STATUS_ORDER.indexOf(next);
  if (currentIndex === -1 || nextIndex === -1) {
    throw new Error(`[events:publish] Unknown status transition "${current}" -> "${next}".`);
  }
  if (nextIndex < currentIndex) {
    throw new Error(
      `[events:publish] Refusing backward transition "${current}" -> "${next}". Use --force to override.`,
    );
  }
  if (nextIndex > currentIndex + 1) {
    const suggestedNext = STATUS_ORDER[currentIndex + 1];
    throw new Error(
      `[events:publish] Refusing skip transition "${current}" -> "${next}". Move sequentially to "${suggestedNext}" first or use --force.`,
    );
  }
}

function main() {
  const args = parseArgs();
  const slug = (args.slug || '').trim();
  if (!slug) {
    throw new Error('[events:publish] Missing required argument --slug');
  }
  if (isPlaceholderSlug(slug)) {
    throw new Error(
      '[events:publish] Replace the example placeholder with the real event slug, for example: --slug world-fathers-day',
    );
  }

  const path = join(EVENTS_SOURCE_DIR, slug, 'package.json');
  if (!existsSync(path)) {
    throw new Error(
      `[events:publish] Package not found for slug "${slug}". Expected: ${path}. Create the event folder first or run npm run events:new -- --slug ${slug} --name "اسم المناسبة" --type fixed --category holidays`,
    );
  }

  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const pkg = parseEventPackage(slug, raw);
  const nextStatus = (args.status || 'published') as PublishStatus;
  const force = args.force === 'true' || args.force === '1';

  if (!STATUS_ORDER.includes(nextStatus)) {
    throw new Error(`[events:publish] Unsupported status "${nextStatus}".`);
  }

  assertValidTransition(pkg.publishStatus as PublishStatus, nextStatus, force);

  runNodeTsxScript('scripts/generate-events-index.ts');

  if (STRICT_GATE_STATUSES.has(nextStatus)) {
    runNodeTsxScript('scripts/validate-holiday-content.ts', ['--strict', '--slug', slug], {
      envFile: '.env.local',
    });
  }

  const updated = {
    ...pkg,
    publishStatus: nextStatus,
  };

  writeFileSync(path, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  runNodeTsxScript('scripts/generate-events-index.ts');

  console.log(`[events:publish] Updated ${slug}: ${pkg.publishStatus} -> ${nextStatus}`);
}

main();
