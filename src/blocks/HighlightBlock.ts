import { lexicalHTML } from '@payloadcms/richtext-lexical';
import { Block } from 'payload';

export const Highlight: Block = {
  slug: 'highlight',
  labels: {
    singular: 'Highlight',
    plural: 'Highlights',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'link',
      label: 'Link',
      type: 'text',
      required: true,
    },
  ],
};
