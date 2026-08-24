/**
 * components/time-now/QuickFactsGrid.jsx
 *
 * Small, clean "quick facts" tiles for time-now country/city pages — one
 * isolated fact per card (owner, 2026-08-24: "just the title and
 * information" — no icon, no secondary context line, no two facts sharing a
 * card). Every tile is the same height regardless of content length. Uses
 * Magic UI's MagicCard (`@/components/ui/magic-card`) for the hover
 * spotlight/border instead of a static bordered box.
 *
 * Every item is independently optional: pass `value: null|undefined` (or
 * omit the item) and it's silently dropped — a country/city missing one
 * fact (or all of them) still renders the rest of the page normally. Never
 * throw, never render an empty/broken tile.
 */
import { MagicCard } from '@/components/ui/magic-card';
import styles from './QuickFactsGrid.module.css';

export function QuickFactsGrid({ items, title, description, headingId }) {
  const safeItems = Array.isArray(items)
    ? items.filter((item) => item && item.value)
    : [];

  if (safeItems.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {title ? (
        <div className={styles.head}>
          <h2 id={headingId} className={styles.title}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
      ) : null}

      <div className={styles.grid}>
        {safeItems.map((item) => (
          <MagicCard key={item.key || item.label} className={styles.tile}>
            <div className={styles.tileBody}>
              <span className={styles.tileLabel}>{item.label}</span>
              <span className={styles.tileValue} dir={item.ltr ? 'ltr' : undefined}>{item.value}</span>
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}

export default QuickFactsGrid;
