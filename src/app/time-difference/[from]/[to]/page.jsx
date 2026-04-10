/* app/time-difference/[from]/[to]/page.jsx */
import { Suspense } from 'react';
import TimeDiffCalculator from '@/components/TimeDifference/TimeDiffCalculatorV2.client';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react'
import './time-difference.css';
import {
  SuspendedTimeSnapshot,
  getOffsetMinutes,
  observesDST,
  formatUTCOffset,
} from './time-snapshot';
import TimeConversionTable from './TimeConversionTable.client';
import ContextSummaryView from '@/components/TimeDifference/ContextSummaryView';
import { buildContextSummaryLines } from '@/components/TimeDifference/contextSummary';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { SectionDivider } from '@/components/shared/primitives';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { getCachedNowIso } from '@/lib/date-utils';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import { getTimeDifference } from '@/lib/time-diff';
import { resolveTimeDifferenceCityFromSegment } from '@/lib/time-difference-route';
import { buildTimeDifferenceHref } from '@/lib/time-difference-links';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import {
  buildTimeDifferenceKeywords,
  getCountrySeoNames,
  uniqueKeywords,
} from '@/lib/seo/section-search-intent';

function dayNote(srcH, diffH) {
  const dest = srcH + diffH;
  if (dest >= 24) return 'اليوم التالي';
  if (dest < 0) return 'اليوم السابق';
  return '';
}

/** Western-numeral 12-hour Arabic time string */
function fmtTime(h24) {
  const norm = ((Math.round(h24 * 60) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export async function generateStaticParams() {
  return POPULAR_PAIRS.map((pair) => ({
    from: pair.from.slug,
    to: pair.to.slug,
  }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const paramsResolved = await params;
  const { from, to } = paramsResolved;
  const [fromCity, toCity] = await Promise.all([
    resolveTimeDifferenceCityFromSegment(from),
    resolveTimeDifferenceCityFromSegment(to),
  ]);
  if (!fromCity || !toCity) return { title: `فرق التوقيت | ${SITE_BRAND}` };

  const canonicalFrom = fromCity.canonicalSegment || from;
  const canonicalTo = toCity.canonicalSegment || to;
  const canonicalHref = buildTimeDifferenceHref(canonicalFrom, canonicalTo);
  const [fromCountryPrimary] = getCountrySeoNames(fromCity.country_slug, fromCity.country_name_ar);
  const [toCountryPrimary] = getCountrySeoNames(toCity.country_slug, toCity.country_name_ar);
  const title = `فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary} | ${fromCity.city_name_ar} و${toCity.city_name_ar} - ${SITE_BRAND}`;
  const description =
    `اعرف كم ساعة بين ${fromCountryPrimary} (${fromCity.city_name_ar}) و${toCountryPrimary} (${toCity.city_name_ar}) مع تحويل الوقت المباشر والساعة الآن والتوقيت الصيفي وأفضل وقت للاجتماعات.`;
  const keywordsArray = [
    ...buildTimeDifferenceKeywords({
      fromCityAr: fromCity.city_name_ar,
      toCityAr: toCity.city_name_ar,
      fromCountryNames: getCountrySeoNames(fromCity.country_slug, fromCity.country_name_ar),
      toCountryNames: getCountrySeoNames(toCity.country_slug, toCity.country_name_ar),
    }),
    `كم ساعة بين ${fromCountryPrimary} و${toCountryPrimary}`,
    `متى يفتح الدوام في ${toCity.city_name_ar} بتوقيت ${fromCity.city_name_ar}`,
    `الساعة الان في ${toCity.city_name_ar} مقارنة بـ ${fromCity.city_name_ar} مع التوقيت الصيفي`,
    `حساب فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary} بالدقيقة`,
    `أفضل وقت للاجتماعات المشتركة بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`
  ];
  const keywords = uniqueKeywords(keywordsArray);

  return {
    title, description, keywords,
    alternates: { canonical: `${BASE}${canonicalHref}` },
    openGraph: { title, description, url: `${BASE}${canonicalHref}`, locale: 'ar_SA', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}


async function ComparisonPageContent({ paramsPromise }) {
  const paramsResolved = await paramsPromise;
  const { from, to } = paramsResolved;

  const [fromCity, toCity] = await Promise.all([
    resolveTimeDifferenceCityFromSegment(from),
    resolveTimeDifferenceCityFromSegment(to),
  ]);
  if (!fromCity || !toCity) notFound();
  const canonicalFrom = fromCity.canonicalSegment || from;
  const canonicalTo = toCity.canonicalSegment || to;
  if (canonicalFrom !== from || canonicalTo !== to) {
    permanentRedirect(buildTimeDifferenceHref(canonicalFrom, canonicalTo));
  }
  const [fromCountryPrimary] = getCountrySeoNames(fromCity.country_slug, fromCity.country_name_ar);
  const [toCountryPrimary] = getCountrySeoNames(toCity.country_slug, toCity.country_name_ar);
  const comparisonQuery = `فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary}`;
  const countryContext = `${fromCountryPrimary} (${fromCity.city_name_ar}) و${toCountryPrimary} (${toCity.city_name_ar})`;

  // ─── Shared calculations ─────────────────────────────────────────────────
  // Fixed reference prevents Next.js 15 SSR bailout from `new Date()`
  const SEO_DATE = new Date('2024-01-01T12:00:00Z');
  const fromOffMin = getOffsetMinutes(fromCity.timezone, SEO_DATE);
  const toOffMin = getOffsetMinutes(toCity.timezone, SEO_DATE);
  const diffMinutes = toOffMin - fromOffMin;
  const diffHours = diffMinutes / 60;

  const fromHasDST = observesDST(fromCity.timezone, SEO_DATE);
  const toHasDST = observesDST(toCity.timezone, SEO_DATE);

  const CURRENT_DATE = new Date(await getCachedNowIso());
  const initialDiffData = getTimeDifference(fromCity.timezone, toCity.timezone, CURRENT_DATE);
  const fromDST = observesDST(fromCity.timezone, CURRENT_DATE);
  const toDST = observesDST(toCity.timezone, CURRENT_DATE);

  const fromOffStr = formatUTCOffset(fromOffMin);
  const toOffStr = formatUTCOffset(toOffMin);
  const absDiffH = Math.floor(Math.abs(diffHours));
  const absDiffM = Math.abs(diffMinutes) % 60;
  const diffLabel = absDiffH > 0
    ? `${absDiffH} ساعة${absDiffM > 0 ? ` و${absDiffM} دقيقة` : ''}`
    : `${absDiffM} دقيقة`;
  const ahead = diffMinutes > 0 ? toCity.city_name_ar : fromCity.city_name_ar;
  const behind = diffMinutes > 0 ? fromCity.city_name_ar : toCity.city_name_ar;
  const bothFixed = !fromHasDST && !toHasDST;
  const directAnswer = diffMinutes === 0
    ? `${comparisonQuery} يساوي صفر ساعة حاليًا، لأن ${fromCountryPrimary} و${toCountryPrimary} في هذا المثال يعتمدان التوقيت نفسه بين ${fromCity.city_name_ar} و${toCity.city_name_ar}.`
    : `${comparisonQuery} هو ${diffLabel} حاليًا. هذه الصفحة تعرض الجواب مباشرة بين ${fromCity.city_name_ar} في ${fromCountryPrimary} و${toCity.city_name_ar} في ${toCountryPrimary} مع تحويل الوقت الفوري والتوقيت الصيفي.`;
  const summaryLines = buildContextSummaryLines({
    fromCity,
    toCity,
    diffData: initialDiffData,
  });

  const workdayStart = 9;
  const workdayEnd = 17;
  const targetWorkdayStart = workdayStart - diffHours;
  const targetWorkdayEnd = workdayEnd - diffHours;
  const overlapStart = Math.max(workdayStart, targetWorkdayStart);
  const overlapEnd = Math.min(workdayEnd, targetWorkdayEnd);
  const hasOverlap = overlapStart < overlapEnd;
  const overlapFromSource = hasOverlap ? fmtTime(overlapStart) : null;
  const overlapToSource = hasOverlap ? fmtTime(overlapEnd) : null;
  const overlapFromTarget = hasOverlap ? fmtTime(overlapStart + diffHours) : null;
  const overlapToTarget = hasOverlap ? fmtTime(overlapEnd + diffHours) : null;

  // ─── Pre-compute conversion rows (serialisable → passed to Client) ─────
  const conversionGroups = [
    { label: 'الصباح', icon: ' 🌅 ', hours: [6, 7, 8, 9, 10, 11] },
    { label: 'الظهيرة', icon: ' 🌞 ', hours: [12, 13, 14, 15] },
    { label: 'المساء', icon: ' 🌆 ', hours: [16, 17, 18, 19, 20, 21] },
  ].map(g => ({
    label: g.label,
    icon: g.icon,
    rows: g.hours.map(h => ({
      fromTime: fmtTime(h),
      toTime: fmtTime(h + diffHours),
      note: dayNote(h, diffHours),
    })),
  }));

  // ─── DST summary paragraph ────────────────────────────────────────────────
  const dstSummaryText = bothFixed
    ? <>الفارق بين {fromCity.city_name_ar} و{toCity.city_name_ar} ثابت طوال العام عند <strong className="text-primary">{diffLabel}</strong>. لا تطبق أيٌّ منهما التوقيت الصيفي.</>
    : (!fromHasDST && toHasDST)
      ? <>{toCity.city_name_ar} تطبق التوقيت الصيفي بينما {fromCity.city_name_ar} لا تطبقه. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يتغير ساعة في مارس/أكتوبر.</>
      : (fromHasDST && !toHasDST)
        ? <>{fromCity.city_name_ar} تطبق التوقيت الصيفي بينما {toCity.city_name_ar} لا تطبقه. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يتغير موسميًا.</>
        : <>كلتاهما تطبقان التوقيت الصيفي. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يبقى ثابتًا أو يتغير ساعة حسب توقيت كل منهما.</>;

  // ─── FAQ data ─────────────────────────────────────────────────────────────
  const faqs = [
    {
      q: `كم فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary}؟`,
      a: diffMinutes === 0
        ? `فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary} في هذه الصفحة هو صفر ساعة، لأن المقارنة هنا بين ${fromCity.city_name_ar} و${toCity.city_name_ar} على التوقيت نفسه. وقد يختلف الجواب إذا قارنت مدنًا أخرى داخل الدولة متعددة المناطق الزمنية.`
        : `فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary} في هذه الصفحة هو ${diffLabel}. المقارنة مبنية على ${fromCity.city_name_ar} و${toCity.city_name_ar} تحديدًا، لذلك قد يختلف الفرق إذا كانت الدولة تحتوي أكثر من منطقة زمنية مثل أمريكا.`
    },
    {
      q: `كم ساعة الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: diffMinutes === 0
        ? `لا يوجد فرق — كلتاهما في نفس النطاق (${fromOffStr}).`
        : `الفرق الحالي ${diffLabel}. ${ahead} تسبق ${behind}. ${fromCity.city_name_ar} في ${fromOffStr} و${toCity.city_name_ar} في ${toOffStr}.`,
    },
    {
      q: `هل ${fromCity.city_name_ar} تطبق التوقيت الصيفي؟`,
      a: fromHasDST
        ? `نعم. قد يتغير توقيتها بين الصيفي والشتوي خلال العام.`
        : `لا، توقيتها ثابت طوال العام عند ${fromOffStr}.`,
    },
    {
      q: `هل ${toCity.city_name_ar} تطبق التوقيت الصيفي؟`,
      a: toHasDST
        ? `نعم. قد يتغير توقيتها بين الصيفي والشتوي خلال العام.`
        : `لا، توقيتها ثابت طوال العام عند ${toOffStr}.`,
    },
    {
      q: `هل يتغير الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar} خلال العام؟`,
      a: bothFixed
        ? `لا — الفرق ثابت عند ${diffLabel} طوال السنة، إذ لا تطبق أيٌّ منهما التوقيت الصيفي.`
        : `نعم، قد يتغير بمقدار ساعة في فترات التوقيت الصيفي. الفرق الحالي ${diffLabel}.`,
    },
    {
      q: `هل هذا هو نفس فرق التوقيت بين كل مدن ${toCountryPrimary} و${fromCountryPrimary}؟`,
      a: `ليس دائمًا. هذه الصفحة تقارن ${fromCity.city_name_ar} و${toCity.city_name_ar} فقط، وقد يختلف فرق التوقيت داخل الدولة نفسها إذا كانت تضم أكثر من منطقة زمنية.`
    },
    {
      q: `ما أفضل وقت للاجتماعات بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `استخدم أداة "ساعات العمل المشتركة" في الأداة التفاعلية أعلاه لمعرفة نافذة التوقيت المشترك. يمكنك تعديل وقت الدوام حسب جدولك الفعلي.`,
    },
    {
      q: `هل التاريخ واحد في ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: Math.abs(diffMinutes) >= 720
        ? `بسبب الفرق الكبير (${diffLabel}) قد يختلف التاريخ في بعض الساعات. الأداة أعلاه تُنبّهك تلقائيًا.`
        : `في الغالب نعم، الفرق لا يتجاوز حدود اليوم في معظم الأحوال.`,
    },
    {
      q: `ما هو توقيت جرينتش لـ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `${fromCity.city_name_ar} في ${fromOffStr}، و${toCity.city_name_ar} في ${toOffStr}.`,
    },
    {
      q: `كيف أحسب فرق التوقيت يدويًا؟`,
      a: `اطرح UTC الأولى من UTC الثانية: (${toOffMin >= 0 ? '+' : ''}${toOffMin}) − (${fromOffMin >= 0 ? '+' : ''}${fromOffMin}) = ${diffMinutes > 0 ? '+' : ''}${diffMinutes} دقيقة أي ${diffLabel}.`,
    },
    {
      q: `لماذا أحتاج معرفة فرق التوقيت؟`,
      a: `لتنسيق الاجتماعات عن بُعد، متابعة البث المباشر، تحديد أوقات الأسواق المالية، والتواصل الصحيح مع الأهل والزملاء.`,
    },
    {
      q: `هل يتغير الفرق في رمضان؟`,
      a: `لا تغيّر الدول العربية توقيتها الرسمي بسبب رمضان. الفرق يبقى ${diffLabel} إلا إذا صادف رمضان فترة التوقيت الصيفي في إحدى الدولتين.`,
    },
    {
      q: `كيف أشارك مقارنة التوقيت؟`,
      a: `اضغط زر "مشاركة" في الأداة أعلاه. يُنسخ الرابط تلقائيًا ويمكن مشاركته مباشرة.`,
    },
  ];

  // ─── JSON-LD ──────────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}` },
      { '@type': 'ListItem', position: 2, name: 'فرق التوقيت', item: `${BASE}/time-difference` },
      { '@type': 'ListItem', position: 3, name: `${fromCity.city_name_ar} – ${toCity.city_name_ar}`, item: `${BASE}${buildTimeDifferenceHref(canonicalFrom, canonicalTo)}` },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${comparisonQuery} | ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    url: `${BASE}${buildTimeDifferenceHref(canonicalFrom, canonicalTo)}`,
    description: directAnswer,
    inLanguage: 'ar',
    about: [
      { '@type': 'Thing', name: fromCountryPrimary },
      { '@type': 'Thing', name: toCountryPrimary },
      { '@type': 'Thing', name: fromCity.city_name_ar },
      { '@type': 'Thing', name: toCity.city_name_ar },
    ],
  };

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `حاسبة فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'ar',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: directAnswer,
    featureList: [
      'حساب دقيق لفرق التوقيت',
      'مراعاة التوقيت الصيفي تلقائياً',
      'تحويل فوري للتوقيت',
      'حساب ساعات العمل المشتركة للشركات'
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
  const comparisonUtilityLinks = Array.from(
    new Map([
      {
        href: `/time-now/${fromCity.country_slug}/${fromCity.city_slug}`,
        label: `الوقت الآن في ${fromCity.city_name_ar}`,
        description: `اعرف الساعة الحالية والتاريخ اليوم في ${fromCity.city_name_ar}.`,
      },
      {
        href: `/time-now/${toCity.country_slug}/${toCity.city_slug}`,
        label: `الوقت الآن في ${toCity.city_name_ar}`,
        description: `اعرف الساعة الحالية والتاريخ اليوم في ${toCity.city_name_ar}.`,
      },
      {
        href: `/time-now/${fromCity.country_slug}`,
        label: `الوقت الآن في ${fromCountryPrimary}`,
        description: 'صفحة الدولة مع العاصمة والمدن الكبرى المرتبطة بهذه المقارنة.',
      },
      {
        href: `/time-now/${toCity.country_slug}`,
        label: `الوقت الآن في ${toCountryPrimary}`,
        description: 'صفحة الدولة مع العاصمة والمدن الكبرى المرتبطة بهذه المقارنة.',
      },
      {
        href: `/mwaqit-al-salat/${fromCity.country_slug}/${fromCity.city_slug}`,
        label: `مواقيت الصلاة في ${fromCity.city_name_ar}`,
        description: `انتقل إلى أوقات الصلاة الدقيقة في ${fromCity.city_name_ar}.`,
      },
      {
        href: `/mwaqit-al-salat/${toCity.country_slug}/${toCity.city_slug}`,
        label: `مواقيت الصلاة في ${toCity.city_name_ar}`,
        description: `انتقل إلى أوقات الصلاة الدقيقة في ${toCity.city_name_ar}.`,
      },
      {
        href: `/date/country/${fromCity.country_slug}`,
        label: `التاريخ اليوم في ${fromCountryPrimary}`,
        description: `راجع التاريخ الهجري والميلادي اليوم في ${fromCountryPrimary}.`,
      },
      {
        href: `/date/country/${toCity.country_slug}`,
        label: `التاريخ اليوم في ${toCountryPrimary}`,
        description: `راجع التاريخ الهجري والميلادي اليوم في ${toCountryPrimary}.`,
      },
    ].map((link) => [link.href, link]),
    ).values(),
  );

  return (
    <div className="min-h-screen bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20">

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          <span aria-hidden="true">›</span>
          <Link href="/time-difference" className="hover:text-accent transition-colors">فرق التوقيت</Link>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{fromCity.city_name_ar} – {toCity.city_name_ar}</span>
        </nav>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="mb-3">
            <span className={`badge ${diffMinutes === 0 ? 'badge-success' : 'badge-accent'}`}>
              {diffMinutes === 0 ? 'نفس التوقيت' : `فارق ${diffLabel}`}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight mb-2">
            فرق التوقيت بين{' '}
            <span className="text-accent">{fromCountryPrimary}</span>
            {' '}و{' '}
            <span className="text-accent">{toCountryPrimary}</span>
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            {diffMinutes === 0
              ? `${countryContext} في نفس النطاق الزمني (${fromOffStr})`
              : `${ahead} تسبق ${behind} بـ${diffLabel} — مقارنة ${countryContext} محدّثة لحظيًا`}
          </p>
          <p className="text-sm text-secondary leading-loose mt-4">
            {directAnswer}
          </p>
        </header>

        <AdTopBanner slotId="top-time-diff" />

        {/* ── SSR snapshot — crawlable current times ─────────────────── */}
        <section className="td-snapshot mb-8" aria-label="الوقت الحالي في المدينتين">
          <SuspendedTimeSnapshot fromCity={fromCity} toCity={toCity} />
        </section>

        <section className="mb-8" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            ملخص فرق التوقيت بين {fromCity.city_name_ar} و{toCity.city_name_ar}
          </h2>
          <ContextSummaryView lines={summaryLines} />
        </section>

        <section className="mb-10" aria-labelledby="facts-heading">
          <h2 id="facts-heading" className="active-indicator text-xl font-bold mb-4">
            معلومات سريعة عن فرق التوقيت بين {fromCity.city_name_ar} و{toCity.city_name_ar}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="card p-4 td-static">
              <p className="text-xs text-muted mb-2">كم ساعة بين المدينتين؟</p>
              <p className="text-lg font-black text-accent-alt">{diffMinutes === 0 ? 'نفس التوقيت' : diffLabel}</p>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                {diffMinutes === 0
                  ? `الوقت متطابق حالياً بين ${fromCity.city_name_ar} و${toCity.city_name_ar}.`
                  : `${ahead} تسبق ${behind} حالياً، وهذا هو الجواب المباشر لأكثر عمليات البحث شيوعاً.`}
              </p>
            </article>

            <article className="card p-4 td-static">
              <p className="text-xs text-muted mb-2">التوقيت العالمي UTC</p>
              <p className="text-lg font-black text-accent-alt" dir="ltr">{fromOffStr} / {toOffStr}</p>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                يعتمد الحساب على المنطقة الزمنية الرسمية لكل مدينة، وليس على متوسط الدولة بالكامل.
              </p>
            </article>

            <article className="card p-4 td-static">
              <p className="text-xs text-muted mb-2">أفضل وقت للاجتماعات</p>
              <p className="text-lg font-black text-accent-alt">
                {hasOverlap ? 'يوجد وقت مشترك' : 'التقاطع محدود'}
              </p>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                {hasOverlap
                  ? `${overlapFromSource} إلى ${overlapToSource} في ${fromCity.city_name_ar} يقابله ${overlapFromTarget} إلى ${overlapToTarget} في ${toCity.city_name_ar}.`
                  : `لا يوجد تقاطع واضح بين ساعات العمل التقليدية 9-17، لذلك يُفضَّل تعديل مواعيد الدوام أو الاعتماد على التحويل المباشر.`}
              </p>
            </article>

            <article className="card p-4 td-static">
              <p className="text-xs text-muted mb-2">حالة التوقيت الصيفي</p>
              <p className="text-lg font-black text-accent-alt">
                {!fromHasDST && !toHasDST ? 'فارق ثابت غالباً' : 'قد يتغير موسمياً'}
              </p>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                {bothFixed
                  ? `كل من ${fromCity.city_name_ar} و${toCity.city_name_ar} لا يطبقان التوقيت الصيفي، لذلك يبقى الفارق مستقراً طوال معظم السنة.`
                  : `التوقيت الصيفي قد يغيّر فرق التوقيت ساعة كاملة في بعض الفترات، لذلك نعرض الحالة الحالية والتغيرات المحتملة بوضوح.`}
              </p>
            </article>
          </div>
        </section>

        {/* ── Interactive calculator ──────────────────────────────────── */}
        <section className="mb-10" aria-label="حاسبة فرق التوقيت التفاعلية">
          <TimeDiffCalculator
            initialFrom={fromCity}
            initialTo={toCity}
            initialDiffData={initialDiffData}
          />
        </section>

        <div className="my-20">
          <SectionDivider />
        </div>

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 1 — Explanation
            ════════════════════════════════════════════════════════ */}
        <section className="mb-10" aria-labelledby="diff-heading">
          <h2 id="diff-heading" className="active-indicator text-xl font-bold mb-4">
            فرق التوقيت بين {fromCountryPrimary} و{toCountryPrimary} اليوم
          </h2>

          <div className="card--flat border-default card mb-4 p-0 overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="p-4">
                <p className="text-xs text-muted mb-1">{fromCity.city_name_ar}</p>
                <p className="text-xl font-black tabular-nums text-accent-alt" dir="ltr">{fromOffStr}</p>
                <p className="text-xs text-muted mt-1">{fromHasDST ? '☀️ قد يتغير توقيتها موسميًا' : '· توقيت ثابت'}</p>
              </div>
              <div className="p-4 border-r border-[var(--border-subtle)]">
                <p className="text-xs text-muted mb-1">{toCity.city_name_ar}</p>
                <p className="text-xl font-black tabular-nums text-accent-alt" dir="ltr">{toOffStr}</p>
                <p className="text-xs text-muted mt-1">{toHasDST ? '☀️ قد يتغير توقيتها موسميًا' : '· توقيت ثابت'}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-secondary leading-loose">
            {diffMinutes === 0
              ? <>
                <strong className="text-primary">{countryContext}</strong> في نفس
                النطاق الزمني <strong dir="ltr" className="tabular-nums">{fromOffStr}</strong>.
                الساعة متطابقة في هاتين المدينتين، وهو ما يجيب بسرعة عن بحث مثل "{comparisonQuery}" عندما تكون المقارنة بين {fromCity.city_name_ar} و{toCity.city_name_ar}.
              </>
              : <>
                إذا كنت تبحث عن <strong className="text-primary">{comparisonQuery}</strong> فالإجابة هنا مبنية على{' '}
                <strong className="text-primary">{fromCity.city_name_ar}</strong> في{' '}
                <strong dir="ltr" className="tabular-nums">{fromOffStr}</strong> و
                <strong className="text-primary">{toCity.city_name_ar}</strong> في{' '}
                <strong dir="ltr" className="tabular-nums">{toOffStr}</strong>.
                الفارق الحالي <strong className="text-primary">{diffLabel}</strong>،
                تسبق فيه <strong className="text-primary">{ahead}</strong> مدينة{' '}
                <strong className="text-primary">{behind}</strong>.{' '}
                مثال: إذا كانت الساعة{' '}
                <span dir="ltr" className="tabular-nums font-bold">9:00 ص</span> في{' '}
                {fromCity.city_name_ar} فهي{' '}
                <span dir="ltr" className="tabular-nums font-bold text-accent-alt">
                  {fmtTime(9 + diffHours)}
                </span>{' '}
                في {toCity.city_name_ar}.
              </>
            }
          </p>
        </section>

        <div className="my-20">
          <SectionDivider />
        </div>

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 2 — Time conversion table (tabbed, client)
            ════════════════════════════════════════════════════════
         *
         * TimeConversionTable is 'use client' for tab state only.
         * All data pre-built above → passed as plain serialisable props.
         * Uses new.css .tabs / .tab / .tab--active natively — no overrides.
         */}
        <section className="mb-10" aria-labelledby="conversion-heading">
          <h2 id="conversion-heading" className="active-indicator text-xl font-bold mb-4">
            تحويل الوقت بين {fromCity.city_name_ar} و{toCity.city_name_ar}
          </h2>

          <TimeConversionTable
            groups={conversionGroups}
            fromCity={fromCity.city_name_ar}
            toCity={toCity.city_name_ar}
          />
        </section>

        <div className="my-20">
          <SectionDivider />
        </div>

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 3 — DST comparison table
            ════════════════════════════════════════════════════════
         *
         * Plain <table> with new.css classes only:
         *   .table-wrapper  § border-default, radius-xl, shadow-xs
         *   .table          § bg-surface-1, font-sm, text-primary
         *   .table--compact § reduced padding
         *   .table thead tr § bg-surface-2, border-bottom-2
         *   .table th       § font-semibold, text-xs, text-secondary, text-right
         *   .td-col-center  § overrides text-align to center (time-difference.css §4)
         *   .table tbody tr § border-bottom, hover:bg-surface-2
         *   .table td       § text-primary, leading-snug, vertical-align:middle
         *   .tabular-nums   § font-variant-numeric:tabular-nums
         *   .font-bold      § font-weight: var(--font-bold)
         *   .text-secondary § color: var(--text-secondary)
         *   .text-muted     § color: var(--text-muted)
         *   .text-xs        § font-size: var(--text-xs)
         *   .badge-*        § new.css §18 badge variants
         *   .td-dst-summary-row § time-difference.css §6 — muted bg summary row
         */}
        <section className="mb-10" aria-labelledby="dst-heading">
          <h2 id="dst-heading" className="active-indicator text-xl font-bold mb-4">
            هل يتغير الفارق بين {fromCountryPrimary} و{toCountryPrimary} خلال السنة؟
          </h2>

          <div className="table-wrapper mb-4">
            <table className="table table--compact">

              <thead>
                <tr>
                  {/*
                   * Label column: default .table th = text-right ← correct for RTL
                   * City columns: .td-col-center overrides to text-center
                   */}
                  <th style={{ width: '40%' }}>المعلومة</th>
                  <th className="td-col-center" style={{ width: '30%' }}>
                    {fromCity.city_name_ar}
                  </th>
                  <th className="td-col-center" style={{ width: '30%' }}>
                    {toCity.city_name_ar}
                  </th>
                </tr>
              </thead>

              <tbody>

                {/* ── Row 1: UTC offset ─────────────────────────────── */}
                <tr>
                  {/*
                   * Label: text-secondary (from @theme inline → var(--text-secondary))
                   *        text-xs       (from @theme → var(--text-xs))
                   * .table td already sets color:text-primary;
                   * text-secondary Tailwind class overrides that for label cells.
                   */}
                  <td className="text-secondary text-xs">التوقيت (UTC)</td>

                  {/*
                   * .td-col-center  — centering (time-difference.css §4)
                   * .tabular-nums   — numeric layout (new.css §08)
                   * .font-bold      — weight (new.css §08)
                   * .text-accent-alt — Tailwind via @theme = var(--accent-alt)
                   */}
                  <td className="td-col-center tabular-nums font-bold text-accent-alt" dir="ltr">
                    {fromOffStr}
                  </td>
                  <td className="td-col-center tabular-nums font-bold text-accent-alt" dir="ltr">
                    {toOffStr}
                  </td>
                </tr>

                {/* ── Row 2: Applies DST? ───────────────────────────── */}
                <tr>
                  <td className="text-secondary text-xs">يطبق التوقيت الصيفي؟</td>
                  <td className="td-col-center">
                    {/*
                     * .badge        — new.css §18: inline-flex, xs, pill
                     * .badge-warning — warning-soft bg + warning text + warning border
                     * .badge-default — surface-3 bg + text-secondary + border-default
                     */}
                    <span className={`badge ${fromHasDST ? 'badge-warning' : 'badge-default'}`}>
                      {fromHasDST ? 'نعم' : 'لا'}
                    </span>
                  </td>
                  <td className="td-col-center">
                    <span className={`badge ${toHasDST ? 'badge-warning' : 'badge-default'}`}>
                      {toHasDST ? 'نعم' : 'لا'}
                    </span>
                  </td>
                </tr>

                {/* ── Row 3: Current season ─────────────────────────── */}
                <tr>
                  <td className="text-secondary text-xs">الحالة الان</td>
                  <td className="td-col-center">
                    {/*
                     * badge-warning = active DST (summer) — warm amber
                     * badge-info    = standard time (winter) — cool blue
                     */}
                    <span className={`badge ${fromDST ? 'badge-warning' : 'badge-info'}`}>
                      {fromDST ? '☀️ صيفي' : '🌙 شتوي'}
                    </span>
                  </td>
                  <td className="td-col-center">
                    <span className={`badge ${toDST ? 'badge-warning' : 'badge-info'}`}>
                      {toDST ? '☀️ صيفي' : '🌙 شتوي'}
                    </span>
                  </td>
                </tr>

                {/* ── Row 4: Is diff stable? — summary, colSpan 2 ──── */}
                <tr className="td-dst-summary-row">
                  <td className="text-secondary text-xs">الفارق ثابت طوال السنة؟</td>
                  {/*
                   * colSpan={2} spans both city columns.
                   * .td-col-center centres the badge inside.
                   * badge-success = stable year-round
                   * badge-warning = may shift seasonally
                   */}
                  <td className="td-col-center" colSpan={2}>
                    <span className={`badge ${bothFixed ? 'badge-success' : 'badge-warning'}`}>
                      {bothFixed ? '✅ نعم، ثابت' : '⚠️ قد يتغير موسميًا'}
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <p className="text-sm text-secondary leading-loose">
            {dstSummaryText}
          </p>
        </section>

        <div className="my-20">
          <SectionDivider />
        </div>

        <AdInArticle slotId="mid-time-diff-1" />

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 4 — FAQ accordion
            ════════════════════════════════════════════════════════
         *
         * AccordionItem    → .td-faq-item   (card border + radius + open accent)
         * AccordionTrigger → .td-faq-trigger (RTL flex, hover accent-soft bg)
         * AccordionContent → .td-faq-body   (padding, border-top, line-height)
         * [&>div]:p-0 removes shadcn inner wrapper padding so .td-faq-body
         * !important rules are the sole spacing source.
         */}
        <section className="mb-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="active-indicator text-xl font-bold mb-4">
            أسئلة شائعة حول فرق التوقيت
          </h2>

          <div
            className="max-w-3xl mx-auto space-y-2"
          >
            {faqs.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                }}
                aria-label={item.q}
              >
                <summary
                  className="flex cursor-pointer list-none select-none items-center justify-between gap-4 px-5 py-4
                                   [&::-webkit-details-marker]:hidden hover:bg-[color:var(--accent-soft)] transition-colors"
                >
                  {/*
                          BUG-8 FIX: <span> not <h3> — heading inside interactive element
                          is invalid HTML (causes parsing errors in some browsers).
                          The accessible name comes from aria-label on <details>.
                        */}
                  <span
                    className="text-sm sm:text-base font-semibold leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.q}
                  </span>

                  {/*
                          BUG-3 FIX: ChevronDown + group-open:rotate-180
                          Closed = ↓  |  Open = ↑
                          RTL-safe: the rotation is axis-symmetric, looks correct in both
                          text directions unlike ChevronLeft which flips meaning in RTL.
                        */}
                  <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                    style={{ color: 'var(--text-muted)' }}
                    aria-hidden="true"
                  />
                </summary>

                <div
                  className="px-5 pb-5 pt-2"
                >
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <GeoInternalLinks
            title={`روابط مرتبطة بمقارنة ${fromCity.city_name_ar} و${toCity.city_name_ar}`}
            description={`هذه الروابط توصل مقارنة فرق التوقيت بصفحات الوقت الحالي والصلاة والتاريخ الخاصة بكل مدينة ودولة، وهو ما يقوّي الربط الداخلي حول نفس نية البحث.`}
            links={comparisonUtilityLinks}
            ariaLabel={`روابط مرتبطة بمقارنة ${fromCity.city_name_ar} و${toCity.city_name_ar}`}
          />
        </section>

        <div className="my-20">
          <SectionDivider />
        </div>

        {/* ════════════════════════════════════════════════════════
            Internal links
            ════════════════════════════════════════════════════════ */}
        <section className="mx-10">
          <h3 className="text-sm font-semibold text-muted mb-3">خدماتنا الأخرى</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/mwaqit-al-salat', icon: '🕌', label: 'مواقيت الصلاة', desc: 'أوقات دقيقة حسب موقعك أو أي مدينة' },
              { href: '/holidays', icon: '📅', label: 'العطل الرسمية', desc: 'تقويم العطل لجميع الدول العربية' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className="card-nested flex gap-3 items-center hover:border-[var(--border-accent)] hover:bg-accent-soft transition-colors"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">{link.icon}</span>
                <div>
                  <span className="block font-semibold text-sm text-primary">{link.label}</span>
                  <span className="block text-xs text-muted">{link.desc}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}


// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export default function ComparisonPage({ params }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ComparisonPageContent paramsPromise={params} />
    </Suspense>
  );
}
const BASE = getSiteUrl();
