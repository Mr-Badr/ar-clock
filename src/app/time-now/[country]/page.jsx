/**
 * app/time-now/[country]/page.jsx
 *
 * ROUTE: /time-now/egypt → /time-now/saudi-arabia → /time-now/france …
 *
 * Next.js 15 patterns used:
 *  - params is a Promise → await params
 *  - generateStaticParams → top countries pre-built at build time
 *  - any unknown country renders on-demand by default, then cached
 *  - revalidate = 86400 → pages rebuilt once per day (DST changes etc.)
 *  - unstable_cache() in lib/city-resolver for Supabase queries
 *
 * SEO:
 *  - generateMetadata → dynamic title/description/keywords per country
 *  - JSON-LD: WebPage + FAQPage + BreadcrumbList
 *  - hreflang for all Arab-country locales on the generic page
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';


import TimeNowHero from '@/components/time-now/TimeNowHero';
import SearchCity from '@/components/SearchCityWrapper.client';
import CountryCitiesGrid from '@/components/time-now/CountryCitiesGrid';
import TimezoneInfoCard from '@/components/time-now/TimezoneInfoCard';
import SameTimezoneCountries from '@/components/time-now/SameTimezoneCountries';
import TimeNowFAQ from '@/components/time-now/TimeNowFAQ';
import RelatedSearches from '@/components/time-now/RelatedSearches';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import {
  getPriorityCountrySlugs,
  getCountryBySlug,
} from '@/lib/db/queries/countries';

import {
  getTopCitiesByCountry,
  getCapitalCity,
} from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { buildTimeNowKeywords } from '@/lib/seo/section-search-intent';

const BASE = getSiteUrl();

/* ── ROUTE CONFIG ────────────────────────────────────────────────── */

/* ── PRE-BUILD TOP COUNTRIES ─────────────────────────────────────── */
export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'morocco' },
      { country: 'saudi-arabia' },
      { country: 'egypt' },
    ];
  }
  const slugs = await getPriorityCountrySlugs(24);
  return slugs.map(slug => ({ country: slug }));
}

function getUtcOffsetStr(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: timezone, timeZoneName: 'shortOffset',
    }).formatToParts(new Date('2025-06-01T12:00:00Z'));
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

/* ── DYNAMIC METADATA ────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return { title: 'الوقت الان' };

  const capital = await getCapitalCity(country.country_code);

  const countryAr = country.name_ar;
  const cityAr = capital ? capital.name_ar : countryAr;
  const timezone = capital ? capital.timezone : country.timezone;
  const offset = getUtcOffsetStr(timezone);

  return {
    title: `الوقت الان في ${countryAr} — الساعة والتاريخ في ${cityAr}`,
    description: `اعرف الوقت الان في ${countryAr} بدقة حتى الثانية. الساعة الحالية في ${cityAr} مع التاريخ اليوم الميلادي والهجري، المنطقة الزمنية ${offset}.`,
    keywords: buildTimeNowKeywords({
      countryAr,
      countryEn: country.name_en,
      cityAr,
      cityEn: capital?.name_en,
      timezone,
      utcOffset: offset,
    }),
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `/time-now/${countrySlug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: `${BASE}/time-now/${countrySlug}`,
      siteName: SITE_BRAND,
      title: `الوقت الان في ${countryAr} — ${cityAr} | ${SITE_BRAND}`,
      description: `الساعة الحالية في ${countryAr} مع التاريخ الميلادي والهجري. ${offset}.`,
      images: [{
        url: `${BASE}/time-now/${countrySlug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `الوقت الان في ${countryAr}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `الوقت الان في ${countryAr}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  };
}

/* ── PAGE ────────────────────────────────────────────────────────── */
export default async function CountryTimePage({ params }) {
  const { country: countrySlug } = await params;

  /* Fetch country and capital from DB */
  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();
  const capital = await getCapitalCity(country.country_code);
  const timezone = capital ? capital.timezone : country.timezone;

  /* Fetch supporting data */
  const [cities, nowIso] = await Promise.all([
    getTopCitiesByCountry(country.country_code, 30),
    getCachedNowIso(),
  ]);
  const sameOffsetCountries = []; // We won't fetch this as it requires another query, skip for migration simplicity if not in plan

  const countryAr = country.name_ar;
  const cityAr = capital ? capital.name_ar : countryAr;
  const cityEn = capital ? capital.name_en : '';
  const countryEn = country.name_en || '';
  const utcOffset = getUtcOffsetStr(timezone);
  const countryUtilityLinks = [
    {
      href: `/mwaqit-al-salat/${countrySlug}`,
      label: `مواقيت الصلاة في ${countryAr}`,
      description: `صفحة مواقيت الصلاة في ${countryAr} مع العاصمة وأبرز المدن وروابط داخلية قابلة للفهرسة.`,
    },
    {
      href: `/date/country/${countrySlug}`,
      label: `التاريخ اليوم في ${countryAr}`,
      description: `اعرف التاريخ الهجري والميلادي اليوم في ${countryAr} بالطريقة الرسمية المعتمدة.`,
    },
    capital ? {
      href: `/time-now/${countrySlug}/${capital.city_slug}`,
      label: `الوقت الان في ${cityAr}`,
      description: `انتقل مباشرة إلى صفحة العاصمة للحصول على الساعة الحالية والتاريخ والمنطقة الزمنية.`,
    } : null,
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: `قارن توقيت ${countryAr} مع أي دولة أو مدينة أخرى من نفس الموقع.`,
    },
  ].filter(Boolean);

  /* ── JSON-LD ─────────────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${BASE}/time-now/${countrySlug}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'الوقت الان', item: `${BASE}/time-now` },
      { '@type': 'ListItem', position: 3, name: `الوقت في ${countryAr}`, item: `${BASE}/time-now/${countrySlug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `ما هو الوقت الان في ${countryAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `الوقت الحالي في ${countryAr} يُعرض في هذه الصفحة بدقة حتى الثانية. ${countryAr} تتبع المنطقة الزمنية ${timezone} وهي ${utcOffset}.`,
        },
      },
      {
        '@type': 'Question',
        name: `ما هي المنطقة الزمنية في ${countryAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${countryAr} تتبع المنطقة الزمنية ${timezone}، وهي ${utcOffset} من التوقيت العالمي (UTC).`,
        },
      },
      {
        '@type': 'Question',
        name: `كم الساعة الان في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `الساعة الحالية في ${cityAr} تُعرض في أعلى هذه الصفحة بدقة حتى الثانية، مزامَنةً تلقائياً مع ${timezone}.`,
        },
      },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `الوقت الآن في ${countryAr}`,
    url: `${BASE}/time-now/${countrySlug}`,
    description: `اعرف الوقت الآن في ${countryAr} بدقة حتى الثانية. الساعة الحالية في ${cityAr} مع التاريخ اليوم الميلادي والهجري.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${BASE}/time-now/${countrySlug}#breadcrumb` },
    about: {
      '@type': 'Country',
      name: country.name_en,
      alternateName: countryAr,
    },
  };
  const cityItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `مدن ${countryAr} في قسم الوقت الآن`,
    itemListElement: cities.slice(0, 30).map((cityItem, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cityItem.name_ar || cityItem.name_en,
      url: `${BASE}/time-now/${countrySlug}/${cityItem.city_slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        {/* ── BREADCRUMB ── */}
        <nav
          aria-label="مسار التنقل"
          className="container mx-auto px-4 pt-6 pb-2"
        >
          <ol style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap', margin: 0, padding: 0, listStyle: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <li><Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-accent transition-colors">الرئيسية</Link></li>
            <li aria-hidden><ChevronLeft size={13} style={{ rotate: '180deg' }} /></li>
            <li><Link href="/time-now" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-accent transition-colors">الوقت الان</Link></li>
            <li aria-hidden><ChevronLeft size={13} style={{ rotate: '180deg' }} /></li>
            <li aria-current="page" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{countryAr}</li>
          </ol>
        </nav>

        {/* ── HERO SECTION ── */}
        <section aria-labelledby="country-time-heading" className="container mx-auto px-4 py-8">
          <h1 id="country-time-heading" className="text-3xl md:text-5xl font-black mb-6 leading-tight text-center">
            الوقت الان في <span className="text-accent">{countryAr}</span>
          </h1>

          {/* City Search */}
          <div className="w-full max-w-xl mx-auto shadow-sm rounded-xl mb-4">
            <SearchCity mode="time-now" />
          </div>

          {/* Live Clock */}
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<div style={{ height: '280px', borderRadius: '1rem', background: 'var(--bg-surface-2)' }} aria-hidden />}>
              <TimeNowHero
                ianaTimezone={timezone}
                cityNameAr={cityAr}
                countryNameAr={countryAr}
                countryCode={country.country_code}
              />
            </Suspense>
          </div>
        </section>

        {/* ── CITIES GRID ── */}
        {cities.length > 1 && (
          <section aria-labelledby="cities-grid-heading" className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
            <h2 id="cities-grid-heading" className="text-2xl font-bold mb-6">
              🏙️ الوقت الان في مدن {countryAr}
            </h2>
            <Suspense fallback={<div style={{ height: '160px', borderRadius: '1rem', background: 'var(--bg-surface-2)' }} aria-hidden />}>
              <CountryCitiesGrid cities={cities} countrySlug={countrySlug} />
            </Suspense>
          </section>
        )}

        {/* ── TIMEZONE INFO ── */}
        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <Suspense fallback={null}>
            <TimezoneInfoCard
              ianaTimezone={timezone}
              countryAr={countryAr}
              utcOffset={utcOffset}
              nowIso={nowIso}
            />
          </Suspense>
        </section>

        {/* ── SAME TIMEZONE ── */}
        {sameOffsetCountries.length > 0 && (
          <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
            <SameTimezoneCountries countries={sameOffsetCountries} utcOffset={utcOffset} />
          </section>
        )}

        {/* ── FAQ ── */}
        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto">
            <TimeNowFAQ
              countryAr={countryAr}
              cityAr={cityAr}
              utcOffset={utcOffset}
              timezone={timezone}
              cityNameEn={cityEn}
              countryNameEn={countryEn}
            />
          </div>
        </section>

        {/* ── RELATED SEARCHES ── */}
        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <RelatedSearches currentCountrySlug={countrySlug} />
        </section>

        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <GeoInternalLinks
            title={`روابط مهمة عن ${countryAr}`}
            description={`هذه الروابط تقوي الربط الداخلي بين صفحات الوقت، الصلاة، والتاريخ الخاصة بـ${countryAr} وتساعد المستخدم ومحركات البحث على اكتشاف الصفحات الأقرب للنية البحثية.`}
            links={countryUtilityLinks}
            ariaLabel={`روابط مهمة عن ${countryAr}`}
          />
        </section>

        {/* ── SEO PROSE ── */}
        <section className="container mx-auto px-4 py-12 border-t border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto prose prose-invert text-muted leading-loose space-y-5">
            <h2 className="text-2xl font-bold text-primary">
              توقيت {countryAr} — معلومات شاملة
            </h2>
            <p>
              تتبع <strong>{countryAr}</strong> المنطقة الزمنية{' '}
              <strong>{timezone}</strong> وهي{' '}
              <strong>{utcOffset}</strong> من التوقيت العالمي المنسق (UTC).
              {' '}يعرض هذا الموقع الوقت الحالي في {countryAr} بدقة حتى الثانية،
              محدَّثاً تلقائياً دون الحاجة إلى تحديث الصفحة.
            </p>
            <p>
              بالإضافة إلى الوقت، تجد هنا <strong>التاريخ اليوم</strong> بالتقويم الميلادي
              والهجري (تقويم أم القرى)، وأوقات أهم مدن {countryAr}، وفرق التوقيت مع
              الدول الأخرى.
            </p>
            <p>
              صُممت هذه الصفحة لتجيب مباشرة عن صيغ البحث الشائعة مثل
              {' '}
              <strong>الوقت الان في {countryAr}</strong>
              {' '}و
              {' '}
              <strong>كم الساعة في {countryAr}</strong>
              {' '}و
              {' '}
              <strong>التاريخ اليوم في {countryAr}</strong>
              ، مع محتوى ظاهر يربط بين الدولة والعاصمة والمدن الكبرى ليسهّل الفهم
              والفهرسة والزحف الداخلي.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
