import { NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/payments/providers/StripeProvider';

export async function POST(req: Request) {
  const raw = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get('stripe-signature') || undefined;
  try {
    const res = await handleStripeWebhook(raw, sig);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
