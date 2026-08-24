// Magic UI's ShineBorder (https://magicui.design/docs/components/shine-border).
// The version this file replaced was an incomplete stub (no backgroundImage/mask/animation —
// just a plain static `borderColor`, so it never actually shone). This is the real source:
// a masked ring (`mask`+`maskComposite: exclude`, same content-box/border-box trick used
// elsewhere in this codebase, e.g. `border-beam.tsx`) painted with a radial gradient and
// animated via the `shine` keyframe/`--animate-shine` utility already registered in
// `src/app/globals.css`'s `@theme inline` block.
//
// One deliberate change from the upstream source: dropped the `motion-safe:` prefix on the
// animation class. Confirmed via Puppeteer (computed `animationName`) that `motion-safe:` makes
// this animate correctly with no OS/browser preference set, but resolves to `animationName:
// "none"` the instant `prefers-reduced-motion: reduce` is set — which is very likely what was
// happening on the owner's machine (many Linux desktops have a "reduce motion" accessibility
// toggle that's easy to have on without noticing), while magicui.design's own showcase kept
// moving for them. This is a decorative micro-shimmer on a search bar, not the kind of large
// motion reduced-motion users need suppressed, so it always animates now.
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[]
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  )
}
