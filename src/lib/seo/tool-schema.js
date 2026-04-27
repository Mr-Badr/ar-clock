import { SITE_BRAND } from '@/lib/site-config';

/**
 * @typedef {{ '@type'?: string, name?: string }} ToolSchemaThing
 */

/**
 * @param {{
 *   siteUrl: string,
 *   path: string,
 *   name: string,
 *   description: string,
 *   about?: Array<string | ToolSchemaThing>,
 *   keywords?: string[] | string,
 *   inLanguage?: string,
 * }} input
 */
export function buildFreeToolPageSchema({
  siteUrl,
  path,
  name,
  description,
  about = [],
  keywords = [],
  inLanguage = 'ar',
}) {
  const normalizedAbout = about
    .map((item) => {
      if (!item) return null;
      if (typeof item === 'string') {
        return { '@type': 'Thing', name: item };
      }
      return item;
    })
    .filter(Boolean);
  const normalizedKeywords = Array.isArray(keywords)
    ? Array.from(new Set(keywords.map((item) => String(item || '').trim()).filter(Boolean)))
    : String(keywords || '').trim();
  const keywordsValue = Array.isArray(normalizedKeywords)
    ? normalizedKeywords.join(', ')
    : normalizedKeywords;
  const aboutKeywordsValue = normalizedAbout
    .map((item) => item?.name)
    .filter(Boolean)
    .join(', ');
  const effectiveKeywordsValue = keywordsValue || aboutKeywordsValue;
  const pageUrl = `${siteUrl}${path}`;
  const toolId = `${pageUrl}#tool`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name,
        url: pageUrl,
        description,
        inLanguage,
        isAccessibleForFree: true,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_BRAND,
          url: siteUrl,
        },
        mainEntity: { '@id': toolId },
        ...(normalizedAbout.length > 0 ? { about: normalizedAbout } : {}),
        ...(effectiveKeywordsValue ? { keywords: effectiveKeywordsValue } : {}),
      },
      {
        '@type': 'SoftwareApplication',
        '@id': toolId,
        name,
        url: pageUrl,
        description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        inLanguage,
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        provider: {
          '@type': 'Organization',
          name: SITE_BRAND,
          url: siteUrl,
        },
        ...(normalizedAbout.length > 0 ? { about: normalizedAbout } : {}),
        ...(effectiveKeywordsValue ? { keywords: effectiveKeywordsValue } : {}),
      },
    ],
  };
}
