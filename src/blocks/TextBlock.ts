import type { Block } from 'payload';

export const Text: Block = {
  slug: 'text',
  interfaceName: 'Text',
  labels: {
    singular: 'Text',
    plural: 'Texts',
  },
  fields: [
    {
      name: 'text',
      label: 'Text (main)',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'text_right',
      label: 'Text Right (aside)',
      type: 'richText',
      localized: true,
      required: false,
    },
  ],
};
