'use client';
import React from 'react';

/**
 * SmartBadge — shows a contextual label based on the hour difference.
 * 0-1h: فرق بسيط (green)
 * 2-4h: فرق متوسط (yellow/warning)
 * 5+h:  فرق كبير (red/danger)
 */
export default function SmartBadge({ totalMinutes = 0 }) {
  const absHours = Math.abs(totalMinutes) / 60;

  let label, colorClass, dotClass;

  if (absHours <= 1) {
    label = 'فرق بسيط';
    colorClass = 'bg-[var(--success-soft)] border-[var(--success-border)] text-[var(--success)]';
    dotClass = 'bg-[var(--success)]';
  } else if (absHours <= 4) {
    label = 'فرق متوسط';
    colorClass = 'bg-[var(--warning-soft)] border-[var(--warning-border)] text-[var(--warning)]';
    dotClass = 'bg-[var(--warning)]';
  } else {
    label = 'فرق كبير';
    colorClass = 'bg-[var(--danger-soft)] border-[var(--danger-border)] text-[var(--danger)]';
    dotClass = 'bg-[var(--danger)]';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClass}`} />
      {label}
    </span>
  );
}
