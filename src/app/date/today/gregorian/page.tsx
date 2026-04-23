// src/app/date/today/gregorian/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, DAY_NAMES_AR } from '@/lib/constants';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Moon, ArrowLeftRight, CalendarDays } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'كم التاريخ الميلادي اليوم؟ | اليوم والشهر والسنة كاملة',
  description: 'اعرف التاريخ الميلادي اليوم مع اليوم من السنة، ورقم الأسبوع، والتاريخ الهجري الموافق وروابط أدوات التاريخ.',
  alternates: { canonical: `${BASE_URL}/date/today/gregorian` },
  openGraph: {
    title: 'كم التاريخ الميلادي اليوم؟',
    description: 'تفاصيل التاريخ الميلادي اليوم مع التاريخ الهجري الموافق وروابط الأدوات.',
    url: `${BASE_URL}/date/today/gregorian`,
    locale: 'ar_SA',
  },
};



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

function getJulianDay(year: number, month: number, day: number): number {
  const jsDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return Math.floor(jsDate.getTime() / 86400000) + 2440587.5;
}

export default function TodayGregorianPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <TodayGregorianDynamicContent />
    </Suspense>
  );
}

async function TodayGregorianDynamicContent() {
  const now = new Date(await getCachedNowIso());
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES_AR[now.getUTCDay()];
  const weekNum = getWeekNumber(now);
  const dayOfYear = getDayOfYear(now);
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;
  const daysLeft = daysInYear - dayOfYear;
  const quarter = Math.ceil(m / 3);
  const jd = getJulianDay(y, m, d);

  let hijri;
  try {
    hijri = convertDate({ date: isoDate, toCalendar: 'hijri', method: 'umalqura' });
  } catch { }

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'اليوم', href: '/date/today' },
    { label: 'ميلادي' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'التاريخ الميلادي اليوم',
    url: `${BASE_URL}/date/today/gregorian`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          {/* HERO */}
          <section className="bg-surface-1 border border-border rounded-[var(--radius)] px-6 py-10 md:py-12 mb-6 text-center shadow-sm">
            <div className="text-sm font-medium text-muted mb-2">
              {dayOfWeek}
            </div>
            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-black text-accent-alt leading-[1.1] m-0 mb-3 md:mb-4">
              {d} {GREGORIAN_MONTHS_AR[m - 1]} {y}
            </h1>
            {hijri && (
              <div className="text-base md:text-lg font-medium text-muted">
                الموافق: <span className="text-primary font-bold ml-1">{hijri.formatted.ar}</span>
              </div>
            )}
          </section>

          {/* DATE FACTS GRID */}
          <section className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'اليوم من السنة', value: `${dayOfYear} / ${daysInYear}` },
              { label: 'أسبوع رقم', value: weekNum },
              { label: 'تبقى للسنة', value: `${daysLeft} يوم` },
              { label: 'ربع السنة', value: `Q${quarter}` },
              { label: 'Julian Day', value: Math.floor(jd).toLocaleString('en') },
              { label: 'ISO 8601', value: isoDate },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-surface-1 border border-border rounded-[var(--radius)] p-4 text-center shadow-sm"
              >
                <div
                  className="text-lg md:text-xl font-bold text-accent-alt"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {f.value}
                </div>
                <div className="text-xs text-muted mt-1.5 font-medium">
                  {f.label}
                </div>
              </div>
            ))}
          </section>

          {/* MONTH INFO */}
          <section className="bg-surface-1 border border-border rounded-[var(--radius)] p-6 mb-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold text-primary mb-4 pb-2 border-b border-border/50">
              معلومات الشهر والسنة
            </h2>
            <div className="flex flex-col gap-1">
              {[
                ['الشهر', GREGORIAN_MONTHS_AR[m - 1]],
                ['عدد أيام الشهر', new Date(y, m, 0).getDate()],
                ['نوع السنة', isLeap ? 'سنة كبيسة (366 يوم)' : 'سنة بسيطة (365 يوم)'],
                ['التاريخ الهجري الموافق', hijri ? hijri.formatted.ar : '—'],
              ].map(([label, val], i, arr) => (
                <div
                  key={i}
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 text-sm ${i < arr.length - 1 ? 'border-b border-border/50' : ''
                    }`}
                >
                  <span className="text-muted font-medium mb-1 sm:mb-0">{label}</span>
                  <span className="font-bold text-primary">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* LINKS */}
          <nav aria-label="روابط ذات صلة" className="related-links mt-8" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">

              <Link href="/date/today/hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الهجري اليوم</span>
                  <span className="related-link-card__desc">اعرف تاريخ اليوم بالتقويم الهجري</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/converter" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <ArrowLeftRight size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">محول التاريخ</span>
                  <span className="related-link-card__desc">تحويل بين الهجري والميلادي بثلاث طرق</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link
                href={`/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`}
                rel="nofollow"
                className="related-link-card"
              >
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">صفحة تاريخ {d} {GREGORIAN_MONTHS_AR[m - 1]}</span>
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
