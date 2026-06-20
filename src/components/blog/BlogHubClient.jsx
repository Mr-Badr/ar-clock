'use client';

import Link from 'next/link';
import { Fragment, useDeferredValue, useState } from 'react';
import {
  ArrowLeft,
  BookOpenText,
  Clock3,
  Compass,
  Filter,
  Layers3,
  ListChecks,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

import AdInFeed from '@/components/ads/AdInFeed';
import AdTopBanner from '@/components/ads/AdTopBanner';
import styles from './BlogHubClient.module.css';

const READING_COMPASS = [
  {
    id: 'question',
    title: 'إذا كان لديك سؤال محدد',
    description: 'اكتب كلمة من السؤال نفسه، مثل: القيلولة، دورة النوم، أكياس الأسمنت، أو وزن الحديد. لا تبدأ باسم القسم إذا كنت تعرف المشكلة.',
    action: 'استخدم البحث',
    href: '#blog-search',
    Icon: Search,
  },
  {
    id: 'decision',
    title: 'إذا كنت بين اختيارين',
    description: 'ابدأ بالقراءات التي تحتوي مقارنة أو خطوات. المقال الجيد يوضح الفرق قبل أن تضع أرقامك في الحاسبة.',
    action: 'انتقل إلى النتائج',
    href: '#blog-results',
    Icon: ListChecks,
  },
  {
    id: 'path',
    title: 'إذا كنت تريد مساراً كاملاً',
    description: 'اختر موضوعاً واحداً من التصفية، ثم اقرأ مقالاً واحداً وطبّق الرابط التالي في نهايته بدلاً من القفز بين صفحات متباعدة.',
    action: 'اختر الموضوع',
    href: '#blog-filters',
    Icon: Compass,
  },
];

const SUGGESTED_BLOG_QUERIES = [
  'دورة النوم',
  'مدة القيلولة',
  'أكياس الأسمنت',
  'وزن الحديد',
  'تكلفة البناء',
];

function buildFilterItems(collections) {
  const safeCollections = Array.isArray(collections) ? collections : [];
  const totalArticles = safeCollections.reduce((sum, collection) => (
    sum + (Number.isFinite(collection.articleCount) ? collection.articleCount : 0)
  ), 0);

  return [
    { id: 'all', label: 'كل المقالات', count: totalArticles },
    ...safeCollections.map((collection) => ({
      id: collection.id,
      label: collection.title,
      count: Number.isFinite(collection.articleCount) ? collection.articleCount : 0,
    })),
  ];
}

function flattenArticles(collections) {
  const safeCollections = Array.isArray(collections) ? collections : [];

  return safeCollections.flatMap((collection) => {
    const safeArticles = Array.isArray(collection.articles) ? collection.articles : [];

    return safeArticles.map((article) => ({
      ...article,
      collectionId: collection.id,
      collectionTitle: collection.title,
      collectionDescription: collection.description,
      collectionAccent: collection.accent,
      summaryValue: article.summaryValue,
      badge: article.badge,
      keywords: Array.isArray(article.keywords) ? article.keywords : [],
      intentKeywords: Array.isArray(article.intentKeywords) ? article.intentKeywords : [],
    }));
  });
}

function getVisibleArticles(activeFilterId, articles) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  if (activeFilterId === 'all') {
    return safeArticles;
  }

  return safeArticles.filter((article) => article.collectionId === activeFilterId);
}

function getActiveCollection(activeFilterId, collections) {
  const safeCollections = Array.isArray(collections) ? collections : [];

  if (activeFilterId === 'all') {
    return null;
  }

  return safeCollections.find((collection) => collection.id === activeFilterId) || null;
}

function buildArticleMeta(article) {
  return [
    article.readingMinutes
      ? {
          id: 'reading-time',
          label: 'مدة القراءة',
          value: `${article.readingMinutes} دقائق`,
          tone: 'Time',
        }
      : null,
    article.wordCount
      ? {
          id: 'word-count',
          label: 'حجم المقال',
          value: `${article.wordCount} كلمة`,
          tone: 'Words',
        }
      : null,
    article.quickAnswerCount
      ? {
          id: 'quick-answers',
          label: 'إجابات سريعة',
          value: `${article.quickAnswerCount} إجابات`,
          tone: 'Answers',
        }
      : null,
    article.stepCount
      ? {
          id: 'steps',
          label: 'خطوات عملية',
          value: `${article.stepCount} خطوات`,
          tone: 'Steps',
        }
      : null,
  ].filter(Boolean);
}

function getArticleMetaToneClass(tone) {
  const toneClassMap = {
    Time: styles.articleMetaChipTime,
    Words: styles.articleMetaChipWords,
    Answers: styles.articleMetaChipAnswers,
    Steps: styles.articleMetaChipSteps,
  };

  return toneClassMap[tone] || '';
}

function normalizeSearchQuery(value) {
  return String(value || '').trim().toLowerCase();
}

function filterArticlesByQuery(articles, searchQuery) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const normalizedQuery = normalizeSearchQuery(searchQuery);

  if (!normalizedQuery) {
    return safeArticles;
  }

  const queryTokens = normalizedQuery.split(/\s+/u).filter(Boolean);

  return safeArticles.filter((article) => {
    const haystack = [
      article.title,
      article.metaTitle,
      article.description,
      article.summaryValue,
      article.badge,
      article.collectionTitle,
      article.collectionDescription,
      ...(article.keywords || []),
      ...(article.intentKeywords || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return queryTokens.every((token) => haystack.includes(token));
  });
}

function formatArticleCount(count) {
  if (count === 0) return 'لا توجد مقالات';
  if (count === 1) return 'مقال واحد';
  if (count === 2) return 'مقالان';
  if (count >= 3 && count <= 10) return `${count} مقالات`;
  return `${count} مقالاً`;
}

function ShortcutCard(props) {
  const shortcut = props.shortcut;

  return (
    <Link href={shortcut.href} className={styles.shortcutCard}>
      <span className={styles.shortcutBadge}>{shortcut.badge}</span>
      <strong>{shortcut.title}</strong>
      <p>{shortcut.description}</p>
      <span className={styles.shortcutCta}>
        ابدأ من هذا المسار
        <ArrowLeft size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

function SupportPathway(props) {
  const item = props.item;

  return (
    <Link href={item.href} className={styles.relatedLink}>
      <strong>{item.title}</strong>
      <span>{item.description}</span>
      <em>
        افتح المسار
        <ArrowLeft size={13} aria-hidden="true" />
      </em>
    </Link>
  );
}

function BlogHeroMetrics(props) {
  const articleCount = props.articleCount;
  const collectionCount = props.collectionCount;

  return (
    <dl className={styles.heroMetrics} aria-label="ملخص محتوى المدونة">
      <div>
        <dt>المقالات</dt>
        <dd>{formatArticleCount(articleCount)}</dd>
      </div>
      <div>
        <dt>المسارات</dt>
        <dd>{collectionCount} موضوعات</dd>
      </div>
      <div>
        <dt>شكل المقال</dt>
        <dd>جواب، مثال، ثم أداة</dd>
      </div>
    </dl>
  );
}

function CollectionMiniCard(props) {
  const collection = props.collection;
  const isActive = props.isActive;
  const onSelect = props.onSelect;

  return (
    <button
      type="button"
      className={`${styles.collectionMiniCard} ${isActive ? styles.collectionMiniCardActive : ''}`}
      onClick={() => onSelect(collection.id)}
      style={{ '--collection-accent': collection.accent }}
      aria-pressed={isActive}
    >
      <span className={styles.collectionMiniCount}>{formatArticleCount(collection.articleCount || 0)}</span>
      <strong>{collection.title}</strong>
      <p>{collection.description}</p>
    </button>
  );
}

function ReadingCompassCard(props) {
  const item = props.item;

  return (
    <li className={styles.compassStep}>
      <span className={styles.compassIcon}>
        <item.Icon size={18} aria-hidden="true" />
      </span>
      <div className={styles.compassStepBody}>
        <strong>{item.title}</strong>
        <p>{item.description}</p>
      </div>
      <a href={item.href} className={styles.compassAction}>
        {item.action}
        <ArrowLeft size={14} aria-hidden="true" />
      </a>
    </li>
  );
}

export default function BlogHubClient(props) {
  const collections = Array.isArray(props.collections) ? props.collections : [];
  const shortcutLinks = Array.isArray(props.shortcutLinks) ? props.shortcutLinks : [];
  const visibleShortcutLinks = shortcutLinks.slice(0, 4);
  const siteBrand = props.siteBrand;
  const [activeFilterId, setActiveFilterId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleRows, setVisibleRows] = useState(4);
  const deferredFilterId = useDeferredValue(activeFilterId);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filterItems = buildFilterItems(collections);
  const allArticles = flattenArticles(collections);
  const visibleArticles = getVisibleArticles(deferredFilterId, allArticles);
  const filteredArticles = filterArticlesByQuery(visibleArticles, deferredSearchQuery);
  const activeCollection = getActiveCollection(deferredFilterId, collections);
  const featuredArticle = filteredArticles[0] || null;
  const listArticles = (filteredArticles[0] ? filteredArticles.slice(1) : filteredArticles).slice(0, visibleRows);
  const remainingArticleCount = Math.max(filteredArticles.length - 1 - listArticles.length, 0);
  const activeSupportLinks = (activeCollection ? activeCollection.supportLinks : visibleShortcutLinks)
    .filter((item) => item?.href && item?.title)
    .slice(0, 4);
  const hasSearchQuery = normalizeSearchQuery(deferredSearchQuery).length > 0;
  const hasSearchResults = filteredArticles.length > 0;

  function handleFilterChange(nextFilterId) {
    setActiveFilterId(nextFilterId);
    setVisibleRows(4);
  }

  function handleShowMore() {
    setVisibleRows((current) => current + 4);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMain}>
          <span className={styles.eyebrow}>
            <Sparkles size={15} />
            المدونة العربية
          </span>
          <h1 className={styles.heroTitle}>مدونة ميقاتنا: افهم الفكرة ثم استخدم الأداة الصحيحة</h1>
          <p className={styles.heroLead}>
            لا نكتب مقالات لتزيد الأرشيف. ابدأ بسؤالك: نوم، قيلولة، أسمنت، أو حديد.
            ستصل إلى شرح يبدأ بإجابة واضحة، يشرح السبب بمثال، ثم يربطك بحاسبة أو صفحة تكمل القرار داخل {siteBrand}.
          </p>

          <div className={styles.heroActions}>
            <a href="#blog-results" className={styles.primaryAction}>
              اعرض المقالات
              <Search size={16} />
            </a>
            <a href="#blog-filters" className={styles.secondaryAction}>
              صفّ حسب الموضوع
              <ArrowLeft size={16} />
            </a>
          </div>

          <BlogHeroMetrics articleCount={filterItems[0].count} collectionCount={collections.length} />

          <div className={styles.searchPanel}>
            <label htmlFor="blog-search" className={styles.searchLabel}>
              ابحث بالسؤال أو الكلمة التي تصف القرار
            </label>
            <div className={styles.searchField}>
              <Search size={18} className={styles.searchIcon} aria-hidden="true" />
              <input
                id="blog-search"
                type="search"
                dir="auto"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setVisibleRows(4);
                }}
                className={styles.searchInput}
                placeholder="مثال: دورة النوم، مدة القيلولة، أكياس الأسمنت، وزن الحديد"
              />
              {searchQuery ? (
                <button
                  type="button"
                  className={styles.searchClearButton}
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح البحث"
                >
                  <X size={15} />
                </button>
              ) : null}
            </div>
            <p className={styles.searchHelper}>
              {hasSearchQuery
                ? `تظهر الآن ${filteredArticles.length} نتيجة مرتبطة ببحثك داخل المدونة.`
                : `ابحث داخل مقالات ${siteBrand} لتصل إلى الموضوع الأقرب لسؤالك من دون الدوران بين الأقسام.`}
            </p>
            <div className={styles.quickSearchRow} aria-label="اقتراحات بحث في المدونة">
              {SUGGESTED_BLOG_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  className={styles.quickSearchChip}
                  onClick={() => {
                    setSearchQuery(query);
                    setVisibleRows(4);
                  }}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      <AdTopBanner slotId="top-blog-hub" slotKey="topBlogBanner" />

      <section className={styles.readingCompass} aria-labelledby="blog-compass-title">
        <div className={styles.compassHeader}>
          <span className={styles.sideEyebrow}>
            <Compass size={15} />
            قبل التصفية
          </span>
          <h2 id="blog-compass-title">اختر المقال حسب نيتك، لا حسب اسم القسم</h2>
          <p>
            إذا كان لديك سؤال واضح فابدأ بالبحث. إذا كنت تقارن بين خيارين فابدأ بالمقالات التي فيها خطوات أو مقارنة.
            وإذا كنت تريد مساراً كاملاً فاختر موضوعاً واحداً ثم طبّق الأداة المرتبطة. الفكرة أن تتعلم وتفعل، لا أن تجمع روابط كثيرة.
          </p>
        </div>
        <ol className={styles.compassSteps}>
          {READING_COMPASS.map((item) => (
            <ReadingCompassCard key={item.id} item={item} />
          ))}
        </ol>
      </section>

      <section className={styles.readerRuleBand} aria-labelledby="blog-rule-title">
        <span className={styles.sideEyebrow}>
          <ListChecks size={15} />
          قبل الاعتماد على الشرح
        </span>
        <div className={styles.readerRuleCopy}>
          <h2 id="blog-rule-title">اقرأ المقال للفهم، ثم استخدم الأداة أو المصدر المناسب</h2>
          <p>
            المقال يشرح لك الفكرة والخطأ الشائع والخطوة التالية. إذا كان القرار مالياً أو صحياً أو رسمياً،
            استخدم الحاسبة للتقدير ثم راجع الجهة أو المختص المناسب. هذا يجعل القراءة بداية قرار واعٍ لا بديلاً عن التحقق.
          </p>
        </div>
        <div className={styles.readerRuleLinks} aria-label="روابط الثقة في المدونة">
          <Link href="/editorial-policy">السياسة التحريرية</Link>
          <Link href="/disclaimer">إخلاء المسؤولية</Link>
          <Link href="/calculators">كل الحاسبات</Link>
        </div>
      </section>

      <section id="blog-filters" className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <span className={styles.filterLabel}>
            <Filter size={15} />
            تصفية حسب الموضوع
          </span>
          <span className={styles.filterResultCount}>
            {formatArticleCount(filteredArticles.length)}
          </span>
        </div>

        <div className={styles.filterRail} aria-label="تصفية المقالات حسب الموضوع">
          {filterItems.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={deferredFilterId === filter.id}
              className={`${styles.filterChip} ${deferredFilterId === filter.id ? styles.filterChipActive : ''}`}
              onClick={() => handleFilterChange(filter.id)}
            >
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>
      </section>

      <section id="blog-results" className={styles.contentLayout}>
        <div className={styles.feedColumn}>
          {featuredArticle ? (
            <article
              className={styles.featuredArticle}
              style={{ '--collection-accent': featuredArticle.collectionAccent }}
            >
              <div className={styles.featuredMeta}>
                <span className={styles.featuredBadge}>{featuredArticle.collectionTitle}</span>
                <span className={styles.featuredTiming}>
                  <Clock3 size={14} />
                  {featuredArticle.readingMinutes} دقائق
                </span>
              </div>

              <div className={styles.featuredBody}>
                <div className={styles.featuredCopy}>
                  <h2>{featuredArticle.title}</h2>
                  <p>{featuredArticle.description}</p>

                  {featuredArticle.summaryValue ? (
                    <div className={styles.featuredSummary}>
                      <span className={styles.summaryLabel}>ماذا ستفهم؟</span>
                      <strong>{featuredArticle.summaryValue}</strong>
                    </div>
                  ) : null}

                  <div className={styles.featuredActions}>
                    <Link href={featuredArticle.href} className={styles.readArticleLink}>
                      افتح الشرح العملي
                      <ArrowLeft size={16} />
                    </Link>
                    <Link href={featuredArticle.collectionHref} className={styles.collectionLink}>
                      مقالات أخرى من {featuredArticle.collectionTitle}
                    </Link>
                  </div>
                </div>

                <div className={styles.featuredFacts}>
                  <div className={styles.factCard}>
                    <span>إجابات سريعة</span>
                    <strong>{featuredArticle.quickAnswerCount}</strong>
                  </div>
                  <div className={styles.factCard}>
                    <span>خطوات عملية</span>
                    <strong>{featuredArticle.stepCount}</strong>
                  </div>
                  <div className={styles.factCard}>
                    <span>أسئلة بعد القراءة</span>
                    <strong>{featuredArticle.faqCount}</strong>
                  </div>
                  <div className={styles.factCard}>
                    <span>حجم الشرح</span>
                    <strong>{featuredArticle.wordCount} كلمة</strong>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.resultsEyebrow}>
                <BookOpenText size={15} />
                {activeCollection ? activeCollection.title : 'كل المقالات'}
              </span>
              <h3>{activeCollection ? 'مقالات هذا الموضوع' : 'مقالات جاهزة للقراءة الآن'}</h3>
              <p>
                {activeCollection
                  ? activeCollection.description
                  : 'اختر مقالك حسب السؤال الذي في بالك. الأفضل أن تبدأ بمقال واحد، تثبّت فكرته، ثم تستخدم الرابط العملي الذي يظهر داخله.'}
              </p>
            </div>
            {hasSearchQuery ? (
              <div className={styles.searchSummaryCard}>
                <span className={styles.searchSummaryLabel}>بحث حي</span>
                <strong>نتائج عن: {deferredSearchQuery}</strong>
                <p>إذا لم تجد ما تريد الآن، جرّب كلمة أقصر أو غيّر التصفية. أفضل بحث في المدونة يكون بكلمة القرار لا بجملة طويلة.</p>
              </div>
            ) : (
              <div className={styles.searchSummaryCard}>
                <span className={styles.searchSummaryLabel}>مسار مقترح</span>
                <strong>{activeCollection ? 'اقرأ مقالاً واحداً من هذا الموضوع ثم استخدم الأداة المرتبطة' : 'ابدأ بمقال واحد لا بكل الأرشيف'}</strong>
                <p>
                  المدونة ليست فهرساً للتنقل العشوائي. اختر سؤالاً واضحاً، اقرأ المقال حتى الخطوة التالية،
                  ثم استخدم الرابط العملي في نهايته قبل الانتقال إلى مقال جديد.
                </p>
              </div>
            )}
          </div>

          {hasSearchResults ? (
            <div className={styles.articleGrid}>
              {listArticles.map((article, index) => (
                <Fragment key={article.href}>
                  <Link
                    href={article.href}
                    className={styles.articleCard}
                    style={{ '--collection-accent': article.collectionAccent }}
                  >
                    <div className={styles.articleCardTop}>
                      <span className={styles.articleCollection}>{article.collectionTitle}</span>
                      <span className={styles.articleArrow}>
                        <ArrowLeft size={16} />
                      </span>
                    </div>
                    <div className={styles.articleCardBody}>
                      <h4>{article.title}</h4>
                      <p>{article.description}</p>
                      {article.summaryValue ? (
                        <span className={styles.articleCardExcerpt}>{article.summaryValue}</span>
                      ) : null}
                    </div>
                    <div className={styles.articleMetaRow}>
                      {buildArticleMeta(article).map((metaItem) => (
                        <span
                          key={`${article.href}-${metaItem.id}`}
                          className={`${styles.articleMetaChip} ${getArticleMetaToneClass(metaItem.tone)}`}
                        >
                          <span>{metaItem.label}</span>
                          <strong>{metaItem.value}</strong>
                        </span>
                      ))}
                    </div>
                    <span className={styles.articleCardFooter}>
                      افتح المقال
                      <ArrowLeft size={15} />
                    </span>
                  </Link>
                  {(index + 1) % 4 === 0 ? (
                    <AdInFeed slotId={`blog-list-in-feed-${Math.floor(index / 4) + 1}`} slotKey="inFeedBlog" />
                  ) : null}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyStateBadge}>لا توجد نتائج بهذه الصيغة</span>
              <strong>جرّب كلمة أبسط أو غيّر الموضوع المختار</strong>
              <p>
                لم نجد مقالاً يطابق هذه الصيغة. جرّب كلمة من السؤال لا الجملة كاملة: “نوم”، “قيلولة”،
                “أسمنت”، أو “حديد”. غالباً ستصل أسرع عندما تقلل الكلمات لا عندما تزيدها.
              </p>
              <div className={styles.emptyStateActions}>
                <button type="button" className={styles.showMoreButton} onClick={() => setSearchQuery('')}>
                  امسح البحث
                </button>
                <button type="button" className={styles.showMoreButton} onClick={() => handleFilterChange('all')}>
                  اعرض كل المقالات
                </button>
              </div>
            </div>
          )}

          {hasSearchResults && remainingArticleCount > 0 ? (
            <div className={styles.showMoreWrap}>
              <button type="button" className={styles.showMoreButton} onClick={handleShowMore}>
                اعرض دفعة أخرى من المقالات
                <span>{remainingArticleCount} متبقية</span>
              </button>
            </div>
          ) : null}

          <div id="blog-pathways" className={styles.supportFlow}>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionHead}>
                <span className={styles.sideEyebrow}>
                  <Layers3 size={15} />
                  إذا أردت البدء من صفحة لا من مقال
                </span>
                <h3>مسارات مفيدة قبل القراءة أو بعدها</h3>
                <p>هذه الصفحات تظهر بعد النتائج حتى لا تزاحم القراءة. اختر منها فقط إذا أردت أداة، فهرساً، أو صفحة يومية تكمل السؤال الذي بدأت به.</p>
              </div>
              <div className={styles.shortcutGrid}>
                {visibleShortcutLinks.map((shortcut) => (
                  <ShortcutCard key={shortcut.href} shortcut={shortcut} />
                ))}
              </div>
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sideSectionHead}>
                <span className={styles.sideEyebrow}>حسب الموضوع</span>
                <h3>غيّر زاوية القراءة من هنا</h3>
                <p>استخدم هذه الأزرار كفلاتر واضحة، لا كشبكة انتقالات أخرى. اختر موضوعاً واحداً ثم اقرأ النتائج الأقرب.</p>
              </div>
              <div className={styles.collectionMiniGrid}>
                {collections.map((collection) => (
                  <CollectionMiniCard
                    key={collection.id}
                    collection={collection}
                    isActive={deferredFilterId === collection.id}
                    onSelect={handleFilterChange}
                  />
                ))}
              </div>
            </div>

            {activeSupportLinks?.length ? (
              <div className={styles.sideSection}>
                <div className={styles.sideSectionHead}>
                  <span className={styles.sideEyebrow}>خطوة تالية</span>
                  <h3>صفحات تكمل المسار الحالي</h3>
                  <p>بعد أن تقرأ مقالاً في هذا الموضوع، هذه هي الوجهات الأقرب للتطبيق العملي.</p>
                </div>
                <div className={styles.relatedLinkList}>
                  {activeSupportLinks.map((item) => (
                    <SupportPathway key={item.href} item={item} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
