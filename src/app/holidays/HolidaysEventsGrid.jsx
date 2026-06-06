import { Search } from 'lucide-react';
import EventCard, { EventGridSkeleton } from '@/components/events/EventCard';

import { PAGE_SIZE } from './constants';

function isValidEvent(event) {
  return Boolean(
    event
      && typeof event === 'object'
      && typeof event.slug === 'string'
      && event.slug.trim().length > 0,
  );
}

export default function HolidaysEventsGrid({
  eventsCount,
  total,
  displayEvents,
  isFiltering,
  isLoadingMore,
  cursor,
  onLoadMore,
  onResetFilters,
}) {
  const safeDisplayEvents = Array.isArray(displayEvents) ? displayEvents.filter(isValidEvent) : [];
  const safeEventsCount = Number.isFinite(eventsCount) ? eventsCount : safeDisplayEvents.length;
  const safeTotal = Number.isFinite(total) ? total : safeEventsCount;
  const remainingCount = Math.max(0, safeTotal - safeEventsCount);

  return (
    <>
      {isFiltering && safeEventsCount === 0 ? (
        <EventGridSkeleton count={PAGE_SIZE} />
      ) : safeDisplayEvents.length === 0 ? (
        <div className="waqt-empty">
          <span
            aria-hidden="true"
            style={{
              color: 'var(--text-muted)',
              display: 'inline-flex',
              opacity: 0.45,
            }}
          >
            <Search size={42} strokeWidth={1.6} />
          </span>
          <p
            className="font-semibold"
            style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}
          >
            لم نعثر على مناسبة بهذه المواصفات
          </p>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              maxWidth: '340px',
              lineHeight: 1.75,
            }}
          >
            جرّب اسم مناسبة أو دولة أخرى، أو وسّع مدة العرض لتظهر لك نتائج أكثر.
            إذا كنت تبحث عن إجازة رسمية، امسح البحث أولاً ثم اختر الدولة والتصنيف.
          </p>
          {onResetFilters ? (
            <button
              type="button"
              className="waqt-btn waqt-btn-surface"
              onClick={onResetFilters}
            >
              اعرض كل المناسبات من جديد
            </button>
          ) : null}
        </div>
      ) : (
        <div
          className="waqt-grid"
          aria-busy={isFiltering || isLoadingMore}
          style={{ opacity: isFiltering ? 0.6 : 1, transition: 'opacity var(--transition-base)' }}
        >
          {safeDisplayEvents.map((event, index) => (
            <EventCard key={event.slug} event={event} priority={index < 6} index={index} />
          ))}
        </div>
      )}

      {cursor !== null && !isFiltering && !isLoadingMore && (
        <div
          className="flex flex-col items-center"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-2)' }}
        >
          <button
            onClick={onLoadMore}
            disabled={isFiltering || isLoadingMore}
            className="waqt-btn waqt-btn-surface"
            >
              اعرض مناسبات أخرى
              <span
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'var(--font-regular)',
                marginRight: 'var(--space-1)',
              }}
            >
              (باقي {remainingCount} مناسبة)
            </span>
          </button>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            افتح أقرب مناسبة أولاً، ثم عد لاحقًا إذا احتجت إلى نتائج أبعد أو دولة مختلفة
          </p>
        </div>
      )}

      {isLoadingMore && cursor !== null && (
        <div className="waqt-grid" style={{ marginTop: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="waqt-ev"
              style={{ minHeight: '200px', opacity: 0.45 }}
            />
          ))}
        </div>
      )}
    </>
  );
}
