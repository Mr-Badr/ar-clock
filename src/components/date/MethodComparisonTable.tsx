// src/components/date/MethodComparisonTable.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REDESIGNED:
//   • Agreement/disagreement banner tells user at a glance if methods match
//   • Country context per method (which countries use each method)
//   • .table-wrapper .table CSS classes from new.css
//   • Highlights differing rows with warning state
//   • Educational footer note
// ─────────────────────────────────────────────────────────────────────────────

import type { ConvertDateResult } from '@/lib/date-adapter';

interface Props {
  gregorianDate: string;
  umalqura:      ConvertDateResult;
  astronomical:  ConvertDateResult;
  civil:         ConvertDateResult;
}

const METHODS = [
  {
    key:      'umalqura',
    label:    'أم القرى',
    nameEn:   'Umm al-Qura',
    badgeClass: 'badge badge-accent',
    badge:    'رسمي',
    countries:'🇸🇦🇦🇪🇰🇼🇶🇦🇧🇭🇴🇲 الخليج',
  },
  {
    key:      'astronomical',
    label:    'الرصد الفلكي',
    nameEn:   'Astronomical',
    badgeClass: 'badge badge-info',
    badge:    'فلكي',
    countries:'🇲🇦🇪🇬🇯🇴🇩🇿🇹🇳🇱🇧 المغرب والشام',
  },
  {
    key:      'civil',
    label:    'مدني / حسابي',
    nameEn:   'Civil / Tabular',
    badgeClass: 'badge badge-success',
    badge:    'أكاديمي',
    countries:'📐 للحسابات الأكاديمية',
  },
] as const;

export function MethodComparisonTable({ gregorianDate, umalqura, astronomical, civil }: Props) {
  const results = { umalqura, astronomical, civil };
  const allAgree      = umalqura.formatted.ar === astronomical.formatted.ar && astronomical.formatted.ar === civil.formatted.ar;
  const uqMatchAstro  = umalqura.formatted.ar === astronomical.formatted.ar;

  return (
    <div>
      {/* Agreement/disagreement banner */}
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl mb-3 ${allAgree ? 'badge-success' : 'badge-warning'}`}
        style={{
          background:  allAgree ? 'var(--success-soft)' : 'var(--warning-soft)',
          border:      `1px solid ${allAgree ? 'var(--success-border)' : 'var(--warning-border)'}`,
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <span className="text-lg leading-none">{allAgree ? '✅' : '⚠️'}</span>
        <p
          className="text-xs font-semibold m-0"
          style={{ color: allAgree ? 'var(--success)' : 'var(--warning)' }}
        >
          {allAgree
            ? 'جميع طرق الحساب الثلاثة تتفق على نفس التاريخ الهجري هذا اليوم'
            : uqMatchAstro
            ? 'أم القرى والفلكي يتفقان — الحسابي يختلف بيوم واحد'
            : 'الطرق الثلاثة تختلف — قد يتفاوت التاريخ بيوم واحد بين الدول'}
        </p>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="text-right">طريقة الحساب</th>
              <th className="text-right">تُستخدم في</th>
              <th className="numeric text-left">التاريخ الهجري</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map(({ key, label, nameEn, badgeClass, badge, countries }) => {
              const result  = results[key as keyof typeof results];
              const differs = !allAgree && result.formatted.ar !== umalqura.formatted.ar;

              return (
                <tr
                  key={key}
                  style={differs ? { background: 'var(--warning-soft)' } : undefined}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold text-primary text-sm">{label}</div>
                        <div className="text-xs text-muted">{nameEn}</div>
                      </div>
                      <span className={badgeClass}>{badge}</span>
                      {differs && <span className="badge badge-warning">يختلف</span>}
                    </div>
                  </td>
                  <td>
                    <div className="text-xs text-secondary">{countries}</div>
                  </td>
                  <td className="numeric">
                    <div className="font-bold text-primary tabular-nums">{result.formatted.ar}</div>
                    <div className="text-xs text-muted">{result.dayNameAr}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Educational footer */}
      <p className="text-xs text-muted mt-2 leading-relaxed">
        💡 الاختلاف بين الطرق لا يتجاوز يوماً واحداً، وسببه آلية تحديد بداية الشهر الهجري (حساب مسبق مقابل رؤية الهلال الفعلية).
      </p>
    </div>
  );
}
