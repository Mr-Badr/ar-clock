'use client';

import Link from 'next/link';
import { Moon } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import AutoLocationPrayerCard from './AutoLocationPrayerCard.client';
import styles from './AutoLocationPrayerCard.module.css';

export default function LastThirdAutoCard() {
  return (
    <AutoLocationPrayerCard factType="last-third" fallback={null}>
      {({ city, facts }) => {
        const cityName = city.city_name_ar || city.city_name_en;
        const cityHref = `/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`;

        return (
          <div className={styles.card}>
            <div className={styles.header}>
              <span className={styles.location}>
                <CountryFlag code={city.country_code} />
                {cityName}
              </span>
              <span className={styles.autoBadge}>موقعك تلقائياً</span>
              <a href="#night-search-title" className={styles.changeLink}>تغيير المدينة</a>
            </div>

            <span className={styles.valueLabel}>الثلث الأخير من الليل يبدأ</span>
            <p className={styles.value}>{facts.lastThirdStartLabel}</p>

            {facts.isCurrentlyLastThird ? (
              <>
                <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  <Moon size={14} weight="fill" aria-hidden="true" />
                  أنت الآن ضمن الثلث الأخير
                </span>
                <p className={styles.valueSub}>يمتد حتى أذان الفجر عند {facts.fajrLabel} — هذا وقت التهجد والدعاء.</p>
              </>
            ) : (
              <>
                <span className={`${styles.livePill} ${styles['livePill--upcoming']}`}>قادم الليلة</span>
                <p className={styles.valueSub}>
                  الليلة من المغرب {facts.maghribLabel} حتى الفجر {facts.fajrLabel}، ومنتصف الليل الشرعي عند {facts.islamicMidnightLabel}.
                </p>
              </>
            )}

            <Link href={cityHref} className={styles.footerLink}>
              مواقيت الصلاة الكاملة في {cityName} ←
            </Link>
          </div>
        );
      }}
    </AutoLocationPrayerCard>
  );
}
