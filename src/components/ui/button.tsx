import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-[var(--space-11)] shrink-0 items-center justify-center gap-[var(--space-2)] whitespace-nowrap rounded-[var(--radius-lg)] border text-[var(--text-sm)] font-medium transition-[background-color,border-color,color,box-shadow] duration-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg]:shrink-0 outline-none focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)]",
  {
    variants: {
      variant: {
        default: "border-[var(--blue)] bg-[var(--blue)] text-[var(--text-on-accent)] hover:border-[var(--blue-hover)] hover:bg-[var(--blue-hover)]",
        destructive:
          "border-[var(--red)] bg-[var(--red)] text-[var(--text-on-accent)] hover:border-[var(--red-hover)] hover:bg-[var(--red-hover)]",
        outline:
          "border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] shadow-none hover:border-[var(--border-strong)] hover:bg-[var(--muted)]",
        secondary:
          "border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:border-[var(--border-strong)] hover:bg-[var(--muted)]",
        ghost:
          "border-transparent bg-transparent text-[var(--text-2)] hover:bg-[var(--muted)] hover:text-[var(--text-1)]",
        link: "border-transparent text-[var(--blue)] underline-offset-4 hover:underline",
      },
      size: {
        default: "px-[var(--space-4)] py-0 has-[>svg]:px-[var(--space-3)]",
        xs: "min-h-[var(--space-11)] gap-[var(--space-1)] rounded-[var(--radius-lg)] px-[var(--space-3)] text-[var(--text-xs)] has-[>svg]:px-[var(--space-2)] [&_svg:not([class*='size-'])]:size-[var(--space-3)]",
        sm: "min-h-[var(--space-11)] rounded-[var(--radius-lg)] gap-[var(--space-1-5)] px-[var(--space-3)] has-[>svg]:px-[var(--space-2-5)]",
        lg: "min-h-[var(--space-11)] rounded-[var(--radius-lg)] px-[var(--space-5)] text-[var(--text-base)] has-[>svg]:px-[var(--space-4)]",
        icon: "size-[var(--space-11)]",
        "icon-xs": "size-[var(--space-11)] rounded-[var(--radius-lg)] [&_svg:not([class*='size-'])]:size-[var(--space-3)]",
        "icon-sm": "size-[var(--space-11)]",
        "icon-lg": "size-[var(--space-11)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}): React.JSX.Element {
  const Comp = asChild === true ? Slot.Root : "button"
  const resolvedVariant = variant ?? "default"
  const resolvedSize = size ?? "default"

  return (
    <Comp
      data-slot="button"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
