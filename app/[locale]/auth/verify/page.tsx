import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function VerifyPage({
  searchParams
}: {
  searchParams: { token?: string; email?: string };
}) {
  const token = searchParams.token;
  const email = searchParams.email;
  if (!token || !email) redirect('/en/auth/signin');

  const vt = await prisma.verificationToken.findUnique({ where: { token } });
  if (!vt || vt.identifier !== email || vt.expires < new Date()) {
    return <div className="min-h-screen grid place-items-center">Invalid or expired token.</div>;
  }
  await prisma.user.update({
    where: { email: email },
    data: { emailVerified: new Date() }
  });
  await prisma.verificationToken.delete({ where: { token } });
  redirect('/en/auth/signin?verified=1');
}
