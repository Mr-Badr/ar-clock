"use client";

import { useMemo, useState } from 'react';
import { Buildings, Info, Warning } from '@phosphor-icons/react';
import {
  BAHRAIN_MORTGAGE_BORROWER_TYPES,
  BAHRAIN_MORTGAGE_PROPERTY_TYPES,
  BAHRAIN_MORTGAGE_FINANCE_TYPES,
  BAHRAIN_MORTGAGE_TERMS_NATIONAL,
  BAHRAIN_MORTGAGE_TERMS_EXPAT,
  calcBahrainMortgageInstallment,
  calcBahrainMortgageAffordability,
} from '@/lib/calculators/mortgage';
import { CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

function fmt(n) { return Math.round(n).toLocaleString('ar-BH-u-nu-latn'); }
function fmtBHD(n) { return `${fmt(n)} د.ب`; }

const RATE_MIN  = 3.5;
const RATE_MAX  = 9.0;
const RATE_STEP = 0.25;
const RATE_MARKS = [4.0, 5.0, 6.0, 7.0, 8.0];

export default function BahrainMortgageCalculator() {
  const [mode,         setMode]         = useState('installment');
  const [borrowerType, setBorrowerType] = useState('national');
  const [propertyType, setPropertyType] = useState('residential');
  const [financeType,  setFinanceType]  = useState('conventional');
  const [propertyVal,  setPropertyVal]  = useState('');
  const [termYears,    setTermYears]    = useState('');
  const [ratePct,      setRatePct]      = useState(5.5);
  const [salary,       setSalary]       = useState('');
  const [obligations,  setObligations]  = useState('0');

  const borrower = BAHRAIN_MORTGAGE_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? BAHRAIN_MORTGAGE_BORROWER_TYPES[0];
  const terms    = borrowerType === 'national' ? BAHRAIN_MORTGAGE_TERMS_NATIONAL : BAHRAIN_MORTGAGE_TERMS_EXPAT;
  const defaultTerm = borrower.maxTerm;

  const instResult = useMemo(
    () => mode === 'installment' ? calcBahrainMortgageInstallment({
      borrowerType, propertyType,
      propertyValue: propertyVal,
      annualRatePct: ratePct,
      termYears: termYears || defaultTerm,
      financeType,
    }) : { isValid: false },
    [mode, borrowerType, propertyType, propertyVal, ratePct, termYears, financeType, defaultTerm],
  );

  const affordResult = useMemo(
    () => mode === 'affordability' ? calcBahrainMortgageAffordability({
      borrowerType, propertyType, salary, obligations,
      annualRatePct: ratePct,
      termYears: termYears || defaultTerm,
      financeType,
    }) : { isValid: false },
    [mode, borrowerType, propertyType, salary, obligations, ratePct, termYears, financeType, defaultTerm],
  );

  const result = mode === 'installment' ? instResult : affordResult;

  const shareText = result.isValid
    ? mode === 'installment'
      ? `تمويل عقاري البحرين:\nقيمة العقار: ${fmtBHD(instResult.propertyValue)}\nالقسط الشهري: ${fmtBHD(instResult.monthly)}\nنسبة LTV: ${instResult.ltvPct}%`
      : `تمويل عقاري البحرين:\nأقصى تمويل: ${fmtBHD(affordResult.maxLoan)}\nأقصى عقار: ${fmtBHD(affordResult.maxProperty)}`
    : '';

  return (
    <div className="calc-app bh-mortgage-tool" aria-label="حاسبة التمويل العقاري البحرين">
      <div className="calc-esb-layout">

        {/* ── FORM ───────────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Mode toggle */}
              <div className="calc-esb-field">
                <div className="ci-mode-tabs">
                  {[
                    { value: 'installment',  label: 'حساب القسط',       sub: 'من قيمة العقار' },
                    { value: 'affordability',label: 'ما قيمة العقار الذي أستطيع شراءه؟', sub: 'من الراتب' },
                  ].map((m) => (
                    <button key={m.value} type="button"
                      className={`ci-mode-tab${mode === m.value ? ' is-active' : ''}`}
                      onClick={() => setMode(m.value)}
                    >
                      <span className="ci-mode-label">{m.label}</span>
                      <span className="ci-mode-sub">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Borrower type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع المقترض</Label>
                </div>
                <div className="hi-levels">
                  {BAHRAIN_MORTGAGE_BORROWER_TYPES.map((b) => (
                    <button key={b.value} type="button"
                      className={`hi-level-card${borrowerType === b.value ? ' is-active' : ''}`}
                      onClick={() => { setBorrowerType(b.value); setTermYears(''); }}
                    >
                      <span className="hi-level-label">{b.label}</span>
                      <span className="hi-level-sub">LTV {Math.round(b.ltv * 100)}% · {b.maxTerm} سنة</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>نوع العقار</Label>
                </div>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BAHRAIN_MORTGAGE_PROPERTY_TYPES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {propertyType !== 'residential' && (
                  <p className="calc-hint ci-hint-warning">
                    <Info size={11} /> نسبة LTV أقل للعقارات الاستثمارية وتحت الإنشاء.
                  </p>
                )}
              </div>

              {/* Finance type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>نوع التمويل</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {BAHRAIN_MORTGAGE_FINANCE_TYPES.map((f) => (
                    <button key={f.value} type="button"
                      className={`ci-coverage-tab${financeType === f.value ? ' is-active' : ''}`}
                      onClick={() => setFinanceType(f.value)}
                    >
                      <span className="ci-tab-label">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment mode inputs */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">4</span>
                    <Label>قيمة العقار (د.ب)</Label>
                  </div>
                  <Input
                    type="number" inputMode="numeric" placeholder="مثال: 80000"
                    value={propertyVal} onChange={(e) => setPropertyVal(e.target.value)}
                    min="0"
                  />
                </div>
              )}

              {/* Affordability mode inputs */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">4</span>
                      <Label>الراتب الشهري الصافي (د.ب)</Label>
                    </div>
                    <Input
                      type="number" inputMode="numeric" placeholder="مثال: 1500"
                      value={salary} onChange={(e) => setSalary(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">5</span>
                      <Label>الأقساط الشهرية الحالية (د.ب)</Label>
                    </div>
                    <Input
                      type="number" inputMode="numeric" placeholder="0"
                      value={obligations} onChange={(e) => setObligations(e.target.value)}
                      min="0"
                    />
                    <p className="calc-hint">قروض، سيارة، بطاقات — النسبة المالية CBB: {Math.round(borrower.dbr * 100)}%</p>
                  </div>
                </>
              )}

              {/* Rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? 5 : 6}</span>
                  <Label>
                    معدل الفائدة السنوي
                    {financeType === 'islamic' ? ' (هامش الربح)' : ''}: <strong style={{ direction: 'ltr', display: 'inline-block' }}>{ratePct}%</strong>
                  </Label>
                </div>
                <Slider
                  min={RATE_MIN} max={RATE_MAX} step={RATE_STEP}
                  value={[ratePct]} onValueChange={([v]) => setRatePct(v)}
                />
                <div className="ci-slider-marks">
                  {RATE_MARKS.map((m) => (
                    <span key={m} style={{ direction: 'ltr' }}>{m}%</span>
                  ))}
                </div>
                <p className="calc-hint">
                  <Info size={11} /> البنوك الكبرى في البحرين: BBK وNBB وAhli United — معدلات 2024–2025.
                </p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? 6 : 7}</span>
                  <Label>مدة التمويل</Label>
                </div>
                <Select value={termYears || String(defaultTerm)} onValueChange={setTermYears}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {terms.map((t) => (
                      <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ─────────────────────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--bh">🇧🇭 البحرين</span>
                <span className="calc-esb-live-dot bh-loan-tool" aria-hidden="true" />
              </div>

              {/* Installment result */}
              {mode === 'installment' && instResult.isValid && (
                <>
                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <span className="calc-amount-value">{fmt(instResult.monthly)}</span>
                    <div className="calc-esb-amount-meta"><span>د.ب / شهرياً</span></div>
                  </div>

                  <div className="calc-insight-row">
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">نسبة LTV</span>
                      <span className="calc-insight-value">{instResult.ltvPct}%</span>
                      <span className="calc-insight-sub">من القيمة</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">الدفعة الأولى</span>
                      <span className="calc-insight-value">{instResult.minDownPct}%</span>
                      <span className="calc-insight-sub">{fmtBHD(instResult.minDownPayment)}</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">مبلغ التمويل</span>
                      <span className="calc-insight-value">{fmt(instResult.maxLoan)}</span>
                      <span className="calc-insight-sub">د.ب</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">إجمالي الفوائد</span>
                      <span className="calc-insight-value">{fmt(instResult.totalProfit)}</span>
                      <span className="calc-insight-sub">د.ب</span>
                    </div>
                  </div>

                  <div className="calc-result-sec-title">ملخص التمويل</div>
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>قيمة العقار</span><strong>{fmtBHD(instResult.propertyValue)}</strong></div>
                    <div className="calc-esb-brow"><span>نسبة LTV (CBB)</span><strong>{instResult.ltvPct}%</strong></div>
                    <div className="calc-esb-brow"><span>الدفعة الأولى</span><strong>{fmtBHD(instResult.minDownPayment)}</strong></div>
                    <div className="calc-esb-brow"><span>مبلغ التمويل</span><strong>{fmtBHD(instResult.maxLoan)}</strong></div>
                    <div className="calc-esb-brow"><span>معدل الفائدة</span><strong style={{ direction: 'ltr' }}>{instResult.annualRatePct}%</strong></div>
                    <div className="calc-esb-brow"><span>المدة</span><strong>{instResult.termYears} سنة</strong></div>
                    <div className="calc-esb-brow"><span>إجمالي {financeType === 'islamic' ? 'هامش الربح' : 'الفوائد'}</span><strong>{fmtBHD(instResult.totalProfit)}</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>إجمالي المدفوعات</span><strong>{fmtBHD(instResult.totalPayments)}</strong></div>
                  </div>
                </>
              )}

              {/* Affordability result */}
              {mode === 'affordability' && affordResult.isValid && (
                <>
                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">أقصى تمويل ممكن</span>
                    <span className="calc-amount-value">{fmt(affordResult.maxLoan)}</span>
                    <div className="calc-esb-amount-meta"><span>د.ب</span></div>
                  </div>

                  <div className="calc-insight-row">
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">أقصى قيمة عقار</span>
                      <span className="calc-insight-value">{fmt(affordResult.maxProperty)}</span>
                      <span className="calc-insight-sub">د.ب</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">الدفعة الأولى المطلوبة</span>
                      <span className="calc-insight-value">{affordResult.minDownPct}%</span>
                      <span className="calc-insight-sub">{fmtBHD(affordResult.maxProperty - affordResult.maxLoan)}</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">أقصى قسط شهري</span>
                      <span className="calc-insight-value">{fmt(affordResult.maxMonthly)}</span>
                      <span className="calc-insight-sub">د.ب (DBR {Math.round(affordResult.dbr * 100)}%)</span>
                    </div>
                  </div>

                  <div className="calc-result-sec-title">تفاصيل الأهلية</div>
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>الراتب الصافي</span><strong>{fmtBHD(affordResult.salary)}</strong></div>
                    <div className="calc-esb-brow"><span>الأقساط الحالية</span><strong>{fmtBHD(affordResult.obligations)}</strong></div>
                    <div className="calc-esb-brow"><span>نسبة DBR (CBB)</span><strong>{Math.round(affordResult.dbr * 100)}%</strong></div>
                    <div className="calc-esb-brow"><span>أقصى قسط مسموح</span><strong>{fmtBHD(affordResult.maxMonthly)}</strong></div>
                    <div className="calc-esb-brow"><span>نسبة LTV المطبّقة</span><strong>{affordResult.ltvPct}%</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>أقصى تمويل</span><strong>{fmtBHD(affordResult.maxLoan)}</strong></div>
                  </div>
                </>
              )}

              {/* Rate sensitivity strip */}
              <div className="m-rate-strip">
                <div className="ci-factors-title">مقارنة معدلات الفائدة</div>
                {[-1, 0, 1].map((delta) => {
                  const r = Math.max(RATE_MIN, Math.min(RATE_MAX, ratePct + delta * 0.5));
                  if (mode === 'installment' && instResult.isValid) {
                    const m = calcBahrainMortgageInstallment({
                      borrowerType, propertyType, propertyValue: propertyVal,
                      annualRatePct: r, termYears: termYears || defaultTerm, financeType,
                    });
                    return m.isValid ? (
                      <div key={r} className={`ci-factor-row ci-factor-row--2col${delta === 0 ? ' is-active' : ''}`}>
                        <span className="ci-factor-label" style={{ direction: 'ltr' }}>{r}%</span>
                        <span className="ci-factor-value">{fmtBHD(m.monthly)} / شهر</span>
                      </div>
                    ) : null;
                  }
                  if (mode === 'affordability' && affordResult.isValid) {
                    const a = calcBahrainMortgageAffordability({
                      borrowerType, propertyType, salary, obligations,
                      annualRatePct: r, termYears: termYears || defaultTerm, financeType,
                    });
                    return a.isValid ? (
                      <div key={r} className={`ci-factor-row ci-factor-row--2col${delta === 0 ? ' is-active' : ''}`}>
                        <span className="ci-factor-label" style={{ direction: 'ltr' }}>{r}%</span>
                        <span className="ci-factor-value">تمويل {fmtBHD(a.maxLoan)}</span>
                      </div>
                    ) : null;
                  }
                  return null;
                })}
              </div>

              <ResultActions copyText={shareText} shareTitle="حاسبة التمويل العقاري البحرين" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>الأرقام استرشادية وفق قواعد CBB — التمويل الفعلي يخضع للموافقة البنكية والتقييم العقاري.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Buildings size={32} weight="duotone" />
              <p>أدخل بيانات العقار أو الراتب لعرض نتيجة التمويل.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
