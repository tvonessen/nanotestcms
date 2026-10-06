import { cn } from '@heroui/react';
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
import type { Solution } from '@/payload-types';

interface RichTextWrapperProps {
  text: SerializedEditorState<SerializedLexicalNode>;
  className?: string;
  lang?: string;
}

export default function RichTextWrapper({ text, className, lang = 'en' }: RichTextWrapperProps) {
  const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
    const doc = linkNode.fields.doc;
    if (!doc) return linkNode.fields.url ?? '#';

    const { value, relationTo } = doc;
    if (typeof value !== 'object' || !value) return linkNode.fields.url ?? '#';

    if (relationTo === 'solutions') {
      const solution = value as unknown as Solution;
      return `/${lang}/nt/${solution.slug}`;
    }
    const slug = typeof value.slug === 'string' ? value.slug : value.id;
    return relationTo === 'pages'
      ? `/${lang}${slug.startsWith('/') ? slug : `/${slug}`}`
      : `/${lang}/${relationTo}/${slug}`;
  };

  const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
    defaultConverters,
  }: {
    defaultConverters: JSXConverters<DefaultNodeTypes>;
  }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
  });

  return <RichText className={cn('rich-text', className)} data={text} converters={jsxConverters} />;
}
