'use client';

/**
 * Lean, self-contained countdown ticker for /embed/countdown/[slug] — NOT
 * the full CountdownTicker used on real holiday pages (that one carries
 * fullscreen/wake-lock/WhatsApp-share features that make no sense inside a
 * small third-party iframe). Ticks client-side from the server-computed
 * initial values so there's no flash/mismatch on mount.
 */

import { useEffect, useState } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function CountdownEmbed({ eventName, targetIso, initialRemaining, fullPageUrl }) {
  const [remaining, setRemaining] = useState(initialRemaining);

  useEffect(() => {
    const targetMs = new Date(targetIso).getTime();
    const tick = () => {
      const total = targetMs - Date.now();
      if (total <= 0) {
        setRemaining({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setRemaining({
        total,
        days: Math.floor(total / 86_400_000),
        hours: Math.floor((total % 86_400_000) / 3_600_000),
        minutes: Math.floor((total % 3_600_000) / 60_000),
        seconds: Math.floor((total % 60_000) / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const units = [
    { value: remaining.days, label: 'يوم' },
    { value: remaining.hours, label: 'ساعة' },
    { value: remaining.minutes, label: 'دقيقة' },
    { value: remaining.seconds, label: 'ثانية' },
  ];

  return (
    <main className="embed-countdown-widget" dir="rtl" lang="ar">
      <p className="embed-countdown-widget__title">كم باقي على {eventName}؟</p>
      <div className="embed-countdown-widget__units">
        {units.map((unit) => (
          <div key={unit.label} className="embed-countdown-widget__unit">
            <span className="embed-countdown-widget__value tabular-nums">{pad(unit.value)}</span>
            <span className="embed-countdown-widget__label">{unit.label}</span>
          </div>
        ))}
      </div>
      <a
        className="embed-countdown-widget__attribution"
        href={fullPageUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {eventName} من ميقاتنا
      </a>
    </main>
  );
}
