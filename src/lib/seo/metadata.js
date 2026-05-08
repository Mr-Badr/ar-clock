import { SITE_BRAND, getMetadataBase } from '@/lib/site-config';

function normalizeKeyword(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

/**
 * buildCanonicalMetadata — core SEO metadata builder.
 *
 * Generates complete Next.js metadata for any page with:
 *  - Correct canonical URL (prevents duplicate content penalties)
 *  - Full robots directives with max-snippet:-1 (allows Google full previews)
 *  - Open Graph with fallback to root layout's og-default.png
 *  - Twitter/X large card
 *  - Deduplicated keywords
 *
 * @param {{
 *   title: string;
 *   description: string;
 *   keywords?: string[] | string;
 *   url: string;
 *   locale?: string;
 *   alternates?: Record<string, string>;
 *   image?: string;        // absolute URL or path for per-page OG image
 *   imageAlt?: string;     // alt text for the OG image
 * }} params
 */
export function buildCanonicalMetadata({
  title,
  description,
  keywords = [],
  url,
  locale = 'ar_SA',
  alternates = {},
  image,
  imageAlt,
}) {
  const normalizedKeywords = Array.isArray(keywords)
    ? Array.from(new Set(keywords.map(normalizeKeyword).filter(Boolean))).join(', ')
    : normalizeKeyword(keywords);

  // OG image: use provided image or fall back to the default branded image.
  // The root layout also sets og-default.png as fallback, but setting it
  // explicitly here ensures per-page metadata overrides are correct.
  const ogImage = image
    ? [{ url: image, alt: imageAlt || title, type: 'image/png' }]
    : undefined; // undefined = inherit from root layout (og-default.png)

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    keywords: normalizedKeywords,
    alternates: {
      canonical: url,
      ...alternates,
    },
    // Full robots directives — critical for Google Ads eligibility and ranking.
    // max-snippet:-1  → Google can show full text excerpts in search results (boosts CTR).
    // max-image-preview:large → Google can show large image previews (rich results).
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale,
      type: 'website',
      siteName: SITE_BRAND,
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
