import ContactForm from '@/components/content/contact-form/contact-form';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import DistributorsAccordion, {
  type RegionKey,
} from '@/components/distributors/distributors-accordion';
import type { Media } from '@/payload-types';
import config from '@/payload.config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

export default async function Contact() {
  const payload = await getPayload({ config });
  const contactUs = await payload.findGlobal({
    slug: 'contact-us',
    overrideAccess: false,
  });

  async function populateContactPartners(key: RegionKey) {
    for (const regionItem of contactUs[key]?.contacts ?? []) {
      if (regionItem.contact.relationTo === 'distro-partner') {
        if (typeof regionItem.contact.value === 'string') {
          const id = regionItem.contact.value;
          regionItem.contact.value = await payload.findByID({
            collection: 'distro-partner',
            id: id,
          });
        }
      }
    }
  }

  if (!contactUs) {
    return notFound();
  }

  await Promise.all(
    ['europe', 'america', 'asia', 'africa'].map((key) => populateContactPartners(key as RegionKey)),
  );

  return (
    <div className="container mx-auto mt-16">
      <article className="max-w-6xl lg:mx-auto px-4">
        {contactUs.content?.map((block) => {
          switch (block.blockType) {
            case 'text':
              return <Text key={block.id} text={block.text} />;
            case 'text-image':
              return <TextImage key={block.id} text={block.text} image={block.image as Media} />;
            case 'text-video':
              return (
                <TextVideo key={block.id} text={block.text} videoId={block.videoId as string} />
              );
            case 'contact-form':
              return (
                <ContactForm
                  key={block.id}
                  id="contact"
                  to={block.to}
                  defaultValues={{ subject: block.subject ?? undefined }}
                />
              );
            default:
              return null;
          }
        })}
      </article>
      <article className="max-w-6xl px-4 lg:mx-auto mt-16">
        <h2 className="text-2xl text-primary px-4">Contact partners</h2>
        <h3 className="text-3xl font-bold mb-8 px-4">International Contact</h3>
        <DistributorsAccordion contactUs={contactUs} />
      </article>
    </div>
  );
}
