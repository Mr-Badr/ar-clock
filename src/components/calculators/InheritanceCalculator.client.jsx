'use client';

import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Info, Scales, Users, Warning } from '@phosphor-icons/react';

import { CalcInput as Input, CalcSelectTrigger as SelectTrigger } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { calculateInheritance, fractionLabel } from '@/lib/calculators/inheritance';

const CURRENCIES = [
  { id: 'SAR', label: 'ريال سعودي' },
  { id: 'AED', label: 'درهم إماراتي' },
  { id: 'KWD', label: 'دينار كويتي' },
  { id: 'QAR', label: 'ريال قطري' },
  { id: 'EGP', label: 'جنيه مصري' },
];

function formatMoney(v, cur) {
  return v.toLocaleString('ar-SA-u-nu-latn', { style: 'currency', currency: cur, maximumFractionDigits: 0 });
}

function formatNum(n) {
  return Math.round(n).toLocaleString('ar-SA-u-nu-latn');
}

function getHeirColor(key) {
  if (key === 'husband' || key.startsWith('wife')) return 'var(--blue)';
  if (key === 'father') return 'var(--green)';
  if (key === 'mother') return 'var(--amber)';
  if (key === 'sons') return 'color-mix(in srgb, var(--blue) 50%, var(--green) 50%)';
  if (key === 'daughters') return 'color-mix(in srgb, var(--green) 55%, var(--amber) 45%)';
  if (key === 'fullBrothers') return 'var(--red)';
  if (key === 'fullSisters') return 'color-mix(in srgb, var(--red) 55%, var(--blue) 45%)';
  return 'var(--text-secondary)';
}

function Stepper({ label, value, onChange, max = 20 }) {
  return (
    <div className="calc-stepper-row">
      <span className="calc-stepper-label">{label}</span>
      <div className="calc-stepper-group">
        <button
          type="button"
          className="calc-stepper-btn"
          onClick={() => onChange((v) => Math.max(0, v - 1))}
          disabled={value === 0}
          aria-label={`إنقاص ${label}`}
        >−</button>
        <span className="calc-stepper-val">{formatNum(value)}</span>
        <button
          type="button"
          className="calc-stepper-btn"
          onClick={() => onChange((v) => Math.min(max, v + 1))}
          disabled={value >= max}
          aria-label={`زيادة ${label}`}
        >+</button>
      </div>
    </div>
  );
}

export default function InheritanceCalculator() {
  const [currency, setCurrency] = useState('SAR');
  const [estateInput, setEstateInput] = useState('');
  const [hasHusband, setHasHusband] = useState(false);
  const [hasWife, setHasWife] = useState(false);
  const [wivesCount, setWivesCount] = useState(1);
  const [hasFather, setHasFather] = useState(false);
  const [hasMother, setHasMother] = useState(false);
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  const [fullBrothers, setFullBrothers] = useState(0);
  const [fullSisters, setFullSisters] = useState(0);

  const estate = parseFloat(estateInput.replace(/,/g, '')) || 0;
  const hasAnyHeir = hasHusband || hasWife || hasFather || hasMother || sons > 0 || daughters > 0 || fullBrothers > 0 || fullSisters > 0;

  const result = useMemo(() => {
    if (estate <= 0 || !hasAnyHeir) return null;
    return calculateInheritance({
      estate, hasHusband, hasWife, wivesCount,
      hasFather, hasMother, sons, daughters,
      fullBrothers, fullSisters,
    });
  }, [estate, hasAnyHeir, hasHusband, hasWife, wivesCount, hasFather, hasMother, sons, daughters, fullBrothers, fullSisters]);

  const siblingsBlocked = hasFather || sons > 0;
  const totalHeirs = result ? result.results.reduce((s, h) => s + h.count, 0) : 0;

  const chartData = useMemo(
    () => (result ? result.results.map((h) => ({ name: h.label, value: h.amount, key: h.key })) : []),
    [result],
  );

  function selectSpouse(kind) {
    if (kind === 'husband') {
      setHasHusband((v) => {
        const next = !v;
        if (next) setHasWife(false);
        return next;
      });
    } else {
      setHasWife((v) => {
        const next = !v;
        if (next) setHasHusband(false);
        return next;
      });
    }
  }

  const shareText = result?.isValid
    ? [
        'حاسبة الميراث — توزيع التركة',
        `التركة: ${formatMoney(estate, currency)}`,
        result.awl ? 'العول: تجاوزت الفروض التركة وتم التوزيع بالتناسب' : null,
        ...result.results.map((h) => `${h.label}: ${formatMoney(h.amount, currency)} (${h.percent.toFixed(1)}%)`),
      ].filter(Boolean).join('\n')
    : '';

  return (
    <div className="calc-app inheritance-tool" aria-label="حاسبة الميراث وتوزيع التركة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Estate + currency */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="inh-estate">قيمة التركة الإجمالية</Label>
                </div>
                <div className="inh-estate-row">
                  <Input
                    id="inh-estate"
                    inputMode="numeric"
                    dir="ltr"
                    value={estateInput}
                    onChange={(e) => setEstateInput(e.target.value.replace(/[^0-9.,]/g, ''))}
                    placeholder="مثال: 500000"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="calc-hint">التركة الصافية بعد سداد الديون وتجهيز الميت وتنفيذ الوصية (بحد أقصى الثلث).</p>
              </div>

              {/* Spouse */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>هل يوجد زوج أو زوجة؟</Label>
                </div>
                <div className="calc-toggle-row">
                  <button
                    type="button"
                    className={`calc-toggle-btn${hasHusband ? ' calc-toggle-btn--active' : ''}`}
                    onClick={() => selectSpouse('husband')}
                    aria-pressed={hasHusband}
                  >
                    زوج
                  </button>
                  <button
                    type="button"
                    className={`calc-toggle-btn${hasWife ? ' calc-toggle-btn--active' : ''}`}
                    onClick={() => selectSpouse('wife')}
                    aria-pressed={hasWife}
                  >
                    زوجة
                  </button>
                </div>
                {hasWife && (
                  <div className="calc-stepper-fieldset">
                    <Stepper label="عدد الزوجات" value={wivesCount} onChange={setWivesCount} max={4} />
                  </div>
                )}
              </div>

              {/* Parents */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label>الوالدان على قيد الحياة</Label>
                </div>
                <div className="calc-toggle-row">
                  <button
                    type="button"
                    className={`calc-toggle-btn${hasFather ? ' calc-toggle-btn--active' : ''}`}
                    onClick={() => setHasFather((v) => !v)}
                    aria-pressed={hasFather}
                  >
                    الأب
                  </button>
                  <button
                    type="button"
                    className={`calc-toggle-btn${hasMother ? ' calc-toggle-btn--active' : ''}`}
                    onClick={() => setHasMother((v) => !v)}
                    aria-pressed={hasMother}
                  >
                    الأم
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">4</span>
                  <Label>الأبناء</Label>
                </div>
                <div className="calc-stepper-fieldset">
                  <Stepper label="أبناء (ذكور)" value={sons} onChange={setSons} />
                  <Stepper label="بنات (إناث)" value={daughters} onChange={setDaughters} />
                </div>
              </div>

              {/* Siblings */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">5</span>
                  <Label>الإخوة والأخوات الأشقاء</Label>
                </div>
                {siblingsBlocked && (fullBrothers > 0 || fullSisters > 0) && (
                  <p className="calc-hint inh-blocked-hint">
                    <Warning size={13} weight="bold" />
                    الإخوة والأخوات محجوبون {hasFather ? 'بوجود الأب' : 'بوجود الأبناء'}
                  </p>
                )}
                <div className="calc-stepper-fieldset">
                  <Stepper label="إخوة أشقاء" value={fullBrothers} onChange={setFullBrothers} />
                  <Stepper label="أخوات شقيقات" value={fullSisters} onChange={setFullSisters} />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Sidebar quick facts */}
          <div className="calc-esb-sidebar-facts">
            <div className="calc-esb-fact">
              <Scales size={15} weight="bold" />
              <span>التركة: <strong>{formatMoney(estate, currency)}</strong></span>
            </div>
            {result && (
              <div className="calc-esb-fact">
                <Users size={15} weight="bold" />
                <span>{formatNum(totalHeirs)} من الورثة</span>
              </div>
            )}
            {result?.awl && (
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>عوْل — توزيع بالتناسب</span>
              </div>
            )}
            {result?.radd && (
              <div className="calc-esb-fact">
                <Info size={15} weight="bold" />
                <span>ردّ — أُعيد الفائض للورثة</span>
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result?.isValid ? (
            <div className="calc-esb-result-panel inh-result" aria-live="polite">

              <div className="calc-esb-result-header">
                <span className="badge badge-info">وفق الفرائض — المذاهب الأربعة</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">التركة الموزعة</span>
                <div className="calc-esb-amount-value calc-amount-tone--success">{formatMoney(estate, currency)}</div>
                <div className="calc-esb-amount-meta">
                  <span>بين {formatNum(totalHeirs)} من الورثة</span>
                  {result.awl && (<><span className="calc-esb-sep">·</span><span>عوْل (تناسبي)</span></>)}
                  {result.radd && (<><span className="calc-esb-sep">·</span><span>ردّ (فائض مُعاد)</span></>)}
                </div>
              </div>

              {/* Donut chart */}
              <div className="inh-chart-box">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={chartData} innerRadius={54} outerRadius={88} paddingAngle={3} dataKey="value">
                      {chartData.map((entry) => (
                        <Cell key={entry.key} fill={getHeirColor(entry.key)} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => formatMoney(value, currency)}
                      contentStyle={{
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                        direction: 'rtl',
                      }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      labelStyle={{ color: 'var(--text-secondary)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Heir breakdown */}
              <div className="inh-heir-list">
                {result.results.map((h) => (
                  <div key={h.key} className="inh-heir-row">
                    <span className="inh-heir-dot" style={{ background: getHeirColor(h.key) }} aria-hidden="true" />
                    <div className="inh-heir-copy">
                      <span className="inh-heir-label">
                        {h.label}
                        {h.count > 1 && <span className="inh-heir-count"> ({formatNum(h.count)} أفراد)</span>}
                      </span>
                      <span className="inh-heir-meta">
                        {h.fraction ? `${fractionLabel(h.fraction)} · ` : ''}{h.percent.toFixed(1)}%
                        {h.note ? ` · ${h.note}` : ''}
                      </span>
                    </div>
                    <div className="inh-heir-amount">
                      <strong>{formatMoney(h.amount, currency)}</strong>
                      {h.count > 1 && (
                        <span className="inh-heir-per">{formatMoney(h.amount / h.count, currency)} / فرد</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <ResultActions
                copyText={shareText}
                shareTitle="نتيجة حاسبة الميراث"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>
                  هذه الحاسبة للاسترشاد والتخطيط المبدئي فقط. صك الإرث الرسمي يستلزم مراجعة قاضٍ أو محكمة الأحوال
                  الشخصية، خاصة مع وجود وصية أو ديون أو ورثة غائبين.
                </span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <Scales size={28} weight="duotone" />
              <p>أدخل قيمة التركة واختر الورثة الموجودين لمعرفة نصيب كل وارث فوراً.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
