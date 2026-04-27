import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { HijriYearlyCalendar } from '@/components/date/HijriYearlyCalendar';
import { DateCalendarGridSkeleton } from '@/components/date/DateRouteLoading';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Calendar } from 'lucide-react';
import { convertDate } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, HIJRI_MONTHS_AR } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

function getHijriMonthDays(hYear: number, hMonth: number): number {
  try {
    convertDate({
      date: `${hYear}-${String(hMonth).padStart(2, '0')}-30`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
    return 30;
  } catch {
    return 29;
  }
}

export async function generateStaticParams() {
  const now = new Date();
  const isoNow = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  let currentHijriYear = 1447;
  try {
    const h = convertDate({ date: isoNow, toCalendar: 'hijri', method: 'umalqura' });
    currentHijriYear = h.year;
  } catch { }

  const params = [];
  for (let y = currentHijriYear - 5; y <= currentHijriYear + 5; y++) {
    params.push({ year: String(y) });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) {
    return { title: 'تقويم غير صالح' };
  }

  return {
    title: `التقويم الهجري لعام ${year} هـ | تقويم أم القرى`,
    description: `التقويم الهجري لعام ${year} هـ كاملًا مع ما يوافقه بالتقويم الميلادي. تصفح الشهور الهجرية وروابط الأيام وتحويل التاريخ بسهولة.`,
    alternates: { canonical: `${BASE_URL}/date/calendar/hijri/${year}` },
    openGraph: {
      title: `تقويم عام ${year} هجري | ميقاتنا`,
      description: `تصفح التقويم الهجري لعام ${year} هـ وما يوافقه من الميلادي مع روابط الأيام`,
      url: `${BASE_URL}/date/calendar/hijri/${year}`,
      locale: 'ar_SA',
    },
  };
}

export default async function HijriCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) notFound();
  const y = parseInt(year, 10);

  if (y < 1343 || y > 1500) redirect('/date/converter');

  const monthLengths = Array.from({ length: 12 }, (_, index) => getHijriMonthDays(y, index + 1));
  const totalDays = monthLengths.reduce((sum, days) => sum + days, 0);

  let firstGregorianLabel = 'غير متاح';
  let lastGregorianLabel = 'غير متاح';
  let firstGregorianYear = 2026;
  try {
    const firstGregorian = convertDate({
      date: `${y}-01-01`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });
    const lastGregorian = convertDate({
      date: `${y}-12-${String(monthLengths[11]).padStart(2, '0')}`,
      toCalendar: 'gregorian',
      method: 'umalqura',
    });

    firstGregorianLabel = `${firstGregorian.day} ${GREGORIAN_MONTHS_AR[firstGregorian.month - 1]} ${firstGregorian.year}`;
    lastGregorianLabel = `${lastGregorian.day} ${GREGORIAN_MONTHS_AR[lastGregorian.month - 1]} ${lastGregorian.year}`;
    firstGregorianYear = firstGregorian.year;
  } catch {
    // Keep graceful fallbacks for unsupported years.
  }

  const monthLinks = HIJRI_MONTHS_AR.map((monthName, index) => ({
    label: monthName,
    href: `/date/hijri/${y}/${String(index + 1).padStart(2, '0')}/01`,
    days: monthLengths[index],
  }));

  const faqItems = [
    {
      question: `ما هو التقويم الهجري لعام ${y}؟`,
      answer: `التقويم الهجري لعام ${y} هو عرض كامل للشهور القمرية من محرم إلى ذي الحجة. يوضح هذا التقويم كل يوم هجري مع التاريخ الميلادي الموافق له حتى يسهل التخطيط والمقارنة بين التقويمين.`,
    },
    {
      question: `هل يعتمد هذا التقويم على أم القرى؟`,
      answer: `نعم، هذا التقويم مبني على تقويم أم القرى المستخدم على نطاق واسع في السعودية ودول الخليج. قد يظهر اختلاف بيوم واحد في بعض البلدان أو الجهات التي تعتمد إعلاناً محلياً لبداية الشهور.`,
    },
    {
      question: `ما المدى الميلادي الذي يغطيه عام ${y} هـ؟`,
      answer: `عام ${y} هـ يمتد تقريباً من ${firstGregorianLabel} إلى ${lastGregorianLabel}. يبدأ العام الهجري وينتهي داخل نطاق ميلادي مختلف لأن التقويم الهجري أقصر من السنة الميلادية بنحو 10 إلى 11 يوماً.`,
    },
    {
      question: `كيف أستخدم تقويم ${y} الهجري للتحويل إلى ميلادي؟`,
      answer: `استخدم تقويم ${y} الهجري بالانتقال إلى الشهر ثم اليوم الذي تبحث عنه، وستصل مباشرة إلى صفحة التاريخ الهجري التفصيلية. هناك ستجد التاريخ الميلادي الموافق وروابط التحويل بين الطريقتين.`,
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الهجري', href: '/date/calendar/hijri' },
    { label: `عام ${year} هـ` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التقويم الهجري لعام ${year}`,
    description: `تقويم أم القرى لعام ${year} هـ مع الشهور والأيام والمقابل الميلادي الكامل.`,
    url: `${BASE_URL}/date/calendar/hijri/${year}`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-8 gap-4 border-b border-border pb-6">

            <nav className="flex items-center justify-between mx-auto w-full">
              {/* Previous year link on the left */}
              <Link
                href={`/date/calendar/hijri/${y - 1}`}
                className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors text-primary"
              >
                → {y - 1} هـ
              </Link>

              {/* Heading in the center */}
              <h1 className="text-3xl font-black text-accent-alt text-center flex-1">
                التقويم الهجري — عام {year}
              </h1>

              {/* Next year link on the right */}
              <Link
                href={`/date/calendar/hijri/${y + 1}`}
                className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors text-primary"
              >
                {y + 1} هـ ←
              </Link>
            </nav>
          </div>

          <p className="text-secondary text-base mb-8 font-medium">
            التقويم الهجري لعام {year} هـ يعرض الشهور القمرية كاملة مع التاريخ الميلادي المقابل لكل يوم وفق تقويم أم القرى. يساعدك هذا العرض في متابعة المواسم الإسلامية، والتخطيط للمناسبات، والانتقال السريع من التاريخ الهجري إلى الميلادي.
          </p>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'عدد أيام السنة', value: `${totalDays} يوماً` },
              { label: 'بداية العام', value: `1 محرم ${y} هـ` },
              { label: 'نهاية العام', value: `${monthLengths[11]} ذو الحجة ${y} هـ` },
              { label: 'النطاق الميلادي', value: `${firstGregorianLabel} — ${lastGregorianLabel}` },
            ].map((fact) => (
              <div key={fact.label} className="card text-center">
                <div className="text-base font-black text-accent-alt mb-1">{fact.value}</div>
                <div className="text-xs text-muted font-medium">{fact.label}</div>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <Suspense fallback={<DateCalendarGridSkeleton />}>
              <HijriYearlyCalendar year={y} />
            </Suspense>
          </section>

          <section className="grid md:grid-cols-2 mb-8" style={{ gap: '16px' }}>
            <article className="card">
              <h2 className="card__title text-lg mb-3">كيف يعمل هذا التقويم الهجري؟</h2>
              <p className="text-sm text-secondary leading-relaxed m-0">
                يعتمد هذا العرض على تقويم أم القرى، لذلك يظهر لك اليوم الهجري مع مقابله الميلادي في كل خانة من خانات السنة. هذا يجعل الصفحة مناسبة للبحث عن بداية شهر، أو معرفة توافق مناسبة هجريّة مع التاريخ الميلادي بسرعة.
              </p>
            </article>

            <article className="card">
              <h2 className="card__title text-lg mb-3">لماذا قد يختلف التاريخ الهجري بين الدول؟</h2>
              <p className="text-sm text-secondary leading-relaxed m-0">
                يختلف التاريخ الهجري أحياناً لأن بعض الجهات تعتمد حساباً فلكياً ثابتاً، بينما تعتمد جهات أخرى الإعلان المحلي لرؤية الهلال. لهذا السبب قد تلاحظ فرقاً بيوم واحد بين تقويم أم القرى وبعض التقاويم الرسمية خارج الخليج.
              </p>
            </article>
          </section>

          <section className="card mb-8">
            <h2 className="card__title text-lg mb-3">شهور عام {year} الهجري</h2>
            <p className="text-sm text-secondary leading-relaxed mb-4">
              انتقل مباشرة إلى بداية أي شهر هجري من شهور سنة {year} هـ، ثم اختر اليوم المطلوب لمعرفة مقابله بالتقويم الميلادي أو للوصول إلى صفحة التاريخ التفصيلية.
            </p>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {monthLinks.map((month) => (
                <Link key={month.href} href={month.href} className="chip">
                  {month.label} · {month.days} يوم
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">أسئلة شائعة حول تقويم {year} الهجري</h2>
            <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {faqItems.map((item) => (
                <article key={item.question} className="card">
                  <h3 className="text-base font-bold text-primary mb-2">{item.question}</h3>
                  <p className="text-sm text-secondary leading-relaxed m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <nav aria-label="روابط ذات صلة" className="related-links" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">
              <Link href="/date" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة التاريخ الرئيسية</span>
                  <span className="related-link-card__desc">تاريخ اليوم وروابط التحويل والتقاويم</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">تحويل سريع بين الهجري والميلادي</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/gregorian-to-hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تحويل ميلادي إلى هجري</span>
                  <span className="related-link-card__desc">أدخل التاريخ الميلادي واحصل على الهجري</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href={`/date/calendar/${firstGregorianYear}`} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التقويم الميلادي الموافق</span>
                  <span className="related-link-card__desc">ابدأ من عام {firstGregorianYear}م المقابل لبداية السنة الهجرية</span>
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
