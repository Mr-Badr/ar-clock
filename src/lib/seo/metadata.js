/**
 * @param {{
 *   title: string;
 *   description: string;
 *   keywords?: string[];
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
  return {
    title,
    description,
    keywords: keywords.join(', '),
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
