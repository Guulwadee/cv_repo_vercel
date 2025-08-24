import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { renderEmail, VerificationEmail } from '@/lib/emails';
import { sendEmail } from '@/lib/mailer';
import crypto from 'crypto';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email in use' }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'USER'
    }
  });

  // Create verification token and email
  const token = crypto.randomBytes(24).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  });
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/en/auth/verify?token=${token}&email=${encodeURIComponent(
    email,
  )}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    html: renderEmail(<VerificationEmail name={name} verifyUrl={verifyUrl} />)
  } as any);

  return NextResponse.json({ ok: true, userId: user.id });
}
