"use client";

import { useMemo, useState } from 'react';
import { ForkKnife, Plus, Receipt, ShareNetwork, Trash, UsersThree } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { usePreferredCurrency } from '@/components/calculators/CurrencyField.client';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { formatCurrency } from '@/lib/calculators/engine';
import { calculateEqualSplit, calculateItemizedSplit } from '@/lib/calculators/bill-splitter-engine';

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_PEOPLE = [
  { id: 'p1', name: 'أنت' },
  { id: 'p2', name: 'صديقك' },
];

function Stepper({ id, value, min = 1, max = 30, onChange, label }) {
  return (
    <div id={id} className="tool-v2-stepper" role="group" aria-label={label}>
      <button type="button" className="tool-v2-stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`تقليل ${label}`}>−</button>
      <span className="tool-v2-stepper-val" aria-live="polite">{value}</span>
      <button type="button" className="tool-v2-stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`زيادة ${label}`}>+</button>
    </div>
  );
}

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function BillSplitterTool() {
  const { currency, setCurrency, options: currencyOptions } = usePreferredCurrency();
  const [mode, setMode] = useState('equal');
  const [tipPercent, setTipPercent] = useState('0');
  const [vatPercent, setVatPercent] = useState('0');
  const formatMoney = (value) => formatCurrency(value, currency);

  // equal mode state
  const [totalAmount, setTotalAmount] = useState('240');
  const [peopleCount, setPeopleCount] = useState(4);

  // itemized mode state
  const [people, setPeople] = useState(DEFAULT_PEOPLE);
  const [newPersonName, setNewPersonName] = useState('');
  const [items, setItems] = useState([
    { id: 'item-default-1', name: 'طبق رئيسي', price: '90', assignedTo: ['p1'] },
    { id: 'item-default-2', name: 'مشترك (مقبلات وعصائر)', price: '60', assignedTo: 'all' },
  ]);
  const [payerId, setPayerId] = useState('p1');

  const equalResult = useMemo(
    () => calculateEqualSplit({ totalAmount, peopleCount, tipPercent, vatPercent }),
    [totalAmount, peopleCount, tipPercent, vatPercent],
  );

  const itemizedResult = useMemo(
    () => calculateItemizedSplit({ people, items, tipPercent, vatPercent, payerId }),
    [people, items, tipPercent, vatPercent, payerId],
  );

  function addPerson() {
    const name = newPersonName.trim() || `شخص ${people.length + 1}`;
    const id = makeId('p');
    setPeople((current) => [...current, { id, name }]);
    setNewPersonName('');
  }
  function removePerson(id) {
    if (people.length <= 2) return;
    setPeople((current) => current.filter((p) => p.id !== id));
    setItems((current) => current.map((item) => ({
      ...item,
      assignedTo: Array.isArray(item.assignedTo) ? item.assignedTo.filter((pid) => pid !== id) : item.assignedTo,
    })));
    if (payerId === id) setPayerId(people[0]?.id === id ? people[1]?.id : people[0]?.id);
  }
  function addItem() {
    setItems((current) => [...current, { id: makeId('item'), name: `طلب ${current.length + 1}`, price: '0', assignedTo: 'all' }]);
  }
  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }
  function updateItem(id, key, value) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }
  function toggleItemPerson(itemId, personId) {
    setItems((current) => current.map((item) => {
      if (item.id !== itemId) return item;
      const currentAssignees = item.assignedTo === 'all' ? [] : (item.assignedTo || []);
      const isAssigned = currentAssignees.includes(personId);
      const next = isAssigned ? currentAssignees.filter((id) => id !== personId) : [...currentAssignees, personId];
      return { ...item, assignedTo: next };
    }));
  }

  const shareText = mode === 'equal'
    ? (equalResult.isValid ? `نصيب كل شخص: ${formatMoney(equalResult.perPerson)} (${equalResult.peopleCount} أشخاص)` : '')
    : (itemizedResult.isValid
      ? itemizedResult.people.map((p) => `${p.name}: ${formatMoney(p.total)}`).join(' — ')
      : '');

  return (
    <div aria-label="حاسبة تقسيم الفاتورة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Receipt size={14} weight="bold" /> بالتساوي أو حسب الطلب <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-choice-row" role="tablist" aria-label="طريقة التقسيم" style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <button type="button" role="tab" aria-selected={mode === 'equal'} className={`tool-v2-action-btn${mode === 'equal' ? ' is-primary' : ''}`} onClick={() => setMode('equal')}>
          <UsersThree size={16} weight="bold" /> بالتساوي
        </button>
        <button type="button" role="tab" aria-selected={mode === 'itemized'} className={`tool-v2-action-btn${mode === 'itemized' ? ' is-primary' : ''}`} onClick={() => setMode('itemized')}>
          <ForkKnife size={16} weight="bold" /> حسب الطلب
        </button>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="bs-currency">العملة</label>
        <PremiumSelect
          id="bs-currency"
          value={currency}
          onChange={setCurrency}
          options={currencyOptions.map((opt) => ({ value: opt.code, label: opt.label }))}
        />
      </div>

      {mode === 'equal' ? (
        <>
          <div className="tool-v2-field">
            <label htmlFor="bs-total">إجمالي الفاتورة</label>
            <input id="bs-total" type="number" inputMode="decimal" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="bs-count">عدد الأشخاص</label>
            <Stepper id="bs-count" value={peopleCount} onChange={setPeopleCount} label="عدد الأشخاص" min={1} max={30} />
          </div>
        </>
      ) : (
        <>
          <div className="tool-v2-field">
            <label>الأشخاص</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              {people.map((person) => (
                <span
                  key={person.id}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '999px',
                    border: '1px solid var(--border-default)', background: 'var(--bg-surface-2)',
                    fontSize: 'var(--text-sm)', color: 'var(--text-primary)',
                  }}
                >
                  {person.name}
                  {people.length > 2 ? (
                    <button type="button" onClick={() => removePerson(person.id)} aria-label={`حذف ${person.name}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red-text)', display: 'inline-flex' }}>
                      <Trash size={12} weight="bold" />
                    </button>
                  ) : null}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input type="text" placeholder="اسم شخص جديد" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerson(); } }} />
              <button type="button" className="tool-v2-action-btn" onClick={addPerson}><Plus size={14} weight="bold" /> إضافة</button>
            </div>
          </div>

          <div className="tool-v2-field">
            <label>الطلبات</label>
            {items.map((item) => (
              <div key={item.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md, 12px)', padding: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <div className="tool-v2-field-row-pair">
                  <div className="tool-v2-field">
                    <label htmlFor={`bs-item-name-${item.id}`}>اسم الطلب</label>
                    <input id={`bs-item-name-${item.id}`} type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                  </div>
                  <div className="tool-v2-field">
                    <label htmlFor={`bs-item-price-${item.id}`}>السعر</label>
                    <input id={`bs-item-price-${item.id}`} type="number" inputMode="decimal" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'var(--space-2)' }}>
                  <button
                    type="button"
                    className={`tool-v2-action-btn${item.assignedTo === 'all' ? ' is-primary' : ''}`}
                    onClick={() => updateItem(item.id, 'assignedTo', 'all')}
                  >
                    الكل
                  </button>
                  {people.map((person) => {
                    const isActive = item.assignedTo !== 'all' && Array.isArray(item.assignedTo) && item.assignedTo.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        type="button"
                        className={`tool-v2-action-btn${isActive ? ' is-primary' : ''}`}
                        onClick={() => toggleItemPerson(item.id, person.id)}
                      >
                        {person.name}
                      </button>
                    );
                  })}
                  {items.length > 1 ? (
                    <button type="button" className="tool-v2-action-btn" onClick={() => removeItem(item.id)} aria-label={`حذف ${item.name}`}>
                      <Trash size={14} weight="bold" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            <button type="button" className="tool-v2-action-btn" onClick={addItem}><Plus size={14} weight="bold" /> إضافة طلب</button>
          </div>

          <div className="tool-v2-field">
            <label htmlFor="bs-payer">من دفع الفاتورة؟</label>
            <PremiumSelect
              id="bs-payer"
              value={payerId}
              onChange={setPayerId}
              options={people.map((person) => ({ value: person.id, label: person.name }))}
            />
          </div>
        </>
      )}

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="bs-tip">البقشيش (اختياري) %</label>
          <input id="bs-tip" type="number" inputMode="decimal" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="bs-vat">الضريبة (VAT) %</label>
          <input id="bs-vat" type="number" inputMode="decimal" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-3)' }}>
        <button type="button" className="tool-v2-action-btn" onClick={() => setVatPercent('15')}>ضريبة السعودية 15%</button>
        <button type="button" className="tool-v2-action-btn" onClick={() => setVatPercent('0')}>بدون ضريبة</button>
      </div>

      {mode === 'equal' ? (
        equalResult.isValid ? (
          <div aria-live="polite">
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">نصيب كل شخص</span>
              <div className="tool-v2-result-value">{formatMoney(equalResult.perPerson)}</div>
              <div className="tool-v2-result-meta">من إجمالي {formatMoney(equalResult.grandTotal)} على {equalResult.peopleCount} أشخاص</div>
            </div>
            <div className="tool-v2-breakdown-list">
              <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">قيمة الفاتورة</span><span className="tool-v2-breakdown-value">{formatMoney(equalResult.subtotal)}</span></div>
              {equalResult.tipAmount > 0 ? (<div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">البقشيش</span><span className="tool-v2-breakdown-value">{formatMoney(equalResult.tipAmount)}</span></div>) : null}
              {equalResult.vatAmount > 0 ? (<div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الضريبة</span><span className="tool-v2-breakdown-value">{formatMoney(equalResult.vatAmount)}</span></div>) : null}
              <div className="tool-v2-breakdown-row"><span className="tool-v2-breakdown-label">الإجمالي بعد الإضافات</span><span className="tool-v2-breakdown-value">{formatMoney(equalResult.grandTotal)}</span></div>
            </div>
            <div className="tool-v2-action-row">
              <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة تقسيم الفاتورة', shareText)}>
                <ShareNetwork size={18} weight="bold" /> مشاركة النتيجة
              </button>
            </div>
          </div>
        ) : (
          <div className="tool-v2-empty-state"><Receipt size={28} weight="duotone" /><p>أدخل إجمالي الفاتورة وعدد الأشخاص لمعرفة نصيب كل واحد.</p></div>
        )
      ) : (
        itemizedResult.isValid ? (
          <div aria-live="polite">
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">إجمالي الفاتورة بعد الإضافات</span>
              <div className="tool-v2-result-value">{formatMoney(itemizedResult.grandTotal)}</div>
              <div className="tool-v2-result-meta">موزّعة على {itemizedResult.people.length} أشخاص حسب طلب كل واحد</div>
            </div>
            <div className="tool-v2-breakdown-list">
              {itemizedResult.people.map((person) => (
                <div className="tool-v2-breakdown-row" key={person.id}>
                  <span className="tool-v2-breakdown-label">
                    {person.name}
                    {payerId && person.id !== payerId ? ' — يدين للدافع' : payerId === person.id ? ' — الدافع' : ''}
                  </span>
                  <span className="tool-v2-breakdown-value">{formatMoney(person.total)}</span>
                </div>
              ))}
            </div>
            <div className="tool-v2-action-row">
              <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة تقسيم الفاتورة', shareText)}>
                <ShareNetwork size={18} weight="bold" /> مشاركة النتيجة
              </button>
            </div>
          </div>
        ) : (
          <div className="tool-v2-empty-state"><Receipt size={28} weight="duotone" /><p>أضف الأشخاص والطلبات وحدد من طلب ماذا لمعرفة نصيب كل واحد.</p></div>
        )
      )}
    </div>
  );
}
