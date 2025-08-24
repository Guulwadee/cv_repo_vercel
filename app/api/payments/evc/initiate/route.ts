import { NextResponse } from 'next/server';
import { EVCPlusProvider } from '@/payments/providers/EVCPlusProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const phone = body.phone as string | undefined;

  const provider = new EVCPlusProvider();
  const { referenceId, checkoutUrl } = await provider.createPayment({
    userId: (session.user as any).id,
    amount: 500, // SOS cents or config
    currency: process.env.EVCPLUS_CURRENCY || 'SOS',
    metadata: {},
    phone
  });

  // In sandbox, instruct user that webhook will simulate success
  return NextResponse.json({ referenceId, checkoutUrl });
}
