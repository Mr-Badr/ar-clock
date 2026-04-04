/**
 * app/time-now/[country]/[city]/page.jsx
 *
 * ROUTE: /time-now/egypt/cairo · /time-now/france/paris · /time-now/japan/tokyo …
 *
 * Next.js 15 patterns:
 *  - await params (params is a Promise in Next.js 15)
 *  - generateStaticParams → pre-builds top 120 priority cities at build time
 *  - dynamicParams = true → any unknown city renders on-demand, then cached
 *  - revalidate = 86400 → ISR daily (DST transitions, timezone DB updates)
 *
 * SEO sections per page:
 *  H1 → "الوقت الان في [city]، [country]"
 *  Live clock hero (client island)
 *  Cities in same country (internal linking)
 *  Timezone info card (server, zero JS)
 *  Same-timezone countries (server, zero JS)
 *  Dense FAQ (server, native <details>, FAQPage JSON-LD)
 *  Related searches (server, zero JS, internal links)
 *  SEO prose (server, visible keyword-rich copy for readers and crawlers)
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { ChevronLeft, MapPin } from 'lucide-react';


import TimeNowHero from '@/components/time-now/TimeNowHero';
import SearchCity from '@/components/SearchCityWrapper.client';
import CountryCitiesGrid from '@/components/time-now/CountryCitiesGrid';
import TimezoneInfoCard from '@/components/time-now/TimezoneInfoCard';
import SameTimezoneCountries from '@/components/time-now/SameTimezoneCountries';
import RelatedSearches from '@/components/time-now/RelatedSearches';

import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getPriorityCityParams, getCityBySlug, getTopCitiesByCountry } from '@/lib/db/queries/cities';
import { getCountriesAction } from '@/app/actions/location';
import { getCachedNowIso } from '@/lib/date-utils';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

/* ─── ROUTE CONFIG ──────────────────────────────────────────────── */
export const dynamicParams = true;


export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'morocco', city: 'casablanca' },
      { country: 'saudi-arabia', city: 'riyadh' },
      { country: 'egypt', city: 'cairo' },
    ];
  }
  return getPriorityCityParams(120);
}

function getUtcOffsetStr(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: timezone, timeZoneName: 'shortOffset',
    }).formatToParts(new Date('2025-06-01T12:00:00Z'));
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

/* ─── DYNAMIC METADATA ──────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return { title: 'الوقت الان' };
  const city = await getCityBySlug(country.country_code, citySlug);
  if (!city) return { title: 'الوقت الان' };

  const cityAr = city.name_ar || city.name_en;
  const countryAr = country.name_ar || country.name_en;
  const offset = getUtcOffsetStr(city.timezone);

  return {
    title: `الوقت الان في ${cityAr}، ${countryAr} — الساعة والتاريخ`,
    description: `الوقت الحالي في ${cityAr} بدقة حتى الثانية. الساعة الان في ${cityAr}، ${countryAr} — التاريخ اليوم الميلادي والهجري، المنطقة الزمنية ${offset}.`,
    keywords: [
      `الوقت الان في ${cityAr}`,
      `الساعة الان في ${cityAr}`,
      `الوقت الان في ${cityAr} اليوم`,
      `كم الساعة في ${cityAr}`,
      `الوقت الحالي في ${cityAr}`,
      `التاريخ اليوم في ${cityAr}`,
      `المنطقة الزمنية في ${cityAr}`,
      `توقيت ${cityAr}`,
      `الوقت الان في ${countryAr}`,
      `الساعة في ${countryAr}`,
      `${offset} توقيت`,
      `time in ${city.name_en}`,
      `${city.name_en} time now`,
      `current time ${city.name_en}`,
    ],
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `/time-now/${countrySlug}/${citySlug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: `${BASE}/time-now/${countrySlug}/${citySlug}`,
      siteName: SITE_BRAND,
      title: `الوقت الان في ${cityAr}، ${countryAr} | ${SITE_BRAND}`,
      description: `الساعة الحالية في ${cityAr} بدقة حتى الثانية. ${countryAr} · ${offset}.`,
      images: [{
        url: `${BASE}/time-now/${countrySlug}/${citySlug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `الوقت الان في ${cityAr}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `الوقت الان في ${cityAr}، ${countryAr}`,
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1 },
    },
  };
}

/* ─── PAGE ──────────────────────────────────────────────────────── */
export default async function CityTimePage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;

  /* Resolve city from Supabase */
  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();
  const city = await getCityBySlug(country.country_code, citySlug);
  if (!city) notFound();

  /* Parallel data fetching — all cached */
  const [nowIso, siblingCities, allCountries] = await Promise.all([
    getCachedNowIso(),
    getTopCitiesByCountry(country.country_code, 8),
    getCountriesAction(),
  ]);
  const sameOffsetCountries = []; // Skipped

  const cityAr = city.name_ar || city.name_en;
  const countryAr = country.name_ar || country.name_en;
  const offset = getUtcOffsetStr(city.timezone);

  /* ── JSON-LD SCHEMAS ─────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'الوقت الان', item: `${BASE}/time-now` },
      { '@type': 'ListItem', position: 3, name: `الوقت في ${countryAr}`, item: `${BASE}/time-now/${countrySlug}` },
      { '@type': 'ListItem', position: 4, name: `الوقت في ${cityAr}`, item: `${BASE}/time-now/${countrySlug}/${citySlug}` },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `الوقت الان في ${cityAr}، ${countryAr}`,
    url: `${BASE}/time-now/${countrySlug}/${citySlug}`,
    description: `الوقت الحالي في ${cityAr} بدقة حتى الثانية. ${countryAr} · ${offset}.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${BASE}/time-now/${countrySlug}/${citySlug}#breadcrumb` },
    mainEntity: {
      '@type': 'City',
      name: city.name_en,
      alternateName: cityAr,
      containedInPlace: {
        '@type': 'Country',
        name: country.name_en,
        alternateName: countryAr,
      },
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `ما هو الوقت الان في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `يُعرض الوقت الحالي في ${cityAr}، ${countryAr} في أعلى هذه الصفحة بدقة حتى الثانية. ${cityAr} تتبع المنطقة الزمنية ${city.timezone} وهي ${offset}.`,
        },
      },
      {
        '@type': 'Question',
        name: `ما هي المنطقة الزمنية في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${cityAr} تتبع المنطقة الزمنية ${city.timezone}، بتوقيت ${offset} من التوقيت العالمي المنسق (UTC).`,
        },
      },
      {
        '@type': 'Question',
        name: `كم الساعة الان في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `الساعة الحالية في ${cityAr} تظهر في أعلى الصفحة محدَّثةً تلقائياً كل ثانية. ${cityAr} تتبع ${offset}.`,
        },
      },
      {
        '@type': 'Question',
        name: `ما هو التاريخ اليوم في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `تعرض هذه الصفحة التاريخ اليوم في ${cityAr} بالتقويم الميلادي والهجري معاً، وفق المنطقة الزمنية ${city.timezone}.`,
        },
      },
    ],
  };

  /* ── RENDER ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>

        {/* ══ BREADCRUMB ══════════════════════════════════════════ */}
        <nav aria-label="مسار التنقل" className="container mx-auto px-4 pt-6 pb-2">
          <ol style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            flexWrap: 'wrap', margin: 0, padding: 0, listStyle: 'none',
            fontSize: 'var(--text-sm)', color: 'var(--text-muted)',
          }}>
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/time-now', label: 'الوقت الان' },
              { href: `/time-now/${countrySlug}`, label: countryAr },
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Link href={item.href} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                  className="hover:text-accent transition-colors">{item.label}</Link>
                <ChevronLeft size={12} style={{ rotate: '180deg', opacity: 0.5 }} aria-hidden />
              </li>
            ))}
            <li aria-current="page" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{cityAr}</li>
          </ol>
        </nav>

        {/* ══ HERO ════════════════════════════════════════════════ */}
        <section aria-labelledby="city-time-h1" className="container mx-auto px-4 py-8">

          <h1 id="city-time-h1"
            className="text-3xl md:text-5xl font-black mb-6 leading-tight text-center"
          >
            الوقت الان في{' '}
            <span className="text-accent">{cityAr}</span>
          </h1>


          {/* Geo banner */}
          <Suspense fallback={null}>
            <GeoBanner targetCountryCode={country.country_code} />
          </Suspense>

          {/* Global city search */}
          <div className="w-full max-w-xl mx-auto shadow-sm rounded-xl mb-4">
            <SearchCity mode="time-now" preloadedCountries={allCountries} />
          </div>

          {/* Live clock */}
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={
              <div style={{ height: '280px', borderRadius: '1rem', background: 'var(--bg-surface-2)', animation: 'pulse 2s ease-in-out infinite' }} aria-hidden />
            }>
              <TimeNowHero
                ianaTimezone={city.timezone}
                cityNameAr={cityAr}
                countryNameAr={countryAr}
                utcOffset={offset}
                tzLabel={city.timezone}
                countryCode={country.country_code}
              />
            </Suspense>
          </div>
        </section>

        {/* ══ OTHER CITIES IN THIS COUNTRY ════════════════════════ */}
        {siblingCities.length > 1 && (
          <section
            aria-labelledby="cities-grid-h2"
            className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 id="cities-grid-h2" className="text-2xl font-bold">
                🏙️ مدن {countryAr} الأخرى
              </h2>
              <Link href={`/time-now/${countrySlug}`}
                className="text-accent text-sm font-semibold hover:underline"
              >
                عرض الكل ←
              </Link>
            </div>
            <Suspense fallback={
              <div style={{ height: '160px', borderRadius: '1rem', background: 'var(--bg-surface-2)' }} aria-hidden />
            }>
              <CountryCitiesGrid
                cities={siblingCities.filter(c => c.city_slug !== citySlug)}
                countrySlug={countrySlug}
                activeCitySlug={citySlug}
              />
            </Suspense>
          </section>
        )}

        {/* ══ TIMEZONE INFO ════════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <TimezoneInfoCard
            ianaTimezone={city.timezone}
            countryAr={countryAr}
            cityAr={cityAr}
            utcOffset={offset}
            nowIso={nowIso}
          />
        </section>

        {/* ══ SAME TIMEZONE COUNTRIES ══════════════════════════════ */}
        {sameOffsetCountries.length > 0 && (
          <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
            <SameTimezoneCountries
              countries={sameOffsetCountries}
              utcOffset={offset}
              currentCityAr={cityAr}
            />
          </section>
        )}

        {/* ══ RELATED SEARCHES ═════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <RelatedSearches
            currentCountrySlug={countrySlug}
            currentCityAr={cityAr}
          />
        </section>

        {/* ══ SEO PROSE ════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-12 border-t border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto space-y-5"
            style={{ color: 'var(--text-muted)', lineHeight: '1.9', fontSize: 'var(--text-sm)' }}
          >
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              الوقت الان في {cityAr} — معلومات شاملة
            </h2>

            <p>
              <strong style={{ color: 'var(--text-primary)' }}>{cityAr}</strong> هي إحدى مدن{' '}
              <Link href={`/time-now/${countrySlug}`} className="text-accent hover:underline">{countryAr}</Link>،
              وتتبع المنطقة الزمنية <strong style={{ color: 'var(--text-primary)' }}>{city.timezone}</strong> وهي{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{offset}</strong> من التوقيت العالمي المنسق (UTC).
              يعرض هذا الموقع الوقت الحالي في {cityAr} بدقة حتى الثانية دون الحاجة إلى تحديث الصفحة.
            </p>

            <p>
              يتضمن عرض الوقت <strong style={{ color: 'var(--text-primary)' }}>التاريخ اليوم</strong> بالتقويم
              الميلادي والهجري (تقويم أم القرى)، فضلاً عن اسم اليوم بالعربية ورقم الأسبوع من السنة.
              يمكنك أيضاً تبديل المدينة بسهولة باستخدام خاصية البحث العالمي للحصول على وقت أي مدينة
              في العالم فوراً.
            </p>
            <p>
              تغطي الصفحة كذلك أكثر العبارات التي يكتبها المستخدمون عند البحث مثل
              {' '}
              <strong style={{ color: 'var(--text-primary)' }}>الوقت الان في {cityAr}</strong>
              {' '}و
              {' '}
              <strong style={{ color: 'var(--text-primary)' }}>كم الساعة في {cityAr}</strong>
              {' '}و
              {' '}
              <strong style={{ color: 'var(--text-primary)' }}>التاريخ اليوم في {cityAr}</strong>
              ، لكن بصياغة طبيعية ومحتوى ظاهر يشرح الوقت الفعلي والمنطقة الزمنية
              والروابط ذات الصلة داخل الموقع.
            </p>
          </div>
        </section>

      </main>
      <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
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
