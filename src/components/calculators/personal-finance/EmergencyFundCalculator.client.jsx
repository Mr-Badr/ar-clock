"use client";

import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Wallet } from 'lucide-react';

import {
  CalcInput as Input,
  CalcProgress as Progress,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateEmergencyFund, formatCurrency, formatNumber } from '@/lib/calculators/engine';

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState('5000');
  const [targetMonths, setTargetMonths] = useState('6');
  const [currentSavings, setCurrentSavings] = useState('8000');
  const [monthlyContribution, setMonthlyContribution] = useState('1500');
  const [referenceDateIso, setReferenceDateIso] = useState(null);

  useEffect(() => {
    setReferenceDateIso(new Date().toISOString());
  }, []);

  const result = useMemo(
    () => calculateEmergencyFund({
      monthlyExpenses,
      targetMonths,
      currentSavings,
      monthlyContribution,
      referenceDateIso,
    }),
    [monthlyExpenses, targetMonths, currentSavings, monthlyContribution, referenceDateIso],
  );

  const shareText = result.isValid ? [
    `هدف صندوق الطوارئ: ${formatCurrency(result.targetAmount)}`,
    `المتبقي: ${formatCurrency(result.remainingAmount)}`,
    `التغطية الحالية: ${formatNumber(result.coverageMonths)} شهر`,
    result.monthsToGoal === null ? 'لا يوجد موعد وصول لأن الادخار الشهري = 0' : `المدة المتوقعة: ${result.monthsToGoal} شهر`,
  ].join('\n') : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">إعدادات صندوق الطوارئ</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-field">
              <Label className="calc-label" htmlFor="emergency-expenses">المصاريف الشهرية</Label>
              <Input id="emergency-expenses" inputMode="decimal" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} />
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="emergency-months">عدد الأشهر المستهدفة</Label>
              <Input id="emergency-months" inputMode="numeric" value={targetMonths} onChange={(e) => setTargetMonths(e.target.value)} />
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="emergency-current">المدخر الحالي</Label>
              <Input id="emergency-current" inputMode="decimal" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="emergency-monthly">الادخار الشهري</Label>
              <Input id="emergency-monthly" inputMode="decimal" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">النتيجة الحالية</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-metric-card">
                <div className="calc-metric-card__label"><ShieldCheck size={16} /> الهدف الكلي</div>
                <div className="calc-metric-card__value">{formatCurrency(result.targetAmount)}</div>
                <div className="calc-metric-card__note">{result.recommendedRange}</div>
              </div>
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">المبلغ المتبقي</div>
                  <div className="calc-metric-card__value">{formatCurrency(result.remainingAmount)}</div>
                  <div className="calc-metric-card__note">الفجوة بين المدخر الحالي والهدف</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">التغطية الحالية</div>
                  <div className="calc-metric-card__value">{formatNumber(result.coverageMonths)} شهر</div>
                  <div className="calc-metric-card__note">كم شهرًا تغطيه مدخراتك الحالية</div>
                </div>
              </div>
              <div className="calc-field">
                <div className="calc-field-row">
                  <strong>نسبة الإنجاز</strong>
                  <span className="calc-hint">{formatNumber(result.progressPercent)}%</span>
                </div>
                <Progress value={result.progressPercent} />
              </div>
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">التقييم الحالي</div>
                  <div className="calc-metric-card__value">{result.status}</div>
                  <div className="calc-metric-card__note">تقييم مبدئي بناءً على التغطية الحالية مقابل الهدف</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Wallet size={16} /> الوقت المتوقع للوصول</div>
                  <div className="calc-metric-card__value">
                    {result.monthsToGoal === null ? 'غير محدد' : `${result.monthsToGoal} شهر`}
                  </div>
                  <div className="calc-metric-card__note">
                    {result.targetDate
                      ? `الوصول التقريبي: ${result.targetDate}`
                      : result.monthsToGoal === null
                        ? 'أدخل ادخاراً شهرياً أكبر من صفر'
                        : 'يظهر التاريخ التقريبي بعد مزامنة وقت جهازك'}
                  </div>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة صندوق الطوارئ"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
