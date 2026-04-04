export const FULLSCREEN_ZOOM_LEVELS = {
  threeUnit: [0.86, 1.05, 1.2],
  fourUnit: [0.78, 1.04, 1.12],
};

export function getFullscreenZoomLabel(level) {
  return ['تصغير', 'حجم عادي', 'تكبير'][level] || 'حجم عادي';
}

export function getFullscreenScale(level, variant = 'threeUnit') {
  const levels = FULLSCREEN_ZOOM_LEVELS[variant] || FULLSCREEN_ZOOM_LEVELS.threeUnit;
  return `scale(${levels[level] ?? levels[1]})`;
}

export const FULLSCREEN_LAYER_STYLE = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

export const FULLSCREEN_TOOLBAR_STYLE = {
  position: 'absolute',
  top: '1.5rem',
  right: '1.5rem',
  left: '1.5rem',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.75rem',
  zIndex: 110,
};

export const FULLSCREEN_ZOOM_GROUP_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  background: 'color-mix(in srgb, var(--bg-surface-3) 70%, transparent)',
  backdropFilter: 'blur(12px)',
  padding: '0.25rem',
  borderRadius: '0.875rem',
  border: '1px solid var(--border-default)',
  flexShrink: 0,
};

export const FULLSCREEN_ZOOM_LABEL_STYLE = {
  padding: '0.4rem 0.75rem',
  fontSize: '0.72rem',
  fontWeight: '900',
  minWidth: '80px',
  textAlign: 'center',
  color: 'var(--text-primary)',
};

export function getFullscreenContentStyle(scaleValue) {
  return {
    width: 'min(100%, 1700px)',
    maxWidth: 'calc(100vw - 1.25rem)',
    maxHeight: 'calc(100vh - 5.5rem)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.85rem 0.75rem',
    transform: scaleValue,
    transformOrigin: 'center center',
    transition: 'transform 0.35s ease-in-out',
    gap: 'clamp(0.85rem, 2.4vh, 2rem)',
    overflow: 'hidden',
  };
}

export function getFullscreenRowStyle(unitCount = 3) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: unitCount === 4 ? 'clamp(0.5rem, 2vw, 1.5rem)' : 'clamp(0.75rem, 3vw, 2rem)',
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
    gap: unitCount === 4 ? 'clamp(0.5rem, 2vw, 1.5rem)' : 'clamp(0.75rem, 3vw, 2rem)',
    minWidth: 0,
  };
}

export function getFullscreenDigitStyle(unitCount = 3) {
  return {
    display: 'block',
    fontSize: unitCount === 4
      ? 'clamp(2.5rem, min(8.8vw, 14.5vh), 6.75rem)'
      : 'clamp(3rem, min(12vw, 18.5vh), 9rem)',
    fontWeight: '800',
    lineHeight: 1,
    color: 'var(--clock-digit-color)',
    textShadow: 'var(--clock-digit-glow)',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.02em',
  };
}

export const FULLSCREEN_UNIT_LABEL_STYLE = {
  fontSize: 'clamp(0.72rem, min(1.6vw, 2.1vh), 1rem)',
  fontWeight: '500',
  color: 'var(--text-secondary)',
  padding: '0.2rem 0.65rem',
  borderRadius: '999px',
  background: 'var(--bg-surface-3)',
  border: '1px solid var(--border-subtle)',
  whiteSpace: 'nowrap',
};

export function getFullscreenSeparatorStyle(unitCount = 3) {
  return {
    fontSize: unitCount === 4
      ? 'clamp(1.65rem, min(4.5vw, 7.5vh), 3.9rem)'
      : 'clamp(1.9rem, min(5.4vw, 9.8vh), 4.4rem)',
    color: 'var(--clock-separator)',
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: '0.85em',
    flexShrink: 0,
    userSelect: 'none',
  };
}

export const FULLSCREEN_TITLE_STYLE = {
  fontSize: 'clamp(1.1rem, 3vw, 2.25rem)',
  fontWeight: '800',
  color: 'var(--accent)',
  textAlign: 'center',
  margin: 0,
  maxWidth: 'min(90vw, 900px)',
  lineHeight: 1.2,
};
