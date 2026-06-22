import {
  replaceTokens,
} from '@/lib/holidays-engine';
import {
  ensureCountryContextSentence,
  getHolidayCountryContext,
  localizeEventLabel,
} from '@/lib/holidays/display';
import { getSiteUrl, SITE_APP_NAME } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getHolidayPageCriticalData } from '@/lib/holidays/page-data';
import { getHolidayMetadataKeywords } from '@/lib/holidays/search-intent';

const META_TITLE_MAX_LENGTH = 80;
const META_DESCRIPTION_MAX_LENGTH = 175;

function normalizeMetadataText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function removeHolidayBrandSuffix(value) {
  return normalizeMetadataText(value)
    .replace(/\s*[-–|]\s*ميقات(?:نا)?\s*$/u, '')
    .trim();
}

function clampMetadataText(value, maxLength) {
  const text = normalizeMetadataText(value);
  if (text.length <= maxLength) return text;

  const candidate = text.slice(0, maxLength - 1).trim();
  const lastSpaceIndex = candidate.lastIndexOf(' ');
  if (lastSpaceIndex < 40) return candidate;

  return candidate.slice(0, lastSpaceIndex).trim();
}

function buildHolidayTitleTag(rawTitleTag, tokenContext, event) {
  const replacedTitle = replaceTokens(rawTitleTag, tokenContext);
  const localizedTitle = localizeEventLabel(removeHolidayBrandSuffix(replacedTitle), event);

  return clampMetadataText(localizedTitle, META_TITLE_MAX_LENGTH);
}

function buildDatePreamble(gregStr, remaining) {
  if (!gregStr || !remaining) return '';
  const { days } = remaining;
  if (days > 1) return `${gregStr} — يتبقى ${days} يوماً. `;
  if (days === 1) return `${gregStr} — يتبقى يوم واحد. `;
  if (days === 0) return `${gregStr} — اليوم هو الموعد. `;
  return '';
}

function buildHolidayMetaDescription(rawDescription, tokenContext, event, { gregStr, remaining } = {}) {
  const preamble = buildDatePreamble(gregStr, remaining);
  const replaced = normalizeMetadataText(replaceTokens(rawDescription, tokenContext));
  const country = getHolidayCountryContext(event);
  const withCountry = country?.name && !replaced.includes(country.name)
    ? `${replaced} في ${country.name}.`
    : ensureCountryContextSentence(replaced, event);
  const full = preamble ? `${preamble}${withCountry}` : withCountry;
  return clampMetadataText(full, META_DESCRIPTION_MAX_LENGTH);
}

export async function getHolidayMetadata(slug) {
  const data = await getHolidayPageCriticalData(slug);
  if (!data) {
    return { title: '404', robots: { index: false } };
  }
  const {
    requestedSlug,
    canonicalSlug,
    remaining,
    seo,
    gregStr,
    tokenContext,
    currentYear,
    nowIso,
    event,
  } = data;
  const siteUrl = getSiteUrl();
  const canonicalPathSlug = canonicalSlug || requestedSlug;
  const url = `${siteUrl}/holidays/${canonicalPathSlug}`;

  const rawTitleTag = seo?.seoMeta?.titleTag || seo.seoTitle;
  const titleTag = buildHolidayTitleTag(rawTitleTag, tokenContext, event);
  const rawDescription =
    seo?.seoMeta?.metaDescription ||
    `${rawTitleTag}. ${seo.description}`;
  const description = buildHolidayMetaDescription(rawDescription, tokenContext, event, { gregStr, remaining });
  const keywords = getHolidayMetadataKeywords({
    event,
    seo,
    tokenContext,
    currentYear,
  });

  const metadata = buildCanonicalMetadata({
    title: titleTag,
    description,
    keywords,
    url,
    locale: 'ar_SA',
    alternates: {
      languages: {
        ar: url,
        'ar-SA': url,
        'ar-EG': url,
        'ar-MA': url,
      },
    },
  });

  return {
    ...metadata,
    category: 'events',
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: seo?.seoMeta?.datePublished || '2025-01-01T00:00:00.000Z',
      modifiedTime: seo?.seoMeta?.dateModified || nowIso,
      authors: [SITE_APP_NAME],
      section: event?.category || 'holidays',
      tags: keywords.slice(0, 20),
    },
  };
}
