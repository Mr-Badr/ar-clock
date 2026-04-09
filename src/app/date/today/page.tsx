// src/app/date/today/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { GREGORIAN_MONTHS_AR, DAY_NAMES_AR } from '@/lib/constants';
import { isSacredMonth, isRamadan as checkRamadan, getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateShareActions } from '@/components/date/DateShareActions';
import TodayClientHydration from './TodayClientHydration'; // Force TS Server refresh
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Moon, CalendarDays, ArrowLeftRight } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'تاريخ اليوم بالهجري والميلادي - التاريخ الكامل اليوم',
  description: 'اعرف تاريخ اليوم بالهجري والميلادي مع مقارنة طرق الحساب، واليوم من السنة، ورقم الأسبوع، وروابط التحويل والتقويم المرتبطة به.',
  alternates: { canonical: `${BASE_URL}/date/today` },
  openGraph: {
    title: 'تاريخ اليوم بالهجري والميلادي | ميقاتنا',
    description: 'تاريخ اليوم الهجري والميلادي مع مقارنة طرق الحساب وروابط الأدوات المرتبطة.',
    url: `${BASE_URL}/date/today`,
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

export default function TodayPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <TodayDynamicContent />
    </Suspense>
  );
}

async function TodayDynamicContent() {
  const now = new Date(await getCachedNowIso());
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
  } catch (e) {
    // out of range — fallback gracefully
  }

  const hijri = umalqura;
  const isRamadan = hijri ? checkRamadan(hijri.month) : false;
  const isSacred = hijri ? isSacredMonth(hijri.month) : false;
  const islamicEvents = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: 'اليوم' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'تاريخ اليوم',
    description: 'تاريخ اليوم الهجري والميلادي مع مقارنة طرق الحساب',
    url: `${BASE_URL}/date/today`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumbItems, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'كم تاريخ اليوم بالهجري؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: hijri
              ? `تاريخ اليوم بالهجري هو ${hijri.formatted.ar} وفق حساب أم القرى.`
              : 'يمكنك معرفة التاريخ الهجري اليوم عبر هذه الصفحة.',
          },
        },
        {
          '@type': 'Question',
          name: 'ما هو التاريخ الميلادي اليوم؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `التاريخ الميلادي اليوم هو ${gregorianFormatted}.`,
          },
        },
      ],
    },
  };

  return (
    <>
      <TodayClientHydration serverDate={isoDate} />
      <JsonLd data={jsonLd} />

      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumbItems} />

          <section className="bg-surface-1 border border-border rounded-[var(--radius)] overflow-hidden mb-6 shadow-sm">
            {/* Header row */}
            <div
              className="px-6 py-3 flex justify-between items-center"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <h1 className="text-lg md:text-xl font-bold text-on-accent m-0 flex items-center gap-2">
                تاريخ اليوم — {dayOfWeek}
              </h1>
              <span className="text-white/75 text-sm font-medium">
                {gregorianFormatted}
              </span>
            </div>

            {/* Date cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border/50">
              {/* Hijri */}
              <div className="p-8 pb-10">
                <div className="text-sm font-semibold text-muted mb-2 flex items-center gap-1.5">
                  🌙 التاريخ الهجري
                </div>
                {hijri ? (
                  <>
                    <div className="text-5xl md:text-6xl font-black text-accent-alt leading-none mb-1">
                      {hijri.day}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                      {hijri.monthNameAr}
                    </div>
                    <div className="text-xl md:text-2xl font-semibold text-secondary mb-3">
                      {hijri.year} هـ
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {isRamadan && (
                        <span className="bg-warning-soft text-warning px-3 py-1 rounded-full text-xs font-semibold">
                          🌙 شهر رمضان المبارك
                        </span>
                      )}
                      {isSacred && !isRamadan && (
                        <span className="bg-accent-soft text-accent-alt px-3 py-1 rounded-full text-xs font-semibold">
                          شهر حرام
                        </span>
                      )}
                      {islamicEvents.length > 0 && (
                        <span className="bg-success-soft text-success px-3 py-1 rounded-full text-xs font-semibold">
                          ⭐ {islamicEvents.map(e => e.nameAr).join('، ')}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-muted">خارج النطاق المدعوم</div>
                )}
              </div>

              {/* Gregorian */}
              <div className="p-8 pb-10 bg-surface-2/30">
                <div className="text-sm font-semibold text-muted mb-2 flex items-center gap-1.5">
                  🗓️ التاريخ الميلادي
                </div>
                <div className="text-5xl md:text-6xl font-black text-accent-alt leading-none mb-1">
                  {d}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {GREGORIAN_MONTHS_AR[m - 1]}
                </div>
                <div className="text-xl md:text-2xl font-semibold text-secondary">
                  {y}م
                </div>
              </div>
            </div>

            {/* Share bar */}
            <div className="p-4 md:px-6 md:py-4 border-t border-border bg-surface-1">
              <DateShareActions
                hijriFormatted={hijri ? hijri.formatted.ar : ''}
                gregorianFormatted={gregorianFormatted}
                hijriIso={hijri ? hijri.formatted.iso : ''}
                gregorianIso={isoDate}
                pageUrl={`${BASE_URL}/date/today`}
              />
            </div>
          </section>

          {/* DATE FACTS ROW */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'اليوم من السنة', value: `${dayOfYear} / ${daysInYear}` },
              { label: 'رقم الأسبوع', value: `الأسبوع ${weekNum}` },
              { label: 'تبقى حتى نهاية السنة', value: `${daysLeft} يوم` },
              { label: 'Julian Day', value: hijri ? Math.floor(hijri.julianDay).toLocaleString('en') : '—' },
            ].map((fact, i) => (
              <div
                key={i}
                className="bg-surface-1 border border-border rounded-[var(--radius)] p-4 text-center shadow-sm"
              >
                <div className="text-lg md:text-xl font-bold text-accent-alt">
                  {fact.value}
                </div>
                <div className="text-xs text-muted mt-1 font-medium">
                  {fact.label}
                </div>
              </div>
            ))}
          </section>

          {/* METHOD COMPARISON TABLE */}
          {umalqura && astronomical && civil && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                مقارنة طرق الحساب الثلاثة
              </h2>
              <MethodComparisonTable
                gregorianDate={isoDate}
                umalqura={umalqura}
                astronomical={astronomical}
                civil={civil}
              />
              <p className="text-xs md:text-sm text-secondary mt-3">
                * قد يختلف التاريخ بيوم واحد بين الطرق المختلفة بناءً على معايير الحساب والرؤية.
              </p>
            </section>
          )}

          {/* QUICK LINKS */}
          <nav aria-label="روابط ذات صلة" className="related-links" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">

              <Link href="/date/today/hijri" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Moon size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تفاصيل التاريخ الهجري</span>
                  <span className="related-link-card__desc">بثلاث طرق حساب مع المناسبات</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/today/gregorian" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">تفاصيل التاريخ الميلادي</span>
                  <span className="related-link-card__desc">معلومات تفصيلية عن يوم اليوم</span>
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

            </div>
          </nav>
        </main>
      </AdLayoutWrapper>
    </>
  );
}
