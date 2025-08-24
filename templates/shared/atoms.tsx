'use client';
import React from 'react';
import { cn } from '@/utils/cn';

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-brand-700 tracking-wide font-semibold uppercase text-xs', className)}>{children}</h3>;
}

export function Stack({ gap = 4, className, children }: { gap?: number; className?: string; children: React.ReactNode }) {
  return <div className={cn(`flex flex-col gap-${gap}`, className)}>{children}</div>;
}
