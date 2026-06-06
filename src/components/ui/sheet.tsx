"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SheetRootProps = React.ComponentProps<typeof SheetPrimitive.Root>
type SheetTriggerProps = React.ComponentProps<typeof SheetPrimitive.Trigger>
type SheetCloseProps = React.ComponentProps<typeof SheetPrimitive.Close>
type SheetPortalProps = React.ComponentProps<typeof SheetPrimitive.Portal>
type SheetOverlayProps = React.ComponentProps<typeof SheetPrimitive.Overlay>
type SheetSide = "top" | "right" | "bottom" | "left"
type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide
  showCloseButton?: boolean
}
type SheetElementProps = React.ComponentProps<"div">
type SheetTitleProps = React.ComponentProps<typeof SheetPrimitive.Title>
type SheetDescriptionProps =
  React.ComponentProps<typeof SheetPrimitive.Description>

function Sheet({ ...props }: SheetRootProps): React.JSX.Element {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: SheetTriggerProps): React.JSX.Element {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: SheetCloseProps): React.JSX.Element {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: SheetPortalProps): React.JSX.Element {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: SheetOverlayProps): React.JSX.Element {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--bg-overlay)] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side,
  showCloseButton,
  ...props
}: SheetContentProps): React.JSX.Element {
  const resolvedSide: SheetSide = side ?? "right"
  const shouldShowCloseButton = showCloseButton ?? true

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-[var(--space-4)] border-[var(--border)] bg-[var(--elevated)] text-[var(--text-1)] shadow-none outline-none transition-[opacity] ease-out data-[state=closed]:duration-200 data-[state=open]:duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 focus-visible:shadow-[var(--shadow-focus)]",
          resolvedSide === "right" &&
            "inset-block-0 inset-inline-end-0 h-full w-3/4 border-inline-start data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm rtl:data-[state=closed]:-translate-x-full",
          resolvedSide === "left" &&
            "inset-block-0 inset-inline-start-0 h-full w-3/4 border-inline-end data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm rtl:data-[state=closed]:translate-x-full",
          resolvedSide === "top" &&
            "inset-inline-0 inset-block-start-0 h-auto border-b data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
          resolvedSide === "bottom" &&
            "inset-inline-0 inset-block-end-0 h-auto border-t data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
          className
        )}
        {...props}
      >
        {children}
        {shouldShowCloseButton && (
          <SheetPrimitive.Close className="absolute inset-block-start-[var(--space-4)] inset-inline-end-[var(--space-4)] inline-flex size-[var(--space-11)] items-center justify-center rounded-[var(--radius-lg)] border border-transparent text-[var(--text-3)] transition-[background-color,border-color,color,box-shadow] hover:border-[var(--border)] hover:bg-[var(--muted)] hover:text-[var(--text-1)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <XIcon className="size-[var(--space-4)]" aria-hidden="true" />
            <span className="sr-only">إغلاق</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({
  className,
  ...props
}: SheetElementProps): React.JSX.Element {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-[var(--space-2)] p-[var(--space-5)] pe-[var(--space-12)] text-start",
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({
  className,
  ...props
}: SheetElementProps): React.JSX.Element {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-[var(--space-2)] border-t border-[var(--border)] p-[var(--space-5)]",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: SheetTitleProps): React.JSX.Element {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-[var(--text-lg)] font-semibold leading-[var(--leading-snug)] text-[var(--text-1)]",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetDescriptionProps): React.JSX.Element {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        "text-[var(--text-sm)] leading-[var(--leading-normal)] text-[var(--text-2)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
