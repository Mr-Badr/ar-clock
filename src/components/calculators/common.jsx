import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Hash, Sparkles } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionDivider, SectionWrapper } from '@/components/shared/primitives';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';

const CALCULATOR_DISCOVERY_LINKS = [
  { href: '/calculators/age/calculator', title: 'كم عمري الآن؟', description: 'حاسبة العمر بالسنوات والأيام والثواني.' },
  { href: '/calculators/monthly-installment', title: 'كم قسط القرض الشهري؟', description: 'قارن التمويل والقسط وإجمالي الفوائد.' },
  { href: '/calculators/vat', title: 'كم الضريبة 15%؟', description: 'أضف الضريبة أو استخرجها من السعر الشامل.' },
  { href: '/calculators/percentage', title: 'كم تساوي النسبة المئوية؟', description: 'احسب الخصم والزيادة ونسبة التغيير.' },
  { href: '/economie/us-market-open', title: 'متى يفتح السوق الأمريكي اليوم؟', description: 'أداة اقتصادية حية بتوقيتك المحلي.' },
  { href: '/economie/gold-market-hours', title: 'هل الذهب مفتوح الآن؟', description: 'تحقق من ساعات تداول الذهب الآن.' },
];

export function CalculatorHero({
  badge,
  title,
  description,
  accent,
  highlights = [],
  children,
}) {
  return (
    <SectionWrapper
      id="calculator-hero"
      className="calc-shell calc-shell--hero pt-28 sm:pt-32"
      contentWidth="content-col"
      glow={<div className="calc-hero-glow" aria-hidden="true" />}
    >
      <div className="calc-section-frame calc-section-frame--hero" style={{ '--calc-accent': accent }}>
        <div className="calc-hero-grid">
          <div className="calc-hero-copy">
            <Badge className="calc-pill">
              <Sparkles size={14} />
              {badge}
            </Badge>
            <h1 className="calc-page-title">{title}</h1>
            <p className="calc-page-description">{description}</p>
            {highlights.length ? (
              <ul className="calc-highlight-list">
                {highlights.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="calc-hero-panel">{children}</div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function CalculatorSection({
  id,
  eyebrow,
  title,
  description,
  subtle = false,
  children,
}) {
  return (
    <SectionWrapper id={id} subtle={subtle} className="calc-shell" contentWidth="content-col">
      <div className="calc-section-frame">
        <div className="calc-section-head">
          {eyebrow ? <span className="calc-section-eyebrow">{eyebrow}</span> : null}
          <h2 className="calc-section-title">{title}</h2>
          {description ? <p className="calc-section-description">{description}</p> : null}
        </div>
        <div className="calc-section-body">
          {children}
        </div>
      </div>
    </SectionWrapper>
  );
}

export function CalculatorSectionNav({ items = [] }) {
  return (
    <div className="calc-anchor-grid">
      {items.map((item, index) => (
        <a key={item.href} href={item.href} className="calc-anchor-card card-nested">
          <span className="calc-anchor-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="calc-anchor-copy">
            <strong>{item.label}</strong>
            {item.description ? <span>{item.description}</span> : null}
          </span>
        </a>
      ))}
    </div>
  );
}

export function CalculatorIntentCloud({ title = 'عبارات البحث المستهدفة', items = [] }) {
  return (
    <Card className="calc-surface-card calc-intent-panel">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="calc-chip-list">
        {items.map((item) => (
          <span key={item} className="calc-search-chip">
            <Hash size={14} />
            {item}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}

export function CalculatorQuickAnswerGrid({ items = [] }) {
  return (
    <div className="calc-query-grid">
      {items.map((item) => (
        <Card key={item.question} className="calc-surface-card calc-query-card card-hover">
          <CardHeader>
            <CardTitle className="calc-card-title">{item.question}</CardTitle>
            {item.description ? (
              <CardDescription className="calc-card-description">
                {item.description}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="calc-card-copy">
            <p>{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CalculatorChecklist({ title, description, items = [], content = "" }) {
  return (
    <Card className="calc-surface-card card-hover">
      <CardHeader>
        <CardTitle className="calc-card-title">{title}</CardTitle>
        {description ? (
          <CardDescription className="calc-card-description">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        {content ? 
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6rem' }}>{content}</p> : null}
        <ul className="calc-checklist">
          {items.map((item) => (
            <li key={item}>
              <CheckCircle2 size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function CalculatorStoryBand({ title, description, items = [] }) {
  return (
    <div className="calc-story-band">
      <div className="calc-story-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="calc-story-points">
        {items.map((item) => (
          <div key={item.label} className="calc-story-point card-nested">
            <strong>{item.label}</strong>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalculatorInfoGrid({ items = [] }) {
  return (
    <div>
      {items.map((item) => (
        <Card 
            key={item.title} 
            className="rounded-2xl p-5 sm:p-6" 
            style={{ height: 'stretch', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', margin: '1rem 0' }}
          >
          <CardHeader>
            <CardTitle className="calc-card-title">{item.title}</CardTitle>
            {item.description ? (
              <CardDescription className="calc-card-description">
                {item.description}
              </CardDescription>
            ) : null}
          </CardHeader>
          {item.content ? (
            <CardContent className="calc-card-copy">
              {item.content}
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

export function CalculatorFaqSection({ items = [] }) {
  return (
    <div>
      <Card className="calc-surface-card calc-faq-card">
        <CardContent className="pt-2">
          <Accordion type="single" collapsible>
            {items.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className="calc-faq-trigger">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="calc-faq-content">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export function RelatedCalculators({ currentSlug }) {
  const links = CALCULATOR_ROUTES.filter((item) => item.slug !== currentSlug);

  return (
    <div className="calc-related-grid">
      {links.map((item) => (
        <Card key={item.slug} className="calc-surface-card calc-related-card card-hover">
          <CardHeader>
            <CardTitle className="calc-card-title">{item.title}</CardTitle>
            <CardDescription className="calc-card-description">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="btn btn-surface btn-sm calc-button calc-inline-button">
              <Link href={item.href}>
                افتح الحاسبة
                <ArrowLeft size={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CalculatorHubGrid() {
  return (
    <div className="calc-hub-grid">
      {CALCULATOR_ROUTES.map((item) => (
        <Card
          key={item.slug}
          className="calc-surface-card calc-hub-card card-hover"
          style={{ '--calc-accent': item.accent, '--calc-accent-soft': item.accentSoft }}
        >
          <CardHeader>
            <Badge className="calc-pill calc-pill--subtle">{item.badge}</Badge>
            <CardTitle className="calc-card-title">{item.title}</CardTitle>
            <CardDescription className="calc-card-description">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="calc-hub-card__actions">
            <Button asChild variant="ghost" className="btn btn-primary--flat calc-button calc-inline-button">
              <Link href={item.href}>
                افتح الحاسبة
                <ArrowLeft size={16} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CalculatorFooterCta() {
  return (
    <>
      <SectionDivider />
      <SectionWrapper id="calculator-footer" className="calc-shell" contentWidth="content-col">
        <div className="calc-section-frame">
          <Card className="calc-surface-card calc-cta-card">
            <CardHeader>
              <CardTitle className="calc-section-title">
                حاسبات مترابطة بدل صفحات معزولة
              </CardTitle>
              <CardDescription className="calc-card-description">
                هذا القسم بُني كحزمة أدوات عملية: احسب مستحقاتك، ثم قارن القسط، ثم راجع
                الضريبة أو النسبة المئوية من نفس المكان.
              </CardDescription>
          </CardHeader>
          <CardContent className="calc-cta-actions">
            <Button asChild variant="ghost" className="btn btn-primary--flat calc-button">
              <Link href="/calculators">استعرض كل الحاسبات</Link>
            </Button>
            <Button asChild variant="ghost" className="btn btn-secondary calc-button">
              <Link href="/contact">أرسل ملاحظتك أو اقتراحك</Link>
            </Button>
          </CardContent>
          <CardContent>
            <div className="calc-related-grid">
              {CALCULATOR_DISCOVERY_LINKS.map((item) => (
                <Card key={item.href} className="calc-surface-card calc-related-card card-hover">
                  <CardHeader>
                    <CardTitle className="calc-card-title">{item.title}</CardTitle>
                    <CardDescription className="calc-card-description">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="btn btn-primary--flat calc-button calc-inline-button">
                      <Link href={item.href}>
                        افتح الصفحة
                        <ArrowLeft size={16} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </>
  );
}
