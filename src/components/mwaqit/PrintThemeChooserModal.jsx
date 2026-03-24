'use client';

/**
 * PrintThemeChooserModal.jsx — v2
 *
 * Redesigned modal for choosing light / dark PDF theme before download.
 * The preview thumbnails now accurately mirror the v9 PDF output:
 *   ✦ A4 portrait ratio  (210:297)
 *   ✦ No divider lines on header or footer
 *   ✦ No borders on thead cells
 *   ✦ Friday row: background only, no border
 *   ✦ Thead: text labels only, no icons
 *   ✦ Logo block: stacked vertically (placeholder box + name below)
 *   ✦ Uniform row backgrounds (no zebra)
 *   ✦ All rows showing, clean compact layout
 *
 * Props
 * ─────
 *   isOpen     boolean           Controls visibility
 *   onClose    () => void        Called on ESC / backdrop / Cancel
 *   onSelect   (theme) => void   Called when user confirms — 'light' | 'dark'
 *   actionType 'download'        Reserved for future use
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, Check, X, Download, Sparkles } from 'lucide-react';

// ─── Preview data — 8 rows, one Friday ───────────────────────────────────────

const ROWS = [
  { day: 'الأحد',     greg: '1',  h: '٢',  times: ['04:52', '06:18', '12:08', '15:30', '17:58', '19:22'] },
  { day: 'الإثنين',  greg: '2',  h: '٣',  times: ['04:53', '06:19', '12:08', '15:31', '17:57', '19:21'] },
  { day: 'الثلاثاء', greg: '3',  h: '٤',  times: ['04:54', '06:19', '12:09', '15:31', '17:57', '19:21'] },
  { day: 'الأربعاء', greg: '4',  h: '٥',  times: ['04:55', '06:20', '12:09', '15:32', '17:56', '19:20'] },
  { day: 'الخميس',   greg: '5',  h: '٦',  times: ['04:55', '06:20', '12:09', '15:32', '17:56', '19:20'] },
  { day: 'الجمعة',   greg: '6',  h: '٧',  times: ['04:56', '06:21', '12:10', '15:33', '17:55', '19:19'], friday: true },
  { day: 'السبت',    greg: '7',  h: '٨',  times: ['04:57', '06:21', '12:10', '15:33', '17:55', '19:19'] },
  { day: 'الأحد',    greg: '8',  h: '٩',  times: ['04:58', '06:22', '12:10', '15:34', '17:54', '19:18'] },
];

const HEADERS = ['اليوم', 'ه', 'م', 'الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'];

// ─── Palettes — exact match to route.js v9 ───────────────────────────────────

const L = {
  page:         '#FFFFFF',
  titleText:    '#0E1220',
  titleAccent:  '#1D4ED8',
  subtitleText: '#3D4668',
  badgeBg:      'rgba(29,78,216,0.07)',
  badgeBorder:  'rgba(29,78,216,0.20)',
  badgeText:    '#1D4ED8',
  logoBg:       'rgba(29,78,216,0.06)',
  logoBorder:   'rgba(29,78,216,0.20)',
  logoText:     '#1D4ED8',
  logoPlaceholder: 'rgba(29,78,216,0.07)',
  logoPlaceholderBorder: 'rgba(29,78,216,0.22)',
  theadBg:      '#1E3A8A',
  theadText:    '#FFFFFF',
  rowBg:        '#FFFFFF',
  rowFridayBg:  'rgba(4,102,69,0.06)',
  rowBorder:    '#E8EEF8',
  cellText:     '#0E1220',
  cellSub:      '#3D4668',
  timeText:     '#1D4ED8',
  fridayText:   '#046645',
  fridayTime:   '#046645',
  footerText:   '#7A88A8',
  footerUrl:    '#1D4ED8',
};

const D = {
  page:         '#0D1117',
  titleText:    '#F0F4FF',
  titleAccent:  '#8CAEFF',
  subtitleText: '#A8B2CB',
  badgeBg:      'rgba(140,174,255,0.12)',
  badgeBorder:  'rgba(140,174,255,0.25)',
  badgeText:    '#8CAEFF',
  logoBg:       'rgba(140,174,255,0.10)',
  logoBorder:   'rgba(140,174,255,0.25)',
  logoText:     '#8CAEFF',
  logoPlaceholder: 'rgba(140,174,255,0.10)',
  logoPlaceholderBorder: 'rgba(140,174,255,0.25)',
  theadBg:      '#060B14',
  theadText:    '#E2E8F7',
  rowBg:        '#161D2E',
  rowFridayBg:  'rgba(6,214,160,0.10)',
  rowBorder:    '#222C45',
  cellText:     '#F0F4FF',
  cellSub:      '#A8B2CB',
  timeText:     '#8CAEFF',
  fridayText:   '#06D6A0',
  fridayTime:   '#06D6A0',
  footerText:   '#6B7FA0',
  footerUrl:    '#8CAEFF',
};

// ─── A4Portrait Preview ───────────────────────────────────────────────────────
// Faithfully reproduces the v9 Puppeteer output in miniature.
// Ratio: 210:297 (portrait). Everything is inline styles for isolation.

function A4Preview({ isDark }) {
  const C = isDark ? D : L;

  const mono = '"IBM Plex Mono","Courier New",monospace';
  const sans = '"Noto Kufi Arabic",system-ui,sans-serif';

  // Column grid: اليوم | ه | م | ×6 prayers
  // Proportional to route.js: 22% | 11% | 8% | ~9.8%×6
  const cols = '2.2fr 0.9fr 0.7fr 1fr 1fr 1fr 1fr 1fr 1fr';

  return (
    <div style={{
      width: '100%',
      aspectRatio: '210 / 297',
      background: C.page,
      borderRadius: '6px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: sans,
      direction: 'rtl',
      userSelect: 'none',
      fontSize: '0px', // reset
    }}>

      {/* ══ HEADER ══ no bottom border line */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '6px',
        padding: '7px 10px 6px',
        fontFamily: sans,
      }}>
        {/* Left — title + subtitle + badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <div style={{ fontSize: '8px', fontWeight: 800, color: C.titleText, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
            تقويم مواقيت الصلاة
            <span style={{ color: C.titleAccent }}> — الرباط</span>
          </div>
          <div style={{ fontSize: '4.5px', color: C.subtitleText, whiteSpace: 'nowrap' }}>
            جدول أوقات الصلاة الشهري · الفجر · الشروق · الظهر · العصر · المغرب · العشاء
          </div>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginTop: '1px' }}>
            <span style={{
              fontSize: '4px', fontWeight: 700, color: C.badgeText,
              background: C.badgeBg, border: `0.5px solid ${C.badgeBorder}`,
              borderRadius: '999px', padding: '1px 4px',
            }}>📅 مارس 2026</span>
            <span style={{
              fontSize: '4px', fontWeight: 700, color: C.subtitleText,
              background: isDark ? 'rgba(255,255,255,0.04)' : '#F0F4FA',
              border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#C8D4E8'}`,
              borderRadius: '999px', padding: '1px 4px',
            }}>🌙 رمضان 1447</span>
          </div>
        </div>

        {/* Right — vertical logo block */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
          background: C.logoBg, border: `0.5px solid ${C.logoBorder}`,
          borderRadius: '5px', padding: '4px 6px 3px', flexShrink: 0,
        }}>
          {/* Logo placeholder square */}
          <div style={{
            width: '14px', height: '14px',
            background: C.logoPlaceholder,
            border: `1px dashed ${C.logoPlaceholderBorder}`,
            borderRadius: '3px', flexShrink: 0,
          }} />
          <span style={{ fontSize: '5px', fontWeight: 800, color: C.logoText, whiteSpace: 'nowrap' }}>
            MiqaTime
          </span>
        </div>
      </div>

      {/* ══ TABLE ══ */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Thead — no cell borders, text only */}
        <div style={{
          background: C.theadBg, flexShrink: 0,
          display: 'grid', gridTemplateColumns: cols,
          alignItems: 'center',
        }}>
          {HEADERS.map((h, i) => (
            <div key={i} style={{
              padding: '2.5px 2px',
              fontSize: '4px', fontWeight: 700,
              color: C.theadText,
              textAlign: i === 0 ? 'right' : 'center',
              paddingRight: i === 0 ? '5px' : '2px',
              overflow: 'hidden', whiteSpace: 'nowrap',
            }}>{h}</div>
          ))}
        </div>

        {/* Rows — uniform bg, Friday bg-only (no border) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {ROWS.map((row, i) => {
            const bg      = row.friday ? C.rowFridayBg : C.rowBg;
            const dayCol  = row.friday ? C.fridayText : C.cellText;
            const timeCol = row.friday ? C.fridayTime : C.timeText;
            return (
              <div key={i} style={{
                flex: 1,
                background: bg,
                borderBottom: `0.5px solid ${C.rowBorder}`,
                display: 'grid', gridTemplateColumns: cols,
                alignItems: 'center',
                overflow: 'hidden',
              }}>
                {/* Day name */}
                <div style={{ fontSize: '5px', fontWeight: 600, color: dayCol, textAlign: 'right', paddingRight: '5px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {row.day}
                </div>
                {/* Hijri */}
                <div style={{ fontSize: '4.5px', fontWeight: 600, color: dayCol, textAlign: 'center' }}>
                  {row.h}
                </div>
                {/* Greg */}
                <div style={{ fontSize: '4.5px', color: C.cellSub, textAlign: 'center', fontWeight: 600 }}>
                  {row.greg}
                </div>
                {/* 6 prayer times */}
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

      {/* ══ FOOTER ══ no top border line */}
      <div style={{
        flexShrink: 0, padding: '3px 10px 4px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        /* no border-top — matches v9 PDF exactly */
      }}>
        <span style={{ fontSize: '3.5px', color: C.footerText }}>
          جدول مواقيت الصلاة الشهري لـ الرباط — حسابات فلكية دقيقة
        </span>
        <span style={{ fontSize: '4px', color: C.footerUrl, fontWeight: 700 }}>
          MiqaTime.com
        </span>
      </div>
    </div>
  );
}

// ─── ThemeCard ────────────────────────────────────────────────────────────────

function ThemeCard({ isDark, selected, onSelect }) {
  const accent   = isDark ? '#8CAEFF' : '#1D4ED8';
  const cardBg   = isDark ? 'rgba(13,17,23,0.6)'  : 'rgba(255,255,255,0.7)';
  const selBg    = isDark ? 'rgba(8,16,34,0.9)'   : 'rgba(238,244,255,0.95)';
  const unselBd  = isDark ? '#1A2540' : '#D0DCF0';
  const label    = isDark ? 'الوضع الليلي' : 'الوضع النهاري';
  const desc     = isDark ? 'خلفية داكنة · موفّر للحبر' : 'خلفية بيضاء · وضوح مثالي';
  const Icon     = isDark ? Moon : Sun;

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`اختر ${label}`}
      style={{
        flex:           1,
        minWidth:       0,
        background:     selected ? selBg : cardBg,
        border:         `2px solid ${selected ? accent : unselBd}`,
        borderRadius:   '16px',
        padding:        '12px 12px 14px',
        cursor:         'pointer',
        display:        'flex',
        flexDirection:  'column',
        gap:            '10px',
        transition:     'border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease',
        outline:        'none',
        position:       'relative',
        boxShadow:      selected
          ? `0 0 0 1px ${accent}30, 0 8px 32px ${accent}18`
          : '0 2px 8px rgba(0,0,0,0.10)',
      }}
    >
      {/* Selection indicator — top-left circle */}
      <div style={{
        position:        'absolute',
        top:             '10px',
        left:            '10px',
        width:           '18px',
        height:          '18px',
        borderRadius:    '50%',
        background:      selected ? accent : (isDark ? '#1A2540' : '#E0E8F4'),
        border:          selected ? 'none' : `1.5px solid ${isDark ? '#252F50' : '#C8D4E8'}`,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        transition:      'all 0.18s ease',
        flexShrink:      0,
        zIndex:          1,
      }}>
        {selected && <Check size={10} color="#fff" strokeWidth={3} />}
      </div>

      {/* Preview thumbnail with paper shadow */}
      <div style={{
        borderRadius:  '8px',
        overflow:      'hidden',
        boxShadow:     selected
          ? `0 4px 20px ${accent}30, 0 1px 4px ${accent}15, 0 0 0 1px ${accent}25`
          : '0 2px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
        transition:    'box-shadow 0.18s ease',
        position:      'relative',
      }}>
        {/* Subtle page-curl / paper texture line at bottom */}
        <A4Preview isDark={isDark} />
      </div>

      {/* Label */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '6px',
        direction:      'rtl',
        paddingTop:     '2px',
      }}>
        <Icon
          size={14}
          color={selected ? accent : (isDark ? '#6B7FA0' : '#8898C8')}
          style={{ flexShrink: 0, transition: 'color 0.18s' }}
        />
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize:   '12.5px', fontWeight: 700,
            color:      selected ? accent : (isDark ? '#D0D8F0' : '#2A3560'),
            transition: 'color 0.18s',
            lineHeight: 1.3,
          }}>{label}</div>
          <div style={{
            fontSize:  '10px',
            color:     isDark ? '#4A5A78' : '#9AAAC8',
            marginTop: '1px',
            lineHeight: 1.3,
          }}>{desc}</div>
        </div>
      </div>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function PrintThemeChooserModal({ isOpen, onClose, onSelect, actionType = 'download' }) {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => { if (isOpen) setSelected(null); }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && dialogRef.current) dialogRef.current.focus();
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  }, [selected, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes _ptcBdIn  { from{opacity:0}         to{opacity:1} }
        @keyframes _ptcCardIn{ from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }
        ._ptc-bd   { animation: _ptcBdIn   0.20s ease-out both; }
        ._ptc-card { animation: _ptcCardIn 0.24s cubic-bezier(0.34,1.1,0.64,1) both; }
        ._ptc-confirm:not(:disabled):hover {
          opacity: 0.88 !important;
          transform: translateY(-1px) !important;
        }
        ._ptc-confirm:not(:disabled):active { transform: translateY(0) !important; }
        ._ptc-cancel:hover {
          background: var(--bg-surface-3) !important;
          border-color: var(--border-strong) !important;
          color: var(--text-primary) !important;
        }
      `}</style>

      {/* Portal wrapper */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="اختر نمط التحميل"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Backdrop */}
        <div
          className="_ptc-bd"
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(4,8,20,0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

        {/* Dialog card */}
        <div
          className="_ptc-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            position:      'relative',
            background:    'var(--bg-surface-1)',
            border:        '1px solid var(--border-default)',
            borderRadius:  '22px',
            boxShadow:     '0 32px 96px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03)',
            padding:       '22px 22px 20px',
            width:         '100%',
            maxWidth:      '700px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '18px',
          }}
        >

          {/* ── Title row ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', direction: 'rtl', gap: '12px',
          }}>
            <div>
              {/* Icon + heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', direction: 'rtl' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '11px', flexShrink: 0,
                  background: 'var(--accent-soft)', border: '1px solid var(--border-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={17} color="var(--accent-alt)" />
                </div>
                <div>
                  <h2 style={{
                    margin: 0, fontSize: '16px', fontWeight: 700,
                    color: 'var(--text-primary)', lineHeight: 1.25,
                  }}>
                    اختر نمط ملف PDF
                  </h2>
                  <p style={{
                    margin: '3px 0 0', fontSize: '12.5px',
                    color: 'var(--text-muted)', lineHeight: 1.4,
                  }}>
                    سيُطبَّق على الملف فقط — الشاشة لا تتأثر
                  </p>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
                borderRadius: '9px', padding: '6px', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                color: 'var(--text-muted)', flexShrink: 0,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* ── Theme cards ── */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <ThemeCard isDark={false} selected={selected === 'light'} onSelect={() => setSelected('light')} />
            <ThemeCard isDark={true}  selected={selected === 'dark'}  onSelect={() => setSelected('dark')}  />
          </div>

          {/* ── Footer actions ── */}
          <div style={{
            display: 'flex', gap: '9px',
            justifyContent: 'flex-end', alignItems: 'center',
            direction: 'rtl',
          }}>
            {selected && (
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginLeft: 'auto', direction: 'rtl' }}>
                ✓ {selected === 'light' ? 'الوضع النهاري' : 'الوضع الليلي'} محدد
              </span>
            )}

            <button
              className="_ptc-cancel"
              onClick={onClose}
              style={{
                background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
                borderRadius: '10px', padding: '8px 18px',
                fontSize: '13px', fontWeight: 600,
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              إلغاء
            </button>

            <button
              className="_ptc-confirm"
              onClick={handleConfirm}
              disabled={!selected}
              style={{
                background:   selected
                  ? 'var(--accent-gradient, linear-gradient(135deg,#1D4ED8,#4338CA))'
                  : 'var(--bg-surface-3)',
                border:       '1px solid transparent',
                borderRadius: '10px', padding: '8px 24px',
                fontSize: '13px', fontWeight: 700,
                color:    selected ? '#fff' : 'var(--text-disabled)',
                cursor:   selected ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                transition: 'all 0.18s ease',
                opacity:    selected ? 1 : 0.5,
                display:    'flex', alignItems: 'center', gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow:  selected ? 'var(--shadow-accent, 0 4px 20px rgba(29,78,216,0.25))' : 'none',
              }}
            >
              <Download size={13} />
              تحميل الآن
            </button>
          </div>

        </div>
      </div>
    </>
  );
}