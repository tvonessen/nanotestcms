import { CardsGrid } from '@/components/content/cards/cards-grid';
import ContactForm from '@/components/content/contact-form/contact-form';
import Features from '@/components/content/features';
import Highlight from '@/components/content/highlight';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import Jumbo from '@/components/jumbo/jumbo';
import type { Config } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

interface HomeProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export default async function Home(props: HomeProps) {
  const { lang } = await props.params;
  const payload = await getPayload({ config });
  const homepageContent = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: false,
    locale: lang,
  });

  if (!homepageContent) return notFound();

  return (
    <React.Fragment>
      {homepageContent?.jumbotron && <Jumbo jumbos={homepageContent.jumbotron} />}
      {homepageContent?.content?.map((block) => {
        switch (block.blockType) {
          case 'text':
            return (
              <div key={block.id} className="container max-w-prose my-16 px-8 md:px-12 xl:mx-auto">
                <RichTextWrapper text={block.text} />
              </div>
            );
          case 'highlight':
            return (
              <Highlight
                lang={lang}
                key={block.id}
                link={block.link}
                text={block.text}
                title={block.title}
                color={block.variant}
              />
            );
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
