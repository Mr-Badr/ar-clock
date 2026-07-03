"use client";

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Car, CheckCircle, Info, Warning } from '@phosphor-icons/react';
import {
  NO_CLAIM_DISCOUNTS,
  UAE_CITY_FACTORS,
  UAE_COMP_RATES_BY_AGE,
  UAE_DRIVER_AGE_BANDS,
  estimateUaeCarInsurancePremium,
  getUaePriceFactors,
} from '@/lib/calculators/car-insurance';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const CAR_AGE_OPTIONS = [
  { value: 'new',  label: 'جديدة (سنة أو أقل)' },
  { value: '1-3',  label: '1 – 3 سنوات' },
  { value: '4-6',  label: '4 – 6 سنوات' },
  { value: '7+',   label: '7 سنوات فأكثر' },
];

export default function UaeCarInsuranceCalculator() {
  const [coverageType, setCoverageType] = useState('third-party');
  const [carValue,     setCarValue]     = useState('80000');
  const [carAge,       setCarAge]       = useState('new');
  const [driverAge,    setDriverAge]    = useState('31-45');
  const [city,         setCity]         = useState('dubai');
  const [noClaimYears, setNoClaimYears] = useState('0');

  const result = useMemo(
    () => estimateUaeCarInsurancePremium({ coverageType, carValue, carAge, driverAge, city, noClaimYears }),
    [coverageType, carValue, carAge, driverAge, city, noClaimYears],
  );

  const factors = useMemo(
    () => getUaePriceFactors({ coverageType, carValue, carAge, driverAge, city, noClaimYears }),
    [coverageType, carValue, carAge, driverAge, city, noClaimYears],
  );

  const shareText = result.isValid
    ? `تأمين السيارة (الإمارات) — تقدير:\n${coverageType === 'third-party' ? 'ضد الغير' : 'شامل'}: ${result.low.toLocaleString('ar-AE')} – ${result.high.toLocaleString('ar-AE')} د.إ سنوياً`
    : '';

  const stepOffset = coverageType === 'comprehensive' ? 1 : 0;

  return (
    <div className="calc-app uae-car-insurance-tool" aria-label="حاسبة تأمين السيارة الإمارات">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Coverage type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع التأمين</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: 'third-party',  label: 'ضد الغير',  sub: '650 – 2,500 د.إ' },
                    { value: 'comprehensive', label: 'شامل',       sub: '1,800 – 8,000+ د.إ' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`ci-coverage-tab${coverageType === opt.value ? ' is-active' : ''}`}
                      onClick={() => setCoverageType(opt.value)}
                      type="button"
                    >
                      <span className="ci-tab-label">{opt.label}</span>
                      <span className="ci-tab-sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Car value — comprehensive only */}
              {coverageType === 'comprehensive' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label htmlFor="uci-car-value">قيمة السيارة السوقية</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input
                      id="uci-car-value"
                      inputMode="numeric"
                      value={carValue}
                      onChange={(e) => setCarValue(e.target.value)}
                      placeholder="80000"
                    />
                    <span className="calc-esb-currency">د.إ</span>
                  </div>
                  <p className="calc-hint">القيمة السوقية الحالية — ليس سعر الشراء الأصلي.</p>
                </div>
              )}

              {/* Car age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{1 + stepOffset + 1}</span>
                  <Label>عمر السيارة</Label>
                </div>
                <Select value={carAge} onValueChange={setCarAge}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CAR_AGE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver age */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{2 + stepOffset + 1}</span>
                  <Label>عمر السائق الرئيسي</Label>
                </div>
                <Select value={driverAge} onValueChange={setDriverAge}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UAE_DRIVER_AGE_BANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {driverAge === '18-21' && (
                  <p className="calc-hint ci-hint-warning">السائقون 18–21 يدفعون 2–2.5× المتوسط في الإمارات.</p>
                )}
              </div>

              {/* Emirate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{3 + stepOffset + 1}</span>
                  <Label>الإمارة</Label>
                </div>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(UAE_CITY_FACTORS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* No-claim */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{4 + stepOffset + 1}</span>
                  <Label>سنوات بدون مطالبات</Label>
                </div>
                <Select value={noClaimYears} onValueChange={setNoClaimYears}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(NO_CLAIM_DISCOUNTS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {NO_CLAIM_DISCOUNTS[noClaimYears]?.discount > 0 && (
                  <p className="calc-hint">
                    خصم {NO_CLAIM_DISCOUNTS[noClaimYears].discount * 100}% على قسطك بفضل سجلك النظيف.
                  </p>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--ae">🇦🇪 الإمارات</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">
                  {coverageType === 'third-party' ? 'تأمين ضد الغير' : 'تأمين شامل'} — تقدير سنوي
                </span>
                <div className="ci-range-display">
                  <span className="ci-range-low">{result.low.toLocaleString('ar-AE')}</span>
                  <span className="ci-range-sep">–</span>
                  <span className="ci-range-high">{result.high.toLocaleString('ar-AE')}</span>
                  <span className="ci-range-unit">د.إ</span>
                </div>
                <div className="calc-esb-amount-meta">
                  <span>
                    شهرياً: {Math.round(result.low / 12).toLocaleString('ar-AE')} –{' '}
                    {Math.round(result.high / 12).toLocaleString('ar-AE')} د.إ
                  </span>
                </div>
              </div>

              {/* Price factors */}
              {factors.length > 0 && (
                <div className="ci-factors">
                  <div className="ci-factors-title">العوامل المؤثرة في سعرك</div>
                  {factors.map((f, i) => (
                    <div key={i} className="ci-factor-row">
                      <span className={`ci-factor-icon ci-factor-icon--${f.icon}`}>
                        {f.icon === 'up'   && <ArrowUp    size={13} weight="bold" />}
                        {f.icon === 'down' && <ArrowDown  size={13} weight="bold" />}
                        {f.icon === 'ok'   && <CheckCircle size={13} weight="bold" />}
                        {f.icon === 'info' && <Info        size={13} weight="bold" />}
                      </span>
                      <span className="ci-factor-label">{f.label}</span>
                      <span className="ci-factor-effect">{f.effect}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TP vs Comprehensive comparison */}
              <div className="ci-compare-strip">
                <div className="ci-compare-row ci-compare-header">
                  <span>النوع</span><span>تقدير سنوي</span><span>شهرياً</span>
                </div>
                <div className={`ci-compare-row${coverageType === 'third-party' ? ' ci-compare-active' : ''}`}>
                  <span>ضد الغير</span>
                  <span>650 – 2,500 د.إ</span>
                  <span>54 – 208 د.إ</span>
                </div>
                <div className={`ci-compare-row${coverageType === 'comprehensive' ? ' ci-compare-active' : ''}`}>
                  <span>شامل</span>
                  <span>1,800 – 8,000+ د.إ</span>
                  <span>150 – 667 د.إ</span>
                </div>
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة تأمين السيارة الإمارات"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>تقدير استرشادي — احصل على عروض فعلية من شركات التأمين المعتمدة لدى هيئة التأمين الإماراتية.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Car size={32} weight="duotone" />
              <p>
                {coverageType === 'comprehensive'
                  ? 'أدخل قيمة السيارة للحصول على تقدير.'
                  : 'اختر بيانات السيارة والسائق لعرض التقدير.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
