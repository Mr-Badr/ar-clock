import { ChartLineUp, ClockCounterClockwise, GlobeHemisphereEast } from '@phosphor-icons/react/ssr';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { getEconomyToolCards } from '@/lib/economy/engine';
import { SITE_BRAND } from '@/lib/site-config';

import { EconomyHero, EconomySectionHeader, EconomyToolCards } from './common';

export default function EconomyLanding() {
  const cards = getEconomyToolCards();

  return (
    <div className="economy-stack">
      <EconomyHero
        eyebrow={(
          <>
            <ChartLineUp size={16} weight="duotone" />
            الاقتصاد الحي
          </>
        )}
        title="أدوات اقتصادية مجانية مبنية على توقيت الزائر"
        lead="هذا القسم يبني أدوات يومية قابلة للبحث في العالم العربي من دون أي اشتراك مدفوع: متى يفتح السوق الأمريكي، هل الذهب مفتوح الآن، جلسات الفوركس، الساعة البصرية، وأفضل وقت للتداول. الفكرة الأساسية بسيطة: نحول الجداول العالمية إلى جواب مباشر بتوقيت المستخدم نفسه."
        metaPills={[
          { label: 'مجاني ويعمل بلا مزود مدفوع' },
          { label: 'مبني على المناطق الزمنية الحقيقية' },
          { label: 'مهيأ لعبارات البحث اليومية' },
        ]}
        note={`التركيز في هذه المرحلة هو على الصفحات التي يمكن أن تكسب طلباً يومياً عربياً واضحاً وتعمل محلياً وعلى Vercel بالمجان، مع الاستفادة من بنية الوقت والموقع الموجودة أصلاً في ${SITE_BRAND}.`}
      />

      <AdTopBanner slotId="top-economy-landing" />

      <section className="economy-section">
        <EconomySectionHeader
          title="ما الذي أضفناه في هذه المرحلة؟"
          lead="بدلاً من بناء صفحات اقتصادية عامة بلا نية بحث واضحة، ركزنا على الأدوات المجانية التي يكررها المستخدم العربي يومياً: وقت السوق الأمريكي، وقت الذهب، جلسات الفوركس، وساعات السيولة."
        />
        <EconomyToolCards cards={cards} />
      </section>

      <AdInArticle slotId="mid-economy-landing" />

      <section className="economy-grid">
        <article className="economy-copy-card">
          <span className="economy-tool-card__eyebrow">
            <GlobeHemisphereEast size={15} weight="duotone" />
            لماذا هذا مناسب لـ{SITE_BRAND}؟
          </span>
          <h2 className="economy-copy-card__title">نفس القوة التي لدينا في المدن أصبحت ميزة اقتصادية</h2>
          <p className="economy-copy-card__body">
            التطبيق يملك بالفعل بنية قوية للتوقيت، واكتشاف الموقع، وتحويل المناطق الزمنية. لهذا نستطيع بناء صفحات اقتصادية مفيدة فعلاً من دون الحاجة إلى طبقة مدفوعة حتى تبدأ بالعمل.
          </p>
        </article>

        <article className="economy-copy-card">
          <span className="economy-tool-card__eyebrow">
            <ClockCounterClockwise size={15} weight="duotone" />
            كيف سنكمل التوسعة؟
          </span>
          <h2 className="economy-copy-card__title">المرحلة التالية جاهزة تقنياً</h2>
          <p className="economy-copy-card__body">
            بعد تثبيت هذا الأساس، يمكننا إضافة صفحات مدن وبلدان تستهدف صياغات مثل "بتوقيت السعودية" و"بتوقيت المغرب" على نفس المحرك من دون إعادة بناء المنطق أو الواجهة.
          </p>
        </article>
      </section>
    </div>
  );
}
