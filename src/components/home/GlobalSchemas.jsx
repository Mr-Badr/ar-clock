/**
 * GlobalSchemas
 * Renders two JSON-LD <script> tags in the page's <body>:
 *
 *  1. WebSite schema  — enables Google Sitelinks Searchbox in search results
 *  2. Organization schema — sends E-E-A-T authority signals (name, areaServed,
 *     knowsAbout) that help Google understand the site's topic relevance.
 *
 * Placed once in HomeSections/index.jsx (rendered server-side, no JS bundle).
 * TODO: Replace 'https://waqt.app' with the real production domain.
 */
export default function GlobalSchemas() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'وقت عربي',
    alternateName: ['Arabic Time', 'مواقيت الصلاة', 'أوقات الصلاة'],
    description: 'بوابة شاملة لمواقيت الصلاة، فرق التوقيت، والمناسبات الدينية والوطنية',
    inLanguage: 'ar',
    url: 'https://waqt.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://waqt.app/time-now?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'وقت عربي',
    url: 'https://waqt.app',
    description:
      'موقع متخصص في عرض مواقيت الصلاة الدقيقة وفروق التوقيت والمناسبات الدينية',
    areaServed: [
      'SA', 'AE', 'EG', 'IQ', 'KW', 'QA', 'JO', 'LB',
      'MA', 'DZ', 'TN', 'LY', 'SD', 'SY', 'YE', 'OM', 'BH', 'MR',
    ],
    knowsAbout: [
      'مواقيت الصلاة',
      'أوقات الصلاة الإسلامية',
      'فرق التوقيت',
      'التقويم الهجري',
      'اتجاه القبلة',
    ],
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
