import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';
import { Content } from '@/components/content/content';
import Jumbo from '@/components/jumbo/jumbo';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';
import { buildMetadata } from '@/utils/generateMeta';
import { isPreviewEnabled } from '@/utils/preview';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface HomeProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export async function generateMetadata({ params }: HomeProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const homepageContent = await payload.findGlobal({ slug: 'homepage', locale: lang, depth: 1 });
  return buildMetadata(homepageContent?.meta, {}, lang);
}

export default async function Home(props: HomeProps) {
  const { lang } = await props.params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const homepageContent = await payload.findGlobal({
    slug: 'homepage',
    draft: isDraft,
    overrideAccess: isDraft,
    locale: lang,
  });

  if (!homepageContent) return notFound();

  return (
    <React.Fragment>
      {homepageContent?.jumbotron && <Jumbo lang={lang} jumbos={homepageContent.jumbotron} />}
      <article className="container max-w-6xl mx-auto px-4">
        <Content lang={lang} blocks={homepageContent.content} />
      </article>
      {/**/}
    </React.Fragment>
  );
}
