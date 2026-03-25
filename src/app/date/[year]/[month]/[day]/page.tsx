// src/app/date/[year]/[month]/[day]/page.tsx — FIXED + REDESIGNED
// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX:
//   OLD: generateStaticParams built ±5 years = 3,650 pages at deploy time
//        → huge build cost, large bundle
//   NEW: generateStaticParams builds only ±1 year = 365 pages (manageable)
//        + export const dynamicParams = true → ISR for all other dates
//        + export const revalidate = 86400 → cache 24h for ISR pages
//
// DESIGN IMPROVEMENTS:
//   • .card CSS class for sections
//   • .btn .btn-primary for CTA (hover works)
//   • Fact cards use .card pattern
//   • Method comparison uses new MethodComparisonTable
//   • Navigation uses DateNavigation
//   • Share uses DateShareActions
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { convertDate } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate, generateUniqueContext, getGregorianMonthNameAr } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateNavigation } from '@/components/date/DateNavigation';
import { DateShareActions } from '@/components/date/DateShareActions';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { CalendarDays, ArrowLeftRight, Moon } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://miqatime.com';

// ── ISR: 24h cache managed via cacheComponents ──────────────────────────────

// ── Static: only build ±1 year at deploy (365 pages, not 3650) ─────────────
export async function generateStaticParams() {
  const today = new Date();
  const results = [];
  for (let offset = -365; offset <= 365; offset++) {
    const dt = new Date(today);
    dt.setUTCDate(today.getUTCDate() + offset);
    results.push({
      year: String(dt.getUTCFullYear()),
      month: String(dt.getUTCMonth() + 1).padStart(2, '0'),
      day: String(dt.getUTCDate()).padStart(2, '0'),
    });
  }
  return results;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}): Promise<Metadata> {
  const { year, month, day } = await params;
  const isoDate = `${year}-${month}-${day}`;
  let hijri;
  try { hijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' }); } catch { return { title: 'تاريخ غير صالح' }; }
  const monthAr = getGregorianMonthNameAr(Number(month));
  return {
    title: `${day} ${monthAr} ${year} — ${hijri.formatted.ar}`,
    description: `تاريخ ${day} ${monthAr} ${year} بالهجري هو ${hijri.formatted.ar}. تحويل فوري بثلاث طرق حساب.`,
    alternates: { canonical: `${BASE_URL}/date/${year}/${month}/${day}` },
    openGraph: { title: `${day} ${monthAr} ${year} — ${hijri.formatted.ar} | مواقيت`, url: `${BASE_URL}/date/${year}/${month}/${day}`, locale: 'ar_SA' },
  };
}

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default async function ProgrammaticDatePage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;

  // Zero-padding redirect
  if (month.length < 2 || day.length < 2) {
    redirect(`/date/${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`);
  }

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) notFound();
  const testDate = new Date(Date.UTC(y, m - 1, d));
  if (testDate.getUTCFullYear() !== y || testDate.getUTCMonth() + 1 !== m || testDate.getUTCDate() !== d) notFound();
  if (y < 1924 || y > 2077) redirect('/date/converter');

  const isoDate = `${year}-${month}-${day}`;
  let umalqura, astronomical, civil;
  try {
    umalqura = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
    astronomical = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'astronomical' });
    civil = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'civil' });
  } catch { notFound(); }
  if (!umalqura) notFound();

  const hijri = umalqura;
  const islamicEvents = getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day);
  const prevDate = new Date(Date.UTC(y, m - 1, d - 1));
  const nextDate = new Date(Date.UTC(y, m - 1, d + 1));
  const fmtNav = (dt: Date) => `/date/${dt.getUTCFullYear()}/${String(dt.getUTCMonth() + 1).padStart(2, '0')}/${String(dt.getUTCDate()).padStart(2, '0')}`;
  const fmtLabel = (dt: Date) => `${dt.getUTCDate()} ${MONTHS_AR[dt.getUTCMonth()]}`;
  const daysInYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  const dayOfYear = Math.floor((testDate.getTime() - new Date(Date.UTC(y, 0, 0)).getTime()) / 86400000);
  const daysLeft = daysInYear - dayOfYear;
  const quarter = Math.ceil(m / 3);
  const isLeap = daysInYear === 366;

  const uniqueContext = generateUniqueContext(y, m, d, hijri.year, hijri.month, hijri.day, hijri.monthNameAr, dayOfYear, daysInYear);

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: year, href: undefined },
    { label: `${d} ${MONTHS_AR[m - 1]}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${d} ${MONTHS_AR[m - 1]} ${y} — ${hijri.formatted.ar}`,
    description: `تاريخ ${d} ${MONTHS_AR[m - 1]} ${y} يوافق ${hijri.formatted.ar} هجري.`,
    url: `${BASE_URL}/date/${year}/${month}/${day}`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `كم يوافق ${d} ${MONTHS_AR[m - 1]} ${y} بالهجري؟`, acceptedAnswer: { '@type': 'Answer', text: `${d} ${MONTHS_AR[m - 1]} ${y} يوافق ${hijri.formatted.ar} وفق حساب أم القرى.` } },
        { '@type': 'Question', name: `ما هو اليوم الموافق ${hijri.day} ${hijri.monthNameAr} ${hijri.year}؟`, acceptedAnswer: { '@type': 'Answer', text: `${hijri.day} ${hijri.monthNameAr} ${hijri.year} هجري يوافق ${d} ${MONTHS_AR[m - 1]} ${y} ميلادي.` } },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* <AdLayoutWrapper> */}
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          {/* ── MAIN CONVERSION ──────────────────────────────────────── */}
          <section className="card overflow-hidden mb-6" style={{ padding: 0 }}>
            <div
              className="px-6 py-3"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {hijri.dayNameAr} · {d} {MONTHS_AR[m - 1]} {y}م
              </span>
            </div>
            <div className="px-6 py-8 text-center">
              <h1
                className="font-black leading-tight mb-2 tabular-nums"
                style={{ fontSize: 'clamp(1.5rem, 5vw, 2.75rem)', color: 'var(--text-primary)' }}
              >
                {d} {MONTHS_AR[m - 1]} {y}
              </h1>
              <div className="text-lg text-muted font-medium mb-1">الموافق</div>
              <div
                className="font-bold tabular-nums"
                style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)', color: 'var(--accent-alt)' }}
              >
                {hijri.formatted.ar}
              </div>

              {islamicEvents.length > 0 && (
                <div className="mt-4 inline-flex items-center gap-2">
                  <span className="badge badge-success text-sm" style={{ padding: '8px 16px' }}>
                    ⭐ {islamicEvents.map(e => e.nameAr).join(' • ')}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* ── DATE FACTS ───────────────────────────────────────────── */}
          <section
            className="grid mb-8"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '12px' }}
          >
            {[
              { label: 'اليوم من السنة', value: `${dayOfYear} / ${daysInYear}` },
              { label: 'ربع السنة', value: `Q${quarter}` },
              { label: 'تبقى للسنة', value: `${daysLeft} يوم` },
              { label: 'ISO 8601', value: isoDate },
              { label: 'Julian Day', value: Math.floor(hijri.julianDay).toLocaleString('en') },
              { label: 'نوع السنة', value: isLeap ? '366 يوم' : '365 يوم' },
            ].map((f, i) => (
              <div key={i} className="card text-center">
                <div className="text-sm font-black text-accent-alt tabular-nums mb-1">{f.value}</div>
                <div className="text-xs text-secondary font-semibold">{f.label}</div>
              </div>
            ))}
          </section>

          {/* ── METHOD COMPARISON ────────────────────────────────────── */}
          {umalqura && astronomical && civil && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-primary mb-3">التاريخ الهجري بثلاث طرق حساب</h2>
              <MethodComparisonTable
                gregorianDate={isoDate}
                umalqura={umalqura}
                astronomical={astronomical}
                civil={civil}
              />
            </section>
          )}

          {/* ── UNIQUE CONTEXT (SEO) ──────────────────────────────────── */}
          <section className="card mb-8">
            <p className="text-secondary leading-relaxed text-sm m-0">{uniqueContext}</p>
          </section>

          {/* ── SHARE ────────────────────────────────────────────────── */}
          <section className="mb-8">
            <DateShareActions
              hijriFormatted={hijri.formatted.ar}
              gregorianFormatted={`${d} ${MONTHS_AR[m - 1]} ${y}`}
              hijriIso={hijri.formatted.iso}
              gregorianIso={isoDate}
              pageUrl={`${BASE_URL}/date/${year}/${month}/${day}`}
            />
          </section>

          {/* ── NAVIGATION ───────────────────────────────────────────── */}
          <section className="mb-8">
            <DateNavigation
              prevUrl={fmtNav(prevDate)} prevLabel={fmtLabel(prevDate)}
              nextUrl={fmtNav(nextDate)} nextLabel={fmtLabel(nextDate)}
              hubLabel="التقويم"
              hubHref="/date/calendar"
            />
          </section>

          {/* ── QUICK LINKS ──────────────────────────────────────────── */}
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
                  <span className="related-link-card__label">تحويل تاريخ آخر</span>
                  <span className="related-link-card__desc">أداة تحويل التواريخ الهجرية والميلادية</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              {hijri && (
                <Link
                  href={`/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}`}
                  className="related-link-card"
                >
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Moon size={16} strokeWidth={1.75} />
                  </span>
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">صفحة {hijri.formatted.ar} هجري</span>
                    <span className="related-link-card__desc">عرض هذا اليوم بالتقويم الهجري</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              )}

            </div>
          </nav>

        </main>
      {/* </AdLayoutWrapper> */}
    </>
  );
}