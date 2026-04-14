import { buildCanonicalMetadata } from '@/lib/seo/metadata';
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
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    inLanguage: 'ar',
    offers: { '@type': 'Offer', price: '0' },
    url: `${SITE_URL}${path}`,
    description,
  };
}

export { SITE_URL };
