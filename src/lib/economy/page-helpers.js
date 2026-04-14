// lib/economy/page-helpers.js
import { getEconomyViewerContext } from '@/lib/economy/location';

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
    const viewer = await getEconomyViewerContext();
    return {
      initialViewer: viewer,
      initialNowIso: new Date().toISOString(),
    };
  } catch {
    return {
      initialViewer: DEFAULT_ECONOMY_VIEWER,
      initialNowIso: new Date().toISOString(),
    };
  }
}

export function buildEconomyWebApplicationSchema({ siteUrl, path, name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    name,
    url: `${siteUrl}${path}`,
    inLanguage: 'ar',
    description,
    featureList: [
      'تحديد المنطقة الزمنية تلقائياً',
      'تحويل أوقات الجلسات إلى توقيت المستخدم',
      'عدادات تنازلية حية وتوصيات مبنية على الوقت',
    ],
    audience: {
      '@type': 'Audience',
      geographicArea: 'Arab World',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
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
