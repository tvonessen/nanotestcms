import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import type { Homepage } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';
import type { GlobalConfig } from 'payload';

export const HomepageContent: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: isPublishedOrLoggedIn,
    readDrafts: isLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  admin: {
    livePreview: {
      url: () =>
        `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SERVER_URL : process.env.NEXT_DEV_SERVER_URL}`,
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
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
          localized: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          required: true,
          localized: true,
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
              localized: true,
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
      blocks: [Text, Highlight, Cards, Features, ContactForm],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }: { doc: Homepage }) => {
        if (doc._status === 'draft') return;
        revalidateHook('/');
      },
    ],
  },
};
