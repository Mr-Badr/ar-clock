"use client";

import { useMemo, useState } from 'react';
import { CalendarCheck, WarningCircle } from '@phosphor-icons/react';

import { resolveZatcaWave } from '@/lib/tools/zatca-waves';

function formatSar(n) {
  return `${Number(n).toLocaleString('en-US')} ريال`;
}

export default function ZatcaEligibilityChecker() {
  const [revenue, setRevenue] = useState('');

  const result = useMemo(() => {
    if (!revenue) return null;
    const wave = resolveZatcaWave(revenue);
    if (!wave) {
      return {
        tone: 'is-good',
        title: 'غير مشمول بأي موجة معلَنة حتى الآن',
        note: 'إيراداتك أقل من عتبة أحدث موجة معلنة (187,500 ريال). زاتكا تخفّض العتبة تدريجياً مع كل موجة جديدة، لذا يُنصح بمراجعة هذه الصفحة كل بضعة أشهر إن كانت إيراداتك تقترب من هذا الرقم.',
      };
    }
    return {
      tone: wave.status === 'current' ? 'is-warn' : 'is-good',
      title: `أنت على الأغلب ضمن الموجة ${wave.wave}`,
      note: `لأن إيراداتك الخاضعة لضريبة القيمة المضافة تجاوزت ${formatSar(wave.thresholdSar)} خلال أحد الأعوام ${wave.years.join(' أو ')} — موعد الربط والتكامل مع منصة "فاتورة": ${wave.deadlineLabel}${wave.status === 'passed' ? ' (هذا الموعد قد مضى — إن لم تكن قد ربطت نظامك بعد، راجع وضعك مع محاسبك فوراً).' : '.'}`,
    };
  }, [revenue]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><CalendarCheck size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">هل منشأتك مشمولة بالمرحلة الثانية؟</p>
          <p className="guide-v2-checker-sub">أدخل أعلى إيراد سنوي خاضع للضريبة حققته منشأتك</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="zatca-revenue">أعلى إيراد سنوي (2022–2025) بالريال</label>
        <input
          id="zatca-revenue"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="مثال: 250000"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
        />
      </div>

      {result ? (
        <div className={`guide-v2-checker-result ${result.tone}`} aria-live="polite">
          <p className="guide-v2-checker-result-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {result.tone === 'is-warn' ? <WarningCircle size={16} weight="bold" style={{ color: 'var(--amber-text)' }} /> : null}
            {result.title}
          </p>
          <p className="guide-v2-checker-result-note">{result.note}</p>
        </div>
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>أدخل رقم إيرادك لمعرفة الموجة التي تشملك وموعدها النهائي.</p>
        </div>
      )}

      <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
        هذه أداة استرشادية مبنية على إعلانات زاتكا الرسمية العامة — القرار النهائي والتفاصيل الدقيقة
        لحالتك تأتي من إشعار زاتكا الرسمي الموجَّه لمنشأتك أو من محاسبك المعتمد.
      </p>
    </div>
  );
}
