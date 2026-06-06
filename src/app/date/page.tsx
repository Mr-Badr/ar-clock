import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate, type ConvertDateResult } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { ArrowLeftRight, Calendar, CalendarDays, Globe2, Moon } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { appendToolDiscoveryLinks } from '@/lib/seo/discovery-links';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { logger, serializeError } from '@/lib/logger';
import styles from './DateRoutePage.module.css';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'تاريخ اليوم هجري وميلادي | محول التاريخ والتقويم',
  description:
    'اعرف تاريخ اليوم بالهجري والميلادي فوراً، ثم اختر محول التاريخ أو التقويم السنوي أو صفحة الدولة مع شرح متى قد يختلف التاريخ الهجري يوماً واحداً.',
  keywords: buildDateKeywords(),
  alternates: { canonical: `${BASE_URL}/date` },
  openGraph: {
    title: 'تاريخ اليوم هجري وميلادي',
    description: 'تاريخ اليوم، محول التاريخ، التقويم الهجري والميلادي، وقاعدة اختيار المسار الصحيح في صفحة عربية واحدة.',
    url: `${BASE_URL}/date`,
    locale: 'ar_SA',
  },
};

const GREGORIAN_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const HUB_FAQ_ITEMS = [
  {
    question: 'كم تاريخ اليوم بالهجري؟',
    answer: 'تاريخ اليوم بالهجري يظهر هنا وفق تقويم أم القرى عندما تكون النتيجة ضمن النطاق المدعوم. إذا كان التاريخ مرتبطاً بصوم أو عيد أو وثيقة رسمية، فراجع أيضاً صفحة الدولة أو الجهة المحلية لأن بداية الشهر الهجري قد تختلف يوماً واحداً.',
  },
  {
    question: 'كيف أحول تاريخاً من ميلادي إلى هجري؟',
    answer: 'يمكنك تحويل أي تاريخ من ميلادي إلى هجري عبر أداة محول التاريخ في هذا القسم. اختر نوع التحويل وأدخل التاريخ المطلوب ثم ستظهر لك النتيجة مباشرة مع أكثر من طريقة حساب.',
  },
  {
    question: 'ما الفرق بين تقويم أم القرى والحساب الفلكي؟',
    answer: 'تقويم أم القرى مرجع إداري مستخدم في السعودية، بينما قد تعتمد جهات وبلدان أخرى طريقة فلكية أو إعلاناً محلياً لبداية الشهر. اختلاف المرجع قد يؤدي إلى فرق يوم واحد في بعض التواريخ الهجرية، خصوصاً عند بداية الشهر ونهايته.',
  },
  {
    question: 'هل يختلف التاريخ الهجري بين الدول العربية؟',
    answer: 'نعم، قد يختلف التاريخ الهجري بين الدول العربية بحسب الجهة الرسمية وطريقة الإثبات المعتمدة. لهذا نوفر صفحات للتحويل والتقويم حتى تتمكن من المقارنة والوصول إلى التاريخ المناسب لبلدك.',
  },
  {
    question: 'متى أستخدم محول التاريخ بدلاً من تاريخ اليوم؟',
    answer: 'استخدم تاريخ اليوم عندما تريد معرفة اليوم الحالي فقط. استخدم محول التاريخ عندما يكون لديك تاريخ محدد من وثيقة، حجز، دعوة، أو مناسبة وتحتاج مقابله في التقويم الآخر.',
  },
  {
    question: 'هل أكتب التاريخ الهجري أم الميلادي في موعد مهم؟',
    answer: 'اكتب التاريخين معاً عندما يكون الموعد مهماً: الميلادي لأنه التقويم المدني الأكثر استخداماً في النماذج والسفر والعمل، والهجري عندما يكون الموعد دينياً أو محلياً أو مرتبطاً بتقويم دولة عربية.',
  },
];

const DATE_SOURCE_LINKS = [
  {
    href: 'https://react-spectrum.adobe.com/internationalized/date/index.html',
    label: '@internationalized/date',
    description: 'المكتبة التي تُدار بها تحويلات التقويم في المشروع، مع دعم تقاويم متعددة بطريقة منظمة.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'مرجع يوضح وجود أكثر من نوع للتقويم الإسلامي، مثل أم القرى والمدني والجدولي.',
  },
  {
    href: 'https://hijridate.readthedocs.io/en/stable/background.html',
    label: 'خلفية تقويم أم القرى',
    description: 'شرح تاريخي مختصر لاستخدام تقويم أم القرى في السعودية للأغراض الإدارية.',
  },
  {
    href: 'https://www.britannica.com/science/calendar/The-Gregorian-calendar',
    label: 'Britannica: التقويم الغريغوري',
    description: 'مرجع عام لفهم التقويم الميلادي وقواعد السنوات الكبيسة وإصلاح التقويم الغريغوري.',
  },
];

async function getDateHubNow(): Promise<Date> {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return now;
  } catch (error) {
    logger.warn('date-hub-current-date-fallback-used', {
      routePath: '/date',
      error: serializeError(error),
    });
    return new Date();
  }
}

export default function DateHubPage() {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          kind="hub"
          title="جاري تحميل مركز التاريخ"
          description="نجهز لك تاريخ اليوم وأدوات التحويل ومسارات التقاويم الان."
        />
      )}
    >
      <DateHubDynamicContent />
    </Suspense>
  );
}

async function DateHubDynamicContent() {
  const now = await getDateHubNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES[now.getUTCDay()];
  const monthAr = GREGORIAN_MONTHS[m - 1];

  let hijri: ConvertDateResult | undefined;
  try {
    hijri = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' });
  } catch (error) {
    logger.warn('date-hub-hijri-conversion-failed', {
      error: serializeError(error),
      date: iso,
      method: 'umalqura',
      toCalendar: 'hijri',
    });
  }

  const eventsResult = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];
  const events = Array.isArray(eventsResult) ? eventsResult : [];

  const breadcrumb = [{ label: 'الرئيسية', href: '/' }, { label: 'التاريخ' }];
  const toolLinks = [
    { href: '/date/converter', label: 'محول التاريخ', description: 'حوّل تاريخاً محدداً بين الهجري والميلادي، وقارن النتيجة بين أم القرى والحساب الفلكي والمدني عند الحاجة.', icon: ArrowLeftRight, primary: true },
    { href: '/date/today/hijri', label: 'التاريخ الهجري اليوم', description: 'ابدأ هنا عندما تريد معرفة اليوم الهجري الحالي، الشهر، والمناسبة القريبة دون إدخال تاريخ يدوي.', icon: Moon },
    { href: '/date/today/gregorian', label: 'التاريخ الميلادي اليوم', description: 'راجع تاريخ اليوم الميلادي، رقم الأسبوع، اليوم من السنة، وما تبقى حتى نهاية العام.', icon: CalendarDays },
    { href: '/date/gregorian-to-hijri', label: 'ميلادي إلى هجري', description: 'استخدمه عندما يكون المصدر فاتورة، وثيقة، حجز سفر، أو تاريخاً مكتوباً بصيغة ميلادية.', icon: ArrowLeftRight },
    { href: '/date/hijri-to-gregorian', label: 'هجري إلى ميلادي', description: 'استخدمه عندما تبدأ من مناسبة هجرية وتريد إضافتها إلى تقويم ميلادي أو مشاركتها مع جهة تعتمد الميلادي.', icon: ArrowLeftRight },
    { href: `/date/calendar/${y}`, label: `تقويم ${y}`, description: `التقويم الميلادي الكامل لعام ${y} مع المقابل الهجري.`, icon: Calendar },
    { href: `/date/calendar/hijri/${hijri?.year ?? 1447}`, label: `تقويم ${hijri?.year ?? 1447} هـ`, description: 'افتح السنة الهجرية كاملة عندما تريد رؤية الشهور والمناسبات بدل التركيز على يوم واحد فقط.', icon: CalendarDays },
    { href: '/date/country', label: 'التاريخ حسب الدولة', description: 'راجع التاريخ من زاوية بلدك عندما يهمك السياق المحلي أو احتمال اختلاف بداية الشهر الهجري.', icon: Globe2 },
  ];
  const dateUtilityLinks = appendToolDiscoveryLinks([
    {
      href: '/time-now',
      label: 'الوقت الان',
      description: 'اعرف الساعة الحالية في المدن والدول المرتبطة بتاريخ اليوم.',
    },
    {
      href: '/mwaqit-al-salat',
      label: 'مواقيت الصلاة اليوم',
      description: 'انتقل إلى مواقيت الصلاة اليومية من نفس بنية الوقت والتاريخ.',
    },
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: 'قارن الوقت بين الدول والمدن عند التخطيط للتواريخ والسفر والعمل.',
    },
    {
      href: '/holidays',
      label: 'المناسبات القادمة',
      description: 'استكشف المناسبات والإجازات القادمة المرتبطة بالتاريخ الهجري والميلادي.',
    },
  ]).slice(0, 8);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'مركز التاريخ الهجري والميلادي',
    description: 'تاريخ اليوم الهجري والميلادي مع محول تاريخ وتقاويم سنوية وصفحات دولة توضّح متى قد تختلف نتيجة التاريخ الهجري.',
    url: `${BASE_URL}/date`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أدوات التاريخ الهجري والميلادي',
    url: `${BASE_URL}/date`,
    description: 'مجموعة أدوات وصفحات التاريخ في ميقاتنا: تاريخ اليوم، محول التاريخ، التقاويم، والتاريخ حسب الدولة.',
    inLanguage: 'ar',
  };
  const toolsItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أدوات التاريخ الأساسية',
    itemListElement: toolLinks.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.label,
      url: `${BASE_URL}${tool.href}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HUB_FAQ_ITEMS.map((item, index) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: index === 0 && hijri
          ? `تاريخ اليوم بالهجري هو ${hijri.formatted.ar} وفق تقويم أم القرى.`
          : item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={collectionSchema} />
      <JsonLd data={toolsItemListSchema} />
      <JsonLd data={faqSchema} />
      <AdLayoutWrapper>
        <main className={`${styles.main} ${styles.dateHubMain}`}>
          <div className="container mx-auto px-4">
            <DateBreadcrumb items={breadcrumb} />
          </div>

          <section className={`container mx-auto px-4 ${styles.heroSection}`} aria-labelledby="date-hub-title">
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>
                  <CalendarDays size={14} />
                  تاريخ اليوم وأدوات التحويل
                </span>
                <h1 id="date-hub-title" className={styles.heroTitle}>
                  كم التاريخ اليوم؟ الهجري والميلادي في مكان واحد
                </h1>
                <p className={styles.heroLead}>
                  تاريخ اليوم يظهر لك بالهجري والميلادي أولاً، ثم تختار ما تحتاجه: تحويل تاريخ
                  محدد، فتح تقويم سنة كاملة، أو مراجعة تاريخ بلدك إذا كان اختلاف بداية الشهر
                  الهجري يهم قرارك.
                </p>
              </div>

              <section className={styles.dateAnswerPanel} aria-label="تاريخ اليوم">
                <div className={styles.dateAnswerHeader}>
                  <h2 className={styles.dateAnswerTitle}>تاريخ اليوم، {dayOfWeek}</h2>
                  <span className={styles.dateAnswerMeta}>{d} {monthAr} {y}م</span>
                </div>

                <div className={styles.dualDateGrid}>
                  <div className={styles.dateCard}>
                    <p className={styles.dateCardLabel}>
                      <Moon size={15} />
                      التاريخ الهجري (أم القرى)
                    </p>
                    {hijri ? (
                      <>
                        <p className={styles.dateDay}>{hijri.day}</p>
                        <p className={styles.dateMonth}>{hijri.monthNameAr}</p>
                        <p className={styles.dateYear}>{hijri.year} هـ</p>
                        {events.length > 0 && (
                          <span className="badge badge-success text-sm px-4 py-2">
                            {events.map(e => e.nameAr).join(' • ')}
                          </span>
                        )}
                      </>
                    ) : <p className={styles.cardBody}>خارج النطاق المدعوم</p>}
                    <Link href="/date/today/hijri" className={styles.dateAction}>
                      تفاصيل التاريخ الهجري
                    </Link>
                  </div>

                  <div className={`${styles.dateCard} ${styles.dateCardMuted}`}>
                    <p className={styles.dateCardLabel}>
                      <CalendarDays size={15} />
                      التاريخ الميلادي
                    </p>
                    <p className={styles.dateDay}>{d}</p>
                    <p className={styles.dateMonth}>{monthAr}</p>
                    <p className={styles.dateYear}>{y}م</p>
                    <Link
                      href={`/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`}
                      className={styles.dateAction}
                    >
                      صفحة {d} {monthAr} {y}
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="date-tools-heading">
            <div className={`${styles.sectionPanel} ${styles.decisionPanel}`}>
              <div className={styles.decisionHero}>
                <div className={styles.decisionHeroCopy}>
                  <span className={styles.sectionKicker}>المسار الأسرع بعد النتيجة</span>
                  <h2 id="date-tools-heading" className={styles.sectionTitle}>حوّل التاريخ أو افتح الصفحة المناسبة بدون تشتيت</h2>
                  <p className={styles.sectionCopy}>
                    لو كان سؤالك عن اليوم، فالنتيجة أمامك. لو عندك تاريخ من وثيقة أو دعوة أو حجز، فمحول التاريخ هو الطريق الصحيح. ولو الموعد رسمي أو ديني، راجع البلد أو التقويم الكامل قبل أن تعتمد النتيجة.
                  </p>
                  <div className={styles.decisionActions}>
                    <Link href="/date/converter" className={styles.primaryAction}>
                      افتح محول التاريخ
                    </Link>
                    <Link href="/date/country" className={styles.secondaryAction}>
                      التاريخ حسب الدولة
                    </Link>
                  </div>
                </div>

                <nav className={styles.pathList} aria-label="مسارات التاريخ الأساسية">
                  {[
                    { href: '/date/today/hijri', label: 'التاريخ الهجري اليوم', description: 'للشهر الهجري الحالي والمناسبة القريبة من اليوم.' },
                    { href: '/date/today/gregorian', label: 'التاريخ الميلادي اليوم', description: 'لرقم اليوم والأسبوع وتفاصيل السنة الميلادية.' },
                    { href: '/date/gregorian-to-hijri', label: 'ميلادي إلى هجري', description: 'عندما يبدأ التاريخ من فاتورة أو حجز أو نموذج مدني.' },
                    { href: '/date/hijri-to-gregorian', label: 'هجري إلى ميلادي', description: 'عندما تبدأ من مناسبة هجرية وتحتاج التاريخ الميلادي.' },
                  ].map((tool, index) => (
                    <Link key={tool.href} href={tool.href} className={styles.pathItem}>
                      <span className={styles.pathIndex}>{String(index + 1).padStart(2, '0')}</span>
                      <span className={styles.pathText}>
                        <span className={styles.cardTitle}>{tool.label}</span>
                        <span className={styles.cardBody}>{tool.description}</span>
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className={styles.quickDateRail} aria-labelledby="popular-date-links-heading">
                <div className={styles.quickDateHead}>
                  <span className={styles.sectionKicker}>اختصارات جاهزة</span>
                  <h3 id="popular-date-links-heading" className={styles.quickDateTitle}>لما تعرف اليوم أو السنة</h3>
                </div>
                <div className={styles.pillRow}>
                  {[
                    { label: 'اليوم', href: '/date/today' },
                    { label: `${d} ${monthAr} ${y}م`, href: `/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}` },
                    ...(hijri ? [
                      { label: `${hijri.day} ${hijri.monthNameAr} ${hijri.year} هـ`, href: `/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}` },
                      { label: `1 رمضان ${hijri.year}`, href: `/date/hijri/${hijri.year}/09/01` },
                      { label: `1 محرم ${hijri.year + 1}`, href: `/date/hijri/${hijri.year + 1}/01/01` },
                      { label: `تقويم ${hijri.year} هـ`, href: `/date/calendar/hijri/${hijri.year}` },
                    ] : []),
                    { label: `تقويم ${y}م`, href: `/date/calendar/${y}` },
                  ].map(({ label, href }) => (
                    <Link key={href} href={href} className={styles.pillLink}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="date-method-heading">
            <div className={`${styles.sectionPanel} ${styles.editorialPanel}`}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionKicker}>اقرأ النتيجة بوعي</span>
                <h2 id="date-method-heading" className={styles.sectionTitle}>
                  متى تكفي نتيجة التاريخ؟ ومتى تحتاج تحققاً إضافياً؟
                </h2>
                <p className={styles.sectionCopy}>
                  التاريخ ليس مجرد رقمين في بطاقة. طريقة الحساب والسياق المحلي يحددان هل النتيجة مناسبة للاستخدام اليومي أم تحتاج مقارنة قبل موعد مهم.
                </p>
              </div>
              <div className={styles.learningStack}>
                {[
                  {
                    title: 'اليوم الهجري يتحرك مع القمر',
                    body: 'السنة الهجرية أقصر من السنة الميلادية، لذلك تنتقل أشهر مثل رمضان وذو الحجة بين الفصول. استخدم النتيجة اليومية للمعرفة السريعة، وراجع بلدك عند القرارات الدينية أو الرسمية.',
                  },
                  {
                    title: 'التحويل الجيد يوضح طريقة الحساب',
                    body: 'عند تحويل تاريخ محدد، قارن أم القرى والحساب الفلكي والمدني. إذا اختلفت النتيجة يوماً واحداً، اذكر الطريقة ولا ترسل التاريخ كأنه نتيجة مطلقة.',
                  },
                  {
                    title: 'التقويم الكامل أفضل من تحويل يوم منفرد',
                    body: 'إذا كنت تخطط لشهر أو موسم، افتح التقويم السنوي لترى بدايات الأسابيع ونهايات الشهور والمناسبات القريبة من موعدك.',
                  },
                  {
                    title: 'صفحة الدولة مهمة عند السياق المحلي',
                    body: 'بعض الدول تعتمد إعلاناً رسمياً أو طريقة حساب محلية. لهذا تكون صفحة الدولة أوضح من نتيجة عامة عندما يتعلق الأمر بموعد رسمي أو مناسبة دينية.',
                  },
                ].map((item, index) => (
                  <article key={item.title} className={styles.learningRow}>
                    <span className={styles.pathIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardBody}>{item.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="date-decision-heading">
            <div className={`${styles.sectionPanel} ${styles.rulePanel}`}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionKicker}>قاعدة قرار</span>
                <h2 id="date-decision-heading" className={styles.sectionTitle}>قاعدة سريعة قبل اعتماد التاريخ</h2>
                <p className={styles.sectionCopy}>
                  كثير من الالتباس لا يأتي من التحويل نفسه، بل من استخدام النتيجة في المكان الخطأ.
                  اتبع هذه القاعدة قبل إرسال موعد أو تعبئة نموذج أو التخطيط لمناسبة.
                </p>
              </div>
              <div className={styles.ruleGrid}>
                {[
                  {
                    title: 'للاستخدام اليومي',
                    body: 'استخدم تاريخ اليوم المعروض في أعلى الصفحة. يكفي لمعرفة اليوم، الشهر، والسنة ومشاركة التاريخ بسرعة.',
                  },
                  {
                    title: 'للوثائق والحجوزات',
                    body: 'استخدم محول التاريخ واكتب التقويمين معاً. لا تعتمد على ذاكرة تقريبية مثل "منتصف رمضان" أو "أول الشهر" عند وجود موعد رسمي.',
                  },
                  {
                    title: 'للمناسبات الدينية',
                    body: 'راجع صفحة الدولة أو الجهة المحلية، لأن بداية الشهر الهجري قد تُثبت بالرؤية أو بإعلان رسمي يختلف عن الحساب العام.',
                  },
                  {
                    title: 'للتخطيط السنوي',
                    body: 'افتح التقويم السنوي حتى ترى الأسابيع وبدايات الشهور والمناسبات القريبة، بدلاً من تحويل يوم واحد ثم محاولة تخمين ما حوله.',
                  },
                ].map((card, index) => (
                  <article
                    key={card.title}
                    className={styles.ruleItem}
                  >
                    <span className={styles.pathIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardBody}>{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="date-sources-heading">
            <div className={`${styles.sectionPanel} ${styles.sourcesPanel}`}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionKicker}>منهج واضح</span>
                <h2 id="date-sources-heading" className={styles.sectionTitle}>مصادر ومنهج التاريخ</h2>
                <p className={styles.sectionCopy}>
                  نعرض التاريخ بسرعة، لكننا لا نخفي المنهج: التحويلات مبنية على مكتبة تقويمات واضحة،
                  ونوضح لك لماذا قد تظهر فروق بين أم القرى والحسابات الأخرى.
                </p>
              </div>
              <div className={styles.sourceList}>
                {DATE_SOURCE_LINKS.map((source, index) => (
                  <a
                    key={source.href}
                    href={source.href}
                    className={`${styles.sourceLink} ${index === 0 ? styles.sourceLinkPrimary : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.cardTitle}>{source.label}</span>
                    <span className={styles.cardBody}>{source.description}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="date-faq-heading">
            <div className={`${styles.sectionPanel} ${styles.faqPanel}`}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionKicker}>أسئلة سريعة</span>
                <h2 id="date-faq-heading" className={styles.sectionTitle}>قبل الاعتماد على تاريخ أو تحويله</h2>
                <p className={styles.sectionCopy}>
                  إجابات مختصرة تكفي أغلب الحالات، مع إبقاء التفاصيل قابلة للفتح لمن يريد التأكد أكثر.
                </p>
              </div>
              <div className={styles.faqList}>
                {HUB_FAQ_ITEMS.map((item, index) => (
                  <details key={item.question} className={styles.faqDisclosure} open={index < 2}>
                    <summary className={styles.faqQuestion}>{item.question}</summary>
                    <p className={styles.cardBody}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={`${styles.sectionPanel} ${styles.utilityPanel}`}>
              <div className={styles.utilityHead}>
                <span className={styles.sectionKicker}>بعد التاريخ</span>
                <h2 className={styles.sectionTitle}>خطوتك التالية حسب ما تريد فعله الان</h2>
                <p className={styles.sectionCopy}>
                  إذا كان التاريخ مرتبطاً بموعد يومي، فافتح الوقت الان أو مواقيت الصلاة. وإذا كان مرتبطاً بسفر أو مناسبة، ففرق التوقيت والمناسبات القادمة هما المساران الأكثر فائدة.
                </p>
              </div>
              <nav className={styles.utilityGrid} aria-label="خطوات مفيدة بعد استخدام قسم التاريخ">
                {dateUtilityLinks.map((link, index) => {
                  const tags = ['وقت', 'صلاة', 'تخطيط', 'مناسبات', 'أداة', 'دليل', 'مسار', 'بحث'];
                  return (
                    <Link key={link.href} href={link.href} className={styles.utilityCard}>
                      <span className={`${styles.utilityTag} ${styles[`utilityTag${(index % 4) + 1}`]}`}>
                        {tags[index] ?? 'مسار'}
                      </span>
                      <span className={styles.cardTitle}>{link.label}</span>
                      {link.description ? <span className={styles.cardBody}>{link.description}</span> : null}
                      <span className={styles.utilityAction}>افتح المسار</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
