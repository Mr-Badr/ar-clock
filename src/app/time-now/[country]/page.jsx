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
 *  - JSON-LD: CollectionPage + BreadcrumbList + city ItemList
 *  - hreflang for all Arab-country locales on the generic page
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import DeferredSectionNotice from '@/components/shared/DeferredSectionNotice';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import TimeNowHero from '@/components/time-now/TimeNowHero';
import SearchCity from '@/components/SearchCityWrapper.client';
import CountryCitiesGrid from '@/components/time-now/CountryCitiesGrid';
import TimezoneInfoCard from '@/components/time-now/TimezoneInfoCard';
import SameTimezoneCountries from '@/components/time-now/SameTimezoneCountries';
import TimeNowFAQ from '@/components/time-now/TimeNowFAQ';
import RelatedSearches from '@/components/time-now/RelatedSearches';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import GeoCityDirectory from '@/components/seo/GeoCityDirectory';
import { Skeleton } from '@/components/ui/skeleton';
import routeStyles from '@/app/time-now/TimeNowRoutePage.module.css';
import {
  getAllCountries,
  getPriorityCountrySlugs,
  getCountryBySlug,
} from '@/lib/db/queries/countries';

import {
  getCapitalCity,
  getCitiesByCountry,
} from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCountrySlug,
} from '@/lib/seo/country-indexing';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { buildTimeNowKeywords } from '@/lib/seo/section-search-intent';
import { buildNoindexRouteMetadata, isRouteSlug } from '@/lib/route-param-validation';
import {
  buildCountryTimeNowFaqItems,
  getCountriesSharingCurrentOffset,
  getTimeNowSeoFacts,
} from '@/lib/time-now-content';
import { getSolarPrayerFacts } from '@/lib/solar-prayer-facts';
import { logger, serializeError } from '@/lib/logger';

const BASE = getSiteUrl();

const COUNTRY_TIME_SOURCE_LINKS = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'قاعدة IANA للمناطق الزمنية',
    description: 'المرجع التقني لأسماء المناطق الزمنية وتغييرات الإزاحة وقواعد التوقيت الصيفي حول العالم.',
  },
  {
    href: 'https://www.bipm.org/en/time-metrology',
    label: 'BIPM ومرجعية UTC',
    description: 'يوضح دور UTC بوصفه مقياس الوقت المرجعي الذي تُقارن به فروق التوقيت الدولية.',
  },
  {
    href: 'https://www.timeanddate.com/time/dst/',
    label: 'شرح التوقيت الصيفي DST',
    description: 'مرجع عملي لفهم لماذا يتغير فرق الساعات في بعض الدول خلال السنة ولا يتغير في دول أخرى.',
  },
];

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
  return Array.isArray(slugs)
    ? slugs.filter(isRouteSlug).map(slug => ({ country: slug }))
    : [];
}

function getUtcOffsetStr(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: timezone, timeZoneName: 'shortOffset',
    }).formatToParts(new Date('2025-06-01T12:00:00Z'));
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

function isValidCityRecord(city) {
  return Boolean(
    city
      && typeof city === 'object'
      && typeof city.city_slug === 'string'
      && city.city_slug.trim().length > 0
      && (city.name_ar || city.name_en || city.city_name_ar),
  );
}

function isValidFaqItem(item) {
  return Boolean(
    item
      && typeof item === 'object'
      && typeof item.q === 'string'
      && item.q.trim().length > 0
      && typeof item.a === 'string'
      && item.a.trim().length > 0,
  );
}

function isValidCountryOffsetEntry(entry) {
  return Boolean(
    entry
      && typeof entry === 'object'
      && typeof entry.country_slug === 'string'
      && entry.country_slug.trim().length > 0
      && (entry.country_name_ar || entry.country_name_en),
  );
}

/* ── DYNAMIC METADATA ────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) {
    return buildNoindexRouteMetadata({
      title: `رابط وقت غير صالح | ${SITE_BRAND}`,
      description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
      canonical: '/time-now',
    });
  }

  try {
    const country = await getCountryBySlug(countrySlug);
    if (!country) return { title: 'الوقت الان' };

    const capital = await getCapitalCity(country.country_code);

    const countryAr = country.name_ar;
    const cityAr = capital ? capital.name_ar : countryAr;
    const timezone = capital ? capital.timezone : country.timezone;
    const offset = getUtcOffsetStr(timezone);
    const policy = GEO_ROUTE_INDEXING_POLICIES.timeNow;
    const isIndexableCountry = isSeoIndexableCountrySlug(countrySlug, {
      scope: policy.countryScope,
    });

    return {
      title: `الوقت الآن في ${countryAr} | الساعة والتاريخ والمدن`,
      description: `اعرف الوقت الآن في ${countryAr} مع توقيت ${cityAr}، التاريخ المحلي، منطقة IANA، فرق UTC ${offset}، حالة التوقيت الصيفي، وروابط جميع المدن.`,
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
        title: `الوقت الآن في ${countryAr} | الساعة والتاريخ والمدن`,
        description: `ساعة ${countryAr} الآن مع توقيت ${cityAr}، التاريخ المحلي، منطقة IANA، فرق UTC ${offset}، وروابط المدن وفرق التوقيت.`,
        images: [{
          url: `${BASE}/time-now/${countrySlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `الوقت الان في ${countryAr}`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `الوقت الان في ${countryAr} | ${cityAr}`,
        description: `اعرف ساعة ${countryAr} الآن مع التاريخ المحلي وفرق UTC ${offset} وروابط المدن داخل الدولة.`,
        images: [`${BASE}/time-now/${countrySlug}/opengraph-image`],
      },
      robots: {
        index: isIndexableCountry,
        follow: true,
        googleBot: {
          index: isIndexableCountry,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
        },
      },
    };
  } catch (error) {
    logger.error('time-now-country-metadata-failed', {
      routePath: `/time-now/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
    return {
      title: `الوقت الان حسب الدولة | ${SITE_BRAND}`,
      description: 'اعرف الوقت الحالي حسب الدولة مع مسارات المدن والتاريخ والصلاة داخل ميقاتنا.',
      alternates: {
        canonical: `/time-now/${countrySlug}`,
      },
    };
  }
}

/* ── PAGE ────────────────────────────────────────────────────────── */
export default async function CountryTimePage({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) notFound();

  /* Fetch country and capital from DB */
  let country;
  try {
    country = await getCountryBySlug(countrySlug);
  } catch (error) {
    logger.error('time-now-country-page-data-failed', {
      routePath: `/time-now/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات الدولة الآن"
        title="صفحة الوقت حسب الدولة متاحة جزئياً فقط الآن"
        description="تعذر تحميل بيانات هذه الدولة في هذه اللحظة، لذلك أوقفنا الانهيار الكامل وأظهرنا لك مسارات واضحة بديلة حتى لا تتحول الزيارة إلى 5xx أو صفحة فارغة."
        primaryLink={{
          href: '/time-now',
          label: 'افتح صفحة الوقت الان',
          description: 'انتقل إلى صفحة الوقت الرئيسية ثم اختر دولة أو مدينة أخرى من البحث المباشر.',
        }}
        secondaryLinks={[
          {
            href: '/mwaqit-al-salat',
            label: 'افتح مواقيت الصلاة',
            description: 'يمكنك الوصول إلى صفحات الصلاة حسب الدولة والمدينة من القسم الرئيسي.',
          },
          {
            href: '/date',
            label: 'افتح قسم التاريخ',
            description: 'راجع التاريخ اليوم وأدوات التحويل والتقويم من صفحة التاريخ الرئيسية.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'استخدم فهرس الصفحات للوصول السريع إلى أقرب مسار مرتبط بسؤالك.',
          },
        ]}
      />
    );
  }
  if (!country) notFound();
  let capital = null;
  try {
    capital = await getCapitalCity(country.country_code);
  } catch (error) {
    logger.warn('time-now-country-capital-lookup-failed', {
      routePath: `/time-now/${countrySlug}`,
      countrySlug,
      countryCode: country.country_code,
      error: serializeError(error),
    });
  }
  const timezone = capital ? capital.timezone : country.timezone;
  const countryAr = country.name_ar;
  const cityAr = capital ? capital.name_ar : countryAr;
  const utcOffset = getUtcOffsetStr(timezone);
  const countryUtilityLinks = [
    {
      href: `/mwaqit-al-salat/${countrySlug}`,
      label: `مواقيت الصلاة في ${countryAr}`,
      description: `اعرف مواقيت الصلاة في ${countryAr} مع العاصمة وأشهر المدن من نفس القسم بدون بحث إضافي.`,
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

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `الوقت الان في ${countryAr}`,
    url: `${BASE}/time-now/${countrySlug}`,
    description: `اعرف الوقت الان في ${countryAr} بدقة حتى الثانية، مع توقيت ${cityAr}، التاريخ الميلادي والهجري، منطقة IANA، حالة التوقيت الصيفي، وروابط المدن داخل الدولة.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${BASE}/time-now/${countrySlug}#breadcrumb` },
    about: {
      '@type': 'Country',
      name: country.name_en,
      alternateName: countryAr,
    },
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main>
        {/* ── BREADCRUMB ── */}
        <nav
          aria-label="مسار التنقل"
          className={`container mx-auto px-4 ${routeStyles.breadcrumb}`}
        >
          <ol className={routeStyles.breadcrumbList}>
            <li className={routeStyles.breadcrumbItem}>
              <Link href="/" className={routeStyles.breadcrumbLink}>الرئيسية</Link>
            </li>
            <li aria-hidden><ChevronLeft size={13} className={routeStyles.breadcrumbChevron} /></li>
            <li className={routeStyles.breadcrumbItem}>
              <Link href="/time-now" className={routeStyles.breadcrumbLink}>الوقت الان</Link>
            </li>
            <li aria-hidden><ChevronLeft size={13} className={routeStyles.breadcrumbChevron} /></li>
            <li aria-current="page" className={routeStyles.breadcrumbCurrent}>{countryAr}</li>
          </ol>
        </nav>

        {/* ── HERO SECTION ── */}
        <section aria-labelledby="country-time-heading" className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
          <div className={routeStyles.heroInner}>
            <div className={routeStyles.heroCopy}>
              <h1 id="country-time-heading" className={routeStyles.heroTitle}>
                الوقت الآن في <span className="text-accent">{countryAr}</span>
              </h1>
              <p className={routeStyles.heroLead}>
                الوقت الآن في {countryAr} يُعرض حسب توقيت {cityAr}: سترى الساعة الحالية، التاريخ المحلي، المنطقة الزمنية {utcOffset || timezone}، وروابط جميع المدن المدعومة. إذا كان موعدك للسفر أو العمل، تحقق من المدينة وفرق UTC قبل تثبيت الموعد.
              </p>
            </div>

            <div className={routeStyles.searchWrap}>
              <SearchCity mode="time-now" />
            </div>

            <div className={routeStyles.clockWrap}>
              <Suspense fallback={<div className={routeStyles.heroClockFallback} aria-hidden />}>
                <TimeNowHero
                  ianaTimezone={timezone}
                  cityNameAr={cityAr}
                  countryNameAr={countryAr}
                  countryCode={country.country_code}
                />
              </Suspense>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.summaryBand}`}>
          <div className={routeStyles.summaryGrid}>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>العاصمة المرجعية</p>
              <p className={routeStyles.summaryValue}>{cityAr}</p>
              <p className={routeStyles.summaryCopy}>
                نبدأ بالعاصمة أو المدينة الأوضح بحثاً حتى تحصل على جواب سريع، ثم نفتح لك مسارات المدن عند الحاجة.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>المنطقة الزمنية</p>
              <p className={`${routeStyles.summaryValue} ${routeStyles.summaryValueLtr}`}>{utcOffset || timezone}</p>
              <p className={routeStyles.summaryCopy}>
                الإزاحة الحالية مفيدة الآن، لكن مواعيد الأسابيع القادمة تحتاج مراجعة حالة التوقيت الصيفي.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>ما الذي ستجده هنا؟</p>
              <p className={routeStyles.summaryValue}>وقت + تاريخ + مسارات</p>
              <p className={routeStyles.summaryCopy}>
                اختر بعدها الصلاة، التاريخ، صفحة المدينة، أو حاسبة فرق التوقيت حسب القرار الذي تريد اتخاذه.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-2">
          <AdTopBanner slotId={`top-time-country-${countrySlug}`} />
        </section>

        <Suspense fallback={<CountryTimePageSectionsFallback />}>
          <CountryTimePageSections
            capital={capital}
            country={country}
            countryAr={countryAr}
            countrySlug={countrySlug}
            countryUtilityLinks={countryUtilityLinks}
            cityAr={cityAr}
            timezone={timezone}
            utcOffset={utcOffset}
          />
        </Suspense>
        </main>
      </AdLayoutWrapper>
    </div>
  );
}

async function CountryTimePageSections({
  capital,
  country,
  countryAr,
  countrySlug,
  countryUtilityLinks,
  cityAr,
  timezone,
  utcOffset,
}) {
  try {
    const [cities, nowIso, allCountries] = await Promise.all([
      getCitiesByCountry(country.country_code),
      getCachedNowIso(),
      getAllCountries(),
    ]);
    const safeCities = Array.isArray(cities) ? cities.filter(isValidCityRecord) : [];
    const featuredCities = safeCities.slice(0, 30);
    const safeAllCountries = Array.isArray(allCountries) ? allCountries : [];
    const timeFacts = getTimeNowSeoFacts({
      timezone,
      utcOffset,
      referenceDateOrIso: nowIso,
      placeAr: countryAr,
    });
    const solarFacts = capital
      ? getSolarPrayerFacts({
        lat: capital.lat,
        lon: capital.lon,
        timezone,
        date: new Date(nowIso),
        countryCode: country.country_code,
        cacheKey: `time-now::${countrySlug}::capital::solar`,
      })
      : null;
    const sameOffsetCountries = getCountriesSharingCurrentOffset(safeAllCountries, {
      referenceTimezone: timezone,
      referenceDateOrIso: nowIso,
      excludeCountrySlug: countrySlug,
    });
    const safeSameOffsetCountries = Array.isArray(sameOffsetCountries)
      ? sameOffsetCountries.filter(isValidCountryOffsetEntry)
      : [];
    const builtFaqItems = buildCountryTimeNowFaqItems({
      countryAr,
      capitalAr: capital?.name_ar || null,
      timezone,
      utcOffset,
      referenceDateOrIso: nowIso,
      cityCount: safeCities.length,
    });
    const faqItems = Array.isArray(builtFaqItems) ? builtFaqItems.filter(isValidFaqItem) : [];
    const relatedOffsetCountriesText = safeSameOffsetCountries
      .slice(0, 3)
      .map((entry) => entry.country_name_ar || entry.country_name_en)
      .filter(Boolean)
      .join('، ');
    const cityItemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `مدن ${countryAr} في قسم الوقت الان`,
      itemListElement: safeCities.map((cityItem, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cityItem.name_ar || cityItem.name_en,
        url: `${BASE}/time-now/${countrySlug}/${cityItem.city_slug}`,
      })),
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }} />

        <section aria-labelledby="country-time-answer-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 id="country-time-answer-heading" className={routeStyles.sectionTitle}>
                ملخص الوقت الرسمي في {countryAr}
              </h2>
              <p className={routeStyles.sectionCopy}>
                ابدأ من توقيت {cityAr} كمرجع سريع للدولة، ثم افتح صفحة المدينة إذا كان قرارك مرتبطاً
                بصلاة أو رحلة أو موعد محلي دقيق.
              </p>
            </div>
            <div className={routeStyles.insightGrid}>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>التاريخ المحلي</span>
                <h3>اليوم في {countryAr}</h3>
                <p>
                  {timeFacts.gregorianDateAr ? (
                    <>
                      اليوم هو <strong>{timeFacts.gregorianDateAr}</strong>
                      {timeFacts.hijriDateAr ? <>، وبالهجري <strong>{timeFacts.hijriDateAr}</strong>.</> : '.'}
                    </>
                  ) : (
                    <>يُقرأ التاريخ هنا حسب المنطقة الزمنية الرسمية، لا حسب توقيت جهاز الزائر.</>
                  )}
                </p>
              </article>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>UTC وDST</span>
                <h3>الإزاحة الحالية</h3>
                <p>
                  منطقة الوقت المرجعية هي <strong dir="ltr">{timezone}</strong> والإزاحة الحالية <strong dir="ltr">{timeFacts.offsetLabel}</strong>.
                  {' '}{timeFacts.hasDst ? 'تتغير الإزاحة خلال السنة، لذلك لا تثبت موعداً مستقبلياً قبل مراجعة التاريخ.' : 'لا يظهر تغير موسمي بين يناير ويوليو في بيانات هذا العام.'}
                </p>
              </article>
              {solarFacts ? (
                <article className={routeStyles.insightCard}>
                  <span className={routeStyles.insightKicker}>الشمس اليوم</span>
                  <h3>الشروق والغروب في {cityAr}</h3>
                  <p>
                    الشروق عند <strong>{solarFacts.sunriseLabel}</strong> والغروب عند <strong>{solarFacts.sunsetLabel}</strong>
                    {solarFacts.dayLengthLabel ? `، وطول النهار تقريباً ${solarFacts.dayLengthLabel}.` : '.'}
                  </p>
                </article>
              ) : null}
            </div>
          </div>
        </section>

        {featuredCities.length > 1 && (
          <section aria-labelledby="cities-grid-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <h2 id="cities-grid-heading" className={routeStyles.sectionTitle}>
                  الوقت الان في مدن {countryAr}
                </h2>
                <p className={routeStyles.sectionCopy}>
                  ابدأ بالعاصمة أو انتقل مباشرة إلى المدينة الأقرب لك. هذا القسم يظهر بعد الجواب الأساسي حتى تبقى الصفحة عملية قبل عرض بقية المدن.
                </p>
              </div>
              <Suspense fallback={<div className={`${routeStyles.boxSkeleton} ${routeStyles.cityCardSkeleton}`} aria-hidden />}>
                <CountryCitiesGrid cities={featuredCities} countrySlug={countrySlug} />
              </Suspense>
            </div>
          </section>
        )}

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <GeoCityDirectory
              title={`دليل الوقت الآن في جميع مدن ${countryAr}`}
              description={`تصفح كل المدن المتاحة في ${countryAr}. كل رابط يقود إلى صفحة مستقلة تعرض الساعة المحلية والتاريخ والمنطقة الزمنية للمدينة نفسها.`}
              cities={safeCities}
              routeBase={`/time-now/${countrySlug}`}
              linkLabelPrefix="الوقت الآن في"
              ariaLabel={`دليل الوقت الآن في مدن ${countryAr}`}
              featuredCount={12}
            />
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AdInArticle slotId={`mid-time-country-${countrySlug}-1`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <Suspense
            fallback={(
              <DeferredSectionNotice
                title="نجهز معلومات التوقيت الإضافية"
                description="الوقت الحالي ظاهر الآن، وبعد لحظات ستظهر لك تفاصيل المنطقة الزمنية وفرق UTC بشكل أوضح."
              />
            )}
          >
            <div className={routeStyles.sectionPanel}>
              <TimezoneInfoCard
                ianaTimezone={timezone}
                countryAr={countryAr}
                utcOffset={utcOffset}
                nowIso={nowIso}
              />
            </div>
          </Suspense>
        </section>

        <section aria-labelledby="country-time-use-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 id="country-time-use-heading" className={routeStyles.sectionTitle}>
                كيف تستخدم توقيت {countryAr} عملياً؟
              </h2>
              <p className={routeStyles.sectionCopy}>
                أغلب صفحات الوقت تكتفي بعرض الساعة. هنا نساعدك على القرار التالي: هل تريد مكالمة الآن، موعداً بعد أسبوع، رحلة، صلاة، أم مقارنة مع بلد آخر؟
              </p>
            </div>

            <div className={routeStyles.insightGrid}>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>موعد اليوم</span>
                <h3>إذا كان الموعد خلال ساعات</h3>
                <p>
                  يمكنك الاعتماد على الساعة الحالية في {countryAr} ثم مقارنة وقتك المحلي بها. هذا مناسب لمكالمة عائلية، متابعة مباراة، أو اجتماع يبدأ اليوم.
                </p>
              </article>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>موعد مستقبلي</span>
                <h3>إذا كان الموعد بعد أيام أو أسابيع</h3>
                <p>
                  لا تعتمد على فرق محفوظ مثل “ثلاث ساعات”. راجع منطقة {timezone} وحالة DST، ثم استخدم حاسبة فرق التوقيت لأن بعض الدول تتغير إزاحتها موسمياً.
                </p>
              </article>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>مدينة محددة</span>
                <h3>إذا كان السؤال عن مدينة بعينها</h3>
                <p>
                  افتح صفحة المدينة من القائمة، خصوصاً في الدول الكبيرة أو عند السفر. صفحة الدولة تعطيك مرجعاً سريعاً، أما صفحة المدينة فتقلل خطأ الموقع المحلي.
                </p>
              </article>
            </div>
          </div>
        </section>

        {safeSameOffsetCountries.length > 0 && (
          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <SameTimezoneCountries
                countries={safeSameOffsetCountries}
                utcOffset={timeFacts.offsetLabel}
                currentCityAr={cityAr}
              />
            </div>
          </section>
        )}

        <section aria-labelledby="country-time-rules-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2 id="country-time-rules-heading">
                قاعدة سريعة قبل أن تثبت موعداً في {countryAr}
              </h2>
              <p>
                إذا كان سؤالك هو <strong>كم الساعة الان في {countryAr}</strong> فالإجابة موجودة أعلى الصفحة. لكن إذا كان سؤالك الحقيقي هو “متى أتصل؟” أو “متى يبدأ الاجتماع؟” ففكّر بثلاث طبقات: الوقت الحالي، تاريخ الموعد، والمدينة.
              </p>
              <p>
                السبب بسيط: UTC هو خط المقارنة العالمي، أما التوقيت المحلي فهو نتيجة قواعد الدولة في ذلك التاريخ. قاعدة IANA تسجل أسماء المناطق الزمنية وتغييرات الإزاحة، وUTC هو المرجع الذي تُقاس عليه الفروق. لذلك نعرض {timezone} و{utcOffset || timeFacts.offsetLabel} معاً بدل الاكتفاء برقم ساعة معزول.
              </p>
              <ul className={routeStyles.ruleList}>
                <li>للمكالمة الآن: راجع الساعة الحالية ثم اتصل إذا كان الوقت مناسباً محلياً.</li>
                <li>للموعد المستقبلي: استخدم حاسبة فرق التوقيت، ولا تعتمد على فرق محفوظ من شهر سابق.</li>
                <li>للصلاة أو السفر: افتح صفحة المدينة لأن المدينة هي التي تحدد السياق العملي.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <TimeNowFAQ
              placeLabelAr={countryAr}
              introText={`إجابات عملية حول الوقت الرسمي في ${countryAr}، التاريخ اليوم، المدن، UTC، وحالة التوقيت الصيفي عند التخطيط لموعد حقيقي.`}
              items={faqItems}
            />
          </div>
        </section>

        <section aria-labelledby="country-time-sources-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 id="country-time-sources-heading" className={routeStyles.sectionTitle}>
                مصادر تساعدك على فهم الوقت الرسمي
              </h2>
              <p className={routeStyles.sectionCopy}>
                نستخدم هذه المراجع لتفسير مفاهيم مثل IANA وUTC والتوقيت الصيفي. الساعة الحية نفسها تُحسب من المنطقة الزمنية المخزنة للمدينة أو الدولة، ولا يتم جلب هذه المصادر أثناء عرض الصفحة.
              </p>
            </div>
            <div className={routeStyles.sourceGrid}>
              {COUNTRY_TIME_SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  className={routeStyles.sourceCard}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>{source.label}</strong>
                  <span>{source.description}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <RelatedSearches currentCountrySlug={countrySlug} />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <GeoInternalLinks
              title={`خطوات تكمل وقت ${countryAr}`}
              description={`بعد معرفة الساعة في ${countryAr}، اختر خطوة واحدة حسب حاجتك: الصلاة إذا كان يومك مرتبطاً بالأذان، التاريخ إذا كان السؤال عن اليوم المحلي، أو فرق التوقيت إذا كان الموعد مع بلد آخر.`}
              links={countryUtilityLinks}
              ariaLabel={`خطوات تكمل وقت ${countryAr}`}
            />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>
              كيف تقرأ توقيت {countryAr} بدون خلط؟
              </h2>
              <p>
                عندما ترى أن <strong>{countryAr}</strong> تتبع المنطقة الزمنية{' '}
                <strong>{timezone}</strong> وأن إزاحتها هي <strong>{utcOffset}</strong> من UTC،
                فالمعنى العملي هو: قارن كل موعد عالمي بهذه الإزاحة قبل أن تعتمد عليه.
                {` ${timeFacts.utcRelationSentence}`}{' '}لهذا نعرض الساعة الحالية أولاً ثم نضيف التاريخ والمدينة المرجعية.
              </p>
              <p>
                {timeFacts.gregorianDateAr ? (
                  <>
                    التاريخ المحلي اليوم في {countryAr} هو <strong>{timeFacts.gregorianDateAr}</strong>
                    {timeFacts.hijriDateAr ? <> وبالهجري <strong>{timeFacts.hijriDateAr}</strong></> : null}.
                  </>
                ) : (
                  <>
                    بالإضافة إلى الوقت، تجد هنا <strong>التاريخ اليوم</strong> بالتقويم الميلادي
                    والهجري (تقويم أم القرى).
                  </>
                )}{' '}
                كما يوضح قسم المنطقة الزمنية ما إذا كانت الإزاحة تتغير خلال السنة أم تبقى ثابتة.
              </p>
              <p>
                صفحة الدولة تكفي عندما تريد لمحة عامة أو تبحث عن العاصمة. أما إذا كان موعدك مرتبطاً بمدينة معينة،
                فافتح صفحة المدينة نفسها لأن بعض الدول الكبيرة تضم أكثر من منطقة زمنية أو تختلف فيها طريقة استخدام التوقيت الصيفي.
                ستجد هنا مسارات إلى العاصمة والمدن الكبرى
                {relatedOffsetCountriesText ? `، إضافة إلى دول تشترك اليوم مع ${countryAr} في نفس الإزاحة مثل ${relatedOffsetCountriesText}` : ''}.
              </p>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <AdMultiplex slotId={`end-time-country-${countrySlug}`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <SiteTrustPanel panel="time" />
          </div>
        </section>
      </>
    );
  } catch (error) {
    logger.error('time-now-country-support-sections-failed', {
      countryCode: country.country_code,
      countrySlug,
      route: `/time-now/${countrySlug}`,
      timezone,
      degraded: true,
      error: serializeError(error),
    });

    return (
      <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
        <DeferredSectionNotice
          title={`تعذر تحميل الأقسام الإضافية الخاصة بـ ${countryAr}`}
          description={`ما زال وقت ${countryAr} الأساسي ومسارات المتابعة متاحة، لكن تفاصيل المدن والشرح الإضافي لم تكتمل بعد. تمت كتابة الخطأ في السجل حتى نراجعه قبل أي نشر جديد.`}
        />
        <div className="mt-6">
          <div className={routeStyles.sectionPanel}>
            <GeoInternalLinks
              title={`خطوات تكمل وقت ${countryAr}`}
              description={`بعد معرفة الساعة في ${countryAr}، اختر خطوة واحدة حسب حاجتك: الصلاة، التاريخ المحلي، صفحة العاصمة، أو فرق التوقيت.`}
              links={countryUtilityLinks}
              ariaLabel={`خطوات تكمل وقت ${countryAr}`}
            />
          </div>
        </div>
      </section>
    );
  }
}

function CountryTimePageSectionsFallback() {
  return (
    <div className={routeStyles.fallbackStack}>
      <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-hidden="true">
        <div className={routeStyles.sectionPanel}>
          <Skeleton className={`${routeStyles.titleSkeleton} ${routeStyles.lineSkeleton}`} />
          <div className={routeStyles.fallbackGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={`time-now-country-city-grid-${index}`}
              className={`${routeStyles.cityCardSkeleton} ${routeStyles.boxSkeleton}`}
            />
          ))}
        </div>
        </div>
      </section>

      <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-hidden="true">
        <Skeleton className={routeStyles.largePanelSkeleton} />
      </section>

      <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-hidden="true">
        <div className={routeStyles.sectionPanel}>
          <Skeleton className={`${routeStyles.titleSkeleton} ${routeStyles.lineSkeleton}`} />
          <Skeleton className={`${routeStyles.lineFull} ${routeStyles.lineSkeleton}`} />
          <Skeleton className={`${routeStyles.lineWide} ${routeStyles.lineSkeleton}`} />
          <div className={routeStyles.faqFallbackList}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`time-now-country-faq-${index}`}
                className={`${routeStyles.faqItemSkeleton} ${routeStyles.boxSkeleton}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
