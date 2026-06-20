// src/app/date/calendar/[year]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { YearlyCalendar } from '@/components/date/YearlyCalendar';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Calendar, ArrowLeftRight, CalendarDays } from 'lucide-react';
import { convertDate, ISLAMIC_MONTH_NAMES_AR } from '@/lib/date-adapter';
import { DAY_NAMES_AR, GREGORIAN_MONTHS_AR } from '@/lib/constants';
import { BASE_ISLAMIC_EVENTS } from '@/lib/islamic-holidays';
import { getCachedNowIso } from '@/lib/date-utils';
import { isSeoIndexableGregorianCalendarYear } from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();
const PAGE_KEYWORDS = [
  'تقويم ميلادي',
  'تقويم هجري ميلادي',
  'تقويم السنة',
  'تقويم أم القرى',
  'تحويل التاريخ',
  'رزنامة السنة',
  'التقويم السنوي',
  'التاريخ الهجري والميلادي',
] as const;

type DecisionRow = {
  label: string;
  value: string;
};

type SourceLink = {
  label: string;
  description: string;
  href: string;
};

type YearEvent = {
  label: string;
  hijriDate: string;
  gregorianDate: string;
  href: string;
  note: string;
};

const YEAR_EVENT_DEFINITIONS = [
  { label: 'بداية رمضان', hijriMonth: 9, hijriDay: 1, note: 'راجعها مبكراً إذا كنت تخطط للصيام أو الدوام أو السفر.' },
  { label: 'ليلة القدر', hijriMonth: 9, hijriDay: 27, note: 'تظهر كتاريخ تقريبي لأن الليالي الدينية قد تعتمد الإعلان المحلي.' },
  { label: 'عيد الفطر', hijriMonth: 10, hijriDay: 1, note: 'استخدمها للتخطيط الأولي، ثم راجع الجهة الرسمية عند الاقتراب.' },
  { label: 'يوم عرفة', hijriMonth: 12, hijriDay: 9, note: 'مهم للحج والصيام والمواعيد العائلية المرتبطة بذو الحجة.' },
  { label: 'عيد الأضحى', hijriMonth: 12, hijriDay: 10, note: 'يفيدك لمعرفة موضع العيد داخل السنة الميلادية.' },
  { label: 'رأس السنة الهجرية', hijriMonth: 1, hijriDay: 1, note: 'قد يقع داخل منتصف السنة الميلادية لأن العام الهجري أقصر.' },
] as const;

const CALENDAR_YEAR_SOURCE_LINKS: SourceLink[] = [
  {
    label: 'تقويم أم القرى',
    description: 'مرجع شائع للتواريخ الهجرية المدنية في السعودية وعدد من الخدمات العربية.',
    href: 'https://www.ummulqura.org.sa/Index.aspx',
  },
  {
    label: 'Unicode CLDR',
    description: 'يوضح اختلاف أنواع التقويم الإسلامي في الأنظمة الرقمية والبرمجيات.',
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
  },
  {
    label: 'Britannica - Gregorian calendar',
    description: 'خلفية موثوقة عن التقويم الميلادي والسنة الكبيسة وتنظيم الشهور.',
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
  },
  {
    label: 'ISO 8601',
    description: 'مرجع تنسيق التاريخ الرقمي الذي يسهل مشاركة الروابط والأيام بدقة.',
    href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
  },
];

async function getCurrentGregorianYear(): Promise<number> {
  return new Date(await getCachedNowIso()).getUTCFullYear();
}

function buildGregorianYearKeywords(year: string): string[] {
  return [
    `تقويم ${year}`,
    `تقويم ${year} ميلادي`,
    `تقويم ${year} هجري ميلادي`,
    `رزنامة ${year}`,
    `أشهر سنة ${year}`,
    `سنة ${year} كم يوم`,
    ...PAGE_KEYWORDS,
  ];
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function buildDecisionRows(
  year: number,
  totalDays: number,
  isLeapYear: boolean,
  firstHijriLabel: string,
  lastHijriLabel: string
): DecisionRow[] {
  return [
    {
      label: 'إذا كنت تريد اختيار موعد داخل السنة',
      value: `ابدأ من تقويم ${year} الكامل، راقب اليوم في الأسبوع، ثم افتح صفحة اليوم قبل إرسال الموعد.`,
    },
    {
      label: 'إذا كنت تبحث عن المقابل الهجري',
      value: `استخدم الرقم الصغير داخل كل يوم كدليل سريع، ثم افتح اليوم للتفاصيل لأن سنة ${year} تمتد هجرياً من ${firstHijriLabel} إلى ${lastHijriLabel}.`,
    },
    {
      label: 'إذا كان الموعد دينياً أو عطلة رسمية',
      value: 'اعتبر التاريخ هنا مرجعاً عملياً للتخطيط، ثم راجع إعلان الجهة الرسمية لأن بداية الشهر الهجري قد تختلف محلياً.',
    },
    {
      label: 'إذا كنت تتأكد من السنة الكبيسة',
      value: isLeapYear
        ? `سنة ${year} كبيسة وفيها ${totalDays} يوماً، لذلك يحتوي فبراير على 29 يوماً.`
        : `سنة ${year} عادية وفيها ${totalDays} يوماً، لذلك يحتوي فبراير على 28 يوماً.`,
    },
  ];
}

function buildKeyHijriEventsForGregorianYear(gregorianYear: number, hijriYears: number[]): YearEvent[] {
  const eventsByHref = new Map<string, YearEvent>();

  for (const hijriYear of hijriYears) {
    for (const eventDefinition of YEAR_EVENT_DEFINITIONS) {
      try {
        const gregorian = convertDate({
          date: `${hijriYear}-${padDatePart(eventDefinition.hijriMonth)}-${padDatePart(eventDefinition.hijriDay)}`,
          toCalendar: 'gregorian',
          method: 'umalqura',
        });

        if (gregorian.year !== gregorianYear) {
          continue;
        }

        const baseEvent = BASE_ISLAMIC_EVENTS.find(
          (event) => event.hijriMonth === eventDefinition.hijriMonth
            && event.hijriDay === eventDefinition.hijriDay
        );
        const label = baseEvent?.nameAr ?? eventDefinition.label;
        const href = `/date/${gregorian.year}/${padDatePart(gregorian.month)}/${padDatePart(gregorian.day)}`;

        eventsByHref.set(href, {
          label,
          hijriDate: `${eventDefinition.hijriDay} ${ISLAMIC_MONTH_NAMES_AR[eventDefinition.hijriMonth - 1]} ${hijriYear} هـ`,
          gregorianDate: `${gregorian.dayNameAr} ${gregorian.day} ${gregorian.monthNameAr} ${gregorian.year}`,
          href,
          note: eventDefinition.note,
        });
      } catch {
        // Unsupported conversion ranges should not blank the yearly calendar page.
      }
    }
  }

  return Array.from(eventsByHref.values());
}

export async function generateStaticParams() {
  const currentYear = await getCurrentGregorianYear();
  const params = [];
  // Cover ±10 years so historically-indexed pages are pre-built at deploy time.
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    if (y < 1924 || y > 2077) continue;
    params.push({ year: String(y) });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) {
    notFound();
  }

  const numericYear = parseInt(year, 10);
  if (numericYear < 1924 || numericYear > 2077) {
    notFound();
  }

  const currentYear = await getCurrentGregorianYear();
  const isIndexableYear = isSeoIndexableGregorianCalendarYear(numericYear, currentYear);

  return {
    title: `تقويم ${year} ميلادي كامل بالهجري | أشهر وأيام السنة`,
    description: `تقويم ${year} ميلادي كامل بالعربية مع كل الشهور والأيام والمقابل الهجري وفق أم القرى، وروابط مباشرة لكل يوم ومصادر تساعدك على التخطيط بثقة.`,
    keywords: buildGregorianYearKeywords(year),
    alternates: { canonical: `${BASE_URL}/date/calendar/${year}` },
    robots: {
      index: isIndexableYear,
      follow: true,
      googleBot: {
        index: isIndexableYear,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title: `تقويم ${year} ميلادي كامل بالهجري | ميقاتنا`,
      description: `شاهد سنة ${year} كاملة: الشهور، الأيام، المقابل الهجري، وروابط كل يوم للتخطيط والتحويل.`,
      url: `${BASE_URL}/date/calendar/${year}`,
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `تقويم ${year} ميلادي كامل`,
      description: `تقويم عربي لسنة ${year} مع المقابل الهجري وروابط مباشرة لكل يوم.`,
    },
  };
}

export default async function GregorianCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) notFound();
  const y = parseInt(year, 10);

  if (y < 1924 || y > 2077) notFound();

  const now = new Date(await getCachedNowIso());
  const currentYear = now.getUTCFullYear();
  const serverTodayIso = y === currentYear ? now.toISOString().slice(0, 10) : undefined;
  const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const totalDays = isLeapYear ? 366 : 365;
  const yearStart = new Date(Date.UTC(y, 0, 1));
  const yearEnd = new Date(Date.UTC(y, 11, 31));
  const firstDayName = DAY_NAMES_AR[yearStart.getUTCDay()];
  const lastDayName = DAY_NAMES_AR[yearEnd.getUTCDay()];

  let firstHijriLabel = 'غير متاح';
  let lastHijriLabel = 'غير متاح';
  let firstHijriYear = 1447;
  let lastHijriYear = 1448;
  try {
    const firstHijri = convertDate({ date: `${y}-01-01`, toCalendar: 'hijri', method: 'umalqura' });
    const lastHijri = convertDate({ date: `${y}-12-31`, toCalendar: 'hijri', method: 'umalqura' });
    firstHijriLabel = `${firstHijri.day} ${firstHijri.monthNameAr} ${firstHijri.year} هـ`;
    lastHijriLabel = `${lastHijri.day} ${lastHijri.monthNameAr} ${lastHijri.year} هـ`;
    firstHijriYear = firstHijri.year;
    lastHijriYear = lastHijri.year;
  } catch {
    // Keep graceful fallbacks for unsupported dates.
  }

  const monthLinks: { label: string; href: string; description: string }[] = GREGORIAN_MONTHS_AR.map((monthName, index) => ({
    label: monthName,
    href: `/date/${y}/${padDatePart(index + 1)}/01`,
    description: `افتح أول يوم من ${monthName} ثم انتقل داخل الشهر`,
  }));
  const decisionRows = buildDecisionRows(y, totalDays, isLeapYear, firstHijriLabel, lastHijriLabel);
  const keyHijriEvents = buildKeyHijriEventsForGregorianYear(y, [firstHijriYear, lastHijriYear]);

  const faqItems = [
    {
      question: `ما هو تقويم ${y} الميلادي؟`,
      answer: `تقويم ${y} الميلادي هو عرض كامل لكل أيام السنة من يناير إلى ديسمبر، مع إظهار المقابل الهجري لكل يوم وفق أم القرى. يمكنك استخدامه لتحديد موعد، مراجعة شهر كامل، أو فتح صفحة يوم محدد لمعرفة تفاصيله وتحويله.`,
    },
    {
      question: `هل سنة ${y} كبيسة؟`,
      answer: isLeapYear
        ? `نعم، سنة ${y} كبيسة وتحتوي على 366 يوماً. يعني ذلك أن شهر فبراير فيها يأتي بـ29 يوماً بدل 28 يوماً.`
        : `لا، سنة ${y} ليست كبيسة وتحتوي على 365 يوماً. يبقى شهر فبراير فيها مكوّناً من 28 يوماً فقط.`,
    },
    {
      question: `ما التاريخ الهجري الذي يبدأ به عام ${y}؟`,
      answer: `بداية عام ${y} الميلادي توافق تقريباً ${firstHijriLabel}. قد ترى اختلافاً محدوداً بيوم واحد في بعض الجهات إذا اعتمدت طريقة حساب هجري مختلفة عن أم القرى.`,
    },
    {
      question: `هل أستطيع الاعتماد على تقويم ${y} للمناسبات الدينية؟`,
      answer: `يمكنك الاعتماد عليه للتخطيط المبدئي وفهم موضع رمضان أو العيد داخل السنة، لكن الإعلان الرسمي في بلدك يبقى المرجع النهائي للمناسبات التي ترتبط برؤية الهلال أو قرارات الجهات المختصة.`,
    },
    {
      question: `كيف أستخدم تقويم ${y} للتحويل بين الميلادي والهجري؟`,
      answer: `اضغط على اليوم المطلوب داخل الشبكة. صفحة اليوم تعرض التاريخ الميلادي، المقابل الهجري، اليوم السابق والتالي، ومسارات التحويل. وإذا كنت تعرف التاريخ الهجري أصلاً فابدأ من محول التاريخ أو التقويم الهجري الموافق.`,
    },
    {
      question: `لماذا لا يكفي جدول سنة ${y} وحده؟`,
      answer: `الجدول يعطيك نظرة سريعة، لكن صفحة اليوم تضيف التفاصيل التي تحتاجها عند المشاركة أو الاعتماد: صيغة التاريخ، اليوم في الأسبوع، التحويلات، والتنبيه إلى احتمال اختلاف الحساب الهجري بيوم واحد في بعض الدول.`,
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الميلادي', href: '/date/calendar' },
    { label: `عام ${year}` },
  ];

  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التقويم الميلادي لعام ${year}`,
    description: `تقويم عام ${year} ميلادي كامل مع تحويل هجري يومي ومسار مباشر لكل يوم من السنة.`,
    url: `${BASE_URL}/date/calendar/${year}`,
    inLanguage: 'ar',
    about: [
      'التقويم الميلادي',
      'التقويم الهجري',
      'تحويل التاريخ',
      `تقويم ${year}`,
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `شهور تقويم ${year} الميلادي`,
    itemListElement: monthLinks.map((month, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${month.label} ${year}`,
      url: `${BASE_URL}${month.href}`,
    })),
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
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `طريقة استخدام تقويم ${year} الميلادي`,
    description: `خطوات عملية لاستخدام تقويم ${year} في اختيار يوم ومعرفة مقابله الهجري.`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'ابدأ من السنة الكاملة',
        text: `راجع تقويم ${year} كاملاً لتعرف توزيع الشهور وبدايات الأسابيع ونهاياتها.`,
      },
      {
        '@type': 'HowToStep',
        name: 'اختر الشهر واليوم',
        text: 'اضغط على اليوم المناسب داخل الشبكة أو افتح بداية الشهر من روابط الشهور.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع المقابل الهجري',
        text: 'اقرأ المقابل الهجري في صفحة اليوم، ثم راجع الإعلان الرسمي إذا كان الموعد دينياً أو حكومياً.',
      },
    ],
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, webPageSchema, itemListSchema, faqSchema, howToSchema]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-8">
            <div className="date-hero-main">
              <p className="date-kicker m-0">التقويم الميلادي السنوي</p>
              <h1 className="date-hero-title text-accent-alt">
                تقويم عام {year} ميلادي
              </h1>
              <p className="date-hero-copy">
                تقويم {year} الميلادي يعرض لك السنة كاملة من يناير إلى ديسمبر، مع المقابل الهجري لكل يوم وفق أم القرى. إذا كنت تريد معرفة أيام سنة {year}، هل هي كبيسة، أين يقع رمضان أو العيد، أو تريد فتح يوم محدد للتحويل، فابدأ من هذه الصفحة ثم انتقل إلى اليوم الذي تحتاجه.
              </p>
            </div>
            <aside className="date-hero-rail" aria-label="التنقل بين السنوات الميلادية">
              <p className="date-hero-answer">
                {totalDays} يوماً
              </p>
              <p className="date-hero-note">
                تبدأ السنة يوم {firstDayName} وتنتهي يوم {lastDayName}. النطاق الهجري: {firstHijriLabel} إلى {lastHijriLabel}.
              </p>
              <div className="date-hero-actions">
                <Link href={`/date/calendar/${y - 1}`} className="date-hero-link">
                  → عام {y - 1}
                </Link>
                <Link href={`/date/calendar/${y + 1}`} className="date-hero-link date-hero-link--primary">
                  عام {y + 1} ←
                </Link>
              </div>
            </aside>
          </section>

          <AdTopBanner slotId={`top-date-calendar-${year}`} slotKey="topDateBanner" />

        <section className="date-stat-grid mb-8">
          {[
            { label: 'عدد الأيام', value: `${totalDays} يوماً` },
            { label: 'بداية السنة', value: `1 يناير · ${firstDayName}` },
            { label: 'نهاية السنة', value: `31 ديسمبر · ${lastDayName}` },
            { label: 'النطاق الهجري', value: `${firstHijriLabel} إلى ${lastHijriLabel}` },
          ].map((fact) => (
            <div key={fact.label} className="date-stat-item">
              <div className="date-stat-value">{fact.value}</div>
              <div className="date-stat-label">{fact.label}</div>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <YearlyCalendar year={y} serverTodayIso={serverTodayIso} />
        </section>

        <section className="date-editorial-grid date-section">
          <article className="date-editorial-block">
            <h2 className="date-editorial-title">كيف يفيدك تقويم {year}؟</h2>
            <p className="date-editorial-copy m-0">
              يفيدك تقويم {year} في متابعة السنة كاملة من شاشة واحدة، ومعرفة توافق التاريخ الميلادي مع الهجري دون الحاجة إلى إدخال يوم بيوم. هذا مفيد للتخطيط الدراسي، والمواعيد الرسمية، والإجازات، وربط المناسبات الهجرية بالتقويم الميلادي.
            </p>
          </article>

          <article className="date-editorial-block">
            <h2 className="date-editorial-title">هل يتغيّر مقابل التاريخ الهجري؟</h2>
            <p className="date-editorial-copy m-0">
              المقابل الهجري في هذه الصفحة مبني على تقويم أم القرى، وهو مرجع رسمي واسع الاستخدام في السعودية ودول الخليج. قد يظهر اختلاف طفيف بيوم واحد في بعض الدول أو الجهات التي تعتمد الحساب الفلكي أو الإعلان المحلي لبداية الشهر.
            </p>
          </article>
        </section>

        <section className="date-detail-panel mb-8">
          <h2 className="date-section-title">شهور عام {year} الميلادي</h2>
          <p className="date-editorial-copy mb-4">
            افتح بداية كل شهر من شهور سنة {year} للوصول إلى اليوم المطلوب بسرعة. هذه الروابط مفيدة عندما تعرف الشهر ولا تريد التمرير داخل السنة كاملة.
          </p>
          <p className="date-editorial-copy mb-4">
            إذا كنت تخطط لموعد طويل المدى، فراجع الشهر كاملاً بدلاً من يوم واحد فقط. هذا يساعدك على ملاحظة نهايات الأسبوع، بدايات الشهور، والفترات التي قد تتقاطع مع مناسبات هجرية أو إجازات موسمية.
          </p>
          <div className="flex flex-wrap gap-2">
            {monthLinks.map((month) => (
              <Link key={month.href} href={month.href} className="chip">
                {month.label}
              </Link>
            ))}
          </div>
        </section>

        {keyHijriEvents.length > 0 && (
          <section className="date-detail-panel mb-8" aria-labelledby="gregorian-calendar-events-heading">
            <h2 id="gregorian-calendar-events-heading" className="date-section-title">
              مواعيد هجرية بارزة داخل سنة {year}
            </h2>
            <p className="date-editorial-copy mb-4">
              هذه المواعيد محسوبة وفق أم القرى وتساعدك على فهم موضع المناسبات داخل السنة الميلادية. استخدمها للتخطيط المبكر، ثم راجع إعلان بلدك عند اعتماد إجازة أو مناسبة رسمية.
            </p>
            <div className="date-detail-list">
              {keyHijriEvents.map((event) => (
                <Link key={event.href} href={event.href} className="date-detail-row">
                  <span className="date-detail-label">{event.label}</span>
                  <span className="date-detail-value">
                    {event.gregorianDate} · {event.hijriDate} · {event.note}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="date-detail-panel mb-8" aria-labelledby="gregorian-calendar-decision-heading">
          <h2 id="gregorian-calendar-decision-heading" className="date-section-title">
            قاعدة القرار قبل الاعتماد على تقويم {year}
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

        <section className="date-section">
          <div className="max-w-3xl space-y-4">
            <h2 className="date-editorial-title">كيف تقرأ تقويم {year} دون أن تضيع بين الشهور؟</h2>
            <p className="date-editorial-copy">
              ابدأ من الهدف لا من شكل التقويم. إذا كنت تبحث عن موعد واحد، افتح اليوم مباشرة من الشبكة. وإذا كنت تخطط لشهر كامل، فراجع بدايات الأسابيع ونهاياتها قبل اختيار التاريخ، لأن اليوم المناسب على الورق قد يكون قريباً من عطلة أو مناسبة هجرية أو نهاية شهر.
            </p>
            <p className="date-editorial-copy">
              وجود المقابل الهجري داخل التقويم يساعدك على رؤية السنة كمسارين لا كقائمتين منفصلتين. هذا مهم في الدول العربية لأن الدراسة والعمل والحياة العائلية قد تستخدم الميلادي يومياً، بينما تبقى المناسبات الدينية والاجتماعية مرتبطة بالشهور الهجرية.
            </p>
            <p className="date-editorial-copy">
              عند مشاركة تاريخ من تقويم {year}، افتح صفحة اليوم نفسه بدلاً من إرسال اسم الشهر فقط. صفحة اليوم تعرض التحويل بثلاث طرق واليوم السابق والتالي، وهذا يعطي المستلم سياقاً أوضح إذا كان يعيش في بلد يعتمد بداية شهر هجري مختلفة.
            </p>
            <p className="date-editorial-copy">
              ومن الأفضل أن تحفظ رابط السنة أو الشهر عندما تعمل على خطة تمتد لعدة أسابيع، لأن الرجوع إلى نفس التقويم يمنع تكرار البحث ويجعل مراجعة التغييرات أسهل. بهذه الطريقة تتحول الصفحة من جدول ثابت إلى مرجع تخطيط تستخدمه أكثر من مرة خلال السنة.
            </p>
            <p className="date-editorial-copy">
              هذا مهم خصوصاً عند تنسيق مواعيد بين العمل والعائلة، لأن التقويم الكامل يكشف لك ما لا يظهر في صفحة يوم واحد.
            </p>
          </div>
        </section>

        <section className="related-links mb-8" dir="rtl" aria-labelledby="gregorian-calendar-sources-heading">
          <p id="gregorian-calendar-sources-heading" className="related-links__heading">
            مصادر ومنهج قراءة تقويم {year}
          </p>
          <div className="related-links__grid">
            {CALENDAR_YEAR_SOURCE_LINKS.map((source) => (
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

        <section className="date-section">
          <div className="date-section-head">
            <h2 className="date-section-title">أسئلة قبل استخدام تقويم {year} في التخطيط</h2>
            <p className="date-section-copy">
              هذه الإجابات تختصر أكثر الالتباسات شيوعاً: السنة الكبيسة، بداية السنة الهجرية، وحدود الاعتماد الرسمي.
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

        {/* NAVIGATION */}
        <nav aria-label="مسارات متابعة تقويم السنة الميلادية" className="related-links" dir="rtl">
          <p className="related-links__heading">إذا أردت تحويل يوم أو فتح التقويم الهجري الموافق</p>
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
                <span className="related-link-card__label">محول التاريخ</span>
                <span className="related-link-card__desc">تحويل بين الهجري والميلادي</span>
              </span>
              <span className="related-link-card__arrow" aria-hidden="true">←</span>
            </Link>

            <Link href="/date/hijri-to-gregorian" className="related-link-card">
              <span className="related-link-card__icon" aria-hidden="true">
                <Calendar size={16} strokeWidth={1.75} />
              </span>
              <span className="related-link-card__body">
                <span className="related-link-card__label">تحويل هجري إلى ميلادي</span>
                <span className="related-link-card__desc">تحويل مباشر من التقويم الهجري</span>
              </span>
              <span className="related-link-card__arrow" aria-hidden="true">←</span>
            </Link>

            <Link href={`/date/calendar/hijri/${firstHijriYear}`} className="related-link-card">
              <span className="related-link-card__icon" aria-hidden="true">
                <Calendar size={16} strokeWidth={1.75} />
              </span>
              <span className="related-link-card__body">
                <span className="related-link-card__label">التقويم الهجري الموافق</span>
                <span className="related-link-card__desc">ابدأ من عام {firstHijriYear} هـ الموافق لبداية السنة</span>
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
