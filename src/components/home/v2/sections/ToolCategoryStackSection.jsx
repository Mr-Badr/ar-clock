// home/v2/sections/ToolCategoryStackSection.jsx
// Server Component — the actual "tools and categories" showcase (2026-08-23, replaces the Zakat
// section together with ValuesRevealSection right before it). Real ScrollStack mechanic (see
// ScrollStack.client.jsx) — one card per real major section of the app, kept deliberately short:
// "the design matters more than text here... give the message shorter" (owner's own words). Two
// of the six cards are the real tool-category examples the owner asked for by name — Gulf
// finance and construction — plus a converters-flavored close on the last card.
//
// Card redesign, same day: owner rejected the original glass-panel + round-icon-chip look as
// "boring... should not follow our system design" — that chip pattern is the sitewide FormulaCard/
// tool-card house style (see .claude/rules/event-creation-lessons.md's formula-card rollout), and
// this section was explicitly asked to break from it. New direction: an "index card / dossier"
// concept — a full flat tone-tinted panel (not a gradient, not a colored border stripe, per the
// project's own anti-AI-template rule) carries the card's color identity instead of a small chip;
// a bold "01/06" numeral gives it an editorial, progress-through-the-deck feel that reinforces the
// literal card-stack metaphor; the icon becomes a single oversized, faint atmospheric watermark
// bleeding off one corner instead of a competing focal point.
import { Clock, ArrowsLeftRight, CalendarDots, Confetti, Wallet, Buildings } from '@phosphor-icons/react/ssr';
import ScrollStack, { ScrollStackItem } from './ScrollStack.client';
import './scroll-stack.css';

const CARDS = [
  {
    icon: Clock,
    color: 'accent',
    title: 'الوقت الآن',
    desc: 'الوقت الحقيقي في أي مدينة عربية أو عالمية، محدَّث كل ثانية — بلا تخمين.',
  },
  {
    icon: ArrowsLeftRight,
    color: 'gold',
    title: 'فرق التوقيت',
    desc: 'قارن بين مدينتين بالتوقيت الرسمي الحقيقي، لا بحساب يدوي قد يخطئ.',
  },
  {
    icon: CalendarDots,
    color: 'success',
    title: 'التاريخ والتحويل',
    desc: 'التقويم الهجري والميلادي جنبًا إلى جنب، ومحوّل فوري بينهما.',
  },
  {
    icon: Confetti,
    color: 'warning',
    title: 'المناسبات',
    desc: 'أكثر من 400 مناسبة إسلامية ووطنية وعالمية، كل واحدة بعدّاد تنازلي حي.',
  },
  {
    icon: Wallet,
    color: 'accent',
    title: 'أدوات الخليج المالية',
    desc: 'مواعيد الرواتب، مكافأة نهاية الخدمة، والزكاة — بحسابات حقيقية لكل دولة خليجية.',
  },
  {
    icon: Buildings,
    color: 'danger',
    title: 'أدوات البناء والتحويل',
    desc: 'من حساب الخرسانة إلى تحويل الوحدات والعملات — لكل مهنة أداتها الخاصة.',
  },
];

export default function ToolCategoryStackSection() {
  return (
    <section className="tcs-section" aria-labelledby="tcs-title">
      <div className="tcs-inner">
        <p className="tcs-kicker">150+ أداة، 24 قسمًا</p>
        <h2 id="tcs-title" className="tcs-title">كل قسم من ميقاتنا، في بطاقة واحدة</h2>

        <ScrollStack>
          {CARDS.map((card, index) => {
            const Icon = card.icon;
            const order = String(index + 1).padStart(2, '0');
            const total = String(CARDS.length).padStart(2, '0');
            return (
              <ScrollStackItem key={card.title} index={index} tone={card.color}>
                <Icon className="tcs-card-glyph" weight="duotone" aria-hidden="true" />
                <div className="tcs-card-index">
                  {order}
                  <span className="tcs-card-index-total">/{total}</span>
                </div>
                <h3 className="tcs-card-title">{card.title}</h3>
                <p className="tcs-card-desc">{card.desc}</p>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    </section>
  );
}
