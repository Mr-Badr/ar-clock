"use client";

import { useEffect, useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, Circle, Info, ShareNetwork, Timer } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import { getHijriParts } from '@/lib/hijri-utils';
import { calculatePregnancy, formatPregnancyWeek, TRIMESTER_INFO } from '@/lib/calculators/pregnancy';

const CYCLE_PRESETS = [
  { label: '21 يوم', value: 21 },
  { label: '25 يوم', value: 25 },
  { label: '28 يوم (معيار)', value: 28 },
  { label: '30 يوم', value: 30 },
  { label: '35 يوم', value: 35 },
];

const INPUT_MODES = [
  { key: 'lmp', label: 'آخر دورة (LMP)' },
  { key: 'ultrasound', label: 'موجات فوق صوتية' },
  { key: 'conception', label: 'إخصاب / أطفال أنابيب' },
];

// Trimester → semantic color (blue→amber→green progression, not the engine's own hardcoded hex
// which we intentionally don't reuse — calculator-ui-standards.md §3 CSS-variables-only rule).
const TRIMESTER_COLOR = {
  first: { text: 'var(--blue-text)', ring: 'var(--blue)', ringBg: 'var(--blue-subtle)' },
  second: { text: 'var(--amber-text)', ring: 'var(--amber)', ringBg: 'var(--amber-subtle)' },
  third: { text: 'var(--green-text)', ring: 'var(--green)', ringBg: 'var(--green-subtle)' },
};

function formatDateAr(date) {
  if (!date) return '';
  return date.toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
}
function formatHijriDate(parts) {
  if (!parts || !parts.hijriDay) return '';
  return `${parts.hijriDay} ${parts.hijriMonthName} ${parts.hijriYear} هـ`;
}
function deriveLmpFromUltrasound({ usDate, usWeeks, usDays }) {
  if (!usDate || usWeeks === '' || usWeeks === undefined) return null;
  const date = new Date(usDate);
  if (isNaN(date.getTime())) return null;
  const totalDays = (Number(usWeeks) || 0) * 7 + (Number(usDays) || 0);
  return new Date(date.getTime() - totalDays * 86400000).toISOString().split('T')[0];
}
function deriveLmpFromConception({ conceptionDate, isIvf, embryoDay }) {
  if (!conceptionDate) return null;
  const date = new Date(conceptionDate);
  if (isNaN(date.getTime())) return null;
  const offset = isIvf ? (embryoDay === 3 ? 17 : 19) : 14;
  return new Date(date.getTime() - offset * 86400000).toISOString().split('T')[0];
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function PregnancyTool() {
  const [mode, setMode] = useState('lmp');
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [usDate, setUsDate] = useState('');
  const [usWeeks, setUsWeeks] = useState('');
  const [usDays, setUsDays] = useState('0');
  const [conceptionDate, setConceptionDate] = useState('');
  const [isIvf, setIsIvf] = useState(false);
  const [embryoDay, setEmbryoDay] = useState(5);
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDateBounds({
      max: today.toISOString().split('T')[0],
      min: new Date(today.getTime() - 294 * 86400000).toISOString().split('T')[0],
    });
  }, []);

  const effectiveLmp = useMemo(() => {
    if (mode === 'lmp') return lmpDate || null;
    if (mode === 'ultrasound') return deriveLmpFromUltrasound({ usDate, usWeeks, usDays });
    if (mode === 'conception') return deriveLmpFromConception({ conceptionDate, isIvf, embryoDay });
    return null;
  }, [mode, lmpDate, usDate, usWeeks, usDays, conceptionDate, isIvf, embryoDay]);

  const result = useMemo(() => {
    if (!effectiveLmp) return null;
    return calculatePregnancy({ lmpDate: effectiveLmp, cycleLength: 28, today: new Date() });
  }, [effectiveLmp]);

  const tInfo = result ? (TRIMESTER_INFO[result.trimester] || TRIMESTER_INFO[1]) : null;
  const colors = tInfo ? TRIMESTER_COLOR[tInfo.level] : TRIMESTER_COLOR.first;
  const eddHijri = result?.edd ? getHijriParts(result.edd) : null;
  const hasInput = mode === 'lmp' ? !!lmpDate : mode === 'ultrasound' ? (!!usDate && usWeeks !== '') : !!conceptionDate;

  const shareText = result?.isValid
    ? [
        `أنا في ${formatPregnancyWeek(result.weeksPregnant, result.extraDays)} من الحمل`,
        `موعد الولادة المتوقع: ${formatDateAr(result.edd)}`,
        eddHijri ? `(${formatHijriDate(eddHijri)})` : '',
        `${result.progressPercent}% من الحمل مكتمل`,
      ].filter(Boolean).join('\n')
    : '';

  const upcomingMilestones = result?.milestones?.filter((m) => !m.reached && !m.current).slice(0, 5) ?? [];
  const reachedMilestones = result?.milestones?.filter((m) => m.reached || m.current).slice(-3) ?? [];

  return (
    <div aria-label="حاسبة الحمل وموعد الولادة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> بالهجري والميلادي معاً <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>طريقة الحساب</label>
        <div className="guide-v2-checker-options" role="group" aria-label="طريقة الحساب">
          {INPUT_MODES.map((m) => (
            <button key={m.key} type="button" className={`guide-v2-checker-chip${mode === m.key ? ' is-active' : ''}`} aria-pressed={mode === m.key} onClick={() => setMode(m.key)}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'lmp' ? (
        <>
          <div className="tool-v2-field">
            <label htmlFor="pregnancy-lmp">أول يوم في آخر دورة شهرية</label>
            <input id="pregnancy-lmp" type="date" dir="ltr" value={lmpDate} max={dateBounds.max} min={dateBounds.min} onChange={(e) => setLmpDate(e.target.value)} />
            <p className="tool-v2-field-hint">أدخلي أول يوم في آخر دورة — ليس يوم التأخر أو اختبار الحمل.</p>
          </div>
          <div className="tool-v2-field">
            <label>طول الدورة الشهرية</label>
            <div className="guide-v2-checker-options" role="group" aria-label="طول الدورة">
              {CYCLE_PRESETS.map((p) => (
                <button key={p.value} type="button" className={`guide-v2-checker-chip${cycleLength === p.value ? ' is-active' : ''}`} onClick={() => setCycleLength(p.value)}>{p.label}</button>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {mode === 'ultrasound' ? (
        <>
          <div className="tool-v2-field">
            <label htmlFor="us-date">تاريخ جلسة الموجات فوق الصوتية</label>
            <input id="us-date" type="date" dir="ltr" value={usDate} max={dateBounds.max} min={dateBounds.min} onChange={(e) => setUsDate(e.target.value)} />
          </div>
          <div className="tool-v2-field-row-pair">
            <div className="tool-v2-field">
              <label htmlFor="us-weeks">عمر الجنين — أسابيع</label>
              <input id="us-weeks" type="number" inputMode="numeric" min="4" max="42" placeholder="مثال: 12" value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)} />
            </div>
            <div className="tool-v2-field">
              <label htmlFor="us-days">أيام إضافية</label>
              <input id="us-days" type="number" inputMode="numeric" min="0" max="6" placeholder="0" value={usDays} onChange={(e) => setUsDays(e.target.value)} />
            </div>
          </div>
          <p className="tool-v2-field-hint">الأرقام مكتوبة في تقرير الطبيبة — مثلاً: 12 أسبوع و3 أيام.</p>
        </>
      ) : null}

      {mode === 'conception' ? (
        <>
          <div className="tool-v2-field">
            <label>نوع الإخصاب</label>
            <div className="guide-v2-checker-options" role="group" aria-label="نوع الإخصاب">
              <button type="button" className={`guide-v2-checker-chip${!isIvf ? ' is-active' : ''}`} onClick={() => setIsIvf(false)}>حمل طبيعي</button>
              <button type="button" className={`guide-v2-checker-chip${isIvf ? ' is-active' : ''}`} onClick={() => setIsIvf(true)}>أطفال أنابيب (IVF/ICSI)</button>
            </div>
          </div>
          {isIvf ? (
            <div className="tool-v2-field">
              <label>نوع الجنين المنقول</label>
              <div className="guide-v2-checker-options" role="group" aria-label="نوع الجنين المنقول">
                <button type="button" className={`guide-v2-checker-chip${embryoDay === 5 ? ' is-active' : ''}`} onClick={() => setEmbryoDay(5)}>بلاستوسيست — اليوم 5</button>
                <button type="button" className={`guide-v2-checker-chip${embryoDay === 3 ? ' is-active' : ''}`} onClick={() => setEmbryoDay(3)}>جنين اليوم 3</button>
              </div>
            </div>
          ) : null}
          <div className="tool-v2-field">
            <label htmlFor="conception-date">{isIvf ? 'تاريخ نقل الجنين (Transfer Date)' : 'تاريخ الإخصاب التقريبي'}</label>
            <input id="conception-date" type="date" dir="ltr" value={conceptionDate} max={dateBounds.max} min={dateBounds.min} onChange={(e) => setConceptionDate(e.target.value)} />
          </div>
        </>
      ) : null}

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
              <span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> موعد الولادة (ميلادي)</span>
              <span className="tool-v2-breakdown-value">{formatDateAr(result.edd)}</span>
            </div>
            {eddHijri ? (
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> موعد الولادة (هجري)</span>
                <span className="tool-v2-breakdown-value">{formatHijriDate(eddHijri)}</span>
              </div>
            ) : null}
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
                      <div className="tool-v2-timeline-desc">{m.detail} · {formatDateAr(m.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {reachedMilestones.length ? (
            <>
              <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
                <CheckCircle size={14} weight="bold" />
                <span>محطات مررتِ بها</span>
              </div>
              <div className="tool-v2-timeline">
                {reachedMilestones.map((m) => (
                  <div key={m.week} className="tool-v2-timeline-item is-current">
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
            <span>موعد الولادة تقدير استرشادي وفق قاعدة ناجيل الطبية — راجعي طبيبك للتأكيد. في حالة IVF يكون الموعد أدق لأن تاريخ الإخصاب معروف بدقة.</span>
          </div>
        </div>
      ) : hasInput ? (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>التاريخ يبدو خارج النطاق — تأكدي من صحة التاريخ المدخل (يجب أن يكون خلال آخر 42 أسبوعاً).</p>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>
            {mode === 'lmp' && 'أدخلي تاريخ آخر دورة لمعرفة أسبوع حملك وموعد الولادة بالميلادي والهجري.'}
            {mode === 'ultrasound' && 'أدخلي تاريخ السونار وعمر الجنين لحساب موعد الولادة.'}
            {mode === 'conception' && 'أدخلي تاريخ الإخصاب أو نقل الجنين لحساب أسبوع الحمل وموعد الولادة.'}
          </p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة الحمل', shareText)} disabled={!result?.isValid}>
          <ShareNetwork size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
