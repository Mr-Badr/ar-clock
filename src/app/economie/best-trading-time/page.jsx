import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildEconomyPageSearchCoverage,
  buildEconomyToolPageMetadata,
  buildEconomyToolPageSchemas,
} from '@/lib/economy/page-helpers';
import { getCachedEconomyPageSnapshot } from '@/lib/economy/page-snapshots.server';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import {
  EconomyGuide,
  EconomyIntentCards,
  EconomyReadingShelf,
  EconomySectionHeader,
  InsightCards,
} from '@/components/economy/common';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import BestTradingTimeLive from '@/components/economy/BestTradingTimeLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const PAGE_SCOPE = 'best-trading-time';
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.bestTradingTime);
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage(PAGE_SCOPE, FAQ_ITEMS.bestTradingTime);

export const metadata = buildEconomyToolPageMetadata(PAGE_SCOPE, FAQ_ITEMS.bestTradingTime);

export default async function BestTradingTimePage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
    serverModel,
  } = await getCachedEconomyPageSnapshot(PAGE_SCOPE);
  const schemas = buildEconomyToolPageSchemas({ scope: PAGE_SCOPE, faqItems: FAQ_ITEMS.bestTradingTime });

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={schemas} />
      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope={PAGE_SCOPE}
            initialSnapshot={liveSnapshot}
            title="نبض السوق قبل التوصية الزمنية"
            lead="بهذا تبدأ الصفحة بإحساس حيّ للسوق ثم تنتقل إلى أفضل نافذة يومية، بدلاً من تقديم توصية زمنية معزولة عن الواقع اللحظي."
          />
        </Suspense>

        <Suspense fallback={null}>
          <BestTradingTimeLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="صيغ البحث التي تلتقطها الصفحة"
            lead="هذه الصيغ تغطي نية القرار الفعلية: أفضل وقت لتداول الذهب أو الفوركس، الوقت الذي يجب تجنبه، والفرق بين أفضل وأسوأ النوافذ اليومية."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="كيف تستخدم الصفحة بشكل صحيح؟"
            lead="بدلاً من صياغة عامة عن أفضل وقت، تشرح هذه الطبقة الثابتة متى تساعدك الصفحة فعلاً، ومتى لا تكفي وحدها، وكيف تربطها بسياقك الفعلي."
          />
          <EconomyGuide sections={serverModel.helpSections} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="توصيات عملية قبل اتخاذ أي قرار"
            lead="هذه ليست إشارات شراء أو بيع، بل طريقة لترجمة الوقت إلى استخدام أكثر ذكاءً بحسب أسلوب المتابعة والسوق الذي تراقبه."
          />
          <InsightCards cards={serverModel.recommendationCards} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="الاستخدام المسؤول لهذه الصفحة"
            lead="هذا الجزء مهم للثقة والوضوح: أفضل وقت لا يساوي قراراً جاهزاً، والصفحة هنا للتصفية والتنظيم لا لاستبدال التحقق والسوق والوسيط."
          />
          <EconomyGuide sections={serverModel.responsibleUseSections} />
        </section>

        <EconomyReadingShelf
          title="أدلة تساعدك على قراءة التوقيت"
          lead="هذه الأدلة تضيف طبقة فهم فوق التوصية الزمنية نفسها: كيف تقرأ الساعة، ومتى ينشط الذهب، وكيف ترتبط الجلسات بالنافذة الأفضل."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
