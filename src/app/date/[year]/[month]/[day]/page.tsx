// src/app/date/[year]/[month]/[day]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX:
//   OLD: generateStaticParams built ±5 years = 3,650 pages at deploy time
//        → huge build cost, large bundle
//   NEW: generateStaticParams builds only ±90 days = 181 pages (faster deploys)
//        + unlisted dates render on demand by default
//        + cache behavior is handled by Cache Components rather than route-level revalidate
//
// DESIGN IMPROVEMENTS:
//   • .card CSS class for sections
//   • .btn .btn-primary for CTA (hover works)
//   • Fact cards use .card pattern
//   • Method comparison uses new MethodComparisonTable
//   • Navigation uses DateNavigation
//   • Share uses DateShareActions
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { convertDate } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate, generateUniqueContext, getGregorianMonthNameAr } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateNavigation } from '@/components/date/DateNavigation';
import { DateShareActions } from '@/components/date/DateShareActions';
import {
  DateEditorialSections,
  buildDateFaqJsonLd,
  type DateFaqItem,
  type DateInsightItem,
} from '@/components/date/DateEditorialSections';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { CalendarDays, ArrowLeftRight, Moon } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import {
  validateGregorianDateRouteSegments,
} from '@/lib/route-param-validation';

const BASE_URL = getSiteUrl();

// ── ISR: 24h cache managed via cacheComponents ──────────────────────────────

export async function generateStaticParams() {
  const now = new Date();

  return [{
    year: String(now.getUTCFullYear()),
    month: String(now.getUTCMonth() + 1).padStart(2, '0'),
    day: String(now.getUTCDate()).padStart(2, '0'),
  }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}): Promise<Metadata> {
  const { year, month, day } = await params;
  const routeDate = validateGregorianDateRouteSegments({ year, month, day });
  if (!routeDate.valid) {
    notFound();
  }
  if (routeDate.year < 1924 || routeDate.year > 2077) {
    notFound();
  }

  let hijri;
  try {
    hijri = convertDate({ date: routeDate.isoDate, toCalendar: 'hijri', method: 'umalqura' });
  } catch {
    notFound();
  }
  const monthAr = getGregorianMonthNameAr(routeDate.month);
  const gregorianLabel = `${routeDate.day} ${monthAr} ${routeDate.year}`;
  return {
    title: `${gregorianLabel} كم هجري؟ | ${hijri.formatted.ar}`,
    description: `${gregorianLabel} يوافق ${hijri.formatted.ar} حسب أم القرى. راجع اليوم، رقم السنة، الطرق الثلاث، واليوم السابق والتالي قبل اعتماد التاريخ.`,
    keywords: [
      ...buildDateKeywords({ gregorianYear: routeDate.year, hijriYear: hijri.year }),
      `${gregorianLabel} كم هجري`,
      `${gregorianLabel} بالهجري`,
      `${gregorianLabel} يوافق هجري`,
      `${day}/${month}/${year} هجري`,
      `تحويل ${gregorianLabel} إلى هجري`,
      `ماذا يوافق ${gregorianLabel} هجري`,
    ],
    alternates: { canonical: `${BASE_URL}/date/${year}/${month}/${day}` },
    openGraph: {
      title: `${gregorianLabel} يوافق ${hijri.formatted.ar}`,
      description: `صفحة عربية لمعرفة المقابل الهجري لتاريخ ${gregorianLabel} مع مقارنة طرق الحساب وروابط المراجعة.`,
      url: `${BASE_URL}/date/${year}/${month}/${day}`,
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${gregorianLabel} كم هجري؟`,
      description: `${gregorianLabel} يوافق ${hijri.formatted.ar} مع تفاصيل تساعدك على استخدام التاريخ بدون خلط.`,
    },
  };
}

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

interface DateDecisionRow {
  label: string;
  value: string;
}

interface DateSourceLink {
  href: string;
  label: string;
  description: string;
}

const DATE_SOURCE_LINKS: readonly DateSourceLink[] = [
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
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي الشمسي المستخدم في أغلب المعاملات المدنية.',
  },
  {
    href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    label: 'ISO 8601',
    description: 'مرجع صيغة التاريخ الرقمية مثل YYYY-MM-DD، وهي الصيغة الأنسب للأرشفة والأنظمة.',
  },
];

function buildDecisionRows(
  gregorianLabel: string,
  hijriLabel: string,
  dayOfYear: number,
  daysLeft: number,
): DateDecisionRow[] {
  return [
    {
      label: 'تريد إجابة سريعة',
      value: `${gregorianLabel} يوافق ${hijriLabel}. انسخ الصيغتين معاً حتى لا يختلط الميلادي بالهجري عند المشاركة.`,
    },
    {
      label: 'تستخدم التاريخ في وثيقة',
      value: 'اكتب اسم الشهر بالحروف، والصيغة الرقمية، وطريقة الحساب إذا كان الطرف الآخر يراجع التاريخ الهجري بدقة.',
    },
    {
      label: 'اليوم قريب من بداية شهر هجري',
      value: 'راجع جدول الطرق الثلاث، لأن بداية الشهر قد تختلف يوماً واحداً بين أم القرى والحساب المدني أو الإعلان المحلي.',
    },
    {
      label: 'تخطط داخل السنة',
      value: `هذا اليوم رقم ${dayOfYear} من السنة، وبعده ${daysLeft} يوم حتى نهاية السنة؛ افتح التقويم السنوي إذا أردت رؤية الأسابيع والشهور المحيطة.`,
    },
  ];
}

export default async function ProgrammaticDatePage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;

  // Zero-padding redirect
  if (month.length < 2 || day.length < 2) {
    redirect(`/date/${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`);
  }

  const routeDate = validateGregorianDateRouteSegments({ year, month, day });
  if (!routeDate.valid) notFound();

  const y = routeDate.year;
  const m = routeDate.month;
  const d = routeDate.day;
  if (y < 1924 || y > 2077) notFound();

  const isoDate = routeDate.isoDate;
  let umalqura, astronomical, civil;
  try {
    umalqura = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
    astronomical = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'astronomical' });
    civil = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'civil' });
  } catch { notFound(); }
  if (!umalqura) notFound();

  const hijri = umalqura;
  const islamicEvents = getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day);
  const prevDate = new Date(Date.UTC(y, m - 1, d - 1));
  const nextDate = new Date(Date.UTC(y, m - 1, d + 1));
  const fmtNav = (dt: Date) => `/date/${dt.getUTCFullYear()}/${String(dt.getUTCMonth() + 1).padStart(2, '0')}/${String(dt.getUTCDate()).padStart(2, '0')}`;
  const fmtLabel = (dt: Date) => `${dt.getUTCDate()} ${MONTHS_AR[dt.getUTCMonth()]}`;
  const daysInYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  const currentDate = new Date(Date.UTC(y, m - 1, d));
  const dayOfYear = Math.floor((currentDate.getTime() - new Date(Date.UTC(y, 0, 0)).getTime()) / 86400000);
  const daysLeft = daysInYear - dayOfYear;
  const quarter = Math.ceil(m / 3);
  const quarterName = ['الأول', 'الثاني', 'الثالث', 'الرابع'][quarter - 1] ?? 'الأول';
  const isLeap = daysInYear === 366;
  const gregorianLabel = `${d} ${MONTHS_AR[m - 1]} ${y}`;
  const hijriLabel = hijri.formatted.ar;
  const hijriPageUrl = `/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}`;
  const currentCalendarUrl = `/date/calendar/${y}`;
  const hijriCalendarUrl = `/date/calendar/hijri/${hijri.year}`;
  const decisionRows = buildDecisionRows(gregorianLabel, hijriLabel, dayOfYear, daysLeft);

  const uniqueContext = generateUniqueContext(y, m, d, hijri.year, hijri.month, hijri.day, hijri.monthNameAr, dayOfYear, daysInYear);

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: year, href: undefined },
    { label: `${d} ${MONTHS_AR[m - 1]}` },
  ];

  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${gregorianLabel} | ${hijriLabel}`,
    description: `تاريخ ${gregorianLabel} يوافق ${hijriLabel} هجري، مع مقارنة طرق الحساب وقواعد الاعتماد.`,
    url: `${BASE_URL}/date/${year}/${month}/${day}`,
    inLanguage: 'ar',
    about: ['تحويل ميلادي إلى هجري', 'تاريخ محدد', 'تقويم أم القرى', 'التقويم الميلادي', 'التقويم الهجري'],
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `كيفية قراءة ${gregorianLabel} بالهجري`,
    step: [
      { '@type': 'HowToStep', text: `ابدأ من التاريخ الميلادي الكامل: ${gregorianLabel}.` },
      { '@type': 'HowToStep', text: `اقرأ المقابل الهجري الأساسي: ${hijriLabel}.` },
      { '@type': 'HowToStep', text: 'راجع جدول أم القرى والفلكي والمدني إذا كان التاريخ حساساً أو قريباً من بداية شهر هجري.' },
      { '@type': 'HowToStep', text: 'انسخ الصيغتين معاً أو افتح اليوم السابق والتالي للتحقق من السياق.' },
    ],
  };
  const faqItems: DateFaqItem[] = [
    {
      question: `كم يوافق ${gregorianLabel} بالهجري؟`,
      answer: `${gregorianLabel} يوافق ${hijriLabel} وفق حساب أم القرى. إذا كان الاستخدام رسمياً أو دينياً حساساً، راجع طريقة الحساب أو إعلان بلدك.`,
    },
    {
      question: `ما هو اليوم الموافق ${hijri.day} ${hijri.monthNameAr} ${hijri.year}؟`,
      answer: `${hijri.day} ${hijri.monthNameAr} ${hijri.year} هجري يوافق ${gregorianLabel} ميلادي حسب النتيجة الأساسية في هذه الصفحة.`,
    },
    {
      question: 'لماذا تعرض الصفحة ثلاث طرق حساب للتاريخ الهجري؟',
      answer: 'تختلف طريقة تحديد بداية الشهر الهجري بين الجهات والدول. عرض أم القرى والفلكي والمدني يساعدك على معرفة إن كان التاريخ ثابتاً أم قد يتغير يوماً واحداً في سياقك المحلي.',
    },
    {
      question: 'هل يمكن استخدام هذه الصفحة لتوثيق موعد قديم أو مستقبلي؟',
      answer: 'نعم، الصفحة مناسبة لمراجعة تاريخ محدد ضمن النطاق المدعوم من 1924 إلى 2077، مع مسارات اليوم السابق والتالي ومحوّل التاريخ. للاستخدام القانوني أو الديني الرسمي راجع الجهة المعتمدة في بلدك.',
    },
    {
      question: 'ماذا أفعل إذا اختلفت النتيجة يوماً واحداً في مصدر آخر؟',
      answer: 'قارن طريقة الحساب أولاً. إذا كان المصدر يعتمد رؤية هلال محلية أو تقويماً رسمياً مختلفاً، فقد يظهر فرق يوم واحد. عندها اختر المرجع الذي تطلبه الجهة أو البلد الذي ستستخدم التاريخ لديه.',
    },
  ];

  const insights: DateInsightItem[] = [
    {
      badge: 'الجواب الأساسي',
      title: `${gregorianLabel} بالهجري`,
      body: `المقابل الهجري لهذا التاريخ هو ${hijriLabel}. تظهر النتيجة في أعلى الصفحة حتى ترى الإجابة قبل قراءة التفاصيل.`,
      tone: 'accent',
    },
    {
      badge: 'تفاصيل مفيدة',
      title: 'موقع اليوم داخل السنة',
      body: `هذا اليوم رقم ${dayOfYear} من ${daysInYear} يوماً، ويتبقى بعده ${daysLeft} يوم حتى نهاية السنة الميلادية. هذه التفاصيل تفيد في التخطيط والعد التنازلي.`,
      tone: 'success',
    },
    {
      badge: 'تحقق قبل الاعتماد',
      title: 'الهجري قد يختلف محلياً',
      body: 'إذا كان التاريخ متعلقاً برمضان أو الحج أو عيد رسمي، فطابق النتيجة مع إعلان بلدك لأن بعض الدول تعتمد رؤية الهلال أو جهة تقويم مختلفة.',
      tone: 'warning',
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd
        data={buildDateFaqJsonLd({
          pageName: `أسئلة ${gregorianLabel}`,
          items: faqItems,
        })}
      />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-6">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                {hijri.dayNameAr}، {d} {MONTHS_AR[m - 1]} {y}م
              </p>
              <h1 className="date-hero-title tabular-nums">
                {gregorianLabel} يوافق {hijriLabel}
              </h1>
              <p className="date-hero-copy">
                {gregorianLabel} يوافق {hijriLabel} حسب أم القرى. اقرأ النتيجة، ثم راجع الطرق الأخرى واليوم السابق
                والتالي إذا كان التاريخ مرتبطاً بوثيقة أو مناسبة دينية أو موعد بين بلدين.
              </p>
              {islamicEvents.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-success">
                    {islamicEvents.map(e => e.nameAr).join(' • ')}
                  </span>
                </div>
              )}
            </div>
            <aside className="date-hero-rail" aria-label="ملخص التاريخ الميلادي والهجري">
              <p className="date-hero-answer">{hijri.formatted.ar}</p>
              <p className="date-hero-note">
                اليوم رقم {dayOfYear} من سنة {y}، ويتبقى {daysLeft} يوم حتى نهاية السنة.
              </p>
              <div className="date-hero-actions">
                <Link href="/date/converter" className="date-hero-link date-hero-link--primary">
                  تحويل تاريخ آخر
                </Link>
                <Link
                  href={hijriPageUrl}
                  className="date-hero-link"
                >
                  فتح الصفحة الهجرية
                </Link>
              </div>
            </aside>
          </section>

          <section className="date-stat-grid mb-8">
            {[
              { label: 'اليوم من السنة', value: `${dayOfYear} / ${daysInYear}` },
              { label: 'ربع السنة', value: quarterName },
              { label: 'تبقى للسنة', value: `${daysLeft} يوم` },
              { label: 'ISO 8601', value: isoDate },
              { label: 'Julian Day', value: Math.floor(hijri.julianDay).toLocaleString('en') },
              { label: 'نوع السنة', value: isLeap ? '366 يوم' : '365 يوم' },
            ].map((f, i) => (
              <div key={i} className="date-stat-item">
                <div className="date-stat-value tabular-nums">{f.value}</div>
                <div className="date-stat-label">{f.label}</div>
              </div>
            ))}
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="gregorian-date-decision-heading">
            <h2 id="gregorian-date-decision-heading" className="date-section-title">
              قبل أن تعتمد نتيجة {gregorianLabel}
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

          {/* ── METHOD COMPARISON ────────────────────────────────────── */}
          {umalqura && astronomical && civil && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-primary mb-3">التاريخ الهجري بثلاث طرق حساب</h2>
              <MethodComparisonTable
                gregorianDate={isoDate}
                umalqura={umalqura}
                astronomical={astronomical}
                civil={civil}
              />
            </section>
          )}

          {/* ── UNIQUE CONTEXT (SEO) ──────────────────────────────────── */}
          <section className="date-detail-panel mb-8">
            <p className="date-editorial-copy m-0">{uniqueContext}</p>
          </section>

          <section className="date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">متى تكفي نتيجة هذا التاريخ ومتى تحتاج مراجعة إضافية؟</h2>
              <p className="date-editorial-copy">
                النتيجة في أعلى الصفحة مناسبة لمعظم الاستخدامات اليومية: معرفة المقابل الهجري، مشاركة موعد، أو مطابقة تاريخ مكتوب في رسالة أو جدول. لكنها لا تغني عن المرجع الرسمي إذا كان التاريخ مرتبطاً بإجراء قانوني أو موعد ديني معلن محلياً، لأن بعض الدول تعتمد رؤية الهلال أو تقويماً حكومياً محدداً.
              </p>
              <p className="date-editorial-copy">
                أفضل طريقة لتجنب الخطأ هي قراءة التاريخين معاً: اكتب {gregorianLabel}م بجانب {hijriLabel}، ثم راجع جدول الطرق الثلاث أسفل النتيجة. إذا كانت الطرق متقاربة فالتحويل غالباً مستقر، وإذا ظهر فرق يوم واحد فاختر الطريقة التي تعتمدها الجهة التي ستستخدم التاريخ لديها.
              </p>
              <p className="date-editorial-copy">
                مراجعة اليوم السابق والتالي مهمة أكثر مما تبدو، خصوصاً عند بداية الشهر الهجري أو نهايته. الانتقال يوماً واحداً للأمام أو للخلف يساعدك على فهم هل الموعد يقع داخل حدّ حساس قد يتغير محلياً، بدلاً من الاعتماد على رقم منفرد دون سياق.
              </p>
              <p className="date-editorial-copy">
                إذا كنت تبني جدولاً أو أرشيفاً، فاحفظ الصيغة الكاملة لا اليوم والشهر فقط. اكتب السنة الميلادية والسنة الهجرية، واذكر طريقة الحساب عند الحاجة، لأن التاريخ نفسه قد يُقرأ بطريقة مختلفة بعد سنوات إذا نُزع من سياقه أو أُرسل دون التقويم المقابل.
              </p>
            </div>
          </section>

          {/* ── SHARE ────────────────────────────────────────────────── */}
          <section className="mb-8">
            <DateShareActions
              hijriFormatted={hijriLabel}
              gregorianFormatted={gregorianLabel}
              hijriIso={hijri.formatted.iso}
              gregorianIso={isoDate}
              pageUrl={`${BASE_URL}/date/${year}/${month}/${day}`}
            />
          </section>

          {/* ── NAVIGATION ───────────────────────────────────────────── */}
          <section className="mb-8">
            <DateNavigation
              prevUrl={fmtNav(prevDate)} prevLabel={fmtLabel(prevDate)}
              nextUrl={fmtNav(nextDate)} nextLabel={fmtLabel(nextDate)}
              hubLabel="التقويم"
              hubHref="/date/calendar"
            />
          </section>

          <DateEditorialSections
            badge="تفسير التاريخ"
            title={`قراءة ${gregorianLabel} بين الميلادي والهجري`}
            intro="الصفحة مخصصة لمن يريد معرفة المقابل الهجري لتاريخ ميلادي محدد، مع تفاصيل تساعد على استخدام التاريخ في التخطيط والمشاركة والتحقق من الاختلافات المحلية."
            insights={insights}
            faqTitle="أسئلة قبل استخدام هذا التاريخ أو مشاركته"
            faqItems={faqItems}
          />

          <section className="related-links mb-8" dir="rtl" aria-labelledby="gregorian-date-sources-heading">
            <p id="gregorian-date-sources-heading" className="related-links__heading">
              مصادر تساعدك على فهم التحويل
            </p>
            <div className="related-links__grid">
              {DATE_SOURCE_LINKS.map((source) => (
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

          {/* ── QUICK LINKS ──────────────────────────────────────────── */}
          <nav aria-label="مسارات مراجعة التاريخ الميلادي المحدد" className="related-links" dir="rtl">
            <p className="related-links__heading">إذا أردت تحويل تاريخ آخر أو مراجعة الصفحة الهجرية</p>
            <div className="related-links__grid">

              <Link href="/date" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة التاريخ الرئيسية</span>
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

              {hijri && (
                <Link
                  href={hijriPageUrl}
                  className="related-link-card"
                >
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Moon size={16} strokeWidth={1.75} />
                  </span>
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">صفحة {hijri.formatted.ar} هجري</span>
                    <span className="related-link-card__desc">عرض هذا اليوم بالتقويم الهجري</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              )}

              <Link href={currentCalendarUrl} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تقويم {y} الميلادي</span>
                  <span className="related-link-card__desc">افتح السنة كاملة لترى موقع هذا اليوم داخل الشهر والأسبوع</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href={hijriCalendarUrl} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تقويم {hijri.year} الهجري</span>
                  <span className="related-link-card__desc">راجع السنة الهجرية التي يقع فيها هذا التاريخ</span>
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
