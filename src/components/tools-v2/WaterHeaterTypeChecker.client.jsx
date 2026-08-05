"use client";

import { useState } from 'react';
import { Fire } from '@phosphor-icons/react';

// Capacity guidance is a commonly-cited household sizing rule of thumb for storage/central
// heaters (10-30L/person for 1, scaling to 150L+ for 5), stated openly in the result note —
// not presented as a single unarguable number.
const BUCKETS = [
  { id: '1', label: '1', capacity: '30 – 50', type: 'سخان فوري صغير يكفي غالباً، أو مركزي 50 لتر', instant: true },
  { id: '2', label: '2', capacity: '50 – 80', type: 'سخان فوري أو مركزي 80 لتر — الاثنان مناسبان', instant: true },
  { id: '3-4', label: '3-4', capacity: '100 – 120', type: 'سخان مركزي أنسب — الفوري يحتاج تأسيساً كهربائياً أقوى بهذه السعة', instant: false },
  { id: '5+', label: '5 فأكثر', capacity: '150+', type: 'سخان مركزي كبير، أو أكثر من سخان موزّع على الحمامات', instant: false },
];

export default function WaterHeaterTypeChecker() {
  const [active, setActive] = useState('3-4');
  const bucket = BUCKETS.find((b) => b.id === active);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Fire size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أي سخان وأي سعة يناسبان منزلك؟</p>
          <p className="guide-v2-checker-sub">اختر عدد أفراد الأسرة</p>
        </div>
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="عدد أفراد الأسرة">
        {BUCKETS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`guide-v2-checker-chip${active === b.id ? ' is-active' : ''}`}
            aria-pressed={active === b.id}
            onClick={() => setActive(b.id)}
          >
            {b.label} أفراد
          </button>
        ))}
      </div>
      <div className="guide-v2-checker-result" aria-live="polite">
        <p className="guide-v2-checker-result-label">السعة المناسبة</p>
        <p className="guide-v2-checker-result-value">{bucket.capacity} لتر</p>
        <p className="guide-v2-checker-result-note">{bucket.type}</p>
      </div>
    </div>
  );
}
