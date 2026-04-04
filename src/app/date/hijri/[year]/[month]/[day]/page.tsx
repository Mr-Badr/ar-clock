// src/app/date/hijri/[year]/[month]/[day]/page.tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { convertDate } from '@/lib/date-adapter';
import { ISLAMIC_MONTH_NAMES_AR } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { DateNavigation } from '@/components/date/DateNavigation';
import { DateShareActions } from '@/components/date/DateShareActions';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { CalendarDays, ArrowLeftRight, Calendar } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

// NOTE: Static folder 'hijri' takes priority over dynamic '[year]' at the same level.
// This resolves correctly: /date/hijri/... always hits this route, never the [year] route.

const BASE_URL = getSiteUrl();

export async function generateStaticParams() {
  // Build only the current Hijri year; older/future pages render on demand.
  const now = new Date();
  const isoNow = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  let currentHijriYear = 1447;
  try {
    const h = convertDate({ date: isoNow, toCalendar: 'hijri', method: 'umalqura' });
    currentHijriYear = h.year;
  } catch { }

  const params = [];
  for (let hy = currentHijriYear; hy <= currentHijriYear; hy++) {
    for (let hm = 1; hm <= 12; hm++) {
      const daysInMonth = hm % 2 !== 0 ? 30 : 29;
      for (let hd = 1; hd <= daysInMonth; hd++) {
        params.push({
          year: String(hy),
          month: String(hm).padStart(2, '0'),
          day: String(hd).padStart(2, '0'),
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}): Promise<Metadata> {
  const { year, month, day } = await params;
  const hYear = parseInt(year, 10);
  const hMonth = parseInt(month, 10);
  const hDay = parseInt(day, 10);

  let gregorian;
  try {
    const isoHijri = `${year}-${month}-${day}`;
    gregorian = convertDate({ date: isoHijri, toCalendar: 'gregorian', method: 'umalqura' });
  } catch {
    return { title: 'تاريخ هجري غير صالح' };
  }

  const monthAr = ISLAMIC_MONTH_NAMES_AR[hMonth - 1];
  return {
    title: `${hDay} ${monthAr} ${hYear} — ${gregorian.formatted.ar}`,
    description: `تاريخ ${hDay} ${monthAr} ${hYear} هجري يوافق ${gregorian.formatted.ar} ميلادي.`,
    alternates: { canonical: `${BASE_URL}/date/hijri/${year}/${month}/${day}` },
    openGraph: {
      title: `${hDay} ${monthAr} ${hYear} هـ — ${gregorian.formatted.ar}م | مواقيت`,
      url: `${BASE_URL}/date/hijri/${year}/${month}/${day}`,
      locale: 'ar_SA',
    },
  };
}

export default async function ProgrammaticHijriDatePage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;

  // Zero-padding redirect
  if (month.length < 2 || day.length < 2) {
    redirect(`/date/hijri/${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`);
  }

  const hY = parseInt(year, 10);
  const hM = parseInt(month, 10);
  const hD = parseInt(day, 10);

  if (!hY || !hM || !hD || hM < 1 || hM > 12 || hD < 1 || hD > 30) notFound();
  if (hY < 1343 || hY > 1500) redirect('/date/converter');

  const isoHijri = `${year}-${month}-${day}`;

  let gregorian;
  try {
    gregorian = convertDate({ date: isoHijri, toCalendar: 'gregorian', method: 'umalqura' });
  } catch {
    notFound();
  }

  if (!gregorian) notFound();

  const islamicEvents = getIslamicEventsForHijriDate(hY, hM, hD);
  const monthNameAr = ISLAMIC_MONTH_NAMES_AR[hM - 1];

  // Prev/next Hijri day navigation
  const prevHD = hD - 1;
  const nextHD = hD + 1;
  const daysInMonth = hM % 2 !== 0 ? 30 : 29;
  const prevHM = prevHD < 1 ? hM - 1 : hM;
  const prevHDAdj = prevHD < 1 ? (prevHM % 2 !== 0 ? 30 : 29) : prevHD;
  const prevHY = prevHM < 1 ? hY - 1 : hY;
  const prevHMAdj = prevHM < 1 ? 12 : prevHM;

  const nextHM = nextHD > daysInMonth ? hM + 1 : hM;
  const nextHDAdj = nextHD > daysInMonth ? 1 : nextHD;
  const nextHY = nextHM > 12 ? hY + 1 : hY;
  const nextHMAdsj = nextHM > 12 ? 1 : nextHM;

  const fmtNav = (hy: number, hm: number, hd: number) =>
    `/date/hijri/${hy}/${String(hm).padStart(2, '0')}/${String(hd).padStart(2, '0')}`;
  const HIJRI_MONTHS = ISLAMIC_MONTH_NAMES_AR;
  const fmtLabel = (hm: number, hd: number) => `${hd} ${HIJRI_MONTHS[hm - 1]}`;

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'هجري', href: '/date/today/hijri' },
    { label: `${hD} ${monthNameAr} ${hY}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${hD} ${monthNameAr} ${hY} هجري — ${gregorian.formatted.ar}`,
    url: `${BASE_URL}/date/hijri/${year}/${month}/${day}`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `كم يوافق ${hD} ${monthNameAr} ${hY} هجري ميلادياً؟`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${hD} ${monthNameAr} ${hY} هجري يوافق ${gregorian.formatted.ar} ميلادي وفق حساب أم القرى.`,
          },
        },
        {
          '@type': 'Question',
          name: `ما هو موافق شهر ${monthNameAr} ${hY} هجري؟`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `شهر ${monthNameAr} يبدأ تقريباً في ${gregorian.formatted.ar} ميلادي لعام ${hY} هجري.`,
          },
        },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          {/* MAIN RESULT */}
          <section className="bg-surface-1 border border-border rounded-[var(--radius)] overflow-hidden mb-8 shadow-sm">
            <div className="bg-accent-gradient px-6 py-3">
              <span className="text-white/80 text-sm font-medium">
                {gregorian.dayNameAr} · {hD} {monthNameAr} {hY} هـ
              </span>
            </div>
            <div className="px-6 py-8 text-center">
              <h1 className="text-[clamp(1.5rem,5vw,2.75rem)] font-black text-accent-alt leading-[1.2] mb-2 drop-shadow-sm">
                {hD} {monthNameAr} {hY} هجري
              </h1>
              <div className="text-lg text-muted mb-1 font-medium">
                الموافق
              </div>
              <div className="text-[clamp(1.25rem,4vw,2rem)] font-bold text-primary">
                {gregorian.formatted.ar}م
              </div>

              {islamicEvents.length > 0 && (
                <div className="mt-5 bg-success-soft text-success px-4 py-2.5 rounded-[var(--radius)] items-center gap-2 inline-flex shadow-sm ring-1 ring-success/20">
                  <span className="text-lg leading-none">⭐</span>
                  <span className="text-sm font-bold">{islamicEvents.map(e => e.nameAr).join(' • ')}</span>
                </div>
              )}
            </div>
          </section>

          {/* SHARE */}
          <section className="mb-8">
            <DateShareActions
              hijriFormatted={`${hD} ${monthNameAr} ${hY} هـ`}
              gregorianFormatted={gregorian.formatted.ar}
              hijriIso={isoHijri}
              gregorianIso={gregorian.formatted.iso}
              pageUrl={`${BASE_URL}/date/hijri/${year}/${month}/${day}`}
            />
          </section>

          {/* NAVIGATION */}
          <section className="mb-8">
            <DateNavigation
              prevUrl={fmtNav(prevHY, prevHMAdj, prevHDAdj)}
              nextUrl={fmtNav(nextHY, nextHMAdsj, nextHDAdj)}
              prevLabel={fmtLabel(prevHMAdj, prevHDAdj)}
              nextLabel={fmtLabel(nextHMAdsj, nextHDAdj)}
              hubHref="/date/calendar/hijri"
            />
          </section>

          {/* LINKS */}
          <nav aria-label="روابط ذات صلة" className="related-links mt-4" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">

              <Link href="/date" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الرئيسية</span>
                  <span className="related-link-card__desc">عرض التاريخ الهجري والميلادي</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تحويل تاريخ آخر</span>
                  <span className="related-link-card__desc">أداة تحويل التواريخ الهجرية والميلادية</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link
                href={`/date/${gregorian.year}/${String(gregorian.month).padStart(2, '0')}/${String(gregorian.day).padStart(2, '0')}`}
                className="related-link-card"
              >
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة {gregorian.formatted.ar}م</span>
                  <span className="related-link-card__desc">تفاصيل هذا اليوم بالتقويمين</span>
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
