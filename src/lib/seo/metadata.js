import { SITE_BRAND, getMetadataBase } from '@/lib/site-config';

/**
 * @param {{
 *   title: string;
 *   description: string;
 *   keywords?: string[] | string;
 *   url: string;
 *   locale?: string;
 *   alternates?: Record<string, string>;
 * }} params
 */
export function buildCanonicalMetadata({
  title,
  description,
  keywords = [],
  url,
  locale = 'ar_SA',
  alternates = {},
}) {
  const normalizedKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    keywords: normalizedKeywords,
    alternates: {
      canonical: url,
      ...alternates,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    openGraph: {
      title,
      description,
      url,
      locale,
      type: 'website',
      siteName: SITE_BRAND,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
