import EventCard, { EventGridSkeleton } from '@/components/events/EventCard';

import { PAGE_SIZE } from './constants';

export default function HolidaysEventsGrid({
  eventsCount,
  total,
  displayEvents,
  isPending,
  cursor,
  onLoadMore,
}) {
  return (
    <>
      {isPending && eventsCount === 0 ? (
        <EventGridSkeleton count={PAGE_SIZE} />
      ) : displayEvents.length === 0 ? (
        <div className="waqt-empty">
          <p style={{ fontSize: '3rem', opacity: 0.28 }}>🔍</p>
          <p
            className="font-semibold"
            style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}
          >
            لا توجد نتائج
          </p>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              maxWidth: '300px',
              lineHeight: 1.75,
            }}
          >
            جرّب البحث بكلمة مختلفة أو تغيير الفلاتر.
          </p>
        </div>
      ) : (
        <div
          className="waqt-grid"
          aria-busy={isPending}
          style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity var(--transition-base)' }}
        >
          {displayEvents.map((event, index) => (
            <EventCard key={event.slug} event={event} priority={index < 6} index={index} />
          ))}
        </div>
      )}

      {cursor !== null && !isPending && (
        <div
          className="flex flex-col items-center"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-2)' }}
        >
          <button
            onClick={onLoadMore}
            disabled={isPending}
            className="waqt-btn waqt-btn-surface"
          >
            تحميل المزيد
            <span
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'var(--font-regular)',
                marginRight: 'var(--space-1)',
              }}
            >
              ({total - eventsCount} مناسبة أخرى)
            </span>
          </button>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            يُحمَّل من الخادم مباشرةً بدون إعادة تحميل الصفحة
          </p>
        </div>
      )}

      {isPending && cursor !== null && (
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
