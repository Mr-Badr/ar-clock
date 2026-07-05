"use client";

import { useMemo, useState } from 'react';
import { House, Info, Warning } from '@phosphor-icons/react';
import {
  DOWN_PAYMENT_OPTIONS,
  LOAN_TERMS,
  calcMonthlyPayment,
  calcMortgageAffordability,
  calcMortgageInstallment,
} from '@/lib/calculators/mortgage';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

function fmt(n) { return Math.round(n).toLocaleString('ar-SA-u-nu-latn'); }

const MODES = [
  { value: 'installment',   label: 'القسط الشهري',    sub: 'أعرف سعر العقار' },
  { value: 'affordability', label: 'قدرة الاقتراض',   sub: 'كم يعطيني راتبي؟' },
];

export default function SaudiMortgageCalculator() {
  const [mode,              setMode]              = useState('installment');
  const [propertyPrice,     setPropertyPrice]     = useState('600000');
  const [downPaymentPct,    setDownPaymentPct]    = useState('20');
  const [annualRate,        setAnnualRate]        = useState([4.5]);
  const [termYears,         setTermYears]         = useState('20');
  const [salary,            setSalary]            = useState('12000');
  const [obligations,       setObligations]       = useState('0');
  const [hasHousingSupport, setHasHousingSupport] = useState(false);

  const installmentResult = useMemo(
    () => calcMortgageInstallment({
      propertyPrice,
      downPaymentPct,
      annualRatePct: annualRate[0],
      termYears,
    }),
    [propertyPrice, downPaymentPct, annualRate, termYears],
  );

  const affordabilityResult = useMemo(
    () => calcMortgageAffordability({
      salary,
      obligations,
      annualRatePct: annualRate[0],
      termYears,
      hasHousingSupport,
      downPaymentPct,
    }),
    [salary, obligations, annualRate, termYears, hasHousingSupport, downPaymentPct],
  );

  const result = mode === 'installment' ? installmentResult : affordabilityResult;

  const shareText = (mode === 'installment' && installmentResult.isValid)
    ? `حاسبة التمويل العقاري (السعودية):\nسعر العقار: ${fmt(installmentResult.propertyPrice)} ر.س\nالقسط الشهري: ${fmt(installmentResult.monthly)} ر.س\nمعدل الربح: ${installmentResult.annualRatePct}% · ${installmentResult.termYears} سنة`
    : (mode === 'affordability' && affordabilityResult.isValid)
    ? `قدرة الاقتراض:\nأقصى تمويل: ${fmt(affordabilityResult.maxLoan)} ر.س\nأقصى قيمة عقار: ${fmt(affordabilityResult.maxProperty)} ر.س`
    : '';

  return (
    <div className="calc-app mortgage-tool" aria-label="حاسبة التمويل العقاري السعودية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Mode selector */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>ما الذي تريد حسابه؟</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      className={`ci-coverage-tab${mode === m.value ? ' is-active' : ''}`}
                      onClick={() => setMode(m.value)}
                      type="button"
                    >
                      <span className="ci-tab-label">{m.label}</span>
                      <span className="ci-tab-sub">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment mode inputs */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label htmlFor="m-price">سعر العقار</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input
                      id="m-price"
                      inputMode="numeric"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)}
                      placeholder="600000"
                    />
                    <span className="calc-esb-currency">ر.س</span>
                  </div>
                </div>
              )}

              {/* Affordability mode inputs */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label htmlFor="m-salary">الراتب الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input
                        id="m-salary"
                        inputMode="numeric"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="12000"
                      />
                      <span className="calc-esb-currency">ر.س</span>
                    </div>
                  </div>

                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label htmlFor="m-obs">التزامات قائمة (أقساط شهرية حالية)</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input
                        id="m-obs"
                        inputMode="numeric"
                        value={obligations}
                        onChange={(e) => setObligations(e.target.value)}
                        placeholder="0"
                      />
                      <span className="calc-esb-currency">ر.س</span>
                    </div>
                    <p className="calc-hint">أقساط سيارة، قرض شخصي، بطاقات ائتمان — أي التزام شهري منتظم.</p>
                  </div>

                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">4</span>
                      <Label>الدعم السكني</Label>
                    </div>
                    <div className="ci-coverage-tabs">
                      {[
                        { value: false, label: 'بدون دعم', sub: 'نسبة التحمل 33%' },
                        { value: true,  label: 'مع الدعم السكني', sub: 'نسبة التحمل 45%' },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          className={`ci-coverage-tab${hasHousingSupport === opt.value ? ' is-active' : ''}`}
                          onClick={() => setHasHousingSupport(opt.value)}
                          type="button"
                        >
                          <span className="ci-tab-label">{opt.label}</span>
                          <span className="ci-tab-sub">{opt.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Shared: down payment */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '3' : '5'}</span>
                  <Label>نسبة الدفعة الأولى</Label>
                </div>
                <Select value={String(downPaymentPct)} onValueChange={setDownPaymentPct}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOWN_PAYMENT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shared: profit rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '4' : '6'}</span>
                  <Label>هامش الربح السنوي — <strong>{annualRate[0]}%</strong></Label>
                </div>
                <Slider
                  className="calc-slider"
                  min={2}
                  max={9}
                  step={0.25}
                  value={annualRate}
                  onValueChange={setAnnualRate}
                />
                <p className="calc-hint">متوسط السوق السعودي 2024: 4 – 6% (يتفاوت بين البنوك).</p>
              </div>

              {/* Shared: term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '5' : '7'}</span>
                  <Label>مدة التمويل</Label>
                </div>
                <Select value={String(termYears)} onValueChange={setTermYears}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LOAN_TERMS.map((t) => (
                      <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--sa">🇸🇦 السعودية</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {mode === 'installment' && installmentResult.isValid && (
                <>
                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <div className="calc-esb-amount-value">{fmt(installmentResult.monthly)} ر.س</div>
                    <div className="calc-esb-amount-meta">
                      <span>مدة التمويل: {installmentResult.termYears} سنة · هامش ربح: {installmentResult.annualRatePct}%</span>
                    </div>
                  </div>

                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow">
                      <span>سعر العقار</span>
                      <strong>{fmt(installmentResult.propertyPrice)} ر.س</strong>
                    </div>
                    <div className="calc-esb-brow">
                      <span>الدفعة الأولى ({installmentResult.dpPct}%)</span>
                      <strong>{fmt(installmentResult.downPayment)} ر.س</strong>
                    </div>
                    <div className="calc-esb-brow">
                      <span>مبلغ التمويل</span>
                      <strong>{fmt(installmentResult.loanAmount)} ر.س</strong>
                    </div>
                    <div className="calc-esb-brow">
                      <span>إجمالي المدفوعات ({installmentResult.termYears}×12 قسطاً)</span>
                      <strong>{fmt(installmentResult.totalPayments)} ر.س</strong>
                    </div>
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>إجمالي هامش الربح</span>
                      <strong>{fmt(installmentResult.totalProfit)} ر.س</strong>
                    </div>
                  </div>

                  {/* Rate sensitivity strip */}
                  <div className="m-rate-strip">
                    <div className="ci-factors-title">تأثير تغيير هامش الربح على القسط</div>
                    {[
                      annualRate[0] - 1,
                      annualRate[0],
                      annualRate[0] + 1,
                    ].filter((r) => r > 0 && r <= 12).map((r) => (
                      <div key={r} className={`ci-factor-row${r === annualRate[0] ? ' ci-compare-active' : ''}`}>
                        <span className="ci-factor-label">{r}% هامش</span>
                        <span className="ci-factor-effect">
                          {fmt(calcMonthlyPayment(installmentResult.loanAmount, r, installmentResult.termYears))} ر.س/شهر
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {mode === 'affordability' && affordabilityResult.isValid && (
                <>
                  {affordabilityResult.maxLoan <= 0 ? (
                    <div className="eg-zero-notice">
                      <Warning size={22} weight="fill" />
                      <div>
                        <strong>التزاماتك الحالية تستنفد كامل حدود DBR</strong>
                        <span>لا يوجد هامش لقسط تمويل إضافي بالراتب والالتزامات المدخلة.</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="calc-esb-amount-hero">
                        <span className="calc-esb-amount-label">أقصى قيمة عقار يمكنك شراؤه</span>
                        <div className="calc-esb-amount-value">{fmt(affordabilityResult.maxProperty)} ر.س</div>
                        <div className="calc-esb-amount-meta">
                          <span>أقصى تمويل: {fmt(affordabilityResult.maxLoan)} ر.س</span>
                        </div>
                      </div>

                      <div className="calc-esb-breakdown">
                        <div className="calc-esb-brow">
                          <span>الراتب الشهري</span>
                          <strong>{fmt(affordabilityResult.salary)} ر.س</strong>
                        </div>
                        <div className="calc-esb-brow">
                          <span>التزامات قائمة</span>
                          <strong>{fmt(affordabilityResult.obligations)} ر.س</strong>
                        </div>
                        <div className="calc-esb-brow">
                          <span>نسبة DBR ({(affordabilityResult.dbrCap * 100).toFixed(0)}%)</span>
                          <strong>أقصى قسط = {fmt(affordabilityResult.maxMonthly)} ر.س/شهر</strong>
                        </div>
                        <div className="calc-esb-brow">
                          <span>مدة التمويل · هامش الربح</span>
                          <strong>{affordabilityResult.termYears} سنة · {affordabilityResult.rate}%</strong>
                        </div>
                        <div className="calc-esb-brow calc-esb-brow--total">
                          <span>أقصى تمويل ممكن</span>
                          <strong>{fmt(affordabilityResult.maxLoan)} ر.س</strong>
                        </div>
                      </div>

                      <div className="ci-factors" style={{ marginTop: 'var(--spacing-3)' }}>
                        <div className="ci-factors-title">
                          <Info size={13} /> ما هو DBR؟
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                          نسبة عبء الدين (Debt Burden Ratio) — الحد الذي يفرضه ساما على البنوك:
                          لا يتجاوز مجموع الأقساط الشهرية {affordabilityResult.dbrCap * 100}% من راتبك.
                          {hasHousingSupport && ' المستفيد من الدعم السكني يحظى بنسبة أعلى (45%).'}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة التمويل العقاري السعودية"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — ارجع إلى البنك أو برنامج الدعم السكني للحصول على عرض رسمي.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <House size={32} weight="duotone" />
              <p>
                {mode === 'installment'
                  ? 'أدخل سعر العقار لعرض القسط الشهري.'
                  : 'أدخل راتبك لحساب قدرة الاقتراض.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
