import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

/**
 * GlobalSchemas — Time-difference page
 * WebPage + BreadcrumbList JSON-LD.
 */
export default function TimeDiffGlobalSchemas() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type':    'WebPage',
    name:       'حاسبة فرق التوقيت بين المدن والدول',
    description:
      'احسب فرق التوقيت بالساعة والدقيقة بين أي مدينتين أو دولتين في العالم مع مراعاة التوقيت الصيفي DST تلقائياً',
    inLanguage: 'ar',
    url:        `${SITE_URL}/time-difference`,
    isPartOf:   { '@type': 'WebSite', url: SITE_URL },
    about: [
      { '@type': 'Thing', name: 'فرق التوقيت' },
      { '@type': 'Thing', name: 'المناطق الزمنية' },
      { '@type': 'Thing', name: 'توقيت غرينتش GMT' },
      { '@type': 'Thing', name: 'UTC' },
      { '@type': 'Thing', name: 'التوقيت الصيفي DST' },
      { '@type': 'Thing', name: 'حاسبة الوقت' },
    ],
  }

  const breadcrumbSchema = {
    '@context':       'https://schema.org',
    '@type':          'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية',    item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'فرق التوقيت', item: `${SITE_URL}/time-difference` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  )
}
