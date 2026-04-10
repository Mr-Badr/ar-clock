import { replaceTokens } from '@/lib/holidays-engine';
import { localizeEventLabel } from '@/lib/holidays/display';

function normalizeValue(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function getHolidayDisplayTitle({ event, seo, tokenContext }) {
  return localizeEventLabel(
    normalizeValue(
      replaceTokens(seo?.seoMeta?.h1 || seo?.seoTitle || event?.name || '', tokenContext),
    ),
    event,
  );
}

export function getHolidaySearchQueries({ event, seo, tokenContext, currentYear }) {
  const displayName = getHolidayDisplayTitle({ event, seo, tokenContext }) || normalizeValue(event?.name);

  const fallbackQueries = [
    `كم باقي على ${displayName}`,
    `متى ${displayName} ${currentYear}`,
    `${displayName} ${currentYear} العد التنازلي`,
    `موعد ${displayName} ${currentYear}`,
    `متى ${displayName} ${currentYear + 1}`,
    `ما هو ${displayName}`,
    `ما أهمية ${displayName}`,
    `كيف أستعد لـ${displayName}`,
  ];

  const resolved = [
    seo?.seoMeta?.primaryKeyword,
    ...(Array.isArray(seo?.keywords) ? seo.keywords : []),
    ...(Array.isArray(seo?.seoMeta?.secondaryKeywords) ? seo.seoMeta.secondaryKeywords : []),
    ...(Array.isArray(seo?.seoMeta?.longTailKeywords) ? seo.seoMeta.longTailKeywords : []),
    ...fallbackQueries,
  ]
    .map((keyword) => replaceTokens(keyword || '', tokenContext))
    .map(normalizeValue)
    .filter(Boolean);

  return Array.from(new Set(resolved)).slice(0, 16);
}

export function getHolidayMetadataKeywords({ event, seo, tokenContext, currentYear }) {
  const displayTitle = getHolidayDisplayTitle({ event, seo, tokenContext }) || normalizeValue(event?.name);
  const baseKeywords = getHolidaySearchQueries({ event, seo, tokenContext, currentYear });
  const extraKeywords = [
    displayTitle,
    `${displayTitle} ${currentYear}`,
    `${displayTitle} ${currentYear + 1}`,
    `تفاصيل ${displayTitle}`,
    `تاريخ ${displayTitle}`,
    `العد التنازلي ${displayTitle}`,
  ];

  return Array.from(new Set([...baseKeywords, ...extraKeywords].map(normalizeValue).filter(Boolean)));
}
