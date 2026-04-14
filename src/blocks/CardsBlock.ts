import type { Block } from 'payload';
import { linkField } from '@/fields/linkField';
import { solutionTypeField } from '@/fields/solutionTypeField';

export const Cards: Block = {
  slug: 'cards',
  interfaceName: 'Cards',
  labels: {
    singular: 'Cards',
    plural: 'Cards',
  },
  fields: [
    {
      name: 'source',
      label: { de: 'Quelle', en: 'Source' },
      type: 'select',
      admin: {
        description: {
          en: "Pick the source for the cards. 'Solutions' lets you pick individual solutions. 'Solution category' displays all solutions in a category. 'Manual' lets you define each card's title, image, and link yourself.",
          de: "Wählen Sie die Quelle für die Karten aus. 'Solutions' erlaubt die Auswahl einzelner Lösungen. 'Solution category' zeigt alle Lösungen einer Kategorie. 'Manuell' ermöglicht es, Titel, Bild und Link jeder Karte selbst zu definieren.",
        },
      },
      options: [
        { value: 'solutions', label: 'Solutions' },
        { value: 'category', label: 'Solution category' },
        { value: 'manual', label: 'Manual cards' },
      ],
    },
    {
      name: 'solutionsFields',
      label: false,
      type: 'group',
      admin: {
        condition: (_data, siblingData) => siblingData.source === 'solutions',
      },
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, localized: true },
        { name: 'paragraph', label: 'Paragraph', type: 'richText', localized: true },
        {
          name: 'cards',
          label: 'Cards',
          type: 'relationship',
          relationTo: 'solutions',
          hasMany: true,
          required: true,
        },
      ],
    },
    {
      name: 'categoryFields',
      type: 'group',
      label: false,
      admin: { condition: (_data, siblingData) => siblingData.source === 'category' },
      fields: [
        {
          name: 'category',
          label: 'Solution category',
          type: 'relationship',
          relationTo: 'solution-categories',
          required: true,
        },
        solutionTypeField({
          name: 'types',
          required: true,
          hasMany: true,
        }),
        {
          name: 'count',
          label: 'Selected Solutions',
          type: 'text',
          admin: {
            readOnly: true,
            placeholder: '/ Pick category and types first /',
          },
          hooks: {
            afterChange: [
              async ({ draft, siblingData, req }) => {
                if (
                  !siblingData?.types ||
                  siblingData?.types.length === 0 ||
                  !siblingData?.category
                ) {
                  return '';
                } else {
                  const solutions = await req.payload
                    .find({
                      collection: 'solutions',
                      draft,
                      where: {
                        'category.value': { contains: siblingData.category },
                        type: { in: siblingData.types },
                      },
                      pagination: false,
                    })
                    .then((res) => res.docs.map((doc) => `[${doc.title}]`));
                  return solutions.join(' ') || 'No solutions found with the selected filters';
                }
              },
            ],
          },
        },
      ],
    },
    {
      name: 'manualFields',
      label: false,
      type: 'group',
      admin: { condition: (_data, siblingData) => siblingData.source === 'manual' },
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, localized: true },
        { name: 'paragraph', label: 'Paragraph', type: 'richText', localized: true },
        {
          name: 'cards',
          label: 'Cards',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            { name: 'title', label: 'Title', type: 'text', required: true, localized: true },
            { name: 'description', label: 'Description', type: 'richText', localized: true },
            {
              name: 'image',
              label: 'Background image',
              type: 'upload',
              relationTo: 'media' as never,
              required: true,
              displayPreview: true,
            },
            linkField({ appearances: false }),
          ],
        },
      ],
    },
  ],
};
