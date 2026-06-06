"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex w-full flex-col rounded-[var(--radius-lg)] bg-[var(--elevated)] text-[var(--text-1)]",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  children?: React.ReactNode;
  shouldFilter?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const CommandDialog = ({
  children,
  shouldFilter,
  className,
  overlayClassName,
  contentClassName,
  showCloseButton,
  title,
  description,
  ...props
}: CommandDialogProps) => {
  const shouldShowCloseButton = showCloseButton ?? false

  return (
    <Dialog {...props}>
      <DialogContent
        className={cn("overflow-hidden p-0 shadow-none", contentClassName, className)}
        overlayClassName={overlayClassName}
        showCloseButton={shouldShowCloseButton}
      >
        {title ? <DialogTitle className="sr-only">{title}</DialogTitle> : null}
        {description ? <DialogDescription className="sr-only">{description}</DialogDescription> : null}
        <Command shouldFilter={shouldFilter} className="[&_[cmdk-group-heading]]:px-[var(--space-2)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--text-3)] [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-[var(--space-2)] [&_[cmdk-input-wrapper]_svg]:size-[var(--space-5)] [&_[cmdk-input]]:h-[var(--space-12)] [&_[cmdk-item]]:px-[var(--space-2)] [&_[cmdk-item]]:py-[var(--space-3)] [&_[cmdk-item]_svg]:size-[var(--space-5)]">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    wrapperClassName?: string;
    iconClassName?: string;
    showIcon?: boolean;
  }
>(({ className, wrapperClassName, iconClassName, showIcon, ...props }, ref) => {
  const shouldShowIcon = showIcon ?? true

  return (
    <div className={cn("flex items-center border-b border-[var(--border)] px-[var(--space-3)]", wrapperClassName)} cmdk-input-wrapper="">
      {shouldShowIcon && (
        <Search className={cn("me-[var(--space-2)] size-[var(--space-4)] shrink-0 text-[var(--text-3)]", iconClassName)} aria-hidden="true" />
      )}
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-[var(--space-11)] w-full rounded-[var(--radius-md)] bg-transparent py-[var(--space-3)] text-[var(--text-sm)] text-[var(--text-1)] outline-none placeholder:text-[var(--text-4)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("pointer-events-auto min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain", className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-[var(--space-6)] text-center text-[var(--text-sm)] text-[var(--text-2)]"
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "p-[var(--space-1)] text-[var(--text-1)] [&_[cmdk-group-heading]]:px-[var(--space-2)] [&_[cmdk-group-heading]]:py-[var(--space-1-5)] [&_[cmdk-group-heading]]:text-[var(--text-xs)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--text-3)]",
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-[var(--space-1)] h-px bg-[var(--border)]", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1-5)] text-[var(--text-sm)] text-[var(--text-1)] outline-none transition-[background-color,color] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-[var(--muted)] data-[selected=true]:text-[var(--text-1)]",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ms-auto text-[var(--text-xs)] text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
