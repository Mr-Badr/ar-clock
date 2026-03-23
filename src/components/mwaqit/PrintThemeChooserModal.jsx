'use client';

/**
 * PrintThemeChooserModal.jsx — v1
 *
 * A premium theme-selection modal shown before any print or PDF-download action.
 * The user picks light or dark, sees a realistic mini A4-landscape preview of
 * the prayer timetable, then confirms.  The parent receives the chosen theme
 * string ('light' | 'dark') and executes its action.
 *
 * Props
 * ─────
 *   isOpen      boolean              Controls visibility
 *   onClose     () => void           Called on ESC / backdrop / Cancel
 *   onSelect    (theme) => void      Called when user confirms a selection
 *   actionType  'print' | 'download' Adjusts labels inside the modal
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, Check, X, Printer, Download } from 'lucide-react';

// ─── Static preview data ──────────────────────────────────────────────────────

const PREVIEW_ROWS = [
  { day: 'الأحد',    greg: '2',  times: ['05:18', '12:09', '18:54'] },
  { day: 'الإثنين', greg: '3',  times: ['05:19', '12:09', '18:53'] },
  { day: 'الثلاثاء', greg: '4', times: ['05:20', '12:10', '18:52'] },
  { day: 'الأربعاء', greg: '5', times: ['05:21', '12:10', '18:51'] },
  { day: 'الخميس',  greg: '6',  times: ['05:22', '12:11', '18:50'] },
  { day: 'الجمعة',  greg: '7',  times: ['05:23', '12:11', '18:49'], friday: true },
  { day: 'السبت',   greg: '8',  times: ['05:24', '12:12', '18:48'] },
];

// ─── Theme colour maps ────────────────────────────────────────────────────────

const LIGHT_C = {
  pageBg:      '#FFFFFF',
  headerBg:    '#1E3A8A',
  headerBorder:'#1D4ED8',
  theadBg:     '#1E3A8A',
  theadText:   '#FFFFFF',
  theadAccent: '#BFDBFE',
  rowOdd:      '#FFFFFF',
  rowEven:     '#F4F7FC',
  rowFriday:   'rgba(4,102,69,0.06)',
  text:        '#0E1220',
  textSub:     '#3D4668',
  timeColor:   '#1D4ED8',
  fridayText:  '#046645',
  fridayTime:  '#046645',
  border:      '#DDE3EF',
  footerBg:    '#F4F7FC',
  footerText:  '#536080',
  accentColor: '#1D4ED8',
};

const DARK_C = {
  pageBg:      '#0D1117',
  headerBg:    '#060B14',
  headerBorder:'#8CAEFF',
  theadBg:     '#060B14',
  theadText:   '#E2E8F7',
  theadAccent: '#8CAEFF',
  rowOdd:      '#161D2E',
  rowEven:     '#1E2640',
  rowFriday:   'rgba(6,214,160,0.09)',
  text:        '#F0F4FF',
  textSub:     '#A8B2CB',
  timeColor:   '#8CAEFF',
  fridayText:  '#06D6A0',
  fridayTime:  '#06D6A0',
  border:      '#222C45',
  footerBg:    '#111827',
  footerText:  '#90AACC',
  accentColor: '#8CAEFF',
};

// ─── MiniPreview ─────────────────────────────────────────────────────────────

/** Renders a miniature A4-landscape prayer timetable preview. */
function MiniPreview({ isDark }) {
  const C = isDark ? DARK_C : LIGHT_C;

  return (
    <div style={{
      background:    C.pageBg,
      borderRadius:  '5px',
      overflow:      'hidden',
      width:         '100%',
      aspectRatio:   '297 / 210',
      display:       'flex',
      flexDirection: 'column',
      fontFamily:    '"Noto Kufi Arabic", system-ui, -apple-system, sans-serif',
      direction:     'rtl',
      userSelect:    'none',
    }}>

      {/* ── Header bar ── */}
      <div style={{
        background:     C.headerBg,
        borderBottom:   `1.5px solid ${C.headerBorder}`,
        padding:        '5px 8px 4px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexShrink:     0,
        gap:            '6px',
      }}>
        <div>
          <div style={{ color: '#fff',          fontSize: '7.5px', fontWeight: 700, lineHeight: 1.3 }}>تقويم مواقيت الصلاة</div>
          <div style={{ color: C.theadAccent,   fontSize: '5.5px', lineHeight: 1.3 }}>مارس 2026 · رمضان 1447</div>
        </div>
        <div style={{ color: C.accentColor,  fontSize: '7px', fontWeight: 800, whiteSpace: 'nowrap' }}>وقت.app</div>
      </div>

      {/* ── Thead ── */}
      <div style={{
        background:  C.theadBg,
        display:     'grid',
        gridTemplateColumns: '2.2fr 0.8fr 1fr 1fr 1fr',
        flexShrink:  0,
      }}>
        {['اليوم', 'م', 'الفجر', 'الظهر', 'المغرب'].map(h => (
          <div key={h} style={{
            padding:    '3px 3px',
            fontSize:   '6px',
            fontWeight: 600,
            color:      C.theadAccent,
            textAlign:  'center',
          }}>{h}</div>
        ))}
      </div>

      {/* ── Rows ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {PREVIEW_ROWS.map((row, i) => (
          <div key={i} style={{
            background:  row.friday ? C.rowFriday : i % 2 === 0 ? C.rowOdd : C.rowEven,
            borderBottom: `0.5px solid ${C.border}`,
            display:     'grid',
            gridTemplateColumns: '2.2fr 0.8fr 1fr 1fr 1fr',
            alignItems:  'center',
            flex:        1,
            ...(row.friday ? { boxShadow: `inset -2px 0 0 ${C.fridayText}` } : {}),
          }}>
            <div style={{ padding: '0 5px', fontSize: '7px', fontWeight: 600, color: row.friday ? C.fridayText : C.text, textAlign: 'right' }}>{row.day}</div>
            <div style={{ padding: '0 3px', fontSize: '6px', color: C.textSub, textAlign: 'center' }}>{row.greg}</div>
            {row.times.map((t, j) => (
              <div key={j} style={{ padding: '0 2px', fontSize: '6.5px', color: row.friday ? C.fridayTime : C.timeColor, fontFamily: '"IBM Plex Mono", "Courier New", monospace', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{t}</div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{
        background:     C.footerBg,
        borderTop:      `0.5px solid ${C.border}`,
        padding:        '2.5px 8px',
        display:        'flex',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        <span style={{ color: C.footerText, fontSize: '5px' }}>تقويم مواقيت الصلاة الشهري — حسابات فلكية دقيقة</span>
      </div>
    </div>
  );
}

// ─── ThemeCard ────────────────────────────────────────────────────────────────

function ThemeCard({ isDark, selected, onSelect }) {
  const accent = isDark ? '#8CAEFF' : '#1D4ED8';
  const cardBg = isDark ? '#0D1421' : '#F8FAFF';
  const selBg  = isDark ? '#101E35' : '#EEF4FF';
  const label  = isDark ? 'الوضع الليلي' : 'الوضع النهاري';
  const desc   = isDark ? 'خلفية داكنة — مثالي للطباعة الاقتصادية' : 'خلفية فاتحة — وضوح فائق للطباعة';
  const Icon   = isDark ? Moon : Sun;

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`اختر ${label}`}
      style={{
        flex:          1,
        background:    selected ? selBg : cardBg,
        border:        `2px solid ${selected ? accent : (isDark ? '#1A2540' : '#C8D4E8')}`,
        borderRadius:  '14px',
        padding:       '14px 14px 16px',
        cursor:        'pointer',
        display:       'flex',
        flexDirection: 'column',
        gap:           '12px',
        transition:    'all 0.18s ease',
        outline:       'none',
        position:      'relative',
        textAlign:     'center',
      }}
    >
      {/* Checkmark badge */}
      <div style={{
        position:        'absolute',
        top:             '10px',
        left:            '10px',
        width:           '20px',
        height:          '20px',
        borderRadius:    '50%',
        background:      selected ? accent : (isDark ? '#1A2540' : '#E0E8F4'),
        border:          selected ? 'none' : `1.5px solid ${isDark ? '#252F50' : '#C8D4E8'}`,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        transition:      'all 0.18s ease',
        flexShrink:      0,
      }}>
        {selected && <Check size={11} color="#fff" strokeWidth={3} />}
      </div>

      {/* Preview thumbnail */}
      <div style={{
        borderRadius: '8px',
        overflow:     'hidden',
        boxShadow:    selected
          ? `0 6px 24px ${accent}35, 0 2px 8px ${accent}20`
          : '0 2px 12px rgba(0,0,0,0.12)',
        transition:   'box-shadow 0.18s ease',
        border:       `1px solid ${selected ? accent + '40' : 'rgba(0,0,0,0.08)'}`,
      }}>
        <MiniPreview isDark={isDark} />
      </div>

      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', direction: 'rtl' }}>
        <Icon size={15} color={selected ? accent : (isDark ? '#A8B2CB' : '#536080')} />
        <div>
          <div style={{
            fontSize:   '13px',
            fontWeight: 700,
            color:      selected ? accent : (isDark ? '#F0F4FF' : '#0E1220'),
            transition: 'color 0.18s ease',
          }}>{label}</div>
          <div style={{
            fontSize:  '10.5px',
            color:     isDark ? '#6B7FA0' : '#7A88A8',
            marginTop: '2px',
          }}>{desc}</div>
        </div>
      </div>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function PrintThemeChooserModal({
  isOpen,
  onClose,
  onSelect,
  actionType = 'download',
}) {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) setSelected(null);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Focus trap — focus dialog on open
  useEffect(() => {
    if (isOpen && dialogRef.current) dialogRef.current.focus();
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  }, [selected, onSelect, onClose]);

  const isDownload = actionType === 'download';
  const actionLabel   = isDownload ? 'تحميل PDF'  : 'طباعة';
  const confirmLabel  = isDownload ? 'تحميل الآن' : 'طباعة الآن';
  const ActionIcon    = isDownload ? Download      : Printer;

  if (!isOpen) return null;

  return (
    <>
      {/* Animation keyframes */}
      <style>{`
        @keyframes ptcBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ptcCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .ptc-backdrop {
          animation: ptcBackdropIn 0.22s ease-out both;
        }
        .ptc-card {
          animation: ptcCardIn 0.26s cubic-bezier(0.34,1.1,0.64,1) both;
        }
        .ptc-confirm-btn:not(:disabled):hover {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(29,78,216,0.35) !important;
        }
        .ptc-confirm-btn:not(:disabled):active {
          transform: translateY(0);
        }
        .ptc-cancel-btn:hover {
          background: var(--bg-surface-4) !important;
          color: var(--text-primary) !important;
        }
      `}</style>

      {/* Wrapper */}
      <div
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         9999,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '16px',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`اختر نمط ${actionLabel}`}
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* Backdrop */}
        <div
          className="ptc-backdrop"
          onClick={onClose}
          style={{
            position:        'absolute',
            inset:           0,
            background:      'rgba(6, 10, 24, 0.78)',
            backdropFilter:  'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          aria-hidden="true"
        />

        {/* Card */}
        <div
          className="ptc-card"
          style={{
            position:     'relative',
            background:   'var(--bg-surface-1)',
            border:       '1px solid var(--border-default)',
            borderRadius: '20px',
            boxShadow:    '0 24px 80px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.04)',
            padding:      '24px 24px 22px',
            width:        '100%',
            maxWidth:     '680px',
            display:      'flex',
            flexDirection:'column',
            gap:          '20px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top row: title + close ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', direction: 'rtl', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: 'rtl' }}>
                <div style={{
                  width:          '32px',
                  height:         '32px',
                  borderRadius:   '10px',
                  background:     'var(--accent-soft)',
                  border:         '1px solid var(--border-accent)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}>
                  <ActionIcon size={16} color="var(--accent-alt)" />
                </div>
                <h2 style={{
                  margin:     0,
                  fontSize:   '17px',
                  fontWeight: 700,
                  color:      'var(--text-primary)',
                  lineHeight: 1.3,
                }}>
                  اختر نمط {isDownload ? 'التحميل' : 'الطباعة'}
                </h2>
              </div>
              <p style={{
                margin:     '6px 0 0 0',
                fontSize:   '13px',
                color:      'var(--text-muted)',
                direction:  'rtl',
                paddingRight: '40px',
              }}>
                اختر الوضع المناسب — سيُطبَّق على {isDownload ? 'ملف PDF' : 'صفحة الطباعة'} فقط دون تأثير على الشاشة
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                background:   'var(--bg-surface-3)',
                border:       '1px solid var(--border-default)',
                borderRadius: '9px',
                padding:      '6px',
                cursor:       'pointer',
                display:      'flex',
                alignItems:   'center',
                color:        'var(--text-secondary)',
                flexShrink:   0,
                transition:   'background 0.15s',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Theme cards ── */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <ThemeCard isDark={false} selected={selected === 'light'} onSelect={() => setSelected('light')} />
            <ThemeCard isDark={true}  selected={selected === 'dark'}  onSelect={() => setSelected('dark')}  />
          </div>

          {/* ── Footer actions ── */}
          <div style={{
            display:        'flex',
            gap:            '10px',
            justifyContent: 'flex-end',
            alignItems:     'center',
            direction:      'rtl',
            paddingTop:     '2px',
          }}>
            {selected && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                ✓ تم اختيار {selected === 'light' ? 'الوضع النهاري' : 'الوضع الليلي'}
              </span>
            )}
            <button
              className="ptc-cancel-btn"
              onClick={onClose}
              style={{
                background:   'var(--bg-surface-3)',
                border:       '1px solid var(--border-default)',
                borderRadius: '10px',
                padding:      '9px 20px',
                fontSize:     '13px',
                fontWeight:   600,
                color:        'var(--text-secondary)',
                cursor:       'pointer',
                fontFamily:   'inherit',
                transition:   'all 0.15s',
                whiteSpace:   'nowrap',
              }}
            >
              إلغاء
            </button>
            <button
              className="ptc-confirm-btn"
              onClick={handleConfirm}
              disabled={!selected}
              style={{
                background:   selected ? 'var(--accent-gradient, linear-gradient(135deg,#1D4ED8,#4338CA))' : 'var(--bg-surface-4)',
                border:       '1px solid transparent',
                borderRadius: '10px',
                padding:      '9px 26px',
                fontSize:     '13px',
                fontWeight:   700,
                color:        selected ? '#fff' : 'var(--text-disabled)',
                cursor:       selected ? 'pointer' : 'not-allowed',
                fontFamily:   'inherit',
                transition:   'all 0.18s ease',
                opacity:      selected ? 1 : 0.55,
                display:      'flex',
                alignItems:   'center',
                gap:          '6px',
                whiteSpace:   'nowrap',
                boxShadow:    selected ? 'var(--shadow-accent)' : 'none',
              }}
            >
              <ActionIcon size={13} />
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}