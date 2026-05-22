import config, { type SupportedLocale } from '@payload-config';
import { getPayload } from 'payload';
import { LazyIcon } from '@/components/utility/lazy-icon';
import type { Cards, Solution, SolutionCategory } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';
import RichTextWrapper from '../richtext-wrapper';
import { Card } from './card';

interface CardsGridProps {
  lang: 'de' | 'en';
  block: Cards;
  className?: string;
}

async function buildCards(cards: Cards['cards'], lang: SupportedLocale, isDraft: boolean) {
  const payload = await getPayload({ config });

  const solutionIds = [
    ...new Set(
      cards
        .filter((c) => c.source === 'solution' && c.solution)
        .map((c) => (typeof c.solution === 'string' ? c.solution : c.solution?.id)),
    ),
  ];
  let solutionMap = new Map<string, Solution>();
  if (solutionIds.length > 0) {
    const fetched = await payload
      .find({
        collection: 'solutions',
        locale: lang,
        draft: isDraft,
        where: { id: { in: solutionIds } },
        pagination: false,
      })
      .then((res) => res.docs);
    solutionMap = new Map(fetched.map((s) => [s.id, s]));
  }

  return cards
    .map((card) => {
      if (card.source === 'solution') {
        const id = typeof card.solution === 'string' ? card.solution : card.solution?.id;
        const sol = id ? solutionMap.get(id) : undefined;
        if (!sol) return null;
        return { type: 'solution' as const, key: card.id ?? sol.id, solution: sol };
      }
      if (card.source === 'manual') {
        if (!card.title || !card.image) return null;
        return { type: 'manual' as const, key: card.id ?? card.title, card };
      }
      return null;
    })
    .filter(Boolean);
}

export type RenderableCard = Awaited<ReturnType<typeof buildCards>>[number];

export async function CardsGrid(props: CardsGridProps) {
  const { lang, block, className } = props;
  const payload = await getPayload({ config });
  const cards = block.cards ?? [];
  if (cards.length === 0) return null;

  const isDraft = await isPreviewEnabled();

  // Resolve category title if needed
  let category: SolutionCategory | undefined;
  if (block.useCategoryTitle && block.titleCategory) {
    const catId =
      typeof block.titleCategory === 'string' ? block.titleCategory : block.titleCategory.id;
    category = await payload.findByID({
      collection: 'solution-categories',
      locale: lang,
      draft: isDraft,
      id: catId,
    });
  }

  // Collect unique solution IDs and batch-fetch them
  const renderable = await buildCards(cards, lang, isDraft);

  if (renderable.length === 0) return null;

  const hasTextTitle = !block.useCategoryTitle && block.title;
  const hasCategoryTitle = block.useCategoryTitle && category;

  return (
    <section className={className}>
      {hasCategoryTitle && (
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
      {(hasTextTitle || block.paragraph) && (
        <div className="flex flex-col gap-6 my-12">
          {hasTextTitle && (
            <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-linear-to-tr from-secondary-700 to-secondary-400">
              {block.title}
            </h2>
          )}
          {block.paragraph && (
            <div className="max-w-[80ch] mx-auto">
              <RichTextWrapper lang={lang} text={block.paragraph} />
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-10 sm:gap-y-6">
        {renderable.map((item) => {
          if (!item) return null;
          return <Card key={item.key} lang={lang} content={item} />;
        })}
      </div>
    </section>
  );
}
