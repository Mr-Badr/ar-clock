'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeftRight, Clock, ChevronUp, ChevronDown } from 'lucide-react';

const PRESETS = [
  { label: '8:00 ص', h: 8, m: 0, p: 'am' },
  { label: '12:00 م', h: 12, m: 0, p: 'pm' },
  { label: '3:00 م', h: 3, m: 0, p: 'pm' },
  { label: '5:00 م', h: 5, m: 0, p: 'pm' },
  { label: '9:00 م', h: 9, m: 0, p: 'pm' },
];

const MINUTES = [0, 15, 30, 45];

function to24h(h12, m, period) {
  let h = h12 % 12;
  if (period === 'pm') h += 12;
  return h * 60 + m;
}

function fromMinutes(totalMins) {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h24 >= 12 ? 'م' : 'ص';
  const h12 = h24 % 12 || 12;
  return { h12, m, period };
}

function dayIndicator(srcTotalMins, diffMins) {
  const dest = srcTotalMins + diffMins;
  if (dest >= 1440) return '+1 يوم';
  if (dest < 0) return '-1 يوم';
  return null;
}

/* ─────────────────────────────────────────
   SpinnerCol
───────────────────────────────────────── */
function SpinnerCol({ value, onUp, onDown, onCommit, min, max, label, snapValues }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const startEdit = () => {
    setRaw(String(value).padStart(2, '0'));
    setError(false);
    setEditing(true);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < min || parsed > max) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setEditing(false);
        setRaw(String(value).padStart(2, '0'));
      }, 700);
      return;
    }
    if (snapValues) {
      const snapped = snapValues.reduce((prev, curr) =>
        Math.abs(curr - parsed) < Math.abs(prev - parsed) ? curr : prev
      );
      onCommit(snapped);
    } else {
      onCommit(parsed);
    }
    setEditing(false);
    setError(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setEditing(false); setError(false); }
    if (e.key === 'ArrowUp') { e.preventDefault(); onUp(); setEditing(false); }
    if (e.key === 'ArrowDown') { e.preventDefault(); onDown(); setEditing(false); }
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: 'var(--space-1)' }}>

      {/* Label — EN token only, no letter-spacing on Arabic */}
      <span style={{
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-muted)',
        letterSpacing: 'var(--tracking-wide)', // safe: used on short label, not Arabic prose
      }}>
        {label}
      </span>

      {/* Up button */}
      <button
        onClick={onUp}
        aria-label={`زيادة ${label}`}
        className="btn btn-ghost btn-icon group"
        style={{
          width: '44px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <ChevronUp
          size={18}
          strokeWidth={2.5}
          style={{ transition: 'transform var(--transition-fast)' }}
          className="group-hover:-translate-y-0.5"
        />
      </button>

      {/* Tile — display or edit */}
      <div
        onClick={!editing ? startEdit : undefined}
        className={error ? 'spinner-tile spinner-tile--error' : editing ? 'spinner-tile spinner-tile--active' : 'spinner-tile'}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
      >
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={raw}
            onChange={e => { setRaw(e.target.value); setError(false); }}
            onBlur={commit}
            onKeyDown={handleKey}
            aria-label={label}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              textAlign: 'center',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-extrabold)',
              color: 'var(--accent-alt)',
              outline: 'none',
              border: 'none',
              appearance: 'textfield',
            }}
            dir="ltr"
          />
        ) : (
          <span
            className="tabular-nums"
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-extrabold)',
              color: error ? 'var(--danger)' : 'var(--accent-alt)',
              lineHeight: 'var(--leading-none)',
              transition: 'color var(--transition-fast)',
            }}
            dir="ltr"
          >
            {String(value).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Inline error hint — valid range */}
      <span style={{
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--danger)',
        height: '14px',
        lineHeight: '1',
        opacity: error ? 1 : 0,
        transition: 'opacity var(--transition-fast)',
      }}>
        {snapValues ? '0 · 15 · 30 · 45' : `${min}–${max}`}
      </span>

      {/* Down button */}
      <button
        onClick={onDown}
        aria-label={`تقليل ${label}`}
        className="btn btn-ghost btn-icon group"
        style={{
          width: '44px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          style={{ transition: 'transform var(--transition-fast)' }}
          className="group-hover:translate-y-0.5"
        />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   AM/PM Toggle
───────────────────────────────────────── */
function PeriodToggle({ period, onChange }) {
  return (
    <div className="flex flex-col self-center" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
      {['am', 'pm'].map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-bold)',
            transition: 'background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
            ...(period === p ? {
              background: 'var(--accent-gradient)',
              color: 'var(--text-on-accent)',
              border: '1px solid transparent',
              boxShadow: 'var(--shadow-accent)',
              transform: 'scale(1.05)',
            } : {
              background: 'var(--bg-surface-3)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-default)',
            }),
          }}
        >
          {p === 'am' ? 'ص' : 'م'}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   City label — shared by both cards
───────────────────────────────────────── */
function CityLabel({ name, accentColor }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(to left, ${accentColor}, transparent)`,
        opacity: 0.4,
      }} />
      <div className="flex items-center" style={{ gap: 'var(--space-2)', flexShrink: 0 }}>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: 'var(--radius-full)',
          background: accentColor,
          flexShrink: 0,
          opacity: 0.85,
        }} />
        <span style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          lineHeight: 'var(--leading-tight)',
        }}>
          {name}
        </span>
      </div>
      <div style={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(to right, ${accentColor}, transparent)`,
        opacity: 0.4,
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Source Input Card
───────────────────────────────────────── */
function SourceCard({ srcCity, hour, minute, period, setHour, setMinute, setPeriod, incHour, decHour, incMin, decMin }) {
  return (
    <div className="flex flex-col min-w-0" style={{ flex: 1 }}>
      <CityLabel name={srcCity.city_name_ar} accentColor="var(--accent-alt)" />

      <div
        className="flex-1 flex items-center justify-center"
        style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-4) var(--space-3)',
          gap: 'var(--space-2)',
        }}
      >
        <SpinnerCol
          value={hour}
          onUp={incHour}
          onDown={decHour}
          onCommit={v => setHour(v)}
          min={1}
          max={12}
          label="ساعة"
        />

        <span
          className="tabular-nums"
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-extrabold)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--leading-none)',
            alignSelf: 'center',
            marginTop: 'var(--space-5)',
            userSelect: 'none',
          }}
        >
          :
        </span>

        <SpinnerCol
          value={minute}
          onUp={incMin}
          onDown={decMin}
          onCommit={v => setMinute(v)}
          min={0}
          max={45}
          label="دقيقة"
          snapValues={MINUTES}
        />

        <div style={{
          width: '1px',
          alignSelf: 'stretch',
          background: 'var(--border-subtle)',
          margin: 'var(--space-3) var(--space-1)',
        }} />

        <PeriodToggle period={period} onChange={setPeriod} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Destination Output Card
───────────────────────────────────────── */
function DestCard({ destCity, destResult, dayLabel }) {
  return (
    <div className="flex flex-col min-w-0" style={{ flex: 1 }}>
      <CityLabel name={destCity.city_name_ar} accentColor="var(--accent-alt)" />

      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          background: 'var(--accent-gradient)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-4) var(--space-3)',
          gap: 'var(--space-3)',
          boxShadow: 'var(--shadow-accent)',
        }}
      >
        <div className="flex flex-col items-center" style={{ gap: 'var(--space-1)' }}>
          <span style={{
            fontSize: 'var(--text-2xs)',
            fontWeight: 'var(--font-semibold)',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: 'var(--tracking-wide)',
          }}>
            الوقت المحوَّل
          </span>
          <span
            className="tabular-nums"
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-extrabold)',
              color: '#FFFFFF',
              lineHeight: 'var(--leading-none)',
            }}
            dir="ltr"
          >
            {String(destResult.h12).padStart(2, '0')}:{String(destResult.m).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'rgba(255,255,255,0.75)',
          }}>
            {destResult.period}
          </span>
        </div>

        {dayLabel ? (
          <span style={{
            background: 'rgba(255,255,255,0.18)',
            color: '#FFFFFF',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            padding: 'var(--space-1-5) var(--space-3)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            {dayLabel}
          </span>
        ) : (
          <span style={{
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.45)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            padding: 'var(--space-1-5) var(--space-3)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            نفس اليوم
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Swap Button
───────────────────────────────────────── */
function SwapButton({ onClick, isAnimating }) {
  return (
    <button
      onClick={onClick}
      aria-label="تبديل اتجاه التحويل"
      style={{
        flexShrink: 0,
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-surface-3)',
        border: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        boxShadow: 'var(--shadow-xs)',
        cursor: 'pointer',
        transform: isAnimating ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: `transform var(--duration-slow) var(--ease-spring), color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-accent-strong)';
        e.currentTarget.style.color = 'var(--accent-alt)';
        e.currentTarget.style.background = 'var(--accent-soft)';
        e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.background = 'var(--bg-surface-3)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      }}
    >
      <ArrowLeftRight size={18} strokeWidth={2} />
    </button>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function TimeConverter({ fromCity, toCity, totalMinutes = 0 }) {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState('am');
  const [swapped, setSwapped] = useState(false);
  const [swapAnim, setSwapAnim] = useState(false);

  const effectiveDiff = swapped ? -totalMinutes : totalMinutes;
  const srcCity = swapped ? toCity : fromCity;
  const destCity = swapped ? fromCity : toCity;

  const srcTotalMins = to24h(hour, minute, period);
  const destResult = fromMinutes(srcTotalMins + effectiveDiff);
  const dayLabel = dayIndicator(srcTotalMins, effectiveDiff);

  const incHour = () => setHour(h => (h % 12) + 1);
  const decHour = () => setHour(h => (h === 1 ? 12 : h - 1));

  const minuteIdx = MINUTES.indexOf(minute);
  const incMin = () => setMinute(MINUTES[(minuteIdx + 1) % MINUTES.length]);
  const decMin = () => setMinute(MINUTES[(minuteIdx - 1 + MINUTES.length) % MINUTES.length]);

  const handleSwap = () => {
    setSwapAnim(true);
    setSwapped(s => !s);
    setTimeout(() => setSwapAnim(false), 400);
  };

  const selectPreset = useCallback((p) => {
    setHour(p.h);
    setMinute(p.m);
    setPeriod(p.p);
  }, []);

  const periodLabel = period === 'am' ? 'صباحًا' : 'مساءً';

  if (!fromCity || !toCity) return null;

  return (
    <div
      role="region"
      aria-label="أداة تحويل الوقت السريع"
      className="section"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center"
        style={{
          gap: 'var(--space-3)',
          padding: 'var(--space-5) var(--space-6) var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{
          background: 'var(--accent-soft)',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Clock size={20} style={{ color: 'var(--accent-alt)' }} />
        </div>
        <div>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            lineHeight: 'var(--leading-tight)',
          }}>
            تحويل الوقت السريع
          </h4>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginTop: 'var(--space-1)',
          }}>
            أدخل وقتًا في أي مدينة واعرف مقابله
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: 'var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

        {/* Conversion layout — responsive */}
        <div
          className="time-converter-grid"
          style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-3)' }}
        >
          <SourceCard
            srcCity={srcCity}
            hour={hour}
            minute={minute}
            period={period}
            setHour={setHour}
            setMinute={setMinute}
            setPeriod={setPeriod}
            incHour={incHour}
            decHour={decHour}
            incMin={incMin}
            decMin={decMin}
          />

          {/* Swap column */}
          <div className="flex flex-col items-center justify-center" style={{ gap: 'var(--space-2)', paddingTop: 'var(--space-7)', flexShrink: 0 }}>
            <div style={{ flex: 1, width: '1px', background: 'var(--border-subtle)', maxHeight: '32px' }} />
            <SwapButton onClick={handleSwap} isAnimating={swapAnim} />
            <div style={{ flex: 1, width: '1px', background: 'var(--border-subtle)', maxHeight: '32px' }} />
          </div>

          <DestCard
            destCity={destCity}
            destResult={destResult}
            dayLabel={dayLabel}
          />
        </div>

        {/* Summary sentence */}
        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 'var(--leading-relaxed)',
        }}>
          {hour}:{String(minute).padStart(2, '0')} {periodLabel} في{' '}
          <strong style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-semibold)' }}>
            {srcCity.city_name_ar}
          </strong>
          {' = '}
          <strong style={{ color: 'var(--accent-alt)', fontWeight: 'var(--font-semibold)' }}>
            {destResult.h12}:{String(destResult.m).padStart(2, '0')} {destResult.period}
          </strong>
          {' في '}
          <strong style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-semibold)' }}>
            {destCity.city_name_ar}
          </strong>
          {dayLabel && (
            <span style={{ color: 'var(--warning)' }}> ({dayLabel})</span>
          )}
        </p>

        {/* Preset chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-muted)',
          }}>
            اختر وقتًا شائعًا:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {PRESETS.map(p => {
              const isActive = hour === p.h && minute === p.m && period === p.p;
              return (
                <button
                  key={p.label}
                  onClick={() => selectPreset(p)}
                  style={{
                    padding: 'var(--space-1-5) var(--space-3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-semibold)',
                    transition: 'background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    ...(isActive ? {
                      background: 'var(--accent-gradient)',
                      color: 'var(--text-on-accent)',
                      border: '1px solid transparent',
                      boxShadow: 'var(--shadow-accent)',
                    } : {
                      background: 'var(--bg-surface-3)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-default)',
                    }),
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* Spinner tile — base */
        .spinner-tile {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-xl);
          border: 2px solid var(--border-default);
          background: var(--bg-surface-3);
          cursor: text;
          user-select: none;
          transition:
            border-color var(--transition-fast),
            background var(--transition-fast),
            box-shadow var(--transition-fast);
        }
        .spinner-tile:hover {
          border-color: var(--border-accent-strong);
          background: var(--accent-soft);
        }
        .spinner-tile--active {
          border-color: var(--border-accent-strong);
          background: var(--accent-soft);
          box-shadow: var(--shadow-focus);
        }
        .spinner-tile--error {
          border-color: var(--danger-border);
          background: var(--danger-soft);
          animation: tc-shake 0.4s var(--ease-out);
        }

        /* Responsive: stack vertically on small screens */
        @media (max-width: 540px) {
          .time-converter-grid {
            flex-direction: column !important;
          }
          .time-converter-grid > div:nth-child(2) {
            flex-direction: row !important;
            padding-top: 0 !important;
          }
          .time-converter-grid > div:nth-child(2) > div {
            width: 32px !important;
            height: 1px !important;
            max-height: unset !important;
          }
        }

        /* Shake */
        @keyframes tc-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-5px); }
          40%       { transform: translateX(5px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }

        /* Remove number input arrows globally for this component */
        .spinner-tile input[type=number]::-webkit-outer-spin-button,
        .spinner-tile input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        .spinner-tile input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}