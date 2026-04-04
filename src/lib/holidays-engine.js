/**
 * lib/holidays-engine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure logic utilities · 7 categories · dynamic year resolution · schema helpers
 *
 * Event authoring now lives under src/data/holidays/events/ and is compiled
 * into runtime indexes consumed through src/lib/events/.
 * This file now contains only utility functions and re-exports ALL_EVENTS.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { HIJRI_MONTHS_AR as BASE_MONTHS } from '@/lib/hijri-utils';
import { getCachedEventMeta } from '@/lib/event-cache';
import { buildTemplateContext, resolveTemplate } from '@/lib/template-resolver';
import { getCountryByCode } from '@/lib/events/country-dictionary';
import { HOLIDAY_CATEGORIES } from '@/lib/holidays/taxonomy';
export const HIJRI_MONTHS_AR = ['', ...BASE_MONTHS];
const GREG_MONTHS_AR = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

/* ══════════════════════════════════════════════════════════════════════════
 * YEAR UTILITIES — the core of the dynamic year system
 * ══════════════════════════════════════════════════════════════════════════ */

/** Gregorian year from a Date or ISO string. */
export function getEventYear(d) {
  return (d instanceof Date ? d : new Date(d)).getFullYear();
}

/**
 * Approximate Hijri year for a given Gregorian year.
 * Formula: H ≈ floor((G − 622) × 365.25 / 354.37) + 1
 * Accurate to ±1 year, sufficient for display labels.
 */
export function approxHijriYear(gregorianYear) {
  return Math.floor((gregorianYear - 622) * 365.25 / 354.37) + 1;
}

/**
 * Replace {{year}}, {{hijriYear}}, {{nextYear}} tokens.
 */
export function replaceTokens(str, gregorianYearOrContext, hijriYear) {
  if (!str) return str;
  const context =
    gregorianYearOrContext && typeof gregorianYearOrContext === 'object'
      ? buildTemplateContext(gregorianYearOrContext)
      : buildTemplateContext({ year: gregorianYearOrContext, hijriYear });
  return resolveTemplate(str, context);
}

/**
 * @deprecated Use replaceTokens(). Kept for backward compat during migration.
 */
export function replaceYears(str, gregorianYear, hijriYear) {
  let out = replaceTokens(str, gregorianYear, hijriYear);
  for (let y = new Date().getFullYear() - 1; y <= new Date().getFullYear() + 3; y++) {
    if (y !== gregorianYear)
      out = out.replace(new RegExp(`\\b${y}\\b`, 'g'), String(gregorianYear));
  }
  return out;
}

/**
 * Generate fresh, year-accurate SEO meta for any event.
 * Call this at annotation time with the resolved target date.
 * Returns: { seoTitle, description, keywords, year, hijriYear }
 *
 * This function now uses caching to prevent duplicate processing.
 */
export function resolveEventMeta(ev, targetDate, overrideHijriYear = null) {
  return getCachedEventMeta(ev, targetDate, overrideHijriYear);
}

/**
 * Internal function that performs the actual meta resolution.
 * This is called by the cache when needed.
 */
export function _resolveEventMetaInternal(ev, targetDate, overrideHijriYear = null) {
  const gr = getEventYear(targetDate);
  const hi = overrideHijriYear || approxHijriYear(gr);
  const greg = formatGregorianAr(targetDate);
  const country = getCountryByCode(ev._countryCode || ev.__aliasCountryCode || null);
  const hijriDate =
    ev.type === 'hijri' && ev.hijriDay && ev.hijriMonth
      ? `${ev.hijriDay} ${HIJRI_MONTHS_AR[ev.hijriMonth] || ''} ${hi} هـ`
      : '';
  const tokenContext = buildTemplateContext({
    ...ev,
    year: gr,
    hijriYear: hi,
    eventName: ev.name,
    formattedDate: greg,
    hijriDate,
    countryCode: country?.code || ev._countryCode || '',
    countryName: country?.nameAr || '',
    countryOfficialName: country?.officialNameAr || '',
    authority: country?.authority || '',
    dateVarianceLabel: country?.dateVarianceLabel || '',
  });

  // Update stored rich strings — replaces old years with actual ones
  const seoTitle = replaceTokens(ev.seoTitle || `متى ${ev.name} ${gr} — عد تنازلي دقيق`, tokenContext);
  const description = replaceTokens(ev.description || `عد تنازلي دقيق لـ ${ev.name} — ${greg}.`, tokenContext);
  const keywords = (ev.keywords || [])
    .map(k => replaceTokens(k, tokenContext))
    .concat([
      `${ev.name} ${gr}`,
      `متى ${ev.name} ${gr}`,
      `عد تنازلي ${ev.name}`,
    ])
    .filter((v, i, a) => a.indexOf(v) === i); // dedupe

  // Patch faqItems so FAQ schema + UI always show the correct year
  const faqItems = (ev.faqItems || []).map(({ q, a }) => ({
    q: replaceTokens(q, tokenContext),
    a: replaceTokens(a, tokenContext),
  }));

  // 🆕 Dynamic quickFacts: _dynamic flag drives computed values
  const quickFacts = Array.isArray(ev.quickFacts) ? ev.quickFacts.map(f => {
    let value = replaceTokens(f.value || '', tokenContext);
    if (f._dynamic === 'gregorian') value = greg;
    if (f._dynamic === 'hijri') value = hijriDate || `${ev.hijriDay || 1} ${HIJRI_MONTHS_AR[ev.hijriMonth] || ''} ${hi} هـ`;
    return { label: replaceTokens(f.label || '', tokenContext), value };
  }) : [];

  // Resolve tokens in all rich text content fields
  const rt = (s) => replaceTokens(s || '', tokenContext);

  const about = ev.about ? {
    heading: rt(ev.about.heading),
    paragraphs: (ev.about.paragraphs || []).map(rt),
  } : undefined;

  const significance = rt(ev.significance);
  const details      = rt(ev.details);
  const history      = rt(ev.history);

  const traditions = (ev.traditions || []).map(t => ({
    ...t,
    title: rt(t.title),
    description: rt(t.description),
  }));

  const timeline = (ev.timeline || []).map(t => ({
    ...t,
    phase: rt(t.phase),
    description: rt(t.description),
  }));

  const countryDates = (ev.countryDates || []).map(c => ({
    ...c,
    date: rt(c.date),
    note: rt(c.note),
  }));

  const howTo = ev.howTo ? {
    ...ev.howTo,
    title: rt(ev.howTo.title),
    summary: rt(ev.howTo.summary),
    steps: (ev.howTo.steps || []).map(s => ({
      ...s,
      name: rt(s.name),
      text: rt(s.text),
    })),
  } : undefined;

  // ── NEW AGENTS.md schema fields ──────────────────────────────────────────
  const answerSummary = rt(ev.answerSummary);

  // aboutEvent: { "ما هو ...": "...", "التاريخ والأصل": "..." }
  const aboutEvent = ev.aboutEvent
    ? Object.fromEntries(Object.entries(ev.aboutEvent).map(([k, v]) => [rt(k), rt(v)]))
    : undefined;

  // intentCards: array of card objects
  const intentCards = (ev.intentCards || []).map(c => ({
    ...c,
    title: rt(c.title),
    description: rt(c.description),
    ctaText: rt(c.ctaText),
  }));

  // engagementContent: array of shareable text items
  const engagementContent = (ev.engagementContent || []).map(item => ({
    ...item,
    text: rt(item.text),
  }));

  // faq: new format with { question, answer } — alias to faqItems if missing
  const faq = (ev.faq || []).map(f => ({
    question: rt(f.question),
    answer: rt(f.answer),
  }));

  // seoMeta: resolved title tag, meta description, og fields
  const seoMeta = ev.seoMeta ? {
    ...ev.seoMeta,
    titleTag: rt(ev.seoMeta.titleTag),
    metaDescription: rt(ev.seoMeta.metaDescription),
    h1: rt(ev.seoMeta.h1),
    ogTitle: rt(ev.seoMeta.ogTitle),
    ogDescription: rt(ev.seoMeta.ogDescription),
    ogImageAlt: rt(ev.seoMeta.ogImageAlt),
    secondaryKeywords: (ev.seoMeta.secondaryKeywords || []).map(rt),
    longTailKeywords: (ev.seoMeta.longTailKeywords || []).map(rt),
  } : undefined;

  // recurringYears: context paragraph and source note for years table
  const recurringYears = ev.recurringYears ? {
    contextParagraph: rt(ev.recurringYears.contextParagraph),
    sourceNote: rt(ev.recurringYears.sourceNote),
    columns: ev.recurringYears.columns || ["السنة", "التاريخ", "ملاحظة"],
    highlightCurrentYear: ev.recurringYears.highlightCurrentYear !== false,
  } : undefined;

  // schemaData: JSON-LD fields for structured data
  const schemaData = ev.schemaData ? {
    eventName: rt(ev.schemaData.eventName),
    eventAlternateName: rt(ev.schemaData.eventAlternateName),
    startDate: ev.schemaData.startDate,
    endDate: ev.schemaData.endDate,
    eventDescription: rt(ev.schemaData.eventDescription),
    breadcrumbs: (ev.schemaData.breadcrumbs || []).map(b => ({
      name: rt(b.name),
      path: b.path,
    })),
    articleHeadline: rt(ev.schemaData.articleHeadline),
    faqSchemaItems: (ev.schemaData.faqSchemaItems || []).map(f => ({
      question: rt(f.question),
      answer: rt(f.answer),
    })),
  } : undefined;

  // Final merged FAQ: prefer new faq[], fall back to faqItems[]
  const mergedFaq = faq.length > 0
    ? faq.map(f => ({ q: f.question, a: f.answer }))
    : faqItems;

  return {
    seoTitle, description, keywords, faqItems: mergedFaq, faq: mergedFaq,
    quickFacts, year: gr, hijriYear: hi,
    about, significance, details, history, traditions, timeline, countryDates, howTo,
    // New fields
    answerSummary, aboutEvent, intentCards, engagementContent, seoMeta,
    recurringYears, schemaData,
  };
}

/**
 * Build a dynamic historical-dates table for any event.
 * Shows 2 past years, current year (highlighted), 1 future year.
 */
export function buildHistoricalDates(ev, targetDate) {
  const gr = getEventYear(targetDate);
  const hi = approxHijriYear(gr);

  if (ev.type === 'hijri') {
    return [
      { gregorian: `${gr - 2}م`, hijri: `${hi - 2} هـ`, note: 'ماضي' },
      { gregorian: `${gr - 1}م`, hijri: `${hi - 1} هـ`, note: 'ماضي' },
      { gregorian: `${gr}م`, hijri: `${hi} هـ`, note: 'السنة الحالية', current: true },
      { gregorian: `${gr + 1}م`, hijri: `${hi + 1} هـ`, note: 'تقديري — يتقدم ~11 يوماً' },
    ];
  }
  // Fixed / estimated events
  return [
    { gregorian: `${gr - 2}م`, note: 'ماضي' },
    { gregorian: `${gr - 1}م`, note: 'ماضي' },
    { gregorian: `${gr}م`, note: 'السنة الحالية', current: true },
    { gregorian: `${gr + 1}م`, note: ev.type === 'estimated' ? 'تقديري' : 'ثابت' },
  ];
}

/* ══════════════════════════════════════════════════════════════════════════
 * CATEGORIES
 * ══════════════════════════════════════════════════════════════════════════ */
export const CATEGORIES = HOLIDAY_CATEGORIES;

/* ══════════════════════════════════════════════════════════════════════════
 * DATE HELPERS
 * ══════════════════════════════════════════════════════════════════════════ */

const VALID_CATEGORIES = new Set(CATEGORIES.map(c => c.id));

/** Enrich raw event object with defaults — no hardcoded years in defaults. */
export const enrichEvent = (raw) => {
  if (raw?.__enriched) return raw;
  const e = { ...raw, __enriched: true };
  if (!e.type) e.type = e.hijriMonth != null ? 'hijri' : e.date ? 'estimated' : 'fixed';
  if (e.type === 'hijri') {
    if (!('hijriMonth' in e) && 'month' in e) e.hijriMonth = e.month;
    if (!('hijriDay' in e) && 'day' in e) e.hijriDay = e.day;
  }
  ['hijriMonth', 'hijriDay', 'month', 'day'].forEach(k => { if (e[k] != null) e[k] = Number(e[k]); });
  
  if (e.category && !VALID_CATEGORIES.has(e.category)) {
    console.warn(`[enrichEvent] Invalid category '${e.category}' on slug '${e.slug}'. Defaulting to 'islamic'.`);
    e.category = 'islamic';
  }
  if (!e.category) e.category = 'islamic';

  // NO hardcoded years in defaults — resolveEventMeta injects them at render time
  e.seoTitle ??= `متى ${e.name} — عد تنازلي دقيق بالأيام والساعات`;
  e.description ??= `عد تنازلي حي ودقيق لموعد ${e.name} بالأيام والساعات والدقائق والثواني.`;
  e.details ??= e.description;
  e.keywords ??= [
    `متى ${e.name}`, `موعد ${e.name}`,
    `كم باقي على ${e.name}`, `عد تنازلي ${e.name}`,
  ];
  e.faqItems ??= [
    { q: `كم باقي على ${e.name}؟`, a: e.description },
    { q: `كم يوماً تبقى على ${e.name}؟`, a: 'تابع العد التنازلي الدقيق على هذه الصفحة.' },
    { q: `هل يتغير موعد ${e.name} كل عام؟`, a: e.type === 'hijri' ? 'نعم، يتقدم ~11 يوماً سنوياً في التقويم الهجري.' : `موعد ${e.name} ثابت كل عام.` },
  ];
  return e;
};

function nextFixed(m, d, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  let t = new Date(n.getFullYear(), m - 1, d); t.setHours(0, 0, 0, 0);
  if (t < n) t = new Date(n.getFullYear() + 1, m - 1, d);
  return t;
}
function nextEstimated(iso, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  const d = new Date(iso); d.setHours(0, 0, 0, 0);
  if (isNaN(d.getTime()) || d < n) d.setFullYear(d.getFullYear() + 1);
  return d;
}
function nextMonthly(day, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  let d = new Date(n.getFullYear(), n.getMonth(), day); d.setHours(0, 0, 0, 0);
  if (d < n) d = new Date(n.getFullYear(), n.getMonth() + 1, day);
  if (d.getDate() !== day) d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return d;
}
function easterSunday(yr) {
  const a = yr % 19, b = Math.floor(yr / 100), c = yr % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), dy = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(yr, mo - 1, dy);
}
function nextEasterOffset(offset = 0, now) {
  const n = new Date(now); n.setHours(0, 0, 0, 0);
  let e = easterSunday(n.getFullYear());
  let t = new Date(e); t.setDate(t.getDate() + offset); t.setHours(0, 0, 0, 0);
  if (t < n) { e = easterSunday(n.getFullYear() + 1); t = new Date(e); t.setDate(t.getDate() + offset); }
  return t;
}
function roughHijri(hMonth, hDay, now) {
  const n = new Date(now);
  const EP = new Date('0622-07-19').getTime(), MSY = 354.37 * 86_400_000;
  let yr = Math.floor((n.getTime() - EP) / MSY);
  let t = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);

  // Guarantee a future date
  while (t <= n) {
    yr++;
    t = new Date(EP + yr * MSY + (hMonth - 1) * 29.53 * 86_400_000 + (hDay - 1) * 86_400_000);
  }
  return t;
}

export function getNextEventDate(rawEvent, resolvedMap = {}, nowMs = Date.now()) {
  const now = new Date(nowMs);
  const ev = enrichEvent(rawEvent);
  if (ev.type === 'hijri') {
    const r = resolvedMap[ev.slug];
    if (r?.isoString) { const d = new Date(r.isoString); d.setHours(0, 0, 0, 0); return d; }
    return roughHijri(ev.hijriMonth, ev.hijriDay, now);
  }
  if (ev.type === 'fixed') return nextFixed(ev.month, ev.day, now);
  if (ev.type === 'estimated') {
    // Resolve {{year}} / {{nextYear}} tokens in the date string before parsing.
    // Without this, '{{year}}-06-11' would produce an invalid / year-2002 date.
    const yr = now.getFullYear();
    const resolvedDate = (ev.date || '')
      .replace(/\{\{year\}\}/g,     String(yr))
      .replace(/\{\{nextYear\}\}/g, String(yr + 1));
    return nextEstimated(resolvedDate, now);
  }
  if (ev.type === 'monthly') return nextMonthly(ev.day, now);
  if (ev.type === 'easter') return nextEasterOffset(ev.easterOffset || 0, now);
  return now;
}

/**
 * Returns 'today' | 'upcoming' | 'passed'.
 * Used to drive dynamic EventStatus schema and UI messaging.
 */
export function getEventState(targetDate, nowMs) {
  const today  = new Date(nowMs); today.setHours(0,0,0,0);
  const target = new Date(targetDate); target.setHours(0,0,0,0);
  const diff   = target.getTime() - today.getTime();
  if (diff === 0)  return 'today';
  if (diff > 0)    return 'upcoming';
  return 'passed'; // getNextEventDate already rolled over to next year
}

export function getTimeRemaining(target, nowMs) {
  if (nowMs === undefined) nowMs = 0; // never called without nowMs in prerenderable pages
  const total = (target instanceof Date ? target.getTime() : new Date(target).getTime()) - nowMs;
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
  };
}

export function formatGregorianAr(date) {
  const d = date instanceof Date ? date : new Date(date);
  try { return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); }
  catch { return `${d.getDate()} ${GREG_MONTHS_AR[d.getMonth() + 1]} ${d.getFullYear()}`; }
}
export function formatHijriDisplayAr(hd) {
  if (!hd?.day || !hd?.month || !hd?.year) return null;
  return `${hd.day} ${HIJRI_MONTHS_AR[hd.month] || ''} ${hd.year} هـ`;
}
export function getRelatedEvents(slug, all, n = 4) {
  const ev = all.find(e => e.slug === slug);
  if (!ev) return all.slice(0, n);
  const rest = all.filter(e => e.slug !== slug);
  const sameC = rest.filter(e => e._countryCode === ev._countryCode && e._countryCode);
  const sameCat = rest.filter(e => e.category === ev.category && !sameC.includes(e));
  return [...sameC, ...sameCat, ...rest.filter(e => !sameC.includes(e) && !sameCat.includes(e))].slice(0, n);
}

/* ══════════════════════════════════════════════════════════════════════════
 * SCHEMA HELPERS
 * ══════════════════════════════════════════════════════════════════════════ */
const COUNTRY_NAMES = {
  sa: 'المملكة العربية السعودية', eg: 'مصر', ma: 'المغرب', dz: 'الجزائر',
  ae: 'الإمارات العربية المتحدة', tn: 'تونس', kw: 'الكويت', qa: 'قطر',
};


export function buildEventSchema(ev, date, siteUrl, eventState = 'upcoming') {
  const d = date instanceof Date ? date : new Date(date);
  const end = new Date(d.getTime() + 86_400_000);
  const imgBase = `${siteUrl}/holidays/${ev.slug}/opengraph-image`;
  
  const statusMap = {
    today:    'https://schema.org/EventInProgress',
    upcoming: 'https://schema.org/EventScheduled',
    passed:   'https://schema.org/EventScheduled',
  };

  return {
    '@context': 'https://schema.org', '@type': 'Event',
    name: ev.seoTitle || ev.name,
    description: ev.description,
    startDate: d.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    eventStatus: statusMap[eventState] || statusMap.upcoming,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    inLanguage: 'ar',
    url: `${siteUrl}/holidays/${ev.slug}`,
    // Three aspect ratios — Google picks the best fit for its carousel
    image: [
      `${imgBase}?w=1200&h=1200`,
      `${imgBase}?w=1200&h=900`,
      `${imgBase}?w=1200&h=675`,
    ],
    location: {
      '@type': 'Place',
      name: ev._countryCode ? (COUNTRY_NAMES[ev._countryCode] || 'العالم الإسلامي') : 'العالم الإسلامي',
      address: { '@type': 'PostalAddress', addressCountry: (ev._countryCode || 'SA').toUpperCase() },
    },
    organizer: {
      '@type': 'Organization',
      name: 'ميقات | دليلك الشامل للوقت والمواعيد',
      url: siteUrl,
      logo: `${siteUrl}/icons/icon-512.png`,
    },
    audience: { '@type': 'Audience', audienceType: 'Muslims', geographicArea: { '@type': 'AdministrativeArea', name: 'MENA' } },
  };
}
/** WebPage schema — critical for E-E-A-T freshness signal (dateModified). */
export function buildWebPageSchema(ev, date, siteUrl, nowIso) {
  const d = date instanceof Date ? date : new Date(date);
  return {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: ev.seoTitle || ev.name,
    description: ev.description,
    url: `${siteUrl}/holidays/${ev.slug}`,
    inLanguage: 'ar',
    dateModified: nowIso || '2026-01-01T00:00:00Z',
    datePublished: '2025-01-01T00:00:00Z',
    isPartOf: { '@type': 'WebSite', url: siteUrl, name: 'ميقات | دليلك الشامل للوقت والمواعيد' },
    about: { '@type': 'Event', name: ev.name, startDate: d.toISOString() },
    author: { '@type': 'Organization', name: 'ميقات | دليلك الشامل للوقت والمواعيد', url: siteUrl },
  };
}
export function buildFAQSchema(ev) {
  if (!ev.faqItems?.length) return null;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: ev.faqItems.map(({ q, a }) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
export function buildBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  };
}
/**
 * EventSeries schema — for recurring events (Islamic holidays, national days, etc.)
 * Helps search engines understand that this event repeats annually.
 */
export function buildEventSeriesSchema(ev, siteUrl) {
  // Only add EventSeries for recurring event types
  const recurringTypes = ['hijri', 'fixed', 'easter'];
  if (!recurringTypes.includes(ev.type)) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: ev.name,
    description: ev.description,
    url: `${siteUrl}/holidays/${ev.slug}`,
    inLanguage: 'ar',
    organizer: {
      '@type': 'Organization',
      name: 'ميقات | دليلك الشامل للوقت والمواعيد',
      url: siteUrl,
      logo: `${siteUrl}/icons/icon-512.png`,
    },
    eventSchedule: {
      '@type': 'Schedule',
      repeatFrequency: ev.type === 'hijri' ? 'P354D' : 'P1Y', // Hijri year is ~354 days
      startDate: '2025-01-01',
    },
  };
}
/* ══════════════════════════════════════════════════════════════════════════
 * Backward-compat re-export — all existing consumers keep working
 * Event authoring lives in src/data/holidays/events/ and compiled runtime
 * records are consumed through src/lib/events/.
 * ══════════════════════════════════════════════════════════════════════════ */
import {
  ALL_EVENT_SLUGS,
  ALL_ROUTE_EVENT_SLUGS,
  ALL_RAW_EVENTS,
  resolveEventSlug as _resolveEventSlug,
  getEventBySlug as _getRawEventBySlug,
} from './events/index.js';
export const ALL_EVENTS = ALL_RAW_EVENTS.map(e => enrichEvent(e));
export { ALL_EVENT_SLUGS };
export { ALL_ROUTE_EVENT_SLUGS };
export function resolveEventSlug(slug) {
  return _resolveEventSlug(slug);
}
export function getEventBySlug(slug) {
  const raw = _getRawEventBySlug(slug);
  return raw ? enrichEvent(raw) : null;
}
const CANONICAL_CORE_EVENTS = ALL_EVENTS.filter((event) => !event._countryCode && !event.__aliasCountryCode);
export const RELIGIOUS_HOLIDAYS = CANONICAL_CORE_EVENTS.filter((event) => event.category === 'islamic');
export const SEASONAL_EVENTS = CANONICAL_CORE_EVENTS.filter((event) =>
  ['astronomy', 'school', 'holidays'].includes(event.category),
);
