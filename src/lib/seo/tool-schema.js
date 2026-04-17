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
 *   inLanguage?: string,
 * }} input
 */
export function buildFreeToolPageSchema({
  siteUrl,
  path,
  name,
  description,
  about = [],
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

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: `${siteUrl}${path}`,
    description,
    inLanguage,
    isAccessibleForFree: true,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_BRAND,
      url: siteUrl,
    },
    ...(normalizedAbout.length > 0 ? { about: normalizedAbout } : {}),
  };
}
