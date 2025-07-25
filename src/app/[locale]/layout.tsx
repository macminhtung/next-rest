import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { ReactQueryProvider } from '@/react-query/Provider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ClientLayout } from '@/app/[locale]/client-layout';

import './globals.css';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '[MMT] NextJs',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={geist.className} suppressHydrationWarning>
      <body className='relative' suppressHydrationWarning>
        <Toaster position='top-right' />
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute='class'>
              <ClientLayout>{children}</ClientLayout>
            </ThemeProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
