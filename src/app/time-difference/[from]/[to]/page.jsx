/* app/time-difference/[from]/[to]/page.jsx
 *
 * Rendering model: fully STATIC prerender (no PPR "postponed" dynamic hole).
 * `params` is awaited at the top level of the default export — never read inside
 * a Suspense boundary — so this page prerenders into real HTML exactly like the
 * time-now / prayer pages. Every server-side data read on the render path is
 * `'use cache'` (getCachedNowIso → cacheLife('minutes'); geo queries →
 * cacheLife('days')), so nothing forces a per-request dynamic resume.
 *
 * Why this matters: previously the whole page body lived inside one <Suspense>
 * and `params` was read inside it, which turned the entire main content into a
 * postponed streaming hole. When that resume was slow, interrupted, or served
 * during stale-while-revalidate, users (and crawlers) got just the navbar +
 * footer shell with an empty #main-content. Static prerender puts the content
 * in the first HTML flush, so the page always appears. The only live pieces
 * (ticking clocks, the interactive tool) are client islands that hydrate after
 * paint and are wrapped in an ErrorBoundary so a JS failure there can never
 * blank the server-rendered answer.
 */
import TimeDiffCalculator from '@/components/TimeDifference/TimeDiffCalculatorV2.client';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Moon, Sun, CheckCircle2, AlertTriangle } from 'lucide-react';
import './time-difference.css';
import {
  getOffsetMinutes,
  observesDST,
  formatUTCOffset,
  getInitialClockParts,
} from './time-snapshot';
import HeroLiveComparison from '@/components/time-diff/HeroLiveComparison.client';
import FlightArrivalCalculator from '@/components/TimeDifference/FlightArrivalCalculator.client';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { getCachedNowIso } from '@/lib/date-utils';
import { isSeoIndexableTimeDifferencePair } from '@/lib/seo/time-difference-indexing';
import { getPriorityHubTimeDifferencePairs } from '@/lib/seo/time-difference-priority-pairs';
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
import { buildNoindexRouteMetadata, isRouteSlug, isRenderableCityData } from '@/lib/route-param-validation';
import { logger, serializeError } from '@/lib/logger';

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
  const curatedParams = Array.isArray(POPULAR_PAIRS)
    ? POPULAR_PAIRS
        .filter((pair) => isRouteSlug(pair?.from?.slug) && isRouteSlug(pair?.to?.slug))
        .map((pair) => ({ from: pair.from.slug, to: pair.to.slug }))
    : [];

  let priorityHubParams = [];
  try {
    const priorityHubPairs = await getPriorityHubTimeDifferencePairs();
    priorityHubParams = priorityHubPairs
      .filter((pair) => isRouteSlug(pair.from) && isRouteSlug(pair.to))
      .map((pair) => ({ from: pair.from, to: pair.to }));
  } catch (error) {
    logger.warn('time-difference-priority-hub-static-params-failed', { error: serializeError(error) });
  }

  const seen = new Set();
  const params = [];
  for (const param of [...curatedParams, ...priorityHubParams]) {
    const key = `${param.from}::${param.to}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push(param);
  }
  return params;
}

async function getCurrentDateForComparison(routePath, from, to) {
  try {
    const nowIso = await getCachedNowIso();
    const currentDate = new Date(nowIso);
    if (Number.isNaN(currentDate.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return currentDate;
  } catch (error) {
    logger.warn('time-difference-current-date-fallback-used', {
      routePath,
      from,
      to,
      error: serializeError(error),
    });
    return new Date();
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const paramsResolved = await params;
  const { from, to } = paramsResolved;
  if (!isRouteSlug(from) || !isRouteSlug(to)) {
    return buildNoindexRouteMetadata({
      title: `رابط فرق توقيت غير صالح | ${SITE_BRAND}`,
      description: 'هذا الرابط غير صالح أو يحتوي على جزء ديناميكي غير مكتمل، لذلك لا تتم فهرسته.',
      canonical: '/time-difference',
    });
  }

  try {
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
    const sameCountry = fromCountryPrimary === toCountryPrimary;
    const isIndexablePair = isSeoIndexableTimeDifferencePair(canonicalFrom, canonicalTo);
    const title = sameCountry
      ? `كم فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} اليوم؟ | من يسبق الآن؟`
      : `كم فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary} اليوم؟ | من يسبق الآن؟`;
    const description = sameCountry
      ? `اعرف فوراً من يسبق الآن بين ${fromCity.city_name_ar} و${toCity.city_name_ar} وكم ساعة الفرق بينهما، مع تحويل الوقت المباشر وأفضل وقت للاتصال أو الاجتماع.`
      : `اعرف فوراً من يسبق الآن بين ${fromCountryPrimary} و${toCountryPrimary} وكم ساعة الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar}، مع تحويل الوقت المباشر وأفضل وقت للاتصال أو الاجتماع.`;
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
      `أفضل وقت للاجتماعات المشتركة بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
      `كم الساعة عند وصولي من ${fromCity.city_name_ar} إلى ${toCity.city_name_ar}`,
      `حساب وقت الوصول حسب مدة الرحلة بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    ];
    const keywords = uniqueKeywords(keywordsArray);

    return {
      title, description, keywords,
      alternates: { canonical: `${BASE}${canonicalHref}` },
      openGraph: { title, description, url: `${BASE}${canonicalHref}`, locale: 'ar_SA', type: 'website' },
      twitter: { card: 'summary', title, description },
      robots: {
        index: isIndexablePair,
        follow: true,
        googleBot: {
          index: isIndexablePair,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
        },
      },
    };
  } catch (error) {
    logger.error('time-difference-metadata-failed', {
      routePath: `/time-difference/${from}/${to}`,
      from,
      to,
      error: serializeError(error),
    });
    return {
      title: `فرق التوقيت | ${SITE_BRAND}`,
      description: 'قارن فرق التوقيت بين المدن والدول مع تحويل الوقت المباشر ومسارات الوقت والصلاة والتاريخ داخل ميقاتنا.',
      alternates: { canonical: `${BASE}/time-difference/${from}/${to}` },
    };
  }
}


export default async function ComparisonPage({ params }) {
  const { from, to } = await params;
  if (!isRouteSlug(from) || !isRouteSlug(to)) notFound();

  let fromCity;
  let toCity;
  try {
    [fromCity, toCity] = await Promise.all([
      resolveTimeDifferenceCityFromSegment(from),
      resolveTimeDifferenceCityFromSegment(to),
    ]);
  } catch (error) {
    logger.error('time-difference-page-data-failed', {
      routePath: `/time-difference/${from}/${to}`,
      from,
      to,
      error: serializeError(error),
    });
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات المقارنة الآن"
        title="صفحة فرق التوقيت غير متاحة بالكامل الآن"
        description="تعذر تحميل بيانات المدينتين أو الدولة المرتبطة بهما في هذه اللحظة، لذلك عرضنا لك بديلاً واضحاً يمنع تحول الصفحة إلى خطأ خادم كامل."
        primaryLink={{
          href: '/time-difference',
          label: 'افتح قسم فرق التوقيت',
          description: 'ابدأ من الحاسبة الرئيسية ثم اختر زوجاً آخر من المدن أو الدول.',
        }}
        secondaryLinks={[
          {
            href: '/time-now',
            label: 'افتح الوقت الان',
            description: 'يمكنك الوصول إلى الوقت الحالي حسب الدولة أو المدينة من القسم الرئيسي.',
          },
          {
            href: '/mwaqit-al-salat',
            label: 'افتح مواقيت الصلاة',
            description: 'انتقل إلى صفحات الصلاة إذا كان هدفك الوصول إلى التوقيت المحلي المرتبط بالمدينة.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'استخدم فهرس الصفحات للوصول السريع إلى المسار الأقرب إلى سؤالك الحالي.',
          },
        ]}
      />
    );
  }
  if (!fromCity || !toCity) notFound();
  if (!isRenderableCityData(fromCity) || !isRenderableCityData(toCity)) notFound();
  const canonicalFrom = fromCity.canonicalSegment || from;
  const canonicalTo = toCity.canonicalSegment || to;
  if (canonicalFrom !== from || canonicalTo !== to) {
    permanentRedirect(buildTimeDifferenceHref(canonicalFrom, canonicalTo));
  }
  const [fromCountryPrimary] = getCountrySeoNames(fromCity.country_slug, fromCity.country_name_ar);
  const [toCountryPrimary] = getCountrySeoNames(toCity.country_slug, toCity.country_name_ar);
  const sameCountry = fromCountryPrimary === toCountryPrimary;
  const comparisonQuery = `فرق التوقيت بين ${fromCountryPrimary} و${toCountryPrimary}`;
  const countryContext = `${fromCountryPrimary} (${fromCity.city_name_ar}) و${toCountryPrimary} (${toCity.city_name_ar})`;
  const pairHref = buildTimeDifferenceHref(canonicalFrom, canonicalTo);

  const CURRENT_DATE = await getCurrentDateForComparison(`/time-difference/${from}/${to}`, from, to);
  const fromOffMin = getOffsetMinutes(fromCity.timezone, CURRENT_DATE);
  const toOffMin = getOffsetMinutes(toCity.timezone, CURRENT_DATE);
  const diffMinutes = toOffMin - fromOffMin;
  const diffHours = diffMinutes / 60;

  const fromHasDST = observesDST(fromCity.timezone, CURRENT_DATE);
  const toHasDST = observesDST(toCity.timezone, CURRENT_DATE);
  const initialDiffData = getTimeDifference(fromCity.timezone, toCity.timezone, CURRENT_DATE);
  const fromDST = Boolean(initialDiffData?.success && initialDiffData.isDSTFrom);
  const toDST = Boolean(initialDiffData?.success && initialDiffData.isDSTTo);

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
  const headerLine = diffMinutes === 0
    ? `${fromCity.city_name_ar} و${toCity.city_name_ar} على نفس التوقيت الآن (${fromOffStr})، ولا فرق بينهما في الساعة.`
    : `${ahead} تسبق ${behind} بـ${diffLabel} الآن، حسب توقيت ${fromCity.city_name_ar} (${fromOffStr}) و${toCity.city_name_ar} (${toOffStr}).`;

  // ─── DST summary paragraph ────────────────────────────────────────────────
  const dstSummaryText = bothFixed
    ? <>الفارق بين {fromCity.city_name_ar} و{toCity.city_name_ar} ثابت طوال العام عند <strong className="text-primary">{diffLabel}</strong>. لا تطبق أيٌّ منهما التوقيت الصيفي.</>
    : (!fromHasDST && toHasDST)
      ? <>{toCity.city_name_ar} تطبق التوقيت الصيفي بينما {fromCity.city_name_ar} لا تطبقه. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يتغير ساعة في مارس/أكتوبر.</>
      : (fromHasDST && !toHasDST)
        ? <>{fromCity.city_name_ar} تطبق التوقيت الصيفي بينما {toCity.city_name_ar} لا تطبقه. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يتغير موسميًا.</>
        : <>كلتاهما تطبقان التوقيت الصيفي. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يبقى ثابتًا أو يتغير ساعة حسب توقيت كل منهما.</>;

  // ─── FAQ data — only questions not already answered by the hero/tool/table ─
  const faqs = [
    {
      q: `هل يتغير الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar} خلال العام؟`,
      a: bothFixed
        ? `لا، الفرق ثابت عند ${diffLabel} طوال السنة، إذ لا تطبق أيٌّ منهما التوقيت الصيفي.`
        : `نعم، قد يتغير بمقدار ساعة في فترات التوقيت الصيفي. الفرق الحالي ${diffLabel}.`,
    },
    {
      q: `هل هذا هو نفس فرق التوقيت بين كل مدن ${toCountryPrimary} و${fromCountryPrimary}؟`,
      a: `ليس دائمًا. هذه المقارنة بين ${fromCity.city_name_ar} و${toCity.city_name_ar} فقط، وقد يختلف فرق التوقيت داخل الدولة نفسها إذا كانت تضم أكثر من منطقة زمنية.`
    },
    {
      q: `ما أفضل وقت للتواصل بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `افتح "أفضل وقت للتواصل" في الأداة أعلاه واضبط ساعات دوامك — ستظهر لك نافذة التقاطع الفعلية بتوقيت كل مدينة فور تغييرها.`,
    },
    {
      q: `هل يكفي هذا الفرق لموعد مستقبلي بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: bothFixed
        ? `غالباً نعم لأن المدينتين لا تغيّران الساعة موسمياً، لكن يبقى الأفضل مراجعة التاريخ المحلي قبل إرسال دعوة رسمية أو حجز سفر.`
        : `لا تعتمد على الفرق الحالي وحده إذا كان الموعد بعد أسابيع أو أشهر. إحدى المدينتين قد تدخل أو تخرج من التوقيت الصيفي، لذلك استخدم أداة التحويل أعلاه بتاريخ الموعد نفسه.`
    },
    {
      q: `هل التاريخ واحد في ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: Math.abs(diffMinutes) >= 720
        ? `بسبب الفرق الكبير (${diffLabel}) قد يختلف التاريخ في بعض الساعات. أداة التحويل أعلاه تُنبّهك تلقائيًا بعلامة "يوم مختلف".`
        : `في الغالب نعم، الفرق لا يتجاوز حدود اليوم في معظم الأحوال.`,
    },
    {
      q: `كيف أحسب فرق التوقيت يدويًا؟`,
      a: `اطرح UTC الأولى من UTC الثانية: (${toOffMin >= 0 ? '+' : ''}${toOffMin}) − (${fromOffMin >= 0 ? '+' : ''}${fromOffMin}) = ${diffMinutes > 0 ? '+' : ''}${diffMinutes} دقيقة أي ${diffLabel}.`,
    },
    {
      q: `هل يتغير الفرق في رمضان؟`,
      a: `لا تغيّر الدول العربية توقيتها الرسمي بسبب رمضان. الفرق يبقى ${diffLabel} إلا إذا صادف رمضان فترة التوقيت الصيفي في إحدى الدولتين.`,
    },
    {
      q: `كيف أشارك مقارنة التوقيت؟`,
      a: `اضغط زر "مشاركة" أعلى الصفحة. يُنسخ الرابط تلقائيًا ويمكن مشاركته مباشرة.`,
    },
    {
      q: `كيف أعرف وقت وصولي عند السفر من ${fromCity.city_name_ar} إلى ${toCity.city_name_ar}؟`,
      a: `استخدم "وقت الوصول عند السفر" أعلى الصفحة: أدخل وقت مغادرة رحلتك ومدتها، وستظهر لك الساعة المحلية عند وصولك في ${toCity.city_name_ar} تلقائيًا مع توضيح هل ستصل في نفس اليوم أو اليوم التالي.`,
    },
  ];

  // ─── JSON-LD ──────────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${BASE}` },
      { '@type': 'ListItem', position: 2, name: 'فرق التوقيت', item: `${BASE}/time-difference` },
      { '@type': 'ListItem', position: 3, name: `${fromCity.city_name_ar} – ${toCity.city_name_ar}`, item: `${BASE}${pairHref}` },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${comparisonQuery} | ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    url: `${BASE}${pairHref}`,
    description: headerLine,
    inLanguage: 'ar',
    about: [
      { '@type': 'Thing', name: fromCountryPrimary },
      { '@type': 'Thing', name: toCountryPrimary },
      { '@type': 'Thing', name: fromCity.city_name_ar },
      { '@type': 'Thing', name: toCity.city_name_ar },
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
        label: `الوقت الان في ${fromCity.city_name_ar}`,
        description: `اعرف الساعة الحالية والتاريخ اليوم في ${fromCity.city_name_ar}.`,
      },
      {
        href: `/time-now/${toCity.country_slug}/${toCity.city_slug}`,
        label: `الوقت الان في ${toCity.city_name_ar}`,
        description: `اعرف الساعة الحالية والتاريخ اليوم في ${toCity.city_name_ar}.`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20">

        {/* First thing on the page, before the breadcrumb/H1 — see
            AdTopBanner.tsx v3. */}
        <AdTopBanner slotId="top-time-diff" />

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          <span aria-hidden="true">›</span>
          <Link href="/time-difference" className="hover:text-accent transition-colors">فرق التوقيت</Link>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{fromCity.city_name_ar} – {toCity.city_name_ar}</span>
        </nav>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="mb-6">
          <div className="mb-3">
            <span className={`badge ${diffMinutes === 0 ? 'badge-success' : 'badge-accent'}`}>
              {diffMinutes === 0 ? 'نفس التوقيت' : `فارق ${diffLabel}`}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight mb-3">
            {sameCountry ? (
              <>
                كم فرق التوقيت بين <span className="text-accent">{fromCity.city_name_ar}</span>
                {' '}و{' '}
                <span className="text-accent">{toCity.city_name_ar}</span>؟
              </>
            ) : (
              <>
                كم فرق التوقيت بين <span className="text-accent">{fromCountryPrimary}</span>
                {' '}و{' '}
                <span className="text-accent">{toCountryPrimary}</span>؟
              </>
            )}
          </h1>
          <p className="text-sm text-secondary leading-relaxed">
            {headerLine}
          </p>
        </header>

        {/* ── Hero: the one live answer module ─────────────────────────
            Client island (ticking clocks). Isolated: if it throws on the
            client, the static header answer above still stands. */}
        <ErrorBoundary name="time-diff-hero">
          <HeroLiveComparison
            fromCity={fromCity}
            toCity={toCity}
            diffMinutes={diffMinutes}
            diffLabel={diffLabel}
            fromHasDST={fromDST}
            toHasDST={toDST}
            fromInitial={getInitialClockParts(fromCity.timezone, CURRENT_DATE)}
            toInitial={getInitialClockParts(toCity.timezone, CURRENT_DATE)}
            shareHref={pairHref}
          />
        </ErrorBoundary>

        {/* ── Interactive tool: change cities, convert time, shared hours ──
            Client island. Isolated so a failure here can't take down the
            static explanation / DST table / FAQ that follow. */}
        <section className="td-section" aria-label="أدوات فرق التوقيت التفاعلية">
          <ErrorBoundary name="time-diff-calculator">
            <TimeDiffCalculator
              initialFrom={fromCity}
              initialTo={toCity}
              initialDiffData={initialDiffData}
            />
          </ErrorBoundary>
        </section>

        {/* ── Flight arrival: distinct tool + distinct keyword cluster ──── */}
        <section className="td-section" aria-labelledby="flight-arrival-heading">
          <h2 id="flight-arrival-heading" className="td-h2">
            وقت الوصول عند السفر بين {fromCity.city_name_ar} و{toCity.city_name_ar}
          </h2>
          <ErrorBoundary name="time-diff-flight-arrival">
            <FlightArrivalCalculator
              fromCityAr={fromCity.city_name_ar}
              toCityAr={toCity.city_name_ar}
              diffMinutes={diffMinutes}
            />
          </ErrorBoundary>
        </section>

        {/* ── Explanation + DST, merged into one section ──────────────── */}
        <section className="td-section" aria-labelledby="dst-heading">
          <h2 id="dst-heading" className="td-h2">
            فرق التوقيت بين {fromCountryPrimary} و{toCountryPrimary} والتوقيت الصيفي
          </h2>

          <p className="td-body">
            {diffMinutes === 0
              ? <>
                <strong className="text-primary">{countryContext}</strong> على نفس
                النطاق الزمني <strong dir="ltr" className="tabular-nums">{fromOffStr}</strong> حالياً،
                فلا حاجة لتحويل الوقت بين {fromCity.city_name_ar} و{toCity.city_name_ar}.
              </>
              : <>
                <strong className="text-primary">{fromCity.city_name_ar}</strong> على{' '}
                <strong dir="ltr" className="tabular-nums">{fromOffStr}</strong> و
                <strong className="text-primary">{toCity.city_name_ar}</strong> على{' '}
                <strong dir="ltr" className="tabular-nums">{toOffStr}</strong>،
                بفارق <strong className="text-primary">{diffLabel}</strong>{' '}
                تسبق فيه <strong className="text-primary">{ahead}</strong> مدينة{' '}
                <strong className="text-primary">{behind}</strong>.{' '}
                مثال: الساعة{' '}
                <span dir="ltr" className="tabular-nums font-bold">9:00 ص</span> في{' '}
                {fromCity.city_name_ar} تعادل{' '}
                <span dir="ltr" className="tabular-nums font-bold text-accent-alt">
                  {fmtTime(9 + diffHours)}
                </span>{' '}
                في {toCity.city_name_ar}.
              </>
            }
          </p>

          <h3 className="td-h3">هل يتغير هذا الفارق خلال السنة؟</h3>

          <div className="table-wrapper mb-4">
            <table className="table table--compact">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>المعلومة</th>
                  <th className="td-col-center" style={{ width: '30%' }}>{fromCity.city_name_ar}</th>
                  <th className="td-col-center" style={{ width: '30%' }}>{toCity.city_name_ar}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-secondary text-xs">التوقيت (UTC)</td>
                  <td className="td-col-center tabular-nums font-bold text-accent-alt" dir="ltr">{fromOffStr}</td>
                  <td className="td-col-center tabular-nums font-bold text-accent-alt" dir="ltr">{toOffStr}</td>
                </tr>
                <tr>
                  <td className="text-secondary text-xs">يطبق التوقيت الصيفي؟</td>
                  <td className="td-col-center">
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
                <tr>
                  <td className="text-secondary text-xs">الحالة الآن</td>
                  <td className="td-col-center">
                    <span className={`badge ${fromDST ? 'badge-warning' : 'badge-info'}`}>
                      {fromDST ? <><Sun size={12} aria-hidden="true" /> توقيت صيفي</> : <><Moon size={12} aria-hidden="true" /> توقيت شتوي</>}
                    </span>
                  </td>
                  <td className="td-col-center">
                    <span className={`badge ${toDST ? 'badge-warning' : 'badge-info'}`}>
                      {toDST ? <><Sun size={12} aria-hidden="true" /> توقيت صيفي</> : <><Moon size={12} aria-hidden="true" /> توقيت شتوي</>}
                    </span>
                  </td>
                </tr>
                <tr className="td-dst-summary-row">
                  <td className="text-secondary text-xs">الفارق ثابت طوال السنة؟</td>
                  <td className="td-col-center" colSpan={2}>
                    <span className={`badge ${bothFixed ? 'badge-success' : 'badge-warning'}`}>
                      {bothFixed ? <><CheckCircle2 size={12} aria-hidden="true" /> نعم، ثابت</> : <><AlertTriangle size={12} aria-hidden="true" /> قد يتغير موسمياً</>}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="td-body td-body--muted">
            {dstSummaryText}
          </p>

          <p className="td-trust">
            يعتمد الحساب على قاعدة{' '}
            <a href="https://www.iana.org/time-zones" target="_blank" rel="noopener noreferrer">IANA</a>
            {' '}للمناطق الزمنية ومعيار{' '}
            <a href="https://www.bipm.org/en/time-metrology" target="_blank" rel="noopener noreferrer">UTC</a>
            {' '}العالمي، ويتحدّث تلقائياً عند تغيّر قواعد{' '}
            <a href="https://www.timeanddate.com/time/dst/" target="_blank" rel="noopener noreferrer">التوقيت الصيفي</a>
            {' '}في أي من البلدين.
          </p>
        </section>

        <AdInArticle slotId="mid-time-diff-1" />

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="td-section" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="td-h2">
            أسئلة قبل تثبيت موعد بين المدينتين
          </h2>

          <div className="faq-list">
            {faqs.map((item, idx) => (
              <details key={idx} className="faq-item" aria-label={item.q}>
                <summary className="faq-item__summary">
                  <span className="faq-item__question">{item.q}</span>
                  <ChevronDown size={18} className="faq-item__chevron" aria-hidden="true" />
                </summary>
                <div className="faq-item__body">
                  <p className="feature-tile__copy">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="td-section">
          <GeoInternalLinks
            title={`خطوات تكمل مقارنة ${fromCity.city_name_ar} و${toCity.city_name_ar}`}
            description={`إذا بدأت بمقارنة ${fromCity.city_name_ar} و${toCity.city_name_ar}، فاختر المسار التالي حسب حاجتك: الوقت الحالي، الصلاة، أو التاريخ في الصفحات المرتبطة بكل مدينة أو دولة.`}
            links={comparisonUtilityLinks}
            ariaLabel={`خطوات تكمل مقارنة ${fromCity.city_name_ar} و${toCity.city_name_ar}`}
          />
        </section>

        <AdMultiplex slotId={`end-time-diff-${from}-${to}`} />

        </main>
      </AdLayoutWrapper>
    </div>
  );
}

const BASE = getSiteUrl();
