import type { Cards, Solution } from '@/payload-types';
import RichTextWrapper from '../richtext-wrapper';
import { Card } from './card';

interface CardsGridProps {
  lang: string;
  block: Cards;
}

export function CardsGrid({ lang, block }: CardsGridProps) {
  // filter out solutions that don't have an id (i.e. are not published or deleted)
  if (!block.cards || (block.cards as Solution[]).filter((card) => 'id' in card).length === 0) {
    return null;
  }

  const { cards, title, paragraph } = block;

  return (
    <section>
      <div className="flex flex-col gap-6 my-12">
        <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-linear-to-tr from-secondary-700 to-secondary-400">
          {title}
        </h2>
        {paragraph && (
          <div className="max-w-[80ch] mx-auto">
            <RichTextWrapper lang={lang} text={paragraph} />
          </div>
        )}
      </div>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-10 sm:gap-y-6">
        {(cards as Solution[]).map((card) => {
          return <Card key={card.id} lang={lang} solution={card} />;
        })}
      </div>
    </section>
  );
}
