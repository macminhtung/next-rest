import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '[MMT] NextJs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
