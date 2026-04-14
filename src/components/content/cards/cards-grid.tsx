import config from '@payload-config';
import { getPayload } from 'payload';
import { LazyIcon } from '@/components/utility/lazy-icon';
import type { Cards, Solution, SolutionCategory } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';
import RichTextWrapper from '../richtext-wrapper';
import { Card, ManualCard } from './card';

interface getSolutionsByCategoryAndTypesProps {
  category?: string | SolutionCategory;
  types?: string[];
  lang: 'en' | 'de';
}

async function getSolutionsAndCategories(args: getSolutionsByCategoryAndTypesProps) {
  if (!args.types || !args.category) return { solutions: undefined, category: undefined };

  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();

  const solutions = await payload
    .find({
      collection: 'solutions',
      locale: args.lang,
      draft: isDraft,
      where: {
        'category.value': { contains: args.category },
        type: { in: args.types },
      },
      pagination: false,
    })
    .then((res) => res.docs);

  const category = await payload.findByID({
    collection: 'solution-categories',
    locale: args.lang,
    draft: isDraft,
    id: typeof args.category === 'string' ? args.category : args.category?.id,
  });

  return {
    solutions,
    category,
  };
}

interface CardsGridProps {
  lang: 'de' | 'en';
  block: Cards;
  className?: string;
}

export async function CardsGrid(props: CardsGridProps) {
  const { lang, block, className } = props;

  /* Get Solutions based on block config */
  let solutions: Solution[] | undefined;
  let category: SolutionCategory | undefined;

  if (!block.source || !['solutions', 'category', 'manual'].includes(block.source)) return null;

  if (block.source === 'manual') {
    const cards = block.manualFields?.cards ?? [];
    if (cards.length === 0) return null;

    return (
      <section className={className}>
        <div className="flex flex-col gap-6 my-12">
          {block.manualFields?.title && (
            <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-linear-to-tr from-secondary-700 to-secondary-400">
              {block.manualFields.title}
            </h2>
          )}
          {block.manualFields?.paragraph && (
            <div className="max-w-[80ch] mx-auto">
              <RichTextWrapper lang={lang} text={block.manualFields.paragraph} />
            </div>
          )}
        </div>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-10 sm:gap-y-6">
          {cards.map((card) => (
            <ManualCard key={card.id} lang={lang} card={card} />
          ))}
        </div>
      </section>
    );
  }

  if (block.source === 'solutions') {
    const ids = (block.solutionsFields?.cards ?? []).map((card) =>
      typeof card === 'string' ? card : card.id,
    );
    if (ids.length === 0) return null;

    const payload = await getPayload({ config });
    const isDraft = await isPreviewEnabled();
    solutions = await payload
      .find({
        collection: 'solutions',
        locale: lang,
        draft: isDraft,
        where: { id: { in: ids } },
        pagination: false,
      })
      .then((res) => res.docs);
  } else {
    const data = await getSolutionsAndCategories({
      category: block.categoryFields?.category,
      types: block.categoryFields?.types,
      lang: lang,
    });
    category = data.category;
    solutions = category ? data.solutions : undefined; // No solutions without a valid category
  }

  if (!solutions || solutions.length === 0) return null;

  return (
    <section className={className}>
      {block.source === 'solutions' && (
        <div className="flex flex-col gap-6 my-12">
          {block.solutionsFields?.title && (
            <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-linear-to-tr from-secondary-700 to-secondary-400">
              {block.solutionsFields.title}
            </h2>
          )}
          {block.solutionsFields?.paragraph && (
            <div className="max-w-[80ch] mx-auto">
              <RichTextWrapper lang={lang} text={block.solutionsFields.paragraph} />
            </div>
          )}
        </div>
      )}

      {block.source === 'category' && (
        <div className="w-[calc(100%-1rem)] relative mt-24 mb-8 px-2 py-4 rounded-sm bg-foreground before:absolute before:-left-4 before:top-0 before:w-2 before:bg-primary before:rounded before:h-full translate-x-4">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-background flex items-center"
            id={category?.id}
          >
            <LazyIcon
              name={category?.categoryIcon as string}
              className="w-fit px-1 text-4xl select-none"
            />
            {category?.title}
          </h2>
        </div>
      )}
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-10 sm:gap-y-6">
        {solutions.map((card) => {
          return <Card key={card.id} lang={lang} solution={card} />;
        })}
      </div>
    </section>
  );
}
