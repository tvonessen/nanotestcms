import type { GlobalConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Downloads } from '@/blocks/DownloadsBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { buildDraftPreviewURL } from '@/utils/public-url';
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
        return buildDraftPreviewURL(redirect);
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
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Imprint', de: 'Impressum' },
          fields: [
            {
              name: 'imprint',
              label: { en: 'Imprint', de: 'Impressum' },
              type: 'blocks',
              minRows: 1,
              blocks: [Text, TextImage, ContactForm, Downloads],
            },
          ],
        },
        {
          label: { en: 'Privacy', de: 'Datenschutz' },
          fields: [
            {
              name: 'privacy',
              label: { en: 'Privacy', de: 'Datenschutz' },
              type: 'blocks',
              minRows: 1,
              blocks: [Text, TextImage, ContactForm, Downloads],
            },
          ],
        },
        {
          label: {
            en: 'Terms',
            de: 'AGBs',
          },
          fields: [
            {
              name: 'terms',
              label: { en: 'Terms', de: 'AGBs' },
              type: 'blocks',
              minRows: 1,
              blocks: [Text, TextImage, ContactForm, Downloads],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        await revalidateHook('/about/imprint', req.locale);
        await revalidateHook('/about/privacy', req.locale);
        await revalidateHook('/about/terms', req.locale);
      },
    ],
  },
};
