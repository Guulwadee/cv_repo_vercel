import { cn } from '@/utils/cn';
import React from 'react';

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }) {
  const variant = (props as any).variant || 'primary';
  const base =
    variant === 'primary'
      ? 'bg-brand-700 text-white hover:bg-brand-800'
      : 'border border-slate-300 text-slate-700 hover:bg-slate-50';
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
        base,
        className,
      )}
    />
  );
}
