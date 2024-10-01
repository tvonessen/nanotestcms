import { lexicalHTML } from '@payloadcms/richtext-lexical';
import { Block } from 'payload';

export const TextImage: Block = {
  slug: 'text-image',
  labels: {
    singular: 'Text Image Block',
    plural: 'Text Image Blocks',
  },
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    lexicalHTML('text', { name: 'text_html' }),
  ],
};
