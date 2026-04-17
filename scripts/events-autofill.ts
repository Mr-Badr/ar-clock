import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';
import {
  buildAuthoringFaqContent,
  pickFaqEntries,
} from '../src/lib/holidays/faq-normalizer.js';
import {
  buildAboutEvent,
  buildKeywordTemplateSet,
  buildRichContentScaffold,
  hasData,
  suggestRelatedSlugs,
  type EventCategory,
  type EventType,
} from './lib/event-scaffold';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

function parseArgs() {
  const args = process.argv.slice(2);
  const out: { write: boolean; slugs: string[] | null } = { write: false, slugs: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--write') out.write = true;
    if (arg.startsWith('--slug=')) {
      out.slugs = arg.split('=')[1].split(',').map((value) => value.trim()).filter(Boolean);
    }
    if (arg === '--slug' && args[i + 1] && !args[i + 1].startsWith('--')) {
      out.slugs = args[i + 1].split(',').map((value) => value.trim()).filter(Boolean);
      i += 1;
    }
  }
  return out;
}

function readPackage(slug: string) {
  const path = join(EVENTS_SOURCE_DIR, slug, 'package.json');
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  return {
    path,
    pkg: parseEventPackage(slug, raw),
  };
}

function listPackageSlugs() {
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function mergeFaq(existing: any, scaffoldFaq: Array<{ question: string; answer: string }>) {
  const faq = pickFaqEntries(existing);
  return faq.length > 0 ? faq : scaffoldFaq;
}

function deriveAboutEvent(core: any, richContent: any, scaffoldAboutEvent: Record<string, string>) {
  if (hasData(richContent.aboutEvent)) return richContent.aboutEvent;
  return buildAboutEvent(core, {
    description: richContent.description,
    details: richContent.details,
    history: richContent.history,
    significance: richContent.significance,
    aboutParagraphs: Array.isArray(richContent.about?.paragraphs)
      ? richContent.about.paragraphs.join(' ')
      : '',
    aboutWhat: scaffoldAboutEvent[`ما هو ${core.name}؟`],
  });
}

function mergeSeoMeta(existingSeoMeta: any, scaffoldSeoMeta: any, nowIso: string, slug: string, category: string) {
  return {
    ...scaffoldSeoMeta,
    ...(existingSeoMeta || {}),
    canonicalPath: existingSeoMeta?.canonicalPath || `/holidays/${slug}`,
    eventCategory: existingSeoMeta?.eventCategory || category,
    datePublished: existingSeoMeta?.datePublished || nowIso,
    dateModified: existingSeoMeta?.dateModified || nowIso,
  };
}

function mergeSchemaData(existingSchemaData: any, scaffoldSchemaData: any) {
  return {
    ...scaffoldSchemaData,
    ...(existingSchemaData || {}),
  };
}

function enrichPackage(pkg: any, allPackages: any[], nowIso: string) {
  const core = pkg.core as {
    slug: string;
    name: string;
    type: EventType;
    category: EventCategory;
    _countryCode?: string | null;
  };
  const scaffold = buildRichContentScaffold(core, nowIso);
  const existing = pkg.richContent || {};
  const faq = mergeFaq(existing, scaffold.faq);
  const relatedSeed = Array.isArray(existing.relatedSlugs) ? existing.relatedSlugs.filter(Boolean) : [];
  const relatedSuggestions = suggestRelatedSlugs(
    {
      slug: core.slug,
      category: core.category,
      queueOrder: pkg.queueOrder,
    },
    allPackages.map((entry) => ({
      slug: entry.pkg.core.slug,
      category: entry.pkg.core.category,
      queueOrder: entry.pkg.queueOrder,
    })),
  );
  const relatedSlugs = Array.from(new Set([...relatedSeed, ...relatedSuggestions])).filter((slug) => slug !== core.slug).slice(0, 4);

  const mergedRichContent = buildAuthoringFaqContent({
    ...scaffold,
    ...existing,
    seoTitle: existing.seoTitle || scaffold.seoTitle,
    description: existing.description || scaffold.description,
    keywords: Array.from(new Set([...(Array.isArray(existing.keywords) ? existing.keywords : []), ...scaffold.keywords])),
    answerSummary: existing.answerSummary || scaffold.answerSummary,
    quickFacts: hasData(existing.quickFacts) ? existing.quickFacts : scaffold.quickFacts,
    aboutEvent: deriveAboutEvent(core, existing, scaffold.aboutEvent),
    faq,
    intentCards: hasData(existing.intentCards) ? existing.intentCards : scaffold.intentCards,
    engagementContent: hasData(existing.engagementContent) ? existing.engagementContent : scaffold.engagementContent,
    seoMeta: mergeSeoMeta(existing.seoMeta, scaffold.seoMeta, nowIso, core.slug, core.category),
    recurringYears: hasData(existing.recurringYears) ? existing.recurringYears : scaffold.recurringYears,
    schemaData: mergeSchemaData(existing.schemaData, scaffold.schemaData),
    relatedSlugs: relatedSlugs.length > 0 ? relatedSlugs : existing.relatedSlugs || [],
  });

  return {
    ...pkg,
    keywordTemplateSet:
      pkg.keywordTemplateSet && (pkg.keywordTemplateSet.base?.length || pkg.keywordTemplateSet.country?.length)
        ? pkg.keywordTemplateSet
        : buildKeywordTemplateSet(core.name),
    richContent: mergedRichContent,
  };
}

function main() {
  const args = parseArgs();
  const nowIso = new Date().toISOString();
  const targetSlugs = new Set(args.slugs || listPackageSlugs());
  const allPackages = listPackageSlugs().map((slug) => readPackage(slug));

  let changed = 0;
  for (const { path, pkg } of allPackages) {
    if (!targetSlugs.has(pkg.core.slug)) continue;
    const upgraded = enrichPackage(pkg, allPackages, nowIso);
    const before = JSON.stringify(pkg);
    const after = JSON.stringify(upgraded);
    if (before === after) continue;
    changed += 1;
    if (args.write) {
      writeFileSync(path, `${JSON.stringify(upgraded, null, 2)}\n`, 'utf8');
    }
  }

  console.log(
    `[events:autofill] ${args.write ? 'Updated' : 'Would update'} ${changed} event package(s).`,
  );
}

main();
