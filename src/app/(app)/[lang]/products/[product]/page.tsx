import { cn } from '@heroui/react';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import Carousel from '@/components/carousel/carousel';
import ContactForm from '@/components/content/contact-form/contact-form';
import Downloads from '@/components/content/downloads/downloads';
import Features from '@/components/content/features';
import Highlight from '@/components/content/highlight';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import type { Config, Media, Solution } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export async function generateStaticParams(props: { params: { lang: string; product: string } }) {
  const { lang } = props.params;
  const payload = await getPayload({ config });
  const products: Solution[] = await payload
    .find({
      collection: 'solutions',
      where: {
        type: { equals: 'product' },
      },
      pagination: false,
      depth: 0,
      locale: lang as Config['locale'],
    })
    .then((res) => res.docs);

  return products.map((product) => ({ product: product.slug }));
}

interface ProductPageProps {
  params: Promise<{
    product: string;
    lang: Config['locale'];
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { product: slug, lang } = await params;

  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const product: Solution = await payload
    .find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      draft: isDraft,
      overrideAccess: isDraft,
      locale: lang,
    })
    .then((res) => res.docs[0]);

  if (!product) {
    return notFound();
  }

  return (
    <main>
      <div className="container mx-auto mb-24">
        {product.details?.images?.length > 0 && (
          <Carousel images={product.details.images as Media[]} />
        )}
        <section
          className={cn(
            'sticky bottom-8 flex flex-row justify-start max-w-6xl',
            'sm:mx-4 xl:mx-20 2xl:mx-52 lg:-mt-24',
          )}
        >
          <div
            className={cn(
              'w-full lg:w-auto lg:min-w-[calc(5/12*(100%-11*2rem)+4*2rem)] xl:min-w-[calc(4/12*(100%-11*2rem)+3*2rem)] flex flex-col items-start z-30 p-4',
              'sm:rounded-xl bg-background/80 backdrop-blur-xs shadow-xl',
            )}
          >
            <h1 className="inline-block text-5xl leading-none font-black">{product.title}</h1>
            <p className="inline-block text-lg mt-4 text-secondary">{product.subtitle}</p>
          </div>
        </section>
        <article className="sm:mx-4 md:mx-8 px-4 max-w-6xl lg:mx-auto">
          {product.details.content?.map((item) => {
            switch (item.blockType) {
              case 'text':
                return <Text key={item.id} {...item} />;
              case 'text-image':
                return <TextImage key={item.id} {...item} />;
              case 'highlight':
                return <Highlight lang={lang} key={item.id} highlight={item} />;
              case 'text-video':
                return <TextVideo key={item.id} {...item} />;
              case 'contact-form':
                return (
                  <ContactForm
                    key={item.id}
                    className="max-lg:w-screen lg:w-full relative max-lg:left-1/2 max-lg:-translate-x-[50%] mx-auto my-12 col-span-full bg-foreground/5 px-12 py-12 lg:rounded-lg"
                    to={item.to}
                    defaultValues={{ subject: item.subject ?? `Inquiry about ${product.title}` }}
                  />
                );
              case 'features':
                return <Features features={item} key={item.id} />;
              case 'downloads':
                return <Downloads key={item.id} docs={item.docs} />;
              default:
                return null;
            }
          })}
        </article>
      </div>
    </main>
  );
};

export default ProductPage;
