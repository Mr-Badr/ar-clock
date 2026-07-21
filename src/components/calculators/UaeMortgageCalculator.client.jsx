"use client";

import { useMemo, useState } from 'react';
import { House, Info, Warning } from '@phosphor-icons/react';
import {
  UAE_LOAN_TERMS,
  UAE_PROPERTY_TYPES,
  calcMonthlyPayment,
  calcUaeMortgageAffordability,
  calcUaeMortgageInstallment,
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
import CountryFlag from '@/components/shared/CountryFlag';

function fmt(n) { return Math.round(n).toLocaleString('ar-AE-u-nu-latn'); }

/* ── Three-segment stacked bar ───────────────────────────────── */
function ThreeBar({ downPct, principalPct, interestPct }) {
  return (
    <>
      <div className="calc-prop-bar">
        <div className="calc-prop-seg calc-prop-seg--down" style={{ width: `${downPct}%` }} />
        <div className="calc-prop-seg calc-prop-seg--prin" style={{ width: `${principalPct}%` }} />
        <div className="calc-prop-seg calc-prop-seg--int"  style={{ width: `${interestPct}%` }} />
      </div>
      <div className="calc-prop-legend">
        <span><span className="calc-prop-dot calc-prop-dot--down" />دفعة أولى {Math.round(downPct)}%</span>
        <span><span className="calc-prop-dot calc-prop-dot--prin" />أصل التمويل {Math.round(principalPct)}%</span>
        <span><span className="calc-prop-dot calc-prop-dot--int" />الفائدة {Math.round(interestPct)}%</span>
      </div>
    </>
  );
}

/* ── DBR gauge ───────────────────────────────────────────────── */
function DbrMeter({ usedPct, capPct }) {
  const tier = usedPct >= capPct ? 'over' : usedPct >= capPct * 0.85 ? 'warn' : 'ok';
  return (
    <div className="calc-dbr-meter">
      <div className="calc-dbr-header">
        <span className="calc-dbr-title">استخدام DBR (حد CBUAE 50%)</span>
        <span className={`calc-dbr-pct-label calc-dbr-pct-label--${tier}`}>
          {usedPct.toFixed(1)}% / {capPct}%
        </span>
      </div>
      <div className="calc-dbr-track">
        <div
          className={`calc-dbr-fill calc-dbr-fill--${tier}`}
          style={{ width: `${Math.min(100, (usedPct / capPct) * 100).toFixed(1)}%` }}
        />
      </div>
      <div className="calc-dbr-sub">
        الفارق مع السعودية: البنك المركزي الإماراتي يسمح بـ 50% مقابل 33% (ساما)
      </div>
    </div>
  );
}

/* ── Inline SVG donut for principal vs interest ──────────────── */
function SvgDonut({ principalPct }) {
  const r = 44; const cx = 52; const cy = 52;
  const circ = 2 * Math.PI * r; const sw = 14;
  const intPct = 100 - principalPct;
  const len1 = (principalPct / 100) * circ;
  const len2 = (intPct / 100) * circ;
  return (
    <div className="calc-donut-wrap">
      <div className="calc-donut-center-wrap">
        <svg viewBox="0 0 104 104" fill="none">
          <circle cx={cx} cy={cy} r={r} stroke="var(--border-default)" strokeWidth={sw} />
          <circle cx={cx} cy={cy} r={r} stroke="var(--green)" strokeWidth={sw}
            strokeDasharray={`${len1} ${circ - len1}`} strokeDashoffset={circ * 0.25}
            style={{ transition: 'stroke-dasharray 0.55s ease' }} />
          <circle cx={cx} cy={cy} r={r} stroke="var(--amber)" strokeWidth={sw}
            strokeDasharray={`${len2} ${circ - len2}`} strokeDashoffset={circ * 0.25 - len1}
            style={{ transition: 'stroke-dasharray 0.55s ease, stroke-dashoffset 0.55s ease' }} />
        </svg>
        <div className="calc-donut-center-text">
          <span className="calc-donut-center-pct">{Math.round(principalPct)}%</span>
          <span className="calc-donut-center-sub">أصل</span>
        </div>
      </div>
      <div className="calc-donut-legend">
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: 'var(--green)' }} />
          <span className="calc-donut-legend-label">أصل التمويل</span>
          <span className="calc-donut-legend-val">{Math.round(principalPct)}%</span>
        </div>
        <div className="calc-donut-legend-item">
          <span className="calc-donut-legend-color" style={{ background: 'var(--amber)' }} />
          <span className="calc-donut-legend-label">إجمالي الفائدة</span>
          <span className="calc-donut-legend-val">{Math.round(intPct)}%</span>
        </div>
      </div>
    </div>
  );
}

const MODES = [
  { value: 'installment',   label: 'القسط الشهري',  sub: 'أعرف سعر العقار' },
  { value: 'affordability', label: 'قدرة الاقتراض', sub: 'من الراتب' },
];

export default function UaeMortgageCalculator() {
  const [mode,          setMode]          = useState('installment');
  const [propertyPrice, setPropertyPrice] = useState('1500000');
  const [propertyType,  setPropertyType]  = useState('first-resident');
  const [annualRate,    setAnnualRate]    = useState([4.5]);
  const [termYears,     setTermYears]     = useState('25');
  const [salary,        setSalary]        = useState('20000');
  const [obligations,   setObligations]   = useState('0');

  const installRes = useMemo(
    () => calcUaeMortgageInstallment({ propertyPrice, propertyType, annualRatePct: annualRate[0], termYears: +termYears }),
    [propertyPrice, propertyType, annualRate, termYears],
  );
  const affordRes = useMemo(
    () => calcUaeMortgageAffordability({ salary, obligations, annualRatePct: annualRate[0], termYears: +termYears }),
    [salary, obligations, annualRate, termYears],
  );

  const result = mode === 'installment' ? installRes : affordRes;
  const selectedType = UAE_PROPERTY_TYPES.find((t) => t.value === propertyType);

  const shareText = (mode === 'installment' && installRes.isValid)
    ? `التمويل العقاري (الإمارات):\nسعر: ${fmt(installRes.propertyPrice)} د.إ · تمويل: ${fmt(installRes.maxLoan)} د.إ\nالقسط: ${fmt(installRes.monthly)} د.إ/شهر`
    : (mode === 'affordability' && affordRes.isValid && affordRes.maxLoan > 0)
    ? `قدرة الاقتراض (الإمارات):\nأقصى تمويل: ${fmt(affordRes.maxLoan)} د.إ\nأقصى عقار: ${fmt(affordRes.maxProperty)} د.إ`
    : '';

  return (
    <div className="calc-app uae-mortgage-tool" aria-label="حاسبة التمويل العقاري الإمارات">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────────────── */}
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
                    <span className="calc-esb-step">2</span>
                    <Label htmlFor="uae-price">سعر العقار</Label>
                  </div>
                  <div className="calc-esb-money-row">
                    <Input id="uae-price" inputMode="numeric" value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)} placeholder="1500000" />
                    <span className="calc-esb-currency">د.إ</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">2</span>
                      <Label htmlFor="uae-sal">الراتب الشهري</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="uae-sal" inputMode="numeric" value={salary}
                        onChange={(e) => setSalary(e.target.value)} placeholder="20000" />
                      <span className="calc-esb-currency">د.إ</span>
                    </div>
                  </div>
                  <div className="calc-esb-field">
                    <div className="calc-esb-field-label">
                      <span className="calc-esb-step">3</span>
                      <Label htmlFor="uae-obs">التزامات شهرية قائمة</Label>
                    </div>
                    <div className="calc-esb-money-row">
                      <Input id="uae-obs" inputMode="numeric" value={obligations}
                        onChange={(e) => setObligations(e.target.value)} placeholder="0" />
                      <span className="calc-esb-currency">د.إ</span>
                    </div>
                    <p className="calc-hint">أقساط سيارة، قروض شخصية، بطاقات ائتمان.</p>
                  </div>
                </>
              )}

              {/* Property type */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '3' : '4'}</span>
                  <Label>نوع المقترض والعقار</Label>
                </div>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UAE_PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedType && (
                  <p className="calc-hint">
                    أقصى LTV: <strong>{Math.round(selectedType.maxLtv * 100)}%</strong>
                    {' — '}دفعة أولى لا تقل عن <strong>{Math.round((1 - selectedType.maxLtv) * 100)}%</strong>
                  </p>
                )}
              </div>

              {/* Rate */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '4' : '5'}</span>
                  <Label>معدل الفائدة السنوي — <strong>{annualRate[0]}%</strong></Label>
                </div>
                <Slider className="calc-slider" min={2} max={9} step={0.25}
                  value={annualRate} onValueChange={setAnnualRate} />
                <p className="calc-hint">متوسط السوق 2024: 4 – 6.5% (EIBOR أو ثابت 3 سنوات).</p>
              </div>

              {/* Term */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">{mode === 'installment' ? '5' : '6'}</span>
                  <Label>مدة التمويل</Label>
                </div>
                <Select value={String(termYears)} onValueChange={setTermYears}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UAE_LOAN_TERMS.map((t) => (
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
                <span className="calc-esb-country-badge calc-esb-country-badge--ae"><CountryFlag code="ae" /> الإمارات</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* ── INSTALLMENT ─── */}
              {mode === 'installment' && installRes.isValid && (() => {
                const r = installRes;
                const totalCost = r.minDownPayment + r.totalPayments;
                const downPct   = Math.round((r.minDownPayment / totalCost) * 100);
                const prinPct   = Math.round((r.maxLoan / totalCost) * 100);
                const intPct    = Math.max(0, 100 - downPct - prinPct);
                const loanPrinPct = Math.round((r.maxLoan / r.totalPayments) * 100);
                const weeklyAmt = Math.round(r.monthly / (30 / 7));

                return (
                  <>
                    <div className="calc-esb-amount-hero">
                      <span className="calc-esb-amount-label">القسط الشهري</span>
                      <div className="calc-esb-amount-value">{fmt(r.monthly)} د.إ</div>
                      <div className="calc-esb-amount-meta">
                        <span>تمويل: {fmt(r.maxLoan)} د.إ · {r.termYears} سنة · {r.annualRatePct}%</span>
                      </div>
                    </div>

                    {/* LTV bar */}
                    <div className="calc-result-sec-title">نسبة الدفعة الأولى مقابل التمويل</div>
                    <div className="calc-ltv-bar-wrap">
                      <div className="calc-ltv-bar-labels">
                        <span>دفعة أولى {Math.round((1 - r.maxLtv) * 100)}%</span>
                        <span>تمويل {Math.round(r.maxLtv * 100)}%</span>
                      </div>
                      <div className="calc-ltv-bar">
                        <div className="calc-ltv-seg-down" style={{ width: `${Math.round((1 - r.maxLtv) * 100)}%` }} />
                        <div className="calc-ltv-seg-loan" style={{ width: `${Math.round(r.maxLtv * 100)}%` }} />
                      </div>
                    </div>

                    {/* Donut: principal vs interest on loan payments */}
                    <div className="calc-result-sec-title">توزيع إجمالي مدفوعات التمويل</div>
                    <SvgDonut principalPct={loanPrinPct} />

                    {/* Three-segment bar (full cost) */}
                    <div className="calc-result-sec-title">التكلفة الكاملة للعقار</div>
                    <ThreeBar downPct={downPct} principalPct={prinPct} interestPct={intPct} />

                    {/* Insight cards */}
                    <div className="calc-insight-row">
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">الدفعة الأولى</span>
                        <span className="calc-insight-value">{fmt(r.minDownPayment)} د.إ</span>
                        <span className="calc-insight-sub">{Math.round((1 - r.maxLtv) * 100)}% من سعر العقار</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">تكلفة الفائدة</span>
                        <span className="calc-insight-value">{fmt(r.totalProfit)} د.إ</span>
                        <span className="calc-insight-sub">فوق أصل التمويل</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">أسبوعياً</span>
                        <span className="calc-insight-value">{fmt(weeklyAmt)} د.إ</span>
                        <span className="calc-insight-sub">تقريب</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">إجمالي الدفع</span>
                        <span className="calc-insight-value">{fmt(r.totalPayments)} د.إ</span>
                        <span className="calc-insight-sub">على {r.termYears} سنة</span>
                      </div>
                    </div>

                    {/* Rate sensitivity strip */}
                    <div className="calc-result-sec-title">تأثير الفائدة على القسط</div>
                    <div className="m-rate-strip">
                      {[annualRate[0] - 1, annualRate[0], annualRate[0] + 1]
                        .filter((v) => v > 0 && v <= 12)
                        .map((v) => (
                          <div key={v} className={`ci-factor-row ci-factor-row--2col${v === annualRate[0] ? ' ci-compare-active' : ''}`}>
                            <span className="ci-factor-label">{v}% فائدة</span>
                            <span className="ci-factor-effect">{fmt(calcMonthlyPayment(r.maxLoan, v, r.termYears))} د.إ/شهر</span>
                          </div>
                        ))}
                    </div>
                  </>
                );
              })()}

              {/* ── AFFORDABILITY ─── */}
              {mode === 'affordability' && affordRes.isValid && (() => {
                const r = affordRes;
                if (r.maxLoan <= 0) return (
                  <div className="eg-zero-notice">
                    <Warning size={22} weight="fill" />
                    <div>
                      <strong>التزاماتك تستنفد حد DBR</strong>
                      <span>لا هامش لقسط تمويل إضافي بالراتب والالتزامات المدخلة.</span>
                    </div>
                  </div>
                );
                const usedPct = ((parseFloat(obligations || 0) + r.maxMonthly) / r.salary) * 100;
                return (
                  <>
                    <div className="calc-esb-amount-hero">
                      <span className="calc-esb-amount-label">أقصى قيمة عقار يمكنك شراؤه</span>
                      <div className="calc-esb-amount-value">{fmt(r.maxProperty)} د.إ</div>
                      <div className="calc-esb-amount-meta">
                        <span>أقصى تمويل: {fmt(r.maxLoan)} د.إ (LTV 80%)</span>
                      </div>
                    </div>

                    <DbrMeter usedPct={Math.min(usedPct, 100)} capPct={50} />

                    <div className="calc-insight-row">
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">أقصى قسط</span>
                        <span className="calc-insight-value">{fmt(r.maxMonthly)} د.إ</span>
                        <span className="calc-insight-sub">50% من الراتب − التزامات</span>
                      </div>
                      <div className="calc-insight-card">
                        <span className="calc-insight-label">DBR المستخدم</span>
                        <span className="calc-insight-value">{Math.min(usedPct, 100).toFixed(1)}%</span>
                        <span className="calc-insight-sub">من 50% مسموح</span>
                      </div>
                    </div>

                    <div className="calc-result-sec-title">التفاصيل</div>
                    <div className="calc-esb-breakdown">
                      <div className="calc-esb-brow">
                        <span>الراتب</span><strong>{fmt(r.salary)} د.إ</strong>
                      </div>
                      <div className="calc-esb-brow">
                        <span>التزامات قائمة</span><strong>{fmt(r.obligations)} د.إ</strong>
                      </div>
                      <div className="calc-esb-brow">
                        <span>DBR 50% → أقصى قسط</span><strong>{fmt(r.maxMonthly)} د.إ</strong>
                      </div>
                      <div className="calc-esb-brow calc-esb-brow--total">
                        <span>أقصى تمويل</span><strong>{fmt(r.maxLoan)} د.إ</strong>
                      </div>
                    </div>

                    <div className="ci-factors" style={{ marginTop: 'var(--space-3)' }}>
                      <div className="ci-factors-title"><Info size={13} /> DBR الإمارات مقابل السعودية</div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                        CBUAE يسمح بـ 50% من الراتب للأقساط — ضعف السماح بالسعودية (33%). هذا يعني
                        قدرة اقتراض أعلى بـ ~52% لنفس الراتب في الإمارات.
                      </p>
                    </div>
                  </>
                );
              })()}

              <ResultActions copyText={shareText} shareTitle="حاسبة التمويل العقاري الإمارات" shareText={shareText} />
              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>نتيجة تقديرية — تواصل مع البنك للحصول على عرض رسمي وفق وضعك الائتماني.</span>
              </div>
            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <House size={32} weight="duotone" />
              <p>{mode === 'installment' ? 'أدخل سعر العقار لعرض القسط.' : 'أدخل راتبك لحساب القدرة الشرائية.'}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
