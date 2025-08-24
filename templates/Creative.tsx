import React from 'react';
import { TemplateProps } from './types';
import { SectionTitle } from './shared/atoms';

function L({ text, mode }: { text?: { en?: string; so?: string } | null; mode: 'EN' | 'SO' }) {
  if (!text) return null;
  return <>{mode === 'EN' ? text.en : text.so}</>;
}

export default function Creative({ resume, exportMode }: TemplateProps) {
  const mode = exportMode === 'EN' ? 'EN' : exportMode === 'SO' ? 'SO' : 'EN';
  const themeColor = (resume.theme?.primary as string) || '#1d4ed8';

  return (
    <div className="w-[794px] mx-auto font-sans text-[12px] leading-5 text-slate-900">
      <div
        style={{ background: `linear-gradient(90deg, ${themeColor}, #60a5fa)` }}
        className="text-white rounded-t-2xl p-6"
      >
        <div className="text-3xl font-bold">
          <L text={resume.title} mode={mode} />
        </div>
        <div className="opacity-90">CV</div>
      </div>
      <div className="grid grid-cols-[240px,1fr] gap-6 border border-slate-200 border-t-0 rounded-b-2xl p-6">
        <div className="space-y-6">
          {resume.sections
            .filter((s) => s.kind === 'personal' || s.kind === 'skills' || s.kind === 'languages')
            .map((section) => (
              <div key={section.id}>
                <SectionTitle>{section.kind.toUpperCase()}</SectionTitle>
                <div className="mt-2 space-y-2">
                  {section.entries.map((e) => (
                    <div key={e.id} className="text-[12px]">
                      {e.title && <div className="font-semibold"><L text={e.title as any} mode={mode} /></div>}
                      {e.subtitle && <div className="text-slate-600"><L text={e.subtitle as any} mode={mode} /></div>}
                      {e.body && <div className="text-slate-700"><L text={e.body as any} mode={mode} /></div>}
                      {Array.isArray(e.meta?.chips) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {e.meta.chips.map((c: any, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px]">
                              <L text={c} mode={mode} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="space-y-6">
          {resume.sections
            .filter((s) => !['personal', 'skills', 'languages'].includes(s.kind))
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div key={section.id}>
                <SectionTitle>{section.kind.toUpperCase()}</SectionTitle>
                <div className="mt-2 space-y-3">
                  {section.entries.map((e) => (
                    <div key={e.id}>
                      {e.title && <div className="font-semibold text-[13px]"><L text={e.title as any} mode={mode} /></div>}
                      {e.subtitle && <div className="text-slate-600"><L text={e.subtitle as any} mode={mode} /></div>}
                      {e.body && <div className="text-slate-700 text-[12px]"><L text={e.body as any} mode={mode} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {resume.watermark && (
        <div className="watermark select-none">Generated with cvbuilder.app</div>
      )}
    </div>
  );
}
