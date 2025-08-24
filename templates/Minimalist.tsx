import React from 'react';
import { TemplateProps } from './types';

function L({ text, mode }: { text?: { en?: string; so?: string } | null; mode: 'EN' | 'SO' }) {
  if (!text) return null;
  return <>{mode === 'EN' ? text.en : text.so}</>;
}

export default function Minimalist({ resume, exportMode }: TemplateProps) {
  const mode = exportMode === 'EN' ? 'EN' : exportMode === 'SO' ? 'SO' : 'EN';
  return (
    <div className="w-[794px] mx-auto font-sans text-[12px] leading-6 text-gray-900">
      <div className="p-8">
        <h1 className="text-3xl font-semibold tracking-tight"><L text={resume.title} mode={mode} /></h1>
      </div>
      <div className="px-8 pb-8 space-y-8">
        {resume.sections
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <div key={s.id}>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">{s.kind}</div>
              <div className="mt-2 space-y-3">
                {s.entries.map((e) => (
                  <div key={e.id}>
                    {e.title && <div className="font-medium"><L text={e.title as any} mode={mode} /></div>}
                    {e.subtitle && <div className="text-gray-600"><L text={e.subtitle as any} mode={mode} /></div>}
                    {e.body && <div><L text={e.body as any} mode={mode} /></div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      {resume.watermark && <div className="watermark select-none">Free version</div>}
    </div>
  );
}
