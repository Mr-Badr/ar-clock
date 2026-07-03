"use client";

import { useMemo, useState } from 'react';
import { CurrencyDollar, Info, Warning } from '@phosphor-icons/react';
import {
  SAUDI_LOAN_TERMS,
  UAE_PERSONAL_LOAN_TERMS,
  calcSaudiLoanAffordability,
  calcSaudiLoanInstallment,
  calcUaeLoanAffordability,
  calcUaeLoanInstallment,
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

function fmtSA(n) { return Math.round(n).toLocaleString('ar-SA'); }
function fmtAE(n) { return Math.round(n).toLocaleString('ar-AE'); }

/* ── Inline SVG donut ────────────────────────────────────────── */
function SvgDonut({ principalPct, color1 = 'var(--green)', color2 = 'var(--amber)', label, sub }) {
  const r = 44; const cx = 52; const cy = 52;
  const circ = 2 * Math.PI * r;
  const sw = 14;
  const intPct = Math.max(0, Math.min(100, 100 - principalPct));
  const len1 = (principalPct / 100) * circ;
  const len2 = (intPct / 100) * circ;
  return (
    <div className="calc-donut-wrap">
      <div className="calc-donut-center-wrap">
        <svg viewBox="0 0 104 104" fill="none">
          <circle cx={cx} cy={cy} r={r} stroke="var(--border-default)" strokeWidth={sw} />
          <circle cx={cx} cy={cy} r={r} stroke={color1} strokeWidth={sw}
            strokeDasharray={`${len1} ${circ - len1}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="butt"
            style={{ transition: 'stroke-dasharray 0.55s ease' }}
          />
          <circle cx={cx} cy={cy} r={r} stroke={color2} strokeWidth={sw}
            strokeDasharray={`${len2} ${circ - len2}`}
            strokeDashoffset={circ * 0.25 - len1}
            strokeLinecap="butt"
            style={{ transition: 'stroke-dasharray 0.55s ease, stroke-dashoffset 0.55s ease' }}
          />
        </svg>
        <div className="calc-donut-center-text">
          <span className="calc-donut-center-pct">{Math.round(principalPct)}%</span>
          <span className="calc-donut-center-sub">{sub}</span>
        </div>
      </div>
      <div className="calc-donut-legend">
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: color1 }} />
          <span className="calc-donut-legend-label">{label?.a ?? 'رأس المال'}</span>
          <span className="calc-donut-legend-val">{Math.round(principalPct)}%</span>
        </div>
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: color2 }} />
          <span className="calc-donut-legend-label">{label?.b ?? 'الفائدة'}</span>
          <span className="calc-donut-legend-val">{Math.round(intPct)}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── DBR usage bar ───────────────────────────────────────────── */
function DbrMeter({ usedPct, capPct, usedLabel, capLabel }) {
  const display = Math.min(usedPct, 110);
  const tier = usedPct >= capPct ? 'over' : usedPct >= capPct * 0.85 ? 'warn' : 'ok';
  return (
    <div className="calc-dbr-meter">
      <div className="calc-dbr-header">
        <span className="calc-dbr-title">استخدام DBR من حد الراتب</span>
        <span className={`calc-dbr-pct-label calc-dbr-pct-label--${tier}`}>
          {usedPct.toFixed(1)}% / {capPct}%
        </span>
      </div>
      <div className="calc-dbr-track">
        <div
          className={`calc-dbr-fill calc-dbr-fill--${tier}`}
          style={{ width: `${Math.min(100, (display / capPct) * 100).toFixed(1)}%` }}
        />
      </div>
      <div className="calc-dbr-sub">
        {usedLabel} · الحد: {capLabel}
      </div>
    </div>
  );
}

const MODES = [
  { value: 'installment',   label: 'القسط الشهري',     sub: 'أعرف مبلغ القرض' },
  { value: 'affordability', label: 'كم أستطيع اقتراض', sub: 'من الراتب' },
];
const COUNTRIES = [
  { value: 'saudi', label: '🇸🇦 السعودية', currency: 'ر.س', fmt: fmtSA, dbr: 0.33, dbrLabel: 'ساما 33%', cap: 'ساما — 33% DBR · 60× الراتب' },
  { value: 'uae',   label: '🇦🇪 الإمارات', currency: 'د.إ', fmt: fmtAE, dbr: 0.50, dbrLabel: 'CBUAE 50%', cap: 'CBUAE — 50% DBR · 250,000 د.إ سقف' },
];

export default function PersonalLoanCalculator() {
  const [country,     setCountry]     = useState('saudi');
  const [mode,        setMode]        = useState('installment');
  const [loanAmount,  setLoanAmount]  = useState('50000');
  const [annualRate,  setAnnualRate]  = useState([6.5]);
  const [termMonths,  setTermMonths]  = useState('36');
  const [salary,      setSalary]      = useState('10000');
  const [obligations, setObligations] = useState('0');

  const ci = COUNTRIES.find((c) => c.value === country) ?? COUNTRIES[0];
  const terms = country === 'saudi' ? SAUDI_LOAN_TERMS : UAE_PERSONAL_LOAN_TERMS;

  const installmentResult = useMemo(() => {
    const a = { loanAmount, annualRatePct: annualRate[0], termMonths: +termMonths };
    return country === 'saudi' ? calcSaudiLoanInstallment(a) : calcUaeLoanInstallment(a);
  }, [country, loanAmount, annualRate, termMonths]);

  const affordabilityResult = useMemo(() => {
    const a = { salary, obligations, annualRatePct: annualRate[0], termMonths: +termMonths };
    return country === 'saudi' ? calcSaudiLoanAffordability(a) : calcUaeLoanAffordability(a);
  }, [country, salary, obligations, annualRate, termMonths]);

  const result = mode === 'installment' ? installmentResult : affordabilityResult;
  const badgeClass = country === 'saudi' ? 'calc-esb-country-badge--sa' : 'calc-esb-country-badge--ae';

  const shareText = (mode === 'installment' && installmentResult.isValid)
    ? `حاسبة القرض الشخصي (${ci.label}):\nمبلغ: ${ci.fmt(installmentResult.principal)} ${ci.currency} — ${installmentResult.termMonths} شهراً\nالقسط الشهري: ${ci.fmt(installmentResult.monthly)} ${ci.currency}`
    : (mode === 'affordability' && affordabilityResult.isValid && affordabilityResult.maxLoan > 0)
    ? `قدرة الاقتراض (${ci.label}):\nأقصى قرض: ${ci.fmt(affordabilityResult.maxLoan)} ${ci.currency}`
    : '';

  return (
    <div className="calc-app personal-loan-tool" aria-label="حاسبة القرض الشخصي">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Country */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>الدولة</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.value}
                      className={`ci-coverage-tab${country === c.value ? ' is-active' : ''}`}
                      onClick={() => { setCountry(c.value); setTermMonths('36'); }}
                      type="button"
                    >
                      <span className="ci-tab-label">{c.label}</span>
                      <span className="ci-tab-sub">{c.dbrLabel}</span>
                    </button>
                  ))}
                </div>
                <p className="calc-hint"><Info size={11} /> {ci.cap}</p>
              </div>

              {/* Mode */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>ما الذي تريد حسابه؟</Label>
                </div>
                <div className="ci-coverage-tabs">
                  {MODES.map((m) => (
                    <button key={m.value} type="button"
                      className={`ci-coverage-tab${mode === m.value ? ' is-active' : ''}`}
                      onClick={() => setMode(m.value)}
                    >
                      <span className="ci-tab-label">{m.label}</span>
                      <span className="ci-tab-sub">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'installment' ? (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label htmlFor="pl-amount">مبلغ القرض</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="pl-amount" inputMode="numeric" value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)} placeholder="50000" />
                    <span className="calc-esb-currency">{ci.currency}</span>
                  </div>
                  {country === 'uae' && parseFloat(loanAmount) > 250000 && (
                    <p className="calc-hint ci-hint-warning">
                      <Warning size={11} /> تجاوزت سقف 250,000 د.إ للقروض غير المضمونة. قد تحتاج ضمانات.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label htmlFor="pl-salary">الراتب الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="pl-salary" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="10000" />
                      <span className="calc-esb-currency">{ci.currency}</span>
                    </div>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">4</span>
                      <Label htmlFor="pl-obs">التزامات شهرية قائمة</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="pl-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">{ci.currency}</span>
                    </div>
                    <p className="calc-hint">أقساط سيارة، قروض أخرى، بطاقات ائتمان.</p>
                  </div>
                </>
              )}

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '4' : '5'}</span>
                  <Label>معدل الفائدة السنوي — <strong>{annualRate[0]}%</strong></Label>
                </div>
                <Slider className="calc-slider" min={3} max={20} step={0.5}
                  value={annualRate} onValueChange={setAnnualRate} />
                <p className="calc-hint">
                  {country === 'saudi' ? 'متوسط 2024: 5 – 9% (يختلف حسب البنك والراتب).'
                    : 'متوسط 2024: 6 – 12% (يختلف حسب البنك وجهة التحويل).'}
                </p>
              </div>

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

        {/* ── RESULT ────────────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className={`calc-esb-country-badge ${badgeClass}`}>{ci.label}</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* ── INSTALLMENT MODE ─── */}
              {mode === 'installment' && installmentResult.isValid && (() => {
                const r = installmentResult;
                const principalPct = Math.round((r.principal / r.totalPayments) * 100);
                const intPct = 100 - principalPct;
                const weekly = Math.round(r.monthly / (30 / 7));
                const yearsStr = r.termMonths >= 12
                  ? `${Math.floor(r.termMonths / 12)}س${r.termMonths % 12 > 0 ? ` ${r.termMonths % 12}ش` : ''}`
                  : `${r.termMonths} شهراً`;
                return (
                  <>
                    <div className="calc-esb-amount-hero">
                      <span className="calc-esb-amount-label">القسط الشهري</span>
                      <div className="calc-esb-amount-value">{ci.fmt(r.monthly)} {ci.currency}</div>
                      <div className="calc-esb-amount-meta">
                        <span>{r.termMonths} شهراً · {r.annualRatePct}% فائدة</span>
                      </div>
                    </div>

                    {/* Donut chart: principal vs interest */}
                    <div className="calc-result-sec-title">توزيع المبلغ الكلي</div>
                    <SvgDonut
                      principalPct={principalPct}
                      color1="var(--green)"
                      color2="var(--amber)"
                      label={{ a: 'رأس المال', b: 'الفائدة' }}
                      sub="رأس المال"
                    />

                    {/* Stacked bar */}
                    <div className="calc-prop-bar">
                      <div className="calc-prop-seg calc-prop-seg--prin" style={{ width: `${principalPct}%` }} />
                      <div className="calc-prop-seg calc-prop-seg--int" style={{ width: `${intPct}%` }} />
                    </div>
                    <div className="calc-prop-legend">
                      <span><span className="calc-prop-dot calc-prop-dot--prin" />رأس المال: {ci.fmt(r.principal)} {ci.currency}</span>
                      <span><span className="calc-prop-dot calc-prop-dot--int" />الفائدة: {ci.fmt(r.totalProfit)} {ci.currency}</span>
                    </div>

                    {/* Insight cards */}
                    <div className="calc-result-sec-title">تفاصيل مالية</div>
                    <div className="calc-insight-row">
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">أسبوعياً</span>
                        <span className="calc-insight-value">{ci.fmt(weekly)} {ci.currency}</span>
                        <span className="calc-insight-sub">تقريب شهري ÷ 4.3</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">إجمالي الفائدة</span>
                        <span className="calc-insight-value">{intPct}%</span>
                        <span className="calc-insight-sub">من مجموع المدفوعات</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">المدة</span>
                        <span className="calc-insight-value">{yearsStr}</span>
                        <span className="calc-insight-sub">{r.termMonths} قسطاً</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">الإجمالي</span>
                        <span className="calc-insight-value">{ci.fmt(r.totalPayments)}</span>
                        <span className="calc-insight-sub">{ci.currency}</span>
                      </div>
                    </div>

                    {installmentResult.exceedsUnsecuredCap && (
                      <p className="calc-hint ci-hint-warning" style={{ marginTop: 'var(--space-2)', display: 'flex', gap: '6px' }}>
                        <Warning size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>المبلغ يتجاوز سقف 250,000 د.إ. قد يشترط البنك ضمانات.</span>
                      </p>
                    )}
                  </>
                );
              })()}

              {/* ── AFFORDABILITY MODE ─── */}
              {mode === 'affordability' && affordabilityResult.isValid && (() => {
                const r = affordabilityResult;
                if (r.maxLoan <= 0) return (
                  <div className="eg-zero-notice">
                    <Warning size={22} weight="fill" />
                    <div>
                      <strong>التزاماتك تستنفد حد DBR</strong>
                      <span>لا هامش لقسط إضافي بالراتب والالتزامات المدخلة.</span>
                    </div>
                  </div>
                );

                const usedPct = ((r.maxMonthly + parseFloat(obligations || '0')) / r.salary) * 100;
                const capPct = r.dbrCap * 100;
                return (
                  <>
                    <div className="calc-esb-amount-hero">
                      <span className="calc-esb-amount-label">أقصى قرض شخصي ممكن</span>
                      <div className="calc-esb-amount-value">{ci.fmt(r.maxLoan)} {ci.currency}</div>
                      <div className="calc-esb-amount-meta">
                        <span>أقصى قسط: {ci.fmt(r.maxMonthly)} {ci.currency}/شهر</span>
                      </div>
                    </div>

                    {/* DBR gauge */}
                    <DbrMeter
                      usedPct={Math.min(usedPct, 100)}
                      capPct={capPct}
                      usedLabel={`قسط حتى ${ci.fmt(r.maxMonthly)} ${ci.currency}`}
                      capLabel={`${capPct}% من ${ci.fmt(r.salary)} ${ci.currency}`}
                    />

                    <div className="calc-result-sec-title">التفاصيل</div>
                    <div className="calc-esb-breakdown">
                      <div className="calc-esb-brow">
                        <span>الراتب</span>
                        <strong>{ci.fmt(r.salary)} {ci.currency}</strong>
                      </div>
                      <div className="calc-esb-brow">
                        <span>التزامات قائمة</span>
                        <strong>{ci.fmt(r.obligations)} {ci.currency}</strong>
                      </div>
                      <div className="calc-esb-brow">
                        <span>حد DBR ({capPct}%)</span>
                        <strong>أقصى قسط = {ci.fmt(r.maxMonthly)} {ci.currency}</strong>
                      </div>
                      {country === 'saudi' && r.samaCap1 && (
                        <div className="calc-esb-brow">
                          <span>حد 60× الراتب</span>
                          <strong>{ci.fmt(r.samaCap1)} {ci.currency}</strong>
                        </div>
                      )}
                      {country === 'uae' && (
                        <div className="calc-esb-brow">
                          <span>سقف غير مضمون</span>
                          <strong>250,000 {ci.currency}</strong>
                        </div>
                      )}
                      <div className="calc-esb-brow calc-esb-brow--total">
                        <span>أقصى قرض</span>
                        <strong>{ci.fmt(r.maxLoan)} {ci.currency}</strong>
                      </div>
                    </div>

                    <div className="calc-insight-row">
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">DBR المستخدم</span>
                        <span className="calc-insight-value">{Math.min(usedPct, 100).toFixed(1)}%</span>
                        <span className="calc-insight-sub">من {capPct}% مسموح</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">الهامش المتبقي</span>
                        <span className="calc-insight-value">{ci.fmt(r.salary * r.dbrCap - r.maxMonthly - parseFloat(obligations || '0'))} {ci.currency}</span>
                        <span className="calc-insight-sub">شهرياً</span>
                      </div>
                    </div>

                    {r.capUsed === 'salary-multiple' && (
                      <p className="calc-hint" style={{ marginTop: 'var(--space-2)' }}>
                        <Info size={11} /> القيد الفعلي هو حد 60× الراتب (ساما)، وليس نسبة DBR.
                      </p>
                    )}
                    {r.capUsed === 'unsecured-cap' && (
                      <p className="calc-hint ci-hint-warning" style={{ marginTop: 'var(--space-2)', display: 'flex', gap: '6px' }}>
                        <Warning size={11} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>الحد مقيّد بسقف 250,000 د.إ. قرض أعلى يستلزم ضمانات.</span>
                      </p>
                    )}
                  </>
                );
              })()}

              <ResultActions copyText={shareText} shareTitle="حاسبة القرض الشخصي" shareText={shareText} />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — تختلف الأسعار والشروط بين البنوك. تواصل مع البنك للحصول على عرض رسمي.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <CurrencyDollar size={32} weight="duotone" />
              <p>{mode === 'installment' ? 'أدخل مبلغ القرض لعرض القسط.' : 'أدخل راتبك لحساب أقصى قرض ممكن.'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
