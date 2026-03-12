import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import RichTextWrapper from './richtext-wrapper';

interface TextVideoProps {
  text: SerializedEditorState<SerializedLexicalNode>;
  videoId: string;
}

const TextVideo = ({ text, videoId }: TextVideoProps) => {
  return (
    <section className="grid grid-cols-12 gap-4 my-4">
      <aside className="container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <iframe
          title={`YouTube video ${videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&cc_load_policy=1&color=white`}
          className="w-full aspect-video rounded-lg shadow-md"
          allowFullScreen
        />
      </aside>
      <div className="col-span-12 lg:col-span-7 xl:col-span-8">
        <RichTextWrapper text={text} />
      </div>
    </section>
  );
};

export default TextVideo;
