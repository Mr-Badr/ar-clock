// src/app/date/calendar/[year]/page.tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { YearlyCalendar } from '@/components/date/YearlyCalendar';
import { DateCalendarGridSkeleton } from '@/components/date/DateRouteLoading';
import { Calendar, ArrowLeftRight, CalendarDays } from 'lucide-react';
import { convertDate } from '@/lib/date-adapter';
import { DAY_NAMES_AR, GREGORIAN_MONTHS_AR } from '@/lib/constants';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

export async function generateStaticParams() {
  const currentYear = new Date().getUTCFullYear();
  const params = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
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
    title: `تقويم عام ${year} ميلادي | التقويم الميلادي والهجري`,
    description: `تقويم عام ${year} ميلادي كامل مع الشهور والأيام وما يوافقها بالتقويم الهجري. تصفح السنة كلها مع روابط كل يوم وتحويل التاريخ بسرعة.`,
    alternates: { canonical: `${BASE_URL}/date/calendar/${year}` },
    openGraph: {
      title: `تقويم عام ${year} ميلادي | ميقاتنا`,
      description: `تصفح التقويم الميلادي لعام ${year} وما يوافقه من الهجري مع روابط كل يوم`,
      url: `${BASE_URL}/date/calendar/${year}`,
      locale: 'ar_SA',
    },
  };
}

export default async function GregorianCalendarPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  if (!year.match(/^\d{4}$/)) notFound();
  const y = parseInt(year, 10);

  if (y < 1924 || y > 2077) redirect('/date/converter');

  const now = new Date(await getCachedNowIso());
  const currentYear = now.getUTCFullYear();
  const serverTodayIso = y === currentYear ? now.toISOString().slice(0, 10) : undefined;
  const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const totalDays = isLeapYear ? 366 : 365;
  const yearStart = new Date(Date.UTC(y, 0, 1));
  const yearEnd = new Date(Date.UTC(y, 11, 31));
  const firstDayName = DAY_NAMES_AR[yearStart.getUTCDay()];
  const lastDayName = DAY_NAMES_AR[yearEnd.getUTCDay()];

  let firstHijriLabel = 'غير متاح';
  let lastHijriLabel = 'غير متاح';
  let firstHijriYear = 1447;
  try {
    const firstHijri = convertDate({ date: `${y}-01-01`, toCalendar: 'hijri', method: 'umalqura' });
    const lastHijri = convertDate({ date: `${y}-12-31`, toCalendar: 'hijri', method: 'umalqura' });
    firstHijriLabel = `${firstHijri.day} ${firstHijri.monthNameAr} ${firstHijri.year} هـ`;
    lastHijriLabel = `${lastHijri.day} ${lastHijri.monthNameAr} ${lastHijri.year} هـ`;
    firstHijriYear = firstHijri.year;
  } catch {
    // Keep graceful fallbacks for unsupported dates.
  }

  const monthLinks = GREGORIAN_MONTHS_AR.map((monthName, index) => ({
    label: monthName,
    href: `/date/${y}/${String(index + 1).padStart(2, '0')}/01`,
  }));

  const faqItems = [
    {
      question: `ما هو تقويم عام ${y} الميلادي؟`,
      answer: `تقويم عام ${y} الميلادي هو عرض كامل لجميع شهور وأيام السنة من يناير إلى ديسمبر. يساعدك على تصفح كل يوم ومعرفة ما يوافقه بالتقويم الهجري من الصفحة نفسها.`,
    },
    {
      question: `هل سنة ${y} كبيسة؟`,
      answer: isLeapYear
        ? `نعم، سنة ${y} كبيسة وتحتوي على 366 يوماً. يعني ذلك أن شهر فبراير فيها يأتي بـ29 يوماً بدل 28 يوماً.`
        : `لا، سنة ${y} ليست كبيسة وتحتوي على 365 يوماً. يبقى شهر فبراير فيها مكوّناً من 28 يوماً فقط.`,
    },
    {
      question: `ما التاريخ الهجري الذي يبدأ به عام ${y}؟`,
      answer: `بداية عام ${y} الميلادي توافق تقريباً ${firstHijriLabel}. قد ترى اختلافاً محدوداً بيوم واحد في بعض الجهات إذا اعتمدت طريقة حساب هجري مختلفة عن أم القرى.`,
    },
    {
      question: `كيف أستخدم تقويم ${y} للتحويل بين الميلادي والهجري؟`,
      answer: `استخدم تقويم ${y} بالتنقل إلى الشهر ثم الضغط على اليوم المطلوب للحصول على صفحته التفصيلية. من هناك ستجد التاريخ الهجري الموافق وروابط التحويل بين التقويمين بسرعة.`,
    },
  ];

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'التقويم الميلادي', href: '/date/calendar' },
    { label: `عام ${year}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التقويم الميلادي لعام ${year}`,
    description: `تقويم عام ${year} ميلادي كامل مع تحويل هجري يومي وروابط مباشرة لكل يوم من السنة.`,
    url: `${BASE_URL}/date/calendar/${year}`,
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
      <main className="content-col pt-24 pb-20 mt-12">
        <DateBreadcrumb items={breadcrumb} />

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-border pb-6">
          <nav className="flex items-center justify-between mx-auto w-full">
            <Link
              href={`/date/calendar/${y - 1}`}
              className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors text-primary"
            >
              → {y - 1}
            </Link>
            <h1 className="text-3xl font-black text-accent-alt text-center flex-1">
              التقويم الميلادي — عام {year}
            </h1>
            <Link
              href={`/date/calendar/${y + 1}`}
              className="px-4 py-2 bg-surface-2 border border-border rounded-[var(--radius)] text-sm font-semibold hover:bg-surface-3 transition-colors text-primary"
            >
              {y + 1} ←
            </Link>
          </nav>
        </div>

        <p className="text-secondary text-base mb-8 font-medium">
          تقويم عام {year} الميلادي يعرض أشهر السنة كلها مع ما يوافق كل يوم بالتقويم الهجري وفق تقويم أم القرى. يفيد هذا العرض في التخطيط المسبق، ومراجعة الأعياد والمناسبات، والوصول السريع إلى صفحة أي تاريخ بالتقويمين.
        </p>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'عدد الأيام', value: `${totalDays} يوماً` },
            { label: 'بداية السنة', value: `1 يناير · ${firstDayName}` },
            { label: 'نهاية السنة', value: `31 ديسمبر · ${lastDayName}` },
            { label: 'النطاق الهجري', value: `${firstHijriLabel} — ${lastHijriLabel}` },
          ].map((fact) => (
            <div key={fact.label} className="card text-center">
              <div className="text-base font-black text-accent-alt mb-1">{fact.value}</div>
              <div className="text-xs text-muted font-medium">{fact.label}</div>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <Suspense fallback={<DateCalendarGridSkeleton />}>
            <YearlyCalendar year={y} serverTodayIso={serverTodayIso} />
          </Suspense>
        </section>

        <section className="grid md:grid-cols-2 mb-8" style={{ gap: '16px' }}>
          <article className="card">
            <h2 className="card__title text-lg mb-3">كيف يفيدك تقويم {year}؟</h2>
            <p className="text-sm text-secondary leading-relaxed m-0">
              يفيدك تقويم {year} في متابعة السنة كاملة من شاشة واحدة، ومعرفة توافق التاريخ الميلادي مع الهجري دون الحاجة إلى إدخال يوم بيوم. هذا مفيد للتخطيط الدراسي، والمواعيد الرسمية، والإجازات، وربط المناسبات الهجرية بالتقويم الميلادي.
            </p>
          </article>

          <article className="card">
            <h2 className="card__title text-lg mb-3">هل يتغيّر مقابل التاريخ الهجري؟</h2>
            <p className="text-sm text-secondary leading-relaxed m-0">
              المقابل الهجري في هذه الصفحة مبني على تقويم أم القرى، وهو مرجع رسمي واسع الاستخدام في السعودية ودول الخليج. قد يظهر اختلاف طفيف بيوم واحد في بعض الدول أو الجهات التي تعتمد الحساب الفلكي أو الإعلان المحلي لبداية الشهر.
            </p>
          </article>
        </section>

        <section className="card mb-8">
          <h2 className="card__title text-lg mb-3">شهور عام {year} الميلادي</h2>
          <p className="text-sm text-secondary leading-relaxed mb-4">
            تصفح بداية كل شهر من شهور سنة {year} للوصول إلى اليوم المطلوب بسرعة، أو استخدم روابط الأيام داخل التقويم السنوي إذا كنت تبحث عن تاريخ محدد أو عن مقابل تاريخ هجري بعينه.
          </p>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {monthLinks.map((month) => (
              <Link key={month.href} href={month.href} rel="nofollow" className="chip">
                {month.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-primary mb-5">أسئلة شائعة حول تقويم {year}</h2>
          <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
            {faqItems.map((item) => (
              <article key={item.question} className="card">
                <h3 className="text-base font-bold text-primary mb-2">{item.question}</h3>
                <p className="text-sm text-secondary leading-relaxed m-0">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* NAVIGATION */}
        <nav aria-label="روابط ذات صلة" className="related-links" dir="rtl">
          <p className="related-links__heading">صفحات ذات صلة</p>
          <div className="related-links__grid">

            <Link href="/date" className="related-link-card">
              <span className="related-link-card__icon" aria-hidden="true">
                <CalendarDays size={16} strokeWidth={1.75} />
              </span>
              <span className="related-link-card__body">
                <span className="related-link-card__label">صفحة التاريخ الرئيسية</span>
                <span className="related-link-card__desc">عرض التاريخ الهجري والميلادي</span>
              </span>
              <span className="related-link-card__arrow" aria-hidden="true">←</span>
            </Link>

            <Link href="/date/converter" className="related-link-card">
              <span className="related-link-card__icon" aria-hidden="true">
                <ArrowLeftRight size={16} strokeWidth={1.75} />
              </span>
              <span className="related-link-card__body">
                <span className="related-link-card__label">محول التاريخ</span>
                <span className="related-link-card__desc">تحويل بين الهجري والميلادي</span>
              </span>
              <span className="related-link-card__arrow" aria-hidden="true">←</span>
            </Link>

            <Link href="/date/hijri-to-gregorian" className="related-link-card">
              <span className="related-link-card__icon" aria-hidden="true">
                <Calendar size={16} strokeWidth={1.75} />
              </span>
              <span className="related-link-card__body">
                <span className="related-link-card__label">تحويل هجري إلى ميلادي</span>
                <span className="related-link-card__desc">تحويل مباشر من التقويم الهجري</span>
              </span>
              <span className="related-link-card__arrow" aria-hidden="true">←</span>
            </Link>

            <Link href={`/date/calendar/hijri/${firstHijriYear}`} className="related-link-card">
              <span className="related-link-card__icon" aria-hidden="true">
                <Calendar size={16} strokeWidth={1.75} />
              </span>
              <span className="related-link-card__body">
                <span className="related-link-card__label">التقويم الهجري الموافق</span>
                <span className="related-link-card__desc">ابدأ من عام {firstHijriYear} هـ الموافق لبداية السنة</span>
              </span>
              <span className="related-link-card__arrow" aria-hidden="true">←</span>
            </Link>

          </div>
        </nav>

      </main>
    </>
  );
}
