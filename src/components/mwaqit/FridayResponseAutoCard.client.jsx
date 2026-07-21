'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import AutoLocationPrayerCard from './AutoLocationPrayerCard.client';
import styles from './AutoLocationPrayerCard.module.css';

export default function FridayResponseAutoCard() {
  return (
    <AutoLocationPrayerCard factType="friday" fallback={null}>
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
              <a href="#friday-search-title" className={styles.changeLink}>تغيير المدينة</a>
            </div>

            <span className={styles.valueLabel}>
              {facts.isFridayToday ? 'ساعة الاستجابة اليوم تبدأ' : 'ساعة الاستجابة القادمة تبدأ'}
            </span>
            <p className={styles.value}>{facts.responseHourStartLabel}</p>

            {facts.isLiveNow ? (
              <>
                <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  <Clock size={14} weight="fill" aria-hidden="true" />
                  الساعة جارية الآن
                </span>
                <p className={styles.valueSub}>أنت الآن في آخر ساعة قبل المغرب — تنتهي بأذانه عند {facts.fridayMaghribLabel}.</p>
              </>
            ) : (
              <>
                <span className={`${styles.livePill} ${styles['livePill--upcoming']}`}>
                  {facts.isFridayToday ? 'لاحقاً اليوم' : 'الجمعة القادمة'}
                </span>
                <p className={styles.valueSub}>تمتد حتى أذان المغرب عند {facts.fridayMaghribLabel}.</p>
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
