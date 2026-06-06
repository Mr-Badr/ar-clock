import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-[var(--space-0-5)] rounded-[var(--radius-lg)] border px-[var(--space-4)] py-[var(--space-3)] text-[var(--text-sm)] has-[>svg]:grid-cols-[var(--space-4)_1fr] has-[>svg]:gap-x-[var(--space-3)] [&>svg]:size-[var(--space-4)] [&>svg]:translate-y-[var(--space-0-5)] [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "border-[var(--info-border)] bg-[var(--info-subtle)] text-[var(--info-text)]",
        destructive:
          "border-[var(--red-border)] bg-[var(--red-subtle)] text-[var(--red-text)] *:data-[slot=alert-description]:text-[var(--red-text)] [&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-[var(--space-4)] font-semibold leading-[var(--leading-snug)]",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-[var(--space-1)] text-[var(--text-sm)] leading-[var(--leading-normal)] text-[var(--text-2)] [&_p]:leading-[var(--leading-normal)]",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
