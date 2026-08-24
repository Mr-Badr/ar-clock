// Magic UI's MagicCard (https://magicui.design/docs/components/magic-card) —
// a mouse-tracking spotlight that highlights the card's border on hover.
// Adapted from the upstream registry source for this codebase:
//   - "orb" mode dropped entirely (unused here, and it's the only thing the
//     upstream component needs `next-themes` for — dropping it means this
//     file has zero new dependencies beyond `motion`, already installed).
//   - The punch-through background and border color reference this site's
//     own CSS custom properties (`--bg-surface-1`, `--border-default`) via
//     Tailwind v4 arbitrary values, instead of the shadcn boilerplate's
//     `bg-background`/`border-border` (this project keeps those only as
//     legacy shadcn-compat aliases — see card.tsx).
//   - Default gradient colors use the site's own accent tokens instead of
//     the generic purple/pink demo colors, so it reads as this product's
//     accent, not a generic template.
"use client"

import React, { useCallback, useEffect, useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({
  children,
  className,
  gradientSize = 180,
  gradientColor = "var(--accent-soft)",
  gradientOpacity = 0.85,
  gradientFrom = "var(--accent)",
  gradientTo = "var(--accent-alt)",
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const gradientSizeRef = useRef(gradientSize)

  useEffect(() => {
    gradientSizeRef.current = gradientSize
  }, [gradientSize])

  const reset = useCallback(() => {
    const off = -gradientSizeRef.current
    mouseX.set(off)
    mouseY.set(off)
  }, [mouseX, mouseY])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset()
    }
    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", reset)
    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", reset)
    }
  }, [reset])

  return (
    <motion.div
      className={cn(
        "group relative isolate h-full overflow-hidden rounded-lg border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={reset}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--bg-surface-1) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--border-default) 100%
          ) border-box
        `,
      }}
    >
      <div className="absolute inset-px z-20 rounded-lg bg-surface-1" />

      <motion.div
        suppressHydrationWarning
        className="pointer-events-none absolute inset-px z-30 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
          opacity: gradientOpacity,
        }}
      />

      <div className="relative z-40 h-full">{children}</div>
    </motion.div>
  )
}
