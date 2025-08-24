'use client';
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ResumeDTO } from '@/templates/types';

const Creative = dynamic(() => import('@/templates/Creative'), { ssr: true });
const Modern = dynamic(() => import('@/templates/Modern'), { ssr: true });
const Classic = dynamic(() => import('@/templates/Classic'), { ssr: true });
const Professional = dynamic(() => import('@/templates/Professional'), { ssr: true });
const Minimalist = dynamic(() => import('@/templates/Minimalist'), { ssr: true });

export function LivePreview({
  resume,
  mode
}: {
  resume: ResumeDTO;
  mode: 'EN' | 'SO' | 'BILINGUAL';
}) {
  const Component = useMemo(() => {
    switch (resume.template) {
      case 'CREATIVE':
        return Creative;
      case 'MODERN':
        return Modern;
      case 'CLASSIC':
        return Classic;
      case 'PROFESSIONAL':
        return Professional;
      case 'MINIMALIST':
        return Minimalist;
      default:
        return Modern;
    }
  }, [resume.template]);

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      <Component resume={resume} exportMode={mode} />
    </div>
  );
}
