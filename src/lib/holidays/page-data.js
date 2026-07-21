import { cacheLife, cacheTag } from 'next/cache';
import {
  formatGregorianAr,
  replaceTokens,
  buildEventSchema,
  buildWebPageSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildEventSeriesSchema,
} from '@/lib/holidays-engine';
import { COUNTRY_META } from '@/lib/calendar-config';
import { getSiteUrl } from '@/lib/site-config';
import { validateSchemaShape } from '@/lib/holidays/schema-validator';
import { logEvent } from '@/lib/observability';
import { buildHolidayPageModel } from '@/lib/holidays/page-model';
import { resolveHolidayRuntimeData } from '@/lib/holidays/runtime-data';
import {
  ensureCountryContextSentence,
  localizeEventLabel,
} from '@/lib/holidays/display';
import { buildCountryDateRows } from '@/lib/holidays/country-dates';
import { logHolidayFailure } from '@/lib/holidays/observability';

function resolveFaqItems(faqItems, tokenContext) {
  return (faqItems || []).map((item) => {
    const q = item.q || item.question || '';
    const a = item.a || item.answer || '';
    return {
      q: replaceTokens(q, tokenContext),
      a: replaceTokens(a, tokenContext),
    };
  });
}

function resolveQuickFacts(quickFacts, tokenContext) {
  if (Array.isArray(quickFacts)) {
    return quickFacts.map((item) => ({
      label: replaceTokens(item.label || '', tokenContext),
      value: replaceTokens(item.value || '', tokenContext),
    }));
  }
  if (!quickFacts || typeof quickFacts !== 'object') return {};
  return Object.fromEntries(
    Object.entries(quickFacts).map(([label, value]) => [
      replaceTokens(label || '', tokenContext),
      replaceTokens(String(value || ''), tokenContext),
    ]),
  );
}

function formatWeekdayAr(date) {
  try {
    return new Intl.DateTimeFormat('ar', {
      weekday: 'long',
      numberingSystem: 'latn',
    }).format(date);
  } catch {
    return '';
  }
}

function enforceAccurateQuickFacts(quickFacts, event, targetDate, remaining, gregStr, hijriStr) {
  const weekday = formatWeekdayAr(targetDate);
  const daysLabel = `${remaining.days} يوم`;

  if (Array.isArray(quickFacts)) {
    return quickFacts.map((item) => {
      const label = String(item?.label || '');
      if (!label) return item;
      const isEventDateLabel =
        (label.includes('الموعد') || /^موعد(?:\s|$)/.test(label)) &&
        !label.includes('صلاة') &&
        !label.includes('ذبح');
      if (isEventDateLabel) return { ...item, value: gregStr };
      if (label.includes('يوم الأسبوع')) return { ...item, value: weekday };
      if (label.includes('كم يوم باقي')) return { ...item, value: daysLabel };
      if (hijriStr && label.includes('التاريخ الهجري')) return { ...item, value: hijriStr };
      return item;
    });
  }

  if (!quickFacts || typeof quickFacts !== 'object') {
    const fallback = {
      الموعد: gregStr,
      'يوم الأسبوع': weekday,
      'كم يوم باقي': daysLabel,
    };
    if (hijriStr) fallback['التاريخ الهجري'] = hijriStr;
    return fallback;
  }

  const next = {
    ...quickFacts,
    الموعد: gregStr,
    'يوم الأسبوع': weekday,
    'كم يوم باقي': daysLabel,
  };
  if (event.type === 'hijri' && hijriStr) next['التاريخ الهجري'] = hijriStr;
  return next;
}

function applyHolidayPageCache({ canonicalSlug, event }) {
  cacheTag(`holiday-page-${canonicalSlug}`);
  cacheTag(`event:${canonicalSlug}`);
  cacheTag(`events:${event.category}`);
  cacheTag('events:all');
  cacheTag('holidays-page');
  cacheLife('hours');
}

function buildTypeLabel(eventType) {
  return (
    {
      hijri: 'هجري',
      fixed: 'ثابت',
      estimated: 'تقديري',
      monthly: 'شهري',
      floating: 'سنوي متحرك',
      easter: 'ميلادي',
    }[eventType] || eventType
  );
}

function buildHolidayPagePayload(runtime, seo) {
  const {
    requestedSlug,
    canonicalSlug,
    isAlias,
    aliasCountryCode,
    redirectTo,
    event,
    nowIso,
    currentYear,
    calInfo,
    targetDate,
    remaining,
    eventState,
    gregStr,
    hijriStr,
    hijriYearNum,
    tokenContext,
  } = runtime;
  const siteUrl = getSiteUrl();
  const routePath = `/holidays/${requestedSlug}`;

  const faqItems = resolveFaqItems(seo.faq || seo.faqItems || [], tokenContext);
  const quickFacts = enforceAccurateQuickFacts(
    resolveQuickFacts(seo.quickFacts || {}, tokenContext),
    event,
    targetDate,
    remaining,
    gregStr,
    hijriStr,
  );

  const pageSchemaEvent = {
    ...event,
    slug: requestedSlug,
    seoTitle: localizeEventLabel(
      replaceTokens(seo.seoTitle || event.name, tokenContext),
      event,
    ),
    description: ensureCountryContextSentence(
      replaceTokens(seo.description || '', tokenContext),
      event,
    ),
    keywords: Array.isArray(seo.keywords) ? seo.keywords : event.keywords,
    seoMeta: seo.seoMeta || event.seoMeta,
    schemaData: seo.schemaData || event.schemaData,
  };
  const breadcrumbTitle = localizeEventLabel(
    replaceTokens(event.name || seo?.seoMeta?.h1 || '', tokenContext),
    event,
  );

  const shouldEmitEventSchema = pageSchemaEvent?.schemaData?.googleEventRichResult === true;
  const evSchema = shouldEmitEventSchema
    ? {
        ...buildEventSchema(pageSchemaEvent, targetDate, siteUrl, eventState),
        name: pageSchemaEvent.seoTitle,
        description: pageSchemaEvent.description,
      }
    : null;
  const wpSchema = {
    ...buildWebPageSchema(pageSchemaEvent, targetDate, siteUrl, nowIso),
    name: pageSchemaEvent.seoTitle,
    description: pageSchemaEvent.description,
  };
  // buildFAQSchema -> pickFaqEntries reads `.faq` before `.faqItems`. `event.faq` is the
  // raw authored source (still has {{year}}/{{nextYear}} tokens); `faqItems` above is the
  // token-resolved version. Without clearing `.faq` here, the schema silently ships
  // unresolved template tokens in the live JSON-LD, breaking Google's FAQ rich-result parsing.
  const faqSchema = buildFAQSchema({ ...event, faq: undefined, faqItems });
  const bcSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', url: siteUrl },
    { name: 'المناسبات', url: `${siteUrl}/holidays` },
    { name: breadcrumbTitle, url: `${siteUrl}${routePath}` },
  ]);
  const articleSchema = buildArticleSchema(pageSchemaEvent, targetDate, siteUrl, nowIso);
  const eventSeriesSchema = shouldEmitEventSchema
    ? buildEventSeriesSchema(pageSchemaEvent, siteUrl)
    : null;
  const typeLabel = buildTypeLabel(event.type);

  const schemaIssues = [
    ...(evSchema ? validateSchemaShape(evSchema).map((issue) => `event:${issue}`) : []),
    ...validateSchemaShape(wpSchema).map((issue) => `webpage:${issue}`),
    ...(faqSchema ? validateSchemaShape(faqSchema).map((issue) => `faq:${issue}`) : []),
    ...validateSchemaShape(bcSchema).map((issue) => `breadcrumb:${issue}`),
    ...validateSchemaShape(articleSchema).map((issue) => `article:${issue}`),
    ...(eventSeriesSchema ? validateSchemaShape(eventSeriesSchema).map((issue) => `eventseries:${issue}`) : []),
  ];
  if (schemaIssues.length) {
    logEvent('holiday-schema-validation-issues', {
      requestedSlug,
      canonicalSlug,
      schemaIssues,
    });
  }

  const shareText = encodeURIComponent(
    `${breadcrumbTitle} — متبقي ${remaining.days} يوم (${gregStr}) 🗓\n${siteUrl}${routePath}`,
  );
  const pageModel = buildHolidayPageModel({
    event,
    seo,
    quickFacts,
    faqItems,
    tokenContext,
    calInfo,
    nowIso,
  });

  return {
    slug: requestedSlug,
    requestedSlug,
    canonicalSlug,
    isAlias,
    aliasCountryCode,
    redirectTo,
    event,
    seo,
    nowIso,
    currentYear,
    calInfo,
    targetDate,
    remaining,
    eventState,
    gregStr,
    hijriStr,
    hijriYearNum,
    tokenContext,
    quickFacts,
    faqItems,
    pageModel,
    schemas: { evSchema, wpSchema, faqSchema, bcSchema, articleSchema, eventSeriesSchema },
    typeLabel,
    siteUrl,
    whatsappUrl: `https://wa.me/?text=${shareText}`,
    countryMeta: COUNTRY_META,
  };
}

export async function getHolidayPageCriticalData(slug) {
  'use cache';
  try {
    const runtime = await resolveHolidayRuntimeData(slug);
    if (!runtime) return null;

    applyHolidayPageCache(runtime);
    return buildHolidayPagePayload(runtime, runtime.seo);
  } catch (error) {
    logHolidayFailure('holiday-page-critical-data-failed', {
      slug,
      section: 'critical-data',
      degraded: false,
      error,
    });
    throw error;
  }
}

export async function getHolidayPageCountryDates(slug) {
  'use cache';
  try {
    const runtime = await resolveHolidayRuntimeData(slug);
    if (!runtime) return [];

    applyHolidayPageCache(runtime);
    const dynamicCountryDates = await buildCountryDateRows({
      event: runtime.event,
      targetDate: runtime.targetDate,
      tokenContext: runtime.tokenContext,
    });

    return dynamicCountryDates.length > 0
      ? dynamicCountryDates
      : (runtime.seo.countryDates || []);
  } catch (error) {
    logHolidayFailure('holiday-page-country-dates-data-failed', {
      slug,
      section: 'country-dates-data',
      degraded: false,
      error,
    });
    throw error;
  }
}

export async function getHolidayPageData(slug) {
  'use cache';
  const [criticalData, countryDates] = await Promise.all([
    getHolidayPageCriticalData(slug),
    getHolidayPageCountryDates(slug),
  ]);

  if (!criticalData) return null;

  return {
    ...criticalData,
    seo: {
      ...criticalData.seo,
      countryDates,
    },
  };
}
