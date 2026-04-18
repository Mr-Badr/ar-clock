"use client";

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { CalcButton as Button, CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { compareDebtPayoffPlans, formatCurrency } from '@/lib/calculators/engine';

const DEFAULT_DEBTS = [
  { id: 'card', name: 'بطاقة ائتمان', balance: '12000', annualRate: '24', minimumPayment: '700' },
  { id: 'loan', name: 'قرض شخصي', balance: '35000', annualRate: '8', minimumPayment: '1100' },
];

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState(DEFAULT_DEBTS);
  const [extraPayment, setExtraPayment] = useState('500');
  const [referenceDateIso, setReferenceDateIso] = useState(null);

  useEffect(() => {
    setReferenceDateIso(new Date().toISOString());
  }, []);

  const result = useMemo(
    () => compareDebtPayoffPlans({ debts, extraPayment, referenceDateIso }),
    [debts, extraPayment, referenceDateIso],
  );

  function updateDebt(id, key, value) {
    setDebts((current) => current.map((debt) => (
      debt.id === id ? { ...debt, [key]: value } : debt
    )));
  }

  function addDebt() {
    setDebts((current) => [
      ...current,
      {
        id: `debt-${Date.now()}`,
        name: `دين ${current.length + 1}`,
        balance: '0',
        annualRate: '0',
        minimumPayment: '0',
      },
    ]);
  }

  function removeDebt(id) {
    setDebts((current) => current.filter((debt) => debt.id !== id));
  }

  const shareText = result.isValid ? [
    `طريقة كرة الثلج: ${result.snowball.months} شهر | فائدة ${formatCurrency(result.snowball.totalInterest)}`,
    `طريقة الانهيار: ${result.avalanche.months} شهر | فائدة ${formatCurrency(result.avalanche.totalInterest)}`,
    `الوفر عند الانهيار: ${formatCurrency(result.interestSavedWithAvalanche)}`,
  ].join('\n') : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">أدخل ديونك الحالية</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            {debts.map((debt, index) => (
              <div key={debt.id} className="card-nested p-4">
                <div className="calc-field-row mb-3">
                  <strong>{debt.name || `دين ${index + 1}`}</strong>
                  {debts.length > 1 ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeDebt(debt.id)}>
                      <Trash2 size={15} />
                      حذف
                    </Button>
                  ) : null}
                </div>
                <div className="calc-grid-2">
                  <div className="calc-field">
                    <Label className="calc-label">الاسم</Label>
                    <Input value={debt.name} onChange={(e) => updateDebt(debt.id, 'name', e.target.value)} />
                  </div>
                  <div className="calc-field">
                    <Label className="calc-label">الرصيد الحالي</Label>
                    <Input inputMode="decimal" value={debt.balance} onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)} />
                  </div>
                </div>
                <div className="calc-grid-2">
                  <div className="calc-field">
                    <Label className="calc-label">نسبة الفائدة %</Label>
                    <Input inputMode="decimal" value={debt.annualRate} onChange={(e) => updateDebt(debt.id, 'annualRate', e.target.value)} />
                  </div>
                  <div className="calc-field">
                    <Label className="calc-label">الحد الأدنى / الدفعة الشهرية</Label>
                    <Input inputMode="decimal" value={debt.minimumPayment} onChange={(e) => updateDebt(debt.id, 'minimumPayment', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}

            <div className="calc-field">
              <Label className="calc-label" htmlFor="debt-extra">دفعة إضافية شهرية فوق الحدود الدنيا</Label>
              <Input id="debt-extra" inputMode="decimal" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
            </div>

            <Button type="button" variant="outline" onClick={addDebt}>
              <Plus size={15} />
              أضف دينًا آخر
            </Button>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">مقارنة خطة السداد</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">كرة الثلج</div>
                  <div className="calc-metric-card__value">{result.snowball.isValid ? `${result.snowball.months} شهر` : 'أدخل الديون'}</div>
                  <div className="calc-metric-card__note">إجمالي الفائدة: {formatCurrency(result.snowball.totalInterest)}</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">الانهيار</div>
                  <div className="calc-metric-card__value">{result.avalanche.isValid ? `${result.avalanche.months} شهر` : 'أدخل الديون'}</div>
                  <div className="calc-metric-card__note">إجمالي الفائدة: {formatCurrency(result.avalanche.totalInterest)}</div>
                </div>
              </div>
              <div className="calc-metric-card">
                <div className="calc-metric-card__label">الوفر عند استخدام الانهيار</div>
                <div className="calc-metric-card__value">{formatCurrency(result.interestSavedWithAvalanche)}</div>
                <div className="calc-metric-card__note">فرق الفائدة التقريبي بين الطريقتين عند نفس الدفعة الإضافية</div>
              </div>
              <div className="calc-metric-card">
                <div className="calc-metric-card__label">ما الذي يحدث إذا أضفت دفعة إضافية؟</div>
                <div className="calc-metric-card__value">{result.monthsSavedWithExtra} شهر أقل</div>
                <div className="calc-metric-card__note">مقارنة بين المسار الحالي ومسار من دون دفعة إضافية</div>
              </div>
              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة خطة سداد الديون"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
