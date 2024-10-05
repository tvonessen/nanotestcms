import { Block } from 'payload';
import { title } from 'process';

export const Cards: Block = {
  slug: 'cards',
  labels: {
    singular: 'Product Cards',
    plural: 'Product Cards',
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text' },
    {
      name: 'cards',
      label: 'Cards',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      required: true,
    },
  ],
};
