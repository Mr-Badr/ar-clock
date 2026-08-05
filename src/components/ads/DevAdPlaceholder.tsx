/**
 * DevAdPlaceholder — local-preview-only reserved ad space.
 * ─────────────────────────────────────────────────────────────────────────────
 * Every real ad component (AdTopBanner, AdInArticle, AdSidebarSticky) renders
 * nothing at all when ads aren't configured for the current environment — by
 * design, since production ads reserve/collapse space based on real fill state
 * (see each component's own JSDoc). Locally, with no AdSense client ID
 * configured, that means every ad slot collapses to zero height, making it
 * impossible to review page layout/spacing around ads before shipping.
 *
 * Deliberately undecorated (owner rule, 2026-07-30): no border, no background,
 * no visible label — just the reserved height. A designed-looking placeholder
 * box reads as "a component for every ad slot," which is exactly what's not
 * wanted here; real ads carry their own required "إعلان" label already, and
 * Google fills the space in production — this is only ever a blank layout
 * reservation, not a visual element in its own right.
 *
 * Callers render this ONLY when `process.env.NODE_ENV !== 'production'` AND
 * the real ad component would otherwise render null — it never runs in
 * production, so it can never affect real ad revenue, CLS measurements, or
 * AdSense policy compliance.
 */
interface DevAdPlaceholderProps {
  minHeight?: number;
  /** "large" matches AdTopBanner's size="large" — a responsive (mobile stays small,
   * tablet/desktop grows) reserved height via CSS instead of one fixed JS number, since the
   * real large variant's height also varies by breakpoint (see .ad-slot-dev-preview--large). */
  large?: boolean;
  className?: string;
}

export default function DevAdPlaceholder({
  minHeight = 90,
  large = false,
  className = "",
}: DevAdPlaceholderProps) {
  return (
    <div
      className={`ad-slot-dev-preview ${large ? "ad-slot-dev-preview--large" : ""} ${className}`}
      style={large ? undefined : { minHeight }}
      aria-hidden="true"
    />
  );
}
