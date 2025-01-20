import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical';
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import {
  type JSXConverters,
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from '@payloadcms/richtext-lexical/react';

import '@/styles/richText.scss';

export default function RichTextWrapper({
  text,
}: { text: SerializedEditorState<SerializedLexicalNode> }) {
  const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    if (!linkNode.fields.doc) {
      throw new Error('Expected linkNode.fields.doc to be defined');
    }
    const { value, relationTo } = linkNode.fields.doc;
    if (typeof value !== 'object') {
      throw new Error('Expected value to be an object');
    }
    const slug = value.slug;
    return `/${relationTo}/${slug}`;
  };

  const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
    defaultConverters,
  }: { defaultConverters: JSXConverters<DefaultNodeTypes> }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
  });

  return <RichText className="rich-text" data={text} converters={jsxConverters} />;
}
