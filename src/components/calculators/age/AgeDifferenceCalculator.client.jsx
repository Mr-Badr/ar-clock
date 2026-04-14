"use client";

import { useMemo, useState } from 'react';

import { BirthInputBlock, MetricGrid, resolveBirthInput, ResultState } from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildAgeDifference, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

export default function AgeDifferenceCalculator() {
  const [firstName, setFirstName] = useState('أحمد');
  const [secondName, setSecondName] = useState('سارة');
  const [firstCalendar, setFirstCalendar] = useState('gregorian');
  const [secondCalendar, setSecondCalendar] = useState('gregorian');
  const [firstBirthIso, setFirstBirthIso] = useState('1985-04-08');
  const [secondBirthIso, setSecondBirthIso] = useState('1990-06-16');
  const [firstHijri, setFirstHijri] = useState({ day: '', month: '', year: '' });
  const [secondHijri, setSecondHijri] = useState({ day: '', month: '', year: '' });

  const firstInput = useMemo(
    () => resolveBirthInput(firstCalendar, firstBirthIso, firstHijri),
    [firstBirthIso, firstCalendar, firstHijri],
  );
  const secondInput = useMemo(
    () => resolveBirthInput(secondCalendar, secondBirthIso, secondHijri),
    [secondBirthIso, secondCalendar, secondHijri],
  );

  const result = useMemo(() => {
    if (!firstInput.isValid) return firstInput;
    if (!secondInput.isValid) return secondInput;

    return buildAgeDifference({
      firstBirthDateIso: firstInput.iso,
      secondBirthDateIso: secondInput.iso,
      targetDateIso: getTodayIso(),
      firstName: firstName || 'الشخص الأول',
      secondName: secondName || 'الشخص الثاني',
    });
  }, [firstInput, secondInput, firstName, secondName]);

  return (
    <div className="calc-app">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">بيانات الشخصين</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-grid-2">
              <div className="calc-field">
                <label className="calc-label">اسم الشخص الأول</label>
                <input className="input calc-input" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </div>
              <div className="calc-field">
                <label className="calc-label">اسم الشخص الثاني</label>
                <input className="input calc-input" value={secondName} onChange={(event) => setSecondName(event.target.value)} />
              </div>
            </div>

            <BirthInputBlock
              calendar={firstCalendar}
              onCalendarChange={setFirstCalendar}
              gregorianValue={firstBirthIso}
              onGregorianChange={setFirstBirthIso}
              hijriValue={firstHijri}
              onHijriChange={setFirstHijri}
              label="تاريخ ميلاد الشخص الأول"
            />

            <BirthInputBlock
              calendar={secondCalendar}
              onCalendarChange={setSecondCalendar}
              gregorianValue={secondBirthIso}
              onGregorianChange={setSecondBirthIso}
              hijriValue={secondHijri}
              onHijriChange={setSecondHijri}
              label="تاريخ ميلاد الشخص الثاني"
            />
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <ResultState result={result} />

          {result?.isValid ? (
            <>
              <MetricGrid
                items={[
                  {
                    label: 'فرق العمر',
                    value: result.gapLabel,
                    note: `${formatAgeNumber(result.totalDays, { maximumFractionDigits: 0 })} يوم`,
                  },
                  {
                    label: 'الأكبر سناً',
                    value: result.older.name,
                    note: `${result.younger.name} أصغر منه بهذا الفارق`,
                  },
                  {
                    label: 'الجيل',
                    value: result.sharedGenerationLabel,
                    note: result.sameGeneration ? 'كلاهما ضمن الجيل نفسه' : 'ينتميان إلى جيلين مختلفين',
                  },
                ]}
              />

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">العمر الحالي لكل شخص</CardTitle>
                </CardHeader>
                <CardContent className="calc-grid-2">
                  <div className="calc-metric-card card-nested">
                    <div className="calc-metric-card__label">{firstName || 'الشخص الأول'}</div>
                    <div className="calc-metric-card__value">{result.firstAge.ageLabel}</div>
                    <div className="calc-metric-card__note">{result.firstAge.birthDateLabel}</div>
                  </div>
                  <div className="calc-metric-card card-nested">
                    <div className="calc-metric-card__label">{secondName || 'الشخص الثاني'}</div>
                    <div className="calc-metric-card__value">{result.secondAge.ageLabel}</div>
                    <div className="calc-metric-card__note">{result.secondAge.birthDateLabel}</div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
