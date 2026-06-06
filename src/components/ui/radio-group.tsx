"use client"

import * as React from "react"
import { CircleIcon } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root>
type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item>

function RadioGroup({
  className,
  ...props
}: RadioGroupProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-[var(--space-3)]", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: RadioGroupItemProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-[var(--space-4)] shrink-0 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface)] text-[var(--blue)] shadow-none outline-none transition-[background-color,border-color,box-shadow,color] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute start-1/2 top-1/2 size-[var(--space-2)] -translate-x-1/2 -translate-y-1/2 fill-[var(--blue)] rtl:translate-x-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
