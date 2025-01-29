import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import type { Media } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

export default async function AboutPage() {
  const payload = await getPayload({ config });
  const legal = await payload.findGlobal({
    slug: 'legal',
  });

  if (!legal) return notFound();

  return (
    <div className="container mx-auto">
      <article className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {legal.privacy?.map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text key={item.id} text={item.text} />;
            case 'text-image':
              return <TextImage key={item.id} text={item.text} image={item.image as Media} />;
            default:
              return null;
          }
        })}
      </article>
    </div>
  );
}
