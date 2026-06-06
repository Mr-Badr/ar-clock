"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type PopoverRootProps = React.ComponentProps<typeof PopoverPrimitive.Root>
type PopoverTriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>
type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>
type PopoverAnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>
type PopoverElementProps = React.ComponentProps<"div">
type PopoverDescriptionProps = React.ComponentProps<"p">

function Popover({
  ...props
}: PopoverRootProps): React.JSX.Element {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: PopoverTriggerProps): React.JSX.Element {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align,
  sideOffset,
  ...props
}: PopoverContentProps): React.JSX.Element {
  const resolvedAlign = align ?? "center"
  const resolvedSideOffset = sideOffset ?? 4

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={resolvedAlign}
        sideOffset={resolvedSideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-4)] text-[var(--text-1)] shadow-none outline-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 focus-visible:shadow-[var(--shadow-focus)]",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: PopoverAnchorProps): React.JSX.Element {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: PopoverElementProps): React.JSX.Element {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-[var(--space-1)] text-[var(--text-sm)]", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">): React.JSX.Element {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium text-[var(--text-1)]", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps): React.JSX.Element {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-[var(--text-2)]", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
