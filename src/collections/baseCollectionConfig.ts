import type { CollectionConfig, Field } from 'payload';
import { de } from 'payload/i18n/de';

export const baseCollectionConfig: { fields: Field[] } & Partial<CollectionConfig> = {
  fields: [
    {
      name: 'meta',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          admin: {
            placeholder: 'Save to auto-generate',
          },
        },
        {
          name: 'published',
          label: {
            de: 'Veröffentlicht',
            en: 'Published',
          },
          type: 'checkbox',
        },
        {
          name: 'publishStart',
          label: {
            de: 'Veröffentlichung starten',
            en: 'Start publishing on',
          },
          type: 'date',
        },
        {
          name: 'publishStop',
          label: {
            de: 'Veröffentlichung stoppen',
            en: 'Stop publishing on',
          },
          type: 'date',
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) throw new Error('Data is required');
        if (data.meta.slug) return data;
        return {
          ...data,
          meta: { ...data.meta, slug: data[0].toLowerCase().replace(/ /g, '-') },
        };
      },
    ],
  },
};
