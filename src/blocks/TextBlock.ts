import { lexicalHTML } from '@payloadcms/richtext-lexical';
import { Block } from 'payload';

export const Text: Block = {
  slug: 'text',
  labels: {
    singular: 'Text Block',
    plural: 'Text Blocks',
  },
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      required: true,
    },
    lexicalHTML('text', { name: 'text_html' }),
  ],
};
