import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MagicCard } from '@/components/ui/magic-card';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';
import styles from './GeoInternalLinks.module.css';

/**
 * Same props interface as before (title/description/links/ariaLabel) — the
 * default rendered pattern is still the one dot-list used everywhere (owner
 * directive, 2026-08-13). Pass `variant="cards"` for sections where the
 * links themselves ARE the content the reader came for (a "what's next"
 * pathway list), not a compact reference list — small clean link-preview
 * cards instead (owner, 2026-08-24).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {Array<{href: string, label: string, description?: string}>} [props.links]
 * @param {string} [props.ariaLabel]
 * @param {'list'|'cards'} [props.variant='list']
 */
export default function GeoInternalLinks(props) {
  const title = props.title;
  const description = props.description;
  const links = Array.isArray(props.links) ? props.links : [];
  const ariaLabel = props.ariaLabel;
  const variant = props.variant || 'list';
  const safeLinks = links.filter((link) => link?.href && link?.label);

  if (safeLinks.length === 0) return null;

  if (variant === 'cards') {
    return (
      <div className="max-w-3xl">
        <h2 className="date-editorial-title">{title}</h2>
        {description ? <p className="date-editorial-copy mb-4">{description}</p> : null}
        <nav aria-label={ariaLabel || title} className={styles.cardGrid}>
          {safeLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.cardLink}>
              <MagicCard className="rounded-lg">
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>
                    {link.label}
                    <ArrowLeft size={16} className={styles.cardArrow} aria-hidden="true" />
                  </span>
                  {link.description ? (
                    <p className={styles.cardDescription}>{link.description}</p>
                  ) : null}
                </div>
              </MagicCard>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h2 className="date-editorial-title">{title}</h2>
      {description ? <p className="date-editorial-copy mb-4">{description}</p> : null}
      <SiteDotLinkList items={safeLinks} ariaLabel={ariaLabel || title} />
    </div>
  );
}
