"use client";

import { useMemo, useState } from 'react';
import { Flower, SunHorizon } from '@phosphor-icons/react';

// Gulf-climate plant dataset — sourced from the editorial guides read during research
// (hadeqtak.com, albasami.com, glamorousconcept.com), see
// keyword-research/landscaping-hub/DECISION.md §1. Facts only, no invented figures.
const PLANTS = [
  { id: 'sidr', name: 'السدر', sun: 'full', care: 'low', functions: ['shade'], desc: 'شجرة ظل معمّرة تتحمل الحرارة والجفاف الشديد، تحتاج ريّاً قليلاً فقط بعد التأصيل.' },
  { id: 'ghaf', name: 'الغاف', sun: 'full', care: 'low', functions: ['shade'], desc: 'من أكثر الأشجار المحلية تحملاً للجفاف في الخليج، جذورها العميقة تصل للماء الجوفي.' },
  { id: 'bougainvillea', name: 'الجهنمية', sun: 'full', care: 'low', functions: ['flower', 'privacy'], desc: 'نبات مزهر بألوان زاهية يتحمل الحرارة القاسية، ممتاز كسياج مزهر كثيف.' },
  { id: 'jasmine', name: 'الياسمين الهندي', sun: 'partial', care: 'medium', functions: ['flower'], desc: 'رائحة عطرة مميزة، يفضّل ظلاً جزئياً وريّاً منتظماً غير مفرط.' },
  { id: 'tecoma', name: 'التيكوما', sun: 'full', care: 'low', functions: ['flower', 'privacy'], desc: 'شجيرة مزهرة صفراء سريعة النمو، تتحمل الحرارة والإهمال النسبي جيداً.' },
  { id: 'cactus', name: 'الصبار والصباريات', sun: 'full', care: 'low', functions: ['ground'], desc: 'أقل النباتات احتياجاً للماء إطلاقاً — خيار مثالي لتقليل استهلاك الري.' },
];

const SUN_OPTIONS = [
  { id: 'full', label: 'شمس كاملة' },
  { id: 'partial', label: 'ظل جزئي' },
];
const CARE_OPTIONS = [
  { id: 'low', label: 'منخفض جداً' },
  { id: 'medium', label: 'متوسط' },
];
const FUNCTION_OPTIONS = [
  { id: 'ground', label: 'غطاء أرضي' },
  { id: 'privacy', label: 'سياج / خصوصية' },
  { id: 'flower', label: 'نبات مزهر للديكور' },
  { id: 'shade', label: 'ظل' },
];

export default function PlantPickerChecker() {
  const [sun, setSun] = useState('full');
  const [care, setCare] = useState('low');
  const [fn, setFn] = useState('flower');

  const matches = useMemo(() => {
    return PLANTS.filter((p) => {
      const sunOk = p.sun === sun || (sun === 'partial' && p.sun === 'full');
      const careOk = care === 'medium' ? true : p.care === 'low';
      const fnOk = p.functions.includes(fn);
      return sunOk && careOk && fnOk;
    });
  }, [sun, care, fn]);

  return (
    <div className="guide-v2-checker" aria-label="مدقق اختيار النباتات المناسبة للمناخ الخليجي">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Flower size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أي نباتات تناسب حديقتك؟</p>
          <p className="guide-v2-checker-sub">حدد ظروف حديقتك الفعلية للحصول على قائمة مرشّحة</p>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>مقدار التعرض للشمس</p>
      <div className="guide-v2-checker-options" role="group" aria-label="التعرض للشمس">
        {SUN_OPTIONS.map((o) => (
          <button key={o.id} type="button" className={`guide-v2-checker-chip${sun === o.id ? ' is-active' : ''}`} aria-pressed={sun === o.id} onClick={() => setSun(o.id)}>{o.label}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 'var(--space-4) 0 var(--space-2)' }}>مستوى العناية الذي تريده</p>
      <div className="guide-v2-checker-options" role="group" aria-label="مستوى العناية">
        {CARE_OPTIONS.map((o) => (
          <button key={o.id} type="button" className={`guide-v2-checker-chip${care === o.id ? ' is-active' : ''}`} aria-pressed={care === o.id} onClick={() => setCare(o.id)}>{o.label}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 'var(--space-4) 0 var(--space-2)' }}>الوظيفة المطلوبة</p>
      <div className="guide-v2-checker-options" role="group" aria-label="الوظيفة">
        {FUNCTION_OPTIONS.map((o) => (
          <button key={o.id} type="button" className={`guide-v2-checker-chip${fn === o.id ? ' is-active' : ''}`} aria-pressed={fn === o.id} onClick={() => setFn(o.id)}>{o.label}</button>
        ))}
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite" style={{ marginTop: 'var(--space-4)' }}>
        <p className="guide-v2-checker-result-label">النباتات المرشّحة لحديقتك</p>
        {matches.length ? (
          <div className="guide-v2-type-grid" style={{ marginTop: 'var(--space-3)' }}>
            {matches.map((p) => (
              <div className="guide-v2-type-card" key={p.id}>
                <div className="guide-v2-type-card-head">
                  <span className="guide-v2-type-card-icon" aria-hidden="true"><SunHorizon size={16} weight="bold" /></span>
                  <strong>{p.name}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="guide-v2-checker-result-note">لا توجد نتائج مطابقة تماماً لهذا المزيج — جرّب توسيع مستوى العناية إلى &quot;متوسط&quot;.</p>
        )}
      </div>
    </div>
  );
}
