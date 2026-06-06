"use client"

import * as React from "react"
import { CheckIcon, ChevronLeftIcon, CircleIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type DropdownMenuRootProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Root>
type DropdownMenuPortalProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Portal>
type DropdownMenuTriggerProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>
type DropdownMenuContentProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Content>
type DropdownMenuGroupProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Group>
type DropdownMenuItemProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    variant?: "default" | "destructive"
  }
type DropdownMenuCheckboxItemProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>
type DropdownMenuRadioGroupProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
type DropdownMenuRadioItemProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>
type DropdownMenuLabelProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
type DropdownMenuSeparatorProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.Separator>
type DropdownMenuShortcutProps = React.ComponentProps<"span">
type DropdownMenuSubProps = React.ComponentProps<typeof DropdownMenuPrimitive.Sub>
type DropdownMenuSubTriggerProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
type DropdownMenuSubContentProps =
  React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>

function DropdownMenu({
  ...props
}: DropdownMenuRootProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: DropdownMenuPortalProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: DropdownMenuTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset,
  ...props
}: DropdownMenuContentProps): React.JSX.Element {
  const resolvedSideOffset = sideOffset ?? 4

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={resolvedSideOffset}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-44 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-1)] text-[var(--text-1)] shadow-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: DropdownMenuGroupProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant,
  ...props
}: DropdownMenuItemProps): React.JSX.Element {
  const resolvedVariant = variant ?? "default"

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={resolvedVariant}
      className={cn(
        "relative flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-2-5)] py-[var(--space-2)] text-[var(--text-sm)] leading-[var(--leading-snug)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:ps-[var(--space-8)] data-[variant=destructive]:text-[var(--red-text)] data-[variant=destructive]:focus:bg-[var(--red-subtle)] data-[variant=destructive]:focus:text-[var(--red-text)] data-[variant=destructive]:*:[svg]:!text-[var(--red-text)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg:not([class*='text-'])]:text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: DropdownMenuCheckboxItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] py-[var(--space-2)] pe-[var(--space-2-5)] ps-[var(--space-8)] text-[var(--text-sm)] leading-[var(--leading-snug)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute inset-inline-start-[var(--space-2)] flex size-[var(--space-3-5)] items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-[var(--space-4)]" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: DropdownMenuRadioGroupProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] py-[var(--space-2)] pe-[var(--space-2-5)] ps-[var(--space-8)] text-[var(--text-sm)] leading-[var(--leading-snug)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-inline-start-[var(--space-2)] flex size-[var(--space-3-5)] items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-[var(--space-2)] fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-[var(--space-2-5)] py-[var(--space-2)] text-[var(--text-xs)] font-semibold leading-[var(--leading-none)] text-[var(--text-3)] data-[inset=true]:ps-[var(--space-8)]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "-mx-[var(--space-1)] my-[var(--space-1)] h-px bg-[var(--border)]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps): React.JSX.Element {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto text-[var(--text-xs)] text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: DropdownMenuSubProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-2-5)] py-[var(--space-2)] text-[var(--text-sm)] leading-[var(--leading-snug)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[state=open]:bg-[var(--muted)] data-[state=open]:text-[var(--text-1)] data-[inset=true]:ps-[var(--space-8)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg:not([class*='text-'])]:text-[var(--text-3)]",
        className
      )}
      {...props}
    >
      {children}
      <ChevronLeftIcon
        className="ms-auto size-[var(--space-4)]"
        aria-hidden="true"
      />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-44 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-1)] text-[var(--text-1)] shadow-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
