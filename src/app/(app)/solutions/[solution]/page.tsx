// Next.js will invalidate the cache when a

import Carousel from '@/components/carousel/Carousel';
import ContactForm from '@/components/content/ContactForm';
import Highlight from '@/components/content/Highlight';
import Text from '@/components/content/Text';
import TextImage from '@/components/content/TextImage';
import TextVideo from '@/components/content/TextVideo';
import type { Media, Solution } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { type PaginatedDocs, getPayload } from 'payload';

// export const revalidate = 0;

// We'll prerender only the params from `generateStaticParams` at build time.
// export const dynamicParams = false; // false, to 404 on unknown paths

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
    })
    .then((res) => res.docs[0]);

  if (!solution) {
    return notFound();
  }

  return (
    <main>
      <div className="container mx-auto" key="solution-content">
        <Carousel images={solution.details.images as Media[]} />
        <article
          key={solution.title ?? `solution-${solution.title ?? 'unknown'}`}
          className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto"
        >
          {/* Abstract section */}
          <section className="col-span-12 lg:col-span-5 xl:col-span-4">
            <h1 className="text-5xl mt-6 leading-none font-black">{solution.title}</h1>
            <p className="text-lg mt-4 text-primary">{solution.subtitle}</p>
            <p className="my-6 font-medium text-lg">{solution.details.abstract}</p>
          </section>
          {/* Content section */}
          {solution.details.content?.map((item, i) => {
            switch (item.blockType) {
              case 'text':
                return <Text text={item.text_html as string} />;
              case 'text-image':
                return <TextImage text={item.text_html as string} image={item.image as Media} />;
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
                return (
                  <TextVideo text={item.text_html as string} videoId={item.videoId as string} />
                );
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
  );
};

export default SolutionPage;
