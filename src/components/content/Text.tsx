import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import RichTextWrapper from './RichTextWrapper';

import '@/styles/text.scss';

const Text = ({ text }: { text: SerializedEditorState<SerializedLexicalNode> }) => {
  return (
    <>
      <aside className="hidden lg:block col-span-5 xl:col-span-4 opacity-25 rounded-3xl">
        <div className="h-full bg-gradient-to-l from-transparent to-background" />
      </aside>
      <section className="col-span-12 lg:col-start-6 lg:col-span-7 xl:col-start-5 xl:col-span-8">
        <RichTextWrapper text={text} />
      </section>
    </>
  );
};

export default Text;
