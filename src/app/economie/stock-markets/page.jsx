import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildEconomyPageSearchCoverage,
  buildEconomyToolPageMetadata,
  buildEconomyToolPageSchemas,
} from '@/lib/economy/page-helpers';
import {
  getCachedEconomyPageSnapshot,
  getEconomyPageServerState,
} from '@/lib/economy/page-snapshots.server';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import {
  EconomyGuide,
  EconomyIntentCards,
  EconomyReadingShelf,
  EconomySectionHeader,
} from '@/components/economy/common';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import StockMarketsLive from '@/components/economy/StockMarketsLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const PAGE_SCOPE = 'stock-markets';
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.stockMarkets);
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage(PAGE_SCOPE, FAQ_ITEMS.stockMarkets);

export const metadata = buildEconomyToolPageMetadata(PAGE_SCOPE, FAQ_ITEMS.stockMarkets);

async function StockMarketsServerSections() {
  const { serverModel } = await getEconomyPageServerState(PAGE_SCOPE);

  return (
    <>
      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تشرح الصفحة حالة البورصات بشكل قابل للفهرسة؟"
          lead="هذه الفقرات تبني طبقة HTML واضحة حول افتتاح السوق الأمريكي، فروق الأيام بين الأسواق العربية والعالمية، والجلسات الموسعة."
        />
        <EconomyGuide sections={serverModel.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="ما الذي نعد به وما الذي يحتاج تحققاً إضافياً؟"
          lead="إظهار منهج الدقة وحدود الاستخدام هنا يساعد المستخدم ومحركات البحث على فهم قيمة الصفحة وحدودها بوضوح."
        />
        <EconomyGuide sections={serverModel.trustPoints} />
      </section>
    </>
  );
}

export default async function StockMarketsPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
  } = await getCachedEconomyPageSnapshot(PAGE_SCOPE);
  const schemas = buildEconomyToolPageSchemas({ scope: PAGE_SCOPE, faqItems: FAQ_ITEMS.stockMarkets });

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={schemas} />
      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope={PAGE_SCOPE}
            initialSnapshot={liveSnapshot}
            title="نبض البورصات المرجعية الآن"
            lead="قبل الدخول في الشاشة التفصيلية، تحصل الصفحة على طبقة أسعار وحالة أسواق مرجعية تجعلها أقرب إلى لوحة أسواق حقيقية من أول تحميل."
          />
        </Suspense>

        <Suspense fallback={null}>
          <StockMarketsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="صيغ البحث الأساسية حول البورصات"
            lead="نغطي هنا أسئلة البورصات العالمية والعربية كما يبحث بها الناس فعلياً: هل السوق مفتوح الآن، متى يفتح تاسي، وهل بورصة دبي أو القاهرة مفتوحة اليوم."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <Suspense fallback={null}>
          <StockMarketsServerSections />
        </Suspense>

        <EconomyReadingShelf
          title="اقرأ لفهم السوق قبل الشاشة"
          lead="هذه الأدلة تضيف طبقة تفسيرية حول السوق الأمريكي وساعة السوق حتى لا تبقى متابعة البورصات مجرد جدول فتح وإغلاق."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
