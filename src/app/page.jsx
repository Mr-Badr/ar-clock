// app/page.jsx

import { Suspense } from 'react';
import HomeSections from '@/components/home';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import TimeCinematicHero from '@/components/hero/TimeCinematicHero';
import { headers } from 'next/headers';
import { resolveRequestLocationFromHeaders } from '@/lib/locationService';
import { getCountryByCode } from '@/lib/db/queries/countries';
import {
  SITE_BRAND,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_HOME_TITLE,
  SITE_KEYWORDS,
  SITE_SCHEMA_TOPICS,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: SITE_HOME_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  url: SITE_URL,
});

async function getHomeHeroLocation() {
  const hdrs = await headers();
  const timezone = hdrs.get('x-vercel-ip-timezone') ?? '';
  const countryCode = hdrs.get('x-vercel-ip-country') ?? '';

  let countryNameAr = '';
  if (countryCode) {
    const country = await getCountryByCode(countryCode).catch(() => null);
    countryNameAr = country?.name_ar || country?.name_en || '';
  }

  const matchedCity = await resolveRequestLocationFromHeaders(hdrs).catch(() => null);

  return {
    ianaTimezone: matchedCity?.timezone || timezone || undefined,
    cityNameAr: matchedCity?.city_name_ar || matchedCity?.name_ar || '',
    countryNameAr: matchedCity?.country_name_ar || countryNameAr || '',
    countryCode: matchedCity?.country_code || countryCode || '',
  };
}

async function PersonalizedTimeHero() {
  const heroLocation = await getHomeHeroLocation();
  return <TimeCinematicHero {...heroLocation} />;
}

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_BRAND,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
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
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: SITE_DESCRIPTION,
    knowsAbout: SITE_SCHEMA_TOPICS,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_CONTACT_EMAIL,
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
        <Suspense fallback={<TimeCinematicHero cityNameAr="توقيتك المحلي" />}>
          <PersonalizedTimeHero />
        </Suspense>

        <HomeSections className="container-col" />
      </main>
    </div>
  );
}
