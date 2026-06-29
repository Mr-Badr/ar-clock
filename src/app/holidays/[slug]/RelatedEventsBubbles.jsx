/**
 * RelatedEventsBubbles — horizontal scroll strip of related events with live countdowns.
 *
 * Placed just below the ShareBar and before AdTopBanner.
 * Purpose: give users a reason to stay by surfacing 4–6 upcoming events
 * at a glance. The scroll gesture on mobile is intuitive and creates discovery.
 *
 * Data strategy:
 *   1. Use relatedSlugs from the event package.json (reciprocal links).
 *   2. Fill up to MAX_BUBBLES from the nearest upcoming events in the same category.
 *   3. Never show the current slug.
 */

import Link from 'next/link';
import { ACTIVE_CANONICAL_HOLIDAY_EVENTS } from '@/lib/holidays/repository';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import { getCachedNowIso } from '@/lib/date-utils';
import { logHolidayFailure } from '@/lib/holidays/observability';

const MAX_BUBBLES = 6;

function daysLabel(days) {
  if (days <= 0) return 'اليوم';
  if (days === 1) return 'غداً';
  if (days < 11) return `${days} أيام`;
  return `${days} يوماً`;
}

function urgencyColor(days) {
  if (days <= 7)  return { bg: 'color-mix(in srgb, var(--accent) 10%, var(--bg-surface-2))', border: 'var(--border-accent)', text: 'var(--accent-strong)' };
  if (days <= 30) return { bg: 'color-mix(in srgb, #f59e0b 8%, var(--bg-surface-2))', border: 'color-mix(in srgb, #f59e0b 30%, transparent)', text: '#b45309' };
  return { bg: 'var(--bg-surface-2)', border: 'var(--border-subtle)', text: 'var(--text-secondary)' };
}

export default async function RelatedEventsBubbles({ relatedSlugs = [], currentSlug, categoryId }) {
  try {
    const nowIso = await getCachedNowIso();
    const nowMs = new Date(nowIso).getTime();

    // Collect candidate slugs: related first, then category peers
    const relatedSet = new Set(
      (Array.isArray(relatedSlugs) ? relatedSlugs : []).filter((s) => s !== currentSlug),
    );

    // Supplement from same-category upcoming events if needed
    const categoryEvents = ACTIVE_CANONICAL_HOLIDAY_EVENTS
      .filter((ev) => ev.slug !== currentSlug && !relatedSet.has(ev.slug) && ev.category === categoryId)
      .map((ev) => ev.slug);

    const candidateSlugs = [...relatedSet, ...categoryEvents].slice(0, MAX_BUBBLES * 2);

    if (candidateSlugs.length === 0) return null;

    // Resolve Hijri events in batch
    const candidateEvents = candidateSlugs
      .map((s) => ACTIVE_CANONICAL_HOLIDAY_EVENTS.find((ev) => ev.slug === s))
      .filter(Boolean);

    const hijriEvents = candidateEvents.filter((ev) => ev.type === 'hijri');
    const resolved = hijriEvents.length > 0
      ? await resolveAllHijriEvents(hijriEvents, { nowIso })
      : {};

    // Score and filter to upcoming only
    const bubbles = candidateEvents
      .map((ev) => {
        try {
          const targetDate = getNextEventDate(ev, resolved, nowMs);
          if (!targetDate || targetDate === 'passed') return null;
          const remaining = getTimeRemaining(targetDate, nowMs);
          if (remaining.days < 0) return null;
          return { slug: ev.slug, name: ev.name, days: remaining.days };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.days - b.days)
      .slice(0, MAX_BUBBLES);

    if (bubbles.length === 0) return null;

    return (
      <section
        aria-labelledby="related-bubbles-h"
        style={{ marginBottom: 'var(--space-8)', marginTop: 'var(--space-4)' }}
      >
        <p
          id="related-bubbles-h"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-3)',
          }}
        >
          مناسبات ذات صلة
        </p>

        {/* Horizontal scroll on mobile, wrap on desktop */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'var(--space-1)',
          }}
          role="list"
        >
          {bubbles.map(({ slug, name, days }) => {
            const colors = urgencyColor(days);
            const label = daysLabel(days);
            const truncated = name.length > 22 ? `${name.slice(0, 20)}…` : name;

            return (
              <Link
                key={slug}
                href={`/holidays/${slug}`}
                role="listitem"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.2rem',
                  padding: 'var(--space-2) var(--space-3)',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  flexShrink: 0,
                  minWidth: '9rem',
                  maxWidth: '13rem',
                  transition: 'opacity 0.15s',
                }}
                title={name}
              >
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: colors.text,
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 'var(--leading-snug)',
                  }}
                >
                  {truncated}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (error) {
    logHolidayFailure('related-events-bubbles-failed', {
      currentSlug,
      section: 'related-events-bubbles',
      degraded: true,
      error,
    });
    return null;
  }
}
