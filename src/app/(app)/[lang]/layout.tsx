import type { Metadata } from 'next';

import '@/styles/globals.css';
import { cn } from '@heroui/react';
import config from '@payload-config';
import { getPayload } from 'payload';
import { Suspense } from 'react';
import Loading from '@/app/(app)/[lang]/loading';
import { Providers } from '@/app/(app)/[lang]/providers';
import Footer from '@/components/footer/footer';
import { Navbar } from '@/components/navigation/navbar';
import { AdminBar } from '@/components/utility/AdminBar';
import { RefreshRouteOnSave } from '@/components/utility/RefreshRouteOnSave';
import { fontSans } from '@/config/fonts';
import { type NavItem, siteConfig } from '@/config/siteconfig';
import type { Config, Page } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

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

async function getNavItems(lang: Config['locale']): Promise<NavItem[]> {
  const payload = await getPayload({ config });

  const staticItems: NavItem[] = [{ label: { en: 'Home', de: 'Start' }, href: '/' }];

  const pages = await payload.find({
    collection: 'pages',
    where: { parent: { exists: false } },
    sort: 'title',
    pagination: false,
    depth: 0,
    locale: lang,
  });

  const pageItems: NavItem[] = pages.docs.map((page: Page) => ({
    label: { [lang]: page.title } as Record<Config['locale'], string>,
    href: page.url ?? `/${page.slug}`,
  }));

  const trailingItems: NavItem[] = [
    { label: { en: 'Contact us', de: 'Kontakt' }, href: '/contact' },
    { label: { en: 'About', de: 'Über uns' }, href: '/about' },
  ];

  return [...staticItems, ...pageItems, ...trailingItems];
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const isDraft = await isPreviewEnabled();
  const navItems = await getNavItems(lang as Config['locale']);
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>{siteConfig.title}</title>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overflow-x-hidden',
          fontSans.className,
        )}
      >
        <Providers>
          <AdminBar preview={isDraft} />
          <RefreshRouteOnSave />
          <Navbar navItems={navItems} />
          <div className="min-h-[calc(100dvh-10rem)]">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
          <Footer lang={lang} />
        </Providers>
      </body>
    </html>
  );
}
