"use client";

import { useMemo, useState } from 'react';
import { CheckCircle, Circle, ShieldWarning } from '@phosphor-icons/react';

// Checklist items — split honestly between REAL regulatory requirements (verified via direct
// WebFetch of rayde.sa's Civil Defense summary and uaj.sa's approved-inspector list, not a
// WebSearch AI summary — see keyword-research/elevators-hub/DECISION.md and the standing lesson
// in feedback-verify-numbers-via-webfetch-2026-08-10) and general good-contract-hygiene practice
// that appeared consistently across multiple real company sources. Never presented as one
// undifferentiated list of "requirements" — that would overstate what's actually verified.
const REGULATION_ITEMS = [
  {
    id: 'fire-alarm',
    label: 'المصعد مرتبط بنظام إنذار الحريق ويعود تلقائياً لطابق آمن عند التنبيه',
    hint: 'اشتراط دفاع مدني حقيقي في السعودية — ليس بنداً اختيارياً في العقد.',
  },
  {
    id: 'certified-inspector',
    label: 'شركة الصيانة أو فني الفحص معتمد من الدفاع المدني',
    hint: 'الدفاع المدني ينشر قائمة رسمية بشركات الفحص المعتمدة — تأكد أن شركتك مدرجة فيها قبل التوقيع.',
  },
];

const BEST_PRACTICE_ITEMS = [
  {
    id: 'comprehensive',
    label: 'يشمل قطع الغيار عند الأعطال بدون تكلفة إضافية (عقد شامل)',
    hint: 'العقود غير الشاملة تغطي الفحص والتنظيف فقط، وتحمّلك تكلفة أي قطعة تحتاج استبدالاً بشكل منفصل.',
  },
  {
    id: 'visit-count',
    label: 'عدد الزيارات الدورية في السنة محدد بالعقد بوضوح (وليس "حسب الحاجة")',
    hint: 'عبارة غامضة مثل "زيارات دورية" بلا رقم محدد تفتح الباب لتقليل عدد الزيارات الفعلية دون اعتراض عقدي.',
  },
  {
    id: 'emergency',
    label: 'يشمل خدمة طوارئ لأعطال التوقف المفاجئ، لا الزيارات الدورية فقط',
    hint: 'توقف المصعد المفاجئ (خصوصاً مع راكب بداخله) يحتاج استجابة أسرع من موعد الزيارة الدورية القادمة.',
  },
  {
    id: 'report',
    label: 'تقرير مكتوب بعد كل زيارة يوضح حالة المصعد والتوصيات',
    hint: 'بدون تقرير موثّق، لا يوجد سجل يثبت ما تم فحصه فعلاً عند أي نزاع لاحق.',
  },
  {
    id: 'termination',
    label: 'مدة العقد وطريقة التجديد وفترة الإشعار قبل الفسخ محددة بوضوح',
    hint: 'عقود التجديد التلقائي بدون فترة إشعار واضحة قد تحبسك في تعاقد لا تريد الاستمرار فيه.',
  },
];

const ALL_ITEMS = [...REGULATION_ITEMS, ...BEST_PRACTICE_ITEMS];

export default function ElevatorContractChecker() {
  const [checked, setChecked] = useState(() => new Set());

  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const result = useMemo(() => {
    const total = ALL_ITEMS.length;
    const count = checked.size;
    const missingRegulatory = REGULATION_ITEMS.filter((item) => !checked.has(item.id));
    let verdict;
    let tone;
    if (missingRegulatory.length > 0) {
      verdict = 'عقدك ينقصه بند تنظيمي أساسي — راجعه قبل التوقيع';
      tone = 'warning';
    } else if (count === total) {
      verdict = 'عقدك يبدو شاملاً ومتوافقاً مع الأساسيات';
      tone = 'good';
    } else if (count >= total - 2) {
      verdict = 'عقدك يغطي الأساسيات، لكن ينقصه بعض البنود المهمة';
      tone = 'ok';
    } else {
      verdict = 'راجع عقدك جيداً — ينقصه عدة بنود مهمة';
      tone = 'warning';
    }
    return { count, total, verdict, tone, missingRegulatory };
  }, [checked]);

  return (
    <div aria-label="مدقق عقد صيانة المصعد">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          مبني على اشتراطات دفاع مدني حقيقية
        </span>
      </div>

      <div className="tool-v2-field">
        <label>بنود تنظيمية إلزامية</label>
        <div className="tool-v2-choice-list">
          {REGULATION_ITEMS.map((item) => {
            const active = checked.has(item.id);
            return (
              <label key={item.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`item-${item.id}`}>
                <input type="checkbox" id={`item-${item.id}`} checked={active} onChange={() => toggle(item.id)} />
                <span className="tool-v2-choice-icon" aria-hidden="true">
                  {active ? <CheckCircle size={18} weight="fill" /> : <Circle size={18} weight="bold" />}
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{item.label}</span>
                  <span className="tool-v2-choice-desc">{item.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>بنود موصى بها لعقد جيد</label>
        <div className="tool-v2-choice-list">
          {BEST_PRACTICE_ITEMS.map((item) => {
            const active = checked.has(item.id);
            return (
              <label key={item.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`item-${item.id}`}>
                <input type="checkbox" id={`item-${item.id}`} checked={active} onChange={() => toggle(item.id)} />
                <span className="tool-v2-choice-icon" aria-hidden="true">
                  {active ? <CheckCircle size={18} weight="fill" /> : <Circle size={18} weight="bold" />}
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{item.label}</span>
                  <span className="tool-v2-choice-desc">{item.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">النتيجة</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{result.count}</span>
              <span className="tool-v2-result-stat-label">من {result.total} بنداً</span>
            </span>
          </div>
          <div className="tool-v2-result-meta">{result.verdict}</div>
        </div>

        {result.missingRegulatory.length > 0 ? (
          <div className="tool-v2-note-strip">
            <ShieldWarning size={15} weight="fill" />
            <span>
              ينقص عقدك بند تنظيمي حقيقي: {result.missingRegulatory.map((i) => i.label).join('، ')}. تأكد من إضافته قبل التوقيع، لا بعده.
            </span>
          </div>
        ) : (
          <div className="tool-v2-note-strip">
            <ShieldWarning size={15} weight="fill" />
            <span>هذا تدقيق استرشادي لبنود العقد نفسه — لا يغني عن فحص فني فعلي للمصعد من جهة معتمدة.</span>
          </div>
        )}
      </div>
    </div>
  );
}
