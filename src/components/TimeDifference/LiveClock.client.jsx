'use client';
import React, { useState, useEffect } from 'react';

export default function LiveClock({ timezone, className = "" }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]); // re-run if timezone changes

  if (!time) return <div className={`h-8 w-32 animate-pulse bg-[var(--bg-subtle)] rounded ${className}`}></div>;

  const formatted = new Intl.DateTimeFormat('ar-EG', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(time);

  return (
    <div className={`font-bold tabular-nums tracking-widest ${className}`} aria-live="polite" dir="rtl">
      {formatted}
    </div>
  );
}
