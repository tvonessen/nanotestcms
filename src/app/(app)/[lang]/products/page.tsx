import ProductCard from '@/components/partials/product-card';
import { LazyIcon } from '@/components/utility/lazy-icon';
import type { Solution, SolutionCategory } from '@/payload-types';
import config from '@payload-config';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Fragment } from 'react';

export default async function ServicesPage() {
  const payload = await getPayload({ config });
  const services: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        type: { equals: 'product' },
      },
      pagination: false,
      overrideAccess: false,
    })
    .then((res) => res.docs);

  const categories: SolutionCategory[] = await payload
    .find({
      collection: 'solution-categories',
      pagination: false,
      overrideAccess: false,
      sort: 'position',
    })
    .then((res) => res.docs);

  if (!services.length || !categories.length) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4">
      <div className="my-16 max-w-[80ch] mx-auto" key="services-page-header">
        <h1 className="text-4xl font-bold mt-8">Our products</h1>
        <p className="text-lg my-4">
          We design and build our measurement systems to match up to latest challenges and needs in
          electronics development. And we refine them continuously. With many years of experience in
          the field we profit from a large partner and customer network that allows us to discover
          trends early and to adapt our solutions lineup timely and efficiently.
        </p>
        <p className="text-lg my-4">
          All our products are designed and manufactured in Germany. We are proud to be a part of
          the German engineering tradition and to contribute to the success of our customers with
          our high-quality products.
        </p>
        <p className="text-lg my-4">
          We are happy to support you in your projects and to help you find the right solution for
          your needs. Please do not hesitate to{' '}
          <Link
            className="text-primary underline hover:decoration-[3px] focus:no-underline hover:decoration-focus outline-offset-1 focus:rounded-md"
            href="/contact"
          >
            contact us
          </Link>{' '}
          if you have any questions or if you would like to discuss your project with us.
        </p>
      </div>

      {categories
        .filter(({ id }) =>
          services.some((service) =>
            service.category.some((category) => (category.value as SolutionCategory).id === id),
          ),
        )
        .map((category) => {
          return (
            <Fragment key={category.title}>
              <div
                key={`${category.title}-header`}
                className="w-[calc(100%_-_1rem)] relative mt-24 mb-8 px-2 py-4 rounded bg-foreground before:absolute before:-left-4 before:top-0 before:w-2 before:bg-primary before:rounded before:h-full translate-x-4"
              >
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-semibold text-background flex items-center"
                  id={category.title.replaceAll(' ', '-').toLowerCase()}
                >
                  <LazyIcon
                    name={category.categoryIcon as string}
                    className="w-fit px-1 text-4xl select-none"
                  />
                  {category.title}
                </h2>
              </div>
              <div
                key={`${category.title}-body`}
                className="flex flex-wrap justify-center gap-8 px-0 sm:px-4"
              >
                {services
                  .filter((service) =>
                    service.category.some(
                      ({ value }) => (value as SolutionCategory).id === category.id,
                    ),
                  )
                  .map((service) => (
                    <ProductCard
                      key={service.slug}
                      className="flex-auto lg:flex-[0_0_calc(50%_-_2rem)] xl:flex-[0_0_calc(33.3333%_-_4rem)]"
                      product={service}
                    />
                  ))}
              </div>
            </Fragment>
          );
        })}
    </div>
  );
}
