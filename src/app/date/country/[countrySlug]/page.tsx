// src/app/date/country/[countrySlug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

import { getPriorityCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries';
import { getCapitalCity } from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import { convertDate, GREGORIAN_MONTH_NAMES_AR, type ConversionMethod } from '@/lib/date-adapter';
import { getFlagEmoji, getSafeTimezone } from '@/lib/country-utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { DateShareActions } from '@/components/date/DateShareActions';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdInArticle from '@/components/ads/AdInArticle';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { Calendar, Clock, ArrowLeftRight, type LucideIcon } from 'lucide-react';
import styles from '@/app/date/DateRoutePage.module.css';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCountrySlug,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();

const GLOBAL_HIJRI_METHOD: ConversionMethod = 'astronomical';

const COUNTRY_HIJRI_METHOD_OVERRIDES: Partial<Record<string, ConversionMethod>> = {
  'SA': 'umalqura',      // Saudi Arabia
  'AE': 'umalqura',      // UAE
  'KW': 'umalqura',      // Kuwait
  'QA': 'umalqura',      // Qatar
  'BH': 'umalqura',      // Bahrain
  'OM': 'umalqura',      // Oman
};

interface RelatedLink {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface CountryDateDecisionRow {
  label: string;
  value: string;
}

interface CountryDateFaqItem {
  question: string;
  answer: string;
}

interface CountryDateSourceLink {
  href: string;
  label: string;
  description: string;
}

const COUNTRY_DATE_SOURCE_LINKS: readonly CountryDateSourceLink[] = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'IANA Time Zone Database',
    description: 'مرجع المناطق الزمنية وتغيرات التوقيت المحلي التي تؤثر في بداية اليوم بين الدول.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'مرجع تقني يوضح اختلاف أم القرى، المدني، والحسابات الإسلامية الأخرى.',
  },
  {
    href: 'https://www.ummulqura.org.sa/Index.aspx',
    label: 'تقويم أم القرى',
    description: 'مرجع سعودي للتقويم الهجري وأدوات التحويل والصلاة، ويهم خصوصاً دول الخليج والسعودية.',
  },
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي الشمسي المستخدم في أغلب المعاملات المدنية.',
  },
];

function getHijriMethodNameAr(method: ConversionMethod): string {
  if (method === 'umalqura') return 'تقويم أم القرى';
  if (method === 'civil') return 'التقويم المدني';
  return 'الحساب الفلكي';
}

function resolveCountryHijriMethod(countryCode: string) {
  const normalizedCode = String(countryCode || '').toUpperCase();
  const method = COUNTRY_HIJRI_METHOD_OVERRIDES[normalizedCode] ?? GLOBAL_HIJRI_METHOD;
  const isGlobalDefault = !COUNTRY_HIJRI_METHOD_OVERRIDES[normalizedCode];
  const methodNameAr = getHijriMethodNameAr(method);

  const methodNoteAr = isGlobalDefault
    ? 'للدول التي لا يتوفر لها تخصيص محلي في قاعدة البيانات، نستخدم الحساب الفلكي كإعداد افتراضي عالمي.'
    : method === 'umalqura'
      ? 'تم اختيار هذه الطريقة لأنها الأقرب للاستخدام الرسمي في هذا البلد.'
      : 'تم اختيار هذه الطريقة لأنها الأقرب للاستخدام الشائع في هذا البلد.';

  return {
    method,
    methodNameAr,
    methodNoteAr,
    isGlobalDefault,
  };
}
 
function buildCountryDateDecisionRows(countryNameAr: string, methodNameAr: string): CountryDateDecisionRow[] {
  return [
    {
      label: 'تريد مشاركة التاريخ اليوم',
      value: `اكتب الهجري والميلادي معاً، واذكر أن النتيجة تخص ${countryNameAr} حتى لا يقرأها شخص في بلد آخر كسياق عام.`,
    },
    {
      label: 'الموعد قريب من منتصف الليل',
      value: 'افتح صفحة الوقت الان أولاً، لأن فرق ساعة أو ساعتين قد يعني أن اليوم المحلي لم يبدأ بعد في بلد المقارنة.',
    },
    {
      label: 'الموعد ديني أو حكومي',
      value: `استخدم ${methodNameAr} للفهم السريع، ثم راجع إعلان الجهة الرسمية في ${countryNameAr} قبل الاعتماد النهائي.`,
    },
    {
      label: 'لديك تاريخ قديم أو تاريخ ميلاد',
      value: 'استخدم محول التاريخ بدلاً من صفحة اليوم، ثم احتفظ بالتاريخ الأصلي كما ورد في الوثيقة.',
    },
  ];
}

function buildCountryDateFaqItems(
  countryNameAr: string,
  methodNameAr: string,
  timezone: string,
  hijriFormatted: string,
  gregorianFormatted: string,
): CountryDateFaqItem[] {
  return [
    {
      question: `كم التاريخ الهجري اليوم في ${countryNameAr}؟`,
      answer: `التاريخ الهجري اليوم في ${countryNameAr} هو ${hijriFormatted} حسب ${methodNameAr}. اقرأ النتيجة مع التاريخ الميلادي لأن بعض النماذج والرسائل تحتاج الصيغتين معاً.`,
    },
    {
      question: `كم التاريخ الميلادي اليوم في ${countryNameAr}؟`,
      answer: `التاريخ الميلادي اليوم في ${countryNameAr} هو ${gregorianFormatted}م حسب اليوم المحلي للمنطقة الزمنية ${timezone}.`,
    },
    {
      question: `هل التاريخ في ${countryNameAr} يطابق تاريخ جهازي؟`,
      answer: `ليس دائماً. إذا كان جهازك مضبوطاً على منطقة زمنية مختلفة، فقد ترى يوماً مختلفاً عند منتصف الليل أو قبل الفجر. لذلك تعرض هذه الصفحة التاريخ وفق سياق ${countryNameAr}.`,
    },
    {
      question: `لماذا قد يختلف التاريخ الهجري في ${countryNameAr} عن بلد آخر؟`,
      answer: 'قد يظهر فرق يوم واحد بسبب إعلان بداية الشهر، أو طريقة الحساب، أو اختلاف المنطقة الزمنية. هذا شائع قرب أول الشهر وآخره، خصوصاً في رمضان وشوال وذي الحجة.',
    },
    {
      question: `هل أستطيع اعتماد هذه النتيجة للمعاملات الرسمية في ${countryNameAr}؟`,
      answer: 'استخدمها كمرجع سريع ومفيد، لكن المعاملات القانونية أو الحكومية أو المواعيد الدينية الحساسة تحتاج دائماً مراجعة الجهة المختصة أو الوثيقة الرسمية.',
    },
  ];
}

const links = (countrySlug: string, countryNameAr: string): RelatedLink[] => [
  {
    href: '/date',
    label: 'صفحة التاريخ الرئيسية',
    description: 'عرض التاريخ الهجري والميلادي',
    icon: Calendar,
  },
  {
    href: `/time-now/${countrySlug}`,
    label: `الوقت الان في ${countryNameAr}`,
    description: 'الساعة الحالية وفق التوقيت المحلي',
    icon: Clock,
  },
  {
    href: '/date/converter',
    label: 'تحويل تاريخ آخر',
    description: 'أداة تحويل التواريخ الهجرية والميلادية',
    icon: ArrowLeftRight,
  },
];

export async function generateStaticParams() {
  const slugs = await getPriorityCountrySlugs(24);
  return slugs.map(slug => ({ countrySlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}): Promise<Metadata> {
  const { countrySlug } = await params;
  try {
    const country = await getCountryBySlug(countrySlug);
    if (!country) return { title: 'التاريخ الهجري' };

    const countryAr = country.name_ar;
    const policy = GEO_ROUTE_INDEXING_POLICIES.dateCountry;
    const isIndexableCountry = isSeoIndexableCountrySlug(countrySlug, {
      scope: policy.countryScope,
    });
    return {
      title: `التاريخ اليوم في ${countryAr} | هجري وميلادي حسب الدولة`,
      description: `اعرف التاريخ الهجري والميلادي اليوم في ${countryAr} حسب التوقيت المحلي، وافهم طريقة الحساب ومتى تراجع الوقت أو المحول أو الجهة الرسمية.`,
      keywords: [
        ...buildDateKeywords({ countryNameAr: countryAr }),
        `التاريخ اليوم في ${countryAr}`,
        `كم التاريخ اليوم في ${countryAr}`,
        `التاريخ المحلي في ${countryAr}`,
        `التاريخ حسب الدولة ${countryAr}`,
      ],
      alternates: { canonical: `${BASE_URL}/date/country/${countrySlug}` },
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
      openGraph: {
        title: `التاريخ اليوم في ${countryAr} | هجري وميلادي`,
        description: `اقرأ التاريخ المحلي في ${countryAr} بصيغتيه الهجرية والميلادية مع روابط الوقت والتحويل والصلاة.`,
        url: `${BASE_URL}/date/country/${countrySlug}`,
        locale: 'ar_SA',
      },
      twitter: {
        card: 'summary_large_image',
        title: `التاريخ اليوم في ${countryAr} | ميقاتنا`,
        description: `تاريخ اليوم في ${countryAr} حسب التوقيت المحلي مع الهجري والميلادي في صفحة واحدة.`,
      },
    };
  } catch (error) {
    logger.error('date-country-metadata-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
    return {
      title: 'التاريخ اليوم حسب الدولة',
      description: 'اعرف التاريخ الهجري والميلادي حسب الدولة مع الوقت الان والتحويل والتقويم من صفحات ميقاتنا.',
      alternates: { canonical: `${BASE_URL}/date/country/${countrySlug}` },
    };
  }
}

export default function CountryDatePage({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}) {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          kind="hub"
          title="جاري تحميل صفحة التاريخ"
          description="نجهز التاريخ اليومي ومسارات المتابعة الخاصة بهذه الدولة الآن."
        />
      )}
    >
      <CountryDateDynamicContent params={params} />
    </Suspense>
  );
}

async function CountryDateDynamicContent({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}) {
  const { countrySlug } = await params;
  let countryRaw;
  let countryLookupFailed = false;
  try {
    countryRaw = await getCountryBySlug(countrySlug);
  } catch (error) {
    countryLookupFailed = true;
    logger.error('date-country-page-data-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
  }
  if (countryLookupFailed) {
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات الدولة الآن"
        title="صفحة التاريخ حسب الدولة متوقفة مؤقتاً"
        description="تعذر تحميل بيانات الدولة في هذه اللحظة، لذلك أظهرنا لك بديلاً واضحاً يمنع تحوّل الصفحة إلى 5xx أو صفحة فارغة، مع إبقاء المسارات الأساسية متاحة."
        primaryLink={{
          href: '/date',
          label: 'افتح قسم التاريخ',
          description: 'انتقل إلى صفحة التاريخ الرئيسية ثم اختر أداة أو دولة أخرى من المسارات المتاحة.',
        }}
        secondaryLinks={[
          {
            href: '/date/calendar',
            label: 'افتح التقويم الميلادي',
            description: 'راجع التقويم السنوي ومسارات الأيام من صفحة التقويم الرئيسية.',
          },
          {
            href: '/date/converter',
            label: 'افتح محوّل التاريخ',
            description: 'استخدم تحويل التاريخ مباشرة إذا كان هدفك الوصول إلى تاريخ محدد.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'استخدم فهرس الصفحات للوصول السريع إلى أقرب مسار يفيدك الآن.',
          },
        ]}
      />
    );
  }
  if (!countryRaw) notFound();
  const country = countryRaw as NonNullable<typeof countryRaw>;

  let capital = null;
  try {
    capital = await getCapitalCity(country.country_code);
  } catch (error) {
    logger.warn('date-country-capital-lookup-failed', {
      route: `/date/country/${countrySlug}`,
      countrySlug,
      countryCode: country.country_code,
      error: serializeError(error),
    });
  }
  const _tzRaw = capital?.timezone ?? (country.timezone ? getSafeTimezone(country.timezone) : undefined);
  const timezone = _tzRaw ?? 'UTC';

  // Get current local date in that country's timezone
  const nowIso = await getCachedNowIso();
  let localDateIso = nowIso.split('T')[0];
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
    const parts = formatter.formatToParts(new Date(nowIso));
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    if (y && m && d) localDateIso = `${y}-${m}-${d}`;
  } catch (error) {
    logger.warn('date-country-local-date-format-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      timezone,
      error: serializeError(error),
    });
  }

  const { method, methodNameAr, methodNoteAr, isGlobalDefault } = resolveCountryHijriMethod(country.country_code);

  let hijri;
  try {
    hijri = convertDate({ date: localDateIso, toCalendar: 'hijri', method });
  } catch (error) {
    logger.error('date-country-hijri-conversion-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      localDateIso,
      method,
      error: serializeError(error),
    });
    notFound();
  }

  // Build Gregorian info manually from localDateIso to avoid convertDate range errors
  const [gy, gm, gd] = localDateIso.split('-').map(Number);
  const gregorian = {
    day: gd,
    month: gm,
    year: gy,
    monthNameAr: GREGORIAN_MONTH_NAMES_AR[gm - 1],
    formatted: {
      ar: `${gd} ${GREGORIAN_MONTH_NAMES_AR[gm - 1]} ${gy}`,
      iso: localDateIso
    }
  };

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: `التاريخ في ${country.name_ar}` },
  ];

  const decisionRows = buildCountryDateDecisionRows(country.name_ar, methodNameAr);
  const faqItems = buildCountryDateFaqItems(
    country.name_ar,
    methodNameAr,
    timezone,
    hijri.formatted.ar,
    gregorian.formatted.ar,
  );
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التاريخ اليوم في ${country.name_ar}`,
    url: `${BASE_URL}/date/country/${countrySlug}`,
    inLanguage: 'ar',
    dateModified: nowIso,
    description: `التاريخ الهجري اليوم في ${country.name_ar} هو ${hijri.formatted.ar}، ويوافق ${gregorian.formatted.ar}م حسب ${timezone}.`,
    about: ['تاريخ اليوم', 'التاريخ الهجري', 'التاريخ الميلادي', country.name_ar, methodNameAr],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const flag = getFlagEmoji(country.country_code);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, webPageSchema, faqSchema]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-6">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                <span aria-hidden="true">{flag}</span> تاريخ محلي حسب الدولة
              </p>
              <h1 className="date-hero-title">
                التاريخ اليوم في <span className="text-accent">{country.name_ar}</span>
              </h1>
              <p className="date-hero-copy">
                التاريخ الهجري اليوم في {country.name_ar} هو {hijri.formatted.ar}، ويوافق {gregorian.formatted.ar}م
                حسب المنطقة الزمنية <span dir="ltr">{timezone}</span>. اقرأ التاريخين معاً قبل المشاركة، لأن فرق التوقيت
                أو طريقة اعتماد بداية الشهر قد يغيّران فهم الموعد.
              </p>
            </div>
            <aside className="date-hero-rail" aria-label={`ملخص التاريخ اليوم في ${country.name_ar}`}>
              <p className="date-hero-answer">{hijri.formatted.ar}</p>
              <p className="date-hero-note">
                يوافق {gregorian.formatted.ar}م، يوم {hijri.dayNameAr}. طريقة الحساب: {methodNameAr}.
              </p>
              <div className="date-hero-actions">
                <Link href={`/time-now/${countrySlug}`} className="date-hero-link date-hero-link--primary">
                  الوقت الان في {country.name_ar}
                </Link>
                <Link href="/date/converter" className="date-hero-link">
                  تحويل تاريخ آخر
                </Link>
              </div>
            </aside>
          </section>

          <section className="date-detail-panel mb-8" aria-label="مشاركة تاريخ اليوم في الدولة">
              <ErrorBoundary name="DateCountryShareActions">
                <DateShareActions
                  hijriFormatted={hijri.formatted.ar}
                  gregorianFormatted={`${gregorian.day} ${gregorian.monthNameAr} ${gregorian.year}`}
                  hijriIso={hijri.formatted.iso}
                  gregorianIso={gregorian.formatted.iso}
                  pageUrl={`${BASE_URL}/date/country/${countrySlug}`}
                />
              </ErrorBoundary>
          </section>

          <section className={styles.sectionPanel} aria-labelledby="country-date-method">
            <div className={styles.sectionHead}>
              <h2 id="country-date-method" className={styles.sectionTitle}>
                كيف حُسب تاريخ اليوم؟
              </h2>
              <p className={styles.sectionCopy}>
                بدأنا من التاريخ المحلي <span dir="ltr">{localDateIso}</span> في المنطقة الزمنية <span dir="ltr">{timezone}</span>،
                ثم حوّلناه إلى هجري باستخدام {methodNameAr}. {methodNoteAr}
                {!isGlobalDefault ? ' قد تختلف رؤية الهلال في بعض الدول المجاورة أو عند أول الشهر.' : ' قد تختلف النتائج عن التقاويم المحلية إذا اعتمدت الدولة إعلاناً رسمياً مختلفاً.'}
              </p>
            </div>
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="country-date-decision">
            <h2 id="country-date-decision" className="date-section-title">
              قبل أن تعتمد التاريخ في {country.name_ar}
            </h2>
            <div className="date-detail-list">
              {decisionRows.map((row) => (
                <div key={row.label} className="date-detail-row">
                  <span className="date-detail-label">{row.label}</span>
                  <span className="date-detail-value">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.prosePanel} aria-labelledby="country-date-reading">
            <div className={styles.sectionHead}>
              <h2 id="country-date-reading" className={styles.sectionTitle}>
                كيف تقرأ التاريخ اليوم في {country.name_ar}؟
              </h2>
              <p className={styles.sectionCopy}>
                هذه الملاحظات تساعدك على استخدام النتيجة في المواعيد، الرسائل، والمقارنات
                بين الدول دون الخلط بين اليوم المحلي وتوقيت جهازك.
              </p>
            </div>
            <div className={styles.proseBody}>
              <p>
                فكر في التاريخ كأنه بطاقة لها وجهان: وجه ميلادي تستخدمه أغلب التطبيقات والحجوزات، ووجه هجري تحتاجه
                للمناسبات الدينية والعائلية وبعض السياقات الرسمية. في {country.name_ar}، تعرض هذه الصفحة الوجهين معاً
                حتى لا تختار صيغة واحدة وتنسى أن الطرف الآخر قد يقرأ التاريخ بطريقة مختلفة.
              </p>
              <p>
                الصفحة لا تعتمد على توقيت جهازك فقط؛ بل تقرأ اليوم المحلي في {country.name_ar}. هذا مهم عند متابعة بداية
                اليوم في دولة أخرى، أو عند تنسيق موعد عائلي أو عملي أو مناسبة مرتبطة بالتاريخ الهجري. إذا كنت تقارن
                بين بلدين، فابدأ من الوقت الان ثم عد إلى صفحة التاريخ حتى تفهم هل تغيّر اليوم محلياً أم لا.
              </p>
              <p>
                التاريخ الهجري قد يختلف يوماً واحداً بين الدول إذا اعتمدت جهة رسمية رؤية محلية للهلال أو إعلاناً خاصاً
                ببداية الشهر. لذلك نعرض طريقة الحساب المستخدمة بوضوح، ونربط الصفحة بمحوّل التاريخ والتقويم حتى تستطيع
                مراجعة تاريخ آخر أو فتح سنة كاملة عند الحاجة.
              </p>
              <p>
                عند استخدام الصفحة لتنسيق موعد بين بلدك و{country.name_ar}، لا تنظر إلى التاريخ منفصلاً عن الساعة.
                قد يكون يومك المحلي بدأ فعلاً بينما ما زالت الدولة الأخرى في اليوم السابق، أو العكس. لهذا تربط الصفحة
                بين التاريخ والوقت الان، لأن فرق المنطقة الزمنية هو السبب العملي الأكثر شيوعاً وراء الالتباس في الرسائل
                والحجوزات والاجتماعات.
              </p>
              <p>
                إذا كان الموعد دينياً أو حكومياً، تعامل مع التاريخ هنا كمرجع حسابي واضح، ثم قارنه مع الإعلان الرسمي
                داخل {country.name_ar}. أما عند الاستخدام اليومي مثل مشاركة التاريخ، كتابة تذكير، أو مراجعة التقويم،
                فوجود الهجري والميلادي معاً يكفي غالباً لتجنب سوء الفهم.
              </p>
              <p>
                من الأفضل أيضاً فتح التقويم أو محوّل التاريخ عندما يكون الموعد بعد عدة أسابيع، لأن تاريخ اليوم وحده
                لا يشرح لك كيف ينتقل الشهر الهجري خلال الفترة القادمة. الربط بين صفحة الدولة والوقت الان والتحويل يجعل
                المسار أوضح: تعرف اليوم المحلي أولاً، ثم تفحص التاريخ المطلوب، ثم تشارك الصيغة المناسبة.
              </p>
            </div>
            <div className={styles.methodGrid}>
              <article className={styles.infoCard}>
                <h3 className={styles.cardTitle}>للمواعيد اليومية</h3>
                <p className={styles.cardBody}>استخدم التاريخ المحلي عندما يكون الموعد مرتبطاً بـ {country.name_ar} لا بجهازك الحالي.</p>
              </article>
              <article className={styles.infoCard}>
                <h3 className={styles.cardTitle}>للهجري</h3>
                <p className={styles.cardBody}>راجع طريقة الحساب والتنبيه لأن الإعلان الرسمي قد يغيّر بداية الشهر عند الحالات الحساسة.</p>
              </article>
              <article className={styles.infoCard}>
                <h3 className={styles.cardTitle}>للمقارنة</h3>
                <p className={styles.cardBody}>افتح محوّل التاريخ إذا كنت تريد مقارنة يوم سابق أو لاحق لا تاريخ اليوم فقط.</p>
              </article>
            </div>
          </section>

          <section className="date-section mb-8" aria-labelledby="country-date-faq-heading">
            <div className="date-section-head">
              <h2 id="country-date-faq-heading" className="date-section-title">
                أسئلة شائعة عن تاريخ اليوم في {country.name_ar}
              </h2>
              <p className="date-section-copy">
                هذه الأسئلة تختصر أكثر مواضع الالتباس: فرق التوقيت، اختلاف الهجري، وحدود الاعتماد الرسمي.
              </p>
            </div>
            <div className="date-faq-grid">
              {faqItems.map((item) => (
                <article key={item.question} className="date-faq-item">
                  <h3 className="date-faq-question">{item.question}</h3>
                  <p className="date-faq-copy m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SiteTrustPanel panel="date" />
          </section>

          <AdInArticle slotId={`mid-date-country-${countrySlug}-1`} />

          <section className="related-links mb-8" dir="rtl" aria-labelledby="country-date-sources-heading">
            <p id="country-date-sources-heading" className="related-links__heading">
              مصادر تساعدك على فهم التاريخ المحلي
            </p>
            <div className="related-links__grid">
              {COUNTRY_DATE_SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  className="related-link-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{source.label}</span>
                    <span className="related-link-card__desc">{source.description}</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </a>
              ))}
            </div>
          </section>

          <nav
            aria-label={`مسارات متابعة التاريخ المحلي في ${country.name_ar}`}
            className="related-links"
            dir="rtl"
          >
            <p className="related-links__heading">
              إذا كنت تتابع الوقت أو الصلاة في {country.name_ar}
            </p>
      
            <div className="related-links__grid">
              {links(countrySlug, country.name_ar).map(({ href, label, description, icon: Icon }) => (
                <Link key={href} href={href} className="related-link-card">
                  {/* Icon container */}
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
      
                  {/* Text */}
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{label}</span>
                    <span className="related-link-card__desc">{description}</span>
                  </span>
      
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              ))}
            </div>
          </nav>

        </main>
      </AdLayoutWrapper>
    </>
  );
}
