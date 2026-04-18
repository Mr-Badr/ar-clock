// components/economy/BestTradingTimeLive.jsx
'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Lightning, Target } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildBestTradingTimePageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import HourlyActivityChart from './HourlyActivityChart';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  CityComparisonWidget,
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySpotlight,
  EconomyStatCards,
  EconomyTable,
  EconomyToolCards,
  TradingProfileSelector,
} from './common';

export default function BestTradingTimeLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildBestTradingTimePageModel, initialViewer, initialNowIso);
  const [profileId, setProfileId] = useState('scalper');
  const [compareCityId, setCompareCityId] = useState(model?.cityComparisonOptions?.[0]?.id || 'sa');

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <Target size={16} weight="duotone" />
              ما أفضل وقت للتداول اليوم؟
            </>
          )}
          title="نحمّل أفضل نافذة للتداول من مدينتك"
          lead="بعد تحديد منطقتك الزمنية نحسب متى تكون نافذة التداول الأنسب اليوم لمتابعة الفوركس والذهب من يومك المحلي."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  const selectedProfile = model.profileRecommendations[profileId] || model.profileRecommendations.scalper;
  const comparison = model.cityComparisonMap[compareCityId] || Object.values(model.cityComparisonMap)[0];

  return (
    <div className="economy-stack">
      <EconomyHero
        eyebrow={(
          <>
            <Target size={16} weight="duotone" />
            ما أفضل وقت للتداول اليوم؟
          </>
        )}
        title={model.heroTitle}
        lead={model.heroLead}
        metaPills={[
          { label: model.viewer.sublabel },
          { label: `أفضل نافذة: ${model.bestWindow.startLabel} - ${model.bestWindow.endLabel}` },
          { label: `الآن: ${model.nowLabel}` },
        ]}
        note={model.viewer.notice}
      />

      <EconomyStatCards cards={model.signalCards} />
      <EconomySpotlight model={model.spotlight} />

      <TradingProfileSelector
        selectedId={profileId}
        onSelect={setProfileId}
        options={[
          { id: 'scalper', label: 'مضاربة يومية قصيرة', icon: '⚡' },
          { id: 'swing', label: 'تداول أسبوعي', icon: '📈' },
          { id: 'news', label: 'متابعة الأخبار', icon: '📰' },
          { id: 'gold', label: 'تداول الذهب', icon: '🥇' },
        ]}
      />

      <AdTopBanner slotId="top-economy-best-trading-time" />

      <EconomyBanner
        kicker="الخلاصة العملية"
        title={model.bestWindow.isActive ? 'أنت داخل أفضل نافذة الآن' : 'أفضل نافذة اليوم معروضة بوضوح'}
        detail={`أفضل فترة لمتابعة EUR/USD وXAU/USD من ${model.bestWindow.startLabel} إلى ${model.bestWindow.endLabel} بتوقيتك، لأنها تجمع عادةً أعلى سيولة وتفاعل أوضح مع الأخبار.`}
        tone={model.bestWindow.isActive ? 'success' : 'warning'}
      />

      <EconomyBanner
        kicker="تخصيص سريع"
        title={selectedProfile.title}
        detail={selectedProfile.summary}
        tone="info"
      >
        <p className="economy-banner__detail">{selectedProfile.detail}</p>
      </EconomyBanner>

      <EconomyBanner
        kicker="إخلاء مسؤولية"
        title={model.legalDisclaimer.title}
        detail={model.legalDisclaimer.summary}
        tone="danger"
      >
        <div className="economy-guide-grid">
          {model.disclaimerCards.map((card) => (
            <article key={card.title} className="economy-copy-card">
              <h3 className="economy-copy-card__title">{card.title}</h3>
              <p className="economy-copy-card__body">{card.body}</p>
            </article>
          ))}
        </div>
        <p className="economy-banner__detail">{model.legalDisclaimer.detail}</p>
        <div className="economy-source-links">
          <Link href="/disclaimer" className="economy-meta-pill">
            قراءة صفحة إخلاء المسؤولية
          </Link>
          <Link href="/economie/stock-markets" className="economy-meta-pill">
            تحقق من حالة السوق
          </Link>
        </div>
      </EconomyBanner>

      <section className="economy-section">
        <EconomySectionHeader
          title="متى تنشط السيولة في يومك؟"
          lead="هذا الرسم يساعد المستخدم العربي على ربط يومه الشخصي بحركة السوق، بدل الاعتماد على ساعات نيويورك أو لندن المجردة."
        />
        <HourlyActivityChart chart={model.activityChart} title="منحنى أفضل الساعات في يومك" />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أفضل نوافذ هذا الأسبوع"
          lead="يعرض الجدول التالي التوقيت المحلي الفعلي لأهم ثلاث لحظات: تداخل لندن ونيويورك، قيادة لندن، وأول ساعة من نيويورك."
        />
        <EconomyTable
          columns={['اليوم', 'تداخل لندن ونيويورك', 'قيادة لندن', 'أول ساعة نيويورك']}
          rows={model.tradingWeek.map((item) => ({
            key: item.key,
            cells: [item.dayLabel, item.overlapLabel, item.londonLeadLabel, item.usOpenLabel],
          }))}
        />
      </section>

      <AdInArticle slotId="mid-economy-best-trading-time" />

      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تساعدك هذه الأداة؟"
          lead="نريد أن تكون الصفحة مفيدة فعلاً، لا مجرد عنوان جذاب. لهذا نوضح أين تفيدك، وأين يجب أن تتوقف وتتحقق من مصادر أخرى."
        />
        <EconomyGuide sections={model.helpSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="توصيات عملية حسب الاستخدام"
          lead="لا نكتفي بقول إن السيولة مرتفعة، بل نربط ذلك بما يريده الزائر فعلاً: متابعة الذهب، المضاربة اليومية، أو اختيار جلسة أهدأ."
        />
        <EconomyGuide sections={model.recommendationCards} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسوأ أوقات التداول"
          lead="هذا القسم يجيب عن السؤال الذي يفتقده المحتوى العربي عادة: متى أتجنب التداول أو أخفف اندفاعي؟"
        />
        <EconomyTable
          columns={['الوقت أو الحالة', 'لماذا يُتجنب؟', 'الإجراء الأفضل']}
          rows={model.worstTradingRows}
        />
      </section>

      <CityComparisonWidget
        options={model.cityComparisonOptions}
        selectedId={compareCityId}
        onSelect={setCompareCityId}
        comparison={comparison}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="قبل أن تعتمد على التوقيت"
          lead="هذه الصفحة تعطيك أفضلية تنظيمية، لكن القرار المسؤول يحتاج إلى تحقق إضافي من الوسيط والسوق والأخبار والمخاطر."
        />
        <EconomyTable
          columns={['ما الذي تتحقق منه؟', 'لماذا يهم؟', 'ما الإجراء الصحيح؟']}
          rows={model.verificationRows.map((item) => ({
            key: item.key,
            cells: item.cells,
          }))}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="استخدمها بمسؤولية"
          lead="هذه النصائح مقصودة لتقليل سوء الفهم: نحن نحاول مساعدتك على ترتيب وقتك، لا إعطاء يقين وهمي أو قرار تداول جاهز."
        />
        <EconomyGuide sections={model.responsibleUseSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="دليل مختصر"
          lead="هذه الإرشادات تختصر لماذا تختلف أفضل ساعات التداول بين مدينة وأخرى، وكيف تتغير مع التوقيت الصيفي."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="حتى مع وجود توصية زمنية، تبقى الأسئلة الأساسية مهمة: هل السوق مفتوح الآن؟ ومتى تبدأ لندن؟ ولماذا تتغير المواعيد؟"
        />
        <EconomyFaq items={model.faqItems || FAQ_ITEMS.bestTradingTime} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="بعد معرفة أفضل نافذة، استخدم الأدوات التالية لمتابعة الحالة الحية وقراءة اليوم كاملاً بصرياً."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="info">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">قاعدة سريعة</h2>
            <p className="market-card__subtitle">إذا كنت تريد أقصر جواب عملي</p>
          </div>
          <Lightning size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">
          راقب بداية لندن إذا كنت تريد دخولاً أبكر، وراقب تداخل لندن ونيويورك إذا كنت تريد أوضح سيولة، وابتعد عن الساعات الهادئة إذا كانت استراتيجيتك تحتاج حركة قوية.
        </p>
        <p className="economy-banner__detail">
          والأهم: استخدم هذه الصفحة كأداة مساعدة للفهم والتنظيم، لا كأمر مباشر للدخول أو كمصدر حقيقة مطلق.
        </p>
      </section>
    </div>
  );
}
