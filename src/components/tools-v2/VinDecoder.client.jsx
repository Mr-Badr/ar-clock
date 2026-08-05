"use client";

import { useMemo, useState } from 'react';
import { CheckCircle, MagnifyingGlass, WarningCircle } from '@phosphor-icons/react';

import { decodeVinStructure } from '@/lib/tools/vin-decode';

const FIELD_LABELS = {
  Make: 'الشركة المصنّعة',
  Model: 'الموديل',
  ModelYear: 'سنة الصنع',
  BodyClass: 'نوع الهيكل',
  VehicleType: 'فئة المركبة',
  EngineCylinders: 'عدد أسطوانات المحرك',
  DisplacementL: 'سعة المحرك (لتر)',
  FuelTypePrimary: 'نوع الوقود',
  DriveType: 'نظام الدفع',
  PlantCountry: 'بلد التصنيع الفعلي',
  PlantCity: 'مدينة المصنع',
};

export default function VinDecoder() {
  const [input, setInput] = useState('');
  const [submittedVin, setSubmittedVin] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [liveError, setLiveError] = useState('');
  const [loading, setLoading] = useState(false);

  const structure = useMemo(() => {
    if (!submittedVin) return null;
    return decodeVinStructure(submittedVin);
  }, [submittedVin]);

  const liveFields = liveData?.fields
    ? Object.entries(liveData.fields).filter(([key, value]) => FIELD_LABELS[key] && value)
    : [];

  async function handleSubmit(e) {
    e.preventDefault();
    const vin = input.trim().toUpperCase();
    if (vin.length !== 17) return;

    setSubmittedVin(vin);
    setLiveData(null);
    setLiveError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/vin-decode?vin=${encodeURIComponent(vin)}`);
      const data = await res.json();
      if (data.ok) {
        setLiveData(data);
      } else {
        setLiveError(data.error || 'تعذر جلب بيانات إضافية لهذه السيارة الآن.');
      }
    } catch {
      setLiveError('تعذر الاتصال بقاعدة البيانات الآن — التحليل العام أدناه لا يزال يعمل.');
    } finally {
      setLoading(false);
    }
  }

  const inputIsValidLength = input.trim().length === 17;

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><MagnifyingGlass size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">افحص رقم الشاصي (VIN)</p>
          <p className="guide-v2-checker-sub">17 حرفاً ورقماً، عادة على زجاج الباب الأمامي أو رخصة السيارة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-4)' }}>
        <div className="tool-v2-field" style={{ marginBottom: 'var(--space-3)' }}>
          <label htmlFor="vin-input">رقم الشاصي (VIN)</label>
          <input
            id="vin-input"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            maxLength={17}
            placeholder="مثال: 1HGCM82633A004352"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            style={{ fontFamily: 'monospace', letterSpacing: '0.05em', direction: 'ltr', textAlign: 'center' }}
          />
          <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-2)', marginBottom: 0 }}>
            {input.length}/17 {inputIsValidLength ? '✓' : ''}
          </p>
        </div>
        <button type="submit" className="guide-v2-checker-chip is-active" disabled={!inputIsValidLength || loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'جارِ الفحص...' : 'افحص الرقم'}
        </button>
      </form>

      {structure ? (
        structure.valid ? (
          <>
            <div className="guide-v2-checker-result is-good" aria-live="polite">
              <p className="guide-v2-checker-result-label">نتيجة التحليل العام (تصح لأي سيارة في العالم)</p>
              <div className="tool-v2-result-stat-row" style={{ marginTop: 'var(--space-2)' }}>
                <div className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-label">بلد/منطقة الصنع (تقريبي)</span>
                  <span className="tool-v2-result-stat-value" style={{ fontSize: '1rem' }}>{structure.region || 'غير معروف'}</span>
                </div>
                <div className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-label">سنة الصنع (تقديرية)</span>
                  <span className="tool-v2-result-stat-value">{structure.modelYear ?? '—'}</span>
                </div>
              </div>
              <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                {structure.checkDigitOk === true ? (
                  <><CheckCircle size={16} weight="bold" style={{ color: 'var(--green-text)', flexShrink: 0 }} /> رقم التحقق مطابق لمعيار أمريكا الشمالية — يرجّح أنه رقم شاصي صحيح.</>
                ) : structure.checkDigitOk === false ? (
                  <><WarningCircle size={16} weight="bold" style={{ color: 'var(--amber-text)', flexShrink: 0 }} /> رقم التحقق لا يطابق معيار أمريكا الشمالية — طبيعي تماماً لسيارة مستوردة مباشرة من اليابان أو كوريا أو أوروبا (لا يعني بالضرورة أن الرقم خاطئ).</>
                ) : null}
              </p>
            </div>

            {loading ? null : liveFields.length > 0 ? (
              <div className="guide-v2-checker-result is-good" style={{ marginTop: 'var(--space-3)' }} aria-live="polite">
                <p className="guide-v2-checker-result-label">بيانات إضافية من قاعدة NHTSA الأمريكية</p>
                <div className="guide-v2-type-grid" style={{ marginTop: 'var(--space-2)' }}>
                  {liveFields.map(([key, value]) => (
                    <div key={key} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-2)' }}>{FIELD_LABELS[key]}</p>
                      <p style={{ margin: 0, fontWeight: 700 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : liveError ? (
              <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                {liveError} هذا متوقّع لسيارة لم تُسجَّل أو تُباع أصلاً في السوق الأمريكي (استيراد مباشر من اليابان أو كوريا أو أوروبا أو الخليج).
              </p>
            ) : null}
          </>
        ) : (
          <div className="guide-v2-checker-result is-bad" aria-live="polite">
            <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>{structure.reason}</p>
          </div>
        )
      ) : (
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>أدخل رقم الشاصي كاملاً (17 خانة) واضغط "افحص الرقم".</p>
        </div>
      )}
    </div>
  );
}
