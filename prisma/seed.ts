import { PrismaClient, TemplateKey, Visibility, Plan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Demo user
  const email = 'demo@example.com';
  const password = 'demo1234';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Demo User',
      emailVerified: new Date(),
      passwordHash,
      role: 'USER'
    }
  });

  // Subscription FREE
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: 'FREE',
      status: 'inactive'
    }
  });

  // Resume with bilingual content
  const resume = await prisma.resume.upsert({
    where: { slug: 'demo-resume' },
    update: {},
    create: {
      userId: user.id,
      slug: 'demo-resume',
      title: { en: 'Product Manager Resume', so: 'CV Maareeye Alaab' },
      template: TemplateKey.MODERN,
      theme: { primary: '#1d4ed8', font: 'Inter' },
      locale: 'en',
      visibility: Visibility.PRIVATE,
      watermark: true
    }
  });

  // Sections + entries
  const personal = await prisma.section.create({
    data: { resumeId: resume.id, kind: 'personal', order: 1 }
  });
  await prisma.entry.create({
    data: {
      sectionId: personal.id,
      title: { en: 'Demo User', so: 'Isticmaale Tijaabo' },
      subtitle: { en: 'Product Manager', so: 'Maareeye Alaab' },
      body: {
        en: 'demo@example.com · +1 555 123 4567 · Nairobi, KE',
        so: 'demo@example.com · +254 555 123 4567 · Nairobi, KE'
      },
      meta: { links: [{ label: 'GitHub', url: 'https://github.com' }] }
    }
  });

  const summary = await prisma.section.create({
    data: { resumeId: resume.id, kind: 'summary', order: 2 }
  });
  await prisma.entry.create({
    data: {
      sectionId: summary.id,
      body: {
        en: 'Experienced PM with 7+ years delivering impactful products.',
        so: 'PM khibrad leh 7+ sano oo keenay alaabooyin guul leh.'
      }
    }
  });

  const exp = await prisma.section.create({
    data: { resumeId: resume.id, kind: 'experience', order: 3 }
  });
  await prisma.entry.create({
    data: {
      sectionId: exp.id,
      title: { en: 'Senior PM', so: 'Maareeye Sare' },
      subtitle: { en: 'Tech Corp', so: 'Tech Corp' },
      body: {
        en: 'Led cross-functional team to increase ARR by 25%.',
        so: 'Hogaamiyay koox iskutallaab ah oo kordhisay ARR 25%.'
      },
      startDate: new Date('2021-01-01'),
      ongoing: true
    }
  });

  const education = await prisma.section.create({
    data: { resumeId: resume.id, kind: 'education', order: 4 }
  });
  await prisma.entry.create({
    data: {
      sectionId: education.id,
      title: { en: 'BSc Computer Science', so: 'BSc Sayniska Kombuyuutarka' },
      subtitle: { en: 'University of Nairobi', so: 'Jaamacadda Nairobi' },
      startDate: new Date('2013-01-01'),
      endDate: new Date('2017-01-01')
    }
  });

  const skills = await prisma.section.create({
    data: { resumeId: resume.id, kind: 'skills', order: 5 }
  });
  await prisma.entry.create({
    data: {
      sectionId: skills.id,
      meta: {
        chips: [
          { en: 'Product Strategy', so: 'Istaraatiijiyadda Alaabta' },
          { en: 'Roadmapping', so: 'Khariidaynta' },
          { en: 'User Research', so: 'Cilmi Baarista Isticmaalaha' }
        ]
      }
    }
  });

  console.log('Seed complete. Demo credentials:', { email, password });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
