/**
 * app/holidays/page.jsx  (Server Component)
 * WAQT design tokens: .section .container .card .badge .card__header .divider
 * Streaming: hero → upcoming-3 → full grid
 */
import { Suspense } from 'react';
import Script from 'next/script';
import Link from 'next/link';

import {
  ALL_EVENTS, enrichEvent, CATEGORIES,
  getNextEventDate, getTimeRemaining, formatGregorianAr,
  resolveEventMeta, approxHijriYear,
  buildBreadcrumbSchema,
} from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getInitialEvents } from './actions';
import { PAGE_SIZE } from './constants';
import HolidaysClient from './HolidaysClient';
import { EventGridSkeleton } from '@/components/events/EventCard';
import { getCachedNowIso } from '@/lib/date-utils';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

/* ── Dynamic metadata — year is always the current upcoming year ─────────── */
export async function generateMetadata() {
  const now = new Date(await getCachedNowIso());
  const gr = now.getFullYear();
  const hi = approxHijriYear(gr);
  return {
    title: `وقت — متى رمضان وعيد الفطر والأضحى ${gr} / ${hi} — عد تنازلي دقيق`,
    description: `عد تنازلي للمناسبات الإسلامية والوطنية والمدرسية. متى رمضان ${gr}؟ عيد الفطر؟ عيد الأضحى؟ بالهجري والميلادي لكل الدول العربية.`,
    keywords: `متى رمضان ${gr}, عيد الفطر ${gr}, عيد الأضحى ${gr}, عد تنازلي, تقويم هجري ${hi}`,
    alternates: { canonical: `${SITE}/holidays`, languages: { 'ar': `${SITE}/holidays` } },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    openGraph: { title: `وقت — عداد المواعيد الإسلامية ${gr}`, locale: 'ar_SA', type: 'website', url: `${SITE}/holidays` },
  };
}

/* ── Initial grid (SSR'd, streamed) ─────────────────────────────────────── */
async function InitialEventGrid() {
  const { events, nextCursor, total } = await getInitialEvents();
  return <HolidaysClient initialEvents={events} initialNextCursor={nextCursor} initialTotal={total} />;
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default async function HolidaysPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'الرئيسية', url: SITE },
    { name: 'المناسبات', url: `${SITE}/holidays` },
  ]);
  const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'وقت — عداد المواعيد', url: SITE, inLanguage: 'ar',
    potentialAction: { '@type': 'SearchAction', target: `${SITE}/holidays?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };
  // Organization schema — establishes brand entity in Google Knowledge Graph (critical for AI Overview citation)
  const orgSchema = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: 'وقت — عداد المواعيد',
    url: SITE,
    logo: { '@type': 'ImageObject', url: `${SITE}/logo.png`, width: 512, height: 512 },
    description: 'منصة عربية متخصصة في العد التنازلي للمناسبات الإسلامية والوطنية والمدرسية في العالم العربي.',
    inLanguage: 'ar',
    areaServed: ['SA', 'EG', 'MA', 'DZ', 'AE', 'TN', 'KW', 'QA'],
    sameAs: [
      `${SITE}`,
      // Add your social URLs here when available:
      // 'https://twitter.com/yourhandle',
      // 'https://www.instagram.com/yourhandle',
    ],
    knowsAbout: ['التقويم الهجري', 'المناسبات الإسلامية', 'العد التنازلي', 'تقويم أم القرى', 'رمضان', 'عيد الفطر', 'عيد الأضحى'],
  };
  // Resolve the 3 most-searched events dynamically so dates + years are always correct
  const gr = new Date(await getCachedNowIso()).getFullYear();
  const hi = approxHijriYear(gr);
  const nowMs = new Date(gr.toString()).getTime();
  const keyEvents = ['ramadan', 'eid-al-fitr', 'eid-al-adha'].map(s => ALL_EVENTS.find(e => e.slug === s)).filter(Boolean).map(enrichEvent);
  const keyResolved = await resolveAllHijriEvents(keyEvents);
  const keyMeta = Object.fromEntries(keyEvents.map(ev => {
    const target = getNextEventDate(ev, keyResolved, nowMs);
    const meta = resolveEventMeta(ev, target);
    return [ev.slug, { date: formatGregorianAr(target), ...meta }];
  }));

  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { q: `متى يبدأ رمضان ${gr}؟`, a: keyMeta['ramadan'] ? `${keyMeta['ramadan'].description} — ${keyMeta['ramadan'].date}.` : `يُحسب تلقائياً من AlAdhan API.` },
      { q: `متى عيد الفطر ${gr}؟`, a: keyMeta['eid-al-fitr'] ? `${keyMeta['eid-al-fitr'].date} وفق أم القرى.` : `يُحسب تلقائياً.` },
      { q: `متى عيد الأضحى ${gr}؟`, a: keyMeta['eid-al-adha'] ? `${keyMeta['eid-al-adha'].date} وفق أم القرى.` : `يُحسب تلقائياً.` },
      { q: `كيف تُحسب التواريخ الهجرية؟`, a: `نعتمد AlAdhan API بتقويم أم القرى ${hi} هـ. للدول ذات الرؤية المحلية نُشير إلى احتمال اختلاف ±1 يوم.` },
    ].map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <div className="bg-base" style={{ minHeight: '100dvh' }} dir="rtl">
      <Script id="s-ws" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Script id="s-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <Script id="s-bc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Script id="s-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-20)' }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-8)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>الرئيسية</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" style={{ color: 'var(--text-secondary)' }}>المناسبات</span>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 'var(--space-12)' }}>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', color: 'var(--text-primary)', lineHeight: 'var(--leading-tight)' }}>
            عداد{' '}
            <span style={{ color: 'var(--accent)' }}>المواعيد</span>
          </h1>
          <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)', maxWidth: 'var(--measure-narrow)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            تابع أهم المناسبات الإسلامية والوطنية والمدرسية في العالم العربي بدقة تامة — بالهجري والميلادي، مع عد تنازلي حي.
          </p>
        </header>

        {/* ── All events ────────────────────────────────────────────────────── */}
        <section aria-labelledby="events-heading">
          <div className="card__header" style={{ border: 'none', padding: 0, marginBottom: 'var(--space-6)' }}>
            <h2 id="events-heading" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
              التصنيفات
            </h2>
          </div>
          <Suspense fallback={<EventGridSkeleton count={PAGE_SIZE} />}>
            <InitialEventGrid />
          </Suspense>
        </section>

                {/* ── Calendar method legend ─────────────────────────────────────────── */}
        <aside
          aria-label="ملاحظات التقويم"
          className="mt-10 flex flex-col gap-2 text-[0.7rem]"
          style={{
            color: "var(--text-muted)",
            borderRight: "2px solid var(--border-subtle)",
            paddingRight: "var(--space-4)",
            maxWidth: "540px",
          }}
        >
          <p className="flex items-center gap-2">
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 50,
              backgroundColor: "var(--accent-alt)",
              flexShrink: 0,
            }} aria-hidden />
            هجري = أم القرى (AlAdhan API)
          </p>
          <p className="flex items-center gap-2">
            <span style={{ color: "var(--warning)", fontSize: "0.8rem",width: 8 }}>⚠</span>
            احتمال ±1 يوم برؤية الهلال المحلية
          </p>
          <p className="flex items-center gap-2">
            <span style={{ background: "var(--success)", width: 8,
              height: 8,
              borderRadius: 50,
              backgroundColor: "var(--success)",
              flexShrink: 0, }} aria-hidden />
            ثابت = نفس التاريخ كل عام
          </p>
          <p className="flex items-center gap-2">
            <span style={{ background: "var(--warning)", width: 8,
              height: 8,
              borderRadius: 50,
              backgroundColor: "var(--warning)",
              flexShrink: 0, }} aria-hidden />
            تقديري = تاريخ قد يتغير
          </p>
        </aside>

        {/* ── SEO content ───────────────────────────────────────────────────── */}
        <div className="divider" style={{ marginTop: 'var(--space-16)' }} />
        <section className="section section--flat container--narrow" aria-labelledby="seo-h">
          <h2 id="seo-h" style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
            مواعيد أهم المناسبات الإسلامية {gr} / {hi}
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            يعتمد <strong style={{ color: 'var(--text-primary)' }}>وقت</strong> على <strong style={{ color: 'var(--text-primary)' }}>تقويم أم القرى</strong> الرسمي عبر AlAdhan API لحساب جميع التواريخ الهجرية بدقة مطلقة — رمضان وعيد الفطر وعيد الأضحى ويوم عرفة وليلة القدر والمولد النبوي.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            للدول التي تعتمد رؤية الهلال المحلية — المغرب والجزائر وتونس ومصر — نُشير إلى احتمال اختلاف بيوم واحد مع إظهار مصدر التقويم بوضوح على كل بطاقة.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
            تُحدَّث جميع التواريخ تلقائياً كل 24 ساعة عبر ISR. عندما ينتهي حدث، يبدأ العداد فوراً للسنة القادمة — بلا أي تدخل يدوي.
          </p>

          {/* FAQ */}
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginTop: 'var(--space-10)', marginBottom: 'var(--space-5)' }}>
            أسئلة شائعة
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { q: `متى يبدأ رمضان ${gr}؟`, a: keyMeta['ramadan'] ? `يبدأ رمضان ${hi} في ${keyMeta['ramadan'].date} وفق أم القرى. قد يختلف بيوم في بعض الدول.` : `يُحسب تلقائياً من AlAdhan API.` },
              { q: `متى عيد الفطر ${gr}؟`, a: keyMeta['eid-al-fitr'] ? `عيد الفطر ${hi} في ${keyMeta['eid-al-fitr'].date}.` : `يُحسب تلقائياً.` },
              { q: `متى عيد الأضحى ${gr}؟`, a: keyMeta['eid-al-adha'] ? `عيد الأضحى ${hi} في ${keyMeta['eid-al-adha'].date}.` : `يُحسب تلقائياً.` },
              { q: `كيف تُحسب التواريخ الهجرية؟`, a: `نعتمد AlAdhan API بتقويم أم القرى ${hi} هـ. للدول ذات الرؤية المحلية نُشير إلى احتمال اختلاف ±1 يوم.` },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="card-nested"
                style={{ padding: 'var(--space-4) var(--space-5)' }}
              >
                <summary
                  style={{ cursor: 'pointer', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 'var(--text-base)' }}
                >
                  {q}
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xl)', marginRight: 'var(--space-2)', flexShrink: 0 }} aria-hidden>+</span>
                </summary>
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}