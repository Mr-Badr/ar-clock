"use client"

import * as React from "react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type HoverCardRootProps = React.ComponentProps<typeof HoverCardPrimitive.Root>
type HoverCardTriggerProps = React.ComponentProps<typeof HoverCardPrimitive.Trigger>
type HoverCardContentProps = React.ComponentProps<typeof HoverCardPrimitive.Content>

function HoverCard({
  ...props
}: HoverCardRootProps): React.JSX.Element {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: HoverCardTriggerProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align,
  sideOffset,
  ...props
}: HoverCardContentProps): React.JSX.Element {
  const resolvedAlign = align ?? "center"
  const resolvedSideOffset = sideOffset ?? 4

  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={resolvedAlign}
        sideOffset={resolvedSideOffset}
        className={cn(
          "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-4)] text-[var(--text-1)] shadow-none outline-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 focus-visible:shadow-[var(--shadow-focus)]",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
