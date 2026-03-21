import type { Block } from 'payload';
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
          en: "Pick the source for the cards. If you pick 'Solutions', you can select individual solutions to display. If you pick 'Solution category', you can select a solution category, and all solutions in that category will be displayed.",
          de: "Wählen Sie die Quelle für die Karten aus. Wenn Sie 'Solutions' auswählen, können Sie einzelne Lösungen auswählen, die angezeigt werden sollen. Wenn Sie 'Solution category' auswählen, können Sie eine Lösungskategorie auswählen, und alle Lösungen in dieser Kategorie werden angezeigt.",
        },
      },
      options: [
        { value: 'solutions', label: 'Solutions' },
        { value: 'category', label: 'Solution category' },
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
  ],
};
