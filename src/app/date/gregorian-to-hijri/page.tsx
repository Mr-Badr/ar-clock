// src/app/date/gregorian-to-hijri/page.tsx
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
import {
  ArrowLeftRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  HelpCircle,
  Moon,
  ShieldCheck,
  Sunset,
  type LucideIcon,
} from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { logger, serializeError } from '@/lib/logger';
import styles from '../DateRoutePage.module.css';

const BASE_URL = getSiteUrl();
const PAGE_PATH = '/date/gregorian-to-hijri';

const PAGE_KEYWORDS: readonly string[] = [
  'تحويل من ميلادي إلى هجري',
  'تحويل ميلادي هجري',
  'ميلادي لهجري',
  'تحويل التاريخ الميلادي إلى هجري',
  'محول التاريخ من ميلادي إلى هجري',
  'تاريخ ميلادي لهجري',
  'تحويل تاريخ الميلاد من ميلادي إلى هجري',
  'تحويل التاريخ حسب أم القرى',
  'التاريخ الهجري الموافق للميلادي',
  'كيف أحول التاريخ من ميلادي إلى هجري',
  'حاسبة تحويل التاريخ الميلادي',
  'تحويل موعد ميلادي إلى هجري',
  'تقويم أم القرى ميلادي هجري',
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
    description: 'مرجع رسمي يوضح أن أم القرى تقويم هجري قمري مدني والتقويم الرسمي في السعودية.',
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
    title: 'تاريخ ميلاد أو وثيقة',
    body: 'إذا كان التاريخ الأصلي مكتوباً بالميلادي، أدخله كما هو ثم احتفظ بالنتيجة الهجرية مع الصيغة الميلادية الأصلية حتى لا تختلط عليك النسختان.',
  },
  {
    icon: CalendarCheck,
    title: 'موعد عائلي أو مناسبة',
    body: 'حوّل الموعد الميلادي إلى هجري عندما تريد معرفة الشهر الهجري أو ترتيب مناسبة مرتبطة برمضان أو ذي الحجة أو بداية شهر قمري.',
  },
  {
    icon: ShieldCheck,
    title: 'استخدام رسمي',
    body: 'استخدم التحويل لفهم التاريخ سريعاً، ثم طابقه مع الجهة صاحبة القرار إذا كان مرتبطاً بعقد، إقامة، تأشيرة، مدرسة، أو موعد ديني.',
  },
  {
    icon: Sunset,
    title: 'حدث بعد المغرب',
    body: 'إذا كان الحدث بعد غروب الشمس وكان التاريخ الهجري مهماً، تذكّر أن اليوم الهجري قد يبدأ من المغرب في بعض السياقات الدينية، لا من منتصف الليل.',
  },
];

const DECISION_ROWS: readonly DecisionRow[] = [
  {
    scenario: 'تاريخ ميلادي في نموذج أو شهادة',
    use: 'حوّله إلى هجري بأم القرى، ثم اكتب التاريخين معاً عند الحاجة.',
    caution: 'لا تحذف التاريخ الميلادي الأصلي من الوثيقة، فهو مرجعك عند المراجعة.',
  },
  {
    scenario: 'تاريخ ميلاد وتريد اليوم الهجري',
    use: 'أدخل تاريخ الميلاد الميلادي، ثم اقرأ النتيجة الهجرية كاملة باليوم والشهر والسنة.',
    caution: 'إذا كانت الولادة بعد المغرب، فقد تحتاج مراجعة محلية لأن اليوم الهجري قد يتغير.',
  },
  {
    scenario: 'مناسبة قريبة من رمضان أو العيد',
    use: 'قارن النتيجة بأم القرى وبالطريقة الفلكية إذا ظهر اختلاف يوم واحد.',
    caution: 'المناسبات الدينية تعتمد إعلان الجهة المحلية، لا نتيجة أداة عامة فقط.',
  },
  {
    scenario: 'تخطيط سفر أو مراسلة بين بلدين',
    use: 'استخدم التحويل للفهم، ثم شارك التاريخ بالصيغة الميلادية والهجرية معاً.',
    caution: 'اختلاف الدولة وطريقة إثبات بداية الشهر قد يغيّر النتيجة عند أطراف الشهر.',
  },
];

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'كيف أحول التاريخ من ميلادي إلى هجري؟',
    answer: 'أدخل اليوم والشهر والسنة الميلادية في الأداة، واترك اتجاه التحويل مثبتاً على «ميلادي إلى هجري»، ثم اختر طريقة الحساب واضغط «تحويل التاريخ». ستظهر النتيجة الهجرية باسم الشهر واليوم والصيغة الرقمية.',
  },
  {
    question: 'هل أختار أم القرى أم الفلكي أم المدني؟',
    answer: 'ابدأ بأم القرى إذا كان السياق سعودياً أو خليجياً. اختر الفلكي للمقارنة مع مراجع تعتمد الحساب أو الرؤية المحلية، واستخدم المدني عندما تحتاج نموذجاً حسابياً ثابتاً للبحث والجداول.',
  },
  {
    question: 'لماذا يختلف تحويل الميلادي إلى هجري يوماً واحداً أحياناً؟',
    answer: 'لأن الشهر الهجري يبدأ بحسب طريقة اعتماد مختلفة: تقويم محسوب، رصد فلكي، أو إعلان محلي لرؤية الهلال. لذلك يظهر الفرق غالباً عند أول الشهر أو آخره، وليس في كل التواريخ.',
  },
  {
    question: 'هل يصلح التحويل لتاريخ الميلاد؟',
    answer: 'نعم، يصلح لمعرفة التاريخ الهجري الموافق لتاريخ ميلاد ميلادي. لكن إذا كان الاستخدام طبياً أو قانونياً أو مرتبطاً بسجل رسمي، فاحتفظ بالتاريخ الأصلي وراجع الجهة التي تعتمد السجل.',
  },
  {
    question: 'ماذا أفعل إذا كان الحدث بعد المغرب؟',
    answer: 'الأداة تحوّل التاريخ حسب اليوم المدخل فقط، ولا تسأل عن الساعة. إذا كان الحدث بعد المغرب وكان اليوم الهجري مهماً، فراجع التقويم أو الجهة المحلية لأن اليوم الهجري قد يبدأ من المغرب في بعض الاستخدامات.',
  },
  {
    question: 'ما النطاق المدعوم في هذه الصفحة؟',
    answer: 'النطاق العملي المدعوم هو 1924-2077 ميلادي تقريباً. إذا كنت تبحث في تواريخ تاريخية أقدم، فقد تحتاج مرجعاً متخصصاً لأن طرق التقويم واعتماد الشهور تغيرت عبر الزمن.',
  },
];

export const metadata: Metadata = {
  title: 'تحويل من ميلادي إلى هجري | أم القرى والفلكي والمدني',
  description: 'حوّل أي تاريخ ميلادي إلى هجري فوراً، وافهم متى تختار أم القرى أو الفلكي أو المدني ومتى تراجع الجهة الرسمية.',
  keywords: PAGE_KEYWORDS.join(', '),
  alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
  openGraph: {
    title: 'تحويل من ميلادي إلى هجري',
    description: 'أداة عربية لتحويل التاريخ الميلادي إلى هجري مع شرح طريقة الحساب ومتى قد يظهر فرق يوم واحد.',
    url: `${BASE_URL}${PAGE_PATH}`,
    locale: 'ar_SA',
  },
};

export default function GregorianToHijriPage() {
  return (
    <Suspense fallback={<DateRouteLoading title="جاري تجهيز تحويل الميلادي إلى هجري" description="نجهز أداة التحويل واتجاهها وشرح طرق الحساب." />}>
      <GregorianToHijriDynamicContent />
    </Suspense>
  );
}

async function GregorianToHijriDynamicContent() {
  const now = new Date(await getCachedNowIso());
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  let todayUmalqura: ConvertDateResult | undefined;
  let todayAstronomical: ConvertDateResult | undefined;
  let todayCivil: ConvertDateResult | undefined;
  try {
    todayUmalqura = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
    todayAstronomical = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'astronomical' });
    todayCivil = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'civil' });
  } catch (error) {
    logger.warn('date-gregorian-to-hijri-current-conversion-failed', {
      error: serializeError(error),
      date: isoDate,
      toCalendar: 'hijri',
    });
  }

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'محول التاريخ', href: '/date/converter' },
    { label: 'ميلادي إلى هجري' },
  ];

  const toolSchema = buildFreeToolPageSchema({
    siteUrl: BASE_URL,
    path: PAGE_PATH,
    name: 'تحويل من ميلادي إلى هجري',
    description: 'أداة مجانية لتحويل التاريخ الميلادي إلى هجري مع أم القرى والفلكي والمدني وشرح طريقة اختيار المرجع.',
    about: ['تحويل ميلادي هجري', 'التاريخ الهجري', 'تقويم أم القرى', 'محول التاريخ', 'التقويم الإسلامي'],
    keywords: [...PAGE_KEYWORDS],
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'أسئلة تحويل التاريخ من ميلادي إلى هجري',
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
    name: 'كيفية تحويل التاريخ من ميلادي إلى هجري',
    step: [
      { '@type': 'HowToStep', text: 'ابدأ من التاريخ الميلادي الأصلي كما يظهر في الوثيقة أو التقويم.' },
      { '@type': 'HowToStep', text: 'أدخل اليوم والشهر والسنة الميلادية في أداة التحويل.' },
      { '@type': 'HowToStep', text: 'اختر طريقة الحساب المناسبة: أم القرى أو الفلكي أو المدني.' },
      { '@type': 'HowToStep', text: 'راجع النتيجة الهجرية، ثم طابقها مع الجهة الرسمية إذا كان الاستخدام حساساً.' },
    ],
  };

  const methodResults = [
    todayUmalqura ? { label: 'أم القرى', result: todayUmalqura.formatted.ar } : null,
    todayAstronomical ? { label: 'فلكي', result: todayAstronomical.formatted.ar } : null,
    todayCivil ? { label: 'مدني', result: todayCivil.formatted.ar } : null,
  ].filter((item): item is { label: string; result: string } => Boolean(item));

  return (
    <>
      <JsonLd data={[toolSchema, buildBreadcrumbJsonLd(breadcrumb, BASE_URL), faqSchema, howToSchema]} />
      <AdLayoutWrapper>
        <main className={styles.main}>
          <div className="container mx-auto px-4">
            <DateBreadcrumb items={breadcrumb} />
          </div>

          <section className={`container mx-auto px-4 ${styles.heroSection}`} aria-labelledby="gregorian-to-hijri-title">
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>
                  <ArrowLeftRight size={14} />
                  ميلادي إلى هجري
                </span>
                <h1 id="gregorian-to-hijri-title" className={styles.heroTitle}>
                  تحويل من ميلادي إلى هجري
                </h1>
                <p className={styles.heroLead}>
                  حوّل التاريخ الميلادي إلى هجري فوراً: أدخل اليوم والشهر والسنة، اختر أم القرى
                  أو الفلكي أو المدني، ثم اقرأ النتيجة مع التنبيه المناسب. إذا كان التاريخ لوثيقة
                  أو مناسبة دينية أو إجراء رسمي، استخدم التحويل للفهم السريع ثم طابقه مع الجهة المعتمدة.
                </p>
                {todayUmalqura && (
                  <p className={styles.dateAnswerMeta}>
                    اليوم الميلادي <span dir="ltr">{isoDate}</span> يوافق حسب أم القرى: {todayUmalqura.formatted.ar}
                  </p>
                )}
              </div>
            </div>
          </section>

          <AdTopBanner slotId="top-date-gregorian-to-hijri" slotKey="topDateBanner" />

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-label="أداة تحويل الميلادي إلى هجري">
            <div className={styles.sectionPanel}>
              <Suspense fallback={<DateRouteLoading title="جاري تحميل أداة التحويل" description="نجهز التاريخ الميلادي الحالي كقيمة بداية." />}>
                <ConverterForm
                  defaultDirection="gregorian-to-hijri"
                  lockedDirection
                  defaultYear={y}
                  defaultMonth={m}
                  defaultDay={d}
                />
              </Suspense>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={styles.prosePanel}>
              <h2 className={styles.sectionTitle}>كيف تقرأ نتيجة التحويل؟</h2>
              <div className={styles.proseBody}>
                <p>
                  التحويل لا يعني تغيير الرقم فقط. أنت تبدأ من يوم في التقويم الميلادي، وهو تقويم شمسي،
                  ثم تبحث عن اليوم الموافق في التقويم الهجري، وهو تقويم قمري. لذلك قد ترى اختلافاً
                  قرب بداية الشهر الهجري لأن بداية الشهر قد تعتمد على أم القرى أو الرؤية المحلية أو نموذج حسابي.
                </p>
                <p>
                  مثال عملي: إذا كان تاريخ الميلاد مكتوباً 20/06/2018، فأدخله كما هو في الحقول الميلادية.
                  النتيجة الهجرية تساعدك على معرفة الشهر واليوم الهجريين، لكن التاريخ الميلادي يبقى المرجع
                  الأصلي في السجل إذا كان مكتوباً في شهادة أو جواز أو نموذج رسمي.
                </p>
                <p>
                  القاعدة المختصرة: استخدم أم القرى للمعاملات السعودية والخليجية، واستخدم الفلكي أو المدني
                  للمقارنة والفهم. وعندما يكون التاريخ مرتبطاً برمضان أو العيد أو قرار رسمي، راجع الإعلان
                  المحلي قبل الاعتماد النهائي.
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
                <h2 className={styles.sectionTitle}>قاعدة القرار قبل نسخ التاريخ الهجري</h2>
                <p className={styles.sectionCopy}>
                  نفس النتيجة لا تُستخدم بالطريقة نفسها في كل موقف. اختر كيف ستتعامل معها حسب سبب التحويل.
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
            <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="gregorian-methods-heading">
              <div className={styles.sectionPanel}>
                <div className={styles.sectionHead}>
                  <h2 id="gregorian-methods-heading" className={styles.sectionTitle}>
                    مثال اليوم: نفس التاريخ الميلادي بثلاث طرق
                  </h2>
                  <p className={styles.sectionCopy}>
                    هذه المقارنة توضّح لماذا لا ينبغي قراءة النتيجة كرقم معزول. في أغلب الأيام تتقارب النتائج،
                    وعند أطراف الشهر قد يظهر فرق يوم واحد.
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

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="gregorian-faq-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <span className="badge badge-accent">أسئلة شائعة</span>
                <h2 id="gregorian-faq-heading" className={styles.sectionTitle}>
                  أسئلة مهمة قبل اعتماد التحويل إلى هجري
                </h2>
                <p className={styles.sectionCopy}>
                  هذه الإجابات تركز على الحالات التي تسبب الالتباس: طريقة الحساب، تاريخ الميلاد، وبعد المغرب.
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

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="gregorian-sources-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="gregorian-sources-heading" className={styles.sectionTitle}>
                  مصادر تساعدك على فهم التحويل
                </h2>
                <p className={styles.sectionCopy}>
                  استخدم هذه المصادر عندما تريد معرفة الفرق بين التقويم الميلادي، أم القرى، والأنواع الحسابية للتقويم الإسلامي.
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
            <nav aria-label="مسارات مراجعة نتيجة التحويل الميلادي إلى هجري" className={styles.sectionPanel} dir="rtl">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>إذا أردت مراجعة النتيجة أو عكس التحويل</h2>
                <p className={styles.sectionCopy}>
                  بعد تحويل التاريخ الميلادي، اختر الخطوة التي تناسبك: عكس التحويل، قراءة تاريخ اليوم، أو فتح المحول العام.
                </p>
              </div>
              <div className={`${styles.linkGrid} mt-5`}>
                <Link href="/date/hijri-to-gregorian" className={`${styles.linkCard} ${styles.linkCardPrimary}`}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <ArrowLeftRight size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>تحويل هجري إلى ميلادي</span>
                  <span className={styles.cardBody}>استخدمه لمراجعة النتيجة بالعكس أو عندما يصبح التاريخ الهجري هو التاريخ الأصلي.</span>
                </Link>

                <Link href="/date/today/hijri" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Moon size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>التاريخ الهجري اليوم</span>
                  <span className={styles.cardBody}>قارن النتيجة بتاريخ اليوم عندما يكون الموعد قريباً أو مرتبطاً بمناسبة حالية.</span>
                </Link>

                <Link href="/date/converter" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <CalendarDays size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>محول التاريخ العام</span>
                  <span className={styles.cardBody}>افتحه عندما تحتاج اتجاهي التحويل أو تريد مقارنة عدة تواريخ في جلسة واحدة.</span>
                </Link>
              </div>
            </nav>
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
