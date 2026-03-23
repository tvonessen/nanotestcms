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

  // Fetch all pages and published solutions in parallel
  const [allPages, allSolutions] = await Promise.all([
    payload.find({
      collection: 'pages',
      sort: 'title',
      pagination: false,
      depth: 0,
      locale: lang,
    }),
    payload.find({
      collection: 'solutions',
      sort: 'title',
      pagination: false,
      depth: 0,
      locale: lang,
      where: { _status: { equals: 'published' } },
    }),
  ]);

  const solutionMap = new Map(allSolutions.docs.map((s) => [s.id, s]));

  function extractSolutions(page: Page): NavItem[] | undefined {
    const solutions: NavItem[] = [];
    const seenIds = new Set<string>();

    for (const block of page.content ?? []) {
      if (block.blockType !== 'cards') continue;

      if (block.source === 'solutions' && block.solutionsFields?.cards) {
        for (const card of block.solutionsFields.cards) {
          const id = typeof card === 'string' ? card : card.id;
          const sol = solutionMap.get(id);
          if (sol?.slug && !seenIds.has(id)) {
            seenIds.add(id);
            solutions.push({
              label: { [lang]: sol.title } as Record<Config['locale'], string>,
              href: `/nt/${sol.slug}`,
            });
          }
        }
      }

      if (block.source === 'category' && block.categoryFields) {
        const catId =
          typeof block.categoryFields.category === 'string'
            ? block.categoryFields.category
            : block.categoryFields.category?.id;
        const types = block.categoryFields.types ?? [];

        if (catId) {
          for (const [solId, sol] of solutionMap) {
            if (!sol.slug || seenIds.has(solId)) continue;
            const matchesCat = sol.category?.some((c) => {
              const cid = typeof c.value === 'string' ? c.value : c.value?.id;
              return cid === catId;
            });
            const matchesType = sol.type?.some((t) => types.includes(t));
            if (matchesCat && matchesType) {
              seenIds.add(solId);
              solutions.push({
                label: { [lang]: sol.title } as Record<Config['locale'], string>,
                href: `/nt/${sol.slug}`,
              });
            }
          }
        }
      }
    }

    return solutions.length > 0 ? solutions : undefined;
  }

  function buildChildren(parentId: string): NavItem[] {
    return allPages.docs
      .filter((p) => {
        const pid = typeof p.parent === 'string' ? p.parent : p.parent?.id;
        return pid === parentId;
      })
      .map((p) => {
        const item: NavItem = {
          label: { [lang]: p.title } as Record<Config['locale'], string>,
          href: p.url ?? `/${p.slug}`,
        };
        const sols = extractSolutions(p);
        if (sols) item.solutions = sols;
        return item;
      });
  }

  const pageItems: NavItem[] = allPages.docs
    .filter((p) => !p.parent)
    .map((page: Page) => {
      const item: NavItem = {
        label: { [lang]: page.title } as Record<Config['locale'], string>,
        href: page.url ?? `/${page.slug}`,
      };
      const kids = buildChildren(page.id);
      if (kids.length > 0) item.children = kids;
      const sols = extractSolutions(page);
      if (sols) item.solutions = sols;
      return item;
    });

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
