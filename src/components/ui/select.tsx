"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SelectRootProps = React.ComponentProps<typeof SelectPrimitive.Root>
type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>
type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>
type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}
type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>
type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.Label>
type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>
type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>
type SelectScrollButtonProps =
  React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>

function Select({
  ...props
}: SelectRootProps): React.JSX.Element {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: SelectGroupProps): React.JSX.Element {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: SelectValueProps): React.JSX.Element {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size,
  children,
  ...props
}: SelectTriggerProps): React.JSX.Element {
  const resolvedSize = size ?? "default"

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={resolvedSize}
      className={cn(
        "flex w-fit items-center justify-between gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-sm)] text-[var(--text-1)] whitespace-nowrap shadow-none outline-none transition-[background-color,border-color,box-shadow,color] data-[placeholder]:text-[var(--text-4)] hover:border-[var(--border-strong)] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] aria-invalid:border-[var(--border-error)] aria-invalid:shadow-[var(--shadow-focus-danger)] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:min-h-[var(--space-11)] data-[size=sm]:min-h-[var(--space-11)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-[var(--space-2)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg:not([class*='text-'])]:text-[var(--text-3)]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-[var(--space-4)] text-[var(--text-3)]" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position,
  align,
  ...props
}: SelectContentProps): React.JSX.Element {
  const resolvedPosition = position ?? "item-aligned"
  const resolvedAlign = align ?? "center"

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-44 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] text-[var(--text-1)] shadow-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          resolvedPosition === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={resolvedPosition}
        align={resolvedAlign}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            resolvedPosition === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-[var(--space-2)] py-[var(--space-1-5)] text-[var(--text-xs)] text-[var(--text-3)]", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectItemProps): React.JSX.Element {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] py-[var(--space-1-5)] pe-[var(--space-8)] ps-[var(--space-2)] text-[var(--text-sm)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-[var(--space-2)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg:not([class*='text-'])]:text-[var(--text-3)]",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute inset-inline-end-[var(--space-2)] flex size-[var(--space-3-5)] items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-[var(--space-4)]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectSeparatorProps): React.JSX.Element {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-[var(--space-1)] my-[var(--space-1)] h-px bg-[var(--border)]", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectScrollButtonProps): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-[var(--space-1)] text-[var(--text-3)]",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-[var(--space-4)]" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-[var(--space-1)] text-[var(--text-3)]",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-[var(--space-4)]" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
