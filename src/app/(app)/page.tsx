import CardsGrid from '@/components/content/cards';
import ContactForm from '@/components/content/contact-form';
import Highlight from '@/components/content/highlight';
import RichTextWrapper from '@/components/content/richtext-wrapper';
import Jumbo from '@/components/jumbo/jumbo';
import { RefreshRouteOnSave } from '@/components/utility/RefreshRouteOnSave';
import type { Solution } from '@/payload-types';
import config from '@/payload.config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

const Home = async () => {
  const payload = await getPayload({ config });
  const homepageContent = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
  });

  if (!homepageContent) return notFound();

  return (
    <React.Fragment key={homepageContent.id}>
      <RefreshRouteOnSave />
      {homepageContent.jumbotron && <Jumbo jumbos={homepageContent.jumbotron} />}
      {homepageContent.content?.map((block) => {
        switch (block.blockType) {
          case 'text':
            return (
              <div className="container my-12 px-8 md:px-12 xl:mx-auto">
                <RichTextWrapper key={block.id} text={block.text} />
              </div>
            );
          case 'highlight':
            return (
              <Highlight
                key={block.id}
                link={block.link}
                text={block.text}
                title={block.title}
                variant={block.variant}
              />
            );
          case 'cards':
            return (
              <CardsGrid
                key={block.id}
                title={block.title}
                description={block.description as string | undefined}
                solutions={block.cards as Solution[]}
              />
            );
          default:
            return null;
        }
      })}

      <ContactForm
        id="contact"
        className="px-12 my-12 py-12 bg-opacity-5 mx-auto bg-foreground max-xl:w-full xl:max-w-6xl xl:rounded-lg"
      />
    </React.Fragment>
  );
};

export default Home;
