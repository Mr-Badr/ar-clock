"use client";

import { useEffect, useMemo, useState } from 'react';
import { Cake, Info, ShareNetwork } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { NumberTicker } from '@/components/ui/number-ticker';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildAgeSnapshot } from '@/lib/calculators/age';

function getLocalIsoFromClock(now) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function getLocalMidnightTime(isoDate) {
  const [year, month, day] = String(isoDate).split('-').map(Number);
  if (!year || !month || !day) return 0;
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AgeCountdownTool() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [now, setNow] = useState(null);
  const [maxIso, setMaxIso] = useState('');

  useEffect(() => {
    setNow(new Date());
    setMaxIso(getLocalIsoFromClock(new Date()));
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const normalized = useMemo(() => resolveBirthInput(calendar, birthIso, birthHijri), [birthIso, birthHijri, calendar]);
  const result = useMemo(() => {
    if (!now || !normalized.isValid) return null;
    return buildAgeSnapshot({ birthDateIso: normalized.iso, targetDateIso: getLocalIsoFromClock(now) });
  }, [normalized, now]);

  const countdown = useMemo(() => {
    if (!result?.isValid || !now) return null;
    const midnight = getLocalMidnightTime(result.nextBirthday.iso);
    const remainingMs = Math.max(0, midnight - now.getTime());
    return {
      days: Math.floor(remainingMs / 86400000),
      hours: Math.floor((remainingMs / 3600000) % 24),
      minutes: Math.floor((remainingMs / 60000) % 60),
      seconds: Math.floor((remainingMs / 1000) % 60),
    };
  }, [now, result]);

  const shareText = result?.isValid
    ? `باقي ${countdown?.days} يوم على عيد ميلادي القادم (${result.nextBirthday.label}) — عمري القادم ${result.nextBirthday.nextAge} سنة`
    : '';

  return (
    <div aria-label="عداد عيد الميلاد القادم">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Cake size={14} weight="bold" /> عداد حي <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <BirthInputTool
        calendar={calendar} onCalendarChange={setCalendar}
        gregorianValue={birthIso} onGregorianChange={setBirthIso}
        hijriValue={birthHijri} onHijriChange={setBirthHijri}
        maxIso={maxIso}
      />

      {result?.isValid && countdown ? (
        <div aria-live="polite" aria-atomic="true">
          <div className="tool-v2-result-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AnimatedCircularProgressBar
              className="tool-v2-progress-ring"
              value={result.birthdayProgress.progressPercent}
              gaugePrimaryColor="var(--green)"
              gaugeSecondaryColor="var(--green-subtle)"
            />
            <span className="tool-v2-result-label">من الطريق لعيد ميلادك القادم</span>
          </div>

          <div className="tool-v2-countdown-grid">
            <div className="tool-v2-countdown-unit">
              <NumberTicker value={countdown.days} className="tool-v2-ticker tool-v2-ticker--accent tool-v2-countdown-num" />
              <span className="tool-v2-countdown-label">يوم</span>
            </div>
            <div className="tool-v2-countdown-unit">
              <NumberTicker value={countdown.hours} className="tool-v2-ticker tool-v2-countdown-num" />
              <span className="tool-v2-countdown-label">ساعة</span>
            </div>
            <div className="tool-v2-countdown-unit">
              <NumberTicker value={countdown.minutes} className="tool-v2-ticker tool-v2-countdown-num" />
              <span className="tool-v2-countdown-label">دقيقة</span>
            </div>
            <div className="tool-v2-countdown-unit">
              <NumberTicker value={countdown.seconds} className="tool-v2-ticker tool-v2-countdown-num" />
              <span className="tool-v2-countdown-label">ثانية</span>
            </div>
          </div>

          <div className="tool-v2-breakdown-list" style={{ marginTop: 'var(--space-4)' }}>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">عيد ميلادك القادم</span>
              <span className="tool-v2-breakdown-value">{result.nextBirthday.weekday}، {result.nextBirthday.label}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">عمرك القادم</span>
              <span className="tool-v2-breakdown-value">{result.nextBirthday.nextAge} سنة</span>
            </div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>العداد يعتمد على تاريخ وساعة جهازك الحالي — تأكد من ضبطهما بدقة.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('عداد عيد الميلاد', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Cake size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لبدء العداد التنازلي.</p>
        </div>
      )}
    </div>
  );
}
