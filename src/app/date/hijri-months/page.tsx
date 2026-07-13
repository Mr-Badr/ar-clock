import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate, getHijriMonthDays, convertHijriDayForCalendar } from '@/lib/date-adapter';
import type { ConvertDateResult } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, HIJRI_MONTHS_AR } from '@/lib/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import { Moon, CalendarDays, ArrowLeftRight, Calendar, ShieldCheck } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'ترتيب الشهور الهجرية ومعانيها وعدد أيامها | أنت الآن في أي شهر؟',
  description:
    'تعرف على ترتيب الشهور الهجرية الاثني عشر ومعنى كل اسم وسبب تسميته وعدد أيامه، مع مؤشر حي يوضح لك الشهر الهجري الحالي وعدد الأيام المتبقية عليه.',
  keywords: buildDateKeywords(),
  alternates: { canonical: `${BASE_URL}/date/hijri-months` },
  openGraph: {
    title: 'ترتيب الشهور الهجرية ومعانيها وعدد أيامها',
    description: 'ترتيب الأشهر الهجرية الاثني عشر مع معنى كل اسم ومؤشر حي للشهر الحالي.',
    url: `${BASE_URL}/date/hijri-months`,
    locale: 'ar_SA',
  },
};

type MonthInfo = {
  number: number;
  name: string;
  meaning: string;
  isSacred: boolean;
};

const MONTHS_INFO: MonthInfo[] = [
  { number: 1, name: 'محرم', meaning: 'من "التحريم"، لأنه أحد الأشهر التي حُرّم فيها القتال. فيه يوم عاشوراء.', isSacred: true },
  { number: 2, name: 'صفر', meaning: 'قيل لأن بيوت العرب كانت تُصفَّر (تُترك خالية) فيه بسبب كثرة الغزو والسفر.', isSacred: false },
  { number: 3, name: 'ربيع الأول', meaning: 'نسبة إلى فصل الربيع وقت وضع التسمية قبل الإسلام، والاسم بقي ثابتاً رغم أن الشهر الهجري يتنقل بين الفصول.', isSacred: false },
  { number: 4, name: 'ربيع الآخر', meaning: 'الشهر الثاني الذي يحمل اسم الربيع، ويُعرف أيضاً بربيع الثاني.', isSacred: false },
  { number: 5, name: 'جمادى الأولى', meaning: 'من "الجمود"، لأنه سُمّي في فترة كان الماء يتجمد فيها شتاءً.', isSacred: false },
  { number: 6, name: 'جمادى الآخرة', meaning: 'الشهر الثاني الذي يحمل اسم الجمود، ويُعرف أيضاً بجمادى الثانية.', isSacred: false },
  { number: 7, name: 'رجب', meaning: 'من "الترجيب" أي التعظيم، لأنه أحد الأشهر الحرم التي كانت تُعظَّم فيها حرمة القتال.', isSacred: true },
  { number: 8, name: 'شعبان', meaning: 'من "تشعّب القبائل"، أي تفرقها بحثاً عن الماء أو للغارات بعد انتهاء حرمة رجب.', isSacred: false },
  { number: 9, name: 'رمضان', meaning: 'من "الرمضاء" أي شدة الحر، لأنه سُمّي في فترة كان الحر فيها شديداً. شهر الصيام في الإسلام.', isSacred: false },
  { number: 10, name: 'شوال', meaning: 'من "شالت الإبل بأذنابها"، وهي علامة طبيعية كانت تظهر على النوق في هذا الوقت من السنة.', isSacred: false },
  { number: 11, name: 'ذو القعدة', meaning: 'من "القعود"، لأن العرب كانوا يقعدون عن القتال والغزو استعداداً لموسم الحج.', isSacred: true },
  { number: 12, name: 'ذو الحجة', meaning: 'شهر أداء فريضة الحج، وفيه يوم عرفة وعيد الأضحى.', isSacred: true },
];

async function getHijriMonthsNow(): Promise<Date> {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return now;
  } catch (error) {
    logger.warn('date-hijri-months-current-date-fallback-used', {
      routePath: '/date/hijri-months',
      error: serializeError(error),
    });
    return new Date();
  }
}

function getNextHijriMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

export default function HijriMonthsPage() {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          title="جاري تجهيز ترتيب الشهور الهجرية"
          description="نحسب الشهر الهجري الحالي وعدد الأيام المتبقية عليه."
        />
      )}
    >
      <HijriMonthsDynamicContent />
    </Suspense>
  );
}

async function HijriMonthsDynamicContent() {
  const now = await getHijriMonthsNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const iso = `${y}-${padDatePart(m)}-${padDatePart(d)}`;

  let hijri: ConvertDateResult | null = null;
  try {
    hijri = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' });
  } catch (error) {
    logger.warn('date-hijri-months-conversion-failed', { date: iso, error: serializeError(error) });
  }

  let daysInCurrentMonth = 0;
  let daysLeftInMonth = 0;
  let nextMonthInfo: MonthInfo | null = null;
  let nextMonthStartLabel = '';

  if (hijri) {
    try {
      daysInCurrentMonth = getHijriMonthDays(hijri.year, hijri.month);
      daysLeftInMonth = daysInCurrentMonth - hijri.day;
      const next = getNextHijriMonth(hijri.year, hijri.month);
      nextMonthInfo = MONTHS_INFO[next.month - 1];
      const nextGregorian = convertHijriDayForCalendar(next.year, next.month, 1);
      nextMonthStartLabel = `${nextGregorian.day} ${GREGORIAN_MONTHS_AR[nextGregorian.month - 1]} ${nextGregorian.year}`;
    } catch (error) {
      logger.warn('date-hijri-months-next-month-failed', {
        routePath: '/date/hijri-months',
        error: serializeError(error),
      });
    }
  }

  // Real umalqura day counts for every month of the current Hijri year — computed fresh
  // each render, not hardcoded, so the table stays accurate every year without edits.
  const yearMonthDays: number[] = [];
  if (hijri) {
    for (let monthNumber = 1; monthNumber <= 12; monthNumber += 1) {
      try {
        yearMonthDays.push(getHijriMonthDays(hijri.year, monthNumber));
      } catch {
        yearMonthDays.push(0);
      }
    }
  }

  const currentMonthInfo = hijri ? MONTHS_INFO[hijri.month - 1] : null;

  const faqItems = [
    {
      question: 'في أي شهر هجري نحن الآن؟',
      answer: hijri && currentMonthInfo
        ? `نحن الآن في شهر ${currentMonthInfo.name} ${hijri.year} هـ، وتحديداً اليوم ${hijri.day} من الشهر، وفق تقويم أم القرى.`
        : 'يعرض أعلى الصفحة الشهر الهجري الحالي بمجرد توفر نتيجة التحويل.',
    },
    {
      question: 'كم عدد الشهور الهجرية؟',
      answer: 'الشهور الهجرية اثنا عشر شهراً، تماماً مثل الشهور الميلادية، لكنها شهور قمرية أقصر قليلاً، لذلك تكون السنة الهجرية أقصر من الميلادية بنحو 10 إلى 11 يوماً.',
    },
    {
      question: 'هل كل شهر هجري 30 يوماً؟',
      answer: 'لا. كل شهر هجري إما 29 أو 30 يوماً، ويحدده رصد الهلال الفعلي أو الحساب الفلكي المعتمد (مثل أم القرى)، وليس نمطاً ثابتاً يتكرر بالتساوي كل شهر أو كل سنة.',
    },
    {
      question: 'ما هي الأشهر الحرم؟',
      answer: 'الأشهر الحرم أربعة: رجب منفرداً، ثم ذو القعدة وذو الحجة ومحرم متتالية. سُمّيت حرماً لأن القتال كان محرَّماً فيها، ولأن الذنب فيها أعظم والحسنة فيها أكبر.',
    },
    {
      question: 'ما معنى اسم رمضان؟',
      answer: 'اسم رمضان مشتق من "الرمضاء"، وهي شدة الحر ووهج الأرض، لأن الشهر سُمّي في فترة كانت توافق موسماً شديد الحر عند العرب قبل الإسلام.',
    },
    {
      question: 'كم يوماً باقٍ على الشهر الهجري القادم؟',
      answer: hijri && daysLeftInMonth >= 0
        ? `يتبقى ${daysLeftInMonth} يوماً على نهاية شهر ${currentMonthInfo?.name}${nextMonthInfo ? `، ثم يبدأ شهر ${nextMonthInfo.name}` : ''}.`
        : 'يعرض المؤشر أعلى الصفحة عدد الأيام المتبقية على الشهر الهجري الحالي بمجرد توفر النتيجة.',
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'ترتيب الشهور الهجرية' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'ترتيب الشهور الهجرية ومعانيها وعدد أيامها',
    description: 'مرجع كامل لترتيب الشهور الهجرية الاثني عشر مع معنى كل اسم وسبب تسميته، ومؤشر حي للشهر الهجري الحالي.',
    url: `${BASE_URL}/date/hijri-months`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  };

  return (
    <>
      <JsonLd data={[jsonLd]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-6">
            {hijri && currentMonthInfo ? (
              <>
                <div className="date-hero-main">
                  <p className="date-kicker m-0">الشهر الهجري الحالي</p>
                  <h1 className="date-hero-title text-accent-alt">
                    أنت الآن في شهر {currentMonthInfo.name} {hijri.year} هـ
                  </h1>
                  <p className="date-hero-copy">
                    اليوم هو {hijri.day} من {currentMonthInfo.name}، الموافق{' '}
                    <span dir="ltr" className="font-bold text-primary">
                      {padDatePart(d)}/{padDatePart(m)}/{y}
                    </span>{' '}
                    ميلادي. تعرض هذه الصفحة ترتيب الشهور الهجرية الاثني عشر كاملة مع معنى كل اسم وسبب تسميته وعدد أيامه، حتى تفهم التقويم الهجري لا أن تحفظ أسماءه فقط.
                  </p>
                  {currentMonthInfo.isSacred && (
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-accent">من الأشهر الحرم</span>
                    </div>
                  )}
                </div>
                <aside className="date-hero-rail" aria-label="ملخص الشهر الهجري الحالي">
                  <p className="date-hero-answer">
                    باقي {daysLeftInMonth} يوم
                  </p>
                  <p className="date-hero-note">
                    {nextMonthInfo
                      ? `على بداية شهر ${nextMonthInfo.name}، الموافق ${nextMonthStartLabel} ميلادي تقريباً.`
                      : 'على نهاية الشهر الهجري الحالي.'}
                  </p>
                  <div className="date-hero-actions">
                    <Link href="/date/today/hijri" className="date-hero-link date-hero-link--primary">
                      التاريخ الهجري اليوم بالتفصيل
                    </Link>
                    <Link href="/date/converter" className="date-hero-link">
                      محول التاريخ
                    </Link>
                  </div>
                </aside>
              </>
            ) : (
              <div className="date-hero-main">
                <h1 className="date-hero-title">ترتيب الشهور الهجرية ومعانيها وعدد أيامها</h1>
                <p className="date-hero-copy">
                  تعذر حساب الشهر الحالي الآن، لكن يمكنك مطالعة ترتيب الشهور الهجرية ومعانيها أدناه.
                </p>
              </div>
            )}
          </section>

          <AdTopBanner slotId="top-date-hijri-months" slotKey="topDateBanner" />

          <section className="date-detail-panel mb-8" aria-labelledby="hijri-months-table-heading">
            <div className="date-section-head">
              <h2 id="hijri-months-table-heading" className="date-section-title">
                ترتيب الشهور الهجرية الاثني عشر مع معنى كل اسم
              </h2>
              <p className="date-section-copy">
                عدد الأيام في الجدول محسوب فعلياً وفق تقويم أم القرى للسنة الهجرية الحالية
                ({hijri ? `${hijri.year} هـ` : '—'})، وليس رقماً ثابتاً مكرراً كل سنة — لأن كل شهر
                هجري 29 أو 30 يوماً بحسب رصد الهلال أو الحساب الفلكي، لا بنمط متكرر.
              </p>
            </div>

            <div className="table-wrapper" dir="rtl">
              <table className="table table--compact">
                <caption className="sr-only">ترتيب الشهور الهجرية مع المعنى وعدد الأيام</caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">الاسم</th>
                    <th scope="col">سبب التسمية</th>
                    <th scope="col">من الأشهر الحرم؟</th>
                    <th scope="col">عدد الأيام {hijri ? `(${hijri.year} هـ)` : ''}</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS_INFO.map((month) => {
                    const isCurrent = hijri?.month === month.number;
                    return (
                      <tr key={month.number} aria-current={isCurrent ? 'date' : undefined}>
                        <td className={isCurrent ? 'td-accent' : undefined}>{month.number}</td>
                        <td className={isCurrent ? 'td-accent' : undefined}>
                          <span className="flex flex-wrap items-center gap-2">
                            {isCurrent && <span className="badge badge-accent">الشهر الحالي</span>}
                            <span>{month.name}</span>
                          </span>
                        </td>
                        <td className={isCurrent ? 'td-accent' : undefined}>{month.meaning}</td>
                        <td className={isCurrent ? 'td-accent' : undefined}>{month.isSacred ? 'نعم' : 'لا'}</td>
                        <td className={isCurrent ? 'td-accent' : undefined}>
                          {yearMonthDays[month.number - 1] || '—'} يوماً
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="date-stat-grid mb-8">
            {[
              { label: 'عدد الشهور الهجرية', value: '12 شهراً', Icon: Calendar },
              { label: 'الأشهر الحرم', value: '4 أشهر', Icon: ShieldCheck },
              { label: 'أيام الشهر الهجري', value: '29 أو 30 يوماً', Icon: Moon },
              { label: 'فرق السنة عن الميلادية', value: '~10-11 يوماً', Icon: CalendarDays },
            ].map((s, i) => (
              <div key={i} className="date-stat-item">
                <span className="date-stat-icon" aria-hidden="true">
                  <s.Icon size={18} strokeWidth={1.75} />
                </span>
                <div className="date-stat-value">{s.value}</div>
                <div className="date-stat-label">{s.label}</div>
              </div>
            ))}
          </section>

          <AdInArticle slotId="mid-date-hijri-months" />

          <section className="date-editorial-grid date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">لماذا لا ترتبط أسماء الشهور الهجرية بالفصول اليوم؟</h2>
              <p className="date-editorial-copy">
                وُضعت أسماء الشهور الهجرية قبل الإسلام في زمن كانت فيه الأشهر مرتبطة فعلياً بفصول
                السنة، مثل ربيع الأول وربيع الآخر في الربيع، وجمادى الأولى وجمادى الآخرة في الشتاء حين
                يتجمد الماء. لكن التقويم الهجري تقويم قمري خالص لا يُدخِل شهراً كبيسياً لضبطه مع فصول
                الشمس كما يفعل التقويم الميلادي، فتتنقل الشهور الهجرية عبر كل فصول السنة خلال دورة تمتد
                نحو 33 سنة ميلادية. لهذا قد تجد رمضان في الصيف سنوات، ثم في الشتاء سنوات أخرى، رغم أن
                اسمه مشتق أصلاً من شدة الحر.
              </p>
              <p className="date-editorial-copy">
                هذا التنقل هو ما يميز التقويم الهجري عملياً: فهو يمنحك دورة كاملة من الفصول لكل مناسبة
                دينية على مدى العمر، بدل أن ترتبط بفصل واحد ثابت كما هو الحال في كثير من التقاويم
                الشمسية.
              </p>
              <h2 className="date-editorial-title">الأشهر الحرم الأربعة ولماذا تحمل مكانة خاصة</h2>
              <p className="date-editorial-copy">
                من بين الشهور الاثني عشر، أربعة أشهر تحمل اسم الأشهر الحرم: رجب منفرداً في منتصف السنة،
                ثم ذو القعدة وذو الحجة والمحرم متتالية حول موسم الحج. سُمّيت حرماً لأن القتال كان
                محرَّماً فيها في الجاهلية والإسلام إلا دفاعاً، ولأن العلماء يذكرون أن الحسنة فيها أعظم
                والذنب فيها أشد. ذو القعدة وذو الحجة سبقا موسم الحج والعودة الآمنة منه، ومحرم أعطى
                القبائل وقتاً للعودة إلى ديارها بأمان، بينما جاء رجب في منتصف العام لتيسير زيارة الكعبة
                والاعتمار بها من مسافة بعيدة.
              </p>
              <h2 className="date-editorial-title">كيف تستفيد من هذه الصفحة عملياً</h2>
              <p className="date-editorial-copy">
                إذا كنت تحتاج معرفة الشهر الحالي فقط، فالمؤشر أعلى الصفحة يعطيك الجواب مباشرة مع عدد
                الأيام المتبقية على بدايته أو نهايته. وإذا كنت تشرح التقويم الهجري لطالب أو تحضّر محتوى
                عنه، استخدم الجدول والمعاني لتقديم شرح دقيق بدل تكرار الأسماء بلا سياق. ولمتابعة تاريخ
                يوم بعينه بدقة أكبر، افتح صفحة التاريخ الهجري اليوم أو محول التاريخ.
              </p>
            </div>
            <div className="date-use-list">
              <article className="date-use-item">
                <h3 className="date-use-title">
                  <span className="date-use-icon" aria-hidden="true"><Moon size={16} strokeWidth={1.75} /></span>
                  للعبادات
                </h3>
                <p className="date-use-copy">تابع الأشهر الحرم ورمضان وموسم الحج بمعرفة دقيقة لموقعك الحالي داخل السنة الهجرية.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">
                  <span className="date-use-icon" aria-hidden="true"><Calendar size={16} strokeWidth={1.75} /></span>
                  للتعليم والمحتوى
                </h3>
                <p className="date-use-copy">استخدم معاني الأسماء الموثقة لشرح التقويم الهجري بدقة بدل تكرار الأسماء دون سياق.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">
                  <span className="date-use-icon" aria-hidden="true"><CalendarDays size={16} strokeWidth={1.75} /></span>
                  للتخطيط
                </h3>
                <p className="date-use-copy">راقب عدد الأيام المتبقية على الشهر الحالي لترتيب مناسبة أو عبادة أو سفر قادم.</p>
              </article>
            </div>
          </section>

          <section className="date-editorial-grid date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">أسئلة عن ترتيب الشهور الهجرية</h2>
              {faqItems.map((item) => (
                <details key={item.question} className="date-use-item">
                  <summary className="date-use-title">{item.question}</summary>
                  <p className="date-use-copy">{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="date-use-list">
              <article className="date-use-item">
                <h3 className="date-use-title">قاعدة عملية</h3>
                <p className="date-use-copy">احفظ الترتيب لا الفصل: الشهور تتنقل بين الفصول عبر السنين، فلا تربط اسم الشهر بفصل ثابت.</p>
              </article>
            </div>
          </section>

          <nav aria-label="مسارات مراجعة الشهور الهجرية" className="related-links" dir="rtl">
            <p className="related-links__heading">تابع التاريخ الهجري بتفاصيل أكثر</p>
            <div className="related-links__grid">
              <Link href="/date/today/hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الهجري اليوم</span>
                  <span className="related-link-card__desc">اليوم والشهر والسنة الهجرية بالتفصيل مع مقارنة طرق الحساب</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              {hijri && (
                <Link
                  href={`/date/calendar/hijri/${hijri.year}`}
                  className="related-link-card"
                >
                  <span className="related-link-card__icon" aria-hidden="true">
                    <CalendarDays size={16} strokeWidth={1.75} />
                  </span>
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">تقويم {hijri.year} هـ كاملاً</span>
                    <span className="related-link-card__desc">كل أشهر السنة الهجرية الحالية في تقويم واحد</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              )}

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">حوّل أي تاريخ هجري أو ميلادي وقارن طرق الحساب</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/holidays/ramadan" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">رمضان — العد التنازلي</span>
                  <span className="related-link-card__desc">تابع الأيام المتبقية على شهر رمضان القادم</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/holidays/islamic-new-year" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">رأس السنة الهجرية</span>
                  <span className="related-link-card__desc">موعد بداية السنة الهجرية الجديدة (أول محرم)</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/holidays/hajj-season" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ShieldCheck size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">موسم الحج</span>
                  <span className="related-link-card__desc">مواعيد أيام الحج في ذي الحجة، أحد الأشهر الحرم</span>
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
