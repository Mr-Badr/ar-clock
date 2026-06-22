'use client';

/**
 * EndOfServiceChart — Recharts visualization for end-of-service calculation results.
 * Shows: donut chart (earned vs. forfeited) + horizontal bar breakdown by period.
 * Lazy-loaded by the parent — safe to import recharts here without affecting SSR bundle.
 */

import { memo } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

function fmt(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return n.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 });
}

function pct(n) {
  if (n == null || Number.isNaN(n)) return '0٪';
  return `${Math.round(n)}٪`;
}

// Converts a SAR amount to a friendly "X months of salary" description
function monthsEquivalent(amount, salary) {
  if (!salary || salary <= 0 || !amount) return null;
  const months = amount / salary;
  if (months < 0.5) return null;
  const rounded = Math.round(months * 2) / 2; // nearest 0.5
  return `يعادل ${rounded} ${rounded === 1 ? 'شهر راتب' : 'أشهر راتب'}`;
}

// Custom tooltip shown on hover
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '13px',
      color: 'var(--text-primary)',
      direction: 'rtl',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: '700', color: entry.payload.color }}>
        {entry.name}
      </div>
      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
        {fmt(entry.value)}
      </div>
    </div>
  );
}

function BreakdownBar({ label, amount, total, color }) {
  const width = total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
  if (!amount || amount <= 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', direction: 'ltr' }}>
          {fmt(amount)}
        </span>
      </div>
      <div style={{ height: '6px', background: 'var(--bg-surface-2)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color,
          borderRadius: '9999px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

function EndOfServiceChart({ result, salary }) {
  if (!result?.isValid) return null;

  const earned   = result.award       ?? 0;
  const forfeited = Math.max(0, (result.fullAward ?? 0) - earned);
  const total    = result.fullAward   ?? earned;
  const equiv    = monthsEquivalent(earned, Number(salary));

  const donutData = [
    { name: 'المبلغ المستحق', value: earned,   color: '#10b981' },
    forfeited > 0
      ? { name: 'مقتطع بسبب الاستقالة', value: forfeited, color: 'var(--border-subtle)' }
      : null,
  ].filter(Boolean);

  return (
    <div style={{ marginTop: '20px' }} dir="rtl">
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
          تفصيل المبلغ بيانياً
        </span>
        {forfeited > 0 && (
          <span style={{
            fontSize: '11px', color: '#f59e0b',
            background: '#fef3c715', border: '1px solid #fde68a55',
            padding: '2px 8px', borderRadius: '9999px',
          }}>
            ⚠️ {pct(result.entitlementPercent)} فقط بسبب الاستقالة
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        alignItems: 'center',
      }}>
        {/* Donut chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={72}
                  startAngle={90} endAngle={-270}
                  paddingAngle={forfeited > 0 ? 3 : 0}
                  dataKey="value"
                  animationBegin={100}
                  animationDuration={700}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '2px', pointerEvents: 'none',
            }}>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                المستحق
              </span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', direction: 'ltr' }}>
                {pct(result.entitlementPercent)}
              </span>
            </div>
          </div>

          {equiv && (
            <span style={{
              fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center',
            }}>
              🎯 {equiv}
            </span>
          )}
        </div>

        {/* Breakdown bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <BreakdownBar
            label="السنوات الخمس الأولى (نصف شهر/سنة)"
            amount={result.firstFiveAmount}
            total={total}
            color="#6366f1"
          />
          <BreakdownBar
            label="السنوات بعد الخامسة (شهر/سنة)"
            amount={result.remainingAmount}
            total={total}
            color="#8b5cf6"
          />
          <BreakdownBar
            label="كسر السنة (أشهر وأيام)"
            amount={result.partialAmount}
            total={total}
            color="#a78bfa"
          />
          {forfeited > 0 && (
            <BreakdownBar
              label="المقتطع — سبب الإنهاء"
              amount={forfeited}
              total={total}
              color="#f87171"
            />
          )}

          {/* Total line */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '10px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
              المبلغ الصافي المستحق
            </span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#10b981', direction: 'ltr' }}>
              {fmt(earned)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(EndOfServiceChart, (prev, next) =>
  prev.result?.award            === next.result?.award &&
  prev.result?.entitlementPercent === next.result?.entitlementPercent &&
  prev.salary                   === next.salary
);
