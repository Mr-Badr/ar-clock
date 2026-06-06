import type { ReactNode } from 'react';
import styles from './DateStatCard.module.css';

interface DateStatCardProps {
  label:   string;
  value:   string | number;
  icon?:   ReactNode;
  accent?: boolean;
}

export function DateStatCard({ label, value, icon, accent }: DateStatCardProps) {
  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">{icon}</div>
      )}
      <div className={`${styles.value} ${accent ? styles.accentValue : ''}`}>
        {value}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
