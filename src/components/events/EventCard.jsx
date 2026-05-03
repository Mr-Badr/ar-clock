/**
 * components/events/EventCard.jsx
 *
 * Design direction: "Precision Instrument"
 * ─────────────────────────────────────────
 * The countdown number is the hero — it dominates the card like a Bloomberg
 * terminal metric. Everything else is supporting context, arranged in a clear
 * reading hierarchy: category → number → event name → date.
 *
 * Key decisions:
 * • data-urgency attribute on <article> drives ALL color changes via CSS —
 *   no inline styles for urgency. Clean separation of concerns.
 * • Country flag top-right, category pill top-left — natural RTL scan path.
 * • A 28 × 2px accent bar under the number replaces any progress bar.
 *   It's purely decorative, NOT a progress indicator.
 * • Hover: translateY(-5px) + shadow only. No border/bg color change ever.
 * • Numbers: plain English integers (direction:ltr on the span).
 * • Dates: Arabic month names preserved, only digits are Western.
 */
import Link from 'next/link';

/* ── Static maps ──────────────────────────────────────────────────────────── */
const CAT_ICON = {
  islamic: '🌙', national: '🏳', school: '📚',
  holidays: '🏖', astronomy: '🌍', social: '🎗', business: '💼', support: '💰',
};
const CAT_LABEL = {
  islamic: 'إسلامي', national: 'وطني', school: 'مدرسي',
  holidays: 'إجازة', astronomy: 'فلكي', social: 'اجتماعي', business: 'أعمال', support: 'استحقاق',
};
const COUNTRY_FLAGS = {
  sa: '🇸🇦', eg: '🇪🇬', ma: '🇲🇦', dz: '🇩🇿',
  ae: '🇦🇪', tn: '🇹🇳', kw: '🇰🇼', qa: '🇶🇦',
};

/* Three urgency states — drives CSS via data-urgency attribute */
function urgency(days) {
  if (days <= 3)  return 'urgent';
  if (days <= 14) return 'soon';
  return 'normal';
}

/* ─────────────────────────────────────────────────────────────────────────── */
export default function EventCard({ event, priority = false, index = 0 }) {
  const cat = event.category || 'islamic';
  const categoryIcon = CAT_ICON[cat] || '🗓';
  const categoryLabel = CAT_LABEL[cat] || 'مناسبة';

  return (
    /* Stagger wrapper — layout dimensions controlled by .waqt-grid > div CSS */
    <div
      style={{
        animationName: 'fade-in-up',
        animationDuration: '0.35s',
        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        animationFillMode: 'both',
        animationDelay: `${Math.min(index, 9) * 40}ms`,
      }}
    >
      <Link
        href={`/holidays/${event.slug}`}
        prefetch={priority}
        aria-label={`${event.name} — متبقي ${event._daysLeft} يوم`}
      >
        {/* data-urgency drives number + accent-bar color entirely from CSS */}
        <article className="waqt-ev" data-urgency={urgency(event._daysLeft)}>

          {/* ── 1. Card header: category pill + country flag ──────── */}
          <div className="waqt-ev__header">
            <span className="waqt-ev__cat">
              <span aria-hidden>{categoryIcon}</span>
              <span className="waqt-ev__cat-label">{categoryLabel}</span>
            </span>
            {event._countryCode && (
              <span className="waqt-ev__flag" aria-hidden>
                {COUNTRY_FLAGS[event._countryCode]}
              </span>
            )}
          </div>

          {/* ── 2. Hero: the countdown number ─────────────────────── */}
          <div className="waqt-ev__hero">
            {/* Number row: large digits + "يوم" unit inline */}
            <div className="waqt-ev__days-row">
              {/*
                direction:ltr + unicode-bidi:embed forces Western (0-9) digits
                even inside the RTL page context. Arabic months in _formatted
                are unaffected because they're in a different element.
              */}
              <span className="waqt-ev__days">{event._daysLeft}</span>
              <span className="waqt-ev__days-unit">يوم متبقي</span>
            </div>

            {/* 28px decorative accent bar — color = urgency, NOT a progress bar */}
            <div className="waqt-ev__bar" aria-hidden />
          </div>

          {/* ── 3. Body: event name + description ─────────────────── */}
          <div className="waqt-ev__body">
            <h3 className="waqt-ev__title">{event.name}</h3>
            {event.description && (
              <p className="waqt-ev__desc">{event.description}</p>
            )}
          </div>

          {/* ── 4. Footer: date + calendar meta ───────────────────── */}
          <div className="waqt-ev__footer">
            <time className="waqt-ev__date" dateTime={event._targetISO}>
              {event._formatted}
            </time>

            {/* Secondary meta: hijri tag + calendar method */}
            {(event._hijriDate || event._calMethod) && (
              <div className="waqt-ev__meta">
                {event._hijriDate && (
                  <span className="waqt-ev__hijri">{event._hijriDate}</span>
                )}
                {event._calMethod && (
                  <span className="waqt-ev__method">
                    {event._localSighting && (
                      <span className="waqt-ev__sighting" title="±1 يوم برؤية الهلال">⚠</span>
                    )}
                    {event._calMethod}
                  </span>
                )}
              </div>
            )}
          </div>

        </article>
      </Link>
    </div>
  );
}


/* ── Skeleton ─────────────────────────────────────────────────────────────── */
export function EventCardSkeleton() {
  return (
    <div className="waqt-ev" aria-hidden style={{ minHeight: '240px' }}>
      {/* header */}
      <div className="waqt-ev__header">
        <div style={{ height: '22px', width: '70px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '20px', width: '22px', borderRadius: '4px', background: 'var(--bg-surface-3)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      {/* hero */}
      <div className="waqt-ev__hero">
        <div style={{ height: '3.5rem', width: '5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '0.6rem', width: '2.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-3)', animation: 'pulse 1.5s ease-in-out infinite', marginTop: '6px' }} />
        <div style={{ height: '2px', width: '28px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-4)', animation: 'pulse 1.5s ease-in-out infinite', marginTop: '12px' }} />
      </div>
      {/* body */}
      <div className="waqt-ev__body" style={{ gap: '8px' }}>
        <div style={{ height: '1rem', width: '80%', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '0.72rem', width: '60%', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-3)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      {/* footer */}
      <div className="waqt-ev__footer">
        <div style={{ height: '0.75rem', width: '7rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }) {
  return (
    <div className="waqt-grid">
      {Array.from({ length: count }).map((_, i) => <EventCardSkeleton key={i} />)}
    </div>
  );
}
