/**
 * CtaLink
 * Primary call-to-action button used in feature sections.
 *
 * WHY A CSS CLASS INSTEAD OF TAILWIND HOVER UTILITIES:
 * The gradient background is set via a CSS variable (var(--accent-gradient)).
 * Tailwind's hover: modifier generates classes like hover:bg-... which cannot
 * override inline style= values or CSS variable-driven backgrounds.
 * Solution: a local .cta-btn class with :hover rules that can target the
 * actual computed property — box-shadow, transform, opacity.
 *
 * The <style> tag is included once per render but since this is a Server
 * Component the browser deduplicates identical <style> blocks automatically.
 * For production, extract to a global CSS file if preferred.
 */

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/** @param {{ href: string, children: React.ReactNode }} props */
export default function CtaLink({ href, children }) {
  return (
    <>
      <style>{`
        .cta-btn {
          background: var(--accent-gradient);
          color: var(--text-on-accent);
          box-shadow: var(--shadow-accent);
          transition: box-shadow .2s ease, transform .15s ease, opacity .15s ease;
        }
        .cta-btn:hover {
          box-shadow: var(--shadow-accent-strong);
          transform: translateY(-1px);
          opacity: .92;
        }
        .cta-btn:active { transform: translateY(0); }
        .cta-btn:focus-visible {
          outline: 2px solid var(--accent-alt);
          outline-offset: 3px;
        }
        .cta-btn .cta-arrow { transition: transform .2s ease; }
        .cta-btn:hover .cta-arrow { transform: translateX(-3px); }
      `}</style>
      <Link
        href={href}
        className="cta-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
      >
        {children}
        <ArrowLeft size={16} className="cta-arrow" aria-hidden="true" />
      </Link>
    </>
  )
}
