import type { Block } from 'payload';
import { linkField } from '@/fields/linkField';

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
      localized: true,
    },
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      required: true,
      localized: true,
    },
    linkField({ appearances: false }),
    {
      name: 'variant',
      label: 'Variant',
      type: 'select',
      defaultValue: 'primary',
      admin: {
        isClearable: false,
      },
      options: [
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
      ],
    },
  ],
};
