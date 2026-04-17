// src/app/date/today/hijri/page.tsx — FULL REDESIGN
// ─────────────────────────────────────────────────────────────────────────────
// IMPROVEMENTS over old version:
//   • Ramadan hero: deep dark sky gradient + moon decoration
//   • Moon phase progress bar for current Hijri month
//   • Month significance card (educational, SEO-rich)
//   • Better stats grid (4 stats, tabular-nums)
//   • Method comparison with .table-wrapper .table CSS classes
//   • Uses .card, .card-nested, .btn .btn-primary CSS classes
//   • No inline gradient styles on interactive buttons
//
// KEYWORDS:
//   كم التاريخ الهجري اليوم · التاريخ الهجري الآن · تاريخ اليوم بالهجري
//   رمضان كريم · شهر رمضان · الشهر الهجري الحالي · أم القرى اليوم
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { DAY_NAMES_AR, GREGORIAN_MONTHS_AR } from '@/lib/constants';
import { isSacredMonth, isRamadan as checkRamadan, getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { MethodComparisonTable } from '@/components/date/MethodComparisonTable';
import { DateShareActions } from '@/components/date/DateShareActions';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { Moon, CalendarDays, ArrowLeftRight, Calendar, Star } from 'lucide-react';
import { getCachedNowIso } from '@/lib/date-utils';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'كم التاريخ الهجري اليوم؟ | أم القرى والتحويل والتقويم',
  description:
    'اعرف التاريخ الهجري اليوم بتقويم أم القرى والحساب الفلكي والمدني، مع مقارنة الطرق، ومعلومات الشهر الحالي، والمناسبات الإسلامية المرتبطة به.',
  alternates: { canonical: `${BASE_URL}/date/today/hijri` },
  openGraph: {
    title: 'كم التاريخ الهجري اليوم؟',
    description: 'التاريخ الهجري اليوم مع مقارنة طرق الحساب والتقويم والمناسبات الإسلامية.',
    url: `${BASE_URL}/date/today/hijri`,
    locale: 'ar_SA',
  },
};

const MONTH_ORDINALS = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];

const MONTH_SIGNIFICANCE: Record<number, string> = {
  1: 'محرم من الأشهر الحرم. يوم عاشوراء (10 محرم) يوم عظيم يُستحب صومه.',
  2: 'شهر صفر — لا حرمة خاصة له، وما يُشاع عنه من التشاؤم مردود في الإسلام.',
  3: 'ربيع الأول — شهر ميلاد النبي محمد ﷺ (12 ربيع الأول). يحتفل كثير من المسلمين بالمولد النبوي الشريف.',
  4: 'ربيع الثاني — يعقب ربيع الأول ويُكمل فصل الربيع الهجري.',
  5: 'جمادى الأولى — سُمّي بهذا الاسم لتزامن بداية العرب تسمية الأشهر مع تجمّد الماء شتاءً.',
  6: 'جمادى الثانية — يعقب جمادى الأولى ويكمل الفصل الخامس والسادس.',
  7: 'رجب من الأشهر الحرم الأربعة. يُصادف فيه ليلة الإسراء والمعراج (27 رجب).',
  8: 'شعبان — شهر عظيم. قال النبي ﷺ: "ذاك شهر يغفل الناس عنه بين رجب ورمضان".',
  9: 'رمضان المبارك — شهر الصيام والقرآن وليلة القدر خير من ألف شهر.',
  10: 'شوال — عيد الفطر (1 شوال). ويُستحب صيام ست منه تعادل صيام السنة كاملة.',
  11: 'ذو القعدة من الأشهر الحرم. يبدأ فيه موسم الحج وتحرم فيه المقاتلة.',
  12: 'ذو الحجة — شهر الحج ويوم عرفة (9) وعيد الأضحى (10). العشر الأوائل منه من أفضل الأيام.',
};

export default function TodayHijriPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <TodayHijriDynamicContent />
    </Suspense>
  );
}

async function TodayHijriDynamicContent() {
  const now = new Date(await getCachedNowIso());
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
  } catch { /* */ }

  const hijri = umalqura;
  const isRam = hijri ? checkRamadan(hijri.month) : false;
  const isSacred = hijri ? isSacredMonth(hijri.month) : false;
  const events = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];
  const daysInMonth = hijri ? (hijri.month % 2 !== 0 ? 30 : 29) : 30;
  const progress = hijri ? Math.round((hijri.day / daysInMonth) * 100) : 0;
  const daysLeft = hijri ? daysInMonth - hijri.day : 0;
  const significance = hijri ? MONTH_SIGNIFICANCE[hijri.month] : '';

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
    description: hijri ? `التاريخ الهجري اليوم هو ${hijri.formatted.ar} الموافق ${d}/${m}/${y} ميلادي.` : 'التاريخ الهجري اليوم',
    url: `${BASE_URL}/date/today/hijri`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'كم التاريخ الهجري اليوم؟', acceptedAnswer: { '@type': 'Answer', text: hijri ? `التاريخ الهجري اليوم هو ${hijri.formatted.ar} وفق تقويم أم القرى.` : 'يمكن الاطلاع على التاريخ الهجري اليوم في هذه الصفحة.' } },
        { '@type': 'Question', name: 'هل اليوم في رمضان؟', acceptedAnswer: { '@type': 'Answer', text: isRam ? `نعم، اليوم ${hijri?.day} رمضان ${hijri?.year} هـ.` : `لا، الشهر الحالي هو ${hijri?.monthNameAr}.` } },
        { '@type': 'Question', name: 'ما الفرق بين أم القرى والحساب الفلكي؟', acceptedAnswer: { '@type': 'Answer', text: 'أم القرى هو التقويم الرسمي للسعودية ودول الخليج. الفلكي تتبعه مصر والمغرب والأردن. قد يختلفان بيوم واحد.' } },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          {/* ── HERO ───────────────────────────────────────────────────── */}
          <section
            className="relative overflow-hidden rounded-2xl mb-6 shadow-sm text-center"
            style={{
              background: isRam
                ? 'linear-gradient(135deg, #0f0621 0%, #1a1040 50%, #0d1117 100%)'
                : 'var(--bg-surface-1)',
              border: isRam
                ? '1px solid rgba(90,63,160,0.5)'
                : '1px solid var(--border-subtle)',
              padding: '40px 24px 32px',
            }}
          >
            {isRam && (
              <div
                className="absolute top-4 right-6 text-5xl select-none pointer-events-none"
                style={{ opacity: 0.18 }} aria-hidden="true"
              >
                ☪️
              </div>
            )}

            <div className="text-sm font-medium text-muted mb-3">{dayOfWeek}</div>

            {hijri ? (
              <>
                <h1
                  className="font-black leading-tight mb-2 m-0"
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    color: isRam ? '#c8a0ff' : 'var(--accent-alt)',
                  }}
                >
                  {hijri.day} {hijri.monthNameAr} {hijri.year}
                </h1>
                <div
                  className="text-lg font-medium mb-4"
                  style={{ color: isRam ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)' }}
                >
                  هجري
                </div>

                {isRam && (
                  <div
                    className="inline-block rounded-2xl mb-4 text-base font-bold"
                    style={{
                      background: 'rgba(255,209,102,0.15)',
                      border: '1px solid rgba(255,209,102,0.3)',
                      color: '#FFD166',
                      padding: '10px 24px',
                    }}
                  >
                    🌙 رمضان المبارك — اليوم {hijri.day} من {daysInMonth}
                  </div>
                )}

                {events.length > 0 && (
                  <div className="inline-block mb-4">
                    <span className="badge badge-success text-sm" style={{ padding: '8px 16px' }}>
                      ⭐ {events.map(e => e.nameAr).join(' • ')}
                    </span>
                  </div>
                )}

                {isSacred && !isRam && (
                  <div className="inline-block mb-4">
                    <span className="badge badge-accent text-sm" style={{ padding: '6px 16px' }}>
                      من الأشهر الحرم
                    </span>
                  </div>
                )}

                <div
                  className="text-base font-medium"
                  style={{ color: isRam ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}
                >
                  الموافق{' '}
                  <span dir="ltr" className="font-bold" style={{ color: isRam ? 'rgba(255,255,255,0.8)' : 'var(--text-primary)' }}>
                    {String(d).padStart(2, '0')}/{String(m).padStart(2, '0')}/{y}
                  </span>م
                </div>
              </>
            ) : (
              <div className="text-muted">تعذر تحميل التاريخ الهجري</div>
            )}
          </section>

          {/* ── MONTH PROGRESS ────────────────────────────────────────── */}
          {hijri && (
            <section className="card mb-6">
              <div className="flex justify-between items-center mb-3 text-sm text-secondary">
                <span className="font-bold">تقدم شهر {hijri.monthNameAr}</span>
                <span className="font-medium tabular-nums">يوم {hijri.day} من {daysInMonth} — تبقى {daysLeft} يوم</span>
              </div>
              <div className="progress-track mb-3">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    background: isRam
                      ? 'linear-gradient(90deg, #c8a0ff, #FFD166)'
                      : 'var(--accent-gradient)',
                    transition: 'width 0.7s ease-out',
                  }}
                />
              </div>
              {significance && (
                <p className="text-xs text-muted leading-relaxed m-0">{significance}</p>
              )}
            </section>
          )}

          {/* ── STATS GRID ────────────────────────────────────────────── */}
          {hijri && (
            <section className="grid grid-cols-2 md:grid-cols-4 mb-8" style={{ gap: '12px' }}>
              {[
                { label: 'اليوم من الشهر', value: `${hijri.day} / ${daysInMonth}` },
                { label: 'اليوم من السنة', value: `${hijri.dayOfYear} / ${hijri.daysInYear}` },
                { label: 'الشهر', value: MONTH_ORDINALS[(hijri.month ?? 1) - 1] },
                { label: 'تبقى للسنة', value: `${hijri.daysInYear - hijri.dayOfYear} يوم` },
              ].map((s, i) => (
                <div key={i} className="card text-center">
                  <div className="text-base font-black tabular-nums text-accent-alt mb-1">{s.value}</div>
                  <div className="text-xs text-muted font-medium">{s.label}</div>
                </div>
              ))}
            </section>
          )}

          {/* ── METHOD COMPARISON ─────────────────────────────────────── */}
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

          {/* ── EDUCATIONAL SECTION ────────────────────────────────────── */}
          <section className="card mb-8">
            <h2 className="card__title mb-4">كيف يُحسب التاريخ الهجري؟</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p className="text-sm text-secondary leading-relaxed m-0">
                التقويم الهجري تقويم قمري يعتمد على دورة اقتران القمر (29.5 يوماً). لذا تتناوب أشهره بين 29 و30 يوماً، والسنة الهجرية 354 أو 355 يوماً — أقصر من الميلادية بـ11 يوماً.
              </p>
              <p className="text-sm text-secondary leading-relaxed m-0">
                <strong className="text-primary">تقويم أم القرى</strong> المستخدم في السعودية ودول الخليج يعتمد الحساب الفلكي المسبق. أما الدول التي تتبع <strong className="text-primary">الحساب الفلكي</strong> (مصر، المغرب، الأردن) فتعتمد رصد الهلال الفعلي، وقد يختلف التاريخ بيوم واحد بين الطرق.
              </p>
            </div>
          </section>

          {/* ── SHARE ─────────────────────────────────────────────────── */}
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

          {/* ── FOOTER NAV ─────────────────────────────────────────────── */}
          <nav aria-label="روابط ذات صلة" className="related-links" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">

              <Link href="/date/today/gregorian" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التاريخ الميلادي اليوم</span>
                  <span className="related-link-card__desc">تفاصيل اليوم بالتقويم الميلادي</span>
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
                  <span className="related-link-card__desc">تحويل بين الهجري والميلادي بثلاث طرق</span>
                </span>
                <span className="related-link-card__arrow" aria-hidden="true">←</span>
              </Link>

              <Link href="/date/hijri-to-gregorian" className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">هجري إلى ميلادي</span>
                  <span className="related-link-card__desc">تحويل مباشر من التقويم الهجري</span>
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
                    <span className="related-link-card__desc">عرض هذا اليوم بالتقويم الهجري</span>
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
