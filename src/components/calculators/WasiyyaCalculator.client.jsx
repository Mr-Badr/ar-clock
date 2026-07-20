"use client";

import { useMemo, useState } from 'react';
import { Info, Scales, Warning } from '@phosphor-icons/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { computeWasiyya } from '@/lib/calculators/wasiyya';

const CURRENCIES = [
  { id: 'SAR', label: 'ريال سعودي' },
  { id: 'AED', label: 'درهم إماراتي' },
  { id: 'KWD', label: 'دينار كويتي' },
  { id: 'QAR', label: 'ريال قطري' },
  { id: 'EGP', label: 'جنيه مصري' },
];

function formatMoney(value, currency) {
  return value.toLocaleString('ar-SA-u-nu-latn', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}

export default function WasiyyaCalculator() {
  const [currency, setCurrency] = useState('SAR');
  const [netEstateInput, setNetEstateInput] = useState('');
  const [desiredBequestInput, setDesiredBequestInput] = useState('');

  const netEstate = parseFloat(netEstateInput.replace(/,/g, '')) || 0;
  const desiredBequest = parseFloat(desiredBequestInput.replace(/,/g, '')) || 0;

  const result = useMemo(() => {
    if (netEstate <= 0) return null;
    return computeWasiyya({ netEstate, desiredBequest });
  }, [netEstate, desiredBequest]);

  return (
    <div className="calc-app wasiyya-tool" aria-label="حاسبة الوصية الشرعية">
      <div className="calc-app-grid age-app-grid">
        <Card className="calc-surface-card calc-app-panel">
          <CardHeader>
            <CardTitle className="calc-card-title">قيمة التركة والوصية المرغوبة</CardTitle>
          </CardHeader>
          <CardContent className="calc-form-grid">
            <div className="calc-esb-field">
              <Label htmlFor="wasiyya-currency">العملة</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="wasiyya-currency" aria-label="العملة">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((cur) => (
                    <SelectItem key={cur.id} value={cur.id}>
                      {cur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="calc-esb-field">
              <Label htmlFor="wasiyya-estate">صافي التركة (بعد الديون ومصاريف الجنازة)</Label>
              <Input
                id="wasiyya-estate"
                type="text"
                inputMode="decimal"
                placeholder="مثال: 900000"
                value={netEstateInput}
                onChange={(event) => setNetEstateInput(event.target.value)}
                aria-label="صافي التركة"
              />
              <p className="calc-hint">
                نفس قيمة "التركة الإجمالية" المستخدمة في حاسبة الميراث — أصولك مطروحاً منها ديونك ومصاريف تجهيزك ودفنك.
              </p>
            </div>

            <div className="calc-esb-field">
              <Label htmlFor="wasiyya-desired">المبلغ الذي ترغب في الوصية به (اختياري)</Label>
              <Input
                id="wasiyya-desired"
                type="text"
                inputMode="decimal"
                placeholder="مثال: 200000"
                value={desiredBequestInput}
                onChange={(event) => setDesiredBequestInput(event.target.value)}
                aria-label="المبلغ المرغوب في الوصية به"
              />
            </div>
          </CardContent>
        </Card>

        <div className="calc-results-panel" aria-live="polite">
          {result ? (
            <>
              <Card className="calc-surface-card wasiyya-result-card">
                <CardHeader>
                  <div className="calc-esb-result-header">
                    <span className="calc-esb-country-badge calc-esb-country-badge--bh">
                      <Scales size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}الحد الأقصى للوصية
                    </span>
                    <span className="calc-esb-live-dot" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card">
                    <div className="calc-metric-card__label">أقصى ما يجوز أن توصي به (ثلث التركة)</div>
                    <div className="calc-metric-card__value">{formatMoney(result.oneThird, currency)}</div>
                    <div className="calc-metric-card__note">
                      <Info size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} />
                      {' '}الثلثان الباقيان ({formatMoney(result.twoThirds, currency)}) حق ثابت للورثة الشرعيين ولا يجوز التصرف فيهما بالوصية.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result.hasDesired ? (
                <Card className="calc-surface-card">
                  <CardHeader>
                    <CardTitle className="calc-card-title">
                      {result.isWithinLimit ? (
                        <>
                          <Info size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: '4px' }} />
                          مبلغك ضمن الحد المسموح
                        </>
                      ) : (
                        <>
                          <Warning size={16} weight="bold" style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: '4px', color: 'var(--amber)' }} />
                          مبلغك يتجاوز ثلث التركة
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="calc-metric-card__note">
                      {result.isWithinLimit
                        ? `المبلغ الذي حددته (${formatMoney(result.desired, currency)}) لا يتجاوز الثلث، فتنفذ الوصية به كاملاً دون الحاجة لموافقة الورثة.`
                        : `المبلغ الذي حددته (${formatMoney(result.desired, currency)}) يتجاوز الثلث بمقدار ${formatMoney(result.excessAmount, currency)}. تُنفَّذ الوصية في حدود الثلث (${formatMoney(result.oneThird, currency)}) تلقائياً، أما الزيادة فلا تنفذ إلا برضا جميع الورثة البالغين الرشداء بعد الوفاة.`}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">الأساس الشرعي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calc-metric-card__note">
                    عن سعد بن أبي وقاص رضي الله عنه أن النبي ﷺ قال له لما أراد أن يوصي بأكثر من الثلث: "الثلث، والثلث كثير؛ إنك أن تذر ورثتك أغنياء خير من أن تذرهم عالة يتكففون الناس" (متفق عليه). والوصية لوارث شرعي أصلاً لا تصح إلا برضا باقي الورثة، بصرف النظر عن المبلغ.
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="calc-metric-card">
              <div className="calc-metric-card__note">
                <Scales size={14} weight="bold" style={{ display: 'inline', verticalAlign: '-2px' }} />
                {' '}أدخل صافي قيمة التركة لعرض الحد الأقصى المسموح للوصية.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
