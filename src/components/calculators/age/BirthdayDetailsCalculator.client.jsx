"use client";

import { useMemo, useState } from 'react';

import {
  BirthdayHeadline,
  BirthInputBlock,
  CheckListCard,
  MetricGrid,
  resolveBirthInput,
  ResultState,
} from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildBirthdayProfile, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

export default function BirthdayDetailsCalculator() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });

  const normalized = useMemo(
    () => resolveBirthInput(calendar, birthIso, birthHijri),
    [birthIso, birthHijri, calendar],
  );
  const result = useMemo(() => {
    if (!normalized.isValid) return normalized;
    return buildBirthdayProfile({ birthDateIso: normalized.iso, targetDateIso: getTodayIso() });
  }, [normalized]);

  return (
    <div className="calc-app">
      <div className="calc-app-grid age-app-grid">
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

        <div className="calc-results-panel">
          <ResultState result={result} />

          {result?.isValid ? (
            <>
              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">بطاقة يوم الميلاد</CardTitle>
                </CardHeader>
                <CardContent>
                  <BirthdayHeadline result={result} />
                </CardContent>
              </Card>

              <MetricGrid
                items={[
                  {
                    label: 'يوم السنة',
                    value: `${formatAgeNumber(result.personal.dayOfYear, { maximumFractionDigits: 0 })}`,
                    note: 'ترتيب يوم ميلادك داخل السنة الميلادية.',
                  },
                  {
                    label: 'جيلك',
                    value: result.personal.generation.label,
                    note: result.personal.generation.note,
                  },
                  {
                    label: 'نصف عيد الميلاد',
                    value: result.personal.halfBirthdayLabel,
                    note: result.personal.halfBirthdayWeekday,
                  },
                ]}
              />

              <CheckListCard
                title="حقائق سريعة عن تاريخك"
                items={[
                  `فصل الميلاد: ${result.personal.season}`,
                  `تاريخك الهجري: ${result.hijri.birth?.formatted?.ar || 'غير متاح'}`,
                  result.isWeekend ? 'وُلدت في عطلة نهاية الأسبوع.' : 'يوم الميلاد كان ضمن أيام الأسبوع المعتادة.',
                  result.bornInLeapYear ? 'سنة الميلاد كانت سنة كبيسة.' : 'سنة الميلاد لم تكن كبيسة.',
                ]}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
