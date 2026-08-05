"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText } from '@phosphor-icons/react';

const QUESTIONS = [
  {
    id: 'propertyType',
    label: 'ما نوع العقار؟',
    options: [
      { id: 'residential', label: 'سكني (منزل أو شقة)', points: 0 },
      { id: 'commercial', label: 'تجاري (مطعم أو منشأة غذائية)', points: 2 },
    ],
  },
  {
    id: 'recurring',
    label: 'هل واجهت هذه المشكلة من قبل بشكل متكرر؟',
    options: [
      { id: 'yes', label: 'نعم، تتكرر كل فترة', points: 2 },
      { id: 'no', label: 'لا، هذه أول مرة', points: 0 },
    ],
  },
  {
    id: 'buildingAge',
    label: 'كم عمر المبنى تقريباً؟',
    options: [
      { id: 'new', label: 'أقل من 5 سنوات', points: 0 },
      { id: 'mid', label: '5 إلى 15 سنة', points: 1 },
      { id: 'old', label: 'أكثر من 15 سنة', points: 1 },
    ],
  },
  {
    id: 'certificate',
    label: 'هل تحتاج شهادة أو تقريراً دورياً لجهة رقابية (بلدية/صحية)؟',
    options: [
      { id: 'yes', label: 'نعم', points: 2 },
      { id: 'no', label: 'لا', points: 0 },
    ],
  },
];

export default function PestContractChecker() {
  const [answers, setAnswers] = useState({});
  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  const result = useMemo(() => {
    if (!allAnswered) return null;
    const score = QUESTIONS.reduce((sum, q) => {
      const opt = q.options.find((o) => o.id === answers[q.id]);
      return sum + (opt?.points ?? 0);
    }, 0);
    if (score >= 4) {
      return {
        tone: 'is-bad',
        title: 'عقد صيانة سنوي هو الخيار الأنسب',
        body: 'حالتك تجمع أكثر من عامل يرفع احتمال عودة المشكلة (منشأة تجارية، تكرار سابق، أو حاجة لتقرير دوري) — عقد الزيارات الدورية أضمن وغالباً أرخص إجمالاً من معالجات متفرقة متكررة.',
      };
    }
    if (score >= 2) {
      return {
        tone: 'is-warn',
        title: 'فكّر في عقد نصف سنوي، أو راقب الوضع',
        body: 'وضعك في المنطقة الوسطى — معالجة لمرة واحدة قد تكفي الآن، لكن راقب النتائج خلال شهرين، وإن عادت المشكلة انتقل لعقد دوري بدل تكرار معالجات منفصلة.',
      };
    }
    return {
      tone: 'is-good',
      title: 'معالجة لمرة واحدة كافية غالباً',
      body: 'لا توجد مؤشرات قوية على مشكلة متكررة أو متطلبات رقابية — معالجة واحدة جيدة التنفيذ عادة كافية لحالتك، مع متابعة بسيطة من طرفك.',
    };
  }, [answers, allAnswered]);

  return (
    <div className="guide-v2-checker" aria-label="مدقق: عقد سنوي أم معالجة لمرة واحدة">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><FileText size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">عقد سنوي أم معالجة لمرة واحدة؟</p>
          <p className="guide-v2-checker-sub">4 أسئلة سريعة لمساعدتك على القرار الصحيح لحالتك</p>
        </div>
      </div>

      {QUESTIONS.map((q) => (
        <div key={q.id} style={{ marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{q.label}</p>
          <div className="guide-v2-checker-options" role="group" aria-label={q.label}>
            {q.options.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`guide-v2-checker-chip${answers[q.id] === o.id ? ' is-active' : ''}`}
                aria-pressed={answers[q.id] === o.id}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {result ? (
        <div className={`guide-v2-checker-result ${result.tone}`} aria-live="polite">
          <p className="guide-v2-checker-result-label">التوصية</p>
          <p className="guide-v2-checker-result-value" style={{ fontSize: '1.05rem' }}>{result.title}</p>
          <p className="guide-v2-checker-result-note">{result.body}</p>
          <Link href="/tools/pest-control/cost-estimator" className="guide-v2-checker-chip" style={{ marginTop: 'var(--space-3)', display: 'inline-flex' }}>
            احسب التكلفة التقديرية
          </Link>
        </div>
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>أجب عن الأسئلة الأربعة أعلاه لتظهر التوصية.</p>
        </div>
      )}
    </div>
  );
}
