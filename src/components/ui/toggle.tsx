"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium text-[var(--text-2)] whitespace-nowrap outline-none transition-[background-color,border-color,box-shadow,color] hover:bg-[var(--muted)] hover:text-[var(--text-1)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--blue-subtle)] data-[state=on]:text-[var(--blue-text)] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-[var(--border)] bg-transparent shadow-none hover:border-[var(--border-strong)]",
      },
      size: {
        default: "min-h-[var(--space-11)] min-w-[var(--space-11)] px-[var(--space-2)]",
        sm: "min-h-[var(--space-11)] min-w-[var(--space-11)] px-[var(--space-1-5)] text-[var(--text-xs)]",
        lg: "min-h-[var(--space-11)] min-w-[var(--space-11)] px-[var(--space-2-5)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>): React.JSX.Element {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
