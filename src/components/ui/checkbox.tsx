"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>

function Checkbox({
  className,
  ...props
}: CheckboxProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-[var(--space-4)] shrink-0 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-on-accent)] shadow-none outline-none transition-[background-color,border-color,box-shadow,color] data-[state=checked]:border-[var(--blue)] data-[state=checked]:bg-[var(--blue)] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-[var(--space-3-5)]" aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
