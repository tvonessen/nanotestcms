import { cn } from '@heroui/react';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import Carousel from '@/components/carousel/carousel';
import ContactForm from '@/components/content/contact-form/contact-form';
import Downloads from '@/components/content/downloads/downloads';
import Features from '@/components/content/features';
import Highlight from '@/components/content/highlight';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import type { Config, Media, Solution } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';
import { resolveAutoAlignment } from '@/utils/resolve-auto-alignment';

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
          {resolveAutoAlignment(service.details.content ?? []).map((item) => {
            switch (item.blockType) {
              case 'text':
                return <Text key={item.id} {...item} />;
              case 'text-image':
                return <TextImage key={item.id} {...item} />;
              case 'highlight':
                return <Highlight lang={lang} key={item.id} highlight={item} />;
              case 'text-video':
                return <TextVideo key={item.id} {...item} />;
              case 'contact-form':
                return (
                  <ContactForm
                    key={item.id}
                    className="max-lg:w-screen lg:w-full relative max-lg:left-1/2 max-lg:-translate-x-[50%] mx-auto my-12 col-span-full bg-foreground/5 px-12 py-12 lg:rounded-lg"
                    to={item.to}
                    defaultValues={{ subject: item.subject ?? `Inquiry about ${service.title}` }}
                  />
                );
              case 'features':
                return <Features features={item} key={item.id} />;
              case 'downloads':
                return <Downloads key={item.id} docs={item.docs} />;
              default:
                return null;
            }
          })}
        </article>
      </div>
    </main>
  );
}
