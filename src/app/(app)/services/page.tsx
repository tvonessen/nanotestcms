import ProductCard from '@/components/partials/product-card';
import { productCategories } from '@/data/productCategories';
import type { Solution } from '@/payload-types';
import config from '@payload-config';
import { type PaginatedDocs, getPayload } from 'payload';
import { Fragment } from 'react';

export default async function ServicesPage() {
  const payload = await getPayload({ config });
  const services: PaginatedDocs<Solution> = await payload.find({
    collection: 'solutions',
    where: {
      'type.category': { equals: 'service' },
    },
    pagination: false,
    overrideAccess: false,
  });

  return (
    <div className="container mx-auto px-4">
      <div className="my-16" key="services-page-header">
        <h1 className="text-4xl font-bold mt-8">Our services</h1>
        <p className="text-lg mt-4">
          Nanotest offers a wide range of services for thermal characterization and reliability
          testing. Our services are designed to meet the needs of our customers in the
          semiconductor, automotive, aerospace, and other industries.
        </p>
      </div>

      {productCategories
        .filter((category) =>
          services.docs.some((service) => {
            return service.type.subCategory === category.id;
          }),
        )
        .map((category) => (
          <Fragment key={category.title}>
            <div
              key={`${category.title}-header`}
              className="w-[calc(100%_-_1rem)] relative mt-24 mb-8 px-2 py-4 rounded bg-foreground before:absolute before:-left-4 before:top-0 before:w-2 before:bg-primary before:rounded before:h-full translate-x-4"
            >
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-background flex items-center"
                id={category.title.replaceAll(' ', '-').toLowerCase()}
              >
                {category.icon({ size: 32, className: 'mx-3' })} {category.title}
              </h2>
            </div>
            <div
              key={`${category.title}-body`}
              className="flex flex-wrap justify-center gap-8 px-0 sm:px-4"
            >
              {services.docs
                .filter((service) => service.type.subCategory === category.id)
                .map((service) => (
                  <ProductCard
                    key={service.slug}
                    className="flex-auto lg:flex-[0_0_calc(50%_-_2rem)] xl:flex-[0_0_calc(33.3333%_-_4rem)]"
                    product={service}
                  />
                ))}
            </div>
          </Fragment>
        ))}
    </div>
  );
};
