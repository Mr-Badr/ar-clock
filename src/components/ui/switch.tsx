"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}

function Switch({
  className,
  size,
  ...props
}: SwitchProps): React.JSX.Element {
  const resolvedSize = size ?? "default"

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={resolvedSize}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--muted)] shadow-none outline-none transition-[background-color,border-color,box-shadow] data-[state=checked]:border-[var(--blue)] data-[state=checked]:bg-[var(--blue)] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[var(--space-6)] data-[size=default]:w-[var(--space-11)] data-[size=sm]:h-[var(--space-5)] data-[size=sm]:w-[var(--space-8)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-[var(--radius-full)] bg-[var(--surface)] ring-0 transition-transform group-data-[size=default]/switch:size-[var(--space-5)] group-data-[size=sm]/switch:size-[var(--space-4)] data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
