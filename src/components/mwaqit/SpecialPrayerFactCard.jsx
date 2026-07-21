// Server-rendered equivalent of the *AutoCard.client.jsx components, used on
// the per-city/per-country special-prayer-time pages (e.g.
// /mwaqit-al-salat/last-third-of-night/[country]/[city]). Unlike the auto-detect
// cards on the global topic pages, the city here comes from the URL — no
// client-side location detection needed, so this renders fully on the server
// for instant paint and full SEO visibility. Body copy mirrors the matching
// *AutoCard.client.jsx exactly so the two page types feel like one product.
import Link from 'next/link';
import { Moon, Sun, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import styles from './AutoLocationPrayerCard.module.css';

export default function SpecialPrayerFactCard({ factKey, facts, cityNameAr, countryCode, cityHref }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.location}>
          <CountryFlag code={countryCode} />
          {cityNameAr}
        </span>
      </div>

      {factKey === 'last-third' ? (
        <>
          <span className={styles.valueLabel}>الثلث الأخير من الليل يبدأ</span>
          <p className={styles.value}>{facts.lastThirdStartLabel}</p>
          {facts.isCurrentlyLastThird ? (
            <>
              <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                <span className={styles.liveDot} aria-hidden="true" />
                <Moon size={14} aria-hidden="true" />
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
        </>
      ) : null}

      {factKey === 'duha' ? (
        facts.isDuhaNow ? (
          <>
            <span className={styles.valueLabel}>وقت الضحى ينتهي</span>
            <p className={styles.value}>{facts.duhaEndLabel}</p>
            <span className={`${styles.livePill} ${styles['livePill--active']}`}>
              <span className={styles.liveDot} aria-hidden="true" />
              <Sun size={14} aria-hidden="true" />
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
        )
      ) : null}

      {factKey === 'friday' ? (
        <>
          <span className={styles.valueLabel}>
            {facts.isFridayToday ? 'ساعة الاستجابة اليوم تبدأ' : 'ساعة الاستجابة القادمة تبدأ'}
          </span>
          <p className={styles.value}>{facts.responseHourStartLabel}</p>
          {facts.isLiveNow ? (
            <>
              <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                <span className={styles.liveDot} aria-hidden="true" />
                <Clock size={14} aria-hidden="true" />
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
        </>
      ) : null}

      {factKey === 'prohibited' ? (
        <>
          {facts.activeWindow ? (
            <>
              <span className={styles.valueLabel}>وقت النهي الحالي ينتهي</span>
              <p className={styles.value}>{facts.activeWindow.endLabel}</p>
              <span className={`${styles.livePill} ${styles['livePill--warning']}`}>
                <span className={styles.liveDot} aria-hidden="true" />
                <AlertTriangle size={14} aria-hidden="true" />
                أنت الآن في وقت نهي: {facts.activeWindow.title}
              </span>
              <p className={styles.valueSub}>تجنّب صلاة النافلة حتى ينتهي هذا الوقت.</p>
            </>
          ) : (
            <>
              <span className={styles.valueLabel}>الحالة الآن</span>
              <span className={`${styles.livePill} ${styles['livePill--active']}`}>
                <CheckCircle2 size={14} aria-hidden="true" />
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
        </>
      ) : null}

      <Link href={cityHref} className={styles.footerLink}>
        مواقيت الصلاة الكاملة في {cityNameAr} ←
      </Link>
    </div>
  );
}
