import { Cards } from '@/blocks/CardsBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { GlobalConfig } from 'payload';

export const HomepageContent: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  fields: [
    {
      name: 'jumbotron',
      label: 'Jumbotron',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'link',
              label: 'Link',
              type: 'text',
              required: true,
            },
            {
              name: 'linkLabel',
              label: 'Link label',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, Highlight, Cards],
    },
  ],
};
