import { CardsGrid } from '@/components/content/cards/cards-grid';
import ContactForm from '@/components/content/contact-form/contact-form';
import Downloads from '@/components/content/downloads/downloads';
import Features from '@/components/content/features';
import Highlight from '@/components/content/highlight';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import type {
  Cards as CardsBlock,
  ContactForm as ContactFormBlock,
  Downloads as DownloadsBlock,
  Features as FeaturesBlock,
  Highlight as HighlightBlock,
  Text as TextBlock,
  TextImage as TextImageBlock,
  TextVideo as TextVideoBlock,
} from '@/payload-types';

type ContentBlock =
  | CardsBlock
  | ContactFormBlock
  | DownloadsBlock
  | FeaturesBlock
  | HighlightBlock
  | TextBlock
  | TextImageBlock
  | TextVideoBlock;

const ALIGNABLE_BLOCK_TYPES = new Set(['text', 'text-image', 'text-video']);

function resolveAutoAlignment<T extends { blockType: string; alignment?: string | null }>(
  blocks: T[],
): T[] {
  let lastAlignment: 'left' | 'right' = 'right';

  return blocks.map((block) => {
    if (!ALIGNABLE_BLOCK_TYPES.has(block.blockType)) return block;

    const effective: 'left' | 'right' =
      block.alignment === 'auto'
        ? lastAlignment === 'left'
          ? 'right'
          : 'left'
        : ((block.alignment ?? 'left') as 'left' | 'right');

    lastAlignment = effective;
    return { ...block, alignment: effective } as T;
  });
}

interface ContentProps {
  blocks?: ContentBlock[] | null;
  lang: 'en' | 'de';
  classNames?: Record<
    | 'text'
    | 'textImage'
    | 'textVideo'
    | 'cards'
    | 'downloads'
    | 'features'
    | 'highlight'
    | 'contactForm',
    string
  >;
}

export function Content(props: ContentProps) {
  const { blocks, lang, classNames } = props;
  return (
    <>
      {resolveAutoAlignment(blocks ?? []).map((block) => {
        switch (block.blockType) {
          case 'text':
            return <Text key={block.id} block={block} className={classNames?.text} />;
          case 'text-image':
            return <TextImage key={block.id} block={block} className={classNames?.textImage} />;
          case 'highlight':
            return (
              <Highlight
                lang={lang}
                key={block.id}
                block={block}
                className={classNames?.highlight}
              />
            );
          case 'text-video':
            return <TextVideo key={block.id} block={block} className={classNames?.textVideo} />;
          case 'contact-form':
            return <ContactForm key={block.id} className={classNames?.contactForm} to={block.to} />;
          case 'features':
            return <Features features={block} key={block.id} className={classNames?.features} />;
          case 'downloads':
            return <Downloads key={block.id} docs={block.docs} className={classNames?.downloads} />;
          case 'cards':
            return (
              <CardsGrid key={block.id} lang={lang} block={block} className={classNames?.cards} />
            );
          default:
            console.error('Unknown block type:', (block as { blockType: string })?.blockType);
            return null;
        }
      })}
    </>
  );
}
