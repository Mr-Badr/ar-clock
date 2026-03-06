'use client';
/**
 * components/clocks/CountdownTicker.jsx
 *
 * Changes vs original:
 *  • framer-motion removed — pure CSS animations (ct- prefixed keyframes)
 *  • NumberRow extracted to module level (was inside render → remount every tick)
 *  • Colon blink slowed to 2 s ease-in-out (was 1 s step-start — too aggressive)
 *  • Share button uses navigator.share (native mobile sheet) → clipboard fallback
 *  • Mobile layout: days hero (large) + HMS row — totally different from desktop
 *  • No per-digit background boxes on mobile — uses existing CSS classes only
 *  • Digit flip: key remount + ct-digit-enter CSS (same feel, zero JS overhead)
 *  • Exports: default CountdownTicker · CountdownTickerSkeleton · ShareBar
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Monitor, Minimize2, ZoomIn, ZoomOut, Share2, Link2 } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════════════
   STYLES — injected once, all classes prefixed ct-
   ══════════════════════════════════════════════════════════════════════════ */
const CT_STYLES = `
@keyframes ct-card-enter  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes ct-unit-enter  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes ct-digit-enter { from{opacity:0} to{opacity:1} }
@keyframes ct-fade-in     { from{opacity:0} to{opacity:1} }
@keyframes ct-scale-in    { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
@keyframes ct-copied-pop  { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

/* Colon — static, no animation */
.ct-sep { animation: none !important; }

.ct-copied-badge { animation: ct-copied-pop 0.2s ease both; }

/* ── Responsive layout switching ── */
.ct-row-desktop { display: flex;             }
.ct-row-mobile  { display: none;             }

@media (max-width: 639px) {
  .ct-row-desktop { display: none  !important; }
  .ct-row-mobile  { display: flex  !important; }

  /* Days hero — large but contained in the card */
  .ct-days-val {
    font-size: clamp(3.5rem, 22vw, 5.5rem) !important;
    line-height: 1 !important;
  }
  /* HMS units below days */
  .ct-hms-val   { font-size: clamp(1.6rem, 9vw, 2.4rem) !important; }
  .ct-hms-label { font-size: clamp(0.6rem,  3vw, 0.8rem) !important; }
}
`;

/* ══════════════════════════════════════════════════════════════════════════
   LOGIC HELPERS — unchanged
   ══════════════════════════════════════════════════════════════════════════ */
function calcRem(targetMs) {
  const total = Math.max(0, targetMs - Date.now());
  if (!total) return { total:0, days:0, hours:0, minutes:0, seconds:0 };
  return {
    total,
    days:    Math.floor(total / 86_400_000),
    hours:   Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000)  / 60_000),
    seconds: Math.floor((total % 60_000)     / 1_000),
  };
}
function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

/* Module-level constants — stable across renders */
const ALL_UNITS = [
  { key: 'seconds', label: 'ثانية' },
  { key: 'minutes', label: 'دقيقة' },
  { key: 'hours',   label: 'ساعة'  },
  { key: 'days',    label: 'يوم'   },
];
const HMS_UNITS = ALL_UNITS.slice(0, 3);   // hours, minutes, seconds

/* ══════════════════════════════════════════════════════════════════════════
   UNIT — module-level so React never sees a new component type per tick.

   KEY DESIGN: each digit character gets its OWN key so React only remounts
   the character that actually changed. If seconds go 05→06, the "0" span
   keeps its key and stays still; only the "6" span remounts and fades in.
   This stops the "both digits blink" problem on every tick.
   ══════════════════════════════════════════════════════════════════════════ */
function Unit({ value, staggerIndex = 0, digitClassName = '', labelClassName = '', label }) {
  const display = pad2(value);   // always 2 chars, e.g. "07"
  const tens    = display[0];    // e.g. "0"
  const units   = display[1];    // e.g. "7"

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:           '0.5rem',
      animation:     `ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) ${staggerIndex * 0.1}s both`,
    }}>

      {/* Two separate spans — each keyed on its own value + position.
          Only the span whose character changed will remount + animate. */}
      <div style={{
        display:    'flex',
        lineHeight: 1,
        overflow:   'hidden',
      }}>
        <span
          key={`t${staggerIndex}-${tens}`}
          suppressHydrationWarning
          aria-hidden
          className={`clock-display ${digitClassName}`}
          style={{ display:'block', fontWeight:'800', lineHeight:1, animation:'ct-digit-enter 0.15s ease-out both' }}
        >{tens}</span>
        <span
          key={`u${staggerIndex}-${units}`}
          suppressHydrationWarning
          aria-hidden
          className={`clock-display ${digitClassName}`}
          style={{ display:'block', fontWeight:'800', lineHeight:1, animation:'ct-digit-enter 0.15s ease-out both' }}
        >{units}</span>
      </div>

      {/* Label — pill background anchors it visually to the digit column */}
      <span
        aria-hidden
        className={labelClassName}
        style={{
          fontSize:        '0.75rem',
          fontWeight:      '500',
          color:           'var(--text-secondary)',
          letterSpacing:   '0.01em',
          padding:         '0.15rem 0.55rem',
          borderRadius:    '999px',
          background:      'var(--bg-surface-3)',
          border:          '1px solid var(--border-subtle)',
          userSelect:      'none',
          whiteSpace:      'nowrap',
        }}
      >{label}</span>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DESKTOP NUMBER ROW — all 4 units in one LTR row
   ══════════════════════════════════════════════════════════════════════════ */
function DesktopNumberRow({ r, sepSize }) {
  return (
    <div
      className="ct-row-desktop"
      style={{
        alignItems:     'center',
        justifyContent: 'center',
        gap:            'clamp(0.5rem, min(3vw,3vh), 2.5rem)',
        direction:      'ltr',
        flexWrap:       'nowrap',
      }}
      role="timer"
      aria-label={`العد التنازلي: ${r.days} يوم و ${r.hours} ساعة و ${r.minutes} دقيقة و ${r.seconds} ثانية`}
      aria-live="off"
    >
      {ALL_UNITS.map(({ key, label }, i) => (
        <div key={key} style={{ display:'flex', alignItems:'center', gap:'clamp(0.5rem,min(3vw,3vh),2.5rem)' }}>
          <Unit value={r[key]} label={label} staggerIndex={i} />
          {i < ALL_UNITS.length - 1 && (
            <span
              className="clock-sep ct-sep"
              aria-hidden
              style={{
                fontSize:     sepSize,
                color:        'var(--clock-separator)',
                alignSelf:    'center',
                marginBottom: '1.2em',
                flexShrink:   0,
                userSelect:   'none',
                fontWeight:   '700',
              }}
            >:
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE NUMBER ROW — days hero (big) + thin divider + HMS row below
   No per-digit backgrounds — uses existing CSS classes
   ══════════════════════════════════════════════════════════════════════════ */
function MobileNumberRow({ r }) {
  return (
    <div
      className="ct-row-mobile"
      style={{
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '0.9rem',
        direction:     'ltr',
      }}
      role="timer"
      aria-label={`العد التنازلي: ${r.days} يوم و ${r.hours} ساعة و ${r.minutes} دقيقة و ${r.seconds} ثانية`}
      aria-live="off"
    >

      {/* Days — hero treatment */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '0.15em',
        animation:     'ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) both',
      }}>
        <span
          key={pad2(r.days)}
          className="clock-display ct-days-val"
          suppressHydrationWarning
          aria-hidden
          style={{
            fontWeight: '800',
            lineHeight: 1,
            animation:  'ct-digit-enter 0.15s ease-out both',
          }}/>
        <span style={{ fontSize:'var(--text-sm)', color:'var(--text-secondary)', fontWeight:500 }}>يوم</span>
      </div>

      {/* Divider */}
      <div style={{ width:'80%', height:'1px', background:'var(--border-subtle)' }} />

      {/* HMS row — hours · minutes · seconds */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', direction:'ltr', gap:'clamp(0.5rem,4vw,1.4rem)' }}>
        {HMS_UNITS.map(({ key, label }, i) => (
          <div key={key} style={{ display:'flex', alignItems:'center', gap:'clamp(0.5rem,4vw,1.4rem)' }}>
            <div style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3em',
              animation: `ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) ${(i+1)*0.12}s both`,
            }}>
              <span
                key={pad2(r[key])}
                className="clock-display ct-hms-val"
                suppressHydrationWarning
                aria-hidden
                style={{
                  fontWeight: '800',
                  lineHeight: 1,
                  animation:  'ct-digit-enter 0.15s ease-out both',
                }}
              >
                {pad2(r[key])}
              </span>
              <span className="ct-hms-label" style={{ color:'var(--text-secondary)', fontWeight:500 }}>{label}</span>
            </div>
            {i < HMS_UNITS.length - 1 && (
              <span
                className="clock-sep ct-sep"
                aria-hidden
                style={{
                  fontSize:     'clamp(1.2rem,5vw,2rem)',
                  color:        'var(--clock-separator)',
                  alignSelf:    'center',
                  marginBottom: '1.1em',
                  fontWeight:   '700',
                  flexShrink:   0,
                  userSelect:   'none',
                }}
              >:
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ICON BUTTON
   ══════════════════════════════════════════════════════════════════════════ */
function IconBtn({ onClick, label, title, children, disabled = false, variant = 'ghost' }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      title={title || label}
      disabled={disabled}
      style={{
        display:'flex', alignItems:'center', gap:'0.4rem',
        padding:'0.5rem 0.75rem', borderRadius:'0.625rem',
        border: variant === 'ghost' ? '1px solid var(--border-default)' : 'none',
        background:'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color:  disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontSize:'0.8rem', fontWeight:'600',
        opacity: disabled ? 0.4 : 1,
        transition:'background 0.15s, color 0.15s, border-color 0.15s',
        whiteSpace:'nowrap',
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background='color-mix(in srgb, var(--bg-surface-3) 80%, transparent)'; e.currentTarget.style.color='var(--text-primary)'; e.currentTarget.style.borderColor='var(--border-accent)'; }}}
      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=disabled?'var(--text-muted)':'var(--text-secondary)'; e.currentTarget.style.borderColor='var(--border-default)'; }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PLATFORM DEFINITIONS — all platforms popular in the Arab world
   ══════════════════════════════════════════════════════════════════════════ */
const PLATFORMS = [
  {
    id: 'whatsapp', label: 'واتساب',
    color: '#25D366', bg: 'rgba(37,211,102,0.10)', border: 'rgba(37,211,102,0.28)',
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(t+'\n'+u)}`,
    Icon: () => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
      </svg>
    ),
  },
  {
    id: 'telegram', label: 'تيليغرام',
    color: '#229ED9', bg: 'rgba(34,158,217,0.10)', border: 'rgba(34,158,217,0.28)',
    href: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    Icon: () => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    id: 'twitter', label: 'X / تويتر',
    color: 'var(--text-primary)', bg: 'var(--bg-surface-3)', border: 'var(--border-default)',
    href: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'فيسبوك',
    color: '#1877F2', bg: 'rgba(24,119,242,0.10)', border: 'rgba(24,119,242,0.28)',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    Icon: () => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SHARE BAR — named export, placed in page.jsx before معلومات سريعة
   Accepts url, eventName, days, dateStr
   ══════════════════════════════════════════════════════════════════════════ */
export function ShareBar({ url, eventName, days, dateStr }) {
  const [copied, setCopied] = useState(false);

  const shareUrl  = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${eventName} — متبقي ${days} يوم (${dateStr}) 🗓`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* silent */ }
  };

  return (
    <>
      <style>{`
        @keyframes ct-copied-pop{0%{transform:scale(0.85);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        .ct-copied-badge{animation:ct-copied-pop 0.2s ease both}
        .ct-share-btn { transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s !important; }
        .ct-share-btn:hover { transform: translateY(-2px) !important; box-shadow: var(--shadow-md) !important; }
        .ct-copy-btn  { transition: all 0.2s !important; }
        .ct-copy-btn:hover { border-color: var(--border-accent) !important; background: var(--accent-soft) !important; color: var(--accent) !important; }
      `}</style>

      <section
        style={{
          marginBottom: 'var(--space-8)',
          background:   'var(--bg-surface-1)',
          border:       '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-2xl)',
          padding:      'var(--space-6)',
        }}
        dir="rtl"
        aria-label="خيارات المشاركة"
      >
        <h2 style={{
          fontSize:     'var(--text-base)',
          fontWeight:   'var(--font-semibold)',
          color:        'var(--text-secondary)',
          marginBottom: 'var(--space-4)',
          letterSpacing:'0.02em',
        }}>
          شارك هذه المناسبة
        </h2>

        {/* Platform icon-cards row */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: `repeat(${PLATFORMS.length}, 1fr)`,
          gap:                 'var(--space-3)',
          marginBottom:        'var(--space-3)',
        }}>
          {PLATFORMS.map(({ id, label, color, bg, border, href, Icon }) => (
            <a
              key={id}
              href={href(shareUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`مشاركة عبر ${label}`}
              className="ct-share-btn"
              style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '0.5rem',
                padding:        'var(--space-4) var(--space-2)',
                borderRadius:   'var(--radius-xl)',
                border:         `1px solid ${border}`,
                background:     bg,
                color,
                textDecoration: 'none',
                cursor:         'pointer',
              }}
            >
              <Icon />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Copy link — full width */}
        <button
          onClick={handleCopy}
          aria-label="نسخ الرابط"
          className="ct-copy-btn"
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '0.5rem',
            width:          '100%',
            padding:        'var(--space-3)',
            borderRadius:   'var(--radius-xl)',
            border:         copied ? '1px solid var(--success-border)' : '1px solid var(--border-default)',
            background:     copied ? 'var(--success-soft)' : 'var(--bg-surface-3)',
            color:          copied ? 'var(--success)' : 'var(--text-secondary)',
            fontSize:       'var(--text-sm)',
            fontWeight:     '600',
            cursor:         'pointer',
          }}
        >
          <Link2 size={15} />
          {copied
            ? <span className="ct-copied-badge">✓ تم نسخ الرابط</span>
            : <span>نسخ الرابط</span>
          }
        </button>

      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SKELETON
   ══════════════════════════════════════════════════════════════════════════ */
export function CountdownTickerSkeleton() {
  return (
    <div style={{
      borderRadius:'1rem', border:'1px solid var(--border-accent)',
      background:'var(--clock-bg)', backdropFilter:'blur(20px)',
      boxShadow:'var(--shadow-accent)',
      padding:'clamp(1.25rem,4vw,2.5rem)',
      display:'flex', flexDirection:'column', gap:'1.5rem',
    }} aria-hidden>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div style={{ width:'72px', height:'32px', borderRadius:'0.625rem', background:'var(--bg-surface-4)' }} />
        <div style={{ width:'40px', height:'32px', borderRadius:'0.625rem', background:'var(--bg-surface-4)' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:'clamp(1rem,4vw,3rem)', padding:'0.5rem 0' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
            <div style={{ width:'clamp(52px,11vw,88px)', height:'clamp(48px,9vw,76px)', borderRadius:'0.5rem', background:'var(--bg-surface-4)' }} />
            <div style={{ width:'36px', height:'10px', borderRadius:'999px', background:'var(--bg-surface-3)' }} />
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <div style={{ width:'160px', height:'24px', borderRadius:'999px', background:'var(--bg-surface-4)' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COUNTDOWN TICKER — main default export
   ══════════════════════════════════════════════════════════════════════════ */
export default function CountdownTicker({
  targetISO,
  initialRemaining,
  eventName   = '',
  eventDate   = '',
  whatsappUrl = '',   /* kept for backward-compat; share now uses navigator.share */
  totalDays   = 365,
  isDark      = true,
}) {

  /* ── Tick ─────────────────────────────────────────────────────────── */
  const targetMs              = new Date(targetISO).getTime();
  const [rem,     setRem]     = useState(initialRemaining);
  const [mounted, setMounted] = useState(false);
  const [isZero,  setIsZero]  = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const tick = useCallback(() => {
    const next = calcRem(targetMs);
    setRem(next);
    if (!next.total) setIsZero(true);
  }, [targetMs]);

  useEffect(() => {
    setMounted(true);
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [tick]);

  const r   = mounted ? rem : initialRemaining;
  const pct = Math.max(2, Math.min(98, Math.round((1 - r.days / Math.max(totalDays, 1)) * 100)));

  /* ── Fullscreen + Zoom ─────────────────────────────────────────────── */
  const containerRef            = useRef(null);
  const [isFullscreen, setIsFS] = useState(false);
  const [zoomLevel,    setZoom] = useState(1);

  useEffect(() => {
    const onFSChange = () => {
      const active = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      if (!active) setIsFS(false);
    };
    const evts = ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange'];
    evts.forEach(e => document.addEventListener(e, onFSChange));
    return () => evts.forEach(e => document.removeEventListener(e, onFSChange));
  }, []);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      const el = containerRef.current;
      if (!el) return;
      try {
        if      (el.requestFullscreen)       await el.requestFullscreen();
        else if (el.webkitRequestFullscreen)       el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen)          el.mozRequestFullScreen();
        else if (el.msRequestFullscreen)           el.msRequestFullscreen();
        setZoom(1);
      } catch {/* CSS fallback */}
      setIsFS(true);
    } else {
      try {
        if      (document.exitFullscreen)       await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)  await document.mozCancelFullScreen();
        else if (document.msExitFullscreen)     await document.msExitFullscreen();
      } catch { setIsFS(false); }
    }
  };

  const zoomIn       = () => setZoom(z => Math.min(z+1, 2));
  const zoomOut      = () => setZoom(z => Math.max(z-1, 0));
  const getScale     = () => zoomLevel === 0 ? 'scale(0.7)' : zoomLevel === 2 ? 'scale(1.3)' : 'scale(1)';
  const getZoomLabel = () => ['تصغير','حجم عادي','تكبير'][zoomLevel];

  /* ── Share — native sheet on mobile, clipboard on desktop ──────────── */
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: eventName, text: `${eventName} — متبقي ${r.days} يوم (${eventDate}) 🗓`, url });
        return;
      } catch {/* user cancelled or unsupported */}
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {/* silent */}
  };

  /* ── Sizes ────────────────────────────────────────────────────────── */
  const digitNormal = 'clamp(2.8rem, 9vw, 4.5rem)';
  const sepNormal   = 'clamp(1.6rem, 5vw, 2.8rem)';
  const digitFS     = 'clamp(4rem,   min(14vw, 20vh), 9rem)';
  const sepFS       = 'clamp(2.5rem, min(8vw,  12vh), 5rem)';

  /* ── isZero ────────────────────────────────────────────────────────── */
  if (isZero) {
    return (
      <>
        <style>{CT_STYLES}</style>
        <div style={{
          textAlign:'center', padding:'3rem', borderRadius:'1rem',
          border:'1px solid var(--border-accent)', background:'var(--clock-bg)',
          boxShadow:'var(--shadow-accent)', animation:'ct-scale-in 0.5s ease both',
        }}>
          <p style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🎉</p>
          <p style={{ fontSize:'var(--text-xl)', fontWeight:'800', color:'var(--text-primary)' }}>المناسبة اليوم!</p>
          <p style={{ color:'var(--text-muted)', marginTop:'0.5rem' }}>سيتحدث العداد تلقائياً بموعد السنة القادمة.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CT_STYLES}</style>

      <div ref={containerRef} style={{ position:'relative', width:'100%' }}>

        {/* ── Fullscreen overlay ──────────────────────────────────────── */}
        {isFullscreen && (
          <div style={{
            position:'fixed', inset:0, zIndex:100,
            background:'var(--bg-base)',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
          }} dir="rtl">
            <div style={{
              position:'absolute', top:'1.5rem', right:'1.5rem', left:'1.5rem',
              display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:110,
            }}>
              <IconBtn onClick={toggleFullscreen} label="إغلاق ملء الشاشة">
                <Minimize2 size={18} /><span>إغلاق</span>
              </IconBtn>
              <div style={{
                display:'flex', alignItems:'center', gap:'0.25rem',
                background:'color-mix(in srgb, var(--bg-surface-3) 70%, transparent)',
                backdropFilter:'blur(12px)', padding:'0.25rem',
                borderRadius:'0.875rem', border:'1px solid var(--border-default)',
              }}>
                <IconBtn onClick={zoomOut} label="تصغير" disabled={zoomLevel===0} variant="none"><ZoomOut size={20}/></IconBtn>
                <span style={{ padding:'0.4rem 0.75rem', fontSize:'0.7rem', fontWeight:'900', minWidth:'80px', textAlign:'center', color:'var(--text-primary)' }}>{getZoomLabel()}</span>
                <IconBtn onClick={zoomIn}  label="تكبير" disabled={zoomLevel===2} variant="none"><ZoomIn  size={20}/></IconBtn>
              </div>
            </div>
            <div style={{
              width:'100%', height:'100%',
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              padding:'1rem', transform:getScale(), transition:'transform 0.5s ease-in-out',
              gap:'clamp(1.5rem,4vh,3rem)',
            }}>
              {eventName && <h2 style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:'800', color:'var(--accent)', textAlign:'center', margin:0 }}>{eventName}</h2>}
              {/* Fullscreen always shows desktop layout */}
              <div style={{ fontSize: digitFS }}>
                <DesktopNumberRow r={r} sepSize={sepFS} />
              </div>
              {eventDate && (
                <p style={{ fontSize:'clamp(0.9rem,2.5vw,1.4rem)', color:'var(--text-secondary)', padding:'0.5rem 1.5rem', background:'color-mix(in srgb, var(--bg-surface-3) 50%, transparent)', border:'1px solid var(--border-default)', borderRadius:'999px', margin:0 }}>
                  {eventDate}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Normal view ──────────────────────────────────────────────── */}
        {!isFullscreen && (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-5)', animation:'ct-card-enter 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both' }}>

            {/* Clock card */}
            <div style={{
              borderRadius:'1rem',
              border:'1px solid var(--border-accent)',
              background:'var(--clock-bg)',
              backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
              boxShadow:'var(--shadow-sm)',
              padding:'clamp(1rem,3vh,1.75rem) clamp(1.25rem,4vw,2.5rem)',
              display:'flex', flexDirection:'column',
              gap:'clamp(1rem,3vh,1.75rem)',
            }}>

              {/* Control bar */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                {/* Share button */}
                <button
                  onClick={handleShare}
                  aria-label="مشاركة"
                  style={{
                    display:'flex', alignItems:'center', gap:'0.4rem',
                    padding:'0.5rem 0.75rem', borderRadius:'0.625rem',
                    border: shareCopied ? '1px solid var(--success-border)' : '1px solid var(--border-default)',
                    background: shareCopied ? 'var(--success-soft)' : 'transparent',
                    color:  shareCopied ? 'var(--success)' : 'var(--text-secondary)',
                    fontSize:'0.8rem', fontWeight:'600',
                    cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap',
                  }}
                >
                  <Share2 size={15} />
                  <span>{shareCopied ? '✓ تم النسخ' : 'مشاركة'}</span>
                </button>
                {/* Fullscreen */}
                <IconBtn onClick={toggleFullscreen} label="فتح العداد بملء الشاشة" title="ملء الشاشة">
                  <Monitor size={15} /><span>ملء الشاشة</span>
                </IconBtn>
              </div>

              {/* Number display — fontSize wrapper passes size down via CSS inheritance */}
              <div style={{ fontSize: digitNormal }}>
                <DesktopNumberRow r={r} sepSize={sepNormal} />
                <MobileNumberRow  r={r} />
              </div>

              {/* Date line — centered pill, secondary hierarchy */}
              {eventDate && (
                <div style={{ display:'flex', justifyContent:'center', animation:'ct-fade-in 0.6s ease 0.55s both' }}>
                  <span style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            '0.4em',
                    padding:        '0.3rem 1rem',
                    borderRadius:   '999px',
                    background:     'var(--bg-surface-3)',
                    border:         '1px solid var(--border-subtle)',
                    fontSize:       '0.82rem',
                    fontWeight:     '500',
                    color:          'var(--text-muted)',
                    letterSpacing:  '0.01em',
                  }}>
                    <span aria-hidden style={{ opacity: 0.6, fontSize: '0.75rem' }}>📅</span>
                    {eventDate}
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div>
              <div className="progress-track">
                <div className="progress-fill progress-fill--countdown" style={{ width:`${pct}%`, backgroundPosition:`${pct}% 0` }} />
              </div>
              <div aria-hidden style={{ display:'flex', justifyContent:'space-between', marginTop:'var(--space-2)', fontSize:'var(--text-xs)', color:'var(--text-muted)' }}>
                <span>الآن</span>
                <span suppressHydrationWarning>
                  {r.days > 0
                    ? `${r.days} يوم${r.hours>0?` و ${r.hours} ساعة`:''} متبقي`
                    : r.hours > 0
                      ? `${r.hours} ساعة و ${r.minutes} دقيقة متبقي`
                      : `${r.minutes} دقيقة و ${r.seconds} ثانية متبقي`}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}