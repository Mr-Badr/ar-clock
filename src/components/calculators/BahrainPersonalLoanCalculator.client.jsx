"use client";

import { useMemo, useState } from 'react';
import { CurrencyDollar, Info, Warning } from '@phosphor-icons/react';
import {
  BAHRAIN_BORROWER_TYPES,
  BAHRAIN_LOAN_TERMS_NATIONAL,
  BAHRAIN_LOAN_TERMS_EXPAT,
  calcBahrainLoanInstallment,
  calcBahrainLoanAffordability,
} from '@/lib/calculators/personal-loan';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

function fmt(n) { return Math.round(n).toLocaleString('ar-BH'); }

const MODES = [
  { value: 'installment',   label: 'القسط الشهري',   sub: 'أعرف مبلغ القرض' },
  { value: 'affordability', label: 'قدرة الاقتراض',  sub: 'كم يعطيني راتبي؟' },
];

/* ── Simple DBR Meter ────────────────────────────────────────────── */
function DbrBar({ usedPct, capPct }) {
  const clamp = (v) => Math.min(100, Math.max(0, v));
  const usedColor = usedPct > capPct * 100 ? 'var(--red)' : usedPct > capPct * 80 ? 'var(--amber)' : 'var(--green)';
  return (
    <div className="dbr-bar-wrap">
      <div className="dbr-bar-track">
        <div className="dbr-bar-fill" style={{ width: `${clamp(usedPct)}%`, background: usedColor }} />
        <div className="dbr-bar-cap" style={{ left: `${clamp(capPct * 100)}%` }} />
      </div>
      <div className="dbr-bar-labels">
        <span style={{ color: usedColor }}>مستخدم {Math.round(usedPct)}%</span>
        <span style={{ color: 'var(--text-muted)' }}>حد CBB {Math.round(capPct * 100)}%</span>
      </div>
    </div>
  );
}

export default function BahrainPersonalLoanCalculator() {
  const [mode,         setMode]         = useState('affordability');
  const [borrowerType, setBorrowerType] = useState('national');
  const [loanAmount,   setLoanAmount]   = useState('10000');
  const [annualRate,   setAnnualRate]   = useState([7.5]);
  const [termMonths,   setTermMonths]   = useState('60');
  const [salary,       setSalary]       = useState('800');
  const [obligations,  setObligations]  = useState('0');

  const borrower = BAHRAIN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? BAHRAIN_BORROWER_TYPES[0];
  const terms = borrowerType === 'national' ? BAHRAIN_LOAN_TERMS_NATIONAL : BAHRAIN_LOAN_TERMS_EXPAT;

  const installmentResult = useMemo(
    () => calcBahrainLoanInstallment({
      loanAmount: parseFloat(loanAmount) || 0,
      annualRatePct: annualRate[0],
      termMonths: parseInt(termMonths),
      borrowerType,
    }),
    [loanAmount, annualRate, termMonths, borrowerType],
  );

  const affordabilityResult = useMemo(
    () => calcBahrainLoanAffordability({
      salary: parseFloat(salary) || 0,
      obligations: parseFloat(obligations) || 0,
      annualRatePct: annualRate[0],
      termMonths: parseInt(termMonths),
      borrowerType,
    }),
    [salary, obligations, annualRate, termMonths, borrowerType],
  );

  const result = mode === 'installment' ? installmentResult : affordabilityResult;

  // DBR bar: only in affordability mode where salary is a required user input
  const affordSalary = parseFloat(salary) || 0;
  const affordObs    = parseFloat(obligations) || 0;
  const dbrUsedPct   = (mode === 'affordability' && affordabilityResult.isValid && affordSalary > 0)
    ? Math.min(100, ((affordObs + affordabilityResult.maxMonthly) / affordSalary) * 100)
    : null;

  const shareText = (mode === 'installment' && installmentResult.isValid)
    ? `قرض شخصي البحرين (${borrower.label}):\nمبلغ القرض: ${fmt(installmentResult.loanAmount)} د.ب\nالقسط الشهري: ${fmt(installmentResult.monthly)} د.ب\nالمدة: ${installmentResult.termMonths} شهراً`
    : (mode === 'affordability' && affordabilityResult.isValid)
    ? `قدرة الاقتراض — البحرين:\nأقصى قرض: ${fmt(affordabilityResult.maxLoan)} د.ب`
    : '';

  return (
    <div className="calc-app bh-loan-tool" aria-label="حاسبة القرض الشخصي البحرين">
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
                <div className="ci-coverage-tabs">
                  {BAHRAIN_BORROWER_TYPES.map((b) => (
                    <button key={b.value} type="button"
                      className={`ci-coverage-tab${borrowerType === b.value ? ' is-active' : ''}`}
                      onClick={() => setBorrowerType(b.value)}>
                      <span className="ci-tab-label">{b.label}</span>
                      <span className="ci-tab-sub">
                        {b.value === 'national' ? 'حتى 100,000 د.ب · 84 شهراً' : 'حتى 60,000 د.ب · 60 شهراً'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment mode: loan amount */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label htmlFor="bh-loan">مبلغ القرض</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="bh-loan" inputMode="numeric" value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)} placeholder="10000" />
                    <span className="calc-esb-currency">د.ب</span>
                  </div>
                  <p className="calc-hint">الحد الأقصى: {fmt(borrower.maxLoan)} د.ب ({borrower.label})</p>
                </div>
              )}

              {/* Affordability mode: salary + obligations */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label htmlFor="bh-salary">الراتب الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="bh-salary" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="800" />
                      <span className="calc-esb-currency">د.ب</span>
                    </div>
                    <p className="calc-hint">الحد الأدنى الشائع: 300 د.ب (BBK/NBB) · 800 د.ب (SBI)</p>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">4</span>
                      <Label htmlFor="bh-obs">التزامات شهرية قائمة</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="bh-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">د.ب</span>
                    </div>
                    <p className="calc-hint">أقساط سيارة، قروض أخرى، بطاقات ائتمان.</p>
                  </div>
                </>
              )}

              {/* Rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '4' : '5'}</span>
                  <Label>معدل الفائدة السنوي (APR) — <strong>{annualRate[0]}%</strong></Label>
                </div>
                <Slider className="calc-slider" min={4} max={15} step={0.25}
                  value={annualRate} onValueChange={setAnnualRate} />
                <p className="calc-hint">
                  {borrowerType === 'national'
                    ? 'معدلات السوق: NBB ~8.5% · BBK ~4.9% APR · بنك البحرين الإسلامي ~8-10%'
                    : 'وافدون: Standard Chartered ~9.5% · أهلي يونايتد ~11.7% APR'}
                </p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '5' : '6'}</span>
                  <Label>مدة القرض</Label>
                </div>
                <Select value={String(termMonths)} onValueChange={setTermMonths}>
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

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--bh">🇧🇭 البحرين</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {mode === 'installment' && installmentResult.isValid && (
                <>
                  {installmentResult.cappedAtMax && (
                    <div className="calc-esb-cap-notice">
                      <Info size={13} />
                      <span>تم تحديد المبلغ عند الحد الأقصى: {fmt(installmentResult.maxLoan)} د.ب ({borrower.label})</span>
                    </div>
                  )}

                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <div className="calc-esb-amount-value">{fmt(installmentResult.monthly)} د.ب</div>
                    <div className="calc-esb-amount-meta">
                      <span>{installmentResult.termMonths} شهراً · {installmentResult.annualRatePct}%</span>
                    </div>
                  </div>

                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>مبلغ القرض</span><strong>{fmt(installmentResult.loanAmount)} د.ب</strong></div>
                    <div className="calc-esb-brow"><span>إجمالي المدفوعات</span><strong>{fmt(installmentResult.totalPayments)} د.ب</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>إجمالي الفائدة</span><strong>{fmt(installmentResult.totalProfit)} د.ب</strong></div>
                  </div>
                </>
              )}

              {mode === 'affordability' && affordabilityResult.isValid && (
                <>
                  {affordabilityResult.maxLoan <= 0 ? (
                    <div className="eg-zero-notice">
                      <Warning size={22} weight="fill" />
                      <div>
                        <strong>التزاماتك تستنفد حد DBR (50%)</strong>
                        <span>لا يتبقى هامش لقسط قرض إضافي.</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="calc-insight-row" style={{ marginBottom: 'var(--space-3)' }}>
                        <div className="calc-insight-card">
                          <span className="calc-insight-label">حد DBR</span>
                          <span className="calc-insight-value">50%</span>
                          <span className="calc-insight-sub">بنك البحرين المركزي</span>
                        </div>
                        <div className="calc-insight-card">
                          <span className="calc-insight-label">أقصى قسط</span>
                          <span className="calc-insight-value">{fmt(affordabilityResult.maxMonthly)}</span>
                          <span className="calc-insight-sub">د.ب/شهر</span>
                        </div>
                        {affordabilityResult.capUsed === 'bank-cap' && (
                          <div className="calc-insight-card" style={{ borderColor: 'var(--amber)' }}>
                            <span className="calc-insight-label">سقف البنك</span>
                            <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>{fmt(affordabilityResult.maxLoanCap)}</span>
                            <span className="calc-insight-sub">د.ب ({borrower.label})</span>
                          </div>
                        )}
                      </div>

                      <div className="calc-esb-amount-hero">
                        <span className="calc-esb-amount-label">أقصى قرض يمكنك الحصول عليه</span>
                        <div className="calc-esb-amount-value">{fmt(affordabilityResult.maxLoan)} د.ب</div>
                        <div className="calc-esb-amount-meta">
                          <span>
                            {affordabilityResult.capUsed === 'bank-cap'
                              ? `محدود بسقف البنك (${fmt(affordabilityResult.maxLoanCap)} د.ب)`
                              : 'محدود بـ DBR 50%'}
                          </span>
                        </div>
                      </div>

                      {affordabilityResult.isHighEarner && (
                        <p className="calc-hint" style={{ color: 'var(--green-text)' }}>
                          <Info size={11} /> راتبك يتجاوز 3,000 د.ب — يحق للبنك رفع حد DBR عند تقديرها.
                        </p>
                      )}

                      {dbrUsedPct !== null && (
                        <>
                          <div className="calc-result-sec-title">نسبة عبء الدين DBR</div>
                          <DbrBar usedPct={dbrUsedPct} capPct={0.50} />
                        </>
                      )}

                      <div className="calc-esb-breakdown">
                        <div className="calc-esb-brow"><span>الراتب الشهري</span><strong>{fmt(affordabilityResult.salary)} د.ب</strong></div>
                        <div className="calc-esb-brow"><span>التزامات قائمة</span><strong>{fmt(affordabilityResult.obligations)} د.ب</strong></div>
                        <div className="calc-esb-brow"><span>أقصى قسط (DBR 50%)</span><strong>{fmt(affordabilityResult.maxMonthly)} د.ب/شهر</strong></div>
                        <div className="calc-esb-brow calc-esb-brow--total"><span>أقصى قرض ممكن</span><strong>{fmt(affordabilityResult.maxLoan)} د.ب</strong></div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* GCC comparison */}
              <div className="calc-result-sec-title">مقارنة DBR في دول الخليج</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow"><span>🇧🇭 البحرين (CBB)</span><strong>50% للجميع</strong></div>
                <div className="calc-esb-brow"><span>🇶🇦 قطر (QCB)</span><strong>50% مقيم · 75% قطري</strong></div>
                <div className="calc-esb-brow"><span>🇦🇪 الإمارات (CBUAE)</span><strong>50% للجميع</strong></div>
                <div className="calc-esb-brow"><span>🇰🇼 الكويت (CBK)</span><strong>40% موظف · 30% متقاعد</strong></div>
                <div className="calc-esb-brow"><span>🇸🇦 السعودية (SAMA)</span><strong>33% للجميع</strong></div>
              </div>

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي البحرين" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>وفق لوائح بنك البحرين المركزي CBB. الأرقام تقديرية — شروط كل بنك تختلف. تحقق من نسبة APR الفعلية.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CurrencyDollar size={32} weight="duotone" />
              <p>{mode === 'installment' ? 'أدخل مبلغ القرض لعرض القسط الشهري.' : 'أدخل راتبك لحساب قدرة الاقتراض.'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
