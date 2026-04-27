// src/components/hero/CopyBlock.jsx  — Server Component (no 'use client')
//
// Theme note:
// ─────────────────────────────────────────────────────────────────────────────
// The previous version added className="dark" to titleSub and desc to force
// dark-palette token values. That worked when the hero always had a dark video
// background. Now that the hero uses a proper light/dark gradient background
// (`:global(.light) .heroRoot` in TimeCinematicHero.module.css), every text
// element should resolve its color tokens naturally from the cascade — no
// manual .dark override needed.
//
// Adding .dark on a light-background hero makes light-palette text
// (--text-secondary: #A8B2CB) invisible against the near-white canvas.
// Removing it lets the app theme class resolve the correct value per mode:
//   dark  → --text-secondary: #A8B2CB  ✓ readable on dark hero
//   light → --text-secondary: #536080  ✓ readable on light hero
// ─────────────────────────────────────────────────────────────────────────────

import styles from './TimeCinematicHero.module.css';
import HulyButton from '@/components/HulyButton/HulyButton';
import { SITE_BRAND } from '@/lib/site-config';

function AuroraText({ children }) {
  return (
    <span className={styles.auroraText} style={{ paddingBottom: '0.3em' }}>
      {children}
    </span>
  );
}

export default function CopyBlock({ extraClass = '' }) {
  return (
    <div className={`${styles.copy} ${extraClass}`}>

      <p className={styles.badge}>أخيراً، أداة صُنعت لك</p>

      <h1 className={styles.title}>
        <AuroraText>{SITE_BRAND}</AuroraText>
        {/* No .dark override — resolves to correct token per active theme */}
        <span className={styles.titleSub}>
          لكل لحظة، معناها الحقيقي
        </span>
      </h1>

      {/* No .dark override — resolves to correct token per active theme */}
      <p className={styles.desc}>
        نعرف كم يعني لك وقتك. لذلك بنينا {SITE_BRAND}، منصة عربية تضع كل ما يحتاجه يومك بين يديك، بدقة تشعر معها أن كل أداة صُممت لك وحدك
      </p>

      <div style={{ marginTop: '32px', padding: '4px' }}>
        <HulyButton href="/time-now">
          <span>استكشف الوقت حول العالم</span>
        </HulyButton>
      </div>

    </div>
  );
}
