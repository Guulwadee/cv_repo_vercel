import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Suspense } from 'react';

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale });
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <header className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <Link href={`/${params.locale}`} className="text-lg font-semibold text-brand-700">
          CV Builder
        </Link>
        <div className="flex items-center gap-3">
          <Link href={`/${params.locale}/pricing`} className="text-sm text-slate-600">
            {t('app.pricing')}
          </Link>
          <Link href={`/${params.locale}/auth/signin`} className="text-sm font-medium text-brand-700">
            {t('app.login')}
          </Link>
          <Suspense>
            <LocaleSwitcher />
          </Suspense>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
          {t('app.title')}
        </h1>
        <p className="mt-4 text-slate-600 text-lg">{t('app.subtitle')}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${params.locale}/resumes`}
            className="px-6 py-3 rounded-2xl bg-brand-700 text-white font-medium shadow-sm"
          >
            {t('app.start')}
          </Link>
          <Link
            href={`/${params.locale}/templates`}
            className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-medium"
          >
            {t('app.templates')}
          </Link>
        </div>
        <div className="mt-10 text-slate-500 text-sm">
          Free exports include watermark — upgrade to remove and unlock premium templates.
        </div>
      </section>
    </main>
  );
}
