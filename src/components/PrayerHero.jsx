'use client';

import React, { useState, useEffect } from 'react';

/**
 * Client component that hydrates a server-calculated snapshot.
 * Keeps the heavy date-math on the server, only runs a simple delta ticker in the browser.
 */
export default function PrayerHero({ nextPrayerName, nextPrayerTimeIso, serverComputedRemainingString }) {
  const [timeLeft, setTimeLeft] = useState(serverComputedRemainingString);

  useEffect(() => {
    const targetDate = new Date(nextPrayerTimeIso).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft('حان الوقت الآن!');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayerTimeIso]);

  return (
    <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden my-6">
      <div className="relative z-10">
        <h2 className="text-xl font-medium mb-2 opacity-90">الصلاة القادمة: {nextPrayerName}</h2>

        {/* ARIA live region for accessibility to announce countdown updates politely */}
        <div aria-live="polite" className="text-5xl md:text-7xl font-bold font-mono tracking-wider tabular-nums">
          <time dateTime={nextPrayerTimeIso}>{timeLeft}</time>
        </div>
      </div>

      {/* Decorative Islamic geometric background hint */}
      <div className="absolute -bottom-10 -right-10 opacity-10 text-9xl">🕌</div>
    </div>
  );
}
