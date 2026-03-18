import type { Block } from 'payload';
import { iconField } from '@/fields/iconField';

export const Features: Block = {
  slug: 'features',
  interfaceName: 'Features',
  labels: {
    singular: 'Features',
    plural: 'Features',
  },
  fields: [
    {
      name: 'size',
      label: { en: 'Größe', de: 'Size' },
      type: 'select',
      options: [
        { label: { en: 'Full', de: 'Voll' }, value: 'full' },
        { label: { en: 'Compact', de: 'Kompakt' }, value: 'compact' },
      ],
      defaultValue: 'full',
      admin: {
        isClearable: false,
      },
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'features',
      label: 'Features',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          hasMany: false,
          admin: {
            condition: (_data, _siblingData, ctx) => ctx.blockData.size === 'full',
          },
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
          type: 'richText',
          required: false,
          localized: true,
          admin: { condition: (_data, _siblingData, ctx) => ctx.blockData.size === 'full' },
        },
        iconField(),
      ],
    },
  ],
};
