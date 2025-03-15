import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import type { ContactUs } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';
import type { GlobalConfig, Tab } from 'payload';

export const ContactUsContent: GlobalConfig = {
  slug: 'contact-us',
  label: 'Contact Us',
  access: {
    read: isPublishedOrLoggedIn,
    readDrafts: isLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 10,
  },
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      blocks: [Text, TextImage, TextVideo, ContactForm],
    },
    {
      label: 'Regions',
      type: 'tabs',
      tabs: [
        { key: 'europe', label: 'Europe' },
        { key: 'america', label: 'North and South America' },
        { key: 'asia', label: 'Asia and Australia' },
        { key: 'africa', label: 'Africa and Middle East' },
      ].map(
        (region): Tab => ({
          name: region.key,
          label: region.label,
          fields: [
            {
              name: 'contacts',
              label: 'Contacts and distribution partners',
              type: 'array',
              admin: {
                initCollapsed: true,
              },
              fields: [
                { name: 'country', label: 'Country', type: 'text', required: true },
                {
                  name: 'contact',
                  label: 'Contact',
                  type: 'relationship',
                  required: true,
                  relationTo: ['distro-partner', 'team-member'],
                },
              ],
            },
          ],
        }),
      ),
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }: { doc: ContactUs }) => {
        if (doc._status === 'draft') return;
        revalidateHook('/');
      },
    ],
  },
};
