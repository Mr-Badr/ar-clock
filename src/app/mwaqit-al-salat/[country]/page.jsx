/**
 * app/mwaqit-al-salat/[country]/page.jsx
 *
 * Country-level prayer times page.
 * Shows capital city prayers + grid of all cities.
 */

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock3, MapPin, Moon, Sunrise, Sun, Sunset } from 'lucide-react';
import { getPriorityCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries';
import { getCapitalCity, getCitiesByCountry } from '@/lib/db/queries/cities';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import { getMethodByCountry } from '@/lib/prayer-methods';
import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCityWrapper.client';
import CityPrayerCardsGrid from '@/components/mwaqit/CityPrayerCardsGrid.client';
import MonthlyPrayerCalendar from '@/components/mwaqit/MonthlyPrayerCalendar';
import CalendarSeoBlock from '@/components/mwaqit/CalendarSeoBlock';
import QiblaCompass from '@/components/mwaqit/QiblaCompass.client';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import GeoCityDirectory from '@/components/seo/GeoCityDirectory';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { Skeleton } from '@/components/ui/skeleton';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCountrySlug,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getCachedNowIso } from '@/lib/date-utils';
import { formatGregorianLabel, getHijriMonthSpanFromDate } from '@/lib/hijri-utils';
import {
  getQiblaBearingDegrees,
  getQiblaBearingLabel,
  getSolarPrayerFacts,
} from '@/lib/solar-prayer-facts';
import { buildPrayerKeywords } from '@/lib/seo/section-search-intent';
import { buildNoindexRouteMetadata, isRouteSlug } from '@/lib/route-param-validation';
import { logger, serializeError } from '@/lib/logger';

const BASE = getSiteUrl();

const COUNTRY_PRAYER_SOURCE_LINKS = [
  {
    href: 'https://github.com/batoulapps/adhan-js',
    label: 'Adhan.js',
    description: 'محرك حساب مواقيت الصلاة المستخدم في المشروع، ويوضح أثر الإحداثيات وطريقة الحساب واختيار العصر.',
  },
  {
    href: 'https://pray.zone/calculations',
    label: 'Pray.Zone: طرق الحساب',
    description: 'مرجع مبسط يشرح اختلاف زوايا الفجر والعشاء، وإعداد العصر، والتعامل مع المناطق ذات الحالات الخاصة.',
  },
  {
    href: 'https://zaman.today/en',
    label: 'Zaman Today',
    description: 'مرجع مقارنة لمواقيت الصلاة حسب المدينة والمنطقة الزمنية، مفيد لمراجعة الفروق بين المدن.',
  },
];

function buildCountryPrayerTitle(countryNameAr) {
  return `مواقيت الصلاة في ${countryNameAr} اليوم | المدن وطريقة الحساب`;
}

function buildCountryPrayerDescription(countryNameAr, capitalNameAr) {
  const cityPhrase = capitalNameAr
    ? `العاصمة ${capitalNameAr} وبقية المدن`
    : 'العاصمة وبقية المدن';

  return `اعرف مواقيت الصلاة في ${countryNameAr} اليوم، ثم اختر ${cityPhrase} لمراجعة الفجر والمغرب والجدول الشهري وطريقة الحساب المحلي.`;
}

function buildCountryPrayerFaqItems(countryAr, capitalAr, methodLabel) {
  const capitalPhrase = capitalAr ? `العاصمة ${capitalAr}` : 'العاصمة';

  return [
    {
      question: `هل تكفي مواقيت ${capitalPhrase} لكل ${countryAr}؟`,
      answer: `لا. صفحة الدولة تعطيك بداية سريعة من ${capitalPhrase}، لكنها لا تغني عن صفحة مدينتك إذا كنت بعيداً عنها. مواقيت الصلاة تعتمد على خط الطول وخط العرض والمنطقة الزمنية، لذلك قد يتغير وقت الفجر أو المغرب بين مدينتين داخل الدولة نفسها.`,
    },
    {
      question: `لماذا تختلف مواقيت الصلاة بين مدن ${countryAr}؟`,
      answer: 'لأن دخول وقت الصلاة مرتبط بموقع الشمس بالنسبة لمكانك الفعلي. اختلاف الإحداثيات، واتساع الدولة جغرافياً، والتوقيت الصيفي عند وجوده، وطريقة حساب الفجر والعشاء كلها عوامل يمكن أن تغيّر الوقت المعروض.',
    },
    {
      question: `ما طريقة الحساب المستخدمة في ${countryAr}؟`,
      answer: `تعرض الصفحة طريقة الحساب الأقرب لإعداد الدولة وهي ${methodLabel}. استخدمها لفهم سبب اختلاف النتائج بين التطبيقات، ثم راجع صفحة المدينة أو جدول المسجد إذا كان لديك مصدر محلي ثابت.`,
    },
    {
      question: 'ماذا أفعل إذا اختلف وقت المسجد المحلي عن وقت الصفحة؟',
      answer: 'اجعل جدول المسجد أو الجهة الرسمية المحلية مرجعك العملي للصلاة والجماعة. هذه الصفحة تساعدك على الفهم والتخطيط، أما القرار اليومي داخل حيّك فينبغي أن يراعي الإعلان المحلي المعمول به.',
    },
    {
      question: 'هل يؤثر اختيار المذهب على كل الصلوات؟',
      answer: 'غالباً يظهر أثر الاختيار الفقهي بوضوح في وقت العصر، لأن بعض الجداول تعتمد ظل المثل وبعضها يعتمد ظل المثلين. أما الفجر والعشاء فيتأثران أكثر بزوايا الشفق وطريقة الحساب المستخدمة.',
    },
    {
      question: 'هل تتغير المواقيت عند السفر داخل الدولة نفسها؟',
      answer: 'نعم إذا انتقلت إلى مدينة أخرى، خصوصاً في الدول الواسعة أو المدن البعيدة شرقاً وغرباً. قبل السفر افتح صفحة المدينة التي ستصل إليها، ولا تعتمد على وقت مدينتك الحالية أو وقت العاصمة.',
    },
  ];
}

export async function generateStaticParams() {
  const slugs = await getPriorityCountrySlugs(24);
  return slugs.map(slug => ({ country: slug }));
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) {
    return buildNoindexRouteMetadata({
      title: 'رابط مواقيت صلاة غير صالح',
      description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
      canonical: '/mwaqit-al-salat',
    });
  }

  try {
    const country = await getCountryBySlug(countrySlug);
    if (!country) return { title: 'مواقيت الصلاة' };

    const countryAr  = country.name_ar || country.name_en;
    const methodInfo = getMethodByCountry(country.country_code);
    const canonical  = `${BASE}/mwaqit-al-salat/${countrySlug}`;
    const policy = GEO_ROUTE_INDEXING_POLICIES.prayerTimes;
    const isIndexableCountry = isSeoIndexableCountrySlug(countrySlug, {
      scope: policy.countryScope,
    });
    const capital = await getCapitalCity(country.country_code);
    const capitalAr = capital ? (capital.name_ar || capital.name_en) : null;

    const title = buildCountryPrayerTitle(countryAr);
    const description = buildCountryPrayerDescription(countryAr, capitalAr);

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
        type: 'website',
        locale: 'ar_SA',
        url: canonical,
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
    logger.error('prayer-country-metadata-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
    return {
      title: 'مواقيت الصلاة حسب الدولة',
      description: 'اعرف مواقيت الصلاة حسب الدولة والمدينة مع التوقيت الحالي والتاريخ ومسارات الصفحات المرتبطة.',
      alternates: { canonical: `${BASE}/mwaqit-al-salat/${countrySlug}` },
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

export default async function CountryPrayerPage({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) notFound();

  let country;
  try {
    country = await getCountryBySlug(countrySlug);
  } catch (error) {
    logger.error('prayer-country-page-data-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات الدولة الآن"
        title="صفحة مواقيت الصلاة حسب الدولة متوقفة مؤقتاً"
        description="تعذر تحميل البيانات الأساسية لهذه الدولة في هذه اللحظة، لذلك أظهرنا لك مسارات بديلة واضحة تمنع تحوّل الصفحة إلى 5xx أو تجربة فارغة."
        primaryLink={{
          href: '/mwaqit-al-salat',
          label: 'افتح قسم مواقيت الصلاة',
          description: 'انتقل إلى القسم الرئيسي ثم ابحث عن دولة أو مدينة أخرى مباشرة.',
        }}
        secondaryLinks={[
          {
            href: '/time-now',
            label: 'افتح الوقت الان',
            description: 'راجع الوقت الحالي في الدول والمدن من القسم المرتبط زمنياً بهذه الصفحة.',
          },
          {
            href: '/date',
            label: 'افتح قسم التاريخ',
            description: 'الوصول إلى التاريخ اليومي والتقويم والتحويل من مسار التاريخ الرئيسي.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'إذا تغير سؤالك، استخدم فهرس الصفحات للوصول السريع إلى أقرب مسار مفيد.',
          },
        ]}
      />
    );
  }
  if (!country) notFound();

  const [citiesResult, capitalResult, nowIsoResult] = await Promise.allSettled([
    getCitiesByCountry(country.country_code),
    getCapitalCity(country.country_code),
    getCachedNowIso(),
  ]);
  const cities = citiesResult.status === 'fulfilled' ? citiesResult.value : [];
  const featuredCities = Array.isArray(cities) ? cities.slice(0, 36) : [];
  const capital = capitalResult.status === 'fulfilled' ? capitalResult.value : null;
  const cityCardsNowIso = nowIsoResult.status === 'fulfilled' ? nowIsoResult.value : null;

  if (citiesResult.status === 'rejected') {
    logger.error('prayer-country-cities-section-failed', {
      route: `/mwaqit-al-salat/${countrySlug}`,
      countrySlug,
      countryCode: country.country_code,
      error: serializeError(citiesResult.reason),
    });
  }

  if (capitalResult.status === 'rejected') {
    logger.warn('prayer-country-capital-section-failed', {
      route: `/mwaqit-al-salat/${countrySlug}`,
      countrySlug,
      countryCode: country.country_code,
      error: serializeError(capitalResult.reason),
    });
  }

  if (nowIsoResult.status === 'rejected') {
    logger.warn('prayer-country-city-cards-time-failed', {
      route: `/mwaqit-al-salat/${countrySlug}`,
      countrySlug,
      countryCode: country.country_code,
      error: serializeError(nowIsoResult.reason),
    });
  }

  const countryAr  = country.name_ar || country.name_en;
  const methodInfo = getMethodByCountry(country.country_code);
  const capitalAr = capital ? (capital.name_ar || capital.name_en) : null;
  const countryFaqItems = buildCountryPrayerFaqItems(countryAr, capitalAr, methodInfo.label);
  const utilityLinks = [
    {
      href: `/time-now/${countrySlug}`,
      label: `الوقت الان في ${countryAr}`,
      description: `صفحة الوقت الان في ${countryAr} مع الساعة الحالية والعاصمة والمدن الرئيسية.`,
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
    description: `ابدأ من مواقيت الصلاة في مدن ${countryAr} اليوم، ثم افتح صفحة المدينة الأقرب لك لمراجعة الفجر والظهر والعصر والمغرب والعشاء مع سياق التاريخ المحلي.`,
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
    mainEntity: countryFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main>
        <nav aria-label="مسار التنقل" className={`container mx-auto px-4 ${routeStyles.breadcrumb}`}>
          <ol className={routeStyles.breadcrumbList}>
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
            ].map((item) => (
              <li key={item.href} className={routeStyles.breadcrumbItem}>
                <Link href={item.href} className={routeStyles.breadcrumbLink}>{item.label}</Link>
                <ChevronLeft size={12} className={routeStyles.breadcrumbChevron} aria-hidden />
              </li>
            ))}
            <li aria-current="page" className={routeStyles.breadcrumbCurrent}>{countryAr}</li>
          </ol>
        </nav>

        <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
          <div className={routeStyles.heroInner}>
            <div className={routeStyles.heroCopy}>
              <h1 className={routeStyles.heroTitle}>
                مواقيت الصلاة في <span className="text-accent">{countryAr}</span> اليوم
              </h1>
              <p className={routeStyles.heroLead}>
                مواقيت الصلاة في {countryAr} اليوم تعرض الفجر والظهر والعصر والمغرب والعشاء من
                العاصمة كمرجع سريع، ثم تربطك بجميع المدن المدعومة. للحصول على موعد الأذان الأدق،
                اختر مدينتك الفعلية وراجع طريقة الحساب وجدول المسجد المحلي عند وجود اختلاف.
              </p>
              <div className={routeStyles.heroMeta}>
                <span className={routeStyles.metaPill}>
                  <Clock3 size={14} />
                  طريقة الحساب: <strong>{methodInfo.label}</strong>
                </span>
                {capital ? (
                  <span className={routeStyles.metaPill}>
                    <MapPin size={14} />
                    العاصمة المرجعية: <strong>{capital.name_ar || capital.name_en}</strong>
                  </span>
                ) : null}
              </div>
            </div>

            <div className={routeStyles.searchWrap}>
              <ErrorBoundary name="PrayerCountrySearch">
                <SearchCity mode="mwaqit-al-salat" />
              </ErrorBoundary>
            </div>

            {capital ? (
              <div className={routeStyles.heroPanel}>
                <ErrorBoundary>
                  <Suspense fallback={<PrayerCountryHeroFallback />}>
                    <PrayerTimesContent
                      country={countrySlug}
                      city={capital.city_slug}
                      cityData={capital}
                      countryCode={country.country_code}
                      countryNameAr={countryAr}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            ) : null}
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.summaryBand}`}>
          <div className={routeStyles.summaryGrid}>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>التغطية الأساسية</p>
              <p className={routeStyles.summaryValue}>العاصمة + المدن</p>
              <p className={routeStyles.summaryCopy}>
                تبدأ الصفحة بإجابة سريعة من العاصمة، ثم تنقلك إلى المدن الأبرز داخل {countryAr}
                حتى لا تضطر إلى إعادة البحث من الصفر.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>طريقة الحساب</p>
              <p className={routeStyles.summaryValue}>{methodInfo.label}</p>
              <p className={routeStyles.summaryCopy}>
                نعرض طريقة الحساب حتى تفهم سبب اختلاف الفجر أو العشاء أو العصر بين التطبيقات،
                ولا تتعامل مع أي وقت وكأنه منفصل عن إعداداته.
              </p>
            </div>
            <div className={routeStyles.summaryCard}>
              <p className={routeStyles.summaryLabel}>أفضل استخدام</p>
              <p className={routeStyles.summaryValue}>اختر مدينتك الفعلية</p>
              <p className={routeStyles.summaryCopy}>
                صفحة الدولة مناسبة للبدء، لكن المرجع اليومي النهائي يبقى صفحة المدينة الأقرب إليك
                بسبب اختلاف الإحداثيات والتوقيت المحلي.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-2">
          <AdTopBanner slotId={`top-prayer-country-${countrySlug}`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>أبرز المدن في {countryAr}</h2>
              <p className={routeStyles.sectionCopy}>
                انتقل مباشرة إلى صفحة المدينة التي تحتاجها. هذا الجزء يأتي بعد الإجابة الأساسية حتى
                تبقى الصفحة عملية قبل أن تتحول إلى دليل تنقل داخل الدولة.
              </p>
            </div>
            {featuredCities.length ? (
              <ErrorBoundary name="PrayerCountryCitiesGrid">
                <CityPrayerCardsGrid
                  cities={featuredCities}
                  countrySlug={countrySlug}
                  countryCode={country.country_code}
                  initialNowIso={cityCardsNowIso}
                />
              </ErrorBoundary>
            ) : (
              <p className={routeStyles.sectionCopy}>
                تعذر إظهار قائمة المدن الآن، لكن البحث المباشر ما زال متاحاً للوصول إلى المدينة التي تريدها.
              </p>
            )}
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <GeoCityDirectory
              title={`دليل مواقيت الصلاة في جميع مدن ${countryAr}`}
              description={`اختر مدينتك من الدليل الكامل. كل مدينة لها صفحة مستقلة لمواقيت اليوم، الصلاة القادمة، طريقة الحساب، والجدول الشهري.`}
              cities={cities}
              routeBase={`/mwaqit-al-salat/${countrySlug}`}
              linkLabelPrefix="مواقيت الصلاة في"
              ariaLabel={`دليل مواقيت الصلاة في مدن ${countryAr}`}
            />
          </div>
        </section>

        <section className="container mx-auto px-4">
          <AdInArticle slotId={`mid-prayer-country-${countrySlug}-1`} />
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>الطريقة والمنطقة الزمنية وسياق الدولة</h2>
              <p className={routeStyles.sectionCopy}>
                قبل الاعتماد على وقت العاصمة أو أي مدينة داخل {countryAr}، راجع طريقة الحساب والمنطقة الزمنية
                والفرق المتوقع بين المدن الواسعة جغرافياً.
              </p>
            </div>
            <div className={routeStyles.contextGrid}>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>طريقة الحساب الأقرب</h3>
                <p className={routeStyles.contextBody}>
                  تعتمد هذه الصفحات على <strong>{methodInfo.label}</strong> كإعداد حسابي واضح. هذا مهم عند مقارنة
                  الفجر والعشاء، أو عند مراجعة وقت العصر إذا كان مسجدك يتبع اختياراً فقهياً مختلفاً.
                </p>
              </article>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>المدينة المرجعية</h3>
                <p className={routeStyles.contextBody}>
                  {capital
                    ? `تبدأ الصفحة من ${capital.name_ar || capital.name_en} لأنها نقطة مرجعية سهلة، لكن الاستخدام اليومي الصحيح يكون من صفحة مدينتك أو من جدول مسجدك المحلي.`
                    : `لم تتوفر العاصمة المرجعية هنا، لذلك استخدم البحث أو قائمة المدن للوصول إلى الصفحة المحلية الأقرب لك.`}
                </p>
              </article>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>المنطقة الزمنية</h3>
                <p className={routeStyles.contextBody}>
                  {capital?.timezone || country.timezone
                    ? <>المنطقة الزمنية المرجعية هنا هي <strong>{capital?.timezone || country.timezone}</strong>، وقد يظهر اختلاف بين المدن داخل الدولة نفسها تبعاً للموقع الجغرافي أو التوقيت الصيفي.</>
                    : 'راجع صفحة المدينة النهائية لأن المنطقة الزمنية المرجعية لم تظهر هنا بشكل كامل.'}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.proseBlock}>
              <h2>كيف تستخدم صفحة مواقيت الصلاة في {countryAr}؟</h2>
              <p>
                تبدأ الصفحة بالعاصمة لأنها غالباً أسرع نقطة مرجعية، ثم تعرض قائمة المدن حتى لا تضطر
                إلى البحث من جديد إذا كنت في مدينة أخرى داخل {countryAr}. إذا كان هدفك معرفة الصلاة
                القادمة الآن، فافتح صفحة المدينة الأقرب لك مباشرة.
              </p>
              <p>
                تختلف مواقيت الصلاة بين المدن داخل الدولة نفسها بسبب خطوط الطول والعرض، وقد يظهر الفرق
                بوضوح في الدول الكبيرة. لذلك لا تعتمد على وقت العاصمة إذا كنت في مدينة بعيدة عنها، بل
                استخدم رابط مدينتك حتى تحصل على الفجر والمغرب وبقية الصلوات حسب الإحداثيات الصحيحة.
              </p>
              <p>
                عند متابعة الأذان من نتيجة بحث سريعة، راجع اسم المدينة، المنطقة الزمنية، وطريقة الحساب
                قبل الاعتماد على الوقت. إذا وجدت فرقاً بين الصفحة وجدول مسجدك، فاعتبر الجدول المحلي
                مرجعك العملي للصلاة والجماعة، واستخدم الصفحة للفهم والمقارنة والتخطيط.
              </p>
              <div className={routeStyles.threeUpGrid}>
                <article className={routeStyles.smallGuideCard}>
                  <h3 className={routeStyles.smallGuideTitle}>للمقيم اليومي</h3>
                  <p className={routeStyles.smallGuideCopy}>احفظ صفحة مدينتك وراجع الصلاة القادمة وجدول الشهر من نفس المكان.</p>
                </article>
                <article className={routeStyles.smallGuideCard}>
                  <h3 className={routeStyles.smallGuideTitle}>للمسافر</h3>
                  <p className={routeStyles.smallGuideCopy}>انتقل إلى صفحة المدينة التي ستصل إليها، خصوصاً عند اختلاف التوقيت أو طول الرحلة.</p>
                </article>
                <article className={routeStyles.smallGuideCard}>
                  <h3 className={routeStyles.smallGuideTitle}>للمراجعة</h3>
                  <p className={routeStyles.smallGuideCopy}>راجع طريقة الحساب ومسارات الوقت والتاريخ إذا احتجت سياقاً زمنياً كاملاً.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>قاعدة سريعة: أي وقت تتبع؟</h2>
              <p className={routeStyles.sectionCopy}>
                لا تحتاج إلى حفظ تفاصيل فلكية كثيرة. اتبع هذه القاعدة العملية حتى لا تخلط بين
                وقت العاصمة، وقت المدينة، ووقت المسجد القريب منك.
              </p>
            </div>
            <div className={routeStyles.contextGrid}>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>إذا كنت تريد نظرة عامة</h3>
                <p className={routeStyles.contextBody}>
                  استخدم صفحة {countryAr} لمعرفة الإطار العام، المدن المدعومة، وطريقة الحساب. هذا يكفي
                  للمقارنة السريعة أو قبل اختيار المدينة.
                </p>
              </article>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>إذا كنت ستصلي اليوم</h3>
                <p className={routeStyles.contextBody}>
                  افتح صفحة مدينتك الفعلية، لأن فرق الدقائق بين المدن قد يكون مهماً عند الفجر والمغرب
                  خصوصاً في الأيام القصيرة أو أثناء السفر.
                </p>
              </article>
              <article className={routeStyles.contextCard}>
                <h3 className={routeStyles.contextTitle}>إذا اختلف المسجد</h3>
                <p className={routeStyles.contextBody}>
                  اتبع جدول المسجد أو الجهة المحلية المعلنة للصلاة والجماعة. اختلاف بضع دقائق قد ينتج
                  عن طريقة الحساب أو الاحتياط المحلي أو اختيار العصر.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>أسئلة شائعة عن مواقيت {countryAr}</h2>
              <p className={routeStyles.sectionCopy}>
                هذه الأسئلة تعالج أكثر نقاط الالتباس التي تظهر عند مقارنة صفحات الدولة مع صفحات المدن
                أو تطبيقات الأذان المختلفة.
              </p>
            </div>
            <div className={routeStyles.contextGrid}>
              {countryFaqItems.map((item) => (
                <details key={item.question} className={routeStyles.contextCard}>
                  <summary className={routeStyles.contextTitle}>{item.question}</summary>
                  <p className={routeStyles.contextBody}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <div className={routeStyles.sectionHead}>
              <h2 className={routeStyles.sectionTitle}>مصادر ومنهج الحساب</h2>
              <p className={routeStyles.sectionCopy}>
                نعتمد على حسابات مبنية على الإحداثيات والمنطقة الزمنية وطريقة الحساب، ونربطك بمراجع
                تساعدك على فهم سبب اختلاف المواقيت بين مصدر وآخر.
              </p>
            </div>
            <div className={routeStyles.linkGrid}>
              {COUNTRY_PRAYER_SOURCE_LINKS.map((source) => (
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

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <GeoInternalLinks
              title={`خطوات تكمل مواقيت ${countryAr}`}
              description={`بعد معرفة مواقيت ${countryAr}، اختر الخطوة التي تناسبك: الوقت الان للسياق الزمني، تاريخ اليوم للسياق المحلي، أو صفحة العاصمة إذا كنت تريد جدولاً أدق.`}
              links={utilityLinks}
              ariaLabel={`خطوات تكمل مواقيت ${countryAr}`}
            />
          </div>
        </section>

        <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
          <div className={routeStyles.sectionPanel}>
            <SiteTrustPanel panel="prayer" />
          </div>
        </section>
      </main>
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
  const cityNameAr = cityData.name_ar || cityData.name_en;
  const solarFacts = getSolarPrayerFacts({
    lat: cityData.lat,
    lon: cityData.lon,
    timezone: cityData.timezone,
    date: now,
    countryCode,
    cacheKey: `country::${country}::${city}::solar`,
  });
  const qiblaLabel = getQiblaBearingLabel({
    lat: cityData.lat,
    lon: cityData.lon,
  });
  const qiblaBearing = getQiblaBearingDegrees({
    lat: cityData.lat,
    lon: cityData.lon,
  });

  return (
    <>
      <section className={`mb-6 ${routeStyles.sectionPanel}`}>
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
      </section>

      <section className={routeStyles.sectionPanel} aria-label={`مواقيت الصلاة اليوم في ${cityData.name_ar}`}>
        <div className={routeStyles.sectionHead}>
          <h3 className={routeStyles.sectionTitle}>مواقيت الصلاة اليوم</h3>
          <p className={routeStyles.sectionCopy}>
            هذا هو جدول اليوم في {cityNameAr}. لا نضع إعلاناً بين اسم الصلاة ووقتها،
            وتبقى طريقة الحساب والتاريخ ظاهرين في نفس الجزء. إذا كنت خارج هذه المدينة فافتح صفحة مدينتك
            قبل الاعتماد على الوقت للصلاة.
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

      {solarFacts || qiblaLabel ? (
        <section className={routeStyles.sectionPanel} aria-label={`ملخص الصيام والشمس والقبلة في ${cityNameAr}`}>
          <div className={routeStyles.sectionHead}>
            <h3 className={routeStyles.sectionTitle}>ملخص سريع للعاصمة المرجعية</h3>
            <p className={routeStyles.sectionCopy}>
              يعرض هذا الملخص ما يبحث عنه المستخدم غالباً بعد الأذان: نهاية السحور، الإفطار، الشروق،
              الغروب، واتجاه القبلة من {cityNameAr}. لمدينة أخرى داخل {countryNameAr} افتح صفحة المدينة نفسها.
            </p>
          </div>
          <div className={routeStyles.contextGrid}>
            {solarFacts ? (
              <article className={routeStyles.contextCard}>
                <h4 className={routeStyles.contextTitle}>السحور والإفطار</h4>
                <p className={routeStyles.contextBody}>
                  الفجر عند <strong>{solarFacts.fajrLabel}</strong> والمغرب عند <strong>{solarFacts.maghribLabel}</strong>
                  {solarFacts.fastingLengthLabel ? `، ومدة الصيام التقريبية ${solarFacts.fastingLengthLabel}.` : '.'}
                </p>
              </article>
            ) : null}
            {solarFacts ? (
              <article className={routeStyles.contextCard}>
                <h4 className={routeStyles.contextTitle}>الشروق والغروب</h4>
                <p className={routeStyles.contextBody}>
                  الشروق عند <strong>{solarFacts.sunriseLabel}</strong> والغروب عند <strong>{solarFacts.sunsetLabel}</strong>
                  {solarFacts.dayLengthLabel ? `، وطول النهار تقريباً ${solarFacts.dayLengthLabel}.` : '.'}
                </p>
              </article>
            ) : null}
            {qiblaLabel ? (
              <article className={routeStyles.contextCard}>
                <QiblaCompass
                  bearingDegrees={qiblaBearing}
                  bearingLabel={qiblaLabel}
                  cityNameAr={cityNameAr}
                  countryNameAr={countryNameAr}
                />
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className={routeStyles.sectionPanel}>
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
          referenceDate={now}
        />
      </section>
    </>
  );
}

function PrayerCountryHeroFallback() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className={routeStyles.largePanelSkeleton} />
      <div className={routeStyles.sectionPanel}>
        <Skeleton className={`${routeStyles.titleSkeleton} ${routeStyles.lineSkeleton}`} />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={`prayer-country-row-${index}`}
              className={routeStyles.faqItemSkeleton}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
