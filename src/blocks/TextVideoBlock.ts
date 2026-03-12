import type { Block } from 'payload';
import { alignmentField } from '@/fields/alignmentField';

export const TextVideo: Block = {
  slug: 'text-video',
  interfaceName: 'TextVideo',
  labels: {
    singular: 'Text and video',
    plural: 'Texts and videos',
  },
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'videoId',
      label: 'Video-ID',
      type: 'text',
      required: true,
    },
    alignmentField(),
  ],
};
