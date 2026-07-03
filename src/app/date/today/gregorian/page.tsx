// src/app/date/today/gregorian/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, DAY_NAMES_AR, HIJRI_MONTHS_AR } from '@/lib/constants';
import {
  buildGregorianYearCalendar,
  type GregorianCalendarDay,
} from '@/lib/date-calendar';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import {
  DateEditorialSections,
  buildDateFaqJsonLd,
  type DateFaqItem,
  type DateInsightItem,
} from '@/components/date/DateEditorialSections';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { Moon, ArrowLeftRight, CalendarDays } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'التاريخ الميلادي اليوم | رقم الأسبوع وصيغة ISO والتاريخ الهجري',
  description: 'اعرف التاريخ الميلادي اليوم، رقم الأسبوع، اليوم من السنة، صيغة ISO 8601، الربع السنوي، والتاريخ الهجري الموافق مع قاعدة كتابة التاريخ دون التباس.',
  keywords: buildDateKeywords(),
  alternates: { canonical: `${BASE_URL}/date/today/gregorian` },
  openGraph: {
    title: 'التاريخ الميلادي اليوم',
    description: 'التاريخ الميلادي اليوم مع رقم الأسبوع، اليوم من السنة، صيغة ISO، والتاريخ الهجري الموافق.',
    url: `${BASE_URL}/date/today/gregorian`,
    locale: 'ar_SA',
  },
};

const GREGORIAN_SOURCE_LINKS = [
  {
    href: 'https://www.iso8601.com/',
    label: 'ISO 8601',
    description: 'مرجع مبسط لصيغة السنة-الشهر-اليوم، وأرقام الأسابيع، والتواريخ الرقمية الأقل التباساً.',
  },
  {
    href: 'https://www.timeanddate.com/date/weeknumber.html',
    label: 'Timeanddate: رقم الأسبوع',
    description: 'شرح عملي لرقم الأسبوع وكيف تختلف قراءة الأسبوع بين الأنظمة.',
  },
  {
    href: 'https://www.britannica.com/science/calendar/The-Gregorian-calendar',
    label: 'Britannica: التقويم الغريغوري',
    description: 'خلفية عن التقويم الميلادي وقاعدة السنة الكبيسة في النظام الغريغوري.',
  },
];

type GregorianMonthTableRow = {
  dayName: string;
  gregorianDateLabel: string;
  hijriDateLabel: string;
  href: string;
  eventName: string | null;
  isToday: boolean;
};


function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function buildGregorianDayHref(year: number, month: number, day: number): string {
  return `/date/${year}/${padDatePart(month)}/${padDatePart(day)}`;
}

function getGregorianMonthHref(year: number, month: number): string {
  return buildGregorianDayHref(year, month, 1);
}

function getPreviousGregorianMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }

  return { year, month: month - 1 };
}

function getNextGregorianMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }

  return { year, month: month + 1 };
}

function formatHijriDateLabel(day: GregorianCalendarDay): string {
  const monthName = HIJRI_MONTHS_AR[day.hijriMonth - 1] ?? String(day.hijriMonth);
  return `${day.hijriDay} ${monthName} ${day.hijriYear} هـ`;
}

function getGregorianDayName(year: number, month: number, day: number): string {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return DAY_NAMES_AR[weekday] ?? 'اليوم';
}

function buildCurrentGregorianMonthRows(
  year: number,
  month: number,
  todayDay: number,
): GregorianMonthTableRow[] {
  const yearCalendar = buildGregorianYearCalendar(year);
  const monthData = yearCalendar.months.find((item) => item.month === month);

  if (!monthData) {
    throw new RangeError(`Gregorian month ${month} was not found in year ${year}.`);
  }

  return monthData.days.map((day): GregorianMonthTableRow => ({
    dayName: getGregorianDayName(year, month, day.day),
    gregorianDateLabel: `${day.day} ${GREGORIAN_MONTHS_AR[month - 1] ?? month} ${year}`,
    hijriDateLabel: formatHijriDateLabel(day),
    href: buildGregorianDayHref(year, month, day.day),
    eventName: day.eventName ?? null,
    isToday: day.day === todayDay,
  }));
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

function getJulianDay(year: number, month: number, day: number): number {
  const jsDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return Math.floor(jsDate.getTime() / 86400000) + 2440587.5;
}

async function getTodayGregorianNow(): Promise<Date> {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return now;
  } catch (error) {
    logger.warn('date-today-gregorian-current-date-fallback-used', {
      routePath: '/date/today/gregorian',
      error: serializeError(error),
    });
    return new Date();
  }
}

export default function TodayGregorianPage() {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          title="جاري تجهيز التاريخ الميلادي اليوم"
          description="نجهز التاريخ الميلادي، رقم الأسبوع، اليوم من السنة، والصيغة الرقمية."
        />
      )}
    >
      <TodayGregorianDynamicContent />
    </Suspense>
  );
}

async function TodayGregorianDynamicContent() {
  const now = await getTodayGregorianNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES_AR[now.getUTCDay()];
  const weekNum = getWeekNumber(now);
  const dayOfYear = getDayOfYear(now);
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;
  const daysLeft = daysInYear - dayOfYear;
  const quarter = Math.ceil(m / 3);
  const jd = getJulianDay(y, m, d);
  let currentMonthRows: GregorianMonthTableRow[] = [];
  try {
    currentMonthRows = buildCurrentGregorianMonthRows(y, m, d);
  } catch (error) {
    logger.warn('date-today-gregorian-month-table-failed', {
      routePath: '/date/today/gregorian',
      gregorianYear: y,
      gregorianMonth: m,
      error: serializeError(error),
    });
  }
  const previousMonth = getPreviousGregorianMonth(y, m);
  const nextMonth = getNextGregorianMonth(y, m);

  let hijri;
  try {
    hijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
  } catch (error) {
    logger.warn('date-today-gregorian-hijri-conversion-failed', {
      error: serializeError(error),
      date: isoDate,
      method: 'umalqura',
      toCalendar: 'hijri',
    });
  }

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'اليوم', href: '/date/today' },
    { label: 'ميلادي' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'التاريخ الميلادي اليوم',
    description: 'التاريخ الميلادي اليوم مع رقم الأسبوع واليوم من السنة وصيغة ISO 8601 والتاريخ الهجري الموافق.',
    url: `${BASE_URL}/date/today/gregorian`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };
  const monthItemListJsonLd = currentMonthRows.length > 0
    ? {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `أيام شهر ${GREGORIAN_MONTHS_AR[m - 1]} ${y}`,
      itemListElement: currentMonthRows.map((row, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${row.gregorianDateLabel} يوافق ${row.hijriDateLabel}`,
        url: `${BASE_URL}${row.href}`,
      })),
    }
    : null;

  const faqItems: DateFaqItem[] = [
    {
      question: 'كم التاريخ الميلادي اليوم؟',
      answer: `التاريخ الميلادي اليوم هو ${d} ${GREGORIAN_MONTHS_AR[m - 1]} ${y}، ويوافق يوم ${dayOfWeek}. تعرض الصفحة أيضاً رقم الأسبوع واليوم من السنة حتى لا تحتاج إلى أكثر من أداة.`,
    },
    {
      question: 'ما فائدة معرفة اليوم من السنة؟',
      answer: `اليوم هو رقم ${dayOfYear} من أصل ${daysInYear} يوماً في سنة ${isLeap ? 'كبيسة' : 'بسيطة'}. هذه المعلومة مفيدة في الجداول الدراسية، العقود، التخطيط السنوي، ومتابعة المدد الزمنية الطويلة.`,
    },
    {
      question: 'هل يعرض الموقع التاريخ الهجري الموافق؟',
      answer: hijri
        ? `نعم، التاريخ الهجري الموافق اليوم هو ${hijri.formatted.ar} وفق تقويم أم القرى، ويمكنك فتح صفحة التاريخ الهجري اليوم لمقارنة طرق الحساب.`
        : 'نعم، تعرض صفحات التاريخ الهجري التاريخ الموافق متى كان التحويل ضمن النطاق المدعوم.',
    },
    {
      question: 'لماذا تظهر صيغة ISO 8601 في الصفحة؟',
      answer: `صيغة ${isoDate} مفيدة عند إدخال التاريخ في الأنظمة التقنية والنماذج الرقمية لأنها تقلل الالتباس بين ترتيب اليوم والشهر، خصوصاً عند التعامل مع خدمات دولية.`,
    },
    {
      question: 'متى أستخدم صيغة عربية بدلاً من ISO؟',
      answer: 'استخدم الصيغة العربية عندما تراسل شخصاً أو تنشر موعداً للقراءة البشرية، مثل: اليوم والشهر بالحروف. استخدم ISO عندما تدخل التاريخ في نظام، جدول، ملف، أو خدمة دولية.',
    },
    {
      question: 'هل رقم الأسبوع هو نفسه في كل الدول؟',
      answer: 'ليس دائماً. هذه الصفحة تعرض رقم الأسبوع بطريقة ISO التي تبدأ الأسبوع يوم الاثنين، بينما قد تستخدم بعض الدول أو التطبيقات بداية أسبوع مختلفة. لذلك اذكر نظام الأسبوع عند التقارير الحساسة.',
    },
    {
      question: 'هل التاريخ الميلادي يتغير حسب المنطقة الزمنية؟',
      answer: 'نعم قرب منتصف الليل. قد يدخل يوم جديد في بلد قبل بلد آخر، لذلك استخدم التاريخ المحلي لجهازك أو صفحة الوقت الان إذا كان الموعد مرتبطاً بمكالمة أو سفر.',
    },
  ];

  const insights: DateInsightItem[] = [
    {
      badge: 'إجابة مباشرة',
      title: 'التاريخ الكامل يظهر في أول الشاشة',
      body: 'يعرض العنوان اليوم والشهر والسنة بوضوح، ثم يضيف اليوم من الأسبوع والتاريخ الهجري الموافق حتى تحصل على الجواب قبل أي تفاصيل إضافية.',
      tone: 'accent',
    },
    {
      badge: 'تخطيط سنوي',
      title: 'الأسبوع واليوم من السنة يختصران الحساب اليدوي',
      body: 'بدلاً من عد الأيام في التقويم، تظهر الصفحة رقم الأسبوع، الربع السنوي، اليوم من السنة، وعدد الأيام المتبقية حتى نهاية العام.',
      tone: 'success',
    },
    {
      badge: 'أقل التباساً',
      title: 'استخدم ISO عند النسخ إلى التطبيقات',
      body: 'صيغة السنة-الشهر-اليوم مناسبة للنماذج التقنية والجداول، بينما الصيغة العربية مناسبة للقراءة والمشاركة مع الأشخاص.',
      tone: 'info',
    },
    {
      badge: 'منطقة زمنية',
      title: 'قرب منتصف الليل راجع الوقت المحلي',
      body: 'إذا كنت تخطط لموعد دولي، فقد يكون اليوم الميلادي مختلفاً بين بلدين في اللحظة نفسها. اربط التاريخ بالوقت والمنطقة الزمنية عند السفر أو الاجتماعات.',
      tone: 'warning',
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          jsonLd,
          buildDateFaqJsonLd({
            pageName: 'أسئلة التاريخ الميلادي اليوم',
            items: faqItems,
          }),
          ...(monthItemListJsonLd ? [monthItemListJsonLd] : []),
        ]}
      />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-6">
            <div className="date-hero-main">
              <div className="date-kicker">{dayOfWeek}</div>
              <h1 className="date-hero-title text-accent-alt">
                {d} {GREGORIAN_MONTHS_AR[m - 1]} {y}
              </h1>
              {hijri && (
                <p className="date-hero-copy mb-0">
                  الموافق هجرياً: <strong className="text-primary">{hijri.formatted.ar}</strong>
                </p>
              )}
              <p className="date-hero-copy mb-0">
                ستجد أيضاً رقم الأسبوع، اليوم من السنة، الربع السنوي، وصيغة ISO حتى تختار
                الشكل المناسب للنماذج أو الرسائل أو التخطيط.
              </p>
            </div>
            <div className="date-hero-rail" aria-label="إجراءات تاريخ اليوم الميلادي">
              <div>
                <div className="date-hero-answer">{isoDate}</div>
                <p className="date-hero-note mb-0">
                  صيغة مناسبة للنماذج والأنظمة الرقمية.
                </p>
              </div>
              <div className="date-hero-actions">
                <Link href="/date/today/hijri" className="date-hero-link date-hero-link--primary">
                  اعرض التاريخ الهجري
                  <span aria-hidden="true">←</span>
                </Link>
                <Link href="/date/converter" className="date-hero-link">
                  حوّل تاريخاً آخر
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </div>
          </section>

          <AdTopBanner slotId="top-date-today-gregorian" slotKey="topDateBanner" />

          <section className="date-stat-grid mb-6">
            {[
              { label: 'اليوم من السنة', value: `${dayOfYear} / ${daysInYear}` },
              { label: 'أسبوع رقم', value: weekNum },
              { label: 'تبقى للسنة', value: `${daysLeft} يوم` },
              { label: 'الربع السنوي', value: `الربع ${quarter}` },
              { label: 'اليوم اليولياني', value: Math.floor(jd).toLocaleString('en') },
              { label: 'صيغة ISO 8601', value: isoDate },
            ].map((f, i) => (
              <div
                key={i}
                className="date-stat-item"
              >
                <div className="date-stat-value">
                  {f.value}
                </div>
                <div className="date-stat-label">
                  {f.label}
                </div>
              </div>
            ))}
          </section>

          <section className="date-detail-panel mb-8">
            <h2 className="date-section-title">
              معلومات الشهر والسنة
            </h2>
            <div className="date-detail-list">
              {[
                ['الشهر', GREGORIAN_MONTHS_AR[m - 1]],
                ['عدد أيام الشهر', new Date(y, m, 0).getDate()],
                ['نوع السنة', isLeap ? 'سنة كبيسة (366 يوم)' : 'سنة بسيطة (365 يوم)'],
                ['التاريخ الهجري الموافق', hijri ? hijri.formatted.ar : 'غير متاح'],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  className="date-detail-row"
                >
                  <span className="date-detail-label">{label}</span>
                  <span className="date-detail-value">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {currentMonthRows.length > 0 && (
            <section className="date-detail-panel mb-8" aria-labelledby="gregorian-month-table-heading">
              <div className="date-section-head">
                <h2 id="gregorian-month-table-heading" className="date-section-title">
                  جدول شهر {GREGORIAN_MONTHS_AR[m - 1]} {y} بالهجري
                </h2>
                <p className="date-section-copy">
                  اختر أي يوم من الشهر الميلادي الحالي لترى صفحته التفصيلية. الجدول يعرض اليوم،
                  التاريخ الميلادي، والتاريخ الهجري الموافق في ثلاثة أعمدة واضحة، مع تمييز تاريخ اليوم.
                </p>
              </div>

              <div className="date-hero-actions mb-4">
                <Link href={getGregorianMonthHref(previousMonth.year, previousMonth.month)} className="date-hero-link">
                  → شهر {GREGORIAN_MONTHS_AR[previousMonth.month - 1]} {previousMonth.year}
                </Link>
                <Link
                  href={`/date/calendar/${y}`}
                  className="date-hero-link date-hero-link--primary"
                >
                  تقويم {y} ميلادي كاملاً
                </Link>
                <Link href={getGregorianMonthHref(nextMonth.year, nextMonth.month)} className="date-hero-link">
                  شهر {GREGORIAN_MONTHS_AR[nextMonth.month - 1]} {nextMonth.year} ←
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mb-5" aria-label={`اختيار شهر ميلادي من عام ${y}`}>
                {GREGORIAN_MONTHS_AR.map((monthName, index) => {
                  const monthNumber = index + 1;
                  const isCurrentMonth = monthNumber === m;

                  return (
                    <Link
                      key={monthName}
                      href={getGregorianMonthHref(y, monthNumber)}
                      className={isCurrentMonth ? 'chip chip--active' : 'chip'}
                      aria-current={isCurrentMonth ? 'date' : undefined}
                    >
                      {monthName}
                    </Link>
                  );
                })}
              </div>

              <div className="table-wrapper" dir="rtl">
                <table className="table table--compact">
                  <caption className="sr-only">
                    أيام شهر {GREGORIAN_MONTHS_AR[m - 1]} {y} مع التاريخ الهجري الموافق
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">اليوم</th>
                      <th scope="col">الميلادي</th>
                      <th scope="col">الهجري</th>
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
                            {row.gregorianDateLabel}
                          </Link>
                        </td>
                        <td className={row.isToday ? 'td-accent' : undefined}>
                          {row.hijriDateLabel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <AdInArticle slotId="mid-date-today-gregorian" />

          <DateEditorialSections
            badge="شرح عملي"
            title="التاريخ الميلادي اليوم مع سياق يساعدك على استخدامه"
            intro="اعرف اليوم والشهر والسنة، ثم استخدم التفاصيل الإضافية للتخطيط، تعبئة النماذج، أو ربط التاريخ الميلادي بالتاريخ الهجري."
            insights={insights}
            faqTitle="أسئلة قبل نسخ تاريخ اليوم الميلادي أو إدخاله في نموذج"
            faqItems={faqItems}
          />

          <section className="date-editorial-grid date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">لماذا لا يكفي عرض التاريخ كرقم فقط؟</h2>
              <p className="date-editorial-copy">
                كثير من النماذج والرسائل تحتاج التاريخ بصيغة مختلفة: صيغة عربية للقراءة، وصيغة رقمية للأنظمة، ورقم أسبوع للتخطيط، وتاريخ هجري للمناسبات. لذلك تعرض الصفحة التاريخ الميلادي اليوم مع معلومات تساعدك على نسخه واستخدامه في العمل أو الدراسة أو المواعيد الرسمية دون الرجوع إلى تقويم آخر.
              </p>
              <p className="date-editorial-copy">
                عند إرسال التاريخ في رسالة أو نموذج، استخدم الصيغة العربية للقراءة والصيغة الرقمية عند التعامل مع نظام إلكتروني حتى لا يحدث لبس بين ترتيب اليوم والشهر.
              </p>
              <p className="date-editorial-copy">
                رقم الأسبوع والربع السنوي يفيدان في العمل والدراسة أكثر مما يبدو للوهلة الأولى. فرق المتابعة، الجداول الدراسية، خطط المحتوى، ومواعيد التسليم تعتمد أحياناً على الأسبوع لا على اسم اليوم فقط. لذلك تجمع الصفحة بين الصيغة البشرية والصيغة التنظيمية في مكان واحد.
              </p>
              <p className="date-editorial-copy">
                إذا كنت تنقل التاريخ إلى نظام أجنبي، فاستخدم صيغة ISO لأنها تبدأ بالسنة ثم الشهر ثم اليوم. أما في الرسائل العربية فاكتب اليوم والشهر بالحروف حتى لا يختلط ترتيب الأرقام، خصوصاً عندما يكون اليوم والشهر كلاهما أقل من 13.
              </p>
            </div>
            <div className="date-use-list">
              <article className="date-use-item">
                <h3 className="date-use-title">للنماذج</h3>
                <p className="date-use-copy">استخدم صيغة ISO عند تعبئة الأنظمة الرقمية لتقليل الخطأ في ترتيب الشهر واليوم.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">للتخطيط</h3>
                <p className="date-use-copy">راجع رقم الأسبوع واليوم من السنة عند متابعة خطط طويلة أو مواعيد مرتبطة بفترة زمنية.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">للمشاركة</h3>
                <p className="date-use-copy">اكتب اسم الشهر بالعربية عند إرسال التاريخ لشخص حتى تكون القراءة واضحة وسريعة.</p>
              </article>
            </div>
          </section>

          <section className="date-editorial-grid date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">قاعدة كتابة التاريخ الميلادي دون التباس</h2>
              <p className="date-editorial-copy">
                إذا كان التاريخ موجهاً لشخص، فاكتب الشهر بالحروف: {d} {GREGORIAN_MONTHS_AR[m - 1]} {y}.
                وإذا كان موجهاً لنظام أو جدول بيانات، فاستخدم صيغة {isoDate}. بهذه الطريقة تقلل احتمال
                الخلط بين اليوم والشهر، خصوصاً في التواريخ التي يكون فيها الرقمان أقل من 13.
              </p>
              <p className="date-editorial-copy">
                لا تعتمد على رقم الأسبوع وحده إلا إذا كان الطرف الآخر يستخدم نفس معيار الأسبوع. في أغلب
                السياقات الدولية يكون معيار ISO مناسباً، لكن بعض المؤسسات تبدأ الأسبوع من الأحد أو السبت.
              </p>
            </div>
            <div className="date-use-list">
              <article className="date-use-item">
                <h3 className="date-use-title">لرسالة عربية</h3>
                <p className="date-use-copy">اكتب: {dayOfWeek}، {d} {GREGORIAN_MONTHS_AR[m - 1]} {y}.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">لنظام إلكتروني</h3>
                <p className="date-use-copy">اكتب: {isoDate} حتى يكون الترتيب سنة، شهر، يوم.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">لتقرير أسبوعي</h3>
                <p className="date-use-copy">اكتب الأسبوع {weekNum} مع تاريخ بداية التقرير أو نهايته.</p>
              </article>
            </div>
          </section>

          <section className="related-links mt-8" dir="rtl" aria-labelledby="gregorian-sources-heading">
            <p id="gregorian-sources-heading" className="related-links__heading">
              مصادر ومنهج التاريخ الميلادي
            </p>
            <div className="related-links__grid">
              {GREGORIAN_SOURCE_LINKS.map((source) => (
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

          <nav aria-label="مسارات استخدام التاريخ الميلادي اليوم" className="related-links mt-8" dir="rtl">
            <p className="related-links__heading">إذا احتجت الصيغة الهجرية أو تاريخاً آخر</p>
            <div className="related-links__grid">

              <Link href="/date/today/hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الهجري اليوم</span>
                  <span className="related-link-card__desc">اعرف تاريخ اليوم بالتقويم الهجري</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">تحويل بين الهجري والميلادي بثلاث طرق</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link
                href={`/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`}
                className="related-link-card"
              >
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة تاريخ {d} {GREGORIAN_MONTHS_AR[m - 1]}</span>
                  <span className="related-link-card__desc">تفاصيل هذا اليوم بالتقويمين</span>
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
