import { cn } from '@heroui/react';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import Hero from '@/components/content/hero';
import type { Config, Media, Solution } from '@/payload-types';
import { buildMetadata } from '@/utils/generateMeta';
import { isPreviewEnabled } from '@/utils/preview';

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const payload = await getPayload({ config });

  const solutions: Solution[] = await payload
    .find({
      collection: 'solutions',
      pagination: false,
      depth: 0,
      locale: lang as Config['locale'],
    })
    .then((res) => res.docs);

  return solutions.map((solution) => ({ slug: solution.slug }));
}

interface NTDetailProps {
  params: Promise<{
    slug: string;
    lang: Config['locale'];
  }>;
}

export async function generateMetadata({ params }: NTDetailProps) {
  const { slug, lang } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: slug } },
    locale: lang,
    depth: 1,
    limit: 1,
  });
  const solution = result.docs[0];
  return buildMetadata(
    solution?.meta,
    { title: solution?.title, description: solution?.subtitle },
    lang,
  );
}

export default async function NTDetailPage({ params }: NTDetailProps) {
  const { slug, lang } = await params;

  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const solution: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      draft: isDraft,
      overrideAccess: isDraft,
      locale: lang,
    })
    .then((res) => res.docs[0]);

  if (!solution) {
    return notFound();
  }

  const isProduct = solution.type.includes('product');

  return (
    <main>
      <div className="container mx-auto mb-24">
        {solution.details?.images?.length > 0 && (
          <Hero images={solution.details.images as Media[]} />
        )}
        <section
          className={cn(
            'sticky bottom-8 flex flex-row justify-start max-w-6xl',
            isProduct
              ? 'sm:mx-4 xl:mx-20 2xl:mx-52 lg:-mt-24'
              : 'sm:mx-4 lg:mx-6 xl:mx-16 2xl:mx-48 mt-2 lg:-mt-16',
          )}
        >
          <div
            className={cn(
              'w-full lg:w-auto flex flex-col items-start z-30 p-4',
              'sm:rounded-xl bg-background/80 backdrop-blur-xs',
              isProduct
                ? 'lg:min-w-[calc(5/12*(100%-11*2rem)+4*2rem)] xl:min-w-[calc(4/12*(100%-11*2rem)+3*2rem)] shadow-xl'
                : 'lg:drop-shadow-sm',
            )}
          >
            <h1 className="inline-block text-5xl leading-none font-black">{solution.title}</h1>
            <p
              className={cn(
                'inline-block text-lg mt-4',
                isProduct ? 'text-secondary' : 'text-primary',
              )}
            >
              {solution.subtitle}
            </p>
          </div>
        </section>
        <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
          <Content lang={lang} blocks={solution.details.content} />
        </article>
      </div>
    </main>
  );
}
