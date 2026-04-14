"use client";

import { useEffect, useMemo, useState } from 'react';

import { BirthInputBlock, ProgressCard, resolveBirthInput, ResultState } from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildAgeSnapshot, formatAgeNumber } from '@/lib/calculators/age';

function getTodayIsoFromClock(now) {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
      targetDateIso: getTodayIsoFromClock(now),
    });
  }, [normalized, now]);

  const countdown = useMemo(() => {
    if (!result?.isValid) return null;
    const midnight = new Date(`${result.nextBirthday.iso}T00:00:00Z`).getTime();
    const remainingMs = Math.max(0, midnight - now.getTime());
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs / (60 * 60 * 1000)) % 24);
    const minutes = Math.floor((remainingMs / (60 * 1000)) % 60);
    const seconds = Math.floor((remainingMs / 1000) % 60);

    return { days, hours, minutes, seconds };
  }, [now, result]);

  return (
    <div className="calc-app">
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
            <CardContent>
              <div className="calc-grid-4">
                <div className="calc-metric-card card-nested">
                  <div className="calc-metric-card__label">أيام</div>
                  <div className="calc-metric-card__value">{formatAgeNumber(countdown.days, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="calc-metric-card card-nested">
                  <div className="calc-metric-card__label">ساعات</div>
                  <div className="calc-metric-card__value">{formatAgeNumber(countdown.hours, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="calc-metric-card card-nested">
                  <div className="calc-metric-card__label">دقائق</div>
                  <div className="calc-metric-card__value">{formatAgeNumber(countdown.minutes, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="calc-metric-card card-nested">
                  <div className="calc-metric-card__label">ثوانٍ</div>
                  <div className="calc-metric-card__value">{formatAgeNumber(countdown.seconds, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProgressCard
            title="التقدم من عيد الميلاد الأخير إلى القادم"
            value={result.birthdayProgress.progressPercent}
            note={`عيدك القادم سيكون يوم ${result.nextBirthday.weekday} الموافق ${result.nextBirthday.label}.`}
          />
        </>
      ) : null}
    </div>
  );
}
