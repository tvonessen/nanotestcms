import Text from '@/components/content/Text';
import TextImage from '@/components/content/TextImage';
import TextVideo from '@/components/content/TextVideo';
import type { Media } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

export default async function AboutPage() {
  const payload = await getPayload({ config });
  const about = await payload.findGlobal({
    slug: 'about',
  });

  if (!about) return notFound();

  return (
    <div className="container mx-auto">
      <article className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {about.content?.map((item, i) => {
          switch (item.blockType) {
            case 'text':
              return <Text text={item.text} />;
            case 'text-image':
              return <TextImage text={item.text} image={item.image as Media} />;
            case 'text-video':
              return <TextVideo text={item.text} videoId={item.videoId as string} />;
            default:
              return null;
          }
        })}
      </article>
    </div>
  );
}
