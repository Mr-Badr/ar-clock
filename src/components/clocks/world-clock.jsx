'use client';

import { useState, useEffect } from 'react';
import { TimeEngine } from '@/lib/time-engine';
import { Trash2, Monitor, Minimize2 } from 'lucide-react';

export default function WorldClock({ city, onRemove, onSetMain, settings, referenceTime }) {
  const [time, setTime] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = TimeEngine.getCurrentTimeInZone(city.timezone);
      setTime(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [city.timezone]);

  const handleFullscreenToggle = () => {
    setIsFullscreen(prev => !prev);
  };

  if (!time) {
    return null;
  }

  const formattedTime = TimeEngine.formatTime(time, settings.is24Hour, settings.useArabicNumerals);
  const formattedDate = TimeEngine.formatDate(time, settings.useArabicNumerals);
  const relativeDay = TimeEngine.getRelativeDay(time, referenceTime);
  const offset = TimeEngine.getTimezoneOffset(city.timezone);

  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center z-[100]"
        dir="rtl"
      >
        <button
          onClick={handleFullscreenToggle}
          className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
          title="تصغير"
        >
          <Minimize2 className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-sm md:text-lg mb-8 text-foreground-muted tracking-wider">
            {city.name} - {city.country}
          </h1>

          <div
            className="text-7xl md:text-9xl font-bold mb-6 tracking-wider font-mono"
            style={{
              color: settings.clockColor,
              textShadow: `0 0 20px ${settings.clockColor}40`
            }}
          >
            {formattedTime}
          </div>

          <div className="text-xl md:text-3xl text-foreground-muted tracking-wide mb-4">
            {formattedDate}
          </div>

          <div className="text-foreground-muted">
            {offset}
          </div>
        </div>
      </div>
    );
  }

  // Normal card view
  return (
    <div className="bg-surface/50 border border-border rounded-lg p-6 hover:border-border-strong transition-all backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-primary">{city.name}</h3>
          <p className="text-sm text-foreground-muted">{city.country}</p>
        </div>
        <div className="flex gap-2">
          {/* View Fullscreen */}
          <button
            onClick={handleFullscreenToggle}
            className="p-2 hover:bg-secondary rounded transition-colors text-foreground-muted hover:text-foreground"
            title="عرض في وضع ملء الشاشة"
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* Set as Main */}
          {onSetMain && (
            <button
              onClick={() => onSetMain(city)}
              className="p-2 hover:bg-secondary rounded transition-colors text-foreground-muted hover:text-foreground"
              title="تعيين كساعة رئيسية"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </button>
          )}

          {onRemove && (
            <button
              onClick={() => onRemove(city)}
              className="p-2 hover:bg-error/10 text-error rounded transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div
        className="text-5xl font-mono font-bold mb-2"
        style={{ color: settings.clockColor }}
      >
        {formattedTime}
      </div>

      <div className="flex justify-between text-sm text-foreground-muted">
        <span>{relativeDay}</span>
        <span>{offset}</span>
      </div>
    </div>
  );
}
