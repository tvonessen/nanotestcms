// Next.js will invalidate the cache when a

import Carousel from '@/components/carousel/carousel';
import ContactForm from '@/components/content/contact-form';
import Highlight from '@/components/content/highlight';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import type { Media, Solution } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const services: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        'type.type': { equals: 'service' },
      },
      pagination: false,
      depth: 0,
    })
    .then((res) => res.docs);

  return services.map((service) => ({ service: service.slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;

  const payload = await getPayload({ config });
  const service: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    .then((res) => res.docs[0]);

  if (!service) {
    return notFound();
  }

  return (
    <React.Fragment>
      <main>
        <div className="container mx-auto">
          {service.details?.images?.length > 0 && (
            <Carousel images={service.details.images as Media[]} />
          )}
          <article
            key={service.title ?? `service-${service.title ?? 'unknown'}`}
            className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto"
          >
            {/* Abstract section */}
            <section className="abstract col-span-12 lg:col-span-5 xl:col-span-4">
              <h1 className="text-5xl mt-6 leading-none font-black">{service.title}</h1>
              <p className="text-lg mt-4 text-primary">{service.subtitle}</p>
              <p className="my-6 font-medium text-lg">{service.details.abstract}</p>
            </section>
            {/* Content section */}
            {service.details.content?.map((item, i) => {
              switch (item.blockType) {
                case 'text':
                  return <Text text={item.text} />;
                case 'text-image':
                  return <TextImage text={item.text} image={item.image as Media} />;
                case 'highlight':
                  return (
                    <Highlight
                      title={item.title}
                      text={item.text}
                      link={item.link}
                      variant={item.variant}
                    />
                  );
                case 'text-video':
                  return <TextVideo text={item.text} videoId={item.videoId as string} />;
                default:
                  return null;
              }
            })}
          </article>
        </div>

        <div
          key="contact-form"
          className="px-12 my-12 py-12 bg-opacity-5 mx-auto bg-foreground max-xl:w-full xl:max-w-6xl xl:rounded-lg"
        >
          <ContactForm
            className="container mx-auto"
            defaultValues={{ subject: `Inquiry about ${service.title}` }}
          />
        </div>
      </main>
    </React.Fragment>
  );
}
