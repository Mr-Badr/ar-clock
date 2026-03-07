'use client';
/**
 * components/clocks/LiveClock.jsx
 *
 * Displays the current live time (HH · MM · SS) using the exact same design
 * system as CountdownTicker — same card shell, same ct-digit CSS class,
 * same animations, same fullscreen + zoom controls.
 *
 * CountdownTicker is untouched and still works for countdowns everywhere else.
 *
 * SSR-safe: window / localStorage only accessed inside useEffect.
 * Exports: default LiveClock · LiveClockSkeleton
 */
import { useState, useEffect, useRef } from 'react';
import { Monitor, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────── */
function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function getTimeInZone(tz) {
  const now   = new Date();
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    hour:     '2-digit', hour12: false,
    minute:   '2-digit',
    second:   '2-digit',
  }).formatToParts(now);

  const get = (type) => parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);

  const dateStr = new Intl.DateTimeFormat('ar', {
    timeZone: tz,
    weekday:  'long',
    year:     'numeric',
    month:    'long',
    day:      'numeric',
  }).format(now);

  const tzLabel = new Intl.DateTimeFormat('en', {
    timeZone:     tz,
    timeZoneName: 'shortOffset',
  }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

  return {
    hours:   get('hour'),
    minutes: get('minute'),
    seconds: get('second'),
    dateStr,
    tzLabel,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   TIME UNIT — mirrors CountdownTicker's Unit component exactly.
   Uses ct-digit (cqi-sized via new.css) so digits scale with the card.
───────────────────────────────────────────────────────────────────── */
function TimeUnit({ value, label, staggerIndex = 0, visible }) {
  const str   = pad2(value);
  const delay = `${staggerIndex * 0.1}s`;
  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '0.55rem',
        animation:     `ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) ${delay} both`,
        opacity:       visible ? undefined : 0,
      }}
    >
      <div style={{ display: 'flex', lineHeight: 1 }}>
        {str.split('').map((char, pos) => (
          <span
            key={`${staggerIndex}-${pos}-${char}`}
            suppressHydrationWarning
            aria-hidden
            className="ct-digit"
          >
            {char}
          </span>
        ))}
      </div>
      <span className="ct-unit-label" aria-hidden>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   COLON — identical to CountdownTicker's Colon
───────────────────────────────────────────────────────────────────── */
function Colon({ visible }) {
  return (
    <span
      className="ct-sep-char"
      aria-hidden
      style={{ opacity: visible ? undefined : 0 }}
    >
      :
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   ICON BUTTON — identical to CountdownTicker's IconBtn
───────────────────────────────────────────────────────────────────── */
function IconBtn({ onClick, label, title, children, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      title={title || label}
      disabled={disabled}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '0.4rem',
        padding:      '0.5rem 0.85rem',
        borderRadius: '0.625rem',
        border:       '1px solid var(--border-default)',
        background:   'transparent',
        cursor:       disabled ? 'not-allowed' : 'pointer',
        color:        disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontSize:     '0.82rem',
        fontWeight:   '600',
        opacity:      disabled ? 0.4 : 1,
        transition:   'background 0.15s, color 0.15s, border-color 0.15s',
        whiteSpace:   'nowrap',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background  = 'color-mix(in srgb, var(--bg-surface-3) 80%, transparent)';
          e.currentTarget.style.color       = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--border-accent)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = 'transparent';
        e.currentTarget.style.color       = disabled ? 'var(--text-muted)' : 'var(--text-secondary)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   UNITS CONFIG
───────────────────────────────────────────────────────────────────── */
const TIME_UNITS = [
  { key: 'hours',   label: 'ساعة'  },
  { key: 'minutes', label: 'دقيقة' },
  { key: 'seconds', label: 'ثانية' },
];

/* ─────────────────────────────────────────────────────────────────────
   SKELETON — mirrors CountdownTickerSkeleton, shown before mount
───────────────────────────────────────────────────────────────────── */
export function LiveClockSkeleton() {
  return (
    <div
      style={{
        borderRadius:   '1rem',
        border:         '1px solid var(--border-accent)',
        background:     'var(--clock-bg)',
        backdropFilter: 'blur(20px)',
        boxShadow:      'var(--shadow-accent)',
        padding:        'clamp(1.25rem, 4vw, 2.5rem)',
        display:        'flex',
        flexDirection:  'column',
        gap:            '1.5rem',
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '110px', height: '34px', borderRadius: '0.625rem', background: 'var(--bg-surface-4)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1rem, 4vw, 3rem)', padding: '0.5rem 0' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 'clamp(60px, 12vw, 96px)', height: 'clamp(56px, 10vw, 88px)', borderRadius: '0.5rem', background: 'var(--bg-surface-4)' }} />
            <div style={{ width: '44px', height: '22px', borderRadius: '999px', background: 'var(--bg-surface-3)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '220px', height: '26px', borderRadius: '999px', background: 'var(--bg-surface-4)' }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   LIVE CLOCK — default export
   Props:
     timezone   — IANA timezone string e.g. "Africa/Casablanca".
                  Falls back to vclock_user_timezone → browser default.
     cityLabel  — Optional city name shown in fullscreen header.
───────────────────────────────────────────────────────────────────── */
export default function LiveClock({ timezone = null, cityLabel = null }) {
  const [time,    setTime]    = useState(null);
  const [visible, setVisible] = useState(false);
  const [isFS,    setIsFS]    = useState(false);
  const [zoom,    setZoom]    = useState(1);

  const containerRef = useRef(null);
  const activeTzRef  = useRef(timezone);

  /* ── Resolve timezone + start tick ── */
  useEffect(() => {
    if (!timezone) {
      const saved = localStorage.getItem('vclock_user_timezone');
      activeTzRef.current = saved || Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else {
      activeTzRef.current = timezone;
    }

    const tick = () => setTime(getTimeInZone(activeTzRef.current));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [timezone]);

  /* ── FIX: hide digits until CSS has painted (mirrors CountdownTicker fix 2) ── */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Fullscreen API listeners ── */
  useEffect(() => {
    const onChange = () => {
      const active = !!(
        document.fullscreenElement       ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement    ||
        document.msFullscreenElement
      );
      if (!active) setIsFS(false);
    };
    const evts = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    evts.forEach(e => document.addEventListener(e, onChange));
    return () => evts.forEach(e => document.removeEventListener(e, onChange));
  }, []);

  const toggleFS = async () => {
    if (!isFS) {
      const el = containerRef.current;
      if (!el) return;
      try {
        if      (el.requestFullscreen)       await el.requestFullscreen();
        else if (el.webkitRequestFullscreen)       el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen)          el.mozRequestFullScreen();
        else if (el.msRequestFullscreen)           el.msRequestFullscreen();
        setZoom(1);
      } catch { /* CSS fallback */ }
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

  const zoomIn     = () => setZoom(z => Math.min(z + 1, 2));
  const zoomOut    = () => setZoom(z => Math.max(z - 1, 0));
  const scaleValue = zoom === 0 ? 'scale(0.7)' : zoom === 2 ? 'scale(1.3)' : 'scale(1)';
  const zoomLabel  = ['تصغير', 'حجم عادي', 'تكبير'][zoom];

  const t = time ?? { hours: 0, minutes: 0, seconds: 0, dateStr: '', tzLabel: '' };

  /* ── Fullscreen ── */
  if (isFS) {
    return (
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         100,
            background:     'var(--bg-base)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
          }}
          dir="rtl"
        >
          {/* FS toolbar */}
          <div style={{
            position:       'absolute',
            top:            '1.5rem',
            right:          '1.5rem',
            left:           '1.5rem',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            zIndex:         110,
          }}>
            <IconBtn onClick={toggleFS} label="إغلاق ملء الشاشة">
              <Minimize2 size={18} /><span>إغلاق</span>
            </IconBtn>
            <div style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '0.25rem',
              background:     'color-mix(in srgb, var(--bg-surface-3) 70%, transparent)',
              backdropFilter: 'blur(12px)',
              padding:        '0.25rem',
              borderRadius:   '0.875rem',
              border:         '1px solid var(--border-default)',
            }}>
              <IconBtn onClick={zoomOut} label="تصغير"  disabled={zoom === 0}><ZoomOut size={20} /></IconBtn>
              <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.72rem', fontWeight: '900', minWidth: '80px', textAlign: 'center', color: 'var(--text-primary)' }}>
                {zoomLabel}
              </span>
              <IconBtn onClick={zoomIn}  label="تكبير"  disabled={zoom === 2}><ZoomIn  size={20} /></IconBtn>
            </div>
          </div>

          {/* FS content */}
          <div style={{
            width:          '100%',
            height:         '100%',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '1rem',
            transform:      scaleValue,
            transition:     'transform 0.5s ease-in-out',
            gap:            'clamp(1.5rem, 4vh, 3.5rem)',
          }}>
            {cityLabel && (
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', fontWeight: '800', color: 'var(--accent)', textAlign: 'center', margin: 0 }}>
                {cityLabel}
              </h2>
            )}

            {/* FS digits — use vw/vh since it IS the full viewport */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1rem, 5vw, 5rem)', direction: 'ltr' }}>
              {TIME_UNITS.map(({ key, label }, i) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 5vw, 5rem)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', lineHeight: 1 }}>
                      {pad2(t[key]).split('').map((char, pos) => (
                        <span
                          key={`fs-${i}-${pos}-${char}`}
                          suppressHydrationWarning
                          aria-hidden
                          style={{
                            display:             'block',
                            fontSize:            'clamp(4rem, min(18vw, 28vh), 16rem)',
                            fontWeight:          '800',
                            lineHeight:          1,
                            color:               'var(--clock-digit-color)',
                            textShadow:          'var(--clock-digit-glow)',
                            fontVariantNumeric:  'tabular-nums',
                            letterSpacing:       '0.02em',
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                    <span style={{
                      fontSize:   'clamp(0.8rem, min(2.2vw, 3vh), 1.4rem)',
                      fontWeight: '500',
                      color:      'var(--text-secondary)',
                      padding:    '0.2rem 0.75rem',
                      borderRadius: '999px',
                      background: 'var(--bg-surface-3)',
                      border:     '1px solid var(--border-subtle)',
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < TIME_UNITS.length - 1 && (
                    <span aria-hidden style={{
                      fontSize:   'clamp(2.5rem, min(10vw, 16vh), 10rem)',
                      color:      'var(--clock-separator)',
                      fontWeight: '700',
                      alignSelf:  'center',
                      marginBottom: '1.3em',
                      flexShrink: 0,
                      userSelect: 'none',
                    }}>:</span>
                  )}
                </div>
              ))}
            </div>

            {/* FS date pill */}
            {t.dateStr && (
              <p style={{
                fontSize:   'clamp(1rem, 2.5vw, 1.5rem)',
                color:      'var(--text-secondary)',
                padding:    '0.6rem 1.75rem',
                background: 'color-mix(in srgb, var(--bg-surface-3) 50%, transparent)',
                border:     '1px solid var(--border-default)',
                borderRadius: '999px',
                margin:     0,
              }}>
                {t.dateStr}
              </p>
            )}

            {/* FS timezone label */}
            {t.tzLabel && (
              <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                🌐 {t.tzLabel} · {activeTzRef.current}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Normal card view — same shell as CountdownTicker ── */
  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display:   'flex',
        flexDirection: 'column',
        gap:       'var(--space-5)',
        animation: 'ct-card-enter 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both',
      }}>
        <div
          className="ct-clock-card"
          style={{
            borderRadius:         '1rem',
            border:               '1px solid var(--border-accent)',
            background:           'var(--clock-bg)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow:            'var(--shadow-accent)',
            padding:              'clamp(1.25rem, 3.5vh, 2rem) clamp(1.5rem, 4vw, 3rem)',
            display:              'flex',
            flexDirection:        'column',
            gap:                  'clamp(1.25rem, 3vh, 2rem)',
          }}
        >
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <IconBtn onClick={toggleFS} label="فتح الساعة بملء الشاشة" title="ملء الشاشة">
              <Monitor size={15} /><span>ملء الشاشة</span>
            </IconBtn>
          </div>

          {/* Digit row — uses ct-row-desktop so CSS @container controls it */}
          <div
            className="ct-row-desktop"
            style={{
              alignItems:     'center',
              justifyContent: 'center',
              gap:            'clamp(0.5rem, 3cqi, 2.5rem)',
              direction:      'ltr',
            }}
            role="timer"
            aria-label={`الساعة الآن ${pad2(t.hours)}:${pad2(t.minutes)}:${pad2(t.seconds)}`}
            aria-live="off"
          >
            {TIME_UNITS.map(({ key, label }, i) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 3cqi, 2.5rem)' }}>
                <TimeUnit value={t[key]} label={label} staggerIndex={i} visible={visible} />
                {i < TIME_UNITS.length - 1 && <Colon visible={visible} />}
              </div>
            ))}
          </div>

          {/* Date pill */}
          {t.dateStr && (
            <div style={{ display: 'flex', justifyContent: 'center', animation: 'ct-fade-in 0.6s ease 0.55s both' }}>
              <span style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '0.4em',
                padding:      '0.35rem 1.1rem',
                borderRadius: '999px',
                background:   'var(--bg-surface-3)',
                border:       '1px solid var(--border-subtle)',
                fontSize:     '0.85rem',
                fontWeight:   '500',
                color:        'var(--text-muted)',
              }}>
                <span aria-hidden style={{ opacity: 0.6 }}>📅</span>
                {t.dateStr}
              </span>
            </div>
          )}

          {/* Timezone pill */}
          {t.tzLabel && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '0.4em',
                padding:      '0.25rem 0.85rem',
                borderRadius: '999px',
                background:   'var(--bg-surface-2)',
                border:       '1px solid var(--border-subtle)',
                fontSize:     '0.75rem',
                fontWeight:   '500',
                color:        'var(--text-muted)',
                letterSpacing:'0.02em',
              }}>
                🌐 {t.tzLabel} · {activeTzRef.current}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}