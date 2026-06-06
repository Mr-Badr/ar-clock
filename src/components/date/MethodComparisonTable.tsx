import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import type { ConvertDateResult } from '@/lib/date-adapter';
import styles from './MethodComparisonTable.module.css';

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
    countries:'السعودية ودول الخليج',
  },
  {
    key:      'astronomical',
    label:    'الرصد الفلكي',
    nameEn:   'Astronomical',
    badgeClass: 'badge badge-info',
    badge:    'فلكي',
    countries:'المغرب ومصر والشام وشمال أفريقيا',
  },
  {
    key:      'civil',
    label:    'مدني / حسابي',
    nameEn:   'Civil / Tabular',
    badgeClass: 'badge badge-success',
    badge:    'أكاديمي',
    countries:'للحسابات الأكاديمية والمقارنة',
  },
] as const;

export function MethodComparisonTable({ gregorianDate: _gregorianDate, umalqura, astronomical, civil }: Props) {
  const results = { umalqura, astronomical, civil };
  const allAgree      = umalqura.formatted.ar === astronomical.formatted.ar && astronomical.formatted.ar === civil.formatted.ar;
  const uqMatchAstro  = umalqura.formatted.ar === astronomical.formatted.ar;
  const NoticeIcon = allAgree ? CheckCircle2 : TriangleAlert;

  return (
    <div className={styles.root}>
      <div
        className={`${styles.notice} ${allAgree ? styles.noticeSuccess : styles.noticeWarning}`}
        role="status"
      >
        <span className={styles.noticeIcon} aria-hidden="true">
          <NoticeIcon size={18} strokeWidth={1.9} />
        </span>
        <p className={styles.noticeText}>
          {allAgree
            ? 'جميع طرق الحساب الثلاثة تتفق على نفس التاريخ الهجري هذا اليوم'
            : uqMatchAstro
            ? 'أم القرى والفلكي يتفقان، والحسابي يختلف بيوم واحد'
            : 'الطرق الثلاثة تختلف، وقد يتفاوت التاريخ بيوم واحد بين الدول'}
        </p>
      </div>

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
                  className={differs ? styles.differs : undefined}
                >
                  <td>
                    <div className={styles.methodCell}>
                      <div>
                        <div className={styles.methodName}>{label}</div>
                        <div className={styles.methodMeta}>{nameEn}</div>
                      </div>
                      <span className={badgeClass}>{badge}</span>
                      {differs && <span className="badge badge-warning">يختلف</span>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.countries}>{countries}</div>
                  </td>
                  <td className="numeric">
                    <div className={styles.dateValue}>{result.formatted.ar}</div>
                    <div className={styles.dayName}>{result.dayNameAr}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.note}>
        <Info size={13} aria-hidden="true" /> الاختلاف بين الطرق لا يتجاوز يوماً واحداً غالباً، وسببه آلية تحديد بداية الشهر الهجري بين حساب مسبق ورؤية الهلال.
      </p>
    </div>
  );
}
