"use client";

import { useMemo, useState } from 'react';
import { GraduationCap, Plus, ShareNetwork, Trash } from '@phosphor-icons/react';
import { toast } from 'sonner';

import {
  calculateGpa,
  calculateCumulativeGpa,
  getGpaClassification,
  requiredGradeForTarget,
  GPA_SYSTEMS,
} from '@/lib/calculators/gpa';

const SYSTEM_IDS = ['scale5', 'scale4', 'scale100', 'scale20', 'scale10'];
const TABS = [
  { id: 'semester', label: 'معدل الفصل' },
  { id: 'cumulative', label: 'التراكمي' },
  { id: 'plan', label: 'خطة رفع المعدل' },
];

let _nextId = 1;
function uid() {
  return _nextId++;
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function GpaCalculator() {
  const [systemId, setSystemId] = useState('scale5');
  const [subjects, setSubjects] = useState([
    { id: uid(), name: 'المادة 1', grade: '', hours: 3 },
    { id: uid(), name: 'المادة 2', grade: '', hours: 3 },
    { id: uid(), name: 'المادة 3', grade: '', hours: 2 },
  ]);
  const [tab, setTab] = useState('semester');
  const [priorGpa, setPriorGpa] = useState('');
  const [priorHours, setPriorHours] = useState('');
  const [targetGpa, setTargetGpa] = useState('');
  const [plannedHours, setPlannedHours] = useState('12');

  const system = GPA_SYSTEMS[systemId];

  const semResult = useMemo(() => calculateGpa(subjects, systemId), [subjects, systemId]);
  const classification = useMemo(
    () => (semResult.isValid ? getGpaClassification(semResult.gpa, systemId) : null),
    [semResult, systemId],
  );

  const cumulativeGpa = useMemo(() => {
    if (!semResult.isValid || !priorGpa || !priorHours) return null;
    return calculateCumulativeGpa(
      { currentGpa: parseFloat(priorGpa), completedHours: parseInt(priorHours, 10) },
      { semesterGpa: semResult.gpa, semesterHours: semResult.totalHours },
    );
  }, [semResult, priorGpa, priorHours]);

  const cumulativeClass = useMemo(
    () => (cumulativeGpa != null ? getGpaClassification(cumulativeGpa, systemId) : null),
    [cumulativeGpa, systemId],
  );

  const planResult = useMemo(() => {
    if (!priorGpa || !priorHours || !targetGpa || !plannedHours) return null;
    return requiredGradeForTarget(
      { currentGpa: parseFloat(priorGpa), completedHours: parseInt(priorHours, 10) },
      { targetGpa: parseFloat(targetGpa), plannedHours: parseInt(plannedHours, 10) },
    );
  }, [priorGpa, priorHours, targetGpa, plannedHours]);

  function updateSubject(id, field, value) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }
  function addSubject() {
    setSubjects((prev) => [...prev, { id: uid(), name: `المادة ${prev.length + 1}`, grade: '', hours: 3 }]);
  }
  function removeSubject(id) {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }

  const shareText = semResult.isValid
    ? `معدل الفصل GPA: ${semResult.gpa} من ${system.max}\nالتصنيف: ${classification?.label ?? ''}\n${cumulativeGpa != null ? `المعدل التراكمي: ${cumulativeGpa} من ${system.max}` : ''}`
    : '';

  return (
    <div aria-label="حاسبة المعدل التراكمي GPA">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><GraduationCap size={14} weight="bold" /> المعدل GPA <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label>نظام المعدل</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="نظام المعدل">
          {SYSTEM_IDS.map((sid) => (
            <button key={sid} type="button" className={`tool-v2-chip${systemId === sid ? ' is-active' : ''}`} onClick={() => setSystemId(sid)}>{GPA_SYSTEMS[sid].label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع الحساب</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="نوع الحساب">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`tool-v2-chip${tab === t.id ? ' is-active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>مواد الفصل</label>
        <div className="tool-v2-rebar-rows">
          {subjects.map((s, idx) => (
            <div key={s.id} className="tool-v2-rebar-row--3col">
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`gpa-name-${s.id}`}>المادة</label>
                <input id={`gpa-name-${s.id}`} value={s.name} placeholder={`مادة ${idx + 1}`} onChange={(e) => updateSubject(s.id, 'name', e.target.value)} />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`gpa-grade-${s.id}`}>الدرجة / {system.max}</label>
                <input id={`gpa-grade-${s.id}`} type="number" inputMode="decimal" min="0" max={system.max} step={systemId === 'scale100' ? '1' : '0.25'} value={s.grade} placeholder={`0–${system.max}`} onChange={(e) => updateSubject(s.id, 'grade', e.target.value)} />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`gpa-hours-${s.id}`}>ساعات</label>
                <input id={`gpa-hours-${s.id}`} type="number" inputMode="numeric" min="1" max="6" value={s.hours} placeholder="3" onChange={(e) => updateSubject(s.id, 'hours', e.target.value)} />
              </div>
              <button type="button" className="tool-v2-rebar-row-remove" onClick={() => removeSubject(s.id)} disabled={subjects.length <= 1} aria-label="احذف المادة">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="tool-v2-add-row-btn" onClick={addSubject}>
          <Plus size={16} weight="bold" /> أضف مادة
        </button>
      </div>

      {(tab === 'cumulative' || tab === 'plan') && (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="gpa-prior">المعدل التراكمي الحالي</label>
            <input id="gpa-prior" type="number" inputMode="decimal" min="0" max={system.max} step="0.01" value={priorGpa} placeholder={`0–${system.max}`} onChange={(e) => setPriorGpa(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="gpa-prior-hours">ساعات مجتازة</label>
            <input id="gpa-prior-hours" type="number" inputMode="numeric" min="0" value={priorHours} placeholder="80" onChange={(e) => setPriorHours(e.target.value)} />
          </div>
        </div>
      )}

      {tab === 'plan' && (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="gpa-target">المعدل المستهدف</label>
            <input id="gpa-target" type="number" inputMode="decimal" min="0" max={system.max} step="0.01" value={targetGpa} placeholder={`${system.max}`} onChange={(e) => setTargetGpa(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="gpa-planned-hours">ساعات الفصل القادم</label>
            <input id="gpa-planned-hours" type="number" inputMode="numeric" min="1" value={plannedHours} placeholder="12" onChange={(e) => setPlannedHours(e.target.value)} />
          </div>
        </div>
      )}

      {semResult.isValid ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">معدل الفصل GPA</span>
            <div className="tool-v2-result-value">{semResult.gpa.toFixed(2)} / {system.max}</div>
            {classification ? <div className="tool-v2-result-meta">{classification.label} · {classification.labelEn}</div> : null}
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">إجمالي الساعات المعتمدة</span><span className="tool-v2-breakdown-value">{semResult.totalHours} ساعة</span></div>
            <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">المواد المحسوبة</span><span className="tool-v2-breakdown-value">{subjects.filter((s) => s.grade !== '' && !isNaN(parseFloat(s.grade))).length} مادة</span></div>

            {tab === 'cumulative' && cumulativeGpa != null && (
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">المعدل التراكمي (CGPA)</span>
                <span className="tool-v2-breakdown-value">{cumulativeGpa.toFixed(2)} / {system.max}{cumulativeClass ? ` · ${cumulativeClass.label}` : ''}</span>
              </div>
            )}

            {tab === 'plan' && planResult && (
              <div className="tool-v2-breakdown-row">
                <span className="tool-v2-breakdown-label">الدرجة المطلوبة في الفصل القادم</span>
                <span className="tool-v2-breakdown-value">
                  {planResult.required <= 0
                    ? 'تحقق المعدل بالفعل!'
                    : planResult.required > system.max
                      ? `غير ممكن (${planResult.required.toFixed(2)} > ${system.max})`
                      : `${planResult.required.toFixed(2)} / ${system.max}`}
                </span>
              </div>
            )}
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('معدلي التراكمي GPA', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <GraduationCap size={28} weight="duotone" />
          <p>أدخل درجات مواد الفصل لحساب معدلك.</p>
        </div>
      )}
    </div>
  );
}
