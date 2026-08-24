'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// fourUnit's "large" level is deliberately more conservative than threeUnit's —
// an 8-digit countdown row is already close to the edge of narrow mobile
// viewports at the base size, so a bigger multiplier clips digits at the
// screen edge. Verified empirically at 390px width (see fullscreen UI fix,
// 2026-08-01): 1.24x clipped the leading digit, 1.14x leaves real margin.
export const FULLSCREEN_ZOOM_LEVELS = {
  threeUnit: [0.8, 1, 1.24],
  fourUnit: [0.76, 1, 1.14],
};

// A 4th "extra large" tier, added 2026-08-25. Unlike the three tiers above —
// flat numbers that have to stay safe on the narrowest phone in the fleet —
// this one scales with viewport width: a laptop/desktop screen has room to
// go noticeably bigger than a 360px phone, so a single flat multiplier would
// either clip on mobile or waste the extra room everywhere else. Each
// breakpoint's scale was verified with Puppeteer (measuring the rendered
// digit row's bounding box against the viewport, real Noto Sans Arabic font)
// across a spread of phone/tablet/laptop widths AND short-height laptop
// viewports (1366x768 etc.) — every value here has real clipping margin, not
// just a guess. Widths are `<= breakpoint` in ascending order.
const XL_SCALE_TIERS = {
  fourUnit: [
    { maxWidth: 420, scale: 1.20 },
    { maxWidth: 768, scale: 1.32 },
    { maxWidth: 1200, scale: 1.45 },
    { maxWidth: Infinity, scale: 1.60 },
  ],
  threeUnit: [
    { maxWidth: 420, scale: 1.32 },
    { maxWidth: 768, scale: 1.45 },
    { maxWidth: 1200, scale: 1.60 },
    { maxWidth: Infinity, scale: 1.75 },
  ],
};

const DEFAULT_VIEWPORT_WIDTH = 1280;

/** Pure lookup — safe to call during SSR (falls back to a laptop-ish width). */
export function getResponsiveXLScale(variant = 'threeUnit', viewportWidth) {
  const tiers = XL_SCALE_TIERS[variant] || XL_SCALE_TIERS.threeUnit;
  const width = viewportWidth ?? (typeof window !== 'undefined' ? window.innerWidth : DEFAULT_VIEWPORT_WIDTH);
  const tier = tiers.find((t) => width <= t.maxWidth) || tiers[tiers.length - 1];
  return tier.scale;
}

/** Tracks the live viewport width (resize/orientation-safe) for the XL zoom tier. */
export function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : DEFAULT_VIEWPORT_WIDTH));

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

export function getFullscreenZoomLabel(level) {
  return ['تصغير', 'حجم عادي', 'تكبير', 'أكبر حجم'][level] || 'حجم عادي';
}

export function getFullscreenScale(level, variant = 'threeUnit', viewportWidth) {
  if (level === 3) {
    return `scale(${getResponsiveXLScale(variant, viewportWidth)})`;
  }
  const levels = FULLSCREEN_ZOOM_LEVELS[variant] || FULLSCREEN_ZOOM_LEVELS.threeUnit;
  return `scale(${levels[level] ?? levels[1]})`;
}

export function getActiveFullscreenElement() {
  if (typeof document === 'undefined') return null;
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  );
}

export async function requestElementFullscreen(element) {
  if (!element) return false;

  const request =
    element.requestFullscreen?.bind(element) ||
    element.webkitRequestFullscreen?.bind(element) ||
    element.mozRequestFullScreen?.bind(element) ||
    element.msRequestFullscreen?.bind(element);

  if (!request) return false;

  try {
    const result = request();
    if (result && typeof result.then === 'function') {
      await result;
    }
    return true;
  } catch {
    return false;
  }
}

export async function exitActiveFullscreen() {
  if (typeof document === 'undefined') return false;

  const exit =
    document.exitFullscreen?.bind(document) ||
    document.webkitExitFullscreen?.bind(document) ||
    document.mozCancelFullScreen?.bind(document) ||
    document.msExitFullscreen?.bind(document);

  if (!exit) return false;

  try {
    const result = exit();
    if (result && typeof result.then === 'function') {
      await result;
    }
    return true;
  } catch {
    return false;
  }
}

export function syncFullscreenDocumentState(active) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('has-css-fullscreen', active);
  document.body.classList.toggle('has-css-fullscreen', active);
}

export const FULLSCREEN_LAYER_STYLE = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  minHeight: '100svh',
  height: '100dvh',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'max(clamp(1rem, 2vw, 1.9rem), env(safe-area-inset-top)) max(clamp(1rem, 2vw, 1.9rem), env(safe-area-inset-right)) max(clamp(1rem, 2vw, 1.9rem), env(safe-area-inset-bottom)) max(clamp(1rem, 2vw, 1.9rem), env(safe-area-inset-left))',
  overflow: 'hidden',
  overscrollBehavior: 'none',
  WebkitOverflowScrolling: 'touch',
  touchAction: 'manipulation',
};

// Positioned at the TOP, in two independent corner clusters (close button
// one corner, zoom/share controls the other) — keeps the entire vertical
// viewport free for the actual content below it, instead of a bottom bar
// competing with the centered counter/clock for the same space.
export const FULLSCREEN_TOOLBAR_STYLE = {
  position: 'absolute',
  top: 'max(clamp(0.9rem, 1.8vw, 1.5rem), env(safe-area-inset-top))',
  right: 'max(clamp(0.9rem, 1.8vw, 1.5rem), env(safe-area-inset-right))',
  left: 'max(clamp(0.9rem, 1.8vw, 1.5rem), env(safe-area-inset-left))',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.9rem',
  zIndex: 110,
};

export const FULLSCREEN_ZOOM_GROUP_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  background: 'color-mix(in srgb, var(--bg-surface-3) 70%, transparent)',
  backdropFilter: 'blur(12px)',
  padding: '0.35rem',
  borderRadius: '1rem',
  border: '1px solid var(--border-default)',
  flexShrink: 0,
};

export const FULLSCREEN_ZOOM_LABEL_STYLE = {
  padding: '0.5rem 0.9rem',
  fontSize: 'clamp(0.76rem, 1.1vw, 0.92rem)',
  fontWeight: '900',
  minWidth: '96px',
  textAlign: 'center',
  color: 'var(--text-primary)',
};

export function getFullscreenContentStyle(scaleValue) {
  return {
    width: 'min(100%, 1760px)',
    maxWidth: 'calc(100vw - clamp(2.25rem, 5vw, 5rem))',
    maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - clamp(5rem, 9vh, 6.5rem))',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 2.2vh, 1.65rem) clamp(0.9rem, 2vw, 1.5rem)',
    // The exit/zoom controls are absolutely positioned in the TOP corners of
    // the fullscreen layer, outside normal flex flow — the layer's
    // `justifyContent: center` centers this content in the FULL viewport
    // height with no awareness of the controls above it. A small top margin
    // nudges the centered block down just enough to clear those corner
    // clusters, without eating into the generous vertical space now freed
    // up by moving the toolbar off the bottom edge.
    marginBlockStart: 'clamp(2.75rem, 6vh, 3.75rem)',
    transform: scaleValue,
    transformOrigin: 'center center',
    transition: 'transform 0.35s ease-in-out',
    gap: 'clamp(1rem, 3vh, 2.5rem)',
    overflow: 'hidden',
  };
}

export function getFullscreenRowStyle(unitCount = 3) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: unitCount === 4 ? 'clamp(0.4rem, 1.4vw, 1.15rem)' : 'clamp(0.65rem, 2.2vw, 1.75rem)',
    direction: 'ltr',
    flexWrap: 'nowrap',
    width: '100%',
    maxWidth: '100%',
  };
}

export function getFullscreenUnitWrapStyle(unitCount = 3) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: unitCount === 4 ? 'clamp(0.4rem, 1.4vw, 1.15rem)' : 'clamp(0.65rem, 2.2vw, 1.75rem)',
    minWidth: 0,
  };
}

export function getFullscreenDigitStyle(unitCount = 3) {
  return {
    display: 'block',
    fontSize: unitCount === 4
      ? 'clamp(2.9rem, min(8.8vw, 14vh), 12rem)'
      : 'clamp(3.35rem, min(12vw, 18.5vh), 15.5rem)',
    fontWeight: '800',
    lineHeight: 1,
    color: 'var(--clock-digit-color)',
    textShadow: 'var(--clock-digit-glow)',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.02em',
  };
}

export const FULLSCREEN_UNIT_LABEL_STYLE = {
  fontSize: 'clamp(0.78rem, min(1.55vw, 2.1vh), 1.02rem)',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  padding: '0.28rem 0.8rem',
  borderRadius: '999px',
  background: 'var(--bg-surface-3)',
  border: '1px solid var(--border-subtle)',
  whiteSpace: 'nowrap',
};

export function getFullscreenSeparatorStyle(unitCount = 3) {
  return {
    fontSize: unitCount === 4
      ? 'clamp(1.55rem, min(4vw, 6.4vh), 3.6rem)'
      : 'clamp(1.9rem, min(5vw, 8.5vh), 4.2rem)',
    color: 'var(--clock-separator)',
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: '0.78em',
    flexShrink: 0,
    userSelect: 'none',
  };
}

export const FULLSCREEN_TITLE_STYLE = {
  fontSize: 'clamp(1.25rem, 3.4vw, 2.85rem)',
  fontWeight: '800',
  color: 'var(--accent)',
  textAlign: 'center',
  margin: 0,
  maxWidth: 'min(90vw, 1080px)',
  lineHeight: 1.15,
};

/* ─────────────────────────────────────────────────────────────────────
   IDLE AUTO-HIDE — keeps a fullscreen clock's corner buttons out of the
   way for passive viewing (wall display, bedside table, presentation
   screen): after a few seconds with no mouse/touch/keyboard activity the
   toolbar fades out so only the numbers remain, and any activity brings
   it straight back. Screen-sleep prevention is handled separately by each
   caller's own WakeLock effect — this only concerns visual chrome.
───────────────────────────────────────────────────────────────────── */
const IDLE_HIDE_DELAY_MS = 3000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'touchstart', 'touchmove', 'keydown', 'pointerdown', 'wheel', 'focusin'];

/**
 * Returns whether fullscreen controls should currently be visible. Pass the
 * component's own `isFullscreen` flag as `active` — while inactive this
 * always returns true (normal, non-fullscreen view never hides its buttons).
 */
export function useFullscreenIdleHide(active) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const timerRef = useRef(null);

  const clearHideTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    timerRef.current = setTimeout(() => setControlsVisible(false), IDLE_HIDE_DELAY_MS);
  }, [clearHideTimer]);

  useEffect(() => {
    if (!active) {
      setControlsVisible(true);
      clearHideTimer();
      return undefined;
    }

    setControlsVisible(true);
    scheduleHide();

    const handleActivity = () => {
      setControlsVisible(true);
      scheduleHide();
    };

    ACTIVITY_EVENTS.forEach((evt) => document.addEventListener(evt, handleActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => document.removeEventListener(evt, handleActivity));
      clearHideTimer();
    };
  }, [active, scheduleHide, clearHideTimer]);

  return controlsVisible;
}

/** Style patch for a fullscreen toolbar — fades + disables pointer events while idle. */
export function getFullscreenControlsVisibilityStyle(visible) {
  return {
    transition: 'opacity 0.35s ease, transform 0.35s ease',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transform: visible ? 'none' : 'translateY(-0.6rem)',
  };
}

/** Style patch for the fullscreen layer itself — hides the mouse cursor while idle. */
export function getFullscreenCursorStyle(visible) {
  return { cursor: visible ? 'auto' : 'none' };
}
