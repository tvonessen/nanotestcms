import ProductCard from '@/components/partials/product-card';
import { LazyIcon } from '@/components/utility/lazy-icon';
import type { Solution, SolutionCategory } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Fragment } from 'react';

export default async function ServicesPage() {
  const payload = await getPayload({ config });
  const services: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        'type.type': { equals: 'service' },
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
    })
    .then((res) => res.docs);

  if (!services.length || !categories.length) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4">
      <div className="my-16" key="services-page-header">
        <h1 className="text-4xl font-bold mt-8">Our services</h1>
        <p className="text-lg mt-4">
          Nanotest offers a wide range of solutions for thermal characterization and reliability
          testing. Our solutions are designed to meet the needs of our customers in the
          semiconductor, automotive, aerospace, and other industries.
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
