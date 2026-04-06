import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

export const AUTHORING_NOW_ISO = new Date().toISOString();

export type JsonMap = Record<string, any>;

export type EventFolderState = {
  slug: string;
  eventDir: string;
  packagePath: string;
  researchPath: string;
  qaPath: string;
  pkg: JsonMap | null;
  research: JsonMap | null;
  qa: JsonMap | null;
};

export type EventBatchUpdate = {
  package?: JsonMap;
  research?: JsonMap;
  qa?: JsonMap;
};

export type EventBatchItem = {
  slug: string;
  apply: (current: EventFolderState) => EventBatchUpdate | Promise<EventBatchUpdate>;
};

export function buildEmptyResearchRecord(input: {
  slug: string;
  locale?: string;
  capturedAt?: string;
}) {
  return {
    slug: input.slug,
    locale: input.locale || 'ar',
    capturedAt: input.capturedAt || AUTHORING_NOW_ISO,
    primaryQueries: [],
    competitors: [],
    coverageMatrix: [],
    keywordGaps: [],
    unansweredQuestions: [],
    differentiationIdeas: [],
  };
}

export function buildEmptyQaRecord(input: {
  slug: string;
  tier?: 'tier1' | 'tier2' | 'tier3';
  publishStatus?: string;
  updatedAt?: string;
}) {
  return {
    slug: input.slug,
    tier: input.tier || 'tier3',
    publishStatus: input.publishStatus || 'drafted',
    checks: {
      contentReady: false,
      factChecked: false,
      schemaValid: false,
      seoValidated: false,
      hasHardcodedYear: false,
    },
    notes: [],
    updatedAt: input.updatedAt || AUTHORING_NOW_ISO,
  };
}

function readJson(path: string) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function defineEventBatch<T extends EventBatchItem[]>(items: T) {
  return items;
}

export function mirrorFaq(faq: Array<{ question: string; answer: string }>) {
  return faq.map(({ question, answer }) => ({ q: question, a: answer }));
}

export function loadEventFolder(slug: string): EventFolderState {
  const eventDir = join(EVENTS_SOURCE_DIR, slug);
  const packagePath = join(eventDir, 'package.json');
  const researchPath = join(eventDir, 'research.json');
  const qaPath = join(eventDir, 'qa.json');

  return {
    slug,
    eventDir,
    packagePath,
    researchPath,
    qaPath,
    pkg: readJson(packagePath),
    research: readJson(researchPath),
    qa: readJson(qaPath),
  };
}

export async function applyEventBatch(
  items: EventBatchItem[],
  options: { dryRun?: boolean } = {},
) {
  const updatedSlugs: string[] = [];

  for (const item of items) {
    const current = loadEventFolder(item.slug);
    const next = await item.apply(current);
    const eventDir = current.eventDir;

    if (!options.dryRun) {
      mkdirSync(eventDir, { recursive: true });
      if (next.package) writeJson(current.packagePath, next.package);
      if (next.research) writeJson(current.researchPath, next.research);
      if (next.qa) writeJson(current.qaPath, next.qa);
    }

    updatedSlugs.push(item.slug);
  }

  return updatedSlugs;
}
