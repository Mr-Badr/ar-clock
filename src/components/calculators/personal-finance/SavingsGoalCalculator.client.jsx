"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, PiggyBank } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateSavingsGoal, formatCurrency, formatNumber } from '@/lib/calculators/engine';

export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState('24000');
  const [currentSavings, setCurrentSavings] = useState('6000');
  const [months, setMonths] = useState('12');
  const [annualReturn, setAnnualReturn] = useState('0');
  const [referenceDateIso, setReferenceDateIso] = useState(null);

  useEffect(() => {
    setReferenceDateIso(new Date().toISOString());
  }, []);

  const result = useMemo(
    () => calculateSavingsGoal({ goalAmount, currentSavings, months, annualReturn, referenceDateIso }),
    [goalAmount, currentSavings, months, annualReturn, referenceDateIso],
  );

  const shareText = result.isValid ? [
    `هدف الادخار: ${formatCurrency(result.goalAmount)}`,
    `المطلوب شهريًا: ${formatCurrency(result.monthlyRequired)}`,
    `المطلوب أسبوعيًا: ${formatCurrency(result.weeklyRequired)}`,
    `تاريخ الوصول التقريبي: ${result.targetDate || 'بعد تحميل وقت جهازك'}`,
  ].join('\n') : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">إعدادات هدف الادخار</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <Label className="calc-label" htmlFor="goal-amount">الهدف المالي</Label>
              <Input id="goal-amount" inputMode="decimal" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="goal-current">المدخر الحالي</Label>
              <Input id="goal-current" inputMode="decimal" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="goal-months">المدة بالأشهر</Label>
              <Input id="goal-months" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} />
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="goal-return">عائد سنوي اختياري %</Label>
              <Input id="goal-return" inputMode="decimal" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">خطة الادخار المقترحة</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-metric-card">
                <div className="calc-metric-card__label"><PiggyBank size={16} /> المطلوب شهريًا</div>
                <div className="calc-metric-card__value">{formatCurrency(result.monthlyRequired)}</div>
                <div className="calc-metric-card__note">هذا هو الرقم الشهري التقريبي للوصول في الموعد المحدد</div>
              </div>
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">المطلوب أسبوعيًا</div>
                  <div className="calc-metric-card__value">{formatCurrency(result.weeklyRequired)}</div>
                  <div className="calc-metric-card__note">مفيد إذا كنت تفضل متابعة ادخار أسبوعي</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><CalendarRange size={16} /> تاريخ الوصول</div>
                  <div className="calc-metric-card__value">{result.targetDate || '—'}</div>
                  <div className="calc-metric-card__note">
                    {result.targetDate ? 'تاريخ تقريبي بحسب المدة الحالية' : 'يظهر بعد مزامنة وقت جهازك المحلي'}
                  </div>
                </div>
              </div>
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">الفجوة الحالية</div>
                  <div className="calc-metric-card__value">{formatCurrency(result.gapNow)}</div>
                  <div className="calc-metric-card__note">الفرق بين الهدف وما لديك الآن</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">إذا زدت المدة 6 أشهر</div>
                  <div className="calc-metric-card__value">{formatCurrency(result.monthlyRequiredExtended)}</div>
                  <div className="calc-metric-card__note">انخفاض شهري تقريبي: {formatCurrency(result.monthlyDifferenceIfExtended)}</div>
                </div>
              </div>
              <ResultActions
                copyText={shareText}
                shareTitle="خطة هدف الادخار"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
