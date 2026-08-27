"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';

// Real rules, verified via WebSearch/WebFetch against travel.state.gov-sourced summaries and the
// DV-2027 cycle facts, 2026-08-27:
// - Education/work test: secondary-school-equivalent education, OR 2 years of work experience
//   (within the last 5 years) in an occupation requiring at least 2 years of training/experience
//   per the US Dept. of Labor's O*NET classification (Job Zone 4/5, or Zone 3 with a specific
//   vocational-preparation range) — this is the one part of eligibility that's stable year to
//   year, so it's the only part built as a calculator here.
// - Country eligibility (the 50,000-arrivals-in-5-years exclusion list) genuinely changes every
//   single cycle — deliberately NOT hardcoded as a country dropdown here, to avoid shipping a
//   stale/wrong list (a real mistake several Arabic articles make). Users are pointed to the
//   official current list instead.
// - DV-2027 registration already closed 7 November 2025 (with the program's first-ever $1 entry
//   fee) and results reached the Entry Status Check in May 2026 — both already in the past as of
//   this build. The next cycle (DV-2028) had no officially announced registration window at
//   research time, so no specific 2026 date is asserted — only the historical pattern, clearly
//   labeled as historical.

function FieldHint({ children }) {
  return <p className="tool-v2-field-note">{children}</p>;
}

export default function DvLotteryEligibilityChecker() {
  const [hasSecondary, setHasSecondary] = useState(null);
  const [hasQualifyingWork, setHasQualifyingWork] = useState(null);

  const result = useMemo(() => {
    if (hasSecondary === null && hasQualifyingWork === null) return null;
    const passes = hasSecondary === true || hasQualifyingWork === true;
    return { passes };
  }, [hasSecondary, hasQualifyingWork]);

  return (
    <div aria-label="التحقق من أهلية التعليم أو الخبرة لقرعة الجرين كارد">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          شرط التعليم أو الخبرة
        </span>
      </div>

      <div className="tool-v2-field">
        <label>هل أكملت مرحلة الثانوية العامة (أو ما يعادلها) بنجاح؟</label>
        <div className="tool-v2-chip-options" role="group" aria-label="التعليم الثانوي">
          <button type="button" className={`tool-v2-chip${hasSecondary === true ? ' is-active' : ''}`} onClick={() => setHasSecondary(true)}>نعم</button>
          <button type="button" className={`tool-v2-chip${hasSecondary === false ? ' is-active' : ''}`} onClick={() => setHasSecondary(false)}>لا</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label>
          إن لم تكمل الثانوية — هل لديك سنتان خبرة عمل (خلال آخر 5 سنوات) في مهنة تتطلب عادة سنتين تدريب أو خبرة على الأقل؟
        </label>
        <div className="tool-v2-chip-options" role="group" aria-label="الخبرة العملية">
          <button type="button" className={`tool-v2-chip${hasQualifyingWork === true ? ' is-active' : ''}`} onClick={() => setHasQualifyingWork(true)}>نعم</button>
          <button type="button" className={`tool-v2-chip${hasQualifyingWork === false ? ' is-active' : ''}`} onClick={() => setHasQualifyingWork(false)}>لا</button>
        </div>
        <FieldHint>
          يُصنَّف هذا حسب قاعدة بيانات O*NET الأمريكية الرسمية (Job Zone 4 أو 5، أو Zone 3 ضمن نطاق تحضير مهني محدد) — تحقق من تصنيف مهنتك عبر الرابط في قسم المصادر أدناه.
        </FieldHint>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className={`tool-v2-result-hero ${result.passes ? 'is-good' : 'is-bad'}`}>
            <span className="tool-v2-result-label">شرط التعليم/الخبرة</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value" style={{ fontSize: '1.4rem' }}>
                  {result.passes ? 'مستوفى' : 'غير مستوفى'}
                </span>
              </span>
            </div>
          </div>
          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>
              {result.passes
                ? 'استوفيت شرط التعليم أو الخبرة. يبقى عليك التأكد من أهلية بلد ميلادك (القائمة تتغير كل دورة) عبر الموقع الرسمي قبل التسجيل.'
                : 'دون إكمال الثانوية أو ما يعادلها، أو سنتي خبرة في مهنة مؤهلة، لا تستوفي شرط الأهلية التعليمية — هذا الشرط لا استثناء فيه.'}
            </span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>أجب عن السؤالين أعلاه لرؤية النتيجة.</span>
        </div>
      )}

      <div className="tool-v2-breakdown-list">
        <div className="tool-v2-breakdown-row">
          <span className="tool-v2-breakdown-label">آخر تسجيل (DV-2027)</span>
          <span className="tool-v2-breakdown-value">أُغلق 7 نوفمبر 2025</span>
        </div>
        <div className="tool-v2-breakdown-row">
          <span className="tool-v2-breakdown-label">نتائج DV-2027</span>
          <span className="tool-v2-breakdown-value">صدرت مايو 2026</span>
        </div>
        <div className="tool-v2-breakdown-row">
          <span className="tool-v2-breakdown-label">رسم التسجيل</span>
          <span className="tool-v2-breakdown-value">1 دولار (أول مرة في تاريخ البرنامج)</span>
        </div>
      </div>
      <div className="tool-v2-note-strip">
        <Info size={15} weight="fill" />
        <span>
          موعد فتح تسجيل الدورة القادمة (DV-2028) لم يُعلن رسمياً بعد وقت كتابة هذا المحتوى. تاريخياً يفتح التسجيل في أكتوبر ويُغلق في أوائل نوفمبر — تابع الموقع الرسمي مباشرة لمعرفة التاريخ الدقيق، ولا تثق بأي موقع آخر يذكر تاريخاً محدداً قبل الإعلان الرسمي.
        </span>
      </div>
    </div>
  );
}
