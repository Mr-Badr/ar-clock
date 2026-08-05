"use client";

import { useState } from 'react';
import { Buildings } from '@phosphor-icons/react';

// Recommendations reflect the commonly-cited installation/cost tradeoffs already covered in the
// article above (سبليت أرخص تركيباً من المركزي، الكاسيت يوزّع الهواء بالتساوي بمساحات مفتوحة...) —
// stated as a starting point, not a rigid rule, since budget and existing ductwork also matter.
const SPACES = [
  {
    id: 'room',
    label: 'غرفة واحدة',
    type: 'مكيف شباك أو سبليت صغير (1-1.5 طن)',
    note: 'الشباك أوفر تكلفة شراءً وتركيباً لغرفة واحدة، والسبليت أهدأ وأكفأ إن كانت ميزانيتك تسمح.',
  },
  {
    id: 'apartment',
    label: 'شقة كاملة',
    type: 'وحدة سبليت لكل غرفة رئيسية',
    note: 'يمنحك تحكماً منفصلاً بحرارة كل غرفة، وتشغل فقط الغرف المستخدمة فعلياً فتوفر كهرباء مقارنة بمكيف واحد يغطي الشقة كلها.',
  },
  {
    id: 'villa',
    label: 'فيلا أو منزل من دورين',
    type: 'مكيف مركزي، أو عدة وحدات سبليت إن كانت الميزانية محدودة',
    note: 'المركزي يوفر تبريداً موحداً بلا وحدات ظاهرة على الجدران، لكن تركيبه الأولي أعلى تكلفة ويحتاج تمديد دكت مسبق.',
  },
  {
    id: 'commercial',
    label: 'محل أو مكتب تجاري',
    type: 'مكيف كاسيت (يُركّب بالسقف المعلق) أو دولابي للمساحات الكبيرة',
    note: 'الكاسيت يوزّع الهواء بالتساوي في كل اتجاهات المساحة المفتوحة، وهو الخيار الشائع في المحلات والمكاتب ذات الأسقف المعلقة.',
  },
];

export default function AcTypeChecker() {
  const [active, setActive] = useState('apartment');
  const space = SPACES.find((s) => s.id === active);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Buildings size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أي نوع مكيف يناسب مساحتك؟</p>
          <p className="guide-v2-checker-sub">اختر نوع المساحة التي تريد تبريدها</p>
        </div>
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="نوع المساحة">
        {SPACES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`guide-v2-checker-chip${active === s.id ? ' is-active' : ''}`}
            aria-pressed={active === s.id}
            onClick={() => setActive(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="guide-v2-checker-result" aria-live="polite">
        <p className="guide-v2-checker-result-label">النوع المقترح</p>
        <p className="guide-v2-checker-result-value">{space.type}</p>
        <p className="guide-v2-checker-result-note">{space.note}</p>
      </div>
    </div>
  );
}
