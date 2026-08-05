"use client";

import { useState } from 'react';
import { DoorOpen } from '@phosphor-icons/react';

const PRIORITIES = [
  {
    id: 'budget',
    label: 'الميزانية أهم شيء',
    result: 'باب سويدي (صنوبر)',
    note: 'الأوفر تكلفة بفارق كبير عن الأنواع الأخرى، ومظهره مقبول جداً بعد الدهان — خيار منطقي للغرف الداخلية غير المعرّضة لاستخدام شاق.',
  },
  {
    id: 'balance',
    label: 'توازن بين الجودة والسعر',
    result: 'باب زان',
    note: 'الأشيع في المنطقة العربية لهذا السبب بالضبط — صلابة جيدة ومظهر أنيق دون الوصول لسعر البلوط الفاخر.',
  },
  {
    id: 'premium',
    label: 'الأفخم والأكثر متانة',
    result: 'باب بلوط',
    note: 'أعلى الأنواع سعراً هنا، لكنه الأكثر صلابة ومقاومة للرطوبة بين الأخشاب الطبيعية الشائعة — يستحق الفارق لمدخل رئيسي أو قطعة تريدها تدوم عقوداً.',
  },
  {
    id: 'humid',
    label: 'منطقة رطبة أو ساحلية',
    result: 'باب بمعالجة PVC أو كلادينج',
    note: 'الخشب الطبيعي الخالص عرضة للتمدد والتشقق في الرطوبة العالية — طلاء أو تغليف PVC يحمي السطح من امتصاص الرطوبة مباشرة، بديل عملي أكثر من الخشب الخام هنا تحديداً.',
  },
];

export default function DoorTypeChecker() {
  const [active, setActive] = useState('balance');
  const priority = PRIORITIES.find((p) => p.id === active);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><DoorOpen size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أي نوع باب يناسبك؟</p>
          <p className="guide-v2-checker-sub">اختر ما هو الأهم بالنسبة لك</p>
        </div>
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="الأولوية">
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
