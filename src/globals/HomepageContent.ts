import { isAdmin } from '@/app/(payload)/access/isAdmin';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import type { GlobalConfig } from 'payload';

export const HomepageContent: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: publishedOrLoggedIn,
    readDrafts: isLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  admin: {
    livePreview: {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    },
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    max: 50,
  },
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
