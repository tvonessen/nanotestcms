import type { Block } from 'payload';
import { linkField } from '@/fields/linkField';

export const Highlight: Block = {
  slug: 'highlight',
  interfaceName: 'Highlight',
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
    {
      name: 'action',
      label: 'Action',
      type: 'select',
      defaultValue: 'link',
      admin: {
        isClearable: false,
      },
      options: ['link', 'download', 'none'],
    },
    {
      name: 'download',
      label: 'Document download',
      type: 'upload',
      relationTo: 'documents',
      hasMany: false,
      required: true,
      admin: {
        condition: (_data, siblingData) => siblingData?.action === 'download',
      },
    },
    linkField({
      appearances: false,
      overrides: { admin: { condition: (_data, siblingData) => siblingData?.action === 'link' } },
    }),
    {
      name: 'variant',
      label: 'Variant',
      type: 'select',
      defaultValue: 'primary',
      admin: {
        isClearable: false,
      },
      options: ['primary', 'secondary', 'warning', 'danger'],
    },
  ],
};
