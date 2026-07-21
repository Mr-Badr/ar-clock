"use client";

import { useMemo, useState } from 'react';
import { Minus, Plus, Receipt, Users, Warning } from '@phosphor-icons/react';

import CalculatorCurrencyField, { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import { calculateBillSplit, formatCurrency } from '@/lib/calculators/engine';

const TIP_PRESETS = [0, 5, 10, 15, 20];

function fmt(v, currency = 'SAR') {
  return formatCurrency(v, currency);
}

export default function BillSplitterCalculator() {
  const [bill,    setBill]    = useState('200');
  const [people,  setPeople]  = useState(4);
  const [tip,     setTip]     = useState(0);
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency({ defaultCurrency: 'SAR' });

  const result = useMemo(
    () => calculateBillSplit({ billAmount: bill, tipPercent: tip, numPeople: people }),
    [bill, tip, people],
  );

  const currencyLabel = currencyOptions.find((o) => o.code === currency)?.code || currency;

  const shareText = result?.isValid
    ? `تقسيم الفاتورة\nالإجمالي: ${fmt(result.total, currency)}\nعدد الأشخاص: ${people}\nحصة كل شخص: ${fmt(result.perPerson, currency)}`
    : '';

  function adjustPeople(delta) {
    setPeople((prev) => Math.max(2, Math.min(20, prev + delta)));
  }

  return (
    <div className="calc-app bill-split-tool" aria-label="حاسبة تقسيم الفاتورة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Currency selector */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                </div>
                <CalculatorCurrencyField
                  currency={currency}
                  onChange={setCurrency}
                  options={currencyOptions}
                  hint="اختر عملة الفاتورة. نحفظ اختيارك لهذه الحاسبة والحاسبات المالية الأخرى."
                  id="bill-splitter-currency"
                />
              </div>

              {/* Bill amount */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="bill-amount">إجمالي الفاتورة</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="bill-amount"
                    inputMode="decimal"
                    value={bill}
                    onChange={(e) => setBill(e.target.value)}
                    placeholder="200"
                  />
                  <span className="calc-esb-currency">{currencyLabel}</span>
                </div>
              </div>

              {/* Number of people */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>عدد الأشخاص</Label>
                </div>
                <div className="bill-people-row">
                  <button
                    type="button"
                    className="bill-people-btn"
                    onClick={() => adjustPeople(-1)}
                    aria-label="تقليل عدد الأشخاص"
                    disabled={people <= 2}
                  >
                    <Minus size={16} weight="bold" />
                  </button>
                  <span className="bill-people-count" aria-live="polite">
                    <Users size={16} weight="bold" aria-hidden="true" />
                    {people}
                  </span>
                  <button
                    type="button"
                    className="bill-people-btn"
                    onClick={() => adjustPeople(1)}
                    aria-label="زيادة عدد الأشخاص"
                    disabled={people >= 20}
                  >
                    <Plus size={16} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Tip */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>البقشيش (اختياري)</Label>
                </div>
                <div className="bill-tip-presets">
                  {TIP_PRESETS.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`bill-tip-btn${tip === pct ? ' is-active' : ''}`}
                      onClick={() => setTip(pct)}
                    >
                      {pct === 0 ? 'بدون' : `${pct}%`}
                    </button>
                  ))}
                </div>
                {tip > 0 && tip !== 5 && tip !== 10 && tip !== 15 && tip !== 20 && (
                  <div className="calc-esb-money-row" style={{ marginTop: 'var(--spacing-2)' }}>
                    <Input
                      inputMode="decimal"
                      value={tip}
                      onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                      placeholder="10"
                    />
                    <span className="calc-esb-currency">%</span>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result?.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge" style={{ color: 'var(--amber)', borderColor: 'color-mix(in srgb, var(--amber) 40%, transparent)', background: 'color-mix(in srgb, var(--amber) 10%, transparent)' }}>
                  🧾 تقسيم الفاتورة
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">حصة كل شخص</span>
                <div className="calc-esb-amount-value" style={{ color: 'var(--amber)' }}>
                  {fmt(result.perPerson, currency)}
                </div>
                <div className="calc-esb-amount-meta">
                  <span>{people} أشخاص</span>
                  {result.tipPercent > 0 && (
                    <>
                      <span className="calc-esb-sep">·</span>
                      <span>شامل بقشيش {result.tipPercent}%</span>
                    </>
                  )}
                </div>
              </div>

              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>الفاتورة الأصلية</span>
                  <strong>{fmt(result.billAmount, currency)}</strong>
                </div>
                {result.tipPercent > 0 && (
                  <>
                    <div className="calc-esb-brow">
                      <span>البقشيش ({result.tipPercent}%)</span>
                      <strong>+ {fmt(result.tipAmount, currency)}</strong>
                    </div>
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>الإجمالي مع البقشيش</span>
                      <strong>{fmt(result.total, currency)}</strong>
                    </div>
                  </>
                )}
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>حصة كل شخص</span>
                  <strong>{fmt(result.perPerson, currency)}</strong>
                </div>
                {result.tipPercent > 0 && (
                  <div className="calc-esb-brow" style={{ opacity: 0.7 }}>
                    <span>بدون بقشيش</span>
                    <strong>{fmt(result.perPersonNoTip, currency)}</strong>
                  </div>
                )}
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="تقسيم الفاتورة"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>إذا كانت رسوم الخدمة مُضمَّنة في الفاتورة فلا تضف بقشيشاً مرة أخرى.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Receipt size={28} weight="duotone" />
              <p>أدخل مبلغ الفاتورة وعدد الأشخاص لتقسيم الحساب.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
