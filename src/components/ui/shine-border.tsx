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
  shineColor?: string | string[]
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth,
  duration,
  shineColor,
  className,
  style,
  ...props
}: ShineBorderProps): React.JSX.Element {
  const resolvedBorderWidth = borderWidth ?? 1
  const resolvedDuration = duration ?? 14
  const resolvedColor = Array.isArray(shineColor)
    ? shineColor[0]
    : shineColor ?? "var(--border)"

  return (
    <div
      style={
        {
          "--border-width": `${resolvedBorderWidth}px`,
          "--duration": `${resolvedDuration}s`,
          borderColor: resolvedColor,
          borderWidth: "var(--border-width)",
          borderStyle: "solid",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit]",
        className
      )}
      {...props}
    />
  )
}
