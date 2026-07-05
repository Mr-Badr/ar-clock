"use client";

import { useMemo, useState } from 'react';
import { CurrencyCircleDollar, Warning } from '@phosphor-icons/react';
import {
  KUWAIT_LOAN_TERMS,
  calcKuwaitLoanInstallment,
  calcKuwaitLoanAffordability,
} from '@/lib/calculators/personal-loan';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n, d = 0) { return Number(n).toLocaleString('ar-KW-u-nu-latn', { minimumFractionDigits: d, maximumFractionDigits: d }); }

/* ── Inline SVG Donut (principal vs profit) ─────────────────────── */
function SvgDonut({ pct, label, sub }) {
  const r = 44; const cx = 52; const cy = 52;
  const circ = 2 * Math.PI * r; const sw = 14;
  const p = Math.min(Math.max(pct, 0), 100);
  const len1 = (p / 100) * circ;
  const len2 = circ - len1;
  return (
    <div className="calc-donut-wrap">
      <div className="calc-donut-center-wrap">
        <svg viewBox="0 0 104 104" fill="none">
          <circle cx={cx} cy={cy} r={r} stroke="var(--border-default)" strokeWidth={sw} />
          <circle cx={cx} cy={cy} r={r} stroke="var(--green)" strokeWidth={sw}
            strokeDasharray={`${len1} ${len2}`} strokeDashoffset={circ * 0.25}
            style={{ transition: 'stroke-dasharray 0.55s ease' }} />
          <circle cx={cx} cy={cy} r={r} stroke="var(--amber)" strokeWidth={sw}
            strokeDasharray={`${len2} ${len1}`}
            strokeDashoffset={circ * 0.25 - len1}
            style={{ transition: 'stroke-dasharray 0.55s ease' }} />
        </svg>
        <div className="calc-donut-center-text">
          <span className="calc-donut-center-pct">{p}%</span>
          <span className="calc-donut-center-sub">{sub}</span>
        </div>
      </div>
      <div className="calc-donut-legend">
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: 'var(--green)' }} />
          <span className="calc-donut-legend-label">أصل القرض</span>
          <span className="calc-donut-legend-val">{p}%</span>
        </div>
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: 'var(--amber)' }} />
          <span className="calc-donut-legend-label">تكلفة الفائدة</span>
          <span className="calc-donut-legend-val">{100 - p}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── DBR gauge ──────────────────────────────────────────────────── */
function DbrMeter({ usedPct, capPct }) {
  const fill = Math.min((usedPct / capPct) * 100, 100);
  const tier = fill < 70 ? 'ok' : fill < 95 ? 'warn' : 'over';
  return (
    <div className="calc-dbr-meter">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>نسبة تحمّل الدين (DBR)</span>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: tier === 'over' ? 'var(--red-text)' : 'var(--text-primary)', direction: 'ltr' }}>
          {usedPct.toFixed(1)}% / {capPct * 100}%
        </span>
      </div>
      <div className="calc-dbr-track">
        <div className={`calc-dbr-fill calc-dbr-fill--${tier}`} style={{ width: `${fill}%` }} />
      </div>
    </div>
  );
}

export default function KuwaitPersonalLoanCalculator() {
  const [mode,         setMode]         = useState('installment'); // 'installment' | 'affordability'
  const [borrowerType, setBorrowerType] = useState('national');    // 'national' | 'expat'
  const [loanAmount,   setLoanAmount]   = useState('5000');
  const [salary,       setSalary]       = useState('1200');
  const [obligations,  setObligations]  = useState('0');
  const [rate,         setRate]         = useState('7');
  const [termMonths,   setTermMonths]   = useState(60);

  const instResult = useMemo(() => {
    if (mode !== 'installment') return null;
    return calcKuwaitLoanInstallment({ loanAmount, annualRatePct: parseFloat(rate) || 7, termMonths, borrowerType });
  }, [mode, loanAmount, rate, termMonths, borrowerType]);

  const affordResult = useMemo(() => {
    if (mode !== 'affordability') return null;
    return calcKuwaitLoanAffordability({ salary, obligations, annualRatePct: parseFloat(rate) || 7, termMonths, borrowerType });
  }, [mode, salary, obligations, rate, termMonths, borrowerType]);

  const dbrLabel = borrowerType === 'expat' ? 'CBK 30%' : 'CBK 40%';
  const dbrCap   = borrowerType === 'expat' ? 0.30 : 0.40;

  const isInstallment = mode === 'installment';
  const r = instResult;
  const a = affordResult;

  const principalPct = r?.isValid && r.totalPayments > 0
    ? Math.round((r.principal / r.totalPayments) * 100) : 0;

  const salaryNum = parseFloat(salary) || 0;
  const dbrUsed   = a?.isValid && salaryNum > 0
    ? ((parseFloat(obligations) || 0) / salaryNum) * 100 : 0;

  const shareText = isInstallment && r?.isValid
    ? `قرض شخصي (الكويت):\nالمبلغ: ${fmt(r.principal)} د.ك\nالقسط الشهري: ${fmt(r.monthly)} د.ك\nإجمالي التكلفة: ${fmt(r.totalPayments)} د.ك`
    : a?.isValid
    ? `قدرة الاقتراض (الكويت):\nأقصى قرض: ${fmt(a.maxLoan)} د.ك\nأقصى قسط شهري: ${fmt(a.maxMonthly)} د.ك`
    : '';

  return (
    <div className="calc-app kw-personal-loan-tool" aria-label="حاسبة القرض الشخصي الكويت">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Mode toggle */}
              <div className="calc-esb-field">
                <div className="calc-period-toggle">
                  <button type="button"
                    className={`calc-period-btn${mode === 'installment' ? ' is-active' : ''}`}
                    onClick={() => setMode('installment')}>القسط الشهري</button>
                  <button type="button"
                    className={`calc-period-btn${mode === 'affordability' ? ' is-active' : ''}`}
                    onClick={() => setMode('affordability')}>قدرة الاقتراض</button>
                </div>
              </div>

              {/* Borrower type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع المقترض</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {[
                    { value: 'national', label: 'كويتي',     sub: `DBR حتى 40% — حد ${fmt(70000)} د.ك` },
                    { value: 'expat',    label: 'وافد (مقيم)', sub: `DBR حتى 30% — حد ${fmt(15000)} د.ك` },
                  ].map((opt) => (
                    <button key={opt.value} type="button"
                      className={`ci-coverage-tab${borrowerType === opt.value ? ' is-active' : ''}`}
                      onClick={() => setBorrowerType(opt.value)}
                    >
                      <span className="ci-tab-label">{opt.label}</span>
                      <span className="ci-tab-sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan amount (installment mode) */}
              {isInstallment && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label htmlFor="kw-loan">مبلغ القرض</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="kw-loan" inputMode="numeric" value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)} placeholder="5000" />
                    <span className="calc-esb-currency">د.ك</span>
                  </div>
                  {borrowerType === 'expat' && parseFloat(loanAmount) > 15000 && (
                    <p className="calc-hint ci-hint-warning">تجاوزت حد الوافدين 15,000 د.ك. قد يرفضه البنك.</p>
                  )}
                </div>
              )}

              {/* Salary + obligations (affordability mode) */}
              {!isInstallment && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label htmlFor="kw-sal">الراتب الصافي الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="kw-sal" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="1200" />
                      <span className="calc-esb-currency">د.ك</span>
                    </div>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label htmlFor="kw-obs">الأقساط الشهرية الحالية</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="kw-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">د.ك</span>
                    </div>
                  </div>
                </>
              )}

              {/* Interest rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{isInstallment ? '3' : '4'}</span>
                  <Label htmlFor="kw-rate">معدل الفائدة السنوي</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input id="kw-rate" inputMode="decimal" value={rate}
                    onChange={(e) => setRate(e.target.value)} placeholder="7" />
                  <span className="calc-esb-currency">%</span>
                </div>
                <p className="calc-hint">المعدلات الشائعة في البنوك الكويتية: 5–9% سنوياً</p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{isInstallment ? '4' : '5'}</span>
                  <Label>مدة القرض</Label>
                </div>
                <Select value={String(termMonths)} onValueChange={(v) => setTermMonths(Number(v))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KUWAIT_LOAN_TERMS.map((t) => (
                      <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RESULT ────────────────────────────────────── */}
        <div className="calc-esb-result-col">

          {/* Installment result */}
          {isInstallment && r?.isValid && (
            <div className="calc-esb-result-panel" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--kw">🇰🇼 الكويت</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">القسط الشهري</span>
                <div className="calc-esb-amount-value">{fmt(r.monthly)}</div>
                <div className="calc-esb-amount-unit">د.ك / شهر</div>
              </div>

              {/* Donut */}
              <div className="calc-result-sec-title">توزيع التكلفة الإجمالية</div>
              <SvgDonut pct={principalPct} sub="أصل القرض" />

              {/* Insight cards */}
              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">إجمالي المدفوعات</span>
                  <span className="calc-insight-value">{fmt(r.totalPayments)}</span>
                  <span className="calc-insight-sub">د.ك</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">تكلفة الفائدة</span>
                  <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>{fmt(r.totalProfit)}</span>
                  <span className="calc-insight-sub">د.ك</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">مدة السداد</span>
                  <span className="calc-insight-value">{termMonths}</span>
                  <span className="calc-insight-sub">شهراً</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">حد {dbrLabel}</span>
                  <span className="calc-insight-value" style={{ color: borrowerType === 'expat' ? 'var(--amber)' : 'var(--green-text)' }}>
                    {borrowerType === 'expat' ? 'وافد 30%' : 'كويتي 40%'}
                  </span>
                  <span className="calc-insight-sub">نسبة التحمّل</span>
                </div>
              </div>

              {r.exceedsCap && (
                <div className="calc-esb-reason-strip" style={{ borderColor: 'var(--red)', color: 'var(--red-text)' }}>
                  <Warning size={14} weight="fill" />
                  <span>المبلغ يتجاوز الحد المسموح به ({fmt(r.maxLoanKWD)} د.ك لـ{borrowerType === 'expat' ? 'الوافدين' : 'الكويتيين'}). يُرجى مراجعة البنك.</span>
                </div>
              )}

              {/* Breakdown */}
              <div className="calc-result-sec-title">ملخص القرض</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow"><span>أصل القرض</span><strong>{fmt(r.principal)} د.ك</strong></div>
                <div className="calc-esb-brow"><span>الفائدة السنوية</span><strong>{rate}%</strong></div>
                <div className="calc-esb-brow"><span>المدة</span><strong>{termMonths} شهراً</strong></div>
                <div className="calc-esb-brow"><span>تكلفة الفائدة</span><strong style={{ color: 'var(--amber)' }}>{fmt(r.totalProfit)} د.ك</strong></div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي النهائي</span><strong>{fmt(r.totalPayments)} د.ك</strong>
                </div>
              </div>

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي الكويت" shareText={shareText} />
            </div>
          )}

          {/* Affordability result */}
          {!isInstallment && a?.isValid && (
            <div className="calc-esb-result-panel" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--kw">🇰🇼 الكويت</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">أقصى قرض متاح</span>
                <div className="calc-esb-amount-value">{fmt(a.maxLoan)}</div>
                <div className="calc-esb-amount-unit">د.ك</div>
              </div>

              {/* DBR meter */}
              <div className="calc-result-sec-title">نسبة تحمّل الدين (DBR)</div>
              <DbrMeter usedPct={dbrUsed} capPct={dbrCap} />

              {/* Insight cards */}
              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">أقصى قسط شهري</span>
                  <span className="calc-insight-value">{fmt(a.maxMonthly)}</span>
                  <span className="calc-insight-sub">د.ك/شهر</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">نسبة DBR ({borrowerType === 'expat' ? 'وافد' : 'كويتي'})</span>
                  <span className="calc-insight-value">{(dbrCap * 100).toFixed(0)}%</span>
                  <span className="calc-insight-sub">حد البنك المركزي</span>
                </div>
              </div>

              {a.exceedsCap && (
                <div className="calc-esb-reason-strip" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}>
                  <Warning size={14} weight="fill" />
                  <span>
                    {a.capUsed === 'expat-cap'
                      ? 'القدرة مقيدة بحد الوافدين: 15,000 د.ك (لا بـ DBR).'
                      : 'القدرة مقيدة بـ 15× الراتب أو 70,000 د.ك (أيهما أقل).'}
                  </span>
                </div>
              )}

              <div className="calc-result-sec-title">ملخص القدرة</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow"><span>الراتب الصافي</span><strong>{fmt(parseFloat(salary) || 0)} د.ك</strong></div>
                <div className="calc-esb-brow"><span>أقساط قائمة</span><strong>{fmt(parseFloat(obligations) || 0)} د.ك</strong></div>
                <div className="calc-esb-brow"><span>حد DBR ({dbrLabel})</span><strong>{(dbrCap * 100).toFixed(0)}% من الراتب</strong></div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>أقصى قرض متاح</span><strong>{fmt(a.maxLoan)} د.ك</strong>
                </div>
              </div>

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي الكويت" shareText={shareText} />
            </div>
          )}

          {/* Empty state */}
          {((isInstallment && !r?.isValid) || (!isInstallment && !a?.isValid)) && (
            <div className="calc-esb-empty-state">
              <CurrencyCircleDollar size={32} weight="duotone" />
              <p>{isInstallment ? 'أدخل مبلغ القرض لحساب القسط الشهري.' : 'أدخل راتبك لمعرفة قدرة الاقتراض.'}</p>
            </div>
          )}

        </div>
      </div>

      <div className="calc-esb-reason-strip" style={{ marginTop: 'var(--space-3)' }}>
        <Warning size={14} weight="fill" />
        <span>أرقام تقديرية وفق لوائح بنك الكويت المركزي. التحقق المفصّل يتم مع البنك مباشرة.</span>
      </div>
    </div>
  );
}
