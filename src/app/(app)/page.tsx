import CardsGrid from '@/components/content/Cards';
import ContactForm from '@/components/content/ContactForm';
import Highlight from '@/components/content/Highlight';
import Jumbo from '@/components/jumbo/Jumbo';
import RichText from '@/components/partials/richText';
import type { Media, Solution } from '@/payload-types';
import config from '@/payload.config';
import { getPayload } from 'payload';

export const revalidate = 0;

const Home = async () => {
  const payload = await getPayload({ config });
  const homepageContent = await payload.findGlobal({
    slug: 'homepage',
  });

  if (!homepageContent) return null;

  return (
    <>
      {homepageContent.jumbotron && <Jumbo jumbos={homepageContent.jumbotron} />}

      {homepageContent.content?.map((block) => {
        switch (block.blockType) {
          case 'text':
            return (
              <div className="container my-12 px-8 md:px-12 xl:mx-auto">
                <RichText key={block.id} text={block.text_html as string} />
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
    </>
  );
};

export default Home;
