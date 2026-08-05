import { Markazi_Text } from 'next/font/google';
import './guide-v2.css';

// Editorial display face for guide H1s and pull-quotes only (never body text) — gives the
// long-form guide pages in this hub a distinct, considered identity separate from the
// utilitarian calculator pages elsewhere in /tools, per the owner's "v2, research-based,
// not AI-generic" design directive (2026-07-31). Scoped to this route segment only so the
// rest of the site pays no extra font cost.
const markaziText = Markazi_Text({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-guide-display',
  display: 'swap',
});

export default function PlumbingLayout({ children }) {
  return <div className={markaziText.variable}>{children}</div>;
}
