/**
 * GlobalSchemas
 * Renders two JSON-LD <script> tags in the page's <body>:
 *
 *  1. WebSite schema  — enables Google Sitelinks Searchbox in search results
 *  2. Organization schema — sends E-E-A-T authority signals (name, areaServed,
 *     knowsAbout) that help Google understand the site's topic relevance.
 *
 */
import {
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_SCHEMA_TOPICS,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export default function GlobalSchemas() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_BRAND,
    alternateName: ['Miqat', 'الوقت الآن', 'مواقيت الصلاة', 'فرق التوقيت', 'التاريخ الهجري'],
    description: SITE_DESCRIPTION,
    inLanguage: 'ar',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/time-now?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_BRAND,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: [
      'SA', 'AE', 'EG', 'IQ', 'KW', 'QA', 'JO', 'LB',
      'MA', 'DZ', 'TN', 'LY', 'SD', 'SY', 'YE', 'OM', 'BH', 'MR',
    ],
    knowsAbout: SITE_SCHEMA_TOPICS,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  )
}
