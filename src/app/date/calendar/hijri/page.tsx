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
const HIJRI_CALENDAR_KEYWORDS = [
  'التقويم الهجري',
  'تقويم أم القرى',
  'تقويم هجري ميلادي',
  'سنوات هجرية',
  'السنة الهجرية الحالية',
  'تقويم رمضان',
  'تقويم ذي الحجة',
  'الهجري والميلادي',
  'تحويل التاريخ الهجري',
] as const;

type HijriYearLink = {
  year: number;
  href: string;
  description: string;
  gregorianSpan: string;
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

const HIJRI_CALENDAR_SOURCE_LINKS: SourceLink[] = [
  {
    label: 'تقويم أم القرى',
    description: 'مرجع شائع للتقويم الهجري المدني المستخدم في السعودية وخدمات عربية كثيرة.',
    href: 'https://www.ummulqura.org.sa/Index.aspx',
  },
  {
    label: 'Unicode CLDR',
    description: 'يوضح لماذا تختلف أنواع التقويم الإسلامي في البرمجيات والأنظمة الرقمية.',
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
  },
  {
    label: 'Britannica - Islamic calendar',
    description: 'خلفية موجزة عن طبيعة التقويم الهجري القمري وعدد أيام السنة.',
    href: 'https://www.britannica.com/topic/Islamic-calendar',
  },
  {
    label: 'ISO 8601',
    description: 'مرجع تنسيق التاريخ الرقمي عند مشاركة اليوم الميلادي الموافق.',
    href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
  },
];

const HIJRI_CALENDAR_FAQ_ITEMS = [
  {
    question: 'ما هو التقويم الهجري؟',
    answer:
      'التقويم الهجري تقويم قمري يبدأ عدّ سنواته من الهجرة النبوية، وتتكون سنته غالباً من 354 أو 355 يوماً. لذلك يتحرك رمضان والعيد والحج داخل السنة الميلادية ولا يبقون في الموسم نفسه كل عام.',
  },
  {
    question: 'ما فائدة صفحة التقويم الهجري الرئيسية؟',
    answer:
      'تعطيك هذه الصفحة مدخلاً واضحاً إلى السنوات الهجرية القريبة ومسارات مباشرة إلى كل سنة وشهورها وأيامها. استخدمها عندما تريد رؤية السنة كاملة قبل اختيار رمضان، ذي الحجة، العيد، أو يوم هجري محدد.',
  },
  {
    question: 'هل يعتمد هذا القسم على تقويم أم القرى؟',
    answer:
      'نعم، صفحات التقويم الهجري في هذا المسار مبنية على تقويم أم القرى، وهو المرجع الأكثر استخداماً في السعودية ودول خليجية كثيرة، مع الإشارة دائماً إلى احتمال اختلاف محدود في بعض البلدان.',
  },
  {
    question: 'متى أستخدم التقويم الهجري بدلاً من التاريخ حسب الدولة؟',
    answer:
      'استخدم التقويم الهجري عندما تكون نيتك مرتبطة بسنة أو شهر هجري كامل، مثل رمضان أو ذي الحجة. أما صفحة التاريخ حسب الدولة فهي أفضل عندما تريد معرفة تاريخ اليوم المحلي في بلد معين.',
  },
  {
    question: 'هل التاريخ الهجري واحد في كل الدول؟',
    answer:
      'ليس دائماً. قد تتفق الدول في كثير من الأيام، لكن بداية الشهر قد تختلف بيوم واحد بسبب الرؤية المحلية أو طريقة الحساب. لذلك يعرض هذا القسم نتيجة عملية وفق أم القرى مع تنبيهك إلى مراجعة الجهة الرسمية عند القرارات الدينية أو الحكومية.',
  },
  {
    question: 'هل يمكنني الانتقال من السنة الهجرية إلى الميلادية بسهولة؟',
    answer:
      'نعم. كل سنة هجريّة في هذا القسم تتصل بالسنة أو السنوات الميلادية الموافقة لها، وتمنحك مسارات واضحة للانتقال بين الأيام والشهور والتحويل المباشر من المسار نفسه.',
  },
];

export const metadata: Metadata = {
  title: 'التقويم الهجري | سنوات أم القرى بالميلادي',
  description:
    'افتح التقويم الهجري بالعربية، اختر السنة الهجرية، واعرف امتدادها الميلادي وروابط الشهور والأيام وفق أم القرى مع إرشادات الاعتماد الرسمي.',
  keywords: [...buildDateKeywords({}), ...HIJRI_CALENDAR_KEYWORDS],
  alternates: { canonical: `${BASE_URL}/date/calendar/hijri` },
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
    title: 'التقويم الهجري | سنوات أم القرى وروابط الأيام',
    description:
      'ابدأ من السنة الهجرية المناسبة، ثم انتقل إلى الشهر واليوم والمقابل الميلادي من مسار عربي واضح.',
    url: `${BASE_URL}/date/calendar/hijri`,
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'التقويم الهجري بالعربية',
    description:
      'سنوات هجرية قريبة، امتداد ميلادي، وروابط مباشرة للشهور والأيام وفق أم القرى.',
  },
};

function formatGregorianDateLabel(date: ReturnType<typeof convertDate>): string {
  return `${date.day} ${date.monthNameAr} ${date.year}`;
}

function getHijriYearEndDate(year: number): ReturnType<typeof convertDate> {
  try {
    return convertDate({
      date: `${year}-12-30`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
  } catch {
    return convertDate({
      date: `${year}-12-29`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
  }
}

function buildHijriYearGregorianSpan(year: number): string {
  try {
    const startDate = convertDate({
      date: `${year}-01-01`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
    const endDate = getHijriYearEndDate(year);

    return `${formatGregorianDateLabel(startDate)} - ${formatGregorianDateLabel(endDate)}`;
  } catch {
    return 'يمتد غالباً على سنتين ميلاديتين';
  }
}

function buildHijriYearLinks(currentHijriYear: number): HijriYearLink[] {
  return Array.from({ length: 7 }, (_, index) => {
    const year = currentHijriYear - 3 + index;
    return {
      year,
      href: `/date/calendar/hijri/${year}`,
      gregorianSpan: buildHijriYearGregorianSpan(year),
      description:
        year === currentHijriYear
          ? 'السنة الهجرية الحالية مع الأشهر والأيام الأكثر بحثاً.'
          : year < currentHijriYear
            ? 'راجع بداية الشهور والمناسبات الهجرية في السنوات الماضية.'
            : 'خطط مبكراً لرمضان والعيد وذي الحجة والمواسم المقبلة.',
    };
  });
}

function buildDecisionRows(currentHijriYear: number, currentGregorianYear: number): DecisionRow[] {
  return [
    {
      label: 'إذا كنت تبحث عن رمضان أو العيد',
      value: `ابدأ من تقويم ${currentHijriYear} هـ أو السنة الهجرية التالية، لأن المناسبة تتحرك داخل ${currentGregorianYear} وما بعدها حسب موضع الشهر القمري.`,
    },
    {
      label: 'إذا كان لديك تاريخ هجري محدد',
      value: 'اذهب مباشرة إلى محول هجري إلى ميلادي؛ الفهرس السنوي أفضل عندما تريد رؤية الشهر أو السنة كاملة.',
    },
    {
      label: 'إذا كان الموعد رسمياً أو دينياً',
      value: 'استخدم تقويم أم القرى للتخطيط، ثم راجع إعلان بلدك أو الجهة المختصة قبل اعتماد إجازة أو موعد شرعي.',
    },
    {
      label: 'إذا كنت تشارك التاريخ مع شخص آخر',
      value: 'أرسل رابط صفحة اليوم أو السنة مع ذكر أن الحساب وفق أم القرى حتى لا يحدث التباس عند اختلاف بداية الشهر.',
    },
  ];
}

export default async function HijriCalendarRootPage() {
  const now = new Date(await getCachedNowIso());
  const currentGregorianYear = now.getUTCFullYear();
  const todayIso = now.toISOString().slice(0, 10);

  let currentHijriYear = 1447;
  try {
    currentHijriYear = convertDate({
      date: todayIso,
      toCalendar: 'hijri',
      method: 'umalqura',
    }).year;
  } catch (error) {
    logger.warn('date-hijri-calendar-root-current-year-fallback-used', {
      routePath: '/date/calendar/hijri',
      todayIso,
      error: serializeError(error),
    });
    currentHijriYear = 1447;
  }

  const yearLinks = buildHijriYearLinks(currentHijriYear);
  const decisionRows = buildDecisionRows(currentHijriYear, currentGregorianYear);
  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الهجري' },
  ];
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'التقويم الهجري',
    description:
      'صفحة للوصول إلى السنوات الهجرية القريبة والشهور والأيام والمقابل الميلادي.',
    url: `${BASE_URL}/date/calendar/hijri`,
    inLanguage: 'ar',
    about: [
      'التقويم الهجري',
      'تقويم أم القرى',
      'تحويل التاريخ',
      'رمضان والعيد',
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'سنوات التقويم الهجري القريبة',
    itemListElement: yearLinks.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `تقويم ${item.year} هـ - ${item.gregorianSpan}`,
      url: `${BASE_URL}${item.href}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HIJRI_CALENDAR_FAQ_ITEMS.map((item) => ({
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
    name: 'طريقة استخدام التقويم الهجري',
    description: 'خطوات اختيار السنة الهجرية المناسبة ثم الوصول إلى الشهر أو اليوم والمقابل الميلادي.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'اختر السنة الهجرية',
        text: 'ابدأ من السنة الحالية أو السنة التي تضم رمضان أو المناسبة التي تبحث عنها.',
      },
      {
        '@type': 'HowToStep',
        name: 'افتح الشهر أو اليوم',
        text: 'انتقل من صفحة السنة إلى الشهر أو اضغط على اليوم المطلوب لمعرفة المقابل الميلادي.',
      },
      {
        '@type': 'HowToStep',
        name: 'راجع الاعتماد الرسمي',
        text: 'إذا كان التاريخ مرتبطاً بإجازة أو عبادة أو قرار حكومي، طابقه مع إعلان الجهة الرسمية في بلدك.',
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
              <div className="date-kicker">
                تقويم أم القرى
              </div>
              <h1 className="date-hero-title">
                التقويم الهجري: اختر السنة ثم اعرف الشهر واليوم والمقابل الميلادي
              </h1>
              <p className="date-hero-copy mb-4">
                التقويم الهجري هو تقويم قمري؛ لذلك تأتي السنة الهجرية أقصر من الميلادية وتتحرك مناسبات مثل رمضان والعيد والحج داخل الشهور الميلادية. من هذه الصفحة تبدأ بالسنة الهجرية، ثم تفتح الشهر أو اليوم لمعرفة المقابل الميلادي وفق أم القرى.
              </p>
              <p className="date-hero-copy mb-0">
                إذا كان لديك يوم هجري محدد فقط، استخدم التحويل المباشر. أما إذا كنت تريد رؤية موسم كامل أو التخطيط لشهر، فابدأ من التقويم السنوي.
              </p>
            </div>
            <div className="date-hero-rail" aria-label="إجراء التقويم الهجري الأساسي">
              <div>
                <div className="date-hero-answer">{currentHijriYear} هـ</div>
                <p className="date-hero-note mb-0">
                  السنة الهجرية الحالية تمتد تقريباً: {buildHijriYearGregorianSpan(currentHijriYear)}.
                </p>
              </div>
              <div className="date-hero-actions">
                <Link href={`/date/calendar/hijri/${currentHijriYear}`} className="date-hero-link date-hero-link--primary">
                  افتح تقويم {currentHijriYear} هـ
                  <span aria-hidden="true">←</span>
                </Link>
                <Link href="/date/hijri-to-gregorian" className="date-hero-link">
                  حوّل هجري إلى ميلادي
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="date-action-list date-action-list--four mb-8">
            <Link href={`/date/calendar/hijri/${currentHijriYear}`} className="date-action-link">
              <div className="date-action-meta">ابدأ من السنة الحالية</div>
              <div className="date-action-title text-accent-alt">{currentHijriYear} هـ</div>
              <p className="date-action-copy">
                افتح السنة الهجرية الحالية مع الشهور والأيام الأكثر طلباً.
              </p>
            </Link>
            <Link href={`/date/calendar/hijri/${currentHijriYear + 1}`} className="date-action-link">
              <div className="date-action-meta">للمواسم القادمة</div>
              <div className="date-action-title">{currentHijriYear + 1} هـ</div>
              <p className="date-action-copy">
                راقب رمضان والعيد وذي الحجة في السنة القادمة من الآن.
              </p>
            </Link>
            <Link href={`/date/calendar/${currentGregorianYear}`} className="date-action-link">
              <div className="date-action-meta">المسار الموازي</div>
              <div className="date-action-title">تقويم {currentGregorianYear} ميلادي</div>
              <p className="date-action-copy">
                انتقل إلى السنة الميلادية الحالية إذا كانت نقطة البداية عندك شهور السنة الميلادية.
              </p>
            </Link>
            <Link href="/date/hijri-to-gregorian" className="date-action-link">
              <div className="date-action-meta">للتحويل المباشر</div>
              <div className="date-action-title">هجري إلى ميلادي</div>
              <p className="date-action-copy">
                استخدم التحويل الفوري عندما تملك يوماً هجرياً محدداً وتريد مقابله مباشرة.
              </p>
            </Link>
          </section>

          <section className="date-section">
            <h2 className="date-section-title">سنوات هجرية قريبة يبدأ منها البحث غالباً</h2>
            <div className="date-year-list">
              {yearLinks.map((item) => (
                <Link key={item.href} href={item.href} className="date-year-link">
                  <span className="date-year-main">
                    <span className="date-year-meta">تقويم أم القرى</span>
                    <span className="date-year-title">{item.year} هـ</span>
                    <span className="date-year-copy">يمتد ميلادياً: {item.gregorianSpan}</span>
                    <span className="date-year-copy">{item.description}</span>
                  </span>
                  <span className="date-link-action">
                    افتح تقويم {item.year} هـ ←
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="date-editorial-grid date-section">
            <article className="date-editorial-block">
              <h2 className="date-editorial-title">لماذا لا يكفي أن تعرف تاريخ اليوم فقط؟</h2>
              <p className="date-editorial-copy m-0">
                لأن كثيراً من الأسئلة الهجرية تبدأ من موسم لا من يوم مفرد. قد تريد معرفة أين يقع رمضان داخل السنة الميلادية، أو متى يبدأ ذو الحجة، أو كيف تتوزع أيام العيد على الأسبوع. صفحة اليوم تجيبك عن الآن، أما صفحة السنة فتجعلك ترى الصورة كاملة قبل أن تختار اليوم.
              </p>
            </article>

            <article className="date-editorial-block">
              <h2 className="date-editorial-title">كيف نحافظ على وضوح العلاقة مع الميلادي؟</h2>
              <p className="date-editorial-copy m-0">
                لا نعزل التقويم الهجري عن الميلادي، بل نربطهما داخل الصفحات نفسها. كل سنة تعرض امتدادها الميلادي، وكل يوم يمكن فتحه لمعرفة المقابل بدقة أكبر. هذا مهم لأن الحياة اليومية غالباً تعمل بالتاريخ الميلادي، بينما تبقى المناسبات الدينية والاجتماعية مرتبطة بالشهور الهجرية.
              </p>
            </article>
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="hijri-calendar-decision-heading">
            <h2 id="hijri-calendar-decision-heading" className="date-section-title">
              قاعدة القرار: من أين تبدأ؟
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

          <section className="related-links mb-8" dir="rtl" aria-labelledby="hijri-calendar-sources-heading">
            <p id="hijri-calendar-sources-heading" className="related-links__heading">
              مصادر ومنهج التقويم الهجري
            </p>
            <div className="related-links__grid">
              {HIJRI_CALENDAR_SOURCE_LINKS.map((source) => (
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
            <div className="date-section-head">
              <h2 className="date-section-title">أسئلة قبل التخطيط بسنة هجرية</h2>
              <p className="date-section-copy">
                اقرأ هذه الإجابات إذا كنت تختار بين التقويم الهجري، محول التاريخ، تاريخ اليوم، أو صفحة الدولة.
              </p>
            </div>
            <div className="date-faq-grid">
              {HIJRI_CALENDAR_FAQ_ITEMS.map((item) => (
                <article key={item.question} className="date-faq-item">
                  <h3 className="date-faq-question">{item.question}</h3>
                  <p className="date-faq-copy m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <nav aria-label="مسارات الانتقال من التقويم الهجري" className="related-links" dir="rtl">
            <p className="related-links__heading">بعد التقويم الهجري: اختر المقارنة التي تحتاجها</p>
            <div className="related-links__grid">
              <Link href="/date" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">مركز التاريخ</span>
                  <span className="related-link-card__desc">تاريخ اليوم والتحويل والتقاويم من مكان واحد</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href={`/date/calendar/${currentGregorianYear}`} className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التقويم الميلادي الحالي</span>
                  <span className="related-link-card__desc">افتح سنة {currentGregorianYear} وما يقابلها من الهجري</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href="/date/today/hijri" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الهجري اليوم</span>
                  <span className="related-link-card__desc">للإجابة السريعة إذا كان سؤالك يخص اليوم الحالي فقط</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>
              <Link href="/date/country" className="related-link-card">
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ حسب الدولة</span>
                  <span className="related-link-card__desc">اعرف التاريخ المحلي والهجري وفق البلد الذي يهمك</span>
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
