// TimeCinematicHero.jsx — Server Component (no 'use client')
//
// Renders a clean two-column RTL grid:
//   col-1 (RTL RIGHT) — CopyBlock: badge, title, description, CTA
//   col-2 (RTL LEFT)  — HeroEmbeddedClock inside a tokenized panel
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
    <section className={styles.heroRoot} dir="rtl" aria-labelledby="home-hero-title">

      <div className="container">
        <div className={styles.heroGrid}>

          {/* ── Col 1 → RIGHT in RTL — copy ─────────────────────── */}
          <CopyBlock titleId="home-hero-title" />

          {/* ── Col 2 → LEFT in RTL — centered clock panel ─── */}
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

    </section>
  );
}
