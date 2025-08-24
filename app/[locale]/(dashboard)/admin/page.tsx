import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== 'ADMIN') redirect('/en/resumes');

  const [users, resumes, payments] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.resume.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin</h1>
      <div>
        <h2 className="font-medium">Users ({users.length})</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {users.map((u) => (
            <div key={u.id} className="border rounded-xl p-3 text-sm">
              {u.email} · {u.role}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-medium">Resumes ({resumes.length})</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {resumes.map((r) => (
            <div key={r.id} className="border rounded-xl p-3 text-sm">
              {r.slug} · {r.template}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-medium">Payments ({payments.length})</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {payments.map((p) => (
            <div key={p.id} className="border rounded-xl p-3 text-sm">
              {p.provider} · {(p.amount/100).toFixed(2)} {p.currency} · {p.status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
