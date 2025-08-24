import '../globals.css';
import { NextIntlClientProvider, getMessages } from 'next-intl';
import { Inter, Noto_Serif } from 'next/font/google';
import { Analytics } from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const noto = Noto_Serif({ subsets: ['latin'], variable: '--font-noto' });

export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${noto.variable} font-sans bg-white text-slate-900`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
