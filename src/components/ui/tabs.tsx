"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>
type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>
type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>
type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>

function Tabs({
  className,
  orientation,
  ...props
}: TabsProps): React.JSX.Element {
  const resolvedOrientation = orientation ?? "horizontal"

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={resolvedOrientation}
      orientation={resolvedOrientation}
      className={cn(
        "group/tabs flex gap-[var(--space-2)] data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-[var(--text-3)] group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--muted)] p-[3px] group-data-[orientation=horizontal]/tabs:min-h-[var(--space-11)]",
        line:
          "gap-[var(--space-1)] border-b border-[var(--border)] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant,
  ...props
}: TabsListProps): React.JSX.Element {
  const resolvedVariant = variant ?? "default"

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={resolvedVariant}
      className={cn(tabsListVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: TabsTriggerProps): React.JSX.Element {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex min-h-[var(--space-11)] flex-1 items-center justify-center gap-[var(--space-2)] rounded-[calc(var(--radius-lg)-3px)] border border-transparent px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-sm)] font-medium leading-[var(--leading-none)] whitespace-nowrap text-[var(--text-3)] transition-[background-color,border-color,box-shadow,color,transform] duration-100 hover:text-[var(--text-1)] focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:opacity-50 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--space-4)]",
        "group-data-[variant=default]/tabs-list:data-[state=active]:bg-[var(--surface)] group-data-[variant=default]/tabs-list:data-[state=active]:text-[var(--text-1)] group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none",
        "group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-x-0 group-data-[variant=line]/tabs-list:border-t-0 group-data-[variant=line]/tabs-list:border-b-[1.5px] group-data-[variant=line]/tabs-list:px-[var(--space-4)] group-data-[variant=line]/tabs-list:shadow-none group-data-[variant=line]/tabs-list:data-[state=active]:border-b-[var(--blue)] group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-[var(--blue)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: TabsContentProps): React.JSX.Element {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-[var(--radius-md)] outline-none focus-visible:shadow-[var(--shadow-focus)]",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
