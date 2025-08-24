import React from 'react';
import { TemplateProps } from './types';
import { SectionTitle } from './shared/atoms';

function L({ text, mode }: { text?: { en?: string; so?: string } | null; mode: 'EN' | 'SO' }) {
  if (!text) return null;
  return <>{mode === 'EN' ? text.en : text.so}</>;
}

export default function Modern({ resume, exportMode }: TemplateProps) {
  const mode = exportMode === 'EN' ? 'EN' : exportMode === 'SO' ? 'SO' : 'EN';
  return (
    <div className="w-[794px] mx-auto font-sans text-[12px] leading-5 text-slate-900">
      <div className="px-6 pt-6">
        <div className="text-2xl font-bold text-brand-700">
          <L text={resume.title} mode={mode} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 p-6">
        <div className="col-span-1 space-y-6">
          {(resume.sections || [])
            .filter((s) => ['personal', 'skills', 'languages'].includes(s.kind))
            .map((s) => (
              <div key={s.id}>
                <SectionTitle>{s.kind}</SectionTitle>
                <div className="mt-2 space-y-2">
                  {s.entries.map((e) => (
                    <div key={e.id} className="border-l border-dotted border-brand-300 pl-3">
                      {e.title && <div className="font-semibold"><L text={e.title as any} mode={mode} /></div>}
                      {e.body && <div className="text-slate-700"><L text={e.body as any} mode={mode} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="col-span-2 space-y-6">
          {(resume.sections || [])
            .filter((s) => !['personal', 'skills', 'languages'].includes(s.kind))
            .map((s) => (
              <div key={s.id}>
                <SectionTitle>{s.kind}</SectionTitle>
                <div className="mt-2 space-y-4">
                  {s.entries.map((e) => (
                    <div key={e.id}>
                      {e.title && <div className="font-semibold text-[13px]"><L text={e.title as any} mode={mode} /></div>}
                      {e.subtitle && <div className="text-slate-600"><L text={e.subtitle as any} mode={mode} /></div>}
                      {e.body && <div className="text-slate-700"><L text={e.body as any} mode={mode} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {resume.watermark && <div className="watermark select-none">CV Builder · Free</div>}
    </div>
  );
}
