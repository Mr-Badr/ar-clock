/**
 * NextEventCard — "المناسبة القادمة" discovery card.
 * Finds the single upcoming published event with the fewest days remaining
 * (excluding the current page's slug) and renders a compact card.
 */

import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { ACTIVE_CANONICAL_HOLIDAY_EVENTS } from '@/lib/holidays/repository';
import { resolveAllHijriEvents } from '@/lib/hijri-resolver';
import { getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import { getCachedNowIso } from '@/lib/date-utils';
import { logHolidayFailure } from '@/lib/holidays/observability';
import { daysLabel } from '@/lib/holidays/urgency';

export default async function NextEventCard({ currentSlug }) {
  try {
    const nowIso = await getCachedNowIso();
    const nowMs = new Date(nowIso).getTime();

    const publishedEvents = ACTIVE_CANONICAL_HOLIDAY_EVENTS.filter(
      (ev) => ev.slug !== currentSlug,
    );

    // Resolve hijri events in one batch
    const hijriEvents = publishedEvents.filter((ev) => ev.type === 'hijri');
    const resolved = hijriEvents.length > 0
      ? await resolveAllHijriEvents(hijriEvents, { nowIso })
      : {};

    // Score all events by days remaining (ascending)
    const candidates = publishedEvents
      .map((ev) => {
        try {
          const targetDate = getNextEventDate(ev, resolved, nowMs);
          const remaining = getTimeRemaining(targetDate, nowMs);
          if (remaining.days < 1) return null;
          return { ev, targetDate, days: remaining.days };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.days - b.days);

    const next = candidates[0];
    if (!next) return null;

    const { ev, days } = next;
    const remainingText = days === 1 ? 'غداً' : `باقي ${daysLabel(days)}`;

    return (
      <section
        style={{ marginTop: 'var(--space-8)' }}
        aria-labelledby="next-event-h"
      >
        <h2
          id="next-event-h"
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          المناسبة القادمة
        </h2>
        <Link
          href={`/holidays/${ev.slug}`}
          className="waqt-related-card waqt-related-card--featured"
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}
        >
          <div className="waqt-related-card__head" style={{ marginBottom: 0 }}>
            <span className="waqt-icon-chip" aria-hidden="true">
              <CalendarDays size={18} strokeWidth={1.75} />
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>
                {ev.name}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                <strong style={{ color: 'var(--accent-strong)' }}>{remainingText}</strong>
              </p>
            </div>
          </div>
          <ArrowLeft size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
        </Link>
      </section>
    );
  } catch (error) {
    logHolidayFailure('next-event-card-failed', {
      currentSlug,
      section: 'next-event-card',
      degraded: true,
      error,
    });
    return null;
  }
}
