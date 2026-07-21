"use client";

import { useMemo, useState } from 'react';
import { CurrencyCircleDollar, Info, Warning } from '@phosphor-icons/react';
import {
  QATAR_LOAN_TERMS_NATIONAL,
  QATAR_LOAN_TERMS_EXPAT,
  calcQatarLoanInstallment,
  calcQatarLoanAffordability,
} from '@/lib/calculators/personal-loan';
import {
  CalcInput as Input,
  CalcSelectTrigger as SelectTrigger,
} from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import CountryFlag from '@/components/shared/CountryFlag';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

function fmt(n) { return Math.round(n).toLocaleString('ar-QA-u-nu-latn'); }

/* ── SVG Donut ──────────────────────────────────────────────────── */
function SvgDonut({ pct }) {
  const r = 44; const cx = 52; const cy = 52;
  const circ = 2 * Math.PI * r; const sw = 14;
  const p    = Math.min(Math.max(pct, 0), 100);
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
            strokeDasharray={`${len2} ${len1}`} strokeDashoffset={circ * 0.25 - len1}
            style={{ transition: 'stroke-dasharray 0.55s ease' }} />
        </svg>
        <div className="calc-donut-center-text">
          <span className="calc-donut-center-pct">{p}%</span>
          <span className="calc-donut-center-sub">أصل القرض</span>
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

/* ── DBR Meter ──────────────────────────────────────────────────── */
function DbrMeter({ usedPct, capPct }) {
  const fill = Math.min((usedPct / (capPct * 100)) * 100, 100);
  const tier = fill < 65 ? 'ok' : fill < 90 ? 'warn' : 'over';
  return (
    <div className="calc-dbr-meter">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>نسبة تحمّل الدين (DBR)</span>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, direction: 'ltr', color: tier === 'over' ? 'var(--red-text)' : 'var(--text-primary)' }}>
          {usedPct.toFixed(1)}% / {(capPct * 100).toFixed(0)}%
        </span>
      </div>
      <div className="calc-dbr-track">
        <div className={`calc-dbr-fill calc-dbr-fill--${tier}`} style={{ width: `${fill}%` }} />
      </div>
    </div>
  );
}

/* ── GCC comparison strip ───────────────────────────────────────── */
function GccComparison({ borrowerType }) {
  const rows = [
    { code: 'qa', name: 'قطر (QCB)', dbr: '50%', cap: borrowerType === 'expat' ? '400K ر.ق' : '2M ر.ق', active: true },
    { code: 'ae', name: 'الإمارات (CBUAE)', dbr: '50%', cap: '250K درهم (غير مضمون)', active: false },
    { code: 'kw', name: 'الكويت (CBK)', dbr: '40% / 30%', cap: '70K / 15K د.ك', active: false },
    { code: 'sa', name: 'السعودية (ساما)', dbr: '33%', cap: '60× الراتب', active: false },
  ];
  return (
    <div className="ci-compare-strip">
      <div className="ci-compare-row ci-compare-header">
        <span>الدولة</span><span>DBR</span><span>الحد الأقصى</span>
      </div>
      {rows.map((r) => (
        <div key={r.name} className={`ci-compare-row${r.active ? ' ci-compare-active' : ''}`}
          style={{ gridTemplateColumns: '1fr auto auto', gap: 'var(--space-2)' }}>
          <span><CountryFlag code={r.code} /> {r.name}</span>
          <span style={{ direction: 'ltr', textAlign: 'center' }}>{r.dbr}</span>
          <span style={{ direction: 'ltr', textAlign: 'end', fontSize: 'var(--text-xs)' }}>{r.cap}</span>
        </div>
      ))}
    </div>
  );
}

export default function QatarPersonalLoanCalculator() {
  const [mode,         setMode]         = useState('installment');
  const [borrowerType, setBorrowerType] = useState('national');
  const [loanAmount,   setLoanAmount]   = useState('100000');
  const [salary,       setSalary]       = useState('15000');
  const [obligations,  setObligations]  = useState('0');
  const [rate,         setRate]         = useState('5.5');
  const [termMonths,   setTermMonths]   = useState(60);

  const termOptions = borrowerType === 'expat' ? QATAR_LOAN_TERMS_EXPAT : QATAR_LOAN_TERMS_NATIONAL;
  const maxTerm     = borrowerType === 'expat' ? 48 : 120;
  const safeterm    = Math.min(termMonths, maxTerm);

  const instResult = useMemo(() => {
    if (mode !== 'installment') return null;
    return calcQatarLoanInstallment({ loanAmount, annualRatePct: parseFloat(rate) || 5.5, termMonths: safeterm, borrowerType });
  }, [mode, loanAmount, rate, safeterm, borrowerType]);

  const affordResult = useMemo(() => {
    if (mode !== 'affordability') return null;
    return calcQatarLoanAffordability({ salary, obligations, annualRatePct: parseFloat(rate) || 5.5, termMonths: safeterm, borrowerType });
  }, [mode, salary, obligations, rate, safeterm, borrowerType]);

  const isInstallment = mode === 'installment';
  const r = instResult;
  const a = affordResult;

  const principalPct = r?.isValid && r.totalPayments > 0
    ? Math.round((r.principal / r.totalPayments) * 100) : 0;

  const salaryNum = parseFloat(salary) || 0;
  const dbrUsed   = !isInstallment && a?.isValid && salaryNum > 0
    ? ((parseFloat(obligations) || 0) / salaryNum) * 100 : 0;

  const shareText = isInstallment && r?.isValid
    ? `قرض شخصي (قطر):\nالمبلغ: ${fmt(r.principal)} ر.ق\nالقسط الشهري: ${fmt(r.monthly)} ر.ق\nإجمالي التكلفة: ${fmt(r.totalPayments)} ر.ق`
    : a?.isValid ? `قدرة الاقتراض (قطر):\nأقصى قرض: ${fmt(a.maxLoan)} ر.ق\nأقصى قسط: ${fmt(a.maxMonthly)} ر.ق` : '';

  return (
    <div className="calc-app qa-personal-loan-tool" aria-label="حاسبة القرض الشخصي قطر">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Mode */}
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
                    { value: 'national', label: 'قطري',         sub: `DBR 50% — حد ${fmt(2000000)} ر.ق / 10 سنوات` },
                    { value: 'expat',    label: 'وافد (مقيم)', sub: `DBR 50% — حد ${fmt(400000)} ر.ق / 4 سنوات` },
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
                <p className="calc-hint"><Info size={11} /> مصرف قطر المركزي (QCB) — نفس نسبة DBR 50% للجميع.</p>
              </div>

              {/* Loan amount */}
              {isInstallment && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label htmlFor="qa-loan">مبلغ القرض</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="qa-loan" inputMode="numeric" value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)} placeholder="100000" />
                    <span className="calc-esb-currency">ر.ق</span>
                  </div>
                  {borrowerType === 'expat' && parseFloat(loanAmount) > 400000 && (
                    <p className="calc-hint ci-hint-warning">يتجاوز حد الوافدين 400,000 ر.ق. البنوك قد ترفض أو تطلب ضماناً إضافياً.</p>
                  )}
                </div>
              )}

              {/* Salary + obligations */}
              {!isInstallment && (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label htmlFor="qa-sal">الراتب الصافي الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="qa-sal" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="15000" />
                      <span className="calc-esb-currency">ر.ق</span>
                    </div>
                    {borrowerType === 'national' && parseFloat(salary) < 5000 && (
                      <p className="calc-hint ci-hint-warning">الحد الأدنى للراتب للقطريين: 5,000 ر.ق.</p>
                    )}
                    {borrowerType === 'expat' && parseFloat(salary) < 3000 && (
                      <p className="calc-hint ci-hint-warning">الحد الأدنى للراتب للوافدين: 3,000 ر.ق.</p>
                    )}
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label htmlFor="qa-obs">الأقساط الشهرية الحالية</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="qa-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">ر.ق</span>
                    </div>
                  </div>
                </>
              )}

              {/* Rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{isInstallment ? '3' : '4'}</span>
                  <Label htmlFor="qa-rate">معدل الفائدة السنوي</Label>
                </div>
                <div className="calc-esb-money-row">
                  <Input id="qa-rate" inputMode="decimal" value={rate}
                    onChange={(e) => setRate(e.target.value)} placeholder="5.5" />
                  <span className="calc-esb-currency">%</span>
                </div>
                <p className="calc-hint">المعدلات الشائعة في بنوك قطر: 4.8–7% للقطريين، 5.5–8% للوافدين.</p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{isInstallment ? '4' : '5'}</span>
                  <Label>مدة القرض</Label>
                </div>
                <Select value={String(safeterm)} onValueChange={(v) => setTermMonths(Number(v))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {termOptions.map((t) => (
                      <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {borrowerType === 'expat' && (
                  <p className="calc-hint"><Info size={11} /> الوافدون: الحد الأقصى للمدة 4 سنوات (48 شهراً) في معظم البنوك القطرية.</p>
                )}
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
                <span className="calc-esb-country-badge calc-esb-country-badge--qa"><CountryFlag code="qa" /> قطر — QCB</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">القسط الشهري</span>
                <div className="calc-esb-amount-value">{fmt(r.monthly)}</div>
                <div className="calc-esb-amount-unit">ر.ق / شهر</div>
              </div>

              <div className="calc-result-sec-title">توزيع التكلفة الإجمالية</div>
              <SvgDonut pct={principalPct} />

              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">إجمالي المدفوعات</span>
                  <span className="calc-insight-value">{fmt(r.totalPayments)}</span>
                  <span className="calc-insight-sub">ر.ق</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">تكلفة الفائدة</span>
                  <span className="calc-insight-value" style={{ color: 'var(--amber)' }}>{fmt(r.totalProfit)}</span>
                  <span className="calc-insight-sub">ر.ق</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">مدة السداد</span>
                  <span className="calc-insight-value">{safeterm}</span>
                  <span className="calc-insight-sub">شهراً</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">DBR القطري (QCB)</span>
                  <span className="calc-insight-value" style={{ color: 'var(--blue-text)' }}>50%</span>
                  <span className="calc-insight-sub">للجميع</span>
                </div>
              </div>

              {r.exceedsCap && (
                <div className="calc-esb-reason-strip" style={{ borderColor: 'var(--red)', color: 'var(--red-text)' }}>
                  <Warning size={14} weight="fill" />
                  <span>المبلغ يتجاوز حد {borrowerType === 'expat' ? 'الوافدين 400,000' : 'القطريين 2,000,000'} ريال قطري.</span>
                </div>
              )}

              <div className="calc-result-sec-title">ملخص القرض</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow"><span>أصل القرض</span><strong>{fmt(r.principal)} ر.ق</strong></div>
                <div className="calc-esb-brow"><span>الفائدة السنوية</span><strong>{rate}%</strong></div>
                <div className="calc-esb-brow"><span>المدة</span><strong>{safeterm} شهراً</strong></div>
                <div className="calc-esb-brow"><span>تكلفة الفائدة</span><strong style={{ color: 'var(--amber)' }}>{fmt(r.totalProfit)} ر.ق</strong></div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>الإجمالي النهائي</span><strong>{fmt(r.totalPayments)} ر.ق</strong>
                </div>
              </div>

              <div className="calc-result-sec-title">مقارنة دول الخليج</div>
              <GccComparison borrowerType={borrowerType} />

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي قطر" shareText={shareText} />
            </div>
          )}

          {/* Affordability result */}
          {!isInstallment && a?.isValid && (
            <div className="calc-esb-result-panel" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--qa"><CountryFlag code="qa" /> قطر — QCB</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">أقصى قرض متاح</span>
                <div className="calc-esb-amount-value">{fmt(a.maxLoan)}</div>
                <div className="calc-esb-amount-unit">ر.ق</div>
              </div>

              <div className="calc-result-sec-title">نسبة تحمّل الدين (DBR)</div>
              <DbrMeter usedPct={dbrUsed} capPct={0.50} />

              <div className="calc-insight-row">
                <div className="calc-insight-card">
                  <span className="calc-insight-label">أقصى قسط شهري</span>
                  <span className="calc-insight-value">{fmt(a.maxMonthly)}</span>
                  <span className="calc-insight-sub">ر.ق/شهر</span>
                </div>
                <div className="calc-insight-card">
                  <span className="calc-insight-label">DBR (QCB)</span>
                  <span className="calc-insight-value">50%</span>
                  <span className="calc-insight-sub">للجميع — أعلى من الخليج</span>
                </div>
              </div>

              {a.exceedsCap && (
                <div className="calc-esb-reason-strip" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}>
                  <Warning size={14} weight="fill" />
                  <span>
                    القدرة مقيدة بحد {a.capUsed === 'expat-cap'
                      ? `الوافدين: ${fmt(a.hardCap)} ر.ق`
                      : `القطريين: ${fmt(a.hardCap)} ر.ق`} لا بنسبة DBR.
                  </span>
                </div>
              )}

              <div className="calc-result-sec-title">ملخص القدرة</div>
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow"><span>الراتب الصافي</span><strong>{fmt(parseFloat(salary) || 0)} ر.ق</strong></div>
                <div className="calc-esb-brow"><span>أقساط قائمة</span><strong>{fmt(parseFloat(obligations) || 0)} ر.ق</strong></div>
                <div className="calc-esb-brow"><span>حد DBR (QCB 50%)</span><strong>50% من الراتب</strong></div>
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span>أقصى قرض متاح</span><strong>{fmt(a.maxLoan)} ر.ق</strong>
                </div>
              </div>

              <div className="calc-result-sec-title">مقارنة دول الخليج</div>
              <GccComparison borrowerType={borrowerType} />

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي قطر" shareText={shareText} />
            </div>
          )}

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
        <span>أرقام تقديرية وفق لوائح مصرف قطر المركزي. الموافقة النهائية تعتمد على التقييم الائتماني للبنك.</span>
      </div>
    </div>
  );
}
