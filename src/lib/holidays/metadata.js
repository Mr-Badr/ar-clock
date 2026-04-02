import {
  replaceTokens,
} from '@/lib/holidays-engine';
import {
  ensureCountryContextSentence,
  localizeEventLabel,
} from '@/lib/holidays/display';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { resolveHolidayRuntimeData } from '@/lib/holidays/runtime-data';

export async function getHolidayMetadata(slug) {
  const runtime = await resolveHolidayRuntimeData(slug);
  if (!runtime) {
    return { title: '404', robots: { index: false } };
  }
  const { requestedSlug, remaining, seo, gregStr, tokenContext } = runtime;
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
  const keywords = Array.from(
    new Set([
      ...(Array.isArray(seo?.keywords) ? seo.keywords : []),
      ...(Array.isArray(seo?.seoMeta?.secondaryKeywords) ? seo.seoMeta.secondaryKeywords : []),
      ...(Array.isArray(seo?.seoMeta?.longTailKeywords) ? seo.seoMeta.longTailKeywords : []),
    ]
      .map((keyword) => replaceTokens(keyword, tokenContext))
      .filter(Boolean)),
  );

  return buildCanonicalMetadata({
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
}
