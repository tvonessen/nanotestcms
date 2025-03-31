import type { Block } from 'payload';

export const Downloads: Block = {
  slug: 'downloads',
  interfaceName: 'Downloads',
  labels: {
    singular: 'Downloads',
    plural: 'Downloads',
  },
  fields: [
    {
      name: 'docs',
      label: 'Documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      required: true,
    },
  ],
};
