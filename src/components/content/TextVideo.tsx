import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import RichTextWrapper from './RichTextWrapper';
import { Fragment } from 'react';

interface TextVideoProps {
  text: SerializedEditorState<SerializedLexicalNode>;
  videoId: string;
}

const TextVideo = ({ text, videoId }: TextVideoProps) => {
  return (
    <Fragment key="text-video">
      <aside className="container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <iframe
          title={`YouTube video ${videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&cc_load_policy=1&color=white`}
          className="w-full aspect-video rounded-lg shadow-md"
          allowFullScreen
        />
      </aside>
      <section className="col-span-12 lg:col-span-7 lg:col-start-6 xl:col-span-8 xl:col-start-5">
        <RichTextWrapper text={text} />
      </section>
    </Fragment>
  );
};

export default TextVideo;
