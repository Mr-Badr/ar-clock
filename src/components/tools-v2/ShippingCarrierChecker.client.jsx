"use client";

import { useMemo, useState } from 'react';
import { Truck } from '@phosphor-icons/react';

const DESTINATIONS = [
  { id: 'local', label: 'داخل السعودية فقط' },
  { id: 'gulf', label: 'دول الخليج' },
  { id: 'international', label: 'دولي (خارج الخليج)' },
];
const PRIORITIES = [
  { id: 'cost', label: 'أقل تكلفة ممكنة' },
  { id: 'speed', label: 'أسرع توصيل' },
  { id: 'cod', label: 'الدفع عند الاستلام (COD)' },
];

function recommend(destination, priority) {
  if (destination === 'international') {
    return {
      pick: 'أرامكس',
      reason: 'شبكة أرامكس الدولية أوسع وأنضج بكثير لخارج الخليج — تغطية جغرافية وخبرة جمركية أعمق للشحنات خارج المنطقة.',
    };
  }
  if (priority === 'cost' && destination === 'local') {
    return {
      pick: 'سمسا',
      reason: 'أسعار سمسا للشحن المحلي داخل السعودية تنافسية جداً، وهي الأكثر استخداماً من متاجر سلة وزد بسبب اتفاقيات الأسعار المخفّضة معهما.',
    };
  }
  if (priority === 'speed' && destination === 'local') {
    return {
      pick: 'سمسا',
      reason: 'انتشار سمسا الجغرافي الواسع داخل المدن السعودية يعطيها عادة أفضلية في سرعة التوصيل المحلي.',
    };
  }
  return {
    pick: 'كلاهما مناسب — قارن عرضين فعليين',
    reason: 'مع أولوية الدفع عند الاستلام أو التغطية الخليجية، كلا الناقلين يقدمان الخدمة — الفارق الحقيقي هنا في السعر الفعلي الذي يعرضه كل ناقل لحجم شحناتك تحديداً، فاطلب عرض سعر من الاثنين ثم قارن.',
  };
}

export default function ShippingCarrierChecker() {
  const [destination, setDestination] = useState('local');
  const [priority, setPriority] = useState('cost');
  const result = useMemo(() => recommend(destination, priority), [destination, priority]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Truck size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">أيهما يناسب متجرك؟</p>
          <p className="guide-v2-checker-sub">حدد وجهة شحناتك وأولويتك</p>
        </div>
      </div>

      <p className="guide-v2-checker-sub" style={{ marginBottom: 'var(--space-2)' }}>وجهة شحناتك الأساسية</p>
      <div className="guide-v2-checker-options" role="group" aria-label="الوجهة" style={{ marginBottom: 'var(--space-3)' }}>
        {DESTINATIONS.map((d) => (
          <button key={d.id} type="button" className={`guide-v2-checker-chip${destination === d.id ? ' is-active' : ''}`} aria-pressed={destination === d.id} onClick={() => setDestination(d.id)}>
            {d.label}
          </button>
        ))}
      </div>

      <p className="guide-v2-checker-sub" style={{ marginBottom: 'var(--space-2)' }}>أولويتك الأهم</p>
      <div className="guide-v2-checker-options" role="group" aria-label="الأولوية" style={{ marginBottom: 'var(--space-4)' }}>
        {PRIORITIES.map((p) => (
          <button key={p.id} type="button" className={`guide-v2-checker-chip${priority === p.id ? ' is-active' : ''}`} aria-pressed={priority === p.id} onClick={() => setPriority(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite">
        <p className="guide-v2-checker-result-label">التوصية</p>
        <p className="guide-v2-checker-result-value" style={{ fontSize: '1.3rem' }}>{result.pick}</p>
        <p className="guide-v2-checker-result-note">{result.reason}</p>
      </div>
    </div>
  );
}
