"use client";

import { useMemo, useState } from 'react';
import { ArrowsClockwise } from '@phosphor-icons/react';

import CountryFlag from '@/components/shared/CountryFlag';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';

// The two rules of thumb cited across several independent sources: age ≥ 10 years, and repair
// cost ≥ 50% of a comparable new unit's price — see sources on the page.
const AGE_BANDS = [
  { id: 'young', label: 'أقل من 5 سنوات', isOld: false },
  { id: 'mid', label: 'من 5 إلى 10 سنوات', isOld: false },
  { id: 'old', label: 'أكثر من 10 سنوات', isOld: true },
];

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function AcReplaceOrRepairChecker() {
  const [countryCode, setCountryCode] = useState('sa');
  const [ageId, setAgeId] = useState('mid');
  const [repairCost, setRepairCost] = useState('');
  const [newPrice, setNewPrice] = useState('2500');

  const currency = GULF_CURRENCIES.find((c) => c.code === countryCode) || GULF_CURRENCIES[0];
  const age = AGE_BANDS.find((a) => a.id === ageId);

  const { ratio, result } = useMemo(() => {
    const repair = Math.max(0, Number(repairCost) || 0);
    const fresh = Math.max(1, Number(newPrice) || 1);
    const r = repair / fresh;
    const highCost = repairCost !== '' && r >= 0.5;

    let verdict;
    if (age.isOld && highCost) {
      verdict = { tone: 'is-bad', title: 'استبدله', body: 'مكيفك تجاوز عمره الافتراضي (10 سنوات فأكثر)، وتكلفة الإصلاح المتوقعة تقترب من نصف سعر جهاز جديد أو أكثر — الاستبدال هنا الخيار الأوفر على المدى المتوسط، خصوصاً مع كفاءة أعلى للجهاز الجديد.' };
    } else if (age.isOld || highCost) {
      verdict = { tone: 'is-warn', title: 'فكّر جدياً بالاستبدال', body: age.isOld ? 'عمر مكيفك تجاوز 10 سنوات، وهو الحد الذي يبدأ عنده الإصلاح بالتكرر وترتفع تكلفته التراكمية غالباً — حتى لو كان الإصلاح الحالي رخيصاً.' : 'تكلفة هذا الإصلاح وحده تقترب من نصف سعر جهاز جديد — إن تكررت الأعطال قريباً فالاستبدال يصبح الخيار الأوفر إجمالاً.' };
    } else {
      verdict = { tone: 'is-good', title: 'أصلحه', body: 'عمر مكيفك ضمن العمر الافتراضي المعتاد (10-15 سنة)، وتكلفة الإصلاح معقولة نسبياً — الإصلاح خيار اقتصادي منطقي هنا.' };
    }
    return { ratio: r, result: verdict };
  }, [age, repairCost, newPrice]);

  const ratioPercent = Math.min(100, Math.round(ratio * 100));

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><ArrowsClockwise size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">هل تصلح مكيفك أم تستبدله؟</p>
          <p className="guide-v2-checker-sub">أداة تعمل في أي دولة خليجية — أدخل عمر مكيفك وتكلفة الإصلاح المتوقعة</p>
        </div>
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="دولتك">
        {GULF_CURRENCIES.map((c) => (
          <button
            key={c.code}
            type="button"
            className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`}
            aria-pressed={countryCode === c.code}
            onClick={() => setCountryCode(c.code)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <CountryFlag code={c.code} label={c.country} />
            {c.country}
          </button>
        ))}
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="عمر المكيف">
        {AGE_BANDS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`guide-v2-checker-chip${ageId === a.id ? ' is-active' : ''}`}
            aria-pressed={ageId === a.id}
            onClick={() => setAgeId(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="tool-v2-field-row-pair" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="tool-v2-field">
          <label htmlFor="repair-cost">تكلفة الإصلاح المتوقعة ({currency.short})</label>
          <input
            id="repair-cost"
            type="number"
            inputMode="decimal"
            min="0"
            value={repairCost}
            onChange={(e) => setRepairCost(e.target.value)}
            placeholder="500"
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="new-price">سعر مكيف جديد مشابه ({currency.short})</label>
          <input
            id="new-price"
            type="number"
            inputMode="decimal"
            min="1"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="2500"
          />
        </div>
      </div>

      {repairCost !== '' ? (
        <div className="tool-v2-chart-card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="tool-v2-chart-head">
            <h3>نسبة تكلفة الإصلاح من سعر جهاز جديد</h3>
            <p>قاعدة عامة: إن تجاوزت هذه النسبة 50٪، الاستبدال غالباً أوفر.</p>
          </div>
          <div className="tool-v2-hbar-list">
            <div className="tool-v2-hbar-row">
              <span className="tool-v2-hbar-label">النسبة</span>
              <div className="tool-v2-hbar-track">
                <div
                  className="tool-v2-hbar-fill"
                  style={{ width: `${ratioPercent}%`, background: ratioPercent >= 50 ? 'var(--red-text)' : 'var(--green-text)' }}
                />
              </div>
              <span className="tool-v2-hbar-value">{ratioPercent}٪</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`guide-v2-checker-result ${result.tone}`} aria-live="polite">
        <p className="guide-v2-checker-result-label">التوصية</p>
        <p className="guide-v2-checker-result-value">{result.title}</p>
        <p className="guide-v2-checker-result-note">{result.body}</p>
      </div>
    </div>
  );
}
