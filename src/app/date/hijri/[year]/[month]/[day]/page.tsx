// src/app/date/hijri/[year]/[month]/[day]/page.tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  convertDate,
  getHijriMonthDays,
  ISLAMIC_MONTH_NAMES_AR,
} from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { DateNavigation } from '@/components/date/DateNavigation';
import { DateShareActions } from '@/components/date/DateShareActions';
import {
  DateEditorialSections,
  buildDateFaqJsonLd,
  type DateFaqItem,
  type DateInsightItem,
} from '@/components/date/DateEditorialSections';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { CalendarDays, ArrowLeftRight, Calendar } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { isSeoIndexableHijriDate } from '@/lib/seo/date-indexing';
import {
  validateHijriDateRouteSegments,
} from '@/lib/route-param-validation';

// NOTE: Static folder 'hijri' takes priority over dynamic '[year]' at the same level.
// This resolves correctly: /date/hijri/... always hits this route, never the [year] route.

const BASE_URL = getSiteUrl();

interface HijriDateDecisionRow {
  label: string;
  value: string;
}

interface HijriDateSourceLink {
  href: string;
  label: string;
  description: string;
}

const HIJRI_DATE_SOURCE_LINKS: readonly HijriDateSourceLink[] = [
  {
    href: 'https://www.ummulqura.org.sa/Index.aspx',
    label: 'تقويم أم القرى',
    description: 'مرجع سعودي للتقويم الهجري والتحويل، ويستخدم هنا كطريقة الحساب الأساسية.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'يوضح اختلاف أم القرى والحساب المدني والفلكي، ولماذا قد يظهر فرق يوم واحد.',
  },
  {
    href: 'https://www.britannica.com/topic/Islamic-calendar',
    label: 'Britannica: التقويم الإسلامي',
    description: 'خلفية موثوقة عن التقويم الهجري القمري وشهوره وطبيعته غير الشمسية.',
  },
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية عن التقويم الميلادي المستخدم في الأنظمة المدنية والحجوزات والأرشفة.',
  },
];

function buildHijriDecisionRows(
  hijriLabel: string,
  gregorianLabel: string,
  monthNameAr: string,
  daysLeftInHijriMonth: number,
): HijriDateDecisionRow[] {
  return [
    {
      label: 'تريد الإجابة المباشرة',
      value: `${hijriLabel} يوافق ${gregorianLabel}م. انسخ الصيغتين معاً إذا كنت سترسل التاريخ أو تحفظه في سجل.`,
    },
    {
      label: 'التاريخ في وثيقة أو سجل',
      value: 'اكتب التاريخ الهجري كما ورد في الوثيقة، ثم أضف المقابل الميلادي ولا تستبدل الأصل إذا كان سيُراجع رسمياً.',
    },
    {
      label: 'قريب من بداية أو نهاية الشهر',
      value: daysLeftInHijriMonth === 0
        ? `هذا اليوم نهاية شهر ${monthNameAr} حسب الحساب الحالي، لذلك راجع إعلان بلدك إذا كان الموعد حساساً.`
        : `تبقى ${daysLeftInHijriMonth} يوم في شهر ${monthNameAr} حسب الحساب الحالي؛ راجع اليوم السابق والتالي إذا كان الموعد حساساً.`,
    },
    {
      label: 'مرتبط برمضان أو الحج أو عيد',
      value: 'تعامل مع النتيجة كتحويل حسابي واضح، ثم طابقها مع الجهة الرسمية أو التقويم المحلي للبلد.',
    },
  ];
}

export async function generateStaticParams() {
  const now = new Date();
  const isoDate = [
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('-');
  const hijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });

  return [{
    year: String(hijri.year),
    month: String(hijri.month).padStart(2, '0'),
    day: String(hijri.day).padStart(2, '0'),
  }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}): Promise<Metadata> {
  const { year, month, day } = await params;
  const routeDate = validateHijriDateRouteSegments({ year, month, day });
  if (!routeDate.valid) {
    notFound();
  }

  const hYear = routeDate.year;
  const hMonth = routeDate.month;
  const hDay = routeDate.day;
  if (hYear < 1343 || hYear > 1500) {
    notFound();
  }

  const gregorian = convertDate({ date: routeDate.isoDate, toCalendar: 'gregorian', method: 'umalqura' });

  const monthAr = ISLAMIC_MONTH_NAMES_AR[hMonth - 1];
  const hijriLabel = `${hDay} ${monthAr} ${hYear} هجري`;
  const isIndexableDate = isSeoIndexableHijriDate(
    routeDate,
    new Date(await getCachedNowIso()),
  );

  const dayName = new Date(`${gregorian.year}-${String(gregorian.month).padStart(2, '0')}-${String(gregorian.day).padStart(2, '0')}`).toLocaleDateString('ar-EG', { weekday: 'long' });
  const islamicEvents = getIslamicEventsForHijriDate(hYear, hMonth, hDay);
  const firstEvent = islamicEvents[0];

  const title = `${hijriLabel} — ${dayName} | ${gregorian.formatted.ar}`;
  const description = firstEvent
    ? `${hijriLabel} يوافق ${gregorian.formatted.ar}م — ${firstEvent.name}. مع مقارنة طرق الحساب والتقويم الشهري.`
    : `${hijriLabel} يوافق ${gregorian.formatted.ar}م (أم القرى). يوم ${dayName}. مع مقارنة الطرق الثلاث والتقويم الهجري للشهر.`;

  return {
    title,
    description,
    keywords: [
      ...buildDateKeywords({ gregorianYear: gregorian.year, hijriYear: hYear }),
      `${hijriLabel} كم ميلادي`,
      `${hDay} ${monthAr} ${hYear} يوافق ميلادي`,
      `تحويل ${hijriLabel} إلى ميلادي`,
      `${year}/${month}/${day} هجري كم ميلادي`,
      `التاريخ الهجري ${hijriLabel}`,
    ],
    alternates: { canonical: `${BASE_URL}/date/hijri/${year}/${month}/${day}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/date/hijri/${year}/${month}/${day}`,
      locale: 'ar_SA',
    },
    robots: {
      index: isIndexableDate,
      follow: true,
      googleBot: {
        index: isIndexableDate,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProgrammaticHijriDatePage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;

  // Zero-padding redirect
  if (month.length < 2 || day.length < 2) {
    redirect(`/date/hijri/${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`);
  }

  const routeDate = validateHijriDateRouteSegments({ year, month, day });
  if (!routeDate.valid) notFound();

  const hY = routeDate.year;
  const hM = routeDate.month;
  const hD = routeDate.day;
  if (hY < 1343 || hY > 1500) notFound();

  const isoHijri = routeDate.isoDate;

  const gregorian = convertDate({ date: isoHijri, toCalendar: 'gregorian', method: 'umalqura' });

  const islamicEvents = getIslamicEventsForHijriDate(hY, hM, hD);
  const monthNameAr = ISLAMIC_MONTH_NAMES_AR[hM - 1];

  // Prev/next Hijri day navigation
  const daysInMonth = getHijriMonthDays(hY, hM);
  const daysLeftInHijriMonth = daysInMonth - hD;
  const hasPreviousDate = !(hY === 1343 && hM === 1 && hD === 1);
  const hasNextDate = !(hY === 1500 && hM === 12 && hD === daysInMonth);
  const prevHY = hasPreviousDate && hD === 1 && hM === 1 ? hY - 1 : hY;
  const prevHMAdj = hasPreviousDate && hD === 1 ? (hM === 1 ? 12 : hM - 1) : hM;
  const prevHDAdj = hasPreviousDate
    ? (hD === 1 ? getHijriMonthDays(prevHY, prevHMAdj) : hD - 1)
    : null;
  const nextHY = hasNextDate && hD === daysInMonth && hM === 12 ? hY + 1 : hY;
  const nextHMAdj = hasNextDate && hD === daysInMonth ? (hM === 12 ? 1 : hM + 1) : hM;
  const nextHDAdj = hasNextDate ? (hD === daysInMonth ? 1 : hD + 1) : null;

  const fmtNav = (hy: number, hm: number, hd: number) =>
    `/date/hijri/${hy}/${String(hm).padStart(2, '0')}/${String(hd).padStart(2, '0')}`;
  const HIJRI_MONTHS = ISLAMIC_MONTH_NAMES_AR;
  const fmtLabel = (hm: number, hd: number) => `${hd} ${HIJRI_MONTHS[hm - 1]}`;
  const hijriLabel = `${hD} ${monthNameAr} ${hY} هجري`;
  const gregorianLabel = gregorian.formatted.ar;
  const gregorianPageUrl = `/date/${gregorian.year}/${String(gregorian.month).padStart(2, '0')}/${String(gregorian.day).padStart(2, '0')}`;
  const hijriCalendarUrl = `/date/calendar/hijri/${hY}`;
  const gregorianCalendarUrl = `/date/calendar/${gregorian.year}`;
  const decisionRows = buildHijriDecisionRows(hijriLabel, gregorianLabel, monthNameAr, daysLeftInHijriMonth);

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'هجري', href: '/date/today/hijri' },
    { label: `${hD} ${monthNameAr} ${hY}` },
  ];

  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${hijriLabel} | ${gregorianLabel}`,
    description: `${hijriLabel} يوافق ${gregorianLabel}م حسب أم القرى، مع روابط اليوم السابق والتالي وقواعد الاعتماد.`,
    url: `${BASE_URL}/date/hijri/${year}/${month}/${day}`,
    inLanguage: 'ar',
    about: ['تحويل هجري إلى ميلادي', 'تاريخ هجري محدد', 'تقويم أم القرى', monthNameAr, 'التقويم الميلادي'],
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `كيفية قراءة ${hijriLabel} بالميلادي`,
    step: [
      { '@type': 'HowToStep', text: `ابدأ من التاريخ الهجري الكامل: ${hijriLabel}.` },
      { '@type': 'HowToStep', text: `اقرأ المقابل الميلادي الأساسي: ${gregorianLabel}م.` },
      { '@type': 'HowToStep', text: 'راجع اليوم السابق والتالي إذا كان التاريخ قريباً من بداية الشهر أو نهايته.' },
      { '@type': 'HowToStep', text: 'طابق النتيجة مع إعلان بلدك أو الجهة الرسمية عند المواعيد الدينية والقانونية.' },
    ],
  };
  const faqItems: DateFaqItem[] = [
    {
      question: `كم يوافق ${hijriLabel} ميلادياً؟`,
      answer: `${hijriLabel} يوافق ${gregorianLabel}م وفق حساب أم القرى. إذا كان التاريخ سيستخدم في وثيقة أو موعد ديني، فراجع المرجع الرسمي أيضاً.`,
    },
    {
      question: `هل تاريخ ${hijriLabel} ثابت في كل الدول؟`,
      answer: 'قد يختلف التاريخ الهجري الرسمي بيوم واحد بين بعض الدول بحسب طريقة اعتماد بداية الشهر. استخدم النتيجة هنا كمرجع حسابي، وراجع الجهة الرسمية عند التعامل مع موعد ديني أو قانوني.',
    },
    {
      question: 'كيف أتحقق من اليوم السابق أو التالي؟',
      answer: 'توجد أزرار تنقل لليوم السابق واليوم التالي أسفل النتيجة. استخدمها عندما يكون الموعد قريباً من بداية الشهر الهجري أو نهايته حتى ترى إن كان الفرق بيوم واحد مؤثراً.',
    },
    {
      question: 'متى أستخدم صفحة التحويل بدلاً من هذه الصفحة؟',
      answer: 'استخدم هذه الصفحة عندما تريد قراءة تاريخ هجري محدد. استخدم محول التاريخ عندما تحتاج إدخال تاريخ آخر أو مقارنة النتيجة بين أم القرى والحساب الفلكي والمدني.',
    },
    {
      question: 'ما نطاق التواريخ الهجرية المدعوم هنا؟',
      answer: 'هذه الصفحة تدعم النطاق العملي الحديث من 1343 إلى 1500 هجري تقريباً. التواريخ الأقدم تحتاج مراجع تاريخية متخصصة لأن إثبات الشهور كان يعتمد على سياقات محلية ومصادر مختلفة.',
    },
  ];

  const insights: DateInsightItem[] = [
    {
      badge: 'المقابل الميلادي',
      title: `${hijriLabel} ليس رقماً فقط`,
      body: `هذا اليوم يوافق ${gregorianLabel}م، لذلك يمكنك استخدامه عند مطابقة تاريخ هجري مكتوب في وثيقة مع تقويم ميلادي حديث.`,
      tone: 'accent',
    },
    {
      badge: 'مراجعة محلية',
      title: 'انتبه لاختلاف بدايات الأشهر',
      body: 'إذا كان التاريخ قريباً من أول الشهر أو آخره، فمن الطبيعي أن تختلف بعض الدول يوماً واحداً. هذا مهم خصوصاً في رمضان وذي الحجة والأعياد.',
      tone: 'warning',
    },
    {
      badge: islamicEvents.length > 0 ? 'مناسبة مرتبطة' : 'استخدام عملي',
      title: islamicEvents.length > 0 ? islamicEvents.map((event) => event.nameAr).join('، ') : 'مفيد للأرشفة والتخطيط',
      body: islamicEvents.length > 0
        ? 'وجود مناسبة في هذا اليوم يجعل قراءة التاريخ مع المقابل الميلادي أكثر أهمية عند المشاركة أو التخطيط.'
        : 'يمكن استخدام هذه الصفحة لمطابقة السجلات، كتابة المواعيد، أو الانتقال بسرعة إلى اليوم السابق والتالي بدون إعادة إدخال التاريخ.',
      tone: islamicEvents.length > 0 ? 'success' : 'info',
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd
        data={buildDateFaqJsonLd({
          pageName: `أسئلة ${hijriLabel}`,
          items: faqItems,
        })}
      />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-8">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                {gregorian.dayNameAr}، {hD} {monthNameAr} {hY} هـ
              </p>
              <h1 className="date-hero-title text-accent-alt">
                {hijriLabel} يوافق {gregorianLabel}م
              </h1>
              <p className="date-hero-copy">
                {hijriLabel} يوافق {gregorianLabel}م حسب أم القرى. اقرأ النتيجة، ثم راجع اليوم السابق والتالي
                إذا كان الموعد قريباً من بداية الشهر أو نهايته أو سيُستخدم في وثيقة أو مناسبة رسمية.
              </p>
              {islamicEvents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-success">
                    {islamicEvents.map(e => e.nameAr).join(' • ')}
                  </span>
                </div>
              )}
            </div>
            <aside className="date-hero-rail" aria-label="ملخص التاريخ الهجري والميلادي">
              <p className="date-hero-answer">{gregorianLabel}م</p>
              <p className="date-hero-note">
                {daysLeftInHijriMonth === 0
                  ? `ينتهي شهر ${monthNameAr} في هذا اليوم وفق الحساب الحالي.`
                  : `تبقى ${daysLeftInHijriMonth} يوم في شهر ${monthNameAr} وفق الحساب الحالي.`}
              </p>
              <div className="date-hero-actions">
                <Link href="/date/hijri-to-gregorian" className="date-hero-link date-hero-link--primary">
                  تحويل تاريخ هجري آخر
                </Link>
                <Link
                  href={gregorianPageUrl}
                  className="date-hero-link"
                >
                  فتح الصفحة الميلادية
                </Link>
              </div>
            </aside>
          </section>

          <AdTopBanner slotId={`top-date-hijri-${year}-${month}-${day}`} slotKey="topDateBanner" />

          {/* SHARE */}
          <section className="mb-8">
            <DateShareActions
              hijriFormatted={`${hD} ${monthNameAr} ${hY} هـ`}
              gregorianFormatted={gregorian.formatted.ar}
              hijriIso={isoHijri}
              gregorianIso={gregorian.formatted.iso}
              pageUrl={`${BASE_URL}/date/hijri/${year}/${month}/${day}`}
            />
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="hijri-date-decision-heading">
            <h2 id="hijri-date-decision-heading" className="date-section-title">
              قبل أن تعتمد نتيجة {hijriLabel}
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

          {/* NAVIGATION */}
          <section className="mb-8">
            <DateNavigation
              prevUrl={prevHDAdj === null ? undefined : fmtNav(prevHY, prevHMAdj, prevHDAdj)}
              nextUrl={nextHDAdj === null ? undefined : fmtNav(nextHY, nextHMAdj, nextHDAdj)}
              prevLabel={prevHDAdj === null ? undefined : fmtLabel(prevHMAdj, prevHDAdj)}
              nextLabel={nextHDAdj === null ? undefined : fmtLabel(nextHMAdj, nextHDAdj)}
              hubHref="/date/calendar/hijri"
            />
          </section>

          <DateEditorialSections
            badge="قراءة التاريخ"
            title={`ماذا يعني ${hD} ${monthNameAr} ${hY} هجري؟`}
            intro="تبدأ الصفحة بالمقابل الميلادي بسرعة، ثم تضيف السياق الذي تحتاجه عند استعمال التاريخ في وثيقة أو موعد أو مناسبة دينية."
            insights={insights}
            faqTitle="أسئلة قبل الاعتماد على هذا التاريخ الهجري"
            faqItems={faqItems}
          />

          <section className="date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">كيف تستخدم هذه الصفحة دون التباس؟</h2>
              <p className="date-editorial-copy">
                إذا كان التاريخ الهجري مكتوباً في وثيقة أو دعوة أو مناسبة عائلية، فابدأ من المقابل الميلادي المعروض هنا ثم انتقل إلى اليوم السابق أو التالي إذا كان الموعد قريباً من بداية الشهر. في الحالات الرسمية، قارن النتيجة مع الجهة المحلية لأن اعتماد الهلال قد يغيّر اليوم بيوم واحد.
              </p>
              <p className="date-editorial-copy">
                ولتقليل الالتباس عند المشاركة، اكتب التاريخين معاً كما تظهرهما الصفحة، خصوصاً إذا كان المستلم يستخدم تقويماً مختلفاً أو يعيش في دولة تعتمد إعلاناً محلياً للهلال.
              </p>
              <p className="date-editorial-copy">
                إذا كنت تبحث عن هذا اليوم لأنه مرتبط برمضان أو الحج أو العيد أو تاريخ ميلاد، فلا تكتفِ بسؤال "كم يوافق؟" فقط. اسأل أيضاً: هل الجهة التي ستتعامل مع التاريخ تعتمد أم القرى، إعلاناً محلياً للهلال، أم تاريخاً ميلادياً في أنظمتها؟ هذه النقطة الصغيرة هي السبب الأكثر شيوعاً لاختلاف يوم واحد بين نتيجة حسابية وموعد رسمي.
              </p>
              <p className="date-editorial-copy">
                عند الأرشفة أو كتابة موعد طويل الأجل، احتفظ بالتاريخين معاً: {hijriLabel} و{gregorianLabel}م. وجود الصيغتين يجعل القراءة أوضح لمن يفتح السجل لاحقاً، ويمنحك مساراً سريعاً للعودة إلى صفحة التحويل إذا احتجت مراجعة تاريخ قريب.
              </p>
              <p className="date-editorial-copy">
                عند مشاركة تاريخ هجري فقط، قد يُقرأ وفق تقويم البلد الذي يستلمه لا وفق الطريقة التي استخدمتها أنت. لذلك أضف المقابل الميلادي أو رابط هذه الصفحة في الرسائل المهمة، خصوصاً عندما يكون التاريخ قريباً من أول الشهر أو آخره. هذا لا يطيل الرسالة كثيراً، لكنه يمنع سوء فهم قد يغيّر الموعد يوماً كاملاً.
              </p>
            </div>
          </section>

          <section className="related-links mb-8" dir="rtl" aria-labelledby="hijri-date-sources-heading">
            <p id="hijri-date-sources-heading" className="related-links__heading">
              مصادر تساعدك على فهم التحويل الهجري
            </p>
            <div className="related-links__grid">
              {HIJRI_DATE_SOURCE_LINKS.map((source) => (
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

          {/* LINKS */}
          <nav aria-label="مسارات مراجعة التاريخ الهجري المحدد" className="related-links mt-4" dir="rtl">
            <p className="related-links__heading">إذا أردت تحويل التاريخ أو فتح الصفحة الميلادية</p>
            <div className="related-links__grid">

              <Link href="/date" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الرئيسية</span>
                  <span className="related-link-card__desc">عرض التاريخ الهجري والميلادي</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تحويل تاريخ آخر</span>
                  <span className="related-link-card__desc">أداة تحويل التواريخ الهجرية والميلادية</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link
                href={gregorianPageUrl}
                className="related-link-card"
              >
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة {gregorian.formatted.ar}م</span>
                  <span className="related-link-card__desc">تفاصيل هذا اليوم بالتقويمين</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href={hijriCalendarUrl} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تقويم {hY} الهجري</span>
                  <span className="related-link-card__desc">راجع السنة الهجرية كاملة وموقع هذا اليوم داخلها</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href={gregorianCalendarUrl} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تقويم {gregorian.year} الميلادي</span>
                  <span className="related-link-card__desc">افتح السنة الميلادية التي يقع فيها هذا التاريخ</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

            </div>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
