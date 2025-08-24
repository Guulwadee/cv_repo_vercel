import React from 'react';
import { TemplateProps } from './types';

function L({ text, mode }: { text?: { en?: string; so?: string } | null; mode: 'EN' | 'SO' }) {
  if (!text) return null;
  return <>{mode === 'EN' ? text.en : text.so}</>;
}

export default function Professional({ resume, exportMode }: TemplateProps) {
  const mode = exportMode === 'EN' ? 'EN' : exportMode === 'SO' ? 'SO' : 'EN';
  return (
    <div className="w-[794px] mx-auto font-sans text-[12px] leading-5 text-gray-900">
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold"><L text={resume.title} mode={mode} /></h1>
          <div className="flex gap-3 text-center">
            <div className="px-3 py-2 rounded-lg bg-gray-100">
              <div className="text-[10px] uppercase text-gray-500">Experience</div>
              <div className="font-semibold">{(resume.sections.find(s => s.kind === 'experience')?.entries.length) || 0}+</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-gray-100">
              <div className="text-[10px] uppercase text-gray-500">Projects</div>
              <div className="font-semibold">{(resume.sections.find(s => s.kind === 'projects')?.entries.length) || 0}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1.3fr_.7fr] gap-6 p-6">
        <div className="space-y-6">
          {resume.sections
            .filter((s) => ['summary', 'experience', 'projects'].includes(s.kind))
            .map((s) => (
              <div key={s.id}>
                <div className="text-xs font-semibold text-brand-700 uppercase">{s.kind}</div>
                <div className="mt-2 space-y-3">
                  {s.entries.map((e) => (
                    <div key={e.id} className="border-b border-dashed pb-2">
                      {e.title && <div className="font-semibold"><L text={e.title as any} mode={mode} /></div>}
                      {e.subtitle && <div className="text-gray-600"><L text={e.subtitle as any} mode={mode} /></div>}
                      {e.body && <div className="text-gray-700"><L text={e.body as any} mode={mode} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="space-y-6">
          {resume.sections
            .filter((s) => ['personal', 'skills', 'certifications', 'languages', 'education'].includes(s.kind))
            .map((s) => (
              <div key={s.id}>
                <div className="text-xs font-semibold text-brand-700 uppercase">{s.kind}</div>
                <div className="mt-2 space-y-2">
                  {s.entries.map((e) => (
                    <div key={e.id}>
                      {e.title && <div className="font-medium"><L text={e.title as any} mode={mode} /></div>}
                      {e.body && <div className="text-gray-700"><L text={e.body as any} mode={mode} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {resume.watermark && <div className="watermark select-none">CV Builder</div>}
    </div>
  );
}
