import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseEventPackage } from '../src/lib/events/package-schema.js';
import { normalizeIslamicRichContentYears } from '../src/lib/islamic-year-format.js';
import {
  buildAuthoringFaqContent,
  pickFaqEntries,
} from '../src/lib/holidays/faq-normalizer.js';
import { getCountryByCode } from '../src/lib/events/country-dictionary.js';
import {
  buildAboutEvent,
  buildKeywordTemplateSet,
  buildRichContentScaffold,
  hasData,
  suggestRelatedSlugs,
  type EventCategory,
  type EventType,
} from './lib/event-scaffold';
import { buildEmptyResearchRecord } from './lib/event-authoring';

const ROOT = process.cwd();
const EVENTS_SOURCE_DIR = join(ROOT, 'src/data/holidays/events');

type LoadedEvent = {
  slug: string;
  packagePath: string;
  researchPath: string;
  pkg: any;
  research: any;
};

function parseArgs() {
  const args = process.argv.slice(2);
  const out: { write: boolean; slugs: string[] | null; liveOnly: boolean } = {
    write: false,
    slugs: null,
    liveOnly: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--write') out.write = true;
    if (arg === '--live') out.liveOnly = true;
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

function readJsonIfExists(path: string) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readEvent(slug: string): LoadedEvent {
  const packagePath = join(EVENTS_SOURCE_DIR, slug, 'package.json');
  const researchPath = join(EVENTS_SOURCE_DIR, slug, 'research.json');
  const raw = JSON.parse(readFileSync(packagePath, 'utf8'));
  return {
    slug,
    packagePath,
    researchPath,
    pkg: parseEventPackage(slug, raw),
    research: readJsonIfExists(researchPath),
  };
}

function listPackageSlugs() {
  return readdirSync(EVENTS_SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function normalizeText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\u0600-\u06ff\s{}-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isUrlLike(value: string) {
  return /^https?:\/\//i.test(String(value || '').trim());
}

function cleanCountryPhrase(value: unknown, countryName = '') {
  let text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return text;

  text = text
    .replace(/في\s+([\u0600-\u06ff]+(?:\s+[\u0600-\u06ff]+){0,3})\s+في\s+\1/g, 'في $1')
    .replace(/\s+/g, ' ')
    .trim();

  if (!countryName) return text;

  const escapedCountry = escapeRegExp(countryName);
  text = text
    .replace(new RegExp(`في\\s+${escapedCountry}(?:\\s+في\\s+${escapedCountry})+`, 'g'), `في ${countryName}`)
    .replace(new RegExp(`${escapedCountry}(?:\\s+${escapedCountry})+`, 'g'), countryName)
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

function uniqueStrings(values: unknown[]) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const text = String(value || '').trim();
    if (!text) continue;
    const normalized = normalizeText(text);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(text);
  }
  return output;
}

function sanitizePhraseList(values: unknown[], countryName = '') {
  return uniqueStrings(values.map((value) => cleanCountryPhrase(value, countryName)));
}

function uniqueByKey<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function mergeFaq(existingRichContent: any, scaffoldFaq: Array<{ question: string; answer: string }>) {
  const faq = pickFaqEntries(existingRichContent) as Array<{ question: string; answer: string }>;
  return uniqueByKey([...faq, ...scaffoldFaq], (item) => normalizeText(item.question)).slice(0, 8);
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

function replaceDynamicYearTokens(value: any, nowYear: number, key = '', countryName = ''): any {
  if (typeof value === 'string') {
    if (isUrlLike(value)) return value;
    if (['datePublished', 'dateModified', 'updatedAt', 'generatedAt', 'lastModified'].includes(key)) {
      return value;
    }

    return cleanCountryPhrase(value
      .replace(new RegExp(`\\b${nowYear + 1}\\b`, 'g'), '{{nextYear}}')
      .replace(new RegExp(`\\b${nowYear}\\b`, 'g'), '{{year}}'), countryName);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceDynamicYearTokens(item, nowYear, key, countryName));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([nestedKey, nestedValue]) => [
        nestedKey,
        replaceDynamicYearTokens(nestedValue, nowYear, nestedKey, countryName),
      ]),
    );
  }

  return value;
}

function buildCountryAwareKeywordSeeds(core: any, pkg: any) {
  const countryCode = core._countryCode || null;
  const countryName = countryCode ? getCountryByCode(countryCode)?.nameAr || '' : '';
  const nameAlreadyIncludesCountry =
    countryName && normalizeText(core.name).includes(normalizeText(countryName));
  const baseSecondary = [
    `${core.name} {{year}}`,
    `كم باقي على ${core.name} {{year}}`,
    `موعد ${core.name} {{year}}`,
    `تاريخ ${core.name} {{year}}`,
    `متى ${core.name} {{nextYear}}`,
    `${core.name} العد التنازلي`,
    `${core.name} متى`,
  ];
  const baseLongTail = [
    `متى ${core.name} {{year}}`,
    `كم باقي على ${core.name} {{year}}`,
    `موعد ${core.name} {{year}}`,
    `تاريخ ${core.name} {{year}}`,
    `${core.name} {{nextYear}}`,
    `ما هو ${core.name}`,
    `كيف أستعد لـ${core.name}`,
    `هل ${core.name} إجازة رسمية`,
    `أهمية ${core.name}`,
    `لماذا يبحث الناس عن ${core.name}`,
    `${core.name} التاريخ والموعد`,
    `${core.name} العد التنازلي`,
  ];

  if (!countryName || nameAlreadyIncludesCountry) {
    return {
      secondary: baseSecondary,
      longTail: baseLongTail,
      countryName: '',
    };
  }

  return {
    secondary: uniqueStrings([
      ...baseSecondary,
      `${core.name} في ${countryName} {{year}}`,
      `موعد ${core.name} في ${countryName} {{year}}`,
    ]),
    longTail: uniqueStrings([
      ...baseLongTail,
      `متى ${core.name} في ${countryName} {{year}}`,
      `كم باقي على ${core.name} في ${countryName} {{year}}`,
      `هل ${core.name} إجازة رسمية في ${countryName}`,
    ]),
    countryName,
  };
}

function mergeSeoMeta(core: any, pkg: any, existingSeoMeta: any, scaffoldSeoMeta: any, nowIso: string) {
  const keywordSeeds = buildCountryAwareKeywordSeeds(core, pkg);
  const countryName = keywordSeeds.countryName || '';
  return {
    ...scaffoldSeoMeta,
    ...(existingSeoMeta || {}),
    canonicalPath: existingSeoMeta?.canonicalPath || `/holidays/${core.slug}`,
    eventCategory: existingSeoMeta?.eventCategory || core.category,
    primaryKeyword: cleanCountryPhrase(
      existingSeoMeta?.primaryKeyword || scaffoldSeoMeta.primaryKeyword,
      countryName,
    ),
    secondaryKeywords: sanitizePhraseList([
      ...(existingSeoMeta?.secondaryKeywords || []),
      ...keywordSeeds.secondary,
      ...(scaffoldSeoMeta.secondaryKeywords || []),
    ], countryName).slice(0, 14),
    longTailKeywords: sanitizePhraseList([
      ...(existingSeoMeta?.longTailKeywords || []),
      ...keywordSeeds.longTail,
      ...(scaffoldSeoMeta.longTailKeywords || []),
    ], countryName).slice(0, 24),
    datePublished: existingSeoMeta?.datePublished || nowIso,
    dateModified: nowIso,
  };
}

function mergeSchemaData(existingSchemaData: any, scaffoldSchemaData: any) {
  return {
    ...scaffoldSchemaData,
    ...(existingSchemaData || {}),
  };
}

function deriveWhyItMatters(query: string) {
  if (query.includes('كم باقي')) return 'نية عد تنازلي مباشرة تناسب الباحث الذي يريد معرفة المدة المتبقية بسرعة.';
  if (query.includes('متى') || query.includes('موعد') || query.includes('تاريخ')) {
    return 'نية مباشرة لمعرفة التاريخ الحالي أو أقرب موعد للمناسبة بطريقة سريعة وواضحة.';
  }
  if (query.includes('ما هو')) return 'نية تعريفية تحتاج إلى شرح مبسط يقدّم المعنى والسياق قبل التفاصيل.';
  if (query.includes('إجازة رسمية')) return 'نية عملية مرتبطة بالتخطيط للإجازة أو العمل أو الدراسة.';
  if (query.includes('كيف')) return 'نية مساعدة عملية تتطلب خطوات أو أفكاراً قابلة للتنفيذ.';
  if (query.includes('لماذا')) return 'نية تفسيرية تحتاج إلى سياق ومعنى وفائدة واضحة للقارئ.';
  return 'صيغة بحث داعمة تزيد من تغطية الصفحة لطرق البحث العربية المختلفة حول المناسبة.';
}

function buildKeywordGapSeeds(core: any, countryName: string) {
  const seeds = [
    `جواب عربي مباشر يوضح معنى ${core.name} وموعده في صفحة واحدة.`,
    `شرح سبب أهمية ${core.name} ولماذا يرتفع البحث عنه عند اقتراب الموعد.`,
    `تغطية الأسئلة العملية التي يطرحها القارئ قبل ${core.name} أو أثناءه.`,
    `صياغة أوضح حول التاريخ الحالي والسنوات القادمة بدل الاكتفاء باسم المناسبة فقط.`,
    `دمج العد التنازلي مع الشرح والسياق بدل صفحة موعد قصيرة وضعيفة.`,
    `ربط الموعد بالقيمة العملية للقارئ: إجازة، استعداد، تهنئة، أو تنظيم مسبق.`,
    `شرح الفروقات المحلية أو الرسمية عند الحاجة بدلاً من الاكتفاء بموعد عام مبهم.`,
    `لغة عربية طبيعية لا تبدو كأنها قائمة كلمات أو نص مولد آلياً.`,
  ];

  if (countryName) {
    seeds.push(`تفسير محلي أوضح لما يعنيه ${core.name} في ${countryName} وكيف يبحث عنه الناس هناك.`);
  }

  return seeds;
}

function buildQuestionSeeds(core: any, countryName: string) {
  const seeds = [
    `متى ${core.name} {{year}}؟`,
    `كم باقي على ${core.name} {{year}}؟`,
    `ما هو ${core.name}؟`,
    `هل ${core.name} إجازة رسمية؟`,
    `كيف أستعد لـ${core.name}؟`,
    `متى ${core.name} {{nextYear}}؟`,
  ];

  if (countryName) {
    seeds.push(`هل ${core.name} إجازة رسمية في ${countryName}؟`);
  }

  return seeds;
}

function buildDifferentiationSeeds(core: any, countryName: string) {
  const localizedEventLabel =
    countryName && !normalizeText(core.name).includes(normalizeText(countryName))
      ? `${core.name} في ${countryName}`
      : core.name;
  return uniqueStrings([
    `جواب مباشر عن موعد ${core.name} في بداية الصفحة قبل أي شرح إضافي.`,
    `محتوى عربي يشرح المعنى والسياق بدلاً من الاكتفاء بعداد أو تاريخ مختصر.`,
    `أسئلة شائعة عملية تساعد القارئ على فهم ${core.name} والتصرف بناءً عليه.`,
    countryName
      ? `ربط الصفحة بطريقة البحث الشائعة عن ${localizedEventLabel} دون فقدان الوضوح العام.`
      : `ربط الصفحة بطريقة البحث العربية الشائعة عن ${core.name} دون حشو أو تكرار.`,
  ]);
}

function buildResearch(slug: string, pkg: any, research: any, nowIso: string) {
  const core = pkg.core;
  const richContent = pkg.richContent || {};
  const seoMeta = richContent.seoMeta || {};
  const keywordTemplateSet = pkg.keywordTemplateSet || {};
  const countryCode = core._countryCode || null;
  const countryName = countryCode ? getCountryByCode(countryCode)?.nameAr || '' : '';
  const faq = pickFaqEntries(richContent) as Array<{ question?: string; answer?: string }>;
  const baseResearch = research || buildEmptyResearchRecord({ slug, locale: 'ar', capturedAt: nowIso });

  const countryOverrideSources = Object.values(pkg.countryOverrides || {}).flatMap((override: any) => (
    Array.isArray(override?.sources)
      ? override.sources.map((item: any) => ({ label: item?.label, url: item?.url }))
      : []
  ));

  const factSources = uniqueByKey([
    ...(Array.isArray(baseResearch.factSources) ? baseResearch.factSources : []),
    ...((Array.isArray(richContent.sources) ? richContent.sources : []).map((item: any) => ({
      label: item?.label,
      url: item?.url,
    }))),
    ...((Array.isArray(baseResearch.competitors) ? baseResearch.competitors : []).map((item: any) => ({
      label: item?.site || item?.label || item?.url,
      url: item?.url,
    }))),
    ...countryOverrideSources,
  ].filter((item) => item?.label && item?.url), (item) => String(item.url).trim()).slice(0, 6);

  const competitors = uniqueByKey([
    ...(Array.isArray(baseResearch.competitors) ? baseResearch.competitors : []),
    ...factSources.map((item) => ({
      site: (() => {
        try {
          return new URL(item.url).hostname.replace(/^www\./, '');
        } catch {
          return item.label;
        }
      })(),
      type: 'reference',
      url: item.url,
      focus: [`التاريخ الرسمي لـ ${core.name}`, `سياق ${core.name}`],
      gaps: ['غالباً لا تقدم صفحة عربية تجمع الموعد والشرح والعد التنازلي في مكان واحد.'],
    })),
  ], (item) => String(item?.url || item?.site || '').trim()).slice(0, 6);

  const primaryQueries = sanitizePhraseList([
    ...(Array.isArray(baseResearch.primaryQueries) ? baseResearch.primaryQueries : []),
    seoMeta.primaryKeyword,
    ...(seoMeta.secondaryKeywords || []),
    ...(seoMeta.longTailKeywords || []),
    ...(Array.isArray(richContent.keywords) ? richContent.keywords : []),
    ...(keywordTemplateSet.base || []),
    ...faq.map((item) => item.question),
  ], countryName).slice(0, 12);

  const coverageMatrix = uniqueByKey([
    ...(Array.isArray(baseResearch.coverageMatrix) ? baseResearch.coverageMatrix : []),
    ...primaryQueries.slice(0, 8).map((keyword) => ({
      keyword,
      whyItMatters: deriveWhyItMatters(keyword),
    })),
  ], (item) => normalizeText(item?.keyword)).slice(0, 8);

  const keywordGaps = sanitizePhraseList([
    ...(Array.isArray(baseResearch.keywordGaps) ? baseResearch.keywordGaps : []),
    ...buildKeywordGapSeeds(core, countryName),
  ], countryName).slice(0, 8);

  const unansweredQuestions = sanitizePhraseList([
    ...(Array.isArray(baseResearch.unansweredQuestions) ? baseResearch.unansweredQuestions : []),
    ...faq.map((item) => item.question),
    ...buildQuestionSeeds(core, countryName),
  ], countryName).slice(0, 8);

  const differentiationIdeas = sanitizePhraseList([
    ...(Array.isArray(baseResearch.differentiationIdeas) ? baseResearch.differentiationIdeas : []),
    ...buildDifferentiationSeeds(core, countryName),
  ], countryName).slice(0, 6);

  return {
    ...baseResearch,
    slug,
    locale: baseResearch.locale || 'ar',
    capturedAt: nowIso,
    primaryQueries,
    competitors,
    coverageMatrix,
    keywordGaps,
    unansweredQuestions,
    differentiationIdeas,
    factSources,
    notes:
      baseResearch.notes
      || `تم تعزيز خريطة البحث العربية لـ ${core.name} اعتماداً على الكلمات المفتاحية الحالية، والأسئلة الشائعة، والمصادر الموجودة داخل الحزمة نفسها.`,
  };
}

function enrichPackage(pkg: any, allEvents: LoadedEvent[], nowIso: string) {
  const core = pkg.core as {
    slug: string;
    name: string;
    type: EventType;
    category: EventCategory;
    _countryCode?: string | null;
  };
  const countryName = core._countryCode ? getCountryByCode(core._countryCode)?.nameAr || '' : '';
  const nowYear = new Date(nowIso).getUTCFullYear();
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
    allEvents.map((entry) => ({
      slug: entry.pkg.core.slug,
      category: entry.pkg.core.category,
      queueOrder: entry.pkg.queueOrder,
    })),
  );
  const relatedSlugs = Array.from(new Set([...relatedSeed, ...relatedSuggestions]))
    .filter((slug) => slug !== core.slug)
    .slice(0, 6);

  const mergedRichContent = replaceDynamicYearTokens(buildAuthoringFaqContent({
    ...scaffold,
    ...existing,
    seoTitle: existing.seoTitle || scaffold.seoTitle,
    description: existing.description || scaffold.description,
    keywords: sanitizePhraseList([
      ...(Array.isArray(existing.keywords) ? existing.keywords : []),
      ...scaffold.keywords,
      ...((pkg.keywordTemplateSet?.base || []) as string[]),
    ], countryName).slice(0, 12),
    answerSummary: existing.answerSummary || scaffold.answerSummary,
    quickFacts: hasData(existing.quickFacts) ? existing.quickFacts : scaffold.quickFacts,
    aboutEvent: deriveAboutEvent(core, existing, scaffold.aboutEvent),
    faq,
    intentCards: hasData(existing.intentCards) ? existing.intentCards : scaffold.intentCards,
    engagementContent: hasData(existing.engagementContent) ? existing.engagementContent : scaffold.engagementContent,
    seoMeta: mergeSeoMeta(core, pkg, existing.seoMeta, scaffold.seoMeta, nowIso),
    recurringYears: hasData(existing.recurringYears) ? existing.recurringYears : scaffold.recurringYears,
    schemaData: mergeSchemaData(existing.schemaData, scaffold.schemaData),
    relatedSlugs: relatedSlugs.length > 0 ? relatedSlugs : existing.relatedSlugs || [],
  }), nowYear, '', countryName);

  return {
    ...pkg,
    keywordTemplateSet: {
      ...buildKeywordTemplateSet(core.name),
      ...(pkg.keywordTemplateSet || {}),
      base: uniqueStrings([
        ...buildKeywordTemplateSet(core.name).base,
        ...((pkg.keywordTemplateSet?.base || []) as string[]),
      ]).slice(0, 6),
      country: sanitizePhraseList([
        ...buildKeywordTemplateSet(core.name).country,
        ...((pkg.keywordTemplateSet?.country || []) as string[]),
      ], countryName).slice(0, 6),
    },
    richContent:
      core.category === 'islamic'
        ? normalizeIslamicRichContentYears(mergedRichContent, { eventName: core.name })
        : mergedRichContent,
  };
}

function ensureReciprocalRelatedLinks(events: Map<string, { nextPackage: any }>) {
  for (const [slug, entry] of Array.from(events.entries())) {
    const related = Array.isArray(entry.nextPackage?.richContent?.relatedSlugs)
      ? entry.nextPackage.richContent.relatedSlugs.filter(Boolean)
      : [];

    for (const targetSlug of related) {
      if (!targetSlug || targetSlug === slug) continue;
      const targetEntry = events.get(targetSlug);
      if (!targetEntry) continue;

      const targetRelated = Array.isArray(targetEntry.nextPackage?.richContent?.relatedSlugs)
        ? targetEntry.nextPackage.richContent.relatedSlugs.filter(Boolean)
        : [];

      if (targetRelated.includes(slug) || targetRelated.length >= 6) continue;

      targetEntry.nextPackage = {
        ...targetEntry.nextPackage,
        richContent: {
          ...(targetEntry.nextPackage.richContent || {}),
          relatedSlugs: Array.from(new Set([...targetRelated, slug])).slice(0, 6),
        },
      };
    }
  }
}

function main() {
  const args = parseArgs();
  const nowIso = new Date().toISOString();
  const targetSlugs = new Set(args.slugs || listPackageSlugs());
  const allEvents = listPackageSlugs().map((slug) => readEvent(slug));
  const draftEvents = new Map<string, {
    packagePath: string;
    researchPath: string;
    pkg: any;
    research: any;
    nextPackage: any;
    nextResearch: any;
  }>();

  for (const event of allEvents) {
    const publishStatus = String(event.pkg.publishStatus || '').trim();
    if (!targetSlugs.has(event.slug)) continue;
    if (args.liveOnly && !['published', 'monitored'].includes(publishStatus)) continue;

    const nextPackage = enrichPackage(event.pkg, allEvents, nowIso);
    draftEvents.set(event.slug, {
      packagePath: event.packagePath,
      researchPath: event.researchPath,
      pkg: event.pkg,
      research: event.research,
      nextPackage,
      nextResearch: event.research,
    });
  }

  ensureReciprocalRelatedLinks(draftEvents);

  let changedEvents = 0;

  for (const [slug, event] of Array.from(draftEvents.entries())) {
    const nextResearch = buildResearch(slug, event.nextPackage, event.research, nowIso);
    const packageChanged = JSON.stringify(event.pkg) !== JSON.stringify(event.nextPackage);
    const researchChanged = JSON.stringify(event.research || {}) !== JSON.stringify(nextResearch);

    if (!packageChanged && !researchChanged) continue;
    changedEvents += 1;

    if (args.write) {
      if (packageChanged) {
        writeFileSync(event.packagePath, `${JSON.stringify(event.nextPackage, null, 2)}\n`, 'utf8');
      }
      if (researchChanged) {
        writeFileSync(event.researchPath, `${JSON.stringify(nextResearch, null, 2)}\n`, 'utf8');
      }
    }
  }

  console.log(
    `[events:autofill] ${args.write ? 'Updated' : 'Would update'} ${changedEvents} event package(s)${args.liveOnly ? ' (live only)' : ''}.`,
  );
}

main();
