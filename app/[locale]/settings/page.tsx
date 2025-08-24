import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { createStripeCheckoutSession } from '@/payments/providers/StripeProvider';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });

  async function upgradeAction() {
    'use server';
    const session = await getServerSession(authOptions);
    const id = (session?.user as any)?.id as string;
    const res = await createStripeCheckoutSession({ userId: id });
    return res.url!;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="mt-4 border rounded-xl p-4">
        <div className="text-sm">Plan: <strong>{user?.subscription?.plan}</strong> ({user?.subscription?.status})</div>
        <form action={upgradeAction}>
          <Button type="submit" className="mt-3">Upgrade to Pro</Button>
        </form>
      </div>
      <div className="mt-6 border rounded-xl p-4">
        <h2 className="font-medium">EVC+ Mobile Money</h2>
        <EvcForm />
      </div>
    </div>
  );
}

function EvcForm() {
  return (
    <form action="" onSubmit={(e) => e.preventDefault()} className="mt-3 space-y-2">
      <div className="text-sm text-slate-600">Use EVC+ to activate Pro. You’ll receive a prompt on your phone.</div>
      <div className="flex gap-2">
        <input name="phone" placeholder="EVC+ phone" className="border rounded-xl px-3 py-2 text-sm" />
        <button
          className="px-4 py-2 rounded-xl bg-brand-700 text-white text-sm"
          onClick={async (e) => {
            e.preventDefault();
            const form = (e.currentTarget.parentElement as HTMLDivElement).parentElement as HTMLFormElement;
            const phone = (form.querySelector('input[name=phone]') as HTMLInputElement).value;
            const res = await fetch('/api/payments/evc/initiate', { method: 'POST', body: JSON.stringify({ phone }) });
            const data = await res.json();
            alert('Payment initiated: ' + data.referenceId + '. In sandbox, webhook will simulate success.');
          }}
        >
          Pay via EVC+
        </button>
      </div>
    </form>
  );
}
