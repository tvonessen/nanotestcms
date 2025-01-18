import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import RichTextWrapper from './RichTextWrapper';

const Text = ({ text }: { text: SerializedEditorState<SerializedLexicalNode> }) => {
  return (
    <section className="col-span-12 lg:col-start-6 lg:col-span-7 xl:col-start-5 xl:col-span-8">
      <RichTextWrapper text={text} />
    </section>
  );
};

export default Text;
