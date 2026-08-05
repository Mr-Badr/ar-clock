"use client";

import { useEffect, useMemo, useState } from 'react';
import { Baby, Hourglass, Info, ShareNetwork, Sparkle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildAgeSnapshot, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AgeCalculatorTool({ compact = false }) {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const normalized = useMemo(() => resolveBirthInput(calendar, birthIso, birthHijri), [calendar, birthIso, birthHijri]);
  const result = useMemo(() => {
    if (!normalized.isValid || !todayIso) return null;
    return buildAgeSnapshot({ birthDateIso: normalized.iso, targetDateIso: todayIso });
  }, [normalized, todayIso]);

  const shareText = result?.isValid
    ? `العمر الحالي: ${result.ageLabel}\nعيد الميلاد القادم: ${result.nextBirthday.label}\nالمتبقي: ${formatAgeNumber(result.nextBirthday.daysUntil, { maximumFractionDigits: 0 })} يوم`
    : '';

  if (compact) {
    return (
      <div aria-label="حاسبة العمر (مصغّرة)">
        <BirthInputTool calendar={calendar} onCalendarChange={setCalendar} gregorianValue={birthIso} onGregorianChange={setBirthIso} hijriValue={birthHijri} onHijriChange={setBirthHijri} />
        {result?.isValid ? (
          <div className="tool-v2-result-hero" style={{ marginTop: 'var(--space-3)' }}>
            <span className="tool-v2-result-label">عمرك الآن</span>
            <div className="tool-v2-result-value">{result.ageLabel}</div>
            <div className="tool-v2-result-meta">عيدك القادم بعد {formatAgeNumber(result.nextBirthday.daysUntil, { maximumFractionDigits: 0 })} يوم</div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div aria-label="حاسبة العمر الكاملة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> بالهجري والميلادي معاً <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <BirthInputTool calendar={calendar} onCalendarChange={setCalendar} gregorianValue={birthIso} onGregorianChange={setBirthIso} hijriValue={birthHijri} onHijriChange={setBirthHijri} />

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AnimatedCircularProgressBar
              className="tool-v2-progress-ring"
              value={result.birthdayProgress.progressPercent}
              gaugePrimaryColor="var(--green)"
              gaugeSecondaryColor="var(--green-subtle)"
            />
            <div style={{ textAlign: 'center' }}>
              <span className="tool-v2-result-label">عمرك الآن</span>
              <div className="tool-v2-result-value">{result.ageLabel}</div>
              <div className="tool-v2-result-meta">{result.birthDateLabel} · {result.birthWeekday} — من الطريق لعيد ميلادك القادم</div>
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إجمالي الأيام</span><span className="tool-v2-breakdown-value"><NumberTicker value={result.totals.days} className="tool-v2-ticker" /> يوم</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إجمالي الساعات</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.totals.hours, { maximumFractionDigits: 0 })} ساعة</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">العمر الهجري تقريباً</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.hijri.yearsApprox)} سنة</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">عيد الميلاد القادم</span><span className="tool-v2-breakdown-value">بعد <NumberTicker value={result.nextBirthday.daysUntil} className="tool-v2-ticker tool-v2-ticker--accent" /> يوم</span></div>
          </div>

          <div className="tool-v2-mini-block-head" style={{ marginTop: 'var(--space-4)' }}>
            <Sparkle size={14} weight="bold" />
            <span>إحصائيات تقديرية ممتعة</span>
          </div>
          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">نبضات القلب (72/د)</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.lifeStats.heartbeats, { maximumFractionDigits: 0 })}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الخطوات (7,000/يوم)</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.lifeStats.steps, { maximumFractionDigits: 0 })}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">ساعات النوم (8/يوم)</span><span className="tool-v2-breakdown-value">{formatAgeNumber(result.lifeStats.sleepHours, { maximumFractionDigits: 0 })}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>يظهر عمرك الهجري أكبر قليلاً لأن السنة الهجرية أقصر من الميلادية بنحو 10-11 يوماً، فيتراكم الفرق مع مرور السنين.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة العمر', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Hourglass size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لعرض عمرك الكامل بالسنوات والأشهر والأيام، بالهجري والميلادي معاً.</p>
        </div>
      )}
    </div>
  );
}
