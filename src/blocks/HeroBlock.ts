import type { Block } from 'payload';

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'Hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'images',
      label: 'Images',
      type: 'upload',
      relationTo: 'media' as never,
      hasMany: true,
      required: true,
      displayPreview: true,
      filterOptions: {
        or: [{ tags: { contains: 'solution' } }, { tags: { contains: 'service' } }],
      },
    },
    {
      name: 'showCaption',
      label: { de: 'Bildbeschreibung anzeigen', en: 'Show caption' },
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
