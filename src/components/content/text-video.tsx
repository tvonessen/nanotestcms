import { cn } from '@heroui/react';
import type { TextVideo as ITextVideo } from '@/payload-types';
import RichTextWrapper from './richtext-wrapper';

interface TextVideoProps {
  block: ITextVideo;
  className?: string;
}

const TextVideo = (props: TextVideoProps) => {
  const { className, block } = props;
  return (
    <section className={cn('grid grid-cols-12 gap-4 md:gap-8 my-12 first-of-type:mt-4', className)}>
      <aside
        className={cn(
          'container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4',
          block.alignment === 'right' && 'lg:order-2',
        )}
      >
        <iframe
          title={`YouTube video ${block.videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${block.videoId}?enablejsapi=1&rel=0&cc_load_policy=1&color=white`}
          className="w-full aspect-video rounded-lg shadow-md"
          allowFullScreen
        />
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

export default TextVideo;
