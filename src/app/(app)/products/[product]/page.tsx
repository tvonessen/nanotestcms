// Next.js will invalidate the cache when a

import Carousel from '@/components/carousel/carousel';
import ContactForm from '@/components/content/contact-form/contact-form';
import Highlight from '@/components/content/highlight';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import type { Media, Solution } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Fragment } from 'react';

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const products: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        type: { equals: 'product' },
      },
      pagination: false,
      depth: 0,
    })
    .then((res) => res.docs);

  return products.map((product) => ({ product: product.slug }));
}

const ProductPage = async ({ params }: { params: Promise<{ product: string }> }) => {
  const { product: slug } = await params;

  const payload = await getPayload({ config });
  const product: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    .then((res) => res.docs[0]);

  if (!product) {
    return notFound();
  }

  return (
    <Fragment>
      <main>
        <div className="container mx-auto" key="product-content">
          {product.details?.images?.length > 0 && (
            <Carousel images={product.details.images as Media[]} />
          )}
          <article
            key={product.title ?? `product-${product.title ?? 'unknown'}`}
            className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto"
          >
            {/* Abstract section */}
            <section className="abstract col-span-12 lg:col-span-5 xl:col-span-4">
              <h1 className="text-5xl mt-6 leading-none font-black">{product.title}</h1>
              <p className="text-lg mt-4 text-primary">{product.subtitle}</p>
              <p className="my-6 font-medium text-lg">{product.details.abstract}</p>
            </section>
            {/* Content section */}
            {product.details.content?.map((item, i) => {
              switch (item.blockType) {
                case 'text':
                  return <Text key={item.id} text={item.text} />;
                case 'text-image':
                  return <TextImage key={item.id} text={item.text} image={item.image as Media} />;
                case 'highlight':
                  return (
                    <Highlight
                      key={item.id}
                      title={item.title}
                      text={item.text}
                      link={item.link}
                      variant={item.variant}
                    />
                  );
                case 'text-video':
                  return (
                    <TextVideo key={item.id} text={item.text} videoId={item.videoId as string} />
                  );
                case 'contact-form':
                  return (
                    <ContactForm
                      key={item.id}
                      className="max-lg:w-screen lg:w-full relative max-lg:left-1/2 max-lg:-translate-x-[50%] mx-auto my-12 col-span-full bg-opacity-5 bg-foreground px-12 py-12 lg:rounded-lg"
                      to={item.to}
                      defaultValues={{ subject: item.subject ?? `Inquiry about ${product.title}` }}
                    />
                  );
                default:
                  return null;
              }
            })}
          </article>
        </div>
      </main>
    </Fragment>
  );
};

export default ProductPage;
