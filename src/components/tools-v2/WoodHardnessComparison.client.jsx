"use client";

import { useMemo, useState } from 'react';
import { Ruler } from '@phosphor-icons/react';

// Janka hardness values (lbf) — sourced from wood-database.com per-species pages and Wikipedia's
// cited Janka-hardness-test comparison table, not estimated. See sources on the page. Regional/
// trade names without a confident single botanical match (الأرو، الموسكي) are deliberately
// excluded here rather than assigned a guessed number — they're covered qualitatively in the
// guide text instead.
const SPECIES = [
  { id: 'balsa', name: 'بالسا (للمقارنة فقط)', janka: 70, note: 'خفيف جداً جداً — غير مستخدم عملياً في الأثاث، يُذكر كمرجع للحد الأدنى فقط.' },
  { id: 'pine', name: 'الصنوبر (Scots Pine)', janka: 540, note: 'لين نسبياً، سهل التشغيل والدهان — شائع في الأثاث الاقتصادي والديكورات الداخلية.' },
  { id: 'poplar', name: 'الحور', janka: 600, note: 'لين، خفيف الوزن — مناسب لأعمال داخلية غير معرضة لاحتكاك يومي.' },
  { id: 'teak', name: 'الساج', janka: 1155, note: 'صلب ومقاوم طبيعياً للرطوبة والحشرات — يستخدم كثيراً بالأثاث الخارجي.' },
  { id: 'walnut', name: 'الجوز', janka: 1010, note: 'متوسط الصلابة، مرغوب لجماله ولونه الغامق وسهولة تشكيله.' },
  { id: 'oak-red', name: 'البلوط الأحمر', janka: 1290, note: 'صلب، مناسب للأثاث كثير الاستخدام اليومي.' },
  { id: 'oak-white', name: 'البلوط الأبيض', janka: 1360, note: 'صلب، ومقاوم للرطوبة أفضل من البلوط الأحمر.' },
  { id: 'beech', name: 'الزان', janka: 1450, note: 'صلب — الخيار الأشيع في أثاث الاستخدام اليومي بالمنطقة العربية.' },
  { id: 'maple', name: 'القيقب الصلب', janka: 1450, note: 'صلب جداً — ممتاز للأرضيات وأسطح العمل كثيرة الاحتكاك.' },
  { id: 'hickory', name: 'الهيكوري', janka: 1820, note: 'الأصلب في هذه القائمة — للاستخدام الشاق جداً (أدوات، أرضيات رياضية).' },
];

const MAX_JANKA = Math.max(...SPECIES.map((s) => s.janka));

function tierColor(janka) {
  if (janka >= 1300) return 'var(--green-text)';
  if (janka >= 700) return 'var(--amber-text)';
  return 'var(--blue-text)';
}

export default function WoodHardnessComparison() {
  const ranked = useMemo(() => [...SPECIES].sort((a, b) => b.janka - a.janka), []);
  const [aId, setAId] = useState('beech');
  const [bId, setBId] = useState('pine');

  const a = SPECIES.find((s) => s.id === aId);
  const b = SPECIES.find((s) => s.id === bId);
  const diffPercent = a && b ? Math.round((a.janka / b.janka) * 100 - 100) : 0;

  return (
    <div>
      <div className="tool-v2-chart-card">
        <div className="tool-v2-chart-head">
          <h3>ترتيب الأنواع حسب الصلابة الفعلية (مقياس Janka)</h3>
          <p>رقم علمي يقيس القوة اللازمة لغرز كرة معدنية في الخشب — ليس تقديراً حسياً أو تسويقياً.</p>
        </div>
        <div className="tool-v2-hbar-list">
          {ranked.map((s) => (
            <div className="tool-v2-hbar-row" key={s.id}>
              <span className="tool-v2-hbar-label">{s.name}</span>
              <div className="tool-v2-hbar-track">
                <div
                  className="tool-v2-hbar-fill"
                  style={{ width: `${(s.janka / MAX_JANKA) * 100}%`, background: tierColor(s.janka) }}
                />
              </div>
              <span className="tool-v2-hbar-value">{s.janka}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="guide-v2-checker" style={{ marginTop: 'var(--space-6)' }}>
        <div className="guide-v2-checker-head">
          <span className="guide-v2-checker-icon" aria-hidden="true"><Ruler size={18} weight="bold" /></span>
          <div>
            <p className="guide-v2-checker-title">قارن نوعين مباشرة</p>
            <p className="guide-v2-checker-sub">أيهما أصلب فعلياً، وبكم؟</p>
          </div>
        </div>

        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="wood-a">النوع الأول</label>
            <select id="wood-a" value={aId} onChange={(e) => setAId(e.target.value)}>
              {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="tool-v2-field">
            <label htmlFor="wood-b">النوع الثاني</label>
            <select id="wood-b" value={bId} onChange={(e) => setBId(e.target.value)}>
              {SPECIES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className={`guide-v2-checker-result ${diffPercent >= 0 ? 'is-good' : 'is-warn'}`} aria-live="polite">
          <p className="guide-v2-checker-result-label">النتيجة</p>
          <p className="guide-v2-checker-result-value" style={{ fontSize: '1.1rem' }}>
            {diffPercent === 0 ? `${a.name} و${b.name} متقاربان في الصلابة` : diffPercent > 0
              ? `${a.name} أصلب من ${b.name} بنسبة ${diffPercent}٪ تقريباً`
              : `${b.name} أصلب من ${a.name} بنسبة ${Math.abs(diffPercent)}٪ تقريباً`}
          </p>
          <p className="guide-v2-checker-result-note">{a.note}</p>
        </div>
      </div>
    </div>
  );
}
