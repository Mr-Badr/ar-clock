import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Badge } from '@/components/ui/badge';
import { SectionWrapper } from '@/components/shared/primitives';
import ReviewMeta from '@/components/site/ReviewMeta';
import SourcesPanel from '@/components/site/SourcesPanel';
import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';

const CALCULATOR_TRUST_ITEMS = [
  'مجاني بدون تسجيل',
  'المدخلات لا تحتاج بيانات شخصية',
  'نوضح حدود النتيجة قبل القرار',
];

const TOOL_LAUNCHER_THEMES = {
  blue: {
    accent: 'var(--blue)',
    accentText: 'var(--blue-text)',
  },
  green: {
    accent: 'var(--green)',
    accentText: 'var(--green-text)',
  },
  amber: {
    accent: 'var(--amber)',
    accentText: 'var(--amber-text)',
  },
};

function formatSequenceLabel(index) {
  return String(index + 1).padStart(2, '0');
}

function isValidResourceItem(item) {
  return Boolean(item?.href && item?.title);
}

function getToolLauncherTheme(theme) {
  if (typeof theme === 'string' && TOOL_LAUNCHER_THEMES[theme]) {
    return TOOL_LAUNCHER_THEMES[theme];
  }

  return TOOL_LAUNCHER_THEMES.blue;
}

function getToolLauncherPanelStyle(theme) {
  return {
    borderColor: `color-mix(in srgb, ${theme.accent} 24%, var(--border-default))`,
    background: `radial-gradient(circle at 86% 4%, color-mix(in srgb, ${theme.accent} 22%, transparent), transparent 24rem), linear-gradient(145deg, color-mix(in srgb, var(--bg-surface-1) 92%, transparent), color-mix(in srgb, var(--bg-base) 78%, transparent))`,
    boxShadow: `0 24px 80px color-mix(in srgb, ${theme.accent} 11%, transparent)`,
  };
}

function getToolLauncherCardStyle(theme) {
  return {
    borderColor: `color-mix(in srgb, ${theme.accent} 34%, var(--border-default))`,
    background: `linear-gradient(160deg, color-mix(in srgb, ${theme.accent} 17%, transparent), color-mix(in srgb, var(--bg-surface-1) 92%, transparent) 58%, color-mix(in srgb, var(--bg-base) 72%, transparent))`,
  };
}

function getToolLauncherChipStyle(theme) {
  return {
    borderColor: `color-mix(in srgb, ${theme.accent} 36%, var(--border-default))`,
    background: `color-mix(in srgb, ${theme.accent} 12%, transparent)`,
    color: theme.accentText,
  };
}

function getToolLauncherSoftStyle(theme) {
  return {
    borderColor: `color-mix(in srgb, ${theme.accent} 18%, var(--border-default))`,
    background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 6%, transparent), transparent 62%), color-mix(in srgb, var(--bg-surface-1) 80%, transparent)`,
  };
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
    finance: ['salary', 'zakat', 'investment', 'net-salary', 'vat', 'percentage', 'annual-leave', 'monthly-installment', 'end-of-service-benefits', 'iqama', 'electricity-bill', 'inheritance'],
    building: ['vat', 'percentage', 'monthly-installment'],
    age: ['sleep', 'bedtime', 'retirement'],
    sleep: ['age-calculator', 'sleep', 'time-now'],
    'personal-finance': ['net-salary', 'salary', 'monthly-installment', 'end-of-service-benefits', 'zakat', 'investment'],
    health: ['bmi', 'fasting', 'pregnancy', 'pregnancy-weeks', 'ovulation', 'age-calculator'],
    education: ['gpa', 'gpa-to-percent', 'percentage'],
  };

  return complementSlugsByCluster[cluster] || ['iqama', 'net-salary', 'electricity-bill', 'inheritance'];
}

function buildRelatedCalculatorLinks(currentSlug) {
  const currentRoute = CALCULATOR_ROUTES.find((item) => item.slug === currentSlug);
  const currentCluster = currentRoute?.cluster;
  const currentHub = currentCluster
    ? CALCULATOR_HUBS.find((hub) => hub.slug === currentCluster)
    : null;
  const tag = (item, kind, reason) => (item ? { ...item, kind, reason } : null);

  const hubLink = currentHub && currentHub.href !== currentRoute?.href
    ? tag(
        {
          href: currentHub.href,
          title: currentHub.title,
          description: currentHub.description,
          badge: currentHub.badge,
        },
        'hub',
        'المسار الكامل',
      )
    : null;
  const clusterRoutes = (currentCluster
    ? CALCULATOR_ROUTES.filter((item) => item.cluster === currentCluster && item.slug !== currentSlug)
    : []
  ).map((item) => tag(item, 'sibling', 'نفس المسار'));
  const complementRoutes = getComplementSlugs(currentCluster)
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && item.slug !== currentSlug)
    .map((item) => tag(item, 'complement', 'أداة مكمّلة'));
  const fallbackRoutes = CALCULATOR_ROUTES
    .filter((item) => item.slug !== currentSlug)
    .map((item) => tag(item, 'more', 'أداة أخرى'));

  return getUniqueCalculatorLinks([
    hubLink,
    ...clusterRoutes,
    ...complementRoutes,
    ...fallbackRoutes,
  ]).slice(0, 5);
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

export function CalculatorSources({ sources }) {
  if (!sources?.length) return null;
  return (
    <SectionWrapper className="calc-shell" subtle>
      <div className="calc-section-frame">
        <SourcesPanel sources={sources} />
      </div>
    </SectionWrapper>
  );
}

export function CalculatorHero({
  badge,
  title,
  description,
  highlights,
  children,
  reviewedAt,
  reviewedBy,
}) {
  const safeHighlights = Array.isArray(highlights) ? highlights : [];

  return (
    <>
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
      <ReviewMeta
        authorId="badr"
        reviewedAt={reviewedAt || '2026-06-01'}
        reviewedBy={reviewedBy}
      />
    </>
  );
}

export function CalculatorSection({
  id,
  eyebrow,
  title,
  description,
  subtle,
  showAdBefore = false,
  children,
}) {
  const isSubtle = subtle === true;

  return (
    <>
      {showAdBefore ? <AdTopBanner slotId="top-calculator-tool" /> : null}
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
    </>
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
          </div>
          <div className="calc-editorial-card__copy">
            <h3 className="calc-card-title">{item.title}</h3>
            {item.description ? (
              <p className="calc-card-description">
                {item.description}
              </p>
            ) : null}
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

export function CalculatorPolicyNotice({ title, description, points, links }) {
  const safePoints = Array.isArray(points) ? points : [];
  const safeLinks = Array.isArray(links) ? links.filter((item) => item?.href && item?.label) : [];

  return (
    <aside className="calc-policy-notice" aria-label={title || 'تنبيه مهم'}>
      <div className="calc-policy-notice__head">
        <span className="calc-policy-notice__icon" aria-hidden="true">
          <CheckCircle2 size={18} />
        </span>
        <div>
          <h3 className="calc-card-title">{title}</h3>
          {description ? <p className="calc-card-description">{description}</p> : null}
        </div>
      </div>
      {safePoints.length ? (
        <ul className="calc-policy-notice__list">
          {safePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      {safeLinks.length ? (
        <div className="calc-policy-notice__links" aria-label="روابط الشفافية">
          {safeLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
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
      <Accordion type="single" collapsible className="calc-faq-accordion">
        {safeItems.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`} className="calc-faq-item">
            <AccordionTrigger className="calc-faq-trigger">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="calc-faq-content">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AdInArticle slotId="mid-calculator-faq" />
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

  const [featured, ...rest] = links;

  return (
    <div className="calc-related-panel">
      <div className="calc-related-panel__head">
        <span className="calc-section-eyebrow">لا تتوقف عند رقم واحد</span>
        <h3 className="calc-card-title">حاسبات تكمل نفس القرار</h3>
        <p className="calc-card-description">
          {currentHub
            ? `أدوات قريبة من مسار ${currentHub.title} تساعدك على مقارنة الرقم أو فهمه قبل الاعتماد.`
            : 'اختر الأداة الأقرب لنفس السؤال حتى لا ترجع إلى الفهرس وتبدأ من الصفر.'}
        </p>
      </div>

      <Link href={featured.href} className="calc-related-featured">
        <span className="calc-related-featured__reason">{featured.reason || 'الأنسب الآن'}</span>
        <strong className="calc-related-featured__title">{featured.title}</strong>
        {featured.description ? (
          <span className="calc-related-featured__desc">{featured.description}</span>
        ) : null}
        <span className="calc-related-featured__cta">
          {featured.kind === 'hub' ? 'افتح المسار الكامل' : 'افتح الحاسبة'}
          <ArrowLeft size={16} aria-hidden="true" />
        </span>
      </Link>

      {rest.length ? (
        <ul className="calc-related-rows" aria-label="أدوات أخرى مرتبطة">
          {rest.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="calc-related-row">
                <span className="calc-related-row__reason">{item.reason || 'أداة أخرى'}</span>
                <span className="calc-related-row__title">{item.title}</span>
                <ArrowLeft className="calc-related-row__arrow" size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <AdMultiplex slotId="end-calculator-related" />
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

export function CalculatorToolLauncher({
  items,
  ariaLabel,
  badge,
  featuredLabel,
  note,
  theme,
}) {
  const safeItems = Array.isArray(items) ? items.filter(isValidResourceItem).slice(0, 8) : [];
  const resolvedTheme = getToolLauncherTheme(theme);
  const featuredItem = safeItems[0];
  const supportingItems = safeItems.slice(1);
  const resolvedAriaLabel = ariaLabel || 'اختر الحاسبة المناسبة';
  const resolvedBadge = badge || `${safeItems.length} مسارات عملية`;
  const resolvedFeaturedLabel = featuredLabel || featuredItem?.label || 'المسار المقترح';

  if (!safeItems.length || !featuredItem) {
    return (
      <CalculatorEmptyState
        title="لا توجد حاسبات كافية لهذا القسم الآن"
        description="تابع الحاسبة الرئيسية أولاً، ثم ارجع إلى فهرس الحاسبات إذا احتجت مساراً مختلفاً."
      />
    );
  }

  return (
    <div
      className="relative mx-auto grid w-full max-w-5xl gap-3 overflow-hidden rounded-[1.35rem] border p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]"
      style={getToolLauncherPanelStyle(resolvedTheme)}
      aria-label={resolvedAriaLabel}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-80" style={{ background: `linear-gradient(90deg, transparent, ${resolvedTheme.accent}, transparent)` }} />
      <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
        <span
          className="inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-extrabold"
          style={getToolLauncherChipStyle(resolvedTheme)}
        >
          {resolvedBadge}
        </span>
        <span className="text-xs font-bold text-muted sm:text-sm">
          اختر حسب نية المستخدم الآن، لا حسب اسم الحاسبة فقط.
        </span>
      </div>

      <Link
        href={featuredItem.href}
        className="group relative grid min-h-[18rem] content-between overflow-hidden rounded-[1.1rem] border p-5 text-start text-inherit no-underline transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:p-6"
        style={getToolLauncherCardStyle(resolvedTheme)}
      >
        <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl" style={{ background: resolvedTheme.accent }} />
        <span className="relative flex flex-wrap items-center justify-between gap-3">
          <span
            className="inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-extrabold"
            style={getToolLauncherChipStyle(resolvedTheme)}
          >
            {resolvedFeaturedLabel}
          </span>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border text-sm font-black" style={getToolLauncherChipStyle(resolvedTheme)}>
            {featuredItem.iconLabel || '01'}
          </span>
        </span>

        <span className="relative grid gap-3">
          <strong className="text-2xl font-black leading-snug text-primary sm:text-3xl">
            {featuredItem.title}
          </strong>
          <span className="max-w-[58ch] text-sm leading-8 text-secondary sm:text-base">
            {featuredItem.description}
          </span>
        </span>

        <span className="relative inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold text-primary transition group-hover:border-blue-400">
          {featuredItem.ctaLabel || 'ابدأ الحساب'}
          <ArrowLeft size={16} aria-hidden="true" />
        </span>
      </Link>

      <div className="grid gap-3" role="list" aria-label="حاسبات أخرى في نفس القسم">
        {supportingItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="group grid min-h-[6.2rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[1rem] border p-3 text-start text-inherit no-underline transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:p-4"
            style={getToolLauncherSoftStyle(resolvedTheme)}
            role="listitem"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl border text-xs font-black" style={getToolLauncherChipStyle(resolvedTheme)}>
              {item.iconLabel || formatSequenceLabel(index + 1)}
            </span>
            <span className="grid min-w-0 gap-1">
              <span className="inline-flex w-fit rounded-full bg-surface-2 px-2 py-1 text-[0.68rem] font-extrabold text-muted">
                {item.label || 'مسار متخصص'}
              </span>
              <strong className="text-[0.98rem] font-extrabold leading-6 text-primary">
                {item.title}
              </strong>
              <span className="hidden text-sm leading-7 text-secondary sm:block">
                {item.description}
              </span>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-default text-muted transition group-hover:text-primary" aria-hidden="true">
              <ArrowLeft size={16} />
            </span>
          </Link>
        ))}
      </div>

      {note ? (
        <p
          className="m-0 rounded-[1rem] border border-dashed border-default p-3 text-sm leading-8 text-secondary lg:col-span-2"
          style={{ background: 'color-mix(in srgb, var(--bg-base) 25%, transparent)' }}
        >
          {note}
        </p>
      ) : null}
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
