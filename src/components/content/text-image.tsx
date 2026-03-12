import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import type { Media } from '@/payload-types';
import ExpandImage from '../partials/expand-image';
import RichTextWrapper from './richtext-wrapper';

interface TextImageProps {
  text: SerializedEditorState<SerializedLexicalNode>;
  image: Media;
}

const TextImage = ({ text, image }: TextImageProps) => {
  return (
    <section className="grid grid-cols-12 gap-4 my-4">
      <aside className="container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <ExpandImage image={image} alt={image.alt} expandable />
      </aside>
      <div className="col-span-12 lg:col-span-7 xl:col-span-8">
        <RichTextWrapper text={text} />
      </div>
    </section>
  );
};
export default TextImage;
