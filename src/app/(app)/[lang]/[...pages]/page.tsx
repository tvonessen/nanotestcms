import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import { locales } from '@/config/locales';
import type { Config, Page as PageType } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const params: { lang: Config['locale']; pages: string[] }[] = [];

  for (const { code } of locales) {
    const allPages = await payload.find({
      collection: 'pages',
      pagination: false,
      depth: 0,
      locale: code as Config['locale'],
      where: { _status: { equals: 'published' } },
    });

    allPages.docs
      .filter((page: PageType) => page.url && page.url.length > 1)
      .forEach((page: PageType) => {
        params.push({
          lang: code as Config['locale'],
          pages: page.url!.split('/').filter(Boolean),
        });
      });
  }
  return params;
}

interface PagesRouteProps {
  params: Promise<{
    lang: Config['locale'];
    pages: string[];
  }>;
}

export default async function PagesRoute({ params }: PagesRouteProps) {
  const { lang, pages: segments } = await params;
  const requestedPath = `/${segments.join('/')}`;

  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();

  const result = await payload.find({
    collection: 'pages',
    locale: lang,
    draft: isDraft,
    overrideAccess: isDraft,
    where: isDraft
      ? { url: { equals: requestedPath } }
      : {
          url: { equals: requestedPath },
          _status: { equals: 'published' },
        },
    depth: 1,
    limit: 1,
  });

  const page = result.docs[0];
  if (!page) return notFound();

  return (
    <main>
      <div className="container mx-auto mb-24">
        <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
          <Content lang={lang} blocks={page.content} />
        </article>
      </div>
    </main>
  );
}
