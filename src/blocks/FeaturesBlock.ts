import { iconField } from '@/fields/iconField';
import type { Block } from 'payload';

export const Features: Block = {
  slug: 'features',
  interfaceName: 'Features',
  labels: {
    singular: 'Features',
    plural: 'Features',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'features',
      label: 'Features',
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          hasMany: false,
        },
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
          localized: true,
        },
        iconField(),
      ],
    },
  ],
};
