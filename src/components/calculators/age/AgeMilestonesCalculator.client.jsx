"use client";

import { useMemo, useState } from 'react';

import { BirthInputBlock, MilestoneList, resolveBirthInput, ResultState } from '@/components/calculators/age/shared.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildAgeMilestones, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

export default function AgeMilestonesCalculator() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });

  const normalized = useMemo(
    () => resolveBirthInput(calendar, birthIso, birthHijri),
    [birthIso, birthHijri, calendar],
  );
  const milestones = useMemo(() => {
    if (!normalized.isValid) return normalized;
    return {
      isValid: true,
      items: buildAgeMilestones(normalized.iso, getTodayIso()),
    };
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

      <ResultState result={milestones} />

      {milestones?.isValid ? (
        <>
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">الماضية والقادمة</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestoneList items={milestones.items} />
            </CardContent>
          </Card>

          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">ملخص سريع</CardTitle>
            </CardHeader>
            <CardContent className="calc-breakdown-list">
              <div className="calc-mini-item">
                <strong>تم تجاوزها</strong>
                <span>{formatAgeNumber(milestones.items.filter((item) => item.isReached).length, { maximumFractionDigits: 0 })} محطة</span>
              </div>
              <div className="calc-mini-item">
                <strong>الأقرب القادمة</strong>
                <span>{milestones.items.find((item) => !item.isReached)?.label || 'لا توجد محطة قادمة ضمن القائمة الافتراضية'}</span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
