"use client";

import { useState } from 'react';
import { Wrench } from '@phosphor-icons/react';

const SYMPTOMS = [
  {
    id: 'no-cool',
    label: 'لا يبرد كفاية',
    causes: ['فلتر متسخ يعيق تدفق الهواء (الأشيع)', 'اتساخ الوحدة الخارجية أو انسداد حولها', 'نقص غاز التبريد', 'ضعف أو تلف الكمبروسر'],
    verdict: 'جرّب تنظيف الفلتر والوحدة الخارجية أولاً — إن استمرت المشكلة بعدها فالسبب غالباً نقص غاز أو عطل بالضاغط، ويحتاج فنياً.',
    tone: 'is-warn',
  },
  {
    id: 'water-leak',
    label: 'يسرب ماء',
    causes: ['انسداد خرطوم الصرف بالأتربة أو الطحالب (الأشيع بفارق كبير)', 'تراكم أتربة كثيف بالوحدة الداخلية', 'ميل خاطئ في مسار التصريف بعد التركيب'],
    verdict: 'غالباً انسداد بسيط يمكنك حله بنفسك: افصل الكهرباء، نظّف الفلتر، وصبّ نحو ثلث كوب خل أبيض مخفف بالماء في مخرج الصرف كل 3 أشهر لمنع تكوّن الطحالب.',
    tone: 'is-good',
  },
  {
    id: 'bad-smell',
    label: 'رائحة كريهة',
    causes: ['رطوبة وعفن متراكم في الفلتر أو المبخّر (الأشيع)', 'أتربة متراكمة داخل الوحدة الداخلية', 'تسرب غاز تبريد — رائحة أقرب للكيميائي أو السمك، نادرة لكن خطيرة'],
    verdict: 'نظّف الفلتر والوحدة الداخلية أولاً. إن كانت الرائحة كيميائية غريبة وليست رائحة عفن عادية، أوقف التشغيل واتصل بفني فوراً.',
    tone: 'is-warn',
  },
  {
    id: 'loud-noise',
    label: 'صوت عالٍ أو غريب',
    causes: ['تركيب غير ثابت أو اهتزاز في قاعدة الوحدة الخارجية', 'جسم غريب أو أتربة في المروحة', 'تلف في محامل المروحة أو الكمبروسر'],
    verdict: 'تأكد أولاً أن الوحدة الخارجية مثبتة بإحكام على قاعدة صلبة. إن كان الصوت معدنياً حاداً أو متزايداً، أوقف التشغيل واستدعِ فنياً قبل أن يتفاقم الضرر.',
    tone: 'is-warn',
  },
  {
    id: 'shuts-off',
    label: 'يطفئ نفسه فجأة',
    causes: ['حماية حرارية تلقائية من ارتفاع حرارة الضاغط', 'انخفاض أو تذبذب في التيار الكهربائي', 'قاطع كهربائي غير مناسب أو تالف'],
    verdict: 'هذه علامة تحتاج فحصاً فنياً غالباً — قد تكون مشكلة كهربائية حقيقية، ولا يُنصح بتجاهلها أو إعادة التشغيل المتكرر بدون فحص.',
    tone: 'is-bad',
  },
];

export default function AcTroubleshootingPicker() {
  const [active, setActive] = useState('no-cool');
  const symptom = SYMPTOMS.find((s) => s.id === active);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Wrench size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">ما الذي تلاحظه على مكيفك؟</p>
          <p className="guide-v2-checker-sub">اختر العرَض الأقرب لحالتك</p>
        </div>
      </div>
      <div className="guide-v2-checker-options" role="group" aria-label="عرَض المشكلة">
        {SYMPTOMS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`guide-v2-checker-chip${active === s.id ? ' is-active' : ''}`}
            aria-pressed={active === s.id}
            onClick={() => setActive(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ul className="guide-v2-type-card-facts" style={{ marginBottom: 'var(--space-4)' }}>
        {symptom.causes.map((c) => <li key={c}>{c}</li>)}
      </ul>

      <div className={`guide-v2-checker-result ${symptom.tone}`} aria-live="polite">
        <p className="guide-v2-checker-result-label">الخلاصة</p>
        <p className="guide-v2-checker-result-note" style={{ marginTop: 0, fontSize: '0.95rem' }}>{symptom.verdict}</p>
      </div>
    </div>
  );
}
