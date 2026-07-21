// src/app/date/hijri-to-gregorian/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate, type ConvertDateResult } from '@/lib/date-adapter';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import { ConverterForm } from '../converter/ConverterForm';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import {
  ArrowLeftRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  FileClock,
  FileText,
  HelpCircle,
  Landmark,
  Moon,
  Plane,
  type LucideIcon,
} from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { logger, serializeError } from '@/lib/logger';
import styles from '../DateRoutePage.module.css';

const BASE_URL = getSiteUrl();
const PAGE_PATH = '/date/hijri-to-gregorian';

const PAGE_KEYWORDS: readonly string[] = [
  'تحويل من هجري إلى ميلادي',
  'تحويل هجري ميلادي',
  'هجري لميلادي',
  'تحويل التاريخ الهجري إلى ميلادي',
  'محول التاريخ من هجري إلى ميلادي',
  'تاريخ هجري لميلادي',
  'تحويل تاريخ الميلاد من هجري إلى ميلادي',
  'تحويل تاريخ هجري حسب أم القرى',
  'التاريخ الميلادي الموافق للهجري',
  'كيف أحول التاريخ من هجري إلى ميلادي',
  'حاسبة تحويل التاريخ الهجري',
  'تحويل موعد هجري إلى ميلادي',
  'تقويم أم القرى هجري ميلادي',
];

interface SourceLink {
  href: string;
  label: string;
  description: string;
}

interface UseCase {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface DecisionRow {
  scenario: string;
  use: string;
  caution: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const SOURCE_LINKS: readonly SourceLink[] = [
  {
    href: 'https://www.ummulqura.org.sa/About.aspx',
    label: 'تقويم أم القرى: نبذة عن التقويم',
    description: 'مرجع رسمي يشرح أن أم القرى تقويم هجري قمري مدني والتقويم الرسمي في السعودية.',
  },
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي وقواعده الشمسية وإصلاحه التاريخي.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'مرجع تقني يوضح اختلاف أنواع التقويم الإسلامي مثل أم القرى والمدني والجدولي.',
  },
];

const USE_CASES: readonly UseCase[] = [
  {
    icon: FileText,
    title: 'وثيقة مكتوبة بالهجري',
    body: 'إذا كان التاريخ في عقد أو شهادة أو سجل قديم مكتوباً بالهجري، أدخله كما هو ثم استخدم الميلادي الناتج للمراسلات أو النماذج التي لا تقبل الهجري.',
  },
  {
    icon: FileClock,
    title: 'تاريخ ميلاد هجري',
    body: 'حوّل تاريخ الميلاد الهجري إلى ميلادي عندما تحتاج تسجيله في تطبيق أو منصة تستخدم التقويم الميلادي، مع الاحتفاظ بالتاريخ الهجري الأصلي.',
  },
  {
    icon: Plane,
    title: 'سفر أو حجز',
    body: 'الرحلات والتأمينات والحجوزات الدولية تطلب غالباً التاريخ الميلادي. التحويل هنا يعطيك صيغة قابلة للاستخدام خارج البلد الذي يعتمد الهجري.',
  },
  {
    icon: Landmark,
    title: 'معاملة رسمية',
    body: 'استخدم النتيجة كمرجع سريع، لكن لا تجعلها بديلاً عن الجهة الرسمية إذا كان التاريخ مرتبطاً بأهلية، رخصة، إقامة، أو إجراء قانوني.',
  },
];

const DECISION_ROWS: readonly DecisionRow[] = [
  {
    scenario: 'تاريخ هجري في وثيقة',
    use: 'أدخل اليوم والشهر والسنة كما تظهر في الوثيقة، ثم اكتب التاريخين عند المشاركة.',
    caution: 'لا تصحح الشهر أو السنة ذهنياً، فخطأ شهر واحد يغيّر النتيجة أسابيع.',
  },
  {
    scenario: 'تاريخ ميلاد هجري',
    use: 'حوّله إلى ميلادي للاستخدام في التطبيقات والنماذج، واحتفظ بالأصل الهجري في سجلك.',
    caution: 'إذا كان الاستخدام طبياً أو قانونياً فراجع جهة السجل، لا تعتمد التحويل وحده.',
  },
  {
    scenario: 'مناسبة دينية أو بداية شهر',
    use: 'قارن أم القرى بالطريقة الفلكية أو المدنية عندما يظهر فرق يوم واحد.',
    caution: 'رمضان والعيدان ودخول الأشهر قد يعتمد إعلان بلدك أو الجهة المختصة.',
  },
  {
    scenario: 'تاريخ بعد المغرب',
    use: 'انتبه إلى أن اليوم الهجري قد يبدأ من المغرب في بعض السياقات الدينية.',
    caution: 'الأداة لا تسأل عن الساعة؛ أدخل التاريخ الهجري الذي تعتمده الجهة أو التقويم المحلي.',
  },
];

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'كيف أحول التاريخ من هجري إلى ميلادي؟',
    answer: 'أدخل اليوم والشهر والسنة الهجرية في الأداة، واترك اتجاه التحويل مثبتاً على «هجري إلى ميلادي»، ثم اختر طريقة الحساب واضغط «تحويل التاريخ». ستظهر النتيجة الميلادية باسم اليوم والشهر والصيغة الرقمية.',
  },
  {
    question: 'ما أفضل طريقة حساب للتحويل من هجري إلى ميلادي؟',
    answer: 'ابدأ بأم القرى إذا كان التاريخ سعودياً أو خليجياً. استخدم الفلكي للمقارنة مع مراجع تعتمد الرصد أو الحساب، واستخدم المدني عندما تحتاج نموذجاً حسابياً ثابتاً لاستخدام بحثي أو جدولي.',
  },
  {
    question: 'لماذا تختلف النتيجة الميلادية يوماً واحداً أحياناً؟',
    answer: 'لأن بداية الشهر الهجري قد تعتمد على تقويم محسوب مسبقاً، أو رؤية الهلال، أو إعلان محلي. يظهر هذا الفرق غالباً عند أول الشهر أو آخره، خاصة في رمضان وشوال وذي الحجة.',
  },
  {
    question: 'هل يصلح التحويل لتاريخ الميلاد الهجري؟',
    answer: 'نعم، يمكنك تحويل تاريخ ميلاد هجري إلى ميلادي. لكن إذا كان التاريخ سيُستخدم في سجل طبي أو قانوني أو أهلية رسمية، فاحتفظ بالتاريخ الأصلي وراجع الجهة التي تقبل السجل.',
  },
  {
    question: 'هل يمكن تحويل تاريخ هجري قديم جداً؟',
    answer: 'هذه الصفحة مصممة للنطاق العملي الحديث: 1343-1500 هجري تقريباً. التواريخ التاريخية الأقدم تحتاج مراجع متخصصة لأن طرق إثبات الشهور والتقويمات المعتمدة تختلف عبر الزمن.',
  },
  {
    question: 'هل التاريخ الميلادي الناتج مناسب للمواعيد الدينية؟',
    answer: 'النتيجة مفيدة للفهم والتخطيط، لكنها لا تغني عن إعلان الجهة الرسمية في بلدك عند المواعيد الدينية أو الحكومية الحساسة.',
  },
];

export const metadata: Metadata = {
  title: 'تحويل من هجري إلى ميلادي | أم القرى والفلكي والمدني',
  description: 'حوّل أي تاريخ هجري إلى ميلادي فوراً، وافهم متى تختار أم القرى أو الفلكي أو المدني ومتى تراجع الجهة الرسمية.',
  keywords: PAGE_KEYWORDS.join(', '),
  alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
  openGraph: {
    title: 'تحويل من هجري إلى ميلادي',
    description: 'أداة عربية لتحويل التاريخ الهجري إلى ميلادي مع شرح فرق طرق الحساب ومتى قد يظهر فرق يوم واحد.',
    url: `${BASE_URL}${PAGE_PATH}`,
    locale: 'ar_SA',
  },
};

export default function HijriToGregorianPage() {
  return (
    <Suspense fallback={<DateRouteLoading title="جاري تجهيز تحويل الهجري إلى ميلادي" description="نجهز التاريخ الهجري الحالي وأداة التحويل واتجاهها." />}>
      <HijriToGregorianDynamicContent />
    </Suspense>
  );
}

async function HijriToGregorianDynamicContent() {
  const now = new Date(await getCachedNowIso());
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  let todayHijri: ConvertDateResult | undefined;
  let umalquraGregorian: ConvertDateResult | undefined;
  let astronomicalGregorian: ConvertDateResult | undefined;
  let civilGregorian: ConvertDateResult | undefined;
  try {
    todayHijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
    const hijriIso = `${todayHijri.year}-${String(todayHijri.month).padStart(2, '0')}-${String(todayHijri.day).padStart(2, '0')}`;
    umalquraGregorian = convertDate({ date: hijriIso, toCalendar: 'gregorian', method: 'umalqura' });
    astronomicalGregorian = convertDate({ date: hijriIso, toCalendar: 'gregorian', method: 'astronomical' });
    civilGregorian = convertDate({ date: hijriIso, toCalendar: 'gregorian', method: 'civil' });
  } catch (error) {
    logger.warn('date-hijri-to-gregorian-current-conversion-failed', {
      error: serializeError(error),
      date: isoDate,
      toCalendar: 'gregorian',
    });
  }

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'محول التاريخ', href: '/date/converter' },
    { label: 'هجري إلى ميلادي' },
  ];

  const toolSchema = buildFreeToolPageSchema({
    siteUrl: BASE_URL,
    path: PAGE_PATH,
    name: 'تحويل من هجري إلى ميلادي',
    description: 'أداة مجانية لتحويل التاريخ الهجري إلى ميلادي مع أم القرى والفلكي والمدني وشرح طريقة اختيار المرجع.',
    about: ['تحويل هجري ميلادي', 'التاريخ الميلادي', 'التاريخ الهجري', 'تقويم أم القرى', 'محول التاريخ'],
    keywords: [...PAGE_KEYWORDS],
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'أسئلة تحويل التاريخ من هجري إلى ميلادي',
    mainEntity: FAQ_ITEMS.map((item) => ({
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
    name: 'كيفية تحويل التاريخ من هجري إلى ميلادي',
    step: [
      { '@type': 'HowToStep', text: 'ابدأ من التاريخ الهجري الأصلي كما يظهر في الوثيقة أو التقويم.' },
      { '@type': 'HowToStep', text: 'أدخل اليوم والشهر والسنة الهجرية في أداة التحويل.' },
      { '@type': 'HowToStep', text: 'اختر طريقة الحساب المناسبة: أم القرى أو الفلكي أو المدني.' },
      { '@type': 'HowToStep', text: 'راجع النتيجة الميلادية، ثم طابقها مع الجهة الرسمية إذا كان الاستخدام حساساً.' },
    ],
  };

  const methodResults = [
    umalquraGregorian ? { label: 'أم القرى', result: umalquraGregorian.formatted.ar } : null,
    astronomicalGregorian ? { label: 'فلكي', result: astronomicalGregorian.formatted.ar } : null,
    civilGregorian ? { label: 'مدني', result: civilGregorian.formatted.ar } : null,
  ].filter((item): item is { label: string; result: string } => Boolean(item));

  return (
    <>
      <JsonLd data={[toolSchema, buildBreadcrumbJsonLd(breadcrumb, BASE_URL), faqSchema, howToSchema]} />
      <AdLayoutWrapper>
        <main className={styles.main}>
          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-date-hijri-to-gregorian" slotKey="topDateBanner" />

          <div className="container mx-auto px-4">
            <DateBreadcrumb items={breadcrumb} />
          </div>

          <section
            className={`container mx-auto px-4 ${styles.heroSection} ${styles.heroCompact}`}
            aria-labelledby="hijri-to-gregorian-title"
          >
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <h1 id="hijri-to-gregorian-title" className={styles.heroTitle}>
                  تحويل من هجري إلى ميلادي
                </h1>
                <p className={styles.heroLead}>
                  أدخل اليوم والشهر والسنة الهجرية وستظهر النتيجة الميلادية فوراً.
                  {todayHijri && (
                    <> اليوم هجري حسب أم القرى: {todayHijri.formatted.ar}، الموافق <span dir="ltr">{isoDate}</span>م.</>
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-label="أداة تحويل الهجري إلى ميلادي">
            <div className={styles.sectionPanel}>
              <Suspense fallback={<DateRouteLoading title="جاري تحميل أداة التحويل" description="نجهز التاريخ الهجري الحالي كقيمة بداية." />}>
                <ConverterForm
                  defaultDirection="hijri-to-gregorian"
                  lockedDirection
                  defaultYear={todayHijri?.year ?? 1447}
                  defaultMonth={todayHijri?.month ?? 1}
                  defaultDay={todayHijri?.day ?? 1}
                />
              </Suspense>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={styles.prosePanel}>
              <h2 className={styles.sectionTitle}>كيف تفهم التاريخ الميلادي الناتج؟</h2>
              <div className={styles.proseBody}>
                <p>
                  أنت تبدأ من تاريخ هجري، وهو تاريخ قمري. الأداة تبحث عن اليوم الميلادي المقابل له
                  حسب طريقة الحساب التي اخترتها. لذلك لا تتعامل مع النتيجة كرقم منفصل، بل كترجمة
                  لتاريخ له مرجع: أم القرى، حساب فلكي، أو نموذج مدني ثابت.
                </p>
                <p>
                  مثال عملي: إذا وجدت في وثيقة تاريخاً مثل 10 رمضان 1447 هـ، فأدخله كما هو، ثم انسخ
                  التاريخ الميلادي الناتج للمنصة أو النموذج الذي يطلب الميلادي. لا تغيّر الشهر الهجري
                  إلى رقم تقديري من ذاكرتك، لأن أسماء الشهور المتشابهة أو ترتيبها قد يسبب خطأ كبيراً.
                </p>
                <p>
                  القاعدة المختصرة: للتعاملات السعودية والخليجية ابدأ بأم القرى، وللمقارنة استخدم
                  الفلكي أو المدني. أما إذا كان التاريخ مرتبطاً برمضان أو العيد أو قرار رسمي، فالمرجع
                  النهائي هو إعلان الجهة المختصة في بلدك.
                </p>
              </div>
              <div className={styles.infoGrid}>
                {USE_CASES.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className={`${styles.infoCard} ${index === 0 ? styles.infoCardLead : ''}`}
                    >
                      <span className={styles.cardIcon} aria-hidden="true">
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardBody}>{item.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={styles.prosePanel}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>قاعدة القرار قبل اعتماد التاريخ الميلادي</h2>
                <p className={styles.sectionCopy}>
                  اختر طريقة التعامل مع النتيجة حسب سبب التحويل، لأن تاريخاً للذكرى الشخصية ليس مثل تاريخ في رخصة أو عقد.
                </p>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-right">الموقف</th>
                      <th className="text-right">ما الذي تفعله؟</th>
                      <th className="text-right">ما الذي تنتبه له؟</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DECISION_ROWS.map((row) => (
                      <tr key={row.scenario}>
                        <td>{row.scenario}</td>
                        <td>{row.use}</td>
                        <td>{row.caution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {methodResults.length > 0 && (
            <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="hijri-methods-heading">
              <div className={styles.sectionPanel}>
                <div className={styles.sectionHead}>
                  <h2 id="hijri-methods-heading" className={styles.sectionTitle}>
                    مثال اليوم: نفس التاريخ الهجري بثلاث طرق
                  </h2>
                  <p className={styles.sectionCopy}>
                    عند تحويل تاريخ هجري واحد، قد تتطابق النتيجة الميلادية أو تختلف عند أطراف الشهر.
                    هذه المقارنة تساعدك على رؤية أثر طريقة الحساب قبل نسخ التاريخ.
                  </p>
                </div>
                <div className={styles.methodResultGrid}>
                  {methodResults.map((item) => (
                    <article key={item.label} className={styles.metricCard}>
                      <span className={styles.metricLabel}>{item.label}</span>
                      <strong className={styles.metricValue}>{item.result}</strong>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <AdInArticle slotId="mid-date-hijri-to-gregorian" />

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="hijri-faq-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <span className="badge badge-accent">أسئلة شائعة</span>
                <h2 id="hijri-faq-heading" className={styles.sectionTitle}>
                  أسئلة مهمة قبل اعتماد التحويل إلى ميلادي
                </h2>
                <p className={styles.sectionCopy}>
                  هذه الأسئلة تغطي أكثر مواضع الالتباس: تاريخ الميلاد، فرق يوم واحد، والمواعيد الرسمية.
                </p>
              </div>
              <div className={styles.faqGrid}>
                {FAQ_ITEMS.map((item) => (
                  <details key={item.question} className={styles.faqCard}>
                    <summary className={styles.faqQuestion}>
                      <HelpCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                      {item.question}
                    </summary>
                    <p className={styles.cardBody}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="hijri-sources-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="hijri-sources-heading" className={styles.sectionTitle}>
                  مصادر تساعدك على فهم التحويل
                </h2>
                <p className={styles.sectionCopy}>
                  راجع هذه المصادر إذا أردت فهم الفرق بين التقويم الهجري القمري، أم القرى، والتقويم الميلادي الشمسي.
                </p>
              </div>
              <div className={styles.linkGrid}>
                {SOURCE_LINKS.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    className={styles.linkCard}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.cardIcon} aria-hidden="true">
                      <CheckCircle2 size={16} strokeWidth={1.75} />
                    </span>
                    <span className={styles.cardTitle}>{source.label}</span>
                    <span className={styles.cardBody}>{source.description}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <nav aria-label="مسارات مراجعة نتيجة التحويل الهجري إلى ميلادي" className={styles.sectionPanel} dir="rtl">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>إذا بدأت من تاريخ هجري وتحتاج خطوة ثانية</h2>
                <p className={styles.sectionCopy}>
                  بعد التحويل، اختر المسار الذي يساعدك على المراجعة: عكس التحويل، قراءة تاريخ اليوم، أو فتح المحول العام.
                </p>
              </div>
              <div className={`${styles.linkGrid} mt-5`}>
                <Link href="/date/gregorian-to-hijri" className={`${styles.linkCard} ${styles.linkCardPrimary}`}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <ArrowLeftRight size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>تحويل ميلادي إلى هجري</span>
                  <span className={styles.cardBody}>استخدمه للتأكد من أن التاريخ الميلادي الناتج يرجع إلى نفس اليوم الهجري.</span>
                </Link>

                <Link href="/date/today/hijri" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Moon size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>التاريخ الهجري اليوم</span>
                  <span className={styles.cardBody}>راجع السياق الحالي إذا كان الموعد قريباً من بداية شهر هجري أو مناسبة دينية.</span>
                </Link>

                <Link href="/date/converter" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Calendar size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>محول التاريخ العام</span>
                  <span className={styles.cardBody}>افتحه عندما تحتاج تغيير الاتجاه أو مقارنة أكثر من تاريخ في جلسة واحدة.</span>
                </Link>

                <Link href={`/date/calendar/${y}`} className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <CalendarDays size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>تقويم {y}</span>
                  <span className={styles.cardBody}>افتح السنة كاملة عندما تريد رؤية موقع التاريخ الميلادي داخل الشهر والخطة السنوية.</span>
                </Link>
              </div>
            </nav>
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
