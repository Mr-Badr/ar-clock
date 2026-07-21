'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import AutoLocationPrayerCard from './AutoLocationPrayerCard.client';
import styles from './AutoLocationPrayerCard.module.css';

export default function ProhibitedAutoCard() {
  return (
    <AutoLocationPrayerCard factType="prohibited" fallback={null}>
      {({ city, facts }) => {
        const cityName = city.city_name_ar || city.city_name_en;
        const cityHref = `/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`;
        const active = facts.activeWindow;

        return (
          <div className={styles.card}>
            <div className={styles.header}>
              <span className={styles.location}>
                <CountryFlag code={city.country_code} />
                {cityName}
              </span>
              <span className={styles.autoBadge}>موقعك تلقائياً</span>
              <a href="#prohibited-search-title" className={styles.changeLink}>تغيير المدينة</a>
            </div>

            {active ? (
              <>
                <span className={styles.valueLabel}>وقت النهي الحالي ينتهي</span>
                <p className={styles.value}>{active.endLabel}</p>
                <span className={`${styles.livePill} ${styles['livePill--warning']}`}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  <AlertTriangle size={14} weight="fill" aria-hidden="true" />
                  أنت الآن في وقت نهي: {active.title}
                </span>
                <p className={styles.valueSub}>تجنّب صلاة النافلة حتى ينتهي هذا الوقت.</p>
              </>
            ) : (
              <>
                <span className={styles.valueLabel}>الحالة الآن</span>
                <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                  <CheckCircle2 size={14} weight="fill" aria-hidden="true" />
                  لا يوجد وقت نهي الآن
                </span>
                <p className={styles.valueSub}>يمكنك الصلاة بلا كراهة وقت. أوقات النهي الثلاثة اليوم:</p>
              </>
            )}

            <div className={styles.windowsList}>
              {facts.windows.map((w) => (
                <div key={w.key} className={`${styles.windowRow} ${w.isActiveNow ? styles['windowRow--active'] : ''}`}>
                  <span className={styles.windowRowTitle}>{w.title}</span>
                  <span className={styles.windowRowTime}>{w.startLabel} – {w.endLabel}</span>
                </div>
              ))}
            </div>

            <Link href={cityHref} className={styles.footerLink}>
              مواقيت الصلاة الكاملة في {cityName} ←
            </Link>
          </div>
        );
      }}
    </AutoLocationPrayerCard>
  );
}
