// Test-only endpoint used by e2e to mark a user verified
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'test' && process.env.CI !== 'true') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 404 });
  }
  const { email } = await req.json();
  await prisma.user.updateMany({
    where: { email },
    data: { emailVerified: new Date() }
  });
  return NextResponse.json({ ok: true });
}
