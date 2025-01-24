import type { Media } from '@/payload-types';
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import ExpandImage from '../partials/expand-image';
import RichTextWrapper from './richtext-wrapper';
import { Fragment } from 'react';

interface TextImageProps {
  text: SerializedEditorState<SerializedLexicalNode>;
  image: Media;
}

const TextImage = ({ text, image }: TextImageProps) => {
  return (
    <Fragment key="text-image">
      <aside className="container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <ExpandImage image={image} alt={image.alt} expandable />
      </aside>
      <section className="col-span-12 lg:col-span-7 lg:col-start-6 xl:col-span-8 xl:col-start-5">
        <RichTextWrapper text={text} />
      </section>
    </Fragment>
  );
};
export default TextImage;
