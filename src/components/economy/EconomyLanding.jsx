'use client';

import { ActivityIcon, ChartLineUp, GlobeHemisphereEast } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildEconomyLandingLiveModel } from '@/lib/economy/engine';

import styles from './economy-landing-live.module.css';
import HourlyActivityChart from './HourlyActivityChart';
import {
  EconomyHero,
  EconomySectionHeader,
  EconomySpotlight,
  EconomyStatCards,
  EconomyGuide,
  EconomyToolCards,
  InsightCards,
} from './common';
import { useEconomyLiveModel } from './useEconomyLiveModel';

function LandingStripCard({ card }) {
  return (
    <a href={card.href} className={styles.elStripCard} data-tone={card.tone || 'default'}>
      <span className={styles.elStripCardLabel}>{card.label}</span>
      <strong className={styles.elStripCardValue}>{card.value}</strong>
      <span className={styles.elStripCardDetail}>{card.detail}</span>
    </a>
  );
}

export default function EconomyLanding({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildEconomyLandingLiveModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <ChartLineUp size={16} weight="duotone" />
              الاقتصاد الحي
            </>
          )}
          title="نجهز لوحة الاقتصاد الحية"
          lead="نربط وول ستريت والذهب والفوركس بوقتك المحلي ثم نعرض الملخص والرسوم في واجهة واحدة سريعة."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  const tickerItems = [...model.watchlist, ...model.watchlist];

  return (
    <div className={`economy-stack ${styles.elShell}`}>
      <EconomyHero
        eyebrow={(
          <>
            <ChartLineUp size={16} weight="duotone" />
            الاقتصاد الحي
          </>
        )}
        title="لوحة اقتصاد عربية تعطيك القرار الأول خلال ثوانٍ"
        lead="بدلاً من مقدمة طويلة، ابدأ من الملخص الحي: هل وول ستريت مفتوحة، هل الذهب في نافذة قوية، ما وضع الفوركس الآن، وما أفضل ساعة في يومك المحلي."
        metaPills={[
          { label: model.viewer.sublabel },
          { label: `الآن: ${model.nowLabel}` },
          { label: model.todayLabel },
        ]}
        note="ابدأ من هذه اللوحة عندما تريد قراءة سريعة: حالة السوق الآن، نافذة النشاط التالية، ثم الصفحة الأقرب لما تريد متابعته من مدينتك."
      />

      <section className={styles.elStrip}>
        <div className={styles.elStripHead}>
          <div>
            <span className={styles.elStripEyebrow}>
              <ActivityIcon size={15} weight="duotone" />
              ملخص السوق الآن
            </span>
            <h2 className={styles.elStripTitle}>أهم أربع إشارات قبل أن تختار الصفحة التالية</h2>
            <p className={styles.elStripLead}>
              هذه اللوحة تختصر وول ستريت والذهب والفوركس وأفضل ساعة حالية في شاشة واحدة، ثم تنقلك
              مباشرة إلى الأداة الأعمق إذا أردت مزيداً من التفاصيل.
            </p>
          </div>
          <div className={styles.elNow}>
            <span className={styles.elNowLabel}>الزمن المحلي</span>
            <strong className={styles.elNowValue}>{model.nowLabel}</strong>
            <span className={styles.elNowMeta}>{model.viewer.label}</span>
          </div>
        </div>

        <div className={styles.elStripGrid}>
          {model.heroCards.map((card) => (
            <LandingStripCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      <EconomyStatCards cards={model.stats} />
      <EconomySpotlight model={model.spotlight} />

      <AdTopBanner slotId="top-economy-landing" className="economy-ad-slot" />

      <section className="economy-section">
        <EconomySectionHeader
          title="خريطة الحركة الآن"
          lead="بدل خريطة عالمية معقدة، ركزنا على ثلاث مناطق قرار: آسيا، أوروبا، وأمريكا. كل بطاقة تخبرك فوراً أين الثقل الآن وما الأصول التي تستفيد من تلك المنطقة."
        />
        <div className={styles.elZoneGrid}>
          {model.zoneCards.map((zone) => (
            <article key={zone.id} className={styles.elZoneCard} data-tone={zone.tone || 'default'}>
              <div className={styles.elZoneHead}>
                <div>
                  <h3 className={styles.elZoneTitle}>{zone.title}</h3>
                  <p className={styles.elZoneSubtitle}>{zone.subtitle}</p>
                </div>
                <span className={styles.elZonePulse} aria-hidden="true" />
              </div>
              <strong className={styles.elZoneStatus}>{zone.statusLabel}</strong>
              <span className={styles.elZoneDetail}>{zone.detail}</span>
              <div className={styles.elZonePairs}>
                {zone.pairsLabel.split('·').map((item) => (
                  <span key={item.trim()}>{item.trim()}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.elTicker}>
        <div className={styles.elTickerHead}>
          <div>
            <h2>لوحة المتابعة الحية</h2>
            <p>هذا الشريط يلفت انتباهك إلى ما يستحق المتابعة الآن بلغة مختصرة وواضحة.</p>
          </div>
          <span className="economy-meta-pill">ملخص سريع قابل للتحديث</span>
        </div>
        <div className={styles.elTickerViewport}>
          <div className={styles.elTickerTrack}>
            {tickerItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.elTickerItem} data-tone={item.tone || 'default'}>
                <span className={styles.elTickerSymbol}>{item.symbol}</span>
                <strong className={styles.elTickerName}>{item.nameAr}</strong>
                <span className={styles.elTickerState}>{item.stateLabel}</span>
                <span className={styles.elTickerDetail}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أفضل وقت الآن داخل يومك"
          lead="بدلاً من حاسبة مخفية داخل صفحة أخرى، أظهرنا الإيقاع اليومي مباشرة في الصفحة الرئيسية: أين ترتفع السيولة، وأين تصبح المراقبة أهدأ."
        />
        <div className={styles.elDashboardGrid}>
          <div className={styles.elDashboardCard}>
            <span className={styles.elDashboardEyebrow}>خريطة اليوم</span>
            <HourlyActivityChart chart={model.activityChart} title="النشاط عبر 24 ساعة" />
          </div>
          <div className={styles.elDashboardCard}>
            <span className={styles.elDashboardEyebrow}>Briefing</span>
            <h3 className={styles.elDashboardTitle}>قبل أن تفتح أي أداة أخرى</h3>
            <p className={styles.elDashboardBody}>
              إذا أردت قراراً أسرع الآن، ابدأ بهذه الإشارات: الحدث الأقرب، وضع الذهب، ثم ساعة السوق
              الأنشط من يومك المحلي.
            </p>
            <div className={styles.elDashboardList}>
              {model.insightCards.map((item) => (
                <div key={item.title} className={styles.elDashboardListItem}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="ابدأ من السؤال الذي تريد حسمه الآن"
          lead="لكل سؤال صفحة مختصرة تعطيك الحالة أولاً، ثم تفتح لك الشرح والتفاصيل فقط عندما تحتاجها."
        />
        <EconomyToolCards cards={model.cards} />
      </section>

      <AdInArticle slotId="mid-economy-landing" className="economy-ad-slot" />

      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تجعل هذه اللوحة جزءاً من متابعتك اليومية؟"
          lead="استخدمها كبداية سريعة: اقرأ الحالة الحالية، افتح السوق الأقرب لك، ثم عد عندما تتغير نافذة النشاط أو المدينة التي تتابع منها."
        />
        <EconomyGuide sections={model.premiumSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="ثلاث طرق للاستفادة منها بشكل أفضل"
          lead="هذه ليست قواعد تداول، بل عادات بسيطة تجعل الانتقال بين الصفحات أسرع وأوضح وأقرب لما تحتاجه فعلاً."
        />
        <InsightCards
          cards={[
            {
              title: 'ابدأ من الحالة الحالية',
              body: 'انظر أولاً إلى ملخص السوق والذهب والفوركس، ثم افتح فقط الصفحة التي تحتاج مزيداً من التفصيل فيها.',
            },
            {
              title: 'قارن الوقت من مدينتك',
              body: 'إذا كنت تتابع من مدينة عربية مختلفة أو تغيّر موقعك، اعتمد دائماً على الوقت المحلي الظاهر هنا قبل أي خطوة.',
            },
            {
              title: 'افصل بين المتابعة والقرار',
              body: 'استخدم هذه اللوحة لتنظيم يومك وفهم الإيقاع، ثم ارجع إلى المصدر المباشر إذا كان قرارك حساساً للأخبار أو الأسعار اللحظية.',
            },
          ]}
        />
      </section>

      <section className="economy-banner" data-tone="default">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">قبل الاعتماد على أي قراءة</h2>
            <p className="market-card__subtitle">الصفحة تنظّم المشهد ولا تستبدل المصدر المباشر</p>
          </div>
          <GlobeHemisphereEast size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">
          ابدأ من هذه اللوحة عندما تريد معرفة أين يقف السوق الآن، ثم انتقل إلى الصفحة المتخصصة إذا احتجت تفاصيل أكثر عن الذهب أو وول ستريت أو الجلسات.
        </p>
        <p className="economy-banner__detail">
          إذا كان توقيت الخبر أو حركة السعر مهماً لقرارك، فاجمع هذه القراءة مع المصدر الرسمي أو منصة الوسيط قبل التصرف.
        </p>
      </section>
    </div>
  );
}
