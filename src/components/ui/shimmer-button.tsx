// Magic UI's ShimmerButton, restyled onto this project's design tokens (2026-08-20 — owner
// directive: the "/tools" nav CTA should be "different from what we have in our system design,
// use components from magic ui"). The previous version of this file had been stripped down to a
// plain flat button with none of the actual shimmer animation — this restores the real
// perimeter-light-sweep effect from https://magicui.design/docs/components/shimmer-button,
// defaulting `background`/`shimmerColor` to `--accent`/white instead of hardcoded black/white so
// it matches the site's palette in both themes. Depends on the `animate-shimmer-slide` and
// `animate-spin-around` keyframes already registered in globals.css's `@theme inline` block.
import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "2.5s",
      borderRadius = "999px",
      background = "var(--accent)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center gap-[var(--space-1-5)] overflow-hidden [border-radius:var(--radius)] border border-white/10 px-[var(--space-4)] py-[var(--space-2)] whitespace-nowrap [font-size:var(--text-sm)] font-bold text-[var(--text-on-accent)] [background:var(--bg)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "@container-[size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",
            "[border-radius:var(--radius)] shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
