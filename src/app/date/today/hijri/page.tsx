import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { DAY_NAMES_AR, GREGORIAN_MONTHS_AR } from '@/lib/constants';
import { isSacredMonth, isRamadan as checkRamadan, getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateShareActions } from '@/components/date/DateShareActions';
import DateRouteLoading from '@/components/date/DateRouteLoading';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Moon, CalendarDays, ArrowLeftRight, Calendar, Star } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'التاريخ الهجري اليوم | أم القرى ومقارنة طرق الحساب',
  description:
    'اعرف التاريخ الهجري اليوم وفق أم القرى مع المقابل الميلادي، مقارنة الحساب الفلكي والمدني، وشرح متى تراجع إعلان بلدك عند بداية الشهر.',
  keywords: buildDateKeywords(),
  alternates: { canonical: `${BASE_URL}/date/today/hijri` },
  openGraph: {
    title: 'التاريخ الهجري اليوم',
    description: 'التاريخ الهجري اليوم مع المقابل الميلادي ومقارنة أم القرى والحساب الفلكي والمدني.',
    url: `${BASE_URL}/date/today/hijri`,
    locale: 'ar_SA',
  },
};

const MONTH_ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];

const MONTH_SIGNIFICANCE: Record<number, string> = {
  1: 'محرم من الأشهر الحرم، وفيه يوم عاشوراء في اليوم العاشر.',
  2: 'شهر صفر، لا حرمة خاصة له، وما يُشاع عنه من التشاؤم مردود في الإسلام.',
  3: 'ربيع الأول، ويرتبط في الذاكرة الإسلامية بسيرة النبي محمد ﷺ، وتختلف عادات الناس حول المولد بحسب البلد والمذهب.',
  4: 'ربيع الثاني، يعقب ربيع الأول ويُكمل فصل الربيع الهجري.',
  5: 'جمادى الأولى، سُمّي بهذا الاسم لتزامن بداية العرب تسمية الأشهر مع تجمّد الماء شتاءً.',
  6: 'جمادى الثانية، يعقب جمادى الأولى ويكمل الفصل الخامس والسادس.',
  7: 'رجب من الأشهر الحرم الأربعة، وتنتشر فيه تواريخ شعبية مرتبطة بذكرى الإسراء والمعراج.',
  8: 'شعبان يأتي قبل رمضان مباشرة، لذلك يستخدمه كثيرون للاستعداد للصيام وتنظيم المواعيد.',
  9: 'رمضان المبارك، شهر الصيام والقرآن وليلة القدر خير من ألف شهر.',
  10: 'شوال يبدأ بعيد الفطر، ويرتبط عند كثير من المسلمين بصيام ستة أيام بعد رمضان.',
  11: 'ذو القعدة من الأشهر الحرم. يبدأ فيه موسم الحج وتحرم فيه المقاتلة.',
  12: 'ذو الحجة، شهر الحج ويوم عرفة (9) وعيد الأضحى (10). العشر الأوائل منه من أفضل الأيام.',
};

const HIJRI_SOURCE_LINKS = [
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'يوضح تعدد أنواع التقويم الإسلامي، مثل أم القرى والمدني والجدولي، وسبب اختلاف النتائج بين الطرق.',
  },
  {
    href: 'https://hijridate.readthedocs.io/en/stable/background.html',
    label: 'خلفية تقويم أم القرى',
    description: 'شرح تاريخي مختصر لاستخدام تقويم أم القرى في السعودية للأغراض الإدارية.',
  },
  {
    href: 'https://www.al-habib.info/islamic-calendar/',
    label: 'Alhabib Islamic Calendar',
    description: 'مرجع مقارنة يعرض فكرة التقويم المحلي ورؤية الهلال وأم القرى والتقويمات الفلكية.',
  },
];

async function getTodayHijriNow(): Promise<Date> {
  try {
    const nowIso = await getCachedNowIso();
    const now = new Date(nowIso);
    if (Number.isNaN(now.getTime())) {
      throw new Error('getCachedNowIso returned an invalid ISO date');
    }
    return now;
  } catch (error) {
    logger.warn('date-today-hijri-current-date-fallback-used', {
      routePath: '/date/today/hijri',
      error: serializeError(error),
    });
    return new Date();
  }
}

export default function TodayHijriPage() {
  return (
    <Suspense
      fallback={(
        <DateRouteLoading
          title="جاري تجهيز التاريخ الهجري اليوم"
          description="نجهز تاريخ اليوم الهجري، المقابل الميلادي، ومقارنة طرق الحساب."
        />
      )}
    >
      <TodayHijriDynamicContent />
    </Suspense>
  );
}

async function TodayHijriDynamicContent() {
  const now = await getTodayHijriNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES_AR[now.getUTCDay()];

  let umalqura, astronomical, civil;
  try {
    umalqura = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' });
    astronomical = convertDate({ date: iso, toCalendar: 'hijri', method: 'astronomical' });
    civil = convertDate({ date: iso, toCalendar: 'hijri', method: 'civil' });
  } catch (error) {
    logger.warn('date-today-hijri-conversion-failed', {
      date: iso,
      methods: ['umalqura', 'astronomical', 'civil'],
      error: serializeError(error),
    });
  }

  const hijri = umalqura;
  const isRam = hijri ? checkRamadan(hijri.month) : false;
  const isSacred = hijri ? isSacredMonth(hijri.month) : false;
  const events = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];
  const daysInMonth = hijri ? (hijri.month % 2 !== 0 ? 30 : 29) : 30;
  const progress = hijri ? Math.round((hijri.day / daysInMonth) * 100) : 0;
  const daysLeft = hijri ? daysInMonth - hijri.day : 0;
  const significance = hijri ? MONTH_SIGNIFICANCE[hijri.month] : '';

  const faqItems = [
    {
      question: 'كم التاريخ الهجري اليوم؟',
      answer: hijri
        ? `التاريخ الهجري اليوم هو ${hijri.formatted.ar} وفق تقويم أم القرى، ويوافق ${d} ${GREGORIAN_MONTHS_AR[m - 1]} ${y} ميلادي.`
        : 'تعرض هذه الصفحة التاريخ الهجري اليوم عندما تكون نتيجة التحويل ضمن النطاق المدعوم.',
    },
    {
      question: 'لماذا قد يختلف التاريخ الهجري بين بلد وآخر؟',
      answer: 'لأن بعض البلدان تعتمد إعلاناً محلياً أو رؤية الهلال، بينما تعتمد جهات أخرى تقويماً حسابياً مثل أم القرى أو التقويم المدني. لذلك قد يظهر فرق يوم واحد عند بداية الشهر أو نهايته.',
    },
    {
      question: 'هل تقويم أم القرى هو المرجع النهائي لكل الدول؟',
      answer: 'لا. أم القرى مرجع إداري مهم في السعودية، لكنه ليس بديلاً عن إعلان بلدك في القرارات الدينية أو الرسمية مثل رمضان والعيدين.',
    },
    {
      question: 'متى أستخدم محول هجري إلى ميلادي؟',
      answer: 'استخدم المحول عندما يكون لديك يوم هجري محدد سابق أو قادم، مثل تاريخ ميلاد هجري أو مناسبة أو موعد رسمي، وتحتاج المقابل الميلادي.',
    },
    {
      question: 'هل يبدأ اليوم الهجري عند الغروب أم منتصف الليل؟',
      answer: 'في الاستخدام الشرعي يرتبط دخول اليوم القمري بالغروب ورؤية الهلال، أما الصفحات الرقمية اليومية فتعرض التاريخ حسب تقويم وطريقة حساب محددة في اليوم المدني المعروض.',
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'اليوم', href: '/date/today' },
    { label: 'هجري' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: hijri ? `التاريخ الهجري اليوم: ${hijri.formatted.ar}` : 'التاريخ الهجري اليوم',
    description: hijri ? `التاريخ الهجري اليوم هو ${hijri.formatted.ar} الموافق ${d}/${m}/${y} ميلادي، مع مقارنة طرق الحساب والتنبيه إلى اختلاف الرؤية المحلية.` : 'التاريخ الهجري اليوم',
    url: `${BASE_URL}/date/today/hijri`,
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
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-6">
            {hijri ? (
              <>
                <div className="date-hero-main">
                  <p className="date-kicker m-0">{dayOfWeek}</p>
                  <h1 className="date-hero-title text-accent-alt">
                    {hijri.day} {hijri.monthNameAr} {hijri.year} هجري
                  </h1>
                  <p className="date-hero-copy">
                    هذا هو التاريخ الهجري اليوم وفق تقويم أم القرى، ويوافق{' '}
                    <span dir="ltr" className="font-bold text-primary">
                      {String(d).padStart(2, '0')}/{String(m).padStart(2, '0')}/{y}
                    </span>{' '}
                    ميلادي. إذا كان الموعد دينياً أو رسمياً، قارنه أيضاً مع إعلان بلدك لأن رؤية الهلال قد تغيّر بداية الشهر بيوم.
                  </p>
                  {(isRam || events.length > 0 || isSacred) && (
                    <div className="flex flex-wrap gap-2">
                      {isRam && (
                        <span className="badge badge-warning">
                          رمضان المبارك، اليوم {hijri.day} من {daysInMonth}
                        </span>
                      )}
                      {events.length > 0 && (
                        <span className="badge badge-success">
                          {events.map(e => e.nameAr).join(' • ')}
                        </span>
                      )}
                      {isSacred && !isRam && (
                        <span className="badge badge-accent">من الأشهر الحرم</span>
                      )}
                    </div>
                  )}
                </div>
                <aside className="date-hero-rail" aria-label="ملخص التاريخ الهجري اليوم">
                  <p className="date-hero-answer">
                    اليوم {hijri.day} من {daysInMonth}
                  </p>
                  <p className="date-hero-note">
                    {daysLeft === 0
                      ? `ينتهي شهر ${hijri.monthNameAr} اليوم وفق الحساب الحالي.`
                      : `تبقى ${daysLeft} يوم في شهر ${hijri.monthNameAr} وفق الحساب الحالي.`}
                  </p>
                  <div className="date-hero-actions">
                    <Link href="/date/today/gregorian" className="date-hero-link date-hero-link--primary">
                      التاريخ الميلادي اليوم
                    </Link>
                    <Link href="/date/hijri-to-gregorian" className="date-hero-link">
                      تحويل هجري إلى ميلادي
                    </Link>
                  </div>
                </aside>
              </>
            ) : (
              <div className="date-hero-main">
                <p className="date-kicker m-0">{dayOfWeek}</p>
                <h1 className="date-hero-title">التاريخ الهجري اليوم</h1>
                <p className="date-hero-copy">
                  تعذر تحميل التاريخ الهجري الآن. يمكنك استخدام محول التاريخ لإدخال تاريخ محدد ومقارنة طرق الحساب.
                </p>
                <Link href="/date/converter" className="date-hero-link date-hero-link--primary">
                  فتح محول التاريخ
                </Link>
              </div>
            )}
          </section>

          {hijri && (
            <section className="date-detail-panel mb-6">
              <div className="flex justify-between items-center mb-3 text-sm text-secondary">
                <span className="font-bold">تقدم شهر {hijri.monthNameAr}</span>
                <span className="font-medium tabular-nums">يوم {hijri.day} من {daysInMonth}، تبقى {daysLeft} يوم</span>
              </div>
              <div className="progress-track mb-3">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: isRam ? 'var(--warning)' : 'var(--blue)',
                    transition: 'width 0.7s ease-out',
                  }}
                />
              </div>
              {significance && (
                <p className="text-xs text-muted leading-relaxed m-0">{significance}</p>
              )}
            </section>
          )}

          {hijri && (
            <section className="date-stat-grid mb-8">
              {[
                { label: 'اليوم من الشهر', value: `${hijri.day} / ${daysInMonth}` },
                { label: 'اليوم من السنة', value: `${hijri.dayOfYear} / ${hijri.daysInYear}` },
                { label: 'الشهر', value: MONTH_ORDINALS[(hijri.month ?? 1) - 1] },
                { label: 'تبقى للسنة', value: `${hijri.daysInYear - hijri.dayOfYear} يوم` },
              ].map((s, i) => (
                <div key={i} className="date-stat-item">
                  <div className="date-stat-value">{s.value}</div>
                  <div className="date-stat-label">{s.label}</div>
                </div>
              ))}
            </section>
          )}

          {umalqura && astronomical && civil && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-primary mb-4">التاريخ الهجري حسب طريقة الحساب</h2>
              <MethodComparisonTable
                gregorianDate={iso}
                umalqura={umalqura}
                astronomical={astronomical}
                civil={civil}
              />
            </section>
          )}

          <section className="date-detail-panel mb-8">
            <h2 className="date-section-title">كيف يُحسب التاريخ الهجري؟</h2>
            <div className="space-y-3">
              <p className="date-editorial-copy m-0">
                التقويم الهجري تقويم قمري يعتمد على دورة القمر. لذلك تكون أشهره غالباً 29 أو 30 يوماً، والسنة الهجرية أقصر من السنة الميلادية بنحو 10 إلى 11 يوماً.
              </p>
              <p className="date-editorial-copy m-0">
                <strong className="text-primary">تقويم أم القرى</strong> مرجع إداري مستخدم في السعودية ويعتمد حساباً منظماً لبداية الأشهر. أما الطرق الفلكية أو المدنية أو الإعلانات المحلية فقد تعطي نتيجة مختلفة بيوم واحد، خصوصاً عند بداية الشهر ونهايته.
              </p>
            </div>
          </section>

          <section className="date-editorial-grid date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">كيف تستفيد من التاريخ الهجري اليوم؟</h2>
              <p className="date-editorial-copy">
                التاريخ الهجري لا يستخدم فقط لمعرفة رقم اليوم، بل يرتبط بالصيام، العبادات، المناسبات الإسلامية، بداية الأشهر، والتخطيط العائلي في كثير من الدول العربية. إذا كنت تراجع موعداً دينياً أو مناسبة قريبة، فاقرأ اسم الشهر وموضع اليوم داخل الشهر، ثم قارن الطريقة المعروضة مع الإعلان الرسمي في بلدك عند القرارات المهمة.
              </p>
              <p className="date-editorial-copy">
                عند مشاركة التاريخ مع شخص في دولة أخرى، تذكّر أن اليوم الهجري قد يختلف بسبب الرؤية المحلية. لذلك تضيف الصفحة مسار التحويل والتاريخ الميلادي حتى تستطيع توضيح اليوم المقصود بصيغتين، لا بصيغة واحدة قد تُفهم بشكل مختلف.
              </p>
              <p className="date-editorial-copy">
                إذا كان التاريخ مرتبطاً بسفر أو معاملة أو مناسبة رسمية، فاحفظ التاريخين معاً: الهجري للمعنى الديني أو المحلي، والميلادي للأنظمة الرقمية والحجوزات.
              </p>
              <p className="date-editorial-copy">
                عند متابعة شهر رمضان أو الأشهر الحرم أو أيام الحج، لا تنظر إلى رقم اليوم وحده. اقرأ أيضاً عدد الأيام المتبقية في الشهر واسم المناسبة إن وجدت، لأن هذه التفاصيل تساعدك على ترتيب الصيام، الزيارات العائلية، السفر، أو الإجازات دون الرجوع إلى أكثر من مصدر.
              </p>
              <p className="date-editorial-copy">
                الصفحة تعرض طريقة أم القرى كمرجع أساسي لأنها الأكثر استخداماً في الخليج، لكنها تذكر الفرق بين طرق الحساب حتى لا تبدو النتيجة وكأنها حقيقة مطلقة في كل بلد. إذا كان بلدك يعلن بداية الشهر بالرؤية الرسمية، فاجعل إعلان الجهة المحلية هو المرجع النهائي في القرارات الدينية والرسمية.
              </p>
              <p className="date-editorial-copy">
                وللمتابعة اليومية، افتح صفحة التحويل عندما تريد تاريخاً سابقاً أو لاحقاً بدلاً من الاعتماد على تاريخ اليوم فقط. هذا يحافظ على دقة التخطيط عندما تكون المناسبة بعد أسابيع أو عندما تريد مقارنة تاريخ هجري مع موعد ميلادي محدد.
              </p>
            </div>
            <div className="date-use-list">
              <article className="date-use-item">
                <h3 className="date-use-title">للعبادات</h3>
                <p className="date-use-copy">تحقق من الشهر واليوم قبل الصيام أو متابعة الأيام الفاضلة، ثم قارن مع إعلان بلدك عند الحاجة.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">للمناسبات</h3>
                <p className="date-use-copy">استخدم التاريخين معاً عند مشاركة موعد عائلي حتى يفهمه من يعتمد الهجري ومن يعتمد الميلادي.</p>
              </article>
              <article className="date-use-item">
                <h3 className="date-use-title">للتخطيط</h3>
                <p className="date-use-copy">راقب تقدم الشهر وعدد الأيام المتبقية إذا كنت ترتب سفراً، إجازة، أو موعداً قريباً.</p>
              </article>
            </div>
          </section>

          {hijri && (
            <section className="mb-8">
              <h3 className="text-sm font-semibold text-muted mb-3">مشاركة التاريخ</h3>
              <DateShareActions
                hijriFormatted={hijri.formatted.ar}
                gregorianFormatted={`${d} ${GREGORIAN_MONTHS_AR[m - 1]} ${y}`}
                hijriIso={hijri.formatted.iso}
                gregorianIso={iso}
                pageUrl={`${BASE_URL}/date/today/hijri`}
              />
            </section>
          )}

          <section className="date-editorial-grid date-section">
            <div className="max-w-3xl space-y-4">
              <h2 className="date-editorial-title">أسئلة قبل اعتماد التاريخ الهجري اليوم</h2>
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
                <p className="date-use-copy">للاستخدام اليومي استخدم أم القرى، وللعبادات الرسمية راجع إعلان بلدك، وللمواعيد الدولية اكتب الهجري والميلادي معاً.</p>
              </article>
            </div>
          </section>

          <section className="related-links mb-8" dir="rtl" aria-labelledby="hijri-sources-heading">
            <p id="hijri-sources-heading" className="related-links__heading">
              مصادر ومنهج التاريخ الهجري
            </p>
            <div className="related-links__grid">
              {HIJRI_SOURCE_LINKS.map((source) => (
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

          {/* ── FOOTER NAV ─────────────────────────────────────────────── */}
          <nav aria-label="مسارات مراجعة التاريخ الهجري اليوم" className="related-links" dir="rtl">
            <p className="related-links__heading">إذا أردت مقارنة التاريخ أو تحويله</p>
            <div className="related-links__grid">

              <Link href="/date/today/gregorian" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الميلادي اليوم</span>
                  <span className="related-link-card__desc">اليوم الميلادي، رقم الأسبوع، وصيغة النسخ</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/today" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الهجري والميلادي اليوم</span>
                  <span className="related-link-card__desc">عرض التاريخين معاً مع مقارنة الطرق</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">حوّل تاريخاً محدداً وقارن طرق الحساب</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/hijri-to-gregorian" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">هجري إلى ميلادي</span>
                  <span className="related-link-card__desc">استخدمه عندما تريد المقابل الميلادي لهذا النوع من التاريخ</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              {hijri && (
                <Link
                  href={`/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}`}
                  className="related-link-card"
                >
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Star size={16} strokeWidth={1.75} />
                  </span>
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">صفحة {hijri.formatted.ar} هجري</span>
                    <span className="related-link-card__desc">تفاصيل اليوم نفسه مع روابط اليوم السابق والتالي</span>
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
