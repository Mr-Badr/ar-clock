"use client";

import { useEffect, useMemo, useState } from 'react';
import { Info, Planet as PlanetIcon, ShareNetwork, Star } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import BirthInputTool, { resolveBirthInput } from '@/components/calculators/age/BirthInputTool.client';
import { buildPlanetaryAges, formatAgeNumber, getTodayIso } from '@/lib/calculators/age';

// Inner rocky planets vs. outer gas giants get separate orbit rings — orbiting 8 elements on one
// ring at once reads as chaotic on a mobile-width panel.
const INNER_KEYS = ['mercury', 'venus', 'earth', 'mars'];
const PLANET_COLOR = {
  mercury: 'var(--text-muted)', venus: 'var(--amber-text)', earth: 'var(--blue-text)', mars: 'var(--red-text)',
  jupiter: 'var(--amber-text)', saturn: 'var(--text-secondary)', uranus: 'var(--blue-text)', neptune: 'var(--blue-text)',
};

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function AgePlanetsTool() {
  const [calendar, setCalendar] = useState('gregorian');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [birthHijri, setBirthHijri] = useState({ day: '12', month: '9', year: '1415' });
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const normalized = useMemo(() => resolveBirthInput(calendar, birthIso, birthHijri), [birthIso, birthHijri, calendar]);
  const result = useMemo(() => {
    if (!normalized.isValid || !todayIso) return null;
    return buildPlanetaryAges({ birthDateIso: normalized.iso, targetDateIso: todayIso });
  }, [normalized, todayIso]);

  const earthAge = result?.isValid ? result.planets.find((p) => p.key === 'earth') : null;
  const shareText = earthAge
    ? `عمري بالسنوات الأرضية ${formatAgeNumber(earthAge.age)} — لكن على المريخ عمري ${formatAgeNumber(result.planets.find((p) => p.key === 'mars').age)} سنة مريخية فقط!`
    : '';

  return (
    <div aria-label="حاسبة العمر على الكواكب">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><PlanetIcon size={14} weight="bold" /> زاوية ممتعة <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <BirthInputTool
        calendar={calendar} onCalendarChange={setCalendar}
        gregorianValue={birthIso} onGregorianChange={setBirthIso}
        hijriValue={birthHijri} onHijriChange={setBirthHijri}
      />

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-orbit-stage" aria-hidden="true">
            <OrbitingCircles radius={48} duration={14} iconSize={22}>
              {INNER_KEYS.map((key) => (
                <span key={key} className="tool-v2-orbit-dot" style={{ color: PLANET_COLOR[key] }}><PlanetIcon size={16} weight="fill" /></span>
              ))}
            </OrbitingCircles>
            <OrbitingCircles radius={92} duration={28} reverse iconSize={26}>
              {result.planets.filter((p) => !INNER_KEYS.includes(p.key)).map((p) => (
                <span key={p.key} className="tool-v2-orbit-dot" style={{ color: PLANET_COLOR[p.key] }}><PlanetIcon size={18} weight="fill" /></span>
              ))}
            </OrbitingCircles>
            <span className="tool-v2-orbit-sun"><Star size={20} weight="fill" /></span>
          </div>

          <div className="tool-v2-mini-block-head">
            <PlanetIcon size={14} weight="bold" />
            <span>عمرك على كل كوكب</span>
          </div>
          <div className="tool-v2-table-wrap">
            <table className="tool-v2-table">
              <thead><tr><th>الكوكب</th><th>عمرك هناك</th><th>عيدك القادم بعد</th></tr></thead>
              <tbody>
                {result.planets.map((p) => (
                  <tr key={p.key} style={p.key === 'earth' ? { fontWeight: 700 } : undefined}>
                    <td>{p.label}{p.key === 'earth' ? ' (أنت هنا)' : ''}</td>
                    <td>{formatAgeNumber(p.age)} سنة</td>
                    <td>{formatAgeNumber(p.nextBirthdayInDays, { maximumFractionDigits: 0 })} يوم</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>عمرك على أي كوكب = عدد أيام حياتك مقسوماً على طول سنة ذلك الكوكب (مدة دورته الكاملة حول الشمس) — بيانات ناسا/JPL الفلكية.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('عمري على الكواكب', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <PlanetIcon size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك لمعرفة عمرك على كل كوكب في المجموعة الشمسية.</p>
        </div>
      )}
    </div>
  );
}
