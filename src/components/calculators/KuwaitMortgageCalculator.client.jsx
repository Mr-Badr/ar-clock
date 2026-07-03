"use client";

import { useMemo, useState } from 'react';
import { House, Info, Warning } from '@phosphor-icons/react';
import {
  KUWAIT_FINANCE_TYPES,
  KUWAIT_HOUSING_TERMS,
  calcKuwaitHousingInstallment,
  calcKuwaitHousingAffordability,
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

function fmt(n) { return Math.round(n).toLocaleString('ar-KW'); }

const MODES = [
  { value: 'installment',   label: 'القسط الشهري',   sub: 'أعرف مبلغ التمويل' },
  { value: 'affordability', label: 'قدرة الاقتراض',  sub: 'كم يعطيني راتبي؟' },
];

const BORROWER_TYPES = [
  { value: 'national', label: 'مواطن كويتي', sub: 'يحق له برنامج KCB أيضاً' },
  { value: 'gcc',      label: 'مواطن خليجي', sub: 'بنوك تجارية' },
  { value: 'expat',    label: 'وافد مقيم',   sub: '10 سنوات إقامة للتملك' },
];

const KW_MAX = 70000;

export default function KuwaitMortgageCalculator() {
  const [mode,         setMode]         = useState('installment');
  const [borrowerType, setBorrowerType] = useState('national');
  const [financeType,  setFinanceType]  = useState('conventional');
  const [loanAmount,   setLoanAmount]   = useState('50000');
  const [annualRate,   setAnnualRate]   = useState([5.5]);
  const [termMonths,   setTermMonths]   = useState('180');
  const [salary,       setSalary]       = useState('1200');
  const [obligations,  setObligations]  = useState('0');

  const installmentResult = useMemo(
    () => calcKuwaitHousingInstallment({
      loanAmount: parseFloat(loanAmount) || 0,
      annualRatePct: annualRate[0],
      termMonths: parseInt(termMonths),
      financeType,
    }),
    [loanAmount, annualRate, termMonths, financeType],
  );

  const affordabilityResult = useMemo(
    () => calcKuwaitHousingAffordability({
      salary: parseFloat(salary) || 0,
      obligations: parseFloat(obligations) || 0,
      annualRatePct: annualRate[0],
      termMonths: parseInt(termMonths),
      financeType,
    }),
    [salary, obligations, annualRate, termMonths, financeType],
  );

  const result = mode === 'installment' ? installmentResult : affordabilityResult;

  // KCB 0% comparison for nationals
  const kcbMonthly = borrowerType === 'national' && installmentResult.isValid
    ? Math.round(Math.min(installmentResult.loanAmount, KW_MAX) / (parseInt(termMonths) || 180))
    : null;

  const shareText = (mode === 'installment' && installmentResult.isValid)
    ? `تمويل سكني الكويت:\nمبلغ التمويل: ${fmt(installmentResult.loanAmount)} د.ك\nالقسط الشهري: ${fmt(installmentResult.monthly)} د.ك\nالمدة: ${Math.round(installmentResult.termMonths / 12)} سنة`
    : '';

  return (
    <div className="calc-app kw-mortgage-tool" aria-label="حاسبة التمويل العقاري الكويت">
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
                  {BORROWER_TYPES.map((b) => (
                    <button key={b.value} type="button"
                      className={`hi-level-card${borrowerType === b.value ? ' is-active' : ''}`}
                      onClick={() => setBorrowerType(b.value)}>
                      <span className="hi-level-label">{b.label}</span>
                      <span className="hi-level-sub">{b.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Finance type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>نوع التمويل</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {KUWAIT_FINANCE_TYPES.map((f) => (
                    <button key={f.value} type="button"
                      className={`ci-coverage-tab${financeType === f.value ? ' is-active' : ''}`}
                      onClick={() => setFinanceType(f.value)}>
                      <span className="ci-tab-label">{f.label}</span>
                    </button>
                  ))}
                </div>
                {financeType === 'islamic' && (
                  <p className="calc-hint"><Info size={11} /> مرابحة — أدخل نسبة الربح الثابتة (KFH، بوبيان، وربة، KIB).</p>
                )}
              </div>

              {/* Installment mode */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">4</span>
                    <Label htmlFor="kw-loan">مبلغ التمويل</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="kw-loan" inputMode="numeric" value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)} placeholder="50000" />
                    <span className="calc-esb-currency">د.ك</span>
                  </div>
                  <p className="calc-hint">الحد الأقصى للبنوك التجارية: {fmt(KW_MAX)} د.ك (بنك الكويت المركزي).</p>
                </div>
              )}

              {/* Affordability mode */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">4</span>
                      <Label htmlFor="kw-salary">الراتب الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="kw-salary" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="1200" />
                      <span className="calc-esb-currency">د.ك</span>
                    </div>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">5</span>
                      <Label htmlFor="kw-obs">التزامات شهرية قائمة</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="kw-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">د.ك</span>
                    </div>
                    <p className="calc-hint">أقساط سيارة، قروض أخرى، أي التزام شهري.</p>
                  </div>
                </>
              )}

              {/* Rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '5' : '6'}</span>
                  <Label>
                    {financeType === 'islamic' ? 'نسبة الربح السنوية' : 'معدل الفائدة السنوي'} —{' '}
                    <strong>{annualRate[0]}%</strong>
                  </Label>
                </div>
                <Slider className="calc-slider" min={2} max={10} step={0.25}
                  value={annualRate} onValueChange={setAnnualRate} />
                <p className="calc-hint">سوق الكويت 2025: 5.5–7.5% تقليدي · KFH مرابحة: حوالي 4–6% ربح</p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '6' : '7'}</span>
                  <Label>مدة التمويل</Label>
                </div>
                <Select value={String(termMonths)} onValueChange={setTermMonths}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KUWAIT_HOUSING_TERMS.map((t) => (
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
                <span className="calc-esb-country-badge calc-esb-country-badge--kw">🇰🇼 الكويت</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {mode === 'installment' && installmentResult.isValid && (
                <>
                  {installmentResult.cappedAtMax && (
                    <div className="calc-esb-cap-notice">
                      <Info size={13} />
                      <span>تم تحديد المبلغ عند الحد الأقصى CBK: {fmt(KW_MAX)} د.ك</span>
                    </div>
                  )}

                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <div className="calc-esb-amount-value">{fmt(installmentResult.monthly)} د.ك</div>
                    <div className="calc-esb-amount-meta">
                      <span>{Math.round(installmentResult.termMonths / 12)} سنة · {installmentResult.annualRatePct}%</span>
                    </div>
                  </div>

                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>مبلغ التمويل</span><strong>{fmt(installmentResult.loanAmount)} د.ك</strong></div>
                    <div className="calc-esb-brow"><span>إجمالي المدفوعات</span><strong>{fmt(installmentResult.totalPayments)} د.ك</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total">
                      <span>إجمالي {financeType === 'islamic' ? 'الربح' : 'الفائدة'}</span>
                      <strong>{fmt(installmentResult.totalProfit)} د.ك</strong>
                    </div>
                  </div>

                  {/* KCB comparison for nationals */}
                  {borrowerType === 'national' && kcbMonthly !== null && (
                    <>
                      <div className="calc-result-sec-title">مقارنة: بنك الائتمان الكويتي (KCB) — صفر فائدة</div>
                      <div className="kw-kcb-strip">
                        <div className="kw-kcb-row">
                          <span className="kw-kcb-label">قسط KCB (0% فائدة، {Math.round(parseInt(termMonths) / 12)} سنة)</span>
                          <span className="kw-kcb-value">{fmt(kcbMonthly)} د.ك/شهر</span>
                        </div>
                        <div className="kw-kcb-row">
                          <span className="kw-kcb-label">قسطك (بنك تجاري {annualRate[0]}%)</span>
                          <span className="kw-kcb-value">{fmt(installmentResult.monthly)} د.ك/شهر</span>
                        </div>
                        <div className="kw-kcb-saving">
                          توفير KCB: {fmt(installmentResult.monthly - kcbMonthly)} د.ك/شهر
                          ({fmt((installmentResult.monthly - kcbMonthly) * parseInt(termMonths))} د.ك إجمالاً)
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                          <Info size={10} /> KCB حصري للمواطنين الكويتيين — قائمة انتظار طويلة. يُنصح بالتسجيل مبكراً.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}

              {mode === 'affordability' && affordabilityResult.isValid && (
                <>
                  {affordabilityResult.maxLoan <= 0 ? (
                    <div className="eg-zero-notice">
                      <Warning size={22} weight="fill" />
                      <div>
                        <strong>التزاماتك تستنفد حد DBR (40%)</strong>
                        <span>لا يتبقى هامش لقسط تمويل إضافي.</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="calc-insight-row" style={{ marginBottom: 'var(--space-3)' }}>
                        <div className="calc-insight-card">
                          <span className="calc-insight-label">حد DBR</span>
                          <span className="calc-insight-value">40%</span>
                          <span className="calc-insight-sub">بنك الكويت المركزي</span>
                        </div>
                        <div className="calc-insight-card">
                          <span className="calc-insight-label">قسط شهري أقصى</span>
                          <span className="calc-insight-value">{fmt(affordabilityResult.maxMonthly)}</span>
                          <span className="calc-insight-sub">د.ك</span>
                        </div>
                        {affordabilityResult.capUsed === 'cbk-cap' && (
                          <div className="calc-insight-card" style={{ borderColor: 'var(--amber)' }}>
                            <span className="calc-insight-label">سقف CBK</span>
                            <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>{fmt(KW_MAX)}</span>
                            <span className="calc-insight-sub">الحد الأقصى د.ك</span>
                          </div>
                        )}
                      </div>

                      <div className="calc-esb-amount-hero">
                        <span className="calc-esb-amount-label">أقصى مبلغ تمويل</span>
                        <div className="calc-esb-amount-value">{fmt(affordabilityResult.maxLoan)} د.ك</div>
                        <div className="calc-esb-amount-meta">
                          <span>
                            {affordabilityResult.capUsed === 'cbk-cap'
                              ? 'محدود بسقف CBK (70,000 د.ك)'
                              : `محدود بـ DBR 40% من راتبك`}
                          </span>
                        </div>
                      </div>

                      <div className="calc-esb-breakdown">
                        <div className="calc-esb-brow"><span>الراتب الشهري</span><strong>{fmt(affordabilityResult.salary)} د.ك</strong></div>
                        <div className="calc-esb-brow"><span>التزامات قائمة</span><strong>{fmt(affordabilityResult.obligations)} د.ك</strong></div>
                        <div className="calc-esb-brow"><span>أقصى قسط (DBR 40%)</span><strong>{fmt(affordabilityResult.maxMonthly)} د.ك/شهر</strong></div>
                        <div className="calc-esb-brow calc-esb-brow--total">
                          <span>أقصى تمويل</span>
                          <strong>{fmt(affordabilityResult.maxLoan)} د.ك</strong>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <ResultActions copyText={shareText} shareTitle="حاسبة التمويل العقاري الكويت" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>لا يوجد قانون رهن عقاري في الكويت حتى الآن — البنوك تقدم قروضاً سكنية بضمان الراتب (CBK). مشروع قانون الرهن قيد الدراسة منذ 2018.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <House size={32} weight="duotone" />
              <p>{mode === 'installment' ? 'أدخل مبلغ التمويل لعرض القسط الشهري.' : 'أدخل راتبك لحساب قدرة الاقتراض.'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
