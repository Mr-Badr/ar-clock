"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Sparkle } from '@phosphor-icons/react';

const QUESTIONS = [
  {
    id: 'lastDeep',
    label: 'متى كان آخر تنظيف عميق فعلي للمنزل؟',
    options: [
      { id: 'recent', label: 'أقل من 3 أشهر', points: 0 },
      { id: 'mid', label: 'بين 3 و6 أشهر', points: 1 },
      { id: 'long', label: 'أكثر من 6 أشهر', points: 2 },
      { id: 'unknown', label: 'لا أتذكر', points: 2 },
    ],
  },
  {
    id: 'moveOrRenovation',
    label: 'هل انتقلت لمنزل جديد أو انتهيت من دهان/تشطيب مؤخراً؟',
    options: [
      { id: 'yes', label: 'نعم', points: 2 },
      { id: 'no', label: 'لا', points: 0 },
    ],
  },
  {
    id: 'pets',
    label: 'هل يوجد حيوانات أليفة أو مدخّنون داخل المنزل؟',
    options: [
      { id: 'yes', label: 'نعم', points: 1 },
      { id: 'no', label: 'لا', points: 0 },
    ],
  },
  {
    id: 'occupants',
    label: 'كم عدد الساكنين في المنزل؟',
    options: [
      { id: 'small', label: '1-2', points: 0 },
      { id: 'mid', label: '3-5', points: 1 },
      { id: 'large', label: '6 فأكثر', points: 2 },
    ],
  },
];

export default function DeepCleanChecker() {
  const [answers, setAnswers] = useState({});

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  const result = useMemo(() => {
    if (!allAnswered) return null;
    const score = QUESTIONS.reduce((sum, q) => {
      const opt = q.options.find((o) => o.id === answers[q.id]);
      return sum + (opt?.points ?? 0);
    }, 0);
    if (score >= 4) {
      return { tone: 'is-bad', title: 'تنظيف عميق الآن', body: 'مجموع إجاباتك يشير إلى أن منزلك يحتاج تنظيفاً عميقاً قريباً، لا تنظيفاً دورياً عادياً فقط.' };
    }
    if (score >= 2) {
      return { tone: 'is-warn', title: 'خطط لتنظيف عميق خلال الشهر القادم', body: 'لست بحاجة ماسة الآن، لكن من الأفضل جدولة تنظيف عميق قريباً قبل أن يتراكم الاتساخ أكثر.' };
    }
    return { tone: 'is-good', title: 'التنظيف الدوري كافٍ حالياً', body: 'إجاباتك تشير إلى أن حالة منزلك جيدة — استمر على التنظيف الدوري العادي دون حاجة لتنظيف عميق فوري.' };
  }, [answers, allAnswered]);

  return (
    <div className="guide-v2-checker" aria-label="مدقق: تنظيف عميق أم عادي">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Sparkle size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">هل تحتاج تنظيفاً عميقاً الآن؟</p>
          <p className="guide-v2-checker-sub">أجب عن 4 أسئلة سريعة للحصول على توصية واضحة</p>
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
          <Link href="/tools/cleaning/cost-calculator" className="guide-v2-checker-chip" style={{ marginTop: 'var(--space-3)', display: 'inline-flex' }}>
            احسب تكلفة التنظيف المناسب لك
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
