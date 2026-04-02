import Link from 'next/link';

import HomeSections from '@/components/home';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, SITE_DESCRIPTION, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'الوقت الآن ومواقيت الصلاة وعداد المناسبات',
  description:
    'منصة عربية لمتابعة الوقت الحالي، مواقيت الصلاة، فرق التوقيت، وعداد المناسبات بصفحات سريعة ومهيأة لمحركات البحث.',
  keywords: [
    'الوقت الآن',
    'مواقيت الصلاة',
    'فرق التوقيت',
    'عداد المناسبات',
    'التاريخ الهجري',
    'التاريخ الميلادي',
  ],
  url: SITE_URL,
});

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_BRAND,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/holidays?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'mr.elharchali@gmail.com',
        availableLanguage: ['ar'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <main>
        <section className="container mx-auto px-4 text-center mb-16">
          <div className="section card-nested" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>
              الوقت الآن في مدينتك
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>
              اعرف توقيت مدينتك بدقة لحظية وانتقل مباشرة إلى صفحات الوقت، المواقيت، والمناسبات.
            </p>
            <Link href="/time-now" className="btn btn-primary">
              افتح صفحة الوقت الآن
            </Link>
          </div>
        </section>

        <HomeSections className="container-col" />
      </main>
    </div>
  );
}
