import { cn } from '@heroui/react';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';
import { CardsGrid } from '@/components/content/cards/cards-grid';
import ContactForm from '@/components/content/contact-form/contact-form';
import Features from '@/components/content/features';
import Highlight from '@/components/content/highlight';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import Jumbo from '@/components/jumbo/jumbo';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface HomeProps {
  params: Promise<{ lang: Config['locale'] }>;
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
      {homepageContent?.content?.map((block) => {
        switch (block.blockType) {
          case 'text':
            return (
              <div
                key={block.id}
                className={cn(
                  'container my-16 px-8 md:px-12 mx-auto',
                  !block.text_right && 'max-w-prose',
                  block.text_right &&
                    'grid grid-cols-1 lg:grid-cols-3 max-w-prose lg:max-w-[calc(65ch+30ch)] gap-6',
                )}
              >
                {block.text_right && <RichTextWrapper text={block.text_right} />}
                <RichTextWrapper
                  className={block.text_right ? 'lg:col-span-2' : ''}
                  text={block.text}
                />
              </div>
            );
          case 'highlight':
            return <Highlight key={block.id} lang={lang} highlight={block} />;
          case 'cards':
            return <CardsGrid lang={lang} key={block.id} block={block} />;
          case 'features':
            return <Features key={block.id} features={block} />;
          case 'contact-form':
            return (
              <ContactForm
                key={block.id}
                id="contact"
                to={block.to}
                defaultValues={{ subject: block.subject ?? undefined }}
                className="px-12 my-12 py-12 mx-auto bg-foreground/5 max-xl:w-full xl:max-w-6xl xl:rounded-lg"
              />
            );
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
}
