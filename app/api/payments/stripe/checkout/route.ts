import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStripeCheckoutSession } from '@/payments/providers/StripeProvider';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { url } = await createStripeCheckoutSession({ userId: (session.user as any).id });
  return NextResponse.json({ url });
}
