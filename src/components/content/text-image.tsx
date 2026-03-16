import { cn } from '@heroui/react';
import type { TextImage as ITextImage, Media } from '@/payload-types';
import ExpandImage from '../partials/expand-image';
import RichTextWrapper from './richtext-wrapper';

interface TextImageProps {
  block: ITextImage;
  className?: string;
}

const TextImage = (props: TextImageProps) => {
  const { className, block } = props;
  const image = block.image as Media;
  return (
    <section className={cn('grid grid-cols-12 gap-8 my-12 first-of-type:mt-4', className)}>
      <aside
        className={cn(
          'container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4',
          block.alignment === 'right' && 'lg:order-2',
        )}
      >
        <ExpandImage image={image} alt={image.alt} expandable />
      </aside>
      <div
        className={cn(
          'col-span-12 lg:col-span-7 xl:col-span-8',
          block.alignment === 'right' && 'lg:order-1',
        )}
      >
        <RichTextWrapper text={block.text} />
      </div>
    </section>
  );
};
export default TextImage;
