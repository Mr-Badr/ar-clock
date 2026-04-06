/**
 * app/mwaqit-al-salat/[country]/[city]/page.jsx
 *
 * ARCHITECTURE:
 *  - Page shell (static, ISR-cached): renders header, breadcrumb, search.
 *  - PrayerTimesContent (dynamic, Suspense-streamed): calls headers(), calculates
 *    live prayer times, renders times list + MadhabSelector + FAQ + Calendar.
 *
 * SEO: WebPage + Place + FAQPage JSON-LD schemas, rich keywords, canonical URL.
 */

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Link from 'next/link';
import { getCityBySlug, getPriorityCityParams } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import {
  calculatePrayerTimes,
  calculateAsrComparison,
  getNextPrayer,
  formatTime,
} from '@/lib/prayerEngine';
import { getMethodByCountry, MADHAB_INFO } from '@/lib/prayer-methods';
import { getCountriesAction } from '@/app/actions/location';

import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCityWrapper.client';
import MonthlyPrayerCalendar from '@/components/mwaqit/MonthlyPrayerCalendar.client';
import CalendarSeoBlock from '@/components/mwaqit/CalendarSeoBlock';
import MadhabSelector from '@/components/mwaqit/MadhabSelector.client';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { getSiteUrl } from '@/lib/site-config';
import { formatGregorianLabel, getHijriMonthSpanFromDate } from '@/lib/hijri-utils';
// ─── ISR: pre-build top 30 cities, revalidate every 60s ─────────────────────



const BASE = getSiteUrl();

// Always pre-generate at least a small seed so Next.js Cache Component
// validation passes in dev. All other slugs render at runtime (default behavior).

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'morocco',      city: 'casablanca' },
      { country: 'saudi-arabia', city: 'riyadh'     },
      { country: 'egypt',        city: 'cairo'       },
    ];
  }
  return getPriorityCityParams(30);
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return {};
  const cityData = await getCityBySlug(country.country_code, citySlug);
  if (!cityData) return {};

  const cityNameAr    = cityData.name_ar || cityData.name_en;
  const countryNameAr = country.name_ar  || country.name_en;
  const methodInfo    = getMethodByCountry(country.country_code);

  // Fixed date for SEO — Fajr/Maghrib hint shows real-looking times without headers()
  const seoDate = new Date('2025-06-01T12:00:00Z');
  const times   = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon, timezone: cityData.timezone,
    date: seoDate, countryCode: country.country_code,
    cacheKey: `meta::${countrySlug}::${citySlug}`,
  });

  let timesHint = '';
  if (times) {
    const fajrFmt    = formatTime(times.fajr,    cityData.timezone);
    const maghribFmt = formatTime(times.maghrib,  cityData.timezone);
    timesHint = ` الفجر ${fajrFmt} — المغرب ${maghribFmt}.`;
  }

  const title       = `مواقيت الصلاة في ${cityNameAr}، ${countryNameAr} اليوم — الفجر والمغرب والعصر`;
  const description = `أوقات الصلاة الدقيقة في ${cityNameAr} اليوم.${timesHint} طريقة الحساب: ${methodInfo.label}. الشافعي والحنفي.`;
  const canonical   = `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}`;

  return {
    title,
    description,
    keywords: [
      `مواقيت الصلاة ${cityNameAr}`,
      `أوقات الصلاة ${cityNameAr}`,
      `وقت الفجر ${cityNameAr}`,
      `وقت المغرب ${cityNameAr}`,
      `وقت العصر ${cityNameAr}`,
      `أذان ${cityNameAr} اليوم`,
      `مواقيت الصلاة ${countryNameAr}`,
      `صلاة العصر الشافعي ${cityNameAr}`,
      `صلاة العصر الحنفي ${cityNameAr}`,
    ].join(', '),
    alternates: { canonical },
    openGraph: {
      title, description, type: 'website', locale: 'ar_SA', url: canonical,
    },
    twitter: { card: 'summary', title, description },
  };
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
function PrayerTimesJsonLd({ cityData, countryNameAr, countrySlug, citySlug }) {
  const cityNameAr = cityData.name_ar || cityData.name_en;
  const url = `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `مواقيت الصلاة في ${cityNameAr}`,
      url,
      inLanguage: 'ar',
      description: `أوقات الصلاة الدقيقة في ${cityNameAr} — الفجر، الظهر، العصر، المغرب، العشاء`,
      about: {
        '@type': 'Place',
        name: cityNameAr,
        address: { '@type': 'PostalAddress', addressLocality: cityNameAr, addressCountry: countryNameAr },
        geo: { '@type': 'GeoCoordinates', latitude: cityData.lat, longitude: cityData.lon },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name:  `ما وقت الفجر في ${cityNameAr} اليوم؟`,
          acceptedAnswer: { '@type': 'Answer', text: `يمكن الاطلاع على وقت الفجر الدقيق في ${cityNameAr} في الجدول الموجود أعلى هذه الصفحة. يتغير الوقت يومياً بحسب موضع الشمس.` },
        },
        {
          '@type': 'Question',
          name: 'ما الفرق بين المذهب الشافعي والحنفي في وقت العصر؟',
          acceptedAnswer: { '@type': 'Answer', text: 'الشافعية يحسبون العصر حين يساوي ظل الشيء طوله (× 1)، أما الحنفية فيحسبونه حين يصبح الظل ضعف الطول (× 2)، مما يجعل وقت العصر الحنفي متأخراً بـ 45–90 دقيقة عادةً.' },
        },
        {
          '@type': 'Question',
          name: `كيف تُحسب مواقيت الصلاة في ${cityNameAr}؟`,
          acceptedAnswer: { '@type': 'Answer', text: `تُحسب مواقيت الصلاة في ${cityNameAr} بالمعادلات الفلكية المعتمدة، مع مراعاة إحداثيات المدينة والمنطقة الزمنية وطريقة الحساب المعتمدة محلياً.` },
        },
      ],
    },
  ];
  return schemas.map((schema, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  ));
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

// ─── Page shell (statically cached) ──────────────────────────────────────────
export default async function PrayerTimesPage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  const country  = await getCountryBySlug(countrySlug);
  if (!country) notFound();
  const cityData = await getCityBySlug(country.country_code, citySlug);
  if (!cityData) notFound();

  const allCountries  = await getCountriesAction();
  const cityNameAr    = cityData.name_ar || cityData.name_en;
  const countryNameAr = country.name_ar  || country.name_en;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'مواقيت الصلاة', item: `${BASE}/mwaqit-al-salat` },
      { '@type': 'ListItem', position: 3, name: countryNameAr, item: `${BASE}/mwaqit-al-salat/${countrySlug}` },
      { '@type': 'ListItem', position: 4, name: `مواقيت الصلاة في ${cityNameAr}`, item: `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}` },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `مواقيت الصلاة في ${cityNameAr}، ${countryNameAr}`,
    url: `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}`,
    description: `أوقات الصلاة الدقيقة في ${cityNameAr} اليوم. الفجر والظهر والعصر والمغرب والعشاء.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}#breadcrumb` },
    about: {
      '@type': 'City',
      name: cityData.name_en,
      alternateName: cityNameAr,
      containedInPlace: {
        '@type': 'Country',
        name: country.name_en,
        alternateName: countryNameAr,
      },
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `متى وقت الفجر في ${cityNameAr} اليوم؟`,
        acceptedAnswer: { '@type': 'Answer', text: `يُعرض وقت الفجر الدقيق لمدينة ${cityNameAr} في جدول مواقيت الصلاة أعلاه، ويُحسب تلقائياً حسب الموقع الجغرافي.` },
      },
      {
        '@type': 'Question',
        name: `متى وقت المغرب في ${cityNameAr} اليوم؟`,
        acceptedAnswer: { '@type': 'Answer', text: `يُعرض وقت المغرب الدقيق لمدينة ${cityNameAr} في جدول مواقيت الصلاة أعلاه، ويُمثل موعد الإفطار في رمضان.` },
      },
      {
        '@type': 'Question',
        name: `كيف تُحسب مواقيت الصلاة في ${cityNameAr}؟`,
        acceptedAnswer: { '@type': 'Answer', text: `تُحسب مواقيت الصلاة في ${cityNameAr} بناءً على إحداثيات المدينة (${parseFloat(cityData.lat).toFixed(4)}، ${parseFloat(cityData.lon).toFixed(4)}) والمنطقة الزمنية ${cityData.timezone} باستخدام أدق المعايير الفلكية.` },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-base" dir="rtl">

      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-32">

        {/* JSON-LD schemas */}
        <PrayerTimesJsonLd
          cityData={cityData}
          countryNameAr={countryNameAr}
          countrySlug={countrySlug}
          citySlug={citySlug}
        />

        {/* Breadcrumb */}
        <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 hidden sm:flex items-center gap-1.5">
          <Link href="/" prefetch className="hover:text-accent transition-colors">الرئيسية</Link>
          <span aria-hidden="true">›</span>
          <Link href="/mwaqit-al-salat" prefetch className="hover:text-accent transition-colors">مواقيت الصلاة</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/mwaqit-al-salat/${countrySlug}`} prefetch className="hover:text-accent transition-colors">{countryNameAr}</Link>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{cityNameAr}</span>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-primary mb-2 leading-tight">
            مواقيت الصلاة في <span className="text-accent">{cityNameAr}</span>
          </h1>
          <p className="text-muted text-sm mx-auto">{countryNameAr}</p>
        </header>

        <AdTopBanner slotId="top-city" />

        {/* City search */}
        <div className="mb-8">
          <SearchCity
            placeholder="البحث عن مدينة أخرى..."
            initialCity={{ ...cityData, country_slug: countrySlug, city_slug: citySlug, country_name_ar: countryNameAr, city_name_ar: cityNameAr }}
            preloadedCountries={allCountries}
          />
          <p className="mt-2 text-[10px] font-bold text-[var(--accent)] pr-1">
            محدد حالياً: {cityNameAr}، {countryNameAr}
          </p>
        </div>

        {/* Dynamic content streams in per-request */}
        <ErrorBoundary>
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-72 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
              <div className="h-64 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
              <div className="h-48 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
            </div>
          }
        >
          <PrayerTimesContent
            country={countrySlug}
            city={citySlug}
            cityData={cityData}
            countryCode={country.country_code}
            countryNameAr={countryNameAr}
          />
        </Suspense>
        </ErrorBoundary>

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}

// ─── Dynamic section (per-request, inside Suspense) ──────────────────────────
async function PrayerTimesContent({ country, city, cityData, countryCode, countryNameAr }) {
  await headers(); // opts only this sub-tree to dynamic rendering

  const now        = new Date();
  const methodInfo = getMethodByCountry(countryCode);

  const times = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: now,
    countryCode, cacheKey: `${country}::${city}`,
  });

  if (!times) {
    return <p className="text-danger text-center py-12">عذراً، تعذّر حساب أوقات الصلاة.</p>;
  }

  // Asr comparison (Shafi vs Hanafi) for the MadhabSelector
  const { shafiAsr, hanafiAsr } = calculateAsrComparison({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: now, countryCode,
    cacheKey: `${country}::${city}`,
  });


  const shafiAsrStr  = shafiAsr  ? formatTime(shafiAsr,  cityData.timezone) : null;
  const hanafiAsrStr = hanafiAsr ? formatTime(hanafiAsr, cityData.timezone) : null;

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, now.toISOString());
  const fajrStr    = formatTime(times.fajr,    cityData.timezone);
  const maghribStr = formatTime(times.maghrib,  cityData.timezone);
  const asrStr     = formatTime(times.asr,      cityData.timezone);

  const todayLabel = now.toLocaleDateString('ar-EG-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const cityNameAr = cityData.name_ar || cityData.name_en;

  // City-specific FAQ items
  const faqItems = [
    {
      q: `متى وقت الفجر في ${cityNameAr} اليوم؟`,
      a: `وقت الفجر في ${cityNameAr} اليوم هو ${fajrStr}. يتغير يومياً بحسب إحداثيات المدينة وفصل السنة.`,
    },
    {
      q: `متى وقت المغرب في ${cityNameAr} اليوم؟`,
      a: `وقت المغرب في ${cityNameAr} اليوم هو ${maghribStr}. يتزامن مع غروب الشمس مع تصحيح الانكسار الجوي.`,
    },
    {
      q: `متى وقت العصر في ${cityNameAr} اليوم؟`,
      a: `وقت العصر في ${cityNameAr} اليوم: الشافعي ${shafiAsrStr ?? asrStr}، الحنفي ${hanafiAsrStr ?? '(غير متاح)'}. الفرق يعتمد على المذهب الفقهي المتبع.`,
    },
    {
      q: `كيف تُحسب مواقيت الصلاة في ${cityNameAr}؟`,
      a: `تُحسب المواقيت بمعادلات فلكية مبنية على إحداثيات ${cityNameAr} (${cityData.lat?.toFixed(3)}°، ${cityData.lon?.toFixed(3)}°) والمنطقة الزمنية ${cityData.timezone}، باستخدام طريقة الحساب المعتمدة رسمياً: ${methodInfo.label}.`,
    },
    {
      q: 'ما الفرق بين المذهب الشافعي والحنفي في وقت العصر؟',
      a: `الشافعية (والمالكية والحنابلة) يحسبون العصر حين يساوي ظل الشيء طوله (× 1)، أما الحنفية فيحسبونه حين يكون الظل ضعف الطول (× 2). النتيجة أن وقت العصر الحنفي يتأخر عادةً 45–90 دقيقة. ${shafiAsrStr && hanafiAsrStr ? `في ${cityNameAr} اليوم: الشافعي ${shafiAsrStr}، الحنفي ${hanafiAsrStr}.` : ''}`,
    },
  ];

  return (
    <>
      {/* ── Countdown hero ─────────────────────────────────────────────── */}
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

      {/* ── Prayer times list ──────────────────────────────────────────── */}
      <section className="card mb-6" aria-label="مواقيت الصلاة اليوم">
        <div className="card__header">
          <div>
            <h2 className="card__title">مواقيت الصلاة اليوم</h2>
            <p className="text-[11px] text-muted mt-0.5">
              طريقة الحساب: <span className="text-accent-alt font-semibold">{methodInfo.label}</span>
            </p>
          </div>
          <span className="badge badge-accent shrink-0">{todayLabel}</span>
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

      <AdInArticle slotId="mid-city-1" />

      {/* ── Madhab section ────────────────────────────────────────────── */}
      <section className="card mb-6" aria-label="المذهب الفقهي ووقت العصر">
        <MadhabSelector
          school={methodInfo.school ?? methodInfo.defaultMadhab}
          shafiAsrTime={shafiAsrStr}
          hanafiAsrTime={hanafiAsrStr}
        />
      </section>


      {/* ── Coordinates + method note ─────────────────────────────────── */}
      <section className="card-nested mb-6 text-xs text-muted leading-relaxed">
        <p>
          مواقيت {cityNameAr} محسوبة بناءً على إحداثيات ({cityData.lat?.toFixed(4)}°،{' '}
          {cityData.lon?.toFixed(4)}°) والمنطقة الزمنية {cityData.timezone},
          وفق <strong className="text-secondary">{methodInfo.label}</strong>.
        </p>
      </section>

      {/* ── Monthly Calendar ──────────────────────────────────────────── */}
      <section className="mb-6">
        <CalendarSeoBlock
          cityNameAr={cityNameAr}
          countryNameAr={countryNameAr}
          gregorianLabel={formatGregorianLabel(now)}
          hijriLabel={getHijriMonthSpanFromDate(now)}
          methodLabel={methodInfo.label}
        />
        <MonthlyPrayerCalendar
          lat={cityData.lat}
          lon={cityData.lon}
          timezone={cityData.timezone}
          cityNameAr={cityNameAr}
          countryCode={countryCode}
        />
      </section>

      <AdInArticle slotId="mid-city-2" />

      {/* ── FAQ (shadcn Accordion, Google-crawlable) ──────────────────── */}
      <section className="mb-6" aria-label="أسئلة شائعة عن مواقيت الصلاة">
        <h2 className="text-xl font-bold text-primary mb-4">أسئلة شائعة</h2>
        <FAQAccordions items={faqItems} />
      </section>
    </>
  );
}
