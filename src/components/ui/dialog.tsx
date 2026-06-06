"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type DialogRootProps = React.ComponentProps<typeof DialogPrimitive.Root>
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>
type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  overlayClassName?: string
  showCloseButton?: boolean
}
type DialogElementProps = React.ComponentProps<"div">
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>
type DialogDescriptionProps =
  React.ComponentProps<typeof DialogPrimitive.Description>

function Dialog({
  ...props
}: DialogRootProps): React.JSX.Element {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: DialogTriggerProps): React.JSX.Element {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: DialogPortalProps): React.JSX.Element {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: DialogCloseProps): React.JSX.Element {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogOverlayProps): React.JSX.Element {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--bg-overlay)] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  overlayClassName,
  showCloseButton,
  ...props
}: DialogContentProps): React.JSX.Element {
  const shouldShowCloseButton = showCloseButton ?? true

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay className={overlayClassName} />
      <div className="pointer-events-none fixed inset-0 z-[10060] overflow-x-hidden overflow-y-auto p-[var(--space-4)] sm:p-[var(--space-6)]">
        <div className="grid min-h-full place-items-center">
          <DialogPrimitive.Content
            data-slot="dialog-content"
            className={cn(
              "pointer-events-auto relative z-[1] grid w-full max-w-lg gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--elevated)] p-[var(--space-6)] text-[var(--text-1)] shadow-none outline-none transition-[opacity] duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 focus-visible:shadow-[var(--shadow-focus)]",
              className
            )}
            {...props}
          >
            {children}
            {shouldShowCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className="absolute inset-block-start-[var(--space-4)] inset-inline-end-[var(--space-4)] inline-flex size-[var(--space-11)] items-center justify-center rounded-[var(--radius-lg)] border border-transparent text-[var(--text-3)] transition-[background-color,border-color,color,box-shadow] hover:border-[var(--border)] hover:bg-[var(--muted)] hover:text-[var(--text-1)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]"
              >
                <XIcon aria-hidden="true" />
                <span className="sr-only">إغلاق</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </div>
      </div>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  ...props
}: DialogElementProps): React.JSX.Element {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-[var(--space-2)] text-start", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton,
  children,
  ...props
}: DialogElementProps & {
  showCloseButton?: boolean
}): React.JSX.Element {
  const shouldShowCloseButton = showCloseButton ?? false

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-[var(--space-2)] sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {shouldShowCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">إغلاق</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: DialogTitleProps): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-[var(--text-lg)] font-semibold leading-[var(--leading-snug)] text-[var(--text-1)]",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps): React.JSX.Element {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-[var(--text-sm)] leading-[var(--leading-normal)] text-[var(--text-2)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
