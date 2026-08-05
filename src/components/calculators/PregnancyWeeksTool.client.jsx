"use client";

import { useEffect, useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, Circle, Info, ShareNetwork, Timer } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import { calculatePregnancy, formatPregnancyWeek, TRIMESTER_INFO } from '@/lib/calculators/pregnancy';

const CYCLE_PRESETS = [
  { label: '21 يوم', value: 21 },
  { label: '28 يوم (معيار)', value: 28 },
  { label: '30 يوم', value: 30 },
  { label: '35 يوم', value: 35 },
];

const TRIMESTER_COLOR = {
  first: { text: 'var(--blue-text)', ring: 'var(--blue)', ringBg: 'var(--blue-subtle)' },
  second: { text: 'var(--amber-text)', ring: 'var(--amber)', ringBg: 'var(--amber-subtle)' },
  third: { text: 'var(--green-text)', ring: 'var(--green)', ringBg: 'var(--green-subtle)' },
};

function formatDateAr(date) {
  if (!date) return '';
  return date.toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function PregnancyWeeksTool() {
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDateBounds({
      max: today.toISOString().split('T')[0],
      min: new Date(today.getTime() - 294 * 86400000).toISOString().split('T')[0],
    });
  }, []);

  const result = useMemo(() => {
    if (!lmpDate) return null;
    return calculatePregnancy({ lmpDate, cycleLength, today: new Date() });
  }, [lmpDate, cycleLength]);

  const tInfo = result ? (TRIMESTER_INFO[result.trimester] ?? TRIMESTER_INFO[1]) : null;
  const colors = tInfo ? TRIMESTER_COLOR[tInfo.level] : TRIMESTER_COLOR.first;

  const shareText = result?.isValid
    ? [
        `أنا في ${formatPregnancyWeek(result.weeksPregnant, result.extraDays)} من الحمل`,
        `${tInfo?.label ?? ''} · ${result.progressPercent}% مكتمل`,
        `موعد الولادة المتوقع: ${formatDateAr(result.edd)}`,
      ].filter(Boolean).join('\n')
    : '';

  const upcomingMilestones = result?.milestones?.filter((m) => !m.reached && !m.current).slice(0, 4) ?? [];

  return (
    <div aria-label="حاسبة أسابيع الحمل">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> إجابة فورية <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="pw-lmp">أول يوم في آخر دورة شهرية</label>
        <input id="pw-lmp" type="date" dir="ltr" value={lmpDate} max={dateBounds.max} min={dateBounds.min} onChange={(e) => setLmpDate(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>طول الدورة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="طول الدورة">
          {CYCLE_PRESETS.map((p) => (
            <button key={p.value} type="button" className={`guide-v2-checker-chip${cycleLength === p.value ? ' is-active' : ''}`} onClick={() => setCycleLength(p.value)}>{p.label}</button>
          ))}
        </div>
      </div>

      {result?.isValid && tInfo ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AnimatedCircularProgressBar
              className="tool-v2-progress-ring"
              value={result.progressPercent}
              gaugePrimaryColor={colors.ring}
              gaugeSecondaryColor={colors.ringBg}
            />
            <div style={{ textAlign: 'center' }}>
              <span className="tool-v2-result-label">أنتِ الآن في</span>
              <div className="tool-v2-result-value" style={{ color: colors.text }}>{formatPregnancyWeek(result.weeksPregnant, result.extraDays)}</div>
              <div className="tool-v2-result-meta">{tInfo.label} · {tInfo.range}</div>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> موعد الولادة المتوقع</span>
              <span className="tool-v2-breakdown-value">{formatDateAr(result.edd)}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><Timer size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> {result.daysToEdd >= 0 ? 'باقي على الولادة' : 'مضى على موعد الولادة'}</span>
              <span className="tool-v2-breakdown-value">
                <NumberTicker value={Math.abs(result.daysToEdd)} className="tool-v2-ticker tool-v2-ticker--accent" /> يوم
              </span>
            </div>
          </div>

          {upcomingMilestones.length ? (
            <>
              <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
                <Circle size={14} weight="bold" />
                <span>المحطات القادمة</span>
              </div>
              <div className="tool-v2-timeline">
                {upcomingMilestones.map((m) => (
                  <div key={m.week} className="tool-v2-timeline-item">
                    <span className="tool-v2-timeline-dot" aria-hidden="true" />
                    <div>
                      <div className="tool-v2-timeline-title">أسبوع {m.week} — {m.label}</div>
                      <div className="tool-v2-timeline-desc">{formatDateAr(m.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>نتيجة تقديرية وفق قاعدة ناجيل الطبية — راجعي طبيبك لتأكيد أسبوع الحمل، خاصة عبر سونار الأسبوع 8–14.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة أسابيع الحمل', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : lmpDate ? (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>التاريخ المدخل يتجاوز 42 أسبوعاً — تأكدي من صحة تاريخ آخر دورة.</p>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>أدخلي تاريخ آخر دورة لمعرفة أسبوع حملك الحالي وموعد الولادة المتوقع فوراً.</p>
        </div>
      )}
    </div>
  );
}
