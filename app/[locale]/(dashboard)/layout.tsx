import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${params.locale}/auth/signin`);
  const t = await getTranslations({ locale: params.locale });
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/${params.locale}/resumes`} className="font-semibold text-brand-700">
              {t('app.dashboard')}
            </Link>
            <Link href={`/${params.locale}/settings`} className="text-slate-600">
              Settings
            </Link>
            <Link href={`/${params.locale}/admin`} className="text-slate-600">
              Admin
            </Link>
          </div>
          <LocaleSwitcher />
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-6">{children}</div>
    </div>
  );
}
