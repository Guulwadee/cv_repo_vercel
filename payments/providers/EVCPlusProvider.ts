import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export interface VerifiedEvent {
  type: 'payment.succeeded' | 'payment.failed';
  data: any;
}

export interface PaymentProvider {
  createPayment(params: {
    userId: string;
    amount: number;
    currency: string;
    metadata?: any;
    phone?: string;
  }): Promise<{ checkoutUrl?: string; referenceId: string }>;
  verifyWebhook(req: Request, rawBody: Buffer): Promise<VerifiedEvent>;
}

export class EVCPlusProvider implements PaymentProvider {
  async createPayment({
    userId,
    amount,
    currency,
    metadata,
    phone
  }: {
    userId: string;
    amount: number;
    currency: string;
    metadata?: any;
    phone?: string;
  }) {
    const sandbox = !process.env.EVCPLUS_API_BASE || !process.env.EVCPLUS_API_KEY;
    const referenceId = `evc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await prisma.payment.create({
      data: {
        userId,
        amount,
        currency,
        provider: 'evcplus',
        providerId: referenceId,
        status: sandbox ? 'pending' : 'pending',
        metadata: { phone, ...(metadata || {}) }
      }
    });

    if (sandbox) {
      // simulate async success after short delay via webhook instruction in README
      return { referenceId, checkoutUrl: undefined };
    }

    // Example call (placeholder, provider-specific fields omitted)
    // await fetch(`${process.env.EVCPLUS_API_BASE}/payments`, { ... })

    return { referenceId, checkoutUrl: undefined };
  }

  async verifyWebhook(req: Request, rawBody: Buffer): Promise<VerifiedEvent> {
    // Verify signature if configured, else accept sandbox
    const secret = process.env.EVCPLUS_WEBHOOK_SECRET;
    if (secret) {
      const signature = (req.headers.get('x-evc-signature') || '').toString();
      const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      if (digest !== signature) {
        throw new Error('Invalid EVC+ signature');
      }
    }
    const body = JSON.parse(rawBody.toString());
    // Expect body: { referenceId, status: 'succeeded'|'failed', amount, currency, userId }
    const type: VerifiedEvent['type'] =
      body.status === 'succeeded' ? 'payment.succeeded' : 'payment.failed';
    return { type, data: body };
  }
}

export async function activateProForUser(userId: string, providerRef: string, payment: any) {
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan: 'PRO',
      provider: 'evcplus',
      providerRef,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    },
    create: {
      userId,
      plan: 'PRO',
      provider: 'evcplus',
      providerRef,
      status: 'active'
    }
  });
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'succeeded' }
  });
}
