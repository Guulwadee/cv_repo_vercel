import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Modern from '@/templates/Modern';
import Creative from '@/templates/Creative';
import Classic from '@/templates/Classic';
import Professional from '@/templates/Professional';
import Minimalist from '@/templates/Minimalist';
import { limit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rate = await limit(`pdf:${(session.user as any).id}`, 5, 10_000);
  if (!rate.success) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });

  const { resumeId, template, mode } = await req.json();

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: (session.user as any).id },
    include: { sections: { include: { entries: true }, orderBy: { order: 'asc' } } }
  });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const sub = await prisma.subscription.findUnique({ where: { userId: (session.user as any).id } });
  const isPro = sub?.plan === 'PRO' && sub.status === 'active';

  const dto = {
    id: resume.id,
    title: resume.title as any,
    template: template || resume.template,
    theme: resume.theme,
    locale: (resume.locale as 'en' | 'so') || 'en',
    watermark: isPro ? false : true,
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
  };

  if (process.env.DISABLE_PDF === 'true') {
    const dummy = Buffer.from('%PDF-1.4\n%…', 'utf8');
    return new NextResponse(dummy, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${resume.slug}-${mode}.pdf"`
      }
    });
  }

  const Component =
    dto.template === 'CREATIVE'
      ? Creative
      : dto.template === 'CLASSIC'
      ? Classic
      : dto.template === 'PROFESSIONAL'
      ? Professional
      : dto.template === 'MINIMALIST'
      ? Minimalist
      : Modern;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${process.env.NEXT_PUBLIC_APP_URL}/pdf/print.css" />
<style> body { font-family: Inter, Arial, sans-serif; } </style>
</head>
<body>
<div id="root">${ReactDOMServer.renderToString(React.createElement(Component as any, { resume: dto as any, exportMode: mode }))}</div>
</body>
</html>`;

  const exePath =
    process.env.VERCEL ? await chromium.executablePath() : undefined;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 1.2 },
    executablePath: exePath,
    headless: true
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({
    format: 'A4',
    margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
    printBackground: true
  });
  await browser.close();

  const filename = `${((resume.title as any).en || 'resume')}-${dto.template}-${mode}.pdf`
    .toLowerCase()
    .replace(/\s+/g, '-');

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
