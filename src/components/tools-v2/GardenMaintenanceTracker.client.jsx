"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarBlank, ListChecks } from '@phosphor-icons/react';

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function seasonFromMonth(m) {
  if ([11, 0, 1].includes(m)) return 'winter';
  if ([2, 3, 4].includes(m)) return 'spring';
  if ([5, 6, 7].includes(m)) return 'summer';
  return 'autumn';
}

const SEASON_TASKS = {
  winter: ['قلّل مرات الري — الاحتياج المائي أقل مع انخفاض الحرارة.', 'افحص أنظمة الري بحثاً عن تسريبات قبل موسم الاستخدام المكثف صيفاً.', 'قلّم الأشجار والشجيرات النائمة استعداداً لموسم النمو الربيعي.'],
  spring: ['أضف سماداً عضوياً أو مركباً لتحفيز نمو موسم الربيع.', 'ابدأ زراعة الشتلات والنباتات الموسمية الجديدة.', 'راقب ظهور الآفات مبكراً مع ارتفاع النشاط الحشري.'],
  summer: ['زِد مرات الري تدريجياً مع ارتفاع الحرارة، فضّل الري المبكر صباحاً أو مساءً.', 'راقب علامات الإجهاد الحراري على النباتات (ذبول، اصفرار أطراف الأوراق).', 'نظّف العشب الصناعي دورياً — الغبار والحرارة يسرّعان تراكم الأوساخ.'],
  autumn: ['قلّل الري تدريجياً مع انخفاض الحرارة عن ذروة الصيف.', 'أزل الأوراق المتساقطة بانتظام لمنع تراكمها وتعفنها.', 'خطط لأي إعادة تنسيق أو إضافات قبل موسم الشتاء المعتدل.'],
};

const GARDEN_TYPE_TASKS = {
  natural: ['اقصّ العشب الطبيعي بانتظام حسب سرعة نموه الموسمية.'],
  artificial: ['مشّط ألياف العشب الصناعي دورياً لإعادتها لوضعها الطبيعي بعد الاستخدام.'],
  mixed: ['راجع كل منطقة حسب نوعها (عشب طبيعي يحتاج قصاً، عشب صناعي يحتاج تنظيفاً فقط).'],
};

const CLIMATE_TASKS = {
  coastal: ['افحص علامات تراكم الأملاح على التربة والنباتات القريبة من الساحل.'],
  arid: ['راقب سرعة جفاف التربة في المناخ الداخلي الجاف — قد تحتاج ريّاً أكثر تكراراً من المتوقع.'],
};

const SEASON_LABELS = { winter: 'الشتاء', spring: 'الربيع', summer: 'الصيف', autumn: 'الخريف' };
const GARDEN_TYPES = [
  { id: 'natural', label: 'عشب طبيعي' },
  { id: 'artificial', label: 'عشب صناعي' },
  { id: 'mixed', label: 'مختلط' },
];
const CLIMATES = [
  { id: 'coastal', label: 'ساحلية رطبة' },
  { id: 'arid', label: 'داخلية جافة حارة' },
];

export default function GardenMaintenanceTracker() {
  // Starts at January and is corrected to the real current month post-mount only (never during
  // render/prerender) — calling `new Date()` inside the render body itself is a documented
  // Next.js prerender hazard even in a Client Component, see the AcMaintenanceTracker precedent.
  const [monthIndex, setMonthIndex] = useState(0);
  const [gardenType, setGardenType] = useState('mixed');
  const [climate, setClimate] = useState('arid');

  useEffect(() => { setMonthIndex(new Date().getMonth()); }, []);

  const season = seasonFromMonth(monthIndex);

  const checklist = useMemo(() => {
    return [
      ...SEASON_TASKS[season],
      ...(GARDEN_TYPE_TASKS[gardenType] || []),
      ...(CLIMATE_TASKS[climate] || []),
    ];
  }, [season, gardenType, climate]);

  return (
    <div className="guide-v2-checker" aria-label="جدول صيانة الحديقة الشهري">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><CalendarBlank size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">قائمة مهام هذا الشهر</p>
          <p className="guide-v2-checker-sub">اختر الشهر ونوع حديقتك ومناخك لقائمة مخصصة</p>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>الشهر</p>
      <div className="guide-v2-checker-options" role="group" aria-label="الشهر">
        {MONTHS.map((m, i) => (
          <button key={m} type="button" className={`guide-v2-checker-chip${monthIndex === i ? ' is-active' : ''}`} aria-pressed={monthIndex === i} onClick={() => setMonthIndex(i)}>{m}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 'var(--space-4) 0 var(--space-2)' }}>نوع الحديقة</p>
      <div className="guide-v2-checker-options" role="group" aria-label="نوع الحديقة">
        {GARDEN_TYPES.map((g) => (
          <button key={g.id} type="button" className={`guide-v2-checker-chip${gardenType === g.id ? ' is-active' : ''}`} aria-pressed={gardenType === g.id} onClick={() => setGardenType(g.id)}>{g.label}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 'var(--space-4) 0 var(--space-2)' }}>المنطقة المناخية</p>
      <div className="guide-v2-checker-options" role="group" aria-label="المنطقة المناخية">
        {CLIMATES.map((c) => (
          <button key={c.id} type="button" className={`guide-v2-checker-chip${climate === c.id ? ' is-active' : ''}`} aria-pressed={climate === c.id} onClick={() => setClimate(c.id)}>{c.label}</button>
        ))}
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite" style={{ marginTop: 'var(--space-4)' }}>
        <p className="guide-v2-checker-result-label"><ListChecks size={14} weight="bold" style={{ verticalAlign: 'middle' }} /> مهام {SEASON_LABELS[season]} ({MONTHS[monthIndex]})</p>
        <ul style={{ margin: 'var(--space-2) 0 0', paddingInlineStart: '1.1rem', listStyle: 'disc' }}>
          {checklist.map((task) => (
            <li key={task} style={{ fontSize: '0.88rem', marginBottom: 6, color: 'var(--text-secondary)' }}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
