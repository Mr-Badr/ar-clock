import {
  replaceTokens,
} from '@/lib/holidays-engine';
import {
  ensureCountryContextSentence,
  localizeEventLabel,
} from '@/lib/holidays/display';
import { getSiteUrl, SITE_APP_NAME } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { resolveHolidayRuntimeData } from '@/lib/holidays/runtime-data';
import { getHolidayMetadataKeywords } from '@/lib/holidays/search-intent';

export async function getHolidayMetadata(slug) {
  const runtime = await resolveHolidayRuntimeData(slug);
  if (!runtime) {
    return { title: '404', robots: { index: false } };
  }
  const {
    requestedSlug,
    remaining,
    seo,
    gregStr,
    tokenContext,
    currentYear,
    nowIso,
    event,
  } = runtime;
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/holidays/${requestedSlug}`;

  const rawTitleTag = seo?.seoMeta?.titleTag || seo.seoTitle;
  const titleTag = localizeEventLabel(replaceTokens(rawTitleTag, tokenContext), runtime.event);
  const rawDescription =
    seo?.seoMeta?.metaDescription ||
    `${rawTitleTag} — ${gregStr}. متبقي ${remaining.days} يوم. ${seo.description}`;
  const description = ensureCountryContextSentence(
    replaceTokens(rawDescription, tokenContext),
    runtime.event,
  );
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
