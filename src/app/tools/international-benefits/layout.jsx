import { Markazi_Text } from 'next/font/google';
import './guide-v2.css';

// New category (2026-08-25) — split out of /tools/gulf-finance alongside domestic-worker and the
// fuel-price move done earlier the same day. These 3 tools (Denmark child benefit, Canada child
// benefit, France seasonal sales dates) were never Gulf/Arab finance to begin with — they were
// relocated into gulf-finance 2026-08-05 only because /calculators was being eliminated sitewide
// and needed *some* home. Same Markazi-font + guide-v2.css pattern as every other guide-v2
// category layout.
const markaziText = Markazi_Text({
  subsets: ['arabic'],
  weight: ['600', '700'],
  variable: '--font-guide-display',
  display: 'swap',
});

export default function InternationalBenefitsLayout({ children }) {
  return <div className={markaziText.variable}>{children}</div>;
}
