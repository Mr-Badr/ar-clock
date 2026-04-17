import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export function buildAgeMetadata({ title, description, keywords, path }) {
  return buildCanonicalMetadata({
    title,
    description,
    keywords,
    url: `${SITE_URL}${path}`,
  });
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };
}

export function buildSoftwareSchema({ name, description, path }) {
  return buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path,
    name,
    description,
    about: [name, 'الحاسبات', 'أداة مجانية'],
  });
}

export { SITE_URL };
