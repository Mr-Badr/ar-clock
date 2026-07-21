// Server-rendered answer card for /mwaqit-al-salat/white-days.
//
// Unlike the other special prayer pages (last-third-of-night, duha,
// friday-response-hour, prohibited-prayer-times), white days are a Hijri
// calendar event — the same dates for every visitor regardless of city or
// timezone, so there's no location to detect and nothing to fetch client-side.
// This renders fully on the server for instant paint and perfect SEO, reusing
// the same visual card language as the auto-location cards for consistency.
import Link from 'next/link';
import { CalendarCheck, Moon } from 'lucide-react';
import styles from './AutoLocationPrayerCard.module.css';

export default function WhiteDaysCard({ whiteDays, startLabel, endLabel }) {
  const { isCurrentlyWhiteDays, currentHijriDay, hijriMonthName, hijriYear, daysRemaining } = whiteDays;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.location}>
          <Moon size={15} aria-hidden="true" />
          {hijriMonthName} {hijriYear} هـ
        </span>
      </div>

      {isCurrentlyWhiteDays ? (
        <>
          <span className={styles.valueLabel}>اليوم يوافق</span>
          <p className={styles.value}>{currentHijriDay}</p>
          <span className={styles.valueUnit}>من {hijriMonthName}</span>
          <span className={`${styles.livePill} ${styles['livePill--active']}`}>
            <span className={styles.liveDot} aria-hidden="true" />
            أنت الآن ضمن أيام البيض
          </span>
          <p className={styles.valueSub}>تنتهي هذه الدفعة يوم {endLabel}.</p>
        </>
      ) : (
        <>
          <span className={styles.valueLabel}>أيام البيض القادمة بعد</span>
          <p className={styles.value}>{daysRemaining}</p>
          <span className={styles.valueUnit}>{daysRemaining === 1 ? 'يوم واحد' : 'يوماً'}</span>
          <span className={`${styles.livePill} ${styles['livePill--upcoming']}`}>
            <CalendarCheck size={14} aria-hidden="true" />
            تبدأ يوم {startLabel}
          </span>
          <p className={styles.valueSub}>13 و14 و15 {hijriMonthName} — حتى {endLabel}.</p>
        </>
      )}

      <Link href="/date/calendar/hijri" className={styles.footerLink}>
        التقويم الهجري الكامل ←
      </Link>
    </div>
  );
}
