import type { Block } from 'payload';
import { alignmentField } from '@/fields/alignmentField';

export const TextImage: Block = {
  slug: 'text-image',
  interfaceName: 'TextImage',
  labels: {
    singular: 'Text and image',
    plural: 'Texts and images',
  },
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      localized: true,
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
    alignmentField(),
  ],
};
