import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import DistributorsAccordion, {
  type RegionKey,
} from '@/components/distributors/distributors-accordion';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface ContactPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export default async function Contact({ params }: ContactPageProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const contactUs = await payload.findGlobal({
    slug: 'contact-us',
    draft: isDraft,
    overrideAccess: isDraft,
    locale: lang,
  });

  async function populateContactPartners(key: RegionKey) {
    for (const country of contactUs[key]?.countries ?? []) {
      for (const contact of country.contacts) {
        if (contact.relationTo === 'distro-partner') {
          if (typeof contact.value === 'string') {
            const id = contact.value;
            contact.value = await payload.findByID({
              collection: 'distro-partner',
              id: id,
            });
          }
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
        <Content lang={lang} blocks={contactUs.content} />
      </article>
      <article className="max-w-6xl px-4 lg:mx-auto mt-16">
        <h2 className="text-2xl text-primary px-4">
          {lang === 'de' ? 'Ansprechpartner' : 'Contact partners'}
        </h2>
        <h3 className="text-3xl font-bold mb-8 px-4">
          {lang === 'de' ? 'Internationale Kontakte' : 'International contact'}
        </h3>
        <DistributorsAccordion lang={lang} contactUs={contactUs} />
      </article>
    </div>
  );
}
