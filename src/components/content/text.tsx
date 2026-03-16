import { cn } from '@heroui/react';
import type { Text as IText } from '@/payload-types';
import RichTextWrapper from './richtext-wrapper';

interface TextProps {
  block: IText;
  className?: string;
}

export default function Text(props: TextProps) {
  const { block, className } = props;
  return (
    <section className={cn('grid grid-cols-12 gap-8 my-12 first-of-type:mt-4', className)}>
      <aside
        className={cn(
          !block.text_right && 'hatching hidden lg:block opacity-50 rounded-3xl',
          block.text_right && 'col-span-12',
          block.alignment === 'right' && 'lg:order-2 hatching-reverse',
          'lg:col-span-5 xl:col-span-4',
        )}
      >
        {block.text_right && <RichTextWrapper text={block.text_right} />}
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
}
