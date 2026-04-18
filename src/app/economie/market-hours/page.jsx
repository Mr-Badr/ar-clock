import Link from 'next/link';
import { BarChart3, BellRing, Clock3, Coins, Globe2, TrendingUp } from 'lucide-react';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import {
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomyReadingShelf,
  EconomySectionHeader,
  InsightCards,
} from '@/components/economy/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildEconomyBreadcrumbSchema,
  buildEconomyFaqSchema,
  buildEconomyToolSchema,
} from '@/lib/economy/page-helpers';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.marketHours);

const MARKET_HOURS_TOOLS = [
  {
    href: '/economie/us-market-open',
    title: 'متى يفتح السوق الأمريكي اليوم؟',
    description: 'اعرف وقت الافتتاح من مدينتك، والعد التنازلي، وأول ساعة تداول فعلية.',
    icon: TrendingUp,
  },
  {
    href: '/economie/gold-market-hours',
    title: 'هل الذهب مفتوح الآن؟',
    description: 'تحقق من حالة الذهب الحالية وأقوى نوافذ النشاط خلال اليوم.',
    icon: Coins,
  },
  {
    href: '/economie/forex-sessions',
    title: 'متى تبدأ جلسة لندن ونيويورك اليوم؟',
    description: 'تابع جلسات الفوركس الأربع واعرف التداخل الأعلى والسيولة الأقوى.',
    icon: Globe2,
  },
  {
    href: '/economie/stock-markets',
    title: 'هل البورصات العالمية مفتوحة الآن؟',
    description: 'شاهد البورصات المفتوحة والمغلقة الآن في صفحة عربية واحدة.',
    icon: BarChart3,
  },
  {
    href: '/economie/market-clock',
    title: 'أين السيولة الأعلى الآن؟',
    description: 'فهم بصري للحظة الحالية: أي الأسواق أنشط الآن وأيها يهدأ.',
    icon: Clock3,
  },
  {
    href: '/economie/best-trading-time',
    title: 'ما أفضل وقت للتداول اليوم؟',
    description: 'اعرف نوافذ التداول الأفضل بحسب التداخل والسيولة ومدينة المستخدم.',
    icon: BellRing,
  },
];

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين صفحة ساعات الأسواق وهذه الأدوات الفردية؟',
    answer: 'هذه الصفحة تجمع نية البحث الواسعة حول ساعات الأسواق والتداول، ثم توجهك إلى الصفحة الأدق حسب سؤالك: السوق الأمريكي، الذهب، الفوركس، البورصات، أو أفضل وقت للتداول.',
  },
  {
    question: 'هل هذه الصفحة مفيدة إذا كنت أبحث فقط عن وقت الذهب أو السوق الأمريكي؟',
    answer: 'نعم، لأنها تختصر عليك اختيار الأداة الصحيحة بسرعة، وتوضح الفرق بين الأسئلة المتقاربة بدل أن تضيع بين صفحات متفرقة.',
  },
  {
    question: 'هل هذه الأدوات تعطي الوقت المحلي لمدينتي؟',
    answer: 'الصفحات الفردية داخل القسم مبنية لتعرض الوقت المحلي للمستخدم أو للمدن العربية المستهدفة، وهذا جزء أساسي من قيمة القسم.',
  },
  {
    question: 'من يستفيد أكثر من هذا القسم؟',
    answer: 'المتداول اليومي، ومتابع الذهب، ومن يبحث عن ساعات السوق الأمريكي أو تداخل جلسات الفوركس، وكل من يريد جواباً سريعاً عن حالة السوق الآن.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: 'ساعات الأسواق والتداول | السوق الأمريكي والذهب والفوركس والبورصات',
  description:
    'ابدأ من صفحة واحدة تجمع أهم أسئلة ساعات الأسواق: متى يفتح السوق الأمريكي؟ هل الذهب مفتوح الآن؟ متى تبدأ جلسات الفوركس؟ وهل البورصات العالمية مفتوحة اليوم؟',
  keywords: [
    'ساعات الأسواق',
    'ساعات التداول',
    'متى يفتح السوق الأمريكي',
    'هل الذهب مفتوح الآن',
    'جلسات الفوركس الآن',
    'هل البورصات العالمية مفتوحة الآن',
    'ساعة السوق الآن',
    'أفضل وقت للتداول اليوم',
    'أوقات الأسواق العالمية',
    'أوقات تداول الذهب والفوركس',
  ],
  url: `${SITE_URL}/economie/market-hours`,
});

export default function EconomyMarketHoursHubPage() {
  const pageSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-hours',
    name: 'ساعات الأسواق والتداول',
    description: 'بوابة عربية تجمع أهم أدوات وقت السوق الأمريكي والذهب والفوركس والبورصات العالمية في مكان واحد.',
    about: [
      'ساعات الأسواق',
      'ساعات التداول',
      'السوق الأمريكي',
      'الذهب',
      'الفوركس',
      'البورصات العالمية',
    ],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'ساعات الأسواق والتداول',
    '/economie/market-hours',
  );
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-hours',
    items: FAQ_ITEMS,
  });
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ساعات الأسواق والتداول',
    url: `${SITE_URL}/economie/market-hours`,
    inLanguage: 'ar',
    description: 'صفحة تجمع أدوات السوق الأمريكي والذهب والفوركس والبورصات العالمية في مسار واحد مبني على نيات البحث العربية اليومية.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <EconomyAdLayout>
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
            <EconomyFaq items={FAQ_ITEMS} />
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
