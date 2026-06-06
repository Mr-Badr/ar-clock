import * as React from "react"

import { cn } from "@/lib/utils"

type TableProps = React.ComponentProps<"table">
type TableSectionProps = React.ComponentProps<"thead">
type TableBodyProps = React.ComponentProps<"tbody">
type TableFooterProps = React.ComponentProps<"tfoot">
type TableRowProps = React.ComponentProps<"tr">
type TableHeadProps = React.ComponentProps<"th">
type TableCellProps = React.ComponentProps<"td">
type TableCaptionProps = React.ComponentProps<"caption">

function Table({ className, ...props }: TableProps): React.JSX.Element {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-none"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-[var(--text-sm)] text-[var(--text-1)] tabular-nums",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({
  className,
  ...props
}: TableSectionProps): React.JSX.Element {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-[var(--border)]", className)}
      {...props}
    />
  )
}

function TableBody({
  className,
  ...props
}: TableBodyProps): React.JSX.Element {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({
  className,
  ...props
}: TableFooterProps): React.JSX.Element {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-[var(--border)] bg-[var(--muted)] font-medium text-[var(--text-2)] [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({
  className,
  ...props
}: TableRowProps): React.JSX.Element {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-[var(--border)] transition-colors duration-100 hover:bg-[var(--blue-subtle)] data-[state=selected]:bg-[var(--blue-subtle)]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({
  className,
  ...props
}: TableHeadProps): React.JSX.Element {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "bg-[var(--muted)] px-[var(--space-3-5)] py-[var(--space-2)] text-start align-middle text-[var(--text-xs)] font-semibold leading-[var(--leading-none)] whitespace-nowrap text-[var(--text-3)] [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  ...props
}: TableCellProps): React.JSX.Element {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-[var(--space-3-5)] py-[var(--space-3)] align-middle leading-[var(--leading-snug)] whitespace-nowrap text-[var(--text-1)] [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: TableCaptionProps): React.JSX.Element {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-[var(--space-4)] text-[var(--text-sm)] text-[var(--text-3)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
