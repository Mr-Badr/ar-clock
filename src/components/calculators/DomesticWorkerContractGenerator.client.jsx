"use client";

import { useEffect, useState } from 'react';
import { Info, Printer, Warning } from '@phosphor-icons/react';
import CountryFlag from '@/components/shared/CountryFlag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CONTRACT_COUNTRIES, WORK_TYPES } from '@/lib/calculators/domestic-worker-contract-engine';

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const EXTRA_FIELD_LABELS = {
  nationalAddress: { label: 'العنوان الوطني لصاحب العمل', placeholder: 'مثال: 1234 حي النرجس، الرياض 12345' },
  nextOfKin: { label: 'بيانات شخص قريب (اسم ورقم تواصل)', placeholder: '' },
  overtimeRate: { label: 'معدل بدل الساعة الإضافية', placeholder: '' },
  recruitmentOfficeName: { label: 'اسم مكتب الاستقدام (الطرف الثالث)', placeholder: '' },
};

export default function DomesticWorkerContractGenerator() {
  const [countryCode, setCountryCode] = useState('sa');
  const country = CONTRACT_COUNTRIES[countryCode];

  const [employerName, setEmployerName] = useState('');
  const [employerNationality, setEmployerNationality] = useState('');
  const [employerContact, setEmployerContact] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeNationality, setEmployeeNationality] = useState('');
  const [workType, setWorkType] = useState(WORK_TYPES[0]);
  const [workLocation, setWorkLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [contractYears, setContractYears] = useState('1');
  const [probationDays, setProbationDays] = useState(String(country.probationDaysDefault));
  const [monthlySalary, setMonthlySalary] = useState('');
  const [extraValues, setExtraValues] = useState({});
  const [notes, setNotes] = useState('');
  const [issueDate, setIssueDate] = useState('');

  useEffect(() => {
    const today = todayStr();
    setStartDate(today);
    setIssueDate(today);
  }, []);
  useEffect(() => { setProbationDays(String(CONTRACT_COUNTRIES[countryCode].probationDaysDefault)); }, [countryCode]);

  function updateExtra(key, value) {
    setExtraValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div aria-label="مولّد عقد عمل عاملة منزلية أو سائق خاص">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><CountryFlag code={countryCode} /> {country.label} <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>اختر دولتك</label>
        <div className="guide-v2-checker-options" role="group" aria-label="اختر دولتك">
          {Object.entries(CONTRACT_COUNTRIES).map(([code, c]) => (
            <button key={code} type="button" className={`guide-v2-checker-chip${countryCode === code ? ' is-active' : ''}`} aria-pressed={countryCode === code} onClick={() => setCountryCode(code)}>
              <CountryFlag code={code} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-v2-note-strip">
        <Warning size={14} weight="fill" />
        <span>{country.disclaimer}</span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="dwc-employer-name">اسم صاحب العمل</label>
          <input id="dwc-employer-name" type="text" value={employerName} onChange={(e) => setEmployerName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="dwc-employer-nat">جنسية صاحب العمل</label>
          <input id="dwc-employer-nat" type="text" value={employerNationality} onChange={(e) => setEmployerNationality(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwc-employer-contact">رقم تواصل صاحب العمل</label>
        <input id="dwc-employer-contact" type="text" inputMode="tel" value={employerContact} onChange={(e) => setEmployerContact(e.target.value)} />
      </div>

      {country.extraFields.map((key) => (
        <div className="tool-v2-field" key={key}>
          <label htmlFor={`dwc-extra-${key}`}>{EXTRA_FIELD_LABELS[key].label}</label>
          <input id={`dwc-extra-${key}`} type="text" placeholder={EXTRA_FIELD_LABELS[key].placeholder} value={extraValues[key] || ''} onChange={(e) => updateExtra(key, e.target.value)} />
        </div>
      ))}

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="dwc-employee-name">اسم العامل/ة</label>
          <input id="dwc-employee-name" type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="dwc-employee-nat">جنسية العامل/ة</label>
          <input id="dwc-employee-nat" type="text" value={employeeNationality} onChange={(e) => setEmployeeNationality(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع العمل</label>
        <select value={workType} onChange={(e) => setWorkType(e.target.value)}>
          {WORK_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwc-location">مكان العمل (العنوان)</label>
        <input id="dwc-location" type="text" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} />
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="dwc-start">تاريخ بدء العمل</label>
          <input id="dwc-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="dwc-years">مدة العقد (سنوات)</label>
          <input id="dwc-years" type="number" inputMode="numeric" min="1" max="5" value={contractYears} onChange={(e) => setContractYears(e.target.value)} />
        </div>
      </div>

      {country.probationMax > 0 ? (
        <div className="tool-v2-field">
          <label htmlFor="dwc-probation">
            مدة التجربة (أيام)
            <FieldHint text={`الحد الأقصى القانوني ${country.probationMax} يوماً في ${country.label}.`} />
          </label>
          <input id="dwc-probation" type="number" inputMode="numeric" min="0" max={country.probationMax} value={probationDays} onChange={(e) => setProbationDays(e.target.value)} />
        </div>
      ) : null}

      <div className="tool-v2-field">
        <label htmlFor="dwc-salary">الأجر الشهري</label>
        <input id="dwc-salary" type="number" inputMode="decimal" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="dwc-notes">ملاحظات أو شروط إضافية</label>
        <textarea id="dwc-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="tool-v2-action-row">
        <button type="button" className="tool-v2-action-btn is-primary" onClick={() => window.print()}>
          <Printer size={18} weight="bold" /> طباعة / تحميل PDF
        </button>
      </div>

      <div className="tool-v2-invoice-print" aria-hidden="true">
        <div className="tool-v2-invoice-head">
          <div>
            <p className="tool-v2-invoice-business">عقد عمل — {workType || '—'}</p>
            <p className="tool-v2-invoice-sub">{country.label} — مستوى التوثيق: {country.confidence}</p>
          </div>
          <div className="tool-v2-invoice-doc-meta">
            <p>تاريخ الإصدار: {issueDate}</p>
          </div>
        </div>

        <p className="tool-v2-invoice-terms" style={{ marginBottom: 16 }}>{country.disclaimer}</p>

        <div className="tool-v2-invoice-parties">
          <p><strong>صاحب العمل:</strong> {employerName || '—'} — الجنسية: {employerNationality || '—'} — التواصل: {employerContact || '—'}</p>
          {country.extraFields.map((key) => (
            extraValues[key] ? <p key={key}><strong>{EXTRA_FIELD_LABELS[key].label}:</strong> {extraValues[key]}</p> : null
          ))}
          <p><strong>العامل/ة:</strong> {employeeName || '—'} — الجنسية: {employeeNationality || '—'}</p>
        </div>

        <table className="tool-v2-invoice-table">
          <tbody>
            <tr><td>نوع العمل</td><td>{workType}</td></tr>
            <tr><td>مكان العمل</td><td>{workLocation || '—'}</td></tr>
            <tr><td>تاريخ بدء العمل</td><td>{startDate}</td></tr>
            <tr><td>مدة العقد</td><td>{contractYears} سنة</td></tr>
            {country.probationMax > 0 ? <tr><td>مدة التجربة</td><td>{probationDays} يوماً</td></tr> : null}
            <tr><td>الأجر الشهري</td><td>{monthlySalary || '—'}</td></tr>
          </tbody>
        </table>

        <div className="tool-v2-invoice-contract">
          <p><strong>بنود قانونية معيارية ({country.label}):</strong></p>
          <ul style={{ listStyle: 'disc', paddingInlineStart: '1.2rem' }}>
            {country.standardClauses.map((clause) => (<li key={clause}>{clause}</li>))}
          </ul>
          {notes ? <p><strong>ملاحظات إضافية:</strong> {notes}</p> : null}
          <p className="tool-v2-invoice-terms">المصدر: {country.sourceLabel}</p>
          <div className="tool-v2-invoice-signatures">
            <div><p>توقيع صاحب العمل</p><span /></div>
            <div><p>توقيع العامل/ة</p><span /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
