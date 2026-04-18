import type { Block } from 'payload';
import { linkField } from '@/fields/linkField';

export const Cards: Block = {
  slug: 'cards',
  interfaceName: 'Cards',
  labels: {
    singular: 'Cards',
    plural: 'Cards',
  },
  fields: [
    {
      name: 'useCategoryTitle',
      label: { en: 'Use solution category as title', de: 'Lösungskategorie als Titel verwenden' },
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      localized: true,
      admin: {
        condition: (_data, siblingData) => !siblingData.useCategoryTitle,
      },
    },
    {
      name: 'titleCategory',
      label: { en: 'Solution category', de: 'Lösungskategorie' },
      type: 'relationship',
      relationTo: 'solution-categories',
      required: true,
      admin: {
        condition: (_data, siblingData) => !!siblingData.useCategoryTitle,
      },
    },
    { name: 'paragraph', label: 'Paragraph', type: 'richText', localized: true },
    {
      name: 'cards',
      label: 'Cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'source',
          label: { de: 'Quelle', en: 'Source' },
          type: 'select',
          required: true,
          defaultValue: 'solution',
          admin: {
            isClearable: false,
            description: {
              en: "Pick 'Solution' to link an existing solution, or 'Manual' to define the card content yourself.",
              de: "Wählen Sie 'Solution', um eine bestehende Lösung zu verknüpfen, oder 'Manuell', um den Karteninhalt selbst zu definieren.",
            },
          },
          options: [
            { value: 'solution', label: 'Solution' },
            { value: 'manual', label: 'Manual' },
          ],
        },
        {
          name: 'solution',
          label: 'Solution',
          type: 'relationship',
          relationTo: 'solutions',
          required: true,
          admin: {
            condition: (_data, siblingData) => siblingData.source === 'solution',
          },
        },
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            condition: (_data, siblingData) => siblingData.source === 'manual',
          },
        },
        {
          name: 'subtitle',
          label: { en: 'Subtitle', de: 'Untertitel' },
          type: 'text',
          localized: true,
          admin: {
            condition: (_data, siblingData) => siblingData.source === 'manual',
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'richText',
          localized: true,
          admin: {
            condition: (_data, siblingData) => siblingData.source === 'manual',
          },
        },
        {
          name: 'image',
          label: 'Background image',
          type: 'upload',
          relationTo: 'media' as never,
          required: true,
          displayPreview: true,
          admin: {
            condition: (_data, siblingData) => siblingData.source === 'manual',
          },
        },
        linkField({
          appearances: false,
          overrides: {
            admin: {
              condition: (_data, siblingData) => siblingData.source === 'manual',
            },
          },
        }),
      ],
    },
  ],
};
