import Link from 'next/link';

/**
 * SiteDotLinkList — the ONE "related links / sources" pattern for the whole site (owner
 * directive, 2026-08-13: "they always should be just list of dots clean and small like in
 * tools pages" — replacing big bordered/icon-chip link cards, e.g. `related-link-card`).
 * Mirrors tools-v2.css's `.tool-v2-tool-link-list` exactly: a plain dot-prefixed list, no
 * card, no icon chip, no visible description line — the description (when given) moves to
 * the link's native `title` tooltip instead of taking up visual space.
 */
export type SiteDotLinkItem = {
  href: string;
  label: string;
  description?: string;
  external?: boolean;
};

export function SiteDotLinkList({
  items,
  heading,
  headingId,
  ariaLabel,
}: {
  items: SiteDotLinkItem[];
  heading?: string;
  headingId?: string;
  /** Use when the heading is rendered by the caller instead of this component (still needs
   * an accessible name on the <nav>) — pass either this or heading+headingId, not neither. */
  ariaLabel?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return null;

  return (
    <nav aria-labelledby={heading ? headingId : undefined} aria-label={!heading ? ariaLabel : undefined} dir="rtl">
      {heading && (
        <p id={headingId} className="site-dot-list__heading">
          {heading}
        </p>
      )}
      <ul className="site-dot-list">
        {safeItems.map((item) => {
          const content = (
            <>
              <span className="site-dot-list__dot" aria-hidden="true">•</span>
              <span className="site-dot-list__text">{item.label}</span>
            </>
          );
          return (
            <li key={item.href}>
              {item.external ? (
                <a
                  href={item.href}
                  title={item.description}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <Link href={item.href} title={item.description}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
