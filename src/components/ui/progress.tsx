"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>): React.JSX.Element {
  const normalizedValue = typeof value === "number" ? value : 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-[var(--space-2)] w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--blue-subtle)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-[var(--blue)] transition-transform"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
