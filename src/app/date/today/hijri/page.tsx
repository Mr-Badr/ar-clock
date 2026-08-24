import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import type { ConvertDateResult } from '@/lib/date-adapter';
import { DAY_NAMES_AR, GREGORIAN_MONTHS_AR, HIJRI_MONTHS_AR } from '@/lib/constants';
import {
  buildHijriYearCalendar,
  type HijriCalendarDay,
} from '@/lib/date-calendar';
import { isSacredMonth, isRamadan as checkRamadan, getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateShareActions } from '@/components/date/DateShareActions';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';
import { SiteRelatedCardGrid } from '@/components/shared/SiteRelatedCardGrid';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { Moon, CalendarDays, ArrowLeftRight, Calendar, Star } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'التاريخ الهجري اليوم | أم القرى ومقارنة طرق الحساب',
  description:
    'اعرف التاريخ الهجري اليوم وفق أم القرى مع المقابل الميلادي، مقارنة الحساب الفلكي والمدني، وشرح متى تراجع إعلان بلدك عند بداية الشهر.',
  keywords: [
    ...buildDateKeywords(),
    'طرق حساب التاريخ الهجري',
    'الفرق بين ام القرى والحساب الفلكي',
    'تقويم مدني وجدولي',
    'لماذا يختلف التاريخ الهجري بين المواقع',
    'مقارنة طرق حساب الهجري',
  ],
  alternates: { canonical: `${BASE_URL}/date/today/hijri` },
  openGraph: {
    title: 'التاريخ الهجري اليوم',
    description: 'التاريخ الهجري اليوم مع المقابل الميلادي ومقارنة أم القرى والحساب الفلكي والمدني.',
    url: `${BASE_URL}/date/today/hijri`,
    locale: 'ar_SA',
  },
};

const MONTH_ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];

type HijriMonthTableRow = {
  dayName: string;
  hijriDateLabel: string;
  gregorianDateLabel: string;
  href: string;
  eventName: string | null;
  isToday: boolean;
};

const MONTH_SIGNIFICANCE: Record<number, string> = {
  1: 'محرم من الأشهر الحرم، وفيه يوم عاشوراء في اليوم العاشر.',
  2: 'شهر صفر، لا حرمة خاصة له، وما يُشاع عنه من التشاؤم مردود في الإسلام.',
  3: 'ربيع الأول، ويرتبط في الذاكرة الإسلامية بسيرة النبي محمد ﷺ، وتختلف عادات الناس حول المولد بحسب البلد والمذهب.',
  4: 'ربيع الثاني، يعقب ربيع الأول ويُكمل فصل الربيع الهجري.',
  5: 'جمادى الأولى، سُمّي بهذا الاسم لتزامن بداية العرب تسمية الأشهر مع تجمّد الماء شتاءً.',
  6: 'جمادى الثانية، يعقب جمادى الأولى ويكمل الفصل الخامس والسادس.',
  7: 'رجب من الأشهر الحرم الأربعة، وتنتشر فيه تواريخ شعبية مرتبطة بذكرى الإسراء والمعراج.',
  8: 'شعبان يأتي قبل رمضان مباشرة، لذلك يستخدمه كثيرون للاستعداد للصيام وتنظيم المواعيد.',
  9: 'رمضان المبارك، شهر الصيام والقرآن وليلة القدر خير من ألف شهر.',
  10: 'شوال يبدأ بعيد الفطر، ويرتبط عند كثير من المسلمين بصيام ستة أيام بعد رمضان.',
  11: 'ذو القعدة من الأشهر الحرم. يبدأ فيه موسم الحج وتحرم فيه المقاتلة.',
  12: 'ذو الحجة، شهر الحج ويوم عرفة (9) وعيد الأضحى (10). العشر الأوائل منه من أفضل الأيام.',
};

const HIJRI_SOURCE_LINKS = [
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'يوضح تعدد أنواع التقويم الإسلامي، مثل أم القرى والمدني والجدولي، وسبب اختلاف النتائج بين الطرق.',
  },
  {
    href: 'https://hijridate.readthedocs.io/en/stable/background.html',
    label: 'خلفية تقويم أم القرى',
    description: 'شرح تاريخي مختصر لاستخدام تقويم أم القرى في السعودية للأغراض الإدارية.',
  },
  {
    href: 'https://www.al-habib.info/islamic-calendar/',
    label: 'Alhabib Islamic Calendar',
    description: 'مرجع مقارنة يعرض فكرة التقويم المحلي ورؤية الهلال وأم القرى والتقويمات الفلكية.',
  },
];

async function getTodayHijriNow(): Promise<Date> {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return now;
  } catch (error) {
    logger.warn('date-today-hijri-current-date-fallback-used', {
      routePath: '/date/today/hijri',
      error: serializeError(error),
    });
    return new Date();
  }
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function buildHijriDayHref(year: number, month: number, day: number): string {
  return `/date/hijri/${year}/${padDatePart(month)}/${padDatePart(day)}`;
}

function getHijriMonthHref(year: number, month: number): string {
  return buildHijriDayHref(year, month, 1);
}

function getPreviousHijriMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }

  return { year, month: month - 1 };
}

function getNextHijriMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }

  return { year, month: month + 1 };
}

function formatGregorianDateLabel(day: HijriCalendarDay): string {
  const monthName = GREGORIAN_MONTHS_AR[day.gregorianMonth - 1] ?? String(day.gregorianMonth);
  return `${day.gregorianDay} ${monthName} ${day.gregorianYear}`;
}

function getGregorianDayName(day: HijriCalendarDay): string {
  const weekday = new Date(Date.UTC(day.gregorianYear, day.gregorianMonth - 1, day.gregorianDay)).getUTCDay();
  return DAY_NAMES_AR[weekday] ?? 'اليوم';
}

function buildCurrentHijriMonthRows(hijri: ConvertDateResult): HijriMonthTableRow[] {
  const yearCalendar = buildHijriYearCalendar(hijri.year);
  const monthData = yearCalendar.months.find((month) => month.month === hijri.month);

  if (!monthData) {
    throw new RangeError(`Hijri month ${hijri.month} was not found in year ${hijri.year}.`);
  }

  return monthData.days.map((day): HijriMonthTableRow => ({
    dayName: getGregorianDayName(day),
    hijriDateLabel: `${day.day} ${hijri.monthNameAr} ${hijri.year} هـ`,
    gregorianDateLabel: formatGregorianDateLabel(day),
    href: buildHijriDayHref(hijri.year, hijri.month, day.day),
    eventName: day.eventName ?? null,
    isToday: day.day === hijri.day,
  }));
}

export default function TodayHijriPage() {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          title="جاري تجهيز التاريخ الهجري اليوم"
          description="نجهز تاريخ اليوم الهجري، المقابل الميلادي، ومقارنة طرق الحساب."
        />
      )}
    >
      <TodayHijriDynamicContent />
    </Suspense>
  );
}

async function TodayHijriDynamicContent() {
  const now = await getTodayHijriNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES_AR[now.getUTCDay()];

  let umalqura, astronomical, civil;
  try {
    umalqura = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' });
    astronomical = convertDate({ date: iso, toCalendar: 'hijri', method: 'astronomical' });
    civil = convertDate({ date: iso, toCalendar: 'hijri', method: 'civil' });
  } catch (error) {
    logger.warn('date-today-hijri-conversion-failed', {
      date: iso,
      methods: ['umalqura', 'astronomical', 'civil'],
      error: serializeError(error),
    });
  }

  const hijri = umalqura;
  const isRam = hijri ? checkRamadan(hijri.month) : false;
  const isSacred = hijri ? isSacredMonth(hijri.month) : false;
  const events = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];
  let currentMonthRows: HijriMonthTableRow[] = [];
  if (hijri) {
    try {
      currentMonthRows = buildCurrentHijriMonthRows(hijri);
    } catch (error) {
      logger.warn('date-today-hijri-month-table-failed', {
        routePath: '/date/today/hijri',
        hijriYear: hijri.year,
        hijriMonth: hijri.month,
        error: serializeError(error),
      });
    }
  }
  // Real day count from the actual Hijri calendar table — NOT a fixed odd-month=30/
  // even-month=29 guess. That guess is wrong often enough in practice (umalqura months don't
  // strictly alternate) that it could show something like "day 30 of 29", a self-contradicting
  // number found and fixed 2026-08-13 while making this section's copy clearer. Falls back to
  // the guess only if the real calendar lookup itself failed.
  const daysInMonth = hijri
    ? (currentMonthRows.length || (hijri.month % 2 !== 0 ? 30 : 29))
    : 30;
  const progress = hijri ? Math.round((hijri.day / daysInMonth) * 100) : 0;
  const daysLeft = hijri ? daysInMonth - hijri.day : 0;
  const significance = hijri ? MONTH_SIGNIFICANCE[hijri.month] : '';
  const previousMonth = hijri ? getPreviousHijriMonth(hijri.year, hijri.month) : null;
  const nextMonth = hijri ? getNextHijriMonth(hijri.year, hijri.month) : null;

  const faqItems = [
    {
      question: 'كم التاريخ الهجري اليوم؟',
      answer: hijri
        ? `التاريخ الهجري اليوم هو ${hijri.formatted.ar} وفق تقويم أم القرى، ويوافق ${d} ${GREGORIAN_MONTHS_AR[m - 1]} ${y} ميلادي.`
        : 'تعرض هذه الصفحة التاريخ الهجري اليوم عندما تكون نتيجة التحويل ضمن النطاق المدعوم.',
    },
    {
      question: 'لماذا قد يختلف التاريخ الهجري بين بلد وآخر؟',
      answer: 'لأن بعض البلدان تعتمد إعلاناً محلياً أو رؤية الهلال، بينما تعتمد جهات أخرى تقويماً حسابياً مثل أم القرى أو التقويم المدني. لذلك قد يظهر فرق يوم واحد عند بداية الشهر أو نهايته.',
    },
    {
      question: 'هل تقويم أم القرى هو المرجع النهائي لكل الدول؟',
      answer: 'لا. أم القرى مرجع إداري مهم في السعودية، لكنه ليس بديلاً عن إعلان بلدك في القرارات الدينية أو الرسمية مثل رمضان والعيدين.',
    },
    {
      question: 'متى أستخدم محول هجري إلى ميلادي؟',
      answer: 'استخدم المحول عندما يكون لديك يوم هجري محدد سابق أو قادم، مثل تاريخ ميلاد هجري أو مناسبة أو موعد رسمي، وتحتاج المقابل الميلادي.',
    },
    {
      question: 'هل يبدأ اليوم الهجري عند الغروب أم منتصف الليل؟',
      answer: 'في الاستخدام الشرعي يرتبط دخول اليوم القمري بالغروب ورؤية الهلال، أما الصفحات الرقمية اليومية فتعرض التاريخ حسب تقويم وطريقة حساب محددة في اليوم المدني المعروض.',
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'اليوم', href: '/date/today' },
    { label: 'هجري' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: hijri ? `التاريخ الهجري اليوم: ${hijri.formatted.ar}` : 'التاريخ الهجري اليوم',
    description: hijri ? `التاريخ الهجري اليوم هو ${hijri.formatted.ar} الموافق ${d}/${m}/${y} ميلادي، مع مقارنة طرق الحساب والتنبيه إلى اختلاف الرؤية المحلية.` : 'التاريخ الهجري اليوم',
    url: `${BASE_URL}/date/today/hijri`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  };
  const monthItemListJsonLd = hijri && currentMonthRows.length > 0
    ? {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `أيام شهر ${hijri.monthNameAr} ${hijri.year} هـ`,
      itemListElement: currentMonthRows.map((row, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${row.hijriDateLabel} يوافق ${row.gregorianDateLabel}`,
        url: `${BASE_URL}${row.href}`,
      })),
    }
    : null;
  const structuredData: object[] = monthItemListJsonLd ? [jsonLd, monthItemListJsonLd] : [jsonLd];

  return (
    <>
      <JsonLd data={structuredData} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-date-today-hijri" slotKey="topDateBanner" />

          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel date-hero-panel--single mb-12">
            {hijri ? (
              <div className="date-hero-main">
                <p className="date-kicker m-0">{dayOfWeek}</p>
                <h1 className="date-hero-title text-accent-alt">
                  {hijri.day} {hijri.monthNameAr} {hijri.year} هجري
                </h1>
                <p className="date-hero-gregorian">
                  يوافق{' '}
                  <strong>
                    {String(d).padStart(2, '0')}/{String(m).padStart(2, '0')}/{y}
                  </strong>{' '}
                  ميلادي
                </p>
                <p className="date-hero-copy">
                  هذا هو التاريخ الهجري اليوم وفق تقويم أم القرى. إذا كان الموعد دينياً أو رسمياً، قارنه أيضاً مع إعلان بلدك لأن رؤية الهلال قد تغيّر بداية الشهر بيوم.
                </p>
                {(isRam || events.length > 0 || isSacred) && (
                  <div className="flex flex-wrap gap-2">
                    {isRam && (
                      <span className="badge badge-warning">
                        رمضان المبارك، اليوم {hijri.day} من {daysInMonth}
                      </span>
                    )}
                    {events.length > 0 && (
                      <span className="badge badge-success">
                        {events.map(e => e.nameAr).join(' • ')}
                      </span>
                    )}
                    {isSacred && !isRam && (
                      <span className="badge badge-accent">من الأشهر الحرم</span>
                    )}
                  </div>
                )}
                <div className="date-hero-quick-actions">
                  <Link href="/date/today/gregorian" className="date-quick-action">
                    <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />
                    التاريخ الميلادي اليوم
                  </Link>
                  <Link href="/date/hijri-to-gregorian" className="date-quick-action">
                    <ArrowLeftRight size={16} strokeWidth={1.75} aria-hidden="true" />
                    تحويل هجري إلى ميلادي
                  </Link>
                </div>
              </div>
            ) : (
              <div className="date-hero-main">
                <p className="date-kicker m-0">{dayOfWeek}</p>
                <h1 className="date-hero-title">التاريخ الهجري اليوم</h1>
                <p className="date-hero-copy">
                  تعذر تحميل التاريخ الهجري الآن. يمكنك استخدام محول التاريخ لإدخال تاريخ محدد ومقارنة طرق الحساب.
                </p>
                <Link href="/date/converter" className="date-hero-link date-hero-link--primary">
                  فتح محول التاريخ
                </Link>
              </div>
            )}
          </section>

          {hijri && (
            <section className="date-progress-panel mb-10" aria-label="موقع اليوم من الشهر الهجري">
              <div className="date-progress-head">
                <span className="date-progress-title">تقدم شهر {hijri.monthNameAr}</span>
                <span className="date-progress-value">يوم {hijri.day} من {daysInMonth}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: isRam ? 'var(--warning)' : 'var(--blue)',
                    transition: 'width 0.7s ease-out',
                  }}
                />
              </div>
              <p className="date-progress-context">
                {daysLeft === 0
                  ? `ينتهي شهر ${hijri.monthNameAr} اليوم وفق الحساب الحالي.`
                  : `تبقى ${daysLeft} يوم على نهاية شهر ${hijri.monthNameAr}.`}
                {significance ? ` ${significance}` : ''}
              </p>
            </section>
          )}

          {/* Real stat cards, not deleted — just clearer labels than a bare "59 / 355"
              fraction (owner, 2026-08-13: "after the progress bar we want cards but more
              clear, not delete them... visual components and different colors to give the
              page a life"). Each value is a single readable number with its own explained
              unit; the icon-chip color rotates per DESIGN.md's anti-AI-template pattern. */}
          {hijri && (
            <section className="date-stat-grid mb-16">
              {[
                { value: hijri.day, unit: `من ${daysInMonth} يوماً في الشهر`, Icon: CalendarDays },
                { value: hijri.dayOfYear, unit: `من ${hijri.daysInYear} يوماً في السنة`, Icon: Calendar },
                { value: MONTH_ORDINALS[(hijri.month ?? 1) - 1], unit: 'ترتيب الشهر في السنة', Icon: Moon },
                { value: hijri.daysInYear - hijri.dayOfYear, unit: 'يوماً متبقياً على نهاية السنة', Icon: Star },
              ].map((s, i) => (
                <div key={i} className="date-stat-item">
                  <span className="date-stat-icon" aria-hidden="true">
                    <s.Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div className="date-stat-value">{s.value}</div>
                  <div className="date-stat-label">{s.unit}</div>
                </div>
              ))}
            </section>
          )}

          {hijri && currentMonthRows.length > 0 && (
            <section className="date-section" aria-labelledby="hijri-month-table-heading">
              {/* Title + description sit as plain text, not inside a bordered card — a
                  heading and a sentence don't earn a surface (owner, 2026-08-13: "why the
                  section has border and different bg we do not know, just bad looking"). */}
              <div className="date-section-head">
                <h2 id="hijri-month-table-heading" className="date-section-title">
                  جدول شهر {hijri.monthNameAr} {hijri.year} هـ بالميلادي
                </h2>
                <p className="date-section-copy">
                  اختر أي يوم من الشهر الحالي لترى صفحته التفصيلية. الجدول يعرض اليوم، التاريخ الهجري،
                  والمقابل الميلادي في ثلاثة أعمدة واضحة، مع تمييز تاريخ اليوم حتى لا تضطر للبحث داخل الشهر.
                </p>
              </div>

              {/* prev / full-calendar / next — one line, compact widths, never full-width
                  stretched buttons (owner: "they should be same line, one left one right
                  and calendar center"). Labels drop the year to stay compact. */}
              <div className="date-month-nav">
                {previousMonth && (
                  <Link href={getHijriMonthHref(previousMonth.year, previousMonth.month)} className="date-hero-link">
                    → {HIJRI_MONTHS_AR[previousMonth.month - 1]}
                  </Link>
                )}
                <Link
                  href={`/date/calendar/hijri/${hijri.year}`}
                  className="date-hero-link date-hero-link--primary"
                >
                  تقويم {hijri.year} هـ كاملاً
                </Link>
                {nextMonth && (
                  <Link href={getHijriMonthHref(nextMonth.year, nextMonth.month)} className="date-hero-link">
                    {HIJRI_MONTHS_AR[nextMonth.month - 1]} ←
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-5" aria-label={`اختيار شهر هجري من عام ${hijri.year}`}>
                {HIJRI_MONTHS_AR.map((monthName, index) => {
                  const monthNumber = index + 1;
                  const isCurrentMonth = monthNumber === hijri.month;

                  return (
                    <Link
                      key={monthName}
                      href={getHijriMonthHref(hijri.year, monthNumber)}
                      className={isCurrentMonth ? 'chip chip--active' : 'chip'}
                      aria-current={isCurrentMonth ? 'date' : undefined}
                    >
                      {monthName}
                    </Link>
                  );
                })}
              </div>

              {/* Only the table itself is a real surface — .table-wrapper is already a
                  complete bordered/rounded surface with its own horizontal-scroll handling
                  on mobile, so it does NOT get a second .date-detail-panel around it
                  (DESIGN.md: "No nested cards"). */}
              <div className="table-wrapper" dir="rtl">
                <table className="table table--compact">
                  <caption className="sr-only">
                    أيام شهر {hijri.monthNameAr} {hijri.year} هـ مع التاريخ الميلادي الموافق
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">اليوم</th>
                      <th scope="col">الهجري</th>
                      <th scope="col">الميلادي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMonthRows.map((row) => (
                      <tr key={row.href} aria-current={row.isToday ? 'date' : undefined}>
                        <td className={row.isToday ? 'td-accent' : undefined}>
                          <span className="flex flex-wrap items-center gap-2">
                            {row.isToday && <span className="badge badge-accent">اليوم</span>}
                            <span>{row.dayName}</span>
                            {row.eventName && <span className="badge badge-success">{row.eventName}</span>}
                          </span>
                        </td>
                        <td className={row.isToday ? 'td-accent' : undefined}>
                          <Link href={row.href} className="date-action">
                            {row.hijriDateLabel}
                          </Link>
                        </td>
                        <td className={row.isToday ? 'td-accent' : undefined}>
                          {row.gregorianDateLabel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {umalqura && astronomical && civil && (
            <section className="mb-16">
              <h2 className="text-lg font-bold text-primary mb-4">التاريخ الهجري حسب طريقة الحساب</h2>
              <MethodComparisonTable
                gregorianDate={iso}
                umalqura={umalqura}
                astronomical={astronomical}
                civil={civil}
              />
            </section>
          )}

          {/* Plain text — a heading and two short paragraphs don't earn a card
              (DESIGN.md Law 4). Condensed from the old 2-paragraph version (owner,
              2026-08-13: "no one want to read all of that"). */}
          <section className="date-section max-w-3xl">
            <h2 className="date-section-title">كيف يُحسب التاريخ الهجري؟</h2>
            <p className="date-editorial-copy m-0">
              التقويم الهجري تقويم قمري، فأشهره غالباً 29 أو 30 يوماً والسنة الهجرية أقصر من الميلادية بنحو 10-11 يوماً.{' '}
              <strong className="text-primary">أم القرى</strong> هو المرجع الإداري في السعودية، لكن الطرق الفلكية أو المدنية أو إعلان بلدك قد تعطي نتيجة مختلفة بيوم واحد عند بداية الشهر أو نهايته.
            </p>
            <div className="date-fact-row">
              <span className="date-fact-badge date-fact-badge--blue">
                <Moon size={14} strokeWidth={1.75} aria-hidden="true" /> 29-30 يوماً بالشهر القمري
              </span>
              <span className="date-fact-badge date-fact-badge--amber">
                <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" /> أم القرى: المرجع في السعودية
              </span>
            </div>
          </section>

          <section className="date-section max-w-3xl">
            <h2 className="date-section-title">كيف تستفيد من التاريخ الهجري اليوم؟</h2>
            <p className="date-editorial-copy">
              التاريخ الهجري يرتبط بالصيام والعبادات والمناسبات الإسلامية، لا برقم اليوم وحده. إذا كان موعدك دينياً أو رسمياً، قارن الطريقة المعروضة هنا مع إعلان بلدك — الرؤية المحلية قد تغيّر بداية الشهر بيوم.
            </p>
            <ul className="date-use-inline-list">
              <li>
                <span className="date-use-icon" aria-hidden="true"><Moon size={16} strokeWidth={1.75} /></span>
                <span><strong>للعبادات</strong> — تحقق من الشهر واليوم قبل الصيام أو الأيام الفاضلة.</span>
              </li>
              <li>
                <span className="date-use-icon" aria-hidden="true"><Calendar size={16} strokeWidth={1.75} /></span>
                <span><strong>للمناسبات</strong> — شارك التاريخين معاً حتى يفهمهما من يعتمد الهجري ومن يعتمد الميلادي.</span>
              </li>
              <li>
                <span className="date-use-icon" aria-hidden="true"><CalendarDays size={16} strokeWidth={1.75} /></span>
                <span><strong>للتخطيط</strong> — راقب الأيام المتبقية في الشهر عند ترتيب سفر أو إجازة.</span>
              </li>
            </ul>
          </section>

          {hijri && (
            <section className="mb-8">
              <h3 className="text-sm font-semibold text-muted mb-3">مشاركة التاريخ</h3>
              <DateShareActions
                hijriFormatted={hijri.formatted.ar}
                gregorianFormatted={`${d} ${GREGORIAN_MONTHS_AR[m - 1]} ${y}`}
                hijriIso={hijri.formatted.iso}
                gregorianIso={iso}
                pageUrl={`${BASE_URL}/date/today/hijri`}
              />
            </section>
          )}

          <AdInArticle slotId="mid-date-today-hijri" />

          {/* FAQ — the one pattern used everywhere (owner, 2026-08-13: "FAQ should always
              be like the FAQ in tools pages"), never a two-column layout next to it. The old
              "قاعدة عملية" side card becomes the closing line under the accordion instead of
              its own box. */}
          <section className="date-section max-w-3xl">
            <h2 className="date-editorial-title">أسئلة قبل اعتماد التاريخ الهجري اليوم</h2>
            <SiteFaqAccordion items={faqItems} />
            <p className="date-editorial-copy mt-4">
              <strong className="text-primary">قاعدة عملية:</strong> للاستخدام اليومي استخدم أم القرى، وللعبادات الرسمية راجع إعلان بلدك، وللمواعيد الدولية اكتب الهجري والميلادي معاً.
            </p>
          </section>

          {/* Related pages — small, clean, unique CARDS (owner, 2026-08-13), not a list.
              Title + icon only, no description text, so each card stays small. */}
          <section className="date-section max-w-3xl">
            <SiteRelatedCardGrid
              heading="إذا أردت مقارنة التاريخ أو تحويله"
              headingId="hijri-next-paths-heading"
              items={[
                { href: '/date/today/gregorian', label: 'التاريخ الميلادي اليوم', Icon: CalendarDays },
                { href: '/date/today', label: 'الهجري والميلادي معاً', Icon: Moon },
                { href: '/date/converter', label: 'محول التاريخ', Icon: ArrowLeftRight },
                { href: '/date/hijri-to-gregorian', label: 'هجري إلى ميلادي', Icon: Calendar },
                ...(hijri
                  ? [{
                    href: `/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}`,
                    label: `صفحة ${hijri.formatted.ar} هجري`,
                    Icon: Star,
                  }]
                  : []),
              ]}
            />
          </section>

          {/* Sources — last thing on the page (owner, 2026-08-13), plain small dot-list
              like /tools, since these are external citations, not next-path cards. */}
          <section className="date-section max-w-3xl">
            <SiteDotLinkList
              heading="مصادر ومنهج التاريخ الهجري"
              headingId="hijri-sources-heading"
              items={HIJRI_SOURCE_LINKS.map((source) => ({
                href: source.href,
                label: source.label,
                description: source.description,
                external: true,
              }))}
            />
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
