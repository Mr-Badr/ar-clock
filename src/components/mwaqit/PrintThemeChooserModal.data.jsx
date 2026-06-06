/**
 * PrintThemeChooserModal.data.jsx
 *
 * SERVER-SAFE module — no 'use client', no hooks, no event handlers.
 * Exports:
 *   HEADERS       — column header labels
 *   ROWS          — preview table data (30 rows)
 *   L / D         — light / dark palette objects (exact match to route.js v9)
 *   A4Preview     — pure presentational component (inline styles, no state)
 *   ThemeCardBase — layout shell; parent wires onClick / selected
 *
 * SEO NOTE: Because this file has no client boundary, Next.js can statically
 * analyse and tree-shake it.  The strings, labels and palette values are
 * embedded in the initial HTML — no JS required to render them.
 */

import { Sun, Moon, Check } from '@phosphor-icons/react/dist/ssr';
import styles from './PrintThemeChooserModal.module.css';

// ─── Preview data ─────────────────────────────────────────────────────────────

const DAYS = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

export const HEADERS = [
  'اليوم', 'الهجري', 'الميلادي',
  'الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء',
];

export const ROWS = Array.from({ length: 30 }, (_, i) => {
  const dayIndex = i % 7;
  const isFriday = DAYS[dayIndex] === 'الجمعة';
  return {
    day: DAYS[dayIndex],
    greg: String(i + 1),
    h: String(i + 2),
    times: [
      `04:${50 + (i % 5)}`,
      `06:${15 + (i % 5)}`,
      `12:${5  + (i % 3)}`,
      `15:${25 + (i % 5)}`,
      `17:${50 - (i % 5)}`,
      `19:${20 - (i % 5)}`,
    ],
    ...(isFriday && { friday: true }),
  };
});

// ─── Palettes — exact match to route.js v9 ───────────────────────────────────

export const L = {
  page:                    'var(--surface)',
  titleText:               'var(--text-primary)',
  titleAccent:             'var(--blue-text)',
  subtitleText:            'var(--text-secondary)',
  badgeBg:                 'color-mix(in srgb, var(--border-default) 35%, transparent)',
  badgeBorder:             'color-mix(in srgb, var(--border-default) 35%, transparent)',
  badgeText:               'var(--blue-text)',
  logoBg:                  'color-mix(in srgb, var(--border-default) 35%, transparent)',
  logoBorder:              'color-mix(in srgb, var(--border-default) 35%, transparent)',
  logoText:                'var(--blue-text)',
  logoPlaceholder:         'color-mix(in srgb, var(--border-default) 35%, transparent)',
  logoPlaceholderBorder:   'color-mix(in srgb, var(--border-default) 35%, transparent)',
  theadBg:                 'var(--blue)',
  theadText:               'var(--text-on-accent)',
  rowBg:                   'var(--surface)',
  rowFridayBg:             'color-mix(in srgb, var(--border-default) 35%, transparent)',
  rowBorder:               'var(--border-default)',
  cellText:                'var(--text-primary)',
  cellSub:                 'var(--text-secondary)',
  timeText:                'var(--blue-text)',
  fridayText:              'var(--success-text)',
  fridayTime:              'var(--success-text)',
  footerText:              'var(--text-muted)',
  footerUrl:               'var(--blue-text)',
};

export const D = {
  page:                    'var(--surface)',
  titleText:               'var(--text-primary)',
  titleAccent:             'var(--blue-text)',
  subtitleText:            'var(--text-secondary)',
  badgeBg:                 'color-mix(in srgb, var(--border-default) 35%, transparent)',
  badgeBorder:             'color-mix(in srgb, var(--border-default) 35%, transparent)',
  badgeText:               'var(--blue-text)',
  logoBg:                  'color-mix(in srgb, var(--border-default) 35%, transparent)',
  logoBorder:              'color-mix(in srgb, var(--border-default) 35%, transparent)',
  logoText:                'var(--blue-text)',
  logoPlaceholder:         'color-mix(in srgb, var(--border-default) 35%, transparent)',
  logoPlaceholderBorder:   'color-mix(in srgb, var(--border-default) 35%, transparent)',
  theadBg:                 'var(--blue)',
  theadText:               'var(--text-on-accent)',
  rowBg:                   'var(--bg-surface-1)',
  rowFridayBg:             'color-mix(in srgb, var(--border-default) 35%, transparent)',
  rowBorder:               'var(--border-default)',
  cellText:                'var(--text-primary)',
  cellSub:                 'var(--text-secondary)',
  timeText:                'var(--blue-text)',
  fridayText:              'var(--success-text)',
  fridayTime:              'var(--success-text)',
  footerText:              'var(--text-muted)',
  footerUrl:               'var(--blue-text)',
};

// ─── A4 Preview ───────────────────────────────────────────────────────────────
// Pure presentational — no state, no hooks. Safe to render on the server.

const cols = '2.2fr 0.9fr 0.7fr 1fr 1fr 1fr 1fr 1fr 1fr';
const mono = '"IBM Plex Mono","Courier New",monospace';

export function A4Preview({ isDark }) {
  const C    = isDark ? D : L;
  const sans = 'var(--font-base)';

  return (
    <div style={{
      width: '100%',
      aspectRatio: '210 / 240',
      background: C.page,
      borderRadius: '6px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: sans,
      direction: 'rtl',
      userSelect: 'none',
      fontSize: '0px',
    }}>

      {/* HEADER */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '6px',
        padding: '7px 10px 6px',
        fontFamily: sans,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <div style={{ fontSize: '8px', fontWeight: 800, color: C.titleText, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
            تقويم مواقيت الصلاة
            <span style={{ color: C.titleAccent }}> : الرباط</span>
          </div>
          <div style={{ fontSize: '4.5px', color: C.subtitleText, whiteSpace: 'nowrap' }}>
            جدول أوقات الصلاة الشهري · الفجر · الشروق · الظهر · العصر · المغرب · العشاء
          </div>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginTop: '1px' }}>
            <span style={{
              fontSize: '4px', fontWeight: 700, color: C.badgeText,
              background: C.badgeBg, border: `0.5px solid ${C.badgeBorder}`,
              borderRadius: '999px', padding: '1px 4px',
            }}>مارس 2026</span>
            <span style={{
              fontSize: '4px', fontWeight: 700, color: C.subtitleText,
              background: 'var(--bg-surface-2)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 'var(--radius-xs)', padding: '1px 4px',
            }}>رمضان 1447</span>
          </div>
        </div>

        {/* Logo block */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
          background: C.logoBg, border: `0.5px solid ${C.logoBorder}`,
          borderRadius: '5px', padding: '4px 6px 3px', flexShrink: 0,
        }}>
          <div style={{
            width: '14px', height: '14px',
            background: C.logoPlaceholder,
            border: `1px dashed ${C.logoPlaceholderBorder}`,
            borderRadius: '3px', flexShrink: 0,
          }} />
          <span style={{ fontSize: '5px', fontWeight: 800, color: C.logoText, whiteSpace: 'nowrap' }}>
            MiqaTona.com
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Thead */}
        <div style={{
          background: C.theadBg, flexShrink: 0,
          display: 'grid', gridTemplateColumns: cols,
          alignItems: 'center',
        }}>
          {HEADERS.map((h, i) => (
            <div key={i} style={{
              padding: '2.5px 2px',
              fontSize: '4px', fontWeight: 700, color: C.theadText,
              textAlign: i === 0 ? 'start' : 'center',
              paddingInlineEnd: i === 0 ? '5px' : '2px',
              overflow: 'hidden', whiteSpace: 'nowrap',
            }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {ROWS.map((row, i) => {
            const bg      = row.friday ? C.rowFridayBg : C.rowBg;
            const dayCol  = row.friday ? C.fridayText  : C.cellText;
            const timeCol = row.friday ? C.fridayTime  : C.timeText;
            return (
              <div key={i} style={{
                background: bg,
                borderBottom: `0.5px solid ${C.rowBorder}`,
                display: 'grid', gridTemplateColumns: cols,
                alignItems: 'center', overflow: 'hidden',
              }}>
                <div style={{ fontSize: '5px', fontWeight: 600, color: dayCol, textAlign: 'start', paddingInlineEnd: '5px', overflow: 'hidden', whiteSpace: 'nowrap' }}>{row.day}</div>
                <div style={{ fontSize: '4.5px', fontWeight: 600, color: dayCol, textAlign: 'center' }}>{row.h}</div>
                <div style={{ fontSize: '4.5px', color: C.cellSub, textAlign: 'center', fontWeight: 600 }}>{row.greg}</div>
                {row.times.map((t, j) => (
                  <div key={j} style={{
                    fontSize: '4.5px', color: timeCol,
                    fontFamily: mono, textAlign: 'center',
                    fontVariantNumeric: 'tabular-nums', fontWeight: 500,
                  }}>{t}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        flexShrink: 0, padding: '3px 10px 4px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '3.5px', color: C.footerText }}>
          جدول مواقيت الصلاة الشهري للرباط: حسابات فلكية دقيقة
        </span>
        <span style={{ fontSize: '4px', color: C.footerUrl, fontWeight: 700 }}>
          MiqaTona.com
        </span>
      </div>
    </div>
  );
}

// ─── ThemeCard (presentation layer) ──────────────────────────────────────────
// Receives `selected`, `onSelect`, and `isDark` from the client wrapper.

export function ThemeCard({ isDark, selected, onSelect }) {
  const accent  = 'var(--blue-text)';
  const cardBg  = 'var(--bg-surface-1)';
  const selBg   = 'var(--blue-subtle)';
  const unselBd = 'var(--border-default)';
  const label   = isDark ? 'الوضع الليلي' : 'الوضع النهاري';
  const desc    = isDark ? 'خلفية داكنة · موفّر للحبر' : 'خلفية بيضاء · وضوح مثالي';
  const Icon    = isDark ? Moon : Sun;

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`اختر ${label}`}
      className={styles.themeCard}
      style={{
        background:  selected ? selBg : cardBg,
        border:      `2px solid ${selected ? accent : unselBd}`,
        boxShadow:   'none',
      }}
    >
      {/* Selection circle */}
      <div
        className={styles.selIndicator}
        style={{
          background: selected ? 'var(--blue)' : 'var(--bg-surface-2)',
          border:     selected ? 'none' : '1.5px solid var(--border-default)',
        }}
      >
        {selected && <Check size={10} color="var(--text-on-accent)" weight="bold" />}
      </div>

      {/* Preview */}
      <div
        className={styles.previewWrap}
        style={{
          boxShadow: 'none',
        }}
      >
        <A4Preview isDark={isDark} />
      </div>

      {/* Label */}
      <div className={styles.cardLabel}>
        <Icon
          size={14}
          color={selected ? accent : 'var(--text-muted)'}
          style={{ flexShrink: 0, transition: 'color 0.18s' }}
        />
        <div>
          <div
            className={styles.labelName}
            style={{ color: selected ? accent : 'var(--text-primary)' }}
          >
            {label}
          </div>
          <div
            className={styles.labelDesc}
            style={{ color: 'var(--text-muted)' }}
          >
            {desc}
          </div>
        </div>
      </div>
    </button>
  );
}
