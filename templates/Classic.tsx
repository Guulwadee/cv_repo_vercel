import React from 'react';
import { TemplateProps } from './types';

function L({ text, mode }: { text?: { en?: string; so?: string } | null; mode: 'EN' | 'SO' }) {
  if (!text) return null;
  return <>{mode === 'EN' ? text.en : text.so}</>;
}

export default function Classic({ resume, exportMode }: TemplateProps) {
  const mode = exportMode === 'EN' ? 'EN' : exportMode === 'SO' ? 'SO' : 'EN';
  return (
    <div className="w-[794px] mx-auto font-serif text-[12px] leading-6 text-gray-900">
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-tight"><L text={resume.title} mode={mode} /></h1>
      </div>
      <div className="px-6 pb-6 space-y-6">
        {resume.sections
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <div key={s.id}>
              <h3 className="text-[11px] font-semibold tracking-widest text-gray-700 uppercase">
                {s.kind}
              </h3>
              <div className="mt-2 space-y-3">
                {s.entries.map((e) => (
                  <div key={e.id}>
                    {e.title && <div className="font-semibold"><L text={e.title as any} mode={mode} /></div>}
                    {e.subtitle && <div className="italic text-gray-600"><L text={e.subtitle as any} mode={mode} /></div>}
                    {e.body && <div><L text={e.body as any} mode={mode} /></div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      {resume.watermark && <div className="watermark select-none">cvbuilder.app</div>}
    </div>
  );
}
