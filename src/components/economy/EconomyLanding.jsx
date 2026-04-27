'use client';

import { ActivityIcon, ChartLineUp, GlobeHemisphereEast } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildEconomyLandingLiveModel } from '@/lib/economy/engine';
import { SITE_BRAND } from '@/lib/site-config';

import styles from './economy-landing-live.module.css';
import HourlyActivityChart from './HourlyActivityChart';
import {
  EconomyHero,
  EconomySectionHeader,
  EconomySpotlight,
  EconomyStatCards,
  EconomyToolCards,
  EconomyGuide,
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
        note={`هذا القسم مبني ليشعر كأداة تداول عربية سريعة لا كمقالة ثابتة: تحديث لحظي بالوقت، مؤشرات واضحة، ورسوم تختصر اليوم قبل أن يضطر الزائر إلى القراءة الطويلة داخل ${SITE_BRAND}.`}
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

      <AdTopBanner slotId="top-economy-landing" />

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
            <p>لا نعرض أسعاراً وهمية. هذه الشريط يوضح ما الذي يستحق المراقبة الآن ولماذا.</p>
          </div>
          <span className="economy-meta-pill">Session-driven live board</span>
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
          title="ابدأ من السؤال الذي تبحث عنه"
          lead="الصفحات التالية لا تعمل كمدونات، بل كأدوات قرار حي: لكل سؤال صفحة سريعة، بيانات واضحة، ورسوم مرتبطة بالتوقيت الفعلي."
        />
        <EconomyToolCards cards={model.cards} />
      </section>

      <AdInArticle slotId="mid-economy-landing" />

      <section className="economy-section">
        <EconomySectionHeader
          title="ما الذي يجعل التجربة أقرب إلى تطبيق اقتصادي حي؟"
          lead="هذا ليس مجرد تجميل. رفعنا طبقة الإحساس بالوقت الحقيقي والاختصار البصري حتى يشعر الزائر أنه في لوحة مراقبة يومية، لا في صفحة شرح ثابتة."
        />
        <EconomyGuide sections={model.premiumSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title={`لماذا هذا مناسب لـ${SITE_BRAND}؟`}
          lead="لأن قوة الموقع أصلاً في التوقيت والمناطق الزمنية. نحن فقط حوّلنا هذه القوة إلى اقتصاد حي يجيب بالعربية وبساطة أعلى."
        />
        <InsightCards
          cards={[
            {
              title: 'بنية الوقت موجودة بالفعل',
              body: 'لدينا تحويل مناطق زمنية واكتشاف موقع وتحديث زمني حي. هذا يجعل الاقتصاد الحي امتداداً طبيعياً بدلاً من منتج منفصل.',
            },
            {
              title: 'التجربة عربية أولاً',
              body: 'المستخدم العربي لا يريد أن يترجم جداول نيويورك أو لندن بنفسه. كل شيء هنا يبدأ من مدينته وساعته الحالية.',
            },
            {
              title: 'جاهز للتوسع',
              body: 'يمكن إضافة مفكرة اقتصادية أعمق أو أسعار حية لاحقاً فوق نفس البنية من دون إعادة بناء الواجهة من الصفر.',
            },
          ]}
        />
      </section>

      <section className="economy-banner" data-tone="default">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">ماذا بقي للمرحلة التالية؟</h2>
            <p className="market-card__subtitle">تغذية سعرية حقيقية وتنبيهات شخصية</p>
          </div>
          <GlobeHemisphereEast size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">
          الواجهة الآن تعطي إحساساً حياً وحقيقياً مبنياً على الوقت والجلسات والأحداث. الخطوة الطبيعية التالية
          لاحقاً هي ربطها بمزود أسعار أو مفكرة اقتصادية أعمق لإضافة الأسعار الفعلية والتنبيهات.
        </p>
        <p className="economy-banner__detail">
          حتى ذلك الحين، ستبقى هذه الصفحة أسرع مدخل بصري داخل القسم كله قبل الانتقال إلى الذهب أو وول ستريت أو جلسات الفوركس.
        </p>
      </section>
    </div>
  );
}
