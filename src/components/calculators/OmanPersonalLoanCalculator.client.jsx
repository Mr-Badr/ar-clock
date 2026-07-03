"use client";

import { useMemo, useState } from 'react';
import { CurrencyCircleDollar, Info, Warning } from '@phosphor-icons/react';
import {
  OMAN_BORROWER_TYPES,
  OMAN_LOAN_TERMS_NATIONAL,
  OMAN_LOAN_TERMS_EXPAT,
  calcOmanLoanInstallment,
  calcOmanLoanAffordability,
} from '@/lib/calculators/personal-loan';
import { CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

function fmt(n)    { return Math.round(n).toLocaleString('ar-OM'); }
function fmtOMR(n) { return `${fmt(n)} ر.ع`; }

const RATE_MIN  = 5.0;
const RATE_MAX  = 12.0;
const RATE_STEP = 0.25;
const RATE_MARKS = [6.0, 7.0, 8.0, 9.0, 10.0];

export default function OmanPersonalLoanCalculator() {
  const [mode,         setMode]         = useState('installment');
  const [borrowerType, setBorrowerType] = useState('national');
  const [loanAmount,   setLoanAmount]   = useState('');
  const [termMonths,   setTermMonths]   = useState('');
  const [ratePct,      setRatePct]      = useState(7.5);
  const [salary,       setSalary]       = useState('');
  const [obligations,  setObligations]  = useState('0');

  const borrower = OMAN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? OMAN_BORROWER_TYPES[0];
  const terms    = borrowerType === 'national' ? OMAN_LOAN_TERMS_NATIONAL : OMAN_LOAN_TERMS_EXPAT;
  const defaultTerm = borrower.maxTerm;

  const instResult = useMemo(
    () => mode === 'installment' ? calcOmanLoanInstallment({
      loanAmount, annualRatePct: ratePct,
      termMonths: termMonths || defaultTerm,
      borrowerType,
    }) : { isValid: false },
    [mode, loanAmount, ratePct, termMonths, borrowerType, defaultTerm],
  );

  const affordResult = useMemo(
    () => mode === 'affordability' ? calcOmanLoanAffordability({
      salary, obligations, annualRatePct: ratePct,
      termMonths: termMonths || defaultTerm,
      borrowerType,
    }) : { isValid: false },
    [mode, salary, obligations, ratePct, termMonths, borrowerType, defaultTerm],
  );

  const result   = mode === 'installment' ? instResult : affordResult;
  const shareText = result.isValid
    ? mode === 'installment'
      ? `قرض شخصي عمان:\nالمبلغ: ${fmtOMR(instResult.loanAmount)}\nالقسط: ${fmtOMR(instResult.monthly)}/شهر\nالفائدة الإجمالية: ${fmtOMR(instResult.totalProfit)}`
      : `قرض شخصي عمان — أهليتي:\nأقصى قرض: ${fmtOMR(affordResult.maxLoan)}\nأقصى قسط: ${fmtOMR(affordResult.maxMonthly)}/شهر`
    : '';

  return (
    <div className="calc-app om-loan-tool" aria-label="حاسبة القرض الشخصي عمان">
      <div className="calc-esb-layout">

        {/* ── FORM ───────────────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="ci-mode-tabs">
                  {[
                    { value: 'installment',   label: 'احسب القسط',       sub: 'من مبلغ القرض' },
                    { value: 'affordability', label: 'ما أقصى قرض؟',     sub: 'من الراتب' },
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
                  {OMAN_BORROWER_TYPES.map((b) => (
                    <button key={b.value} type="button"
                      className={`hi-level-card${borrowerType === b.value ? ' is-active' : ''}`}
                      onClick={() => { setBorrowerType(b.value); setTermMonths(''); }}
                    >
                      <span className="hi-level-label">{b.label}</span>
                      <span className="hi-level-sub">
                        DBR 50% · {b.maxTerm} شهراً
                        {b.maxLoan ? ` · حد ${fmt(b.maxLoan)} ر.ع` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment inputs */}
              {mode === 'installment' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label>مبلغ القرض (ر.ع)</Label>
                  </div>
                  <Input
                    type="number" inputMode="numeric" placeholder="مثال: 10000"
                    value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                    min="0"
                  />
                  {borrower.maxLoan && (
                    <p className="calc-hint"><Info size={11} /> الحد الأقصى للوافدين: {fmt(borrower.maxLoan)} ر.ع</p>
                  )}
                </div>
              )}

              {/* Affordability inputs */}
              {mode === 'affordability' && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label>الراتب الشهري الصافي (ر.ع)</Label>
                    </div>
                    <Input
                      type="number" inputMode="numeric" placeholder="مثال: 800"
                      value={salary} onChange={(e) => setSalary(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label>الأقساط الشهرية الحالية (ر.ع)</Label>
                    </div>
                    <Input
                      type="number" inputMode="numeric" placeholder="0"
                      value={obligations} onChange={(e) => setObligations(e.target.value)}
                      min="0"
                    />
                    <p className="calc-hint">نسبة DBR (البنك المركزي العماني): 50% من صافي الراتب</p>
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
                  <Info size={11} /> بنك مسقط، NBO، بنك ظفار — معدلات 2024–2025.
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
                <span className="calc-esb-country-badge calc-esb-country-badge--om">🇴🇲 عُمان</span>
                <span className="calc-esb-live-dot om-loan-tool" aria-hidden="true" />
              </div>

              {mode === 'installment' && instResult.isValid && (
                <>
                  {instResult.cappedAtMax && (
                    <div className="calc-esb-cap-notice">
                      <Info size={14} />
                      <span>تم تعديل المبلغ إلى الحد الأقصى للوافدين: {fmtOMR(borrower.maxLoan)}</span>
                    </div>
                  )}

                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">القسط الشهري</span>
                    <span className="calc-amount-value">{fmt(instResult.monthly)}</span>
                    <div className="calc-esb-amount-meta"><span>ر.ع / شهرياً</span></div>
                  </div>

                  <div className="calc-insight-row">
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">إجمالي الفوائد</span>
                      <span className="calc-insight-value">{fmt(instResult.totalProfit)}</span>
                      <span className="calc-insight-sub">ر.ع</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">إجمالي المدفوعات</span>
                      <span className="calc-insight-value">{fmt(instResult.totalPayments)}</span>
                      <span className="calc-insight-sub">ر.ع</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">المدة</span>
                      <span className="calc-insight-value">{instResult.termMonths}</span>
                      <span className="calc-insight-sub">شهراً</span>
                    </div>
                  </div>

                  <div className="calc-result-sec-title">ملخص القرض</div>
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>مبلغ القرض</span><strong>{fmtOMR(instResult.loanAmount)}</strong></div>
                    <div className="calc-esb-brow"><span>معدل الفائدة</span><strong style={{ direction: 'ltr' }}>{instResult.annualRatePct}%</strong></div>
                    <div className="calc-esb-brow"><span>المدة</span><strong>{instResult.termMonths} شهراً</strong></div>
                    <div className="calc-esb-brow"><span>إجمالي الفوائد</span><strong>{fmtOMR(instResult.totalProfit)}</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>إجمالي المدفوعات</span><strong>{fmtOMR(instResult.totalPayments)}</strong></div>
                  </div>
                </>
              )}

              {mode === 'affordability' && affordResult.isValid && (
                <>
                  {affordResult.capUsed === 'bank-cap' && (
                    <div className="calc-esb-cap-notice">
                      <Info size={14} />
                      <span>محدود بسقف البنك للوافدين ({fmtOMR(borrower.maxLoan)})</span>
                    </div>
                  )}

                  <div className="calc-esb-amount-hero">
                    <span className="calc-esb-amount-label">أقصى قرض تستطيع الحصول عليه</span>
                    <span className="calc-amount-value">{fmt(affordResult.maxLoan)}</span>
                    <div className="calc-esb-amount-meta"><span>ر.ع</span></div>
                  </div>

                  <div className="calc-insight-row">
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">أقصى قسط شهري</span>
                      <span className="calc-insight-value">{fmt(affordResult.maxMonthly)}</span>
                      <span className="calc-insight-sub">ر.ع (DBR 50%)</span>
                    </div>
                    <div className="calc-insight-card">
                      <span className="calc-insight-label">المدة المختارة</span>
                      <span className="calc-insight-value">{affordResult.termMonths}</span>
                      <span className="calc-insight-sub">شهراً</span>
                    </div>
                  </div>

                  <div className="calc-result-sec-title">تفاصيل الأهلية</div>
                  <div className="calc-esb-breakdown">
                    <div className="calc-esb-brow"><span>الراتب الصافي</span><strong>{fmtOMR(affordResult.salary)}</strong></div>
                    <div className="calc-esb-brow"><span>الأقساط الحالية</span><strong>{fmtOMR(affordResult.obligations)}</strong></div>
                    <div className="calc-esb-brow"><span>نسبة DBR (CBO)</span><strong>50%</strong></div>
                    <div className="calc-esb-brow"><span>أقصى قسط مسموح</span><strong>{fmtOMR(affordResult.maxMonthly)}</strong></div>
                    <div className="calc-esb-brow calc-esb-brow--total"><span>أقصى قرض</span><strong>{fmtOMR(affordResult.maxLoan)}</strong></div>
                  </div>
                </>
              )}

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي عمان" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>وفق تعليمات البنك المركزي العماني (CBO) — الأرقام استرشادية والموافقة النهائية من البنك.</span>
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
