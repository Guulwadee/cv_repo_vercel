import { NextResponse } from 'next/server';
import { EVCPlusProvider, activateProForUser } from '@/payments/providers/EVCPlusProvider';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const raw = Buffer.from(await req.arrayBuffer());
  const provider = new EVCPlusProvider();
  try {
    const evt = await provider.verifyWebhook(req, raw);
    if (evt.type === 'payment.succeeded') {
      const { referenceId, userId } = evt.data;
      const payment = await prisma.payment.findFirst({
        where: { provider: 'evcplus', providerId: referenceId }
      });
      if (!payment) throw new Error('Payment not found');
      await activateProForUser(userId, referenceId, payment);
    }
    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
