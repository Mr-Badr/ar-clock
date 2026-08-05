"use client";

import { useState } from 'react';
import { Wrench } from '@phosphor-icons/react';

const PROBLEMS = [
  {
    id: 'scratches',
    label: 'خدوش سطحية',
    causes: ['احتكاك يومي عادي (تحريك أشياء، مفاتيح، أظافر)', 'تنظيف بقماش خشن أو مواد كاشطة'],
    verdict: 'إصلاح منزلي بسيط: مرّر قلم أو عصا شمع ترميم بلون قريب من خشبك فوق الخدش مباشرة — يملأ الخط ويُخفيه خلال دقائق دون أي أدوات احترافية.',
    tone: 'is-good',
  },
  {
    id: 'squeaky',
    label: 'صرير أو مفصلات مرتخية',
    causes: ['جفاف مادة التزييت الأصلية بالمفصلة مع الوقت', 'ارتخاء برغي التثبيت مع الاستخدام المتكرر'],
    verdict: 'شدّ البراغي المرتخية أولاً بمفك بسيط، ثم ضع قليلاً من الشمع الجاف أو مسحوق الجرافيت على المفصلة نفسها — يوقف الصرير دون تفكيك القطعة.',
    tone: 'is-good',
  },
  {
    id: 'wobbly',
    label: 'أرجل أو قطعة غير مستقرة',
    causes: ['ضعف أو جفاف الغراء القديم في وصلة الرجل بالهيكل', 'اختلاف طفيف في طول الأرجل بسبب سطح غير مستوٍ'],
    verdict: 'إن كانت المشكلة بالوصلة نفسها، فك الرجل وأعد لصقها بغراء خشب جيد واتركها تجف كاملاً قبل الاستخدام. إن كان السبب أرضية غير مستوية، لبّادات مطاطية تحت الأرجل تكفي غالباً.',
    tone: 'is-good',
  },
  {
    id: 'fading',
    label: 'بهتان اللون أو التشطيب',
    causes: ['تعرض طويل لأشعة الشمس المباشرة', 'تنظيف متكرر بمواد قوية أزالت طبقة الحماية تدريجياً'],
    verdict: 'بهتان خفيف: امسح بزيت ليمون مخصص للأثاث أو محلول خل وماء مخفف لاستعادة بعض اللمعان. بهتان عميق يحتاج صنفرة خفيفة وطبقة صبغة أو ورنيش جديدة — خطوة أكبر لكنها لا تزال ممكنة منزلياً.',
    tone: 'is-warn',
  },
  {
    id: 'cracking',
    label: 'تشقق في السطح',
    causes: ['جفاف شديد للخشب (رطوبة منخفضة جداً في الجو)', 'تمدد وانكماش متكرر دون فجوة كافية عند التصنيع'],
    verdict: 'تشقق سطحي بسيط: عالجه بشمع ملء الفجوات أو غراء خشب مخصص للشقوق الدقيقة. تشقق كبير أو متكرر علامة على مشكلة رطوبة أعمق — راجع دليل تمدد الخشب لفهم السبب الفعلي قبل الإصلاح.',
    tone: 'is-warn',
  },
];

export default function WoodProblemPicker() {
  const [active, setActive] = useState('scratches');
  const problem = PROBLEMS.find((p) => p.id === active);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Wrench size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">ما الذي تلاحظه على قطعتك؟</p>
          <p className="guide-v2-checker-sub">اختر المشكلة الأقرب لحالتك</p>
        </div>
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="المشكلة">
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`guide-v2-checker-chip${active === p.id ? ' is-active' : ''}`}
            aria-pressed={active === p.id}
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ul className="guide-v2-type-card-facts" style={{ marginBottom: 'var(--space-4)' }}>
        {problem.causes.map((c) => <li key={c}>{c}</li>)}
      </ul>

      <div className={`guide-v2-checker-result ${problem.tone}`} aria-live="polite">
        <p className="guide-v2-checker-result-label">الحل</p>
        <p className="guide-v2-checker-result-note" style={{ marginTop: 0, fontSize: '0.95rem' }}>{problem.verdict}</p>
      </div>
    </div>
  );
}
