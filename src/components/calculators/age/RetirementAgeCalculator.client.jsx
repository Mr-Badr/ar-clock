"use client";

import { useMemo, useState } from 'react';

import { GregorianDateField, MetricGrid, ResultState } from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateRetirement } from '@/lib/calculators/age';
import { RETIREMENT_RULES } from '@/lib/calculators/age-data';

export default function RetirementAgeCalculator() {
  const [countryCode, setCountryCode] = useState('sa');
  const [sector, setSector] = useState('government');
  const [gender, setGender] = useState('male');
  const [birthIso, setBirthIso] = useState('1995-03-12');

  const result = useMemo(
    () => calculateRetirement({ birthDateIso: birthIso, countryCode, sector, gender }),
    [birthIso, countryCode, gender, sector],
  );

  return (
    <div className="calc-app age-standalone-tool">
      <Card className="calc-surface-card calc-app-panel">
        <CardHeader>
          <CardTitle className="calc-card-title">بيانات التقاعد</CardTitle>
        </CardHeader>
        <CardContent className="calc-form-grid">
          <div className="calc-grid-3">
            <div className="calc-field">
              <label className="calc-label" htmlFor="retirement-country">الدولة</label>
              <select id="retirement-country" className="input calc-input" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
                {RETIREMENT_RULES.map((rule) => (
                  <option key={rule.code} value={rule.code}>{rule.country}</option>
                ))}
              </select>
            </div>
            <div className="calc-field">
              <label className="calc-label" htmlFor="retirement-sector">القطاع</label>
              <select id="retirement-sector" className="input calc-input" value={sector} onChange={(event) => setSector(event.target.value)}>
                <option value="government">حكومي</option>
                <option value="private">خاص</option>
                <option value="military">عسكري</option>
              </select>
            </div>
            <div className="calc-field">
              <label className="calc-label" htmlFor="retirement-gender">الجنس</label>
              <select id="retirement-gender" className="input calc-input" value={gender} onChange={(event) => setGender(event.target.value)}>
                <option value="male">رجل</option>
                <option value="female">امرأة</option>
              </select>
            </div>
          </div>

          <GregorianDateField value={birthIso} onChange={setBirthIso} />
        </CardContent>
      </Card>

      <ResultState result={result} />

      {result?.isValid ? (
        <>
          <div aria-live="polite">
            <MetricGrid
              items={[
                {
                  label: 'سن التقاعد المستخدم',
                  value: `${result.retirementAge} سنة`,
                  note: `${result.rule.country} · ${sector}`,
                },
                {
                  label: 'موعد التقاعد',
                  value: result.retirementDateLabel,
                  note: result.isRetired ? 'بحسب هذه البيانات وصلت إلى سن التقاعد أو تجاوزته.' : result.remainingLabel,
                },
                {
                  label: 'العمر الحالي',
                  value: result.currentAge.ageLabel,
                  note: `${result.daysRemaining} يوم متبقية تقريباً`,
                },
              ]}
            />
          </div>

          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">تنبيه مهم</CardTitle>
            </CardHeader>
            <CardContent className="calc-card-copy">
              {result.rule.note}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
