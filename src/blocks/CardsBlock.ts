import type { Block } from 'payload';

export const Cards: Block = {
  slug: 'cards',
  interfaceName: 'Cards',
  labels: {
    singular: 'Product Cards',
    plural: 'Product Cards',
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, localized: true, },
    { name: 'paragraph', label: 'Paragraph', type: 'richText', localized: true, },
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
