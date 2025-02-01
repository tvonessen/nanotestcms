import ProductCard from '@/components/partials/product-card';
import { LazyIcon } from '@/components/utility/lazy-icon';
import type { Solution, SolutionCategory } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Fragment } from 'react';

const ProductsPage = async () => {
  const payload = await getPayload({ config });
  const products: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        'type.type': { equals: 'product' },
      },
      pagination: false,
      overrideAccess: false,
    })
    .then((res) => res.docs);

  const categories: SolutionCategory[] = await payload
    .find({
      collection: 'solution-categories',
      pagination: false,
      where: {
        type: { equals: 'product' },
      },
      overrideAccess: false,
    })
    .then((res) => res.docs);

  if (!products.length || !categories.length) {
    return notFound();
  }

  return (
    <div key="solution" className="container mx-auto px-4">
      <div className="my-16" key="products-page-header">
        <h1 className="text-4xl font-bold mt-8">Our products</h1>
        <p className="text-lg mt-4">
          Nanotest offers a wide range of solutions for thermal characterization and reliability
          testing. Our solutions are designed to meet the needs of our customers in the
          semiconductor, automotive, aerospace, and other industries.
        </p>
      </div>

      {categories
        .filter((category) =>
          products.some(
            (product) => (product.type.category.value as SolutionCategory).id === category.id,
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
                  <LazyIcon name={category.categoryIcon as string} /> {category.title}
                </h2>
              </div>
              <div
                key={`${category.title}-body`}
                className="flex flex-wrap justify-center gap-8 px-0 sm:px-4"
              >
                {products
                  .filter(
                    (product) =>
                      (product.type.category.value as SolutionCategory).id === category.id,
                  )
                  .map((product) => (
                    <ProductCard
                      key={product.slug}
                      className="flex-auto lg:flex-[0_0_calc(50%_-_2rem)] xl:flex-[0_0_calc(33.3333%_-_4rem)]"
                      product={product}
                    />
                  ))}
              </div>
            </Fragment>
          );
        })}
    </div>
  );
};

export default ProductsPage;
