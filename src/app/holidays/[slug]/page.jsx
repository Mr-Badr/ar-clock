/**
 * app/holidays/[slug]/page.jsx  (Server Component)
 *
 * Uses dynamicSeoMeta() everywhere so year strings (2026 → 2027+) are always
 * correct regardless of when the page is rendered or revalidated.
 *
 * WAQT tokens: .card .card-nested .card-deep .card__header .badge
 *              .btn .section .divider .empty-state
 */
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import {
  ALL_EVENTS, enrichEvent, HIJRI_MONTHS_AR,
  getNextEventDate, getTimeRemaining,
  formatGregorianAr, formatHijriDisplayAr,
  resolveEventMeta, approxHijriYear, replaceTokens,
  buildEventSchema, buildWebPageSchema, buildFAQSchema, buildBreadcrumbSchema,
  getRelatedEvents, getEventState,
} from '@/lib/holidays-engine';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { COUNTRY_META, getCountryCalendarConfig } from '@/lib/calendar-config';
import { buildDynamicCountryDates } from '@/lib/event-utils';
import { getCachedNowIso } from '@/lib/date-utils';
import { getRichContent } from '@/lib/event-content';
import CountdownTicker, { ShareBar } from '@/components/clocks/CountdownTicker';
import EventVibeCard from '@/components/holidays/EventVibeCard';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';

// Server components — imported normally, no dynamic import needed
import CountryTable from './CountryTable';
import HistoricalTable from './HistoricalTable';
import RelatedEvents from './RelatedEvents';

const SITE = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

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
  if (!facts) return null;
  const isArray = Array.isArray(facts);
  const factEntries = isArray ? facts : Object.entries(facts).map(([label, value]) => ({ label, value }));
  if (factEntries.length === 0) return null;

  return (
    <div className="card-nested" style={{ overflow: 'hidden', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} dir="rtl">
        <caption className="sr-only">معلومات سريعة</caption>
        <tbody>
          {factEntries.map((f, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-surface-3)' : 'var(--bg-surface-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th scope="row" style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)', textAlign: 'right', whiteSpace: 'nowrap', width: '40%' }}>{f.label}</th>
              <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

  const baseEvent = enrichEvent(raw);

  // NEW: merge rich content — purely additive, never removes existing fields
  const richContent = getRichContent(slug);
  const event = { ...baseEvent, ...richContent };

  const resolved = await resolveAllHijriEvents([event]);
  const calInfo = resolved[event.slug] || null;
  const targetDate = getNextEventDate(event, resolved, now.getTime());
  const remaining = getTimeRemaining(targetDate, now.getTime());

  // Year-correct all SEO strings for this actual upcoming date
  const seo = resolveEventMeta(event, targetDate);
  const faqItems = seo.faq || seo.faqItems || [];
  const quickFacts = seo.quickFacts || {};

  const eventState = getEventState(targetDate, now.getTime());
  


  const gregStr = formatGregorianAr(targetDate);
  const year = targetDate.getFullYear();

  /* Hijri display */
  let hijriStr = null, hijriYearNum = year;
  if (event.type === 'hijri' && calInfo?.hijriLabel) {
    hijriStr = calInfo.hijriLabel;
    hijriYearNum = calInfo.hijriYear;
  }

  /* WhatsApp share */
  const shareText = encodeURIComponent(`${event.name} — متبقي ${remaining.days} يوم (${gregStr}) 🗓\n${SITE}/holidays/${slug}`);
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  /* Structured data — all use year-corrected seo.seoTitle / seo.description */
  const evSchema = { ...buildEventSchema(event, targetDate, SITE, eventState), name: seo.seoTitle, description: seo.description };
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

      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20">

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
              كم باقي على
            </span>
            <span style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 'var(--font-extrabold)', color: 'var(--accent)' }}>
              {event.name}
            </span>
          </h1>

          {/* SEO answer capsule — stays in DOM for featured snippets */}
          {seo.answerSummary ? (
            <p
              id="answer"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--leading-relaxed)',
                marginTop: 'var(--space-3)',
              }}
              dangerouslySetInnerHTML={{
                __html: replaceTokens(seo.answerSummary, { daysRemaining: remaining.days, ...event })
              }}
            />
          ) : (
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
          )}

        </header>

        {/* ── COUNTDOWN TICKER — main element, first thing user sees ──────── */}
        <section style={{ marginBottom: 'var(--space-6)' }} aria-label="العد التنازلي">
          <CountdownTicker
            targetISO={targetDate.toISOString()}
            initialRemaining={remaining}
            eventName={event.name}
            eventDate={hijriStr ? `${gregStr} — ${hijriStr}` : gregStr}
            whatsappUrl={whatsappUrl}
            isDark
          />
        </section>

        {/* <AdTopBanner slotId="top-holiday-slug" /> */}

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

        {/* ── EVENT VIBE CARD — The "WOW" section ───────────────────────── */}
        <section style={{ marginBottom: 'var(--space-8)' }} aria-label={`نظرة على ${event.name}`}>
          <EventVibeCard
            eventName={event.name}
            daysLeft={remaining.days}
            categoryId={event.category}
            countryCode={event._countryCode || null}
            slug={slug}
            eventType={event.type}
          />
        </section>

        {/* ── QUICK FACTS ─────────────────────────────────────────────────── */}
        {(Array.isArray(quickFacts) ? quickFacts.length > 0 : Object.keys(quickFacts).length > 0) && (
          <section style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>معلومات سريعة</h2>
            <QuickFactsTable facts={quickFacts} />
          </section>
        )}

        {/* ── INTENT CARDS (Action Cards) ─────────────────────────────────── */}
        {seo.intentCards && seo.intentCards.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }} aria-label="أبرز الإجراءات">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              {event.category === 'islamic' ? `استعد لـ${event.name}` :
                event.category === 'national' ? `احتفل بـ${event.name}` :
                event.category === 'school' ? `استعد لـ${event.name}` :
                event.category === 'holidays' ? `خطط لإجازتك` :
                event.category === 'astronomy' ? `شاهد ${event.name}` :
                event.category === 'business' ? `جهّز فريقك` : `شارك في ${event.name}`}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
              {seo.intentCards.map((card, i) => (
                <div key={i} className="card-nested" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <span style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{card.icon}</span>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{card.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', flex: 1 }}>{card.description}</p>
                  <a href={card.ctaHref} className="btn" style={{ textAlign: 'center', padding: 'var(--space-2)', background: 'var(--bg-surface-4)', borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', textDecoration: 'none' }}>
                    {card.ctaText}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── ABOUT ───────────────────────────────────────────────────────── */}
        <div className="section" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card__header">
            <h2 className="card__title">
              {seo.aboutEvent ? `عن ${event.name}` : (seo.about?.heading || `عن ${event.name}`)}
            </h2>
          </div>

          {/* Render NEW format (aboutEvent) if it exists, otherwise fallback to old format */}
          {seo.aboutEvent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {Object.entries(seo.aboutEvent).map(([heading, content], i) => (
                <div key={i}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>{heading}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)' }} dangerouslySetInnerHTML={{ __html: replaceTokens(content, event) }} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {seo.about?.paragraphs?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {seo.about.paragraphs.map((para, i) => (
                    <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)' }}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)' }}>
                  {seo.details || seo.description}
                </p>
              )}
            </>
          )}

          {seo.history && (
            <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>التاريخ والخلفية</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-sm)' }}>
                {seo.history}
              </p>
            </div>
          )}
          {seo.significance && (
            <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>الأهمية والفضل</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-sm)' }}>
                {seo.significance}
              </p>
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

        {/* ── TRADITIONS — from rich content ─────────────────────────────── */}
        {seo.traditions && seo.traditions.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="traditions-h">
            <h2 id="traditions-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              التقاليد والعادات
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
              {seo.traditions.map((trad, i) => (
                <div key={i} className="card-nested" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-2)' }}>{trad.icon}</span>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{trad.title}</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{trad.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TIMELINE — from rich content ───────────────────────────────── */}
        {seo.timeline && seo.timeline.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="timeline-h">
            <h2 id="timeline-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              المراحل الزمنية
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {seo.timeline.map((phase, i) => (
                <div key={i} className="card-nested" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{phase.phase}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── ENGAGEMENT CONTENT (Shareable Cards) ────────────────────────── */}
        {seo.engagementContent && seo.engagementContent.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="engagement-h">
            <h2 id="engagement-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              {event.category === 'islamic' ? `استعد لـ${event.name}` :
               event.category === 'national' ? `احتفل بـ${event.name}` :
               event.category === 'school' ? `استعد لـ${event.name}` :
               event.category === 'holidays' ? `خطط لإجازتك` :
               event.category === 'astronomy' ? `شاهد ${event.name}` :
               event.category === 'business' ? `جهّز فريقك` : `شارك في ${event.name}`}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
              {seo.engagementContent.map((item, i) => (
                <div key={i} className="card-nested" style={{ padding: 'var(--space-5)', background: 'var(--bg-surface-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    {item.subcategory && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-semibold)' }}>{item.subcategory}</span>}
                    <span className="badge badge-default" style={{ fontSize: 'var(--text-2xs)' }}>
                      {item.type === 'greeting' ? 'تهنئة' : item.type === 'prayer' ? 'دعاء' : item.type === 'tip' ? 'نصيحة' : item.type === 'fact' ? 'معلومة' : item.type === 'quote' ? 'اقتباس' : 'فائدة'}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 'var(--leading-relaxed)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── HOW TO — from rich content ─────────────────────────────────── */}
        {seo.howTo && (
          <section style={{ marginBottom: 'var(--space-8)' }} aria-labelledby="howto-h">
            <h2 id="howto-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              {seo.howTo.title || 'كيفية الاستعلام'}
            </h2>
            {seo.howTo.summary && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>
                {seo.howTo.summary}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {seo.howTo.steps && seo.howTo.steps.map((step, i) => (
                <div key={i} className="card-nested" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-3)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{step.name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{step.text}</p>
                    {step.url && (
                      <a href={step.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-link)', marginTop: 'var(--space-1)', display: 'inline-block' }}>
                        {step.url}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TABLES ──────────────────────────────────────────────────────── */}
        <CountryTable event={event} countryDates={seo.countryDates} />
        <HistoricalTable event={event} hijriYear={hijriYearNum} currentYear={currentYear} />

        {/* ── RECURRING YEARS — context paragraph for years table ─────────── */}
        {seo.recurringYears && (
          <section style={{ marginTop: 'var(--space-8)' }} aria-labelledby="recurring-h">
            <h2 id="recurring-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
              {event.name} — مواعيد السنوات
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
              {seo.recurringYears.contextParagraph}
            </p>
            {seo.recurringYears.sourceNote && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {seo.recurringYears.sourceNote}
              </p>
            )}
          </section>
        )}

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        {faqItems.length > 0 && (
          <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="faq-h">
            {/* <AdInArticle slotId="mid-holiday-slug-1" /> */}
            <h2 id="faq-h" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>
              أسئلة شائعة
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {faqItems.map((faqItem, i) => {
                const q = faqItem.q || faqItem.question;
                const a = faqItem.a || faqItem.answer;
                return (
                <details key={i} className="card-nested" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 'var(--text-base)' }}>
                    <span>{q || faqItem.question}</span>
                    <span aria-hidden style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xl)', marginRight: 'var(--space-2)', flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }} dangerouslySetInnerHTML={{ __html: a || faqItem.answer }} />
                </details>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SOURCES — from rich content (E-E-A-T) ─────────────────────── */}
        {event.sources && event.sources.length > 0 && (
          <section style={{ marginTop: 'var(--space-10)' }} aria-labelledby="sources-h">
            <h2 id="sources-h" style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
              المصادر والمراجع
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}>
              {event.sources.map((source, i) => (
                <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)' }}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
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
      {/* </AdLayoutWrapper> */}
    </div>
  );
}