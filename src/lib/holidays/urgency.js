/**
 * Shared "days remaining" urgency classification used across the holidays
 * listing grid (EventCard), related-content strips (RelatedEventsBubbles),
 * and any other surface that needs to agree on the same thresholds/labels.
 */

export function daysLabel(days) {
  if (days <= 0) return 'اليوم';
  if (days === 1) return 'غداً';
  if (days < 11) return `${days} أيام`;
  return `${days} يوماً`;
}

/** Three-tier classification driving color (EventCard's data-urgency, badges, bubbles). */
export function urgencyTier(days) {
  if (days <= 3) return 'urgent';
  if (days <= 14) return 'soon';
  return 'normal';
}

/**
 * Live-status badge text for the two most urgent tiers only — normal-tier
 * events rely on the existing number/bar color alone (no badge needed).
 * Returns null when no badge should render.
 */
export function liveStatusLabel(days) {
  if (days <= 0) return 'اليوم';
  if (days <= 3) return 'قريب جداً';
  if (days <= 14) return 'قريباً';
  return null;
}
