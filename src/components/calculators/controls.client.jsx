"use client";

import { Button as UiButton } from '@/components/ui/button';
import { Input as UiInput } from '@/components/ui/input';
import { Progress as UiProgress } from '@/components/ui/progress';
import { SelectTrigger as UiSelectTrigger } from '@/components/ui/select';
import { TabsList as UiTabsList, TabsTrigger as UiTabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

function getButtonToneClasses(variant) {
  switch (variant) {
    case 'default':
      return 'btn btn-primary--flat';
    case 'secondary':
      return 'btn btn-secondary';
    case 'ghost':
    case 'link':
      return 'btn btn-ghost';
    case 'destructive':
      return 'btn btn-danger';
    case 'outline':
    default:
      return 'btn btn-surface';
  }
}

function getButtonSizeClasses(size) {
  switch (size) {
    case 'xs':
    case 'icon-xs':
      return 'btn-xs';
    case 'sm':
    case 'icon-sm':
      return 'btn-sm';
    case 'lg':
    case 'icon-lg':
      return 'btn-lg';
    default:
      return '';
  }
}

export function CalcButton({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}) {
  return (
    <UiButton
      variant="ghost"
      size="default"
      className={cn(
        'calc-button',
        getButtonToneClasses(variant),
        getButtonSizeClasses(size),
        className,
      )}
      {...props}
    />
  );
}

export function CalcInput({ className, ...props }) {
  return <UiInput className={cn('input calc-input', className)} {...props} />;
}

export function CalcSelectTrigger({ className, ...props }) {
  return (
    <UiSelectTrigger
      className={cn('select calc-select-trigger', className)}
      {...props}
    />
  );
}

export function CalcTabsList({ className, ...props }) {
  return <UiTabsList className={cn('tabs calc-tabs-list', className)} {...props} />;
}

export function CalcTabsTrigger({ className, ...props }) {
  return <UiTabsTrigger className={cn('tab calc-tabs-trigger', className)} {...props} />;
}

export function CalcProgress({ className, ...props }) {
  return <UiProgress className={cn('progress-track calc-progress', className)} {...props} />;
}
