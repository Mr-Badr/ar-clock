import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SectionWrapper } from '@/components/shared/primitives';
import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';

const CALCULATOR_HERO_STEPS = [
  'اختر الحالة الأقرب لسؤالك',
  'أدخل الرقم أو جرّب مثالاً سريعاً',
  'راجع النتيجة والتفصيل قبل الاعتماد',
];

const CALCULATOR_TRUST_ITEMS = [
  'مجاني بدون تسجيل',
  'المدخلات لا تحتاج بيانات شخصية',
  'نوضح حدود النتيجة قبل القرار',
];

function formatSequenceLabel(index) {
  return String(index + 1).padStart(2, '0');
}

function isValidResourceItem(item) {
  return Boolean(item?.href && item?.title);
}

function getUniqueCalculatorLinks(items) {
  const seenHrefs = new Set();
  return items.filter((item) => {
    if (!item?.href || !item?.title || seenHrefs.has(item.href)) return false;
    seenHrefs.add(item.href);
    return true;
  });
}

function getComplementSlugs(cluster) {
  const complementSlugsByCluster = {
    finance: ['personal-finance', 'emergency-fund', 'building'],
    building: ['vat', 'percentage', 'monthly-installment'],
    age: ['sleep', 'bedtime', 'retirement'],
    sleep: ['age-calculator', 'sleep', 'time-now'],
    'personal-finance': ['monthly-installment', 'percentage', 'vat'],
  };

  return complementSlugsByCluster[cluster] || ['monthly-installment', 'percentage', 'vat'];
}

function buildRelatedCalculatorLinks(currentSlug) {
  const currentRoute = CALCULATOR_ROUTES.find((item) => item.slug === currentSlug);
  const currentCluster = currentRoute?.cluster;
  const currentHub = currentCluster
    ? CALCULATOR_HUBS.find((hub) => hub.slug === currentCluster)
    : null;
  const hubLink = currentHub && currentHub.href !== currentRoute?.href
    ? {
        href: currentHub.href,
        title: currentHub.title,
        description: currentHub.description,
        badge: currentHub.badge,
      }
    : null;
  const clusterRoutes = currentCluster
    ? CALCULATOR_ROUTES.filter((item) => item.cluster === currentCluster && item.slug !== currentSlug)
    : [];
  const complementRoutes = getComplementSlugs(currentCluster)
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && item.slug !== currentSlug);
  const fallbackRoutes = CALCULATOR_ROUTES.filter((item) => item.slug !== currentSlug);

  return getUniqueCalculatorLinks([
    hubLink,
    ...clusterRoutes,
    ...complementRoutes,
    ...fallbackRoutes,
  ]).slice(0, 4);
}

function CalculatorEmptyState({ title, description }) {
  return (
    <div className="calc-resource-stack" role="status">
      <div className="calc-resource-link calc-resource-link--soft">
        <span className="calc-resource-link__copy">
          <strong className="calc-card-title">{title}</strong>
          <span className="calc-card-description">{description}</span>
        </span>
      </div>
    </div>
  );
}

export function CalculatorHero({
  badge,
  title,
  description,
  highlights,
  children,
}) {
  const safeHighlights = Array.isArray(highlights) ? highlights : [];

  return (
    <SectionWrapper
      id="calculator-hero"
      className="calc-shell calc-shell--hero pt-28 sm:pt-32"
    >
      <div className="calc-section-frame calc-section-frame--hero">
        <div className="calc-hero-grid">
          <div className="calc-hero-copy">
            <Badge className="calc-pill">
              {badge}
            </Badge>
            <h1 className="calc-page-title">{title}</h1>
            <p className="calc-page-description">{description}</p>
          </div>
          <div className="calc-hero-panel">
            <ol className="calc-use-flow" aria-label="طريقة استخدام الحاسبة">
              {CALCULATOR_HERO_STEPS.map((item, index) => (
                <li key={item}>
                  <span>{formatSequenceLabel(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
            {children}
          </div>
          <div className="calc-hero-support">
            {safeHighlights.length ? (
              <ul className="calc-highlight-list">
                {safeHighlights.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="calc-hero-trust" aria-label="معلومات الثقة والخصوصية">
              {CALCULATOR_TRUST_ITEMS.map((item) => (
                <span key={item}>{item}</span>
              ))}
              <Link href="/privacy">سياسة الخصوصية</Link>
            </div>
          </div>
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
  subtle,
  children,
}) {
  const isSubtle = subtle === true;

  return (
    <SectionWrapper id={id} subtle={isSubtle} className="calc-shell">
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

export function CalculatorDecisionTable({ columns, rows }) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  if (!safeColumns.length || !safeRows.length) {
    return (
      <CalculatorEmptyState
        title="لا توجد مقارنة كافية الآن"
        description="استخدم الحاسبة الرئيسية أولاً، ثم راجع الشرح الموجود في الصفحة قبل الاعتماد على النتيجة."
      />
    );
  }

  return (
    <div className="calc-decision-table-wrap">
      <table className="calc-decision-table">
        <thead>
          <tr>
            {safeColumns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row, rowIndex) => (
            <tr key={row.key || `calc-decision-row-${rowIndex}`}>
              {(Array.isArray(row.cells) ? row.cells : []).map((cell, cellIndex) => (
                <td key={`${row.key || rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="calc-decision-cards" aria-label="ملخص المقارنة">
        {safeRows.map((row, rowIndex) => (
          <article key={row.key || `calc-decision-card-${rowIndex}`} className="calc-decision-card">
            <span className="calc-decision-card__index">{formatSequenceLabel(rowIndex)}</span>
            {(Array.isArray(row.cells) ? row.cells : []).map((cell, cellIndex) => (
              <span key={`${row.key || rowIndex}-card-${cellIndex}`} className="calc-decision-card__item">
                <strong>{safeColumns[cellIndex] || 'الاختيار'}</strong>
                <span>{cell}</span>
              </span>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}

export function CalculatorInfoGrid({ items }) {
  const safeItems = Array.isArray(items) ? items : [];

  if (!safeItems.length) {
    return (
      <CalculatorEmptyState
        title="لا توجد بطاقات شرح كافية الآن"
        description="لم تصلنا عناصر تعليمية مناسبة لهذا القسم. لا تعتمد على رقم الحاسبة وحده إذا كان القرار مالياً أو قانونياً أو عالي الأثر."
      />
    );
  }

  return (
    <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={safeItems.length}>
      {safeItems.map((item, index) => (
        <article
          key={item.title}
          className={`calc-editorial-card${index === 0 ? ' calc-editorial-card--lead' : ''}`}
          role="listitem"
        >
          <div className="calc-editorial-card__meta">
            <span className="calc-editorial-card__index">{formatSequenceLabel(index)}</span>
            {item.description ? (
              <p className="calc-card-description">
                {item.description}
              </p>
            ) : null}
          </div>
          <div className="calc-editorial-card__copy">
            <h3 className="calc-card-title">{item.title}</h3>
            {item.content ? (
              <div className="calc-card-copy">
                {item.content}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CalculatorEditorialArticle({ eyebrow, title, lead, paragraphs, points }) {
  const safeParagraphs = Array.isArray(paragraphs) ? paragraphs : [];
  const safePoints = Array.isArray(points) ? points : [];

  return (
    <article className="calc-editorial-article">
      <div className="calc-editorial-article__head">
        {eyebrow ? <span className="calc-section-eyebrow">{eyebrow}</span> : null}
        <h2 className="calc-section-title">{title}</h2>
        {lead ? <p className="calc-section-description">{lead}</p> : null}
      </div>

      <div className="calc-editorial-article__body">
        {safeParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {safePoints.length ? (
        <ul className="calc-editorial-article__points">
          {safePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function CalculatorFaqSection({ items }) {
  const safeItems = Array.isArray(items) ? items : [];

  if (!safeItems.length) {
    return (
      <CalculatorEmptyState
        title="لا توجد أسئلة شائعة كافية الآن"
        description="اقرأ وصف الصفحة ونتيجة الحاسبة أولاً، ثم استخدم صفحة التواصل إذا وجدت سؤالاً مهماً يجب إضافته."
      />
    );
  }

  return (
    <div>
      <Card className="calc-surface-card calc-faq-card">
        <CardContent className="pt-2">
          <Accordion type="single" collapsible>
            {safeItems.map((item, index) => (
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
  const currentRoute = CALCULATOR_ROUTES.find((item) => item.slug === currentSlug);
  const links = buildRelatedCalculatorLinks(currentSlug);
  const currentHub = currentRoute?.cluster
    ? CALCULATOR_HUBS.find((hub) => hub.slug === currentRoute.cluster)
    : null;

  if (!links.length) {
    return (
      <CalculatorEmptyState
        title="لا توجد حاسبات مرتبطة كافية الآن"
        description="ارجع إلى قسم الحاسبات الرئيسي لاختيار مسار آخر، أو أكمل قراءة الصفحة الحالية قبل الانتقال."
      />
    );
  }

  return (
    <div className="calc-related-panel">
      <div className="calc-related-panel__head">
        <span className="calc-section-eyebrow">لا تتوقف عند رقم واحد</span>
        <div>
          <h3 className="calc-card-title">حاسبات تكمل نفس القرار</h3>
          <p className="calc-card-description">
            {currentHub
              ? `هذه روابط من مسار ${currentHub.title} مع أدوات قريبة تساعدك على مقارنة الرقم أو فهمه قبل الاعتماد.`
              : 'اختر حاسبة قريبة من نفس السؤال حتى لا ترجع إلى الفهرس وتبدأ من الصفر.'}
          </p>
        </div>
        <span className="calc-related-panel__count">{links.length} اختيارات</span>
      </div>
      <div className="calc-resource-stack calc-resource-stack--cards calc-related-grid" data-count={links.length}>
      {links.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`calc-resource-link calc-resource-link--card${index === 0 ? ' calc-resource-link--primary' : ''}`}
        >
          <span className="calc-resource-link__index">{formatSequenceLabel(index)}</span>
          <span className="calc-resource-link__copy">
            <strong className="calc-card-title">{item.title}</strong>
            <span className="calc-card-description">{item.description}</span>
          </span>
          <span className="calc-resource-link__cta">
            {item.href === currentHub?.href ? 'افتح المسار الكامل' : 'افتح الحاسبة'}
            <ArrowLeft size={16} aria-hidden="true" />
          </span>
        </Link>
      ))}
      </div>
    </div>
  );
}

export function CalculatorResourceLinks({ items, buttonLabel, variant }) {
  const safeItems = Array.isArray(items) ? items.filter(isValidResourceItem).slice(0, 5) : [];
  const resolvedButtonLabel = buttonLabel || 'افتح المسار المناسب';
  const resolvedVariant = variant ?? 'list';
  if (!safeItems.length) {
    return (
      <CalculatorEmptyState
        title="لا توجد مسارات مناسبة لهذا الجزء الآن"
        description="لم تصلنا مسارات كافية لعرض اقتراح موثوق. تابع الحاسبة الحالية، ثم ارجع إلى قسم الحاسبات إذا احتجت اختيار أداة أخرى."
      />
    );
  }
  const isCardVariant = resolvedVariant === 'cards';

  return (
    <div
      className={`calc-resource-stack${isCardVariant ? ' calc-resource-stack--cards' : ''}`}
      data-count={safeItems.length}
    >
      {safeItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`calc-resource-link${isCardVariant ? ' calc-resource-link--card' : ''}${index === 0 ? ' calc-resource-link--primary' : ''}`}
        >
          <span className="calc-resource-link__index">{formatSequenceLabel(index)}</span>
          <span className="calc-resource-link__copy">
            <strong className="calc-card-title">{item.title}</strong>
            <span className="calc-card-description">{item.description}</span>
          </span>
          <span className="calc-resource-link__cta">
            {item.ctaLabel || resolvedButtonLabel}
            <ArrowLeft size={16} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function CalculatorHubGrid() {
  const safeRoutes = Array.isArray(CALCULATOR_ROUTES) ? CALCULATOR_ROUTES : [];

  if (!safeRoutes.length) {
    return (
      <CalculatorEmptyState
        title="لا توجد حاسبات جاهزة للعرض الآن"
        description="لم تصلنا بيانات الأرشيف الكامل. استخدم المسارات الرئيسية في الصفحة أو جرّب لاحقاً عند اكتمال الفهرس."
      />
    );
  }

  return (
    <div className="calc-hub-grid">
      {safeRoutes.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          className="calc-hub-link"
        >
          <span className="calc-hub-link__head">
            <Badge className="calc-pill calc-pill--subtle">{item.badge}</Badge>
            <span className="calc-hub-link__eyebrow">{item.shortLabel}</span>
          </span>
          <span className="calc-hub-link__title">{item.title}</span>
          <span className="calc-hub-link__description">{item.description}</span>
          <span className="calc-hub-link__cta">
            افتح الحاسبة
            <ArrowLeft size={16} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
  );
}
