"use client";

import { useMemo, useState } from 'react';
import { GraduationCap } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { convertGpaToPercent, GPA_SYSTEMS, getGpaClassification } from '@/lib/calculators/gpa';

const SYSTEM_IDS = ['scale5', 'scale4', 'scale100'];

export default function GpaToPercentCalculator() {
  const [systemId, setSystemId] = useState('scale5');
  const [gpaValue, setGpaValue] = useState('');

  const system = GPA_SYSTEMS[systemId];

  const result = useMemo(() => {
    if (!gpaValue) return null;
    return convertGpaToPercent(gpaValue, systemId);
  }, [gpaValue, systemId]);

  const classification = useMemo(() => {
    if (!result?.isValid) return null;
    return getGpaClassification(parseFloat(gpaValue), systemId);
  }, [result, gpaValue, systemId]);

  const shareText = result?.isValid
    ? `المعدل ${gpaValue} من ${system.max} = ${result.percent}%\nالتصنيف: ${classification?.label ?? ''}`
    : '';

  return (
    <div className="calc-app gpa-pct-tool" aria-label="تحويل المعدل إلى نسبة مئوية">

      {/* System selector */}
      <div className="gpa-system-row">
        {SYSTEM_IDS.map((sid) => (
          <button
            key={sid}
            type="button"
            className={`chip calc-chip-button${systemId === sid ? ' is-active' : ''}`}
            onClick={() => setSystemId(sid)}
            aria-pressed={systemId === sid}
          >
            {GPA_SYSTEMS[sid].label}
          </button>
        ))}
      </div>

      <div className="calc-surface-card" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', padding: '1.5rem', marginTop: '1rem' }}>

        <div className="calc-esb-field">
          <Label htmlFor="gpa-input">
            المعدل التراكمي ({GPA_SYSTEMS[systemId].label})
          </Label>
          <input
            id="gpa-input"
            type="number"
            inputMode="decimal"
            min="0"
            max={system.max}
            step="0.01"
            className="calc-input"
            value={gpaValue}
            onChange={(e) => setGpaValue(e.target.value)}
            placeholder={`0 – ${system.max}`}
            style={{ marginTop: '0.5rem', width: '100%' }}
          />
          <p className="calc-hint">أدخل معدلك بين 0 و{system.max}</p>
        </div>

        {result?.isValid && (
          <div className="gpa-pct-result" style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: classification ? `${classification.color}15` : 'var(--bg-surface-2)', border: `1.5px solid ${classification?.color ?? 'var(--border-subtle)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <GraduationCap size={28} color={classification?.color ?? 'var(--text-secondary)'} weight="duotone" />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: classification?.color ?? 'var(--text-primary)', lineHeight: 1 }}>
                  {result.percent}%
                </div>
                {classification && (
                  <div style={{ fontSize: '0.95rem', color: classification.color, fontWeight: 600, marginTop: '0.2rem' }}>
                    {classification.label} — {classification.labelEn}
                  </div>
                )}
              </div>
            </div>

            <div className="gpa-pct-breakdown" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div className="calc-result-chip">
                <span className="chip-label">المعدل</span>
                <span className="chip-value">{parseFloat(gpaValue)} / {system.max}</span>
              </div>
              <div className="calc-result-chip">
                <span className="chip-label">النسبة المئوية</span>
                <span className="chip-value">{result.percent}%</span>
              </div>
            </div>

            <ResultActions shareText={shareText} style={{ marginTop: '1rem' }} />
          </div>
        )}
      </div>
    </div>
  );
}
