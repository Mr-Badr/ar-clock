"use client";

import { useMemo, useState } from 'react';
import { Landmark, Scale } from 'lucide-react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateNetWorth, formatCurrency, formatNumber } from '@/lib/calculators/engine';

export default function NetWorthCalculator() {
  const [cash, setCash] = useState('25000');
  const [investments, setInvestments] = useState('30000');
  const [properties, setProperties] = useState('120000');
  const [otherAssets, setOtherAssets] = useState('10000');
  const [loans, setLoans] = useState('80000');
  const [creditCards, setCreditCards] = useState('5000');
  const [otherLiabilities, setOtherLiabilities] = useState('0');

  const result = useMemo(
    () => calculateNetWorth({
      cash,
      investments,
      properties,
      otherAssets,
      loans,
      creditCards,
      otherLiabilities,
    }),
    [cash, investments, properties, otherAssets, loans, creditCards, otherLiabilities],
  );

  const shareText = result.isValid ? [
    `إجمالي الأصول: ${formatCurrency(result.totalAssets)}`,
    `إجمالي الالتزامات: ${formatCurrency(result.totalLiabilities)}`,
    `صافي الثروة: ${formatCurrency(result.netWorth)}`,
    `التقييم: ${result.status}`,
  ].join('\n') : '';

  return (
    <div className="calc-app">
      <div className="calc-app-grid lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">بيانات الأصول والالتزامات</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="net-cash">النقد والمدخرات</Label>
                <Input id="net-cash" inputMode="decimal" value={cash} onChange={(e) => setCash(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="net-investments">الاستثمارات</Label>
                <Input id="net-investments" inputMode="decimal" value={investments} onChange={(e) => setInvestments(e.target.value)} />
              </div>
            </div>
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="net-properties">الممتلكات</Label>
                <Input id="net-properties" inputMode="decimal" value={properties} onChange={(e) => setProperties(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="net-other-assets">أصول أخرى</Label>
                <Input id="net-other-assets" inputMode="decimal" value={otherAssets} onChange={(e) => setOtherAssets(e.target.value)} />
              </div>
            </div>
            <div className="calc-grid-2">
              <div className="calc-field">
                <Label className="calc-label" htmlFor="net-loans">القروض</Label>
                <Input id="net-loans" inputMode="decimal" value={loans} onChange={(e) => setLoans(e.target.value)} />
              </div>
              <div className="calc-field">
                <Label className="calc-label" htmlFor="net-credit">بطاقات الائتمان</Label>
                <Input id="net-credit" inputMode="decimal" value={creditCards} onChange={(e) => setCreditCards(e.target.value)} />
              </div>
            </div>
            <div className="calc-field">
              <Label className="calc-label" htmlFor="net-other-liabilities">التزامات أخرى</Label>
              <Input id="net-other-liabilities" inputMode="decimal" value={otherLiabilities} onChange={(e) => setOtherLiabilities(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel">
          <Card className="calc-surface-card">
            <CardHeader>
              <CardTitle className="calc-card-title">ملخص الوضع المالي</CardTitle>
            </CardHeader>
            <CardContent className="calc-metric-grid">
              <div className="calc-metric-card">
                <div className="calc-metric-card__label"><Landmark size={16} /> صافي الثروة</div>
                <div className="calc-metric-card__value">{formatCurrency(result.netWorth)}</div>
                <div className="calc-metric-card__note">{result.status}</div>
              </div>
              <div className="calc-grid-2">
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label">إجمالي الأصول</div>
                  <div className="calc-metric-card__value">{formatCurrency(result.totalAssets)}</div>
                  <div className="calc-metric-card__note">ما تملكه فعلاً من قيمة مالية</div>
                </div>
                <div className="calc-metric-card">
                  <div className="calc-metric-card__label"><Scale size={16} /> إجمالي الالتزامات</div>
                  <div className="calc-metric-card__value">{formatCurrency(result.totalLiabilities)}</div>
                  <div className="calc-metric-card__note">ما عليك من ديون وقروض والتزامات</div>
                </div>
              </div>
              <div className="calc-metric-card">
                <div className="calc-metric-card__label">نسبة الالتزامات إلى الأصول</div>
                <div className="calc-metric-card__value">{formatNumber(result.liabilitiesRatio)}%</div>
                <div className="calc-metric-card__note">{result.nextStep}</div>
              </div>
              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة صافي الثروة"
                shareText={shareText}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
