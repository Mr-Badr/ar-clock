import type { Metadata } from 'next';
import Link from 'next/link';

import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { convertDate } from '@/lib/date-adapter';
import { getCachedNowIso } from '@/lib/date-utils';
import { logger, serializeError } from '@/lib/logger';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

const PAGE_KEYWORDS: readonly string[] = [
  ...buildDateKeywords({}),
  'التقويم الميلادي',
  'تقويم السنة الميلادية',
  'تقويم ميلادي هجري',
  'تقويم 2026 ميلادي وهجري',
  'تقويم السنة مع الهجري',
  'تقويم الشهور الميلادية',
  'تقويم الأيام والمناسبات',
  'فتح تقويم سنة ميلادية',
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
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-8">
            <div className="date-hero-main">
              <div className="date-kicker">
                التقويم الميلادي
              </div>
              <h1 className="date-hero-title">
                التقويم الميلادي: افتح السنة ثم انتقل إلى الشهر أو اليوم المطلوب
              </h1>
              <p className="date-hero-copy mb-4">
                ابدأ من تقويم {currentYear} إذا كنت تريد السنة الحالية، أو اختر سنة قريبة للتخطيط
                لموعد، إجازة، بداية شهر، أو مناسبة تحتاج ربطها بالمقابل الهجري.
              </p>
              <p className="date-hero-copy mb-0">
                التقويم السنوي مناسب عندما يكون سؤالك أوسع من تاريخ اليوم: تريد رؤية الشهور
                والأيام أولاً، ثم تضيق البحث إلى اليوم المحدد أو تنتقل إلى محول التاريخ.
              </p>
            </div>
            <div className="date-hero-rail" aria-label="إجراء التقويم الأساسي">
              <div>
                <div className="date-hero-answer">تقويم {currentYear}</div>
                <p className="date-hero-note mb-0">
                  السنة الحالية مع الشهور والأيام والمقابل الهجري.
                </p>
              </div>
              <div className="date-hero-actions">
                <Link href={`/date/calendar/${currentYear}`} className="date-hero-link date-hero-link--primary">
                  افتح تقويم {currentYear}
                  <span aria-hidden="true">←</span>
                </Link>
                <Link href="/date/converter" className="date-hero-link">
                  حوّل تاريخاً محدداً
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="date-action-list date-action-list--four mb-8">
            <Link href={`/date/calendar/${currentYear}`} className="date-action-link">
              <div className="date-action-meta">ابدأ من الأكثر طلباً</div>
              <div className="date-action-title text-accent-alt">تقويم {currentYear}</div>
              <p className="date-action-copy">
                افتح السنة الحالية مع الأشهر والأيام والوصول السريع إلى اليوم الحالي.
              </p>
            </Link>
            <Link href={`/date/calendar/${currentYear + 1}`} className="date-action-link">
              <div className="date-action-meta">للتخطيط المسبق</div>
              <div className="date-action-title">تقويم {currentYear + 1}</div>
              <p className="date-action-copy">
                مناسب للمواعيد المستقبلية، الإجازات، والمواسم التي تحتاج رؤية سنوية مبكرة.
              </p>
            </Link>
            <Link href={`/date/calendar/hijri/${currentHijriYear}`} className="date-action-link">
              <div className="date-action-meta">المسار الموازي</div>
              <div className="date-action-title">التقويم الهجري {currentHijriYear}</div>
              <p className="date-action-copy">
                إذا كانت نيتك تبدأ من السنة الهجرية لا الميلادية، فانتقل مباشرة إلى التقويم المقابل.
              </p>
            </Link>
            <Link href="/date/converter" className="date-action-link">
              <div className="date-action-meta">للإجابة المباشرة</div>
              <div className="date-action-title">محول التاريخ</div>
              <p className="date-action-copy">
                استخدمه عندما يكون لديك تاريخ محدد وتريد تحويله فوراً دون فتح سنة كاملة.
              </p>
            </Link>
          </section>

          <section className="date-section">
            <h2 className="date-section-title">سنوات ميلادية قريبة قد تحتاجها كثيراً</h2>
            <div className="date-year-list">
              {yearLinks.map((item) => (
                <Link key={item.href} href={item.href} className="date-year-link">
                  <span className="date-year-main">
                    <span className="date-year-meta">تقويم سنوي مفهرس</span>
                    <span className="date-year-title">{item.year}</span>
                    <span className="date-year-copy">{item.description}</span>
                  </span>
                  <span className="date-link-action">
                    افتح تقويم {item.year} ←
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="date-editorial-grid date-section">
            <article className="date-editorial-block">
              <h2 className="date-editorial-title">متى يكون التقويم السنوي أفضل من صفحة اليوم؟</h2>
              <p className="date-editorial-copy m-0">
                يكون التقويم السنوي أفضل عندما تحتاج إلى رؤية أوسع من يوم واحد. قد تبحث عن
                موعد يمتد على أكثر من شهر، أو تريد مقارنة بداية رمضان أو الإجازات مع الشهور
                الميلادية، أو تراجع مواعيد مدرسة أو جامعة أو سفر. في هذه الحالات، يبدأ
                البحث عادة من السنة ثم يضيق النطاق تدريجياً حتى يصل إلى اليوم المطلوب،
                وهذا بالضبط ما يقدمه هذا المسار.
              </p>
            </article>

            <article className="date-editorial-block">
              <h2 className="date-editorial-title">كيف يساعدك هذا القسم في الوصول الأسرع؟</h2>
              <p className="date-editorial-copy m-0">
                بدلاً من كتابة التاريخ من جديد في كل مرة، يمكنك فتح السنة، ثم الشهر، ثم اليوم،
                أو الانتقال مباشرة إلى السنة الهجرية الموافقة أو إلى أداة التحويل. هذا
                التسلسل يقلل الاحتكاك ويجعل الصفحة مفيدة للزيارة الأولى وللعودة المتكررة،
                خصوصاً عندما تكون لديك أكثر من نية: مراجعة سنة، تحويل، مقارنة، أو
                مشاركة رابط سنة معينة مع الآخرين.
              </p>
            </article>
          </section>

          <section className="date-detail-panel mb-8">
            <h2 className="date-section-title">طريقة قراءة التقويم السنوي دون تضييع وقت</h2>
            <div className="date-detail-list">
              {CALENDAR_DECISION_ROWS.map((row) => (
                <div key={row.label} className="date-detail-row">
                  <span className="date-detail-label">{row.label}</span>
                  <span className="date-detail-value">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="related-links mb-8" dir="rtl" aria-labelledby="calendar-sources-heading">
            <p id="calendar-sources-heading" className="related-links__heading">
              مصادر تساعدك على فهم التقويم السنوي
            </p>
            <div className="related-links__grid">
              {CALENDAR_SOURCE_LINKS.map((source) => (
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

          <section className="date-section mb-10">
            <h2 className="date-section-title">أسئلة قبل اختيار سنة أو تحويل يوم محدد</h2>
            <div className="date-faq-grid">
              {CALENDAR_FAQ_ITEMS.map((item) => (
                <article key={item.question} className="date-faq-item">
                  <h3 className="date-faq-question">{item.question}</h3>
                  <p className="date-faq-copy m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <nav aria-label="مسارات الانتقال من التقويم الميلادي" className="related-links" dir="rtl">
            <p className="related-links__heading">بعد التقويم: اختر المسار الذي يختصر عليك الوقت</p>
            <div className="related-links__grid">
              <Link href="/date" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">مركز التاريخ</span>
                  <span className="related-link-card__desc">تاريخ اليوم، التحويل، والتقاويم من مكان واحد</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href={`/date/calendar/hijri/${currentHijriYear}`} className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التقويم الهجري الحالي</span>
                  <span className="related-link-card__desc">افتح السنة الهجرية {currentHijriYear} هـ وأيامها</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href="/date/today" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تاريخ اليوم</span>
                  <span className="related-link-card__desc">للإجابة السريعة إذا كان سؤالك مرتبطاً باليوم الحالي فقط</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href="/date/country" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ حسب الدولة</span>
                  <span className="related-link-card__desc">اعرف التاريخ المحلي والهجري بحسب البلد الذي يهمك</span>
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
