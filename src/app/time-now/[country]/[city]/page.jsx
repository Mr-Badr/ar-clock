/**
 * app/time-now/[country]/[city]/page.jsx
 *
 * ROUTE: /time-now/egypt/cairo · /time-now/france/paris · /time-now/japan/tokyo …
 *
 * Next.js 15 patterns:
 *  - await params (params is a Promise in Next.js 15)
 *  - generateStaticParams → pre-builds top priority cities at build time
 *  - any unknown city renders on-demand by default, then cached
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
import { ChevronLeft } from 'lucide-react';


import TimeNowHero from '@/components/time-now/TimeNowHero';
import SearchCity from '@/components/SearchCityWrapper.client';
import CountryCitiesGrid from '@/components/time-now/CountryCitiesGrid';
import TimezoneInfoCard from '@/components/time-now/TimezoneInfoCard';
import SameTimezoneCountries from '@/components/time-now/SameTimezoneCountries';
import TimeNowFAQ from '@/components/time-now/TimeNowFAQ';
import RelatedSearches from '@/components/time-now/RelatedSearches';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';

import { getAllCountries, getCountryBySlug } from '@/lib/db/queries/countries';
import { getPriorityCityParams, getCityBySlug, getTopCitiesByCountry } from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCityParams,
} from '@/lib/seo/country-indexing';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { buildTimeNowKeywords } from '@/lib/seo/section-search-intent';
import {
  buildCityTimeNowFaqItems,
  getCountriesSharingCurrentOffset,
  getTimeNowSeoFacts,
} from '@/lib/time-now-content';

const BASE = getSiteUrl();

/* ─── ROUTE CONFIG ──────────────────────────────────────────────── */

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'morocco', city: 'casablanca' },
      { country: 'saudi-arabia', city: 'riyadh' },
      { country: 'egypt', city: 'cairo' },
    ];
  }
  return getPriorityCityParams(24);
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
  const policy = GEO_ROUTE_INDEXING_POLICIES.timeNow;
  const isIndexableCity = isSeoIndexableCityParams(
    { country: countrySlug, city: citySlug },
    { countryScope: policy.countryScope, cityScope: policy.cityScope },
  );

  return {
    title: `كم الساعة الآن في ${cityAr}؟ | التوقيت المحلي والتاريخ اليوم`,
    description: `اعرف فوراً الساعة الآن في ${cityAr} مع تاريخ اليوم والمنطقة الزمنية ${offset} وروابط الصلاة وفرق التوقيت والوقت في بقية مدن ${countryAr}.`,
    keywords: buildTimeNowKeywords({
      countryAr,
      countryEn: country.name_en,
      cityAr,
      cityEn: city.name_en,
      timezone: city.timezone,
      utcOffset: offset,
    }),
    metadataBase: new URL(BASE),
    alternates: {
      canonical: `/time-now/${countrySlug}/${citySlug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: `${BASE}/time-now/${countrySlug}/${citySlug}`,
      siteName: SITE_BRAND,
      title: `كم الساعة الآن في ${cityAr}؟ | ${countryAr} اليوم`,
      description: `اعرف الساعة الحالية في ${cityAr} مع تاريخ اليوم والتوقيت المحلي ${offset}.`,
      images: [{
        url: `${BASE}/time-now/${countrySlug}/${citySlug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `الوقت الان في ${cityAr}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `كم الساعة الآن في ${cityAr}؟ | التوقيت المحلي`,
      description: `اعرف الساعة الحالية في ${cityAr} مع تاريخ اليوم والمنطقة الزمنية ${offset}.`,
      images: [`${BASE}/time-now/${countrySlug}/${citySlug}/opengraph-image`],
    },
    robots: {
      index: isIndexableCity,
      follow: true,
      googleBot: {
        index: isIndexableCity,
        follow: true,
        'max-snippet': -1,
      },
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
    getAllCountries(),
  ]);

  const cityAr = city.name_ar || city.name_en;
  const countryAr = country.name_ar || country.name_en;
  const offset = getUtcOffsetStr(city.timezone);
  const timeFacts = getTimeNowSeoFacts({
    timezone: city.timezone,
    utcOffset: offset,
    referenceDateOrIso: nowIso,
    placeAr: cityAr,
  });
  const sameOffsetCountries = getCountriesSharingCurrentOffset(allCountries, {
    referenceTimezone: city.timezone,
    referenceDateOrIso: nowIso,
    excludeCountrySlug: countrySlug,
  });
  const faqItems = buildCityTimeNowFaqItems({
    countryAr,
    cityAr,
    timezone: city.timezone,
    utcOffset: offset,
    referenceDateOrIso: nowIso,
  });
  const relatedOffsetCountriesText = sameOffsetCountries
    .slice(0, 3)
    .map((entry) => entry.country_name_ar || entry.country_name_en)
    .filter(Boolean)
    .join('، ');
  const cityUtilityLinks = [
    {
      href: `/mwaqit-al-salat/${countrySlug}/${citySlug}`,
      label: `مواقيت الصلاة في ${cityAr}`,
      description: `صفحة أوقات الصلاة اليوم في ${cityAr} مع الفجر والظهر والعصر والمغرب والعشاء.`,
    },
    {
      href: `/time-now/${countrySlug}`,
      label: `الوقت الان في ${countryAr}`,
      description: `استكشف العاصمة والمدن الكبرى الأخرى داخل ${countryAr} من صفحة الدولة الأساسية.`,
    },
    {
      href: `/date/country/${countrySlug}`,
      label: `التاريخ اليوم في ${countryAr}`,
      description: `اعرف التاريخ الهجري والميلادي اليوم في ${countryAr} مع الروابط المرتبطة بالدولة.`,
    },
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: `قارن توقيت ${cityAr} مع أي مدينة أخرى بسرعة داخل أداة فرق التوقيت.`,
    },
  ];

  /* ── JSON-LD SCHEMAS ─────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${BASE}/time-now/${countrySlug}/${citySlug}#breadcrumb`,
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
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
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
            كم الساعة الآن في{' '}
            <span className="text-accent">{cityAr}</span>
            ؟
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            اعرف الوقت الحالي في {cityAr}، {countryAr} مع تاريخ اليوم والمنطقة الزمنية {offset} وروابط الصلاة وفرق التوقيت من نفس الصفحة.
          </p>


          {/* Global city search */}
          <div className="w-full max-w-xl mx-auto shadow-sm rounded-xl mb-4">
            <SearchCity mode="time-now" />
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
              utcOffset={timeFacts.offsetLabel}
              currentCityAr={cityAr}
            />
          </section>
        )}

        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto">
            <TimeNowFAQ
              placeLabelAr={cityAr}
              introText={`إجابات عملية حول الوقت المحلي في ${cityAr}، التاريخ اليوم، والتوقيت الصيفي داخل ${countryAr}.`}
              items={faqItems}
            />
          </div>
        </section>

        {/* ══ RELATED SEARCHES ═════════════════════════════════════ */}
        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <RelatedSearches
            currentCountrySlug={countrySlug}
            currentCityAr={cityAr}
          />
        </section>

        <section className="container mx-auto px-4 py-8 border-t border-[var(--border-subtle)]">
          <GeoInternalLinks
            title={`روابط مفيدة لمدينة ${cityAr}`}
            description={`إذا كنت تتابع الوقت في ${cityAr} فهذه الروابط تقودك مباشرة إلى الصلاة والتاريخ وصفحة ${countryAr} وأداة فرق التوقيت دون بحث إضافي.`}
            links={cityUtilityLinks}
            ariaLabel={`روابط مفيدة لمدينة ${cityAr}`}
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
              {` ${timeFacts.utcRelationSentence}`} ويعرض هذا الموقع الوقت الحالي في {cityAr} بدقة حتى الثانية دون الحاجة إلى تحديث الصفحة.
            </p>

            <p>
              {timeFacts.gregorianDateAr ? (
                <>
                  التاريخ المحلي اليوم في {cityAr} هو{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{timeFacts.gregorianDateAr}</strong>
                  {timeFacts.hijriDateAr ? (
                    <>
                      {' '}وبالهجري{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{timeFacts.hijriDateAr}</strong>.
                    </>
                  ) : '.'}
                </>
              ) : (
                <>
                  يتضمن عرض الوقت <strong style={{ color: 'var(--text-primary)' }}>التاريخ اليوم</strong> بالتقويم
                  الميلادي والهجري (تقويم أم القرى) وفق المنطقة الزمنية المحلية.
                </>
              )}{' '}
              كما يوضح قسم معلومات المنطقة الزمنية ما إذا كانت الإزاحة ثابتة طوال السنة أو تتغير بين الشتاء والصيف.
            </p>
            <p>
              تجد في الصفحة أيضاً روابط إلى مدن أخرى داخل {countryAr}
              {relatedOffsetCountriesText ? `، وإلى دول تشترك اليوم في نفس الإزاحة مثل ${relatedOffsetCountriesText}` : ''}
              . هذا يجعل الصفحة مفيدة للتخطيط للمكالمات والسفر ومتابعة الوقت المحلي، لا مجرد سطر ساعة معزول.
            </p>
          </div>
        </section>

      </main>
      <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
    </div>
  );
}
