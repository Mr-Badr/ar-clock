import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

import { applyEventBatch, type EventBatchItem } from './lib/event-authoring';

const ROOT = process.cwd();

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
    throw new Error(`[events:apply-batch] Command failed: ${command} ${args.join(' ')}`);
  }
}

async function main() {
  const args = parseArgs();
  const file = (args.file || '').trim();
  if (!file) {
    throw new Error('[events:apply-batch] Missing required argument --file');
  }

  const absolutePath = resolve(ROOT, file);
  const moduleUrl = pathToFileURL(absolutePath).href;
  const loaded = await import(moduleUrl);
  const batch = loaded.default as EventBatchItem[] | undefined;

  if (!Array.isArray(batch) || batch.length === 0) {
    throw new Error('[events:apply-batch] The batch file must default-export a non-empty EventBatchItem array.');
  }

  const dryRun = args['dry-run'] === 'true' || args['dry-run'] === '1';
  const shouldBuild = args.build === 'true' || args.build === '1';
  const shouldValidate = args.validate === 'true' || args.validate === '1';

  const slugs = await applyEventBatch(batch, { dryRun });

  if (dryRun) {
    console.log(`[events:apply-batch] Dry run only. Planned updates: ${slugs.join(', ')}`);
    return;
  }

  if (shouldBuild) {
    runStep('npm', ['run', 'events:build']);
  }

  if (shouldValidate) {
    runStep('npm', ['run', 'validate:holidays:slug', '--', '--slug', slugs.join(',')]);
  }

  console.log(`[events:apply-batch] Updated ${slugs.length} event(s): ${slugs.join(', ')}`);
}

main();
