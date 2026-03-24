/**
 * SectionStats — Trust / authority bar  v2  (Server Component)
 *
 * All interactivity (hover, entrance animation) is handled with
 * pure CSS so this file has zero client-side JS.
 */

import { STATS } from './data/stats';

// ─── Single stat cell ─────────────────────────────────────────────────────────

function StatItem({ stat, index }) {
  return (
    <li
      className="
        stats-item
        flex flex-col items-center justify-center
        py-8 px-4 text-center
        [&:last-child]:col-span-2 lg:[&:last-child]:col-span-1
      "
      style={{
        background:        'var(--bg-surface-1)',
        animationDelay:    `${index * 65}ms`,
        cursor:            'default',
      }}
      aria-label={`${stat.value} ${stat.label}`}
    >
      {/* ── Icon container ── */}
      <div
        className="stats-icon-box"
        style={{
          width:          '44px',
          height:         '44px',
          flexShrink:     0,
          borderRadius:   'var(--radius-lg)',
          background:     'var(--accent-soft)',
          border:         '1px solid var(--border-accent)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          marginBottom:   'var(--space-3)',
        }}
        aria-hidden="true"
      >
        <stat.icon size={21} style={{ color: 'var(--accent-alt)' }} />
      </div>

      {/* ── Stat value — the visual hero ── */}
      <span
        style={{
          fontSize:           'var(--text-2xl)',
          fontWeight:         'var(--font-extrabold)',
          color:              'var(--text-primary)',
          lineHeight:         'var(--leading-tight)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing:      '0',
          display:            'block',
        }}
        className="lg:text-[length:var(--text-3xl)]"
      >
        {stat.value}
      </span>

      {/* ── Label ── */}
      <span
        style={{
          fontSize:   'var(--text-xs)',
          color:      'var(--text-muted)',
          lineHeight: '1.35',
          marginTop:  'var(--space-1)',
          display:    'block',
          maxWidth:   '10ch',
        }}
      >
        {stat.label}
      </span>
    </li>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SectionStats() {
  return (
    <section className="w-full" aria-label="إحصائيات الموقع">

      {/* ── Pure-CSS rules replacing all JS interactivity ── */}
      <style>{`
        /* Entrance: fade + slide-up, staggered via inline animation-delay */
        @keyframes stats-enter {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .stats-item {
          animation: stats-enter 0.38s cubic-bezier(0.34, 1.1, 0.64, 1)
                     both;   /* 'both' respects the delay for fill-mode   */
          transition: background var(--transition-fast, 0.18s ease);
        }
        /* Reduced-motion: skip animation entirely */
        @media (prefers-reduced-motion: reduce) {
          .stats-item { animation: none; opacity: 1; transform: none; }
        }

        /* Hover: lift bg */
        .stats-item:hover {
          background: var(--bg-surface-2) !important;
        }

        /* Hover: icon glow + micro-scale */
        .stats-item:hover .stats-icon-box {
          box-shadow: var(--shadow-accent);
          transform:  scale(1.07);
        }
        .stats-icon-box {
          transition:
            box-shadow var(--transition-fast, 0.18s ease),
            transform  var(--transition-fast, 0.18s ease);
        }
      `}</style>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* ── Unified card ── */}
        <ul
          role="list"
          aria-label="إحصائيات الموقع"
          className="
            grid grid-cols-2 lg:grid-cols-5
            gap-px overflow-hidden
          "
          style={{
            background:   'var(--border-subtle)',
            border:       '1px solid var(--border-default)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow:    'var(--shadow-sm)',
          }}
        >
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </ul>

      </div>
    </section>
  );
}