import { cn } from '@heroui/react';
import type { Text as IText } from '@/payload-types';
import RichTextWrapper from './richtext-wrapper';

export default function Text(text: IText) {
  return (
    <section className="grid grid-cols-12 gap-8 my-12 first-of-type:mt-4">
      <aside
        className={cn(
          !text.text_right && 'hatching hidden lg:block opacity-50 rounded-3xl',
          text.text_right && 'col-span-12',
          text.alignment === 'right' && 'order-2 hatching-reverse',
          'lg:col-span-5 xl:col-span-4',
        )}
      >
        {text.text_right && <RichTextWrapper text={text.text_right} />}
      </aside>
      <div
        className={cn(
          'col-span-12 lg:col-span-7 xl:col-span-8',
          text.alignment === 'right' && 'order-1',
        )}
      >
        <RichTextWrapper text={text.text} />
      </div>
    </section>
  );
}
