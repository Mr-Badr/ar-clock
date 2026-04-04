// TimeCinematicHero.jsx — Server Component (no 'use client')
//
// Renders two things:
//   1. HeroVideoPanel (client) — video, clock, refs, panel placement.
//      CopyBlock is passed as children so it crosses the RSC boundary
//      as a server-rendered subtree (never bundled in the client JS).
//
//   2. The mobile section — purely static, server-rendered HTML.

import styles from './TimeCinematicHero.module.css';
import HeroVideoPanel from './HeroVideoPanel';
import CopyBlock from './CopyBlock';

export default function TimeCinematicHero({
  ianaTimezone,
  cityNameAr,
  countryNameAr,
}) {
  const safeCityName = cityNameAr || 'توقيتك المحلي';
  const safeCountryName = safeCityName === 'توقيتك المحلي' ? '' : (countryNameAr || '');

  return (
    <main className='mb-16 lg:mb-24' dir="rtl">
      {/* ── Hero (video + clock panel + desktop copy) ── */}
      <HeroVideoPanel
        ianaTimezone={ianaTimezone}
        cityNameAr={safeCityName}
        countryNameAr={safeCountryName}
      >
        {/* Passed as children → stays server-rendered inside the client panel */}
        <CopyBlock />
      </HeroVideoPanel>

      {/* ── Mobile copy — static, no JS needed ── */}
      <section className={styles.heroMobileContent} dir="rtl">
        <div className="container">
          <CopyBlock extraClass={styles.copyMobileCenter} />
        </div>
      </section>
    </main>
  );
}
