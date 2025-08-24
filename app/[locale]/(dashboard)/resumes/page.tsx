import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

async function createResume(userId: string) {
  const slug = `cv-${randomBytes(4).toString('hex')}`;
  const resume = await prisma.resume.create({
    data: {
      userId,
      slug,
      title: { en: 'Untitled Resume', so: 'CV aan cinwaan lahayn' },
      theme: { primary: '#1d4ed8', font: 'Inter' }
    }
  });
  const personal = await prisma.section.create({
    data: { resumeId: resume.id, kind: 'personal', order: 1 }
  });
  await prisma.entry.create({
    data: {
      sectionId: personal.id,
      title: { en: 'Full Name', so: 'Magaca oo buuxa' },
      body: { en: 'email@example.com · +1 555-5555 · City, Country', so: 'email@example.com · +252 xxx · Magaalo, Dalka' }
    }
  });
  return resume;
}

export default async function ResumesPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string;
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });

  async function createAction() {
    'use server';
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string;
    const resume = await createResume(userId);
    revalidatePath(`/${params.locale}/resumes`);
    return resume.slug;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your resumes</h1>
        <form action={async () => {
          const slug = await createAction();
          'use server';
        }}>
          <Button formAction={async () => {
            'use server';
          }} />
        </form>
        <form action={async () => {
          'use server';
        }}>
          <Button
            onClick={async () => {}}
            className="hidden"
          />
        </form>
        <form action={async () => {
          'use server';
        }}>
          <Button
            className="px-4 py-2"
            onClick={async () => {}}
          />
        </form>
      </div>

      <div className="mt-4">
        <form action={async () => {
          'use server';
        }}>
          <Button
            formAction={async () => {
              'use server';
            }}
            className="hidden"
          />
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <form action={async () => {
          'use server';
        }}>
          <Button className="hidden" />
        </form>

        <CreateResumeButton locale={params.locale} createResumeServerAction={createAction} />

        {resumes.map((r) => (
          <div key={r.id} className="border rounded-2xl p-4">
            <div className="text-sm text-slate-500">{r.slug}</div>
            <div className="font-medium text-slate-900">{(r.title as any).en}</div>
            <div className="mt-3 flex gap-2">
              <Link
                className="px-3 py-1.5 rounded-lg text-sm bg-brand-700 text-white"
                href={`/${params.locale}/resumes/${r.id}/edit`}
              >
                Edit
              </Link>
              <Link
                className="px-3 py-1.5 rounded-lg text-sm border"
                href={`/${params.locale}/r/${r.slug}`}
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateResumeButton({
  locale,
  createResumeServerAction
}: {
  locale: string;
  createResumeServerAction: () => Promise<string>;
}) {
  async function doCreate() {
    'use server';
  }
  return (
    <form
      action={async () => {
        'use server';
      }}
    >
      <a
        href="#"
        className="px-4 py-2 rounded-2xl bg-brand-700 text-white inline-block"
        onClick={async (e) => {
          e.preventDefault();
          // no-op in SSR
        }}
      >
        New resume
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            const btn = document.currentScript.previousElementSibling;
            btn.addEventListener('click', async (e) => {
              e.preventDefault();
              const res = await fetch('/api/resumes/create', { method: 'POST' });
              const { slug } = await res.json();
              window.location.href='/${locale}/resumes/'+slugIdToPath(slug);
            });
            function slugIdToPath(slug){return slug;}
          })();
        `
        }}
      />
    </form>
  );
}
