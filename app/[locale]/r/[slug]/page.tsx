import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { LivePreview } from '@/components/preview/LivePreview';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export default async function PublicResumePage({
  params
}: {
  params: { slug: string; locale: string };
}) {
  const resume = await prisma.resume.findUnique({
    where: { slug: params.slug },
    include: { sections: { include: { entries: true }, orderBy: { order: 'asc' } } }
  });
  if (!resume || resume.visibility === 'DRAFT') notFound();

  const dto = {
    id: resume.id,
    title: resume.title as any,
    template: resume.template,
    theme: resume.theme,
    locale: (resume.locale as 'en' | 'so') || 'en',
    watermark: resume.watermark,
    sections: resume.sections.map((s) => ({
      id: s.id,
      kind: s.kind,
      order: s.order,
      entries: s.entries.map((e) => ({
        id: e.id,
        title: e.title as any,
        subtitle: e.subtitle as any,
        body: e.body as any,
        meta: e.meta,
        startDate: e.startDate?.toISOString() ?? null,
        endDate: e.endDate?.toISOString() ?? null,
        ongoing: e.ongoing
      }))
    }))
  } as const;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto">
        <LivePreview resume={dto as any} mode="EN" />
      </div>
    </div>
  );
}
