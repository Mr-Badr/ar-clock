"use client";

import { useMemo, useState } from 'react';
import { House, Info, Warning } from '@phosphor-icons/react';
import {
  QATAR_BORROWER_TYPES_MORTGAGE,
  QATAR_PROPERTY_TYPES_MORTGAGE,
  QATAR_MORTGAGE_TERMS,
  calcQatarMortgageInstallment,
  calcQatarMortgageAffordability,
  calcMonthlyPayment,
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

function fmt(n) { return Math.round(n).toLocaleString('ar-QA'); }

const MODES = [
  { value: 'installment',   label: 'القسط الشهري',   sub: 'أعرف سعر العقار' },
  { value: 'affordability', label: 'قدرة الاقتراض',  sub: 'كم يعطيني راتبي؟' },
];

const FINANCE_TYPES = [
  { value: 'conventional', label: 'تقليدي (APR متناقص)' },
  { value: 'islamic',      label: 'إسلامي (مرابحة — ربح ثابت)' },
];

export default function QatarMortgageCalculator() {
  const [mode,         setMode]         = useState('installment');
  const [borrowerType, setBorrowerType] = useState('qatari');
  const [propertyType, setPropertyType] = useState('residential');
  const [financeType,  setFinanceType]  = useState('conventional');
  const [propertyValue,setPropertyValue]= useState('1500000');
  const [annualRate,   setAnnualRate]   = useState([4.5]);
  const [termYears,    setTermYears]    = useState('25');
  const [salary,       setSalary]       = useState('20000');
  const [obligations,  setObligations]  = useState('0');

  const selectedBorrower = QATAR_BORROWER_TYPES_MORTGAGE.find((b) => b.value === borrowerType);
  const selectedPropType = QATAR_PROPERTY_TYPES_MORTGAGE.find((p) => p.value === propertyType);

  const installmentResult = useMemo(
    () => calcQatarMortgageInstallment({
      borrowerType, propertyType,
      propertyValue: parseFloat(propertyValue) || 0,
      annualRatePct: annualRate[0],
      termYears: parseInt(termYears),
      financeType,
    }),
    [borrowerType, propertyType, propertyValue, annualRate, termYears, financeType],
  );

  const affordabilityResult = useMemo(
    () => calcQatarMortgageAffordability({
      borrowerType, propertyType,
      salary: parseFloat(salary) || 0,
      obligations: parseFloat(obligations) || 0,
      annualRatePct: annualRate[0],
      termYears: parseInt(termYears),
      financeType,
    }),
    [borrowerType, propertyType, salary, obligations, annualRate, termYears, financeType],
  );

  const result = mode === 'installment' ? installmentResult : affordabilityResult;

  const shareText = (mode === 'installment' && installmentResult.isValid)
    ? `تمويل عقاري قطر — ${selectedPropType?.label} (${selectedBorrower?.label}):\nسعر العقار: ${fmt(installmentResult.propertyValue)} ر.ق\nنسبة LTV: ${Math.round(installmentResult.ltv * 100)}% · دفعة أولى: ${installmentResult.minDownPct}%\nالقسط الشهري: ${fmt(installmentResult.monthly)} ر.ق`
    : '';

  const maxTermForSelection = installmentResult.maxTerm ?? affordabilityResult.maxTerm ?? 30;

  return (
    <div className="calc-app qa-mortgage-tool" aria-label="حاسبة التمويل العقاري قطر">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Mode */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>ما الذي تريد حسابه؟</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {MODES.map((m) => (
                    <button key={m.value} type="button"
                      className={`ci-coverage-tab${mode === m.value ? ' is-active' : ''}`}
                      onClick={() => setMode(m.value)}>
                      <span className="ci-tab-label">{m.label}</span>
                      <span className="ci-tab-sub">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Borrower type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>نوع المقترض</Label>
                </div>
                <div className="hi-levels">
                  {QATAR_BORROWER_TYPES_MORTGAGE.map((b) => (
                    <button key={b.value} type="button"
                      className={`hi-level-card${borrowerType === b.value ? ' is-active' : ''}`}
                      onClick={() => setBorrowerType(b.value)}>
                      <span className="hi-level-label">{b.label}</span>
                      <span className="hi-level-sub">DBR {Math.round(b.dbr * 100)}%</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>نوع العقار</Label>
                </div>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QATAR_PROPERTY_TYPES_MORTGAGE.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Finance type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>نوع التمويل</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {FINANCE_TYPES.map((f) => (
                    <button key={f.value} type="button"
                      className={`ci-coverage-tab${financeType === f.value ? ' is-active' : ''}`}
                      onClick={() => setFinanceType(f.value)}>
                      <span className="ci-tab-label">{f.label}</span>
                    </button>
                  ))}
                </div>
                {financeType === 'islamic' && (
                  <p className="calc-hint"><Info size={11} /> أدخل معدل الربح الثابت. مثال: 2.5% ثابت ≈ 4.5% APR متناقص تقريباً.</p>
                )}
              </div>

              {/* Installment mode: property value */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">5</span>
                    <Label htmlFor="qa-price">سعر العقار</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="qa-price" inputMode="numeric" value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)} placeholder="1500000" />
                    <span className="calc-esb-currency">ر.ق</span>
                  </div>
                  {selectedPropType?.threshold && (
                    <p className="calc-hint">
                      <Info size={11} /> العتبة: {fmt(selectedPropType.threshold)} ر.ق — نسبة LTV تتغير عند تجاوزها.
                    </p>
                  )}
                </div>
              )}

              {/* Affordability mode: salary + obligations */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">5</span>
                      <Label htmlFor="qa-salary">الراتب الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="qa-salary" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="20000" />
                      <span className="calc-esb-currency">ر.ق</span>
                    </div>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">6</span>
                      <Label htmlFor="qa-obs">التزامات شهرية قائمة</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="qa-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">ر.ق</span>
                    </div>
                    <p className="calc-hint">أقساط سيارة، قروض أخرى، بطاقات ائتمان.</p>
                  </div>
                </>
              )}

              {/* Rate slider */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '6' : '7'}</span>
                  <Label>
                    {financeType === 'islamic' ? 'معدل الربح الثابت' : 'معدل الفائدة السنوي (APR)'} —{' '}
                    <strong>{annualRate[0]}%</strong>
                  </Label>
                </div>
                <Slider className="calc-slider" min={2} max={10} step={0.25}
                  value={annualRate} onValueChange={setAnnualRate} />
                <p className="calc-hint">
                  {financeType === 'islamic'
                    ? 'مرابحة قطر: 2.5–4.5% ربح ثابت (QIB، مصرف الريان، بنك بروة)'
                    : 'تمويل تقليدي قطر: QNB 3.45% · CBQ 3.45% · بنك الدوحة 3.99%+متغير'}
                </p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '7' : '8'}</span>
                  <Label>مدة التمويل</Label>
                </div>
                <Select value={String(termYears)} onValueChange={setTermYears}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QATAR_MORTGAGE_TERMS.filter((t) => t.value <= maxTermForSelection).map((t) => (
                      <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {maxTermForSelection < 30 && (
                  <p className="calc-hint">
                    <Info size={11} /> الحد الأقصى لهذا النوع: {maxTermForSelection} سنة وفق لوائح QCB.
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
                <span className="calc-esb-country-badge calc-esb-country-badge--qa">🇶🇦 قطر</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {mode === 'installment' && installmentResult.isValid && (
                <>
                  {/* LTV badge */}
                  <div className="calc-insight-row" style={{ marginBottom: 'var(--space-3)' }}>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">نسبة LTV</span>
                      <span className="calc-insight-value">{Math.round(installmentResult.ltv * 100)}%</span>
                      <span className="calc-insight-sub">QCB 2023</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">دفعة أولى</span>
                      <span className="calc-insight-value">{installmentResult.minDownPct}%</span>
                      <span className="calc-insight-sub">{fmt(installmentResult.minDownPayment)} ر.ق</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">مبلغ التمويل</span>
                      <span className="calc-insight-value">{fmt(installmentResult.maxLoan)}</span>
                      <span className="calc-insight-sub">ر.ق</span>
                    </div>
                  </div>

                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <div className="calc-esb-amount-value">{fmt(installmentResult.monthly)} ر.ق</div>
                    <div className="calc-esb-amount-meta">
                      <span>{installmentResult.termYears} سنة · {installmentResult.annualRatePct}%</span>
                    </div>
                  </div>

                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>سعر العقار</span><strong>{fmt(installmentResult.propertyValue)} ر.ق</strong></div>
                    <div className="calc-esb-brow"><span>الدفعة الأولى ({installmentResult.minDownPct}%)</span><strong>{fmt(installmentResult.minDownPayment)} ر.ق</strong></div>
                    <div className="calc-esb-brow"><span>مبلغ التمويل</span><strong>{fmt(installmentResult.maxLoan)} ر.ق</strong></div>
                    <div className="calc-esb-brow"><span>إجمالي المدفوعات</span><strong>{fmt(installmentResult.totalPayments)} ر.ق</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>إجمالي {financeType === 'islamic' ? 'الربح' : 'الفائدة'}</span>
                      <strong>{fmt(installmentResult.totalProfit)} ر.ق</strong>
                    </div>
                  </div>

                  {/* Rate sensitivity */}
                  <div className="m-rate-strip">
                    <div className="ci-factors-title">تأثير {financeType === 'islamic' ? 'معدل الربح' : 'معدل الفائدة'} على القسط</div>
                    {[annualRate[0] - 0.5, annualRate[0], annualRate[0] + 0.5].filter((r) => r > 0).map((r) => (
                      <div key={r} className={`ci-factor-row ci-factor-row--2col${r === annualRate[0] ? ' ci-compare-active' : ''}`}>
                        <span className="ci-factor-label" style={{ direction: 'ltr', display: 'inline-block' }}>{r}%</span>
                        <span className="ci-factor-effect">
                          {fmt(Math.round(
                            financeType === 'islamic'
                              ? installmentResult.maxLoan * (1 + (r / 100) * installmentResult.termYears) / (installmentResult.termYears * 12)
                              : calcMonthlyPayment(installmentResult.maxLoan, r, installmentResult.termYears)
                          ))} ر.ق/شهر
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
                        <strong>التزاماتك تستنفد حد DBR كاملاً</strong>
                        <span>لا يتبقى هامش لقسط تمويل عقاري إضافي.</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="calc-insight-row" style={{ marginBottom: 'var(--space-3)' }}>
                        <div className="calc-insight-card">
                          <span className="calc-insight-label">حد DBR</span>
                          <span className="calc-insight-value">{Math.round(affordabilityResult.dbr * 100)}%</span>
                          <span className="calc-insight-sub">{borrowerType === 'qatari' ? 'للقطريين' : 'للمقيمين'}</span>
                        </div>
                        <div className="calc-insight-card">
                          <span className="calc-insight-label">نسبة LTV</span>
                          <span className="calc-insight-value">{Math.round(affordabilityResult.ltv * 100)}%</span>
                          <span className="calc-insight-sub">دفعة {affordabilityResult.minDownPct}%</span>
                        </div>
                      </div>

                      <div className="calc-esb-amount-hero">
                        <span className="calc-esb-amount-label">أقصى قيمة عقار يمكنك شراؤه</span>
                        <div className="calc-esb-amount-value">{fmt(affordabilityResult.maxProperty)} ر.ق</div>
                        <div className="calc-esb-amount-meta">
                          <span>أقصى تمويل: {fmt(affordabilityResult.maxLoan)} ر.ق</span>
                        </div>
                      </div>

                      <div className="calc-esb-breakdown">
                        <div className="calc-esb-brow"><span>الراتب الشهري</span><strong>{fmt(affordabilityResult.salary)} ر.ق</strong></div>
                        <div className="calc-esb-brow"><span>التزامات قائمة</span><strong>{fmt(affordabilityResult.obligations)} ر.ق</strong></div>
                        <div className="calc-esb-brow">
                          <span>أقصى قسط شهري (DBR {Math.round(affordabilityResult.dbr * 100)}%)</span>
                          <strong>{fmt(affordabilityResult.maxMonthly)} ر.ق</strong>
                        </div>
                        <div className="calc-esb-brow calc-esb-brow--total">
                          <span>أقصى تمويل ممكن</span>
                          <strong>{fmt(affordabilityResult.maxLoan)} ر.ق</strong>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <ResultActions copyText={shareText} shareTitle="حاسبة التمويل العقاري قطر" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نسب LTV وفق لوائح QCB يوليو 2023. الأرقام تقديرية — احصل على عرض رسمي من بنك قطر الوطني أو بنك الدوحة أو QIB.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <House size={32} weight="duotone" />
              <p>{mode === 'installment' ? 'أدخل سعر العقار لعرض القسط الشهري.' : 'أدخل راتبك لحساب قدرة الاقتراض.'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
