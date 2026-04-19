import type { GlobalConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { linkField } from '@/fields/linkField';
import { revalidateHook } from '@/utils/revalidate';

export const HomepageContent: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: isPublishedOrLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const redirect = `/${locale?.code ?? 'en'}`;
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/draft?redirect=${redirect}`;
      },
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
          fields: [linkField()],
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
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        await revalidateHook('/', req.locale);
      },
    ],
  },
};
