// src/components/hero/CopyBlock.jsx  — Server Component (no 'use client')
//
// THEME NOTE — .dark class on child elements:
// ─────────────────────────────────────────────────────────────────────────────
// next-themes writes class="dark" on <html>, which defines the dark-palette
// CSS custom properties as a new cascading scope. Adding className="dark"
// to any child element creates an identical scope for that subtree, so all
// CSS vars (--text-primary, --text-secondary, etc.) resolve to dark-theme
// values inside it — regardless of what the <html> class says.
//
// We apply this to .titleSub and the description <p> because:
//   ─ The hero section always renders on a dark/translucent background.
//   ─ Light-mode values (#3D4668, #536080) are designed for white cards and
//     would clash with the dark hero canvas.
//   ─ Hardcoding hex values would bypass the design-token system and make
//     future palette changes invisible here. The .dark wrapper approach
//     keeps the elements design-system-aware while pinning them to dark tokens.
// ─────────────────────────────────────────────────────────────────────────────

import styles from './TimeCinematicHero.module.css';
import HulyButton from '@/components/HulyButton/HulyButton';

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
        <AuroraText>ميقات</AuroraText>
        {/*
          .dark forces dark-palette CSS vars for this subtree.
          Dark --text-secondary (#A8B2CB) reads correctly on the hero's
          dark/translucent canvas; light-mode value (#3D4668) does not.
        */}
        <span className={`${styles.titleSub} dark`}>
          لكل لحظة، معناها الحقيقي
        </span>
      </h1>

      {/*
        Same rationale: description text must always read against a dark
        background. .dark ensures --text-secondary / --text-muted resolves
        to the dark-palette values (#A8B2CB / #90AACC) no matter the
        global theme the user has selected.
      */}
      <p className={`${styles.desc} dark`}>
        نعرف كم يعني لك وقتك. لذلك بنينا ميقات — منصة عربية تضع كل ما يحتاجه يومك بين يديك، بدقة تشعر معها أن كل أداة صُممت لك وحدك
      </p>

      <div style={{ marginTop: '32px', padding: '4px' }}>
        <HulyButton href="/time-now">
          <span>استكشف الوقت حول العالم</span>
        </HulyButton>
      </div>

    </div>
  );
}