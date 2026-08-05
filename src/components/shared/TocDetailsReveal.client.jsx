"use client";

import { useEffect } from 'react';

// Clicking a table-of-contents link should land the reader directly inside the section they
// picked — including when that section is a collapsed, optional <details> block. The anchor id
// lives on the <summary>'s heading, which stays visible even when closed, so there's nothing for
// the browser's native fragment-reveal algorithm to act on. This opens any ancestor <details>
// before the native scroll happens. Reusable across every /tools page, not just one.
export default function TocDetailsReveal() {
  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('.tool-v2-toc a[href^="#"]');
      if (!a) return;
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      for (let el = target; el; el = el.parentElement) {
        if (el.tagName === 'DETAILS' && !el.open) el.open = true;
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
