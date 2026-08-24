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
            className="hero-v2-img"
          />
          <div className="hero-v2-scrim" aria-hidden="true" />
        </div>

        <div className="hero-v2-content">
          {/* Owner, 2026-08-23: "why the first thing the user see is time and dates, it should
              be generic statement... a hook that give a general value not specific page or
              concept" — this eyebrow is the very first line read, above the H1, so it now sets
              up a broad promise (simplifies your day) instead of naming one feature; the H1 and
              lead right below still carry the fuller "everything that matters daily" message. */}
          <p className="hero-v2-eyebrow" data-hero-item>ميقاتنا — صُنعت لتُبسّط يومك</p>

          <h1 className="hero-v2-title" data-hero-item>
            {/* Word-by-word "fold down from the top" reveal — split by WORD, not character:
                Arabic letters connect/reshape based on their neighbors, so isolating individual
                characters in their own boxes would break that cursive joining and look broken.
                Pure CSS keyframes (see .hero-v2-title-word in HeroV2.css), not GSAP/JS-triggered
                — this H1 is server-rendered, SEO-critical text, and a JS-driven opacity-from-0
                reveal risks a real "hides content that already painted" flash if hydration is
                slow (the exact bug this project's own motion components were fixed for). A pure
                CSS animation starts on first paint, with no hydration race to lose. */}
            {'كل ما يهمّك يوميًا، بجودة تستحقها'.split(' ').map((word, i) => (
              <span
                className="hero-v2-title-word"
                key={`${word}-${i}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {word}
                {i < 5 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <p className="hero-v2-lead" data-hero-item>
            منصة عربية أنيقة، صُنعت لتمنحك إجابة سريعة وموثوقة، متى احتجتها.
          </p>

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
