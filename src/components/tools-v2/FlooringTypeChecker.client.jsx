"use client";

import { useState } from 'react';
import { SquaresFour } from '@phosphor-icons/react';

const PRIORITIES = [
  {
    id: 'kids',
    label: 'منزل فيه أطفال أو حيوانات أليفة',
    result: 'باركيه HDF',
    note: 'مقاوم للخدوش والصدمات اليومية بشكل أفضل بكثير من الخشب الطبيعي، وأرخص للاستبدال الجزئي إن تضرر جزء منه.',
  },
  {
    id: 'wet',
    label: 'مطبخ أو حمام أو منطقة قرب الماء',
    result: 'أرضية SPC',
    note: 'المكوّن الوحيد هنا المقاوم للماء فعلياً — الخشب الطبيعي وHDF كلاهما يتضرران من التعرض المتكرر للرطوبة أو الانسكاب.',
  },
  {
    id: 'luxury',
    label: 'غرفة معيشة تريدها فاخرة وطبيعية',
    result: 'باركيه خشب طبيعي (بلوط أو مشابه)',
    note: 'الأعلى تكلفة لكنه الوحيد بملمس ورائحة الخشب الحقيقي، ويمكن صنفرته وإعادة تلميعه لعقود بعكس الأنواع الصناعية.',
  },
  {
    id: 'budget',
    label: 'الميزانية محدودة والمساحة كبيرة',
    result: 'باركيه اقتصادي (صيني الصنع)',
    note: 'الأرخص بفارق كبير للمتر المربع — مناسب لمساحات كبيرة أو استخدام مؤقت، لكن العمر الافتراضي والمظهر أقل من الأنواع الأعلى سعراً.',
  },
];

export default function FlooringTypeChecker() {
  const [active, setActive] = useState('kids');
  const priority = PRIORITIES.find((p) => p.id === active);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><SquaresFour size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أي نوع أرضية يناسبك؟</p>
          <p className="guide-v2-checker-sub">اختر وصف حالتك الأقرب</p>
        </div>
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="الحالة">
        {PRIORITIES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`guide-v2-checker-chip${active === p.id ? ' is-active' : ''}`}
            aria-pressed={active === p.id}
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="guide-v2-checker-result is-good" aria-live="polite">
        <p className="guide-v2-checker-result-label">النوع المقترح</p>
        <p className="guide-v2-checker-result-value">{priority.result}</p>
        <p className="guide-v2-checker-result-note">{priority.note}</p>
      </div>
    </div>
  );
}
