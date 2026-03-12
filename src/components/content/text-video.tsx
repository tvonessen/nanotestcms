import { cn } from '@heroui/react';
import type { TextVideo as ITextVideo } from '@/payload-types';
import RichTextWrapper from './richtext-wrapper';

const TextVideo = (props: ITextVideo) => {
  return (
    <section className="grid grid-cols-12 gap-4 my-12">
      <aside
        className={cn(
          'container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4',
          props.alignment === 'right' && 'order-2',
        )}
      >
        <iframe
          title={`YouTube video ${props.videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${props.videoId}?enablejsapi=1&rel=0&cc_load_policy=1&color=white`}
          className="w-full aspect-video rounded-lg shadow-md"
          allowFullScreen
        />
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

export default TextVideo;
