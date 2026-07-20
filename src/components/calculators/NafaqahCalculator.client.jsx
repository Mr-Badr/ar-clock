"use client";

import { useMemo, useState } from 'react';
import { Info, Scales, Warning } from '@phosphor-icons/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { computeNafaqahEstimate } from '@/lib/calculators/nafaqah';

function formatSar(value) {
  return `${Math.round(value).toLocaleString('ar-SA-u-nu-latn')} ريال`;
}

export default function NafaqahCalculator() {
  const [incomeInput, setIncomeInput] = useState('');
  const [debtsInput, setDebtsInput] = useState('');
  const [childrenInput, setChildrenInput] = useState('1');
  const [includeWife, setIncludeWife] = useState('yes');

  const income = parseFloat(incomeInput.replace(/,/g, '')) || 0;
  const debts = parseFloat(debtsInput.replace(/,/g, '')) || 0;
  const children = parseInt(childrenInput, 10) || 0;

  const result = useMemo(() => {
    if (income <= 0) return null;
    return computeNafaqahEstimate({
      payerMonthlyIncome: income,
      monthlyDebts: debts,
      childrenCount: children,
      includeWifeMaintenance: includeWife === 'yes',
    });
  }, [income, debts, children, includeWife]);

  return (
    <div className="calc-app nafaqah-tool" aria-label="حاسبة تقدير النفقة">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">بيانات تقدير النفقة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-esb-field">
              <Label htmlFor="nafaqah-income">الدخل الشهري للمنفق</Label>
              <Input
                id="nafaqah-income"
                type="text"
                inputMode="decimal"
                placeholder="مثال: 8000"
                value={incomeInput}
                onChange={(event) => setIncomeInput(event.target.value)}
                aria-label="الدخل الشهري للمنفق"
              />
            </div>

            <div className="calc-esb-field">
              <Label htmlFor="nafaqah-debts">الالتزامات الشهرية الثابتة (أقساط، إيجار، ديون)</Label>
              <Input
                id="nafaqah-debts"
                type="text"
                inputMode="decimal"
                placeholder="مثال: 1500 (اتركه فارغاً إن لم يوجد)"
                value={debtsInput}
                onChange={(event) => setDebtsInput(event.target.value)}
                aria-label="الالتزامات الشهرية الثابتة"
              />
            </div>

            <div className="calc-esb-field">
              <Label htmlFor="nafaqah-children">عدد الأولاد المستحقين للنفقة</Label>
              <Input
                id="nafaqah-children"
                type="number"
                inputMode="numeric"
                min="0"
                max="15"
                value={childrenInput}
                onChange={(event) => setChildrenInput(event.target.value)}
                aria-label="عدد الأولاد"
              />
            </div>

            <div className="calc-esb-field">
              <Label>هل تشمل التقدير نفقة الزوجة؟</Label>
              <RadioGroup value={includeWife} onValueChange={setIncludeWife} className="calc-esb-radio-row">
                <label className="calc-esb-radio-card">
                  <RadioGroupItem value="yes" />
                  <span className="calc-esb-radio-copy">
                    <strong>نعم</strong>
                  </span>
                </label>
                <label className="calc-esb-radio-card">
                  <RadioGroupItem value="no" />
                  <span className="calc-esb-radio-copy">
                    <strong>لا</strong>
                  </span>
                </label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {result ? (
            <>
              <Card className="calc-surface-card nafaqah-result-card">
                <CardHeader>
                  <div className="calc-esb-result-header">
                    <span className="calc-esb-country-badge calc-esb-country-badge--kw">
                      <Scales size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}تقدير تقريبي
                    </span>
                    <span className="calc-esb-live-dot" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">إجمالي النفقة الشهرية التقديرية</div>
                    <div className="calc-metric-card__value">
                      {formatSar(result.totalLow)} — {formatSar(result.totalHigh)}
                    </div>
                    <div className="calc-metric-card__note">
                      <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}
                      {result.children > 0 ? `نفقة الأولاد: ${formatSar(result.childLow)} — ${formatSar(result.childHigh)}. ` : ''}
                      {result.includeWifeMaintenance ? `نفقة الزوجة: ${formatSar(result.wifeLow)} — ${formatSar(result.wifeHigh)}.` : ''}
                    </div>
                    {result.isCapped ? (
                      <div className="calc-metric-card__note">
                        <Warning size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px', color: 'var(--amber)' }} />
                        {' '}تم تقييد الحد الأعلى تلقائياً بحيث لا يتجاوز 50% من إجمالي دخل المنفق ({formatSar(result.cap)}).
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">هذا تقدير استرشادي فقط</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card__note">
                    القاضي هو من يحدد المبلغ النهائي فعلياً بناءً على تفاصيل القضية الكاملة (حالة المنفق المادية، مصادر دخله الأخرى، سكنه، وظروف الأسرة تحديداً) — هذه الأداة تعطيك نطاقاً تقريبياً للتخطيط فقط، وليست بديلاً عن استشارة قانونية أو حكم المحكمة.
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">
                <Scales size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                {' '}أدخل الدخل الشهري لعرض النطاق التقديري للنفقة.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
