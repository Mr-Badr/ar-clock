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
import {
  EconomyGuide,
  EconomyIntentCards,
  EconomyReadingShelf,
  EconomySectionHeader,
  EconomySourceLinks,
  InsightCards,
} from '@/components/economy/common';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import GoldMarketHoursLive from '@/components/economy/GoldMarketHoursLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const PAGE_SCOPE = 'gold-market-hours';
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.goldMarketHours);
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage(PAGE_SCOPE, FAQ_ITEMS.goldMarketHours);

export const metadata = buildEconomyToolPageMetadata(PAGE_SCOPE, FAQ_ITEMS.goldMarketHours);

async function GoldMarketHoursServerSections() {
  const { serverModel } = await getEconomyPageServerState(PAGE_SCOPE);

  return (
    <>
      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تجيب الصفحة عن سؤال الذهب بشكل أفضل؟"
          lead="هذا المحتوى يولّد من نموذج الذهب نفسه، لذلك يربط بين الحالة الحالية، أفضل نافذة، والفرق بين السوق العالمي والسوق المحلي بشكل أوضح."
        />
        <EconomyGuide sections={serverModel.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع التي تستند إليها طبقة الذهب"
          lead="إظهار المراجع المرجعية داخل الصفحة يعزز الثقة ويقوي دلالة أن هذه الأداة مبنية على ساعات سوق معروفة لا على وصف تسويقي عام."
        />
        <EconomySourceLinks links={serverModel.sourceLinks} />
      </section>

      {serverModel.ramadanSection ? (
        <section className="economy-section">
          <EconomySectionHeader
            title={serverModel.ramadanSection.title}
            lead="نضيف هذا السياق عندما يكون الموسم نفسه مؤثراً في نمط المتابعة المحلي، حتى تبقى الصفحة أقرب لاستخدام الزائر العربي الحقيقي."
          />
          <EconomyGuide sections={[serverModel.ramadanSection]} />
        </section>
      ) : null}

      <section className="economy-section">
        <EconomySectionHeader
          title="إذا كان الزائر يتابع الذهب يومياً، إلى أين يذهب بعد ذلك؟"
          lead="هذه الروابط تبني رحلة استخدام حقيقية بين الذهب والسوق الأمريكي وساعة السوق وأفضل وقت للتداول."
        />
        <InsightCards cards={serverModel.relatedTools} />
      </section>
    </>
  );
}

export default async function GoldMarketHoursPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
  } = await getCachedEconomyPageSnapshot(PAGE_SCOPE);
  const schemas = buildEconomyToolPageSchemas({ scope: PAGE_SCOPE, faqItems: FAQ_ITEMS.goldMarketHours });

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={schemas} />

      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope={PAGE_SCOPE}
            initialSnapshot={liveSnapshot}
            title="نبض الذهب والدولار الآن"
            lead="وجود شريط حي في أعلى الصفحة يجعل سؤال الذهب يبدأ بإحساس السوق الفعلي، ثم ينتقل إلى نافذة السيولة والشرح المحلي الأكثر عمقاً."
          />
        </Suspense>

        <Suspense fallback={null}>
          <GoldMarketHoursLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="صيغ بحث الذهب التي تخدمها الصفحة"
            lead="هذه الطبقة تترجم نيات البحث الفعلية حول فتح الذهب والسيولة والـ XAUUSD إلى محتوى مرئي واضح وقابل للفهرسة."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <Suspense fallback={null}>
          <GoldMarketHoursServerSections />
        </Suspense>

        <EconomyReadingShelf
          title="اقرأ قبل متابعة الذهب"
          lead="هذه الأدلة تضيف قيمة فوق سؤال هل الذهب مفتوح الآن: متى تكون النافذة الأفضل، وما علاقة الجلسات، وكيف تفصل بين السوق العالمي والمتاجر المحلية."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
