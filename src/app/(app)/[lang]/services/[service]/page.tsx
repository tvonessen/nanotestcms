import { cn } from '@heroui/react';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import Carousel from '@/components/carousel/carousel';
import { Content } from '@/components/content/content';
import type { Config, Media, Solution } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export async function generateStaticParams(props: { params: { lang: string; service: string } }) {
  const { lang } = props.params;
  const payload = await getPayload({ config });
  const services: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        type: { equals: 'service' },
      },
      pagination: false,
      depth: 0,
      locale: lang as Config['locale'],
    })
    .then((res) => res.docs);

  return services.map((service) => ({ service: service.slug }));
}

interface ServicePageProps {
  params: Promise<{
    service: string;
    lang: Config['locale'];
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug, lang } = await params;

  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const service: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      draft: isDraft,
      overrideAccess: isDraft,
      locale: lang,
    })
    .then((res) => res.docs[0]);

  if (!service) {
    return notFound();
  }

  return (
    <main>
      <div className="container mx-auto mb-24">
        {service.details?.images?.length > 0 && (
          <Carousel images={service.details.images as Media[]} />
        )}
        <section className="sm:mx-4 lg:mx-6 xl:mx-16 2xl:mx-48 mt-2 lg:-mt-16 sticky bottom-8 flex flex-row justify-start">
          <div
            className={cn(
              'w-full lg:w-auto flex flex-col items-start z-30 p-4',
              'sm:rounded-xl bg-background/80 backdrop-blur-xs lg:drop-shadow-sm',
            )}
          >
            <h1 className="inline-block text-5xl leading-none font-black">{service.title}</h1>
            <p className="inline-block text-lg mt-4 text-primary">{service.subtitle}</p>
          </div>
        </section>
        <article
          key={service.title ?? `service-${service.title ?? 'unknown'}`}
          className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto"
        >
          <Content lang={lang} blocks={service.details.content} />
        </article>
      </div>
    </main>
  );
}
