/**
 * app/mwaqit-al-salat/[country]/page.jsx
 *
 * Country-level prayer times page.
 * Shows capital city prayers + grid of all cities.
 */

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getCountryBySlug, getPriorityCountrySlugs } from '@/lib/db/queries/countries';
import { getTopCitiesByCountry, getCapitalCity } from '@/lib/db/queries/cities';
import { getCountriesAction } from '@/app/actions/location';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import { getMethodByCountry } from '@/lib/prayer-methods';
import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCityWrapper.client';
import CityPrayerCardsGrid from '@/components/mwaqit/CityPrayerCardsGrid.client';
import MonthlyPrayerCalendar from '@/components/mwaqit/MonthlyPrayerCalendar.client';
import CalendarSeoBlock from '@/components/mwaqit/CalendarSeoBlock';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { getSiteUrl } from '@/lib/site-config';
import { formatGregorianLabel, getHijriMonthSpanFromDate } from '@/lib/hijri-utils';

const BASE = getSiteUrl();

export async function generateStaticParams() {
  const slugs = await getPriorityCountrySlugs(30);
  return slugs.map(slug => ({ country: slug }));
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return { title: 'مواقيت الصلاة' };

  const countryAr  = country.name_ar || country.name_en;
  const methodInfo = getMethodByCountry(country.country_code);
  const canonical  = `${BASE}/mwaqit-al-salat/${countrySlug}`;

  // Fetch capital to include in title — key for SEO: "مواقيت الصلاة في السعودية، الرياض"
  const capital = await getCapitalCity(country.country_code);
  const capitalAr = capital ? (capital.name_ar || capital.name_en) : null;

  // Title format: "مواقيت الصلاة في {البلد}، {العاصمة}"
  const titleSuffix = capitalAr ? `، ${capitalAr}` : '';
  const title = `مواقيت الصلاة في ${countryAr}${titleSuffix} اليوم — الفجر والمغرب والعصر`;
  const description = capitalAr
    ? `أوقات الصلاة الدقيقة في ${countryAr} — الفجر، الظهر، العصر، المغرب والعشاء في ${capitalAr} وكافة المدن. طريقة الحساب: ${methodInfo.label}. الشافعي والحنفي.`
    : `أوقات الصلاة الدقيقة لكافة مدن ${countryAr} اليوم. طريقة الحساب: ${methodInfo.label}. الشافعي والحنفي.`;

  return {
    title,
    description,
    keywords: [
      `مواقيت الصلاة ${countryAr}`,
      capitalAr ? `مواقيت الصلاة ${capitalAr}` : '',
      `أوقات الصلاة ${countryAr} اليوم`,
      `وقت الفجر ${countryAr}`,
      `وقت المغرب ${countryAr}`,
      capitalAr ? `وقت الفجر ${capitalAr}` : '',
      `أذان ${countryAr} اليوم`,
      `مواقيت الأذان ${countryAr}`,
      `prayer times ${country.name_en}`,
    ].filter(Boolean).join(', '),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type:   'website',
      locale: 'ar_SA',
      url:    canonical,
    },
  };
}


// ─── JSON-LD ──────────────────────────────────────────────────────────────────
function CountryPrayerJsonLd({ country, countryAr, countrySlug }) {
  const url = `${BASE}/mwaqit-al-salat/${countrySlug}`;
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    name:         `مواقيت الصلاة في ${countryAr}`,
    url,
    inLanguage:   'ar',
    description:  `أوقات الصلاة الدقيقة لجميع مدن ${countryAr} — الفجر والظهر والعصر والمغرب والعشاء`,
    about: {
      '@type':       'Country',
      name:          countryAr,
      alternateName: country.name_en,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ─── Prayer labels ────────────────────────────────────────────────────────────
const PRAYER_AR = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
};

const PRAYER_ICON = {
  fajr: '🌙', sunrise: '🌅', dhuhr: '☀️',
  asr: '🌇', maghrib: '🌆', isha: '🌃',
};

export default async function CountryPrayerPage({ params }) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const [cities, capital, allCountries] = await Promise.all([
    getTopCitiesByCountry(country.country_code, 120),
    getCapitalCity(country.country_code),
    getCountriesAction(),
  ]);

  const countryAr  = country.name_ar || country.name_en;
  const methodInfo = getMethodByCountry(country.country_code);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'مواقيت الصلاة', item: `${BASE}/mwaqit-al-salat` },
      { '@type': 'ListItem', position: 3, name: `مواقيت الصلاة في ${countryAr}`, item: `${BASE}/mwaqit-al-salat/${countrySlug}` },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `مواقيت الصلاة في ${countryAr} اليوم`,
    url: `${BASE}/mwaqit-al-salat/${countrySlug}`,
    description: `تعرف على مواقيت الصلاة في كافة مدن ${countryAr} اليوم. الفجر، الظهر، العصر، المغرب والعشاء بدقة عالية.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${BASE}/mwaqit-al-salat/${countrySlug}#breadcrumb` },
    about: {
      '@type': 'Country',
      name: country.name_en,
      alternateName: countryAr,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `كيف أجد مواقيت الصلاة في مدن ${countryAr}؟`,
        acceptedAnswer: { '@type': 'Answer', text: `تُقدم هذه الصفحة أوقات الصلاة الدقيقة للعاصمة وكافة مدن ${countryAr}. يمكنك اختيار مدينتك من القائمة لعرض أوقات الفجر والمغرب وبقية الصلوات بدقة عالية.` },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">

      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20">

        <CountryPrayerJsonLd country={country} countryAr={countryAr} countrySlug={countrySlug} />

        {/* Breadcrumb */}
        <nav aria-label="مسار التنقل" className="text-xs text-muted mb-8 flex items-center gap-1.5">
          <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          <span aria-hidden="true">›</span>
          <Link href="/mwaqit-al-salat" className="hover:text-accent transition-colors">مواقيت الصلاة</Link>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{countryAr}</span>
        </nav>

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            مواقيت الصلاة في <span className="text-accent">{countryAr}</span>
          </h1>
          <p className="text-muted text-base mb-3" style={{ margin: '10px auto' }}>
            اختر المدينة لعرض مواقيت الصلاة الدقيقة اليوم
          </p>
          {/* Method badge */}
          <span className="inline-flex items-center gap-1.5 text-xs bg-surface-2 border border-subtle px-3 py-1.5 rounded-full text-muted">
            <span>🕌</span>
            طريقة الحساب المعتمدة: <strong className="text-accent-alt">{methodInfo.label}</strong>
          </span>
        </header>

        <AdTopBanner slotId="top-country" />

        {/* Search */}
        <div className="mb-12">
          <SearchCity mode="mwaqit-al-salat" preloadedCountries={allCountries} />
        </div>

        {/* Capital city section */}
        {capital && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin size={22} className="text-accent" />
              أوقات الصلاة في العاصمة — <span className="text-accent">{capital.name_ar}</span>
            </h2>

            <ErrorBoundary>
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="h-72 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
                  <div className="h-64 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
                </div>
              }
            >
              <PrayerTimesContent
                country={countrySlug}
                city={capital.city_slug}
                cityData={capital}
                countryCode={country.country_code}
                countryNameAr={countryAr}
              />
            </Suspense>
            </ErrorBoundary>
          </section>
        )}

        <AdInArticle slotId="mid-country-1" />

        {/* All cities grid */}
        <section>
          <h2 className="text-xl font-bold mb-6">أبرز المدن في {countryAr}</h2>
          <CityPrayerCardsGrid
            cities={cities}
            countrySlug={countrySlug}
            countryCode={country.country_code}
          />
        </section>

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}

// ─── Dynamic content ──────────────────────────────────────────────────────────
async function PrayerTimesContent({ country, city, cityData, countryCode, countryNameAr }) {
  await headers();

  const now        = new Date();
  const methodInfo = getMethodByCountry(countryCode);

  const times = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: now,
    countryCode, cacheKey: `country::${country}::${city}`,
  });

  if (!times) {
    return <p className="text-danger text-center py-12">عذراً، تعذّر حساب أوقات الصلاة للعاصمة.</p>;
  }

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, now.toISOString());
  const todayLabel = now.toLocaleDateString('ar-EG-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      {/* Countdown hero */}
      <section className="card card--accent mb-6">
        <PrayerHeroClient
          nextPrayerKey={nextKey}
          nextPrayerIso={nextIso}
          prevPrayerIso={prevIso}
          timezone={cityData.timezone}
          method={methodInfo.name}
          countryCode={countryCode}
        />
      </section>

      {/* Prayer times list */}
      <section className="card mb-6" aria-label={`مواقيت الصلاة اليوم في ${cityData.name_ar}`}>
        <div className="card__header flex flex-wrap justify-between items-start gap-3">
          <div>
            <h3 className="card__title m-0 text-xl font-bold">مواقيت الصلاة اليوم</h3>
            <p className="text-[11px] text-muted mt-0.5">
              طريقة الحساب: <span className="text-accent-alt font-semibold">{methodInfo.label}</span>
            </p>
          </div>
          <span className="badge badge-accent">{todayLabel}</span>
        </div>

        <div className="flex flex-col" style={{ gap: '2px' }}>
          {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((key) => {
            const isoStr = times[key];
            if (!isoStr) return null;
            
            const isNext  = key === nextKey;
            const timeStr = formatTime(isoStr, cityData.timezone, false);
            
            return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg"
                  style={{
                    padding: 'var(--space-3) var(--space-2)',
                    background:  isNext ? 'var(--accent-soft)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{PRAYER_ICON[key] ?? '🕌'}</span>
                    {isNext && <span className="badge badge-accent text-xs">القادمة</span>}
                    <span style={{
                      color:      isNext ? 'var(--accent)' : 'var(--text-primary)',
                      fontWeight: 'var(--font-bold)',
                      fontSize:   'var(--text-base)',
                    }}>
                      {PRAYER_AR[key] ?? key}
                    </span>
                  </div>
                  <time dateTime={isoStr} dir="ltr" className="tabular-nums font-mono font-bold text-xl" style={{
                    color: isNext ? 'var(--accent)' : 'var(--text-primary)',
                  }}>
                    {timeStr}
                  </time>
                </div>
            );
          })}
        </div>
      </section>

      {/* Monthly calendar */}
      <section className="mb-6">
        <CalendarSeoBlock
          cityNameAr={cityData.name_ar || cityData.name_en}
          countryNameAr={countryNameAr}
          gregorianLabel={formatGregorianLabel(now)}
          hijriLabel={getHijriMonthSpanFromDate(now)}
          methodLabel={methodInfo.label}
        />
        <MonthlyPrayerCalendar
          lat={cityData.lat}
          lon={cityData.lon}
          timezone={cityData.timezone}
          cityNameAr={cityData.name_ar || cityData.name_en}
          countryCode={countryCode}
        />
      </section>
    </>
  );
}
