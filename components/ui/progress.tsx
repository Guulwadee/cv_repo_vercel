import * as React from 'react';

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-600 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
