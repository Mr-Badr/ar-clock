'use client';

// HeroVideoPanel.jsx
//
// ⚠️  DEPRECATED — no longer used by TimeCinematicHero.
//
// The hero was redesigned to use a static RTL grid layout with a calm
// gradient background. The video panel and ROI-based clock positioning
// have been removed. This file is preserved for reference only.
//
// If you need a video hero variant in the future, restore this component
// and wire it back into TimeCinematicHero.jsx.

export default function HeroVideoPanel({ children }) {
  // Pass-through — kept for backwards compat if imported elsewhere.
  return <>{children}</>;
}