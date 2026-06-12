import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { HijriYearlyCalendar } from '@/components/date/HijriYearlyCalendar';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Calendar } from 'lucide-react';
import { convertDate, getHijriMonthDays } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, HIJRI_MONTHS_AR } from '@/lib/constants';
import { BASE_ISLAMIC_EVENTS } from '@/lib/islamic-holidays';
import { getCachedNowIso } from '@/lib/date-utils';
import { isSeoIndexableHijriCalendarYear } from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();
const PAGE_KEYWORDS = [
  'تقويم هجري',
  'تقويم أم القرى',
  'تقويم هجري ميلادي',
  'السنة الهجرية',
  'رمضان والعيد',
  'تقويم ذي الحجة',
  'تحويل هجري إلى ميلادي',
  'أيام السنة الهجرية',
] as const;

type MonthLink = {
  label: string;
  href: string;
  days: number;
};

type DecisionRow = {
  label: string;
  value: string;
};

type SourceLink = {
  label: string;
  description: string;
  href: string;
};

type HijriYearEvent = {
  label: string;
  hijriDate: string;
  gregorianDate: string;
  href: string;
  note: string;
};

const HIJRI_YEAR_SOURCE_LINKS: SourceLink[] = [
  {
    label: 'تقويم أم القرى',
    description: 'مرجع شائع للتقويم الهجري المدني الذي تعتمد عليه هذه الصفحة في حساب الأيام.',
    href: 'https://www.ummulqura.org.sa/Index.aspx',
  },
  {
    label: 'Unicode CLDR',
    description: 'يوضح اختلاف أنواع التقويم الإسلامي في الأنظمة الرقمية ولماذا قد تتباين النتائج.',
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
  },
  {
    label: 'Britannica - Islamic calendar',
    description: 'خلفية موثوقة عن التقويم الهجري القمري وطبيعة السنة الأقصر من الميلادية.',
    href: 'https://www.britannica.com/topic/Islamic-calendar',
  },
  {
    label: 'ISO 8601',
    description: 'مرجع لتنسيق التاريخ الميلادي الرقمي عند مشاركة المقابل الميلادي.',
    href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
  },
];

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function buildHijriYearKeywords(year: string): string[] {
  return [
    `تقويم ${year} هجري`,
    `تقويم ${year} هـ`,
    `تقويم أم القرى ${year}`,
    `${year} هجري كم ميلادي`,
    `رمضان ${year}`,
    `عيد الفطر ${year}`,
    `عيد الأضحى ${year}`,
    `شهور ${year} هجري`,
    ...PAGE_KEYWORDS,
  ];
}

function buildEventNote(eventType: string): string {
  if (eventType === 'holiday') {
    return 'مناسبة رئيسية؛ استخدمها للتخطيط المبكر ثم راجع إعلان بلدك الرسمي.';
  }

  if (eventType === 'sacred_month_start') {
    return 'بداية شهر له مكانة خاصة، ومفيد لمتابعة المواسم الدينية.';
  }

  return 'موعد ديني أو اجتماعي يساعدك على فهم موضع اليوم داخل السنة.';
}

async function getCurrentHijriYear(): Promise<number> {
  const now = new Date(await getCachedNowIso());
  const isoNow = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  try {
    return convertDate({
      date: isoNow,
      toCalendar: 'hijri',
      method: 'umalqura',
    }).year;
  } catch {
    return 1447;
  }
}

function buildDecisionRows(
  year: number,
  totalDays: number,
  firstGregorianLabel: string,
  lastGregorianLabel: string
): DecisionRow[] {
  return [
    {
      label: 'إذا كنت تخطط لرمضان أو العيد',
      value: `ابدأ من تقويم ${year} هـ لرؤية الشهر كاملاً، ثم افتح اليوم المطلوب قبل اعتماد الموعد.`,
    },
    {
      label: 'إذا كنت تحتاج المقابل الميلادي',
      value: `السنة تمتد تقريباً من ${firstGregorianLabel} إلى ${lastGregorianLabel}، لكن صفحة اليوم تعطيك المقابل الأكثر وضوحاً للمشاركة.`,
    },
    {
      label: 'إذا كان القرار رسمياً أو شرعياً',
      value: 'استخدم هذه الصفحة كمرجع منظم وفق أم القرى، ثم طابق التاريخ مع الجهة الرسمية في بلدك عند الإعلان عن بداية الشهر.',
    },
    {
      label: 'إذا كنت تراجع طول السنة',
      value: `عام ${year} هـ يحتوي على ${totalDays} يوماً في هذا الحساب، وتختلف أطوال الشهور بين 29 و30 يوماً.`,
    },
  ];
}

function buildHijriYearEvents(year: number): HijriYearEvent[] {
  const events: HijriYearEvent[] = [];

  for (const event of BASE_ISLAMIC_EVENTS) {
    try {
      const gregorian = convertDate({
        date: `${year}-${padDatePart(event.hijriMonth)}-${padDatePart(event.hijriDay)}`,
        toCalendar: 'gregorian',
        method: 'umalqura',
      });

      events.push({
        label: event.nameAr,
        hijriDate: `${event.hijriDay} ${HIJRI_MONTHS_AR[event.hijriMonth - 1]} ${year} هـ`,
        gregorianDate: `${gregorian.dayNameAr} ${gregorian.day} ${gregorian.monthNameAr} ${gregorian.year}`,
        href: `/date/hijri/${year}/${padDatePart(event.hijriMonth)}/${padDatePart(event.hijriDay)}`,
        note: buildEventNote(event.type),
      });
    } catch {
      continue;
    }
  }

  return events;
}

export async function generateStaticParams() {
  const now = new Date(await getCachedNowIso());
  const isoNow = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  let currentHijriYear = 1447;
  try {
    const h = convertDate({ date: isoNow, toCalendar: 'hijri', method: 'umalqura' });
    currentHijriYear = h.year;
  } catch (error) {
    logger.warn('date-hijri-calendar-static-params-current-year-failed', {
      error: serializeError(error),
      date: isoNow,
      method: 'umalqura',
      toCalendar: 'hijri',
    });
  }

  // Cover current ±10 years so that historically-indexed pages (e.g. 1441
  // which is 2019-2020 and still crawled by Google) are pre-built at deploy
  // time rather than relying on on-demand rendering which is more fragile.
  const params = [];
  for (let y = currentHijriYear - 10; y <= currentHijriYear + 10; y++) {
    // Skip years outside the UmalQura adapter's supported range.
    if (y < 1343 || y > 1500) continue;
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
  if (numericYear < 1343 || numericYear > 1500) {
    notFound();
  }

  const currentHijriYear = await getCurrentHijriYear();
  const isIndexableYear = isSeoIndexableHijriCalendarYear(numericYear, currentHijriYear);

  return {
    title: `تقويم ${year} هجري كامل بالميلادي | أم القرى`,
    description: `تقويم ${year} هـ كامل بالعربية وفق أم القرى، مع الشهور والأيام والمقابل الميلادي ومواعيد رمضان والعيد وذي الحجة وروابط مباشرة لكل يوم.`,
    keywords: buildHijriYearKeywords(year),
    alternates: { canonical: `${BASE_URL}/date/calendar/hijri/${year}` },
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
      title: `تقويم ${year} هجري كامل بالميلادي | ميقاتنا`,
      description: `افتح عام ${year} هـ كاملاً: الشهور، الأيام، المقابل الميلادي، والمناسبات الهجرية المهمة.`,
      url: `${BASE_URL}/date/calendar/hijri/${year}`,
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `تقويم ${year} هجري كامل`,
      description: `تقويم أم القرى لعام ${year} هـ مع المقابل الميلادي وروابط كل يوم.`,
    },
  };
}

export default async function HijriCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) notFound();
  const y = parseInt(year, 10);

  if (y < 1343 || y > 1500) notFound();

  const monthLengths = Array.from({ length: 12 }, (_, index) => getHijriMonthDays(y, index + 1));
  const totalDays = monthLengths.reduce((sum, days) => sum + days, 0);

  let firstGregorianLabel = 'غير متاح';
  let lastGregorianLabel = 'غير متاح';
  let firstGregorianYear = 2026;
  let lastGregorianYear = 2026;
  try {
    const firstGregorian = convertDate({
      date: `${y}-01-01`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
    const lastGregorian = convertDate({
      date: `${y}-12-${String(monthLengths[11]).padStart(2, '0')}`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });

    firstGregorianLabel = `${firstGregorian.day} ${GREGORIAN_MONTHS_AR[firstGregorian.month - 1]} ${firstGregorian.year}`;
    lastGregorianLabel = `${lastGregorian.day} ${GREGORIAN_MONTHS_AR[lastGregorian.month - 1]} ${lastGregorian.year}`;
    firstGregorianYear = firstGregorian.year;
    lastGregorianYear = lastGregorian.year;
  } catch {
    // Keep graceful fallbacks for unsupported years.
  }

  const monthLinks: MonthLink[] = HIJRI_MONTHS_AR.map((monthName, index) => ({
    label: monthName,
    href: `/date/hijri/${y}/${padDatePart(index + 1)}/01`,
    days: monthLengths[index],
  }));
  const decisionRows = buildDecisionRows(y, totalDays, firstGregorianLabel, lastGregorianLabel);
  const keyEvents = buildHijriYearEvents(y);

  const faqItems = [
    {
      question: `ما هو التقويم الهجري لعام ${y}؟`,
      answer: `التقويم الهجري لعام ${y} هـ هو عرض كامل للشهور القمرية من محرم إلى ذي الحجة، مع المقابل الميلادي لكل يوم وفق أم القرى. يفيدك عندما تريد رؤية السنة كاملة قبل اختيار رمضان أو العيد أو يوم هجري محدد.`,
    },
    {
      question: `هل يعتمد هذا التقويم على أم القرى؟`,
      answer: `نعم، هذا التقويم مبني على تقويم أم القرى المستخدم على نطاق واسع في السعودية ودول الخليج. قد يظهر اختلاف بيوم واحد في بعض البلدان أو الجهات التي تعتمد إعلاناً محلياً لبداية الشهور.`,
    },
    {
      question: `ما المدى الميلادي الذي يغطيه عام ${y} هـ؟`,
      answer: `عام ${y} هـ يمتد تقريباً من ${firstGregorianLabel} إلى ${lastGregorianLabel}. يبدأ العام الهجري وينتهي داخل نطاق ميلادي مختلف لأن التقويم الهجري أقصر من السنة الميلادية بنحو 10 إلى 11 يوماً.`,
    },
    {
      question: `كيف أستخدم تقويم ${y} الهجري للتحويل إلى ميلادي؟`,
      answer: `استخدم تقويم ${y} الهجري بالانتقال إلى الشهر ثم اليوم الذي تبحث عنه، وستصل مباشرة إلى صفحة التاريخ الهجري التفصيلية. هناك ستجد التاريخ الميلادي الموافق ومسارات التحويل بين الطريقتين.`,
    },
    {
      question: `ما أهم المناسبات داخل عام ${y} هـ؟`,
      answer: `تظهر في هذه الصفحة مواعيد مثل بداية رمضان، عيد الفطر، يوم عرفة، عيد الأضحى، ورأس السنة الهجرية عند توفرها داخل تقويم أم القرى. استخدمها للتخطيط المبكر ثم راجع الإعلان المحلي عند الاعتماد الرسمي.`,
    },
    {
      question: `هل يمكن أن يختلف رمضان ${y} هـ أو العيد بيوم؟`,
      answer: `نعم، قد يحدث اختلاف محدود بين البلدان بسبب الرؤية المحلية للهلال أو طريقة الحساب. لذلك تعرض الصفحة حساب أم القرى بوضوح، لكنها لا تغني عن إعلان الجهة الرسمية في بلدك.`,
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الهجري', href: '/date/calendar/hijri' },
    { label: `عام ${year} هـ` },
  ];

  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التقويم الهجري لعام ${year}`,
    description: `تقويم أم القرى لعام ${year} هـ مع الشهور والأيام والمقابل الميلادي الكامل.`,
    url: `${BASE_URL}/date/calendar/hijri/${year}`,
    inLanguage: 'ar',
    about: [
      `تقويم ${year} هجري`,
      'تقويم أم القرى',
      'رمضان والعيد',
      'تحويل التاريخ الهجري',
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `شهور عام ${year} هـ`,
    itemListElement: monthLinks.map((month, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${month.label} ${year} هـ`,
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
    name: `طريقة استخدام تقويم ${year} هـ`,
    description: `خطوات عملية لاستخدام تقويم ${year} هـ في معرفة الشهر واليوم والمقابل الميلادي.`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'راجع نطاق السنة',
        text: `ابدأ بقراءة النطاق الميلادي لعام ${year} هـ من ${firstGregorianLabel} إلى ${lastGregorianLabel}.`,
      },
      {
        '@type': 'HowToStep',
        name: 'اختر الشهر الهجري',
        text: 'افتح الشهر المطلوب من روابط الشهور أو من شبكة التقويم السنوي.',
      },
      {
        '@type': 'HowToStep',
        name: 'افتح صفحة اليوم',
        text: 'اضغط على اليوم المطلوب لمعرفة المقابل الميلادي والتفاصيل قبل مشاركة الموعد.',
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
              <p className="date-kicker m-0">تقويم أم القرى السنوي</p>
              <h1 className="date-hero-title text-accent-alt">
                التقويم الهجري لعام {year} هـ
              </h1>
              <p className="date-hero-copy">
                تقويم {year} هـ يعرض لك السنة الهجرية كاملة من محرم إلى ذي الحجة، مع المقابل الميلادي لكل يوم وفق أم القرى. استخدمه إذا كنت تريد معرفة رمضان، العيد، الحج، بداية شهر، أو تحويل يوم هجري إلى ميلادي دون أن تبحث شهراً بشهر.
              </p>
            </div>
            <aside className="date-hero-rail" aria-label="التنقل بين السنوات الهجرية">
              <p className="date-hero-answer">{totalDays} يوماً</p>
              <p className="date-hero-note">
                يمتد عام {year} هـ تقريباً من {firstGregorianLabel} إلى {lastGregorianLabel} ميلادي.
              </p>
              <div className="date-hero-actions">
                <Link href={`/date/calendar/hijri/${y - 1}`} className="date-hero-link">
                  → عام {y - 1} هـ
                </Link>
                <Link href={`/date/calendar/hijri/${y + 1}`} className="date-hero-link date-hero-link--primary">
                  عام {y + 1} هـ ←
                </Link>
              </div>
            </aside>
          </section>

          <section className="date-stat-grid mb-8">
            {[
              { label: 'عدد أيام السنة', value: `${totalDays} يوماً` },
              { label: 'بداية العام', value: `1 محرم ${y} هـ` },
              { label: 'نهاية العام', value: `${monthLengths[11]} ذو الحجة ${y} هـ` },
              { label: 'النطاق الميلادي', value: `${firstGregorianLabel} إلى ${lastGregorianLabel}` },
            ].map((fact) => (
              <div key={fact.label} className="date-stat-item">
                <div className="date-stat-value">{fact.value}</div>
                <div className="date-stat-label">{fact.label}</div>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <HijriYearlyCalendar year={y} />
          </section>

          <section className="date-editorial-grid date-section">
            <article className="date-editorial-block">
              <h2 className="date-editorial-title">كيف يعمل هذا التقويم الهجري؟</h2>
              <p className="date-editorial-copy m-0">
                يعتمد هذا العرض على تقويم أم القرى، لذلك يظهر لك اليوم الهجري مع مقابله الميلادي في كل خانة من خانات السنة. هذا يجعل الصفحة مناسبة للبحث عن بداية شهر، أو معرفة توافق مناسبة هجريّة مع التاريخ الميلادي بسرعة.
              </p>
            </article>

            <article className="date-editorial-block">
              <h2 className="date-editorial-title">لماذا قد يختلف التاريخ الهجري بين الدول؟</h2>
              <p className="date-editorial-copy m-0">
                يختلف التاريخ الهجري أحياناً لأن بعض الجهات تعتمد حساباً فلكياً ثابتاً، بينما تعتمد جهات أخرى الإعلان المحلي لرؤية الهلال. لهذا السبب قد تلاحظ فرقاً بيوم واحد بين تقويم أم القرى وبعض التقاويم الرسمية خارج الخليج.
              </p>
            </article>
          </section>

          <section className="date-detail-panel mb-8">
            <h2 className="date-section-title">شهور عام {year} الهجري</h2>
            <p className="date-editorial-copy mb-4">
              انتقل مباشرة إلى بداية أي شهر هجري من شهور سنة {year} هـ، ثم اختر اليوم المطلوب لمعرفة مقابله بالتقويم الميلادي أو للوصول إلى صفحة التاريخ التفصيلية.
            </p>
            <div className="flex flex-wrap gap-2">
              {monthLinks.map((month) => (
                <Link key={month.href} href={month.href} className="chip">
                  {month.label} · {month.days} يوم
                </Link>
              ))}
            </div>
          </section>

          {keyEvents.length > 0 && (
            <section className="date-detail-panel mb-8" aria-labelledby="hijri-calendar-events-heading">
              <h2 id="hijri-calendar-events-heading" className="date-section-title">
                مناسبات هجرية بارزة في عام {year} هـ
              </h2>
              <p className="date-editorial-copy mb-4">
                هذه المواعيد محسوبة وفق أم القرى. استخدمها لفهم موضع رمضان والعيد والحج داخل السنة الميلادية، ثم راجع إعلان بلدك عند الاعتماد الرسمي.
              </p>
              <div className="date-detail-list">
                {keyEvents.map((event) => (
                  <Link key={event.href} href={event.href} className="date-detail-row">
                    <span className="date-detail-label">{event.label}</span>
                    <span className="date-detail-value">
                      {event.hijriDate} · {event.gregorianDate} · {event.note}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="date-detail-panel mb-8" aria-labelledby="hijri-calendar-decision-heading">
            <h2 id="hijri-calendar-decision-heading" className="date-section-title">
              قاعدة القرار قبل الاعتماد على تقويم {year} هـ
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
              <h2 className="date-editorial-title">كيف تستخدم تقويم {year} هـ في التخطيط؟</h2>
              <p className="date-editorial-copy">
                التقويم الهجري لا يتحرك مثل الميلادي؛ فهو أقصر بنحو عشرة إلى أحد عشر يوماً كل سنة. لذلك قد تأتي المناسبة الهجرية في فصل مختلف بعد عدة سنوات، وقد يبدأ العام الهجري وينتهي داخل سنتين ميلاديتين. قراءة النطاق الميلادي في أعلى الصفحة تساعدك على فهم هذا الانتقال بسرعة.
              </p>
              <p className="date-editorial-copy">
                إذا كنت تبحث عن رمضان أو ذي الحجة أو موعد عائلي، فافتح الشهر أولاً ثم اليوم المحدد. صفحة اليوم تمنحك المقابل الميلادي والتنقل بين الأيام، بينما تقويم السنة يمنحك الصورة الواسعة: طول كل شهر، ترتيب الشهور، وأين يقع العام الهجري داخل السنة الميلادية.
              </p>
              <p className="date-editorial-copy">
                ولأن بعض الدول تعلن بداية الشهر بناءً على رؤية محلية للهلال، استخدم هذا التقويم كمرجع منظم، ثم راجع الإعلان الرسمي عندما يكون الموعد دينياً أو حكومياً. هذا يوازن بين سرعة البحث ودقة الاعتماد في الحالات الحساسة.
              </p>
              <p className="date-editorial-copy">
                إذا كنت تخطط لموسم كامل مثل رمضان أو الحج أو إجازة عائلية، فاحتفظ برابط السنة الهجرية ثم افتح الشهر المرتبط بها عند الحاجة. هذا يجعل المقارنة بين الهجري والميلادي أكثر هدوءاً من البحث عن كل يوم منفرداً في كل مرة.
              </p>
            </div>
          </section>

          <section className="related-links mb-8" dir="rtl" aria-labelledby="hijri-year-sources-heading">
            <p id="hijri-year-sources-heading" className="related-links__heading">
              مصادر ومنهج تقويم {year} هـ
            </p>
            <div className="related-links__grid">
              {HIJRI_YEAR_SOURCE_LINKS.map((source) => (
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
              <h2 className="date-section-title">أسئلة قبل استخدام تقويم {year} هـ في التخطيط</h2>
              <p className="date-section-copy">
                هذه الإجابات تساعدك على اختيار الصفحة الصحيحة بين التقويم السنوي، صفحة اليوم، والمحول.
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

          <nav aria-label="مسارات متابعة تقويم السنة الهجرية" className="related-links" dir="rtl">
            <p className="related-links__heading">بعد تقويم {year} هـ: افتح التحويل أو السنة الميلادية الموافقة</p>
            <div className="related-links__grid">
              <Link href="/date" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة التاريخ الرئيسية</span>
                  <span className="related-link-card__desc">تاريخ اليوم والتحويل والتقاويم من مكان واحد</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">تحويل سريع بين الهجري والميلادي</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/gregorian-to-hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تحويل ميلادي إلى هجري</span>
                  <span className="related-link-card__desc">أدخل التاريخ الميلادي واحصل على الهجري</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href={`/date/calendar/${firstGregorianYear}`} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التقويم الميلادي الموافق</span>
                  <span className="related-link-card__desc">ابدأ من عام {firstGregorianYear}م المقابل لبداية السنة الهجرية</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              {lastGregorianYear !== firstGregorianYear && (
                <Link href={`/date/calendar/${lastGregorianYear}`} className="related-link-card">
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Calendar size={16} strokeWidth={1.75} />
                  </span>
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">نهاية النطاق الميلادي</span>
                    <span className="related-link-card__desc">راجع أيضاً عام {lastGregorianYear}م لأن نهاية {year} هـ تقع داخله</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              )}
            </div>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
