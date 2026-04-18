"use client";

import { useMemo, useState } from 'react';
import { CalendarRange, Moon, ShieldAlert } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateSleepDebt } from '@/lib/sleep/calculator';

const DAY_LABELS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export default function SleepDebtCalculator() {
  const [age, setAge] = useState('25');
  const [dailyHours, setDailyHours] = useState(['6.5', '6.5', '6.5', '6.5', '6.5', '8', '8']);

  function updateDay(index, value) {
    setDailyHours((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  const result = useMemo(
    () => calculateSleepDebt({
      age,
      actualByDay: dailyHours,
    }),
    [age, dailyHours],
  );

  const shareText = result.isValid
    ? [
        `الاحتياج الأسبوعي التقريبي: ${result.weeklyNeed} ساعة`,
        `النوم الفعلي: ${result.weeklyActual} ساعة`,
        `دين النوم: ${result.debtHours} ساعة`,
        `التقييم: ${result.status}`,
      ].join('\n')
    : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">ساعات نومك خلال الأسبوع</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <Label className="calc-label" htmlFor="sleep-debt-age">العمر</Label>
              <Input id="sleep-debt-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <div className="calc-info-grid">
              {DAY_LABELS.map((label, index) => (
                <div key={label} className="calc-field">
                  <Label className="calc-label" htmlFor={`sleep-debt-day-${index}`}>{label}</Label>
                  <Input
                    id={`sleep-debt-day-${index}`}
                    inputMode="decimal"
                    value={dailyHours[index]}
                    onChange={(e) => updateDay(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="calc-note">
              هذه الأداة تنظر إلى الأسبوع كله، لأن التعب أحياناً لا يأتي من ليلة واحدة فقط بل من تراكم ساعات ناقصة على عدة أيام.
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">قراءة دين النوم</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><CalendarRange size={16} /> الاحتياج الأسبوعي</div>
                  <div className="calc-metric-card__value">{result.weeklyNeed} ساعة</div>
                  <div className="calc-metric-card__note">مبني على متوسط الاحتياج التقريبي لعُمرك.</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Moon size={16} /> النوم الفعلي</div>
                  <div className="calc-metric-card__value">{result.weeklyActual} ساعة</div>
                  <div className="calc-metric-card__note">المجموع الذي أدخلته لأيام الأسبوع كلها.</div>
                </div>
              </div>

              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><ShieldAlert size={16} /> دين النوم</div>
                  <div className="calc-metric-card__value">{result.debtHours} ساعة</div>
                  <div className="calc-metric-card__note">{result.status}</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">المتوسط اليومي</div>
                  <div className="calc-metric-card__value">{result.averageSleep} ساعة</div>
                  <div className="calc-metric-card__note">{result.range?.label}</div>
                </div>
              </div>

              <div className="calc-note">{result.recoveryPlan}</div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة دين النوم"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
