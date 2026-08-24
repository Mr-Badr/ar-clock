// home/v2/InteractiveLink.jsx
// Magic UI's InteractiveHoverButton (magicui.design/docs/components/interactive-hover-button)
// interaction pattern — a dot that expands to fill the pill while the label slides out and a
// second label+arrow slides in — reimplemented in plain CSS (pure :hover/:focus, no JS/state
// needed) instead of the Tailwind-utility original, so each of the four bespoke sections can
// tint it with its OWN accent color via the `accent` prop rather than sharing one look. RTL-
// mirrored: the source slides right-to-left (LTR "forward"); here the hover label slides in
// from the trailing side toward the leading (visual left) side, matching this site's established
// ArrowLeft-as-forward convention.
//
// 2026-08-23: re-checked against the real component source via magicui's own registry (owner:
// "not look like the effect in the website... contrast should be better") — see
// interactive-link.css's header comment for the two real divergences that were found and fixed
// (undersized dot scale, and an extra background-tint layer that made contrast unpredictable).
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import './interactive-link.css';

export default function InteractiveLink({ href, children, accent = 'var(--accent-alt)' }) {
  return (
    <Link
      href={href}
      prefetch
      className="ilink"
      style={{ '--ilink-accent': accent }}
    >
      <span className="ilink-dot" aria-hidden="true" />
      <span className="ilink-face ilink-face--idle">{children}</span>
      <span className="ilink-face ilink-face--hover" aria-hidden="true">
        {children}
        <ArrowLeft size={15} />
      </span>
    </Link>
  );
}
