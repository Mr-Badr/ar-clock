import Link from 'next/link';
import { ArrowUpLeft } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * SiteRelatedCardGrid — the ONE "related pages" card pattern (owner directive, 2026-08-13:
 * "the related pages should be cards but small and clean and unique not list"). Distinct
 * from SiteDotLinkList (used for sources/citations, not same-site next-paths): small tinted
 * cards, icon only, title only — no description text, no border-top/bottom accent stripe.
 * Icon-chip color rotates automatically via CSS nth-child, matching the stat-card pattern.
 */
export type SiteRelatedCardItem = {
  href: string;
  label: string;
  // Optional — some data sources feeding this component (e.g. TOP_DISCOVERY_LINKS in
  // discovery-links.js) have no per-item icon; falls back to a plain arrow rather than crashing
  // on `<item.Icon />` with an undefined component (found 2026-08-13, time-difference hub).
  Icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
};

export function SiteRelatedCardGrid({
  items,
  heading,
  headingId,
}: {
  items: SiteRelatedCardItem[];
  heading?: string;
  headingId?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return null;

  return (
    <nav aria-labelledby={heading ? headingId : undefined} dir="rtl">
      {heading && (
        <p id={headingId} className="site-dot-list__heading">
          {heading}
        </p>
      )}
      <div className="site-related-grid">
        {safeItems.map((item) => {
          const ItemIcon = item.Icon || ArrowUpLeft;
          return (
            <Link key={item.href} href={item.href} className="site-related-card">
              <span className="site-related-card__icon" aria-hidden="true">
                <ItemIcon size={18} strokeWidth={1.75} />
              </span>
              <span className="site-related-card__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
