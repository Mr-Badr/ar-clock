"use client";

import { useEffect, useMemo, useState } from 'react';
import { Baby, Heart, Info, Scales, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { computeIddahSnapshot, getHijriMonthName } from '@/lib/calculators/iddah';
import { getTodayIso } from '@/lib/calculators/age';

const SITUATION_OPTIONS = [
  { value: 'widow', title: 'أرملة (توفي عنها زوجها)', description: '4 أشهر و10 أيام هجرية' },
  { value: 'divorced-non-menstruating', title: 'مطلقة لا تحيض', description: 'صغر سنها أو بلغت سن اليأس — 3 أشهر هجرية' },
  { value: 'divorced-menstruating', title: 'مطلقة تحيض', description: 'ثلاث حيضات كاملة — مدى تقريبي' },
  { value: 'pregnant', title: 'حامل', description: 'تنتهي بالولادة الفعلية' },
];

const GREGORIAN_FORMATTER = new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' });
function formatGregorian(date) {
  if (!date) return '';
  return GREGORIAN_FORMATTER.format(date);
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function IddahTool() {
  const [situationType, setSituationType] = useState('widow');
  const [startDateIso, setStartDateIso] = useState('2026-01-15');
  const [expectedDueDateIso, setExpectedDueDateIso] = useState('');
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const snapshot = useMemo(() => {
    if (!todayIso) return null;
    try { return computeIddahSnapshot(situationType, startDateIso, expectedDueDateIso, new Date(`${todayIso}T00:00:00`)); }
    catch { return null; }
  }, [situationType, startDateIso, expectedDueDateIso, todayIso]);

  const startDateLabel = situationType === 'widow' ? 'تاريخ الوفاة' : 'تاريخ الطلاق';
  const isOutOfRange = Boolean(startDateIso && todayIso && !snapshot);

  const shareText = snapshot?.isPrecise
    ? `تاريخ انتهاء العدة: ${formatGregorian(snapshot.endDate)}`
    : 'حاسبة العدة الشرعية';

  return (
    <div aria-label="حاسبة العدة الشرعية">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Heart size={14} weight="bold" /> مرجع شرعي <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>اختاري حالتك</label>
        <div className="tool-v2-option-list">
          {SITUATION_OPTIONS.map((opt) => (
            <label key={opt.value} className={`tool-v2-option-row${situationType === opt.value ? ' is-active' : ''}`} htmlFor={`iddah-${opt.value}`}>
              <input type="radio" id={`iddah-${opt.value}`} name="iddah-situation" checked={situationType === opt.value} onChange={() => setSituationType(opt.value)} />
              <span>{opt.title}<span className="tool-v2-option-hint">{opt.description}</span></span>
            </label>
          ))}
        </div>
      </div>

      {situationType !== 'pregnant' ? (
        <div className="tool-v2-field">
          <label htmlFor="iddah-start-date">{startDateLabel}</label>
          <input id="iddah-start-date" type="date" value={startDateIso} min="1924-01-01" max="2077-12-31" onChange={(e) => setStartDateIso(e.target.value)} />
          {isOutOfRange ? <p className="tool-v2-field-hint">هذا التاريخ خارج النطاق المدعوم حالياً (1924–2077م) — جرّبي تاريخاً ضمن هذا المدى.</p> : null}
        </div>
      ) : (
        <div className="tool-v2-field">
          <label htmlFor="iddah-due-date">تاريخ الولادة المتوقع (اختياري)</label>
          <input id="iddah-due-date" type="date" value={expectedDueDateIso} min="1924-01-01" max="2077-12-31" onChange={(e) => setExpectedDueDateIso(e.target.value)} />
        </div>
      )}

      {snapshot ? (
        <div aria-live="polite">
          {snapshot.isPrecise ? (
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">تاريخ انتهاء العدة</span>
              <div className="tool-v2-result-value" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>{formatGregorian(snapshot.endDate)}</div>
              <div className="tool-v2-result-meta">
                {snapshot.endHijri.day} {getHijriMonthName(snapshot.endHijri.month)} {snapshot.endHijri.year} هـ — {snapshot.isOngoing ? `متبقٍ ${snapshot.daysRemaining} يوماً` : 'انتهت مدة العدة'}
              </div>
            </div>
          ) : snapshot.situationType === 'divorced-menstruating' ? (
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">مدى تقريبي لانتهاء العدة</span>
              <div className="tool-v2-result-value" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}>{formatGregorian(snapshot.minEndDate)} — {formatGregorian(snapshot.maxEndDate)}</div>
              <div className="tool-v2-result-meta">عدة المطلقة الحائض ثلاث حيضات كاملة، تعتمد على طول دورتها الفعلية — هذا مدى تقريبي فقط.</div>
            </div>
          ) : (
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">عدة الحامل تنتهي بالولادة</span>
              <div className="tool-v2-result-value" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}>{snapshot.estimatedDueDate ? formatGregorian(snapshot.estimatedDueDate) : 'غير محددة'}</div>
              <div className="tool-v2-result-meta">عدة الحامل تنتهي بوضع حملها فعلياً، بصرف النظر عن كونها أرملة أو مطلقة — أي تاريخ متوقع هنا استرشادي فقط.</div>
            </div>
          )}

          <div className="tool-v2-note-strip">
            <Scales size={15} weight="fill" />
            <span>
              {snapshot.situationType === 'widow' && 'عدة المتوفى عنها زوجها أربعة أشهر وعشرة أيام هجرية كاملة (سورة البقرة: 234)، محسوبة هنا بفارق تقويم هجري فعلي لا بالتقريب الشمسي.'}
              {snapshot.situationType === 'divorced-non-menstruating' && 'عدة المرأة التي لا تحيض (لصغر سنها أو بلوغها سن اليأس) ثلاثة أشهر هجرية كاملة (سورة الطلاق: 4).'}
              {snapshot.situationType === 'divorced-menstruating' && 'عدة المطلقة الحائض ثلاثة قروء (حيضات كاملة) وفق سورة البقرة: 228 — مدة تعتمد على دورتها الشخصية لا على عدد أيام ثابت.'}
              {snapshot.situationType === 'pregnant' && 'عدة الحامل أن تضع حملها، سواء كانت أرملة أو مطلقة (سورة الطلاق: 4).'}
            </span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة العدة الشرعية', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>اختاري حالتك وأدخلي التاريخ لعرض النتيجة.</p>
        </div>
      )}
    </div>
  );
}
