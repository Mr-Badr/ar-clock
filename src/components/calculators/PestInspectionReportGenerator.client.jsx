"use client";

import { useEffect, useState } from 'react';
import { ClipboardText, Printer, UploadSimple } from '@phosphor-icons/react';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const PEST_TYPES = ['صراصير', 'نمل', 'نمل أبيض', 'قوارض', 'بق فراش', 'أخرى'];
const SEVERITIES = [
  { id: 'light', label: 'خفيفة' },
  { id: 'mid', label: 'متوسطة' },
  { id: 'heavy', label: 'شديدة' },
];
const AREAS = ['المطبخ', 'الحمامات', 'غرف النوم', 'الصالة', 'المستودع', 'المحيط الخارجي'];

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function PestInspectionReportGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitNumber, setVisitNumber] = useState('الزيارة الأولى');
  const [pestTypes, setPestTypes] = useState([]);
  const [severity, setSeverity] = useState('mid');
  const [areas, setAreas] = useState([]);
  const [productUsed, setProductUsed] = useState('');
  const [recommendations, setRecommendations] = useState('يُنصح بمتابعة النتائج خلال أسبوعين وإبلاغ الفني عند ملاحظة أي نشاط متكرر.');
  const [nextVisitDate, setNextVisitDate] = useState('');

  useEffect(() => { setVisitDate(todayStr()); }, []);

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  const severityLabel = SEVERITIES.find((s) => s.id === severity)?.label;

  return (
    <div aria-label="مولّد تقرير معاينة مكافحة حشرات">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" /> تقرير معاينة/زيارة
        </span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="p-company">اسم شركة/فني المكافحة</label>
          <input id="p-company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="p-license">رقم الترخيص (اختياري)</label>
          <input id="p-license" type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="p-logo">شعار الشركة (اختياري)</label>
        <label className="tool-v2-action-btn" htmlFor="p-logo" style={{ cursor: 'pointer', width: 'fit-content' }}>
          <UploadSimple size={16} weight="bold" /> {logoUrl ? 'تغيير الشعار' : 'رفع شعار'}
        </label>
        <input id="p-logo" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="p-tech">اسم الفني</label>
          <input id="p-tech" type="text" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="p-visit-num">رقم الزيارة</label>
          <input id="p-visit-num" type="text" value={visitNumber} onChange={(e) => setVisitNumber(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="p-client">اسم العميل</label>
          <input id="p-client" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="p-address">الموقع / العنوان</label>
          <input id="p-address" type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="p-date">تاريخ الزيارة</label>
        <input id="p-date" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>نوع الآفة المكتشفة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نوع الآفة">
          {PEST_TYPES.map((p) => (
            <button key={p} type="button" className={`guide-v2-checker-chip${pestTypes.includes(p) ? ' is-active' : ''}`} aria-pressed={pestTypes.includes(p)} onClick={() => setPestTypes((prev) => toggle(prev, p))}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>درجة الإصابة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="درجة الإصابة">
          {SEVERITIES.map((s) => (
            <button key={s.id} type="button" className={`guide-v2-checker-chip${severity === s.id ? ' is-active' : ''}`} aria-pressed={severity === s.id} onClick={() => setSeverity(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>المناطق المتضررة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="المناطق المتضررة">
          {AREAS.map((a) => (
            <button key={a} type="button" className={`guide-v2-checker-chip${areas.includes(a) ? ' is-active' : ''}`} aria-pressed={areas.includes(a)} onClick={() => setAreas((prev) => toggle(prev, a))}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="p-product">المبيد والكمية المستخدمة</label>
        <input id="p-product" type="text" placeholder="مثال: مبيد X — 200 مل محلول" value={productUsed} onChange={(e) => setProductUsed(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="p-reco">التوصيات</label>
        <textarea id="p-reco" rows={3} value={recommendations} onChange={(e) => setRecommendations(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="p-next">موعد الزيارة القادمة (اختياري)</label>
        <input id="p-next" type="date" value={nextVisitDate} onChange={(e) => setNextVisitDate(e.target.value)} />
      </div>

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn is-primary" onClick={() => window.print()}>
          <Printer size={18} weight="bold" /> طباعة / تحميل PDF
        </button>
      </div>

      <div className="tool-v2-invoice-print" aria-hidden="true">
        <div className="tool-v2-invoice-head">
          {logoUrl ? <img src={logoUrl} alt="" className="tool-v2-invoice-logo" /> : null}
          <div>
            <p className="tool-v2-invoice-business">{companyName || 'اسم شركة المكافحة'}</p>
            {licenseNumber ? <p className="tool-v2-invoice-sub">رقم الترخيص: {licenseNumber}</p> : null}
          </div>
          <div className="tool-v2-invoice-doc-meta">
            <p><ClipboardText size={14} weight="bold" style={{ verticalAlign: 'middle' }} /> تقرير معاينة</p>
            <p>{visitDate}</p>
          </div>
        </div>

        <div className="tool-v2-invoice-parties">
          <p><strong>العميل:</strong> {clientName || '—'}</p>
          <p><strong>الموقع:</strong> {clientAddress || '—'}</p>
          <p><strong>الفني:</strong> {technicianName || '—'} — {visitNumber}</p>
        </div>

        <div className="tool-v2-invoice-contract">
          <p><strong>نوع الآفة المكتشفة:</strong> {pestTypes.length ? pestTypes.join('، ') : '—'}</p>
          <p><strong>درجة الإصابة:</strong> {severityLabel}</p>
          <p><strong>المناطق المتضررة:</strong> {areas.length ? areas.join('، ') : '—'}</p>
          <p><strong>المبيد والكمية المستخدمة:</strong> {productUsed || '—'}</p>
          <p><strong>التوصيات:</strong> {recommendations}</p>
          {nextVisitDate ? <p><strong>موعد الزيارة القادمة:</strong> {nextVisitDate}</p> : null}
          <div className="tool-v2-invoice-signatures">
            <div><p>توقيع الفني</p><span /></div>
            <div><p>توقيع العميل</p><span /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
