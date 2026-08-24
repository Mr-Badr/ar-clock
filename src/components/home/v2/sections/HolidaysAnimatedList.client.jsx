'use client';

// home/v2/sections/HolidaysAnimatedList.client.jsx
// Replaces the fanned card deck (owner, 2026-08-21: "show the cards like this component
// exactly: magicui.design/docs/components/animated-list and the cards should have better ui
// ux"). Each card: icon-chip + title + tag + one-line real fact (no gradients, no border
// stripes — see .claude/rules/arabic-rtl.md's anti-AI-template rules).
//
// Real bug found + fixed 2026-08-22: AnimatedList's own logic (see animated-list.tsx) stops
// scheduling once every child has been revealed — with 30 items at a 1400ms delay that's ~42s,
// after which the feed sat permanently static. Worked around at the time by remounting the
// whole list (key bump) once a full cycle finished.
//
// Owner directive, 2026-08-23 (first pass): animate by default for every visitor regardless of
// `prefers-reduced-motion` (same policy as ToolsTicker's marquee — see globals.css / base.css).
//
// Owner directive, 2026-08-23 (second pass — "more cards, a lot of holidays, and infinite
// motion"): the remount-on-a-timer workaround above was still a hard reset — the whole feed
// visibly collapsed back to one card and rebuilt from scratch every ~60s, not genuine infinite
// motion. Root cause: `AnimatedList` (src/components/ui/animated-list.tsx) is a "reveal once,
// then stop" primitive by design (it grows `itemsToShow` from the start of a FIXED children
// array up to the end, per the real Magic UI mechanic) — it has no sliding-window concept, so
// there's no way to keep it running forever without an artificial restart. Rather than change
// that shared, reusable primitive's documented behavior, this component now drives its own
// small rolling feed directly with the exact same motion values `AnimatedListItem` uses (spring
// scale+opacity), so it's visually identical to the Magic UI look but genuinely never resets:
// a new real event is prepended every `REVEAL_DELAY_MS`, cycling forever through the pool below
// via modulo, and the oldest card drops out once the visible window exceeds MAX_VISIBLE (already
// invisible past the shell's own fade mask by then, so removing it is unnoticeable).
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MoonStars, Sparkle, Star, BookOpen, CalendarBlank, Mosque,
  Flag, CalendarCheck, Heart, UsersThree, Confetti, Users, Leaf,
  Sun, SunHorizon, Moon,
} from '@phosphor-icons/react';

// Real events + real facts (day/month only — no hardcoded years, see
// .claude/rules/event-creation-lessons.md), cross-checked against
// src/data/holidays/generated/all-events-list.json. 38 distinct events across Islamic, Gulf +
// wider Arab national days, women's days, world/social days, and astronomical seasons — no
// Christian-theological or Israel-touching entries (standing rules).
const EVENTS = [
  // إسلامية
  { name: 'رمضان', tag: 'إسلامية', desc: 'شهر الصيام في التقويم الهجري', icon: MoonStars, color: 'accent' },
  { name: 'عيد الفطر المبارك', tag: 'إسلامية', desc: 'يبدأ بعد نهاية رمضان مباشرة', icon: Sparkle, color: 'warning' },
  { name: 'عيد الأضحى المبارك', tag: 'إسلامية', desc: 'يوافق موسم الحج كل عام', icon: Star, color: 'success' },
  { name: 'المولد النبوي الشريف', tag: 'إسلامية', desc: 'ذكرى مولد النبي ﷺ في ربيع الأول', icon: BookOpen, color: 'danger' },
  { name: 'رأس السنة الهجرية', tag: 'إسلامية', desc: 'أول أيام شهر محرم في التقويم الهجري', icon: CalendarBlank, color: 'info' },
  { name: 'عاشوراء', tag: 'إسلامية', desc: 'اليوم العاشر من شهر محرم', icon: Mosque, color: 'accent' },
  // وطنية — الخليج
  { name: 'اليوم الوطني السعودي', tag: 'وطنية', desc: '23 سبتمبر من كل عام', icon: Flag, color: 'warning' },
  { name: 'يوم التأسيس السعودي', tag: 'وطنية', desc: '22 فبراير من كل عام', icon: CalendarCheck, color: 'success' },
  { name: 'اليوم الوطني الإماراتي', tag: 'وطنية', desc: '2 ديسمبر من كل عام', icon: Flag, color: 'danger' },
  { name: 'يوم العلم الإماراتي', tag: 'وطنية', desc: '3 نوفمبر من كل عام', icon: Flag, color: 'info' },
  { name: 'اليوم الوطني القطري', tag: 'وطنية', desc: '18 ديسمبر من كل عام', icon: Flag, color: 'accent' },
  { name: 'اليوم الوطني الكويتي', tag: 'وطنية', desc: '25 فبراير من كل عام', icon: Flag, color: 'warning' },
  { name: 'اليوم الوطني البحريني', tag: 'وطنية', desc: '16 ديسمبر من كل عام', icon: Flag, color: 'success' },
  { name: 'اليوم الوطني العماني', tag: 'وطنية', desc: '20 نوفمبر من كل عام', icon: Flag, color: 'danger' },
  // وطنية — العالم العربي
  { name: 'عيد الاستقلال الأردني', tag: 'وطنية', desc: '25 مايو من كل عام', icon: Flag, color: 'info' },
  { name: 'عيد الاستقلال المغربي', tag: 'وطنية', desc: '18 نوفمبر من كل عام', icon: Flag, color: 'accent' },
  { name: 'عيد استقلال السودان', tag: 'وطنية', desc: 'أول يناير من كل عام', icon: Flag, color: 'warning' },
  { name: 'عيد الاستقلال والشباب في الجزائر', tag: 'وطنية', desc: '5 يوليو من كل عام', icon: Flag, color: 'success' },
  { name: 'عيد الاستقلال التونسي', tag: 'وطنية', desc: '20 مارس من كل عام', icon: Flag, color: 'danger' },
  { name: 'ذكرى ثورة 23 يوليو في مصر', tag: 'وطنية', desc: '23 يوليو من كل عام', icon: Flag, color: 'info' },
  { name: 'عيد الاستقلال اللبناني', tag: 'وطنية', desc: '22 نوفمبر من كل عام', icon: Flag, color: 'accent' },
  { name: 'عيد الاستقلال اليمني', tag: 'وطنية', desc: '30 نوفمبر من كل عام', icon: Flag, color: 'warning' },
  // أيام المرأة
  { name: 'يوم المرأة الإماراتية', tag: 'وطنية', desc: '28 أغسطس من كل عام', icon: Heart, color: 'success' },
  { name: 'اليوم الوطني للمرأة المغربية', tag: 'وطنية', desc: '10 أكتوبر من كل عام', icon: Heart, color: 'danger' },
  { name: 'يوم المرأة العمانية', tag: 'وطنية', desc: '17 أكتوبر من كل عام', icon: Heart, color: 'info' },
  { name: 'عيد المرأة التونسية', tag: 'وطنية', desc: '13 أغسطس من كل عام', icon: UsersThree, color: 'accent' },
  { name: 'يوم المرأة البحرينية', tag: 'وطنية', desc: 'أول ديسمبر من كل عام', icon: UsersThree, color: 'warning' },
  // عالمية
  { name: 'رأس السنة الميلادية', tag: 'عالمية', desc: 'أول يناير من كل عام ميلادي', icon: Confetti, color: 'success' },
  { name: 'عيد العمال العالمي', tag: 'عالمية', desc: 'أول مايو في أغلب دول العالم', icon: Users, color: 'danger' },
  { name: 'اليوم الدولي للمرأة', tag: 'عالمية', desc: '8 مارس من كل عام', icon: Heart, color: 'info' },
  { name: 'يوم الأرض', tag: 'عالمية', desc: '22 أبريل من كل عام', icon: Leaf, color: 'accent' },
  { name: 'اليوم العالمي للغة العربية', tag: 'عالمية', desc: '18 ديسمبر من كل عام', icon: BookOpen, color: 'warning' },
  { name: 'عيد الأم', tag: 'عالمية', desc: '21 مارس من كل عام', icon: Heart, color: 'success' },
  { name: 'اليوم العالمي للطفل', tag: 'عالمية', desc: '20 نوفمبر من كل عام', icon: UsersThree, color: 'danger' },
  { name: 'اليوم العالمي للبيئة', tag: 'عالمية', desc: '5 يونيو من كل عام', icon: Leaf, color: 'info' },
  // فصول السنة
  { name: 'بداية فصل الربيع', tag: 'فلكية', desc: 'حوالي 20 مارس من كل عام', icon: Sun, color: 'accent' },
  { name: 'بداية فصل الصيف', tag: 'فلكية', desc: 'حوالي 21 يونيو من كل عام', icon: SunHorizon, color: 'warning' },
  { name: 'بداية فصل الشتاء', tag: 'فلكية', desc: 'حوالي 21 ديسمبر من كل عام', icon: Moon, color: 'info' },
];

const REVEAL_DELAY_MS = 1400;
const MAX_VISIBLE = 8;

const cardMotion = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, originY: 0 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: 'spring', stiffness: 350, damping: 40 },
};

function EventCard({ name, tag, desc, icon: Icon, color }) {
  return (
    <div className="ha-card">
      <div className={`ha-card-icon ha-card-icon--${color}`}>
        <Icon size={20} weight="duotone" />
      </div>
      <div className="ha-card-body">
        <div className="ha-card-top">
          <span className="ha-card-name">{name}</span>
          <span className="ha-card-tag">{tag}</span>
        </div>
        <p className="ha-card-desc">{desc}</p>
      </div>
    </div>
  );
}

export default function HolidaysAnimatedList() {
  const [items, setItems] = useState(() => [{ ...EVENTS[0], uid: 0 }]);
  const uidRef = useRef(1);
  const poolIndexRef = useRef(1);

  useEffect(() => {
    const id = window.setInterval(() => {
      const nextEvent = EVENTS[poolIndexRef.current % EVENTS.length];
      poolIndexRef.current += 1;
      const nextItem = { ...nextEvent, uid: uidRef.current };
      uidRef.current += 1;
      setItems((prev) => [nextItem, ...prev].slice(0, MAX_VISIBLE));
    }, REVEAL_DELAY_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="ha-shell" aria-hidden="true">
      <div className="ha-list">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div key={item.uid} layout className="mx-auto w-full" {...cardMotion}>
              <EventCard {...item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
