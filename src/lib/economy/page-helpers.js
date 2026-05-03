// lib/economy/page-helpers.js
import { getEconomySeoEntry } from '@/lib/economy/seo-content';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

export const ECONOMY_FALLBACK_NOW_ISO = '2026-01-01T00:00:00.000Z';
const CURRENT_YEAR = Number.parseInt(ECONOMY_FALLBACK_NOW_ISO.slice(0, 4), 10);

export const DEFAULT_ECONOMY_VIEWER = {
  timezone: 'UTC',
  cityNameAr: '',
  countryNameAr: '',
  countryCode: '',
  source: 'static',
};

export const STATIC_ECONOMY_PAGE_STATE = {
  initialViewer: DEFAULT_ECONOMY_VIEWER,
  initialNowIso: null,
};

export async function getInitialEconomyPageState() {
  return STATIC_ECONOMY_PAGE_STATE;
}

export function buildEconomyToolSchema({ siteUrl, path, name, description, about = [], keywords = [] }) {
  return buildFreeToolPageSchema({
    siteUrl,
    path,
    name,
    description,
    about: [
      'الاقتصاد الحي',
      'الأسواق العالمية',
      'السوق الأمريكي',
      'الذهب',
      'الفوركس',
      name,
      ...about,
    ],
    keywords,
  });
}

export function buildEconomyDatasetSchema({ siteUrl, path, name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url: `${siteUrl}${path}`,
    inLanguage: 'ar',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: `${CURRENT_YEAR}/..`,
  };
}

export function buildEconomyPageSearchCoverage(scope, faqItems = []) {
  const pageSeo = getEconomySeoEntry(scope);

  return buildPrincipalPageSearchCoverage({
    title: pageSeo?.metadata?.title,
    description: pageSeo?.metadata?.description,
    keywords: pageSeo?.metadata?.keywords || [],
    faqItems,
    searchProfile: pageSeo?.searchProfile || {},
  });
}

export function buildEconomySpeakableSchema({ siteUrl, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${siteUrl}${path}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.economy-hero__title', '.economy-hero__lead', '.economy-banner__title', '.economy-banner__detail'],
    },
  };
}

export function buildEconomyFaqSchema({ siteUrl, path, items = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${siteUrl}${path}`,
    inLanguage: 'ar',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildEconomyBreadcrumbSchema(siteUrl, pageName, path = '/economie') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'الاقتصاد', item: `${siteUrl}/economie` },
      { '@type': 'ListItem', position: 3, name: pageName, item: `${siteUrl}${path}` },
    ],
  };
}

export function buildEconomyToolPageMetadata(scope, faqItems = []) {
  const pageSeo = getEconomySeoEntry(scope);
  const siteUrl = getSiteUrl();
  const searchCoverage = buildEconomyPageSearchCoverage(scope, faqItems);

  return buildCanonicalMetadata({
    title: pageSeo.metadata.title,
    description: pageSeo.metadata.description,
    keywords: searchCoverage.metadataKeywords,
    url: `${siteUrl}${pageSeo.path}`,
  });
}

export function buildEconomyToolPageSchemas({ scope, faqItems = [] }) {
  const siteUrl = getSiteUrl();
  const pageSeo = getEconomySeoEntry(scope);
  const searchCoverage = buildEconomyPageSearchCoverage(scope, faqItems);

  return [
    buildEconomyToolSchema({
      siteUrl,
      path: pageSeo.path,
      ...pageSeo.tool,
      about: searchCoverage.schemaAbout,
      keywords: searchCoverage.metadataKeywords,
    }),
    buildEconomyBreadcrumbSchema(
      siteUrl,
      pageSeo.breadcrumbName,
      pageSeo.path,
    ),
    buildEconomyDatasetSchema({
      siteUrl,
      path: pageSeo.path,
      ...pageSeo.dataset,
    }),
    buildEconomySpeakableSchema({
      siteUrl,
      path: pageSeo.path,
    }),
    buildEconomyFaqSchema({
      siteUrl,
      path: pageSeo.path,
      items: faqItems,
    }),
  ];
}
