import type { Media, Solution } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';

const CardsGrid = ({
  title,
  description,
  solutions,
}: {
  title: string;
  description?: string;
  solutions: Solution[];
}) => {
  // filter out solutions that don't have an id (i.e. are not published or deleted)
  if (!solutions || solutions.filter((solution) => 'id' in solution).length === 0) {
    return null;
  }

  return (
    <section className="container px-4 md:px-8 xl:px-0 mx-auto mt-12">
      <div className="flex flex-col gap-6 my-12">
        <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-secondary-700 to-secondary-400">
          {title}
        </h2>
        <p className="text-lg font-medium mx-auto">{description}</p>
      </div>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-10 sm:gap-y-6">
        {solutions.map((solution) => {
          const widthClass =
            solutions.length >= 4
              ? 'w-[calc(25%_-_1.5rem)]'
              : solutions.length === 3
                ? 'w-[calc(33%_-_1rem)]'
                : solutions.length === 2
                  ? 'w-[calc(50%_-_.5rem)]'
                  : 'w-full';
          return <Card key={solution.id} solution={solution} className={`${widthClass}`} />;
        })}
      </div>
    </section>
  );
};

const Card = ({ solution, className }: { solution: Solution; className?: string }) => {
  const cardImage = solution.details.images[0] as Media;
  cardImage.url = cardImage.sizes?.small?.url ?? cardImage.url;
  cardImage.height = cardImage.sizes?.small?.height ?? cardImage.height;
  cardImage.width = cardImage.sizes?.small?.width ?? cardImage.width;
  cardImage.isDark;

  const titleLength = solution.title.length;

  return (
    <div
      className={`group card min-w-64 ${className} max-w-[520px] aspect-[3/4] bg-gradient-to-tl from-primary-900 to-primary-300 before:dark:!bg-background before:!bg-foreground image-full shadow-xl hover:scale-105 focus-within:scale-105 transition hover:z-20 focus-visible:z-20`}
    >
      <figure className="object-cover z-10">
        <Image
          alt={solution.title}
          className="min-h-full min-w-full group-hover:scale-110 group-hover:opacity-5 group-hover:blur-[1px] group-focus-within:blur-[1px] group-focus-within:scale-110 group-focus-within:opacity-5 transition duration-1000 ease-out"
          height={cardImage.height as number}
          src={cardImage.url as string}
          width={cardImage.width as number}
          placeholder="blur"
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
            className="mt-6 btn btn-primary btn-md focus-visible:outline-focus"
            href={`/${solution.type[0]}s/${solution.slug}`}
          >
            {titleLength > 16 ? 'Read more' : `More about ${solution.title}`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardsGrid;
