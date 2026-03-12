import type { Block } from 'payload';
import { alignmentField } from '@/fields/alignmentField';

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
    alignmentField(),
  ],
};
