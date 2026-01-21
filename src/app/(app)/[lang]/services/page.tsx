import ProductCard from '@/components/partials/product-card';
import { LazyIcon } from '@/components/utility/lazy-icon';
import type { Config, Solution, SolutionCategory } from '@/payload-types';
import config from '@payload-config';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Fragment } from 'react';

interface ServicesPageProps {
  params: Promise<{
    lang: Config['locale'];
  }>;
}

export default async function ServicesPage(props: ServicesPageProps) {
  const { lang } = await props.params;
  const payload = await getPayload({ config });
  const services: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        type: { equals: 'service' },
      },
      pagination: false,
      overrideAccess: false,
      locale: lang,
    })
    .then((res) => res.docs);

  const categories: SolutionCategory[] = await payload
    .find({
      collection: 'solution-categories',
      pagination: false,
      overrideAccess: false,
      sort: 'position',
      locale: 'all',
    })
    .then((res) => res.docs);

  if (!services.length || !categories.length) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-[80ch] my-16 mx-auto" key="services-page-header">
        <h1 className="text-4xl font-bold mt-8">Our services</h1>
        <p className="text-lg mt-4">
          We provide services all around thermal properties and performance of materials, compounds
          and systems. Characterization, failure analysis, test stand development, thermal test
          vehicle design - whatever it is that concerns reliability of electronics, we can do the
          job.
        </p>
        <p className="text-lg my-4">
          Thermal characterization of materials from the wide domain of electronics is a key
          competencNanotest. We are experiences, well-equipped and ready for your task.
        </p>
        <p className="text-lg my-4">
          Packages, systems and components need proper thermal characterization to evaluate their
          reliability or itheir individual impact on a parent system's lifetime expectancy.
        </p>
        <p className="text-lg my-4">
          Thermal performance and properties are key indicators for manufacturing and material
          quality, system reliability and expectable lifetime.
        </p>
        <p className="text-lg my-4">
          TTVs - thermal test vehicles - are genuine multitools for thermal performance testing on a
          great variety of levels. We provide TTVs first-hand, custom and as complete solution.
        </p>
        <Link
          className="text-primary underline hover:decoration-[3px] focus:no-underline hover:decoration-focus outline-offset-1 focus:rounded-md"
          href={`/${lang}/contact`}
        >
          contact us
        </Link>
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
                className="w-[calc(100%-1rem)] relative mt-24 mb-8 px-2 py-4 rounded-sm bg-foreground before:absolute before:-left-4 before:top-0 before:w-2 before:bg-primary before:rounded before:h-full translate-x-4"
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
                      lang={lang}
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
