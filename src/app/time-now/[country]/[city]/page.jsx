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
 *  Dense FAQ (server, native <details>)
 *  Related searches (server, zero JS, internal links)
 *  SEO prose (server, visible keyword-rich copy for readers and crawlers)
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
import { JsonLd } from '@/components/seo/JsonLd';
import { Skeleton } from '@/components/ui/skeleton';
import routeStyles from '@/app/time-now/TimeNowRoutePage.module.css';

import { getAllCountries, getCountryBySlug } from '@/lib/db/queries/countries';
import { getPriorityCityParams, getPriorityCountriesCityParams, getCityBySlug, getTopCitiesByCountry } from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCityParams,
} from '@/lib/seo/country-indexing';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { buildTimeNowKeywords } from '@/lib/seo/section-search-intent';
import { buildNoindexRouteMetadata, isRouteSlug, isRenderableCityData } from '@/lib/route-param-validation';
import {
  buildCityTimeNowFaqItems,
  buildCallTimeWindows,
  getCountriesSharingCurrentOffset,
  getTimeNowSeoFacts,
} from '@/lib/time-now-content';
import { getSolarPrayerFacts } from '@/lib/solar-prayer-facts';
import { logger, serializeError } from '@/lib/logger';

const BASE = getSiteUrl();

const CITY_TIME_SOURCE_LINKS = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'قاعدة IANA للمناطق الزمنية',
    description: 'توضح أسماء المناطق الزمنية الرسمية وقواعد الإزاحة والتوقيت الصيفي التي تعتمد عليها الأنظمة الرقمية.',
  },
  {
    href: 'https://www.bipm.org/en/time-metrology',
    label: 'مرجعية UTC من BIPM',
    description: 'تشرح UTC بوصفه مرجع الوقت الدولي الذي تُقارن به المدن عند حساب فروق التوقيت.',
  },
  {
    href: 'https://www.timeanddate.com/time/dst/',
    label: 'التوقيت الصيفي DST',
    description: 'يساعدك على فهم لماذا يتغير وقت بعض المدن موسمياً بينما تبقى مدن أخرى على إزاحة ثابتة.',
  },
];

/* ─── ROUTE CONFIG ──────────────────────────────────────────────── */
export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'morocco', city: 'casablanca' },
      { country: 'saudi-arabia', city: 'riyadh' },
      { country: 'egypt', city: 'cairo' },
    ];
  }
  const [globalParams, priorityCountryParams] = await Promise.all([
    getPriorityCityParams(24),
    getPriorityCountriesCityParams(15),
  ]);
  const seen = new Set((globalParams || []).map((p) => `${p.country}::${p.city}`));
  const merged = Array.isArray(globalParams) ? [...globalParams] : [];
  for (const p of (priorityCountryParams || [])) {
    const key = `${p.country}::${p.city}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(p);
    }
  }
  return merged.filter((item) => isRouteSlug(item?.country) && isRouteSlug(item?.city));
}

function getUtcOffsetStr(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: timezone, timeZoneName: 'shortOffset',
    }).formatToParts(new Date('2025-06-01T12:00:00Z'));
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

function buildCityTimeTitle(cityAr, countryAr) {
  const full = `الوقت الآن في ${cityAr}، ${countryAr} — ساعة حية وتاريخ اليوم`;
  if (full.length <= 72) return full;
  const mid = `الوقت الآن في ${cityAr} — ساعة حية وتاريخ اليوم`;
  if (mid.length <= 72) return mid;
  return `الوقت الآن في ${cityAr} — ساعة حية`;
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

/* ─── DYNAMIC METADATA ──────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) {
    return buildNoindexRouteMetadata({
      title: `رابط مدينة غير صالح | ${SITE_BRAND}`,
      description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
      canonical: '/time-now',
    });
  }

  try {
    const country = await getCountryBySlug(countrySlug);
    if (!country) return { title: 'الوقت الان' };
    const city = await getCityBySlug(country.country_code, citySlug);
    if (!city) return { title: 'الوقت الان' };

    const cityAr = city.name_ar || city.name_en;
    const countryAr = country.name_ar || country.name_en;
    const offset = getUtcOffsetStr(city.timezone);
    const title = buildCityTimeTitle(cityAr, countryAr);
    const policy = GEO_ROUTE_INDEXING_POLICIES.timeNow;
    const isIndexableCity = isSeoIndexableCityParams(
      { country: countrySlug, city: citySlug },
      { countryScope: policy.countryScope, cityScope: policy.cityScope },
    );

    return {
      title,
      description: `الوقت الآن في ${cityAr}، ${countryAr} — UTC ${offset}. ساعة حية، التاريخ المحلي، المنطقة الزمنية IANA، وحالة التوقيت الصيفي.`,
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
        title: `الوقت الآن في ${cityAr}، ${countryAr}`,
        description: `ساعة ${cityAr} الآن مع التاريخ المحلي، فرق UTC ${offset}، منطقة IANA، وروابط الصلاة وفرق التوقيت.`,
        images: [{
          url: `${BASE}/time-now/${countrySlug}/${citySlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `الوقت الان في ${cityAr}`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `الوقت الآن في ${cityAr} | التوقيت المحلي`,
        description: `${cityAr} الآن: UTC ${offset}. ساعة حية، التاريخ المحلي، وروابط المدينة.`,
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
  } catch (error) {
    logger.error('time-now-city-metadata-failed', {
      routePath: `/time-now/${countrySlug}/${citySlug}`,
      countrySlug,
      citySlug,
      error: serializeError(error),
    });
    return {
      title: `الوقت الان في المدن | ${SITE_BRAND}`,
      description: 'اعرف الوقت الحالي في المدن العربية والعالمية مع صفحات الدولة والتاريخ والصلاة داخل ميقاتنا.',
      alternates: {
        canonical: `/time-now/${countrySlug}/${citySlug}`,
      },
    };
  }
}

/* ─── PAGE ──────────────────────────────────────────────────────── */
export default async function CityTimePage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) notFound();

  /* Resolve city from Supabase */
  let country;
  try {
    country = await getCountryBySlug(countrySlug);
  } catch (error) {
    logger.error('time-now-city-country-lookup-failed', {
      routePath: `/time-now/${countrySlug}/${citySlug}`,
      countrySlug,
      citySlug,
      error: serializeError(error),
    });
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات المدينة الآن"
        title="صفحة الوقت لهذه المدينة غير مكتملة الآن"
        description="تعذر تحميل بيانات المدينة أو الدولة المرتبطة بها في هذه اللحظة. أوقفنا الانهيار الكامل وأبقينا لك مسارات واضحة للوصول إلى الصفحات الأساسية بدلاً من خطأ 5xx."
        primaryLink={{
          href: '/time-now',
          label: 'افتح قسم الوقت الان',
          description: 'انتقل إلى صفحة الوقت الرئيسية ثم ابحث عن مدينة أو دولة أخرى مباشرة.',
        }}
        secondaryLinks={[
          {
            href: `/time-now/${countrySlug}`,
            label: 'جرّب صفحة الدولة',
            description: 'قد تتمكن من الوصول إلى صفحة الدولة حتى لو تعذر تحميل صفحة المدينة نفسها.',
          },
          {
            href: '/time-difference',
            label: 'افتح حاسبة فرق التوقيت',
            description: 'استخدم أداة فرق التوقيت للوصول إلى المدن والمقارنات الزمنية المرتبطة.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'الفهرس السريع يساعدك على الوصول إلى أقرب مسار مرتبط بهذه المدينة أو الدولة.',
          },
        ]}
      />
    );
  }
  if (!country) notFound();
  let city;
  try {
    city = await getCityBySlug(country.country_code, citySlug);
  } catch (error) {
    logger.error('time-now-city-page-data-failed', {
      routePath: `/time-now/${countrySlug}/${citySlug}`,
      countrySlug,
      citySlug,
      countryCode: country.country_code,
      error: serializeError(error),
    });
    return (
      <RouteUnavailableState
        eyebrow="تعذر تحميل بيانات المدينة الآن"
        title="صفحة الوقت لهذه المدينة متوقفة مؤقتاً"
        description="الخلل وصل إلى مصدر بيانات المدينة قبل اكتمال الصفحة، لذلك عرضنا لك بديلاً واضحاً حتى لا تتحول الزيارة إلى صفحة بيضاء أو خطأ خادم."
        primaryLink={{
          href: `/time-now/${countrySlug}`,
          label: 'افتح صفحة الدولة',
          description: 'انتقل إلى صفحة الدولة للوصول إلى العاصمة والمدن الكبرى المرتبطة بها.',
        }}
        secondaryLinks={[
          {
            href: '/time-now',
            label: 'افتح الوقت الان',
            description: 'ابدأ من صفحة الوقت الرئيسية ثم اختر مدينة أخرى من البحث المباشر.',
          },
          {
            href: '/mwaqit-al-salat',
            label: 'افتح مواقيت الصلاة',
            description: 'يمكنك الوصول إلى القسم المرتبط بالمدينة أو الدولة من مسار الصلاة.',
          },
          {
            href: '/date',
            label: 'افتح قسم التاريخ',
            description: 'راجع التاريخ اليوم وأدوات التحويل والتقويم من القسم الرئيسي.',
          },
        ]}
      />
    );
  }
  if (!city) notFound();
  // Guard: city must have valid timezone + coordinates to render meaningfully.
  // Bad data (e.g. wrong snapshot entry) must 404 rather than render empty/wrong content.
  if (!isRenderableCityData(city)) notFound();

  const cityAr = city.name_ar || city.name_en;
  const countryAr = country.name_ar || country.name_en;
  const offset = getUtcOffsetStr(city.timezone);
  const cityUtilityLinks = [
    {
      href: `/mwaqit-al-salat/${countrySlug}/${citySlug}`,
      label: `مواقيت الصلاة في ${cityAr}`,
      description: `صفحة أوقات الصلاة اليوم في ${cityAr} مع الفجر والظهر والعصر والمغرب والعشاء.`,
    },
    {
      href: `/time-now/${countrySlug}`,
      label: `الوقت الان في ${countryAr}`,
      description: `انتقل إلى العاصمة والمدن الكبرى الأخرى داخل ${countryAr} من صفحة الدولة الأساسية.`,
    },
    {
      href: `/date/country/${countrySlug}`,
      label: `التاريخ اليوم في ${countryAr}`,
      description: `اعرف التاريخ الهجري والميلادي اليوم في ${countryAr} مع سياق الدولة المحلي.`,
    },
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: `قارن توقيت ${cityAr} مع أي مدينة أخرى بسرعة داخل أداة فرق التوقيت.`,
    },
  ];

  /* ── JSON-LD SCHEMAS ─────────────────────────────────────────── */
  const cityPageId = `${BASE}/time-now/${countrySlug}/${citySlug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${cityPageId}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'الوقت الان', item: `${BASE}/time-now` },
      { '@type': 'ListItem', position: 3, name: `الوقت في ${countryAr}`, item: `${BASE}/time-now/${countrySlug}` },
      { '@type': 'ListItem', position: 4, name: `الوقت في ${cityAr}`, item: cityPageId },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${cityPageId}#webpage`,
    name: `الوقت الان في ${cityAr}، ${countryAr}`,
    url: cityPageId,
    description: `الوقت الحالي في ${cityAr} بدقة حتى الثانية مع التاريخ المحلي، فرق UTC ${offset}، منطقة IANA، حالة التوقيت الصيفي، وروابط الصلاة وفرق التوقيت.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${cityPageId}#breadcrumb` },
    about: { '@id': `${cityPageId}#place` },
  };

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'City',
    '@id': `${cityPageId}#place`,
    name: city.name_en || cityAr,
    alternateName: cityAr,
    url: cityPageId,
    containedInPlace: {
      '@type': 'Country',
      name: country.name_en || countryAr,
      alternateName: countryAr,
    },
    ...(city.lat && city.lon ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: Number(city.lat),
        longitude: Number(city.lon),
      },
    } : {}),
  };

  /* ── RENDER ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <JsonLd data={[breadcrumbSchema, webPageSchema, placeSchema]} />

      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main>

        {/* ══ BREADCRUMB ══════════════════════════════════════════ */}
        <nav aria-label="مسار التنقل" className={`container mx-auto px-4 ${routeStyles.breadcrumb}`}>
          <ol className={routeStyles.breadcrumbList}>
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/time-now', label: 'الوقت الان' },
              { href: `/time-now/${countrySlug}`, label: countryAr },
            ].map((item, i) => (
              <li key={i} className={routeStyles.breadcrumbItem}>
                <Link href={item.href} className={routeStyles.breadcrumbLink}>{item.label}</Link>
                <ChevronLeft size={12} className={routeStyles.breadcrumbChevron} aria-hidden />
              </li>
            ))}
            <li aria-current="page" className={routeStyles.breadcrumbCurrent}>{cityAr}</li>
          </ol>
        </nav>

        {/* ══ HERO ════════════════════════════════════════════════ */}
        <section aria-labelledby="city-time-h1" className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
          <div className={routeStyles.heroInner}>
            <div className={routeStyles.heroCopy}>
              <h1 id="city-time-h1" className={routeStyles.heroTitle}>
                الوقت الآن في <span className="text-accent">{cityAr}</span>، {countryAr}
              </h1>
              <p className={routeStyles.heroLead}>
                الوقت الآن في {cityAr}، {countryAr} هو التوقيت المحلي المرتبط بالمنطقة {city.timezone} وإزاحة {offset || city.timezone}. ستجد الساعة الحية والتاريخ، ثم مواقيت الصلاة وفرق التوقيت ومدن {countryAr} الأخرى.
              </p>
            </div>

            <div className={routeStyles.searchWrap}>
              <SearchCity mode="time-now" />
            </div>

            <div className={routeStyles.clockWrap}>
              <Suspense fallback={<div className={routeStyles.heroClockFallback} aria-hidden />}>
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
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.summaryBand}`}>
          <div className={routeStyles.summaryGrid}>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>الدولة المرجعية</p>
              <p className={routeStyles.summaryValue}>{countryAr}</p>
              <p className={routeStyles.summaryCopy}>
                المدينة هي المرجع العملي عندما يكون السؤال عن صلاة، رحلة، أو موعد في مكان محدد.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>المنطقة الزمنية</p>
              <p className={`${routeStyles.summaryValue} ${routeStyles.summaryValueLtr}`}>{offset || city.timezone}</p>
              <p className={routeStyles.summaryCopy}>
                فرق UTC الحالي واضح الآن، لكن الموعد المستقبلي يحتاج مراجعة التوقيت الصيفي للطرفين.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>الفائدة العملية</p>
              <p className={routeStyles.summaryValue}>وقت + صلاة + مقارنة</p>
              <p className={routeStyles.summaryCopy}>
                انتقل إلى الصلاة أو فرق التوقيت أو التاريخ من نفس الصفحة بدون إعادة إدخال المدينة.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-2">
          <AdTopBanner slotId={`top-time-city-${countrySlug}-${citySlug}`} />
        </section>

        <Suspense fallback={<CityTimePageSectionsFallback />}>
          <CityTimePageSections
            city={city}
            cityAr={cityAr}
            citySlug={citySlug}
            cityUtilityLinks={cityUtilityLinks}
            country={country}
            countryAr={countryAr}
            countrySlug={countrySlug}
            offset={offset}
          />
        </Suspense>

        </main>
      </AdLayoutWrapper>
      <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
    </div>
  );
}

async function CityTimePageSections({
  city,
  cityAr,
  citySlug,
  cityUtilityLinks,
  country,
  countryAr,
  countrySlug,
  offset,
}) {
  try {
    const [nowIso, siblingCities, allCountries] = await Promise.all([
      getCachedNowIso(),
      getTopCitiesByCountry(country.country_code, 8),
      getAllCountries(),
    ]);
    const safeSiblingCities = Array.isArray(siblingCities)
      ? siblingCities.filter(isValidCityRecord)
      : [];
    const visibleSiblingCities = safeSiblingCities.filter(c => c.city_slug !== citySlug);
    const safeAllCountries = Array.isArray(allCountries) ? allCountries : [];
    const timeFacts = getTimeNowSeoFacts({
      timezone: city.timezone,
      utcOffset: offset,
      referenceDateOrIso: nowIso,
      placeAr: cityAr,
    });
    const solarFacts = getSolarPrayerFacts({
      lat: city.lat,
      lon: city.lon,
      timezone: city.timezone,
      date: new Date(nowIso),
      countryCode: country.country_code,
      cacheKey: `time-now::${countrySlug}::${citySlug}::solar`,
    });
    const callTimeWindows = buildCallTimeWindows(city.timezone, nowIso);
    const sameOffsetCountries = getCountriesSharingCurrentOffset(safeAllCountries, {
      referenceTimezone: city.timezone,
      referenceDateOrIso: nowIso,
      excludeCountrySlug: countrySlug,
    });
    const safeSameOffsetCountries = Array.isArray(sameOffsetCountries)
      ? sameOffsetCountries.filter(isValidCountryOffsetEntry)
      : [];
    const builtFaqItems = buildCityTimeNowFaqItems({
      countryAr,
      countrySlug,
      cityAr,
      timezone: city.timezone,
      utcOffset: offset,
      referenceDateOrIso: nowIso,
    });
    const faqItems = Array.isArray(builtFaqItems) ? builtFaqItems.filter(isValidFaqItem) : [];
    const relatedOffsetCountriesText = safeSameOffsetCountries
      .slice(0, 3)
      .map((entry) => entry.country_name_ar || entry.country_name_en)
      .filter(Boolean)
      .join('، ');
    return (
      <>
        <section
          aria-labelledby="city-time-answer-heading"
          className={`container mx-auto px-4 ${routeStyles.sectionBand}`}
        >
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 id="city-time-answer-heading" className={routeStyles.sectionTitle}>
                ملخص التوقيت المحلي في {cityAr}
              </h2>
              <p className={routeStyles.sectionCopy}>
                هذا هو الجزء الذي تحتاجه قبل مقارنة موعد أو حجز رحلة: التاريخ المحلي، فرق UTC،
                حالة التوقيت الصيفي، ومعه الشروق والغروب عندما تتوفر إحداثيات المدينة.
              </p>
            </div>
            <div className={routeStyles.insightGrid}>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>اليوم المحلي</span>
                <h3>التاريخ في {cityAr}</h3>
                <p>
                  {timeFacts.gregorianDateAr ? (
                    <>
                      اليوم هو <strong>{timeFacts.gregorianDateAr}</strong>
                      {timeFacts.hijriDateAr ? <>، وبالهجري <strong>{timeFacts.hijriDateAr}</strong>.</> : '.'}
                    </>
                  ) : (
                    <>تُعرض الساعة حسب التاريخ المحلي للمدينة، لا حسب توقيت جهازك أو بلدك الحالي.</>
                  )}
                </p>
              </article>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>UTC وDST</span>
                <h3>منطقة IANA الرسمية</h3>
                <p>
                  المنطقة الزمنية هي <strong dir="ltr">{city.timezone}</strong> والإزاحة الحالية <strong dir="ltr">{timeFacts.offsetLabel}</strong>.
                  {' '}{timeFacts.hasDst ? 'تتغير الإزاحة خلال السنة، لذلك راجع التاريخ قبل المواعيد المستقبلية.' : 'لا يظهر تغير بين يناير ويوليو في بيانات هذا العام.'}
                </p>
              </article>
              {solarFacts ? (
                <article className={routeStyles.insightCard}>
                  <span className={routeStyles.insightKicker}>الشمس اليوم</span>
                  <h3>الشروق والغروب</h3>
                  <p>
                    الشروق في {cityAr} عند <strong>{solarFacts.sunriseLabel}</strong> والغروب عند <strong>{solarFacts.sunsetLabel}</strong>
                    {solarFacts.dayLengthLabel ? `، وطول النهار تقريباً ${solarFacts.dayLengthLabel}.` : '.'}
                  </p>
                </article>
              ) : null}
              {callTimeWindows.length > 0 && (
                <article className={routeStyles.insightCard}>
                  <span className={routeStyles.insightKicker}>الاتصال من العالم العربي</span>
                  <h3>أفضل وقت للتواصل</h3>
                  <p>
                    لتصل مكالمتك في ساعات الدوام بـ{cityAr}، اتصل:{' '}
                    {callTimeWindows.map((w, i) => (
                      <span key={w.cityAr}>
                        <strong>{w.cityAr}</strong>{' '}{w.windowStart}–{w.windowEnd}
                        {i < callTimeWindows.length - 1 ? '، ' : '.'}
                      </span>
                    ))}
                  </p>
                </article>
              )}
            </div>
          </div>
        </section>

        {visibleSiblingCities.length > 0 && (
          <section
            aria-labelledby="cities-grid-h2"
            className={`container mx-auto px-4 ${routeStyles.sectionBand}`}
          >
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHeadRow}>
                <div className={routeStyles.sectionHead}>
                  <h2 id="cities-grid-h2" className={routeStyles.sectionTitle}>
                    مدن {countryAr} الأخرى
                  </h2>
                  <p className={routeStyles.sectionCopy}>
                    إذا لم تكن هذه المدينة هي وجهتك النهائية، فانتقل منها إلى مدن الدولة الأخرى من هنا بدلاً من البدء ببحث جديد.
                  </p>
                </div>
                <Link href={`/time-now/${countrySlug}`} className={routeStyles.sectionAction}>
                  عرض الكل ←
                </Link>
              </div>
              <Suspense fallback={<div className={`${routeStyles.boxSkeleton} ${routeStyles.cityCardSkeleton}`} aria-hidden />}>
                <CountryCitiesGrid
                  cities={visibleSiblingCities}
                  countrySlug={countrySlug}
                  activeCitySlug={citySlug}
                />
              </Suspense>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4">
          <AdInArticle slotId={`mid-time-city-${countrySlug}-${citySlug}-1`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <TimezoneInfoCard
              ianaTimezone={city.timezone}
              countryAr={countryAr}
              cityAr={cityAr}
              utcOffset={offset}
              nowIso={nowIso}
            />
          </div>
        </section>

        <section aria-labelledby="city-time-use-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 id="city-time-use-heading" className={routeStyles.sectionTitle}>
                كيف تستخدم وقت {cityAr} دون خطأ؟
              </h2>
              <p className={routeStyles.sectionCopy}>
                السؤال ليس دائماً “كم الساعة؟”. أحياناً تريد معرفة هل الوقت مناسب للاتصال، هل أذان المدينة قريب، أو هل موعد العمل سيقع في يوم مختلف عند الطرف الآخر.
              </p>
            </div>

            <div className={routeStyles.insightGrid}>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>صلاة ويوم محلي</span>
                <h3>عندما يكون القرار داخل {cityAr}</h3>
                <p>
                  ابدأ بالوقت والتاريخ هنا، ثم افتح مواقيت الصلاة في {cityAr}. هذا أدق من الاعتماد على صفحة الدولة عندما يكون سؤالك عن الفجر أو المغرب أو بداية اليوم المحلي.
                </p>
              </article>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>اجتماع أو مكالمة</span>
                <h3>عندما يكون الطرف الآخر في مدينة ثانية</h3>
                <p>
                  استخدم حاسبة فرق التوقيت بدلاً من الحساب الذهني. أدخل {cityAr} والمدينة الثانية، ثم راجع التاريخ لأن الموعد قد ينتقل إلى اليوم السابق أو التالي.
                </p>
              </article>
              <article className={routeStyles.insightCard}>
                <span className={routeStyles.insightKicker}>سفر وحجز</span>
                <h3>عندما تخطط لرحلة أو حجز</h3>
                <p>
                  افحص وقت المغادرة والوصول حسب المدينة، لا حسب الدولة فقط. مناطق IANA مثل {city.timezone} تساعد التطبيقات على التعامل مع DST تلقائياً.
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

        <section aria-labelledby="city-time-rules-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2 id="city-time-rules-heading">
                قاعدة مقارنة المواعيد من {cityAr}
              </h2>
              <p>
                إذا كان موعدك اليوم، فابدأ من الساعة الحية في أعلى الصفحة. إذا كان موعدك بعد أيام أو أسابيع، فاجعل السؤال أدق: ما تاريخ الموعد؟ وما المدينة الثانية؟ وهل يطبق أحد الطرفين توقيتاً صيفياً في ذلك التاريخ؟
              </p>
              <p>
                فرق UTC الحالي في {cityAr} هو <strong>{offset || timeFacts.offsetLabel}</strong> والمنطقة الزمنية هي <strong>{city.timezone}</strong>. هذه معلومات كافية لفهم الوضع الحالي، لكنها لا تكفي وحدها لكل المواعيد المستقبلية لأن بعض المدن تغيّر إزاحتها موسمياً.
              </p>
              <ul className={routeStyles.ruleList}>
                <li>للمكالمة الآن: راجع الساعة الحالية ثم قارِن الطرف الآخر في أداة فرق التوقيت.</li>
                <li>للصلاة: افتح مواقيت الصلاة في {cityAr} لأن وقت الصلاة مرتبط بالمدينة لا باسم الدولة فقط.</li>
                <li>للسفر: استخدم اسم المدينة والمنطقة الزمنية في الحجز، وراجع التاريخ المحلي عند الوصول.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <TimeNowFAQ
              placeLabelAr={cityAr}
              introText={`إجابات عملية حول الوقت المحلي في ${cityAr}، التاريخ اليوم، UTC، التوقيت الصيفي، ومتى تحتاج صفحة المدينة بدلاً من صفحة الدولة.`}
              items={faqItems}
            />
          </div>
        </section>

        <section aria-labelledby="city-time-sources-heading" className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 id="city-time-sources-heading" className={routeStyles.sectionTitle}>
                مصادر لفهم توقيت {cityAr}
              </h2>
              <p className={routeStyles.sectionCopy}>
                هذه مصادر تفسيرية لمفاهيم IANA وUTC وDST. لا تُستخدم في جلب الساعة أثناء عرض الصفحة، لكنها تساعدك على فهم سبب تغير الفروق بين المدن في بعض الفصول.
              </p>
            </div>
            <div className={routeStyles.sourceGrid}>
              {CITY_TIME_SOURCE_LINKS.map((source) => (
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
            <RelatedSearches
              currentCountrySlug={countrySlug}
              currentCityAr={cityAr}
            />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <GeoInternalLinks
              title={`خطوات تكمل وقت ${cityAr}`}
              description={`بعد معرفة الساعة في ${cityAr}، اختر المسار الذي يكمّل سؤالك: مواقيت الصلاة لليوم، تاريخ ${countryAr} المحلي، صفحة الدولة، أو مقارنة الوقت مع مدينة أخرى.`}
              links={cityUtilityLinks}
              ariaLabel={`خطوات تكمل وقت ${cityAr}`}
            />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>متى تعتمد على وقت {cityAr} ومتى تحتاج مقارنة؟</h2>

              <p>
                <strong>{cityAr}</strong> هي إحدى مدن{' '}
                <Link href={`/time-now/${countrySlug}`} className="text-accent hover:underline">{countryAr}</Link>،
                وتتبع المنطقة الزمنية <strong>{city.timezone}</strong> وهي{' '}
                <strong>{offset}</strong> من التوقيت العالمي المنسق (UTC).
                {` ${timeFacts.utcRelationSentence}`} إذا كان موعدك داخل المدينة نفسها، فالساعة الحية في أعلى الصفحة تكفي كبداية واضحة.
              </p>

              <p>
                {timeFacts.gregorianDateAr ? (
                  <>
                    التاريخ المحلي اليوم في {cityAr} هو{' '}
                    <strong>{timeFacts.gregorianDateAr}</strong>
                    {timeFacts.hijriDateAr ? (
                      <>
                        {' '}وبالهجري{' '}
                        <strong>{timeFacts.hijriDateAr}</strong>.
                      </>
                    ) : '.'}
                  </>
                ) : (
                  <>
                    يتضمن عرض الوقت <strong>التاريخ اليوم</strong> بالتقويم
                    الميلادي والهجري (تقويم أم القرى) وفق المنطقة الزمنية المحلية.
                  </>
                )}{' '}
                لكن إذا كان الموعد مع مدينة أخرى، فلا تعتمد على حفظ فرق الساعات من الذاكرة. استخدم حاسبة فرق التوقيت حتى تراعي التاريخ والتوقيت الصيفي.
              </p>
              <p>
                تجد في الصفحة أيضاً مسارات إلى الصلاة والتاريخ ومدن أخرى داخل {countryAr}
                {relatedOffsetCountriesText ? `، وإلى دول تشترك اليوم في نفس الإزاحة مثل ${relatedOffsetCountriesText}` : ''}
                . بهذا تصبح الصفحة مفيدة للتخطيط لمكالمة أو سفر أو متابعة يومية، لا مجرد سطر ساعة معزول.
              </p>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <AdMultiplex slotId={`end-time-city-${countrySlug}-${citySlug}`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <SiteTrustPanel panel="time" />
          </div>
        </section>
      </>
    );
  } catch (error) {
    logger.error('time-now-city-support-sections-failed', {
      citySlug,
      countryCode: country.country_code,
      countrySlug,
      route: `/time-now/${countrySlug}/${citySlug}`,
      timezone: city.timezone,
      degraded: true,
      error: serializeError(error),
    });

    return (
      <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
        <DeferredSectionNotice
          title={`تعذر تحميل التفاصيل الإضافية الخاصة بمدينة ${cityAr}`}
          description={`ما زال الوقت الأساسي في ${cityAr} ومسارات الانتقال المهمة متاحة، لكن قسم المدن الأخرى والشرح التفصيلي لم يكتمل بعد. تم تسجيل المشكلة في السجل لتظهر بوضوح في staging وقبل أي نشر جديد.`}
        />
        <div className="mt-6">
          <div className={routeStyles.sectionPanel}>
            <GeoInternalLinks
              title={`خطوات تكمل وقت ${cityAr}`}
              description={`بعد معرفة الساعة في ${cityAr}، اختر مواقيت الصلاة، تاريخ ${countryAr} المحلي، صفحة الدولة، أو مقارنة الوقت مع مدينة أخرى.`}
              links={cityUtilityLinks}
              ariaLabel={`خطوات تكمل وقت ${cityAr}`}
            />
          </div>
        </div>
      </section>
    );
  }
}

function CityTimePageSectionsFallback() {
  return (
    <div className={routeStyles.fallbackStack}>
      <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-hidden="true">
        <div className={routeStyles.sectionPanel}>
          <div className={routeStyles.sectionHeadRow}>
            <Skeleton className={`${routeStyles.titleSkeleton} ${routeStyles.lineSkeleton}`} />
            <Skeleton className={`${routeStyles.miniActionSkeleton} ${routeStyles.lineSkeleton}`} />
          </div>
          <div className={routeStyles.fallbackGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`time-now-city-grid-${index}`}
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
                key={`time-now-city-faq-${index}`}
                className={`${routeStyles.faqItemSkeleton} ${routeStyles.boxSkeleton}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
