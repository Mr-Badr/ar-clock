"use client"

import * as React from "react"
import { CheckIcon, ChevronLeftIcon, CircleIcon } from "lucide-react"
import { Menubar as MenubarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex min-h-[var(--space-11)] items-center gap-[var(--space-1)] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-1)] shadow-none",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex min-h-[var(--space-9)] select-none items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1)] text-[var(--text-sm)] font-medium text-[var(--text-2)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[state=open]:bg-[var(--muted)] data-[state=open]:text-[var(--text-1)]",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align,
  alignOffset,
  sideOffset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  const resolvedAlign = align ?? "start"
  const resolvedAlignOffset = alignOffset ?? -4
  const resolvedSideOffset = sideOffset ?? 8

  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={resolvedAlign}
        alignOffset={resolvedAlignOffset}
        sideOffset={resolvedSideOffset}
        className={cn(
          "z-50 min-w-48 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-1)] text-[var(--text-1)] shadow-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const resolvedVariant = variant ?? "default"

  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={resolvedVariant}
      className={cn(
        "relative flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1-5)] text-[var(--text-sm)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:ps-[var(--space-8)] data-[variant=destructive]:text-[var(--red-text)] data-[variant=destructive]:focus:bg-[var(--red-subtle)] data-[variant=destructive]:focus:text-[var(--red-text)] data-[variant=destructive]:*:[svg]:!text-[var(--red-text)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg:not([class*='text-'])]:text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] py-[var(--space-1-5)] pe-[var(--space-2)] ps-[var(--space-8)] text-[var(--text-sm)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute inset-inline-start-[var(--space-2)] flex size-[var(--space-3-5)] items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-[var(--space-4)]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] py-[var(--space-1-5)] pe-[var(--space-2)] ps-[var(--space-8)] text-[var(--text-sm)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-inline-start-[var(--space-2)] flex size-[var(--space-3-5)] items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-[var(--space-2)] fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-[var(--space-2)] py-[var(--space-1-5)] text-[var(--text-sm)] font-medium text-[var(--text-1)] data-[inset=true]:ps-[var(--space-8)]",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-[var(--space-1)] my-[var(--space-1)] h-px bg-[var(--border)]", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ms-auto text-[var(--text-xs)] text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default select-none items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1-5)] text-[var(--text-sm)] text-[var(--text-1)] outline-none transition-[background-color,color] focus:bg-[var(--muted)] focus:text-[var(--text-1)] data-[state=open]:bg-[var(--muted)] data-[state=open]:text-[var(--text-1)] data-[inset=true]:ps-[var(--space-8)]",
        className
      )}
      {...props}
    >
      {children}
      <ChevronLeftIcon className="ms-auto size-[var(--space-4)]" aria-hidden="true" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-44 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-1)] text-[var(--text-1)] shadow-none transition-[opacity] duration-100 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
