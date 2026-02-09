'use client';

import { useState, useEffect } from 'react';
import { TimeEngine } from '@/lib/time-engine';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import FullscreenClock from '@/components/clocks/fullscreen-clock';

export default function MainClock({ timezone, settings: propSettings, cityOverride = null, compact = false, hideFullscreenButton = false }) {
  const [time, setTime] = useState(null);
  const [activeTimezone, setActiveTimezone] = useState(timezone);
  const [settings, setSettings] = useState(propSettings || DEFAULT_SETTINGS);

  // Sync settings when props change (for pages that still provide them)
  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
    }
  }, [propSettings]);

  // Real-time settings sync via custom event
  useEffect(() => {
    const handleGlobalSettingsChange = (e) => {
      setSettings(e.detail);
    };
    window.addEventListener('vclock_settings_changed', handleGlobalSettingsChange);
    return () => window.removeEventListener('vclock_settings_changed', handleGlobalSettingsChange);
  }, []);

  useEffect(() => {
    // Client-side timezone detection
    if (!activeTimezone) {
      const savedTz = typeof window !== 'undefined' ? localStorage.getItem('vclock_user_timezone') : null;
      const finalTz = savedTz || Intl.DateTimeFormat().resolvedOptions().timeZone;
      setActiveTimezone(finalTz);
    }
  }, [timezone, activeTimezone]);

  useEffect(() => {
    if (!activeTimezone) return;

    const updateTime = () => {
      const now = TimeEngine.getCurrentTimeInZone(activeTimezone);
      setTime(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [activeTimezone]);

  // Use the activeTimezone for formatted values
  const currentTz = activeTimezone || timezone;

  // Calculate formatted values only if time exists to avoid errors
  const formattedTime = time ? TimeEngine.formatTime(time, settings.is24Hour, settings.useArabicNumerals) : '';
  const formattedDate = time ? TimeEngine.formatDate(time, settings.useArabicNumerals) : '';

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Compact mode for dashboard
  if (compact) {
     return (
        <div className="text-center" style={{ color: settings.clockColor }}>
           <div className={`text-5xl font-bold mb-2 ${settings.useDigitalFont ? 'font-mono' : 'font-sans'}`}>
              {time ? formattedTime : '--:--'}
           </div>
           <div className="text-lg text-foreground-muted">
              {time && settings.showDate && formattedDate}
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
        className={`text-7xl md:text-9xl lg:text-[10rem] font-bold mb-6 tracking-wider ${
          settings.useDigitalFont
            ? 'font-mono'
            : 'font-sans'
        }`}
        style={{
          color: settings.clockColor,
          textShadow: `0 0 30px ${settings.clockColor}40`
        }}
      >
        {time ? formattedTime : <span className="opacity-50">--:--:--</span>}
      </div>

      <div className="text-xl md:text-3xl text-foreground-muted tracking-wide h-8">
        {time && settings.showDate && formattedDate}
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
      <div
        className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-8 relative rounded-3xl overflow-hidden"
        style={{
          color: 'hsl(var(--foreground))',
        }}
      >
        <ClockDisplay />
      </div>
    </FullscreenClock>
  );
}
