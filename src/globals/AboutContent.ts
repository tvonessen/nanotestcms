import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { TeamMember } from '@/blocks/TeamMemberBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import type { About } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';
import type { GlobalConfig } from 'payload';

export const AboutContent: GlobalConfig = {
  slug: 'about',
  label: 'About',
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
      schedulePublish: true,
    },
    max: 5,
  },
  admin: {
    livePreview: {
      url: () => `${process.env.NEXT_PUBLIC_SERVER_URL}/about`,
    },
  },
  access: {
    read: publishedOrLoggedIn,
    readDrafts: isLoggedIn,
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
      type: 'blocks',
      admin: {
        initCollapsed: true,
      },
      blocks: [TeamMember],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }: { doc: About }) => {
        if (doc._status === 'draft') return;
        revalidateHook('/about');
      },
    ],
  },
};
