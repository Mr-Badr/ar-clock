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
            lead="هذه الصفحة ليست مجرد فهرس. إنها بوابة نية بحث واضحة تجمع أكثر الأسئلة الاقتصادية اليومية شيوعاً في العالم العربي: متى يفتح السوق الأمريكي، هل الذهب مفتوح الآن، متى تبدأ جلسة لندن ونيويورك، وهل البورصات العالمية مفتوحة اليوم. من هنا يختار المستخدم الصفحة الأدق بسرعة."
            metaPills={[
              { label: 'نية بحث يومية واضحة' },
              { label: 'جواب مباشر ثم أداة متخصصة' },
              { label: 'روابط داخلية أقوى للفهرسة' },
            ]}
            note="الفكرة هنا تشبه مسارات الحاسبات العليا: نعطي Google والمستخدم صفحة جامعة مفهومة، ثم نمررهما إلى الصفحة الأعمق حسب السؤال الحقيقي."
          />

          <section className="economy-section">
            <EconomySectionHeader
              title="صيغ البحث التي يغطيها هذا المسار"
              lead="هذه الصيغ تعطي الصفحة الجامعة وضوحاً أكبر في الفهرسة، وتختصر للزائر أهم الأسئلة التي سيجد إجاباتها داخل هذا المسار الاقتصادي."
            />
            <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
          </section>

          <section className="economy-section">
            <EconomySectionHeader
              title="ابدأ من السؤال الذي يكتبه الناس فعلاً"
              lead="بدلاً من صفحة اقتصاد عامة، هذا المسار مبني حول أسئلة وقتية مباشرة لها طلب يومي ونسبة نقر أفضل عندما تكون الصياغة والهيكل واضحين."
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
              title="لماذا هذا المسار مهم للنمو؟"
              lead="لأن أدوات الاقتصاد عندك جيدة، لكن Google والمستخدم يحتاجان أيضاً صفحة تربط بينها وتشرح الفروق بين النوايا المتقاربة."
            />
            <EconomyGuide
              sections={[
                {
                  title: 'السوق الأمريكي',
                  body: 'يخدم نية بحث حادة وعالية التكرار، خصوصاً بصيغ مثل: متى يفتح السوق الأمريكي اليوم؟ وكم باقي على الافتتاح بتوقيت السعودية أو المغرب أو مصر.',
                },
                {
                  title: 'الذهب',
                  body: 'الطلب هنا لحظي جداً. المستخدم لا يريد مقالاً عاماً عن الذهب، بل يريد أن يعرف فوراً هل السوق مفتوح الآن ومتى ترتفع السيولة.',
                },
                {
                  title: 'الفوركس والبورصات',
                  body: 'هنا تكثر الأسئلة المقارِنة: جلسة لندن أم نيويورك؟ هل البورصات العالمية مفتوحة الآن؟ وأين أعلى تداخل وسيولة خلال اليوم؟',
                },
                {
                  title: 'ساعة السوق وأفضل وقت للتداول',
                  body: 'هذه الصفحات لا تعتمد فقط على “مفتوح أو مغلق”، بل تساعد المستخدم على فهم جودة اللحظة الحالية وهل هي مناسبة فعلاً للدخول أو الانتظار.',
                },
              ]}
            />
          </section>

          <section className="economy-section">
            <EconomySectionHeader
              title="مسارات مرتبطة داخل القسم"
              lead="هذا يحافظ على المستخدم داخل التجربة ويعطي Google شبكة أوضح من الصفحات ذات العلاقة الفعلية."
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
              lead="FAQ قصير يساعد الصفحة الجامعة على أن تكون مفهومة للمستخدم ومحركات البحث معاً."
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
