import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, CalendarDays, Moon, Globe2, ArrowLeftRight, MapPin, Sparkles, ScrollText } from 'lucide-react';

import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';
import { SiteRelatedCardGrid } from '@/components/shared/SiteRelatedCardGrid';
import { YearJumpSelect } from '@/components/date/YearJumpSelect.client';
import { convertDate } from '@/lib/date-adapter';
import { getCachedNowIso } from '@/lib/date-utils';
import { logger, serializeError } from '@/lib/logger';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { getSiteUrl } from '@/lib/site-config';

const GLANCE_DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

type GlanceChip = { dayName: string; num: number; isToday: boolean };

function buildGregorianGlanceStrip(now: Date): GlanceChip[] {
  const chips: GlanceChip[] = [];
  for (let offset = -3; offset <= 3; offset += 1) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + offset);
    chips.push({ dayName: GLANCE_DAY_NAMES[d.getUTCDay()], num: d.getUTCDate(), isToday: offset === 0 });
  }
  return chips;
}

const BASE_URL = getSiteUrl();

const PAGE_KEYWORDS: readonly string[] = [
  ...buildDateKeywords({}),
  'التقويم الميلادي',
  'تقويم السنة الميلادية',
  'تقويم ميلادي هجري',
  'تقويم السنة الحالية ميلادي وهجري',
  'تقويم السنة مع الهجري',
  'تقويم الشهور الميلادية',
  'تقويم الأيام والمناسبات',
  'فتح تقويم سنة ميلادية',
  'تقويم شهري ميلادي',
  'ارقام الاسابيع في السنة',
];

interface YearLink {
  year: number;
  href: string;
  description: string;
}

interface DecisionRow {
  label: string;
  value: string;
}

interface SourceLink {
  href: string;
  label: string;
  description: string;
}

const CALENDAR_DECISION_ROWS: readonly DecisionRow[] = [
  {
    label: 'تريد رؤية سنة كاملة',
    value: 'ابدأ من التقويم الميلادي، ثم افتح السنة والشهر واليوم بالتدريج بدلاً من إدخال تاريخ واحد كل مرة.',
  },
  {
    label: 'لديك تاريخ محدد بالفعل',
    value: 'استخدم محول التاريخ أو صفحة اليوم المحدد؛ سيكون أسرع من تصفح السنة كاملة.',
  },
  {
    label: 'تخطط لإجازة أو دراسة أو سفر',
    value: 'افتح السنة الحالية أو القادمة، ثم راجع المقابل الهجري للأيام الحساسة قبل الحجز أو المشاركة.',
  },
  {
    label: 'تحتاج مناسبة دينية أو بداية شهر',
    value: 'استخدم التقويم السنوي للفهم، ثم راجع التقويم الهجري أو إعلان بلدك عند رمضان والعيد والحج.',
  },
];

const CALENDAR_SOURCE_LINKS: readonly SourceLink[] = [
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي الشمسي وقواعد السنوات الكبيسة والاستخدام المدني.',
  },
  {
    href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    label: 'ISO 8601',
    description: 'مرجع صيغة التاريخ الرقمية التي تساعد في الأرشفة والروابط والأنظمة.',
  },
  {
    href: 'https://www.ummulqura.org.sa/Index.aspx',
    label: 'تقويم أم القرى',
    description: 'مرجع للتقويم الهجري والتحويل الذي يظهر كمقابل للأيام داخل تقويم السنة.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'يوضح لماذا قد يختلف المقابل الهجري حسب طريقة الحساب أو البلد.',
  },
];

const CALENDAR_FAQ_ITEMS = [
  {
    question: 'ما الذي ستجده في صفحة التقويم الميلادي؟',
    answer:
      'ستجد هنا مدخلاً واضحاً إلى السنوات الميلادية القريبة، ومسارات مباشرة إلى كل سنة كاملة، وطريقة عملية للانتقال من التقويم السنوي إلى صفحات الأيام والتواريخ المطابقة في الهجري.',
  },
  {
    question: 'هل التقويم السنوي مناسب للبحث عن يوم محدد؟',
    answer:
      'نعم. إذا كنت تعرف السنة فقط أو تريد استعراض شهور السنة قبل اختيار يوم بعينه، فصفحة التقويم السنوي هي أسرع نقطة بداية، ثم يمكنك فتح الشهر أو اليوم المطلوب مباشرة.',
  },
  {
    question: 'هل يعرض هذا القسم المقابل الهجري أيضاً؟',
    answer:
      'نعم. صفحات السنوات الميلادية داخل هذا القسم تربط كل يوم بالمقابل الهجري وفق تقويم أم القرى، لذلك يمكنك استخدامها للتخطيط أو المراجعة أو المقارنة بين التقويمين من مكان واحد.',
  },
  {
    question: 'متى أستخدم التقويم الميلادي بدلاً من محول التاريخ؟',
    answer:
      'استخدم محول التاريخ عندما تملك يوماً محدداً وتريد نتيجة مباشرة، واستخدم التقويم الميلادي عندما تريد رؤية السنة أو الشهر كاملاً، أو التنقل بين الأيام والمناسبات بشكل بصري ومنظم.',
  },
  {
    question: 'هل أستطيع استخدام التقويم لمعرفة المناسبات الدينية؟',
    answer:
      'يمكنك استخدامه للفهم الأولي ومراجعة المقابل الهجري، لكن رمضان والعيدان وبدايات الأشهر تحتاج إعلان البلد أو الجهة الرسمية عند الاستخدام الحساس.',
  },
];

export const metadata: Metadata = {
  title: 'التقويم الميلادي | تقويم السنوات مع الهجري والتحويل',
  description:
    'افتح التقويم الميلادي لأي سنة قريبة، وراجع الشهور والأيام والمقابل الهجري وروابط التحويل قبل التخطيط أو مشاركة التاريخ.',
  keywords: [...PAGE_KEYWORDS],
  alternates: { canonical: `${BASE_URL}/date/calendar` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'التقويم الميلادي | تقويم السنوات مع الهجري',
    description:
      'مدخل عربي لاختيار سنة ميلادية وفتح الشهور والأيام والمقابل الهجري وروابط التحويل.',
    url: `${BASE_URL}/date/calendar`,
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'التقويم الميلادي | ميقاتنا',
    description: 'اختر السنة الميلادية وافتح الشهور والأيام مع المقابل الهجري من صفحة واحدة.',
  },
};

function buildGregorianYearLinks(currentYear: number): YearLink[] {
  return Array.from({ length: 7 }, (_, index) => {
    const year = currentYear - 3 + index;
    return {
      year,
      href: `/date/calendar/${year}`,
      description:
        year === currentYear
          ? 'السنة الحالية مع تحديثات الأيام ومسارات الوصول السريع.'
          : year < currentYear
            ? 'راجع السنة كاملة وتفاصيل الأيام والأشهر الماضية.'
            : 'خطط مبكراً للمواعيد والإجازات والمناسبات القادمة.',
    };
  });
}

export default async function CalendarRootPage() {
  const now = new Date(await getCachedNowIso());
  const currentYear = now.getUTCFullYear();
  const todayIso = now.toISOString().slice(0, 10);

  let currentHijriYear = 1447;
  try {
    currentHijriYear = convertDate({
      date: todayIso,
      toCalendar: 'hijri',
      method: 'umalqura',
    }).year;
  } catch (error) {
    logger.warn('date-calendar-root-current-hijri-year-fallback-used', {
      routePath: '/date/calendar',
      todayIso,
      error: serializeError(error),
    });
    currentHijriYear = 1447;
  }

  const yearLinks = buildGregorianYearLinks(currentYear);
  const glanceStrip = buildGregorianGlanceStrip(now);
  const currentYearInfo = yearLinks.find((item) => item.year === currentYear) ?? yearLinks[0];
  const decisionIcons = [Calendar, ArrowLeftRight, MapPin, Sparkles];
  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الميلادي' },
  ];
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'التقويم الميلادي',
    description:
      'صفحة للوصول إلى السنوات الميلادية والأشهر والأيام مع المقابل الهجري وروابط التحويل.',
    url: `${BASE_URL}/date/calendar`,
    inLanguage: 'ar',
    about: ['التقويم الميلادي', 'تقويم السنة', 'الشهور الميلادية', 'المقابل الهجري', 'محول التاريخ'],
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'كيفية استخدام التقويم الميلادي',
    step: [
      { '@type': 'HowToStep', text: 'اختر السنة الميلادية الأقرب لسؤالك من الروابط السريعة.' },
      { '@type': 'HowToStep', text: 'افتح السنة لترى الشهور والأيام والمقابل الهجري.' },
      { '@type': 'HowToStep', text: 'انتقل إلى صفحة اليوم إذا كنت تحتاج تفاصيل تاريخ محدد.' },
      { '@type': 'HowToStep', text: 'استخدم محول التاريخ عندما تملك تاريخاً واحداً وتريد نتيجة مباشرة.' },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'سنوات التقويم الميلادي القريبة',
    itemListElement: yearLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `تقويم ${item.year}`,
      url: `${BASE_URL}${item.href}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CALENDAR_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, webPageSchema, itemListSchema, faqSchema, howToSchema]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-date-calendar" slotKey="topDateBanner" />

          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel date-hero-panel--single mb-12">
            <div className="date-hero-main">
              <div className="date-kicker">
                التقويم الميلادي
              </div>
              <h1 className="date-hero-title">
                التقويم الميلادي {currentYear}
              </h1>
              <p className="date-hero-copy">
                افتح السنة الحالية أو اختر سنة قريبة، ثم انتقل إلى الشهر أو اليوم والمقابل الهجري.
              </p>

              {/* Real dates, not more paragraphs — a taste of the calendar right in the hero
                  (owner, 2026-08-13: "even this page should have the calendar"). */}
              <div className="date-hero-glance" aria-label="الأسبوع الحالي بالتقويم الميلادي">
                {glanceStrip.map((chip) => (
                  <div key={`${chip.dayName}-${chip.num}`} className="date-hero-glance-chip" data-today={chip.isToday}>
                    <span className="date-hero-glance-day">{chip.dayName}</span>
                    <span className="date-hero-glance-num">{chip.num}</span>
                  </div>
                ))}
              </div>

              <div className="date-hero-quick-actions">
                <Link href={`/date/calendar/${currentYear}`} className="date-hero-cta">
                  <Calendar size={16} strokeWidth={2} aria-hidden="true" />
                  افتح تقويم {currentYear}
                </Link>
                <Link href="/date/converter" className="date-quick-action">
                  <ArrowLeftRight size={16} strokeWidth={1.75} aria-hidden="true" />
                  حوّل تاريخاً محدداً
                </Link>
              </div>
            </div>
          </section>

          <section className="date-action-list date-action-list--four mb-8">
            <Link href={`/date/calendar/${currentYear}`} className="date-action-link">
              <span className="date-action-icon" aria-hidden="true"><Calendar size={18} strokeWidth={1.75} /></span>
              <div className="date-action-meta">ابدأ من الأكثر طلباً</div>
              <div className="date-action-title text-accent-alt">تقويم {currentYear}</div>
              <p className="date-action-copy">
                افتح السنة الحالية مع الأشهر والأيام والوصول السريع إلى اليوم الحالي.
              </p>
            </Link>
            <Link href={`/date/calendar/${currentYear + 1}`} className="date-action-link">
              <span className="date-action-icon" aria-hidden="true"><CalendarDays size={18} strokeWidth={1.75} /></span>
              <div className="date-action-meta">للتخطيط المسبق</div>
              <div className="date-action-title">تقويم {currentYear + 1}</div>
              <p className="date-action-copy">
                مناسب للمواعيد المستقبلية، الإجازات، والمواسم التي تحتاج رؤية سنوية مبكرة.
              </p>
            </Link>
            <Link href={`/date/calendar/hijri/${currentHijriYear}`} className="date-action-link">
              <span className="date-action-icon" aria-hidden="true"><Moon size={18} strokeWidth={1.75} /></span>
              <div className="date-action-meta">المسار الموازي</div>
              <div className="date-action-title">التقويم الهجري {currentHijriYear}</div>
              <p className="date-action-copy">
                إذا كانت نيتك تبدأ من السنة الهجرية لا الميلادية، فانتقل مباشرة إلى التقويم المقابل.
              </p>
            </Link>
            <Link href="/date/converter" className="date-action-link">
              <span className="date-action-icon" aria-hidden="true"><ArrowLeftRight size={18} strokeWidth={1.75} /></span>
              <div className="date-action-meta">للإجابة المباشرة</div>
              <div className="date-action-title">محول التاريخ</div>
              <p className="date-action-copy">
                استخدمه عندما يكون لديك تاريخ محدد وتريد تحويله فوراً دون فتح سنة كاملة.
              </p>
            </Link>
          </section>

          {/* Current year gets its own showcase card; any OTHER year is a select, not a
              7-card grid to scroll through (owner, 2026-08-13: "give him information that
              he can select other years in a unique select button"). */}
          <section className="date-section">
            <h2 className="date-section-title">تقويم {currentYear}، أو اختر سنة أخرى</h2>
            <div className="date-year-showcase-row">
              <Link href={`/date/calendar/${currentYear}`} className="date-year-showcase">
                <span className="date-year-showcase-eyebrow">
                  <Calendar size={14} strokeWidth={1.75} aria-hidden="true" />
                  السنة الميلادية الحالية
                </span>
                <span className="date-year-showcase-num">{currentYear}</span>
                <span className="date-year-showcase-copy">{currentYearInfo?.description}</span>
                <span className="date-year-showcase-action">افتح تقويم {currentYear} ←</span>
              </Link>
              <YearJumpSelect
                basePath="/date/calendar"
                currentYear={currentYear}
                label="اختر سنة ميلادية أخرى"
              />
            </div>
          </section>

          {/* Scannable summary first, full paragraph tucked behind "التفاصيل" — content stays
              in the DOM (crawlable) without forcing a text wall by default (owner, 2026-08-13:
              "no one wants to read a lot of text with bad design"). */}
          <section className="date-section max-w-3xl">
            <h2 className="date-section-title">متى يكون التقويم السنوي أفضل من صفحة اليوم؟</h2>
            <div className="date-key-points">
              <article className="date-key-point">
                <div className="date-key-point-head">
                  <span className="date-key-point-icon" aria-hidden="true"><ScrollText size={18} strokeWidth={1.75} /></span>
                  <h3 className="date-key-point-title">عندما يتسع سؤالك عن أكثر من يوم واحد</h3>
                </div>
                <p className="date-key-point-summary">
                  موعد يمتد على أكثر من شهر، مقارنة رمضان أو الإجازات مع الشهور الميلادية، أو مواعيد مدرسة وجامعة وسفر — ابدأ من السنة ثم ضيّق حتى اليوم.
                </p>
                <details className="date-key-point-more">
                  <summary>التفاصيل</summary>
                  <p>
                    يكون التقويم السنوي أفضل عندما تحتاج إلى رؤية أوسع من يوم واحد. قد تبحث عن موعد يمتد على أكثر من شهر، أو تريد مقارنة بداية رمضان أو الإجازات مع الشهور الميلادية، أو تراجع مواعيد مدرسة أو جامعة أو سفر. في هذه الحالات، يبدأ البحث عادة من السنة ثم يضيق النطاق تدريجياً حتى يصل إلى اليوم المطلوب، وهذا بالضبط ما يقدمه هذا المسار.
                  </p>
                </details>
              </article>

              <article className="date-key-point">
                <div className="date-key-point-head">
                  <span className="date-key-point-icon" aria-hidden="true"><ArrowLeftRight size={18} strokeWidth={1.75} /></span>
                  <h3 className="date-key-point-title">وصول أسرع من كتابة التاريخ من جديد كل مرة</h3>
                </div>
                <p className="date-key-point-summary">
                  افتح السنة، ثم الشهر، ثم اليوم — أو انتقل مباشرة إلى السنة الهجرية الموافقة أو أداة التحويل.
                </p>
                <details className="date-key-point-more">
                  <summary>التفاصيل</summary>
                  <p>
                    بدلاً من كتابة التاريخ من جديد في كل مرة، يمكنك فتح السنة، ثم الشهر، ثم اليوم، أو الانتقال مباشرة إلى السنة الهجرية الموافقة أو إلى أداة التحويل. هذا التسلسل يقلل الاحتكاك ويجعل الصفحة مفيدة للزيارة الأولى وللعودة المتكررة، خصوصاً عندما تكون لديك أكثر من نية: مراجعة سنة، تحويل، مقارنة، أو مشاركة رابط سنة معينة مع الآخرين.
                  </p>
                </details>
              </article>
            </div>
          </section>

          {/* Decision cards — icon-chip grid, not a bordered label/value list (owner,
              2026-08-13: "so boaring design... we do not want this border bottom"). */}
          <section className="date-section max-w-3xl">
            <h2 className="date-section-title">طريقة قراءة التقويم السنوي دون تضييع وقت</h2>
            <div className="date-decision-grid">
              {CALENDAR_DECISION_ROWS.map((row, index) => {
                const Icon = decisionIcons[index % decisionIcons.length];
                return (
                  <article key={row.label} className="date-decision-card">
                    <span className="date-decision-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.75} /></span>
                    <h3 className="date-decision-label">{row.label}</h3>
                    <p className="date-decision-value">{row.value}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <AdInArticle slotId="mid-date-calendar" />

          {/* FAQ — the one pattern used everywhere (owner, 2026-08-13: "FAQ should always
              be like the FAQ in tools pages"). */}
          <section className="date-section max-w-3xl mb-10">
            <h2 className="date-section-title">أسئلة قبل اختيار سنة أو تحويل يوم محدد</h2>
            <SiteFaqAccordion items={CALENDAR_FAQ_ITEMS} />
          </section>

          {/* Related pages — small, clean, unique CARDS (owner, 2026-08-13), not a list. */}
          <section className="date-section max-w-3xl">
            <SiteRelatedCardGrid
              heading="بعد التقويم: اختر المسار الذي يختصر عليك الوقت"
              headingId="calendar-next-paths-heading"
              items={[
                { href: '/date', label: 'مركز التاريخ', Icon: Globe2 },
                { href: `/date/calendar/hijri/${currentHijriYear}`, label: 'التقويم الهجري الحالي', Icon: Moon },
                { href: '/date/today', label: 'تاريخ اليوم', Icon: CalendarDays },
                { href: '/date/country', label: 'التاريخ حسب الدولة', Icon: Globe2 },
              ]}
            />
          </section>

          {/* Sources — last thing on the page (owner, 2026-08-13), plain small dot-list
              like /tools. */}
          <section className="date-section max-w-3xl">
            <SiteDotLinkList
              heading="مصادر تساعدك على فهم التقويم السنوي"
              headingId="calendar-sources-heading"
              items={CALENDAR_SOURCE_LINKS.map((source) => ({
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
