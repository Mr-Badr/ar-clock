import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type NavigationMenuProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean
  }
type NavigationMenuListProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.List>
type NavigationMenuItemProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Item>
type NavigationMenuTriggerProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>
type NavigationMenuContentProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Content>
type NavigationMenuViewportProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>
type NavigationMenuLinkProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Link>
type NavigationMenuIndicatorProps =
  React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>

function NavigationMenu({
  className,
  children,
  viewport,
  ...props
}: NavigationMenuProps): React.JSX.Element {
  const shouldRenderViewport = viewport ?? true

  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={shouldRenderViewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {shouldRenderViewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuListProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-[var(--space-1)]",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: NavigationMenuItemProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex min-h-[var(--space-11)] w-max items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-transparent bg-transparent px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-sm)] font-medium leading-[var(--leading-none)] text-[var(--text-2)] outline-none transition-[background-color,border-color,box-shadow,color] hover:bg-[var(--muted)] hover:text-[var(--text-1)] focus:bg-[var(--muted)] focus:text-[var(--text-1)] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-[var(--border)] data-[state=open]:bg-[var(--surface)] data-[state=open]:text-[var(--text-1)]"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuTriggerProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-px size-[var(--space-3)] transition-transform duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuContentProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 start-0 w-full transition-[opacity] duration-150 data-[motion^=from-]:opacity-100 data-[motion^=to-]:opacity-0 md:absolute md:w-auto",
        "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: NavigationMenuViewportProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "absolute start-0 top-full isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-visible md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuLinkProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-[var(--space-1)] rounded-[var(--radius-sm)] p-[var(--space-2)] text-[var(--text-sm)] text-[var(--text-2)] outline-none transition-[background-color,box-shadow,color] hover:bg-[var(--muted)] hover:text-[var(--text-1)] focus:bg-[var(--muted)] focus:text-[var(--text-1)] focus-visible:shadow-[var(--shadow-focus)] data-[active=true]:bg-[var(--blue-subtle)] data-[active=true]:text-[var(--blue-text)] data-[active=true]:focus:bg-[var(--blue-subtle)] data-[active=true]:hover:bg-[var(--blue-subtle)] [&_svg:not([class*='size-'])]:size-[var(--space-4)] [&_svg:not([class*='text-'])]:text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: NavigationMenuIndicatorProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-[var(--space-1-5)] items-end justify-center overflow-hidden transition-opacity duration-150 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] size-[var(--space-2)] rotate-45 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--elevated)] shadow-none" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
