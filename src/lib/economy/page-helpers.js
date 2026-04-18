// lib/economy/page-helpers.js
import { getCachedNowIso } from '@/lib/date-utils';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';

const CURRENT_YEAR = new Date().getUTCFullYear();

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
  try {
    return {
      initialViewer: DEFAULT_ECONOMY_VIEWER,
      initialNowIso: await getCachedNowIso(),
    };
  } catch {
    return {
      initialViewer: DEFAULT_ECONOMY_VIEWER,
      initialNowIso: new Date().toISOString(),
    };
  }
}

export function buildEconomyToolSchema({ siteUrl, path, name, description, about = [] }) {
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

export function buildEconomySpeakableSchema({ siteUrl, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${siteUrl}${path}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.economy-banner__title', '.economy-banner__detail'],
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
