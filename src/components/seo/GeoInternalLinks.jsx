import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';

/**
 * Same props interface as before (title/description/links/ariaLabel) — only the rendered
 * pattern changed, to the one dot-list used everywhere (owner directive, 2026-08-13). Used on
 * 5 pages (time-now, time-difference, holidays), so this single fix applies there too.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {Array<{href: string, label: string, description?: string}>} [props.links]
 * @param {string} [props.ariaLabel]
 */
export default function GeoInternalLinks(props) {
  const title = props.title;
  const description = props.description;
  const links = Array.isArray(props.links) ? props.links : [];
  const ariaLabel = props.ariaLabel;
  const safeLinks = links.filter((link) => link?.href && link?.label);

  if (safeLinks.length === 0) return null;

  return (
    <div className="max-w-3xl">
      <h2 className="date-editorial-title">{title}</h2>
      {description ? <p className="date-editorial-copy mb-4">{description}</p> : null}
      <SiteDotLinkList items={safeLinks} ariaLabel={ariaLabel || title} />
    </div>
  );
}
