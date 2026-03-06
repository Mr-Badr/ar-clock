/**
 * components/events/EventCard.jsx
 * Redesigned with WAQT design-system tokens.
 * Uses: .card .card--accent .card-nested .badge .badge-* .accent-dot
 * Zero hard-coded colors — all from CSS custom properties.
 */
import Link from 'next/link';

/* Category → badge class from design system */
const CAT_BADGE = {
  islamic:   'badge-accent',
  national:  'badge-info',
  school:    'badge-warning',
  holidays:  'badge-success',
  astronomy: 'badge-info',
  business:  'badge-default',
};
const CAT_ICON = {
  islamic:'🌙', national:'🏳', school:'📚', holidays:'🏖', astronomy:'🌍', business:'💼',
};
const CAT_LABEL = {
  islamic:'إسلامي', national:'وطني', school:'مدرسي', holidays:'إجازة', astronomy:'فلكي', business:'أعمال',
};

/* Event type → small dot variant */
const TYPE_DOT = {
  hijri:'accent-dot', fixed:'accent-dot--success', estimated:'accent-dot--warning',
  monthly:'accent-dot--warning', easter:'accent-dot--danger',
};

/* Urgency — drives card variant */
function urgency(days) {
  if (days <= 3)  return { card: 'card--danger',  badge: 'badge-danger',   label: 'عاجل' };
  if (days <= 14) return { card: '',              badge: 'badge-warning',  label: 'قريب' };
  if (days <= 30) return { card: 'card--accent',  badge: 'badge-accent',   label: null   };
  return               { card: '',              badge: 'badge-default',  label: null   };
}

export default function EventCard({ event, priority = false }) {
  const cat  = event.category || 'islamic';
  const urg  = urgency(event._daysLeft);

  return (
    <Link
      href={`/holidays/${event.slug}`}
      prefetch={priority}
      aria-label={`${event.name} — متبقي ${event._daysLeft} يوم`}
      className={`card ${urg.card} flex flex-col justify-between gap-4 no-underline group`}
      style={{ minHeight: '200px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Category accent strip — left edge (LTR visual, RTL layout) */}
      <span
        aria-hidden
        style={{
          position:'absolute', insetInlineEnd:0, top:0, bottom:0, width:'3px',
          background:'var(--accent)', opacity: cat === 'islamic' ? 1 : 0.5,
        }}
      />

      {/* Top row: category badge + urgency label */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={`badge ${CAT_BADGE[cat] ?? 'badge-default'}`}>
          {CAT_ICON[cat]} {CAT_LABEL[cat]}
        </span>
        {urg.label && <span className={`badge ${urg.badge}`}>{urg.label}</span>}
      </div>

      {/* Event name + description */}
      <div style={{ flex:1 }}>
        <h3
          className="font-semibold leading-snug"
          style={{ fontSize:'var(--text-lg)', color:'var(--text-primary)', lineClamp:2 }}
        >
          {event.name}
        </h3>
        <p
          className="leading-relaxed"
          style={{ fontSize:'var(--text-sm)', color:'var(--text-secondary)', marginTop:'var(--space-1)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}
        >
          {event.description}
        </p>
      </div>

      {/* Bottom: days remaining + date */}
      <div className="flex items-end justify-between gap-2">
        {/* Countdown number */}
        <div className="clock-segment">
          <span
            className="clock-display tabular-nums"
            style={{ fontSize:'var(--text-3xl)', color:'var(--accent)', lineHeight:'var(--leading-none)' }}
          >
            {event._daysLeft.toLocaleString('ar-EG')}
          </span>
          <span className="clock-segment__label">يوم متبقي</span>
        </div>

        {/* Date + calendar source */}
        <div style={{ textAlign:'right' }}>
          <time
            dateTime={event._targetISO}
            style={{ fontSize:'var(--text-sm)', color:'var(--text-primary)', fontWeight:'var(--font-medium)', display:'block' }}
          >
            {event._formatted}
          </time>
          {event._calMethod && (
            <p style={{ fontSize:'var(--text-2xs)', color:'var(--text-muted)', marginTop:'var(--space-0-5)', display:'flex', alignItems:'center', gap:'var(--space-1)', justifyContent:'flex-end' }}>
              {event._localSighting && <span style={{ color:'var(--warning)' }} title="±1 يوم بالرؤية المحلية">⚠</span>}
              {event._calMethod}
            </p>
          )}
        </div>
      </div>

      {/* Mini urgency progress bar — only shown when ≤60 days away */}
      {event._daysLeft <= 60 && (
        <div
          aria-hidden
          style={{ height:'3px', borderRadius:'var(--radius-full)', background:'var(--bg-surface-4)', overflow:'hidden', marginTop:'var(--space-2)' }}
        >
          <div style={{
            height:'100%', borderRadius:'var(--radius-full)',
            background: event._daysLeft <= 7 ? 'var(--danger)' : event._daysLeft <= 14 ? 'var(--warning)' : 'var(--accent)',
            width:`${Math.max(4, Math.round((1 - event._daysLeft / 60) * 100))}%`,
            transition:'width var(--transition-slow)',
          }} />
        </div>
      )}

      {/* Country flag badge if applicable */}
      {event._countryCode && (
        <div style={{ position:'absolute', top:'var(--space-4)', insetInlineStart:'var(--space-4)' }}>
          <span style={{ fontSize:'var(--text-xl)' }}>
            {{ sa:'🇸🇦', eg:'🇪🇬', ma:'🇲🇦', dz:'🇩🇿', ae:'🇦🇪', tn:'🇹🇳', kw:'🇰🇼', qa:'🇶🇦' }[event._countryCode]}
          </span>
        </div>
      )}
    </Link>
  );
}

/* ── Skeleton — exactly matches card dimensions ──────────────────────────── */
export function EventCardSkeleton() {
  return (
    <div className="card" style={{ minHeight:'200px', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
      <div className="flex items-center justify-between">
        <div style={{ height:'20px', width:'72px', borderRadius:'var(--radius-full)', background:'var(--bg-surface-4)' }} />
        <div style={{ height:'16px', width:'40px', borderRadius:'var(--radius-full)', background:'var(--bg-surface-4)' }} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
        <div style={{ height:'18px', width:'75%', borderRadius:'var(--radius-sm)', background:'var(--bg-surface-4)' }} />
        <div style={{ height:'13px', width:'100%', borderRadius:'var(--radius-sm)', background:'var(--bg-surface-3)' }} />
        <div style={{ height:'13px', width:'60%', borderRadius:'var(--radius-sm)', background:'var(--bg-surface-3)' }} />
      </div>
      <div className="flex items-end justify-between">
        <div style={{ height:'36px', width:'56px', borderRadius:'var(--radius-md)', background:'var(--bg-surface-4)' }} />
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-1)', alignItems:'flex-end' }}>
          <div style={{ height:'13px', width:'96px', borderRadius:'var(--radius-sm)', background:'var(--bg-surface-4)' }} />
          <div style={{ height:'10px', width:'64px', borderRadius:'var(--radius-sm)', background:'var(--bg-surface-3)' }} />
        </div>
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }) {
  return (
    <div className="grid-auto">
      {Array.from({ length: count }).map((_, i) => <EventCardSkeleton key={i} />)}
    </div>
  );
}