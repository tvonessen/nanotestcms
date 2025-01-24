// Next.js will invalidate the cache when a

import Carousel from '@/components/carousel/carousel';
import ContactForm from '@/components/content/contact-form';
import Highlight from '@/components/content/highlight';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import { RefreshRouteOnSave } from '@/components/utility/RefreshRouteOnSave';
import type { Media, Solution } from '@/payload-types';
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { type PaginatedDocs, getPayload } from 'payload';
import { Fragment } from 'react';

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const solutions: PaginatedDocs<Solution> = await payload.find({
    collection: 'solutions',
    where: {
      'type.category': { equals: 'product' },
    },
    pagination: false,
    depth: 0,
  });

  return solutions.docs.map((solution) => ({ solution: solution.slug }));
}

const SolutionPage = async ({ params }: { params: Promise<{ solution: string }> }) => {
  const { solution: slug } = await params;
  const payload = await getPayload({ config });
  const solution: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    .then((res) => res.docs[0]);

  if (!solution) {
    return notFound();
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <main>
        <div className="container mx-auto" key="solution-content">
          {solution.details?.images?.length > 0 && (
            <Carousel images={solution.details.images as Media[]} />
          )}
          <article
            key={solution.title ?? `solution-${solution.title ?? 'unknown'}`}
            className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto"
          >
            {/* Abstract section */}
            <section className="abstract col-span-12 lg:col-span-5 xl:col-span-4">
              <h1 className="text-5xl mt-6 leading-none font-black">{solution.title}</h1>
              <p className="text-lg mt-4 text-primary">{solution.subtitle}</p>
              <p className="my-6 font-medium text-lg">{solution.details.abstract}</p>
            </section>
            {/* Content section */}
            {solution.details.content?.map((item, i) => {
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
            defaultValues={{ subject: `Inquiry about ${solution.title}` }}
          />
        </div>
      </main>
    </Fragment>
  );
};

export default SolutionPage;
