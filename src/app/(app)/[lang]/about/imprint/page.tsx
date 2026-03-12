import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import { locales } from '@/config/locales';
import type { Config, Media } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface AboutPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const legal = await payload.findGlobal({
    slug: 'legal',
    draft: isDraft,
    overrideAccess: isDraft,
    locale: lang,
  });

  if (!legal) return notFound();

  return (
    <div className="container mx-auto">
      <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {legal.imprint?.map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text key={item.id} {...item} />;
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
