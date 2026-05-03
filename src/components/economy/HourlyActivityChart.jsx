// components/economy/HourlyActivityChart.jsx
import { useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Dot,
} from 'recharts';

// ─── Band metadata ──────────────────────────────────────────────────────────
const BAND_META = {
  quiet:  { label: 'هدوء',           color: 'var(--text-muted)',  soft: 'rgba(144,170,204,0.12)' },
  warm:   { label: 'تداخل متوسط',    color: 'var(--info)',        soft: 'rgba(116,185,255,0.15)' },
  active: { label: 'نشاط مرتفع',     color: 'var(--success)',     soft: 'rgba(6,214,160,0.15)'   },
  peak:   { label: 'ذروة السيولة',   color: 'var(--warning)',     soft: 'rgba(255,209,102,0.15)' },
};

const BAND_BORDER = {
  quiet:  'var(--border-default)',
  warm:   'color-mix(in srgb, var(--info) 34%, var(--border-default))',
  active: 'color-mix(in srgb, var(--success) 34%, var(--border-default))',
  peak:   'color-mix(in srgb, var(--warning) 38%, var(--border-default))',
};

// ─── Sample data generator (replace with real data prop) ────────────────────
function generateSampleData(currentHour = 14) {
  const sessions = {
    0:'فوركس',1:'فوركس',2:'',3:'',4:'',5:'آسيا',
    6:'آسيا',7:'آسيا+لندن',8:'لندن',9:'لندن',10:'لندن',11:'لندن+نيويورك',
    12:'لندن+نيويورك',13:'نيويورك',14:'نيويورك',15:'نيويورك',16:'نيويورك',17:'نيويورك',
    18:'نيويورك',19:'',20:'',21:'',22:'فوركس',23:'فوركس',
  };
  const curve = [
    10,8,6,5,5,14,28,55,72,78,80,92,
    98,88,82,75,68,58,40,22,16,12,10,10,
  ];
  return Array.from({ length: 24 }, (_, h) => {
    const score = curve[h];
    const band = score >= 80 ? 'peak' : score >= 55 ? 'active' : score >= 25 ? 'warm' : 'quiet';
    const isCurrent = h === currentHour;
    const pairMap = {
      peak:   ['EUR/USD', 'GBP/USD', 'USD/JPY'],
      active: ['EUR/GBP', 'USD/CHF', 'AUD/USD'],
      warm:   ['EUR/JPY', 'NZD/USD'],
      quiet:  [],
    };
    const hintMap = {
      peak:   'ذروة السيولة',
      active: 'نشاط مرتفع',
      warm:   'تداخل متوسط',
      quiet:  'هدوء السوق',
    };
    const goldMap = {
      peak:   '⬆ أفضل لحظة للمتابعة',
      active: '↗ نشاط جيد',
      warm:   '→ تداخل معتدل',
      quiet:  '↓ سيولة منخفضة',
    };
    const pad = n => String(n).padStart(2, '0');
    return {
      key:          `h${h}`,
      hour:         h,
      hourLabel:    `${pad(h)}:00`,
      score,
      band,
      isCurrent,
      hint:         hintMap[band],
      note:         sessions[h] || 'لا جلسات نشطة',
      sessionsLabel: sessions[h] ? `جلسة ${sessions[h]}` : 'خارج أوقات الجلسات',
      bestPairs:    pairMap[band],
      goldStatus:   goldMap[band],
      activeCount:  pairMap[band].length,
    };
  });
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const pt = payload[0]?.payload;
  if (!pt) return null;
  const meta = BAND_META[pt.band];
  return (
    <div style={{
      background: 'var(--bg-surface-2)',
      border: `1px solid ${BAND_BORDER[pt.band]}`,
      borderRadius: 'var(--radius-xl)',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-md)',
      minWidth: 180,
      direction: 'rtl',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, marginBottom: 8,
      }}>
        <span style={{
          color: 'var(--text-muted)', fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
        }}>
          {pt.hourLabel}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '2px 8px', borderRadius: 'var(--radius-full)',
          background: meta.soft, border: `1px solid ${BAND_BORDER[pt.band]}`,
          color: meta.color, fontSize: 'var(--text-xs)', fontWeight: 700,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
          {meta.label}
        </span>
      </div>
      <div style={{
        fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)',
        color: meta.color, lineHeight: 1, marginBottom: 6,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {pt.score}
      </div>
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
        {pt.note}
      </p>
      {pt.bestPairs?.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {pt.bestPairs.map((p, i) => (
            <span key={`${p}-${i}`} style={{
              padding: '2px 7px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}>{p}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Custom dot for highlighted points ──────────────────────────────────────
function CustomActiveDot(props) {
  const { cx, cy, payload } = props;
  const meta = BAND_META[payload.band];
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill={meta.color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={6}  fill={meta.color} stroke="var(--bg-surface-1)" strokeWidth={2} />
    </g>
  );
}

// ─── Custom dot for current-hour indicator ──────────────────────────────────
function CustomDotWithCurrent(props) {
  const { cx, cy, payload } = props;
  if (!payload?.isCurrent) return null;
  const meta = BAND_META[payload.band];
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill={meta.color} opacity={0.12} />
      <circle cx={cx} cy={cy} r={8}  fill={meta.color} opacity={0.25} />
      <circle cx={cx} cy={cy} r={5}  fill={meta.color} stroke="var(--bg-surface-1)" strokeWidth={2.5} />
    </g>
  );
}

// ─── Summary stat card ───────────────────────────────────────────────────────
function SummaryCard({ label, value, detail, band }) {
  const meta = BAND_META[band] || BAND_META.quiet;
  return (
    <article style={{
      display: 'grid', gap: '0.4rem',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-xl)',
      border: `1px solid ${BAND_BORDER[band]}`,
      background: 'color-mix(in srgb, var(--bg-surface-2) 72%, transparent)',
      boxShadow: 'inset 0 1px 0 color-mix(in srgb, white 6%, transparent)',
      transition: 'border-color var(--transition-fast)',
    }}>
      <span style={{
        color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.04em',
      }}>
        {label}
      </span>
      <strong style={{
        color: 'var(--text-primary)',
        fontSize: 'clamp(1rem, 1.8vw, 1.22rem)',
        lineHeight: 1.35, fontWeight: 800,
      }}>
        {value}
      </strong>
      <p style={{
        margin: 0, color: 'var(--text-secondary)',
        fontSize: '0.83rem', lineHeight: 1.55,
      }}>
        {detail}
      </p>
      <div style={{
        width: '100%', height: 2, borderRadius: 999,
        background: `linear-gradient(90deg, ${meta.color} 0%, color-mix(in srgb, ${meta.color} 0%, transparent) 100%)`,
        opacity: 0.45, marginTop: 2,
      }} />
    </article>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function HourlyActivityChart({
  chart,
  title = 'خريطة النشاط اليومي',
  currentHour,
}) {
  // Fallback to generated sample data if no chart prop
  const data = chart?.points?.length
    ? chart.points
    : generateSampleData(currentHour ?? new Date().getHours());

  const maxScore   = chart?.maxScore ?? Math.max(...data.map(d => d.score));
  const currentPt  = data.find(d => d.isCurrent) ?? data[new Date().getHours()] ?? data[0];
  const strongestPt= data.reduce((best, pt) => pt.score > best.score ? pt : best, data[0]);
  const activeHrs  = data.filter(d => ['active','peak'].includes(d.band)).length;
  const peakHrs    = data.filter(d => d.band === 'peak').length;

  const [hoveredHour, setHoveredHour] = useState(null);

  const handleMouseMove = useCallback((state) => {
    if (state?.activePayload?.[0]?.payload) {
      setHoveredHour(state.activePayload[0].payload.hour);
    }
  }, []);

  const handleMouseLeave = useCallback(() => setHoveredHour(null), []);

  const displayPt = hoveredHour !== null
    ? (data.find(d => d.hour === hoveredHour) ?? currentPt)
    : currentPt;

  const displayMeta = BAND_META[displayPt.band];
  const currentMeta  = BAND_META[currentPt.band];

  // X-axis tick formatter — show every 3h + current
  const xTickFormatter = (hour) => {
    const pt = data.find(d => d.hour === hour);
    if (!pt) return '';
    if (hour % 6 === 0 || pt.isCurrent) return pt.hourLabel;
    return '';
  };

  return (
    <div className="economy-activity-card" style={{ direction: 'rtl' }}>

      {/* ── Header ── */}
      <div className="economy-section__header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <h3 className="economy-section__title">{title}</h3>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
            border: `1px solid ${BAND_BORDER[currentPt.band]}`,
            background: currentMeta.soft,
            color: currentMeta.color,
            fontSize: 'var(--text-sm)', fontWeight: 700,
            transition: 'all var(--transition-fast)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: currentMeta.color, flexShrink: 0,
              animation: currentPt.band !== 'quiet' ? 'economy-pulse 2s ease-in-out infinite' : 'none',
            }} />
            {currentMeta.label}
          </span>
        </div>
        <p className="economy-section__lead">
          هذا الرسم يحوّل يومك إلى موجة سيولة واضحة: متى يبدأ النشاط، متى يقوى، ومتى تصل السوق إلى أفضل نافذة متابعة.
        </p>
      </div>

      {/* ── Summary cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 'var(--space-3)',
      }}
        className="economy-activity-card__summary-responsive"
      >
        <SummaryCard
          label="الآن"
          value={currentPt.hint}
          detail={currentPt.sessionsLabel}
          band={currentPt.band}
        />
        <SummaryCard
          label="أقوى ساعة"
          value={strongestPt.hourLabel}
          detail={strongestPt.note}
          band={strongestPt.band}
        />
        <SummaryCard
          label="ساعات قوية"
          value={String(activeHrs)}
          detail={peakHrs > 0 ? `${peakHrs} ساعة ضمن الذروة` : 'اليوم يميل إلى هدوء نسبي'}
          band={peakHrs > 0 ? 'peak' : 'quiet'}
        />
      </div>

      {/* ── Chart area ── */}
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div className="economy-activity-chart-scroll">
          <div style={{
            position: 'relative',
            minHeight: 300,
            minWidth: 520,
            borderRadius: 'calc(var(--radius-2xl) - 2px)',
            border: '1px solid color-mix(in srgb, var(--border-default) 80%, transparent)',
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-surface-3) 72%, transparent) 0%, color-mix(in srgb, var(--bg-surface-1) 92%, transparent) 100%)',
            overflow: 'hidden',
            paddingTop: 8,
          }}>
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart
                data={data}
                margin={{ top: 16, right: 20, bottom: 8, left: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="hac-area-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="#FFD166" stopOpacity={0.38} />
                    <stop offset="40%"  stopColor="#74B9FF" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#74B9FF" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="hac-line-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%"   stopColor="#74B9FF" />
                    <stop offset="45%"  stopColor="#06D6A0" />
                    <stop offset="100%" stopColor="#FFD166" />
                  </linearGradient>
                  <filter id="hac-line-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid
                  strokeDasharray="0"
                  stroke="color-mix(in srgb, #222C45 70%, transparent)"
                  strokeWidth={1}
                  vertical={false}
                />

                <XAxis
                  dataKey="hour"
                  tickFormatter={xTickFormatter}
                  tick={{
                    fill: 'var(--text-muted)',
                    fontSize: 11,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  height={28}
                  padding={{ left: 4, right: 4 }}
                />

                <YAxis
                  domain={[0, maxScore]}
                  tick={{
                    fill: 'var(--text-muted)',
                    fontSize: 10,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  tickCount={5}
                  orientation="left"
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: 'color-mix(in srgb, var(--warning) 38%, transparent)',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                  }}
                />

                {/* Current-hour reference line */}
                <ReferenceLine
                  x={currentPt.hour}
                  stroke="color-mix(in srgb, #FFD166 50%, transparent)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="url(#hac-line-gradient)"
                  strokeWidth={3.5}
                  fill="url(#hac-area-gradient)"
                  fillOpacity={1}
                  dot={<CustomDotWithCurrent />}
                  activeDot={<CustomActiveDot />}
                  filter="url(#hac-line-glow)"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Insight panel ── */}
        <div style={{
          display: 'grid', gap: '0.65rem',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-xl)',
          border: `1px solid color-mix(in srgb, var(--border-default) 75%, transparent)`,
          background: 'color-mix(in srgb, var(--bg-surface-2) 74%, transparent)',
          transition: 'border-color var(--transition-fast)',
        }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 8,
          }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
              {displayPt.note}
            </strong>
            <span style={{
              color: displayMeta.color,
              fontSize: '0.82rem', fontWeight: 600,
              transition: 'color var(--transition-fast)',
            }}>
              {displayPt.goldStatus}
            </span>
          </div>

          <p style={{
            margin: 0, color: 'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-sm)',
          }}>
            {displayPt.bestPairs?.length
              ? `الأدوات الأكثر وضوحاً في هذه اللحظة: ${displayPt.bestPairs.join('، ')}.`
              : 'راقب لحظة التداخل القادمة إذا كنت تريد قراءة أوضح للحركة والسيولة.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            {[
              `الساعة: ${displayPt.hourLabel}`,
              `المؤشر: ${displayPt.score}`,
              `الجلسات: ${displayPt.activeCount}`,
            ].map(text => (
              <span key={text} className="economy-meta-pill" style={{ fontSize: 'var(--text-xs)' }}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="economy-activity-chart__legend" style={{ flexWrap: 'wrap', gap: 8 }}>
        {Object.entries(BAND_META).map(([key, item]) => (
          <span key={key} data-band={key} style={{ fontSize: 'var(--text-xs)' }}>
            {item.label}
          </span>
        ))}
      </div>

      {/* ── Inline scoped styles ── */}
      <style>{`
        @keyframes economy-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.35); }
        }

        @media (max-width: 720px) {
          .economy-activity-card__summary-responsive {
            grid-template-columns: 1fr !important;
          }
        }

        @media (min-width: 421px) and (max-width: 720px) {
          .economy-activity-card__summary-responsive {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}