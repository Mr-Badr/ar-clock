import {
  replaceTokens,
} from '@/lib/holidays-engine';
import { resolveHolidayRuntimeData } from '@/lib/holidays/runtime-data';

export async function getHolidayOgData(slug) {
  const runtime = await resolveHolidayRuntimeData(slug);
  if (!runtime) return null;
  const { canonicalSlug, event, remaining, seo, gregStr: dateStr, tokenContext } = runtime;
  const resolvedSeo = {
    ...seo,
    seoTitle: replaceTokens(seo?.seoTitle, tokenContext),
    description: replaceTokens(seo?.description, tokenContext),
    seoMeta: seo?.seoMeta
      ? {
          ...seo.seoMeta,
          titleTag: replaceTokens(seo.seoMeta.titleTag, tokenContext),
          ogTitle: replaceTokens(seo.seoMeta.ogTitle, tokenContext),
          metaDescription: replaceTokens(seo.seoMeta.metaDescription, tokenContext),
          ogDescription: replaceTokens(seo.seoMeta.ogDescription, tokenContext),
          ogImageAlt: replaceTokens(seo.seoMeta.ogImageAlt, tokenContext),
        }
      : seo?.seoMeta,
  };

  return {
    event,
    canonicalSlug,
    remaining,
    seo: resolvedSeo,
    dateStr,
  };
}
