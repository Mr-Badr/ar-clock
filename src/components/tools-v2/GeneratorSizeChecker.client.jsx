"use client";

import { useMemo, useState } from 'react';
import { Lightning, Check } from '@phosphor-icons/react';

// Running-watt figures are standard, widely-cited household appliance draws (fridge ~150-200W
// running with a ~3-5x starting surge, split AC ~1.2-1.5kW per ton, etc.) — a sizing guide, not
// a lab measurement. The ×1.3 margin below covers starting-surge + safety headroom, matching the
// "اختر مولداً أكبر قليلاً من الحاجة" rule of thumb cited by generator vendors themselves.
const APPLIANCES = [
  { id: 'fridge', label: 'ثلاجة منزلية', watts: 200 },
  { id: 'lighting', label: 'إضاءة المنزل بالكامل', watts: 150 },
  { id: 'tv', label: 'تلفزيون', watts: 120 },
  { id: 'router', label: 'راوتر + شواحن + لابتوب', watts: 60 },
  { id: 'fan', label: 'مروحة أو مروحتان', watts: 80 },
  { id: 'window-ac', label: 'مكيف شباك صغير', watts: 900 },
  { id: 'split-ac', label: 'مكيف سبليت 1.5 طن', watts: 1500 },
  { id: 'pump', label: 'مضخة مياه', watts: 750 },
  { id: 'washer', label: 'غسالة ملابس', watts: 500 },
  { id: 'microwave', label: 'ميكروويف', watts: 1000 },
];

const SAFETY_MARGIN = 1.3;
// Common market sizes seen repeatedly in real listings (2, 3.5, 5, 7.5, 10, 15, 20 kVA).
const MARKET_SIZES_KVA = [2, 3.5, 5, 7.5, 10, 15, 20, 30];

function recommendKva(totalWatts) {
  if (totalWatts <= 0) return null;
  const withMargin = totalWatts * SAFETY_MARGIN;
  // kVA ≈ watts / (1000 * power factor). 0.8 is the standard assumed power factor for mixed
  // household loads (motors + electronics), the same figure vendors themselves use in sizing FAQs.
  const requiredKva = withMargin / (1000 * 0.8);
  return MARKET_SIZES_KVA.find((size) => size >= requiredKva) ?? MARKET_SIZES_KVA[MARKET_SIZES_KVA.length - 1];
}

export default function GeneratorSizeChecker() {
  const [selected, setSelected] = useState(() => new Set(['fridge', 'lighting', 'router']));

  const totalWatts = useMemo(
    () => APPLIANCES.filter((a) => selected.has(a.id)).reduce((sum, a) => sum + a.watts, 0),
    [selected],
  );
  const recommendedKva = useMemo(() => recommendKva(totalWatts), [totalWatts]);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Lightning size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أي حجم مولد يناسب منزلك؟</p>
          <p className="guide-v2-checker-sub">اختر الأجهزة التي تريد تشغيلها أثناء انقطاع الكهرباء</p>
        </div>
      </div>

      <div className="guide-v2-checker-list" role="group" aria-label="الأجهزة المطلوب تشغيلها">
        {APPLIANCES.map((a) => {
          const active = selected.has(a.id);
          return (
            <button
              key={a.id}
              type="button"
              className={`guide-v2-checker-item${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => toggle(a.id)}
            >
              <span className="guide-v2-checker-item-box" aria-hidden="true">
                {active ? <Check size={14} weight="bold" /> : null}
              </span>
              <span className="guide-v2-checker-item-label">{a.label}</span>
              <span className="guide-v2-checker-item-watt">{a.watts} واط</span>
            </button>
          );
        })}
      </div>

      <div className="guide-v2-checker-total">
        <span className="guide-v2-checker-total-label">إجمالي الحمل التشغيلي</span>
        <span className="guide-v2-checker-total-value">{totalWatts.toLocaleString('en-US')} واط</span>
      </div>

      <div className="guide-v2-checker-result" aria-live="polite">
        <p className="guide-v2-checker-result-label">الحجم الموصى به</p>
        <p className="guide-v2-checker-result-value">
          {recommendedKva ? `${recommendedKva} كيلو فولت أمبير (kVA)` : 'اختر جهازاً واحداً على الأقل'}
        </p>
        {recommendedKva ? (
          <p className="guide-v2-checker-result-note">
            الرقم يشمل هامش أمان 30% لتغطية تيار بدء التشغيل (خاصة للمكيفات والمضخات التي تسحب
            تياراً أعلى للحظات عند التشغيل)، بافتراض معامل قدرة 0.8 — وهو ما تعتمده أغلب الشركات
            المصنّعة في جداول الاختيار الخاصة بها. اختر دائماً الحجم التجاري الأقرب الأعلى، لا الأدنى.
          </p>
        ) : null}
      </div>
    </div>
  );
}
