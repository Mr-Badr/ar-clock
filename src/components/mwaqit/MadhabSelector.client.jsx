'use client';
/**
 * components/mwaqit/MadhabSelector.client.jsx
 *
 * Madhab (فقه school) selector affecting Asr prayer time only.
 * Fully aligned with the WAQT design system (new.css v4.1):
 *   - Tab track  : bg-surface-2 + border-subtle + radius-xl + padding space-1
 *   - Active pill: bg-surface-4 + border-accent + shadow-xs + radius-lg
 *   - Active text: accent-alt  |  Inactive: text-secondary
 *   - Cards      : card-nested (bg-surface-3 + border-subtle + radius-lg)
 *   - Chips      : bg-surface-2 + border-subtle + text-muted + radius-full
 *   - Motion     : transition-spring for pill, transition-fast for color changes
 *   - Spacing    : strict 8px grid (--space-* tokens)
 *   - No letter-spacing on Arabic text (design system rule §08)
 */

import { useState, useEffect } from 'react';
import { MADHAB_INFO } from '@/lib/prayer-methods';

// ── Shadow diagram ────────────────────────────────────────────────────────────
function ShadowDiagram({ multiplier = 1, isActive = false }) {
  const objectH = 26;
  const groundY = 34;
  const objectX = 12;
  const shadowW = objectH * multiplier;
  const viewW   = objectX + shadowW + 6;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${groundY + 4}`}
      width={viewW}
      height={groundY + 4}
      aria-hidden="true"
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
    >
      <line
        x1="0" y1={groundY} x2={viewW} y2={groundY}
        stroke="currentColor" strokeWidth="0.75"
        style={{ opacity: 0.18 }}
      />
      <line
        x1={objectX} y1={groundY - objectH}
        x2={objectX} y2={groundY}
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
      <circle cx={objectX} cy={groundY} r="2" fill="currentColor" style={{ opacity: 0.35 }} />
      <line
        x1={objectX} y1={groundY}
        x2={objectX + shadowW} y2={groundY}
        strokeWidth="2.5" strokeLinecap="round"
        style={{
          stroke:     isActive ? 'var(--accent-alt)' : 'currentColor',
          opacity:    isActive ? 1 : 0.25,
          transition: 'stroke var(--transition-fast), opacity var(--transition-fast)',
        }}
      />
      <circle
        cx={objectX + shadowW} cy={groundY} r="1.75"
        style={{
          fill:       isActive ? 'var(--accent-alt)' : 'currentColor',
          opacity:    isActive ? 1 : 0.25,
          transition: 'fill var(--transition-fast), opacity var(--transition-fast)',
        }}
      />
    </svg>
  );
}

// ── Diff helper ───────────────────────────────────────────────────────────────
function diffMinutes(t1, t2) {
  if (!t1 || !t2) return null;
  const parse = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const d = Math.abs(parse(t2) - parse(t1));
  return d > 0 ? d : null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MadhabSelector({
  school        = 'Shafi',
  shafiAsrTime,
  hanafiAsrTime,
  onChange,
  className     = '',
}) {
  const schoolInfo        = MADHAB_INFO[school] ?? MADHAB_INFO.Shafi;
  const defaultComputesAs = schoolInfo.computesAs;

  const [computesAs, setComputesAs] = useState(defaultComputesAs);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('pref_madhab');
      if (saved === 'Shafi' || saved === 'Hanafi') {
        setComputesAs(saved);
        onChange?.(saved);
      } else {
        onChange?.(defaultComputesAs);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(val) {
    setComputesAs(val);
    try { localStorage.setItem('pref_madhab', val); } catch (_) {}
    onChange?.(val);
  }

  const activeValue = mounted ? computesAs : defaultComputesAs;
  const isShafi     = activeValue === 'Shafi';

  const tab1Info   = (school !== 'Hanafi' && MADHAB_INFO[school])
    ? MADHAB_INFO[school]
    : MADHAB_INFO.Shafi;
  const activeInfo = isShafi ? tab1Info : MADHAB_INFO.Hanafi;
  const activeTime = isShafi ? shafiAsrTime : hanafiAsrTime;
  const diff       = diffMinutes(shafiAsrTime, hanafiAsrTime);

  const tab1Label = school === 'Maliki'  ? 'المالكي'
    : school === 'Hanbali' ? 'الحنبلي'
    : 'الشافعي';

  return (
    <div className={className} dir="rtl" style={{ width: '100%' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 'var(--space-3)',
        marginBottom: 'var(--space-5)',
      }}>
        <div>
          <p style={{
            fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)', lineHeight: 'var(--leading-tight)',
          }}>
            المذهب الفقهي
          </p>
          <p style={{
            fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
            marginTop: 'var(--space-1)', lineHeight: 'var(--leading-snug)',
          }}>
            الاختلاف يظهر{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)' }}>
              فقط في وقت العصر
            </span>
          </p>
        </div>

        {diff && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)',
            padding: '3px var(--space-2)', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-3)',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)',
            color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--warning)', display: 'inline-block', flexShrink: 0,
            }} />
            فارق{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums', direction: 'ltr', display: 'inline-block' }}>
              {diff}
            </span>
            {' '}د
          </div>
        )}
      </div>

      {/* ── Segmented control ──────────────────────────────────────────────── */}
      {/*
        Track mirrors .tabs:
          background-color: var(--bg-surface-2)
          border: 1px solid var(--border-subtle)
          border-radius: var(--radius-xl)
          padding: var(--space-1)
          gap: var(--space-1)

        Pill mirrors .tab--active:
          background-color: var(--bg-surface-4)
          border: 1px solid var(--border-accent)
          box-shadow: var(--shadow-xs)
          border-radius: var(--radius-lg)

        Inactive tab mirrors .tab:
          background: transparent
          color: var(--text-secondary)
          border: 1px solid transparent

        Active tab text: var(--accent-alt)  font-semibold
        Motion: var(--transition-spring) on pill position
      */}
      <div
        role="tablist"
        aria-label="اختر المذهب الفقهي"
        style={{
          position: 'relative', display: 'flex', gap: 'var(--space-1)',
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-1)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {/* Sliding pill */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'var(--space-1)', bottom: 'var(--space-1)',
            width: 'calc(50% - var(--space-1) - 1px)',
            right: isShafi ? 'var(--space-1)' : 'calc(50% + 1px)',
            backgroundColor: 'var(--bg-surface-4)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'right var(--transition-spring)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {[
          {
            val:      'Shafi',
            label:    tab1Label,
            rule:     'ظل × 1',
            time:     shafiAsrTime,
            multi:    1,
            isActive: isShafi,
          },
          {
            val:      'Hanafi',
            label:    MADHAB_INFO.Hanafi.label,
            rule:     'ظل × 2',
            time:     hanafiAsrTime,
            multi:    2,
            isActive: !isShafi,
          },
        ].map(tab => (
          <button
            key={tab.val}
            role="tab"
            aria-selected={tab.isActive}
            onClick={() => handleChange(tab.val)}
            style={{
              position: 'relative', zIndex: 1, flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 'var(--space-1-5)',
              padding: 'var(--space-3) var(--space-2)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-lg)',
              background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'opacity var(--transition-fast)',
            }}
            onFocus={e  => e.currentTarget.style.outline = '2px solid var(--accent-alt)'}
            onBlur={e   => e.currentTarget.style.outline = 'none'}
          >
            <ShadowDiagram multiplier={tab.multi} isActive={tab.isActive} />

            {/* School name */}
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: tab.isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
              color: tab.isActive ? 'var(--accent-alt)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}>
              {tab.label}
            </span>

            {/* Rule label */}
            <span style={{
              fontSize: 'var(--text-2xs)', fontFamily: 'monospace',
              color: tab.isActive ? 'var(--text-secondary)' : 'var(--text-muted)',
              opacity: tab.isActive ? 1 : 0.65,
              transition: 'color var(--transition-fast), opacity var(--transition-fast)',
            }}>
              {tab.rule}
            </span>

            {/* Asr time */}
            {tab.time && (
              <span style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-bold)',
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum" 1',
                direction: 'ltr',
                color: tab.isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: tab.isActive ? 1 : 0.45,
                transition: 'color var(--transition-fast), opacity var(--transition-fast)',
              }}>
                {tab.time}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content card — .card-nested ────────────────────────────────────── */}
      {/*
        background-color: var(--bg-surface-3)
        border: 1px solid var(--border-subtle)
        border-radius: var(--radius-lg)
        padding: var(--space-4) var(--space-5)
        box-shadow: var(--shadow-xs)
      */}
      <div style={{
        backgroundColor: 'var(--bg-surface-3)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-5)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: 'var(--space-3)',
      }}>

        {/* Rule badge + time row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: 'var(--space-3)', marginBottom: 'var(--space-4)',
        }}>
          {/* Rule badge — accent-soft bg, border-accent border */}
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 'var(--text-xs)', fontFamily: 'monospace',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--accent-alt)',
            background: 'var(--accent-soft)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-1-5) var(--space-2-5)',
          }}>
            {activeInfo.asrRule}
          </span>

          {/* Asr time — clock-digit style */}
          {activeTime && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-1-5)', direction: 'ltr' }}>
              <span style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-extrabold)',
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum" 1',
                letterSpacing: 'var(--tracking-clock)',
                lineHeight: 'var(--leading-none)',
                color: 'var(--clock-digit-color)',
              }}>
                {activeTime}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                العصر
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 'var(--space-4)' }} />

        {/* Description */}
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-4)',
        }}>
          {activeInfo.description}
        </p>

        {/* Country chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1-5)' }}>
          {activeInfo.countries.map(c => (
            <span key={c} style={{
              display: 'inline-flex', alignItems: 'center',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '2px var(--space-2-5)',
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Comparison strip ───────────────────────────────────────────────── */}
      {shafiAsrTime && hanafiAsrTime && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-2-5) var(--space-4)',
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>

          {/* Shafi side */}
          <button
            onClick={() => handleChange('Shafi')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
              fontFamily: 'inherit',
              opacity: isShafi ? 1 : 0.45,
              transition: 'opacity var(--transition-fast)',
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--text-secondary)',
              display: 'inline-block', flexShrink: 0,
              outline: isShafi ? '2px solid var(--text-secondary)' : 'none',
              outlineOffset: 2,
              transition: 'outline var(--transition-fast)',
            }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {tab1Label}
            </span>
            <span style={{
              fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
              fontVariantNumeric: 'tabular-nums', direction: 'ltr',
              color: 'var(--text-primary)',
            }}>
              {shafiAsrTime}
            </span>
          </button>

          {/* Diff pill */}
          {diff ? (
            <span style={{
              fontSize: 'var(--text-2xs)', fontFamily: 'monospace',
              fontWeight: 'var(--font-semibold)',
              padding: '2px var(--space-2)',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--warning-soft)',
              border: '1px solid var(--warning-border)',
              color: 'var(--warning)',
              whiteSpace: 'nowrap', direction: 'ltr',
            }}>
              +{diff}د
            </span>
          ) : (
            <span style={{ color: 'var(--border-default)', fontSize: 'var(--text-sm)' }}>|</span>
          )}

          {/* Hanafi side */}
          <button
            onClick={() => handleChange('Hanafi')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
              fontFamily: 'inherit',
              opacity: !isShafi ? 1 : 0.45,
              transition: 'opacity var(--transition-fast)',
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--warning)',
              display: 'inline-block', flexShrink: 0,
              outline: !isShafi ? '2px solid var(--warning)' : 'none',
              outlineOffset: 2,
              transition: 'outline var(--transition-fast)',
            }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {MADHAB_INFO.Hanafi.label}
            </span>
            <span style={{
              fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
              fontVariantNumeric: 'tabular-nums', direction: 'ltr',
              color: 'var(--text-primary)',
            }}>
              {hanafiAsrTime}
            </span>
          </button>

        </div>
      )}
    </div>
  );
}