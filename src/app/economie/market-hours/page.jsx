import { Suspense } from 'react';
import Link from 'next/link';
import { BarChart3, BellRing, Clock3, Coins, Globe2, TrendingUp } from 'lucide-react';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomyIntentCards,
  EconomyReadingShelf,
  EconomySectionHeader,
  InsightCards,
} from '@/components/economy/common';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildEconomyPageSearchCoverage,
  buildEconomyBreadcrumbSchema,
  buildEconomyFaqSchema,
  buildEconomyToolSchema,
} from '@/lib/economy/page-helpers';
import { getCachedEconomyPageSnapshot } from '@/lib/economy/page-snapshots.server';
import { ECONOMY_MARKET_HOURS_TOOLS, getEconomySeoEntry } from '@/lib/economy/seo-content';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.marketHours);
const PAGE_SEO = getEconomySeoEntry('market-hours');
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage('market-hours', PAGE_SEO.faqItems);
const MARKET_HOURS_TOOLS = ECONOMY_MARKET_HOURS_TOOLS.map((item) => ({
  ...item,
  icon:
    item.href === '/economie/us-market-open'
      ? TrendingUp
      : item.href === '/economie/gold-market-hours'
        ? Coins
        : item.href === '/economie/forex-sessions'
          ? Globe2
          : item.href === '/economie/stock-markets'
            ? BarChart3
            : item.href === '/economie/market-clock'
              ? Clock3
              : BellRing,
}));

export const metadata = buildCanonicalMetadata({
  title: PAGE_SEO.metadata.title,
  description: PAGE_SEO.metadata.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE_SEO.path}`,
});

export default async function EconomyMarketHoursHubPage() {
  const { liveSnapshot } = await getCachedEconomyPageSnapshot('market-hours');
  const pageSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: PAGE_SEO.path,
    ...PAGE_SEO.tool,
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    PAGE_SEO.breadcrumbName,
    PAGE_SEO.path,
  );
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: PAGE_SEO.path,
    items: PAGE_SEO.faqItems,
  });
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PAGE_SEO.breadcrumbName,
    url: `${SITE_URL}${PAGE_SEO.path}`,
    inLanguage: 'ar',
    description: PAGE_SEO.collection.description,
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: MARKET_HOURS_TOOLS.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={[pageSchema, collectionSchema, itemListSchema, breadcrumbSchema, faqSchema]} />

      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope="market-hours"
            initialSnapshot={liveSnapshot}
            title="نبض السوق قبل اختيار الأداة"
            lead="هذا الشريط يقدّم نظرة مرجعية حيّة على الذهب، وول ستريت، والأزواج الرئيسية حتى يختار الزائر الصفحة الأنسب بسرعة من دون قراءة طويلة."
          />
        </Suspense>

        <div className="economy-stack">
          <EconomyHero
            eyebrow="ساعات الأسواق والتداول"
            title="هل السوق الأمريكي أو الذهب أو الفوركس مفتوح الآن؟ ابدأ من هذا المسار"
            lead="هذه الصفحة تجمع أكثر الأسئلة الاقتصادية اليومية في مكان واحد: متى يفتح السوق الأمريكي، هل الذهب مفتوح الآن، متى تبدأ جلسة لندن ونيويورك، وهل البورصات العالمية مفتوحة اليوم. ابدأ من هنا ثم افتح الصفحة الأنسب لما تريد معرفته."
            metaPills={[
              { label: 'أسئلة السوق اليومية' },
              { label: 'انتقال سريع للأداة المناسبة' },
              { label: 'متابعة أوضح من مدينتك' },
            ]}
            note="إذا لم تكن متأكداً أي صفحة تحتاج أولاً، فابدأ من هذا المسار ثم انتقل إلى الأداة الأقرب لسؤالك الحالي."
          />

          <section className="economy-section">
            <EconomySectionHeader
              title="أشهر الأسئلة التي يبدأ منها الزوار"
              lead="هذه العبارات تختصر لك أكثر الأسئلة المتكررة التي ستجد إجاباتها داخل هذا المسار الاقتصادي."
            />
            <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
          </section>

          <section className="economy-section">
            <EconomySectionHeader
              title="اختر الصفحة الأقرب لما تريد معرفته"
              lead="بدلاً من التنقل بين صفحات كثيرة، ابدأ من السؤال الأقرب لك وافتح الأداة التي تعطيك الجواب المباشر."
            />
            <InsightCards
              cards={MARKET_HOURS_TOOLS.map((item) => {
                const Icon = item.icon;
                return {
                  title: item.title,
                  body: item.description,
                  href: item.href,
                  cta: 'افتح الصفحة',
                  icon: Icon,
                };
              })}
            />
          </section>

          <section className="economy-section">
            <EconomySectionHeader
              title="كيف يفيدك هذا المسار؟"
              lead="لأنه يجمع الصفحات الاقتصادية المتقاربة في مكان واحد، ويجعل الفرق بينها أوضح حتى تصل إلى الأداة المناسبة بسرعة."
            />
            <EconomyGuide
              sections={[
                {
                  title: 'السوق الأمريكي',
                  body: 'ستعرف هنا وقت افتتاح السوق الأمريكي اليوم، وكم بقي على الافتتاح بحسب توقيت مدينتك مثل السعودية أو المغرب أو مصر.',
                },
                {
                  title: 'الذهب',
                  body: 'إذا كان همك الذهب الآن، فستصل بسرعة إلى الصفحة التي توضح هل السوق مفتوح ومتى تكون السيولة أقوى خلال اليوم.',
                },
                {
                  title: 'الفوركس والبورصات',
                  body: 'ستجد هنا الصفحات التي تساعدك على مقارنة جلسة لندن ونيويورك، ومعرفة حالة البورصات العالمية، وأوقات الذروة خلال اليوم.',
                },
                {
                  title: 'ساعة السوق وأفضل وقت للتداول',
                  body: 'هذه الصفحات لا تكتفي بحالة الفتح أو الإغلاق، بل تساعدك على فهم جودة اللحظة الحالية وهل الوقت مناسب للمتابعة أو الانتظار.',
                },
              ]}
            />
          </section>

          <section className="economy-section">
            <EconomySectionHeader
              title="مسارات مرتبطة داخل القسم"
              lead="هذه الروابط تسهّل عليك التنقل بين الصفحات المرتبطة حتى تواصل المتابعة من دون الرجوع إلى البحث كل مرة."
            />
            <div className="economy-guide-grid">
              <article className="economy-copy-card">
                <h3 className="economy-copy-card__title">ابدأ من القسم الاقتصادي الكامل</h3>
                <p className="economy-copy-card__body">
                  إذا كنت تريد رؤية كل الأدوات الاقتصادية الحالية دفعة واحدة، فابدأ من صفحة الاقتصاد الرئيسية ثم عد إلى هذا المسار عند الحاجة إلى ساعات الأسواق.
                </p>
                <Link href="/economie" className="economy-tool-card__cta">افتح قسم الاقتصاد</Link>
              </article>
              <article className="economy-copy-card">
                <h3 className="economy-copy-card__title">الأدوات الزمنية المرتبطة</h3>
                <p className="economy-copy-card__body">
                  البنية الزمنية في الموقع تعطي هذه الصفحات ميزة حقيقية، لذلك من الطبيعي أن ترتبط أيضاً بصفحات الوقت وفروق التوقيت عندما يريد المستخدم التحقق من منطق التوقيت نفسه.
                </p>
                <Link href="/time-difference" className="economy-tool-card__cta">افتح فرق التوقيت</Link>
              </article>
            </div>
          </section>

          <section className="economy-section">
            <EconomySectionHeader
              title="الأسئلة الشائعة"
              lead="هذه إجابات سريعة على أكثر الأسئلة التي تظهر قبل اختيار الصفحة الاقتصادية المناسبة."
            />
            <EconomyFaq items={PAGE_SEO.faqItems} />
          </section>

          <EconomyReadingShelf
            title="أدلة مرتبطة داخل هذا المسار"
            lead="هذه الصفحات التعليمية تشرح معنى الافتتاح والجلسات والذهب والساعة البصرية، ثم تعيد المستخدم إلى الأداة الأقرب لنيته اليومية."
            items={RELATED_GUIDES}
          />
        </div>
      </EconomyAdLayout>
    </div>
  );
}
