/* MainClock.jsx - Displays the current time and date for a specified timezone, with real-time updates. */
'use client';

import { useState, useEffect } from 'react';
import { TimeEngine } from '@/lib/time-engine';
import FullscreenClock from '@/components/clocks/fullscreen-clock';

const CLOCK_COLOR = '#f63b48';

export default function MainClock({ timezone, cityOverride = null, compact = false, hideFullscreenButton = false }) {
  const [time, setTime] = useState(null);
  const [activeTimezone, setActiveTimezone] = useState(timezone);

  useEffect(() => {
    if (!activeTimezone) {
      const savedTz = localStorage.getItem('vclock_user_timezone');
      const finalTz = savedTz || Intl.DateTimeFormat().resolvedOptions().timeZone;
      setActiveTimezone(finalTz);
    }
  }, [timezone, activeTimezone]);

  useEffect(() => {
    if (!activeTimezone) return;
    const updateTime = () => setTime(TimeEngine.getCurrentTimeInZone(activeTimezone));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activeTimezone]);

  const currentTz = activeTimezone || timezone;
  const formattedTime = time ? TimeEngine.formatTime(time) : '';
  const formattedDate = time ? TimeEngine.formatDate(time) : '';

  if (compact) {
    return (
      <div className="text-center" style={{ color: CLOCK_COLOR }}>
        <div className="text-5xl font-bold mb-2 font-mono">
          {time ? formattedTime : '--:--'}
        </div>
        <div className="text-lg text-foreground-muted">
          {time && formattedDate}
        </div>
      </div>
    );
  }

  const ClockDisplay = ({ customClass = "" }) => (
    <div className={`text-center animate-fade-in ${customClass}`}>
      <h1 className="text-sm md:text-lg mb-8 text-foreground-muted tracking-wider">
        {cityOverride ? `${cityOverride.name} - ${cityOverride.country}` : 'الوقت الآن'}
      </h1>

      <div
        className="text-7xl md:text-9xl lg:text-[10rem] font-bold mb-6 tracking-wider font-mono"
        style={{
          color: CLOCK_COLOR,
          textShadow: `0 0 30px ${CLOCK_COLOR}40`,
        }}
      >
        {time ? formattedTime : <span className="opacity-50">--:--:--</span>}
      </div>

      <div className="text-xl md:text-3xl text-foreground-muted tracking-wide h-8">
        {time && formattedDate}
      </div>

      <div className="mt-8 text-foreground-muted h-6">
        {time && TimeEngine.getTimezoneOffset(currentTz)}
      </div>
    </div>
  );

  return (
    <FullscreenClock
      showExpandButton={!hideFullscreenButton}
      overlayContent={<ClockDisplay customClass="scale-110 md:scale-125" />}
    >
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-8 relative rounded-3xl overflow-hidden">
        <ClockDisplay />
      </div>
    </FullscreenClock>
  );
}