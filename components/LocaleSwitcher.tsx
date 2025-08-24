'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function LocaleSwitcher() {
  const path = usePathname();
  if (!path) return null;
  const parts = path.split('/');
  const current = parts[1] || 'en';
  const other = current === 'en' ? 'so' : 'en';
  const otherPath = ['/', other, ...parts.slice(2)].join('/');
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href={otherPath} className="px-2 py-1 rounded border border-slate-300 text-slate-700">
        {other.toUpperCase()}
      </Link>
    </div>
  );
}
