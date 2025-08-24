import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import { renderEmail, ReceiptEmail } from '@/lib/emails';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
  typescript: true
});

export async function createStripeCheckoutSession({
  userId
}: {
  userId: string;
}): Promise<{ url: string | null; id: string }> {
  if (!process.env.STRIPE_PRICE_PRO_MONTH) {
    throw new Error('Stripe not configured');
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.email,
    line_items: [{ price: process.env.STRIPE_PRICE_PRO_MONTH!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/settings?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/settings?checkout=cancel`,
    metadata: { userId }
  });
  return { url: session.url, id: session.id };
}

export async function handleStripeWebhook(rawBody: Buffer, sig: string | undefined) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Missing Stripe webhook secret');
  const event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET);
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: 'PRO',
          provider: 'stripe',
          providerRef: session.customer?.toString() || '',
          status: 'active',
          currentPeriodEnd: new Date(
            (session.expires_at ? session.expires_at : Math.floor(Date.now() / 1000) + 30 * 24 * 3600) *
              1000,
          )
        },
        create: {
          userId,
          plan: 'PRO',
          provider: 'stripe',
          providerRef: session.customer?.toString() || '',
          status: 'active'
        }
      });
      await prisma.payment.create({
        data: {
          userId,
          amount: (session.amount_total ?? 0),
          currency: (session.currency ?? 'usd').toUpperCase(),
          provider: 'stripe',
          providerId: session.id,
          status: 'succeeded',
          metadata: session as any
        }
      });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await sendEmail({
          to: user.email,
          subject: 'Your Pro subscription is active',
          html: renderEmail(
            <ReceiptEmail
              name={user.name}
              amount={session.amount_total ?? 0}
              currency={(session.currency ?? 'usd').toUpperCase()}
            />,
          )
        } as any);
      }
      break;
    }
    default:
      break;
  }
  return { received: true };
}
