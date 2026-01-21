import type { Metadata } from 'next';

import '@/styles/globals.css';
import Loading from '@/app/(app)/[lang]/loading';
import { Providers } from '@/app/(app)/[lang]/providers';
import Footer from '@/components/footer/footer';
import { Navbar } from '@/components/navigation/navbar';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/routes';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: process.env.NODE_ENV === 'production' ? '/img/favicon.svg' : '/img/favicon-dev.svg',
  },
};

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>{siteConfig.title}</title>
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.className}`}>
        <Providers>
          <Navbar />
          <div className="min-h-[calc(100dvh-10rem)] dark">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
          <Footer lang={lang} />
        </Providers>
      </body>
    </html>
  );
}
