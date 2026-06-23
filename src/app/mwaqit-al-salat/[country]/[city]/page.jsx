/**
 * app/mwaqit-al-salat/[country]/[city]/page.jsx
 *
 * ARCHITECTURE:
 *  - Page shell (static, ISR-cached): renders header, breadcrumb, search.
 *  - PrayerTimesContent (ISR-cached + client countdown): calculates prayer times
 *    without request headers so the route stays cacheable on Vercel.
 *
 * SEO: WebPage + Place + FAQPage JSON-LD schemas, rich keywords, canonical URL.
 */

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock3, MapPin, Moon, Sunrise, Sun, Sunset } from 'lucide-react';
import { getPriorityCityParams, getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import {
  calculatePrayerTimes,
  calculateAsrComparison,
  getNextPrayer,
  formatTime,
} from '@/lib/prayerEngine';
import { getMethodByCountry } from '@/lib/prayer-methods';

import PrayerHeroClient from '@/components/PrayerHero.client';
import PrayerTimeline from '@/components/mwaqit/PrayerTimeline.client';
import SearchCity from '@/components/SearchCityWrapper.client';
import MonthlyPrayerCalendar from '@/components/mwaqit/MonthlyPrayerCalendar';
import CalendarSeoBlock from '@/components/mwaqit/CalendarSeoBlock';
import MadhabSelector from '@/components/mwaqit/MadhabSelector.client';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import QiblaCompass from '@/components/mwaqit/QiblaCompass.client';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { JsonLd } from '@/components/seo/JsonLd';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { Skeleton } from '@/components/ui/skeleton';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import { getSiteUrl } from '@/lib/site-config';
import { getCachedNowIso } from '@/lib/date-utils';
import { formatGregorianLabel, getHijriMonthSpanFromDate } from '@/lib/hijri-utils';
import {
  getQiblaBearingDegrees,
  getQiblaBearingLabel,
  getSolarPrayerFacts,
} from '@/lib/solar-prayer-facts';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCityParams,
} from '@/lib/seo/country-indexing';
import { buildPrayerKeywords } from '@/lib/seo/section-search-intent';
import { buildNoindexRouteMetadata, isRouteSlug } from '@/lib/route-param-validation';
import { logger, serializeError } from '@/lib/logger';
// ─── ISR: pre-build bridge-priority cities, revalidate hourly ───────────────

const BASE = getSiteUrl();

const CITY_PRAYER_SOURCE_LINKS = [
  {
    href: 'https://github.com/batoulapps/adhan-js',
    label: 'Adhan.js',
    description: 'يوضح منطق حساب أوقات الصلاة من الإحداثيات وطريقة الحساب واختيار العصر.',
  },
  {
    href: 'https://pray.zone/calculations',
    label: 'Pray.Zone: طرق الحساب',
    description: 'مرجع يشرح زوايا الفجر والعشاء، المذهب في العصر، والتعامل مع اختلاف طرق الحساب.',
  },
  {
    href: 'https://zaman.today/en',
    label: 'Zaman Today',
    description: 'مرجع مقارنة لمواقيت المدن والمنطقة الزمنية، مفيد عند مراجعة اختلاف مدينة عن أخرى.',
  },
];

function buildCityPrayerSchemaFaqItems(cityNameAr, countryNameAr, methodLabel, timezone) {
  return [
    {
      question: `هل مواقيت الصلاة في ${cityNameAr} تكفي للاستخدام اليومي؟`,
      answer: `نعم إذا كنت داخل ${cityNameAr} أو قريباً منها وتحتاج تخطيط اليوم، لكن جدول المسجد أو الجهة المحلية يبقى مرجعك العملي للصلاة والجماعة إذا أعلن وقتاً مختلفاً.`,
    },
    {
      question: `لماذا قد تختلف مواقيت ${cityNameAr} عن تطبيق آخر؟`,
      answer: `الاختلاف غالباً ينتج عن طريقة الحساب، زوايا الفجر والعشاء، اختيار العصر، المنطقة الزمنية ${timezone}، أو اختلاف الإحداثيات المستخدمة للمدينة.`,
    },
    {
      question: `ما طريقة الحساب المستخدمة في ${cityNameAr}؟`,
      answer: `تعرض الصفحة طريقة الحساب ${methodLabel} ضمن سياق ${countryNameAr}. راجع هذا الإعداد قبل مقارنة الفجر أو العشاء أو العصر مع أي تطبيق آخر.`,
    },
    {
      question: `هل يمكن الاعتماد على لقطة شاشة قديمة لمواقيت ${cityNameAr}؟`,
      answer: 'لا. مواقيت الصلاة تتغير يومياً مع حركة الشمس وطول النهار، لذلك افتح الصفحة في نفس اليوم أو راجع الجدول الشهري بدلاً من الاعتماد على صورة محفوظة.',
    },
    {
      question: 'ما الفرق بين وقت الفجر ووقت الشروق؟',
      answer: 'الفجر هو بداية وقت صلاة الفجر، أما الشروق فهو نهاية وقت الفجر وبداية طلوع الشمس. لا تتعامل مع الشروق كأنه وقت بديل للفجر.',
    },
  ];
}

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
  return getPriorityCityParams(24);
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) {
    return buildNoindexRouteMetadata({
      title: 'رابط مدينة غير صالح في مواقيت الصلاة',
      description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
      canonical: '/mwaqit-al-salat',
    });
  }

  try {
    const country = await getCountryBySlug(countrySlug);
    if (!country) return {};
    const cityData = await getCityBySlug(country.country_code, citySlug);
    if (!cityData) return {};

    const cityNameAr = cityData.name_ar || cityData.name_en;
    const countryNameAr = country.name_ar || country.name_en;
    const methodInfo = getMethodByCountry(country.country_code);
    const policy = GEO_ROUTE_INDEXING_POLICIES.prayerTimes;
    const isIndexableCity = isSeoIndexableCityParams(
      { country: countrySlug, city: citySlug },
      { countryScope: policy.countryScope, cityScope: policy.cityScope },
    );

    const nowIso = await getCachedNowIso();
    const todayTimes = calculatePrayerTimes({
      lat: cityData.lat, lon: cityData.lon,
      timezone: cityData.timezone, date: new Date(nowIso),
      countryCode: country.country_code,
      cacheKey: `meta::${countrySlug}::${citySlug}`,
    });
    const fajrStr = todayTimes ? formatTime(todayTimes.fajr, cityData.timezone) : null;
    const maghribStr = todayTimes ? formatTime(todayTimes.maghrib, cityData.timezone) : null;

    const titleWithTimes = fajrStr && maghribStr
      ? `مواقيت الصلاة في ${cityNameAr} اليوم — الفجر ${fajrStr} والمغرب ${maghribStr}`
      : `مواقيت الصلاة في ${cityNameAr} اليوم — الفجر والمغرب والجدول الشهري`;
    const title = titleWithTimes.length <= 80 ? titleWithTimes
      : `مواقيت الصلاة في ${cityNameAr} اليوم — الفجر والمغرب والجدول الشهري`;

    const description = fajrStr && maghribStr
      ? `الفجر ${fajrStr} — المغرب ${maghribStr} في ${cityNameAr} اليوم. مواقيت الصلاة الخمس: الظهر والعصر والعشاء، الصلاة القادمة، الجدول الشهري، وطريقة ${methodInfo.label}.`
      : `اعرف مواقيت الصلاة في ${cityNameAr}، ${countryNameAr} اليوم: الفجر والظهر والعصر والمغرب والعشاء، الصلاة القادمة، وطريقة الحساب والجدول الشهري.`;
    const canonical = `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}`;

    return {
      title,
      description,
      keywords: buildPrayerKeywords({
        countryAr: countryNameAr,
        countryEn: country.name_en,
        cityAr: cityNameAr,
        cityEn: cityData.name_en,
        methodLabel: methodInfo.label,
      }),
      alternates: { canonical },
      openGraph: {
        title, description, type: 'website', locale: 'ar_SA', url: canonical,
        images: [{
          url: `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `مواقيت الصلاة في ${cityNameAr}`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}/opengraph-image`],
      },
      robots: {
        index: isIndexableCity,
        follow: true,
        googleBot: {
          index: isIndexableCity,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
        },
      },
    };
  } catch (error) {
    logger.error('prayer-city-metadata-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}/${citySlug}`,
      countrySlug,
      citySlug,
      error: serializeError(error),
    });
    return {
      title: 'مواقيت الصلاة حسب المدينة',
      description: 'اعرف مواقيت الصلاة حسب المدينة مع الصفحات المرتبطة بالوقت والتاريخ والدولة داخل ميقاتنا.',
      alternates: { canonical: `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}` },
    };
  }
}

// ─── Prayer labels ────────────────────────────────────────────────────────────
const PRAYER_AR = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
};

const PRAYER_ICON = {
  fajr: Moon,
  sunrise: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

// ─── Page shell (statically cached) ──────────────────────────────────────────
export default async function PrayerTimesPage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) notFound();

  let country;
  try {
    country = await getCountryBySlug(countrySlug);
  } catch (error) {
    logger.error('prayer-city-country-lookup-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}/${citySlug}`,
      countrySlug,
      citySlug,
      error: serializeError(error),
    });
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات المدينة الآن"
        title="صفحة مواقيت الصلاة لهذه المدينة متوقفة مؤقتاً"
        description="تعذر تحميل بيانات الدولة أو المدينة في هذه اللحظة، لذلك عرضنا لك بديلاً واضحاً بدلاً من ترك الصفحة تنهار بخطأ خادم."
        primaryLink={{
          href: '/mwaqit-al-salat',
          label: 'افتح قسم مواقيت الصلاة',
          description: 'ابدأ من القسم الرئيسي ثم ابحث عن مدينة أو دولة أخرى مباشرة.',
        }}
        secondaryLinks={[
          {
            href: `/time-now/${countrySlug}`,
            label: 'افتح الوقت الان',
            description: 'انتقل إلى الوقت الحالي للدولة إذا كان هدفك الوصول إلى السياق الزمني السريع.',
          },
          {
            href: '/date',
            label: 'افتح قسم التاريخ',
            description: 'راجع التاريخ اليوم وأدوات التحويل والتقويم من مسار التاريخ الرئيسي.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'استخدم فهرس الصفحات للوصول إلى أقرب مسار مرتبط بالمدينة أو الدولة.',
          },
        ]}
      />
    );
  }
  if (!country) notFound();
  let cityData;
  try {
    cityData = await getCityBySlug(country.country_code, citySlug);
  } catch (error) {
    logger.error('prayer-city-page-data-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}/${citySlug}`,
      countrySlug,
      citySlug,
      countryCode: country.country_code,
      error: serializeError(error),
    });
    return (
        <RouteUnavailableState
          eyebrow="تعذر تحميل المدينة المطلوبة الآن"
          title="بيانات الصلاة لهذه المدينة غير متاحة مؤقتاً"
          description="الخلل حدث قبل اكتمال تحميل بيانات المدينة، لذلك أوقفنا الانهيار الكامل وتركنا لك مسارات عملية للرجوع إلى القسم أو الدولة أو الصفحات المرتبطة."
        primaryLink={{
          href: `/mwaqit-al-salat/${countrySlug}`,
          label: 'افتح صفحة الدولة',
          description: 'قد تتمكن من متابعة العاصمة والمدن الكبرى من صفحة الدولة الأساسية.',
        }}
        secondaryLinks={[
          {
            href: '/mwaqit-al-salat',
            label: 'افتح قسم مواقيت الصلاة',
            description: 'ابدأ من القسم الرئيسي ثم ابحث عن مدينة أخرى أو أعد المحاولة لاحقاً.',
          },
          {
            href: `/time-now/${countrySlug}/${citySlug}`,
            label: 'جرّب صفحة الوقت الان',
            description: 'قد تكون صفحة الوقت متاحة حتى لو تعذر تحميل بيانات الصلاة في هذه اللحظة.',
          },
          {
            href: '/date',
            label: 'افتح قسم التاريخ',
            description: 'الوصول السريع إلى التاريخ والتقويم والتحويل من المسار الرئيسي.',
          },
        ]}
      />
    );
  }
  if (!cityData) notFound();

  const cityNameAr    = cityData.name_ar || cityData.name_en;
  const countryNameAr = country.name_ar  || country.name_en;
  const methodInfo = getMethodByCountry(country.country_code);
  const citySchemaFaqItems = buildCityPrayerSchemaFaqItems(
    cityNameAr,
    countryNameAr,
    methodInfo.label,
    cityData.timezone,
  );
  const utilityLinks = [
    {
      href: `/time-now/${countrySlug}/${citySlug}`,
      label: `الوقت الان في ${cityNameAr}`,
      description: `اعرف الساعة الحالية والتاريخ اليوم في ${cityNameAr} من صفحة الوقت المباشرة.`,
    },
    {
      href: `/time-now/${countrySlug}`,
      label: `الوقت الان في ${countryNameAr}`,
      description: `انتقل إلى العاصمة والمدن الأخرى داخل ${countryNameAr} من صفحة الدولة الأساسية.`,
    },
    {
      href: `/date/country/${countrySlug}`,
      label: `التاريخ اليوم في ${countryNameAr}`,
      description: `راجع التاريخ الهجري والميلادي اليوم في ${countryNameAr} ضمن سياق الدولة المحلي.`,
    },
    {
      href: '/date/today/hijri',
      label: 'التاريخ الهجري اليوم',
      description: 'انتقل إلى صفحة التاريخ الهجري اليوم والتحويلات المرتبطة بها.',
    },
    {
      href: '/time-difference',
      label: `فرق التوقيت من ${cityNameAr}`,
      description: `قارن توقيت ${cityNameAr} مع أي مدينة عربية أو عالمية في الوقت الفعلي.`,
    },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}#breadcrumb`,
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
    description: `مواقيت الصلاة في ${cityNameAr} اليوم للفجر والظهر والعصر والمغرب والعشاء، مع الصلاة القادمة وطريقة الحساب والمنطقة الزمنية والجدول الشهري.`,
    inLanguage: 'ar',
    breadcrumb: { '@id': `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}#breadcrumb` },
    about: { '@id': `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}#place` },
  };

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'City',
    '@id': `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}#place`,
    name: cityData.name_en || cityNameAr,
    alternateName: cityNameAr,
    url: `${BASE}/mwaqit-al-salat/${countrySlug}/${citySlug}`,
    containedInPlace: {
      '@type': 'Country',
      name: country.name_en || countryNameAr,
      alternateName: countryNameAr,
    },
    ...(cityData.lat && cityData.lon ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: Number(cityData.lat),
        longitude: Number(cityData.lon),
      },
    } : {}),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: citySchemaFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-base" dir="rtl" lang="ar">
      <JsonLd data={[breadcrumbSchema, webPageSchema, placeSchema, faqSchema]} />

      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main>
        <nav aria-label="مسار التنقل" className={`container mx-auto px-4 ${routeStyles.breadcrumb}`}>
          <ol className={routeStyles.breadcrumbList}>
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
              { href: `/mwaqit-al-salat/${countrySlug}`, label: countryNameAr },
            ].map((item) => (
              <li key={item.href} className={routeStyles.breadcrumbItem}>
                <Link href={item.href} className={routeStyles.breadcrumbLink}>{item.label}</Link>
                <ChevronLeft size={12} className={routeStyles.breadcrumbChevron} aria-hidden />
              </li>
            ))}
            <li aria-current="page" className={routeStyles.breadcrumbCurrent}>{cityNameAr}</li>
          </ol>
        </nav>

        <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
          <div className={routeStyles.heroInner}>
            <div className={routeStyles.heroCopy}>
              <h1 className={routeStyles.heroTitle}>
                مواقيت الصلاة في <span className="text-accent">{cityNameAr}</span> اليوم
              </h1>
              <p className={routeStyles.heroLead}>
                مواقيت الصلاة في {cityNameAr}، {countryNameAr} اليوم تشمل الفجر والظهر والعصر
                والمغرب والعشاء، مع الصلاة القادمة والجدول الشهري وطريقة الحساب المحلية. راجع
                جدول مسجدك إذا أعلن موعداً مختلفاً للأذان أو الإقامة.
              </p>
              <div className={routeStyles.heroMeta}>
                <span className={routeStyles.metaPill}>
                  <MapPin size={14} />
                  {cityNameAr}، {countryNameAr}
                </span>
                <span className={routeStyles.metaPill}>
                  <Clock3 size={14} />
                  <strong>{cityData.timezone}</strong>
                </span>
                <span className={routeStyles.metaPill}>
                  <Clock3 size={14} />
                  طريقة الحساب: <strong>{methodInfo.label}</strong>
                </span>
              </div>
            </div>

            <div className={routeStyles.searchWrap}>
              <SearchCity
                placeholder="البحث عن مدينة أخرى..."
                initialCity={{ ...cityData, country_slug: countrySlug, city_slug: citySlug, country_name_ar: countryNameAr, city_name_ar: cityNameAr }}
              />
              <p className="mt-2 text-[10px] font-bold text-[var(--accent)] ps-1">
                محدد حالياً: {cityNameAr}، {countryNameAr}
              </p>
            </div>

            <div className={routeStyles.heroPanel}>
              <ErrorBoundary>
                <Suspense fallback={<PrayerCityContentFallback />}>
                  <PrayerTimesContent
                    country={countrySlug}
                    city={citySlug}
                    cityData={cityData}
                    countryCode={country.country_code}
                    countryNameAr={countryNameAr}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.summaryBand}`}>
          <div className={routeStyles.summaryGrid}>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>الإجابة المباشرة</p>
              <p className={routeStyles.summaryValue}>اليوم + الصلاة القادمة</p>
              <p className={routeStyles.summaryCopy}>
                تبدأ الصفحة بالنتيجة التي تحتاجها الآن، ثم تنتقل إلى الجدول الكامل والشرح الشهري
                من دون إخفاء الطريقة أو التوقيت المحلي.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>سياق الحساب</p>
              <p className={routeStyles.summaryValue}>{methodInfo.label}</p>
              <p className={routeStyles.summaryCopy}>
                المنطقة الزمنية: <strong dir="ltr">{cityData.timezone}</strong>. وقت الصلاة لا يُقرأ صحيحاً إذا فُصل عن المدينة واليوم والسياق المحلي.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>المسار التالي</p>
              <p className={routeStyles.summaryValue}>الجدول الشهري والمسارات</p>
              <p className={routeStyles.summaryCopy}>
                بعد مواقيت اليوم ستجد فرق العصر بين المذاهب، ثم الجدول الشهري، ثم المسارات القريبة مثل الوقت الان والتاريخ.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-2">
          <AdTopBanner slotId={`top-prayer-city-${countrySlug}-${citySlug}`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>ماذا تعني مواقيت الصلاة في {cityNameAr} اليوم؟</h2>
              <p>
                هذه الصفحة لا تعرض جدولاً عاماً فقط، بل تربط مواقيت {cityNameAr} باليوم الحالي والمنطقة الزمنية
                وطريقة الحساب المستخدمة في {countryNameAr}. لذلك يمكنك استخدامها لمعرفة الصلاة القادمة الآن،
                أو مراجعة الفجر والمغرب قبل ترتيب يومك، أو فتح الجدول الشهري للتخطيط الأوسع.
              </p>
              <p>
                وقت الصلاة يتغير يومياً لأن طول النهار وموقع الشمس يتغيران على مدار السنة. لهذا قد يكون فرق الفجر
                أو المغرب بين بداية الشهر ونهايته ملحوظاً، خصوصاً في المدن البعيدة عن خط الاستواء أو في مواسم
                تغيّر التوقيت الصيفي.
              </p>
              <div className={routeStyles.threeUpGrid}>
                <article className={routeStyles.smallGuideCard}>
                  <h3 className={routeStyles.smallGuideTitle}>للصلاة القادمة</h3>
                  <p className={routeStyles.smallGuideCopy}>استخدم العداد في أعلى الصفحة لمعرفة الوقت المتبقي دون قراءة الجدول كاملاً.</p>
                </article>
                <article className={routeStyles.smallGuideCard}>
                  <h3 className={routeStyles.smallGuideTitle}>للعصر</h3>
                  <p className={routeStyles.smallGuideCopy}>راجع الفرق بين الشافعي والحنفي إذا كان مسجدك أو بلدك يعتمد اختياراً محدداً.</p>
                </article>
                <article className={routeStyles.smallGuideCard}>
                  <h3 className={routeStyles.smallGuideTitle}>للتخطيط الشهري</h3>
                  <p className={routeStyles.smallGuideCopy}>افتح جدول الشهر لملاحظة تغيّر الفجر والمغرب تدريجياً بدل الاعتماد على يوم واحد.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>لماذا تختلف صفحة المدينة عن صفحة الدولة؟</h2>
              <p>
                صفحة الدولة تصلح كبداية عندما لا تعرف الرابط الصحيح، لكنها لا تكفي إذا كنت تحتاج وقتاً دقيقاً
                في {cityNameAr}. فرق خط الطول والعرض قد يغيّر الفجر والمغرب والعشاء بين مدينة وأخرى، وفرق
                المنطقة الزمنية أو التوقيت الصيفي قد يغير قراءة اليوم بالكامل.
              </p>
              <p>
                عندما تحفظ الصفحة أو ترسلها، فأنت تحفظ معها اسم المدينة والدولة وطريقة الحساب والجدول الشهري.
                هذه التفاصيل تجعل الرابط أوثق من لقطة شاشة لوقت واحد، لأن من يفتح الصفحة لاحقاً يستطيع فهم
                السياق وتحديث اليوم مباشرة.
              </p>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>متى تحتاج التحقق المحلي في {cityNameAr}؟</h2>
              <p>
                في الأيام العادية تكفيك مواقيت {cityNameAr} لمعرفة ترتيب الصلاة خلال اليوم، لكن بعض
                الحالات تحتاج انتباهاً إضافياً: رمضان، السفر، تغيير التوقيت الصيفي، أو وجود تقويم مسجد
                محلي يضيف احتياطاً قبل الفجر أو بعد المغرب. عند هذه الحالات لا تقارن الوقت كرقم مجرد؛
                قارن المدينة، المنطقة الزمنية {cityData.timezone}، طريقة الحساب، واليوم نفسه.
              </p>
              <p>
                إذا كنت ترتب سحوراً أو إفطاراً أو موعد عمل حول الصلاة، فابدأ بالجدول الشهري ثم راجع
                وقت اليوم الحالي في أعلى الصفحة. أما إذا كان السؤال عن صلاة جماعة أو أذان مسجد محدد
                داخل {cityNameAr}، فاجعل إعلان المسجد مرجعك العملي عند وجود فرق واضح، واستخدم هذه
                الصفحة لفهم سبب الفرق وتتبعه على مدار الشهر.
              </p>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>قاعدة الاعتماد اليومي في {cityNameAr}</h2>
              <p className={routeStyles.sectionCopy}>
                عندما تجد فرقاً بين صفحة، تطبيق، مسجد، أو لقطة شاشة قديمة، لا تحتاج إلى الحيرة.
                اتبع هذه القاعدة العملية قبل الصلاة أو السفر أو ترتيب موعدك.
              </p>
            </div>
            <div className={routeStyles.contextGrid}>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>للوقت الآن</h3>
                <p className={routeStyles.contextBody}>
                  اقرأ جدول اليوم والعداد في أعلى الصفحة. هذه أفضل طريقة لمعرفة الصلاة القادمة في
                  {cityNameAr} بدل الاعتماد على صورة محفوظة من يوم سابق.
                </p>
              </article>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>للمسجد والجماعة</h3>
                <p className={routeStyles.contextBody}>
                  إذا نشر مسجدك أو الجهة المحلية جدولاً مختلفاً، فاتبعه للصلاة والجماعة. قد يكون الفرق
                  ناتجاً عن احتياط محلي أو اختيار فقهي أو طريقة حساب محددة.
                </p>
              </article>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>للشهر ورمضان</h3>
                <p className={routeStyles.contextBody}>
                  استخدم الجدول الشهري لملاحظة حركة الفجر والمغرب يوماً بعد يوم. هذا أوثق من حساب يوم
                  واحد إذا كنت ترتب السحور أو الإفطار أو دواماً متكرراً.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <GeoInternalLinks
              title={`خطوات تكمل مواقيت ${cityNameAr}`}
              description={`بعد معرفة مواقيت ${cityNameAr}، اختر المسار الأقرب لسؤالك: الوقت الان للتأكد من الساعة، التاريخ المحلي لليوم، أو صفحة الدولة إذا كنت تريد مدينة أخرى.`}
              links={utilityLinks}
              ariaLabel={`خطوات تكمل مواقيت ${cityNameAr}`}
            />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>مصادر ومنهج مواقيت {cityNameAr}</h2>
              <p className={routeStyles.sectionCopy}>
                نعتمد على حسابات مبنية على إحداثيات المدينة والمنطقة الزمنية وطريقة الحساب. هذه المراجع
                تساعدك على فهم سبب اختلاف النتائج بين المواقع والتطبيقات.
              </p>
            </div>
            <div className={routeStyles.linkGrid}>
              {CITY_PRAYER_SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  className={routeStyles.linkCard}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={routeStyles.linkLabel}>{source.label}</span>
                  <span className={routeStyles.linkDescription}>{source.description}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <AdMultiplex slotId={`end-prayer-city-${countrySlug}-${citySlug}`} className="container mx-auto px-4" />

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <SiteTrustPanel panel="prayer" />
          </div>
        </section>
        </main>
      </AdLayoutWrapper>
    </div>
  );
}

// ─── Dynamic section (per-request, inside Suspense) ──────────────────────────
async function PrayerTimesContent({ country, city, cityData, countryCode, countryNameAr }) {
  const nowIso     = await getCachedNowIso();
  const now        = new Date(nowIso);
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

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, nowIso);
  const fajrStr    = formatTime(times.fajr,    cityData.timezone);
  const maghribStr = formatTime(times.maghrib,  cityData.timezone);
  const asrStr     = formatTime(times.asr,      cityData.timezone);
  const solarFacts = getSolarPrayerFacts({
    lat: cityData.lat,
    lon: cityData.lon,
    timezone: cityData.timezone,
    date: now,
    countryCode,
    cacheKey: `${country}::${city}::solar`,
  });
  const qiblaLabel = getQiblaBearingLabel({
    lat: cityData.lat,
    lon: cityData.lon,
  });
  const qiblaBearing = getQiblaBearingDegrees({
    lat: cityData.lat,
    lon: cityData.lon,
  });

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
      a: `تُحسب المواقيت بمعادلات فلكية مبنية على إحداثيات ${cityNameAr} (${cityData.lat?.toFixed(3)}°، ${cityData.lon?.toFixed(3)}°) والمنطقة الزمنية ${cityData.timezone}، باستخدام طريقة الحساب ${methodInfo.label}.`,
    },
    {
      q: 'ما الفرق بين المذهب الشافعي والحنفي في وقت العصر؟',
      a: `الشافعية (والمالكية والحنابلة) يحسبون العصر حين يساوي ظل الشيء طوله (× 1)، أما الحنفية فيحسبونه حين يكون الظل ضعف الطول (× 2). النتيجة أن وقت العصر الحنفي يتأخر عادةً 45–90 دقيقة. ${shafiAsrStr && hanafiAsrStr ? `في ${cityNameAr} اليوم: الشافعي ${shafiAsrStr}، الحنفي ${hanafiAsrStr}.` : ''}`,
    },
    {
      q: 'ماذا أفعل إذا اختلف وقت المسجد المحلي؟',
      a: 'اتبع جدول المسجد أو الجهة المحلية للصلاة والجماعة. هذه الصفحة تساعدك على الفهم والتخطيط، لكن بعض المساجد تعتمد احتياطاً أو طريقة محلية في الفجر أو العشاء أو العصر.',
    },
    {
      q: 'هل أستطيع الاعتماد على لقطة شاشة لمواقيت أمس؟',
      a: `لا تعتمد على لقطة قديمة. مواقيت ${cityNameAr} تتحرك يومياً مع حركة الشمس، لذلك افتح الصفحة في نفس اليوم أو استخدم الجدول الشهري إذا كنت تخطط لأيام لاحقة.`,
    },
  ];

  const dhuhrStr = formatTime(times.dhuhr, cityData.timezone);
  const ishaStr  = formatTime(times.isha,  cityData.timezone);

  return (
    <>
      <section className={`${routeStyles.sectionPanel} mb-4`} aria-label={`الإجابة المباشرة — أوقات الصلاة في ${cityNameAr} اليوم`}>
        <p className={routeStyles.firstAnswerText}>
          <strong>متى أذان المغرب اليوم في {cityNameAr}؟</strong>{' '}
          أذان المغرب في {cityNameAr} اليوم {todayLabel} عند الساعة <strong>{maghribStr}</strong>،
          والفجر عند <strong>{fajrStr}</strong>، والظهر عند <strong>{dhuhrStr}</strong>،
          والعشاء عند <strong>{ishaStr}</strong>.
          المواقيت محسوبة بطريقة <strong>{methodInfo.label}</strong> بناءً على إحداثيات{' '}
          {cityNameAr} والمنطقة الزمنية <strong>{cityData.timezone}</strong>، وتتغير يومياً
          تبعاً لحركة الشمس وفصل السنة. راجع الجدول أدناه لمواقيت الصلوات الخمس كاملة،
          والتقويم الشهري لتتبع التغيّر اليومي.
        </p>
      </section>

      <section className={`mb-6 ${routeStyles.sectionPanel}`}>
        <ErrorBoundary name="PrayerCityHero">
          <PrayerHeroClient
            nextPrayerKey={nextKey}
            nextPrayerIso={nextIso}
            prevPrayerIso={prevIso}
            lat={cityData.lat}
            lon={cityData.lon}
            timezone={cityData.timezone}
            method={methodInfo.name}
            countryCode={countryCode}
          />
        </ErrorBoundary>
      </section>

      <section className={`mb-4 ${routeStyles.sectionPanel}`} aria-label="خط سير الصلوات">
        <ErrorBoundary name="PrayerTimeline">
          <PrayerTimeline
            times={{
              fajr:    times.fajr,
              sunrise: times.sunrise,
              dhuhr:   times.dhuhr,
              asr:     times.asr,
              maghrib: times.maghrib,
              isha:    times.isha,
            }}
            timezone={cityData.timezone}
            nextPrayerKey={nextKey}
          />
        </ErrorBoundary>
      </section>

      <section className={routeStyles.sectionPanel} aria-label="مواقيت الصلاة اليوم">
        <div className={routeStyles.sectionHead}>
          <h2 className={routeStyles.sectionTitle}>مواقيت الصلاة اليوم</h2>
          <p className={routeStyles.sectionCopy}>
            الجدول التالي يجيب مباشرة عن اليوم الحالي في {cityNameAr}. تظهر الصلاة القادمة داخل
            الجدول نفسه، ولا يوجد إعلان يفصل اسم الصلاة عن وقتها.
          </p>
          <p className={routeStyles.methodNote}>
            طريقة الحساب: <span className="text-accent-alt font-semibold">{methodInfo.label}</span> | {todayLabel}
          </p>
        </div>

        <div className={routeStyles.tableWrap}>
          <table className={routeStyles.table}>
            <thead>
              <tr className={routeStyles.tableHeadRow}>
                <th className={routeStyles.tableHeader}>الصلاة</th>
                <th className={routeStyles.tableHeader}>الوقت</th>
              </tr>
            </thead>
            <tbody>
          {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((key) => {
            const isoStr = times[key];
            if (!isoStr) return null;

            const isNext  = key === nextKey;
            const timeStr = formatTime(isoStr, cityData.timezone, false);
            const PrayerIcon = PRAYER_ICON[key] ?? Clock3;

            return (
              <tr key={key} className={routeStyles.tableRow}>
                <td className={`${routeStyles.tableCell} ${routeStyles.prayerNameCell}`}>
                  <span className="me-2 inline-flex text-accent-alt" aria-hidden>
                    <PrayerIcon size={16} strokeWidth={1.75} />
                  </span>
                  {PRAYER_AR[key] ?? key}
                  {isNext ? <span className={routeStyles.nextBadge}>القادمة</span> : null}
                </td>
                <td className={`${routeStyles.tableCell} ${routeStyles.prayerTimeCell}`}>
                  <time dateTime={isoStr}>{timeStr}</time>
                </td>
              </tr>
            );
          })}
            </tbody>
          </table>
        </div>
      </section>

      {solarFacts ? (
        <section className={routeStyles.sectionPanel} aria-label={`الصيام والشمس في ${cityNameAr}`}>
          <div className={routeStyles.sectionHead}>
            <h2 className={routeStyles.sectionTitle}>ملخص سريع قبل الأذان في {cityNameAr}</h2>
            <p className={routeStyles.sectionCopy}>
              نهاية السحور، وقت الإفطار، مدة الصيام التقريبية، والشروق والغروب — كلها من نفس إحداثيات المدينة.
            </p>
          </div>
          <div className={routeStyles.contextGrid}>
            <article className={routeStyles.contextCard}>
              <h3 className={routeStyles.contextTitle}>السحور والإفطار اليوم</h3>
              <p className={routeStyles.contextBody}>
                ينتهي وقت السحور بدخول الفجر عند <strong>{solarFacts.fajrLabel}</strong>،
                ويبدأ الإفطار عند المغرب <strong>{solarFacts.maghribLabel}</strong>
                {solarFacts.fastingLengthLabel ? `، ومدة الصيام التقريبية ${solarFacts.fastingLengthLabel}.` : '.'}
              </p>
            </article>
            <article className={routeStyles.contextCard}>
              <h3 className={routeStyles.contextTitle}>الشروق والغروب</h3>
              <p className={routeStyles.contextBody}>
                الشروق اليوم في {cityNameAr} عند <strong>{solarFacts.sunriseLabel}</strong>،
                والغروب عند <strong>{solarFacts.sunsetLabel}</strong>
                {solarFacts.dayLengthLabel ? `، وطول النهار تقريباً ${solarFacts.dayLengthLabel}.` : '.'}
              </p>
            </article>
          </div>
        </section>
      ) : null}

      {qiblaLabel ? (
        <section className={`mb-4 ${routeStyles.sectionPanel}`} aria-label={`اتجاه القبلة من ${cityNameAr}`}>
          <QiblaCompass
            bearingDegrees={qiblaBearing}
            bearingLabel={qiblaLabel}
            cityNameAr={cityNameAr}
            countryNameAr={countryNameAr}
          />
        </section>
      ) : null}

      <AdInArticle slotId={`mid-prayer-city-${country}-${city}-1`} />

      <section className={routeStyles.sectionPanel} aria-label="المذهب الفقهي ووقت العصر">
        <ErrorBoundary name="PrayerCityMadhabSelector">
          <MadhabSelector
            school={methodInfo.school ?? methodInfo.defaultMadhab}
            shafiAsrTime={shafiAsrStr}
            hanafiAsrTime={hanafiAsrStr}
          />
        </ErrorBoundary>
      </section>

      <section className={routeStyles.sectionPanel}>
        <div className={routeStyles.contextGrid}>
          <article className={routeStyles.contextCard}>
            <h2 className={routeStyles.contextTitle}>طريقة الحساب</h2>
            <p className={routeStyles.contextBody}>
              تعتمد هذه الصفحة على <strong>{methodInfo.label}</strong>. إذا ظهر لك فرق عن مسجد محلي،
              فراجِع الإعلان الرسمي للمسجد عند الحاجة إلى توقيت جماعة أو احتياط خاص.
            </p>
          </article>
          <article className={routeStyles.contextCard}>
            <h2 className={routeStyles.contextTitle}>المنطقة الزمنية</h2>
            <p className={routeStyles.contextBody}>
              المنطقة الزمنية المعروضة لهذه المدينة هي <strong>{cityData.timezone}</strong>، وهي جزء أساسي من
              قراءة أوقات اليوم بشكل صحيح، خصوصاً عند السفر أو تغيّر التوقيت الصيفي.
            </p>
          </article>
          <article className={routeStyles.contextCard}>
            <h2 className={routeStyles.contextTitle}>الإحداثيات والمصدر الحسابي</h2>
            <p className={routeStyles.contextBody}>
              مواقيت {cityNameAr} محسوبة بناءً على إحداثيات ({cityData.lat?.toFixed(4)}°، {cityData.lon?.toFixed(4)}°)
              مع التطبيق الفلكي المناسب لنفس المدينة واليوم.
            </p>
          </article>
        </div>
      </section>

      <section className={routeStyles.sectionPanel}>
        <CalendarSeoBlock
          cityNameAr={cityNameAr}
          countryNameAr={countryNameAr}
          gregorianLabel={formatGregorianLabel(now)}
          hijriLabel={getHijriMonthSpanFromDate(now)}
          methodLabel={methodInfo.label}
        />
        <ErrorBoundary name="PrayerCityMonthlyCalendar">
          <MonthlyPrayerCalendar
            lat={cityData.lat}
            lon={cityData.lon}
            timezone={cityData.timezone}
            cityNameAr={cityNameAr}
            countryCode={countryCode}
            referenceDate={now}
          />
        </ErrorBoundary>
      </section>

      <AdInArticle slotId={`mid-prayer-city-${country}-${city}-2`} />

      <section className={routeStyles.sectionPanel} aria-label={`أسئلة قبل الاعتماد على مواقيت الصلاة في ${cityNameAr}`}>
        <h2 className={routeStyles.sectionTitle}>أسئلة قبل الاعتماد على مواقيت الصلاة في {cityNameAr}</h2>
        <ErrorBoundary name="PrayerCityFaq">
          <FAQAccordions items={faqItems} />
        </ErrorBoundary>
      </section>
    </>
  );
}

function PrayerCityContentFallback() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className={routeStyles.largePanelSkeleton} />
      <div className={routeStyles.sectionPanel}>
        <Skeleton className={`${routeStyles.titleSkeleton} ${routeStyles.lineSkeleton}`} />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={`prayer-city-row-${index}`}
              className={routeStyles.faqItemSkeleton}
            />
          ))}
        </div>
      </div>
      <Skeleton className={routeStyles.largePanelSkeleton} />
    </div>
  );
}
