import { getEconomyViewerContext } from '@/lib/economy/location';

export const DEFAULT_ECONOMY_VIEWER = {
  timezone: 'UTC',
  cityNameAr: '',
  countryNameAr: '',
  countryCode: '',
  source: 'static',
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
    name,
    url: `${siteUrl}${path}`,
    inLanguage: 'ar',
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
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
