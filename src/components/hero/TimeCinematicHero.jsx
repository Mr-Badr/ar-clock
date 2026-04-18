// TimeCinematicHero.jsx — Server Component (no 'use client')
//
// Renders a clean two-column RTL grid:
//   col-1 (RTL RIGHT) — CopyBlock: badge, title, description, CTA
//   col-2 (RTL LEFT)  — HeroEmbeddedClock inside a glass card
//
// The .clockColumn wrapper centers the card both axes within its grid cell.
// Mobile (≤ 768px): single column, copy on top, clock below.

import styles from './TimeCinematicHero.module.css';
import CopyBlock from './CopyBlock';
import HeroEmbeddedClock from './HeroEmbeddedClock';

export default function TimeCinematicHero({
  ianaTimezone,
  cityNameAr,
  countryNameAr,
}) {
  const safeCityName    = cityNameAr || 'توقيتك المحلي';
  const safeCountryName = safeCityName === 'توقيتك المحلي' ? '' : (countryNameAr || '');

  return (
    <main className={`${styles.heroRoot} mb-16 lg:mb-24`} dir="rtl">

      {/* Decorative ambient orbs */}
      <div className={styles.orbLeft}  aria-hidden="true" />
      <div className={styles.orbRight} aria-hidden="true" />

      <div className="container">
        <div className={styles.heroGrid}>

          {/* ── Col 1 → RIGHT in RTL — copy ─────────────────────── */}
          <CopyBlock />

          {/* ── Col 2 → LEFT in RTL — centered glass clock card ─── */}
          <div className={styles.clockColumn}>
            <div className={styles.clockPanel}>
              <HeroEmbeddedClock
                ianaTimezone={ianaTimezone}
                cityNameAr={safeCityName}
                countryNameAr={safeCountryName}
              />
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}