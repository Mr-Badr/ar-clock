"use client";

import { useMemo, useRef, useState } from 'react';
import { Plus, Trash, Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Real rule, verified via direct WebFetch of gov.uk's Immigration Rules Appendix Continuous
// Residence, 2026-08-27: CR 3.1 — an applicant must not have been outside the UK for more than
// 180 days in any rolling 12-month period during the qualifying period. This is the rule for the
// common 5-year settlement routes (Skilled Worker, Family/Spouse, etc.) — the older 10-year Long
// Residence route uses a different total-absence rule, noted separately rather than calculated
// here (see the tool page's own FAQ).
const ROLLING_WINDOW_DAYS = 365;
const MAX_ABSENCE_DAYS = 180;
const QUALIFYING_YEARS = 5;

function parseDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function UkIlrAbsenceCalculator() {
  const idCounterRef = useRef(0);
  const [residenceStart, setResidenceStart] = useState('');
  const [trips, setTrips] = useState(() => [{ id: 0, start: '', end: '' }]);

  function addTrip() {
    idCounterRef.current += 1;
    setTrips((prev) => [...prev, { id: idCounterRef.current, start: '', end: '' }]);
  }
  function removeTrip(id) {
    setTrips((prev) => (prev.length <= 1 ? prev : prev.filter((t) => t.id !== id)));
  }
  function updateTrip(id, field, value) {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  const result = useMemo(() => {
    const start = parseDate(residenceStart);
    const validTrips = trips
      .map((t) => ({ start: parseDate(t.start), end: parseDate(t.end) }))
      .filter((t) => t.start && t.end && t.end >= t.start);

    if (!start) {
      return { ready: false };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eligibleDate = new Date(start);
    eligibleDate.setFullYear(eligibleDate.getFullYear() + QUALIFYING_YEARS);
    const periodEnd = today < eligibleDate ? today : eligibleDate;

    // Absence days per trip: UK guidance counts days outside the UK excluding the day of
    // departure and the day of return (i.e. the nights actually spent abroad).
    const absenceDaysFor = (tripStart, tripEnd) => Math.max(0, daysBetween(tripStart, tripEnd) - 1);

    const totalAbsence = validTrips.reduce((sum, t) => sum + absenceDaysFor(t.start, t.end), 0);

    // Rolling 12-month check: the worst window always ends right at a trip's return date (or at
    // the period end) — evaluate the window at each of those candidate points.
    const candidatePoints = [
      ...validTrips.map((t) => t.end),
      periodEnd,
    ].filter((d) => d >= start && d <= periodEnd);

    let worstWindowAbsence = 0;
    let worstWindowEnd = null;
    for (const point of candidatePoints) {
      const windowStart = new Date(point);
      windowStart.setDate(windowStart.getDate() - (ROLLING_WINDOW_DAYS - 1));
      const effectiveWindowStart = windowStart < start ? start : windowStart;
      let windowAbsence = 0;
      for (const t of validTrips) {
        const overlapStart = t.start > effectiveWindowStart ? t.start : effectiveWindowStart;
        const overlapEnd = t.end < point ? t.end : point;
        if (overlapEnd >= overlapStart) {
          windowAbsence += absenceDaysFor(overlapStart, overlapEnd);
        }
      }
      if (windowAbsence > worstWindowAbsence) {
        worstWindowAbsence = windowAbsence;
        worstWindowEnd = point;
      }
    }

    const passes = worstWindowAbsence <= MAX_ABSENCE_DAYS;
    const daysUntilEligible = today < eligibleDate ? daysBetween(today, eligibleDate) : 0;

    return {
      ready: true,
      totalAbsence,
      worstWindowAbsence,
      worstWindowEnd,
      passes,
      eligibleDate,
      daysUntilEligible,
      alreadyEligibleByDate: today >= eligibleDate,
    };
  }, [residenceStart, trips]);

  return (
    <div aria-label="حاسبة أيام الغياب للإقامة الدائمة في بريطانيا">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          بريطانيا — مسار 5 سنوات
        </span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="uk-start">
          تاريخ بداية إقامتك القانونية المستمرة
          <FieldHint text="عادة تاريخ أول دخول لك بتأشيرة المسار الذي تتقدم عليه (عامل ماهر، مرافق زوج/زوجة، إلخ)." />
        </label>
        <input id="uk-start" type="date" value={residenceStart} onChange={(e) => setResidenceStart(e.target.value)} />
      </div>

      <div className="tool-v2-rebar-rows">
        {trips.map((t, idx) => (
          <div key={t.id} className="tool-v2-rebar-row">
            <div className="tool-v2-rebar-row-field">
              <label htmlFor={`uk-trip-start-${t.id}`}>رحلة {idx + 1} — تاريخ المغادرة</label>
              <input id={`uk-trip-start-${t.id}`} type="date" value={t.start} onChange={(e) => updateTrip(t.id, 'start', e.target.value)} />
            </div>
            <div className="tool-v2-rebar-row-field">
              <label htmlFor={`uk-trip-end-${t.id}`}>تاريخ العودة</label>
              <input id={`uk-trip-end-${t.id}`} type="date" value={t.end} onChange={(e) => updateTrip(t.id, 'end', e.target.value)} />
            </div>
            <button type="button" className="tool-v2-rebar-row-remove" onClick={() => removeTrip(t.id)} disabled={trips.length <= 1} aria-label="احذف الرحلة">
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="tool-v2-add-row-btn" onClick={addTrip}>
        <Plus size={16} weight="bold" /> أضف رحلة خارج بريطانيا
      </button>

      {result.ready ? (
        <div aria-live="polite">
          <div className={`tool-v2-result-hero ${result.passes ? 'is-good' : 'is-bad'}`}>
            <span className="tool-v2-result-label">أسوأ نافذة 12 شهراً متتالية</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{result.worstWindowAbsence}</span>
                <span className="tool-v2-result-stat-label">يوم من أصل 180 يوماً مسموح</span>
              </span>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">إجمالي أيام الغياب المُدخلة</span>
              <span className="tool-v2-breakdown-value">{result.totalAbsence} يوم</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الحالة وفق قاعدة CR 3.1</span>
              <span className="tool-v2-breakdown-value">{result.passes ? 'ضمن الحد المسموح' : 'تجاوزت 180 يوماً'}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">
                {result.alreadyEligibleByDate ? 'تاريخ إكمال 5 سنوات' : 'الوقت المتبقي لإكمال 5 سنوات'}
              </span>
              <span className="tool-v2-breakdown-value">
                {result.alreadyEligibleByDate
                  ? result.eligibleDate.toLocaleDateString('en-GB')
                  : `${result.daysUntilEligible} يوم (${result.eligibleDate.toLocaleDateString('en-GB')})`}
              </span>
            </div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>
              {result.passes
                ? 'هذا التقدير يغطي مسارات الاستقرار الشائعة ذات الـ5 سنوات فقط. مسار الإقامة الطويلة (10 سنوات) له قاعدة غياب مختلفة — راجع الأسئلة الشائعة أدناه. تحقق دائماً من وضعك الدقيق قبل التقديم الفعلي.'
                : 'تجاوز 180 يوماً في أي نافذة 12 شهراً قد يقطع استمرارية إقامتك القانونية إلا إذا انطبق أحد الاستثناءات (أزمة إنسانية، كارثة طبيعية، ظروف صحية قهرية). راجع استثناءات القاعدة CR 3.4 في الأسئلة الشائعة، واستشر مختصاً قبل اتخاذ أي قرار.'}
            </span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>أدخل تاريخ بداية إقامتك أولاً لرؤية النتيجة.</span>
        </div>
      )}
    </div>
  );
}
