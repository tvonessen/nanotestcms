import { lexicalHTML } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const TextVideo: Block = {
  slug: 'text-video',
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
    lexicalHTML('text', { name: 'text_html' }),
  ],
};
