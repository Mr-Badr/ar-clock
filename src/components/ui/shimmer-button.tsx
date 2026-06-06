import React, { type ComponentPropsWithoutRef } from "react"

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
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "relative z-0 inline-flex min-h-[var(--space-11)] cursor-pointer items-center justify-center gap-[var(--space-2)] overflow-hidden whitespace-nowrap rounded-[var(--radius-lg)] border border-[var(--blue)] bg-[var(--blue)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--text-sm)] font-medium text-[var(--text-on-accent)] transition-[background-color,border-color,box-shadow] duration-100 hover:border-[var(--blue-hover)] hover:bg-[var(--blue-hover)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
