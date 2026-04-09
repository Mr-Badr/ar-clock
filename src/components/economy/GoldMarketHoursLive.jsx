'use client';

import { ClockCountdown, Sparkle } from '@phosphor-icons/react';

import { buildGoldMarketHoursPageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import HourlyActivityChart from './HourlyActivityChart';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySourceLinks,
  EconomyTable,
  EconomyTimeline,
  EconomyToolCards,
} from './common';

export default function GoldMarketHoursLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildGoldMarketHoursPageModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <Sparkle size={16} weight="duotone" />
              هل الذهب مفتوح الآن؟
            </>
          )}
          title="نحمّل أوقات الذهب من مدينتك"
          lead="بعد تحديد منطقتك الزمنية نعرض حالة الذهب الآن وأفضل نافذة للسيولة اليومية بتوقيتك المحلي."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  return (
    <div className="economy-stack">
      <EconomyHero
        eyebrow={(
          <>
            <Sparkle size={16} weight="duotone" />
            هل الذهب مفتوح الآن؟
          </>
        )}
        title={model.heroTitle}
        lead={model.heroLead}
        metaPills={[
          { label: model.viewer.sublabel },
          { label: `الحالة: ${model.gold.statusLabel}` },
          { label: `أفضل نافذة: ${model.gold.bestWindowLabel}` },
          { label: `الآن: ${model.nowLabel}` },
        ]}
        note={model.viewer.notice}
      />

      <EconomyBanner
        kicker="الجواب السريع"
        title={model.gold.statusLabel}
        detail={`أفضل وقت لمتابعة الذهب من ${model.bestWindow.startLabel} إلى ${model.bestWindow.endLabel} بتوقيتك. أما الاستراحة اليومية المعتادة فتظهر من ${model.maintenanceWindow.startLabel} إلى ${model.maintenanceWindow.endLabel}.`}
        tone={model.gold.isActive ? 'success' : model.gold.tone}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="متى ينشط الذهب خلال يومك؟"
          lead="الذهب لا يتحرك بنفس القوة طوال اليوم. الخط الزمني التالي يوضح كيف تتسلسل جلسات آسيا ولندن ونيويورك بالنسبة لوقتك المحلي."
        />
        <EconomyTimeline timeline={model.timeline} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="خريطة نشاط الذهب خلال يومك"
          lead="هذه القراءة أهم من مجرد سؤال هل الذهب مفتوح الآن، لأنها تكشف أين ترتفع السيولة فعلاً وأين تصبح الحركة أهدأ أو أقل وضوحاً."
        />
        <HourlyActivityChart chart={model.activityChart} title="سيولة الذهب عبر جلسات اليوم" />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="جلسات الذهب الرئيسية بتوقيتك"
          lead="معظم المنافسين يكتفون بذكر أن الذهب يعمل 24 ساعة تقريباً، لكن المستخدم يحتاج فعلياً إلى معرفة متى تبدأ كل جلسة ولماذا تهمه."
        />
        <EconomyTable
          columns={['الجلسة', 'تبدأ عند', 'تنتهي عند', 'لماذا تهم الذهب؟']}
          rows={model.goldSessionRows}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أوقات الذهب في السعودية والإمارات ومصر والمغرب"
          lead="هذا الجدول هو الفجوة الأوضح في المحتوى العربي الحالي: نافذة الذهب اليومية والاستراحة المعتادة في أكثر أربع مناطق عربية بحثاً عن هذا الموضوع."
        />
        <EconomyTable
          columns={['الدولة', 'أفضل نافذة اليوم', 'الاستراحة اليومية', 'الحالة الآن']}
          rows={model.countryRows}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تستخدم هذه الصفحة بشكل صحيح؟"
          lead="الهدف هنا أن نجيب عن نية البحث اليومية، ثم نضيف الزوايا التي يغفلها كثير من المنافسين مثل الفرق بين الذهب العالمي والمتاجر المحلية."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="الإجابات التالية مكتوبة بصيغة مباشرة قابلة للاقتباس، لأنها تعالج أكثر أسئلة الذهب تكراراً في البحث العربي اليومي."
        />
        <EconomyFaq items={FAQ_ITEMS.goldMarketHours} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع المستخدمة"
          lead="نعرض بوضوح مراجع جلسات السوق حتى تبقى الصفحة مفيدة ومجانية وشفافة، من دون الحاجة إلى مزود مدفوع."
        />
        <EconomySourceLinks links={model.sourceLinks} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="إذا كنت تتابع الذهب يومياً فهذه الأدوات تكمل الصورة: جلسات الفوركس، أفضل وقت للتداول، والساعة البصرية."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="info">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">خلاصة يومية</h2>
            <p className="market-card__subtitle">إذا أردت أقصر جواب قابل للاستخدام الآن</p>
          </div>
          <ClockCountdown size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">
          راقب الذهب أثناء تداخل لندن ونيويورك، وتجنب الاستراحة اليومية عند الحاجة إلى تنفيذ سريع، ولا تخلط بين السوق العالمي للذهب وبين ساعات عمل المتاجر المحلية.
        </p>
      </section>
    </div>
  );
}
