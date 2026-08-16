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
      name: 'title',
      label: { de: 'Titel', en: 'Title' },
      type: 'text',
      defaultValue: 'Downloads',
      localized: true,
    },
    {
      name: 'description',
      label: { de: 'Beschreibung', en: 'Description' },
      type: 'richText',
      required: false,
      localized: true,
    },
    {
      name: 'docs',
      label: { de: 'Dokumente', en: 'Documents' },
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      required: true,
    },
  ],
};
