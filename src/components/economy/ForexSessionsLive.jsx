// components/economy/ForexSessionsLive.jsx
'use client';

import Link from 'next/link';

import styles from './market-card-v2.module.css';

import { ChartLineUp, Sparkle } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildForexPageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import HourlyActivityChart from './HourlyActivityChart';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySpotlight,
  EconomyStatCards,
  EconomySourceLinks,
  EconomyTable,
  EconomyTimeline,
  EconomyToolCards,
  LiveSessionsStrip,
} from './common';

function ForexCard({ card }) {
  const tone = card.statusTone || 'default';
  const isLive = tone === 'success';
  const isPre  = tone === 'warning';
  const showPulse = isLive || isPre;
  const progress = Number(card.progressPct) || 0;
  const hasProgress = progress > 0 && progress <= 100;

  return (
    <article className={styles.mcSession} data-tone={tone}>
      {/* Tone-matched top stripe */}
      <div className={styles.mcSessionStripe} />

      {/* Header */}
      <div className={styles.mcSessionHead}>
        <div className={styles.mcSessionIdentity}>
          <span className={styles.mcSessionFlag} aria-hidden="true">{card.flag}</span>
          <div className={styles.mcSessionNameWrap}>
            <h3 className={styles.mcSessionName}>{card.nameAr}</h3>
            <p className={styles.mcSessionPairs}>{card.pairsLabel}</p>
          </div>
        </div>
        <span className={styles.mcSessionBadge} data-tone={tone}>
          {showPulse && <span className={styles.mcSessionPulse} aria-hidden="true" />}
          {card.statusLabel}
        </span>
      </div>

      {/* Countdown hero */}
      <div className={styles.mcSessionCountdown}>
        <div className={styles.mcSessionCountdownMain}>
          <div className={styles.mcSessionCountdownPrefix}>{card.countdownPrefix}</div>
          <div className={styles.mcSessionCountdownValue} aria-label={`${card.countdownPrefix}: ${card.countdownLabel}`}>
            {card.countdownLabel}
          </div>
        </div>
        {card.marketTimeLabel && (
          <div className={styles.mcSessionCountdownAside}>
            <div className={styles.mcSessionCountdownAsideLabel}>الوقت في السوق</div>
            <div className={styles.mcSessionCountdownAsideValue}>{card.marketTimeLabel}</div>
          </div>
        )}
      </div>

      {/* 2×2 metrics */}
      <dl className={styles.mcSessionMetrics}>
        <div className={styles.mcSessionMetricCell}>
          <dt>طبيعة الجلسة</dt>
          <dd>{card.liquidityLabel || '—'}</dd>
        </div>
        <div className={styles.mcSessionMetricCell}>
          <dt>يفتح بتوقيتك</dt>
          <dd>{card.openLabel || '—'}</dd>
        </div>
        <div className={styles.mcSessionMetricCell}>
          <dt>يغلق بتوقيتك</dt>
          <dd>{card.closeLabel || '—'}</dd>
        </div>
        <div className={styles.mcSessionMetricCell}>
          <dt>تقدّم الجلسة</dt>
          <dd>{hasProgress ? `${Math.round(progress)}٪` : '—'}</dd>
        </div>
      </dl>

      {/* Progress bar — live sessions only */}
      {hasProgress && (
        <div className={styles.mcSessionProgressWrap}>
          <div className={styles.mcSessionProgressLabel}>
            <span>{card.openLabel}</span>
            <span>{card.closeLabel}</span>
          </div>
          <div
            className={styles.mcSessionProgressTrack}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className={styles.mcSessionProgressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Insight footnotes */}
      {(card.bestFor || card.volatilityLabel || card.watchLabel) && (
        <div className={styles.mcSessionInsights}>
          {card.bestFor && (
            <p className={styles.mcSessionInsight}>
              <span className={styles.mcSessionInsightDot} aria-hidden="true" />
              <span><strong>ما تراقبه: </strong>{card.bestFor}</span>
            </p>
          )}
          {card.volatilityLabel && (
            <p className={styles.mcSessionInsight}>
              <span className={styles.mcSessionInsightDot} aria-hidden="true" />
              <span><strong>السلوك المعتاد: </strong>{card.volatilityLabel}</span>
            </p>
          )}
          {card.watchLabel && (
            <p className={styles.mcSessionInsight}>
              <span className={styles.mcSessionInsightDot} aria-hidden="true" />
              <span>{card.watchLabel}</span>
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default function ForexSessionsLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildForexPageModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <ChartLineUp size={16} weight="duotone" />
              متى تبدأ جلسة لندن ونيويورك اليوم؟
            </>
          )}
          title="نحمّل جلسات لندن ونيويورك من مدينتك"
          lead="بعد تحديد منطقتك الزمنية نعرض هل سوق الفوركس مفتوح الآن، ومتى تبدأ لندن ونيويورك، وأين تقع نافذة السيولة الأعلى بتوقيتك المحلي."
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
            <ChartLineUp size={16} weight="duotone" />
            متى تبدأ جلسة لندن ونيويورك اليوم؟
          </>
        )}
        title={`متى تبدأ جلسة لندن ونيويورك اليوم من ${model.viewer.label}؟`}
        lead="هذه الصفحة تعطي جواباً مباشراً: هل سوق الفوركس مفتوح الآن، ما الجلسة النشطة حالياً، ومتى تفتح أو تغلق سيدني وطوكيو ولندن ونيويورك، وأين تقع نافذة السيولة الأعلى للذهب والأزواج الرئيسية. كل ذلك محسوب من منطقتك الزمنية الحالية بدلاً من جدول ثابت خاص بدولة واحدة."
        metaPills={[
          { label: `${model.viewer.sublabel}` },
          { label: `الآن: ${model.nowLabel}` },
          { label: model.todayLabel },
        ]}
        note={model.viewer.notice}
      />

      <EconomyStatCards cards={model.signalCards} />
      <EconomySpotlight model={model.spotlight} />

      <LiveSessionsStrip sessions={model.liveSessionsSummary} nowLabel={model.nowLabel} />

      <AdTopBanner slotId="top-economy-forex-sessions" />

      <EconomyBanner
        kicker="الحالة الحالية"
        title={model.hero.label}
        detail={model.hero.detail}
        tone={model.hero.tone}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="خريطة السيولة خلال يومك"
          lead="هذا الرسم يظهر بسرعة متى يرتفع النشاط ومتى يهدأ، حتى يرى الزائر الشكل العملي لليوم قبل الدخول في التفاصيل والجداول."
        />
        <HourlyActivityChart chart={model.activityChart} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="بطاقات الجلسات الأربع"
          lead="كل بطاقة تحوّل توقيت المركز المالي إلى توقيتك الحالي، مع عداد يوضح هل الجلسة مفتوحة الآن أم أنها على وشك الفتح."
        />
        <div className="economy-feature-frame">
          <div className={styles.mcSessionGrid}>
            {model.cards.map((card) => (
              <ForexCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="تداول الذهب الآن والنافذة الذهبية"
          lead="هذه الكتلة تجمع أكثر سؤالين قيمة للمتداول العربي في نفس المكان: هل الذهب في نافذة نشطة الآن؟ ومتى تقع أفضل ساعة في يومك المحلي؟"
        />
        <div className="economy-feature-frame economy-feature-frame--warm">
          <div className={styles.mcInstrumentRow} aria-label="أدوات التداول الرئيسية">
            {/* Gold Card */}
            <article className={styles.mcInstrument} data-variant="gold" data-tone={model.gold.tone || 'default'}>
              <div className={styles.mcInstrumentStripe} />
              <div className={styles.mcInstrumentHead}>
                <div className={styles.mcInstrumentTitleWrap}>
                  <h2 className={`${styles.mcInstrumentTitle} ${styles.mcInstrumentTitleGold}`}>تداول الذهب الآن</h2>
                  <p className={styles.mcInstrumentSubtitle}>XAU/USD · توقيتك المحلي</p>
                </div>
                <span className={styles.mcInstrumentBadge} data-tone={model.gold.tone || 'default'}>
                  {model.gold.tone === 'success' && <span className={styles.mcInstrumentPulse} aria-hidden="true" />}
                  {model.gold.statusLabel}
                </span>
              </div>
              <div className={styles.mcInstrumentHighlight}>
                <div className={styles.mcInstrumentHighlightMain}>
                  <div className={styles.mcInstrumentHighlightLabel}>أفضل نافذة اليوم</div>
                  <div className={styles.mcInstrumentHighlightValue}>{model.gold.bestWindowLabel}</div>
                </div>
                <span className={styles.mcInstrumentHighlightIcon} aria-hidden="true">🥇</span>
              </div>
              {model.gold.nextWindowLabel && (
                <dl className={styles.mcInstrumentDetails}>
                  <div className={styles.mcInstrumentDetailRow}>
                    <dt>إعادة الفتح التقريبية</dt>
                    <dd>{model.gold.nextWindowLabel}</dd>
                  </div>
                </dl>
              )}
              {model.gold.detail && (
                <div className={styles.mcInstrumentFootnotes}>
                  <p className={styles.mcInstrumentFootnote}>
                    <span className={styles.mcInstrumentFootnoteDot} aria-hidden="true" />
                    <span>{model.gold.detail}</span>
                  </p>
                </div>
              )}
            </article>

            <article
              className={styles.mcInstrument}
              data-variant="window"
              data-tone={model.bestWindow.isActive ? 'success' : 'warning'}
            >
              <div className={styles.mcInstrumentStripe} />
              <div className={styles.mcInstrumentHead}>
                <div className={styles.mcInstrumentTitleWrap}>
                  <h2 className={styles.mcInstrumentTitle}>النافذة الذهبية</h2>
                  <p className={styles.mcInstrumentSubtitle}>تداخل لندن · نيويورك — EUR/USD · XAU/USD</p>
                </div>
                <span
                  className={styles.mcInstrumentBadge}
                  data-tone={model.bestWindow.isActive ? 'success' : 'warning'}
                >
                  {model.bestWindow.isActive && <span className={styles.mcInstrumentPulse} aria-hidden="true" />}
                  {model.bestWindow.statusLabel}
                </span>
              </div>
              <div className={styles.mcInstrumentHighlight}>
                <div className={styles.mcInstrumentHighlightMain}>
                  <div className={styles.mcInstrumentHighlightLabel}>التوقيت المحلي</div>
                  <div className={styles.mcInstrumentHighlightValue}>
                    {model.bestWindow.startLabel} – {model.bestWindow.endLabel}
                  </div>
                </div>
                <span className={styles.mcInstrumentHighlightIcon} aria-hidden="true">⭐</span>
              </div>
              <div className={styles.mcInstrumentTimeline}>
                <div className={styles.mcInstrumentTimelineLabel}>خريطة اليوم 24 ساعة</div>
                <div className={styles.mcInstrumentTimelineTrack}>
                  {model.bestWindow.startPct !== undefined && (
                    <div
                      className={styles.mcInstrumentTimelineFill}
                      style={{
                        insetInlineStart: `${model.bestWindow.startPct}%`,
                        width: `${model.bestWindow.widthPct || 0}%`,
                      }}
                    />
                  )}
                  {model.bestWindow.nowPct !== undefined && (
                    <div
                      className={styles.mcInstrumentTimelineNow}
                      style={{ insetInlineStart: `${model.bestWindow.nowPct}%` }}
                      aria-label="الآن"
                    />
                  )}
                </div>
                <div className={styles.mcInstrumentTimelineHours} aria-hidden="true">
                  {[0, 6, 12, 18, 24].map((h) => (
                    <span key={h}>{String(h).padStart(2, '0')}:00</span>
                  ))}
                </div>
              </div>
              <div className={styles.mcInstrumentFootnotes}>
                <p className={styles.mcInstrumentFootnote}>
                  <span className={styles.mcInstrumentFootnoteDot} aria-hidden="true" />
                  <span>
                    هذه الفترة تمثل تداخل لندن ونيويورك — أعلى سيولة وأسرع استجابة للأخبار،
                    وغالباً أوضح نافذة للمتداول العربي.
                  </span>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="الخط الزمني البصري"
          lead="يمثل هذا الشريط يومك الحالي بالكامل بتوقيتك المحلي، مع إبراز تداخل لندن ونيويورك كنافذة سيولة عليا."
        />
        <EconomyTimeline timeline={model.timeline} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أفضل الأزواج لكل جلسة"
          lead="هذا الجدول يربط وقت الجلسة بالأزواج المناسبة لها عملياً بدلاً من ترك المستخدم يكتشف ذلك بنفسه بالتجربة."
        />
        <EconomyTable
          columns={['الجلسة', 'أفضل الأزواج', 'لماذا؟', 'أزواج أقل مناسبة']}
          rows={model.sessionPairRows}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="مرجع الجلسات والذهب"
          lead="هذه القيم تشرح الإطار الذي تُبنى عليه الصفحة: أسبوع الفوركس المرجعي، نافذة الذهب، وتأثير التوقيت الصيفي على الجداول العربية."
        />
        <EconomyTable
          columns={['العنصر', 'القاعدة العملية', 'لماذا يهم؟']}
          rows={model.sessionReferenceRows.map((row) => ({
            key: row.key,
            cells: row.cells,
          }))}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أثر التوقيت الصيفي على المدن العربية"
          lead="هذه هي النقطة التي تربك كثيراً من المتداولين العرب مرتين كل سنة، لذلك حولناها إلى جدول واضح بين الشتاء والصيف."
        />
        <EconomyTable
          columns={['المدينة', 'افتتاح نيويورك شتاءً', 'افتتاح نيويورك صيفاً', 'الملاحظة']}
          rows={model.dstImpactRows}
        />
      </section>

      <AdInArticle slotId="mid-economy-forex-sessions" />

      <EconomyBanner
        kicker="كيف نعرض الجلسات بمهنية؟"
        title="جلسات سيولة وليست بورصة مركزية واحدة"
        detail="الأدق مهنياً في الفوركس هو عرض السوق كجلسات عالمية متعارف عليها مع توضيح أن التنفيذ الفعلي قد يختلف دقائق قليلة بين الوسطاء وبعض منتجات الذهب."
        tone="info"
      >
        <div className="economy-guide-grid">
          {model.trustSections.map((section) => (
            <article key={section.title} className="economy-copy-card">
              <h3 className="economy-copy-card__title">{section.title}</h3>
              <p className="economy-copy-card__body">{section.body}</p>
            </article>
          ))}
        </div>
      </EconomyBanner>

      <section className="economy-section">
        <EconomySectionHeader
          title="أفضل نوافذ الأسبوع"
          lead="هذا الجدول يربط بين يوم الأسبوع المحلي وأفضل نافذة متابعة للسيولة، مع وقت قيادة لندن وأول ساعة من نيويورك."
        />
        <EconomyTable
          columns={['اليوم', 'تداخل لندن ونيويورك', 'قيادة لندن', 'أول ساعة نيويورك']}
          rows={model.tradingWeek.map((item) => ({
            key: item.key,
            cells: [item.dayLabel, item.overlapLabel, item.londonLeadLabel, item.usOpenLabel],
          }))}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="الأحداث الاقتصادية المرتبطة بالجلسات"
          lead="هذه طبقة عملية تربط الجدول الأسبوعي بالجلسة التي تصدر فيها البيانات حتى لا تبقى الأوقات منفصلة عن الأخبار."
        />
        <EconomyTable
          columns={['الحدث', 'العملة', 'التوقيت المحلي', 'الجلسة', 'التأثير']}
          rows={model.weeklyEvents.map((event) => ({
            key: event.key,
            cells: [event.nameAr, event.currency, event.timeLocal, event.sessionLabel, event.impactLabel],
          }))}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="دليل الجلسات بتوقيتك"
          lead="المحتوى هنا مكتوب ليشرح ما يحدث للمستخدم العربي نفسه، لا ليكرر جدولاً عالمياً معزولاً عن منطقته الزمنية."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="هذه الأسئلة تلخص أكثر ما يبحث عنه المستخدم العربي حول جلسات الفوركس والذهب خلال اليوم."
        />
        <EconomyFaq items={model.faqItems || FAQ_ITEMS.forexSessions} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع المستخدمة"
          lead="نُظهر هذه المراجع علناً لأن الثقة في أدوات الوقت والتداول تبدأ من وضوح المنهج لا من كثرة الادعاءات."
        />
        <EconomySourceLinks links={model.sourceLinks} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="إذا كنت تستخدم هذه الصفحة يومياً، فالأدوات التالية تكملها بشكل طبيعي: ساعة سوق بصرية وصفحة أفضل وقت للتداول من مدينتك."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="default">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">ملاحظة دقة</h2>
            <p className="market-card__subtitle">أوقات التداول الاعتيادية</p>
          </div>
          <Sparkle size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">{model.disclaimer}</p>
        <div className="economy-source-links">
          <Link href="/disclaimer" className="economy-meta-pill">
            إخلاء المسؤولية
          </Link>
        </div>
      </section>
    </div>
  );
}
