"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilePlus, Minus, Plus, Printer, Trash, UploadSimple } from '@phosphor-icons/react';
import { fmt } from '@/lib/calculators/building/constants';
import { GULF_CURRENCIES } from '@/lib/hvac/gulf-currencies';

const SUGGESTED_ITEMS = ['تصميم الحديقة', 'عشب طبيعي', 'عشب صناعي', 'ري بالتنقيط', 'إضاءة الحديقة', 'حصى وزينة حجرية', 'نباتات وأشجار', 'صيانة أولى'];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function Stepper({ value, min = 0, max = 999, onChange, label }) {
  return (
    <div className="tool-v2-stepper" role="group" aria-label={label}>
      <button type="button" className="tool-v2-stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`تقليل ${label}`}>
        <Minus size={15} weight="bold" />
      </button>
      <span className="tool-v2-stepper-val" aria-live="polite">{value}</span>
      <button type="button" className="tool-v2-stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`زيادة ${label}`}>
        <Plus size={15} weight="bold" />
      </button>
    </div>
  );
}

let rowSeq = 0;
function newRow(desc = '', qty = 1, unitPrice = 0) {
  rowSeq += 1;
  return { id: `ls-row-${rowSeq}`, desc, qty, unitPrice };
}

export default function LandscapingQuoteGenerator() {
  const searchParams = useSearchParams();

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docDate, setDocDate] = useState('');
  const [validityDays, setValidityDays] = useState(14);
  const [countryCode, setCountryCode] = useState('sa');
  const [vatEnabled, setVatEnabled] = useState(false);
  const [vatPercent, setVatPercent] = useState(15);
  const [terms, setTerms] = useState('السعر تقديري ويخضع للمعاينة الفعلية للأرض قبل التنفيذ.');
  const [items, setItems] = useState(() => [newRow('تصميم الحديقة', 1, 0)]);

  useEffect(() => {
    setDocDate(todayStr());
    setDocNumber(`LND-${Date.now().toString().slice(-6)}`);
  }, []);

  useEffect(() => {
    const amount = searchParams.get('amount');
    const service = searchParams.get('service');
    if (amount) {
      setItems([newRow(service || 'تنسيق حديقة', 1, Number(amount) || 0)]);
    }
  }, [searchParams]);

  const country = GULF_CURRENCIES.find((c) => c.code === countryCode) ?? GULF_CURRENCIES[0];

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, r) => sum + (Number(r.qty) || 0) * (Number(r.unitPrice) || 0), 0);
    const vat = vatEnabled ? subtotal * (Number(vatPercent) || 0) / 100 : 0;
    return { subtotal, vat, grand: subtotal + vat };
  }, [items, vatEnabled, vatPercent]);

  function updateItem(id, patch) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addItem(desc = '') {
    setItems((prev) => [...prev, newRow(desc, 1, 0)]);
  }
  function removeItem(id) {
    setItems((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }
  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  return (
    <div aria-label="مولّد عرض سعر تنسيق حديقة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> عرض سعر تنسيق حديقة</span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="ls-business">اسم نشاطك</label>
          <input id="ls-business" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="ls-phone">رقم التواصل / واتساب</label>
          <input id="ls-phone" type="text" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ls-logo">شعار النشاط (اختياري)</label>
        <label className="tool-v2-action-btn" htmlFor="ls-logo" style={{ cursor: 'pointer', width: 'fit-content' }}>
          <UploadSimple size={16} weight="bold" /> {logoUrl ? 'تغيير الشعار' : 'رفع شعار'}
        </label>
        <input id="ls-logo" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="ls-client">اسم العميل</label>
          <input id="ls-client" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="ls-address">عنوان المشروع / المدينة</label>
          <input id="ls-address" type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="ls-num">رقم العرض</label>
          <input id="ls-num" type="text" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="ls-date">التاريخ</label>
          <input id="ls-date" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>دولتك (للعملة)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {GULF_CURRENCIES.map((c) => (
            <button key={c.code} type="button" className={`guide-v2-checker-chip${countryCode === c.code ? ' is-active' : ''}`} aria-pressed={countryCode === c.code} onClick={() => setCountryCode(c.code)}>{c.country}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ls-validity">مدة صلاحية العرض (أيام)</label>
        <Stepper value={validityDays} onChange={setValidityDays} label="مدة الصلاحية" max={90} />
      </div>

      <div className="tool-v2-field">
        <label>بنود سريعة (اضغط لإضافتها)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="بنود مقترحة">
          {SUGGESTED_ITEMS.map((s) => (
            <button key={s} type="button" className="guide-v2-checker-chip" onClick={() => addItem(s)}>+ {s}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>بنود العرض</label>
        <div className="tool-v2-addon-list">
          {items.map((row) => (
            <div className="tool-v2-addon-row is-active" key={row.id}>
              <div className="tool-v2-field-row-pair" style={{ marginBottom: 0 }}>
                <input type="text" placeholder="وصف البند" value={row.desc} onChange={(e) => updateItem(row.id, { desc: e.target.value })} />
                <input type="number" inputMode="decimal" min="0" placeholder="السعر" className="tool-v2-addon-price" style={{ width: '100%' }} value={row.unitPrice} onChange={(e) => updateItem(row.id, { unitPrice: e.target.value })} />
              </div>
              <div className="tool-v2-addon-inputs">
                <span className="tool-v2-addon-unit">الكمية</span>
                <Stepper value={Number(row.qty) || 0} onChange={(v) => updateItem(row.id, { qty: v })} label="الكمية" />
                <span className="tool-v2-addon-unit">الإجمالي: {fmt((Number(row.qty) || 0) * (Number(row.unitPrice) || 0))} {country.short}</span>
                <button type="button" className="tool-v2-stepper-btn" onClick={() => removeItem(row.id)} aria-label="حذف البند" style={{ marginInlineStart: 'auto' }}>
                  <Trash size={15} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="tool-v2-action-btn" onClick={() => addItem('')} style={{ marginTop: 8 }}>
          <FilePlus size={16} weight="bold" /> إضافة بند فارغ
        </button>
      </div>

      <div className="tool-v2-field">
        <label className="tool-v2-addon-toggle" htmlFor="ls-vat">
          <input id="ls-vat" type="checkbox" checked={vatEnabled} onChange={(e) => setVatEnabled(e.target.checked)} />
          <span>إضافة ضريبة القيمة المضافة</span>
        </label>
        {vatEnabled ? (
          <input type="number" inputMode="decimal" min="0" max="30" className="tool-v2-addon-price" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} style={{ marginTop: 8 }} aria-label="نسبة الضريبة" />
        ) : null}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ls-terms">شروط وملاحظات</label>
        <textarea id="ls-terms" rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} />
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
            <p className="tool-v2-invoice-business">{businessName || 'اسم نشاط تنسيق الحدائق'}</p>
            {phone ? <p className="tool-v2-invoice-sub">{phone}</p> : null}
          </div>
          <div className="tool-v2-invoice-doc-meta">
            <p>عرض سعر رقم {docNumber}</p>
            <p>{docDate}</p>
          </div>
        </div>

        <div className="tool-v2-invoice-parties">
          <p><strong>العميل:</strong> {clientName || '—'}</p>
          <p><strong>عنوان المشروع:</strong> {clientAddress || '—'}</p>
        </div>

        <table className="tool-v2-invoice-table">
          <thead>
            <tr><th>الوصف</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th></tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>{row.desc || '—'}</td>
                <td>{row.qty}</td>
                <td>{fmt(Number(row.unitPrice) || 0)}</td>
                <td>{fmt((Number(row.qty) || 0) * (Number(row.unitPrice) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tool-v2-invoice-totals">
          <p>المجموع الفرعي: {fmt(totals.subtotal)} {country.short}</p>
          {vatEnabled ? <p>ضريبة القيمة المضافة ({vatPercent}%): {fmt(totals.vat)} {country.short}</p> : null}
          <p className="tool-v2-invoice-grand">الإجمالي: {fmt(totals.grand)} {country.short}</p>
        </div>
        <p className="tool-v2-invoice-terms">صالح حتى {validityDays} يوماً من تاريخ الإصدار. {terms}</p>
      </div>
    </div>
  );
}
