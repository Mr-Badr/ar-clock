'use client';

import Link from 'next/link';
import { Sun } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import AutoLocationPrayerCard from './AutoLocationPrayerCard.client';
import styles from './AutoLocationPrayerCard.module.css';

export default function DuhaAutoCard() {
  return (
    <AutoLocationPrayerCard factType="duha" fallback={null}>
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
              <a href="#duha-search-title" className={styles.changeLink}>تغيير المدينة</a>
            </div>

            {facts.isDuhaNow ? (
              <>
                <span className={styles.valueLabel}>وقت الضحى ينتهي</span>
                <p className={styles.value}>{facts.duhaEndLabel}</p>
                <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  <Sun size={14} weight="fill" aria-hidden="true" />
                  وقت الضحى الآن
                </span>
                <p className={styles.valueSub}>يمكنك أداء صلاة الضحى الآن، حتى الظهر عند {facts.dhuhrLabel}.</p>
              </>
            ) : (
              <>
                <span className={styles.valueLabel}>وقت الضحى يبدأ</span>
                <p className={styles.value}>{facts.duhaStartLabel}</p>
                <span className={`${styles.livePill} ${styles['livePill--upcoming']}`}>اليوم</span>
                <p className={styles.valueSub}>
                  بعد الشروق {facts.sunriseLabel}، وينتهي قبل الظهر {facts.dhuhrLabel} بنحو 10 دقائق.
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
