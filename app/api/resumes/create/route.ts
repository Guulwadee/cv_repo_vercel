import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
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

  return NextResponse.json({ id: resume.id, slug: resume.slug });
}
