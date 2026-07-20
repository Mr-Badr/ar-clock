export const FULLSCREEN_ZOOM_LEVELS = {
  threeUnit: [0.82, 1, 1.16],
  fourUnit: [0.68, 1, 1.18],
};

export function getFullscreenZoomLabel(level) {
  return ['تصغير', 'حجم عادي', 'تكبير'][level] || 'حجم عادي';
}

export function getFullscreenScale(level, variant = 'threeUnit') {
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

// Positioned at the BOTTOM (not top) so the close control sits within thumb
// reach on mobile — a fullscreen browser view hides the OS chrome, so a
// top-corner-only exit is easy to miss and hard to reach one-handed.
export const FULLSCREEN_TOOLBAR_STYLE = {
  position: 'absolute',
  bottom: 'max(clamp(0.9rem, 1.8vw, 1.5rem), env(safe-area-inset-bottom))',
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
    maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - clamp(7rem, 13vh, 9.5rem))',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 2.2vh, 1.65rem) clamp(0.9rem, 2vw, 1.5rem)',
    // The exit toolbar is absolutely positioned at the bottom of the fullscreen
    // layer, outside normal flex flow — the layer's `justifyContent: center`
    // centers this content in the FULL viewport height with no awareness of
    // the toolbar underneath it. A bottom margin (not a maxHeight/overflow
    // trick — content rarely hits that limit) shifts the centered block
    // upward so its last row (the 4-unit countdown's date pill, especially)
    // clears the toolbar on short mobile viewports.
    marginBlockEnd: 'clamp(5.5rem, 13vh, 7.5rem)',
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
      ? 'clamp(2.9rem, min(8.4vw, 13.4vh), 6.85rem)'
      : 'clamp(3.35rem, min(11.4vw, 17.6vh), 9.15rem)',
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
