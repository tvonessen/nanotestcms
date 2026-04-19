import type { GlobalConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { revalidateHook } from '@/utils/revalidate';

export const LegalContent: GlobalConfig = {
  slug: 'legal',
  label: 'Legal',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    max: 50,
  },
  admin: {
    // LegalContent covers two sub-pages; livePreview defaults to imprint.
    // Switch the URL manually in the browser to preview /privacy instead.
    livePreview: {
      url: ({ locale }) => {
        const redirect = `/${locale?.code ?? 'en'}/about/imprint`;
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
      name: 'imprint',
      label: 'Imprint',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage, ContactForm],
    },
    {
      name: 'privacy',
      label: 'Privacy',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage, ContactForm],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        await revalidateHook('/about/imprint', req.locale);
        await revalidateHook('/about/privacy', req.locale);
      },
    ],
  },
};
