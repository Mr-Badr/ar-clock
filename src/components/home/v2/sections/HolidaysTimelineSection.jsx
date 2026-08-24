// home/v2/sections/HolidaysTimelineSection.jsx
// Server Component — bespoke design #4, fourth pass 2026-08-23 (real UX audit: every one of the
// 5 homepage sections used the identical kicker→h2→lead→CTA text formula around a different
// visual, which is what actually read as "boring/generic" — not any one component in isolation.
// This section's feed was also the weakest visual on its own: a bare floating list). Keeps the
// real Magic UI AnimatedList mechanic exactly as directed (see HolidaysAnimatedList.client.jsx)
// but now frames it as a genuine designed object — a notification-panel "device" with its own
// header bar — instead of cards floating loose in the section. Owner: "no live time clock"
// still holds — no countdown digit anywhere, only the reveal-in animation.
import { BellSimple } from '@phosphor-icons/react/ssr';
import InteractiveLink from '../InteractiveLink';
import ScrollReveal from '@/components/motion/ScrollReveal.client';
import HolidaysAnimatedList from './HolidaysAnimatedList.client';
import './holidays-timeline.css';

const EVENTS = ['رمضان', 'عيد الفطر', 'عيد الأضحى', 'المولد النبوي', 'الأعياد الوطنية', 'رأس السنة'];

export default function HolidaysTimelineSection() {
  return (
    <section className="ht-section" aria-labelledby="ht-title">
      <ScrollReveal className="ht-inner" itemSelector=":scope > *">
        <div className="ht-copy">
          {/* Real count is 444 published events / 2759 aliases (checked directly against
              src/data/holidays/generated/manifest.json — the old "76"/"345" were stale). Both
              rounded down to a safe figure, same convention as the hero's "+150" tools stat. */}
          <p className="ht-kicker">+400 مناسبة</p>
          <h2 id="ht-title" className="ht-title">عدّاد لكل مناسبة تهمّك</h2>
          <p className="ht-lead">
            مناسبات إسلامية ووطنية وعالمية، كل واحدة بعدّاد تنازلي حي وتفاصيل واضحة عن موعدها
            وأصلها — يمكن الوصول إليها بأكثر من 2500 طريقة بحث مختلفة.
          </p>
          <InteractiveLink href="/holidays" accent="var(--accent-alt)">تصفح المناسبات</InteractiveLink>
        </div>

        <div className="ha-frame">
          <div className="ha-frame-head">
            <span className="ha-frame-dot" aria-hidden="true" />
            <BellSimple weight="fill" className="ha-frame-icon" aria-hidden="true" />
            <span className="ha-frame-label">تنبيهات المناسبات</span>
          </div>
          <HolidaysAnimatedList />
        </div>
      </ScrollReveal>

      {/* HolidaysCardStack is a decorative, auto-cycling aria-hidden visual — this is the real,
          single copy for screen readers. */}
      <ul className="sr-only">
        {EVENTS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}
