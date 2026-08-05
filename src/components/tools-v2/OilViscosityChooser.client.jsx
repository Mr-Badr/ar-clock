"use client";

import { useState } from 'react';
import { Drop } from '@phosphor-icons/react';

// Neutral, brand-agnostic recommendation logic — not tied to selling any specific oil brand
// (unlike Castrol/Shell/Pennzoil's own "oil finder" tools, which are the real English-market
// precedent for this pattern but are all commercially biased toward their own product line).
// Grounded in two widely-published, real factors: ambient climate (hotter climate → thicker
// hot-running viscosity, the second number, to maintain the protective film at high temperature)
// and engine age/mileage (older, higher-mileage engines commonly run a slightly thicker grade to
// reduce oil burn-off through worn seals — a standard recommendation across oil-brand guidance).
const CLIMATES = [
  { id: 'hot', label: 'صيف خليجي حار جداً (45°+)' },
  { id: 'moderate', label: 'معتدل / شتاء بارد أحياناً' },
];
const AGES = [
  { id: 'new', label: 'سيارة جديدة (أقل من 5 سنوات)' },
  { id: 'mid', label: 'متوسطة العمر (5-10 سنوات)' },
  { id: 'old', label: 'كبيرة العمر / عالية الممشى (10+ سنوات)' },
];

function recommend(climate, age) {
  if (age === 'old') {
    return climate === 'hot' ? '10W-40' : '10W-30';
  }
  if (age === 'mid') {
    return climate === 'hot' ? '5W-40' : '5W-30';
  }
  // new
  return climate === 'hot' ? '5W-30' : '0W-20 أو 5W-20';
}

export default function OilViscosityChooser() {
  const [climate, setClimate] = useState('hot');
  const [age, setAge] = useState('new');
  const grade = recommend(climate, age);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Drop size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">ما درجة اللزوجة المناسبة لسيارتك؟</p>
          <p className="guide-v2-checker-sub">اختر مناخك وعمر سيارتك</p>
        </div>
      </div>

      <p className="guide-v2-checker-sub" style={{ marginBottom: 'var(--space-2)' }}>مناخك المعتاد</p>
      <div className="guide-v2-checker-options" role="group" aria-label="المناخ" style={{ marginBottom: 'var(--space-3)' }}>
        {CLIMATES.map((c) => (
          <button key={c.id} type="button" className={`guide-v2-checker-chip${climate === c.id ? ' is-active' : ''}`} aria-pressed={climate === c.id} onClick={() => setClimate(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <p className="guide-v2-checker-sub" style={{ marginBottom: 'var(--space-2)' }}>عمر سيارتك</p>
      <div className="guide-v2-checker-options" role="group" aria-label="عمر السيارة" style={{ marginBottom: 'var(--space-4)' }}>
        {AGES.map((a) => (
          <button key={a.id} type="button" className={`guide-v2-checker-chip${age === a.id ? ' is-active' : ''}`} aria-pressed={age === a.id} onClick={() => setAge(a.id)}>
            {a.label}
          </button>
        ))}
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite">
        <p className="guide-v2-checker-result-label">الدرجة المقترحة</p>
        <p className="guide-v2-checker-result-value" style={{ fontSize: '1.6rem', direction: 'ltr', textAlign: 'center' }}>{grade}</p>
        <p className="guide-v2-checker-result-note">
          هذا اقتراح عام مبني على المناخ وعمر السيارة فقط — دليل مالك سيارتك هو المرجع الأدق دائماً،
          خصوصاً إن كانت سيارتك لا تزال بضمان الوكالة.
        </p>
      </div>
    </div>
  );
}
