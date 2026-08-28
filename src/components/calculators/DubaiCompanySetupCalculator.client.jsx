"use client";

import { useMemo, useState } from 'react';
import { Buildings, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';

import CountryFlag from '@/components/shared/CountryFlag';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import {
  ACTIVITY_TYPES,
  JURISDICTION_TYPES,
  OFFICE_TYPES,
  VISA_COUNTS,
  estimateDubaiCompanySetup,
} from '@/lib/calculators/dubai-company-setup';

function fmt(n) {
  return Math.round(n).toLocaleString('ar-AE-u-nu-latn');
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function DubaiCompanySetupCalculator() {
  const [jurisdiction, setJurisdiction] = useState('mainland');
  const [activity, setActivity] = useState('services');
  const [visaCount, setVisaCount] = useState('1');
  const [officeType, setOfficeType] = useState('flexi');
  const [foreignName, setForeignName] = useState(false);

  const result = useMemo(
    () => estimateDubaiCompanySetup({ jurisdiction, activity, visaCount, officeType, foreignName }),
    [jurisdiction, activity, visaCount, officeType, foreignName],
  );

  const shareText = result.isValid
    ? `تكلفة تأسيس شركة دبي (تقديري):\n${jurisdiction === 'mainland' ? 'براً' : 'منطقة حرة'} — نشاط: ${ACTIVITY_TYPES.find((a) => a.value === activity)?.label ?? ''}\nالإجمالي: ${fmt(result.totalMin)} – ${fmt(result.totalMax)} د.إ`
    : '';

  return (
    <div aria-label="حاسبة تكلفة تأسيس شركة في دبي">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code="ae" /> دبي <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>نوع الجهة</label>
        <div className="tool-v2-choice-list">
          {JURISDICTION_TYPES.map((j) => {
            const active = jurisdiction === j.value;
            return (
              <label key={j.value} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`dubai-jur-${j.value}`}>
                <input type="radio" id={`dubai-jur-${j.value}`} name="dubai-jurisdiction" checked={active} onChange={() => setJurisdiction(j.value)} />
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{j.label}</span>
                  <span className="tool-v2-choice-desc">{j.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dubai-activity">نوع النشاط</label>
        <PremiumSelect
          id="dubai-activity"
          value={activity}
          onChange={setActivity}
          options={ACTIVITY_TYPES.map((a) => ({ value: a.value, label: a.label }))}
        />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="dubai-office">نوع المكتب</label>
          <PremiumSelect
            id="dubai-office"
            value={officeType}
            onChange={setOfficeType}
            options={OFFICE_TYPES.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="dubai-visas">عدد تأشيرات الإقامة</label>
          <PremiumSelect
            id="dubai-visas"
            value={visaCount}
            onChange={setVisaCount}
            options={VISA_COUNTS.map((v) => ({ value: v.value, label: v.label }))}
          />
        </div>
      </div>
      <p className="tool-v2-option-hint">كل تأشيرة تشمل: إذن دخول + فحص طبي + بطاقة هوية إماراتية + بطاقة عمل.</p>

      <div className="tool-v2-field">
        <label>الاسم التجاري</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="الاسم التجاري">
          <button type="button" className={`tool-v2-chip${!foreignName ? ' is-active' : ''}`} onClick={() => setForeignName(false)}>عربي / محلي</button>
          <button type="button" className={`tool-v2-chip${foreignName ? ' is-active' : ''}`} onClick={() => setForeignName(true)}>أجنبي / إنجليزي</button>
        </div>
      </div>

      {result.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">{jurisdiction === 'mainland' ? 'براً (Mainland)' : 'منطقة حرة'} — التكلفة التأسيسية</span>
            <div className="tool-v2-result-value tool-v2-result-value--range">
              <span className="tool-v2-result-range-part">{fmt(result.totalMin)} د.إ</span>
              <span className="tool-v2-result-range-sep" aria-hidden="true">–</span>
              <span className="tool-v2-result-range-part">{fmt(result.totalMax)} د.إ</span>
            </div>
            <div className="tool-v2-result-meta">~ {fmt(result.totalMin / 3.67)}–{fmt(result.totalMax / 3.67)} دولار</div>
          </div>

          <div className="tool-v2-breakdown-list">
            {result.items.map((item) => (
              <div key={item.label} className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">{item.label}{item.note ? ` (${item.note})` : ''}</span>
                <span className="tool-v2-breakdown-value">{item.min === item.max ? `${fmt(item.min)} د.إ` : `${fmt(item.min)}–${fmt(item.max)} د.إ`}</span>
              </div>
            ))}
          </div>

          <div className="tool-v2-note-strip">
            <Warning size={15} weight="fill" />
            <span>تقدير استرشادي محايد — تحقق من الرسوم الرسمية في DED أو موقع المنطقة الحرة المختارة.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة تأسيس شركة دبي', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Buildings size={28} weight="duotone" />
          <p>اختر بيانات الشركة للحصول على تقدير التكلفة.</p>
        </div>
      )}
    </div>
  );
}
