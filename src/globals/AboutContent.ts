import type { GlobalConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import { revalidateHook } from '@/utils/revalidate';

export const AboutContent: GlobalConfig = {
  slug: 'about',
  label: 'About',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    max: 50,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const redirect = `/${locale?.code ?? 'en'}/about`;
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/draft?redirect=${redirect}`;
      },
    },
  },
  access: {
    read: isPublishedOrLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage, TextVideo, Cards, ContactForm],
    },
    {
      name: 'teamMembers',
      label: 'Team Members',
      type: 'relationship',
      relationTo: 'team-member',
      hasMany: true,
    },
    {
      name: 'content_bottom',
      label: 'Content',
      type: 'blocks',
      minRows: 0,
      blocks: [Text, TextImage, TextVideo, Cards, ContactForm],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        revalidateHook(`${req.locale}/about`);
      },
    ],
  },
};
