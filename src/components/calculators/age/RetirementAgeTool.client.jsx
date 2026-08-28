"use client";

import { useEffect, useMemo, useState } from 'react';
import { CalendarBlank, Info, ShareNetwork, Timer } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { NumberTicker } from '@/components/ui/number-ticker';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { calculateRetirement, getTodayIso } from '@/lib/calculators/age';
import { RETIREMENT_RULES } from '@/lib/calculators/age-data';

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function RetirementAgeTool() {
  const [countryCode, setCountryCode] = useState('sa');
  const [sector, setSector] = useState('government');
  const [gender, setGender] = useState('male');
  const [birthIso, setBirthIso] = useState('1995-03-12');
  const [todayIso, setTodayIso] = useState(null);

  useEffect(() => { setTodayIso(getTodayIso()); }, []);

  const result = useMemo(() => {
    if (!todayIso) return null;
    return calculateRetirement({ birthDateIso: birthIso, countryCode, sector, gender, targetDateIso: todayIso });
  }, [birthIso, countryCode, gender, sector, todayIso]);

  const shareText = result?.isValid
    ? `موعد تقاعدي المتوقع (${result.rule.country}): ${result.retirementDateLabel} — ${result.remainingLabel}`
    : '';

  return (
    <div aria-label="حاسبة سن التقاعد">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Timer size={14} weight="bold" /> مرجع أولي فقط <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-note-strip">
        <Info size={15} weight="fill" />
        <span>هذه الأداة تقدّر <strong>عمر</strong> التقاعد فقط (متى)، وليست حاسبة <strong>قيمة المعاش</strong> — لحساب مبلغ معاشك الفعلي راجع حاسبة التأمينات الاجتماعية الرسمية (GOSI) أو المنصة الوطنية my.gov.sa في بلدك.</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="retirement-country">الدولة</label>
        <PremiumSelect
          id="retirement-country"
          value={countryCode}
          onChange={setCountryCode}
          options={RETIREMENT_RULES.map((rule) => ({ value: rule.code, label: rule.country }))}
        />
      </div>
      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="retirement-sector">القطاع</label>
          <PremiumSelect
            id="retirement-sector"
            value={sector}
            onChange={setSector}
            options={[
              { value: 'government', label: 'حكومي' },
              { value: 'private', label: 'خاص' },
              { value: 'military', label: 'عسكري' },
            ]}
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="retirement-gender">الجنس</label>
          <PremiumSelect
            id="retirement-gender"
            value={gender}
            onChange={setGender}
            options={[
              { value: 'male', label: 'رجل' },
              { value: 'female', label: 'امرأة' },
            ]}
          />
        </div>
      </div>
      <div className="tool-v2-field">
        <label htmlFor="retirement-birth">تاريخ الميلاد</label>
        <input id="retirement-birth" type="date" value={birthIso} onChange={(e) => setBirthIso(e.target.value)} />
      </div>

      {result?.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">موعد التقاعد المتوقع</span>
            <div className="tool-v2-result-value" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>{result.retirementDateLabel}</div>
            <div className="tool-v2-result-meta">
              {result.isRetired ? 'وصلت إلى سن التقاعد أو تجاوزته' : (<>باقي <NumberTicker value={result.daysRemaining} className="tool-v2-ticker tool-v2-ticker--accent" style={{ fontSize: '1em' }} /> يوم</>)}
            </div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> سن التقاعد المستخدم</span><span className="tool-v2-breakdown-value">{result.retirementAge} سنة — {result.rule.country}</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">عمرك الحالي</span><span className="tool-v2-breakdown-value">{result.currentAge.ageLabel}</span></div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>{result.rule.note}</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة سن التقاعد', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Timer size={28} weight="duotone" />
          <p>أدخل تاريخ ميلادك واختر الدولة والقطاع لتقدير موعد تقاعدك.</p>
        </div>
      )}
    </div>
  );
}
