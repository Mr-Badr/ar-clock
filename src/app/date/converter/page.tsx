// src/app/date/converter/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate, type ConvertDateResult } from '@/lib/date-adapter';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import { ConverterForm } from './ConverterForm';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import {
  ArrowLeftRight,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { logger, serializeError } from '@/lib/logger';
import styles from '../DateRoutePage.module.css';

const BASE_URL = getSiteUrl();
const PAGE_PATH = '/date/converter';

const PAGE_KEYWORDS: readonly string[] = [
  'محول التاريخ',
  'تحويل التاريخ',
  'تحويل التاريخ الهجري والميلادي',
  'تحويل هجري ميلادي',
  'تحويل ميلادي هجري',
  'هجري لميلادي',
  'ميلادي لهجري',
  'محول التاريخ أم القرى',
  'تحويل التاريخ من هجري إلى ميلادي',
  'تحويل التاريخ من ميلادي إلى هجري',
  'حاسبة تحويل التاريخ',
  'تقويم أم القرى',
  'التاريخ الهجري والميلادي',
  'تحويل تاريخ الميلاد هجري ميلادي',
  'تحويل التاريخ للوثائق والمناسبات',
];

interface SourceLink {
  href: string;
  label: string;
  description: string;
}

interface MethodCard {
  title: string;
  subtitle: string;
  body: string;
  badge: string;
}

interface DecisionRow {
  need: string;
  action: string;
  warning: string;
}

interface UseCase {
  icon: LucideIcon;
  title: string;
  body: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const SOURCE_LINKS: readonly SourceLink[] = [
  {
    href: 'https://www.ummulqura.org.sa/',
    label: 'تقويم أم القرى الرسمي',
    description: 'مرجع سعودي رسمي للتقويم، التحويل، ومواقيت المدن وفق أم القرى.',
  },
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي وإصلاحه وقواعد السنوات الكبيسة.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'يوضح اختلاف أنواع التقويم الإسلامي مثل أم القرى والمدني والجدولي.',
  },
];

const METHOD_CARDS: readonly MethodCard[] = [
  {
    title: 'أم القرى',
    subtitle: 'الأفضل للسياق السعودي والخليجي',
    body: 'ابدأ بها عندما يكون التاريخ مرتبطاً بجهة سعودية، عقد خليجي، شهادة، أو مناسبة يهم فيها المرجع الإداري المستخدم في السعودية.',
    badge: 'مرجع إداري',
  },
  {
    title: 'الرصد الفلكي',
    subtitle: 'للمقارنة مع بلدان تعتمد حسابات أو رؤية محلية',
    body: 'استخدمه عندما تريد فهم سبب فرق يوم واحد بين بلد وآخر، أو عندما تقارن نتيجة أم القرى بمرجع فلكي أوسع.',
    badge: 'مقارنة',
  },
  {
    title: 'مدني / حسابي',
    subtitle: 'نموذج ثابت للبحث والجداول',
    body: 'مفيد للبحث، الأرشفة، والمقارنة المنتظمة، لكنه ليس مرجعاً كافياً وحده للمواعيد الدينية أو الرسمية الحساسة.',
    badge: 'ثابت',
  },
];

const DECISION_ROWS: readonly DecisionRow[] = [
  {
    need: 'لديك تاريخ ميلادي في حجز أو وثيقة',
    action: 'اختر ميلادي إلى هجري، ثم ابدأ بأم القرى إذا كان السياق خليجياً.',
    warning: 'لا تغيّر اتجاه التحويل بعد إدخال التاريخ إلا إذا بدأت من جديد.',
  },
  {
    need: 'لديك تاريخ هجري لمناسبة أو شهادة',
    action: 'اختر هجري إلى ميلادي، واكتب النتيجة مع طريقة الحساب عند المشاركة.',
    warning: 'راجع الشهر جيداً، فخطأ شهر هجري واحد يغيّر النتيجة أسابيع.',
  },
  {
    need: 'ظهر فرق يوم واحد بين مصدرين',
    action: 'قارن الطريقة المستخدمة: أم القرى، فلكي، أو مدني.',
    warning: 'الفرق لا يعني خطأً دائماً، بل قد يعني اختلاف اعتماد بداية الشهر.',
  },
  {
    need: 'موعد ديني أو رسمي',
    action: 'استخدم النتيجة كمرجع سريع، ثم طابقها مع إعلان بلدك أو الجهة صاحبة القرار.',
    warning: 'لا تجعل أداة تحويل عامة بديلاً عن إعلان رسمي في رمضان أو العيد أو المعاملات القانونية.',
  },
];

const USE_CASES: readonly UseCase[] = [
  {
    icon: FileText,
    title: 'وثيقة أو نموذج',
    body: 'حوّل التاريخ كما هو مكتوب في المستند، ثم احتفظ بالصيغة الأصلية والصيغة المحوّلة معاً حتى لا تضيع دلالة التقويم.',
  },
  {
    icon: CalendarCheck,
    title: 'مناسبة عائلية',
    body: 'إذا كان التاريخ هجرياً مثل زواج أو ميلاد، حوّله إلى ميلادي لتثبيته في تطبيقات التقويم والتنبيه.',
  },
  {
    icon: ShieldCheck,
    title: 'موعد رسمي',
    body: 'استخدم التحويل للمراجعة السريعة، ثم اسأل الجهة الرسمية عن طريقة الحساب المقبولة قبل تثبيت الموعد.',
  },
];

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'كيف أحول التاريخ الهجري والميلادي بسرعة؟',
    answer: 'أدخل اليوم والشهر والسنة، اختر اتجاه التحويل، ثم اختر طريقة الحساب واضغط «تحويل التاريخ». إذا بدأت من تاريخ ميلادي فاختر ميلادي إلى هجري، وإذا بدأت من تاريخ هجري فاختر هجري إلى ميلادي.',
  },
  {
    question: 'ما أفضل طريقة حساب أختارها؟',
    answer: 'استخدم أم القرى عندما يكون السياق سعودياً أو خليجياً. استخدم الرصد الفلكي للمقارنة مع بلدان أو مراجع لا تعتمد أم القرى، واستخدم المدني عندما تحتاج نموذجاً حسابياً ثابتاً للبحث والجداول.',
  },
  {
    question: 'لماذا يختلف تحويل التاريخ الهجري يوماً واحداً أحياناً؟',
    answer: 'لأن بداية الشهر الهجري قد تعتمد على تقويم محسوب مسبقاً أو على رؤية الهلال أو إعلان محلي. لذلك قد تتفق النتيجة في معظم الأيام وتختلف عند بداية الشهر أو نهايته.',
  },
  {
    question: 'هل النتيجة مناسبة للقرارات الرسمية والدينية؟',
    answer: 'النتيجة مفيدة وسريعة، لكنها لا تغني عن إعلان الجهة الرسمية عند المواعيد الدينية أو الحكومية الحساسة. استخدمها للفهم والمراجعة، ثم طابق التاريخ مع المصدر الرسمي المختص.',
  },
  {
    question: 'هل يمكن تحويل تاريخ ميلادي قديم جداً أو هجري خارج النطاق؟',
    answer: 'الأداة مصممة للنطاق العملي الحديث: 1924-2077 ميلادي تقريباً، و1343-1500 هجري تقريباً. التواريخ التاريخية الأقدم تحتاج مصادر متخصصة لأن التقويمات وطريقة اعتماد الشهور تختلف عبر الزمن.',
  },
];

export const metadata: Metadata = {
  title: 'محول التاريخ الهجري والميلادي | تحويل فوري مع أم القرى',
  description: 'حوّل التاريخ بين الهجري والميلادي فوراً، واختر أم القرى أو الفلكي أو المدني مع شرح الفرق ومتى تراجع الجهة الرسمية.',
  keywords: PAGE_KEYWORDS.join(', '),
  alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
  openGraph: {
    title: 'محول التاريخ الهجري والميلادي',
    description: 'تحويل فوري بين الهجري والميلادي مع أم القرى والفلكي والمدني وشرح عملي للفرق.',
    url: `${BASE_URL}${PAGE_PATH}`,
    locale: 'ar_SA',
  },
};

export default function ConverterPage() {
  return (
    <Suspense fallback={<DateRouteLoading title="جاري تجهيز محول التاريخ" description="نجهز أداة التحويل وطرق الحساب والمسارات المرتبطة." />}>
      <ConverterDynamicContent />
    </Suspense>
  );
}

async function ConverterDynamicContent() {
  const now = new Date(await getCachedNowIso());
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  let todayHijri: ConvertDateResult | undefined;
  let astronomicalHijri: ConvertDateResult | undefined;
  let civilHijri: ConvertDateResult | undefined;
  try {
    todayHijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
    astronomicalHijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'astronomical' });
    civilHijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'civil' });
  } catch (error) {
    logger.warn('date-converter-today-hijri-conversion-failed', {
      error: serializeError(error),
      date: isoDate,
      method: 'umalqura',
      toCalendar: 'hijri',
    });
  }

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'محول التاريخ' },
  ];

  const toolSchema = buildFreeToolPageSchema({
    siteUrl: BASE_URL,
    path: PAGE_PATH,
    name: 'محول التاريخ الهجري والميلادي',
    description: 'أداة مجانية لتحويل التاريخ بين الهجري والميلادي مع أم القرى والفلكي والمدني وشرح طريقة اختيار المرجع.',
    about: ['تحويل التاريخ', 'التاريخ الهجري', 'التاريخ الميلادي', 'تقويم أم القرى', 'محول هجري ميلادي'],
    keywords: [...PAGE_KEYWORDS],
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'أسئلة محول التاريخ الهجري والميلادي',
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
    name: 'كيفية تحويل التاريخ بين الهجري والميلادي',
    step: [
      { '@type': 'HowToStep', text: 'حدد هل تبدأ من تاريخ ميلادي أم تاريخ هجري.' },
      { '@type': 'HowToStep', text: 'أدخل اليوم والشهر والسنة كما تظهر في المصدر الأصلي.' },
      { '@type': 'HowToStep', text: 'اختر طريقة الحساب المناسبة لبلدك.' },
      { '@type': 'HowToStep', text: 'اضغط تحويل التاريخ ثم راجع النتيجة والتنبيه قبل اعتمادها.' },
    ],
  };

  return (
    <>
      <JsonLd data={[toolSchema, buildBreadcrumbJsonLd(breadcrumb, BASE_URL), faqSchema, howToSchema]} />
      <AdLayoutWrapper>
        <main className={styles.main}>
          <div className="container mx-auto px-4">
            <DateBreadcrumb items={breadcrumb} />
          </div>

          <section className={`container mx-auto px-4 ${styles.heroSection}`} aria-labelledby="converter-title">
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>
                  <ArrowLeftRight size={14} />
                  تحويل هجري وميلادي
                </span>
                <h1 id="converter-title" className={styles.heroTitle}>
                  محول التاريخ الهجري والميلادي
                </h1>
                <p className={styles.heroLead}>
                  حوّل أي تاريخ بين الهجري والميلادي فوراً: اختر الاتجاه، أدخل اليوم والشهر والسنة،
                  ثم حدد طريقة الحساب. إذا كان التاريخ لوثيقة أو موعد ديني أو سفر، استخدم النتيجة
                  كمرجع سريع ثم طابقها مع الجهة الرسمية عند الحاجة.
                </p>
                {todayHijri && (
                  <p className={styles.dateAnswerMeta}>
                    اليوم حسب أم القرى: {todayHijri.formatted.ar}، الموافق <span dir="ltr">{isoDate}</span>م
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-label="أداة تحويل التاريخ">
            <div className={styles.sectionPanel}>
              <Suspense fallback={<DateRouteLoading title="جاري تحميل أداة التحويل" description="نجهز حقول اليوم والشهر والسنة." />}>
                <ConverterForm defaultYear={y} defaultMonth={m} defaultDay={d} />
              </Suspense>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="converter-methods-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="converter-methods-heading" className={styles.sectionTitle}>
                  قبل أن تضغط تحويل: اختر المرجع الصحيح
                </h2>
                <p className={styles.sectionCopy}>
                  أغلب الالتباس في تحويل التاريخ لا يأتي من الأداة، بل من سؤال أبسط: أي تقويم تقصد؟
                  أم القرى؟ إعلان بلدك؟ أم نموذج حسابي للمقارنة؟ هذه القاعدة تختصر عليك إعادة التحويل.
                </p>
              </div>
              <div className={styles.methodGrid}>
                {METHOD_CARDS.map((card, index) => (
                  <article
                    key={card.title}
                    className={`${styles.infoCard} ${index === 0 ? styles.infoCardLead : ''}`}
                  >
                    <div className={styles.methodCardHead}>
                      <div>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <p className={styles.methodSubtitle}>{card.subtitle}</p>
                      </div>
                      <span className="badge badge-accent">{card.badge}</span>
                    </div>
                    <p className={styles.cardBody}>{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={styles.prosePanel}>
              <h2 className={styles.sectionTitle}>كيف يعمل محول التاريخ؟</h2>
              <div className={styles.proseBody}>
                <p>
                  الفكرة بسيطة: التاريخ الميلادي تقويم شمسي، أما الهجري فتقويم قمري. عندما تكتب تاريخاً
                  في أحدهما، يحوّله النظام إلى اليوم المقابل في التقويم الآخر حسب طريقة الحساب التي اخترتها.
                </p>
                <p>
                  مثال سريع: إذا كان لديك تاريخ ميلادي في جواز سفر أو حجز، فلا تحاول تقديره ذهنياً.
                  أدخله كما هو، اختر «ميلادي إلى هجري»، ثم انسخ النتيجة. وإذا كان لديك تاريخ هجري
                  لمناسبة عائلية، اعكس الاتجاه لتحصل على الموعد الميلادي الذي تقبله تطبيقات التقويم.
                </p>
                <p>
                  النطاق العملي المدعوم هنا من 1924 إلى 2077 ميلادي، ومن 1343 إلى 1500 هجري تقريباً.
                  هذا يغطي أغلب الوثائق والمواعيد الحديثة، أما التواريخ التاريخية القديمة فتحتاج مرجعاً متخصصاً.
                </p>
              </div>
              <div className={styles.infoGrid}>
                {USE_CASES.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className={styles.infoCard}>
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
                <h2 className={styles.sectionTitle}>قاعدة القرار: ماذا تفعل بالنتيجة؟</h2>
                <p className={styles.sectionCopy}>
                  لا تعتمد التاريخ المحوّل بالطريقة نفسها في كل موقف. هذه القاعدة تساعدك على اختيار
                  المسار الصحيح قبل أن تنسخ التاريخ وترسله.
                </p>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-right">الموقف</th>
                      <th className="text-right">ما الذي تفعله؟</th>
                      <th className="text-right">تنبيه مهم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DECISION_ROWS.map((row) => (
                      <tr key={row.need}>
                        <td>{row.need}</td>
                        <td>{row.action}</td>
                        <td>{row.warning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {todayHijri && astronomicalHijri && civilHijri && (
            <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="today-methods-heading">
              <div className={styles.sectionPanel}>
                <div className={styles.sectionHead}>
                  <h2 id="today-methods-heading" className={styles.sectionTitle}>
                    مثال حي: تاريخ اليوم حسب الطرق الثلاث
                  </h2>
                  <p className={styles.sectionCopy}>
                    نفس اليوم الميلادي قد يظهر هجرياً بالطريقة نفسها أو بفارق يوم. رؤية المقارنة
                    قبل التحويل تساعدك على فهم ما سيحدث عند التواريخ القريبة من بداية الشهر.
                  </p>
                </div>
                <div className={styles.methodResultGrid}>
                  {[
                    { label: 'أم القرى', result: todayHijri.formatted.ar },
                    { label: 'فلكي', result: astronomicalHijri.formatted.ar },
                    { label: 'مدني', result: civilHijri.formatted.ar },
                  ].map((item) => (
                    <article key={item.label} className={styles.metricCard}>
                      <span className={styles.metricLabel}>{item.label}</span>
                      <strong className={styles.metricValue}>{item.result}</strong>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="converter-faq-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <span className="badge badge-accent">أسئلة شائعة</span>
                <h2 id="converter-faq-heading" className={styles.sectionTitle}>
                  أسئلة قبل اعتماد نتيجة تحويل التاريخ
                </h2>
                <p className={styles.sectionCopy}>
                  هذه الإجابات مكتوبة للمواقف العملية: وثيقة، حجز، مناسبة، أو موعد رسمي.
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

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="converter-sources-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="converter-sources-heading" className={styles.sectionTitle}>
                  مصادر تساعدك على فهم الاختلاف بين التقاويم
                </h2>
                <p className={styles.sectionCopy}>
                  التحويل نفسه يتم داخل الأداة، لكن فهم المرجع مهم عندما تستخدم النتيجة في أمر حساس.
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
            <nav aria-label="مسارات مفيدة بعد تحويل التاريخ" className={styles.sectionPanel} dir="rtl">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>بعد التحويل، اختر خطوة واحدة فقط</h2>
                <p className={styles.sectionCopy}>
                  لا تحتاج إلى فتح كل المسارات. اختر الصفحة التي تطابق سبب سؤالك: عكس التحويل،
                  قراءة تاريخ اليوم، أو فتح التقويم الكامل للتخطيط.
                </p>
              </div>
              <div className={`${styles.linkGrid} mt-5`}>
                <Link href="/date/hijri-to-gregorian" className={`${styles.linkCard} ${styles.linkCardPrimary}`}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <ArrowLeftRight size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>تحويل هجري إلى ميلادي</span>
                  <span className={styles.cardBody}>اختر هذا المسار إذا كانت النتيجة التي أمامك هجرية وتريد نسختها الميلادية للاستخدام في الحجوزات أو النماذج.</span>
                </Link>

                <Link href="/date/gregorian-to-hijri" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <ArrowLeftRight size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>تحويل ميلادي إلى هجري</span>
                  <span className={styles.cardBody}>عندما يبدأ التاريخ من وثيقة أو تقويم ميلادي وتريد المقابل الهجري.</span>
                </Link>

                <Link href="/date/today/hijri" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <CalendarDays size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>التاريخ الهجري اليوم</span>
                  <span className={styles.cardBody}>للإجابة السريعة عندما لا تملك تاريخاً محدداً وتريد تاريخ اليوم فقط.</span>
                </Link>

                <Link href={`/date/calendar/${y}`} className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Calendar size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>تقويم {y}</span>
                  <span className={styles.cardBody}>افتح السنة كاملة عندما يكون الموعد جزءاً من خطة شهرية أو سنوية.</span>
                </Link>
              </div>
            </nav>
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
