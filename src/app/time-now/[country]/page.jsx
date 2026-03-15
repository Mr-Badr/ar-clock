/**
 * app/time-now/[country]/page.jsx
 *
 * ROUTE: /time-now/egypt → /time-now/saudi-arabia → /time-now/france …
 *
 * Next.js 15 patterns used:
 *  - params is a Promise → await params
 *  - generateStaticParams → top 200 countries pre-built at build time
 *  - dynamicParams = true → any unknown country renders on-demand, cached
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
import { headers } from 'next/headers';
import { MapPin, Clock, ChevronLeft } from 'lucide-react';


import TimeNowHero from '@/components/time-now/TimeNowHero';
import SearchCity from '@/components/SearchCityWrapper.client';
import CountryCitiesGrid from '@/components/time-now/CountryCitiesGrid';
import TimezoneInfoCard from '@/components/time-now/TimezoneInfoCard';
import SameTimezoneCountries from '@/components/time-now/SameTimezoneCountries';
import TimeNowFAQ from '@/components/time-now/TimeNowFAQ';
import RelatedSearches from '@/components/time-now/RelatedSearches';
import {
  getAllCountrySlugs,
  getCountryBySlug,
} from '@/lib/db/queries/countries';

import {
  getTopCitiesByCountry,
  getCapitalCity,
} from '@/lib/db/queries/cities';
import { getCountriesAction } from '@/app/actions/location';
import { getCachedNowIso } from '@/lib/date-utils';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

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
  const slugs = await getAllCountrySlugs();
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
    title: `الوقت الان في ${countryAr} — الساعة والتاريخ في ${cityAr} | ساعة عربية`,
    description: `اعرف الوقت الان في ${countryAr} بدقة حتى الثانية. الساعة الحالية في ${cityAr} مع التاريخ اليوم الميلادي والهجري، المنطقة الزمنية ${offset}.`,
    keywords: [
      `الوقت الان في ${countryAr}`,
      `الساعة الان في ${countryAr}`,
      `كم الساعة في ${countryAr}`,
      `الوقت الحالي في ${countryAr}`,
      `الوقت الان في ${cityAr}`,
      `الساعة في ${cityAr}`,
      `توقيت ${countryAr}`,
      `المنطقة الزمنية ${countryAr}`,
      `التاريخ اليوم في ${countryAr}`,
      `ساعة ${countryAr}`,
      `time in ${country.name_en}`,
      `current time ${country.name_en}`,
      `${country.name_en} time`,
    ],
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `/time-now/${countrySlug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: `${BASE}/time-now/${countrySlug}`,
      siteName: 'ساعة عربية',
      title: `الوقت الان في ${countryAr} — ${cityAr} | ساعة عربية`,
      description: `الساعة الحالية في ${countryAr} مع التاريخ الميلادي والهجري. ${offset}.`,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `الوقت الان في ${countryAr}`,
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
  const [cities, nowIso, allCountries] = await Promise.all([
    getTopCitiesByCountry(country.country_code, 30),
    getCachedNowIso(),
    getCountriesAction(),
  ]);
  const sameOffsetCountries = []; // We won't fetch this as it requires another query, skip for migration simplicity if not in plan

  const countryAr = country.name_ar;
  const cityAr = capital ? capital.name_ar : countryAr;
  const cityEn = capital ? capital.name_en : '';
  const countryEn = country.name_en || '';
  const utcOffset = getUtcOffsetStr(timezone);

  /* ── JSON-LD ─────────────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

          {/* Geo-detection banner */}
          <Suspense fallback={null}>
            <GeoBanner targetCountryCode={country.country_code} />
          </Suspense>

          {/* City Search */}
          <div className="w-full max-w-xl mx-auto shadow-sm rounded-xl mb-4">
            <SearchCity mode="time-now" preloadedCountries={allCountries} />
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
          <RelatedSearches currentCountrySlug={countrySlug} currentCountryAr={countryAr} />
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
            {/* Hidden keyword list for crawlers */}
            <ul aria-hidden="true" style={{ display: 'none' }}>
              <li>الوقت الان في {countryAr}</li>
              <li>الساعة الان في {countryAr}</li>
              <li>كم الساعة في {countryAr}</li>
              <li>الوقت الحالي في {countryAr}</li>
              <li>الوقت الان في {cityAr}</li>
              <li>الساعة في {cityAr}</li>
              <li>توقيت {countryAr} الان</li>
              <li>المنطقة الزمنية في {countryAr}</li>
              <li>time in {countryEn}</li>
              <li>current time {countryEn}</li>
              <li>{cityEn} time now</li>
              <li>what time is it in {countryEn}</li>
              <li>clock {countryEn}</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-subtle)] text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="text-accent" size={20} aria-hidden />
          <span className="text-lg font-bold">ساعة عربية</span>
        </div>
        <p className="text-muted text-sm">© 2025 جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

async function GeoBanner({ targetCountryCode }) {
  const hdrs = await headers();
  const userCountryCode = hdrs.get('x-vercel-ip-country') || null;

  if (userCountryCode === targetCountryCode) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        margin: '0 auto 1.5rem', padding: '0.5rem 1.25rem',
        borderRadius: '999px', width: 'fit-content',
        background: 'var(--success-soft)', border: '1px solid var(--success-border)',
        fontSize: 'var(--text-sm)', color: 'var(--success)', fontWeight: '600',
      }}>
        <MapPin size={14} aria-hidden /> تم اكتشاف موقعك تلقائياً
      </div>
    );
  }
  return null;
}