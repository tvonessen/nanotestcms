import { lexicalHTML } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const Text: Block = {
  slug: 'text',
  labels: {
    singular: 'Text',
    plural: 'Texts',
  },
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      localized: true,
      required: true,
    },
    lexicalHTML('text', { name: 'text_html' }),
  ],
};
