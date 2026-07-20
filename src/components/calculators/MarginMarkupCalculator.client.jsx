"use client";

import { useMemo, useState } from 'react';
import { CurrencyDollar, Percent, TrendUp, Wallet } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { calculateMarginMarkup, formatCurrency, formatNumber } from '@/lib/calculators/engine';

const MODE_OPTIONS = [
  { value: 'from-price', title: 'أعرف التكلفة وسعر البيع', description: 'احسب هامش الربح ونسبة الزيادة تلقائياً' },
  { value: 'from-margin', title: 'أعرف التكلفة وهامش الربح المطلوب', description: 'احسب سعر البيع الذي يحقق هذا الهامش' },
  { value: 'from-markup', title: 'أعرف التكلفة ونسبة الزيادة المطلوبة', description: 'احسب سعر البيع الذي يحقق هذه الزيادة' },
];

export default function MarginMarkupCalculator() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency({ defaultCurrency: 'SAR' });
  const [mode, setMode] = useState('from-price');
  const [cost, setCost] = useState('100');
  const [price, setPrice] = useState('130');
  const [marginPercent, setMarginPercent] = useState('25');
  const [markupPercent, setMarkupPercent] = useState('30');

  const formatMoney = (v) => formatCurrency(v, currency);

  const result = useMemo(
    () => calculateMarginMarkup({ mode, cost, price, marginPercent, markupPercent }),
    [mode, cost, price, marginPercent, markupPercent],
  );

  const shareText = result.isValid
    ? `حاسبة هامش الربح ونسبة الزيادة\nالتكلفة: ${formatMoney(result.cost)}\nسعر البيع: ${formatMoney(result.price)}\nهامش الربح: ${formatNumber(result.marginPercent)}%\nنسبة الزيادة على التكلفة: ${formatNumber(result.markupPercent)}%`
    : '';

  return (
    <div className="calc-app margin-markup-tool" aria-label="حاسبة هامش الربح ونسبة الزيادة على التكلفة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              {/* Mode */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>ما الذي تعرفه؟</Label>
                </div>
                <RadioGroup value={mode} onValueChange={setMode} className="calc-esb-radio-row">
                  {MODE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="calc-esb-radio-card">
                      <RadioGroupItem value={opt.value} />
                      <span className="calc-esb-radio-copy">
                        <strong>{opt.title}</strong>
                        <span>{opt.description}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Cost — always shown */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="mm-cost">تكلفة المنتج أو الخدمة</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="mm-cost"
                    inputMode="decimal"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="100"
                  />
                  <span className="calc-esb-currency">{currency}</span>
                </div>
                <CalculatorCurrencyField
                  currency={currency}
                  onChange={setCurrency}
                  options={currencyOptions}
                  id="mm-currency"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              {/* Conditional second input */}
              {mode === 'from-price' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label htmlFor="mm-price">سعر البيع</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input
                      id="mm-price"
                      inputMode="decimal"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="130"
                    />
                    <span className="calc-esb-currency">{currency}</span>
                  </div>
                </div>
              )}

              {mode === 'from-margin' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label htmlFor="mm-margin">هامش الربح المطلوب (% من سعر البيع)</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input
                      id="mm-margin"
                      inputMode="decimal"
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(e.target.value)}
                      placeholder="25"
                    />
                    <span className="calc-esb-currency">%</span>
                  </div>
                </div>
              )}

              {mode === 'from-markup' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label htmlFor="mm-markup">نسبة الزيادة المطلوبة على التكلفة (%)</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input
                      id="mm-markup"
                      inputMode="decimal"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(e.target.value)}
                      placeholder="30"
                    />
                    <span className="calc-esb-currency">%</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel margin-markup-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">
                  <TrendUp size={12} weight="bold" style={{ display: 'inline', verticalAlign: '-1px' }} /> هامش الربح والزيادة
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">
                  {mode === 'from-price' ? 'الربح لكل وحدة' : 'سعر البيع المطلوب'}
                </span>
                <div className="calc-esb-amount-value">
                  {mode === 'from-price' ? formatMoney(result.profit) : formatMoney(result.price)}
                </div>
                {mode !== 'from-price' && (
                  <div className="calc-esb-amount-meta">
                    <span>ربح {formatMoney(result.profit)} لكل وحدة</span>
                  </div>
                )}
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <CurrencyDollar size={14} weight="bold" />
                    التكلفة
                  </span>
                  <strong>{formatMoney(result.cost)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Wallet size={14} weight="bold" />
                    سعر البيع
                  </span>
                  <strong>{formatMoney(result.price)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Percent size={14} weight="bold" />
                    هامش الربح (من سعر البيع)
                  </span>
                  <strong>{formatNumber(result.marginPercent)}%</strong>
                </div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>نسبة الزيادة على التكلفة (Markup)</span>
                  <strong>{formatNumber(result.markupPercent)}%</strong>
                </div>
              </div>

              <p className="calc-hint" style={{ marginTop: '0.5rem' }}>
                هامش الربح (Margin) يُحسب كنسبة من <strong>سعر البيع</strong>، بينما نسبة الزيادة
                (Markup) تُحسب كنسبة من <strong>التكلفة</strong> — لهذا الرقمان مختلفان دائماً رغم أنهما
                يصفان نفس الربح بالضبط.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة هامش الربح ونسبة الزيادة"
                shareText={shareText}
              />

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <TrendUp size={28} weight="duotone" />
              <p>أدخل التكلفة والقيمة الثانية المطلوبة لحساب هامش الربح.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
