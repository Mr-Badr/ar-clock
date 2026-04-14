"use client";

import { useMemo, useState } from 'react';

import { BirthInputBlock, MetricGrid, resolveBirthInput, ResultState } from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildPlanetaryAges, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

export default function AgePlanetsCalculator() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });

  const normalized = useMemo(
    () => resolveBirthInput(calendar, birthIso, birthHijri),
    [birthIso, birthHijri, calendar],
  );
  const result = useMemo(() => {
    if (!normalized.isValid) return normalized;
    return buildPlanetaryAges({ birthDateIso: normalized.iso, targetDateIso: getTodayIso() });
  }, [normalized]);

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

      {result?.isValid ? (
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">عمرك على الكواكب</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricGrid
              items={result.planets.map((planet) => ({
                label: planet.label,
                value: `${formatAgeNumber(planet.age)} سنة`,
                note: `عيدك القادم على ${planet.label} بعد ${formatAgeNumber(planet.nextBirthdayInDays, { maximumFractionDigits: 0 })} يوم`,
              }))}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
