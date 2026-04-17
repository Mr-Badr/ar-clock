/**
 * app/mwaqit-al-salat/[country]/page.jsx
 *
 * Country-level prayer times page.
 * Shows capital city prayers + grid of all cities.
 */

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getPriorityCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries';
import { getTopCitiesByCountry, getCapitalCity } from '@/lib/db/queries/cities';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import { getMethodByCountry } from '@/lib/prayer-methods';
import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCityWrapper.client';
import CityPrayerCardsGrid from '@/components/mwaqit/CityPrayerCardsGrid.client';
import MonthlyPrayerCalendar from '@/components/mwaqit/MonthlyPrayerCalendar.client';
import CalendarSeoBlock from '@/components/mwaqit/CalendarSeoBlock';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { getSiteUrl } from '@/lib/site-config';
import { getCachedNowIso } from '@/lib/date-utils';
import { formatGregorianLabel, getHijriMonthSpanFromDate } from '@/lib/hijri-utils';
import { buildPrayerKeywords } from '@/lib/seo/section-search-intent';

const BASE = getSiteUrl();

export async function generateStaticParams() {
  const slugs = await getPriorityCountrySlugs(24);
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

  const titleSuffix = capitalAr ? `، ${capitalAr}` : '';
  const title = `مواقيت الصلاة اليوم في ${countryAr}${titleSuffix} | الفجر والمغرب بدقة`;
  const description = capitalAr
    ? `اعرف مواقيت الصلاة اليوم في ${countryAr} مع أوقات الفجر والشروق والظهر والعصر والمغرب والعشاء في ${capitalAr} وبقية المدن، وطريقة الحساب ${methodInfo.label}.`
    : `اعرف مواقيت الصلاة اليوم في ${countryAr} مع الفجر والشروق والظهر والعصر والمغرب والعشاء، وطريقة الحساب ${methodInfo.label} وروابط المدن الرئيسية.`;

  return {
    title,
    description,
    keywords: buildPrayerKeywords({
      countryAr,
      countryEn: country.name_en,
      cityAr: capitalAr,
      cityEn: capital?.name_en,
      methodLabel: methodInfo.label,
    }),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type:   'website',
      locale: 'ar_SA',
      url:    canonical,
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

  const [cities, capital] = await Promise.all([
    getTopCitiesByCountry(country.country_code, 120),
    getCapitalCity(country.country_code),
  ]);

  const countryAr  = country.name_ar || country.name_en;
  const methodInfo = getMethodByCountry(country.country_code);
  const utilityLinks = [
    {
      href: `/time-now/${countrySlug}`,
      label: `الوقت الان في ${countryAr}`,
      description: `صفحة الوقت الآن في ${countryAr} مع الساعة الحالية والعاصمة والمدن الرئيسية.`,
    },
    {
      href: `/date/country/${countrySlug}`,
      label: `التاريخ اليوم في ${countryAr}`,
      description: `صفحة التاريخ الهجري والميلادي في ${countryAr} بحسب الجهة الرسمية المعتمدة.`,
    },
    capital ? {
      href: `/mwaqit-al-salat/${countrySlug}/${capital.city_slug}`,
      label: `مواقيت الصلاة في ${capital.name_ar || capital.name_en}`,
      description: `انتقل مباشرة إلى صفحة العاصمة لمشاهدة مواقيت الصلاة اليوم والجدول الشهري.`,
    } : null,
    {
      href: '/date/today/hijri',
      label: 'التاريخ الهجري اليوم',
      description: 'راجع التاريخ الهجري اليوم وأدوات التحويل والتقويم المرتبطة به.',
    },
  ].filter(Boolean);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${BASE}/mwaqit-al-salat/${countrySlug}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'مواقيت الصلاة', item: `${BASE}/mwaqit-al-salat` },
      { '@type': 'ListItem', position: 3, name: `مواقيت الصلاة في ${countryAr}`, item: `${BASE}/mwaqit-al-salat/${countrySlug}` },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
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
  const cityItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `مدن ${countryAr} في قسم مواقيت الصلاة`,
    itemListElement: cities.slice(0, 30).map((cityItem, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cityItem.name_ar || cityItem.name_en,
      url: `${BASE}/mwaqit-al-salat/${countrySlug}/${cityItem.city_slug}`,
    })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20">

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
            مواقيت الصلاة اليوم في <span className="text-accent">{countryAr}</span>
          </h1>
          <p className="text-muted text-base mb-3" style={{ margin: '10px auto' }}>
            اختر المدينة لعرض الفجر والظهر والعصر والمغرب والعشاء بدقة، مع طريقة الحساب المعتمدة داخل الدولة.
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
          <SearchCity mode="mwaqit-al-salat" />
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

        <section className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <GeoInternalLinks
            title={`روابط مهمة عن ${countryAr}`}
            description={`نربط هنا بين صفحات الصلاة والوقت والتاريخ الخاصة بـ${countryAr} حتى تبقى الصفحات الرئيسية والمدن المهمة قريبة من بعضها في البنية الداخلية للموقع.`}
            links={utilityLinks}
            ariaLabel={`روابط مهمة عن ${countryAr}`}
          />
        </section>

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}

// ─── Dynamic content ──────────────────────────────────────────────────────────
async function PrayerTimesContent({ country, city, cityData, countryCode, countryNameAr }) {
  const nowIso     = await getCachedNowIso();
  const now        = new Date(nowIso);
  const methodInfo = getMethodByCountry(countryCode);

  const times = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: now,
    countryCode, cacheKey: `country::${country}::${city}`,
  });

  if (!times) {
    return <p className="text-danger text-center py-12">عذراً، تعذّر حساب أوقات الصلاة للعاصمة.</p>;
  }

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, nowIso);
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
