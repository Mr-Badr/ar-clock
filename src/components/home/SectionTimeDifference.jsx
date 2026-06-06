/**
 * SectionTimeDifference — Feature section 2  (Server Component — thin wrapper)
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout : Image LEFT · Text RIGHT  (RTL flex-row, DOM [Text, Card])
 *
 * DATA FLOW:
 *   This section requires real-time data (current clock in multiple cities)
 *   so the card is a pure Client Component — no server data needed.
 *   TimeDifferenceLiveCard detects the user's timezone from the browser's
 *   Intl API and shows live updating times in 4 reference cities.
 *
 * Server Component role here is only layout + SEO text column.
 *
 * SEO: text column unchanged from v1 — all keyword density preserved.
 */

import Link from 'next/link'
import { Clock, Sun, Globe2, Users, MapPin } from 'lucide-react'

import { SectionWrapper, SectionBadge, FeatureItem } from '@/components/shared/primitives'
import CtaLink                from '@/components/shared/CtaLink'
import TimeDifferenceLiveCard from './mockups/TimeDifferenceLiveCard.client'

const H2_ID = 'h2-time-difference'

export default function SectionTimeDifference() {
  return (
    <SectionWrapper
      id="section-time-difference"
      headingId={H2_ID}
      subtle
    >
      <div className="media-split">
        <div className="media-split__content">
          <SectionBadge><Globe2 size={11} />فرق التوقيت</SectionBadge>

          <h2
            id={H2_ID}
            className="section-title"
          >
            احسب فارق الوقت بين
            <span className="text-accent"> أي مدينتين في ثوانٍ</span>
          </h2>

          <p className="feature-copy">
            إذا أردت{' '}
            <strong>كم الساعة الان في لندن</strong>{' '}
            وأنت في الرياض؟ أو{' '}
            <strong>التوقيت الحالي في نيويورك</strong>{' '}
            مقارنةً بدبي؟ اختر المدينتين وسترى الفرق بالساعة والدقيقة مع مراعاة{' '}
            <strong>التوقيت الصيفي</strong>{' '}
            عندما يتغير خلال السنة.
          </p>

          <ul className="feature-list" role="list" aria-label="مزايا حساب فرق التوقيت">
            <FeatureItem icon={Clock}>
              <strong>الفارق الزمني الدقيق</strong> بالساعة والدقيقة بين أي مدينتين، حتى
              المدن ذات النصف ساعة كالهند وإيران
            </FeatureItem>
            <FeatureItem icon={Sun}>
              احتساب{' '}
              <strong>التوقيت الصيفي DST</strong> تلقائياً لكل دولة دون أي إعداد يدوي
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              <strong>توقيت غرينتش GMT/UTC</strong> كمرجع عالمي مع عرض جميع المناطق الزمنية
            </FeatureItem>
            <FeatureItem icon={Users}>
              مفيدة عندما ترتب <strong>اجتماع عمل</strong>، مكالمة عائلية، رحلة، أو موعداً مع شخص في بلد آخر
            </FeatureItem>
            <FeatureItem icon={MapPin}>
              <strong>جدول توقيتات المدن</strong> يساعدك على مقارنة أكثر من مدينة من غير حساب يدوي
            </FeatureItem>
          </ul>

          <div className="action-row">
            <CtaLink href="/time-difference">احسب فرق التوقيت الآن</CtaLink>
            <Link
              href="/time-now"
              className="text-link"
            >
              الوقت الان حول العالم ←
            </Link>
          </div>
        </div>

        <div className="media-split__visual">
          <TimeDifferenceLiveCard />
        </div>

      </div>
    </SectionWrapper>
  )
}
