"use client";

import { useEffect, useState } from 'react';

// Highlights the TOC entry for whichever <section id="..."> is currently under the sticky
// header, using the same rootMargin-shrunk-viewport trick every scrollspy implementation uses:
// treat only the top ~30% of the real viewport (below the fixed navbar) as "active territory".
function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveId((prev) => {
          const intersecting = entries.filter((e) => e.isIntersecting);
          if (!intersecting.length) return prev;
          intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          return intersecting[0].target.id;
        });
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: [0, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

/**
 * Shared table-of-contents for every guide-v2 tool page. Two render modes:
 * - `variant="desktop"` — numbered vertical list for the sticky sidebar card.
 * - `variant="mobile"` — always-visible horizontal pill strip (no click-to-expand), styled
 *   deliberately unlike the article body so it reads as navigation, not content.
 * Both highlight the currently-visible section as the reader scrolls.
 */
export default function TocScrollSpy({ items, variant = 'desktop' }) {
  const ids = items.map(([id]) => id);
  const activeId = useActiveSection(ids);

  if (variant === 'mobile') {
    return (
      <nav className="guide-v2-toc-strip" aria-label="محتويات الصفحة">
        <p className="guide-v2-toc-strip-label">المحتويات</p>
        <ol className="guide-v2-toc-strip-scroll">
          {items.map(([id, label]) => (
            <li key={id} className={activeId === id ? 'is-active' : ''}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <div className="guide-v2-toc-card">
      <p className="guide-v2-toc-head">المحتويات</p>
      <ol>
        {items.map(([id, label], index) => (
          <li key={id} className={activeId === id ? 'is-active' : ''}>
            <a href={`#${id}`}>
              <span className="guide-v2-toc-num" aria-hidden="true">{index + 1}</span>
              <span className="guide-v2-toc-label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
