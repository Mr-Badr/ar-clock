
'use client';
import { CalendarDays } from 'lucide-react';

import styles from './DatePill.module.css';

export default function DatePill({ dateAr, dateHijri, className }) {
  if (!dateAr && !dateHijri) return null;

  const hasBoth = dateAr && dateHijri;
  const wrapperClassName = [styles.wrap, className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      <span className={styles.desktop}>
        <CalendarDays className={styles.icon} size={16} aria-hidden="true" />
        {dateAr}
        {hasBoth ? <span className={styles.separator}>/</span> : null}
        {dateHijri}
      </span>

      <span className={styles.mobile}>
        {dateAr && <span>{dateAr}</span>}
        {hasBoth && (
          <span className={styles.mobileSeparator}>/</span>
        )}
        {dateHijri && <span>{dateHijri}</span>}
      </span>
    </div>
  );
}
