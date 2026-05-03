/**
 * app/holidays/[slug]/page.jsx  (Server Component)
 *
 * Uses dynamicSeoMeta() everywhere so year strings (2026 → 2027+) are always
 * correct regardless of when the page is rendered or revalidated.
 *
 * WAQT tokens: .card .card-nested .card-deep .card__header .badge
 *              .btn .section .divider .empty-state
 */
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';

import {
  ALL_EVENT_SLUGS,
} from '@/lib/holidays-engine';
import { getEventMeta } from '@/lib/events';
import { COUNTRY_META } from '@/lib/calendar-config';
import CountdownTicker, { ShareBar } from '@/components/clocks/CountdownTicker';
import EventVibeCard from '@/components/holidays/EventVibeCard';
import AdTopBanner from '@/components/ads/AdTopBanner';
import HolidayDetailsSections from './HolidayDetailsSections';
import { featureFlags } from '@/lib/feature-flags';
import { getHolidayMetadata } from '@/lib/holidays/metadata';
import { getHolidayPageData } from '@/lib/holidays/page-data';
import { getHolidaySource } from '@/lib/holidays/repository';
import { getHolidaySearchQueries } from '@/lib/holidays/search-intent';

function getPriorityHolidayStaticSlugs(limit = 48) {
  return ALL_EVENT_SLUGS
    .slice()
    .sort((left, right) => {
      const leftOrder = getHolidaySource(left)?.queueOrder || Number.MAX_SAFE_INTEGER;
      const rightOrder = getHolidaySource(right)?.queueOrder || Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;

      const leftStatus = getEventMeta(left)?.publishStatus || '';
      const rightStatus = getEventMeta(right)?.publishStatus || '';
      if (leftStatus !== rightStatus) return leftStatus.localeCompare(rightStatus);

      return left.localeCompare(right);
    })
    .slice(0, Math.min(limit, ALL_EVENT_SLUGS.length));
}

/* ── Static params (seed top holidays, render the rest on demand) ───────── */
export async function generateStaticParams() {
  return getPriorityHolidayStaticSlugs().map((slug) => ({ slug }));
}

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (featureFlags.holidaysNewMetadataPipeline) return getHolidayMetadata(slug);
  return getHolidayMetadata(slug);
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

/* ══════════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════════ */
export default async function HolidayPage({ params }) {
  const { slug } = await params;
  const data = await getHolidayPageData(slug);
  if (!data) notFound();
  if (data.redirectTo) permanentRedirect(data.redirectTo);

  const {
    event,
    seo,
    calInfo,
    targetDate,
    remaining,
    gregStr,
    hijriStr,
    hijriYearNum,
    currentYear,
    pageModel,
    tokenContext,
    typeLabel,
    whatsappUrl,
    siteUrl,
    schemas: { evSchema, wpSchema, faqSchema, bcSchema, articleSchema, eventSeriesSchema },
  } = data;
  const pageClassName = featureFlags.holidaysSectionizedUi ? 'bg-base holidays-page-v2' : 'bg-base';
  const eventSearchQueries = getHolidaySearchQueries({
    event,
    seo,
    tokenContext,
    currentYear,
  });
  const primarySearchQuery = eventSearchQueries[0] || `كم باقي على ${pageModel.hero.title || event.name}`;

  return (
    <div className={pageClassName} style={{ minHeight: '100dvh' }} dir="rtl">
      {/* JSON-LD inline — in initial HTML, never deferred, optimal for crawlers */}
      {evSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(evSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(wpSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {articleSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />}
      {eventSeriesSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSeriesSchema) }} />}

      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-8)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>الرئيسية</Link>
          <span aria-hidden>/</span>
          <Link href="/holidays" style={{ color: 'var(--text-muted)' }}>المناسبات</Link>
          <span aria-hidden>/</span>
          <span aria-current="page" style={{ color: 'var(--text-secondary)' }}>{pageModel.hero.title || event.name}</span>
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
              {pageModel.hero.title || event.name}
            </span>
          </h1>

          {/* SEO answer capsule — stays in DOM for featured snippets */}
          {pageModel.hero.answerSummary && !event.__contentFlags?.hasHardcodedYear ? (
            <p
              id="answer"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--leading-relaxed)',
                marginTop: 'var(--space-3)',
              }}
            >
              {pageModel.hero.answerSummary}
            </p>
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
              <strong style={{ color: 'var(--text-secondary)' }}>{pageModel.hero.title || event.name}</strong>
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
            eventName={pageModel.hero.title || event.name}
            eventDate={hijriStr ? `${gregStr} — ${hijriStr}` : gregStr}
            whatsappUrl={whatsappUrl}
            isDark
          />
        </section>

        <AdTopBanner slotId="top-holiday-slug" />

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
          url={`${siteUrl}/holidays/${slug}`}
          eventName={pageModel.hero.title || event.name}
          days={remaining.days}
          dateStr={gregStr}
        />

        {eventSearchQueries.length > 0 && (
          <section
            style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-8)' }}
            aria-labelledby="event-search-intent-heading"
          >
            <div
              className="card-nested"
              style={{
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div>
                <h2
                  id="event-search-intent-heading"
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  هذا الدليل يجيب عن أكثر عمليات البحث حول {pageModel.hero.title || event.name}
                </h2>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--leading-relaxed)',
                    margin: 0,
                  }}
                >
                  إذا كان المستخدم يبحث عن <strong style={{ color: 'var(--text-primary)' }}>{primarySearchQuery}</strong>
                  ، أو يريد معرفة الموعد والتاريخ والعد التنازلي وأسئلة العام القادم، فهذه الصفحة
                  تعرض الجواب مباشرة في HTML مع معلومات محدثة وروابط ذات صلة ومحتوى تفصيلي عن المناسبة.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {eventSearchQueries.map((query) => (
                  <span
                    key={query}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: '999px',
                      background: 'var(--bg-surface-3)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {query}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── EVENT VIBE CARD — The "WOW" section ───────────────────────── */}
        <section style={{ marginBottom: 'var(--space-8)' }} aria-label={`نظرة على ${pageModel.hero.title || event.name}`}>
          <EventVibeCard
            eventName={pageModel.hero.title || event.name}
            daysLeft={remaining.days}
            categoryId={event.category}
            countryCode={event._countryCode || null}
            slug={slug}
            eventType={event.type}
          />
        </section>
        <HolidayDetailsSections
          slug={slug}
          event={event}
          seo={seo}
          pageModel={pageModel}
          hijriYearNum={hijriYearNum}
          currentYear={currentYear}
        />

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}
