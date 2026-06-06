// src/app/date/today/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, DAY_NAMES_AR } from '@/lib/constants';
import { isSacredMonth, isRamadan as checkRamadan, getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateShareActions } from '@/components/date/DateShareActions';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import {
  DateEditorialSections,
  buildDateFaqJsonLd,
  type DateFaqItem,
  type DateInsightItem,
} from '@/components/date/DateEditorialSections';
import TodayClientHydration from './TodayClientHydration'; // Force TS Server refresh
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Moon, CalendarDays, ArrowLeftRight } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { logger, serializeError } from '@/lib/logger';
import styles from '../DateRoutePage.module.css';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'تاريخ اليوم هجري وميلادي | رقم الأسبوع واليوم من السنة',
  description: 'اعرف تاريخ اليوم بالهجري والميلادي، رقم الأسبوع، اليوم من السنة، وما الذي تفعله إذا اختلف التاريخ الهجري أو توقيتك المحلي عن النتيجة العامة.',
  keywords: buildDateKeywords(),
  alternates: { canonical: `${BASE_URL}/date/today` },
  openGraph: {
    title: 'تاريخ اليوم هجري وميلادي',
    description: 'تاريخ اليوم مع رقم الأسبوع واليوم من السنة ومقارنة طرق الحساب الهجري.',
    url: `${BASE_URL}/date/today`,
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تاريخ اليوم هجري وميلادي',
    description: 'اعرف تاريخ اليوم بالهجري والميلادي مع رقم الأسبوع ومقارنة طرق الحساب.',
  },
};

const TODAY_SOURCE_LINKS = [
  {
    href: 'https://react-spectrum.adobe.com/internationalized/date/index.html',
    label: '@internationalized/date',
    description: 'مرجع مكتبة تحويل التقويمات المستخدمة في صفحات التاريخ داخل المشروع.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: التقويمات الإسلامية',
    description: 'يوضح تعدد أنواع التقويم الإسلامي مثل أم القرى والمدني والجدولي، وهو سبب شائع لاختلاف يوم واحد.',
  },
  {
    href: 'https://www.timeanddate.com/date/weeknumber.html',
    label: 'Timeanddate: رقم الأسبوع',
    description: 'مرجع مبسط لفهم رقم الأسبوع وكيف تُقرأ الأسابيع داخل السنة الميلادية.',
  },
  {
    href: 'https://www.britannica.com/science/calendar/The-Gregorian-calendar',
    label: 'Britannica: التقويم الغريغوري',
    description: 'مرجع عام لفهم التقويم الميلادي وقاعدة السنوات الكبيسة.',
  },
];



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

async function getTodayNow(): Promise<Date> {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return now;
  } catch (error) {
    logger.warn('date-today-current-date-fallback-used', {
      routePath: '/date/today',
      error: serializeError(error),
    });
    return new Date();
  }
}

export default function TodayPage() {
  return (
    <Suspense fallback={<DateRouteLoading title="جاري تجهيز تاريخ اليوم" description="نجهز التاريخ الهجري والميلادي ومقارنة طرق الحساب." />}>
      <TodayDynamicContent />
    </Suspense>
  );
}

async function TodayDynamicContent() {
  const now = await getTodayNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const dayOfWeek = DAY_NAMES_AR[now.getUTCDay()];
  const weekNum = getWeekNumber(now);
  const dayOfYear = getDayOfYear(now);
  const daysInYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  const daysLeft = daysInYear - dayOfYear;
  const gregorianFormatted = `${d} ${GREGORIAN_MONTHS_AR[m - 1]} ${y}`;

  let umalqura, astronomical, civil;
  try {
    umalqura = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
    astronomical = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'astronomical' });
    civil = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'civil' });
  } catch (error) {
    logger.warn('date-today-conversion-failed', {
      date: isoDate,
      methods: ['umalqura', 'astronomical', 'civil'],
      error: serializeError(error),
    });
  }

  const hijri = umalqura;
  const isRamadan = hijri ? checkRamadan(hijri.month) : false;
  const isSacred = hijri ? isSacredMonth(hijri.month) : false;
  const islamicEventsResult = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];
  const islamicEvents = Array.isArray(islamicEventsResult) ? islamicEventsResult : [];

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'اليوم' },
  ];

  const faqItems: DateFaqItem[] = [
    {
      question: 'كم تاريخ اليوم بالهجري والميلادي؟',
      answer: hijri
        ? `تاريخ اليوم هو ${gregorianFormatted} ميلادي، ويوافق ${hijri.formatted.ar} وفق تقويم أم القرى.`
        : `تاريخ اليوم الميلادي هو ${gregorianFormatted}، ويمكن استخدام محول التاريخ لمعرفة المقابل الهجري عند توفر النطاق المدعوم.`,
    },
    {
      question: 'لماذا قد يختلف التاريخ الهجري عن تطبيق آخر؟',
      answer: 'الاختلاف غالباً لا يعني وجود خطأ، بل اختلاف طريقة إثبات بداية الشهر الهجري. بعض الجهات تعتمد تقويم أم القرى، وبعضها يعتمد الرؤية أو الحساب الفلكي، لذلك قد يظهر فرق يوم واحد.',
    },
    {
      question: 'ما الفرق بين صفحة اليوم وصفحة التحويل؟',
      answer: 'صفحة اليوم تعرض التاريخ الحالي فوراً مع معلومات الأسبوع والسنة. أما صفحة التحويل فهي مخصصة لإدخال أي تاريخ قديم أو مستقبلي ومقارنة نتيجته بين الطرق المختلفة.',
    },
    {
      question: 'هل يمكن الاعتماد على هذه الصفحة للتخطيط اليومي؟',
      answer: 'نعم، الصفحة مناسبة لمعرفة التاريخ اليومي، المشاركة، والتخطيط العام. أما القرارات الرسمية المتعلقة ببداية رمضان أو الأعياد فيجب مطابقتها مع إعلان الجهة الرسمية في بلدك.',
    },
    {
      question: 'لماذا قد يظهر تنبيه أن تاريخي المحلي مختلف؟',
      answer: 'الصفحة تُرندر تاريخاً عاماً من الخادم حتى يكون المحتوى واضحاً لمحركات البحث، ثم يفحص المتصفح تاريخ جهازك. إذا كنت في منطقة زمنية دخلت يوماً جديداً قبل الخادم أو بعده، يظهر التنبيه حتى لا تعتمد على يوم غير يومك المحلي.',
    },
    {
      question: 'متى أحتاج صفحة الدولة بدلاً من تاريخ اليوم العام؟',
      answer: 'استخدم صفحة الدولة عندما يكون التاريخ مرتبطاً بإعلان محلي أو عطلة أو بداية شهر هجري. صفحة اليوم تكفي للسؤال العام، لكن صفحة الدولة أو الجهة الرسمية أوضح عند القرارات المحلية.',
    },
    {
      question: 'ما فائدة رقم الأسبوع واليوم من السنة؟',
      answer: 'رقم الأسبوع مفيد في الجداول الدراسية والعمل والتقارير، واليوم من السنة يساعدك على فهم موقع اليوم داخل السنة وما تبقى منها دون فتح تقويم كامل.',
    },
  ];

  const insights: DateInsightItem[] = [
    {
      badge: 'جواب سريع',
      title: 'التاريخان في بطاقة واحدة',
      body: 'يعرض القسم الأول التاريخ الهجري والميلادي معاً، ثم يضع بجانبهما اليوم من الأسبوع. بهذه الطريقة تعرف الإجابة التي جئت من أجلها قبل أن تدخل في تفاصيل التحويل أو التقويم.',
      tone: 'accent',
    },
    {
      badge: 'فهم الاختلاف',
      title: 'مقارنة الطرق تمنع سوء الفهم',
      body: 'وجود أم القرى والفلكي والمدني في نفس الصفحة يوضح لماذا قد ترى تاريخاً هجرياً مختلفاً في بلد آخر أو تطبيق آخر.',
      tone: 'warning',
    },
    {
      badge: 'استخدام يومي',
      title: 'مناسب للنسخ والمشاركة والتخطيط',
      body: 'معلومات اليوم من السنة ورقم الأسبوع والأيام المتبقية تساعدك في الدراسة والعمل والسفر. هي مفيدة عندما تريد كتابة موعد واضح، لا مجرد معرفة رقم اليوم في الشهر.',
      tone: 'success',
    },
    {
      badge: 'تنبيه الوقت',
      title: 'تاريخك المحلي قد يسبق التاريخ العام',
      body: 'إذا كنت قرب منتصف الليل أو في بلد بعيد زمنياً، قد يختلف تاريخ جهازك عن التاريخ المعروض من الخادم. التنبيه المحلي يمنع الاعتماد على يوم غير يومك.',
      tone: 'info',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'تاريخ اليوم',
    description: 'تاريخ اليوم الهجري والميلادي مع رقم الأسبوع واليوم من السنة ومقارنة طرق الحساب الهجري.',
    url: `${BASE_URL}/date/today`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumbItems, BASE_URL),
  };

  return (
    <>
      <TodayClientHydration serverDate={isoDate} />
      <JsonLd
        data={[
          jsonLd,
          buildDateFaqJsonLd({
            pageName: 'أسئلة تاريخ اليوم',
            items: faqItems,
          }),
        ]}
      />

      <AdLayoutWrapper>
        <main className={styles.main}>
          <div className="container mx-auto px-4">
            <DateBreadcrumb items={breadcrumbItems} />
          </div>

          <section className={`container mx-auto px-4 ${styles.heroSection}`} aria-labelledby="today-title">
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>
                  <CalendarDays size={14} />
                  جواب مباشر لتاريخ اليوم
                </span>
                <h1 id="today-title" className={styles.heroTitle}>
                  كم تاريخ اليوم بالهجري والميلادي؟
                </h1>
                <p className={styles.heroLead}>
                  تاريخ اليوم هو {gregorianFormatted} ميلادي. في البطاقة ستجد المقابل الهجري
                  وفق أم القرى، ثم رقم الأسبوع واليوم من السنة، مع توضيح ماذا تفعل إذا اختلف
                  التاريخ الهجري أو كان توقيتك المحلي في يوم آخر.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/date/converter" className={styles.primaryAction}>
                    <ArrowLeftRight size={16} />
                    تحويل تاريخ آخر
                  </Link>
                  <Link href="/date/today/hijri" className={styles.secondaryAction}>
                    <Moon size={16} />
                    تفاصيل الهجري اليوم
                  </Link>
                </div>
              </div>

              <section className={styles.dateAnswerPanel} aria-label="التاريخ الحالي">
                <div className={styles.dateAnswerHeader}>
                  <h2 className={styles.dateAnswerTitle}>تاريخ اليوم، {dayOfWeek}</h2>
                  <span className={styles.dateAnswerMeta}>{gregorianFormatted}</span>
                </div>

                <div className={styles.dualDateGrid}>
                  <div className={styles.dateCard}>
                    <p className={styles.dateCardLabel}>
                      <Moon size={15} />
                      التاريخ الهجري
                    </p>
                    {hijri ? (
                      <>
                        <p className={styles.dateDay}>{hijri.day}</p>
                        <p className={styles.dateMonth}>{hijri.monthNameAr}</p>
                        <p className={styles.dateYear}>{hijri.year} هـ</p>

                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          {isRamadan && (
                            <span className="bg-warning-soft text-warning px-3 py-1 rounded-[var(--radius-md)] text-xs font-semibold">
                              شهر رمضان المبارك
                            </span>
                          )}
                          {isSacred && !isRamadan && (
                            <span className="bg-accent-soft text-accent-alt px-3 py-1 rounded-[var(--radius-md)] text-xs font-semibold">
                              شهر حرام
                            </span>
                          )}
                          {islamicEvents.length > 0 && (
                            <span className="bg-success-soft text-success px-3 py-1 rounded-[var(--radius-md)] text-xs font-semibold">
                              {islamicEvents.map(e => e.nameAr).join('، ')}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className={styles.cardBody}>خارج النطاق المدعوم</p>
                    )}
                  </div>

                  <div className={`${styles.dateCard} ${styles.dateCardMuted}`}>
                    <p className={styles.dateCardLabel}>
                      <CalendarDays size={15} />
                      التاريخ الميلادي
                    </p>
                    <p className={styles.dateDay}>{d}</p>
                    <p className={styles.dateMonth}>{GREGORIAN_MONTHS_AR[m - 1]}</p>
                    <p className={styles.dateYear}>{y}م</p>
                  </div>
                </div>

                <div className={styles.sharePanel}>
                  <DateShareActions
                    hijriFormatted={hijri ? hijri.formatted.ar : ''}
                    gregorianFormatted={gregorianFormatted}
                    hijriIso={hijri ? hijri.formatted.iso : ''}
                    gregorianIso={isoDate}
                    pageUrl={`${BASE_URL}/date/today`}
                  />
                </div>
              </section>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-label="مؤشرات تاريخ اليوم">
            <div className={styles.metricGrid}>
            {[
              { label: 'اليوم من السنة', value: `${dayOfYear} / ${daysInYear}` },
              { label: 'رقم الأسبوع', value: `الأسبوع ${weekNum}` },
              { label: 'تبقى حتى نهاية السنة', value: `${daysLeft} يوم` },
              { label: 'اليوم اليولياني', value: hijri ? Math.floor(hijri.julianDay).toLocaleString('en') : 'غير متاح' },
            ].map((fact, i) => (
              <div
                key={i}
                className={styles.metricCard}
              >
                <div className={styles.metricValue}>
                  {fact.value}
                </div>
                <div className={styles.metricLabel}>
                  {fact.label}
                </div>
              </div>
            ))}
            </div>
          </section>

          {umalqura && astronomical && civil && (
            <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="date-methods-heading">
              <div className={styles.sectionPanel}>
                <div className={styles.sectionHead}>
                  <h2 id="date-methods-heading" className={styles.sectionTitle}>
                    مقارنة طرق الحساب الثلاثة
                  </h2>
                  <p className={styles.sectionCopy}>
                    هذه المقارنة توضّح لماذا قد يظهر التاريخ الهجري مختلفاً بيوم واحد عند استخدام بلد أو مرجع حساب مختلف.
                  </p>
                </div>
                <MethodComparisonTable
                  gregorianDate={isoDate}
                  umalqura={umalqura}
                  astronomical={astronomical}
                  civil={civil}
                />
                <p className={styles.cardBody}>
                  إذا رأيت فرق يوم واحد، فابدأ بمراجعة طريقة الحساب قبل الحكم على النتيجة. غالباً يكون الاختلاف بسبب مرجع بداية الشهر الهجري، لا بسبب اختلاف التاريخ الميلادي نفسه.
                </p>
              </div>
            </section>
          )}

          <DateEditorialSections
            badge="مرجع اليوم"
            title="تاريخ اليوم مع سياق يكفي للاستخدام الفعلي"
            intro="ابدأ من الإجابة الفورية، ثم راجع مصدر التاريخ وسبب اختلافه أحياناً وكيف تستخدمه في التقويم أو التحويل أو المشاركة."
            insights={insights}
            faqTitle="أسئلة قبل مشاركة تاريخ اليوم أو اعتماده"
            faqItems={faqItems}
          />

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={styles.prosePanel}>
              <h2 className={styles.sectionTitle}>متى تكفي صفحة تاريخ اليوم؟</h2>
              <div className={styles.proseBody}>
              <p>
                استخدم هذه الصفحة عندما تحتاج جواباً سريعاً للتاريخ الحالي مع سياق كافٍ لفهمه: اليوم من الأسبوع، التاريخ الهجري والميلادي، رقم الأسبوع، واليوم من السنة. إذا كان السؤال عن تاريخ سابق أو قادم، فمحوّل التاريخ هو المسار الأنسب لأنه يسمح بإدخال اليوم والشهر والسنة ومقارنة طرق الحساب.
              </p>
              <p>
                إذا كنت ترسل موعداً مهماً اليوم، فاكتب التاريخين معاً ولا تكتفِ بعبارة "اليوم". مثال واضح: {gregorianFormatted} ميلادي
                {hijri ? `، الموافق ${hijri.formatted.ar} وفق أم القرى` : ''}. هذه الصيغة تساعد الطرف الآخر على فهم الموعد حتى لو كان في بلد أو منطقة زمنية مختلفة.
              </p>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="today-decision-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="today-decision-heading" className={styles.sectionTitle}>قاعدة الاعتماد على تاريخ اليوم</h2>
                <p className={styles.sectionCopy}>
                  تاريخ اليوم يبدو بسيطاً، لكن طريقة استخدامه تختلف بين مشاركة يوم عادي وموعد رسمي
                  ومناسبة هجرية. هذه القاعدة تمنع الالتباس.
                </p>
              </div>
              <div className={styles.infoGrid}>
                {[
                  {
                    title: 'للمحادثة والمشاركة',
                    body: 'استخدم التاريخ المعروض مباشرة. اكتب اليوم والشهر والسنة، ويفضل أن تضيف التقويمين إذا كان الطرف الآخر في بلد مختلف.',
                  },
                  {
                    title: 'للمناسبات الهجرية',
                    body: 'راجع مقارنة الطرق وصفحة الدولة، لأن بداية الشهر قد تختلف بين الحساب العام والإعلان المحلي.',
                  },
                  {
                    title: 'للنماذج والتقارير',
                    body: 'استخدم التاريخ الميلادي ورقم الأسبوع عند الحاجة. كثير من الأنظمة الإدارية تعتمد الميلادي أو رقم الأسبوع في التقارير.',
                  },
                  {
                    title: 'لتاريخ غير اليوم',
                    body: 'انتقل إلى محول التاريخ. صفحة اليوم لا تكفي إذا كان لديك تاريخ ميلاد، عقد، رحلة، أو مناسبة في يوم آخر.',
                  },
                ].map((card, index) => (
                  <article
                    key={card.title}
                    className={`${styles.infoCard} ${index === 0 ? styles.infoCardLead : ''}`}
                  >
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardBody}>{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="today-sources-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="today-sources-heading" className={styles.sectionTitle}>مصادر ومنهج تاريخ اليوم</h2>
                <p className={styles.sectionCopy}>
                  نعرض التاريخ الحالي بسرعة، ونوضح في الوقت نفسه أن اختلاف التقويم الهجري أو رقم الأسبوع
                  له سبب منهجي يمكن مراجعته.
                </p>
              </div>
              <div className={styles.linkGrid}>
                {TODAY_SOURCE_LINKS.map((source, index) => (
                  <a
                    key={source.href}
                    href={source.href}
                    className={`${styles.linkCard} ${index === 0 ? styles.linkCardPrimary : ''}`}
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

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <nav aria-label="مسارات تفصيل تاريخ اليوم وتحويله" className={styles.sectionPanel} dir="rtl">
              <h2 className={styles.sectionTitle}>بعد تاريخ اليوم: اختر الخطوة التالية</h2>
              <div className={`${styles.linkGrid} mt-5`}>

              <Link href="/date/today/hijri" className={styles.linkCard}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className={styles.cardTitle}>تفاصيل التاريخ الهجري</span>
                <span className={styles.cardBody}>بثلاث طرق حساب مع المناسبات</span>
              </Link>

              <Link href="/date/today/gregorian" className={styles.linkCard}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className={styles.cardTitle}>تفاصيل التاريخ الميلادي</span>
                <span className={styles.cardBody}>اليوم من السنة، رقم الأسبوع، ومسار اليوم الكامل</span>
              </Link>

              <Link href="/date/converter" className={styles.linkCard}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className={styles.cardTitle}>محول التاريخ</span>
                <span className={styles.cardBody}>تحويل بين الهجري والميلادي بثلاث طرق</span>
              </Link>

              </div>
            </nav>
          </section>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
