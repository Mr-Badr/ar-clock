// src/app/date/page.tsx — DATE HUB (complete new page)
// ─────────────────────────────────────────────────────────────────────────────
// This page did not exist before (was empty or minimal).
//
// STRUCTURE:
//   1. Hero — today's date in both calendars (immediate value)
//   2. Tools grid — 8 quick-access cards linking to all sub-routes
//   3. Popular dates — chips for common searches
//   4. SEO editorial — 4 topic cards explaining all features
//   5. FAQ JSON-LD — targets People Also Ask positions
//
// KEYWORDS:
//   تاريخ اليوم · التاريخ الهجري اليوم · تحويل التاريخ · التقويم الهجري
//   كم التاريخ اليوم · الهجري والميلادي · تاريخ اليوم بالهجري · التقويم الهجري
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { convertDate } from '@/lib/date-adapter';
import { getIslamicEventsForHijriDate } from '@/lib/islamic-holidays';
import { JsonLd } from '@/components/date/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { headers } from 'next/headers';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import { ArrowLeftRight, Moon, CalendarDays, Calendar } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'التاريخ الهجري والميلادي اليوم — تحويل وتقويم شامل',
  description:
    'تاريخ اليوم الهجري والميلادي لحظةً بلحظة. محول التاريخ بثلاث طرق حساب. التقويم الهجري والميلادي الكامل. الأداة الأشمل للتواريخ الإسلامية باللغة العربية.',
  alternates: { canonical: `${BASE_URL}/date` },
  openGraph: {
    title: 'التاريخ الهجري والميلادي اليوم | مواقيت',
    description: 'تاريخ اليوم + محول التاريخ + التقويم الهجري الكامل',
    url: `${BASE_URL}/date`,
    locale: 'ar_SA',
  },
};

const GREGORIAN_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function DateHubPage() {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-surface-1" />}>
      <DateHubDynamicContent />
    </Suspense>
  );
}

async function DateHubDynamicContent() {
  await headers();

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dayOfWeek = DAY_NAMES[now.getUTCDay()];
  const monthAr = GREGORIAN_MONTHS[m - 1];

  let hijri;
  try { hijri = convertDate({ date: iso, toCalendar: 'hijri', method: 'umalqura' }); } catch { /**/ }

  const events = hijri ? getIslamicEventsForHijriDate(hijri.year, hijri.month, hijri.day) : [];

  const breadcrumb = [{ label: 'الرئيسية', href: '/' }, { label: 'التاريخ' }];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'مركز التاريخ الهجري والميلادي',
    description: 'تاريخ اليوم الهجري والميلادي مع أدوات تحويل شاملة',
    url: `${BASE_URL}/date`,
    breadcrumb: buildBreadcrumbJsonLd(breadcrumb, BASE_URL),
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'كم تاريخ اليوم بالهجري؟',
          acceptedAnswer: { '@type': 'Answer', text: hijri ? `تاريخ اليوم بالهجري هو ${hijri.formatted.ar} وفق تقويم أم القرى.` : 'يمكنك معرفة التاريخ الهجري اليوم عبر هذه الصفحة.' },
        },
        {
          '@type': 'Question',
          name: 'كيف أحوّل تاريخاً من ميلادي إلى هجري؟',
          acceptedAnswer: { '@type': 'Answer', text: 'استخدم محول التاريخ: أدخل التاريخ الميلادي واختر «ميلادي إلى هجري» ثم اضغط تحويل.' },
        },
        {
          '@type': 'Question',
          name: 'ما الفرق بين تقويم أم القرى والحساب الفلكي؟',
          acceptedAnswer: { '@type': 'Answer', text: 'أم القرى هو التقويم الرسمي للسعودية ودول الخليج. الحساب الفلكي تتبعه مصر والمغرب والأردن. قد يختلفان بيوم واحد.' },
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

          {/* ── HERO: Today's date ──────────────────────────────────────── */}
          <section
            className="rounded-2xl overflow-hidden mb-8 shadow-sm"
            style={{ border: '1px solid var(--border-subtle)' }}
            aria-label="تاريخ اليوم"
          >
            {/* Header strip */}
            <div
              className="flex items-center justify-between flex-wrap px-6 py-3"
              style={{ background: 'var(--accent-gradient)', gap: '8px' }}
            >
              <h1 className="text-base font-bold m-0" style={{ color: '#fff' }}>
                تاريخ اليوم — {dayOfWeek}
              </h1>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {d} {monthAr} {y}م
              </span>
            </div>

            {/* Dual display */}
            <div
              className="grid grid-cols-1 md:grid-cols-2"
            >
              {/* Hijri */}
              <div
                className="px-6 py-8 text-center"
                style={{ borderBottom: '1px solid var(--border-subtle)', borderLeft: 'none' }}
              >
                <div className="text-xs font-semibold text-muted mb-3 flex items-center justify-center gap-1.5">
                  🌙 التاريخ الهجري (أم القرى)
                </div>
                {hijri ? (
                  <>
                    <div
                      className="font-black leading-none tabular-nums mb-1"
                      style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', color: 'var(--accent-alt)' }}
                    >
                      {hijri.day}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-0.5">{hijri.monthNameAr}</div>
                    <div className="text-xl font-semibold text-secondary mb-4">{hijri.year} هـ</div>
                    {events.length > 0 && (
                      <span className="badge badge-success text-sm px-4 py-2">
                        ⭐ {events.map(e => e.nameAr).join(' • ')}
                      </span>
                    )}
                  </>
                ) : <div className="text-muted">—</div>}
                <Link
                  href="/date/today/hijri"
                  className="block mt-4 text-xs font-semibold text-accent-alt hover:text-accent transition-colors"
                >
                  تفاصيل التاريخ الهجري ←
                </Link>
              </div>

              {/* Gregorian */}
              <div
                className="px-6 py-8 text-center"
                style={{ background: 'var(--bg-surface-2)' }}
              >
                <div className="text-xs font-semibold text-muted mb-3 flex items-center justify-center gap-1.5">
                  🗓️ التاريخ الميلادي
                </div>
                <div
                  className="font-black leading-none tabular-nums mb-1"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', color: 'var(--text-primary)' }}
                >
                  {d}
                </div>
                <div className="text-2xl font-bold text-primary mb-0.5">{monthAr}</div>
                <div className="text-xl font-semibold text-secondary mb-4">{y}م</div>
                <Link
                  href={`/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`}
                  className="block text-xs font-semibold text-accent-alt hover:text-accent transition-colors"
                >
                  صفحة {d} {monthAr} {y} ←
                </Link>
              </div>
            </div>
          </section>

          {/* ── TOOLS GRID ──────────────────────────────────────────────── */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">أدوات التاريخ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: '12px' }}>
              {[
                { href: '/date/converter', icon: '🔄', title: 'محول التاريخ', sub: 'هجري ↔ ميلادي', primary: true },
                { href: '/date/today/hijri', icon: '🌙', title: 'التاريخ الهجري اليوم', sub: 'بثلاث طرق حساب' },
                { href: '/date/today/gregorian', icon: '🗓️', title: 'التاريخ الميلادي اليوم', sub: 'تفاصيل السنة' },
                { href: '/date/gregorian-to-hijri', icon: '📅', title: 'ميلادي → هجري', sub: 'تحويل مباشر' },
                { href: '/date/hijri-to-gregorian', icon: '📿', title: 'هجري → ميلادي', sub: 'تحويل مباشر' },
                { href: `/date/calendar/${y}`, icon: '📆', title: `تقويم ${y}`, sub: 'ميلادي + هجري' },
                { href: `/date/calendar/hijri/${hijri?.year ?? 1447}`, icon: '🗓', title: `تقويم ${hijri?.year ?? 1447} هـ`, sub: 'هجري كامل' },
                { href: '/date/country/saudi-arabia', icon: '🌍', title: 'التاريخ حسب الدولة', sub: '22+ دولة عربية' },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="card card-hover"
                  style={{
                    ...(tool.primary ? { borderColor: 'var(--border-accent-strong)', background: 'var(--accent-soft)' } : {}),
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">{tool.icon}</span>
                  <span
                    className="text-sm font-bold leading-tight"
                    style={{ color: tool.primary ? 'var(--accent-alt)' : 'var(--text-primary)' }}
                  >
                    {tool.title}
                  </span>
                  <span className="text-xs text-muted">{tool.sub}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── POPULAR QUICK LINKS ────────────────────────────────────── */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">تواريخ شائعة</h2>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {[
                { label: 'اليوم', href: '/date/today' },
                { label: `${d} ${monthAr} ${y}م`, href: `/date/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}` },
                ...(hijri ? [
                  { label: `${hijri.day} ${hijri.monthNameAr} ${hijri.year} هـ`, href: `/date/hijri/${hijri.year}/${String(hijri.month).padStart(2, '0')}/${String(hijri.day).padStart(2, '0')}` },
                  { label: `1 رمضان ${hijri.year}`, href: `/date/hijri/${hijri.year}/09/01` },
                  { label: `1 محرم ${hijri.year + 1}`, href: `/date/hijri/${hijri.year + 1}/01/01` },
                  { label: `تقويم ${hijri.year} هـ`, href: `/date/calendar/hijri/${hijri.year}` },
                ] : []),
                { label: `تقويم ${y}م`, href: `/date/calendar/${y}` },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="chip"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── SEO EDITORIAL ──────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-5">كل ما تحتاجه عن التاريخ الهجري والميلادي</h2>
            <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
              {[
                {
                  icon: '🌙',
                  title: 'التاريخ الهجري اليوم',
                  body: 'التقويم الهجري تقويم قمري يعتمد على دورة القمر. يتحرك 11 يوماً مبكراً كل عام ميلادي، لذا تمرّ المناسبات الإسلامية كرمضان والأعياد على جميع الفصول خلال 33 عاماً.',
                },
                {
                  icon: '🔄',
                  title: 'طرق تحويل التاريخ الثلاثة',
                  body: 'نوفر ثلاث طرق حساب: أم القرى (رسمي للخليج)، الفلكي (مصر والمغرب والشام)، والمدني (للأغراض الأكاديمية). قد يختلف التاريخ بيوم واحد بين الطرق.',
                },
                {
                  icon: '📆',
                  title: 'التقويمان الكاملان',
                  body: 'يوفر الموقع تقاويم سنوية كاملة بالتقويمين الهجري والميلادي. كل يوم يعرض مكافئه الهجري مع إبراز المناسبات الإسلامية الكبرى.',
                },
                {
                  icon: '🌍',
                  title: 'التاريخ حسب الدولة',
                  body: 'يختلف التاريخ الهجري المعتمد رسمياً من دولة لأخرى. دول الخليج تتبع أم القرى، بينما تتبع مصر والمغرب والأردن الحساب الفلكي.',
                },
              ].map((card) => (
                <article key={card.title} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl leading-none" aria-hidden="true">{card.icon}</span>
                    <h3 className="card__title text-base">{card.title}</h3>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed m-0">{card.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── FOOTER NAV ──────────────────────────────────────────────── */}
          <nav aria-label="روابط ذات صلة" className="related-links" dir="rtl">
            <p className="related-links__heading">صفحات ذات صلة</p>
            <div className="related-links__grid">

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

              <Link href={`/date/calendar/${y}`} className="related-link-card">
                <span className="related-link-card__icon" aria-hidden="true">
                  <Calendar size={16} strokeWidth={1.75} />
                </span>
                <span className="related-link-card__body">
                  <span className="related-link-card__label">التقويم الميلادي</span>
                  <span className="related-link-card__desc">تقويم عام {y} ميلادي كامل</span>
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
