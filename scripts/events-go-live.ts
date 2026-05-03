import { existsSync, readFileSync } from 'node:fs';
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
    throw new Error(`[events:go-live] Command failed: ${command} ${args.join(' ')}`);
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

function main() {
  const args = parseArgs();
  const slug = String(args.slug || '').trim();
  if (!slug) {
    throw new Error('[events:go-live] Missing required argument --slug');
  }
  if (isPlaceholderSlug(slug)) {
    throw new Error(
      '[events:go-live] Replace the example placeholder with the real event slug, for example: --slug world-fathers-day',
    );
  }

  const path = join(EVENTS_SOURCE_DIR, slug, 'package.json');
  if (!existsSync(path)) {
    throw new Error(
      `[events:go-live] Package not found for slug "${slug}". Expected: ${path}. Create the event folder first or run npm run events:new -- --slug ${slug} --name "اسم المناسبة" --type fixed --category holidays`,
    );
  }

  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const pkg = parseEventPackage(slug, raw);
  const targetStatus = (args.status || 'published') as PublishStatus;
  const currentIndex = STATUS_ORDER.indexOf(pkg.publishStatus as PublishStatus);
  const targetIndex = STATUS_ORDER.indexOf(targetStatus);

  if (currentIndex === -1 || targetIndex === -1) {
    throw new Error(
      `[events:go-live] Unsupported status path "${pkg.publishStatus}" -> "${targetStatus}".`,
    );
  }
  if (targetIndex < currentIndex) {
    throw new Error(
      `[events:go-live] Refusing backward move "${pkg.publishStatus}" -> "${targetStatus}".`,
    );
  }

  runNodeTsxScript('scripts/generate-events-index.ts');
  runNodeTsxScript('scripts/validate-holiday-content.ts', ['--strict', '--slug', slug], {
    envFile: '.env.local',
  });

  for (let index = currentIndex + 1; index <= targetIndex; index += 1) {
    const nextStatus = STATUS_ORDER[index];
    runNodeTsxScript('scripts/events-publish.ts', ['--slug', slug, '--status', nextStatus], {
      envFile: '.env.local',
    });
  }

  console.log(
    `[events:go-live] ${slug} is now at status "${targetStatus}" and ready for holidays listings and country filters when that status is live.`,
  );
}

main();
