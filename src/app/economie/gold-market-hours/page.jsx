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
          title="كيف تساعدك الصفحة على قراءة الذهب؟"
          lead="هذا الجزء يجمع بين الحالة الحالية وأفضل نافذة والفرق بين السوق العالمي والسوق المحلي حتى تبقى الصورة واضحة."
        />
        <EconomyGuide sections={serverModel.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع التي تستند إليها طبقة الذهب"
          lead="نعرض هذه المراجع بوضوح حتى تعرف من أين جاءت أوقات السوق والمعلومات الأساسية المعروضة هنا."
        />
        <EconomySourceLinks links={serverModel.sourceLinks} />
      </section>

      {serverModel.ramadanSection ? (
        <section className="economy-section">
          <EconomySectionHeader
            title={serverModel.ramadanSection.title}
            lead="نضيف هذا السياق عندما يؤثر الموسم نفسه في نمط المتابعة المحلي أو في أوقات النشاط المعتادة."
          />
          <EconomyGuide sections={[serverModel.ramadanSection]} />
        </section>
      ) : null}

      <section className="economy-section">
        <EconomySectionHeader
          title="إذا كنت تتابع الذهب يومياً، ما الخطوة التالية؟"
          lead="هذه الروابط تساعدك على الانتقال بسرعة بين الذهب والسوق الأمريكي وساعة السوق وأفضل وقت للتداول."
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
            lead="هذا الشريط يضع حالة الذهب والدولار أمامك بسرعة قبل أن تنتقل إلى نافذة السيولة أو الشرح المحلي الأعمق."
          />
        </Suspense>

        <Suspense fallback={null}>
          <GoldMarketHoursLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="أسئلة الذهب التي تجيب عنها الصفحة"
            lead="إذا كان سؤالك عن فتح الذهب أو السيولة أو حركة XAU/USD، فهذه هي أسرع نقاط البداية داخل الصفحة."
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
