'use client';

import { useMemo, useState } from 'react';
import { Info, ShieldCheck, Warning } from '@phosphor-icons/react';
import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// ─── GOSI pension math ──────────────────────────────────────────────────────

const EARLY_RETIREMENT_YEARS = 25;
const MAX_YEARS = 40;
const MAX_YEARS_NEW = Math.ceil(100 / 2.25); // ~45

function calcPension(salary, years, isNewFormula) {
  const s = Math.max(0, parseFloat(String(salary).replace(/,/g, '')) || 0);
  const y = Math.max(0, Math.min(years, isNewFormula ? MAX_YEARS_NEW : MAX_YEARS));
  if (s <= 0 || y <= 0) return 0;
  if (isNewFormula) {
    return Math.min(s, s * y * 0.0225);
  }
  return Math.min(s, (s * y) / 40);
}

function pensionPercent(salary, years, isNewFormula) {
  const s = parseFloat(String(salary).replace(/,/g, '')) || 0;
  if (s <= 0) return 0;
  return (calcPension(salary, years, isNewFormula) / s) * 100;
}

function yearsRemaining(currentYears) {
  const rem = EARLY_RETIREMENT_YEARS - currentYears;
  if (rem <= 0) return null;
  const yrs = Math.floor(rem);
  const months = Math.round((rem - yrs) * 12);
  return { yrs, months };
}

function formatSAR(n) {
  if (!isFinite(n) || n < 0) return '—';
  return new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 0 }).format(n) + ' ريال';
}

function formatPct(pct) {
  return Math.min(100, Math.round(pct)) + '%';
}

// ─── Milestone row component ────────────────────────────────────────────────

function MilestoneRow({ label, years, salary, isNewFormula, isCurrent, isActive }) {
  const pension = calcPension(salary, years, isNewFormula);
  const pct = pensionPercent(salary, years, isNewFormula);
  return (
    <div className={`gosi-milestone${isCurrent ? ' gosi-milestone--current' : ''}${isActive ? ' gosi-milestone--active' : ''}`}>
      <div className="gosi-milestone-years">{years} <span>سنة</span></div>
      <div className="gosi-milestone-info">
        <span className="gosi-milestone-label">{label}</span>
        <span className="gosi-milestone-pct">{formatPct(pct)} من الراتب</span>
      </div>
      <div className="gosi-milestone-amount">{formatSAR(pension)}</div>
    </div>
  );
}

// ─── Main calculator ─────────────────────────────────────────────────────────

export default function GOSIRetirementCalculator() {
  const [years, setYears] = useState([15]);
  const [salary, setSalary] = useState('10000');
  const [isNewFormula, setIsNewFormula] = useState(false);

  const currentYears = years[0];
  const salaryNum = parseFloat(String(salary).replace(/,/g, '')) || 0;

  const result = useMemo(() => {
    const currentPension = calcPension(salary, currentYears, isNewFormula);
    const earlyPension = calcPension(salary, EARLY_RETIREMENT_YEARS, isNewFormula);
    const pension30 = calcPension(salary, 30, isNewFormula);
    const pension35 = calcPension(salary, 35, isNewFormula);
    const pension40 = calcPension(salary, isNewFormula ? MAX_YEARS_NEW : MAX_YEARS, isNewFormula);
    const rem = yearsRemaining(currentYears);
    const canRetireEarly = currentYears >= EARLY_RETIREMENT_YEARS;
    const progressPct = Math.min(100, (currentYears / EARLY_RETIREMENT_YEARS) * 100);
    const earlyPct = pensionPercent(salary, EARLY_RETIREMENT_YEARS, isNewFormula);
    const perYearBoost = isNewFormula
      ? salaryNum * 0.0225
      : salaryNum / 40;
    return { currentPension, earlyPension, pension30, pension35, pension40, rem, canRetireEarly, progressPct, earlyPct, perYearBoost };
  }, [years, salary, isNewFormula, salaryNum]);

  const shareText = salaryNum > 0
    ? `حاسبة التقاعد المبكر GOSI\nسنوات الاشتراك: ${currentYears}\nالمعاش عند التقاعد المبكر (25 سنة): ${formatSAR(result.earlyPension)}\n${result.canRetireEarly ? '✅ يحق لك التقاعد المبكر الآن' : `⏳ تحتاج ${result.rem?.yrs || 0} سنة و${result.rem?.months || 0} شهراً`}`
    : '';

  return (
    <div className="gosi-calc" aria-label="حاسبة التقاعد المبكر GOSI">

      {/* ── INPUTS ──────────────────────────────────────────────── */}
      <div className="gosi-inputs">

        {/* Subscription years */}
        <div className="gosi-field">
          <div className="gosi-field-header">
            <Label htmlFor="gosi-years">سنوات اشتراكك في التأمينات</Label>
            <span className="gosi-field-value">{currentYears} سنة</span>
          </div>
          <Slider
            id="gosi-years"
            min={0}
            max={40}
            step={1}
            value={years}
            onValueChange={setYears}
            className="calc-slider"
            aria-label="سنوات الاشتراك"
          />
          <div className="gosi-slider-markers" aria-hidden="true">
            <span>0</span>
            <span>10</span>
            <span>20</span>
            <span className="gosi-marker-highlight">25</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>

        {/* Monthly salary */}
        <div className="gosi-field">
          <Label htmlFor="gosi-salary">الراتب الشهري (ريال سعودي)</Label>
          <div className="gosi-salary-row">
            <Input
              id="gosi-salary"
              inputMode="decimal"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="10000"
              aria-label="الراتب الشهري"
            />
            <span className="gosi-currency">ر.س</span>
          </div>
        </div>

        {/* Formula toggle */}
        <div className="gosi-field">
          <Label>نوع اشتراكك</Label>
          <div className="gosi-formula-toggle" role="group" aria-label="نوع الاشتراك">
            <button
              type="button"
              className={`gosi-formula-btn${!isNewFormula ? ' gosi-formula-btn--active' : ''}`}
              onClick={() => setIsNewFormula(false)}
              aria-pressed={!isNewFormula}
            >
              <span className="gosi-formula-btn-title">قبل يوليو 2024</span>
              <span className="gosi-formula-btn-sub">معادلة ÷ 40 (الأفضل)</span>
            </button>
            <button
              type="button"
              className={`gosi-formula-btn${isNewFormula ? ' gosi-formula-btn--active' : ''}`}
              onClick={() => setIsNewFormula(true)}
              aria-pressed={isNewFormula}
            >
              <span className="gosi-formula-btn-title">بعد يوليو 2024</span>
              <span className="gosi-formula-btn-sub">معادلة 2.25%</span>
            </button>
          </div>
          <p className="gosi-formula-note">
            <Info size={13} weight="fill" aria-hidden="true" />
            {isNewFormula
              ? 'تطبَّق إذا كانت سنوات اشتراكك أقل من 15 سنة في 3 يوليو 2024.'
              : 'تطبَّق إذا كانت سنوات اشتراكك 19 سنة فأكثر في 3 يوليو 2024.'}
          </p>
        </div>
      </div>

      {/* ── RESULTS ─────────────────────────────────────────────── */}
      {salaryNum > 0 && (
        <div className="gosi-results">

          {/* Eligibility status */}
          <div className={`gosi-status ${result.canRetireEarly ? 'gosi-status--eligible' : 'gosi-status--pending'}`}>
            <ShieldCheck size={22} weight={result.canRetireEarly ? 'fill' : 'regular'} aria-hidden="true" />
            <div className="gosi-status-text">
              {result.canRetireEarly ? (
                <>
                  <strong>يحق لك التقاعد المبكر الآن</strong>
                  <span>أتممت {currentYears} سنة من الاشتراك في التأمينات</span>
                </>
              ) : (
                <>
                  <strong>
                    تحتاج {result.rem?.yrs ? `${result.rem.yrs} سنة` : ''}{result.rem?.months ? ` و${result.rem.months} شهراً` : ''} إضافية
                  </strong>
                  <span>حتى تكتمل شروط التقاعد المبكر (25 سنة)</span>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="gosi-progress-section" aria-hidden="true">
            <div className="gosi-progress-bar-track">
              <div
                className="gosi-progress-bar-fill"
                style={{ width: `${result.progressPct}%` }}
              />
              <div className="gosi-progress-marker" style={{ right: '0%' }}>
                <span className="gosi-progress-label">0</span>
              </div>
              <div className="gosi-progress-marker" style={{ right: `${(1 - 25 / 40) * 100}%` }}>
                <span className="gosi-progress-label">25</span>
              </div>
              <div className="gosi-progress-marker" style={{ right: '0%', left: '0%' }}>
                <span className="gosi-progress-label">40</span>
              </div>
            </div>
            <div className="gosi-progress-legend">
              <span>{currentYears} سنة حالياً</span>
              <span>التقاعد المبكر: 25 سنة</span>
            </div>
          </div>

          {/* Per-year insight */}
          {result.perYearBoost > 0 && (
            <p className="gosi-insight">
              كل سنة إضافية تضيف <strong>{formatSAR(result.perYearBoost)}</strong> للمعاش الشهري مدى الحياة
            </p>
          )}

          {/* Milestones comparison */}
          <div className="gosi-milestones">
            <h3 className="gosi-milestones-title">مقارنة المراحل</h3>

            {currentYears < EARLY_RETIREMENT_YEARS && (
              <MilestoneRow
                label="وضعك الحالي"
                years={currentYears}
                salary={salary}
                isNewFormula={isNewFormula}
                isCurrent
              />
            )}

            <MilestoneRow
              label="التقاعد المبكر"
              years={EARLY_RETIREMENT_YEARS}
              salary={salary}
              isNewFormula={isNewFormula}
              isActive={currentYears >= EARLY_RETIREMENT_YEARS}
            />

            {currentYears > EARLY_RETIREMENT_YEARS && currentYears < 30 && (
              <MilestoneRow
                label="وضعك الحالي"
                years={currentYears}
                salary={salary}
                isNewFormula={isNewFormula}
                isCurrent
              />
            )}

            <MilestoneRow
              label="استمرار 30 سنة"
              years={30}
              salary={salary}
              isNewFormula={isNewFormula}
              isActive={currentYears >= 30}
            />

            {currentYears > 30 && currentYears < 35 && (
              <MilestoneRow
                label="وضعك الحالي"
                years={currentYears}
                salary={salary}
                isNewFormula={isNewFormula}
                isCurrent
              />
            )}

            <MilestoneRow
              label="استمرار 35 سنة"
              years={35}
              salary={salary}
              isNewFormula={isNewFormula}
              isActive={currentYears >= 35}
            />

            <MilestoneRow
              label="أقصى معاش (100%)"
              years={isNewFormula ? MAX_YEARS_NEW : MAX_YEARS}
              salary={salary}
              isNewFormula={isNewFormula}
              isActive={currentYears >= (isNewFormula ? MAX_YEARS_NEW : MAX_YEARS)}
            />
          </div>

          <p className="gosi-disclaimer">
            <Warning size={13} weight="fill" aria-hidden="true" />
            هذه نتيجة تقديرية بناءً على معادلات GOSI المعلنة. راجع حسابك في بوابة gosi.gov.sa لمعرفة رصيدك الفعلي.
          </p>

          <ResultActions shareText={shareText} />
        </div>
      )}

      {!salaryNum && (
        <p className="gosi-empty-hint">أدخل راتبك الشهري لتظهر النتائج.</p>
      )}
    </div>
  );
}
