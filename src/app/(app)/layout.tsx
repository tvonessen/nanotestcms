import type { Metadata } from 'next';

import '@/styles/globals.css';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/routes';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.className}`}>
        {children}
      </body>
    </html>
  );
}
