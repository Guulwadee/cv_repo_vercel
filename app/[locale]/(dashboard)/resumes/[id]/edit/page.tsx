import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { LivePreview } from '@/components/preview/LivePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { revalidatePath } from 'next/cache';

async function getResume(id: string, userId: string) {
  return prisma.resume.findFirst({
    where: { id, userId },
    include: {
      sections: {
        include: { entries: true },
        orderBy: { order: 'asc' }
      }
    }
  });
}

export default async function EditResumePage({
  params
}: {
  params: { id: string; locale: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const resume = await getResume(params.id, userId);
  if (!resume) notFound();

  async function saveTitle(formData: FormData) {
    'use server';
    const session = await getServerSession(authOptions);
    if (!session) return;
    const id = formData.get('id') as string;
    const en = (formData.get('title_en') as string) ?? '';
    const so = (formData.get('title_so') as string) ?? '';
    await prisma.resume.update({
      where: { id },
      data: { title: { en, so } }
    });
    await prisma.auditLog.create({
      data: { userId: (session.user as any).id, action: 'resume.update.title', entity: 'Resume', entityId: id }
    });
    revalidatePath(`/${params.locale}/resumes/${id}/edit`);
  }

  const progress = calcProgress(resume);

  return (
    <div className="grid grid-cols-[1.1fr_.9fr] gap-8">
      <div>
        <div className="progress-indicator py-3">
          <Progress value={progress} />
        </div>

        <h1 className="text-lg font-semibold mt-4">Edit Resume</h1>
        <form action={saveTitle} className="mt-3 space-y-3">
          <input type="hidden" name="id" defaultValue={resume.id} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Title (EN)</label>
              <Input name="title_en" defaultValue={(resume.title as any).en || ''} />
            </div>
            <div>
              <label className="text-xs text-slate-500">Ciwaan (SO)</label>
              <Input name="title_so" defaultValue={(resume.title as any).so || ''} />
            </div>
          </div>
          <Button type="submit">Save</Button>
        </form>

        <div className="mt-6">
          {resume.sections.map((s) => (
            <div key={s.id} className="mb-6">
              <div className="font-medium">{s.kind.toUpperCase()}</div>
              {s.entries.map((e) => (
                <SectionEntryForm key={e.id} params={params} entry={e} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="sticky top-24 self-start">
        <LivePreview
          resume={{
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
          }}
          mode="EN"
        />
      </div>
    </div>
  );
}

function calcProgress(resume: any) {
  const steps = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'extras'];
  const present = new Set(resume.sections.map((s: any) => s.kind));
  const done = steps.filter((s) => present.has(s)).length;
  return Math.round((done / steps.length) * 100);
}

function SectionEntryForm({ entry, params }: { entry: any; params: { locale: string; id: string } }) {
  async function saveEntry(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const title_en = (formData.get('title_en') as string) || '';
    const title_so = (formData.get('title_so') as string) || '';
    const body_en = (formData.get('body_en') as string) || '';
    const body_so = (formData.get('body_so') as string) || '';
    await prisma.entry.update({
      where: { id },
      data: {
        title: { en: title_en, so: title_so },
        body: { en: body_en, so: body_so }
      }
    });
  }
  return (
    <form action={saveEntry} className="mt-3 space-y-2 border rounded-xl p-3">
      <input type="hidden" name="id" defaultValue={entry.id} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">Title (EN)</label>
          <Input name="title_en" defaultValue={(entry.title as any)?.en || ''} />
        </div>
        <div>
          <label className="text-xs text-slate-500">Ciwaan (SO)</label>
          <Input name="title_so" defaultValue={(entry.title as any)?.so || ''} />
        </div>
        <div>
          <label className="text-xs text-slate-500">Body (EN)</label>
          <Textarea name="body_en" defaultValue={(entry.body as any)?.en || ''} rows={3} />
        </div>
        <div>
          <label className="text-xs text-slate-500">Qoraal (SO)</label>
          <Textarea name="body_so" defaultValue={(entry.body as any)?.so || ''} rows={3} />
        </div>
      </div>
      <Button type="submit" variant="outline" className="text-xs">Save entry</Button>
    </form>
  );
}
