"use client";

import { useMemo, useState } from 'react';
import { GraduationCap, Plus, Trash } from '@phosphor-icons/react';

import { Label } from '@/components/ui/label';
import ResultActions from '@/components/calculators/ResultActions.client';
import {
  calculateGpa,
  calculateCumulativeGpa,
  getGpaClassification,
  requiredGradeForTarget,
  GPA_SYSTEMS,
} from '@/lib/calculators/gpa';

const SYSTEM_IDS = ['scale5', 'scale4', 'scale100', 'scale20', 'scale10'];

function emptySubject(id) {
  return { id, name: '', grade: '', hours: 3 };
}

let _nextId = 1;

function uid() {
  return _nextId++;
}

export default function GpaCalculator() {
  const [systemId, setSystemId] = useState('scale5');
  const [subjects, setSubjects] = useState([
    { id: uid(), name: 'المادة 1', grade: '', hours: 3 },
    { id: uid(), name: 'المادة 2', grade: '', hours: 3 },
    { id: uid(), name: 'المادة 3', grade: '', hours: 2 },
  ]);
  const [tab, setTab] = useState('semester'); // 'semester' | 'cumulative' | 'plan'
  const [priorGpa, setPriorGpa] = useState('');
  const [priorHours, setPriorHours] = useState('');
  const [targetGpa, setTargetGpa] = useState('');
  const [plannedHours, setPlannedHours] = useState('12');

  const system = GPA_SYSTEMS[systemId];

  const semResult = useMemo(
    () => calculateGpa(subjects, systemId),
    [subjects, systemId],
  );

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
    <div className="calc-app gpa-tool" aria-label="حاسبة المعدل التراكمي GPA">

      {/* System selector */}
      <div className="gpa-system-row">
        {SYSTEM_IDS.map((sid) => (
          <button
            key={sid}
            type="button"
            className={`chip calc-chip-button${systemId === sid ? ' is-active' : ''}`}
            onClick={() => setSystemId(sid)}
          >
            {GPA_SYSTEMS[sid].label}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div className="gpa-tab-row">
        {[
          { id: 'semester',   label: 'معدل الفصل' },
          { id: 'cumulative', label: 'التراكمي' },
          { id: 'plan',       label: 'خطة رفع المعدل' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`gpa-tab${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="calc-esb-layout">

        {/* ── LEFT: Subject table ─────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>مواد الفصل</Label>
                </div>

                {/* Subject rows */}
                <div className="gpa-subjects-list">
                  {/* Header */}
                  <div className="gpa-subject-row gpa-subject-header">
                    <span className="gpa-col-name">المادة</span>
                    <span className="gpa-col-grade">الدرجة / من {system.max}</span>
                    <span className="gpa-col-hours">ساعات</span>
                    <span className="gpa-col-del" />
                  </div>

                  {subjects.map((s) => (
                    <div key={s.id} className="gpa-subject-row">
                      <input
                        type="text"
                        className="gpa-input gpa-col-name"
                        value={s.name}
                        placeholder="اسم المادة"
                        onChange={(e) => updateSubject(s.id, 'name', e.target.value)}
                        dir="rtl"
                      />
                      <input
                        type="number"
                        inputMode="decimal"
                        className="gpa-input gpa-col-grade"
                        value={s.grade}
                        placeholder={`0–${system.max}`}
                        min="0"
                        max={system.max}
                        step={systemId === 'scale100' ? '1' : '0.25'}
                        onChange={(e) => updateSubject(s.id, 'grade', e.target.value)}
                        dir="ltr"
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        className="gpa-input gpa-col-hours"
                        value={s.hours}
                        placeholder="3"
                        min="1"
                        max="6"
                        onChange={(e) => updateSubject(s.id, 'hours', e.target.value)}
                        dir="ltr"
                      />
                      <button
                        type="button"
                        className="gpa-del-btn gpa-col-del"
                        onClick={() => removeSubject(s.id)}
                        disabled={subjects.length <= 1}
                        aria-label="احذف المادة"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button type="button" className="gpa-add-btn" onClick={addSubject}>
                  <Plus size={14} weight="bold" />
                  أضف مادة
                </button>
              </div>

              {/* Cumulative / plan inputs */}
              {(tab === 'cumulative' || tab === 'plan') && (
                <div className="calc-esb-field calc-esb-field--sep">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">2</span>
                    <Label>المعدل التراكمي السابق</Label>
                  </div>
                  <div className="gpa-prior-row">
                    <div>
                      <Label htmlFor="gpa-prior" className="calc-hint">المعدل الحالي</Label>
                      <input
                        id="gpa-prior"
                        type="number"
                        inputMode="decimal"
                        className="gpa-input gpa-input--sm"
                        value={priorGpa}
                        placeholder={`0–${system.max}`}
                        min="0"
                        max={system.max}
                        step="0.01"
                        onChange={(e) => setPriorGpa(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa-prior-hours" className="calc-hint">ساعات مجتازة</Label>
                      <input
                        id="gpa-prior-hours"
                        type="number"
                        inputMode="numeric"
                        className="gpa-input gpa-input--sm"
                        value={priorHours}
                        placeholder="80"
                        min="0"
                        onChange={(e) => setPriorHours(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {tab === 'plan' && (
                <div className="calc-esb-field">
                  <div className="calc-esb-field-label">
                    <span className="calc-esb-step">3</span>
                    <Label>هدف المعدل والساعات القادمة</Label>
                  </div>
                  <div className="gpa-prior-row">
                    <div>
                      <Label htmlFor="gpa-target" className="calc-hint">المعدل المستهدف</Label>
                      <input
                        id="gpa-target"
                        type="number"
                        inputMode="decimal"
                        className="gpa-input gpa-input--sm"
                        value={targetGpa}
                        placeholder={`${system.max}`}
                        min="0"
                        max={system.max}
                        step="0.01"
                        onChange={(e) => setTargetGpa(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa-planned-hours" className="calc-hint">ساعات الفصل القادم</Label>
                      <input
                        id="gpa-planned-hours"
                        type="number"
                        inputMode="numeric"
                        className="gpa-input gpa-input--sm"
                        value={plannedHours}
                        placeholder="12"
                        min="1"
                        onChange={(e) => setPlannedHours(e.target.value)}
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── RIGHT: Result ───────────────────────── */}
        <div className="calc-esb-result-col">

          {!semResult.isValid && (
            <div className="calc-esb-empty-state">
              <GraduationCap size={36} weight="duotone" />
              <p>أدخل درجات مواد الفصل لحساب معدلك.</p>
            </div>
          )}

          {semResult.isValid && (
            <div className="calc-result-hero-panel --blue gpa-result" aria-live="polite">

              {/* Semester GPA */}
              <div className="text-center">
                <span className="calc-result-hero-label">معدل الفصل GPA</span>
                <div
                  className="calc-result-hero-value"
                  style={{ color: classification?.color ?? 'var(--blue)', fontSize: '2.5rem' }}
                >
                  {semResult.gpa.toFixed(2)}
                  <span className="gpa-result-max">/ {system.max}</span>
                </div>
                {classification && (
                  <span
                    className="bmi-category-badge"
                    style={{
                      background: `${classification.color}20`,
                      color: classification.color,
                      border: `1px solid ${classification.color}40`,
                    }}
                  >
                    {classification.label} · {classification.labelEn}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow">
                  <span>إجمالي الساعات المعتمدة</span>
                  <strong>{semResult.totalHours} ساعة</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>المواد المحسوبة</span>
                  <strong>{subjects.filter((s) => s.grade !== '' && !isNaN(parseFloat(s.grade))).length} مادة</strong>
                </div>

                {/* Cumulative GPA (if prior entered) */}
                {tab === 'cumulative' && cumulativeGpa != null && (
                  <div className="calc-esb-brow calc-esb-brow--total">
                    <span>المعدل التراكمي (CGPA)</span>
                    <strong style={{ color: cumulativeClass?.color }}>
                      {cumulativeGpa.toFixed(2)} / {system.max}
                      {cumulativeClass ? ` · ${cumulativeClass.label}` : ''}
                    </strong>
                  </div>
                )}

                {/* Plan result */}
                {tab === 'plan' && planResult && (
                  <div
                    className={`calc-esb-brow calc-esb-brow--total ${planResult.isAchievable && planResult.required <= system.max ? 'calc-esb-brow--success' : 'calc-esb-brow--error'}`}
                  >
                    <span>الدرجة المطلوبة في الفصل القادم</span>
                    <strong>
                      {planResult.required <= 0
                        ? 'تحقق المعدل بالفعل!'
                        : planResult.required > system.max
                        ? `غير ممكن (${planResult.required.toFixed(2)} > ${system.max})`
                        : `${planResult.required.toFixed(2)} / ${system.max}`}
                    </strong>
                  </div>
                )}
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="معدلي التراكمي GPA"
                shareText={shareText}
              />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
