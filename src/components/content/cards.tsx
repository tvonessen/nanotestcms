import type { Cards, Media, Solution } from '@/payload-types';
import { Button } from '@heroui/button';
import Image from 'next/image';
import Link from 'next/link';
import RichTextWrapper from './richtext-wrapper';

interface CardsGridProps {
  lang: string;
  block: Cards;
}

const CardsGrid = ({ lang, block }: CardsGridProps) => {
  // filter out solutions that don't have an id (i.e. are not published or deleted)
  if (!block.cards || (block.cards as Solution[]).filter((card) => 'id' in card).length === 0) {
    return null;
  }

  const { cards, title, paragraph } = block;

  return (
    <section className="container px-4 md:px-8 mx-auto mt-12">
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
          const widthClass =
            cards.length >= 4
              ? 'w-[calc(25%_-_1.5rem)]'
              : cards.length === 3
                ? 'w-[calc(33%_-_1rem)]'
                : cards.length === 2
                  ? 'w-[calc(50%_-_.5rem)]'
                  : 'w-full';
          return <Card key={card.id} lang={lang} solution={card} className={`${widthClass}`} />;
        })}
      </div>
    </section>
  );
};

interface CardProps {
  lang: string;
  solution: Solution;
  className?: string;
}

const Card = ({ lang, solution, className }: CardProps) => {
  const cardImage = solution.details.images[0] as Media;
  cardImage.url = cardImage.sizes?.small?.url ?? cardImage.url;
  cardImage.height = cardImage.sizes?.small?.height ?? cardImage.height;
  cardImage.width = cardImage.sizes?.small?.width ?? cardImage.width;
  cardImage.isDark;

  const titleLength = solution.title.length;

  return (
    <div
      className={`group card min-w-64 ${className} max-w-130 aspect-3/4 bg-linear-to-tl from-primary-900 to-primary-300 before:dark:bg-background! before:bg-foreground! image-full shadow-xl hover:scale-105 focus-within:scale-105 transition hover:z-20 focus-visible:z-20`}
    >
      <figure className="object-cover z-10">
        <Image
          alt={solution.title}
          className="min-h-full min-w-full group-hover:scale-110 group-hover:opacity-5 group-hover:blur-[1px] group-focus-within:blur-[1px] group-focus-within:scale-110 group-focus-within:opacity-5 transition duration-1000 ease-out"
          height={cardImage.height as number}
          src={cardImage.url as string}
          width={cardImage.width as number}
          placeholder={cardImage.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={cardImage.blurDataUrl as string}
        />
      </figure>
      <div className="card-body gap-0 z-20">
        <h2
          className={`text-2xl max-w-[85%] mb-2 origin-left scale-125 group-hover:scale-100 group-focus-within:scale-100 transition-all font-semibold ${cardImage.isDark ? 'text-white' : 'text-black'} group-hover:text-white`}
        >
          {solution.title}
        </h2>
        <small className="pb-3 text-primary-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          {solution.subtitle}
        </small>
        <p className="text-default-200 dark:text-default-800 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          {solution.shortDescription}
        </p>

        <div className="card-actions justify-end opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <Link
            aria-label={`Learn more about ${solution.title}`}
            href={`/${lang}/${solution.type[0]}s/${solution.slug}`}
            passHref
          >
            <Button color="primary" size="md" className="mt-6 focus-visible:outline-focus">
              {titleLength > 10 ? 'Read more' : `More about ${solution.title}`}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardsGrid;
