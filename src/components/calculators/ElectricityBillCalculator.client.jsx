'use client';

import { useState, useMemo } from 'react';
import { Lightning, Lightbulb, Warning } from '@phosphor-icons/react';
import {
  calculateSaudiElectricityBill,
  calculateUAEElectricityBill,
  formatBillAmount,
  getConsumptionCategory,
} from '@/lib/calculators/electricity-bill';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CalcInput as Input } from '@/components/calculators/controls.client';

const COUNTRIES = [
  { id: 'sa', label: 'السعودية', flag: '🇸🇦', placeholder: '2000', currency: 'ر.س', vatLabel: '15%' },
  { id: 'ae', label: 'الإمارات', flag: '🇦🇪', placeholder: '1500', currency: 'د.إ', vatLabel: '5%' },
];

const PRESETS = {
  sa: [
    { label: 'شقة صغيرة', kwh: 800 },
    { label: 'شقة عادية', kwh: 1500 },
    { label: 'فيلا صغيرة', kwh: 2500 },
    { label: 'فيلا كبيرة', kwh: 4000 },
    { label: 'مكتب / تجاري', kwh: 6000 },
  ],
  ae: [
    { label: 'استوديو', kwh: 500 },
    { label: 'شقة 1 غرفة', kwh: 1000 },
    { label: 'شقة 2 غرفة', kwh: 2000 },
    { label: 'فيلا صغيرة', kwh: 3500 },
    { label: 'فيلا كبيرة', kwh: 5000 },
  ],
};

export default function ElectricityBillCalculator() {
  const [country, setCountry] = useState('sa');
  const [kWhInput, setKWhInput] = useState('');

  const kWh = parseFloat(kWhInput) || 0;
  const countryData = COUNTRIES.find(c => c.id === country);

  const result = useMemo(() => {
    if (kWh <= 0) return null;
    return country === 'sa'
      ? calculateSaudiElectricityBill(kWh)
      : calculateUAEElectricityBill(kWh);
  }, [country, kWh]);

  const category = result ? getConsumptionCategory(kWh, country) : null;

  function handleCountryChange(c) {
    setCountry(c);
    setKWhInput('');
  }

  const shareText = result
    ? `حاسبة فاتورة الكهرباء (${countryData.label})\nالاستهلاك: ${kWh.toLocaleString('ar-SA-u-nu-latn')} kWh\nالفاتورة الإجمالية: ${formatBillAmount(result.total, result.currency)} (شاملة الضريبة)`
    : '';

  return (
    <div className="calc-app elec-tool" aria-label="حاسبة فاتورة الكهرباء">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Country toggle */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الدولة</Label>
                </div>
                <div className="elec-country-row">
                  {COUNTRIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`elec-country-btn${country === c.id ? ' elec-country-btn--active' : ''}`}
                      onClick={() => handleCountryChange(c.id)}
                      aria-pressed={country === c.id}
                    >
                      <span className="elec-country-flag">{c.flag}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* kWh input */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label htmlFor="elec-kwh">استهلاك الشهر</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input
                    id="elec-kwh"
                    inputMode="decimal"
                    dir="ltr"
                    value={kWhInput}
                    onChange={e => setKWhInput(e.target.value)}
                    placeholder={countryData.placeholder}
                  />
                  <span className="calc-esb-currency">kWh</span>
                </div>
                <p className="calc-hint">مدوَّن على الفاتورة أو تطبيق شركة الكهرباء.</p>
              </div>

              {/* Quick presets */}
              <div className="calc-esb-field">
                <Label className="elec-presets-label">استهلاك شائع</Label>
                <div className="elec-presets">
                  {PRESETS[country].map(p => (
                    <button
                      key={p.kwh}
                      type="button"
                      className={`elec-preset${kWh === p.kwh ? ' elec-preset--active' : ''}`}
                      onClick={() => setKWhInput(String(p.kwh))}
                    >
                      <span className="elec-preset-label">{p.label}</span>
                      <span className="elec-preset-kwh">{p.kwh.toLocaleString('ar-SA-u-nu-latn')} kWh</span>
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Quick facts strip */}
          {result && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Lightning size={15} weight="bold" />
                <span>استهلاك {category.label}</span>
              </div>
              <div className="calc-esb-fact">
                <Lightbulb size={15} weight="bold" />
                <span>ضريبة {countryData.vatLabel} مشمولة</span>
              </div>
              {result.tierBreakdown?.length > 1 && (
                <div className="calc-esb-fact">
                  <Warning size={15} weight="bold" />
                  <span>{result.tierBreakdown.length} شرائح سعرية مطبَّقة</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result ? (
            <div className="calc-esb-result-panel elec-result" aria-live="polite">

              {/* Country header */}
              <div className="calc-esb-result-header">
                <span className={`calc-esb-country-badge elec-badge--${country}`}>
                  {countryData.flag} {countryData.label}
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Total bill hero */}
              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">إجمالي الفاتورة المتوقعة</span>
                <div className="calc-esb-amount-value elec-amount">
                  {formatBillAmount(result.total, result.currency)}
                </div>
                <div className="calc-esb-amount-meta">
                  <span>{kWh.toLocaleString('ar-SA-u-nu-latn')} kWh</span>
                  <span className="calc-esb-sep">·</span>
                  <span>شامل ضريبة {countryData.vatLabel}</span>
                </div>
              </div>

              {/* Bill breakdown */}
              <div className="calc-esb-breakdown">

                {result.tierBreakdown.map((tier, i) => (
                  <div key={i} className="calc-esb-brow">
                    <span>
                      {tier.consumed.toLocaleString('ar-SA-u-nu-latn')} kWh × {tier.rate} {result.currency}
                    </span>
                    <strong>{formatBillAmount(tier.charge, result.currency)}</strong>
                  </div>
                ))}

                {result.distributionCharge > 0 && (
                  <div className="calc-esb-brow">
                    <span>رسوم التوزيع</span>
                    <strong>{formatBillAmount(result.distributionCharge, result.currency)}</strong>
                  </div>
                )}

                {result.fuelSurcharge > 0 && (
                  <div className="calc-esb-brow">
                    <span>رسوم الوقود (تقريبية)</span>
                    <strong>{formatBillAmount(result.fuelSurcharge, result.currency)}</strong>
                  </div>
                )}

                <div className="calc-esb-brow">
                  <span>رسوم الاشتراك الشهري</span>
                  <strong>{formatBillAmount(result.serviceCharge, result.currency)}</strong>
                </div>

                <div className="calc-esb-brow">
                  <span>المجموع قبل الضريبة</span>
                  <strong>{formatBillAmount(result.subtotal, result.currency)}</strong>
                </div>

                <div className="calc-esb-brow">
                  <span>ضريبة القيمة المضافة ({countryData.vatLabel})</span>
                  <strong>{formatBillAmount(result.vat, result.currency)}</strong>
                </div>

                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي شامل الضريبة</span>
                  <strong>{formatBillAmount(result.total, result.currency)}</strong>
                </div>
              </div>

              {/* UAE fuel note */}
              {result.fuelSurchargeNote && (
                <div className="elec-fuel-note">
                  <Warning size={13} weight="fill" />
                  <span>{result.fuelSurchargeNote}</span>
                </div>
              )}

              {/* High-consumption tip */}
              {kWh > 3000 && country === 'sa' && (
                <div className="elec-tip-box">
                  <strong>نصائح لتخفيض الفاتورة</strong>
                  <ul className="elec-tips">
                    <li>استبدل المكيفات القديمة بأخرى ذات كفاءة 5 نجوم (توفر حتى 40%)</li>
                    <li>اضبط الحرارة على 24°م بدلاً من 20°م (توفر 8% لكل درجة)</li>
                    <li>استخدم طباخ الغاز بدلاً من الكهربائي</li>
                  </ul>
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة فاتورة الكهرباء"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — قد تختلف بسبب التعديلات الحكومية أو التقريب.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Lightning size={28} weight="duotone" />
              <p>أدخل استهلاك الشهر بالكيلوواط ساعة لحساب الفاتورة التقديرية.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
