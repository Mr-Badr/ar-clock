// Real Magic UI Marquee (magicui.design/docs/components/marquee), unmodified mechanics —
// content duplicated `repeat` times inside `.animate-marquee`/`.animate-marquee-vertical`
// (keyframes registered in globals.css's @theme block, same pattern as this repo's other
// Magic UI ports: shine, aurora, shimmer-slide, orbit), paused on hover via
// `group-hover:[animation-play-state:paused]`. Used by ToolsTicker.client.jsx for the
// scrolling category band (owner, 2026-08-21: implement the band "by implementing this
// component: magicui.design/docs/components/marquee").
//
// Real bug found + fixed 2026-08-22: the technique is physical-direction (the keyframes
// literally `translateX(0) → translateX(-100% - gap)`, and the seamless-loop illusion relies on
// each repeated track being laid out immediately to the RIGHT of the previous one so it slides
// into view as the current track exits left). Under this app's inherited `dir="rtl"`, flexbox
// lays the repeated tracks out in the OPPOSITE sequence (each one further to the LEFT of the
// last), so there's nothing positioned to slide in from the right — after the first ~1 cycle the
// row goes fully blank and stays blank until the next loop reset, which looked like "the
// marquee isn't moving" (confirmed via Puppeteer: computed styles all reported normal/visible,
// but nothing painted). Fix: force `dir="ltr"` on the root so the physical-direction technique
// gets the layout order it expects — safe here because this is decorative content (every call
// site also renders a real `sr-only` list for the actual RTL-correct a11y content).
import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      dir="ltr"
      className={cn(
        'group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around gap-(--gap)', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
              '[animation-direction:reverse]': reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
