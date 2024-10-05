// Next.js will invalidate the cache when a

import { getPayload, PaginatedDocs } from 'payload';
import config from '@payload-config';
import { Media, Solution } from '@/payload-types';
import Carousel from '@/components/carousel/Carousel';
import Content from '@/components/content/Content';

// request comes in, at most once every 5 minutes.
export const revalidate = 300;

// We'll prerender only the params from `generateStaticParams` at build time.
export const dynamicParams = false; // false, to 404 on unknown paths

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  let solutions: PaginatedDocs<Solution> = await payload.find({
    collection: 'solutions',
    pagination: false,
    depth: 0,
  });

  return solutions.docs.map((solution) => solution.slug);
}

const SolutionPage = async ({ params }: { params: { solution: string } }) => {
  const payload = await getPayload({ config });
  const solution: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: params.solution } },
    })
    .then((res) => res.docs[0]);

  if (!solution) {
    return null;
  }

  return (
    <main className="container mx-auto">
      <Carousel images={solution.details.images as Media[]} />
      <div className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {/* Abstract section */}
        <section className="col-span-12 lg:col-span-5 xl:col-span-4">
          <h1 className="text-5xl mt-6 leading-none font-black">{solution.title}</h1>
          <p className="text-lg mt-4 text-primary">{solution.subtitle}</p>
          <p className="my-6 font-medium text-lg">{solution.details.abstract}</p>
        </section>
        {/* Content section */}
        {solution.details.content?.map((item, i) => <Content key={item.id} item={item} />)}
      </div>
    </main>
  );
};

export default SolutionPage;
