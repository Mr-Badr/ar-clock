"use client";

import { useEffect, useMemo, useState } from 'react';

import { BirthInputBlock, ProgressCard, resolveBirthInput, ResultState } from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildAgeSnapshot, formatAgeNumber } from '@/lib/calculators/age';

function getLocalIsoFromClock(now) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLocalMidnightTime(isoDate) {
  const [year, month, day] = String(isoDate).split('-').map(Number);
  if (!year || !month || !day) return 0;
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

export default function AgeCountdownCalculator() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const normalized = useMemo(
    () => resolveBirthInput(calendar, birthIso, birthHijri),
    [birthIso, birthHijri, calendar],
  );
  const result = useMemo(() => {
    if (!normalized.isValid) return normalized;
    return buildAgeSnapshot({
      birthDateIso: normalized.iso,
      targetDateIso: getLocalIsoFromClock(now),
    });
  }, [normalized, now]);

  const countdown = useMemo(() => {
    if (!result?.isValid) return null;
    const midnight = getLocalMidnightTime(result.nextBirthday.iso);
    const remainingMs = Math.max(0, midnight - now.getTime());
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs / (60 * 60 * 1000)) % 24);
    const minutes = Math.floor((remainingMs / (60 * 1000)) % 60);
    const seconds = Math.floor((remainingMs / 1000) % 60);

    return { days, hours, minutes, seconds };
  }, [now, result]);

  return (
    <div className="calc-app age-standalone-tool">
      <Card className="calc-surface-card calc-app-panel">
        <CardHeader>
          <CardTitle className="calc-card-title">أدخل تاريخ الميلاد</CardTitle>
        </CardHeader>
        <CardContent className="calc-form-grid">
          <BirthInputBlock
            calendar={calendar}
            onCalendarChange={setCalendar}
            gregorianValue={birthIso}
            onGregorianChange={setBirthIso}
            hijriValue={birthHijri}
            onHijriChange={setBirthHijri}
          />
        </CardContent>
      </Card>

      <ResultState result={result} />

      {result?.isValid && countdown ? (
        <>
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">عداد عيد الميلاد القادم</CardTitle>
            </CardHeader>
            <CardContent aria-live="polite" aria-atomic="true">
              <div className="age-countdown-timer">
                <div className="age-countdown-unit">
                  <span className="age-countdown-unit__num">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="age-countdown-unit__label">يوم</span>
                </div>
                <span className="age-countdown-unit__colon" aria-hidden="true">:</span>
                <div className="age-countdown-unit">
                  <span className="age-countdown-unit__num">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="age-countdown-unit__label">ساعة</span>
                </div>
                <span className="age-countdown-unit__colon" aria-hidden="true">:</span>
                <div className="age-countdown-unit">
                  <span className="age-countdown-unit__num">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="age-countdown-unit__label">دقيقة</span>
                </div>
                <span className="age-countdown-unit__colon" aria-hidden="true">:</span>
                <div className="age-countdown-unit">
                  <span className="age-countdown-unit__num">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="age-countdown-unit__label">ثانية</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProgressCard
            title="التقدم من عيد الميلاد الأخير إلى القادم"
            value={result.birthdayProgress.progressPercent}
            note={`عيدك القادم سيكون يوم ${result.nextBirthday.weekday} الموافق ${result.nextBirthday.label} حسب تاريخ جهازك الحالي.`}
          />
        </>
      ) : null}
    </div>
  );
}
