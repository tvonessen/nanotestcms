import { cn } from '@heroui/react';
import type { TextImage as ITextImage, Media } from '@/payload-types';
import ExpandImage from '../partials/expand-image';
import RichTextWrapper from './richtext-wrapper';

const TextImage = (props: ITextImage) => {
  const image = props.image as Media;
  return (
    <section className="grid grid-cols-12 gap-4 my-12">
      <aside
        className={cn(
          'container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4',
          props.alignment === 'right' && 'order-2',
        )}
      >
        <ExpandImage image={image} alt={image.alt} expandable />
      </aside>
      <div
        className={cn(
          'col-span-12 lg:col-span-7 xl:col-span-8',
          props.alignment === 'right' && 'order-1',
        )}
      >
        <RichTextWrapper text={props.text} />
      </div>
    </section>
  );
};
export default TextImage;
