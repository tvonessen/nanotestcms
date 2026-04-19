import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';
import { buildMetadata } from '@/utils/generateMeta';
import { isPreviewEnabled } from '@/utils/preview';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface AboutPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const legal = await payload.findGlobal({ slug: 'legal', locale: lang, depth: 1 });
  return buildMetadata(legal?.privacyMeta, { title: 'Privacy Policy — Nanotest' }, lang);
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
        <Content blocks={legal.privacy} lang={lang} />
      </article>
    </div>
  );
}
