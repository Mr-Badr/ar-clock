"use client";

import { useMemo, useState } from 'react';
import { CurrencyCircleDollar, Info, Warning } from '@phosphor-icons/react';
import {
  EGYPT_LOAN_BORROWER_TYPES,
  EGYPT_LOAN_TERMS_PRIVATE,
  EGYPT_LOAN_TERMS_GOVT,
  EGYPT_LOAN_TERMS_EXPAT,
  calcEgyptLoanInstallment,
  calcEgyptLoanAffordability,
} from '@/lib/calculators/personal-loan';
import { CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

function fmt(n)    { return Math.round(n).toLocaleString('ar-EG-u-nu-latn'); }
function fmtEGP(n) { return `${fmt(n)} ج.م`; }

const RATE_MIN   = 18.0;
const RATE_MAX   = 35.0;
const RATE_STEP  = 0.5;
const RATE_MARKS = [20.0, 24.0, 27.0, 30.0, 33.0];

function getTerms(borrowerType) {
  if (borrowerType === 'govt')  return EGYPT_LOAN_TERMS_GOVT;
  if (borrowerType === 'expat') return EGYPT_LOAN_TERMS_EXPAT;
  return EGYPT_LOAN_TERMS_PRIVATE;
}

export default function EgyptPersonalLoanCalculator() {
  const [mode,         setMode]         = useState('installment');
  const [borrowerType, setBorrowerType] = useState('private');
  const [loanAmount,   setLoanAmount]   = useState('');
  const [termMonths,   setTermMonths]   = useState('');
  const [ratePct,      setRatePct]      = useState(27.0);
  const [salary,       setSalary]       = useState('');
  const [obligations,  setObligations]  = useState('0');

  const borrower    = EGYPT_LOAN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? EGYPT_LOAN_BORROWER_TYPES[0];
  const terms       = getTerms(borrowerType);
  const defaultTerm = borrower.maxTerm;

  const instResult = useMemo(
    () => mode === 'installment' ? calcEgyptLoanInstallment({
      loanAmount, annualRatePct: ratePct,
      termMonths: termMonths || defaultTerm,
      borrowerType,
    }) : { isValid: false },
    [mode, loanAmount, ratePct, termMonths, borrowerType, defaultTerm],
  );

  const affordResult = useMemo(
    () => mode === 'affordability' ? calcEgyptLoanAffordability({
      salary, obligations, annualRatePct: ratePct,
      termMonths: termMonths || defaultTerm,
      borrowerType,
    }) : { isValid: false },
    [mode, salary, obligations, ratePct, termMonths, borrowerType, defaultTerm],
  );

  const result    = mode === 'installment' ? instResult : affordResult;
  const shareText = result.isValid
    ? mode === 'installment'
      ? `قرض شخصي مصر:\nالمبلغ: ${fmtEGP(instResult.loanAmount)}\nالقسط: ${fmtEGP(instResult.monthly)}/شهر\nإجمالي الفائدة: ${fmtEGP(instResult.totalProfit)}`
      : `قرض شخصي مصر — أهليتي:\nأقصى قرض: ${fmtEGP(affordResult.maxLoan)}\nأقصى قسط: ${fmtEGP(affordResult.maxMonthly)}/شهر`
    : '';

  const dbrPct = Math.round((borrower.dbr) * 100);

  return (
    <div className="calc-app eg-loan-tool" aria-label="حاسبة القرض الشخصي مصر">
      <div className="calc-esb-layout">

        {/* ── FORM ───────────────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="ci-mode-tabs">
                  {[
                    { value: 'installment',   label: 'احسب القسط',     sub: 'من مبلغ القرض' },
                    { value: 'affordability', label: 'ما أقصى قرض؟',   sub: 'من الراتب' },
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
                  {EGYPT_LOAN_BORROWER_TYPES.map((b) => (
                    <button key={b.value} type="button"
                      className={`hi-level-card${borrowerType === b.value ? ' is-active' : ''}`}
                      onClick={() => { setBorrowerType(b.value); setTermMonths(''); }}
                    >
                      <span className="hi-level-label">{b.label}</span>
                      <span className="hi-level-sub">
                        DBR {Math.round(b.dbr * 100)}% · {b.maxTerm} شهراً
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment: loan amount */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label>مبلغ القرض (ج.م)</Label>
                  </div>
                  <Input
                    type="number" inputMode="numeric" placeholder="مثال: 100000"
                    value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                    min="0"
                  />
                  <p className="calc-hint"><Info size={11} /> معظم البنوك: الحد الأقصى 500,000 – 2,000,000 ج.م حسب الراتب.</p>
                </div>
              )}

              {/* Affordability: salary + obligations */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label>الراتب الشهري الصافي (ج.م)</Label>
                    </div>
                    <Input
                      type="number" inputMode="numeric" placeholder="مثال: 10000"
                      value={salary} onChange={(e) => setSalary(e.target.value)}
                      min="0"
                    />
                    {affordResult.isValid && affordResult.belowMinSalary && (
                      <p className="calc-hint ci-hint-warning">
                        <Warning size={11} /> الحد الأدنى المطلوب: {fmt(borrower.minSalary)} ج.م/شهر في معظم البنوك.
                      </p>
                    )}
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label>الأقساط الشهرية الحالية (ج.م)</Label>
                    </div>
                    <Input
                      type="number" inputMode="numeric" placeholder="0"
                      value={obligations} onChange={(e) => setObligations(e.target.value)}
                      min="0"
                    />
                    <p className="calc-hint">
                      نسبة DBR (البنك المركزي المصري): {dbrPct}% من صافي الراتب
                    </p>
                  </div>
                </>
              )}

              {/* Rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? 3 : 4}</span>
                  <Label>
                    معدل الفائدة السنوي: <strong style={{ direction: 'ltr', display: 'inline-block' }}>{ratePct}%</strong>
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
                  <Info size={11} /> CIB، NBE، بنك مصر — معدلات متغيرة بعد قرارات الفائدة 2024.
                </p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? 4 : 5}</span>
                  <Label>مدة القرض</Label>
                </div>
                <Select value={termMonths || String(defaultTerm)} onValueChange={setTermMonths}>
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
                <span className="calc-esb-country-badge calc-esb-country-badge--eg">🇪🇬 مصر</span>
                <span className="calc-esb-live-dot eg-loan-tool" aria-hidden="true" />
              </div>

              {mode === 'installment' && instResult.isValid && (
                <>
                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <span className="calc-amount-value">{fmt(instResult.monthly)}</span>
                    <div className="calc-esb-amount-meta"><span>ج.م / شهرياً</span></div>
                  </div>

                  <div className="calc-insight-row">
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">إجمالي الفوائد</span>
                      <span className="calc-insight-value">{fmt(instResult.totalProfit)}</span>
                      <span className="calc-insight-sub">ج.م</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">إجمالي المدفوعات</span>
                      <span className="calc-insight-value">{fmt(instResult.totalPayments)}</span>
                      <span className="calc-insight-sub">ج.م</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">المدة</span>
                      <span className="calc-insight-value">{instResult.termMonths}</span>
                      <span className="calc-insight-sub">شهراً</span>
                    </div>
                  </div>

                  <div className="calc-result-sec-title">ملخص القرض</div>
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>مبلغ القرض</span><strong>{fmtEGP(instResult.loanAmount)}</strong></div>
                    <div className="calc-esb-brow"><span>معدل الفائدة السنوي</span><strong style={{ direction: 'ltr' }}>{instResult.annualRatePct}%</strong></div>
                    <div className="calc-esb-brow"><span>المدة</span><strong>{instResult.termMonths} شهراً</strong></div>
                    <div className="calc-esb-brow"><span>نسبة الفائدة للأصل</span><strong style={{ direction: 'ltr' }}>{Math.round(instResult.totalProfit / instResult.loanAmount * 100)}%</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>إجمالي المدفوعات</span><strong>{fmtEGP(instResult.totalPayments)}</strong></div>
                  </div>
                </>
              )}

              {mode === 'affordability' && affordResult.isValid && (
                <>
                  {affordResult.belowMinSalary && (
                    <div className="calc-esb-cap-notice">
                      <Warning size={14} />
                      <span>الراتب أقل من الحد الأدنى البنكي ({fmtEGP(borrower.minSalary)}). قد يصعب الحصول على قرض.</span>
                    </div>
                  )}

                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">أقصى قرض تستطيع الحصول عليه</span>
                    <span className="calc-amount-value">{fmt(affordResult.maxLoan)}</span>
                    <div className="calc-esb-amount-meta"><span>ج.م</span></div>
                  </div>

                  <div className="calc-insight-row">
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">أقصى قسط شهري</span>
                      <span className="calc-insight-value">{fmt(affordResult.maxMonthly)}</span>
                      <span className="calc-insight-sub">ج.م (DBR {dbrPct}%)</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">المدة المختارة</span>
                      <span className="calc-insight-value">{affordResult.termMonths}</span>
                      <span className="calc-insight-sub">شهراً</span>
                    </div>
                  </div>

                  <div className="calc-result-sec-title">تفاصيل الأهلية (CBE)</div>
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>الراتب الصافي</span><strong>{fmtEGP(affordResult.salary)}</strong></div>
                    <div className="calc-esb-brow"><span>الأقساط الحالية</span><strong>{fmtEGP(affordResult.obligations)}</strong></div>
                    <div className="calc-esb-brow"><span>نسبة DBR (البنك المركزي)</span><strong>{dbrPct}%</strong></div>
                    <div className="calc-esb-brow"><span>أقصى قسط مسموح</span><strong>{fmtEGP(affordResult.maxMonthly)}</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>أقصى قرض</span><strong>{fmtEGP(affordResult.maxLoan)}</strong></div>
                  </div>
                </>
              )}

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي مصر" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>وفق تعليمات البنك المركزي المصري (CBE) — المعدلات تتغير مع قرارات لجنة السياسة النقدية. الأرقام استرشادية.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CurrencyCircleDollar size={32} weight="duotone" />
              <p>أدخل مبلغ القرض أو الراتب لعرض النتيجة.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
