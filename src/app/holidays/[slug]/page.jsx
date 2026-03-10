/**
 * app/holidays/[slug]/page.jsx  (Server Component)
 *
 * Uses dynamicSeoMeta() everywhere so year strings (2026 → 2027+) are always
 * correct regardless of when the page is rendered or revalidated.
 *
 * WAQT tokens: .card .card-nested .card-deep .card__header .badge
 *              .btn .section .divider .empty-state
 */
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

import {
  ALL_EVENTS, enrichEvent, HIJRI_MONTHS_AR,
  getNextEventDate, getTimeRemaining,
  formatGregorianAr, formatHijriDisplayAr,
  resolveEventMeta, approxHijriYear, replaceYears,
  buildEventSchema, buildWebPageSchema, buildFAQSchema, buildBreadcrumbSchema,
  getRelatedEvents,
} from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { COUNTRY_META } from '@/lib/calendar-config';
import { getCachedNowIso } from '@/lib/date-utils';
import CountdownTicker, { CountdownTickerSkeleton, ShareBar } from '@/components/clocks/CountdownTicker';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

/* ── Static params (pre-render top 50, ISR the rest) ─────────────────────── */
export async function generateStaticParams() {
  return ALL_EVENTS.map(e => ({ slug: e.slug }));
}

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const raw = ALL_EVENTS.find(e => e.slug === slug);
  if (!raw) return { title: '404', robots: { index: false } };

  const ev = enrichEvent(raw);
  const res = await resolveAllHijriEvents([ev]);
  const nowMs = new Date(await getCachedNowIso()).getTime();
  const target = getNextEventDate(ev, res, nowMs);
  const rem = getTimeRemaining(target, nowMs);
  const seo = resolveEventMeta(ev, target);          // ← year-correct
  const gregStr = formatGregorianAr(target);
  const url = `${SITE}/holidays/${slug}`;
  const desc = `${seo.seoTitle} — ${gregStr}. متبقي ${rem.days} يوم. ${seo.description}`;

  return {
    title: seo.seoTitle,
    description: desc,
    keywords: seo.keywords.join(', '),
    alternates: { canonical: url, languages: { 'ar': url, 'ar-SA': url, 'ar-EG': url, 'ar-MA': url } },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
    openGraph: { title: seo.seoTitle, description: desc, url, locale: 'ar_SA', type: 'website' },
    twitter: { card: 'summary_large_image', title: seo.seoTitle, description: desc },
  };
}

/* ── Accuracy badge ───────────────────────────────────────────────────────── */
function AccuracyBadge({ accuracy, localSighting }) {
  const cls = { high: 'badge-success', medium: 'badge-warning', low: 'badge-danger' }[accuracy] || 'badge-default';
  const lbl = { high: 'دقيق', medium: 'تقريبي', low: 'تقديري' }[accuracy] || '';
  return (
    <span className={`badge ${cls}`}>
      {localSighting && <span title="قد يختلف بيوم">⚠ </span>}
      {lbl}
    </span>
  );
}

/* ── Quick facts table ────────────────────────────────────────────────────── */
function QuickFactsTable({ facts }) {
  if (!facts?.length) return null;
  return (
    <div className="card-nested" style={{ overflow: 'hidden', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
        <caption className="sr-only">معلومات سريعة</caption>
        <tbody>
          {facts.map((f, i) => (
            <tr key={f.label} style={{ background: i % 2 === 0 ? 'var(--bg-surface-3)' : 'var(--bg-surface-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th scope="row" style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)', textAlign: 'right', whiteSpace: 'nowrap', width: '40%' }}>{f.label}</th>
              <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Country comparison table ─────────────────────────────────────────────── */
function CountryTable({ event }) {
  if (!event.countryDates?.length) return null;
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="country-h">
      <h2 id="country-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
        مواعيد {event.name} حسب الدولة
      </h2>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
          <caption className="sr-only">مقارنة مواعيد {event.name}</caption>
          <thead>
            <tr style={{ background: 'var(--bg-surface-3)', borderBottom: '1px solid var(--border-default)' }}>
              {['الدولة', 'التاريخ المتوقع', 'مصدر التقويم'].map(h => (
                <th key={h} scope="col" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {event.countryDates.map((row, i) => (
              <tr key={row.code} style={{ background: i % 2 === 0 ? 'var(--bg-surface-2)' : 'var(--bg-surface-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{row.flag} {row.country}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{row.date}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        * قد تختلف التواريخ بيوم بناءً على رؤية الهلال في كل دولة.
      </p>
    </section>
  );
}

/* ── Historical dates table ───────────────────────────────────────────────── */
function HistoricalTable({ event, hijriYear, currentYear }) {
  if (event.type !== 'hijri') return null;
  const rows = event.historicalDates || [
    { year: `${hijriYear - 1} هـ`, gregorian: `${currentYear - 1}م`, note: 'السنة الماضية' },
    { year: `${hijriYear} هـ`, gregorian: `${currentYear}م`, note: 'السنة الحالية' },
    { year: `${hijriYear + 1} هـ`, gregorian: `${currentYear + 1}م`, note: 'تقديري (~11 يوماً أبكر)' },
  ];
  return (
    <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="hist-h">
      <h2 id="hist-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
        {event.name} — مواعيد السنوات المتعاقبة
      </h2>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
          <caption className="sr-only">تواريخ {event.name} لعدة سنوات</caption>
          <thead>
            <tr style={{ background: 'var(--bg-surface-3)', borderBottom: '1px solid var(--border-default)' }}>
              {['السنة الهجرية', 'التاريخ الهجري', 'الميلادي (تقريبي)', 'ملاحظة'].map(h => (
                <th key={h} scope="col" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.year} style={{
                background: r.note?.includes('الحالية') ? 'var(--accent-soft)' : i % 2 === 0 ? 'var(--bg-surface-2)' : 'var(--bg-surface-3)',
                borderBottom: '1px solid var(--border-subtle)',
                fontWeight: r.note?.includes('الحالية') ? 'var(--font-semibold)' : 'var(--font-regular)',
              }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.year}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{event.hijriDay} {HIJRI_MONTHS_AR[event.hijriMonth]}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.gregorian}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)' }}>
                  {r.note?.includes('الحالية') ? <span className="badge badge-accent">{r.note}</span> : <span style={{ color: 'var(--text-muted)' }}>{r.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── Related events ───────────────────────────────────────────────────────── */
async function RelatedEvents({ slug }) {
  const related = getRelatedEvents(slug, ALL_EVENTS, 4);
  const resolved = await resolveAllHijriEvents(related);
  const nowMs = new Date(await getCachedNowIso()).getTime();
  const ann = related.map(ev => {
    const d = getNextEventDate(ev, resolved, nowMs);
    const seo = resolveEventMeta(ev, d);
    return { ...ev, _daysLeft: getTimeRemaining(d, nowMs).days, _formatted: formatGregorianAr(d), _seoTitle: seo.seoTitle };
  });
  return (
    <section style={{ marginTop: 'var(--space-12)' }} aria-labelledby="related-h">
      <h2 id="related-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
        مناسبات ذات صلة
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        {ann.map(ev => (
          <Link key={ev.slug} href={`/holidays/${ev.slug}`} className="alarm-item no-underline" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-accent)', background: 'var(--accent-soft)', flexShrink: 0 }}>
              <span className="clock-display tabular-nums" style={{ fontSize: 'var(--text-md)', color: 'var(--accent)', lineHeight: 1 }}>{ev._daysLeft}</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>يوم</span>
            </div>
            <div className="alarm-info">
              <p className="alarm-label">{ev.name}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>{ev._formatted}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════════ */
export default async function HolidayPage({ params }) {
  const { slug } = await params;
  const raw = ALL_EVENTS.find(e => e.slug === slug);
  if (!raw) notFound();

  const nowIso = await getCachedNowIso();
  const now = new Date(nowIso);
  const currentYear = now.getFullYear();

  const event = enrichEvent(raw);

  const resolved = await resolveAllHijriEvents([event]);
  const calInfo = resolved[event.slug] || null;
  const targetDate = getNextEventDate(event, resolved, now.getTime());
  const remaining = getTimeRemaining(targetDate, now.getTime());

  // Year-correct all SEO strings for this actual upcoming date
  const seo = resolveEventMeta(event, targetDate);
  // Also patch any year-bearing strings in quickFacts / countryDates
  const gregYear = targetDate.getFullYear();
  const hijriYear = approxHijriYear(gregYear);
  const patchStr = (s) => replaceYears(s, gregYear, hijriYear);
  const quickFacts = (event.quickFacts || []).map(f => ({ ...f, value: patchStr(f.value) }));
  // faqItems come pre-patched from resolveEventMeta — no raw event.faqItems needed below
  const faqItems = seo.faqItems;

  const gregStr = formatGregorianAr(targetDate);
  const year = targetDate.getFullYear();

  /* Hijri display — call AlAdhan for the exact date */
  let hijriStr = null, hijriYearNum = year;
  if (event.type === 'hijri') {
    try {
      const d = targetDate;
      const str = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
      const r = await fetch(`https://api.aladhan.com/v1/gToH?date=${str}`, { next: { revalidate: 86_400, tags: ['hijri-display'] } });
      const j = await r.json();
      if (j?.data?.hijri) {
        const hd = { day: +j.data.hijri.day, month: +j.data.hijri.month.number, year: +j.data.hijri.year };
        hijriStr = formatHijriDisplayAr(hd);
        hijriYearNum = hd.year;
      }
    } catch { /* use greg fallback */ }
  }

  /* WhatsApp share */
  const shareText = encodeURIComponent(`${event.name} — متبقي ${remaining.days} يوم (${gregStr}) 🗓\n${SITE}/holidays/${slug}`);
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  /* Structured data — all use year-corrected seo.seoTitle / seo.description */
  const evSchema = { ...buildEventSchema(event, targetDate, SITE), name: seo.seoTitle, description: seo.description };
  const wpSchema = { ...buildWebPageSchema(event, targetDate, SITE, nowIso), name: seo.seoTitle, description: seo.description };
  const faqSchema = buildFAQSchema({ ...event, faqItems });
  const bcSchema = buildBreadcrumbSchema([
    { name: 'الرئيسية', url: SITE },
    { name: 'المناسبات', url: `${SITE}/holidays` },
    { name: event.name, url: `${SITE}/holidays/${slug}` },
  ]);

  const typeLabel = { hijri: 'هجري', fixed: 'ثابت', estimated: 'تقديري', monthly: 'شهري', easter: 'ميلادي' }[event.type] || event.type;

  return (
    <div className="bg-base" style={{ minHeight: '100dvh' }} dir="rtl">
      {/* JSON-LD inline — in initial HTML, never deferred, optimal for crawlers */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(evSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(wpSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="container container--narrow" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-20)' }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-8)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>الرئيسية</Link>
          <span aria-hidden>/</span>
          <Link href="/holidays" style={{ color: 'var(--text-muted)' }}>المناسبات</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" style={{ color: 'var(--text-secondary)' }}>{event.name}</span>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 'var(--space-6)' }}>

          {/* Badges row — compact, above the event name */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <span className="badge badge-default">{typeLabel}</span>
            {calInfo && <AccuracyBadge accuracy={calInfo.accuracy} localSighting={calInfo.localSighting} />}
            {event._countryCode && COUNTRY_META[event._countryCode] && (
              <span className="badge badge-info">{COUNTRY_META[event._countryCode].flag} {COUNTRY_META[event._countryCode].name}</span>
            )}
          </div>

          {/* Event name — big, clean, accent on the name itself */}
          <h1 style={{ lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-2)' }}>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', letterSpacing: 'var(--tracking-wide)' }}>
              العد التنازلي لـ
            </span>
            <span style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 'var(--font-extrabold)', color: 'var(--accent)' }}>
              {event.name}
            </span>
          </h1>

          {/* SEO answer capsule — stays in DOM for featured snippets */}
          <p
            id="answer"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              lineHeight: 'var(--leading-relaxed)',
              marginTop: 'var(--space-3)',
            }}
          >
            <strong style={{ color: 'var(--text-secondary)' }}>{event.name}</strong>
            {hijriStr
              ? ` يصادف هذا العام ${gregStr} الموافق ${hijriStr}. متبقي ${remaining.days} يوم${remaining.hours > 0 ? ` و${remaining.hours} ساعة` : ''}.`
              : ` يصادف هذا العام ${gregStr}. متبقي ${remaining.days} يوم.`
            }
            {event.type === 'hijri' && ' يُحسب الموعد وفق تقويم أم القرى الرسمي ويتقدم ~11 يوماً كل عام.'}
            {event.type === 'fixed' && ' الموعد ثابت كل عام في نفس اليوم.'}
            {event.type === 'estimated' && ' الموعد تقديري وقد يتغير بإعلان رسمي.'}
          </p>

        </header>

        {/* ── COUNTDOWN TICKER — main element, first thing user sees ──────── */}
        <section style={{ marginBottom: 'var(--space-6)' }} aria-label="العد التنازلي">
          <Suspense fallback={<CountdownTickerSkeleton />}>
            <CountdownTicker
              targetISO={targetDate.toISOString()}
              initialRemaining={remaining}
              eventName={event.name}
              eventDate={hijriStr ? `${gregStr} — ${hijriStr}` : gregStr}
              whatsappUrl={whatsappUrl}
              isDark
            />
          </Suspense>
        </section>

        {/* ── DATE INFO ROW — below the counter, clean pill style ──────────── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-10)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="تفاصيل الموعد"
        >
          <time
            dateTime={targetDate.toISOString().split('T')[0]}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4em',
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--bg-surface-3)',
              border: '1px solid var(--border-default)',
              borderRadius: '999px',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            <span aria-hidden style={{ opacity: 0.6 }}>📅</span>
            {gregStr}
          </time>

          {hijriStr && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.4em',
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
              borderRadius: '999px',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--accent)',
            }}>
              <span aria-hidden style={{ opacity: 0.7 }}>☽</span>
              {hijriStr}
            </span>
          )}

          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.4em',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--bg-surface-3)',
            border: '1px solid var(--border-default)',
            borderRadius: '999px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'var(--font-bold)', fontVariantNumeric: 'tabular-nums' }}>{remaining.days}</span>
            &nbsp;يوم متبقي
          </span>

          {calInfo?.note && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.3em',
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
            }}>
              {calInfo.localSighting && <span style={{ color: 'var(--warning)' }}>⚠</span>}
              {calInfo.note}
            </span>
          )}
        </div>

        {/* ── SHARE BAR — WhatsApp · Telegram · X · Facebook · Copy ──────── */}
        <ShareBar
          url={`${SITE}/holidays/${slug}`}
          eventName={event.name}
          days={remaining.days}
          dateStr={gregStr}
        />

        {/* ── QUICK FACTS ─────────────────────────────────────────────────── */}
        {quickFacts.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>معلومات سريعة</h2>
            <QuickFactsTable facts={quickFacts} />
          </section>
        )}

        {/* ── ABOUT ───────────────────────────────────────────────────────── */}
        <div className="section" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card__header">
            <h2 className="card__title">عن {event.name}</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)' }}>
            {event.details || seo.description}
          </p>
          {event.history && (
            <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>التاريخ والخلفية</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-sm)' }}>{event.history}</p>
            </div>
          )}
          {event.significance && (
            <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>الأهمية والفضل</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-sm)' }}>{event.significance}</p>
            </div>
          )}
          {/* Data source — E-E-A-T trust signals */}
          <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {event.type === 'hijri' && <>
              <p>📅 المصدر: <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-link)' }}>AlAdhan API</a> — {calInfo?.label || 'أم القرى'}</p>
              {calInfo?.localSighting && <p>⚠ قد يختلف الموعد بيوم بناءً على رؤية الهلال في بعض الدول.</p>}
              <p>🔄 يُحدَّث تلقائياً كل 12 ساعة من المصدر الرسمي.</p>
            </>}
            {event.type === 'estimated' && <p>⚠ هذا التاريخ تقديري — قد يتغير بقرار وزاري رسمي.</p>}
            {event.type === 'monthly' && <p>🔁 يتكرر كل شهر في نفس اليوم.</p>}
            {event.type === 'fixed' && <p>📌 تاريخ ثابت — نفس اليوم كل عام.</p>}
            <p>🕐 آخر تحديث: {new Date(nowIso).toLocaleDateString('ar-SA-u-nu-latn')}</p>
          </div>
        </div>

        {/* ── TABLES ──────────────────────────────────────────────────────── */}
        <CountryTable event={event} />
        <HistoricalTable event={event} hijriYear={hijriYearNum} currentYear={currentYear} />

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        {faqItems.length > 0 && (
          <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="faq-h">
            <h2 id="faq-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
              أسئلة شائعة
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {faqItems.map(({ q, a }) => (
                <details key={q} className="card-nested" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 'var(--text-base)' }}>
                    {q}
                    <span aria-hidden style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xl)', marginRight: 'var(--space-2)', flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>{a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── RELATED EVENTS ──────────────────────────────────────────────── */}
        <Suspense fallback={
          <div style={{ marginTop: 'var(--space-12)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--space-3)' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="alarm-item" style={{ height: '80px', opacity: 0.4 }} />)}
          </div>
        }>
          <RelatedEvents slug={slug} />
        </Suspense>

        {/* ── BACK TO ALL EVENTS — prominent, end of page ─────────────────── */}
        <div
          style={{
            marginTop: 'var(--space-16)',
            paddingTop: 'var(--space-10)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            اكتشف المزيد من المناسبات الإسلامية والوطنية والمدرسية
          </p>
          <Link
            href="/holidays"
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-8)',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 'var(--radius-2xl)',
              fontWeight: 'var(--font-semibold)',
              fontSize: 'var(--text-base)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-accent)',
            }}
          >
            <span aria-hidden>←</span>
            كل المناسبات
          </Link>
        </div>

      </main>
    </div>
  );
}