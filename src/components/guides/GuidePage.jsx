import Link from 'next/link';

import {
  CalculatorChecklist,
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorSection,
  CalculatorSectionNav,
} from '@/components/calculators/common';

export default function GuidePage({ guide, relatedCalculators = [], relatedGuides = [], relatedPages = [] }) {
  const navItems = [
    guide.intentKeywords?.length
      ? { href: '#guide-intents', label: 'من أين تبدأ؟', description: 'السؤال الأقرب لما تريد فهمه' }
      : null,
    guide.quickAnswers?.length
      ? { href: '#guide-answers', label: 'إجابات سريعة', description: 'جواب مختصر قبل الدخول في التفاصيل' }
      : null,
    guide.steps?.length
      ? { href: '#guide-steps', label: 'خطوات عملية', description: 'كيف تحوّل الفكرة إلى قرار' }
      : null,
    guide.comparison
      ? { href: '#guide-compare', label: 'مقارنة سريعة', description: 'جدول يختصر الفكرة في ثوانٍ' }
      : null,
    { href: '#guide-content', label: 'الشرح', description: 'تفصيل مبسط ومفيد بدل حشو نظري' },
    guide.checklist
      ? { href: '#guide-checklist', label: 'متى تحتاجه؟', description: 'هل هذه الصفحة مناسبة لك الآن؟' }
      : null,
    { href: '#guide-next', label: 'الخطوة التالية', description: 'انتقل إلى الحاسبة أو الدليل الأقرب' },
    { href: '#guide-faq', label: 'FAQ', description: 'أسئلة شائعة قصيرة وواضحة' },
  ].filter(Boolean);

  return (
    <main className="bg-base text-primary">
      <CalculatorHero
        badge={guide.badge || 'دليل عملي'}
        title={guide.metaTitle || guide.title}
        description={guide.description}
        accent={guide.accent || '#2563EB'}
        highlights={guide.highlights || [
          'شرح مباشر يوصلك إلى الفكرة بسرعة قبل الدخول في التفاصيل.',
          'مكتوبة بالعربية بشكل بسيط لتسهيل القرار لا لإرباكك بمصطلحات كثيرة.',
          'تنتهي دائماً بخطوة واضحة: افتح الحاسبة المناسبة أو انتقل إلى الدليل التالي.',
        ]}
      >
        <div className="calc-app">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">{guide.summary?.label || 'ابدأ من هنا'}</div>
            <div className="calc-metric-card__value">{guide.summary?.value || 'اقرأ الفكرة ثم انتقل إلى الأداة'}</div>
            <div className="calc-metric-card__note">
              {guide.summary?.note || 'الهدف من هذه الصفحة هو اختصار الفكرة ثم توجيهك إلى الخطوة العملية المناسبة داخل القسم.'}
            </div>
          </div>
        </div>
      </CalculatorHero>

      <CalculatorSection
        id="guide-map"
        eyebrow="خريطة الدليل"
        title="افهم الفكرة ثم خذ القرار"
        description="هذه الصفحة مبنية لتشرح بسرعة، ثم تقارن، ثم تفتح لك الطريق إلى الخطوة العملية التالية."
      >
        <CalculatorSectionNav items={navItems} />
      </CalculatorSection>

      {guide.intentKeywords?.length ? (
        <CalculatorSection
          id="guide-intents"
          eyebrow="من أين تبدأ؟"
          title="أسئلة يبدأ منها الناس عادة"
          description="إذا كان سؤالك يشبه إحدى هذه العبارات، فستجد في هذه الصفحة مدخلاً سريعاً قبل التفاصيل."
          subtle
        >
          <CalculatorIntentCloud title="أسئلة شائعة بصياغة مباشرة" items={guide.intentKeywords} />
        </CalculatorSection>
      ) : null}

      {guide.quickAnswers?.length ? (
        <CalculatorSection
          id="guide-answers"
          eyebrow="إجابات سريعة"
          title="ماذا يريد الزائر أن يعرف فوراً؟"
          description="قبل أن يقرأ كل شيء، يحتاج الزائر إلى جواب مختصر يؤكد له أنه وصل إلى الصفحة الصحيحة."
        >
          <CalculatorQuickAnswerGrid items={guide.quickAnswers} />
        </CalculatorSection>
      ) : null}

      {guide.steps?.length ? (
        <CalculatorSection
          id="guide-steps"
          eyebrow="خطوات عملية"
          title="حوّل الفكرة إلى قرار واضح"
          description="هذا الجزء يجعل الصفحة قابلة للتنفيذ، لا مجرد تعريفات عامة أو شرح متفرق."
          subtle
        >
          <div className="calc-guide-step-grid">
            {guide.steps.map((step, index) => (
              <article key={step.title} className="calc-surface-card calc-guide-step-card">
                <div className="p-6">
                  <div className="calc-guide-step-index">{String(index + 1).padStart(2, '0')}</div>
                  <h2 className="calc-card-title mt-4">{step.title}</h2>
                  <p className="calc-card-description mt-3">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </CalculatorSection>
      ) : null}

      {guide.comparison ? (
        <CalculatorSection
          id="guide-compare"
          eyebrow="مقارنة سريعة"
          title={guide.comparison.title}
          description={guide.comparison.description}
        >
          <div className="calc-table-wrap">
            <table className="calc-guide-table">
              <thead>
                <tr>
                  <th>النقطة</th>
                  {guide.comparison.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.comparison.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value) => (
                      <td key={`${row.label}-${value}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="guide-content"
        eyebrow="الشرح"
        title="المعلومة العملية أولاً"
        description="كل قسم هنا مكتوب ليعطيك فائدة عملية واضحة، لا ليطيل الشرح أكثر مما تحتاج."
      >
        <div className="calc-info-grid">
          {guide.sections.map((section) => (
            <article key={section.title} className="calc-surface-card">
              <div className="p-6">
                <h2 className="calc-card-title">{section.title}</h2>
                <p className="calc-card-description mt-3">{section.body}</p>
              </div>
            </article>
          ))}
        </div>
      </CalculatorSection>

      {guide.checklist ? (
        <CalculatorSection
          id="guide-checklist"
          eyebrow="هل هذه الصفحة لك؟"
          title={guide.checklist.title}
          description={guide.checklist.description}
          subtle
        >
          <CalculatorChecklist
            title="استخدم هذا الدليل عندما تكون النية واضحة لكن القرار ما زال ضبابياً"
            description="هذه الإشارات تساعد الزائر على التأكد أنه في الصفحة الصحيحة قبل أن ينتقل إلى الحاسبة."
            items={guide.checklist.items}
          />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="guide-next"
        eyebrow="الخطوة التالية"
        title="انتقل من الشرح إلى الأداة أو الدليل الأقرب"
        description="إذا انتهى دور الشرح هنا، فهذه هي الصفحات الأقرب لما قد تحتاجه بعده."
        subtle
      >
        <div className="calc-related-grid">
          {relatedCalculators.map((item) => (
            <article key={item.href} className="calc-surface-card calc-related-card card-hover">
              <div className="p-6">
                <h3 className="calc-card-title">{item.title}</h3>
                <p className="calc-card-description mt-2">{item.description}</p>
                <Link href={item.href} className="btn btn-primary--flat calc-button calc-inline-button mt-4">
                  افتح الحاسبة
                </Link>
              </div>
            </article>
          ))}
          {relatedGuides.map((item) => (
            <article key={item.href} className="calc-surface-card calc-related-card card-hover">
              <div className="p-6">
                <h3 className="calc-card-title">{item.title}</h3>
                <p className="calc-card-description mt-2">{item.description}</p>
                <Link href={item.href} className="btn btn-secondary calc-button calc-inline-button mt-4">
                  افتح الدليل
                </Link>
              </div>
            </article>
          ))}
          {relatedPages.map((item) => (
            <article key={item.href} className="calc-surface-card calc-related-card card-hover">
              <div className="p-6">
                <h3 className="calc-card-title">{item.title}</h3>
                <p className="calc-card-description mt-2">{item.description}</p>
                <Link href={item.href} className="btn btn-primary--flat calc-button calc-inline-button mt-4">
                  {item.ctaLabel || 'افتح الأداة'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="guide-faq"
        eyebrow="الأسئلة الشائعة"
        title="FAQ مختصر"
        description="إجابات سريعة على أكثر الأسئلة المرتبطة بهذه الصفحة."
      >
        <CalculatorFaqSection items={guide.faqItems} />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
