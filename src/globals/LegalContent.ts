import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import type { GlobalConfig } from 'payload';

export const LegalContent: GlobalConfig = {
  slug: 'legal',
  label: 'Legal',
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
      schedulePublish: true,
    },
    max: 5,
  },
  admin: {},
  access: {
    read: publishedOrLoggedIn,
    readDrafts: isLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'imprint',
      label: 'Imprint',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage],
    },
    {
      name: 'privacy',
      label: 'Privacy',
      type: 'blocks',
      minRows: 1,
      blocks: [Text, TextImage],
    },
  ],
};
