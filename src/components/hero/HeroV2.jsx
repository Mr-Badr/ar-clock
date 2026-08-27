// hero/HeroV2.jsx
// Server Component — the homepage rebuild's new hero (2026-08-20). All copy, the h1, and the
// image are rendered here on the server (SEO-critical content stays server-rendered per the
// project's Next.js rules); HeroMotion.client.jsx only wraps this markup to animate it after
// mount, it renders nothing of its own. Built around public/img/hero.jpg on the "nature as
// time" metaphor agreed with the owner — dawn light over a valley standing in for "a clear
// answer, without the noise."
//
// Second pass (2026-08-20, owner feedback: "search input should be in hero not navbar"): the
// old "ابحث عن إجابتك" link button is gone — HeroSearchTrigger IS the CTA now, a real-looking
// search input that opens the same command dialog the header used to trigger.
// Third pass (owner: "numbers... moving like counting", citing Magic UI's NumberTicker) — the
// stat counters now use the real NumberTicker (spring physics via Motion), not the GSAP linear
// tween this used before, for a genuinely "alive" count-up feel.
import Image from 'next/image';

import HeroMotion from './HeroMotion.client';
import HeroSearchTrigger from './HeroSearchTrigger.client';
import { NumberTicker } from '@/components/ui/number-ticker';
import './HeroV2.css';

export default function HeroV2() {
  return (
    <section className="hero-v2" aria-label="ميقاتنا">
      <HeroMotion>
        <div className="hero-v2-media" data-hero-media>
          <Image
            src="/img/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            // Owner, 2026-08-27: "hero img... low resolution", then "make them super clean and
            // clear in all devices" — bumped from Next's default 75 to 90 (the max whitelisted
            // in next.config.js's `images.qualities`). This is the single largest, most visible
            // photo on the site (full-bleed, above the fold, first thing every visitor sees) —
            // worth the extra bytes for less visible compression artifacting. Paired with
            // next.config.js's deviceSizes fix (same report), which addresses the bigger half of
            // the original bug: a missing large-desktop srcset tier forcing this image to
            // upscale on most laptop/desktop widths.
            quality={90}
            className="hero-v2-img"
          />
          <div className="hero-v2-scrim" aria-hidden="true" />
        </div>

        <div className="hero-v2-content">
          {/* Owner, 2026-08-27: swapped the old "ميقاتنا — صُنعت لتُبسّط يومك" text pill for the
              brand wordmark — same spaced-tatweel "مـــيـــقــاتــنــا" lockup already used in
              the footer (Footer.jsx's .footer-brand-name). Went through several animated-SVG
              attempts (react-bits StrokeText: letter-by-letter stroke-draw + fill) that never
              read as smooth in the owner's own browser no matter how the timing/mechanism was
              tuned — owner directive, same day: "delete all these animations, just simple clean
              word... little bit of shadow." Reverted to a plain server-rendered heading (real
              text, real SEO weight, zero JS) with a single CSS fade+rise entrance (see
              .hero-v2-brandmark in HeroV2.css) and a soft gold text-shadow for a touch of depth.
              DELIBERATELY NOT wrapped in [data-hero-item]: that attribute makes HeroMotion slide
              the element up from y:24→0 as part of its own entrance stagger, which would
              double up with this element's own fade+rise keyframe. */}
          <p className="hero-v2-brandmark" aria-hidden="true">مـــيـــقــاتــنــا</p>

          <h1 className="hero-v2-title" data-hero-item>
  <span className="hero-v2-title-line hero-v2-title-line-main">
    {'كل ما يهمّك يــومــيــًا'.split(' ').map((word, i) => (
      <span key={`${word}-${i}`}>
        <span
          className="hero-v2-title-word"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          {word}
        </span>
        {i < 3 && '\u00A0'}
      </span>
    ))}
  </span>

  <span
    className="hero-v2-title-line hero-v2-title-line-sub"
    style={{ animationDelay: '280ms' }}
  >
    بجودة تــســتــحــقــهــا
  </span>
</h1>

          <div className="hero-v2-actions">
            <HeroSearchTrigger />
          </div>

          <dl className="hero-v2-facts" data-hero-item>
            <div className="hero-v2-fact">
              <dt>
                <NumberTicker value={150} prefix="+" className="hero-v2-fact-value" />
              </dt>
              <dd>أداة وحاسبة</dd>
            </div>
            <div className="hero-v2-fact-divider" aria-hidden="true" />
            <div className="hero-v2-fact">
              <dt>
                <NumberTicker value={24} className="hero-v2-fact-value" />
              </dt>
              <dd>قسمًا</dd>
            </div>
            <div className="hero-v2-fact-divider" aria-hidden="true" />
            <div className="hero-v2-fact">
              <dt>
                {/* Real count is 444 published events as of this writing (checked directly
                    against src/data/holidays/generated/manifest.json's totalPublished, not
                    memory — the old "76" was stale). Rounded down to +400, same convention as
                    the +150 tools stat, so this stays true as more events get added instead of
                    needing a manual bump every time the count crosses another round number. */}
                <NumberTicker value={400} prefix="+" className="hero-v2-fact-value" />
              </dt>
              <dd>مناسبة</dd>
            </div>
          </dl>
        </div>
      </HeroMotion>
    </section>
  );
}
