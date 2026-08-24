// home/v2/sections/ToolsBreadthSection.jsx
// Server Component — first of five bespoke section designs (owner directive, 2026-08-20: "every
// section should have a different design... do not follow our design system and our buttons").
// Typographic, not card-based: one oversized gradient-clipped numeral (the Stripe/Linear
// "big-stat" technique — a gradient TEXT fill, never a gradient background) that counts up on
// scroll (Magic UI NumberTicker — owner: "numbers... moving like counting"), with the real 24
// category names streaming past underneath as a minimal ticker, no chips, no icons, no photos.
//
// Second pass, 2026-08-23 (real UX audit — the numeral block and the marquee band read as two
// separate widgets stacked with a big gap between them, not one designed section). Both now live
// inside a single bordered `.tb-panel` shell — the content on top, the band as that same panel's
// own bottom strip instead of a disconnected full-bleed ribbon with its own competing border.
import { NumberTicker } from '@/components/ui/number-ticker';
import BorderGlow from '@/components/ui/border-glow';
import InteractiveLink from '../InteractiveLink';
import ScrollReveal from '@/components/motion/ScrollReveal.client';
import ToolsTicker from './ToolsTicker';
import './tools-breadth.css';

const CATEGORY_NAMES = [
  'الأدوات الإسلامية', 'التخطيط المالي', 'البناء والتشييد', 'حاسبات النوم', 'الصحة والعمر',
  'صيانة السيارة', 'التكييف', 'التجارة الإلكترونية', 'السباكة', 'التقويم الدراسي',
  'تنسيق الحدائق', 'اللحام', 'تنظيف المنزل', 'النجارة', 'الحضور والانصراف', 'المسابح',
  'الألومنيوم والزجاج', 'مكافحة الحشرات', 'كاميرات المراقبة', 'الكهرباء', 'السقالات',
  'أبواب الجراج', 'صيانة المصاعد', 'رواتب الخليج',
];

export default function ToolsBreadthSection() {
  return (
    <section className="tb-section" aria-labelledby="tb-title">
      {/* BorderGlow (react-bits, added via shadcn) adds a pointer-tracked glow around the
          panel's EXISTING border on hover — nothing else. Owner correction, 2026-08-23: the
          stock component also paints a colored mesh wash across the interior near the edges
          (its `::after` "fill" layer) and recolors the border ring itself (`::before`); both are
          switched off here (`fillOpacity={0}` + the `::before` kill in tools-breadth.css) so only
          the outer bloom — genuinely outside the box — changes color. The border's own color/
          width and the panel's background are untouched, still the original `.tb-panel` values. */}
      <BorderGlow
        className="tb-panel"
        edgeSensitivity={30}
        glowColor="210 100% 70%"
        backgroundColor="color-mix(in srgb, var(--bg-surface-1) 40%, transparent)"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        fillOpacity={0}
        colors={['#5AADFF', '#34d399', '#a78bfa']}
      >
        <ScrollReveal className="tb-inner" itemSelector=":scope > *">
          <p className="tb-kicker">النظام الكامل</p>

          <div className="tb-figure">
            <NumberTicker value={150} prefix="+" className="tb-number" />
            <div className="tb-figure-copy">
              <h2 id="tb-title" className="tb-title">أداة وحاسبة عربية</h2>
              <p className="tb-lead">
                موزّعة على 24 قسمًا، كل واحد منها بأدوات مبنية لمشكلته الحقيقية — لا حاسبة عامة
                معاد تدويرها من موقع أجنبي.
              </p>
              <InteractiveLink href="/tools" accent="var(--accent-alt)">
                تصفح كل الأدوات
              </InteractiveLink>
            </div>
          </div>
        </ScrollReveal>

        <ToolsTicker items={CATEGORY_NAMES} />
      </BorderGlow>

      {/* The ticker duplicates the list for a seamless loop and is aria-hidden — this is the
          real, single copy for screen readers. */}
      <ul className="sr-only">
        {CATEGORY_NAMES.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}
