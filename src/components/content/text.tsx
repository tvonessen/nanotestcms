import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import RichTextWrapper from './richtext-wrapper';

import '@/styles/text.scss';
import { Fragment } from 'react';

const Text = ({ text }: { text: SerializedEditorState<SerializedLexicalNode> }) => {
  return (
    <Fragment key="text">
      <aside className="hidden lg:block col-span-5 xl:col-span-4 opacity-25 rounded-3xl">
        <div className="h-full bg-gradient-to-l from-transparent to-background" />
      </aside>
      <section className="col-span-12 lg:col-start-6 lg:col-span-7 xl:col-start-5 xl:col-span-8">
        <RichTextWrapper text={text} />
      </section>
    </Fragment>
  );
};

export default Text;
