import { Markazi_Text } from 'next/font/google';
import './guide-v2.css';

// Editorial display face for guide H1s and pull-quotes only (never body text) — same treatment
// as the other guide-v2 hubs, kept as its own font instance so this route segment doesn't depend
// on a sibling hub's layout.
const markaziText = Markazi_Text({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-guide-display',
  display: 'swap',
});

export default function EcommerceLayout({ children }) {
  return <div className={markaziText.variable}>{children}</div>;
}
