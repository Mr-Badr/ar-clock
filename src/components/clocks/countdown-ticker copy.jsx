/* Old countdown ticker */
'use client';

import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/holidays-engine';
import FullscreenClock from '@/components/clocks/fullscreen-clock';

const WIDGET_SIZES = [
  { label: '475*250 (عرض متوسط)', width: '475', height: '250' },
  { label: '200*200 (مربع صغير)', width: '200', height: '200' },
  { label: '200*90 (شريط صغير)', width: '200', height: '90' },
  { label: '600*300 (مستطيل كبير)', width: '600', height: '300' },
  { label: '300*250 (صغير متوازن)', width: '300', height: '250' },
];


export default function CountdownTicker({ holiday, targetDate, initialTimeRemaining, isEmbedInitial }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [isEmbedMode, setIsEmbedMode] = useState(isEmbedInitial);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('embed') === 'true') setIsEmbedMode(true);
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate);
    const timer = setInterval(() => setTimeRemaining(getTimeRemaining(target)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('ar-SA-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });





  const CountdownUnits = ({ sizeClass, labelClass }) => (
    <>
      {[
        { value: timeRemaining.days, label: 'يوم' },
        { value: timeRemaining.hours, label: 'ساعة' },
        { value: timeRemaining.minutes, label: 'دقيقة' },
        { value: timeRemaining.seconds, label: 'ثانية' },
      ].map(({ value, label }) => (
        <div key={label} className={`flex flex-col items-center ${isEmbedMode ? 'min-w-[40px] md:min-w-[100px]' : 'min-w-[70px]'}`}>
          <span className={`${sizeClass} font-bold font-mono whitespace-nowrap leading-none transition-all text-clock [text-shadow:var(--clock-digit-glow,_none)]`}>
            {value}
          </span>
          <span className={`${labelClass} text-muted uppercase tracking-tighter md:tracking-widest mt-0.5`}>
            {label}
          </span>
        </div>
      ))}
    </>
  );

  return (
    <div className={`${isEmbedMode ? 'h-full w-full overflow-hidden' : ''}`}>
      <div className={`${isEmbedMode ? 'h-full w-full overflow-hidden flex items-center justify-center' : 'relative mb-16'}`}>
        {!isEmbedMode && (
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-accent mb-2">{holiday.title}</h1>
            <div className="h-1 w-24 bg-accent-soft mx-auto rounded-full" />
          </div>
        )}

        <FullscreenClock
          showExpandButton={!isEmbedMode}
          overlayContent={
            <div className="text-center" dir="rtl">
              <h2 className="text-2xl md:text-5xl font-bold mb-12 text-accent">{holiday.name}</h2>
              {timeRemaining && (
                <div className="flex flex-wrap justify-center gap-6 md:gap-16 mb-12">
                  <CountdownUnits sizeClass="text-6xl md:text-9xl" labelClass="text-lg md:text-2xl mt-2" />
                </div>
              )}
              <div className="mt-8 text-xl md:text-3xl text-muted font-medium bg-surface-3/20 inline-block px-8 py-3 rounded-full border border-border">
                {formattedDate}
              </div>
            </div>
          }
        >
          <div className={`flex flex-col items-center justify-center bg-base border-border text-center relative overflow-hidden transition-all duration-500
            ${isEmbedMode ? 'w-full h-full p-2 border-0 shadow-none' : 'p-8 md:p-16 border rounded-3xl min-h-[400px] shadow-xl'}`}>

            {!isEmbedMode && <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent-soft blur-3xl rounded-full" />}
            {!isEmbedMode && <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-soft blur-3xl rounded-full" />}

            {isEmbedMode && (
              <h2 className="text-lg md:text-3xl font-bold text-accent truncate max-w-[95vw] mb-1 md:mb-2">
                {holiday.title}
              </h2>
            )}

            <div className={`flex flex-wrap justify-center items-center ${isEmbedMode ? 'gap-2 md:gap-6' : 'gap-6 md:gap-16'} relative z-10 w-full flex-1 min-h-0`}>
              <CountdownUnits
                sizeClass={isEmbedMode ? 'text-4xl md:text-8xl' : 'text-5xl md:text-8xl'}
                labelClass={isEmbedMode ? 'text-[10px] md:text-base' : 'text-xs md:text-lg'}
              />
            </div>

            <div className={`${isEmbedMode ? 'mt-1 md:mt-4 text-[10px] md:text-sm px-3 py-0.5' : 'mt-8 text-lg md:text-xl px-4 py-1.5'} text-muted font-medium bg-surface-3/20 inline-block rounded-full border border-border shrink-0`}>
              {formattedDate}
            </div>
          </div>
        </FullscreenClock>
      </div>

    </div>
  );
}