"use client";

import { useMemo, useState } from 'react';

import {
  BirthInputBlock,
  InlineFacts,
  MetricGrid,
  resolveBirthInput,
  ResultState,
} from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildAgeSnapshot, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';
import { HIJRI_MONTHS_INFO } from '@/lib/calculators/age-data';

export default function AgeHijriCalculator() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });

  const normalized = useMemo(
    () => resolveBirthInput(calendar, birthIso, birthHijri),
    [calendar, birthIso, birthHijri],
  );

  const result = useMemo(() => {
    if (!normalized.isValid) return normalized;
    return buildAgeSnapshot({
      birthDateIso: normalized.iso,
      targetDateIso: getTodayIso(),
    });
  }, [normalized]);

  const highlightedMonth = result?.isValid ? result.hijri.birth?.monthNameAr : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل التاريخ الذي تريد مقارنة عمره بين التقويمين</CardTitle>
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
              <MetricGrid
                items={[
                  {
                    label: 'بالميلادي',
                    value: result.ageLabel,
                    note: `${result.birthDateLabel} · ${result.birthWeekday}`,
                  },
                  {
                    label: 'بالهجري تقريباً',
                    value: `${formatAgeNumber(result.hijri.yearsApprox)} سنة`,
                    note: `${result.hijri.birth?.formatted?.ar || 'ضمن النطاق المدعوم'}`,
                  },
                  {
                    label: 'الفرق التراكمي',
                    value: `${formatAgeNumber(result.hijri.yearsApprox - result.years)} سنة`,
                    note: 'يزداد تدريجياً لأن السنة الهجرية أقصر.',
                  },
                ]}
              />

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">عرض مزدوج للتاريخ</CardTitle>
                </CardHeader>
                <CardContent className="calc-grid-2">
                  <div className="calc-metric-card card-nested">
                    <div className="calc-metric-card__label">تاريخ الميلاد الميلادي</div>
                    <div className="calc-metric-card__value">{result.birthDateLabel}</div>
                    <div className="calc-metric-card__note">{result.birthWeekday}</div>
                  </div>
                  <div className="calc-metric-card card-nested">
                    <div className="calc-metric-card__label">تاريخ الميلاد الهجري</div>
                    <div className="calc-metric-card__value">{result.hijri.birth?.formatted?.ar || 'غير متاح'}</div>
                    <div className="calc-metric-card__note">{result.hijri.target?.formatted?.ar ? `اليوم: ${result.hijri.target.formatted.ar}` : 'داخل النطاق المدعوم'}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">نقاط سريعة</CardTitle>
                </CardHeader>
                <CardContent className="calc-breakdown-list">
                  <InlineFacts
                    items={[
                      { label: 'الشهر الهجري', value: result.hijri.birth?.monthNameAr || '—' },
                      { label: 'عيد الميلاد القادم', value: `${formatAgeNumber(result.nextBirthday.daysUntil, { maximumFractionDigits: 0 })} يوم` },
                      { label: 'جيلك', value: result.personal.generation.label },
                    ]}
                  />
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>

      <Card className="calc-surface-card">
        <CardHeader>
          <CardTitle className="calc-card-title">الشهور الهجرية بسرعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="calc-grid-3">
            {HIJRI_MONTHS_INFO.map((item) => (
              <div
                key={item.month}
                className={`calc-metric-card card-nested ${highlightedMonth === item.month ? 'age-month-card--active' : ''}`}
              >
                <div className="calc-metric-card__label">{item.month}</div>
                <div className="calc-metric-card__note">{item.kind}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
