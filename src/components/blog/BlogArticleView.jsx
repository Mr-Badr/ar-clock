import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Calculator,
  Clock3,
  ExternalLink,
  FileText,
  HelpCircle,
  ListChecks,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import AdTopBanner from '@/components/ads/AdTopBanner';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBlogArticleLeadParagraphs,
  buildBlogArticlePracticalParagraphs,
  countBlogArticleWords,
  estimateBlogArticleReadingMinutes,
  splitBlogArticleBodyParagraphs,
} from '@/lib/blog/read-time';
import { getDefaultAuthor } from '@/data/site/authors';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

import styles from './BlogArticleView.module.css';

const ARABIC_LIST_FORMATTER = new Intl.ListFormat('ar', {
  style: 'long',
  type: 'conjunction',
});
const BLOG_ARTICLE_DATE_FORMATTER = new Intl.DateTimeFormat('ar-u-ca-gregory', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function cleanInlineText(value) {
  return String(value || '')
    .trim()
    .replace(/[.،؛\s]+$/u, '');
}

function formatArabicList(items) {
  const normalizedItems = items.map((item) => cleanInlineText(item)).filter(Boolean);

  if (!normalizedItems.length) {
    return '';
  }

  if (normalizedItems.length === 1) {
    return normalizedItems[0];
  }

  return ARABIC_LIST_FORMATTER.format(normalizedItems);
}

function buildGuideNavItems(guide) {
  const longformCount = (guide.infoItems?.length || 0) + (guide.sections?.length || 0);
  const hasComparison = Array.isArray(guide.comparison?.columns)
    && guide.comparison.columns.length > 0
    && Array.isArray(guide.comparison?.rows)
    && guide.comparison.rows.length > 0;
  const navItems = [
    guide.quickAnswers?.length ? { href: '#guide-answer-first', label: 'جواب مباشر' } : null,
    { href: '#guide-decision-rules', label: 'قاعدة القرار' },
    guide.steps?.length ? { href: '#guide-steps', label: 'خطوات عملية' } : null,
    hasComparison ? { href: '#guide-compare', label: 'مقارنة سريعة' } : null,
    longformCount ? { href: '#guide-content', label: 'الشرح العملي' } : null,
    { href: '#guide-practical', label: 'تطبيق عملي' },
    guide.sourceLinks?.length ? { href: '#guide-sources', label: 'المراجع' } : null,
    { href: '#guide-next', label: 'أداة أو صفحة مكملة' },
    guide.faqItems?.length ? { href: '#guide-faq', label: 'أسئلة أخيرة' } : null,
  ].filter(Boolean);

  return navItems.slice(0, 6);
}

function buildGuideHighlights(guide) {
  if (Array.isArray(guide.highlights) && guide.highlights.length > 0) {
    return guide.highlights.slice(0, 4);
  }

  if (Array.isArray(guide.quickAnswers) && guide.quickAnswers.length > 0) {
    return guide.quickAnswers
      .map((item) => item.question || item.title || '')
      .filter(Boolean)
      .slice(0, 4);
  }

  return [
    'جواب عربي مباشر يبدأ من السؤال الحقيقي قبل التفاصيل.',
    'شرح عملي يوضح متى تستخدم الفكرة ومتى لا تكفي وحدها.',
    'أمثلة وسياق يساعدانك على تطبيق المعلومة لا حفظها فقط.',
  ];
}

function buildQuickFacts(guide) {
  const readingMinutes = estimateBlogArticleReadingMinutes(guide);
  const longformCount = (guide.infoItems?.length || 0) + (guide.sections?.length || 0);

  return [
    {
      label: 'مدة القراءة',
      value: `${readingMinutes} دقائق`,
      Icon: Clock3,
    },
    {
      label: 'عدد المحاور',
      value: `${longformCount} محاور`,
      Icon: FileText,
    },
    guide.quickAnswers?.length
      ? {
      label: 'إجابات سريعة',
      value: `${guide.quickAnswers?.length || 0} إجابات`,
      Icon: HelpCircle,
        }
      : null,
    guide.steps?.length
      ? {
      label: 'خطوات عملية',
      value: `${guide.steps?.length || 0} خطوات`,
      Icon: ListChecks,
        }
      : null,
    guide.sourceLinks?.length
      ? {
          label: 'مراجع للتحقق',
          value: `${guide.sourceLinks.length} مصادر`,
          Icon: ShieldCheck,
        }
      : null,
  ].filter(Boolean).slice(0, 4);
}

function buildArticleCards(relatedGuides) {
  return (relatedGuides || []).map((item) => ({
    href: item.href,
    title: item.title,
    description: item.description,
    badge: item.badge || 'مقال مرتبط',
  })).slice(0, 2);
}

function buildActionCards(relatedCalculators, relatedPages) {
  const calculatorCards = (relatedCalculators || []).map((item) => ({
    href: item.href,
    title: item.title,
    description: item.description,
    ctaLabel: 'جرّب الأداة الآن',
    badge: 'أداة مرتبطة',
    Icon: Calculator,
  }));
  const pageCards = (relatedPages || []).map((item) => ({
    href: item.href,
    title: item.title,
    description: item.description,
    ctaLabel: item.ctaLabel || 'انتقل للخطوة التالية',
    badge: 'صفحة مكملة',
    Icon: FileText,
  }));

  return [...calculatorCards, ...pageCards].slice(0, 3);
}

function buildIntroParagraphs(guide) {
  const paragraphs = [
    guide?.description,
    guide?.summary?.note,
    guide?.checklist?.description,
  ].filter(Boolean);

  return Array.from(new Set(paragraphs)).slice(0, 3);
}

function buildTopicGuides(topicGuides, currentGuideSlug) {
  return (topicGuides || [])
    .filter((item) => item?.slug && item.slug !== currentGuideSlug)
    .map((item) => ({
      href: item.href,
      title: item.title,
      description: item.description,
      badge: item.badge || item.hubTitle || 'مقال مرتبط',
    }))
    .slice(0, 3);
}

function buildTopicClusterLead(guide, topicGuideCards) {
  const topicTitle = cleanInlineText(guide?.hubTitle || 'هذا المسار');

  if (!topicGuideCards.length) {
    return '';
  }

  return `هذه الصفحة جزء من مسار ${topicTitle}. إذا فهمت الفكرة الأساسية هنا، فالمقالات التالية توسعها من زوايا مكملة وتساعدك على متابعة نفس السؤال بدل البدء من جديد.`;
}

function buildGuideFocusCards(guide, nextStepCards) {
  const checklistItems = Array.isArray(guide?.checklist?.items) ? guide.checklist.items : [];
  const cards = [
    {
      key: 'core',
      label: 'الفكرة التي يجب أن تثبت',
      title: guide?.summary?.value || guide?.title || 'المعنى الأساسي',
      body:
        guide?.summary?.note
        || guide?.description
        || 'هذا المقال يبدأ من السؤال نفسه ثم يربطه بمعنى يمكن استخدامه في قرار أو حساب أو مقارنة.',
      Icon: Sparkles,
      tone: 'core',
    },
  ];

  const firstQuickAnswer = guide?.quickAnswers?.[0];
  if (firstQuickAnswer) {
    cards.push({
      key: 'clarify',
      label: 'أين يضيع الناس عادة؟',
      title: getGuideAnswerQuestion(firstQuickAnswer),
      body:
        getGuideAnswerText(firstQuickAnswer)
        || 'هذا هو السؤال الذي يسبب أكبر قدر من الالتباس قبل أن تتضح الصورة كاملة.',
      Icon: HelpCircle,
      tone: 'clarify',
    });
  } else if (guide?.highlights?.[0]) {
    cards.push({
      key: 'clarify',
      label: 'الفائدة السريعة',
      title: cleanInlineText(guide.highlights[0]),
      body:
        cleanInlineText(guide.highlights[1])
        || 'الفكرة هنا أن تحصل على جواب محدد لا فقرة عامة يمكن أن تظهر في أي مقال مشابه.',
      Icon: FileText,
      tone: 'clarify',
    });
  }

  const firstStep = guide?.steps?.[0];
  if (firstStep) {
    cards.push({
      key: 'action',
      label: 'كيف تبدأ عملياً؟',
      title: firstStep.title,
      body:
        firstStep.description
        || 'هذه أول خطوة تنقل الفكرة من القراءة إلى قرار أو حساب واضح.',
      Icon: ListChecks,
      tone: 'action',
    });
  } else if (nextStepCards?.[0]) {
    cards.push({
      key: 'action',
      label: 'الخطوة العملية',
      title: nextStepCards[0].title,
      body:
        nextStepCards[0].description
        || 'إذا اكتملت الفكرة، فهذه هي الوجهة التالية الأقرب للتطبيق العملي.',
      Icon: nextStepCards[0].Icon || Calculator,
      tone: 'action',
    });
  }

  if (cards.length < 3 && checklistItems[0]) {
    cards.push({
      key: 'fit',
      label: 'متى تصبح الصفحة مهمة لك؟',
      title: cleanInlineText(checklistItems[0]),
      body:
        guide?.checklist?.description
        || 'هذا هو السياق الذي يجعل الموضوع مهماً الآن، لا مجرد تعريف عابر.',
      Icon: ShieldCheck,
      tone: 'fit',
    });
  }

  return cards.slice(0, 3);
}

function buildGuidePathNodes(guide, nextStepCards) {
  const nodes = [
    {
      key: 'question',
      label: 'سؤال البداية',
      value: cleanInlineText(guide?.intentKeywords?.[0] || guide?.title || 'ابدأ من السؤال الرئيسي'),
    },
    {
      key: 'meaning',
      label: 'المعنى',
      value: cleanInlineText(guide?.summary?.value || guide?.description || 'افهم الفكرة قبل الانتقال إلى أي أداة'),
    },
  ];

  const decisionText = cleanInlineText(
    guide?.steps?.[0]?.title
    || guide?.checklist?.items?.[0]
    || guide?.quickAnswers?.[0]?.question,
  );

  if (decisionText) {
    nodes.push({
      key: 'decision',
      label: 'القرار',
      value: decisionText,
    });
  }

  const actionText = cleanInlineText(nextStepCards?.[0]?.title || guide?.hubTitle);

  if (actionText) {
    nodes.push({
      key: 'action',
      label: 'التطبيق',
      value: actionText,
    });
  }

  return nodes.filter((node) => node.value).slice(0, 4);
}

function buildGuideDecisionRules(guide, nextStepCards, sourceLinks) {
  const quickAnswer = guide?.quickAnswers?.[0];
  const firstStep = guide?.steps?.[0];
  const checklistItems = Array.isArray(guide?.checklist?.items) ? guide.checklist.items : [];
  const nextStepCard = nextStepCards?.[0];
  const sourceCount = sourceLinks?.length || 0;
  const rules = [];

  if (quickAnswer) {
    rules.push({
      label: 'افهم',
      title: getGuideAnswerQuestion(quickAnswer),
      body: getGuideAnswerText(quickAnswer),
    });
  }

  if (checklistItems.length) {
    const visibleChecklist = checklistItems.slice(0, 2);
    rules.push({
      label: 'اختبر',
      title: guide?.checklist?.title || 'هل تنطبق عليك الحالة؟',
      body: `إذا وجدت نفسك في ${formatArabicList(visibleChecklist)} فاقرأ التفاصيل على أنها قريبة من حالتك، لا كتعريف عام يمكن أن ينطبق على أي شخص.`,
    });
  }

  if (guide?.comparison?.title) {
    rules.push({
      label: 'قارن',
      title: guide.comparison.title,
      body: guide.comparison.description || 'استخدم المقارنة عندما يكون الالتباس بين خيارين متشابهين في الاسم ومختلفين في الأثر العملي.',
    });
  }

  if (firstStep) {
    rules.push({
      label: 'طبّق',
      title: firstStep.title,
      body: firstStep.description || 'ابدأ بأول خطوة عملية قبل الانتقال إلى الحساب أو الصفحة التالية.',
    });
  }

  if (nextStepCard) {
    rules.push({
      label: 'أكمل',
      title: nextStepCard.title,
      body: nextStepCard.description || 'انتقل إلى هذه الصفحة عندما تريد تحويل الشرح إلى رقم أو متابعة عملية.',
    });
  }

  if (sourceCount) {
    rules.push({
      label: 'تحقق',
      title: 'راجع المصدر عند القرار الحساس',
      body: `تجد في نهاية المقال ${sourceCount} مصدر أو مرجع. راجعها قبل أي قرار مالي، صحي، قانوني، أو مرتبط بوقت رسمي.`,
    });
  }

  if (!rules.length) {
    return [
      {
        label: 'افهم',
        title: guide?.summary?.value || guide?.title || 'ابدأ من المعنى العملي',
        body: guide?.summary?.note || guide?.description || 'اقرأ الفكرة الأساسية أولاً، ثم اربطها بسؤال واحد من واقعك قبل أن تنتقل إلى أي أداة.',
      },
    ];
  }

  return rules.filter((rule) => rule.title && rule.body).slice(0, 3);
}

function buildSupplementarySections(guide) {
  const sections = [];
  const checklistItems = Array.isArray(guide?.checklist?.items) ? guide.checklist.items : [];

  if (guide?.quickAnswers?.length) {
    const questionDigest = guide.quickAnswers
      .slice(0, 3)
      .map((item) => `${getGuideAnswerQuestion(item)} ${getGuideAnswerText(item)}`)
      .join(' ');

    if (questionDigest) {
      sections.push({
        title: 'أسئلة متكررة قبل أن تكمل القراءة',
        description: 'ابدأ بهذه الإجابات إذا كنت تريد تثبيت الفكرة الأساسية قبل التفاصيل.',
        body: questionDigest,
      });
    }
  }

  if (checklistItems.length) {
    const checklistDigest = formatArabicList(checklistItems);

    sections.push({
      title: guide.checklist.title || 'متى يكون هذا المقال مناسباً لك؟',
      description: guide.checklist.description || 'استخدم هذه العلامات لتعرف هل الموضوع قريب من حالتك الآن.',
      body: checklistDigest
        ? `يصبح هذا المقال مفيداً أكثر عندما تكون في واحدة من هذه الحالات: ${checklistDigest}. عندها تكون القراءة هنا بداية جيدة قبل أن تنتقل إلى الأداة أو الصفحة التالية.`
        : guide.checklist.description || '',
    });
  }

  if (guide?.faqItems?.length) {
    const faqDigest = guide.faqItems
      .slice(0, 2)
      .map((item) => `${item.question} ${item.answer}`)
      .join(' ');

    if (faqDigest) {
      sections.push({
        title: 'ما الذي يبقى في الذهن بعد القراءة؟',
        description: 'هذه الأسئلة تعالج ما قد يبقى غامضاً بعد الخلاصة الأولى.',
        body: faqDigest,
      });
    }
  }

  return sections.filter((section) => section.body);
}

function buildLongformSections(guide) {
  const infoSections = (guide?.infoItems || []).map((item) => ({
    title: item.title,
    description: item.description || '',
    body: item.content || '',
  }));
  const contentSections = (guide?.sections || []).map((section) => ({
    title: section.title,
    description: section.description || '',
    body: section.body || section.answer || '',
  }));

  const baseSections = [...infoSections, ...contentSections].filter((section) => section.title && section.body);
  if (baseSections.length >= 5) {
    return baseSections;
  }

  const usedTitles = new Set(baseSections.map((section) => section.title));
  const supplementarySections = buildSupplementarySections(guide).filter((section) => !usedTitles.has(section.title));
  const sections = [...baseSections, ...supplementarySections];

  if (!sections.length) {
    const summaryBody = [
      guide?.description,
      guide?.summary?.note,
      guide?.quickAnswers?.[0] ? `${getGuideAnswerQuestion(guide.quickAnswers[0])} ${getGuideAnswerText(guide.quickAnswers[0])}` : '',
    ].filter(Boolean).join(' ');

    return [
      {
        title: 'الخلاصة العملية',
        description: guide?.summary?.value || '',
        body: summaryBody || 'هذه الصفحة تعطيك جواباً مباشراً عن السؤال الرئيسي، ثم تضعه في سياق عملي يساعدك على اتخاذ الخطوة التالية بوضوح.',
      },
    ];
  }

  return sections.slice(0, 5);
}

function getGuideSectionBody(section) {
  return section?.body || section?.description || section?.answer || '';
}

function getGuideAnswerQuestion(item) {
  return item?.question || item?.title || 'إجابة سريعة';
}

function getGuideAnswerText(item) {
  return item?.answer || item?.description || item?.body || '';
}

function formatGuideDate(dateValue) {
  if (!dateValue) {
    return '';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return BLOG_ARTICLE_DATE_FORMATTER.format(parsedDate);
}

function buildEditorialMetaItems(guide) {
  const sourceCount = guide.sourceLinks?.length || 0;
  const publishedLabel = formatGuideDate(guide.publishedAt);
  const updatedLabel = formatGuideDate(guide.updatedAt);
  const defaultAuthor = getDefaultAuthor();
  const authorName = guide.authorName || defaultAuthor.name;
  const authorRole = guide.authorRole || defaultAuthor.role;

  return [
    {
      label: 'إعداد المقال',
      value: authorName,
      href: `/author/${defaultAuthor.id}`,
      detail: authorRole,
      Icon: UserRound,
    },
    guide.reviewedBy
      ? {
          label: 'المراجعة',
          value: guide.reviewedBy,
          detail: 'نراجع المحتوى وفق السياسة التحريرية للموقع.',
          Icon: ShieldCheck,
        }
      : null,
    publishedLabel
      ? {
          label: 'تاريخ النشر',
          value: publishedLabel,
          detail: 'تاريخ ظهور هذه النسخة من المقال.',
          Icon: CalendarDays,
        }
      : null,
    updatedLabel
      ? {
          label: 'آخر تحديث',
          value: updatedLabel,
          detail: 'نحدّث الشرح عندما نوسّع المحتوى أو نراجع مراجع الصفحة.',
          Icon: CalendarDays,
        }
      : null,
    sourceCount
      ? {
          label: 'المراجع',
          value: `${sourceCount} مصادر`,
          detail: 'مصادر يمكن الرجوع إليها للتحقق من المعلومات الأساسية.',
          Icon: FileText,
        }
      : null,
  ].filter(Boolean);
}

function GuideEditorialMeta({ guide }) {
  const metaItems = buildEditorialMetaItems(guide);

  if (!metaItems.length && !guide.authorBio) {
    return null;
  }

  return (
    <section className={styles.editorialMeta} aria-label="معلومات المقال">
      {metaItems.length ? (
        <div className={styles.editorialMetaGrid}>
          {metaItems.map((item) => (
            <div
              key={item.label}
              className={styles.editorialMetaCard}
              aria-label={`${item.label}: ${item.value}. ${item.detail}`}
              title={item.detail}
            >
              <span className={styles.editorialMetaIcon}>
                <item.Icon size={16} />
              </span>
              <span className={styles.editorialMetaLabel}>{item.label}</span>
              <strong>
                {item.href ? (
                  <Link href={item.href} style={{ textDecoration: 'underline', textUnderlineOffset: '2px', color: 'inherit' }}>{item.value}</Link>
                ) : item.value}
              </strong>
            </div>
          ))}
        </div>
      ) : null}

      {guide.authorBio ? (
        <div className={styles.authorNote}>
          <p className={styles.authorBio}>{guide.authorBio}</p>
          <div className={styles.editorialActions}>
            <Link href="/editorial-policy" className={styles.editorialLink}>
              السياسة التحريرية
            </Link>
            <Link href="/contact" className={styles.editorialLink}>
              أرسل ملاحظة
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GuideSources({ sourceLinks }) {
  const safeSourceLinks = Array.isArray(sourceLinks) ? sourceLinks : [];

  if (!safeSourceLinks.length) {
    return null;
  }

  return (
    <section id="guide-sources" className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionEyebrow}>المراجع</span>
        <h2>مصادر تساعدك على التحقق</h2>
        <p>هذه مصادر مناسبة للموضوع إذا أردت مراجعة الأصل أو متابعة التفاصيل الرسمية قبل اتخاذ قرار مهم.</p>
      </div>
      <div className={styles.sourceList}>
        {safeSourceLinks.map((source) => (
          <article key={source.href} className={styles.sourceCard}>
            <div className={styles.sourceBody}>
              <strong>{source.label}</strong>
              <p>{source.description}</p>
            </div>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              افتح المصدر
              <ExternalLink size={15} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function GuideBreadcrumb({ guide }) {
  return (
    <nav className={styles.breadcrumb} aria-label="مسار التصفح">
      <Link href="/">الرئيسية</Link>
      <span aria-hidden="true">/</span>
      <Link href="/blog">المدونة</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{guide.title}</span>
    </nav>
  );
}

function GuideFaqList({ faqItems }) {
  const safeFaqItems = Array.isArray(faqItems) ? faqItems : [];

  if (!safeFaqItems.length) {
    return null;
  }

  return (
    <div className={styles.faqList}>
      {safeFaqItems.map((item, index) => (
        <details key={item.question} className={styles.faqItem} open={index === 0}>
          <summary className={styles.faqQuestion}>{item.question}</summary>
          <p className={styles.faqAnswer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export default function BlogArticleView(props) {
  const guide = props.guide;
  const relatedCalculators = Array.isArray(props.relatedCalculators) ? props.relatedCalculators : [];
  const relatedGuides = Array.isArray(props.relatedGuides) ? props.relatedGuides : [];
  const topicGuides = Array.isArray(props.topicGuides) ? props.topicGuides : [];
  const relatedPages = Array.isArray(props.relatedPages) ? props.relatedPages : [];
  const quickAnswers = Array.isArray(guide.quickAnswers) ? guide.quickAnswers : [];
  const steps = Array.isArray(guide.steps) ? guide.steps : [];
  const contentSections = buildLongformSections(guide);
  const faqItems = Array.isArray(guide.faqItems) ? guide.faqItems : [];
  const sourceLinks = Array.isArray(guide.sourceLinks) ? guide.sourceLinks : [];
  const comparisonColumns = Array.isArray(guide.comparison?.columns) ? guide.comparison.columns : [];
  const comparisonRows = Array.isArray(guide.comparison?.rows) ? guide.comparison.rows : [];
  const hasComparison = Boolean(guide.comparison && comparisonColumns.length && comparisonRows.length);
  const checklistItems = Array.isArray(guide.checklist?.items) ? guide.checklist.items : [];

  const navItems = buildGuideNavItems(guide);
  const highlights = buildGuideHighlights(guide);
  const quickFacts = buildQuickFacts(guide);
  const introParagraphs = buildIntroParagraphs(guide);
  const answerFirstParagraphs = buildBlogArticleLeadParagraphs(guide);
  const relatedArticleCards = buildArticleCards(relatedGuides);
  const topicGuideCards = buildTopicGuides(topicGuides, guide.slug);
  const nextStepCards = buildActionCards(relatedCalculators, relatedPages);
  const focusCards = buildGuideFocusCards(guide, nextStepCards);
  const pathNodes = buildGuidePathNodes(guide, nextStepCards);
  const decisionRuleCards = buildGuideDecisionRules(guide, nextStepCards, sourceLinks);
  const practicalParagraphs = buildBlogArticlePracticalParagraphs(guide);
  const topicClusterLead = buildTopicClusterLead(guide, topicGuideCards);
  const guideHubHref = guide.hubHref;
  const guideHubTitle = guide.hubTitle;
  const hasIntroReadingBlocks = quickAnswers.length > 0 || steps.length > 0 || hasComparison;
  const shouldShowIntroSection = introParagraphs.length > 0 && answerFirstParagraphs.length === 0;
  const shouldShowFocusSection = focusCards.length > 0 && answerFirstParagraphs.length === 0 && quickAnswers.length === 0;
  const guideWordCount = countBlogArticleWords(guide);
  const shouldShowAds = guideWordCount >= 800;
  const pageStyle = {
    '--guide-accent': guide.accent || 'var(--accent)',
  };

  const defaultAuthor = getDefaultAuthor();
  const authorName = guide.authorName || defaultAuthor.name;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.metaTitle || guide.title,
    description: guide.description,
    author: {
      '@type': 'Person',
      '@id': defaultAuthor.url,
      name: authorName,
      url: defaultAuthor.url,
    },
    publisher: { '@type': 'Organization', name: SITE_BRAND, url: getSiteUrl() },
    url: `${getSiteUrl()}/blog/${guide.slug}`,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    inLanguage: 'ar',
    ...(guide.topic ? { articleSection: guide.topic } : {}),
  };

  return (
    <main className={styles.page} style={pageStyle}>
      <JsonLd data={articleSchema} />
      <article className={styles.shell}>
        <GuideBreadcrumb guide={guide} />

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Sparkles size={15} />
              {guide.badge || 'مقال عملي'}
            </span>
            <h1 className={styles.title}>{guide.metaTitle || guide.title}</h1>
            <p className={styles.lead}>{guide.description}</p>

            {guideHubHref && guideHubTitle ? (
              <div className={styles.metaLinks}>
                <Link href={guideHubHref} className={styles.metaLink}>
                  مرتبط بقسم: {guideHubTitle}
                </Link>
              </div>
            ) : null}

            <div className={styles.highlightList}>
              {highlights.map((item) => (
                <div key={item} className={styles.highlightItem}>
                  <span className={styles.highlightDot} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={styles.heroFooter}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>{guide.summary?.label || 'لماذا تقرأ هذا المقال؟'}</span>
                <strong className={styles.summaryValue}>{guide.summary?.value || 'لتفهم الفكرة قبل أن تختار الأداة أو القرار.'}</strong>
                <p className={styles.summaryNote}>
                  {guide.summary?.note || `هذا المقال مصمم ليعطيك المعنى العملي أولاً، ثم يوصلك إلى الخطوة المناسبة داخل ${SITE_BRAND}.`}
                </p>
              </div>

              <div className={styles.quickFactsGrid}>
                {quickFacts.map((fact) => (
                  <div key={fact.label} className={styles.quickFactCard}>
                    <span className={styles.quickFactIcon}>
                      <fact.Icon size={16} />
                    </span>
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <GuideEditorialMeta guide={guide} />
          </div>
        </header>

        {shouldShowAds ? (
          <AdTopBanner slotId={`top-guide-${guide.slug || 'entry'}`} />
        ) : null}

        <nav className={styles.mobileToc} aria-label="تنقل سريع داخل المقال">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.mobileTocLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.layout}>
          <div className={styles.content}>
            {answerFirstParagraphs.length ? (
              <section id="guide-answer-first" className={`${styles.section} ${styles.answerFirstSection}`}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>جواب مباشر</span>
                  <h2>الجواب المختصر أولاً، ثم التفاصيل لمن يحتاجها</h2>
                  <p>هذا الجزء يجيب عن السؤال مباشرة حتى تعرف هل الصفحة تناسبك، ثم تتابع الشرح إذا أردت مثالاً أو خطوة عملية.</p>
                </div>
                <div className={styles.answerFirstProse}>
                  {answerFirstParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {decisionRuleCards.length ? (
              <section id="guide-decision-rules" className={`${styles.section} ${styles.decisionRulesSection}`}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>قاعدة القرار</span>
                  <h2>اختبر الفكرة قبل أن تنتقل إلى الأداة</h2>
                  <p>بعد الخلاصة، اسأل: هل أعرف متى أستخدم هذا الشرح؟ متى أراجع مصدراً؟ وما الصفحة التي تكمل الفكرة عملياً؟</p>
                </div>
                <div className={styles.decisionRuleList}>
                  {decisionRuleCards.map((rule) => (
                    <article key={`${rule.label}-${rule.title}`} className={styles.decisionRuleItem}>
                      <span>{rule.label}</span>
                      <div>
                        <strong>{rule.title}</strong>
                        <p>{rule.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {shouldShowIntroSection ? (
              <section className={`${styles.section} ${styles.introSection}`}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>قبل أن تبدأ</span>
                  <h2>ما الذي ستأخذه من هذا المقال؟</h2>
                </div>
                <div className={styles.introProse}>
                  {introParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {shouldShowFocusSection ? (
              <section id="guide-map" className={`${styles.section} ${styles.visualDigestSection}`}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>الخلاصة العملية</span>
                  <h2>ما الذي يهمك من هذا الموضوع؟</h2>
                  <p>ثلاث نقاط تكشف الفكرة، موضع الالتباس، والخطوة العملية الأقرب بعد المقال.</p>
                </div>

                <div className={styles.focusGrid}>
                  {focusCards.map((card) => (
                    <article key={card.key} className={styles.focusCard} data-tone={card.tone}>
                      <div className={styles.focusCardTop}>
                        <span className={styles.focusIcon}>
                          <card.Icon size={18} />
                        </span>
                        <span className={styles.focusLabel}>{card.label}</span>
                      </div>
                      <strong className={styles.focusTitle}>{card.title}</strong>
                      <p className={styles.focusBody}>{card.body}</p>
                    </article>
                  ))}
                </div>

                {pathNodes.length > 1 ? (
                  <div className={styles.pathMap} aria-label="مسار انتقال الفكرة داخل المقال">
                    {pathNodes.map((node, index) => (
                      <div key={node.key} className={styles.pathSegment}>
                        <article className={styles.pathNode}>
                          <span className={styles.pathNodeLabel}>{node.label}</span>
                          <strong className={styles.pathNodeValue}>{node.value}</strong>
                        </article>
                        {index < pathNodes.length - 1 ? (
                          <span className={styles.pathDivider} aria-hidden="true" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {quickAnswers.length ? (
              <section id="guide-answers" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>الإجابة قبل التفاصيل</span>
                  <h2>إذا كنت تريد الخلاصة بسرعة</h2>
                  <p>هذه إجابات قصيرة للأسئلة التي غالباً تحدد هل تحتاج إلى قراءة التفاصيل أم لا.</p>
                </div>
                <div className={styles.answerGrid}>
                  {quickAnswers.map((item) => (
                    <article key={getGuideAnswerQuestion(item)} className={styles.answerCard}>
                      <h3>{getGuideAnswerQuestion(item)}</h3>
                      <p>{getGuideAnswerText(item)}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {steps.length ? (
              <section id="guide-steps" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>خطة عملية</span>
                  <h2>رتّب القرار خطوة بخطوة</h2>
                  <p>بدل القراءة العامة فقط، اتبع هذا التسلسل حتى تنتقل من الفهم إلى التنفيذ بثقة أكبر.</p>
                </div>
                <div className={styles.stepsList}>
                  {steps.map((step, index) => (
                    <article key={step.title} className={styles.stepCard}>
                      <div className={styles.stepIndex}>{String(index + 1).padStart(2, '0')}</div>
                      <div className={styles.stepBody}>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {hasComparison ? (
              <section id="guide-compare" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>مقارنة سريعة</span>
                  <h2>{guide.comparison.title}</h2>
                  <p>{guide.comparison.description}</p>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.compareTable}>
                    <thead>
                      <tr>
                        <th>النقطة</th>
                        {comparisonColumns.map((column) => (
                          <th key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr key={row.label}>
                          <th scope="row">{row.label}</th>
                          {(Array.isArray(row.values) ? row.values : []).map((value) => (
                            <td key={`${row.label}-${value}`}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {hasIntroReadingBlocks && shouldShowAds ? (
              <AdInArticle slotId={`mid-guide-${guide.slug || 'entry'}-1`} />
            ) : null}

            <section id="guide-content" className={`${styles.section} ${styles.proseSection}`}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>الشرح العملي</span>
                  <h2>افهم الفكرة كما ستستخدمها فعلاً</h2>
                  <p>هنا تجد الشرح المتصل: المعنى، المثال أو السياق، ثم ما الذي يتغير عندما تطبقه على رقم أو موعد أو قرار حقيقي.</p>
                </div>
              <div className={styles.articleSectionList}>
                {contentSections.map((section, index) => (
                  <section
                    key={section.title}
                    className={styles.articleSectionCard}
                    data-tone={index % 2 === 0 ? 'solid' : 'soft'}
                  >
                    <div className={styles.articleSectionHeader}>
                      <span className={styles.articleSectionMarker}>{String(index + 1).padStart(2, '0')}</span>
                      <div className={styles.articleSectionTitleBlock}>
                        <h3>{section.title}</h3>
                        {section.description ? (
                          <p className={styles.articleSectionLead}>{section.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.articleSectionBody}>
                      {splitBlogArticleBodyParagraphs(getGuideSectionBody(section)).map((paragraph, paragraphIndex) => (
                        <p key={`${section.title}-${paragraphIndex}`}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section id="guide-practical" className={`${styles.section} ${styles.introSection}`}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionEyebrow}>تطبيق عملي</span>
                <h2>حوّل ما قرأته إلى خطوة واحدة واضحة</h2>
                <p>اختر الخطوة التي تناسب سبب القراءة: جرّب الحاسبة، راجع المصدر، أو افتح الصفحة المكملة بدلاً من بدء بحث جديد من الصفر.</p>
              </div>
              <div className={styles.introProse}>
                {practicalParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            {topicGuideCards.length ? (
              <section id="guide-topic" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>ضمن نفس الموضوع</span>
                  <h2>اقرأ التالي إذا كان هذا هو سؤالك</h2>
                  <p>{topicClusterLead}</p>
                </div>
                <div className={styles.relatedArticleList}>
                  {topicGuideCards.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.relatedArticleLink}>
                      <div className={styles.relatedArticleMeta}>
                        <span className={styles.relatedArticleBadge}>{item.badge}</span>
                        <span className={styles.relatedArticleArrow}>
                          <ArrowLeft size={15} />
                        </span>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {guide.checklist && checklistItems.length ? (
              <section id="guide-checklist" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>هل يناسبك الآن؟</span>
                  <h2>{guide.checklist.title}</h2>
                  <p>{guide.checklist.description}</p>
                </div>
                <div className={styles.checklistCard}>
                  {checklistItems.map((item) => (
                    <div key={item} className={styles.checklistItem}>
                      <span className={styles.checkIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <GuideSources sourceLinks={sourceLinks} />

            {relatedArticleCards.length ? (
              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>قراءة مكملة</span>
                  <h2>مقالات قصيرة تكمل الصورة</h2>
                  <p>روابط قليلة ومباشرة، حتى تختار زاوية واحدة تكمل سؤالك بدل التنقل بين صفحات كثيرة.</p>
                </div>
                <div className={styles.relatedArticleList}>
                  {relatedArticleCards.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.relatedArticleLink}>
                      <div className={styles.relatedArticleMeta}>
                        <span className={styles.relatedArticleBadge}>{item.badge}</span>
                        <span className={styles.relatedArticleArrow}>
                          <ArrowLeft size={15} />
                        </span>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {nextStepCards.length ? (
              <section id="guide-next" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>تطبيق بعد الفهم</span>
                  <h2>استخدم أداة واحدة تكمل المقال</h2>
                  <p>اختيارات صغيرة ومحددة، مرتبطة بالسؤال نفسه، حتى تنتقل من الفهم إلى تجربة عملية بسرعة.</p>
                </div>
                <div className={styles.resourceGrid}>
                  {nextStepCards.map((item) => (
                    <article key={item.href} className={styles.resourceCard}>
                      <div className={styles.resourceTop}>
                        <span className={styles.resourceIcon}>
                          <item.Icon size={17} />
                        </span>
                        <span className={styles.resourceBadge}>{item.badge}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <Link href={item.href} className={styles.resourceLink}>
                        {item.ctaLabel}
                        <ArrowLeft size={14} />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {shouldShowAds && faqItems.length ? (
              <AdInArticle slotId={`mid-guide-${guide.slug || 'entry'}-2`} />
            ) : null}

            {faqItems.length ? (
              <section id="guide-faq" className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionEyebrow}>أسئلة أخيرة</span>
                  <h2>أسئلة قد تخطر لك بعد قراءة المقال</h2>
                  <p>أسئلة قصيرة تعالج الالتباس الذي قد يبقى بعد قراءة الشرح الأساسي.</p>
                </div>
                <GuideFaqList faqItems={faqItems} />
              </section>
            ) : null}

            {shouldShowAds ? (
              <AdMultiplex slotId={`end-guide-${guide.slug || 'entry'}`} />
            ) : null}

            <SiteTrustPanel panel="blog" />
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <span className={styles.sidebarEyebrow}>محتويات الدليل</span>
              <nav className={styles.toc} aria-label="محتويات المقال">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} className={styles.tocLink}>
                    <span>{item.label}</span>
                    <ArrowLeft size={14} />
                  </a>
                ))}
              </nav>
            </div>

            {topicGuideCards.length ? (
              <div className={styles.sidebarCard}>
                <span className={styles.sidebarEyebrow}>ضمن نفس المسار</span>
                <nav className={styles.toc} aria-label="مقالات في نفس الموضوع">
                  {topicGuideCards.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.tocLink}>
                      <span>{item.title}</span>
                      <ArrowLeft size={14} />
                    </Link>
                  ))}
                </nav>
              </div>
            ) : null}

            {shouldShowAds ? (
              <AdBlogSidebar slotId={`sidebar-guide-${guide.slug || 'entry'}`} className={styles.sidebarCard} />
            ) : null}

          </aside>
        </div>
      </article>
    </main>
  );
}
