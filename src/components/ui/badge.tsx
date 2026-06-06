import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-[var(--space-1)] overflow-hidden rounded-[var(--radius-sm)] border px-[var(--space-2)] py-[var(--space-0-5)] text-[var(--text-xs)] font-medium leading-[var(--leading-none)] whitespace-nowrap transition-[background-color,border-color,box-shadow,color] focus-visible:shadow-[var(--shadow-focus)] data-[dot=true]:before:block data-[dot=true]:before:size-[var(--space-1)] data-[dot=true]:before:shrink-0 data-[dot=true]:before:rounded-[var(--radius-sm)] data-[dot=true]:before:bg-current aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)] [&>svg]:pointer-events-none [&>svg]:size-[var(--space-3)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border)] bg-[var(--muted)] text-[var(--text-2)] [a&]:hover:bg-[var(--blue-subtle)] [a&]:hover:text-[var(--blue-text)]",
        blue:
          "border-[var(--blue-muted)] bg-[var(--blue-subtle)] text-[var(--blue-text)]",
        green:
          "border-[var(--green-border)] bg-[var(--green-subtle)] text-[var(--green-text)]",
        amber:
          "border-[var(--amber-border)] bg-[var(--amber-subtle)] text-[var(--amber-text)]",
        red:
          "border-[var(--red-border)] bg-[var(--red-subtle)] text-[var(--red-text)]",
        solidBlue:
          "border-[var(--blue)] bg-[var(--blue)] text-[var(--text-on-accent)]",
        solidGreen:
          "border-[var(--green)] bg-[var(--green)] text-[var(--text-on-accent)]",
        solidRed:
          "border-[var(--red)] bg-[var(--red)] text-[var(--text-on-accent)]",
        secondary:
          "border-[var(--border)] bg-[var(--muted)] text-[var(--text-2)] [a&]:hover:bg-[var(--surface)]",
        destructive:
          "border-[var(--red-border)] bg-[var(--red-subtle)] text-[var(--red-text)] [a&]:hover:bg-[var(--red-subtle)]",
        outline:
          "border-[var(--border)] bg-transparent text-[var(--text-1)] [a&]:hover:bg-[var(--muted)]",
        ghost:
          "border-transparent bg-transparent text-[var(--text-2)] [a&]:hover:bg-[var(--muted)] [a&]:hover:text-[var(--text-1)]",
        link:
          "border-transparent bg-transparent text-[var(--blue)] underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  asChild,
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }): React.JSX.Element {
  const Comp = asChild === true ? Slot.Root : "span"
  const resolvedVariant = variant ?? "default"

  return (
    <Comp
      data-slot="badge"
      data-variant={resolvedVariant}
      className={cn(badgeVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
