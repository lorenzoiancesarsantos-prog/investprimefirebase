
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import { i18n } from '@/i18n';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-headline', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Invest Prime',
    template: `%s | Invest Prime`,
  },
  description: 'Sua plataforma de investimentos em royalties.',
  openGraph: {
    title: 'Invest Prime',
    description: 'Sua plataforma de investimentos em royalties.',
    url: siteUrl,
    siteName: 'Invest Prime',
    images: [
      {
        url: '/og-image.png', // Adapte para a imagem que você quer usar
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang ?? 'pt'} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable, playfair.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
