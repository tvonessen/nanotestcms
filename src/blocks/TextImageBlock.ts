import { lexicalHTML } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const TextImage: Block = {
  slug: 'text-image',
  labels: {
    singular: 'Text and image',
    plural: 'Texts and images',
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
      hasMany: false,
      required: true,
    },
    lexicalHTML('text', { name: 'text_html' }),
  ],
};
