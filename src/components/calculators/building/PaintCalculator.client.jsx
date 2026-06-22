'use client';
import { useState, useCallback } from 'react';

const PAINT_TYPES = [
  { id: 'interior_economy',  label: 'داخلي اقتصادي',   coverage: 10 },
  { id: 'interior_standard', label: 'داخلي عادي',       coverage: 12 },
  { id: 'interior_premium',  label: 'داخلي فاخر',       coverage: 14 },
  { id: 'exterior_standard', label: 'خارجي عادي',       coverage:  8 },
  { id: 'exterior_premium',  label: 'خارجي فاخر',       coverage: 10 },
  { id: 'primer',            label: 'أستر / بريمر',     coverage:  8 },
];

const DOOR_AREA  = 1.8; // m² per door (0.9×2.0)
const WINDOW_AREA = 1.44; // m² per window (1.2×1.2)

function calcPaint({ length, width, height, doors, windows, coats, paintType }) {
  const wallArea    = 2 * (length + width) * height;
  const openings    = doors * DOOR_AREA + windows * WINDOW_AREA;
  const netArea     = Math.max(0, wallArea - openings);
  const paintedArea = netArea * coats;
  const paint       = PAINT_TYPES.find((p) => p.id === paintType) || PAINT_TYPES[1];
  const liters      = paintedArea / paint.coverage;
  const cans5L  = Math.ceil(liters / 5);
  const cans1L  = Math.ceil(liters);
  return { netArea, paintedArea, liters, cans5L, cans1L, coverage: paint.coverage };
}

function fmt(n, d = 1) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn', {
    minimumFractionDigits: d, maximumFractionDigits: d,
  }).format(n);
}

export default function PaintCalculator() {
  const [form, setForm] = useState({
    length: '', width: '', height: '2.8',
    doors: '1', windows: '1',
    coats: '2', paintType: 'interior_standard',
  });
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');

  const set = useCallback((key, val) => setForm((f) => ({ ...f, [key]: val })), []);

  function calculate() {
    const length  = parseFloat(form.length);
    const width   = parseFloat(form.width);
    const height  = parseFloat(form.height);
    const doors   = parseInt(form.doors,   10) || 0;
    const windows = parseInt(form.windows, 10) || 0;
    const coats   = parseInt(form.coats,   10) || 1;

    if (!length || !width || !height || length <= 0 || width <= 0 || height <= 0) {
      setError('أدخل أبعاد الغرفة (الطول والعرض والارتفاع) بشكل صحيح.');
      setResult(null);
      return;
    }
    setError('');
    setResult(calcPaint({ length, width, height, doors, windows, coats, paintType: form.paintType }));
  }

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem',
    border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-input)', color: 'var(--text-primary)',
    fontSize: 'var(--text-base)', outline: 'none',
    direction: 'ltr', textAlign: 'end',
  };
  const labelStyle = {
    display: 'block', marginBottom: 'var(--space-1)',
    fontWeight: 'var(--font-medium)', color: 'var(--text-primary)',
    fontSize: 'var(--text-sm)',
  };
  const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 'var(--space-4)',
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      {/* Dimensions */}
      <div>
        <p style={{ margin: '0 0 var(--space-3)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
          أبعاد الغرفة
        </p>
        <div style={gridStyle}>
          {[
            { key: 'length', label: 'الطول (م)', placeholder: 'مثال: 4' },
            { key: 'width',  label: 'العرض (م)', placeholder: 'مثال: 3.5' },
            { key: 'height', label: 'الارتفاع (م)', placeholder: 'مثال: 2.8' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number" min="0" step="0.1"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Openings */}
      <div>
        <p style={{ margin: '0 0 var(--space-3)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
          الفتحات (أبواب ونوافذ)
        </p>
        <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {[
            { key: 'doors',   label: 'عدد الأبواب' },
            { key: 'windows', label: 'عدد النوافذ' },
            { key: 'coats',   label: 'عدد الطبقات' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number" min="0" step="1"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Paint type */}
      <div>
        <label style={labelStyle}>نوع الدهان</label>
        <select
          value={form.paintType}
          onChange={(e) => set('paintType', e.target.value)}
          style={{ ...inputStyle, textAlign: 'start', cursor: 'pointer' }}
        >
          {PAINT_TYPES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} — تغطية {p.coverage} م² / لتر
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={calculate}
        style={{
          padding: 'var(--space-3) var(--space-8)',
          background: 'var(--accent)', color: 'var(--text-on-accent)',
          border: 'none', borderRadius: 'var(--radius-md)',
          fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)',
          cursor: 'pointer', alignSelf: 'start',
        }}
      >
        احسب كمية الدهان
      </button>

      {error ? (
        <p style={{ color: 'var(--text-danger)', margin: 0 }}>{error}</p>
      ) : null}

      {result ? (
        <div
          style={{
            padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)',
            display: 'grid', gap: 'var(--space-4)',
          }}
          aria-live="polite"
          aria-label="نتيجة الحساب"
        >
          <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>
            النتيجة
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
            {[
              { label: 'مساحة الجدران الصافية', value: `${fmt(result.netArea)} م²` },
              { label: 'المساحة الكلية للدهان', value: `${fmt(result.paintedArea)} م²` },
              { label: 'كمية الدهان المطلوبة',  value: `${fmt(result.liters)} لتر` },
              { label: 'علب 5 لتر (تقريباً)',    value: `${result.cans5L} علبة` },
              { label: 'علب 1 لتر (تقريباً)',    value: `${result.cans1L} علبة` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {label}
                </p>
                <p style={{ margin: 0, fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontSize: 'var(--text-lg)' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            الحساب تقديري بناءً على تغطية {result.coverage} م² لكل لتر. اشترِ كمية إضافية 10–15% للاحتياط والإصلاحات.
          </p>
        </div>
      ) : null}
    </div>
  );
}
